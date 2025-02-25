const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  public
exports.getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find();

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
        const { text, amount } = req.body;

        const transaction = await Transaction.create(req.body);
    
        return res.status(201).json({
            success: true,
            data: transaction
        }) 
    } catch (error) {
        if(error.name === 'ValidationError'){
            const messages = Object.values(error.errors).map(erro => erro.message);

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
    res.send('DELETE transaction');
}