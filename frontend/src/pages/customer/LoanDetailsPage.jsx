import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useLoanStore from '../../store/loanStore';
import { useNavigate } from 'react-router-dom';

function LoanDetailsPage() {
  const { loanId } = useParams();
  const { fetchLoanDetails, loanDetails, loading, error } = useLoanStore();
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

  return (
    <div>
        <span onClick={() => navigate(-1)} className="cursor-pointer">Go back</span>
      <h1 className="text-2xl font-bold mb-4">Loan Details</h1>
      <div className="space-y-4">
        <div>
          <h2 className="font-medium">Loan Type:</h2>
          <p>{loan.loan_type}</p>
        </div>
        <div>
          <h2 className="font-medium">Amount:</h2>
          <p>${loan.amount}</p>
        </div> 
        <div>
          <h2 className="font-medium">Purpose:</h2>
          <p>{loan.purpose}</p>
        </div>
        <div>
          <h2 className="font-medium">Term Months:</h2>
          <p>{loan.term_months}</p>
        </div>
        <div>
          <h2 className="font-medium">Status:</h2>
          <p>{loan.status}</p>
        </div>
         <div>
          <h2 className="font-medium">Monthly Income:</h2>
          <p>Ksh{loan.monthly_income}</p>
        </div> 
        <div>
          <h2 className="font-medium">Employment Status:</h2>
          <p>{loan.employment_status}</p>
        </div>
        <div>
          <h2 className="font-medium">Employer Name:</h2>
          <p>{loan.employer_name}</p>
        </div>
        <div>
          <h2 className="font-medium">Job Title:</h2>
          <p>{loan.job_title}</p>
        </div>
        <div>
          <h2 className="font-medium">Years Employed:</h2>
          <p>{loan.years_employed}</p>
        </div>
        <div>
          <h2 className="font-medium">Credit Score:</h2>
          <p>{loan.credit_score}</p>
        </div>
       <div>
          <h2 className="font-medium">Existing Loans Monthly Payment:</h2>
          <p>ksh{loan.existing_loans_monthly_payment}</p>
        </div>
      </div>
    </div>
  )
}

export default LoanDetailsPage
