import React from 'react'
import { useState, useEffect } from 'react';
import useLoanStore from '../../../store/loanStore';
function LoanDibursed() {
    const { loans, fetchAllLoans, disburseLoan, loading, error, successMessage } = useLoanStore();
    const [step, setStep] = useState(1);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [amount, setAmount] = useState('');
  
    useEffect(() => {
      fetchAllLoans();
    }, [fetchAllLoans]);
  
    const handleSelectLoan = (loan) => {
      setSelectedLoan(loan);
      setStep(2);
    };
  
    const handleDisburse = async () => {
      if (!selectedLoan) return;
      try {
        await disburseLoan({
          officer_id: 9,
          borrower_id: selectedLoan.user_id,
          amount: parseFloat(amount),
          account_type: 1,
        });
        setStep(1);
        setSelectedLoan(null);
        setAmount('');
      } catch (err) {
        console.error(err);
      }
    };
  
    return (
      <div>
        {step === 1 ? (
          <div>
            <h2>Select a Loan to Disburse</h2>
            {loading ? <p>Loading loans...</p> : null}
            {error ? <p style={{ color: 'red' }}>{error}</p> : null}
            <ul>
              {loans.map((loan) => (
                <li key={loan.id}>
                  <button onClick={() => handleSelectLoan(loan)}>
                    Loan ID: {loan.id} - Borrower: {loan.user_id} - Amount: {loan.amount}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <h2>Enter Loan Disbursement Amount</h2>
            <p>Loan ID: {selectedLoan?.id}</p>
            <p>Borrower ID: {selectedLoan?.user_id}</p>
            <p>Account Type: Savings</p>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="Enter amount" 
            />
            <button onClick={handleDisburse}>Disburse Loan</button>
            <button onClick={() => setStep(1)}>Back</button>
            {successMessage ? <p style={{ color: 'green' }}>{successMessage}</p> : null}
          </div>
        )}
      </div>
    );
}

export default LoanDibursed
