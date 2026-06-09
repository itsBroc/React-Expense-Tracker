const assert = require('node:assert/strict');
const test = require('node:test');
const { getUserFilter, stripOwnershipFields, withUser } = require('../utils/userScope');

test('withUser strips client-controlled ownership fields', () => {
    const req = {
        user: {
            id: 'server-user'
        }
    };
    const body = {
        _id: 'client-id',
        id: 'client-short-id',
        userId: 'client-user',
        text: 'Groceries'
    };

    assert.deepEqual(withUser(req, body), {
        userId: 'server-user',
        text: 'Groceries'
    });
});

test('stripOwnershipFields removes identifiers from updates', () => {
    assert.deepEqual(stripOwnershipFields({
        _id: 'client-id',
        id: 'client-short-id',
        userId: 'client-user',
        current: 25
    }), {
        current: 25
    });
});

test('getUserFilter allows legacy unscoped records only in local mode', () => {
    assert.deepEqual(getUserFilter({ user: { id: 'local-dev-user', mode: 'local' } }), {
        $or: [
            { userId: 'local-dev-user' },
            { userId: { $exists: false } }
        ]
    });

    assert.deepEqual(getUserFilter({ user: { id: 'cognito-user', mode: 'cognito' } }), {
        userId: 'cognito-user'
    });
});
