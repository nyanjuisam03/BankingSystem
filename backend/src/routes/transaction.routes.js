const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');


router.get('/transactions/:accountId', transactionController.getTransactions);
router.get('/all-transactions' ,transactionController.getAllTransactions)
router.post('/transactions', transactionController.createTransaction);
router.get("/every-transactions", transactionController.getEveryTransactions);
router.get("/type/:accountType", transactionController.getTransactionsByAccountType);

module.exports = router;