module.exports = {
    // MongoDB Atlas connection (to be updated with actual URI)
    mongoURI: process.env.MONGODB_URI,
    
    // Frontend URL (to be updated with Netlify URL)
    frontendURL: process.env.FRONTEND_URL,
    
    // Security settings
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    
    // Rate limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    },
    
    // Security headers
    helmet: {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'", process.env.FRONTEND_URL]
            }
        },
        frameguard: {
            action: 'deny'
        }
    }
};
