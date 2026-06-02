const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    userId: {
        type: String,
        index: true
    },
    category: {
        type: String,
        trim: true,
        required: [true, 'Please add a budget category']
    },
    limit: {
        type: Number,
        required: [true, 'Please add a budget limit'],
        min: [1, 'Budget limit must be greater than zero']
    },
    period: {
        type: String,
        enum: ['weekly', 'monthly'],
        default: 'monthly'
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

module.exports = mongoose.model('Budget', BudgetSchema);
