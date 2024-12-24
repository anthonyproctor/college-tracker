# CLI Deployment Guide

Deploy the College Application Tracker using command-line tools.

## Prerequisites

1. Install required CLIs:
```bash
npm install -g netlify-cli
```

2. Get your API keys:
- Render API key from: https://dashboard.render.com/account/api-keys
- MongoDB Atlas connection string
- Email service credentials

## Quick Deploy

1. Set up environment variables:
```bash
# Copy deployment environment template
cp .env.deploy .env.deploy.local

# Edit with your credentials
nano .env.deploy.local

# Required variables:
# - RENDER_API_KEY
# - MONGODB_URI
# - JWT_SECRET
# - EMAIL_SERVICE
# - EMAIL_USER
# - EMAIL_PASSWORD
```

2. Run deployment script:
```bash
# Load environment variables and run deployment
source .env.deploy.local && ./deploy-production.sh
```

## Manual Steps

### Deploy Backend Only:
```bash
# Set Render API key
export RENDER_API_KEY=your_key_here

# Deploy backend
cd backend
curl -X POST "https://api.render.com/v1/services" \
    -H "Authorization: Bearer $RENDER_API_KEY" \
    -H "Content-Type: application/json" \
    -d @- << EOF
{
    "name": "college-tracker-api",
    "owner": "anthonyproctor",
    "repo": "https://github.com/anthonyproctor/college-tracker",
    "branch": "main",
    "autoDeploy": true
}
EOF
```

### Deploy Frontend Only:
```bash
# Login to Netlify (first time only)
netlify login

# Deploy frontend
netlify deploy --prod
```

## Monitoring

1. Check backend status:
```bash
curl -H "Authorization: Bearer $RENDER_API_KEY" \
    "https://api.render.com/v1/services?name=college-tracker-api"
```

2. Check frontend deployment:
```bash
netlify status
```

## Troubleshooting

1. Backend Issues:
```bash
# Check Render logs
curl -H "Authorization: Bearer $RENDER_API_KEY" \
    "https://api.render.com/v1/services/{service-id}/logs"
```

2. Frontend Issues:
```bash
# Check Netlify deployment
netlify deploy:list

# Check build logs
netlify deploy:logs
```

## Rolling Back

1. Backend:
```bash
# List deployments
curl -H "Authorization: Bearer $RENDER_API_KEY" \
    "https://api.render.com/v1/services/{service-id}/deploys"

# Rollback to specific deployment
curl -X POST -H "Authorization: Bearer $RENDER_API_KEY" \
    "https://api.render.com/v1/services/{service-id}/deploys/{deploy-id}/rollback"
```

2. Frontend:
```bash
# List previous deploys
netlify deploy:list

# Rollback to previous deploy
netlify deploy:rollback
