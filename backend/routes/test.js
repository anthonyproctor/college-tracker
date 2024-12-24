const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Application = require('../models/Application');

// Only allow these routes in test environment
router.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
        return res.status(404).json({
            success: false,
            error: 'Test routes only available in test environment'
        });
    }
    next();
});

// Reset database
router.post('/reset', async (req, res) => {
    try {
        await User.deleteMany({});
        await Application.deleteMany({});
        
        res.json({ success: true, message: 'Database reset successful' });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Error resetting database'
        });
    }
});

// Seed test data
router.post('/seed', async (req, res) => {
    try {
        // Create test user
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        });

        // Create sample applications
        const applications = [
            {
                user: user._id,
                collegeName: 'Harvard University',
                deadline: '2024-12-31',
                status: 'in-progress',
                requirements: [
                    { name: 'Common App', completed: true },
                    { name: 'Transcripts', completed: false }
                ],
                applicationFee: 75,
                notes: 'Need to complete essay'
            },
            {
                user: user._id,
                collegeName: 'MIT',
                deadline: '2024-11-30',
                status: 'submitted',
                requirements: [
                    { name: 'Common App', completed: true },
                    { name: 'Transcripts', completed: true }
                ],
                applicationFee: 80,
                notes: 'Submitted on time'
            }
        ];

        await Application.create(applications);
        
        res.json({
            success: true,
            message: 'Test data seeded successfully',
            data: {
                user: {
                    email: user.email,
                    password: 'password123'
                }
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Error seeding test data'
        });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
