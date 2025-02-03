import React, { useEffect } from 'react';
import useUserStore from '../../store/usersStore';
import accountStore from '../../store/accountStore';
import { useNavigate } from 'react-router-dom';
import { BsCreditCard2Front, BsPlusCircle } from 'react-icons/bs';


const AccountOverview = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { accounts, fetchAccounts, isLoading, error } = accountStore();

  useEffect(() => {
    if (user?.id) {
      fetchAccounts(user.id);
    }
  }, [user, fetchAccounts]);

  const getAccountTypeName = (type) => {
    const types = {
      1: "Savings",
      2: "Premium Savings",
      3: "Student Savings",
      4: "Business"
    };
    return types[type] || "Unknown Account Type";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500">Loading accounts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Accounts</h1>
        <button
          onClick={() => navigate('/customer/accounts/create')}
          className="flex items-center gap-2 border border-gray-800 text-gray-800 bg-white px-4 py-2 rounded hover:bg-gray-800 hover:text-white disabled:bg-gray-400"
        >
          <BsPlusCircle size={20} />
          <span>New Account</span>
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You don't have any accounts yet.</p>
          <button
            onClick={() => navigate('/create-account')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Open Your First Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div 
              key={account.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
            >
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-xl font-bold">
                  {getAccountTypeName(account.account_type)}
                </h2>
                <BsCreditCard2Front className="h-6 w-6 text-gray-600" />
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Account Number</p>
                  <p className="text-lg font-semibold">{account.account_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Balance</p>
                  <p className="text-2xl font-bold text-gray-600">
                    Ksh {account.balance?.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/customer/accounts/${account.id}`)}
                  className="w-full mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountOverview;