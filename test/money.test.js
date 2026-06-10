const assert = require('node:assert/strict');
const test = require('node:test');
const {
    minorToMajor,
    normalizeBudgetInput,
    normalizeCurrency,
    normalizeGoalInput,
    normalizeTransactionInput,
    parseMoneyToMinor
} = require('../utils/money');

test('parseMoneyToMinor converts dollars to cents without float math', () => {
    assert.equal(parseMoneyToMinor('12.34'), 1234);
    assert.equal(parseMoneyToMinor('12.3'), 1230);
    assert.equal(parseMoneyToMinor('-7.05'), -705);
    assert.equal(parseMoneyToMinor(42), 4200);
});

test('parseMoneyToMinor rejects amounts with more than 2 decimals', () => {
    assert.throws(() => parseMoneyToMinor('1.005'), /2 decimal/);
});

test('minorToMajor converts integer cents for legacy compatibility', () => {
    assert.equal(minorToMajor(1234), 12.34);
    assert.equal(minorToMajor(-705), -7.05);
    assert.throws(() => minorToMajor(12.34), /integer/);
});

test('normalizeCurrency defaults and validates ISO-like currency codes', () => {
    assert.equal(normalizeCurrency(), 'AUD');
    assert.equal(normalizeCurrency('usd'), 'USD');
    assert.throws(() => normalizeCurrency('AUS$'), /3-letter/);
});

test('normalizers add minor-unit fields while preserving legacy fields', () => {
    assert.deepEqual(normalizeTransactionInput({ amount: '-19.95' }), {
        amount: -19.95,
        amountMinor: -1995,
        currency: 'AUD'
    });

    assert.deepEqual(normalizeBudgetInput({ limit: '500', currency: 'usd' }), {
        limit: 500,
        limitMinor: 50000,
        currency: 'USD'
    });

    assert.deepEqual(normalizeGoalInput({ target: '1000.50', current: '25.25' }), {
        target: 1000.5,
        targetAmountMinor: 100050,
        current: 25.25,
        currentAmountMinor: 2525,
        currency: 'AUD'
    });
});
