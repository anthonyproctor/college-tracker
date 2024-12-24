const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');
const emailService = require('../utils/emailService');
const User = require('../models/User');

// Helper function to check deadlines
const checkDeadline = async (application, user) => {
    const deadline = new Date(application.deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    // Send reminder for applications due in 7 days or less
    if (daysUntilDeadline <= 7 && daysUntilDeadline > 0) {
        try {
            await emailService.sendDeadlineReminder(user, application);
        } catch (error) {
            console.error('Failed to send deadline reminder:', error);
        }
    }
};

// Protect all routes
router.use(protect);

// Get all applications for logged in user
router.get('/', async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user.id })
            .sort({ deadline: 1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Error retrieving applications'
        });
    }
});

// Get single application
router.get('/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Application not found'
            });
        }

        // Make sure user owns application
        if (application.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this application'
            });
        }

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Error retrieving application'
        });
    }
});

// Create new application
router.post('/', async (req, res) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const user = await User.findById(req.user.id);
        const application = await Application.create(req.body);
        
        // Send email notification for new application
        try {
            await emailService.sendDeadlineReminder(user, application);
        } catch (error) {
            console.error('Failed to send new application notification:', error);
        }

        res.status(201).json({
            success: true,
            data: application
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Error creating application'
        });
    }
});

// Update application
router.put('/:id', async (req, res) => {
    try {
        let application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Application not found'
            });
        }

        // Make sure user owns application
        if (application.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to update this application'
            });
        }

        const user = await User.findById(req.user.id);
        const oldStatus = application.status;
        
        application = await Application.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        // Send email notification for status change
        if (oldStatus !== application.status) {
            try {
                await emailService.sendStatusUpdate(user, application, oldStatus);
            } catch (error) {
                console.error('Failed to send status update notification:', error);
            }
        }

        // Check deadline and send reminder if needed
        await checkDeadline(application, user);

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Error updating application'
        });
    }
});

// Delete application
router.delete('/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Application not found'
            });
        }

        // Make sure user owns application
        if (application.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to delete this application'
            });
        }

        await Application.deleteOne({ _id: req.params.id });

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Error deleting application'
        });
    }
});

module.exports = router;
