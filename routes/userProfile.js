const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userProfile');

router
    .route('/')
    .get(getUserProfile)
    .put(updateUserProfile);

module.exports = router;
