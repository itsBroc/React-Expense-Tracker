const mongoose = require('mongoose');
const Account = require('../models/Account');
const { normalizeTransactionInput, parseMoneyToMinor } = require('./money');
const { getUserFilter } = require('./userScope');

class TransactionValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TransactionValidationError';
    }
}

async function normalizeTransactionForUser(req, body) {
    const transaction = normalizeTransactionInput(body);
    const hasExplicitCurrency = Object.prototype.hasOwnProperty.call(body, 'currency');

    if (transaction.accountId === '') {
        delete transaction.accountId;
    }

    if (!transaction.accountId) {
        return transaction;
    }

    if (!mongoose.isValidObjectId(transaction.accountId)) {
        throw new TransactionValidationError('Selected account was not found');
    }

    const account = await Account.findOne({
        _id: transaction.accountId,
        ...getUserFilter(req)
    });

    if (!account) {
        throw new TransactionValidationError('Selected account was not found');
    }

    transaction.accountId = account._id;
    if (!hasExplicitCurrency) {
        transaction.currency = account.currency;
    }

    return transaction;
}

function getTransactionAmountMinor(transaction) {
    if (Number.isSafeInteger(transaction.amountMinor)) {
        return transaction.amountMinor;
    }

    return parseMoneyToMinor(transaction.amount);
}

function getBalanceAdjustment(transaction, direction = 1) {
    if (!transaction.accountId) {
        return null;
    }

    return {
        accountId: transaction.accountId,
        amountMinor: getTransactionAmountMinor(transaction) * direction
    };
}

async function applyAccountBalanceAdjustment(req, transaction, direction = 1) {
    const adjustment = getBalanceAdjustment(transaction, direction);

    if (!adjustment) {
        return;
    }

    await Account.updateOne(
        {
            _id: adjustment.accountId,
            ...getUserFilter(req)
        },
        {
            $inc: { currentBalanceMinor: adjustment.amountMinor }
        },
        { runValidators: true }
    );
}

module.exports = {
    applyAccountBalanceAdjustment,
    getBalanceAdjustment,
    getTransactionAmountMinor,
    TransactionValidationError,
    normalizeTransactionForUser
};
