import React, { useEffect } from 'react';
import accountStore from '../../../../store/accountStore';
import useUserStore from '../../../../store/usersStore';


function VerifyAccountStepOne({ onNext }) {

const { accounts, isLoading, error, fetchAllAccount } = accountStore();

  useEffect(() => {
    fetchAllAccount();
  }, []);

  const handleSelectAccount = async (accountId) => {
    await accountStore.getState().fetchAccountDetail(accountId);
    onNext();
  };

  if (isLoading) return <div className="p-4">Loading accounts...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="w-full max-w-7xl p-6 bg-white shadow rounded-lg">
    <header className="mb-4">
      <h2 className="text-2xl font-bold">Step 1: Select Account for Verification</h2>
    </header>
    <div className="space-y-4">
      {accounts
        .filter((acc) => acc.status === 'pending')
        .map((account) => (
          <div
            key={account.id}
            className="p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Account {account.account_number}</p>
                <p className="text-sm text-gray-600">
                  Balance: Ksh {parseFloat(account.balance).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Created: {new Date(account.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-gray-600"
                onClick={() => handleSelectAccount(account.id)}
              >
                Verify
              </button>
            </div>
          </div>
        ))}
      {accounts.filter((acc) => acc.status === 'pending').length === 0 && (
        <p className="text-center text-blue-500">No pending accounts to verify</p>
      )}
    </div>
  </div>
  )
}

export default VerifyAccountStepOne
