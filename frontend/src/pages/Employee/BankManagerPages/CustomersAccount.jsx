import React, { useEffect } from 'react';
import accountStore from '../../../store/accountStore';

function CustomersAccount() {
  const { accounts, fetchAllAccount, isLoading, error } = accountStore();

  useEffect(() => {
    fetchAllAccount();
  }, [fetchAllAccount]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Customer Accounts</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">User ID</th>
              <th className="border p-2">Account Type</th>
              <th className="border p-2">Balance</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Initial Deposit</th>
              <th className="border p-2">Account Number</th>
              <th className="border p-2">Verified By</th>
              <th className="border p-2">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <tr key={account.id} className="border-t">
                  <td className="border p-2">{account.id}</td>
                  <td className="border p-2">{account.user_id}</td>
                  <td className="border p-2">{account.account_type}</td>
                  <td className="border p-2">{account.balance}</td>
                  <td className="border p-2">{account.status}</td>
                  <td className="border p-2">{new Date(account.created_at).toLocaleString()}</td>
                  <td className="border p-2">{account.intial_deposit}</td>
                  <td className="border p-2">{account.account_number}</td>
                  <td className="border p-2">{account.verified_by || 'N/A'}</td>
                  <td className="border p-2">{new Date(account.updated_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="p-2 text-center">No accounts found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CustomersAccount;
