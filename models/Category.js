const mongoose = require('mongoose');

const categoryTypes = ['income', 'expense'];

const CategorySchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },
        name: {
            type: String,
            trim: true,
            required: [true, 'Please add a category name']
        },
        type: {
            type: String,
            enum: categoryTypes,
            required: [true, 'Please choose a category type']
        },
        parentCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        },
        icon: {
            type: String,
            trim: true,
            default: 'tag'
        },
        color: {
            type: String,
            trim: true,
            default: '#314d5f',
            match: [/^#[0-9A-Fa-f]{6}$/, 'Category color must be a hex color']
        },
        isDefault: {
            type: Boolean,
            default: false
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

CategorySchema.index({ userId: 1, type: 1, isArchived: 1 });
CategorySchema.index({ userId: 1, type: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);
module.exports.categoryTypes = categoryTypes;
