const express = require('express');
const router = express.Router();
const { addAccount, deleteAccount, getAccounts, updateAccount } = require('../controllers/accounts');

router
    .route('/')
    .get(getAccounts)
    .post(addAccount);

router
    .route('/:id')
    .put(updateAccount)
    .delete(deleteAccount);

module.exports = router;
