-- ============================================================================
-- NEW: Read-only reveal check (does NOT upsert, safe for polling)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.check_reveal_status(
  p_session_id UUID,
  p_level_number INT
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
  v_my_answer JSONB;
  v_partner_answer JSONB;
  v_partner_id UUID;
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
    RETURN jsonb_build_object('both_answered', false);
  END IF;

  -- Determine partner
  v_partner_id := CASE
    WHEN v_session.partner_1_id = v_user_id THEN v_session.partner_2_id
    ELSE v_session.partner_1_id
  END;

  -- Count answers for this level
  SELECT COUNT(*) INTO v_total_answers
  FROM public.session_answers
  WHERE session_id = p_session_id
    AND level_number = p_level_number;

  v_both_answered := (v_total_answers >= 2);

  IF v_both_answered THEN
    SELECT answer INTO v_my_answer
    FROM public.session_answers
    WHERE session_id = p_session_id AND level_number = p_level_number AND user_id = v_user_id;

    SELECT answer INTO v_partner_answer
    FROM public.session_answers
    WHERE session_id = p_session_id AND level_number = p_level_number AND user_id = v_partner_id;
  END IF;

  RETURN jsonb_build_object(
    'both_answered', v_both_answered,
    'my_answer', CASE WHEN v_both_answered THEN v_my_answer ELSE NULL END,
    'partner_answer', CASE WHEN v_both_answered THEN v_partner_answer ELSE NULL END
  );
END;
$$;
