#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Deploying to Render...${NC}"

# Check if RENDER_API_KEY is set
if [ -z "$RENDER_API_KEY" ]; then
    echo -e "${RED}Error: RENDER_API_KEY environment variable is not set${NC}"
    exit 1
fi

# Get service ID
SERVICE_ID=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" "https://api.render.com/v1/services" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$SERVICE_ID" ]; then
    echo -e "${RED}Error: Could not find service ID${NC}"
    exit 1
fi

# Trigger deploy
DEPLOY_RESPONSE=$(curl -s -X POST "https://api.render.com/v1/services/$SERVICE_ID/deploys" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{}")

DEPLOY_ID=$(echo $DEPLOY_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$DEPLOY_ID" ]; then
    echo -e "${RED}Error: Deploy failed${NC}"
    echo $DEPLOY_RESPONSE
    exit 1
fi

echo -e "${GREEN}Deploy triggered successfully!${NC}"
echo "Deploy ID: $DEPLOY_ID"
echo "Monitor deployment status at: https://dashboard.render.com/web/$SERVICE_ID/deploys/$DEPLOY_ID"

# Poll deployment status
echo -e "\n${YELLOW}Checking deployment status...${NC}"
while true; do
    STATUS=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
        "https://api.render.com/v1/services/$SERVICE_ID/deploys/$DEPLOY_ID" \
        | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    
    case $STATUS in
        "build_in_progress")
            echo -n "."
            sleep 5
            ;;
        "live")
            echo -e "\n${GREEN}Deployment successful!${NC}"
            exit 0
            ;;
        "build_failed")
            echo -e "\n${RED}Deployment failed${NC}"
            exit 1
            ;;
        *)
            echo -e "\n${RED}Unknown status: $STATUS${NC}"
            exit 1
            ;;
    esac
done
