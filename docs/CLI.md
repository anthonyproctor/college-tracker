# College Tracker CLI

A comprehensive command-line interface for managing the College Application Tracker.

## Quick Start

```bash
# Start development environment
./ct dev

# Deploy to production
./ct deploy

# Monitor application
./ct monitor dev  # Development environment
./ct monitor prod # Production environment
```

## Available Commands

### Development

```bash
# Set up development environment
./ct setup

# Start development servers
./ct dev

# Reset and restart development
./ct dev --reset
```

### Deployment

```bash
# Deploy to production
./ct deploy

# Monitor production
./ct monitor prod

# View production logs
./ct logs prod
```

### Database Operations

```bash
# Set up test database
./ct db setup

# Reset database
./ct db reset

# Backup database
./ct db backup
```

### Monitoring

```bash
# Monitor development environment
./ct monitor dev

# Monitor production environment
./ct monitor prod
```

### Logs

```bash
# View development logs
./ct logs dev

# View production logs
./ct logs prod
```

## Environment Setup

1. Development:
```bash
# Copy environment template
cp .env.example .env

# Set up development environment
./ct setup
```

2. Production:
```bash
# Copy deployment config
cp .env.deploy .env.deploy.local

# Edit deployment configuration
nano .env.deploy.local

# Deploy
./ct deploy
```

## Common Workflows

1. Start Development:
```bash
./ct setup  # First time only
./ct dev
```

2. Deploy Changes:
```bash
# Commit changes
git add .
git commit -m "Your changes"
git push

# Deploy
./ct deploy
```

3. Monitor Application:
```bash
# Development
./ct monitor dev

# Production
./ct monitor prod
```

4. Database Management:
```bash
# Reset development database
./ct db reset

# Backup before major changes
./ct db backup
```

## Troubleshooting

1. Development Issues:
```bash
# Reset development environment
./ct dev --reset

# Check logs
./ct logs dev
```

2. Production Issues:
```bash
# Check status
./ct monitor prod

# View logs
./ct logs prod
```

## Additional Resources

- Full deployment guide: [DEPLOY_CLI.md](DEPLOY_CLI.md)
- Development setup: [setup-dev.sh](setup-dev.sh)
- Monitoring details: [monitor.sh](monitor.sh)

## Support

For issues and feature requests, please use the GitHub issue tracker:
https://github.com/anthonyproctor/college-tracker/issues
