# GitHub Secrets Setup

To enable automated deployments, you need to configure the following secrets in your GitHub repository:

1. Go to your repository settings:
   - Navigate to Settings > Secrets and variables > Actions
   - Click "New repository secret"

2. Add the following secrets:

## Render Secrets
- `RENDER_API_KEY`: Your Render API key
  * Go to https://dashboard.render.com/account/api-keys
  * Create a new API key
  * Copy and paste the key

- `RENDER_SERVICE_ID`: Your Render service ID
  * Go to your service in Render dashboard
  * Copy the service ID from the URL or service info

## Netlify Secrets
- `NETLIFY_AUTH_TOKEN`: Your Netlify authentication token
  * Go to https://app.netlify.com/user/applications#personal-access-tokens
  * Create a new access token
  * Copy and paste the token

- `NETLIFY_SITE_ID`: Your Netlify site ID
  * Go to Site settings > General > Site details
  * Copy the Site ID

## Steps to Get Secrets

### Render
1. Get API Key:
   ```bash
   # Login to Render CLI
   render login

   # Get API key
   render api-key
   ```

2. Get Service ID:
   ```bash
   # List services
   render list

   # Copy the service ID for college-tracker-api
   ```

### Netlify
1. Get Auth Token:
   ```bash
   # Login to Netlify CLI
   netlify login

   # Get auth token
   netlify status
   ```

2. Get Site ID:
   ```bash
   # List sites
   netlify sites:list

   # Copy the site ID for college-tracker
   ```

## Verifying Configuration

After adding all secrets, your GitHub Actions workflow will:
1. Run tests on every push and pull request
2. Deploy to Render and Netlify on main branch changes
3. Add deployment status comments to pull requests
4. Create deployment status checks

To test the configuration:
1. Make a small change to your repository
2. Push to main branch
3. Check the Actions tab for deployment status
4. Verify the deployment on both Render and Netlify
