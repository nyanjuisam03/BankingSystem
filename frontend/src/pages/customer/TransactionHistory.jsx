import React, { useEffect } from 'react';
import useTransactionStore from '../../store/useTransactionStore';

const TransactionHistory = ({ accountId }) => {
   const { 
    fetchTransactions,
    getAccountTransactions,
    isLoading, 
    error 
  } = useTransactionStore();

  useEffect(() => {
    // Fetch transactions for account ID 5
    fetchTransactions(5);
  }, []);

  // Get transactions for account ID 5
  const transactions = getAccountTransactions(5);

  useEffect(() => {
    // Log whenever transactions change
    console.log('Current transactions:', transactions);
  }, [transactions]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Display the transaction list
  return (
    <div>
      <h2>Transactions</h2>
      {transactions.map(transaction => (
        <div key={transaction.id}>
          <p>Type: {transaction.type}</p>
          <p>Amount: ${transaction.amount}</p>
          <p>Description: {transaction.description}</p>
          <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default TransactionHistory;
