# Setting Up GitHub Secrets for College Tracker

Please follow these steps to set up the required secrets for automated deployments:

1. Go to your GitHub repository: https://github.com/anthonyproctor/college-tracker/settings/secrets/actions

2. Add the following secrets:

## Netlify Configuration
Add these secrets for Netlify deployment:

- `NETLIFY_SITE_ID`: b4b40bd3-a1bf-4c12-8d34-6dcf17b7b26f
- `NETLIFY_AUTH_TOKEN`: Get this from Netlify:
  1. Go to https://app.netlify.com/user/applications#personal-access-tokens
  2. Click "New access token"
  3. Give it a name (e.g., "College Tracker GitHub Actions")
  4. Copy the generated token

## Render Configuration
Add these secrets for Render deployment:

1. Get your Render API key:
   - Visit: https://dashboard.render.com/account/api-keys
   - Create a new API key
   - Add it as `RENDER_API_KEY`

2. Get your Render service ID:
   - Visit your Render dashboard
   - Go to the college-tracker-api service
   - Copy the service ID from the URL
   - Add it as `RENDER_SERVICE_ID`

## Quick Setup Commands

Run these commands to get your tokens:

```bash
# Get Netlify site ID
netlify status

# Get Render service ID
render list
```

## Verification

After adding all secrets:

1. Go to GitHub Actions tab: https://github.com/anthonyproctor/college-tracker/actions
2. You should see:
   - The CI/CD workflow enabled
   - Tests running on pull requests
   - Automatic deployments on main branch

## Testing Deployment

1. Make a small change to your repository
2. Push to main branch:
   ```bash
   git add .
   git commit -m "test deployment"
   git push
   ```
3. Check GitHub Actions tab for deployment status
4. Verify deployment at: https://musical-dragon-a3a076.netlify.app

## Troubleshooting

If deployments fail:
1. Check GitHub Actions logs
2. Verify all secrets are set correctly
3. Ensure Netlify and Render services are properly configured
4. Check repository permissions in Netlify and Render
