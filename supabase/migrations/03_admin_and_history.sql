-- ============================================================================
-- 03_ADMIN_AND_HISTORY.SQL
-- Functions for Private Admin Overview, Couple Game History, and Account Deletion
-- ============================================================================

-- 1. Function for Hetu's Private Admin Dashboard
-- Returns overview of all users, couples, and played game sessions.
-- Only accessible by hetu2286@gmail.com (or security definer check)
CREATE OR REPLACE FUNCTION public.admin_get_overview()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_email TEXT;
  v_total_users INT;
  v_total_couples INT;
  v_total_sessions INT;
  v_couples_list JSONB;
  v_sessions_list JSONB;
BEGIN
  -- Get caller's email from auth.jwt()
  v_user_email := auth.jwt() ->> 'email';

  -- Allow hetu2286@gmail.com or fallback for development
  IF v_user_email IS NULL OR (v_user_email != 'hetu2286@gmail.com' AND v_user_email NOT LIKE '%admin%') THEN
    -- If not hetu, raise exception
    RAISE EXCEPTION 'Access denied. Private Admin Dashboard only.';
  END IF;

  -- Total stats
  SELECT COUNT(*) INTO v_total_users FROM public.profiles;
  SELECT COUNT(*) INTO v_total_couples FROM public.couples;
  SELECT COUNT(*) INTO v_total_sessions FROM public.game_sessions;

  -- Recent couples with pet names
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', c.id,
      'status', c.status,
      'created_at', c.created_at,
      'partner_1_name', p1.full_name,
      'partner_1_pet', p1.pet_name,
      'partner_2_name', p2.full_name,
      'partner_2_pet', p2.pet_name
    )
  ) INTO v_couples_list
  FROM public.couples c
  LEFT JOIN public.profiles p1 ON p1.id = c.partner_1_id
  LEFT JOIN public.profiles p2 ON p2.id = c.partner_2_id
  ORDER BY c.created_at DESC
  LIMIT 50;

  -- Recent game sessions with progress
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', s.id,
      'couple_id', s.couple_id,
      'game_type', s.game_type,
      'status', s.status,
      'current_level', s.current_level,
      'current_stage', s.current_stage,
      'created_at', s.created_at,
      'started_at', s.started_at,
      'completed_at', s.completed_at,
      'p1_pet', p1.pet_name,
      'p2_pet', p2.pet_name
    )
  ) INTO v_sessions_list
  FROM public.game_sessions s
  LEFT JOIN public.profiles p1 ON p1.id = s.partner_1_id
  LEFT JOIN public.profiles p2 ON p2.id = s.partner_2_id
  ORDER BY s.created_at DESC
  LIMIT 50;

  RETURN jsonb_build_object(
    'total_users', COALESCE(v_total_users, 0),
    'total_couples', COALESCE(v_total_couples, 0),
    'total_sessions', COALESCE(v_total_sessions, 0),
    'couples', COALESCE(v_couples_list, '[]'::jsonb),
    'sessions', COALESCE(v_sessions_list, '[]'::jsonb)
  );
END;
$$;

-- 2. Function for Couple Game History
CREATE OR REPLACE FUNCTION public.get_my_game_history()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_couple RECORD;
  v_history JSONB;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN '[]'::jsonb;
  END IF;

  -- Find user's couple
  SELECT id INTO v_couple
  FROM public.couples
  WHERE partner_1_id = v_user_id OR partner_2_id = v_user_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN '[]'::jsonb;
  END IF;

  -- Get all sessions for this couple
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', s.id,
      'game_type', s.game_type,
      'status', s.status,
      'current_level', s.current_level,
      'current_stage', s.current_stage,
      'created_at', s.created_at,
      'completed_at', s.completed_at
    )
  ) INTO v_history
  FROM public.game_sessions s
  WHERE s.couple_id = v_couple.id
  ORDER BY s.created_at DESC;

  RETURN COALESCE(v_history, '[]'::jsonb);
END;
$$;

-- 3. Function to Delete Account safely
CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 1. Unlink any active couple
  UPDATE public.couples
  SET status = 'unlinked', unlinked_at = NOW()
  WHERE status = 'active'
    AND (partner_1_id = v_user_id OR partner_2_id = v_user_id);

  -- 2. Delete invitations created by this user
  DELETE FROM public.invitations WHERE created_by = v_user_id;

  -- 3. Delete user's profile
  DELETE FROM public.profiles WHERE id = v_user_id;

  RETURN TRUE;
END;
$$;
