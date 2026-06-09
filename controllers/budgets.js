const Budget = require('../models/Budget');
const { getUserFilter, stripOwnershipFields, withUser } = require('../utils/userScope');

function sendValidationError(error, res) {
    const messages = Object.values(error.errors).map(val => val.message);

    return res.status(400).json({
        success: false,
        error: messages
    });
}

// @desc    Get all budgets
// @route   GET /api/v1/budgets
// @access  public
exports.getBudgets = async (req, res, next) => {
    try {
        const budgets = await Budget.find(getUserFilter(req)).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: budgets.length,
            data: budgets
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'server error'
        });
    }
};

// @desc    Add a budget
// @route   POST /api/v1/budgets
// @access  public
exports.addBudget = async (req, res, next) => {
    try {
        const budget = await Budget.create(withUser(req, req.body));

        return res.status(201).json({
            success: true,
            data: budget
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return sendValidationError(error, res);
        }

        return res.status(500).json({
            success: false,
            error: 'server error'
        });
    }
};

// @desc    Update a budget
// @route   PUT /api/v1/budgets/:id
// @access  public
exports.updateBudget = async (req, res, next) => {
    try {
        const budget = await Budget.findOneAndUpdate(
            {
                _id: req.params.id,
                ...getUserFilter(req)
            },
            stripOwnershipFields(req.body),
            {
                new: true,
                runValidators: true
            }
        );

        if (!budget) {
            return res.status(404).json({
                success: false,
                error: 'No budget found'
            });
        }

        return res.status(200).json({
            success: true,
            data: budget
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return sendValidationError(error, res);
        }

        return res.status(500).json({
            success: false,
            error: 'server error'
        });
    }
};

// @desc    Delete a budget
// @route   DELETE /api/v1/budgets/:id
// @access  public
exports.deleteBudget = async (req, res, next) => {
    try {
        const budget = await Budget.findOne({
            _id: req.params.id,
            ...getUserFilter(req)
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                error: 'No budget found'
            });
        }

        await budget.deleteOne();

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
