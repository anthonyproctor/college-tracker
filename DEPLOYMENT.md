# College Tracker Deployment Guide

## Current Deployment Status

- Frontend URL: https://college-tracker-app.netlify.app
- Backend URL: https://college-tracker-api.onrender.com/api/v1
- GitHub Repository: https://github.com/anthonyproctor/college-tracker

## Quick Commands

```bash
# Deploy to production
./scripts/deploy.sh

# View deployment status
netlify status

# Open Netlify dashboard
netlify open

# View recent deploys
netlify deploys
```

## Manual Configuration Steps

1. Set Environment Variables:
   - Go to: https://app.netlify.com/sites/college-tracker-app/settings/env
   - Add:
     ```
     API_URL=https://college-tracker-api.onrender.com/api/v1
     ```

2. Configure Build Settings:
   - Go to: https://app.netlify.com/sites/college-tracker-app/settings/deploys
   - Verify:
     * Build command: (none)
     * Publish directory: .
     * Deploy notifications: Enabled
     * Branch deploys: Enabled

3. Set up Branch Deploys:
   - Go to: https://app.netlify.com/sites/college-tracker-app/settings/deploys#deploy-contexts
   - Enable:
     * Branch deploys
     * Deploy previews
     * Auto publishing

## Continuous Deployment

The site is configured for continuous deployment:
1. Push to main branch triggers production deployment
2. Pull requests create preview deployments
3. Branch pushes create branch-specific deployments

## Monitoring

1. View Netlify Status:
   ```bash
   netlify status
   netlify open
   ```

2. Check Recent Deploys:
   ```bash
   netlify deploys
   ```

3. View Logs:
   - Build logs: https://app.netlify.com/sites/college-tracker-app/deploys
   - Function logs: https://app.netlify.com/sites/college-tracker-app/functions
   - Analytics: https://app.netlify.com/sites/college-tracker-app/analytics

## Troubleshooting

1. Build Failures:
   ```bash
   netlify build --debug
   ```

2. Deploy Issues:
   ```bash
   netlify deploy --prod --debug
   ```

3. Clear Cache:
   ```bash
   netlify deploy --prod --clear
   ```

## Rolling Back

To roll back to a previous deploy:
1. View deploys:
   ```bash
   netlify deploys
   ```
2. Copy the deploy ID
3. Publish that deploy:
   ```bash
   netlify deploy --prod --deploy-id <deploy-id>
   ```

## Support

- Netlify Status Page: https://www.netlifystatus.com/
- Documentation: https://docs.netlify.com/
- GitHub Issues: https://github.com/anthonyproctor/college-tracker/issues
