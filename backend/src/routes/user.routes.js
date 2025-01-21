const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.put('/users/:id', userController.updateUser);
router.get('/users/:id', userController.getUserDetails);
router.get('/users/teller/:id', userController.getTeller)
router.post('/reset-password', userController.resetPassword)

module.exports = router;