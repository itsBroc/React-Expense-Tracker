const { DEFAULT_CURRENCY, normalizeCurrency, parseMoneyToMinor } = require('./money');

const editableAccountFields = ['name', 'type', 'currency', 'openingBalanceMinor', 'currentBalanceMinor', 'notes', 'isArchived'];

function normalizeAccountInput(body = {}) {
    const account = {};

    if (Object.prototype.hasOwnProperty.call(body, 'name')) {
        account.name = String(body.name).trim();
    }

    if (Object.prototype.hasOwnProperty.call(body, 'type')) {
        account.type = body.type;
    }

    if (Object.prototype.hasOwnProperty.call(body, 'notes')) {
        account.notes = String(body.notes).trim();
    }

    if (Object.prototype.hasOwnProperty.call(body, 'isArchived')) {
        account.isArchived = Boolean(body.isArchived);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'currency')) {
        account.currency = normalizeCurrency(body.currency);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'openingBalanceMinor')) {
        account.openingBalanceMinor = body.openingBalanceMinor;
    } else if (Object.prototype.hasOwnProperty.call(body, 'openingBalance')) {
        account.openingBalanceMinor = parseMoneyToMinor(body.openingBalance);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'currentBalanceMinor')) {
        account.currentBalanceMinor = body.currentBalanceMinor;
    } else if (Object.prototype.hasOwnProperty.call(body, 'currentBalance')) {
        account.currentBalanceMinor = parseMoneyToMinor(body.currentBalance);
    }

    if (account.openingBalanceMinor !== undefined && account.currentBalanceMinor === undefined) {
        account.currentBalanceMinor = account.openingBalanceMinor;
    }

    if (account.openingBalanceMinor !== undefined || account.currentBalanceMinor !== undefined) {
        account.currency = normalizeCurrency(account.currency || body.currency || DEFAULT_CURRENCY);
    }

    return account;
}

function pickAccountUpdates(body = {}) {
    const normalized = normalizeAccountInput(body);

    return editableAccountFields.reduce((updates, field) => {
        if (Object.prototype.hasOwnProperty.call(normalized, field)) {
            updates[field] = normalized[field];
        }

        return updates;
    }, {});
}

module.exports = {
    normalizeAccountInput,
    pickAccountUpdates
};
