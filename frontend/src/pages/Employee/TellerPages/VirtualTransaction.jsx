import React, { useEffect, useState } from 'react';
import useTransactionStore from '../../../store/useTransactionStore';

function VirtualTransaction() {
  const { transactions, isLoading, error, fetchAllTransactions } = useTransactionStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchAllTransactions();
  }, [fetchAllTransactions]);

  // Pagination calculations
  const totalTransactions = transactions.length;
  const startIndex = currentPage * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalTransactions);
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  const nextPage = () => {
    if (endIndex < totalTransactions) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg my-5">
      <h1 className="text-2xl font-semibold mb-4">All Transactions</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-600 text-white">
              <th className="p-2 text-left">Transaction ID</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Current Balance</th>
              <th className="p-2 text-left">Account Number</th>
              <th className="p-2 text-left">Username</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-200 even:bg-gray-100 hover:bg-gray-100">
                  <td className="p-2">{transaction.id}</td>
                  <td className="p-2">{new Date(transaction.date).toLocaleString()}</td>
                  <td className="p-2">{transaction.amount}</td>
                  <td className="p-2">{transaction.current_balance}</td>
                  <td className="p-2">{transaction.account_number}</td>
                  <td className="p-2">{transaction.username}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No transactions available
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
          {startIndex + 1}-{endIndex} of {totalTransactions}
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
            disabled={endIndex >= totalTransactions}
            className={`px-3 py-1 rounded-md ${
              endIndex >= totalTransactions ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 text-white"
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default VirtualTransaction;