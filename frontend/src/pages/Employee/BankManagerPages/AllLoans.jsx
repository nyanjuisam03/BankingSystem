import React ,{useEffect}from 'react'
import useLoanStore from '../../../store/loanStore'

function AllLoans() {
    const { loans, loading, error, fetchAllLoans } = useLoanStore();

    // Fetch loans when the component mounts
    useEffect(() => {
      fetchAllLoans();
    }, [fetchAllLoans]);
  
    if (loading) {
      return <div className="text-center py-4">Loading...</div>;
    }
  
    if (error) {
      return <div className="text-center text-red-500 py-4">Error: {error}</div>;
    }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Loans</h1>
      {loans.length === 0 ? (
        <div className="text-center text-gray-500">No loans available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 border">Loan ID</th>
                <th className="px-4 py-2 border">Loan Type</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Purpose</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Application Date</th>
                <th className="px-4 py-2 border">Employer</th>
                <th className="px-4 py-2 border">Job Title</th>
                <th className="px-4 py-2 border">Monthly Income</th>
                <th className="px-4 py-2 border">Existing Loan Payment</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} className="text-center border-b">
                  <td className="px-4 py-2 border">{loan.id}</td>
                  <td className="px-4 py-2 border">{loan.loan_type}</td>
                  <td className="px-4 py-2 border">Ksh {loan.amount}</td>
                  <td className="px-4 py-2 border">{loan.purpose}</td>
                  <td className="px-4 py-2 border">{loan.status}</td>
                  <td className="px-4 py-2 border">
                    {new Date(loan.application_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">{loan.employer_name}</td>
                  <td className="px-4 py-2 border">{loan.job_title}</td>
                  <td className="px-4 py-2 border">Ksh {loan.monthly_income}</td>
                  <td className="px-4 py-2 border">
                    Ksh {loan.existing_loans_monthly_payment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AllLoans
