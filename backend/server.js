const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Route files
const auth = require('./routes/auth');
const applications = require('./routes/applications');
const test = process.env.NODE_ENV === 'test' ? require('./routes/test') : null;

// Create Express app
const app = express();

// Security middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://college-tracker-app.netlify.app'
        : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Security headers
const helmet = require('helmet');
app.use(helmet());

// Prevent XSS attacks
const xss = require('xss-clean');
app.use(xss());

// Connect to MongoDB (only if not testing)
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
}

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/applications', applications);
if (process.env.NODE_ENV === 'test') {
    app.use('/api/v1/test', test);
}

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to College Application Tracker API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' 
            ? 'Something went wrong!' 
            : err.message
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    if (server) {
        server.close(() => process.exit(1));
    }
});

// Start server (only if not testing)
let server;
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    server = app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

module.exports = app;
