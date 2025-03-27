const express = require('express');
const router = express.Router();
const loanController= require("../controllers/loan.controller")
const upload=require('../middleware/multer.middleware');



router.post('/loans/create-loan',loanController.createLoan)
router.post('/loan-officer/create-loan',loanController.createCustomerLoan)
router.post('/disburse',loanController.disburseLoan)
router.post('/repay/loans',loanController.repayLoan)
router.patch('/loans/:id/status', loanController.updateLoanStatus);
router.get('/loans/:id', loanController.getLoanDetails);
router.get('/loans', loanController.getUserLoans);
router.get("/loans/loan-customer/:user_id",loanController.getCustomerLoan)
router.post('/loans/:loanId/documents', upload.single('document'), loanController.uploadDocument);
router.get('/all-loans' , loanController.getAllLoans)

module.exports = router;