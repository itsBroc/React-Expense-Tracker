const Category = require('../models/Category');
const { ensureDefaultCategories, normalizeCategoryInput } = require('../utils/categories');
const { getUserFilter, stripOwnershipFields, withUser } = require('../utils/userScope');

function sendValidationError(error, res) {
    const messages = Object.values(error.errors).map(val => val.message);

    return res.status(400).json({
        success: false,
        error: messages
    });
}

exports.getCategories = async (req, res) => {
    try {
        await ensureDefaultCategories(req);
        const categories = await Category.find(getUserFilter(req)).sort({ type: 1, name: 1 });

        return res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'server error'
        });
    }
};

exports.addCategory = async (req, res) => {
    try {
        const category = await Category.create(withUser(req, normalizeCategoryInput(req.body)));

        return res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return sendValidationError(error, res);
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Category name already exists for this type'
            });
        }

        return res.status(500).json({
            success: false,
            error: 'server error'
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndUpdate(
            {
                _id: req.params.id,
                ...getUserFilter(req)
            },
            stripOwnershipFields(normalizeCategoryInput(req.body)),
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'No category found'
            });
        }

        return res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return sendValidationError(error, res);
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Category name already exists for this type'
            });
        }

        return res.status(500).json({
            success: false,
            error: 'server error'
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            _id: req.params.id,
            ...getUserFilter(req)
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'No category found'
            });
        }

        await category.deleteOne();

        return res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'server error'
        });
    }
};
