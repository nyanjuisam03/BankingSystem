const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.put('/users/:id', userController.updateUser);
router.get('/users/:id', userController.getUserDetails);
router.get('/users/teller/:id', userController.getTeller)
router.post('/reset-password', userController.resetPassword)
router.get('/search-username' , userController.searchByUserName)
router.get('/employees', userController.getAllEmployees)
router.get('/employees/role/:roleId',userController.getEmployeesByRole)
router.get('/employees/:id',userController.getEmployeeById)
router.put('/employees/:id/role' ,userController.updateEmployeeRole)

module.exports = router;