const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    userId: {
        type: String,
        index: true
    },
    name: {
        type: String,
        trim: true,
        required: [true, 'Please add a goal name']
    },
    target: {
        type: Number,
        required: [true, 'Please add a target amount'],
        min: [1, 'Target must be greater than zero']
    },
    targetAmountMinor: {
        type: Number,
        min: [1, 'Target must be greater than zero'],
        validate: {
            validator: Number.isInteger,
            message: 'Target minor units must be an integer'
        }
    },
    current: {
        type: Number,
        default: 0,
        min: [0, 'Current savings cannot be negative']
    },
    currentAmountMinor: {
        type: Number,
        default: 0,
        min: [0, 'Current savings cannot be negative'],
        validate: {
            validator: Number.isInteger,
            message: 'Current savings minor units must be an integer'
        }
    },
    currency: {
        type: String,
        uppercase: true,
        trim: true,
        default: 'AUD',
        minlength: 3,
        maxlength: 3
    },
    dueDate: {
        type: Date
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    notes: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

GoalSchema.index({ userId: 1, dueDate: 1 });

module.exports = mongoose.model('Goal', GoalSchema);
