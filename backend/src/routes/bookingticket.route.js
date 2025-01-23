const express = require('express');
const router = express.Router();
const bookingTicketController=require("../controllers/tbookingticket.controller")

router.get('/booking-ticket/:id',bookingTicketController.getBookingTicket)
router.post('/create-booking-ticket',bookingTicketController.createBookingTicket)
router.patch('/cancel-booking-ticket',bookingTicketController.cancelBooking)
router.get('/all-bookingtickets', bookingTicketController.getAllBookingTickets)
router.patch('/confirm-ticket' ,bookingTicketController.confirmTicket)
router.patch('/complete-ticket', bookingTicketController.completeTicket)

module.exports = router;
