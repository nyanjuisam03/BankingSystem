const express = require('express');
const router = express.Router();
const bookingTicketController=require("../controllers/tbookingticket.controller")

router.get('/booking-ticket/:id',bookingTicketController.getBookingTicket)
router.post('/create-booking-ticket',bookingTicketController.createBookingTicket)
router.patch('/cancel-booking-ticket',bookingTicketController.cancelBooking)

module.exports = router;
