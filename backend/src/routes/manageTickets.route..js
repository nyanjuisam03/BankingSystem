const express = require('express');
const router = express.Router();
const managementController=require("../controllers/managementTickets.controller");


router.post('/create-service-ticket', managementController.createTicket)
router.get('/service-tickets/:id' , managementController.getTicketsByUser)
router.get('/all-service-tickets' , managementController.getAllTickets)
router.put('/service-tickets/:ticket_id/status' , managementController.updateTicketStatus)

module.exports = router;
