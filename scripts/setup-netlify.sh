#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Setting up Netlify deployment configuration...${NC}"

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${RED}Netlify CLI not found. Installing...${NC}"
    npm install -g netlify-cli
fi

# Link site if not already linked
echo -e "\n${YELLOW}Checking Netlify site configuration...${NC}"
if ! netlify status &> /dev/null; then
    echo "Creating new site..."
    netlify init
fi

# Configure environment variables
echo -e "\n${YELLOW}Configuring environment variables...${NC}"
netlify env:set API_URL "https://college-tracker-api.onrender.com/api/v1" --context production --force
netlify env:set API_URL "https://college-tracker-api-staging.onrender.com/api/v1" --context branch --force

# Create deploy hook
echo -e "\n${YELLOW}Creating deploy hook...${NC}"
netlify deploy-hooks:create --name "Production Deploy" --branch main

# Configure build settings
echo -e "\n${YELLOW}Configuring build settings...${NC}"
netlify build:settings set-mode manual

# Enable branch deploys
echo -e "\n${YELLOW}Enabling branch deploys and deploy previews...${NC}"
netlify site:config --branch-deploy=true --deploy-preview=true

# Show configuration
echo -e "\n${YELLOW}Current configuration:${NC}"
netlify status

echo -e "\n${GREEN}Netlify configuration complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Visit Netlify dashboard to verify settings:"
echo "   netlify open"
echo "2. Configure custom domain (if needed):"
echo "   netlify domains:add your-domain.com"
echo "3. Test automatic deployments by pushing changes"
echo "4. View deployment status:"
echo "   netlify deploy:list"

# Open Netlify dashboard
echo -e "\n${YELLOW}Opening Netlify dashboard...${NC}"
netlify open --admin
