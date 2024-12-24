# Deploying the College Tracker Backend

Follow these steps to deploy the backend to Render:

1. Go to [Render Dashboard](https://dashboard.render.com)

2. Click "New +" and select "Web Service"

3. Connect your GitHub repository or use the following settings for manual deploy:
   - Name: college-tracker-api
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free

4. Add the following environment variables:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://college-tracker-admin:<password>@devconnector.kjngi.mongodb.net/college-tracker?retryWrites=true&w=majority
JWT_SECRET=college-tracker-secure-jwt-key-2024
JWT_EXPIRE=24h
FRONTEND_URL=https://musical-dragon-a3a076.netlify.app
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

5. Click "Create Web Service"

## Post-Deployment Steps

1. Once deployed, copy your Render service URL (e.g., https://college-tracker-api.onrender.com)

2. Update the frontend API configuration in `scripts/api.config.js` with your new backend URL

3. Redeploy the frontend to Netlify:
```bash
cd college-tracker
netlify deploy --prod
```

## Testing the Deployment

1. Visit your Netlify URL: https://musical-dragon-a3a076.netlify.app
2. Create a new account
3. Test the login functionality
4. Create and manage college applications

## Troubleshooting

1. Check Render logs for backend issues
2. Verify MongoDB connection string
3. Ensure environment variables are set correctly
4. Check CORS settings if frontend can't connect

## Monitoring

- Monitor your application through Render's dashboard
- Check MongoDB Atlas metrics for database performance
- Review email delivery logs in your email service provider's dashboard

Remember to never commit sensitive information like API keys or passwords to version control.
