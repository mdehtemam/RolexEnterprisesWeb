# Quick Start: Admin User Setup

## Admin Credentials

```
Email: rolexenterprises.corp@gmail.com
Password: Batadiya@123
Phone: 8447780862
Name: Rolex Enterprises
```

## Setup Steps (2 minutes)

### Step 1: Run Migration
1. Open Supabase Dashboard → SQL Editor
2. Copy entire content from: `supabase/migrations/20260122_create_admin_user.sql`
3. Paste and click **Run**

### Step 2: Create User Account
**Option A (Recommended):** Via Supabase Dashboard
- Go to **Authentication → Users**
- Click **Add user → Create new user**
- Email: `rolexenterprises.corp@gmail.com`
- Password: `Batadiya@123`
- ✅ Check **Email confirmed**
- Click **Save**

**Option B:** Via Signup Page
- Go to `/signup` in your app
- Sign up with the credentials above
- Admin role will be assigned automatically

### Step 3: Login
- Go to `/login`
- Use credentials above
- You should see "Admin Panel" in user menu
- Access `/admin` page

## That's It! ✅

The system automatically assigns admin role to users with the admin email.

## Troubleshooting

**User exists but not admin?**
Run in SQL Editor:
```sql
SELECT public.promote_user_to_admin('rolexenterprises.corp@gmail.com');
```

**Can't access admin panel?**
1. Log out and log back in
2. Check role: 
   ```sql
   SELECT role FROM public.user_roles 
   WHERE user_id = (SELECT id FROM auth.users WHERE email = 'rolexenterprises.corp@gmail.com');
   ```

For detailed instructions, see [ADMIN_SETUP.md](./ADMIN_SETUP.md)
