# College Application Tracker

A modern web application for tracking and managing college applications with automated deadline reminders and status tracking.

🌟 **Live Demo**: [https://college-tracker-app.netlify.app](https://college-tracker-app.netlify.app)

## Project Structure

```
college-tracker/
├── backend/           # Node.js/Express backend
├── docs/             # Documentation
├── cypress/          # End-to-end tests
├── scripts/          # Utility scripts
├── styles/          # CSS styles
└── *.html           # Frontend pages
```

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

## Documentation

- [Deployment Guide](docs/DEPLOYMENT.md)
- [Backend API](backend/README.md)
- [Testing Guide](docs/TESTING.md)

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Development

1. Clone and Install:
```bash
git clone https://github.com/anthonyproctor/college-tracker.git
cd college-tracker
./scripts/setup-dev.sh
```

2. Start Development Servers:
```bash
./ct dev
```

3. Run Tests:
```bash
# Backend tests
./ct test backend

# End-to-end tests
./ct test e2e
```

### Deployment

1. Configure Secrets:
```bash
# Set up environment variables
cp .env.deploy .env.deploy.local
nano .env.deploy.local
```

2. Deploy:
```bash
./scripts/deploy.sh
```

View the [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

## Environment Setup

### Development
```bash
# Backend
cp backend/.env.example backend/.env
nano backend/.env

# Frontend
cp scripts/api.config.example.js scripts/api.config.js
nano scripts/api.config.js
```

### Production
```bash
# Copy deployment config
cp .env.deploy .env.deploy.local

# Edit configuration
nano .env.deploy.local
## Support

- 📧 Email: anthonyproctor@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/anthonyproctor/college-tracker/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
