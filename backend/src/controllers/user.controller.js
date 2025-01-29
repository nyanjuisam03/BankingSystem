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

exports.getAllEmployees = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.*,
                ur.role_id,
                ur.assigned_at,
                r.name as role_name,
                r.description as role_description
            FROM users u
            INNER JOIN user_roles ur ON u.id = ur.user_id
            INNER JOIN roles r ON ur.role_id = r.id
            WHERE ur.role_id BETWEEN 1 AND 4
            ORDER BY u.id
        `;

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error fetching employees',
                    error: err
                });
            }

            res.status(200).json({
                message: 'Employees fetched successfully',
                data: results,
                count: results.length
            });
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching employees',
            error: error.message
        });
    }
};

exports.getEmployeesByRole = async (req, res) => {
    const roleId = req.params.roleId;

    try {
        if (roleId < 1 || roleId > 4) {
            return res.status(400).json({
                message: 'Invalid role ID. Must be between 1 and 4'
            });
        }

        const query = `
            SELECT u.*, ur.role_id
            FROM users u
            INNER JOIN user_roles ur ON u.id = ur.user_id
            WHERE ur.role_id = ?
            ORDER BY u.id
        `;

        db.query(query, [roleId], (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error fetching employees by role',
                    error: err
                });
            }

            res.status(200).json({
                message: 'Employees fetched successfully',
                data: results,
                count: results.length
            });
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching employees by role',
            error: error.message
        });
    }
};

exports.getEmployeeById = async (req, res) => {
    const employeeId = req.params.id;

    try {
        const query = `
            SELECT u.*, ur.role_id
            FROM users u
            INNER JOIN user_roles ur ON u.id = ur.user_id
            WHERE u.id = ? AND ur.role_id BETWEEN 1 AND 4
        `;

        db.query(query, [employeeId], (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error fetching employee',
                    error: err
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: 'Employee not found'
                });
            }

            res.status(200).json({
                message: 'Employee fetched successfully',
                data: results[0]
            });
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching employee',
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

exports.resetPassword = async (req, res) => {
    const { username, newPassword } = req.body;

    try {
        // Validate the new password
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({
                message: 'New password must be at least 8 characters long'
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Find user by username and update password
        const updatePasswordQuery = 'UPDATE users SET password = ? WHERE username = ?';
        
        await new Promise((resolve, reject) => {
            db.query(updatePasswordQuery, [hashedPassword, username], (err, result) => {
                if (err) reject(err);
                if (result.affectedRows === 0) {
                    reject(new Error('User not found'));
                }
                resolve();
            });
        });

        // Get user ID for logging
        const getUserIdQuery = 'SELECT id FROM users WHERE username = ?';
        const userId = await new Promise((resolve, reject) => {
            db.query(getUserIdQuery, [username], (err, results) => {
                if (err) reject(err);
                if (results.length === 0) reject(new Error('User not found'));
                resolve(results[0].id);
            });
        });

        // Log the password reset action
        const logResetQuery = 'INSERT INTO password_reset_logs (user_id, reset_date) VALUES (?, NOW())';
        
        await new Promise((resolve, reject) => {
            db.query(logResetQuery, [userId], (err) => {
                if (err) reject(err);
                resolve();
            });
        });

        res.status(200).json({
            message: 'Password reset successful'
        });

    } catch (error) {
        console.error('Password reset error:', error);
        
        if (error.message === 'User not found') {
            return res.status(404).json({
                message: 'Username not found'
            });
        }

        res.status(500).json({
            message: 'Error resetting password',
            error: error.message
        });
    }
};

exports.searchByUserName = async (req, res) => {
    const { username } = req.query;

    // Check if the username exists in the request
    if (!username) {
        return res.status(400).json({
            message: 'Username query parameter is required'
        });
    }

    // Query to search users in the database
    const query = 'SELECT id, username, email FROM users WHERE username LIKE ?';
    const searchPattern = `%${username}%`; // Use a wildcard pattern for partial matches

    db.query(query, [searchPattern], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error searching for users',
                error: err
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'No users found',
                users: [] // Return an empty array to maintain consistent structure
            });
        }

        // Return the matching users
        res.status(200).json({
            message: 'Users fetched successfully',
            data: results // Use `data` for consistency
        });
    });
}


exports.updateEmployeeRole = async (req, res) => {
    const employeeId = req.params.id;
    const { roleId } = req.body;
    
    try {
        let updateQuery = 'UPDATE user_roles SET ';
        const values = [];
        const updates = [];

        if (roleId) {
            updates.push('role_id = ?');
            values.push(roleId);
        }

        // if (startDate) {
        //     updates.push('start_date = ?');
        //     values.push(startDate);
        // }

        // if (updatedBy) {
        //     updates.push('updated_by = ?');
        //     values.push(updatedBy);
        // }

        // // Add update timestamp
        // updates.push('updated_at = CURRENT_TIMESTAMP');

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        updateQuery += updates.join(', ');
        updateQuery += ' WHERE user_id = ?';
        values.push(employeeId);

        db.query(updateQuery, values, (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error updating employee role',
                    error: err
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            res.status(200).json({
                message: 'Employee role updated successfully',
                employeeId
            });
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating employee role',
            error: error.message
        });
    }
};