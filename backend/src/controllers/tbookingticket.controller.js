const db = require('../config/database');

exports.getBookingTicket=(req,res)=>{
    const { id } = req.params;
    const query = `
      SELECT * FROM tickets 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `;
  
    db.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).json({
          message: 'Error fetching tickets',
          error: err
        });
      }
  
      res.status(200).json({
        message: 'Tickets retrieved successfully',
        data: results
      });
    });
};

exports.getAllBookingTickets = (req, res) => {
  const query = `
  SELECT 
  * 
FROM tickets
ORDER BY created_at DESC
  `;

  db.query(query, (err, results) => {
      if (err) {
          return res.status(500).json({
              message: 'Error retrieving tickets',
              error: err
          });
      }

      res.status(200).json({
          message: 'All tickets retrieved successfully',
          data: results
      });
  });
};



exports.createBookingTicket=(req,res)=>{
    const { userId, ticketType, appointmentDate, appointmentTime, description } = req.body;

    // Validate available slots
    const queryCheck = `
      SELECT COUNT(*) as count 
      FROM tickets 
      WHERE appointment_date = ? AND appointment_time = ?
    `;
  
    db.query(queryCheck, [appointmentDate, appointmentTime], (err, results) => {
      if (err) {
        return res.status(500).json({
          message: 'Error checking available slots',
          error: err
        });
      }
  
      if (results[0].count >= 3) { // Maximum 3 appointments per time slot
        return res.status(400).json({ error: 'Time slot is fully booked' });
      }
  
      // Insert the ticket
      const queryInsert = `
        INSERT INTO tickets (user_id, ticket_type, appointment_date, appointment_time, description)
        VALUES (?, ?, ?, ?, ?)
      `;
  
      db.query(queryInsert, [userId, ticketType, appointmentDate, appointmentTime, description], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'Failed to create ticket',
            error: err
          });
        }
  
        res.status(201).json({
          message: 'Ticket created successfully',
          ticketId: result.insertId
        });
      });
    });
}

exports.completeTicket = (req, res) => {
  const { ticketId } = req.body; // Expect ticketId to be sent in the request body

  if (!ticketId) {
      return res.status(400).json({ message: 'Ticket ID is required' });
  }

  const query = `
      UPDATE tickets 
      SET status = 'COMPLETED' 
      WHERE ticket_id = ?
  `;

  db.query(query, [ticketId], (err, results) => {
      if (err) {
          return res.status(500).json({
              message: 'Error updating ticket to completed',
              error: err,
          });
      }

      if (results.affectedRows === 0) {
          return res.status(404).json({
              message: 'Ticket not found',
          });
      }

      res.status(200).json({
          message: 'Ticket marked as completed successfully',
      });
  });
};


exports.cancelBooking=(req,res)=>{
    const { ticketId } = req.body; // Expect ticketId to be sent in the request body

  if (!ticketId) {
    return res.status(400).json({ message: 'Ticket ID is required' });
  }

  const query = `
    UPDATE tickets 
    SET status = 'CANCELLED' 
    WHERE ticket_id = ?  -- Changed from 'id' to 'ticket_id'
  `;

  db.query(query, [ticketId], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Error cancelling ticket',
        error: err
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        message: 'Ticket not found'
      });
    }

    res.status(200).json({
      message: 'Ticket cancelled successfully'
    });
  });
}

exports.confirmTicket = (req, res) => {
  const { ticketId } = req.body; // Expect ticketId to be sent in the request body

  if (!ticketId) {
      return res.status(400).json({ message: 'Ticket ID is required' });
  }

  const query = `
      UPDATE tickets 
      SET status = 'CONFIRMED' 
      WHERE ticket_id = ?
  `;

  db.query(query, [ticketId], (err, results) => {
      if (err) {
          return res.status(500).json({
              message: 'Error updating ticket to confirmed',
              error: err,
          });
      }

      if (results.affectedRows === 0) {
          return res.status(404).json({
              message: 'Ticket not found',
          });
      }

      res.status(200).json({
          message: 'Ticket confirmed successfully',
      });
  });
};
