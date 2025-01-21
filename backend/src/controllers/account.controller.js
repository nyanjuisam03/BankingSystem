const db= require("../config/database")

exports.openAccount = async (req, res) => {
    const { user_id, account_type, intial_deposit } = req.body;

    if (!user_id || !account_type || !intial_deposit) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    // Ensure account_type is a number
    const accountTypeId = parseInt(account_type);
    if (isNaN(accountTypeId)) {
        return res.status(400).json({
            message: 'Account type must be a number'
        });
    }

    try {
        // Check if account type exists and get minimum balance
        const checkAccountTypeQuery = 'SELECT minimum_balance FROM account_types WHERE id = ?';
        db.query(checkAccountTypeQuery, [accountTypeId], (err, accountTypeResults) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error checking account type',
                    error: err
                });
            }

            if (accountTypeResults.length === 0) {
                return res.status(400).json({
                    message: 'Invalid account type ID'
                });
            }

            const minimumBalance = accountTypeResults[0].minimum_balance;

            if (intial_deposit < minimumBalance) {
                return res.status(400).json({
                    message: `Initial deposit must be at least ${minimumBalance} for this account type`
                });
            }

            // Check if user exists
            const checkUserQuery = 'SELECT id FROM users WHERE id = ?';
            db.query(checkUserQuery, [user_id], (userErr, userResults) => {
                if (userErr) {
                    return res.status(500).json({
                        message: 'Error checking user',
                        error: userErr
                    });
                }

                if (userResults.length === 0) {
                    return res.status(400).json({
                        message: 'User not found'
                    });
                }

                // Get the latest account number
                const getLastAccountNumberQuery = 'SELECT MAX(CAST(SUBSTRING(account_number, 2) AS UNSIGNED)) as last_number FROM accounts';
                db.query(getLastAccountNumberQuery, (numberErr, numberResults) => {
                    if (numberErr) {
                        return res.status(500).json({
                            message: 'Error generating account number',
                            error: numberErr
                        });
                    }

                    // Generate new account number
                    const lastNumber = numberResults[0].last_number || 999; // Start from 1000 if no accounts exist
                    const newAccountNumber = `A${(lastNumber + 1).toString().padStart(6, '0')}`;

                    // Create account with the new account number
                    const createAccountQuery = `
                        INSERT INTO accounts 
                        (user_id, account_type, balance, status, intial_deposit, account_number, created_at) 
                        VALUES (?, ?, ?, 'active', ?, ?, NOW())
                    `;

                    db.query(createAccountQuery, 
                        [user_id, accountTypeId, intial_deposit, intial_deposit, newAccountNumber], 
                        (createErr, result) => {
                            if (createErr) {
                                return res.status(500).json({
                                    message: 'Error creating account',
                                    error: createErr
                                });
                            }

                            res.status(201).json({
                                message: 'Account created successfully',
                                accountId: result.insertId,
                                details: {
                                    id: result.insertId,
                                    user_id,
                                    account_type: accountTypeId,
                                    account_number: newAccountNumber,
                                    balance: intial_deposit,
                                    status: 'active'
                                }
                            });
                        }
                    );
                });
            });
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating account',
            error: error.message
        });
    }
};

exports.getUserAccounts = (req, res) => {
    const userId = req.params.userId;

    db.query(
        'SELECT * FROM accounts WHERE user_id = ?',
        [userId],
        (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Failed to fetch accounts' });
                return;
            }
            res.json(results);
        }
    );
};


exports.getAccountDetails = (req, res) => {
    const { id } = req.params;
    const query = `SELECT id, user_id, account_number, account_type, balance, status, intial_deposit, created_at 
                   FROM accounts WHERE id = ?`;
  
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error fetching account details:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Account not found' });
      }
  
      res.status(200).json(results[0]);
    });
};


exports.getAllAccounts = (req, res) => {
    db.query(
        'SELECT * FROM accounts',
        (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Failed to fetch accounts' });
                return;
            }
            res.json(results);
        }
    );
};

exports.updateAccountStatus = async (req, res) => {
    const { account_id, status, teller_id } = req.body;

    if (!account_id || !status) {
        return res.status(400).json({
            message: 'Account ID and status are required'
        });
    }

    const validStatuses = ['approved', 'rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: 'Invalid status. Valid statuses are "approved" or "rejected"'
        });
    }

    try {
        const checkAccountQuery = 'SELECT id, status FROM accounts WHERE id = ?';
        db.query(checkAccountQuery, [account_id], (err, accountResults) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error checking account',
                    error: err
                });
            }

            if (accountResults.length === 0) {
                return res.status(404).json({
                    message: 'Account not found'
                });
            }

            const currentStatus = accountResults[0].status;
            if (currentStatus === 'approved' || currentStatus === 'rejected') {
                return res.status(400).json({
                    message: `Account status is already "${currentStatus}". Cannot update.`
                });
            }

            let updateStatusQuery = `
                UPDATE accounts 
                SET status = ?, updated_at = NOW()
            `;
            const queryParams = [status];

            if (status === 'approved' && teller_id) {
                updateStatusQuery += ', verified_by = ?';
                queryParams.push(teller_id);
            }

            updateStatusQuery += ' WHERE id = ?';
            queryParams.push(account_id);

            db.query(updateStatusQuery, queryParams, (updateErr, updateResults) => {
                if (updateErr) {
                    return res.status(500).json({
                        message: 'Error updating account status',
                        error: updateErr
                    });
                }

                res.status(200).json({
                    message: `Account status updated to "${status}" successfully`,
                    accountId: account_id
                });
            });
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating account status',
            error: error.message
        });
    }
};



