#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Starting production deployment...${NC}\n"

# Check for required CLIs
if ! command -v netlify &> /dev/null; then
    echo -e "${RED}Netlify CLI not found. Installing...${NC}"
    npm install -g netlify-cli
fi

# Deploy backend to Render
echo -e "\n${YELLOW}Deploying backend to Render...${NC}"
cd backend

# Create production build
echo "Building backend..."
npm install
npm run build

# Check required environment variables
if [ -z "$RENDER_API_KEY" ]; then
    echo -e "${RED}Error: RENDER_API_KEY is not set${NC}"
    echo "Please set up your environment variables in .env.deploy"
    exit 1
fi

if [ -z "$MONGODB_URI" ]; then
    echo -e "${RED}Error: MONGODB_URI is not set${NC}"
    echo "Please set up your MongoDB connection string in .env.deploy"
    exit 1
fi

# Deploy to Render using environment variables
echo "Deploying to Render..."
SERVICE_NAME="college-tracker-api"

# Prepare environment variables for Render
ENV_VARS=$(cat << EOF
{
    "envVars": [
        {"key": "NODE_ENV", "value": "production"},
        {"key": "PORT", "value": "10000"},
        {"key": "MONGODB_URI", "value": "$MONGODB_URI"},
        {"key": "JWT_SECRET", "value": "$JWT_SECRET"},
        {"key": "JWT_EXPIRE", "value": "$JWT_EXPIRE"},
        {"key": "EMAIL_SERVICE", "value": "$EMAIL_SERVICE"},
        {"key": "EMAIL_USER", "value": "$EMAIL_USER"},
        {"key": "EMAIL_PASSWORD", "value": "$EMAIL_PASSWORD"}
    ]
}
EOF
)

# Create service on Render
curl -X POST "https://api.render.com/v1/services" \
    -H "Authorization: Bearer $RENDER_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"$SERVICE_NAME\",
        \"owner\": \"anthonyproctor\",
        \"repo\": \"https://github.com/anthonyproctor/college-tracker\",
        \"branch\": \"main\",
        \"autoDeploy\": true,
        \"envVars\": $(echo $ENV_VARS | jq .envVars)
    }"

# Wait for backend deployment
echo "Waiting for backend deployment to complete..."
sleep 30

# Get the backend URL
BACKEND_URL=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
  "https://api.render.com/v1/services?name=$SERVICE_NAME" | \
  jq -r '.[0].serviceDetails.url')

echo -e "${GREEN}Backend deployed to: $BACKEND_URL${NC}"

# Update frontend API configuration
cd ..
echo -e "\n${YELLOW}Updating frontend configuration...${NC}"
cat > scripts/api.config.js << EOL
// Production API configuration
export const API_CONFIG = {
    BASE_URL: '$BACKEND_URL/api/v1',
    TIMEOUT: 10000
};
EOL

# Deploy frontend to Netlify
echo -e "\n${YELLOW}Deploying frontend to Netlify...${NC}"
netlify deploy --prod

echo -e "\n${GREEN}Deployment complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Test the application at your Netlify URL"
echo "2. Set up your email service in Render environment variables"
echo "3. Configure MongoDB Atlas connection string"
echo -e "\n${GREEN}For detailed instructions, refer to backend/DEPLOY.md${NC}"
