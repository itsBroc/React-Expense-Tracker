const mongoose = require('mongoose');

const accountTypes = ['checking', 'savings', 'credit_card', 'cash', 'investment', 'loan', 'other'];

const AccountSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },
        name: {
            type: String,
            trim: true,
            required: [true, 'Please add an account name']
        },
        type: {
            type: String,
            enum: accountTypes,
            default: 'checking'
        },
        currency: {
            type: String,
            uppercase: true,
            trim: true,
            default: 'AUD',
            minlength: 3,
            maxlength: 3
        },
        openingBalanceMinor: {
            type: Number,
            default: 0,
            validate: {
                validator: Number.isInteger,
                message: 'Opening balance minor units must be an integer'
            }
        },
        currentBalanceMinor: {
            type: Number,
            default: 0,
            validate: {
                validator: Number.isInteger,
                message: 'Current balance minor units must be an integer'
            }
        },
        notes: {
            type: String,
            trim: true
        },
        isArchived: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

AccountSchema.index({ userId: 1, type: 1, isArchived: 1 });
AccountSchema.index({ userId: 1, name: 1 });

module.exports = mongoose.model('Account', AccountSchema);
module.exports.accountTypes = accountTypes;
