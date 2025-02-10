import React, { useEffect, useState } from 'react';
import accountStore from '../../../store/accountStore';

function CustomersAccount() {
  const { accounts, fetchAllAccount, isLoading, error } = accountStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchAllAccount();
  }, [fetchAllAccount]);

  // Pagination logic
  const totalAccounts = accounts.length;
  const startIndex = currentPage * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalAccounts);
  const paginatedAccounts = accounts.slice(startIndex, endIndex);

  const nextPage = () => {
    if (endIndex < totalAccounts) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Function to convert account type number to text
  const getAccountTypeText = (type) => {
    const accountTypes = {
      1: 'SAVINGS',
      2: 'PREMIUM SAVINGS',
      3: 'STUDENT CHECKING',
      4: 'BUSINESS'
    };
    return accountTypes[type] || 'UNKNOWN';
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg my-5">
      <h2 className="text-lg font-semibold mb-2">All Customer Accounts</h2>

      {isLoading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-red-500 text-center py-4">{error}</div>}
      
      {!isLoading && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-600 text-white">
                  <th className="p-2">ID</th>
                  
                  <th className="p-2">Account Type</th>
                  <th className="p-2">Balance</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Created At</th>
                  <th className="p-2">Initial Deposit</th>
                  <th className="p-2">Account Number</th>
                  <th className="p-2">Verified By</th>
                  <th className="p-2">Updated At</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAccounts.length > 0 ? (
                  paginatedAccounts.map((account) => (
                    <tr key={account.id} className="border-b border-gray-200 even:bg-gray-100">
                      <td className="p-2">{account.id}</td>
                      <td className="p-2">{getAccountTypeText(account.account_type)}</td>
                      <td className="p-2">Ksh {account.balance.toLocaleString()}</td>
                      <td className="p-2">{account.status}</td>
                      <td className="p-2">{new Date(account.created_at).toLocaleString()}</td>
                      <td className="p-2">Ksh {account.intial_deposit.toLocaleString()}</td>
                      <td className="p-2">{account.account_number}</td>
                      <td className="p-2">{account.verified_by || 'N/A'}</td>
                      <td className="p-2">{new Date(account.updated_at).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center p-4 text-gray-500">
                      No accounts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <div className="flex items-center">
              <span className="mr-2">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value));
                  setCurrentPage(0);
                }}
                className="border rounded-md p-1 text-sm"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
            </div>
            <span>
              {startIndex + 1}-{endIndex} of {totalAccounts}
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
                disabled={endIndex >= totalAccounts}
                className={`px-3 py-1 rounded-md ${
                  endIndex >= totalAccounts ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 text-white"
                }`}
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CustomersAccount;