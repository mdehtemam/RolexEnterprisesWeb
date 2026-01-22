#!/bin/bash
# Vercel Environment Setup Script
# This script automatically adds environment variables to your Vercel project

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Rolex Enterprises Vercel Setup ===${NC}\n"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

echo -e "${BLUE}Adding environment variables to Vercel...${NC}\n"

# Add environment variables
vercel env add VITE_SUPABASE_URL production development preview
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production development preview

echo -e "\n${GREEN}✅ Environment variables added successfully!${NC}"
echo -e "${BLUE}Redeploying your project...${NC}\n"

# Redeploy the project
vercel --prod

echo -e "\n${GREEN}✅ Deployment complete!${NC}"
echo -e "${BLUE}Your site will be live shortly.${NC}\n"
