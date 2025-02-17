const express = require('express');
const router = express.Router();
const notificationController=require("../controllers/notification.controller")
const { authenticateToken }=require('../middleware/auth.middleware')

router.post('/send-notifications', authenticateToken, notificationController.sendRepaymentNotifications);

// // Test email configuration (protected route)
// router.post('/test-email', authenticateToken, notificationController.testEmailConfig);

// Get upcoming notifications for a user
router.get('/upcoming', authenticateToken, notificationController.getUpcomingNotifications);

router.post('/tickets-confirmed',authenticateToken,notificationController.sendTicketStatusChangeNotification)
router.post('/approved-loans',authenticateToken,notificationController.sendLoanApprovalNotification)
router.post('/rejected-loans',authenticateToken,notificationController.sendLoanRejectNotification)
router.post('/approved-accounts',authenticateToken,notificationController.sendAccountApprovalNotification)

module.exports = router;