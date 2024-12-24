#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if render-cli is installed
if ! command -v render &> /dev/null; then
    echo -e "${RED}Render CLI not found. Installing...${NC}"
    curl -L https://render.com/download/cli | bash
fi

echo -e "${GREEN}Preparing College Application Tracker for deployment...${NC}\n"

# Backend preparation
echo -e "${YELLOW}Preparing backend...${NC}"
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Run build script
echo "Building backend..."
npm run build

# Frontend preparation
echo -e "\n${YELLOW}Preparing frontend...${NC}"
cd ..

# Deploy to Render
echo -e "\n${YELLOW}Deploying to Render...${NC}"
render deploy

# Wait for deployment to complete
echo "Waiting for deployment to complete..."
sleep 30

# Get the deployment URL
RENDER_URL=$(render get-deploy-url)
echo -e "${GREEN}Backend deployed to: ${RENDER_URL}${NC}"

# Update frontend API configuration
echo -e "\n${YELLOW}Updating frontend API configuration...${NC}"
cat > scripts/api.config.js << EOL
// Production API configuration
export const API_CONFIG = {
    BASE_URL: '${RENDER_URL}/api/v1',
    TIMEOUT: 10000
};
EOL

# Deploy to Netlify
echo -e "\n${YELLOW}Deploying to Netlify...${NC}"
if ! command -v netlify &> /dev/null; then
    echo -e "${RED}Netlify CLI not found. Installing...${NC}"
    npm install -g netlify-cli
fi

netlify deploy --prod

echo -e "\n${GREEN}Deployment complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Verify the backend is running at: ${RENDER_URL}"
echo "2. Check your Netlify dashboard for the frontend URL"
echo "3. Test the application end-to-end"
echo -e "\n${GREEN}For detailed instructions, refer to README.md${NC}"
