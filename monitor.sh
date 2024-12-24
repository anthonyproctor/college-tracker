#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to check if required environment variables are set
check_env() {
    if [[ -z "${RENDER_API_KEY}" ]]; then
        echo -e "${RED}Error: RENDER_API_KEY is not set${NC}"
        echo "Please run: source .env.deploy.local"
        exit 1
    fi
}

# Function to monitor development environment
monitor_dev() {
    echo -e "${YELLOW}Monitoring Development Environment${NC}"
    
    # Check MongoDB status
    echo -e "\n${BLUE}MongoDB Status:${NC}"
    if pgrep mongod > /dev/null; then
        echo -e "${GREEN}MongoDB is running${NC}"
    else
        echo -e "${RED}MongoDB is not running${NC}"
    fi

    # Check backend status
    echo -e "\n${BLUE}Backend Status:${NC}"
    if curl -s http://localhost:5001 > /dev/null; then
        echo -e "${GREEN}Backend is running${NC}"
    else
        echo -e "${RED}Backend is not running${NC}"
    fi

    # Check frontend status
    echo -e "\n${BLUE}Frontend Status:${NC}"
    if curl -s http://localhost:3000 > /dev/null; then
        echo -e "${GREEN}Frontend is running${NC}"
    else
        echo -e "${RED}Frontend is not running${NC}"
    fi

    # Show MongoDB statistics
    echo -e "\n${BLUE}MongoDB Statistics:${NC}"
    mongo college-tracker --eval "printjson(db.stats())" 2>/dev/null

    # Show backend logs
    echo -e "\n${BLUE}Recent Backend Logs:${NC}"
    if [ -f "backend/logs/app.log" ]; then
        tail -n 10 backend/logs/app.log
    else
        echo "No backend logs found"
    fi
}

# Function to monitor production environment
monitor_prod() {
    check_env
    
    echo -e "${YELLOW}Monitoring Production Environment${NC}"

    # Get backend service status
    echo -e "\n${BLUE}Backend Service Status:${NC}"
    curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
        "https://api.render.com/v1/services?name=college-tracker-api" | \
        jq -r '.[0].service.status'

    # Get recent deployments
    echo -e "\n${BLUE}Recent Deployments:${NC}"
    curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
        "https://api.render.com/v1/services?name=college-tracker-api" | \
        jq -r '.[0].deploy.status'

    # Get backend logs
    echo -e "\n${BLUE}Recent Backend Logs:${NC}"
    curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
        "https://api.render.com/v1/services/srv-something/logs" | \
        jq -r '.[] | "\(.timestamp) [\(.level)] \(.message)"' | \
        tail -n 10

    # Get Netlify deployment status
    echo -e "\n${BLUE}Frontend Deployment Status:${NC}"
    netlify status

    # Show MongoDB Atlas statistics
    echo -e "\n${BLUE}MongoDB Atlas Statistics:${NC}"
    if command -v mongosh &> /dev/null; then
        mongosh "$MONGODB_URI" --eval "db.stats()"
    else
        echo "mongosh not installed. Cannot fetch MongoDB statistics."
    fi
}

# Main script
case "$1" in
    "dev")
        monitor_dev
        ;;
    "prod")
        monitor_prod
        ;;
    *)
        echo "Usage: $0 {dev|prod}"
        echo "  dev  - Monitor development environment"
        echo "  prod - Monitor production environment"
        exit 1
        ;;
esac
