#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Deploying College Tracker...${NC}"

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${RED}Netlify CLI not found. Installing...${NC}"
    npm install -g netlify-cli
fi

# Verify we're linked to the right site
SITE_NAME="college-tracker-app"
CURRENT_SITE=$(netlify status 2>/dev/null | grep "Current site:" | awk '{print $3}')

if [ "$CURRENT_SITE" != "$SITE_NAME" ]; then
    echo -e "${YELLOW}Linking to $SITE_NAME...${NC}"
    netlify link --name $SITE_NAME
fi

# Deploy to production
echo -e "\n${YELLOW}Deploying to production...${NC}"
netlify deploy --prod

echo -e "\n${GREEN}Deployment complete!${NC}"
echo -e "\n${YELLOW}Important:${NC}"
echo "1. Set up environment variables in Netlify:"
echo "   - Go to: https://app.netlify.com/sites/$SITE_NAME/settings/env"
echo "   - Add the following variables:"
echo "     * API_URL: https://college-tracker-api.onrender.com/api/v1"
echo
echo "2. Configure build settings:"
echo "   - Go to: https://app.netlify.com/sites/$SITE_NAME/settings/deploys"
echo "   - Build settings are already configured in netlify.toml"
echo
echo "3. Set up branch deploys:"
echo "   - Go to: https://app.netlify.com/sites/$SITE_NAME/settings/deploys#deploy-contexts"
echo "   - Enable branch deploys and deploy previews"
echo
echo "4. View your site:"
echo "   - Production: https://$SITE_NAME.netlify.app"
echo "   - Latest deploy: $(netlify status | grep "Site URL:" | awk '{print $3}')"
echo
echo "Commands:"
echo "- View status: netlify status"
echo "- Open dashboard: netlify open"
echo "- View deploys: netlify deploys"
