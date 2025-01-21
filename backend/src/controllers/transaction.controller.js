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
            message: 'Transaction type must be either withdraw or deposit'
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

        // First, get current balance and account status
        const checkAccountQuery = 'SELECT balance, status FROM accounts WHERE id = ?';
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

            if (accountResults[0].status !== 'active') {
                return db.rollback(() => {
                    res.status(400).json({
                        message: 'Account is not active'
                    });
                });
            }

            // Convert current balance to number
            const currentBalance = parseFloat(accountResults[0].balance);
            let newBalance;

            if (type === 'withdrawal') {
                if (numericAmount > currentBalance) {
                    return db.rollback(() => {
                        res.status(400).json({
                            message: 'Insufficient funds'
                        });
                    });
                }
                newBalance = currentBalance - numericAmount;
            } else {
                newBalance = currentBalance + numericAmount;
            }

            // Round to 2 decimal places to avoid floating point issues
            newBalance = Math.round(newBalance * 100) / 100;

            // Create transaction record
            const createTransactionQuery = `
                INSERT INTO transactions 
                (account_id, type, amount, description, date) 
                VALUES (?, ?, ?, ?, NOW())
            `;

            db.query(createTransactionQuery, 
                [account_id, type, numericAmount, description], 
                (err, transactionResult) => {
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
                                message: 'Transaction completed successfully',
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
                }
            );
        });
    });
};

exports.getAllTransactions = (req, res) => {
    const query = `
        SELECT t.*, a.balance as current_balance 
        FROM transactions t
        JOIN accounts a ON t.account_id = a.id
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
