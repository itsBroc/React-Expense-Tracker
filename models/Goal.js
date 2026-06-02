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
    current: {
        type: Number,
        default: 0,
        min: [0, 'Current savings cannot be negative']
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

module.exports = mongoose.model('Goal', GoalSchema);
