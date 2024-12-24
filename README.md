# College Application Tracker

A web application to help students track and manage their college applications.

## Features

- User authentication (signup/login)
- Track multiple college applications
- Manage application requirements and deadlines
- Status tracking (Not Started, In Progress, Submitted)
- Email notifications for deadlines and updates
- Weekly summary reports

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT
- Email: Nodemailer

## Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd college-tracker
```

2. Install dependencies:
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies (if using package manager)
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# In backend directory
cp .env.example .env
# Edit .env with your local configuration
```

4. Start MongoDB:
```bash
brew services start mongodb-community
```

5. Start the development servers:
```bash
# Backend (from backend directory)
npm run dev

# Frontend (from project root)
npx http-server -p 3000
```

## Production Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure environment variables (see .env.production.example)
4. Set build command: `npm install && npm run build`
5. Set start command: `npm start`

### Frontend Deployment (Netlify)

1. Create a new site on Netlify
2. Connect your GitHub repository
3. Configure build settings:
   - Base directory: `/`
   - Build command: (none required for static files)
   - Publish directory: `/`
4. Update API URL in `scripts/api.js` to point to your production backend

### MongoDB Atlas Setup

1. Create a free cluster on MongoDB Atlas
2. Create a database user
3. Get your connection string
4. Add connection string to your backend environment variables

## Environment Variables

### Development
See `.env.example` for required environment variables.

### Production
See `.env.production.example` for required environment variables.

## API Documentation

### Authentication Endpoints
- POST `/api/v1/auth/register` - Register new user
- POST `/api/v1/auth/login` - Login user
- GET `/api/v1/auth/me` - Get current user

### Application Endpoints
- GET `/api/v1/applications` - Get all applications
- POST `/api/v1/applications` - Create new application
- PUT `/api/v1/applications/:id` - Update application
- DELETE `/api/v1/applications/:id` - Delete application

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
