const db = require("../config/database");
const { v4: uuidv4 } = require('uuid');

exports.createLoan = (req, res) => {
    const {
        user_id, // Moved from headers to body
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

    // Validate required fields including user_id
    if (!user_id || !loan_type || !amount || !purpose || !term_months || !monthly_income || !employment_status) {
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

            const loanId = uuidv4();
            const statusHistoryId = uuidv4();

            // Create loan application
            const createLoanQuery = `
                INSERT INTO loan_applications (
                    id, user_id, loan_type, amount, purpose, term_months,
                    monthly_income, employment_status, employer_name,
                    job_title, years_employed, credit_score,
                    existing_loans_monthly_payment, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')
            `;

            db.query(createLoanQuery,
                [loanId, user_id, loan_type, amount, purpose, term_months,
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
                                loan_type,
                                amount,
                                status: 'draft'
                            }
                        });
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating loan application',
            error: error.message
        });
    }
};

exports.updateLoanStatus = (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    const user_id = req.headers['user-id'];

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
    const { id } = req.params;
    const user_id = req.headers['user-id'];

    const query = `
        SELECT 
            la.*,
            (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', ld.id,
                    'document_type', ld.document_type,
                    'file_name', ld.file_name,
                    'upload_date', ld.upload_date
                )
            ) FROM loan_documents ld WHERE ld.loan_application_id = la.id) as documents,
            (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'status', lsh.status,
                    'notes', lsh.notes,
                    'changed_at', lsh.changed_at
                )
            ) FROM loan_status_history lsh WHERE lsh.loan_application_id = la.id) as status_history
        FROM loan_applications la
        WHERE la.id = ? AND la.user_id = ?
    `;

    db.query(query, [id, user_id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error fetching loan details',
                error: err
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Loan application not found'
            });
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
