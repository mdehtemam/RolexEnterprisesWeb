# Automatic Vercel Deployment Setup

This guide will help you set up automatic deployment to Vercel with environment variables.

## Option 1: Quick Manual Setup (2 minutes)

### For Windows Users:
```bash
.\setup-vercel.bat
```

### For Mac/Linux Users:
```bash
bash setup-vercel.sh
```

The script will:
- Install Vercel CLI (if needed)
- Prompt you to enter environment variables
- Deploy your project automatically

---

## Option 2: GitHub Actions Automatic Deployment (Recommended)

This option automatically deploys to Vercel every time you push to GitHub.

### Setup Steps:

**Step 1: Get Vercel Tokens**
1. Go to https://vercel.com/account/tokens
2. Create a new token and copy it
3. Get your Org ID and Project ID from Vercel dashboard

**Step 2: Add GitHub Secrets**
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret" and add:

| Secret Name | Value |
|-------------|-------|
| `VERCEL_TOKEN` | Your Vercel token from step 1 |
| `VERCEL_ORG_ID` | Your Vercel Organization ID |
| `VERCEL_PROJECT_ID` | Your Vercel Project ID |
| `VITE_SUPABASE_URL` | `https://lhxqidkhfhqikeqkdrey.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_jLjj37XvMI6qOv6zLDGEHQ_MOVpyVHE` |

**Step 3: Done!**
- The workflow file `.github/workflows/deploy.yml` is already in your repo
- Every push to `main` branch will automatically deploy to Vercel

---

## Getting Your Vercel IDs

### Find Organization ID:
1. Go to https://vercel.com/dashboard/settings
2. Copy the `ID` field

### Find Project ID:
1. Go to your project dashboard
2. Click Settings → General
3. Copy the `Project ID`

---

## Testing the Deployment

Push a test commit to trigger auto-deployment:
```bash
git add .
git commit -m "Test automatic deployment"
git push origin main
```

Check GitHub Actions tab to see the deployment progress.

---

## Troubleshooting

**Build fails with "missing environment variables"**
- Check that all 5 secrets are added in GitHub
- Secrets are case-sensitive

**Deployment fails**
- Check build logs in GitHub Actions
- Check Vercel dashboard for errors

**Want to manually deploy?**
- Run `npm run build` locally
- Run `npm run preview` to test
- Use `vercel --prod` to manually deploy

---

## Environment Variables Used

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase public API key
- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID
