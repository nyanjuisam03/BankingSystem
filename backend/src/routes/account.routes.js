const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

router.post('/open-account', accountController.openAccount);
router.get('/accounts/:userId', accountController.getUserAccounts);
router.get('/accounts-details/:id', accountController.getAccountDetails);
router.get('/get-accounts', accountController.getAllAccounts)
router.patch('/update-status', accountController.updateAccountStatus);

module.exports = router;