import React, { useEffect, useState } from 'react'
import useLoanStore from '../../../store/loanStore'

function AllLoans() {
    const { loans, loading, error, fetchAllLoans } = useLoanStore();
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Fetch loans when the component mounts
    useEffect(() => {
      fetchAllLoans();
    }, [fetchAllLoans]);
  
    // Pagination logic
    const totalLoans = loans.length;
    const startIndex = currentPage * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalLoans);
    const paginatedLoans = loans.slice(startIndex, endIndex);

    const nextPage = () => {
      if (endIndex < totalLoans) {
        setCurrentPage((prev) => prev + 1);
      }
    };

    const prevPage = () => {
      if (currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      }
    };
  
    if (loading) {
      return <div className="text-center py-4">Loading...</div>;
    }
  
    if (error) {
      return <div className="text-center text-red-500 py-4">Error: {error}</div>;
    }
  
  return (
    <div className="p-4 bg-white shadow-md rounded-lg my-5">
      <h2 className="text-lg font-semibold mb-2">All Loans</h2>

      {loans.length === 0 ? (
        <div className="text-center text-blue-500 py-4">No loans available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-2">Loan Type</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Purpose</th>
                <th className="p-2">Status</th>
                <th className="p-2">Application Date</th>
                <th className="p-2">Employer</th>
                <th className="p-2">Job Title</th>
                <th className="p-2">Monthly Income</th>
                <th className="p-2">Existing Loan Payment</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLoans.map((loan) => (
                <tr key={loan.id} className="border-b border-gray-200 even:bg-gray-100">
                  <td className="p-2">{loan.loan_type}</td>
                  <td className="p-2">Ksh {loan.amount.toLocaleString()}</td>
                  <td className="p-2">{loan.purpose}</td>
                  <td className="p-2">{loan.status}</td>
                  <td className="p-2">
                    {new Date(loan.application_date).toLocaleDateString()}
                  </td>
                  <td className="p-2">{loan.employer_name}</td>
                  <td className="p-2">{loan.job_title}</td>
                  <td className="p-2">Ksh {loan.monthly_income.toLocaleString()}</td>
                  <td className="p-2">
                    Ksh {loan.existing_loans_monthly_payment.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="flex items-center">
          <span className="mr-2">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setCurrentPage(0); // Reset to first page when changing rows per page
            }}
            className="border rounded-md p-1 text-sm"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
        </div>
        <span>
          {startIndex + 1}-{endIndex} of {totalLoans}
        </span>
        <div>
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`mr-2 px-3 py-1 rounded-md ${
              currentPage === 0 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 text-white"
            }`}
          >
            ← Previous
          </button>
          <button
            onClick={nextPage}
            disabled={endIndex >= totalLoans}
            className={`px-3 py-1 rounded-md ${
              endIndex >= totalLoans ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 text-white"
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

export default AllLoans