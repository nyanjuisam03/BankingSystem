import React, { useEffect, useState } from "react";
import useTransactionStore from "../../store/useTransactionStore";

function AccountTransactionsTable({ accountId }) {
  const { transactions, fetchTransactions, isLoading, error } = useTransactionStore();
  const [currentAccountId, setCurrentAccountId] = useState(accountId);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); 

  useEffect(() => {
    if (currentAccountId) {
      fetchTransactions(currentAccountId);
    }
  }, [currentAccountId, fetchTransactions]);

  const transactionData = transactions[currentAccountId] || [];
  const totalTransactions = transactionData.length;

  // Paginate data
  const startIndex = currentPage * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalTransactions);
  const paginatedTransactions = transactionData.slice(startIndex, endIndex);

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

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg my-5">
      <h2 className="text-lg font-semibold mb-2">My Transactions</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-600 text-white">
              <th className="p-2">Transaction Type</th>
              <th className="p-2">Amount (Ksh)</th>
              <th className="p-2">Date</th>
              <th className="p-2">Description</th>
             
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction, index) => (
                <tr key={transaction.id} className="border-b border-gray-200 even:bg-gray-100">
                  <td className="p-2">{transaction.type}</td>
                  <td className="p-2">{transaction.amount.toLocaleString()}</td>
                  <td className="p-2">{new Date(transaction.date).toLocaleString()}</td>
                  <td className="p-2">{transaction.description}</td>
                
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
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

export default AccountTransactionsTable;
