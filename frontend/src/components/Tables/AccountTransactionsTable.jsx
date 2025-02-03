import React, { useEffect, useState } from 'react';
import useTransactionStore from '../../store/useTransactionStore';

function AccountTransactionsTable({ accountId }) { // Accept accountId as a prop
  const { transactions, fetchTransactions, isLoading, error } = useTransactionStore();
  const [currentAccountId, setCurrentAccountId] = useState(accountId); //  Initialize with the prop

  useEffect(() => {
    if (currentAccountId) {
      fetchTransactions(currentAccountId);
    }
  }, [currentAccountId, fetchTransactions]);

  const transactionData = transactions[currentAccountId] || [];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <div  className="bg-white p-4 rounded-lg shadow-lg my-5">
    <table className="table-auto w-full border-collapse border border-gray-200">
      <thead>
        <tr>
        <th className="border border-gray-300 px-4 py-2">Transaction Type</th>
          <th className="border border-gray-300 px-4 py-2">Amount</th>
          <th className="border border-gray-300 px-4 py-2">Date</th>
          <th className="border border-gray-300 px-4 py-2">Description</th>
         
        </tr>
      </thead>
      <tbody>
        {transactionData.length > 0 ? (
          transactionData.map((transaction) => (
            <tr key={transaction.id}>
              <td className="border border-gray-300 px-4 py-2">{transaction.type}</td>
              <td className="border border-gray-300 px-4 py-2">{transaction.amount}</td>
              <td className="border border-gray-300 px-4 py-2">
              {new Date(transaction.date).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">{transaction.description}</td>
              
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="border border-gray-300 px-4 py-2 text-center">
              No transactions available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  );
}

export default AccountTransactionsTable;
