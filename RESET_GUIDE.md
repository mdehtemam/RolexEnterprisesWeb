# Complete Supabase Reset & Setup Guide

## What We're Doing
✅ Delete ALL existing tables and functions
✅ Create everything fresh from scratch
✅ Verify everything is working correctly

---

## STEP 1: Reset Supabase Database

1. Go to https://app.supabase.com
2. Select project: **zbwmagtvglmatzonxozj**
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire content from `COMPLETE_RESET.sql`
6. Paste it into the SQL editor
7. Click **▶ Run** button (or Ctrl+Enter)

**⏳ Wait for it to complete** - You should see:
```
Database reset complete! ✅
```

---

## STEP 2: Verify Everything Was Created

1. Still in SQL Editor
2. Click **New Query** again
3. Copy the entire content from `VERIFY_DATABASE.sql`
4. Paste it into the SQL editor
5. Click **▶ Run** button

**You should see results showing:**
- ✅ 9 tables created
- ✅ 1 enum type created
- ✅ 3 functions created
- ✅ 5 triggers created
- ✅ RLS enabled on all tables
- ✅ 7 indexes created
- ✅ 1 storage bucket created

---

## STEP 3: Create a Test User

Now we need to create a test user to log in with:

1. Go to **Authentication > Users** in Supabase dashboard
2. Click **Add user** → **Create new user**
3. Fill in:
   - **Email**: `test@rolex-enterprises.com`
   - **Password**: `Test123456!` (remember this!)
   - Check **Email confirmed** checkbox
4. Click **Save**

---

## STEP 4: Test Locally

1. Open terminal in your project folder
2. Run:
   ```bash
   npm run dev
   ```

3. Go to `http://localhost:5173/login`
4. Sign in with:
   - **Phone/Email**: `test@rolex-enterprises.com`
   - **Password**: `Test123456!`

5. Check browser console (F12) for any errors

---

## STEP 5: Tables Created

Here's what was created:

### Core Tables:
- **profiles** - User information (name, phone)
- **user_roles** - User permissions (admin/user)
- **categories** - Product categories
- **products** - Product listings with SKU and rate
- **product_variants** - Color/size variants of products
- **product_images** - Images for products
- **quotes** - Customer quote requests
- **quote_items** - Items in each quote
- **contacts** - Contact form submissions

### Storage:
- **product-images** bucket - For storing product images

---

## STEP 6: Login System

The app is now configured to use REAL Supabase authentication:

- Users authenticate via email/password through Supabase Auth
- Profiles are auto-created when users sign up
- Users are auto-assigned "user" role
- Admins must be manually assigned "admin" role in Supabase

---

## STEP 7: Make Someone an Admin

If you want to promote a user to admin:

1. Go to SQL Editor in Supabase
2. Click **New Query**
3. Run:
```sql
-- Find the user ID first
SELECT id, email FROM auth.users WHERE email = 'test@rolex-enterprises.com';

-- Then add admin role (replace USER_ID)
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID', 'admin');
```

---

## STEP 8: Deploy to Production

When ready to deploy:

1. Your `.env` already has Supabase credentials
2. Deploy to Vercel/Netlify
3. Add same environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
4. Same Supabase database works for both local and production!

---

## Troubleshooting

### "Missing schema" error
- Wait 30 seconds and refresh
- Database sometimes takes a moment to sync

### "Permission denied" on RLS policies
- Make sure you're logged in with a created user
- Not all tables allow anonymous access

### "Foreign key constraint" error
- Delete data in correct order:
  - quote_items → quotes
  - product_images → products
  - product_variants → products
  - products → categories

### "User not found"
- Create the test user as shown in STEP 3
- Make sure profile is created

---

## Files Reference

- **COMPLETE_RESET.sql** - Deletes everything and recreates fresh
- **VERIFY_DATABASE.sql** - Checks that everything was created correctly
- **SUPABASE_SETUP.md** - Original setup guide
- **.env** - Contains your Supabase credentials

---

## Next Steps

1. ✅ Run COMPLETE_RESET.sql
2. ✅ Run VERIFY_DATABASE.sql
3. ✅ Create test user
4. ✅ Test locally
5. Deploy to Vercel/Netlify when ready

---

## Support

If you have issues:
1. Check browser console (F12) for error messages
2. Check Supabase dashboard for any warnings
3. Verify all tables exist (VERIFY_DATABASE.sql)
4. Make sure environment variables are loaded (restart dev server)
