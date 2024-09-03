const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// @route    GET api/user
// @desc     Get user information
// @access   Private
router.get('/', auth, userController.getUserInfo);

module.exports = router;
