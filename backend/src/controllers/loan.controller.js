const db = require("../config/database");
const { v4: uuidv4 } = require('uuid');


exports.createLoan = (req, res) => {
    const {
        user_id, // Moved from headers to body
        account_number, 
        loan_type,
        amount,
        purpose,
        term_months,
        monthly_income,
        employment_status,
        employer_name,
        job_title,
        years_employed,
        credit_score,
        existing_loans_monthly_payment
    } = req.body;

    // Validate required fields including user_id and account_number
    if (!user_id || !account_number || !loan_type || !amount || !purpose || !term_months || !monthly_income || !employment_status) {
        return res.status(400).json({
            message: 'Required fields are missing'
        });
    }

    // Validate loan type
    const validLoanTypes = ['personal', 'home', 'auto', 'business'];
    if (!validLoanTypes.includes(loan_type)) {
        return res.status(400).json({
            message: 'Invalid loan type'
        });
    }

    try {
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

            // Check if the account exists and belongs to the user
            const checkAccountQuery = 'SELECT account_number FROM accounts WHERE account_number = ? AND user_id = ?';
            db.query(checkAccountQuery, [account_number, user_id], (accErr, accResults) => {
                if (accErr) {
                    return res.status(500).json({
                        message: 'Error checking account',
                        error: accErr
                    });
                }

                if (accResults.length === 0) {
                    return res.status(400).json({
                        message: 'Invalid account number or does not belong to the user'
                    });
                }

                const loanId = uuidv4();
                const statusHistoryId = uuidv4();

                // Create loan application
                const createLoanQuery = `
                    INSERT INTO loan_applications (
                        id, user_id, account_number, loan_type, amount, purpose, term_months,
                        monthly_income, employment_status, employer_name,
                        job_title, years_employed, credit_score,
                        existing_loans_monthly_payment, status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
                `;

                db.query(createLoanQuery,
                    [loanId, user_id, account_number, loan_type, amount, purpose, term_months,
                    monthly_income, employment_status, employer_name,
                    job_title, years_employed, credit_score,
                    existing_loans_monthly_payment],
                    (createErr, result) => {
                        if (createErr) {
                            return res.status(500).json({
                                message: 'Error creating loan application',
                                error: createErr
                            });
                        }

                        // Create initial status history
                        const createHistoryQuery = `
                            INSERT INTO loan_status_history (
                                id, loan_application_id, status, changed_by
                            ) VALUES (?, ?, 'draft', ?)
                        `;

                        db.query(createHistoryQuery, [statusHistoryId, loanId, user_id], (historyErr) => {
                            if (historyErr) {
                                return res.status(500).json({
                                    message: 'Error creating status history',
                                    error: historyErr
                                });
                            }

                            res.status(201).json({
                                message: 'Loan application created successfully',
                                loanId: loanId,
                                details: {
                                    id: loanId,
                                    user_id,
                                    account_number, // Include account number in response
                                    loan_type,
                                    amount,
                                    status: 'draft'
                                }
                            });
                        });
                    }
                );
            });
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating loan application',
            error: error.message
        });
    }
};

exports.createCustomerLoan = (req, res) => {
    const {
        user_id,
        loan_type,
        amount,
        purpose,
        term_months,
        monthly_income,
        employment_status,
        employer_name,
        job_title,
        years_employed,
        credit_score,
        existing_loans_monthly_payment
    } = req.body;

    // Validate required fields
    if (!user_id || !loan_type || !amount || !purpose || !term_months) {
        return res.status(400).json({
            message: 'Required fields are missing'
        });
    }

    // Validate loan type
    const validLoanTypes = ['personal', 'home', 'auto', 'business'];
    if (!validLoanTypes.includes(loan_type)) {
        return res.status(400).json({
            message: 'Invalid loan type'
        });
    }

    // Check if user exists and has customer role
    const checkCustomerQuery = `
        SELECT u.id 
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        WHERE u.id = ? AND ur.role_id = 5
    `;

    db.query(checkCustomerQuery, [user_id], (checkErr, customerResults) => {
        if (checkErr) {
            return res.status(500).json({
                message: 'Error checking customer',
                error: checkErr.message
            });
        }

        if (!customerResults.length) {
            return res.status(400).json({
                message: 'Customer not found or invalid customer role'
            });
        }

        const loanId = uuidv4();

        // Create loan application based on your actual table structure
        const createLoanQuery = `
            INSERT INTO loan_applications (
                id, 
                user_id, 
                loan_type, 
                amount, 
                purpose, 
                term_months, 
                monthly_income,
                employment_status,
                employer_name,
                job_title,
                years_employed,
                credit_score,
                existing_loans_monthly_payment,
                status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')
        `;

        const createLoanValues = [
            loanId,
            user_id,
            loan_type,
            amount,
            purpose,
            term_months,
            monthly_income,
            employment_status,
            employer_name,
            job_title,
            years_employed,
            credit_score,
            existing_loans_monthly_payment
        ];

        db.query(createLoanQuery, createLoanValues, (createErr, result) => {
            if (createErr) {
                return res.status(500).json({
                    message: 'Error creating loan application',
                    error: createErr.message
                });
            }

            res.status(201).json({
                message: 'Loan application created successfully',
                loanId: loanId,
                details: {
                    id: loanId,
                    user_id,
                    loan_type,
                    amount,
                    status: 'draft'
                }
            });
        });
    });
};


exports.updateLoanStatus = (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    const user_id = req.headers['user-id'];

    // Validate the user_id
    if (!user_id) {
        return res.status(400).json({
            message: 'User ID is required in the headers'
        });
    }

    // Validate status
    const validStatuses = ['draft', 'submitted', 'under_review', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: 'Invalid status'
        });
    }

    // First update loan application status
    const updateLoanQuery = 'UPDATE loan_applications SET status = ? WHERE id = ?';
    db.query(updateLoanQuery, [status, id], (updateErr, updateResult) => {
        if (updateErr) {
            return res.status(500).json({
                message: 'Error updating loan status',
                error: updateErr
            });
        }

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({
                message: 'Loan application not found'
            });
        }

        // Create status history entry
        const historyId = uuidv4();
        const createHistoryQuery = `
            INSERT INTO loan_status_history (
                id, loan_application_id, status, notes, changed_by
            ) VALUES (?, ?, ?, ?, ?)
        `;

        db.query(createHistoryQuery, [historyId, id, status, notes, user_id], (historyErr) => {
            if (historyErr) {
                return res.status(500).json({
                    message: 'Error creating status history',
                    error: historyErr
                });
            }

            res.json({
                message: 'Loan status updated successfully',
                status: status
            });
        });
    });
};


exports.getLoanDetails = (req, res) => {
    const id = req.body.id || req.query.id || req.params.id;

    if (!id) {
        return res.status(400).json({ message: 'Loan ID is required' });
    }

    const query = `
        SELECT * FROM loan_applications
        WHERE id = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching loan details', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        res.json(results[0]);
    });
};

exports.getUserLoans = (req, res) => {
    // Since user_id is now in body for other endpoints, let's check multiple places
    const user_id = req.body.user_id || req.query.user_id || req.params.user_id;
    
    console.log('Attempting to fetch loans with user_id:', user_id); // Debug log

    if (!user_id) {
        console.log('No user_id found in request'); // Debug log
        return res.status(400).json({
            message: 'User ID is required'
        });
    }

    const query = `
        SELECT * FROM loan_applications 
        WHERE user_id = ? 
        ORDER BY application_date DESC
    `;
    
    console.log('Executing query:', query); // Debug log
    console.log('With user_id parameter:', user_id); // Debug log

    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error('Database error:', err); // Debug log
            return res.status(500).json({
                message: 'Error fetching user loans',
                error: err
            });
        }

        console.log('Query results:', results); // Debug log

        if (results.length === 0) {
            console.log('No loans found for user_id:', user_id); // Debug log
        } else {
            console.log(`Found ${results.length} loans for user_id:`, user_id); // Debug log
        }

        res.json(results);
    });
};

exports.uploadDocument = (req, res) => {
    const { loanId } = req.params;
    const { document_type } = req.body;
    const user_id = req.headers['user-id'];

    if (!req.file) {
        return res.status(400).json({
            message: 'No file uploaded'
        });
    }

    // Validate document type
    const validDocTypes = ['id_proof', 'income_proof', 'address_proof', 'bank_statement', 'employment_proof', 'other'];
    if (!validDocTypes.includes(document_type)) {
        return res.status(400).json({
            message: 'Invalid document type'
        });
    }

    // Check if loan exists and belongs to user
    const checkLoanQuery = 'SELECT id FROM loan_applications WHERE id = ? AND user_id = ?';
    db.query(checkLoanQuery, [loanId, user_id], (checkErr, checkResults) => {
        if (checkErr) {
            return res.status(500).json({
                message: 'Error checking loan application',
                error: checkErr
            });
        }

        if (checkResults.length === 0) {
            return res.status(404).json({
                message: 'Loan application not found or unauthorized'
            });
        }

        const docId = uuidv4();
        const insertDocQuery = `
            INSERT INTO loan_documents (
                id, loan_application_id, document_type, file_name, file_path
            ) VALUES (?, ?, ?, ?, ?)
        `;

        db.query(insertDocQuery, 
            [docId, loanId, document_type, req.file.originalname, req.file.path],
            (insertErr) => {
                if (insertErr) {
                    return res.status(500).json({
                        message: 'Error uploading document',
                        error: insertErr
                    });
                }

                res.status(201).json({
                    message: 'Document uploaded successfully',
                    documentId: docId
                });
            }
        );
    });
};

exports.getCustomerLoan = (req, res) => {
    const { user_id } = req.params;
    const { loan_id } = req.query;

    let query;
    let queryParams;

    if (loan_id) {
        query = `
            SELECT la.*
            FROM loan_applications la
            WHERE la.user_id = ? AND la.id = ?
        `;
        queryParams = [user_id, loan_id];
    } else {
        query = `
            SELECT la.*
            FROM loan_applications la
            WHERE la.user_id = ?
            ORDER BY la.application_date DESC
        `;
        queryParams = [user_id];
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error fetching loan details',
                error: err
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: loan_id ? 'Loan not found' : 'No loans found for this user'
            });
        }

        const formattedResults = results.map(loan => ({
            ...loan,
            application_date: loan.application_date?.toISOString()
        }));

        res.json({
            message: 'Loans retrieved successfully',
            loans: loan_id ? formattedResults[0] : formattedResults
        });
    });
};

exports.getAllLoans = (req, res) => {
    const query = `
        SELECT 
            la.id,
            la.user_id,
            la.loan_type,
            la.amount,
            la.purpose,
            la.term_months,
            la.monthly_income,
            la.employment_status,
            la.employer_name,
            la.job_title,
            la.years_employed,
            la.credit_score,
            la.existing_loans_monthly_payment,
            la.status,
            la.application_date
        FROM loan_applications la
        ORDER BY la.application_date DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error fetching all loans',
                error: err
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'No loan applications found'
            });
        }

        const formattedResults = results.map(loan => ({
            ...loan,
            application_date: loan.application_date?.toISOString()
        }));

        res.json({
            message: 'All loans retrieved successfully',
            loans: formattedResults
        });
    });
};


exports.disburseLoan = (req, res) => {
    const { officer_id, borrower_id, amount, account_type } = req.body;

    // Validate required fields
    if (!officer_id || !borrower_id || !amount || amount <= 0 || !account_type) {
        return res.status(400).json({
            message: 'Invalid input data'
        });
    }

    // Check if both the officer and borrower exist in the users table
    const checkUsersQuery = `
        SELECT id FROM users WHERE id IN (?, ?)
    `;

    db.query(checkUsersQuery, [officer_id, borrower_id], (userErr, userResults) => {
        if (userErr) {
            return res.status(500).json({
                message: 'Error checking users',
                error: userErr.message
            });
        }

        if (userResults.length < 2) {
            return res.status(400).json({
                message: 'Officer or borrower not found'
            });
        }

        // Step 1: Insert into loan_disbursements table (id is auto-generated)
        const insertLoanQuery = `
            INSERT INTO loan_disbursements (officer_id, borrower_id, amount, repayment_status)
            VALUES (?, ?, ?, 'pending')
        `;

        db.query(insertLoanQuery, [officer_id, borrower_id, amount], (loanErr, loanResult) => {
            if (loanErr) {
                return res.status(500).json({
                    message: 'Error disbursing loan',
                    error: loanErr.message
                });
            }

            // Step 2: Check if borrower has an account with the specified account type
            const checkAccountQuery = `
                SELECT id, balance FROM accounts 
                WHERE user_id = ? AND account_type = ?
            `;

            db.query(checkAccountQuery, [borrower_id, account_type], (accErr, accResults) => {
                if (accErr) {
                    return res.status(500).json({
                        message: 'Error checking borrower account',
                        error: accErr.message
                    });
                }

                if (!accResults.length) {
                    return res.status(400).json({
                        message: `No account found for user ${borrower_id} with account type ${account_type}`
                    });
                }

                // Step 3: Update borrower's balance in the correct account
                const updateBalanceQuery = `
                    UPDATE accounts 
                    SET balance = balance + ? 
                    WHERE user_id = ? AND account_type = ?
                `;

                db.query(updateBalanceQuery, [amount, borrower_id, account_type], (balanceErr, balanceResult) => {
                    if (balanceErr) {
                        return res.status(500).json({
                            message: 'Error updating account balance',
                            error: balanceErr.message
                        });
                    }

                    res.status(201).json({
                        message: 'Loan disbursed successfully',
                        loanId: loanResult.insertId, // Gets the auto-generated loan ID
                        details: {
                            officer_id,
                            borrower_id,
                            amount,
                            account_type,
                            status: 'pending'
                        }
                    });
                });
            });
        });
    });
};