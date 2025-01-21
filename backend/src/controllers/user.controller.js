const bcrypt = require('bcryptjs');
const db = require('../config/database');


exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, email, password, firstName, lastName } = req.body;
    
    try {
        let updateQuery = 'UPDATE users SET ';
        const values = [];
        const updates = [];
 
        if (username) {
            updates.push('username = ?');
            values.push(username);
        }
 
        if (email) {
            updates.push('email = ?');
            values.push(email);
        }
 
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password = ?');
            values.push(hashedPassword);
        }
 
        if (firstName) {
            updates.push('first_name = ?');
            values.push(firstName);
        }
 
        if (lastName) {
            updates.push('last_name = ?');
            values.push(lastName);
        }
 
        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }
 
        updateQuery += updates.join(', ');
        updateQuery += ' WHERE id = ?';
        values.push(userId);
 
        db.query(updateQuery, values, (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error updating user',
                    error: err
                });
            }
 
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
 
            res.status(200).json({
                message: 'User updated successfully',
                userId
            });
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user',
            error: error.message
        });
    }
};

exports.getUserDetails = async (req, res) => {
    const userId = req.params.id;
    
    const query = `
        SELECT u.id, u.username, u.email, u.first_name, u.last_name, r.name as role_name
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Database error',
                error: err
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const user = results[0];
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role_name
        });
    });
};

exports.getTeller=(req,res)=>{
    const tellerId = req.params.id;

    // Check if the tellerId exists in the request
    if (!tellerId) {
        return res.status(400).json({
            message: 'Teller ID is required'
        });
    }

    // Query to fetch teller details from the database
    const query = 'SELECT * FROM tellers WHERE id = ?';
    db.query(query, [tellerId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error fetching teller data',
                error: err
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Teller not found'
            });
        }

        // Return the teller's data
        res.status(200).json({
            message: 'Teller fetched successfully',
            teller: results[0] // Return the first matching teller
        });
    });
}