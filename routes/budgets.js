const express = require('express');
const router = express.Router();
const { getBudgets, addBudget, updateBudget, deleteBudget } = require('../controllers/budgets');

router
    .route('/')
    .get(getBudgets)
    .post(addBudget);

router
    .route('/:id')
    .put(updateBudget)
    .delete(deleteBudget);

module.exports = router;
