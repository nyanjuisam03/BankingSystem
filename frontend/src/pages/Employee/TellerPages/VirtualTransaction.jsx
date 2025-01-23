import React, { useEffect } from 'react';
import useTransactionStore from '../../../store/useTransactionStore';

function VirtualTransaction() {

  const { transactions, isLoading, error, fetchAllTransactions } = useTransactionStore();

  useEffect(() => {
    fetchAllTransactions(); // Fetch all transactions when the component mounts
  }, [fetchAllTransactions]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div className="overflow-x-auto">
    <h1 className="text-2xl font-semibold mb-4">All Transactions</h1>
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th className="px-4 py-2 border-b text-left">Transaction ID</th>
          <th className="px-4 py-2 border-b text-left">Date</th>
          <th className="px-4 py-2 border-b text-left">Amount</th>
          <th className="px-4 py-2 border-b text-left">Current Balance</th>
       
          <th  className="px-4 py-2 border-b text-left">Account Number</th>
          <th  className="px-4 py-2 border-b text-left">Username</th>
          {/* Add more columns as needed */}
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id} className="hover:bg-gray-100">
            <td className="px-4 py-2 border-b">{transaction.id}</td>
            <td className="px-4 py-2 border-b">{transaction.date}</td>
            <td className="px-4 py-2 border-b">{transaction.amount}</td>
            <td className="px-4 py-2 border-b">{transaction.current_balance}</td>
      
            <td className="px-4 py-2 border-b">{transaction.account_number}</td>
            <td className="px-4 py-2 border-b">{transaction.username}</td>
            {/* Add more table data as needed */}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default VirtualTransaction
