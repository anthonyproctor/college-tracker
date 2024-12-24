#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if MongoDB is running
if ! pgrep mongod > /dev/null; then
    echo -e "${YELLOW}Starting MongoDB...${NC}"
    brew services start mongodb-community
    sleep 2
fi

# Install concurrently if not present
if ! command -v concurrently &> /dev/null; then
    echo -e "${YELLOW}Installing concurrently...${NC}"
    npm install -g concurrently
fi

# Check if setup has been run
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Running initial setup...${NC}"
    ./setup-dev.sh
fi

echo -e "${GREEN}Starting development servers...${NC}"

# Run backend and frontend concurrently
concurrently \
    --kill-others \
    --prefix "[{name}]" \
    --names "backend,frontend" \
    --prefix-colors "yellow.bold,cyan.bold" \
    "cd backend && npm run dev" \
    "http-server -p 3000"

# Cleanup on exit
trap 'jobs -p | xargs -r kill' EXIT
