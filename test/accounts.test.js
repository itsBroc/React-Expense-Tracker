const assert = require('node:assert/strict');
const test = require('node:test');
const { normalizeAccountInput, pickAccountUpdates } = require('../utils/accounts');

test('normalizeAccountInput converts account balances to minor units', () => {
    assert.deepEqual(normalizeAccountInput({
        name: ' Everyday ',
        type: 'checking',
        openingBalance: '125.50'
    }), {
        name: 'Everyday',
        type: 'checking',
        openingBalanceMinor: 12550,
        currentBalanceMinor: 12550,
        currency: 'AUD'
    });
});

test('normalizeAccountInput accepts explicit current balance and currency', () => {
    assert.deepEqual(normalizeAccountInput({
        name: 'Visa',
        type: 'credit_card',
        currency: 'usd',
        openingBalance: '-100.00',
        currentBalance: '-50.25'
    }), {
        name: 'Visa',
        type: 'credit_card',
        currency: 'USD',
        openingBalanceMinor: -10000,
        currentBalanceMinor: -5025
    });
});

test('pickAccountUpdates ignores ownership and unknown fields', () => {
    assert.deepEqual(pickAccountUpdates({
        userId: 'client-user',
        _id: 'client-id',
        name: 'Savings',
        currentBalance: '250',
        unknown: true
    }), {
        name: 'Savings',
        currentBalanceMinor: 25000,
        currency: 'AUD'
    });
});
