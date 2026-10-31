-- ============================================================================
-- 02_GAME_SESSIONS.SQL
-- Real-time Game Engine: Sessions, Readiness, Locked Answers & Simultaneous Reveal
-- ============================================================================

-- ============================================================================
-- 1. GAME_SESSIONS TABLE
-- Tracks active multiplayer sessions, readiness of both partners, and level progress
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL CHECK (game_type IN ('this_or_that', 'know_me', 'truth_or_dare')),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed', 'abandoned')),
  partner_1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  partner_2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  partner_1_ready BOOLEAN NOT NULL DEFAULT FALSE,
  partner_2_ready BOOLEAN NOT NULL DEFAULT FALSE,
  current_level INT NOT NULL DEFAULT 1 CHECK (current_level >= 1 AND current_level <= 60),
  current_stage INT NOT NULL DEFAULT 1 CHECK (current_stage >= 1 AND current_stage <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  abandoned_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sessions_couple ON public.game_sessions(couple_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.game_sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_game_type ON public.game_sessions(game_type);

-- ============================================================================
-- 2. SESSION_ANSWERS TABLE
-- Stores locked answers per level per partner.
-- Enforces: 1 answer per question per user (no double voting, no skipping).
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.session_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  level_number INT NOT NULL CHECK (level_number >= 1 AND level_number <= 60),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  answer JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_answer_per_level_per_user UNIQUE (session_id, level_number, user_id)
);

CREATE INDEX IF NOT EXISTS idx_answers_session_level ON public.session_answers(session_id, level_number);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- Strict privacy: Partners only access their own couple's sessions.
-- Answer privacy: A partner CANNOT see the other partner's answer
-- until BOTH partners have submitted their answer for that level!
-- ============================================================================
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_answers ENABLE ROW LEVEL SECURITY;

-- Sessions RLS
CREATE POLICY "Partners can view own game sessions"
ON public.game_sessions
FOR SELECT
USING (auth.uid() = partner_1_id OR auth.uid() = partner_2_id);

CREATE POLICY "Partners can update own game sessions"
ON public.game_sessions
FOR UPDATE
USING (auth.uid() = partner_1_id OR auth.uid() = partner_2_id);

-- Answers RLS
-- A user can see an answer IF:
-- 1) It is their own answer, OR
-- 2) Both partners have submitted an answer for this level (simultaneous reveal)
CREATE POLICY "Users can view answers after both submitted"
ON public.session_answers
FOR SELECT
USING (
  auth.uid() = user_id
  OR (
    -- Partner can see ONLY if both have answered this level
    (SELECT COUNT(*) FROM public.session_answers sa
     WHERE sa.session_id = public.session_answers.session_id
       AND sa.level_number = public.session_answers.level_number) >= 2
    AND EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = public.session_answers.session_id
        AND (gs.partner_1_id = auth.uid() OR gs.partner_2_id = auth.uid())
    )
  )
);

CREATE POLICY "Users can insert own answers"
ON public.session_answers
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.game_sessions gs
    WHERE gs.id = session_id
      AND gs.status = 'active'
      AND (gs.partner_1_id = auth.uid() OR gs.partner_2_id = auth.uid())
  )
);

-- ============================================================================
-- 4. SERVER-SIDE RPC FUNCTIONS FOR REALTIME MULTIPLAYER
-- ============================================================================

-- Function 1: Join or Create Lobby (Idempotent & Atomic)
-- Either partner joining sets their ready flag.
-- When both partners are ready, status automatically transitions to 'active'!
CREATE OR REPLACE FUNCTION public.join_or_create_lobby(p_game_type TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_couple RECORD;
  v_session RECORD;
  v_session_id UUID;
  v_is_p1 BOOLEAN;
  v_partner_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 1. Find user's active couple
  SELECT * INTO v_couple
  FROM public.couples
  WHERE status = 'active'
    AND (partner_1_id = v_user_id OR partner_2_id = v_user_id)
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'You must be in an active couple to play.';
  END IF;

  v_is_p1 := (v_couple.partner_1_id = v_user_id);
  v_partner_id := CASE WHEN v_is_p1 THEN v_couple.partner_2_id ELSE v_couple.partner_1_id END;

  -- 2. Find any active or waiting session for this couple & game
  SELECT * INTO v_session
  FROM public.game_sessions
  WHERE couple_id = v_couple.id
    AND game_type = p_game_type
    AND status IN ('waiting', 'active')
  ORDER BY created_at DESC
  LIMIT 1
  FOR UPDATE;

  IF FOUND THEN
    v_session_id := v_session.id;

    -- Update readiness for this user
    IF v_is_p1 THEN
      UPDATE public.game_sessions
      SET partner_1_ready = TRUE
      WHERE id = v_session_id;
    ELSE
      UPDATE public.game_sessions
      SET partner_2_ready = TRUE
      WHERE id = v_session_id;
    END IF;

    -- Re-fetch to check if BOTH are now ready
    SELECT * INTO v_session FROM public.game_sessions WHERE id = v_session_id;

    IF v_session.partner_1_ready AND v_session.partner_2_ready AND v_session.status = 'waiting' THEN
      UPDATE public.game_sessions
      SET status = 'active',
          started_at = NOW()
      WHERE id = v_session_id
      RETURNING * INTO v_session;
    END IF;

  ELSE
    -- Create new session with this partner marked ready
    INSERT INTO public.game_sessions (
      couple_id,
      game_type,
      status,
      partner_1_id,
      partner_2_id,
      partner_1_ready,
      partner_2_ready
    )
    VALUES (
      v_couple.id,
      p_game_type,
      'waiting',
      v_couple.partner_1_id,
      v_couple.partner_2_id,
      v_is_p1,
      NOT v_is_p1
    )
    RETURNING * INTO v_session;
    v_session_id := v_session.id;
  END IF;

  RETURN jsonb_build_object(
    'session_id', v_session.id,
    'game_type', v_session.game_type,
    'status', v_session.status,
    'partner_1_ready', v_session.partner_1_ready,
    'partner_2_ready', v_session.partner_2_ready,
    'current_level', v_session.current_level,
    'current_stage', v_session.current_stage,
    'is_partner_1', v_is_p1,
    'partner_id', v_partner_id
  );
END;
$$;

-- Function 2: Leave Lobby (Safely resets readiness)
CREATE OR REPLACE FUNCTION public.leave_lobby(p_session_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_session RECORD;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_session
  FROM public.game_sessions
  WHERE id = p_session_id
    AND (partner_1_id = v_user_id OR partner_2_id = v_user_id);

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  IF v_session.status = 'waiting' THEN
    IF v_session.partner_1_id = v_user_id THEN
      UPDATE public.game_sessions SET partner_1_ready = FALSE WHERE id = p_session_id;
    ELSE
      UPDATE public.game_sessions SET partner_2_ready = FALSE WHERE id = p_session_id;
    END IF;
  END IF;

  RETURN TRUE;
END;
$$;

-- Function 3: Submit Answer & Check Reveal Status
CREATE OR REPLACE FUNCTION public.submit_level_answer(
  p_session_id UUID,
  p_level_number INT,
  p_answer JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_session RECORD;
  v_total_answers INT;
  v_both_answered BOOLEAN;
  v_p1_answer JSONB;
  v_p2_answer JSONB;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_session
  FROM public.game_sessions
  WHERE id = p_session_id
    AND status = 'active'
    AND (partner_1_id = v_user_id OR partner_2_id = v_user_id);

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Session is not active or you are not a participant.';
  END IF;

  -- Insert answer (idempotent upsert so double clicks do not error)
  INSERT INTO public.session_answers (session_id, level_number, user_id, answer)
  VALUES (p_session_id, p_level_number, v_user_id, p_answer)
  ON CONFLICT (session_id, level_number, user_id)
  DO UPDATE SET answer = EXCLUDED.answer;

  -- Check count of answers for this level
  SELECT COUNT(*) INTO v_total_answers
  FROM public.session_answers
  WHERE session_id = p_session_id
    AND level_number = p_level_number;

  v_both_answered := (v_total_answers >= 2);

  -- Only reveal both if BOTH answered!
  IF v_both_answered THEN
    SELECT answer INTO v_p1_answer
    FROM public.session_answers
    WHERE session_id = p_session_id AND level_number = p_level_number AND user_id = v_session.partner_1_id;

    SELECT answer INTO v_p2_answer
    FROM public.session_answers
    WHERE session_id = p_session_id AND level_number = p_level_number AND user_id = v_session.partner_2_id;
  END IF;

  RETURN jsonb_build_object(
    'both_answered', v_both_answered,
    'my_answer', p_answer,
    'partner_1_answer', CASE WHEN v_both_answered THEN v_p1_answer ELSE NULL END,
    'partner_2_answer', CASE WHEN v_both_answered THEN v_p2_answer ELSE NULL END
  );
END;
$$;

-- Function 4: Advance to Next Level (Verified server-side only)
CREATE OR REPLACE FUNCTION public.advance_session_level(p_session_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_session RECORD;
  v_total_answers INT;
  v_next_level INT;
  v_next_stage INT;
  v_status TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_session
  FROM public.game_sessions
  WHERE id = p_session_id
    AND status = 'active'
    AND (partner_1_id = v_user_id OR partner_2_id = v_user_id)
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Session not found or not active';
  END IF;

  -- Verify BOTH partners submitted answers for current level
  SELECT COUNT(*) INTO v_total_answers
  FROM public.session_answers
  WHERE session_id = p_session_id
    AND level_number = v_session.current_level;

  IF v_total_answers < 2 THEN
    RAISE EXCEPTION 'Both partners must answer before advancing to the next question.';
  END IF;

  -- Advance level
  v_next_level := v_session.current_level + 1;
  v_next_stage := LEAST(5, ((v_next_level - 1) / 12) + 1);

  IF v_next_level > 60 THEN
    v_status := 'completed';
    UPDATE public.game_sessions
    SET status = 'completed',
        completed_at = NOW()
    WHERE id = p_session_id;
  ELSE
    v_status := 'active';
    UPDATE public.game_sessions
    SET current_level = v_next_level,
        current_stage = v_next_stage
    WHERE id = p_session_id;
  END IF;

  RETURN jsonb_build_object(
    'current_level', v_next_level,
    'current_stage', v_next_stage,
    'status', v_status
  );
END;
$$;
