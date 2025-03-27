import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useLoanStore from '../../store/loanStore';
import { useNavigate } from 'react-router-dom';

function LoanDetailsPage() {
  const { loanId } = useParams();
  const { fetchLoanDetails, loanDetails, loading, error ,repayLoan} = useLoanStore();
  const [loan, setLoan] = useState(null);
  const navigate=useNavigate()

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const loanData = await fetchLoanDetails(loanId);
        setLoan(loanData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetails();
  }, [fetchLoanDetails, loanId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!loan) {
    return null;
  }



  const handleRepayLoan = async () => {
    alert("Loan has been repaid successfully!");
    // try {
    //   await repayLoan({
    //     borrower_id: 9,
    //     loan_id: loanId,
    //     amount_paid: loanDetails.amount, // Assuming full payment
    //     payment_method: 'bank_transfer', // Replace with actual selection
    //     account_type: 'savings' // Replace with actual selection
    //   });
    //   alert('Loan repaid successfully!');
    // } catch (err) {
    //   alert(err.message);
    // }
  };

  return (
    <div className="w-full max-w-7xl border p-6 rounded shadow-lg bg-white">
    <span onClick={() => navigate(-1)} className="cursor-pointer text-blue-500 hover:underline">Go back</span>
    <h1 className="text-2xl font-bold mb-4">Loan Details</h1>
    <div className="space-y-4">
      <div>
        <h2 className="font-medium">Loan Type:</h2>
        <p>{loanDetails.loan_type}</p>
      </div>
      <div>
        <h2 className="font-medium">Amount:</h2>
        <p>Ksh{loanDetails.amount}</p>
      </div> 
      <div>
        <h2 className="font-medium">Purpose:</h2>
        <p>{loanDetails.purpose}</p>
      </div>
      <div>
        <h2 className="font-medium">Term Months:</h2>
        <p>{loanDetails.term_months}</p>
      </div>
      <div>
        <h2 className="font-medium">Status:</h2>
        <p>{loanDetails.status}</p>
      </div>
      <div>
        <h2 className="font-medium">Monthly Income:</h2>
        <p>Ksh{loanDetails.monthly_income}</p>
      </div> 
      <div>
        <h2 className="font-medium">Employment Status:</h2>
        <p>{loanDetails.employment_status}</p>
      </div>
      <div>
        <h2 className="font-medium">Employer Name:</h2>
        <p>{loanDetails.employer_name}</p>
      </div>
      <div>
        <h2 className="font-medium">Job Title:</h2>
        <p>{loanDetails.job_title}</p>
      </div>
      <div>
        <h2 className="font-medium">Years Employed:</h2>
        <p>{loanDetails.years_employed}</p>
      </div>
      <div>
        <h2 className="font-medium">Credit Score:</h2>
        <p>{loanDetails.credit_score}</p>
      </div>
      <div>
        <h2 className="font-medium">Existing Loans Monthly Payment:</h2>
        <p>Ksh{loanDetails.existing_loans_monthly_payment}</p>
      </div>
    </div>
    <div className="mt-6">
      <button 
        className={`px-4 py-2 rounded text-white ${loanDetails.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`} 
        onClick={handleRepayLoan} 
        disabled={loanDetails.status !== 'approved'}
      >
        Repay Loan
      </button>
    </div>
  </div>

  )
}

export default LoanDetailsPage
