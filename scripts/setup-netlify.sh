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

# Deploy current state
echo -e "\n${YELLOW}Deploying current state...${NC}"
netlify deploy --prod

# Show configuration
echo -e "\n${YELLOW}Current configuration:${NC}"
netlify status

echo -e "\n${GREEN}Netlify configuration complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Visit Netlify dashboard to configure:"
echo "   - Environment variables"
echo "   - Build settings"
echo "   - Deploy hooks"
echo "   - Branch deploys"
echo "2. Configure custom domain (if needed)"
echo "3. Set up continuous deployment:"
echo "   - Go to Site settings > Build & deploy"
echo "   - Connect to Git repository"
echo "   - Configure build settings:"
echo "     * Base directory: ."
echo "     * Build command: (leave empty)"
echo "     * Publish directory: ."
echo "4. Configure environment variables:"
echo "   - Go to Site settings > Environment variables"
echo "   - Add API_URL for production and preview"

# Open Netlify dashboard
echo -e "\n${YELLOW}Opening Netlify dashboard...${NC}"
netlify open:admin
