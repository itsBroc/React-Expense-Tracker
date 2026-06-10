const Goal = require('../models/Goal');
const { normalizeGoalInput } = require('../utils/money');
const { getUserFilter, stripOwnershipFields, withUser } = require('../utils/userScope');

function sendValidationError(error, res) {
    const messages = Object.values(error.errors).map(val => val.message);

    return res.status(400).json({
        success: false,
        error: messages
    });
}

// @desc    Get all goals
// @route   GET /api/v1/goals
// @access  public
exports.getGoals = async (req, res, next) => {
    try {
        const goals = await Goal.find(getUserFilter(req)).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: goals.length,
            data: goals
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'server error'
        });
    }
};

// @desc    Add a goal
// @route   POST /api/v1/goals
// @access  public
exports.addGoal = async (req, res, next) => {
    try {
        const goal = await Goal.create(withUser(req, normalizeGoalInput(req.body)));

        return res.status(201).json({
            success: true,
            data: goal
        });
    } catch (error) {
        if (error.name === 'MoneyValidationError') {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        if (error.name === 'ValidationError') {
            return sendValidationError(error, res);
        }

        return res.status(500).json({
            success: false,
            error: 'server error'
        });
    }
};

// @desc    Update a goal
// @route   PUT /api/v1/goals/:id
// @access  public
exports.updateGoal = async (req, res, next) => {
    try {
        const goal = await Goal.findOneAndUpdate(
            {
                _id: req.params.id,
                ...getUserFilter(req)
            },
            stripOwnershipFields(normalizeGoalInput(req.body)),
            {
                new: true,
                runValidators: true
            }
        );

        if (!goal) {
            return res.status(404).json({
                success: false,
                error: 'No goal found'
            });
        }

        return res.status(200).json({
            success: true,
            data: goal
        });
    } catch (error) {
        if (error.name === 'MoneyValidationError') {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        if (error.name === 'ValidationError') {
            return sendValidationError(error, res);
        }

        return res.status(500).json({
            success: false,
            error: 'server error'
        });
    }
};

// @desc    Delete a goal
// @route   DELETE /api/v1/goals/:id
// @access  public
exports.deleteGoal = async (req, res, next) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
            ...getUserFilter(req)
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                error: 'No goal found'
            });
        }

        await goal.deleteOne();

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
