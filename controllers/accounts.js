const Account = require('../models/Account');
const { normalizeAccountInput, pickAccountUpdates } = require('../utils/accounts');
const { getUserFilter, withUser } = require('../utils/userScope');

function sendValidationError(error, res) {
    const messages = Object.values(error.errors).map(val => val.message);

    return res.status(400).json({
        success: false,
        error: messages
    });
}

function sendInputError(error, res) {
    return res.status(400).json({
        success: false,
        error: error.message
    });
}

// @desc    Get all accounts
// @route   GET /api/v1/accounts
// @access  private
exports.getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find(getUserFilter(req)).sort({ isArchived: 1, name: 1 });

        return res.status(200).json({
            success: true,
            count: accounts.length,
            data: accounts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'server error'
        });
    }
};

// @desc    Add account
// @route   POST /api/v1/accounts
// @access  private
exports.addAccount = async (req, res) => {
    try {
        const account = await Account.create(withUser(req, normalizeAccountInput(req.body)));

        return res.status(201).json({
            success: true,
            data: account
        });
    } catch (error) {
        if (error.name === 'MoneyValidationError') {
            return sendInputError(error, res);
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

// @desc    Update account
// @route   PUT /api/v1/accounts/:id
// @access  private
exports.updateAccount = async (req, res) => {
    try {
        const account = await Account.findOneAndUpdate(
            {
                _id: req.params.id,
                ...getUserFilter(req)
            },
            pickAccountUpdates(req.body),
            {
                new: true,
                runValidators: true
            }
        );

        if (!account) {
            return res.status(404).json({
                success: false,
                error: 'No account found'
            });
        }

        return res.status(200).json({
            success: true,
            data: account
        });
    } catch (error) {
        if (error.name === 'MoneyValidationError') {
            return sendInputError(error, res);
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

// @desc    Delete account
// @route   DELETE /api/v1/accounts/:id
// @access  private
exports.deleteAccount = async (req, res) => {
    try {
        const account = await Account.findOne({
            _id: req.params.id,
            ...getUserFilter(req)
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                error: 'No account found'
            });
        }

        await account.deleteOne();

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
