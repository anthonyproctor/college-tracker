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

# Create new site if not exists
echo -e "\n${YELLOW}Checking Netlify site...${NC}"
if ! netlify status &> /dev/null; then
    echo "Creating new Netlify site..."
    netlify sites:create --name college-tracker
fi

# Get site ID
SITE_ID=$(netlify api getSite | jq -r '.id')

# Configure build settings
echo -e "\n${YELLOW}Configuring build settings...${NC}"
netlify link
netlify build:settings update --publish="." --framework="#static"

# Configure environment variables
echo -e "\n${YELLOW}Configuring environment variables...${NC}"
netlify env:set API_URL "https://college-tracker-api.onrender.com/api/v1" --context production
netlify env:set API_URL "https://college-tracker-api-staging.onrender.com/api/v1" --context deploy-preview

# Enable branch deploys and deploy previews
echo -e "\n${YELLOW}Configuring deployment settings...${NC}"
netlify sites:update $SITE_ID --json \
  --branch-deploy=true \
  --deploy-preview=true \
  --auto-publish=true

# Configure deploy notifications
echo -e "\n${YELLOW}Setting up GitHub integration...${NC}"
if [ -n "$GITHUB_TOKEN" ]; then
    netlify integration:setup --auth $GITHUB_TOKEN
else
    echo -e "${YELLOW}Skipping GitHub integration (GITHUB_TOKEN not set)${NC}"
fi

# Create deploy hook for backend service
echo -e "\n${YELLOW}Creating deploy hook...${NC}"
HOOK_URL=$(netlify deploy-hooks:create college-tracker --branch main)
echo "Deploy hook URL: $HOOK_URL"
echo -e "${YELLOW}Add this URL to your Render service's deploy hooks${NC}"

echo -e "\n${GREEN}Netlify configuration complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Visit Netlify dashboard to verify settings:"
echo "   netlify open"
echo "2. Add the deploy hook URL to your Render service"
echo "3. Configure custom domain (if needed):"
echo "   netlify domains:add your-domain.com"
echo "4. Test automatic deployments by pushing changes"

# Open Netlify dashboard
echo -e "\n${YELLOW}Opening Netlify dashboard...${NC}"
netlify open
