-- ============================================================================
-- FIX: Signup fails with "Database error saving new user"
-- Root cause (common): public.profiles.phone is UNIQUE + handle_new_user() inserts
-- blank/duplicate phone (''), causing unique_violation and aborting signup.
--
-- This migration updates handle_new_user() to:
-- - Prefer phone from raw_user_meta_data->>'phone' (what the app sends on signup)
-- - Ensure phone is never blank
-- - Ensure phone is unique even if metadata is missing (fallback to 'user-<uuid>')
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name  TEXT;
  v_phone TEXT;
BEGIN
  v_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'name', ''), 'User');

  -- Prefer meta phone (email auth users typically have NEW.phone NULL)
  v_phone := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'phone', ''),
    NULLIF(NEW.phone, ''),
    'user-' || NEW.id::text
  );

  -- Create/Upsert profile
  INSERT INTO public.profiles (user_id, name, phone)
  VALUES (NEW.id, v_name, v_phone)
  ON CONFLICT (user_id)
  DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone;

  -- Ensure a user role row exists (works for both schema variants)
  -- Variant A: UNIQUE(user_id) and a single role column
  BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  EXCEPTION
    WHEN unique_violation THEN
      -- If row exists, do nothing (or keep existing role)
      NULL;
  END;

  RETURN NEW;
END;
$$;

-- Note: trigger name differs across scripts; keep the trigger, just update function.
-- If your project doesn't have the trigger yet, create it:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

SELECT 'Signup profile phone fix applied ✅' AS status;

