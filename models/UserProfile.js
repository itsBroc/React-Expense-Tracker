const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        authMode: {
            type: String,
            enum: ['local', 'cognito'],
            default: 'local'
        },
        email: {
            type: String,
            trim: true
        },
        name: {
            type: String,
            trim: true
        },
        baseCurrency: {
            type: String,
            uppercase: true,
            trim: true,
            default: 'AUD',
            minlength: 3,
            maxlength: 3
        },
        locale: {
            type: String,
            trim: true,
            default: 'en-AU'
        },
        timezone: {
            type: String,
            trim: true,
            default: 'Australia/Sydney'
        },
        monthStartDay: {
            type: Number,
            default: 1,
            min: [1, 'Month start day must be at least 1'],
            max: [28, 'Month start day must be no later than 28']
        },
        theme: {
            type: String,
            enum: ['system', 'light', 'dark'],
            default: 'system'
        },
        onboardingComplete: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('UserProfile', UserProfileSchema);
