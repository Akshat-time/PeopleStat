const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');

// @route   POST api/user/update-profile
// @desc    Update user profile details
// @access  Private
router.post('/update-profile', auth, userController.updateProfile);

// @route   POST api/user/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', auth, userController.changePassword);

// @route   POST api/user/update-notifications
// @desc    Update user preferences
// @access  Private
router.post('/update-notifications', auth, userController.updateNotifications);

module.exports = router;
