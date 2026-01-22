-- ============================================================================
-- CREATE ADMIN USER FOR ROLEX ENTERPRISES
-- This migration sets up automatic admin role assignment for the admin email
-- ============================================================================

-- Function to automatically assign admin role to specific email
CREATE OR REPLACE FUNCTION public.assign_admin_role_by_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_email TEXT := 'rolexenterprises.corp@gmail.com';
BEGIN
  -- Check if the new user's email matches the admin email
  IF NEW.email = admin_email THEN
    -- Promote role to admin.
    -- IMPORTANT: This handles BOTH schemas:
    -- - user_roles has UNIQUE(user_id) (one role per user)
    -- - user_roles has UNIQUE(user_id, role) (multi-role per user)
    --
    -- We prefer UPDATE to avoid inserting a second row (which would fail with UNIQUE(user_id)).
    UPDATE public.user_roles
    SET role = 'admin'
    WHERE user_id = NEW.id;
    
    IF NOT FOUND THEN
      BEGIN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.id, 'admin');
      EXCEPTION
        WHEN unique_violation THEN
          UPDATE public.user_roles
          SET role = 'admin'
          WHERE user_id = NEW.id;
      END;
    END IF;
    
    -- Ensure profile exists with correct details
    INSERT INTO public.profiles (user_id, name, phone)
    VALUES (
      NEW.id,
      'Rolex Enterprises',
      '8447780862'
    )
    ON CONFLICT (user_id)
    DO UPDATE SET 
      name = 'Rolex Enterprises',
      phone = '8447780862';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to run after user creation
DROP TRIGGER IF EXISTS assign_admin_on_user_create ON auth.users;
CREATE TRIGGER assign_admin_on_user_create
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_admin_role_by_email();

-- Function to manually promote existing user to admin (if user already exists)
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Promote role to admin (works with either UNIQUE(user_id) or UNIQUE(user_id, role))
  UPDATE public.user_roles
  SET role = 'admin'
  WHERE user_id = target_user_id;
  
  IF NOT FOUND THEN
    BEGIN
      INSERT INTO public.user_roles (user_id, role)
      VALUES (target_user_id, 'admin');
    EXCEPTION
      WHEN unique_violation THEN
        UPDATE public.user_roles
        SET role = 'admin'
        WHERE user_id = target_user_id;
    END;
  END IF;
  
  -- Update profile
  INSERT INTO public.profiles (user_id, name, phone)
  VALUES (target_user_id, 'Rolex Enterprises', '8447780862')
  ON CONFLICT (user_id)
  DO UPDATE SET 
    name = 'Rolex Enterprises',
    phone = '8447780862';
  
  RETURN TRUE;
END;
$$;

-- If admin user already exists, promote them now
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Check if user with admin email exists
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'rolexenterprises.corp@gmail.com';
  
  -- If user exists, promote to admin
  IF admin_user_id IS NOT NULL THEN
    -- Promote role to admin (works with either UNIQUE(user_id) or UNIQUE(user_id, role))
    UPDATE public.user_roles
    SET role = 'admin'
    WHERE user_id = admin_user_id;
    
    IF NOT FOUND THEN
      BEGIN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin');
      EXCEPTION
        WHEN unique_violation THEN
          UPDATE public.user_roles
          SET role = 'admin'
          WHERE user_id = admin_user_id;
      END;
    END IF;
    
    INSERT INTO public.profiles (user_id, name, phone)
    VALUES (admin_user_id, 'Rolex Enterprises', '8447780862')
    ON CONFLICT (user_id)
    DO UPDATE SET 
      name = 'Rolex Enterprises',
      phone = '8447780862';
    
    RAISE NOTICE 'Admin user promoted successfully!';
  ELSE
    RAISE NOTICE 'Admin user does not exist yet. They will be automatically promoted when they sign up.';
  END IF;
END $$;

-- Success message
SELECT 
  'Admin user setup complete! ✅' as status,
  'Email: rolexenterprises.corp@gmail.com' as admin_email,
  'Password: Batadiya@123' as admin_password,
  'Phone: 8447780862' as admin_phone,
  'Name: Rolex Enterprises' as admin_name,
  'Note: If user does not exist, create them via Supabase Auth dashboard or signup page, then they will be automatically promoted to admin.' as instructions;
