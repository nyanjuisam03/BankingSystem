import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import useLoanStore from '../../../store/loanStore';
import useNotificationStore from '../../../store/notificationStore';

function LoanApproval() {
  const [step, setStep] = useState(1);
  const { 
    loans, 
    currentLoan, 
    loading, 
    error, 
    successMessage,
    fetchPendingLoans,
    updateLoanStatus,
    setCurrentLoan 
  } = useLoanStore();


  const { 
    sendLoanApprovalNotification,
    sendLoanRejectNotification,
    getApprovedLoans,
    getRejectedLoans,
    notificationStatus,
    approvedLoans,
    rejectedLoans
  } = useNotificationStore();


  useEffect(() => {
    fetchPendingLoans();
    console.log(loans)
  }, [fetchPendingLoans]);

  const handleLoanSelect = (loanId) => {
    const selected = loans.find(loan => loan.id === loanId);
    setCurrentLoan(selected);
    console.log(loanId)
    setStep(2);
  };

 
  const handleStatusUpdate = async (status) => {
    try {
      await updateLoanStatus(currentLoan.id, { status });
      await sendLoanApprovalNotification();
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
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
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
                Loan ({loan.id}) - Ksh{loan.amount} ({loan.status})
              </option>
            ))}
          </select>
        </div>
      )}

{step === 2 && currentLoan && (
  <div className="space-y-6 mt-6">
    <div className="grid grid-cols-2 gap-4">
      {/* Existing Loan Details */}
      <div>
        <p className="font-medium">Loan Amount</p>
        <p>Ksh {currentLoan.amount}</p>
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
        <p>Ksh {currentLoan.monthly_income}</p>
      </div>
      <div>
        <p className="font-medium">Current Status</p>
        <p className="capitalize">{currentLoan.status}</p>
      </div>

      {/* New Personal Details */}
      <div>
        <p className="font-medium">Full Name</p>
        <p>John Doe</p>
      </div>
      <div>
        <p className="font-medium">Email</p>
        <p>johndoe@example.com</p>
      </div>
      <div>
        <p className="font-medium">Phone Number</p>
        <p>+254 712 345 678</p>
      </div>
      <div>
        <p className="font-medium">KRA PIN</p>
        <p>A123456789</p>
      </div>
      <div>
        <p className="font-medium">Employer Name</p>
        <p>Acme Corporation</p>
      </div>
      <div>
        <p className="font-medium">Work Address</p>
        <p>123 Business Street, Nairobi</p>
      </div>
      <div>
        <p className="font-medium">Position</p>
        <p>Senior Manager</p>
      </div>
      <div>
        <p className="font-medium">National ID</p>
        <p>32456789</p>
      </div>
    </div>



    <div className="col-span-2">
      <p className="font-medium">Passport Photo</p>
      <div className="w-32 h-40 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Photo Preview</span>
        {/* In a real app, you'd use an actual image here */}
      </div>
    </div>

    {/* National ID Section */}
    <div className="col-span-2 grid grid-cols-2 gap-4">
      <div>
        <p className="font-medium">National ID Front</p>
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">ID Front Preview</span>
        </div>
      </div>
      <div>
        <p className="font-medium">National ID Back</p>
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">ID Back Preview</span>
        </div>
      </div>
    </div>
    {/* Existing Buttons */}
    <div className="flex gap-4 justify-end pt-4">
      <button 
        className="px-4 py-2 border rounded hover:bg-gray-50" 
        onClick={() => setStep(1)}
      >
        Back
      </button>
      <button 
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={() => handleStatusUpdate('rejected')}
        disabled={loading}
      >
        Reject Loan
      </button>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
