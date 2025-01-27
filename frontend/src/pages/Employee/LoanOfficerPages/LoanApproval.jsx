import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import useLoanStore from '../../../store/loanStore';

function LoanApproval() {
  const [step, setStep] = useState(1);
  const { 
    loans, 
    currentLoan, 
    loading, 
    error, 
    successMessage,
    fetchAllLoans,
    updateLoanStatus,
    setCurrentLoan 
  } = useLoanStore();

  useEffect(() => {
    fetchAllLoans();
  }, [fetchAllLoans]);

  const handleLoanSelect = (loanId) => {
    const selected = loans.find(loan => loan.id === loanId);
    setCurrentLoan(selected);
    console.log(loanId)
    setStep(2);
  };

 
  const handleStatusUpdate = async (status) => {
    try {
      await updateLoanStatus(currentLoan.id, { status });
      setStep(1);
      setCurrentLoan(null);
    } catch (error) {
      // Error is handled by the store
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <FaSpinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Loan Status Update</h2>
      <p>{step === 1 ? 'Select a loan to review' : 'Review loan details and update status'}</p>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <select onChange={(e) => handleLoanSelect(e.target.value)} className="w-full p-2 border rounded">
            <option value="">Select a loan to review</option>
            {loans.map(loan => (
              <option key={loan.id} value={loan.id}>
                Loan #{loan.id} - ${loan.amount} ({loan.status})
              </option>
            ))}
          </select>
        </div>
      )}

      {step === 2 && currentLoan && (
        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Loan Amount</p>
              <p>${currentLoan.amount}</p>
            </div>
            <div>
              <p className="font-medium">Purpose</p>
              <p>{currentLoan.purpose}</p>
            </div>
            <div>
              <p className="font-medium">Term (months)</p>
              <p>{currentLoan.term_months}</p>
            </div>
            <div>
              <p className="font-medium">Credit Score</p>
              <p>{currentLoan.credit_score}</p>
            </div>
            <div>
              <p className="font-medium">Monthly Income</p>
              <p>${currentLoan.monthly_income}</p>
            </div>
            <div>
              <p className="font-medium">Current Status</p>
              <p className="capitalize">{currentLoan.status}</p>
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <button className="btn-outline" onClick={() => setStep(1)}>
              Back
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => handleStatusUpdate('rejected')}
              disabled={loading}
            >
              Reject Loan
            </button>
            <button 
              className="btn btn-success"
              onClick={() => handleStatusUpdate('approved')}
              disabled={loading}
            >
              Approve Loan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoanApproval
