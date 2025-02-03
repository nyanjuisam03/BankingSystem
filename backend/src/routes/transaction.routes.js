const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');


router.get('/transactions/:accountId', transactionController.getTransactions);
router.get('/all-transactions' ,transactionController.getAllTransactions)
router.post('/transactions', transactionController.createTransaction);

module.exports = router;