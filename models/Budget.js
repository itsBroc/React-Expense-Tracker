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
    limitMinor: {
        type: Number,
        min: [1, 'Budget limit must be greater than zero'],
        validate: {
            validator: Number.isInteger,
            message: 'Budget limit minor units must be an integer'
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

BudgetSchema.index({ userId: 1, category: 1, period: 1 });

module.exports = mongoose.model('Budget', BudgetSchema);
