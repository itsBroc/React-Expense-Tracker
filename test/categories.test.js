const assert = require('node:assert/strict');
const test = require('node:test');
const { normalizeCategoryInput } = require('../utils/categories');

test('normalizeCategoryInput trims category display fields', () => {
    assert.deepEqual(normalizeCategoryInput({
        name: '  Groceries  ',
        type: 'expense',
        icon: '  shopping-cart ',
        color: '#2f7d4d'
    }), {
        name: 'Groceries',
        type: 'expense',
        icon: 'shopping-cart',
        color: '#2f7d4d'
    });
});

test('normalizeCategoryInput ignores ownership fields', () => {
    assert.deepEqual(normalizeCategoryInput({
        userId: 'client-user',
        _id: 'client-id',
        name: 'Bonus',
        type: 'income'
    }), {
        name: 'Bonus',
        type: 'income'
    });
});

test('normalizeCategoryInput treats blank parent category as unset', () => {
    assert.deepEqual(normalizeCategoryInput({
        name: 'Restaurants',
        type: 'expense',
        parentCategoryId: ''
    }), {
        name: 'Restaurants',
        type: 'expense',
        parentCategoryId: undefined
    });
});
