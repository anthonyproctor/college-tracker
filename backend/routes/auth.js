const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Register user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                error: 'User already exists'
            });
        }

        // Create user
        user = await User.create({
            name,
            email,
            password
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Error registering user'
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide an email and password'
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Error logging in'
        });
    }
});

// Get current logged in user
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Error getting user info'
        });
    }
});

// Logout user / clear cookie
router.get('/logout', (req, res) => {
    res.status(200).json({
        success: true,
        data: {}
    });
});

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token
    });
};

module.exports = router;
