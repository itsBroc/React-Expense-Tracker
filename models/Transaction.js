const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: String,
        index: true
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        index: true
    },
    text: {
        type: String,
        trim: true,
        required: [true, 'Please add some text']
    },
    amount: {
        type: Number,
        required: [true, 'Please add a positive or negative number']
    },
    amountMinor: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: 'Amount minor units must be an integer'
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
    category: {
        type: String,
        trim: true,
        default: 'Other spending'
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

TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ userId: 1, category: 1, createdAt: -1 });
TransactionSchema.index({ userId: 1, accountId: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
