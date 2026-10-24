-- ============================================================================
-- 01_INITIAL_SCHEMA.SQL
-- Love Bug Foundational Schema: Profiles, Couples, Invitations & Security
-- ============================================================================

-- Enable pgcrypto for UUID and random string generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  pet_name TEXT,
  heart_color TEXT DEFAULT '#F8C9D8',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_profiles_pet_name ON public.profiles(pet_name);

-- ============================================================================
-- 2. COUPLES TABLE
-- Connects two verified partners together. Enforces strictly 1 active couple per user.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  partner_2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unlinked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  unlinked_at TIMESTAMPTZ,
  CONSTRAINT different_partners CHECK (partner_1_id <> partner_2_id)
);

CREATE INDEX IF NOT EXISTS idx_couples_partner1 ON public.couples(partner_1_id);
CREATE INDEX IF NOT EXISTS idx_couples_partner2 ON public.couples(partner_2_id);
CREATE INDEX IF NOT EXISTS idx_couples_status ON public.couples(status);

-- Constraint Trigger: Ensure neither partner already belongs to an active couple
CREATE OR REPLACE FUNCTION public.check_single_active_couple()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' THEN
    IF EXISTS (
      SELECT 1 FROM public.couples
      WHERE status = 'active'
        AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
        AND (partner_1_id IN (NEW.partner_1_id, NEW.partner_2_id)
          OR partner_2_id IN (NEW.partner_1_id, NEW.partner_2_id))
    ) THEN
      RAISE EXCEPTION 'One or both partners are already part of an active couple.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_enforce_single_active_couple ON public.couples;
CREATE TRIGGER trigger_enforce_single_active_couple
BEFORE INSERT OR UPDATE ON public.couples
FOR EACH ROW EXECUTE FUNCTION public.check_single_active_couple();

-- ============================================================================
-- 3. INVITATIONS TABLE
-- Single-use, expiring invite codes (e.g., LB-7K3Q) to safely connect partners.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invitations_code ON public.invitations(invite_code);
CREATE INDEX IF NOT EXISTS idx_invitations_inviter ON public.invitations(inviter_id);

-- Enforce at most 1 pending invitation per user at any given time
CREATE UNIQUE INDEX IF NOT EXISTS unique_pending_invitation_per_user
ON public.invitations (inviter_id)
WHERE status = 'pending';

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- --- Profiles RLS ---
-- Users can read their own profile, or their active partner's profile
CREATE POLICY "Users can read own profile and partner profile"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id
  OR EXISTS (
    SELECT 1 FROM public.couples
    WHERE status = 'active'
      AND ((partner_1_id = auth.uid() AND partner_2_id = public.profiles.id)
        OR (partner_2_id = auth.uid() AND partner_1_id = public.profiles.id))
  )
);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- --- Couples RLS ---
-- Users can only see the couple row they belong to
CREATE POLICY "Users can view own couple"
ON public.couples
FOR SELECT
USING (auth.uid() = partner_1_id OR auth.uid() = partner_2_id);

-- Users can update only their own couple (e.g. to unlink)
CREATE POLICY "Users can update own couple"
ON public.couples
FOR UPDATE
USING (auth.uid() = partner_1_id OR auth.uid() = partner_2_id);

-- --- Invitations RLS ---
-- Inviter can view and manage their own invitations
CREATE POLICY "Users can manage own invitations"
ON public.invitations
FOR ALL
USING (auth.uid() = inviter_id);

-- ============================================================================
-- 5. SECURE DATABASE FUNCTIONS (RPC)
-- Server-side verified operations that avoid frontend race conditions
-- ============================================================================

-- Function 1: Create an invitation code (format: LB-XXXX)
CREATE OR REPLACE FUNCTION public.create_invite_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_code TEXT;
  v_chars TEXT := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  v_i INT;
  v_random_char TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Ensure user is not already in an active couple
  IF EXISTS (
    SELECT 1 FROM public.couples
    WHERE status = 'active'
      AND (partner_1_id = v_user_id OR partner_2_id = v_user_id)
  ) THEN
    RAISE EXCEPTION 'You are already in an active couple.';
  END IF;

  -- Cancel any previous pending invitation of this user
  UPDATE public.invitations
  SET status = 'cancelled'
  WHERE inviter_id = v_user_id AND status = 'pending';

  -- Generate unique code LB-XXXX (4 random alphanumeric characters)
  LOOP
    v_code := 'LB-';
    FOR v_i IN 1..4 LOOP
      v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
    END LOOP;

    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.invitations WHERE invite_code = v_code AND status = 'pending'
    );
  END LOOP;

  -- Insert new invitation
  INSERT INTO public.invitations (inviter_id, invite_code, status, expires_at)
  VALUES (v_user_id, v_code, 'pending', NOW() + INTERVAL '24 hours');

  RETURN v_code;
END;
$$;

-- Function 2: Join a couple using an invite code
CREATE OR REPLACE FUNCTION public.join_with_invite_code(p_invite_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_invite RECORD;
  v_couple_id UUID;
  v_partner_profile RECORD;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if joiner is already in an active couple
  IF EXISTS (
    SELECT 1 FROM public.couples
    WHERE status = 'active'
      AND (partner_1_id = v_user_id OR partner_2_id = v_user_id)
  ) THEN
    RAISE EXCEPTION 'You are already part of an active couple.';
  END IF;

  -- Find and lock the invitation
  SELECT * INTO v_invite
  FROM public.invitations
  WHERE UPPER(invite_code) = UPPER(TRIM(p_invite_code))
    AND status = 'pending'
    AND expires_at > NOW()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid, expired, or already used invite code.';
  END IF;

  IF v_invite.inviter_id = v_user_id THEN
    RAISE EXCEPTION 'You cannot join with your own invite code.';
  END IF;

  -- Check if inviter is still free (not coupled during wait time)
  IF EXISTS (
    SELECT 1 FROM public.couples
    WHERE status = 'active'
      AND (partner_1_id = v_invite.inviter_id OR partner_2_id = v_invite.inviter_id)
  ) THEN
    UPDATE public.invitations SET status = 'cancelled' WHERE id = v_invite.id;
    RAISE EXCEPTION 'The inviter has already joined another couple.';
  END IF;

  -- Create the active couple
  INSERT INTO public.couples (partner_1_id, partner_2_id, status)
  VALUES (v_invite.inviter_id, v_user_id, 'active')
  RETURNING id INTO v_couple_id;

  -- Mark invitation as accepted
  UPDATE public.invitations
  SET status = 'accepted'
  WHERE id = v_invite.id;

  -- Fetch partner profile details
  SELECT id, full_name, pet_name, heart_color
  INTO v_partner_profile
  FROM public.profiles
  WHERE id = v_invite.inviter_id;

  RETURN jsonb_build_object(
    'couple_id', v_couple_id,
    'partner_id', v_partner_profile.id,
    'partner_name', v_partner_profile.full_name,
    'partner_pet_name', v_partner_profile.pet_name,
    'partner_heart_color', v_partner_profile.heart_color
  );
END;
$$;

-- Function 3: Leave / Unlink active couple safely
CREATE OR REPLACE FUNCTION public.leave_couple()
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

  UPDATE public.couples
  SET status = 'unlinked',
      unlinked_at = NOW()
  WHERE status = 'active'
    AND (partner_1_id = v_user_id OR partner_2_id = v_user_id);

  RETURN TRUE;
END;
$$;

-- Function 4: Get current user's active couple & partner profile
CREATE OR REPLACE FUNCTION public.get_my_couple_data()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_couple RECORD;
  v_partner_id UUID;
  v_partner_profile RECORD;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT * INTO v_couple
  FROM public.couples
  WHERE status = 'active'
    AND (partner_1_id = v_user_id OR partner_2_id = v_user_id)
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  IF v_couple.partner_1_id = v_user_id THEN
    v_partner_id := v_couple.partner_2_id;
  ELSE
    v_partner_id := v_couple.partner_1_id;
  END IF;

  SELECT id, full_name, pet_name, heart_color
  INTO v_partner_profile
  FROM public.profiles
  WHERE id = v_partner_id;

  RETURN jsonb_build_object(
    'couple_id', v_couple.id,
    'partner_id', v_partner_id,
    'partner_name', v_partner_profile.full_name,
    'partner_pet_name', v_partner_profile.pet_name,
    'partner_heart_color', v_partner_profile.heart_color,
    'created_at', v_couple.created_at
  );
END;
$$;

-- ============================================================================
-- 6. AUTOMATIC TRIGGER FOR GOOGLE SIGNUP
-- Automatically creates a public.profiles row whenever a user signs up via Auth
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    pet_name
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Sweetheart'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Love Bug')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
