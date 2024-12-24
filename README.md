# College Application Tracker

A modern web application for tracking and managing college applications with automated deadline reminders and status tracking.

🌟 **Live Demo**: [https://musical-dragon-a3a076.netlify.app](https://musical-dragon-a3a076.netlify.app)

## Features

✨ **Core Features**
- User authentication with secure signup/login
- Track multiple college applications in one place
- Manage application requirements and deadlines
- Real-time status tracking
- Email notifications for deadlines
- Weekly summary reports

🔒 **Security**
- JWT-based authentication
- Secure password hashing
- Rate limiting
- CORS protection
- XSS prevention

📱 **User Experience**
- Clean, modern interface
- Mobile-responsive design
- Real-time updates
- Intuitive navigation

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/anthonyproctor/college-tracker.git
cd college-tracker
```

2. Set up the backend:
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

3. Start the frontend:
```bash
# From project root
npx http-server -p 3000
```

4. Visit `http://localhost:3000` in your browser

## Deployment

### One-Click Deploy
1. Fork this repository
2. Click the deploy buttons below:

[![Deploy Backend to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)
[![Deploy Frontend to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/anthonyproctor/college-tracker)

### Manual Deployment
Follow the instructions in [backend/DEPLOY.md](backend/DEPLOY.md) for detailed deployment steps.

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

### Frontend (api.config.js)
```javascript
export const API_CONFIG = {
    BASE_URL: 'http://localhost:5001/api/v1'
};
```

## API Documentation

### Auth Endpoints
- `POST /api/v1/auth/register` - Create new account
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Applications Endpoints
- `GET /api/v1/applications` - List all applications
- `POST /api/v1/applications` - Create application
- `PUT /api/v1/applications/:id` - Update application
- `DELETE /api/v1/applications/:id` - Delete application

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Support

- 📧 Email: anthonyproctor@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/anthonyproctor/college-tracker/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
