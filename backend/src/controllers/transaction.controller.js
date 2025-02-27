const db = require('../config/database');


exports.getTransactions = (req, res) => {
    const { accountId } = req.params;
    const query = `
        SELECT t.*, a.balance as current_balance 
        FROM transactions t
        JOIN accounts a ON t.account_id = a.id
        WHERE t.account_id = ?
        ORDER BY t.date DESC
    `;

    db.query(query, [accountId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error retrieving transactions',
                error: err
            });
        }

        res.status(200).json({
            message: 'Transactions retrieved successfully',
            data: results
        });
    });
};

exports.createTransaction = (req, res) => {
    const { account_id, type, amount, description } = req.body;

    // Convert amount to number and validate
    const numericAmount = parseFloat(amount);
    if (!account_id || !type || !numericAmount || !description) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    if (isNaN(numericAmount)) {
        return res.status(400).json({
            message: 'Amount must be a valid number'
        });
    }

    if (type !== 'withdrawal' && type !== 'deposit') {
        return res.status(400).json({
            message: 'Transaction type must be either withdrawal or deposit'
        });
    }

    // Start transaction process
    db.beginTransaction(err => {
        if (err) {
            return res.status(500).json({
                message: 'Error starting transaction',
                error: err
            });
        }

        // Fetch account details (balance, status, type)
        const checkAccountQuery = `
            SELECT a.balance, a.status, at.name AS account_type 
            FROM accounts a 
            JOIN account_types at ON a.account_type = at.id 
            WHERE a.id = ?
        `;

        db.query(checkAccountQuery, [account_id], (err, accountResults) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({
                        message: 'Error checking account',
                        error: err
                    });
                });
            }

            if (accountResults.length === 0) {
                return db.rollback(() => {
                    res.status(404).json({
                        message: 'Account not found'
                    });
                });
            }

            if (accountResults[0].status !== 'approved') {
                return db.rollback(() => {
                    res.status(400).json({
                        message: 'Account is not active'
                    });
                });
            }

            const currentBalance = parseFloat(accountResults[0].balance);
            const accountType = accountResults[0].account_type;

            // Define transaction limits in KES
            const transactionLimits = {
                Savings: { single: 300000, daily: 500000, monthly: 5000000 },
                Current: { single: 1000000, daily: 2000000, monthly: Infinity },
                Business: { single: 2500000, daily: 5000000, monthly: Infinity },
                Student: { single: 100000, daily: 200000, monthly: 1000000 },
                Premium: { single: 5000000, daily: 10000000, monthly: Infinity },
                FixedDeposit: { single: 0, daily: 0, monthly: 0 }
            };

            const limits = transactionLimits[accountType];

            // Ensure withdrawals do not exceed the single transaction limit
            if (type === 'withdrawal' && numericAmount > limits.single) {
                return db.rollback(() => {
                    res.status(400).json({
                        message: `❌ Withdrawal exceeds single transaction limit of KES ${limits.single.toLocaleString()}`
                    });
                });
            }

            // Check daily and monthly limits
            const checkTransactionHistoryQuery = `
                SELECT 
                    SUM(CASE WHEN date >= CURDATE() THEN amount ELSE 0 END) AS daily_total,
                    SUM(CASE WHEN date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN amount ELSE 0 END) AS monthly_total
                FROM transactions 
                WHERE account_id = ? AND type = ?
            `;

            db.query(checkTransactionHistoryQuery, [account_id, type], (err, historyResults) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({
                            message: 'Error checking transaction history',
                            error: err
                        });
                    });
                }

                const dailyTotal = parseFloat(historyResults[0].daily_total || 0);
                const monthlyTotal = parseFloat(historyResults[0].monthly_total || 0);

                if (type === 'withdrawal') {
                    if (dailyTotal + numericAmount > limits.daily) {
                        return db.rollback(() => {
                            res.status(400).json({
                                message: `❌ Daily withdrawal limit of KES ${limits.daily.toLocaleString()} exceeded`
                            });
                        });
                    }

                    if (monthlyTotal + numericAmount > limits.monthly) {
                        return db.rollback(() => {
                            res.status(400).json({
                                message: `❌ Monthly withdrawal limit of KES ${limits.monthly.toLocaleString()} exceeded`
                            });
                        });
                    }
                }

                let newBalance = type === 'withdrawal' ? currentBalance - numericAmount : currentBalance + numericAmount;

                // Ensure sufficient balance for withdrawals
                if (type === 'withdrawal' && numericAmount > currentBalance) {
                    return db.rollback(() => {
                        res.status(400).json({
                            message: '❌ Insufficient funds'
                        });
                    });
                }

                // Round to 2 decimal places
                newBalance = Math.round(newBalance * 100) / 100;

                // Insert transaction record
                const createTransactionQuery = `
                    INSERT INTO transactions (account_id, type, amount, description, date) 
                    VALUES (?, ?, ?, ?, NOW())
                `;

                db.query(createTransactionQuery, [account_id, type, numericAmount, description], (err, transactionResult) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({
                                message: 'Error creating transaction',
                                error: err
                            });
                        });
                    }

                    // Update account balance
                    const updateBalanceQuery = 'UPDATE accounts SET balance = ? WHERE id = ?';
                    db.query(updateBalanceQuery, [newBalance, account_id], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({
                                    message: 'Error updating balance',
                                    error: err
                                });
                            });
                        }

                        // Commit transaction
                        db.commit(err => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({
                                        message: 'Error committing transaction',
                                        error: err
                                    });
                                });
                            }

                            res.status(201).json({
                                message: '✅ Transaction completed successfully',
                                data: {
                                    transaction_id: transactionResult.insertId,
                                    account_id,
                                    type,
                                    amount: numericAmount,
                                    description,
                                    new_balance: newBalance
                                }
                            });
                        });
                    });
                });
            });
        });
    });
};

exports.getAllTransactions = (req, res) => {
    const query = `
        SELECT 
            t.*, 
            a.account_number, 
            u.username, 
            a.balance AS current_balance
        FROM transactions t
        JOIN accounts a ON t.account_id = a.id
        JOIN users u ON a.user_id = u.id
        ORDER BY t.date DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error retrieving transactions',
                error: err
            });
        }

        res.status(200).json({
            message: 'All transactions retrieved successfully',
            data: results
        });
    });
};


exports.getEveryTransactions = (req, res) => {
    const query = `
        SELECT * FROM transaction_details
        ORDER BY date DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Error retrieving transactions",
                error: err
            });
        }

        res.status(200).json({
            message: "Transactions retrieved successfully",
            data: results
        });
    });
};

exports.getTransactionsByAccountType = (req, res) => {
    const { accountType } = req.params;
    const query = `
        SELECT * FROM transaction_details
        WHERE account_type = ?
        ORDER BY date DESC
    `;

    db.query(query, [accountType], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Error retrieving transactions",
                error: err
            });
        }

        res.status(200).json({
            message: "Transactions retrieved successfully",
            data: results
        });
    });
};
