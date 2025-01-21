const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db=require("../config/database")
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt.config');

exports.login = async (req, res) => {
    // Login logic here (existing code)
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    // Find user in database
    const query = `
        SELECT u.*, r.name as role_name 
        FROM users u 
        LEFT JOIN user_roles ur ON u.id = ur.user_id 
        LEFT JOIN roles r ON ur.role_id = r.id 
        WHERE u.username = ?`;

    db.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Database error',
                error: err
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: 'Invalid username or password'
            });
        }

        const user = results[0];

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid username or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id,
                username: user.username,
                role: user.role_name 
            },
           'myVerySecure123!@#$%^&*()_+Key'|| 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role_name
            }
        });
    });
};

exports.register = async (req, res) => {
    const { username, password, email, role, firstName, lastName, isTeller, tellerCode, department, windowNumber } = req.body;

    // Validate required fields
    if (!username || !password || !email || !firstName || !lastName) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    // Additional validation for tellers
    if (isTeller) {
        if (!tellerCode || !department) {
            return res.status(400).json({
                message: 'Teller code and department are required for teller registration'
            });
        }
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Use promises for better async handling
        const insertUser = () => {
            return new Promise((resolve, reject) => {
                const insertUserQuery = 'INSERT INTO users (username, password, email, first_name, last_name) VALUES (?, ?, ?, ?, ?)';
                db.query(insertUserQuery, [username, hashedPassword, email, firstName, lastName], (err, result) => {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            if (err.message.includes('username')) {
                                reject(new Error('Username already exists'));
                            } else if (err.message.includes('email')) {
                                reject(new Error('Email already exists'));
                            } else {
                                reject(err);
                            }
                        } else {
                            reject(err);
                        }
                    } else {
                        resolve(result.insertId);
                    }
                });
            });
        };

        const assignRole = (userId, roleName) => {
            return new Promise((resolve, reject) => {
                const roleQuery = 'INSERT INTO user_roles (user_id, role_id) SELECT ?, id FROM roles WHERE name = ?';
                db.query(roleQuery, [userId, roleName], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        };

        const insertTeller = (userId) => {
            return new Promise((resolve, reject) => {
                const insertTellerQuery = 'INSERT INTO tellers (user_id, teller_code, department, window_number, is_active) VALUES (?, ?, ?, ?, 1)';
                db.query(insertTellerQuery, [userId, tellerCode, department, windowNumber || null], (err) => {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY' && err.message.includes('teller_code')) {
                            reject(new Error('Teller code already exists'));
                        } else {
                            reject(err);
                        }
                    } else {
                        resolve();
                    }
                });
            });
        };

        // Begin registration process
        const userId = await insertUser();

        // Assign role (either specified role or default to 'user')
        const userRole = isTeller ? 'teller' : (role || 'user');
        await assignRole(userId, userRole);

        // If registering a teller, add teller details
        if (isTeller) {
            await insertTeller(userId);
        }

        res.status(201).json({
            message: 'Registration successful',
            userId
        });

    } catch (error) {
        // Handle specific errors
        if (error.message === 'Username already exists' ||
            error.message === 'Email already exists' ||
            error.message === 'Teller code already exists') {
            return res.status(400).json({
                message: error.message
            });
        }

        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Error creating user',
            error: error.message
        });
    }
};

exports.registerCustomer = async (req, res) => {
    // Register customer logic here (existing code)
    const { username, password, email, role = 'customer', firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const insertUserQuery = 'INSERT INTO users (username, password, email, first_name, last_name) VALUES (?, ?, ?, ?, ?)';
        db.query(insertUserQuery, [username, hashedPassword, email, firstName, lastName], (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error creating user',
                    error: err
                });
            }

            const userId = result.insertId;

            // Assign role to user (default "customer" if none provided)
            const roleQuery = 'INSERT INTO user_roles (user_id, role_id) SELECT ?, id FROM roles WHERE name = ?';
            db.query(roleQuery, [userId, role], (roleErr) => {
                if (roleErr) {
                    console.error('Error assigning role:', roleErr);
                    return res.status(500).json({
                        message: 'Error assigning role',
                        error: roleErr
                    });
                }

                res.status(201).json({
                    message: 'User registered successfully',
                    userId
                });
            });
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating user',
            error: error.message
        });
    }
};

exports.logout = async (req, res) => {
    try {
        // Clear session if exists
        if (req.session) {
            req.session.destroy();
        }

        // Clear auth cookies
        res.clearCookie('jwt');
        res.clearCookie('sessionId');

        res.status(200).json({
            message: 'Logged out successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Logout failed',
            error: error.message
        });
    }
};