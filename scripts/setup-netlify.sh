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

# Configure build settings
echo -e "\n${YELLOW}Configuring build settings...${NC}"
netlify build:settings set --dir="."
netlify build:settings set --command=""

# Configure deploy contexts
echo -e "\n${YELLOW}Configuring deploy contexts...${NC}"
netlify env:set REACT_APP_API_URL "https://college-tracker-api.onrender.com/api/v1" --scope production
netlify env:set REACT_APP_API_URL "https://college-tracker-api-staging.onrender.com/api/v1" --scope deploy-preview

# Configure deploy notifications
echo -e "\n${YELLOW}Configuring deploy notifications...${NC}"
netlify api createHookDefinition --data '{
    "site_id": "'$(netlify api getSite | jq -r .id)'",
    "event": "deploy_succeeded",
    "data": {
        "url": "https://api.github.com/repos/anthonyproctor/college-tracker/statuses/${COMMIT_REF}",
        "headers": {
            "Authorization": "token ${GITHUB_TOKEN}"
        },
        "body": {
            "state": "success",
            "description": "Deploy preview ready!",
            "context": "netlify/deploy-preview"
        }
    }
}'

# Configure branch deploys
echo -e "\n${YELLOW}Configuring branch deploy settings...${NC}"
netlify api updateSite --data '{
    "site_id": "'$(netlify api getSite | jq -r .id)'",
    "build_settings": {
        "allowed_branches": ["main", "develop"],
        "branch_deploy_enabled": true,
        "deploy_preview_enabled": true
    }
}'

# Configure deploy hooks
echo -e "\n${YELLOW}Creating deploy hooks...${NC}"
netlify api createHook --data '{
    "site_id": "'$(netlify api getSite | jq -r .id)'",
    "type": "url",
    "event": "deploy_succeeded",
    "data": {
        "url": "https://api.render.com/v1/services/srv-something/deploys"
    }
}'

echo -e "\n${GREEN}Netlify configuration complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Visit your Netlify dashboard to verify settings"
echo "2. Set up environment variables in Netlify dashboard"
echo "3. Configure custom domain (if needed)"
echo "4. Test automatic deployments by pushing changes"
echo -e "\n${YELLOW}Commands:${NC}"
echo "netlify open          # Open Netlify dashboard"
echo "netlify deploy        # Manual deploy"
echo "netlify env:list      # List environment variables"
