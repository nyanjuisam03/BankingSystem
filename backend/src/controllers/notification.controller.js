const nodemailer = require('nodemailer');
const db=require('../config/database')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mungaisam03@gmail.com', 
      pass: 'zmjm pzqr dcut eecw'    
    }
  });

  const notificationController = {

    // Send notifications for upcoming loan payments
     sendRepaymentNotifications: (req, res) => {
        // Log the authenticated user for testing
        console.log('Authenticated user:', req.user);
    


        const query = `
          SELECT la.*, u.email 
          FROM loan_applications la
          JOIN users u ON la.user_id = u.id
          WHERE la.status = 'disbursed'
          AND la.repayment_due_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 3 DAY)
          AND (la.last_notified IS NULL OR DATE(la.last_notified) < CURDATE())
        `;
    
        db.query(query, (err, loanApplications) => {
          if (err) {
            console.error('Error fetching loan applications:', err);
            return res.status(500).json({ 
              status: 'error',
              message: 'Failed to fetch loan applications',
              error: err.message 
            });
          }
    
          if (loanApplications.length === 0) {
            return res.json({
              status: 'success',
              message: 'No pending notifications to send',
              data: []
            });
          }
    
          const notifications = loanApplications.map(loan => {
            const emailContent = {
              from: '"Loan Management System" <your-gmail@gmail.com>',
              to: loan.email,
              subject: 'Loan Repayment Reminder',
              html: `
                <h2>Loan Repayment Reminder</h2>
                <p>Dear valued customer,</p>
                <p>This is a reminder that your loan repayment of $${loan.monthly_installment} is due on ${loan.repayment_due_date}.</p>
                <p>Loan Details:</p>
                <ul>
                  <li>Loan Type: ${loan.loan_type}</li>
                  <li>Monthly Installment: $${loan.monthly_installment}</li>
                  <li>Due Date: ${loan.repayment_due_date}</li>
                  <li>Loan Purpose: ${loan.purpose}</li>
                </ul>
                <p>Please ensure timely payment to avoid any late fees.</p>
                <p>Thank you for your cooperation.</p>
              `
            };
    
            return new Promise((resolve, reject) => {
              transporter.sendMail(emailContent, (error, info) => {
                if (error) {
                  console.error('Error sending email:', error);
                  reject(error);
                  return;
                }
    
                const updateQuery = 'UPDATE loan_applications SET last_notified = NOW() WHERE id = ?';
                db.query(updateQuery, [loan.id], (updateErr) => {
                  if (updateErr) {
                    console.error('Error updating last_notified:', updateErr);
                    reject(updateErr);
                    return;
                  }
                  resolve({ loanId: loan.id, emailInfo: info });
                });
              });
            });
          });
    
          Promise.allSettled(notifications)
            .then(results => {
              const successful = results.filter(r => r.status === 'fulfilled');
              const failed = results.filter(r => r.status === 'rejected');
              
              res.json({
                status: 'success',
                message: `Notifications processed`,
                data: {
                  total: loanApplications.length,
                  successful: successful.length,
                  failed: failed.length,
                  successfulLoans: successful.map(s => s.value.loanId),
                  failedLoans: failed.map(f => f.reason.message)
                }
              });
            });
        });
      },
    
      sendAccountApprovalNotification :(req, res) => {
        const query = `
          SELECT a.*, u.email 
          FROM accounts a
          JOIN users u ON a.user_id = u.id
          WHERE a.status = 'approved'
        `;
      
        db.query(query, (err, accounts) => {
          if (err) {
            console.error('Error fetching approved accounts:', err);
            return res.status(500).json({
              status: 'error',
              message: 'Failed to fetch approved accounts',
              error: err.message,
            });
          }
      
          if (accounts.length === 0) {
            return res.json({
              status: 'success',
              message: 'No accounts to notify',
              data: [],
            });
          }
      
          const notifications = accounts.map((account) => {
            const emailContent = {
              from: '"Account Management" <your-email@gmail.com>',
              to: account.email,
              subject: 'Account Approval Notification',
              html: `
                <h2>Account Approved</h2>
                <p>Dear ${account.account_number},</p>
                <p>We are pleased to inform you that your account has been approved. You can now log in and start using the system.</p>
                <p>Account Details:</p>
                <ul>
                  <li>Account Type: ${account.account_type}</li>
                  <li>Status: Approved</li>
                  <li>Approval Date: ${account.update_at}</li>
                </ul>
                <p>Thank you for choosing us!</p>
              `,
            };
      
            return new Promise((resolve, reject) => {
              transporter.sendMail(emailContent, (error, info) => {
                if (error) {
                  console.error('Error sending email:', error);
                  reject(error);
                  return;
                }
                resolve({ accountId: account.id, emailInfo: info });
              });
            });
          });
      
          Promise.allSettled(notifications)
            .then((results) => {
              const successful = results.filter((r) => r.status === 'fulfilled');
              const failed = results.filter((r) => r.status === 'rejected');
      
              res.json({
                status: 'success',
                message: `Notifications processed`,
                data: {
                  total: accounts.length,
                  successful: successful.length,
                  failed: failed.length,
                  successfulAccounts: successful.map((s) => s.value.accountId),
                  failedAccounts: failed.map((f) => f.reason.message),
                },
              });
            })
            .catch((err) => {
              console.error('Error processing notifications:', err);
              res.status(500).json({
                status: 'error',
                message: 'Error processing notifications',
                error: err.message,
              });
            });
        });
      },
   // Send confirmed Tickets
   sendTicketStatusChangeNotification: (req, res) => {
     // Fetch tickets where status is 'confirmed' that haven't been notified yet
  const query = `
  SELECT t.*, u.email 
  FROM tickets t
  JOIN users u ON t.user_id = u.id
  WHERE t.status = 'confirmed'
`;
    
    // Query to fetch tickets whose status is 'confirm'
    db.query(query, (err, tickets) => {
        if (err) {
          console.error('Error fetching tickets:', err);
          return res.status(500).json({ 
            status: 'error',
            message: 'Failed to fetch tickets',
            error: err.message 
          });
        }
    
        if (tickets.length === 0) {
          return res.json({
            status: 'success',
            message: 'No tickets with status confirmed found',
            data: []
          });
        }

      // Send email notifications for each ticket
       const notifications = tickets.map(ticket => {
      const emailContent = {
        from: '"Ticket Management" <your-email@gmail.com>',
        to: ticket.email,
        subject: 'Ticket Status Changed to Confirmed',
        html: `
          <h2>Your Ticket Status Has Changed</h2>
          <p>Dear Customer,</p>
          <p>Your ticket with ID ${ticket.ticket_id} has been confirmed. Please take necessary actions.</p>
          <p>Ticket Details:</p>
          <ul>
            <li>Ticket ID: ${ticket.ticket_id}</li>
            <li>Status: Confirmed</li>
            <li>Subject: ${ticket.description}</li>
          </ul>
          <p>Thank you for your cooperation.</p>
        `
      };

      return new Promise((resolve, reject) => {
        transporter.sendMail(emailContent, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            reject(error);
            return;
          }

          // Resolve if email is sent successfully
          resolve({ ticketId: ticket.id, emailInfo: info });
        });
      });
    });

    Promise.allSettled(notifications)
      .then(results => {
        const successful = results.filter(r => r.status === 'fulfilled');
        const failed = results.filter(r => r.status === 'rejected');
        
        res.json({
          status: 'success',
          message: `Notifications processed`,
          data: {
            total: tickets.length,
            successful: successful.length,
            failed: failed.length,
            successfulTickets: successful.map(s => s.value.ticketId),
            failedTickets: failed.map(f => f.reason.message)
          }
        });
      });
  });
   },

   //Send Approved Loans
   sendLoanApprovalNotification :(req, res) => {
    // Fetch loans where status is 'approved'
    const query = `
      SELECT la.*, u.email 
      FROM loan_applications la
      JOIN users u ON la.user_id = u.id
      WHERE la.status = 'approved'
    `;
  
    db.query(query, (err, loanApplications) => {
      if (err) {
        console.error('Error fetching loan applications:', err);
        return res.status(500).json({ 
          status: 'error',
          message: 'Failed to fetch loan applications',
          error: err.message 
        });
      }
  
      if (loanApplications.length === 0) {
        return res.json({
          status: 'success',
          message: 'No loans approved yet',
          data: []
        });
      }
  
      const notifications = loanApplications.map(loan => {
        const emailContent = {
          from: '"Loan Management System" <your-email@gmail.com>',
          to: loan.email,
          subject: 'Your Loan Application has been Approved',
          html: `
            <h2>Congratulations, Your Loan is Approved!</h2>
            <p>Dear ${loan.job_title} ,</p>
            <p>We are pleased to inform you that your loan application for a loan of $${loan.amount} has been approved.</p>
            <p>Loan Details:</p>
            <ul>
              <li>Loan Type: ${loan.loan_type}</li>
              <li>Loan Amount: Ksh${loan.loan_amount}</li>
              <li>Repayment Start Date: ${loan.repayment_start_date}</li>
              <li>Repayment Due Date: ${loan.repayment_due_date}</li>
              <li>Monthly Installment: $${loan.monthly_installment}</li>
            </ul>
            <p>Thank you for choosing us for your financial needs. Please make your payments on time to avoid any penalties.</p>
            <p>If you have any questions, feel free to contact us.</p>
            <p>Best regards,</p>
            <p>Your Loan Management Team</p>
          `
        };
  
        return new Promise((resolve, reject) => {
          transporter.sendMail(emailContent, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
              reject(error);
              return;
            }
  
            // Resolve if email is sent successfully
            resolve({ loanId: loan.id, emailInfo: info });
          });
        });
      });
  
      Promise.allSettled(notifications)
        .then(results => {
          const successful = results.filter(r => r.status === 'fulfilled');
          const failed = results.filter(r => r.status === 'rejected');
          
          res.json({
            status: 'success',
            message: `Notifications processed`,
            data: {
              total: loanApplications.length,
              successful: successful.length,
              failed: failed.length,
              successfulLoans: successful.map(s => s.value.loanId),
              failedLoans: failed.map(f => f.reason.message)
            }
          });
        });
    });
  },

  //Send Rejected Loans
  sendLoanRejectNotification :(req, res) => {
    // Fetch loans where status is 'approved'
    const query = `
      SELECT la.*, u.email 
      FROM loan_applications la
      JOIN users u ON la.user_id = u.id
      WHERE la.status = 'rejected'
    `;
  
    db.query(query, (err, loanApplications) => {
      if (err) {
        console.error('Error fetching loan applications:', err);
        return res.status(500).json({ 
          status: 'error',
          message: 'Failed to fetch loan applications',
          error: err.message 
        });
      }
  
      if (loanApplications.length === 0) {
        return res.json({
          status: 'success',
          message: 'No loans approved yet',
          data: []
        });
      }
  
      const notifications = loanApplications.map(loan => {
        const emailContent = {
          from: '"Loan Management System" <your-email@gmail.com>',
          to: loan.email,
          subject: 'Your Loan Application has been Approved',
          html: `
            <h2>Congratulations, Your Loan is Approved!</h2>
            <p>Dear ${loan.job_title} ,</p>
            <p>We are pleased to inform you that your loan application for a loan of $${loan.amount} has been approved.</p>
            <p>Loan Details:</p>
            <ul>
              <li>Loan Type: ${loan.loan_type}</li>
              <li>Loan Amount: Ksh${loan.loan_amount}</li>
              <li>Repayment Start Date: ${loan.repayment_start_date}</li>
              <li>Repayment Due Date: ${loan.repayment_due_date}</li>
              <li>Monthly Installment: $${loan.monthly_installment}</li>
            </ul>
            <p>Thank you for choosing us for your financial needs. Please make your payments on time to avoid any penalties.</p>
            <p>If you have any questions, feel free to contact us.</p>
            <p>Best regards,</p>
            <p>Your Loan Management Team</p>
          `
        };
  
        return new Promise((resolve, reject) => {
          transporter.sendMail(emailContent, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
              reject(error);
              return;
            }
  
            // Resolve if email is sent successfully
            resolve({ loanId: loan.id, emailInfo: info });
          });
        });
      });
  
      Promise.allSettled(notifications)
        .then(results => {
          const successful = results.filter(r => r.status === 'fulfilled');
          const failed = results.filter(r => r.status === 'rejected');
          
          res.json({
            status: 'success',
            message: `Notifications processed`,
            data: {
              total: loanApplications.length,
              successful: successful.length,
              failed: failed.length,
              successfulLoans: successful.map(s => s.value.loanId),
              failedLoans: failed.map(f => f.reason.message)
            }
          });
        });
    });
  },




    // Test email configuration
     getUpcomingNotifications: (req, res) => {
        const userId = req.user.id;
        
        const query = `
          SELECT la.*, 
                 DATEDIFF(la.repayment_due_date, CURDATE()) as days_until_due
          FROM loan_applications la
          WHERE la.user_id = ?
          AND la.status = 'disbursed'
          AND la.repayment_due_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY)
          ORDER BY la.repayment_due_date ASC
        `;
    
        db.query(query, [userId], (err, notifications) => {
          if (err) {
            console.error('Error fetching notifications:', err);
            return res.status(500).json({ 
              status: 'error',
              message: 'Failed to fetch notifications',
              error: err.message 
            });
          }
    
          res.json({
            status: 'success',
            message: 'Notifications retrieved successfully',
            data: notifications
          });
        });
      }

  };
  
  module.exports = notificationController;