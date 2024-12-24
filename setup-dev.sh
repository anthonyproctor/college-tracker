#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Setting up College Application Tracker development environment...${NC}\n"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    echo -e "${RED}MongoDB not found. Installing...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install mongodb-community
        brew services start mongodb-community
    else
        echo "Please install MongoDB manually for your system"
        exit 1
    fi
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js not found. Please install Node.js v14 or higher${NC}"
    exit 1
fi

# Install backend dependencies
echo -e "\n${YELLOW}Installing backend dependencies...${NC}"
cd backend
npm install

# Create development environment file
echo -e "\n${YELLOW}Creating development environment file...${NC}"
cat > .env << EOL
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/college-tracker
JWT_SECRET=dev-secret-key
JWT_EXPIRE=24h
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EOL

# Create test data script
echo -e "\n${YELLOW}Creating database setup script...${NC}"
cat > scripts/setup-db.js << EOL
const mongoose = require('mongoose');
const User = require('../models/User');
const Application = require('../models/Application');

mongoose.connect('mongodb://localhost:27017/college-tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function setupTestData() {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Application.deleteMany({});

        // Create test user
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        });

        // Create sample applications
        const applications = [
            {
                user: user._id,
                collegeName: 'Test University',
                deadline: new Date('2024-12-31'),
                status: 'in-progress',
                requirements: [
                    { name: 'Common App', completed: true },
                    { name: 'Transcripts', completed: false }
                ],
                applicationFee: 75,
                notes: 'Test application'
            }
        ];

        await Application.create(applications);
        console.log('Test data created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating test data:', error);
        process.exit(1);
    }
}

setupTestData();
EOL

# Add development scripts to package.json
node -e "
const pkg = require('./package.json');
pkg.scripts = {
    ...pkg.scripts,
    'dev': 'NODE_ENV=development nodemon server.js',
    'setup-db': 'node scripts/setup-db.js'
};
require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

cd ..

# Install http-server globally if not present
if ! command -v http-server &> /dev/null; then
    echo -e "\n${YELLOW}Installing http-server...${NC}"
    npm install -g http-server
fi

echo -e "\n${GREEN}Setup complete!${NC}"
echo -e "\n${YELLOW}To start development servers:${NC}"
echo "1. Terminal 1: cd backend && npm run dev"
echo "2. Terminal 2: http-server -p 3000"
echo -e "\n${YELLOW}To set up test data:${NC}"
echo "cd backend && npm run setup-db"
echo -e "\n${YELLOW}Test user credentials:${NC}"
echo "Email: test@example.com"
echo "Password: password123"
