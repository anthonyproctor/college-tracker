#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Deploying backend to Render...${NC}"

# Check if RENDER_API_KEY is set
if [ -z "$RENDER_API_KEY" ]; then
    echo -e "${RED}Error: RENDER_API_KEY environment variable is not set${NC}"
    exit 1
fi

# Deploy using manual deploy endpoint
RESPONSE=$(curl -s -X POST "https://api.render.com/v1/services/srv-cj6vl6n7avj3q1qvvkug/deploys" \
    -H "Authorization: Bearer $RENDER_API_KEY")

if [[ $RESPONSE == *"id"* ]]; then
    echo -e "${GREEN}Deployment triggered successfully!${NC}"
    echo "Monitor deployment status at: https://dashboard.render.com/web/srv-cj6vl6n7avj3q1qvvkug"
else
    echo -e "${RED}Deployment failed. Response: $RESPONSE${NC}"
    exit 1
fi
