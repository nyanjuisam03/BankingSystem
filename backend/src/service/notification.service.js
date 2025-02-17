const nodemailer = require('nodemailer');
const cron = require('node-cron');
const db=require('../config/database')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mungaisam03@gmail.com', 
      pass: 'zmjm pzqr dcut eecw'    
    }
  });

  // Function to send notifications
function sendNotifications() {
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
        return;
      }
  
      loanApplications.forEach(loan => {
        const emailContent = {
          from: '"Loan Management System" <your-gmail@gmail.com>',
          to: loan.email,
          subject: 'Loan Repayment Reminder',
          html: `
            <h2>Loan Repayment Reminder</h2>
            <p>Dear valued customer,</p>
            <p>This is a reminder that your loan repayment of Ksh${loan.monthly_installment} is due on ${loan.repayment_due_date}.</p>
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
  
        transporter.sendMail(emailContent, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return;
          }
  
          // Update last_notified timestamp
          const updateQuery = 'UPDATE loan_applications SET last_notified = NOW() WHERE id = ?';
          db.query(updateQuery, [loan.id], (updateErr) => {
            if (updateErr) {
              console.error('Error updating last_notified:', updateErr);
            }
          });
  
          console.log('Email sent:', info.response);
        });
      });
    });
  }
  

  // Schedule notification job to run daily at 9 AM
cron.schedule('0 9 * * *', () => {
    console.log('Running daily notification check...');
    sendNotifications();
  });
  
  // Function to test email configuration
  function testEmailConfiguration() {
    const testEmail = {
      from: '"Loan Management System" <your-gmail@gmail.com>',
      to: 'your-test-email@example.com',
      subject: 'Test Email Configuration',
      html: '<h2>Test Email</h2><p>This is a test email to verify the email configuration.</p>'
    };
  
    return new Promise((resolve, reject) => {
      transporter.sendMail(testEmail, (error, info) => {
        if (error) {
          console.error('Email configuration test failed:', error);
          reject(error);
        } else {
          console.log('Email configuration test successful:', info.response);
          resolve(info);
        }
      });
    });
  }
  
  // Optional: Add an endpoint to manually trigger notifications
  function manualNotificationCheck() {
    sendNotifications();
  }
  
  module.exports = { 
    sendNotifications, 
    manualNotificationCheck,
    testEmailConfiguration 
  };