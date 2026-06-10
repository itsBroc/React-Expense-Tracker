const DEFAULT_CURRENCY = 'AUD';

class MoneyValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MoneyValidationError';
    }
}

function normalizeCurrency(currency = DEFAULT_CURRENCY) {
    const normalized = String(currency || DEFAULT_CURRENCY).trim().toUpperCase();

    if (!/^[A-Z]{3}$/.test(normalized)) {
        throw new MoneyValidationError('Currency must be a 3-letter ISO code');
    }

    return normalized;
}

function parseMoneyToMinor(value) {
    if (value === null || value === undefined || value === '') {
        throw new MoneyValidationError('Money amount is required');
    }

    const normalized = String(value).trim();

    if (!/^-?\d+(\.\d{1,2})?$/.test(normalized)) {
        throw new MoneyValidationError('Money amount must have no more than 2 decimal places');
    }

    const isNegative = normalized.startsWith('-');
    const absolute = isNegative ? normalized.slice(1) : normalized;
    const [major, minor = ''] = absolute.split('.');
    const amount = Number(major) * 100 + Number(minor.padEnd(2, '0'));
    const signedAmount = isNegative ? -amount : amount;

    if (!Number.isSafeInteger(signedAmount)) {
        throw new MoneyValidationError('Money amount is too large');
    }

    return signedAmount;
}

function minorToMajor(minor) {
    if (!Number.isSafeInteger(minor)) {
        throw new MoneyValidationError('Minor amount must be an integer');
    }

    return minor / 100;
}

function resolveMinorAmount(body, decimalField, minorField) {
    if (Number.isSafeInteger(body[minorField])) {
        return body[minorField];
    }

    if (Object.prototype.hasOwnProperty.call(body, decimalField)) {
        return parseMoneyToMinor(body[decimalField]);
    }

    return undefined;
}

function withMoneyFields(body, decimalField, minorField, options = {}) {
    const nextBody = { ...body };
    const minorAmount = resolveMinorAmount(nextBody, decimalField, minorField);

    if (minorAmount !== undefined) {
        nextBody[minorField] = minorAmount;
        nextBody[decimalField] = minorToMajor(minorAmount);
    } else if (options.defaultMinor !== undefined) {
        nextBody[minorField] = options.defaultMinor;
        nextBody[decimalField] = minorToMajor(options.defaultMinor);
    }

    if (minorAmount !== undefined || (options.ensureCurrency && Object.prototype.hasOwnProperty.call(nextBody, 'currency'))) {
        nextBody.currency = normalizeCurrency(nextBody.currency);
    }

    return nextBody;
}

function normalizeTransactionInput(body) {
    return withMoneyFields(body, 'amount', 'amountMinor', { ensureCurrency: true });
}

function normalizeBudgetInput(body) {
    return withMoneyFields(body, 'limit', 'limitMinor', { ensureCurrency: true });
}

function normalizeGoalInput(body) {
    return withMoneyFields(
        withMoneyFields(body, 'target', 'targetAmountMinor', { ensureCurrency: true }),
        'current',
        'currentAmountMinor'
    );
}

module.exports = {
    DEFAULT_CURRENCY,
    MoneyValidationError,
    minorToMajor,
    normalizeBudgetInput,
    normalizeCurrency,
    normalizeGoalInput,
    normalizeTransactionInput,
    parseMoneyToMinor,
    withMoneyFields
};
