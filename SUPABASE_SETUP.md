# Supabase Setup & Deployment Guide

## Current Status
✅ Environment variables configured in `.env`
✅ Database migrations created
✅ TypeScript types generated
✅ DEMO_MODE disabled for production

## Step 1: Create a Test User in Supabase (Local Testing)

Before deploying, create a real user account in Supabase:

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project: `zbwmagtvglmatzonxozj`
3. Go to **Authentication > Users**
4. Click **Add user** → **Create new user**
5. Enter:
   - **Email**: `9654303184@rolex-enterprises.com` (or any email)
   - **Password**: `Your_Secure_Password_123`
   - Enable **Email confirm**
6. Click **Save**

## Step 2: Verify Database Tables

Check that all tables were created:

1. Go to **SQL Editor** in Supabase
2. Run this query to verify all tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- `profiles`
- `user_roles`
- `categories`
- `products`
- `product_images`
- `quotes`
- `quote_items`

## Step 3: Create User Profile & Role

After creating a user, also add their profile:

1. Go to **SQL Editor**
2. Run (replace `USER_ID` with the user's actual ID):
```sql
INSERT INTO public.profiles (user_id, name, phone)
VALUES ('USER_ID', 'Your Name', '9654303184');

INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID', 'user');
```

## Step 4: Test Locally

Run the development server:
```bash
npm run dev
```

1. Navigate to `http://localhost:5173/login`
2. Sign in with:
   - **Phone/Email**: `9654303184@rolex-enterprises.com`
   - **Password**: Your created password
3. Check browser console for any errors
4. Verify you can access the dashboard

## Step 5: Production Deployment

### Option A: Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://zbwmagtvglmatzonxozj.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpid21hZ3R2Z2xtYXR6b254b3pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTUxNjgsImV4cCI6MjA4NDU5MTE2OH0.sYu_Dyl78YVj1U0nMEcuKBbzOelqMLHmGiES-Ctlhwo
   VITE_SUPABASE_PROJECT_ID=zbwmagtvglmatzonxozj
   ```
5. Deploy!

### Option B: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add same environment variables as Vercel
6. Deploy!

## Step 6: Update Supabase Security

In your Supabase project, go to **Authentication > Providers** and configure:

1. **Email/Password**: Already enabled
2. **Email Templates**: Customize if needed
3. **Site URL**: Set to your production domain (e.g., `https://yourdomain.com`)
4. **Redirect URLs**: Add your production domain

## Important Notes

- **DEMO_MODE is now OFF** - Your app uses real Supabase
- All authentication goes through Supabase Auth
- User data is stored in `profiles` and `user_roles` tables
- Row-level security (RLS) is enabled for data protection
- Environment variables are NOT committed to git (add to `.gitignore`)

## Troubleshooting

### "Invalid login credentials" error
- Verify user exists in Supabase Auth
- Check user profile exists in `profiles` table
- Verify password is correct

### "Missing environment variables" error
- Check `.env` file has all three variables
- Restart dev server after changing `.env`
- For Vercel/Netlify: verify env vars in deployment settings

### Database connection errors
- Verify internet connection
- Check Supabase project is active
- Check VITE_SUPABASE_URL is correct

## Next Steps

1. Set up proper authentication for admin panel
2. Add email verification flow
3. Set up email notifications
4. Configure database backups
5. Set up custom domain for Supabase (optional)
