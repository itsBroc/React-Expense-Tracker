const express = require('express');
const router = express.Router();
const { addCategory, deleteCategory, getCategories, updateCategory } = require('../controllers/categories');

router
    .route('/')
    .get(getCategories)
    .post(addCategory);

router
    .route('/:id')
    .put(updateCategory)
    .delete(deleteCategory);

module.exports = router;
