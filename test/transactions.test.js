const assert = require('node:assert/strict');
const test = require('node:test');
const { getBalanceAdjustment, normalizeTransactionForUser } = require('../utils/transactions');

test('normalizeTransactionForUser removes blank account ids', async () => {
    const transaction = await normalizeTransactionForUser(
        { user: { id: 'local-dev-user', mode: 'local' } },
        {
            text: 'Coffee',
            amount: '-4.50',
            accountId: ''
        }
    );

    assert.equal(transaction.accountId, undefined);
    assert.equal(transaction.amountMinor, -450);
});

test('normalizeTransactionForUser rejects malformed account ids', async () => {
    await assert.rejects(
        () => normalizeTransactionForUser(
            { user: { id: 'local-dev-user', mode: 'local' } },
            {
                text: 'Coffee',
                amount: '-4.50',
                accountId: 'not-an-object-id'
            }
        ),
        /Selected account/
    );
});

test('getBalanceAdjustment returns transaction delta for linked accounts', () => {
    assert.deepEqual(getBalanceAdjustment({
        accountId: 'account-id',
        amountMinor: -2599
    }), {
        accountId: 'account-id',
        amountMinor: -2599
    });

    assert.deepEqual(getBalanceAdjustment({
        accountId: 'account-id',
        amountMinor: -2599
    }, -1), {
        accountId: 'account-id',
        amountMinor: 2599
    });
});

test('getBalanceAdjustment returns null for unlinked transactions', () => {
    assert.equal(getBalanceAdjustment({ amountMinor: 1000 }), null);
});

test('getBalanceAdjustment supports legacy decimal amounts', () => {
    assert.deepEqual(getBalanceAdjustment({
        accountId: 'account-id',
        amount: '12.50'
    }), {
        accountId: 'account-id',
        amountMinor: 1250
    });
});
