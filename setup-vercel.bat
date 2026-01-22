@echo off
REM Vercel Environment Setup Script for Windows
REM This script automatically adds environment variables to your Vercel project

echo.
echo ===== Rolex Enterprises Vercel Setup =====
echo.

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
)

echo Adding environment variables to Vercel...
echo.

REM Add environment variables
echo Enter your VITE_SUPABASE_URL when prompted:
vercel env add VITE_SUPABASE_URL production development preview

echo.
echo Enter your VITE_SUPABASE_PUBLISHABLE_KEY when prompted:
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production development preview

echo.
echo ===== Environment variables added! =====
echo Redeploying your project...
echo.

REM Redeploy the project
vercel --prod

echo.
echo ===== Deployment complete! =====
echo Your site will be live shortly.
echo.
pause
