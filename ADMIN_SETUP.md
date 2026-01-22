# Admin User Setup Guide

## Default Admin Credentials

The following admin account is configured for Rolex Enterprises:

- **Email**: `rolexenterprises.corp@gmail.com`
- **Password**: `Batadiya@123`
- **Phone**: `8447780862`
- **Name**: `Rolex Enterprises`

## How to Set Up Admin User

### Option 1: Automatic Setup (Recommended)

The system is configured to automatically assign admin role when a user signs up with the admin email. Follow these steps:

1. **Run the Migration**
   - Go to Supabase Dashboard → SQL Editor
   - Open the file: `supabase/migrations/20260122_create_admin_user.sql`
   - Copy and paste the entire content
   - Click **Run** (or press Ctrl+Enter)
   - You should see: "Admin user setup complete! ✅"

2. **Create the User Account**
   
   **Method A: Via Supabase Dashboard (Easiest)**
   - Go to Supabase Dashboard → Authentication → Users
   - Click **Add user** → **Create new user**
   - Enter:
     - **Email**: `rolexenterprises.corp@gmail.com`
     - **Password**: `Batadiya@123`
     - ✅ Check **Email confirmed** (important!)
   - Click **Save**
   - The trigger will automatically assign admin role and create profile

   **Method B: Via Signup Page**
   - Go to your app's signup page (`/signup`)
   - Sign up with:
     - Email: `rolexenterprises.corp@gmail.com`
     - Password: `Batadiya@123`
     - Name: `Rolex Enterprises`
     - Phone: `8447780862`
   - The trigger will automatically assign admin role

3. **Verify Admin Access**
   - Log in at `/login` with the credentials above
   - You should see "Admin Panel" option in the user menu
   - Access `/admin` page

### Option 2: Manual Promotion (If User Already Exists)

If the user already exists but is not an admin:

1. Go to Supabase Dashboard → SQL Editor
2. Run this query:

```sql
-- Promote existing user to admin
SELECT public.promote_user_to_admin('rolexenterprises.corp@gmail.com');
```

Or manually:

```sql
-- Find user ID
SELECT id, email FROM auth.users WHERE email = 'rolexenterprises.corp@gmail.com';

-- Replace USER_ID with the actual ID from above, then run:
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = 'USER_ID';

-- If no role exists, insert it:
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Update profile
UPDATE public.profiles
SET name = 'Rolex Enterprises', phone = '8447780862'
WHERE user_id = 'USER_ID';
```

## How It Works

1. **Trigger Function**: `assign_admin_role_by_email()`
   - Automatically runs when a new user is created
   - Checks if email matches `rolexenterprises.corp@gmail.com`
   - If match, assigns `admin` role and creates/updates profile

2. **Manual Promotion Function**: `promote_user_to_admin(email)`
   - Can be called to promote existing users to admin
   - Usage: `SELECT public.promote_user_to_admin('email@example.com');`

## Security Notes

- The admin email is hardcoded in the trigger function
- Only users with this exact email will be automatically promoted
- The trigger runs with `SECURITY DEFINER` to bypass RLS
- Admin role grants full access to admin panel and all resources

## Troubleshooting

### "User not found" error
- Make sure the user account exists in Supabase Auth
- Check email spelling: `rolexenterprises.corp@gmail.com`
- Verify user was created successfully

### "Permission denied" error
- Make sure you ran the migration SQL as a database admin
- Check that the trigger was created: 
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'assign_admin_on_user_create';
  ```

### User exists but not admin
- Run the manual promotion function (Option 2 above)
- Or check user_roles table:
  ```sql
  SELECT ur.*, u.email 
  FROM public.user_roles ur
  JOIN auth.users u ON u.id = ur.user_id
  WHERE u.email = 'rolexenterprises.corp@gmail.com';
  ```

### Can't access admin panel
- Verify admin role exists:
  ```sql
  SELECT role FROM public.user_roles 
  WHERE user_id = (SELECT id FROM auth.users WHERE email = 'rolexenterprises.corp@gmail.com');
  ```
- Should return: `admin`
- Log out and log back in to refresh session

## Testing Admin Access

1. Log in with admin credentials
2. Check user menu - should show "Admin Panel" option
3. Navigate to `/admin` - should load admin dashboard
4. Try creating/editing products - should work without errors

## Changing Admin Email

To change the admin email in the future:

1. Update the trigger function:
   ```sql
   CREATE OR REPLACE FUNCTION public.assign_admin_role_by_email()
   RETURNS TRIGGER
   LANGUAGE plpgsql
   SECURITY DEFINER
   SET search_path = public
   AS $$
   DECLARE
     admin_email TEXT := 'new-admin@email.com'; -- Change here
   BEGIN
     -- ... rest of function
   END;
   $$;
   ```

2. Or manually update the user_roles table for the new email
