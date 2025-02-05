const db = require('../config/database');

exports.createTicket = (req, res) => {
    const { ticket_id, ticket_type,  description, status, priority, created_by, request_type, requested_items,  incident_category,  resolution_notes } = req.body;

    const query = `
        INSERT INTO management_tickets ( ticket_type,  description, status, priority, created_by, 
                                        request_type, requested_items, incident_category, resolution_notes) 
        VALUES ( ?,  ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [ticket_type,  description, status, priority, created_by, request_type, requested_items,  incident_category, resolution_notes], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error creating ticket',
                error: err
            });
        }

        res.status(201).json({
            message: 'Ticket created successfully',
            ticket_id: ticket_id
        });
    });
};


exports.updateTicketStatus = (req, res) => {
    const { ticket_id } = req.params;
    const { status } = req.body;

    const query = `
        UPDATE management_tickets 
        SET status = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE ticket_id = ?
    `;

    db.query(query, [status, ticket_id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error updating ticket status',
                error: err
            });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: 'Ticket not found'
            });
        }

        res.status(200).json({
            message: 'Ticket status updated successfully'
        });
    });
};

exports.getTicketsByUser = (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT * FROM management_tickets 
        WHERE created_by = ? 
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

exports.getAllTickets = (req, res) => {
    const query = `
        SELECT * FROM management_tickets 
        ORDER BY created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error fetching all tickets',
                error: err
            });
        }

        res.status(200).json({
            message: 'All tickets retrieved successfully',
            data: results
        });
    });
};