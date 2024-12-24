const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    collegeName: {
        type: String,
        required: [true, 'Please add a college name'],
        trim: true
    },
    deadline: {
        type: Date,
        required: [true, 'Please add an application deadline']
    },
    status: {
        type: String,
        required: [true, 'Please add an application status'],
        enum: ['not-started', 'in-progress', 'submitted'],
        default: 'not-started'
    },
    requirements: [{
        name: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    }],
    applicationFee: {
        type: Number,
        min: 0
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot be more than 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
ApplicationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Cascade delete requirements when an application is deleted
ApplicationSchema.pre('remove', async function(next) {
    await this.model('Requirement').deleteMany({ application: this._id });
    next();
});

// Add indexes for better query performance
ApplicationSchema.index({ user: 1, deadline: 1 });
ApplicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', ApplicationSchema);
