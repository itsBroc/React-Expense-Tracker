const Transaction = require('../models/Transaction');
const { normalizeTransactionInput } = require('../utils/money');
const { getUserFilter, withUser } = require('../utils/userScope');

// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  public
exports.getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find(getUserFilter(req)).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'server error'
        })
    }
}

// @desc    Add a transactions
// @route   POST /api/v1/transactions
// @access  public
exports.addTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.create(withUser(req, normalizeTransactionInput(req.body)));
    
        return res.status(201).json({
            success: true,
            data: transaction
        }) 
    } catch (error) {
        if(error.name === 'MoneyValidationError'){
            return res.status(400).json({
                success: false,
                error: error.message
            })
        }

        if(error.name === 'ValidationError'){
            const messages = Object.values(error.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                error: messages
            })
        } else {
            return res.status(500).json({
            success: false,
            error: 'server error'
            })
        }
    }


}

// @desc    Delete transaction
// @route   DELETE /api/v1/transactions/:id
// @access  public
exports.deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            ...getUserFilter(req)
        });

        if(!transaction){
            return res.status(404).json({
                success: false,
                error: 'No transaction found'
            });
        }

        await transaction.deleteOne();

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
}
