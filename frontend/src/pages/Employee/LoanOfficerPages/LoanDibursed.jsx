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
        <div className="w-full max-w-7xl border p-6 rounded shadow-lg bg-white">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Select a Loan to Disburse</h2>
        </div>
        {loading && <p className="text-gray-500">Loading loans...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4">
          {loans.map((loan) => (
            <div 
              key={loan.id} 
              className="p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Loan ID: {loan.id}</p>
                  {/* <p className="text-sm text-gray-600">Borrower: {loan.user_id}</p> */}
                  <p className="text-sm text-gray-600">Amount: {loan.amount}</p>
                </div>
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-gray-600"
                  onClick={() => handleSelectLoan(loan)}
                >
                  Disburse Loan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
        ) : (
          <div className="w-full max-w-7xl border p-6 rounded shadow-lg bg-white">
    <div className="mb-4">
      <h2 className="text-2xl font-bold">Enter Loan Disbursement Amount</h2>
    </div>
    <p className="text-gray-700">Loan ID: {selectedLoan?.id}</p>
    <p className="text-gray-700">Borrower ID: Kate Njoki</p>
    <p className="text-gray-700">Account Type: Savings</p>
    <input 
      type="number" 
      value={amount} 
      onChange={(e) => setAmount(e.target.value)} 
      placeholder="Enter amount" 
      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <div className="mt-4 flex space-x-4">
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleDisburse}
      >
        Disburse Loan
      </button>
      <button 
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        onClick={() => setStep(1)}
      >
        Back
      </button>
    </div>
    {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
  </div>
        )}
      </div>
    );
}

export default LoanDibursed
