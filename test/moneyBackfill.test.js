const assert = require('node:assert/strict');
const test = require('node:test');
const { buildBackfillUpdates } = require('../utils/moneyBackfill');
const { normalizeGoalInput, normalizeTransactionInput } = require('../utils/money');

test('buildBackfillUpdates returns only missing money fields', () => {
    const updates = buildBackfillUpdates(
        {
            _id: 'transaction-id',
            userId: 'local-dev-user',
            text: 'Rent',
            amount: -450,
            category: 'Housing'
        },
        normalizeTransactionInput,
        ['amount', 'amountMinor', 'currency']
    );

    assert.deepEqual(updates, {
        amountMinor: -45000,
        currency: 'AUD'
    });
});

test('buildBackfillUpdates leaves already-normalized records alone', () => {
    const updates = buildBackfillUpdates(
        {
            amount: 12.5,
            amountMinor: 1250,
            currency: 'AUD'
        },
        normalizeTransactionInput,
        ['amount', 'amountMinor', 'currency']
    );

    assert.deepEqual(updates, {});
});

test('buildBackfillUpdates handles goal target and current amounts', () => {
    const updates = buildBackfillUpdates(
        {
            target: 1000,
            current: 125.75
        },
        normalizeGoalInput,
        ['target', 'targetAmountMinor', 'current', 'currentAmountMinor', 'currency']
    );

    assert.deepEqual(updates, {
        targetAmountMinor: 100000,
        currentAmountMinor: 12575,
        currency: 'AUD'
    });
});
