import React, { useState } from 'react';
import accountStore from '../../../store/accountStore'
import useUserStore from '../../../store/usersStore'

function AccountCreation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  
  // Account creation states
  const [accountType, setAccountType] = useState('');
  const [intialDeposit, setIntialDeposit] = useState('');

  // Zustand store actions and state
  const { openAccount, isLoading } = accountStore();
  const { searchUsers } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError('');
    try {
      const searchResults = await searchUsers(searchQuery);
      console.log("Click")
      setUsers(searchResults);
      if (searchResults.length === 0) {
        setError('No users found');
      }
    } catch (err) {
      setError('Error searching for users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
  
    // Account types with minimum deposit limits
    const accountTypes = {
      1: { name: 'Savings', minBalance: 100 },
      2: { name: 'Premium Saving', minBalance: 20000 },
      3: { name: 'Student Saving', minBalance: 0 },
      4: { name: 'Business', minBalance: 50000 }
    };
  
    // Convert accountType to integer to ensure it's in the correct format
    const selectedType = accountTypes[parseInt(accountType)];
  
    if (!selectedType) {
      alert('Invalid account type');
      return;
    }
  
    // Ensure initial deposit meets minimum balance
    const parsedDeposit = parseFloat(intialDeposit);
    if (isNaN(parsedDeposit)) {
      alert('Invalid initial deposit value');
      return;
    }
  
    if (parsedDeposit < selectedType.minBalance) {
      alert(`Minimum deposit for ${selectedType.name} account is Ksh${selectedType.minBalance}`);
      return;
    }
  
    try {
      // Add status as 'pending' or any valid status value from allowed list
      const status = 'pending';  // Assuming the account status should be 'pending' by default
  
      // Make sure the parameters are passed correctly
      const result = await openAccount({
        account_type: parseInt(accountType),  // Ensure account type is an integer
        intial_deposit: parsedDeposit,        // Ensure initial deposit is a float
        user_id: selectedUser.id,
        status: status  // Explicitly passing the status
      });
  
      // Reset form on success
      setAccountType('');
      setIntialDeposit('');
      setSelectedUser(null);
      setSearchQuery('');
      setUsers([]);
    
    } catch (error) {
      // Log the error to help identify what went wrong
      console.error('Failed to create account:', error);
      alert('Failed to create account. Please check the error in the console.');
    }
  };
  

  return (
    <div className="w-full max-w-xl mx-auto bg-white shadow-md p-6 rounded-lg">
    <h2 className="text-xl font-bold mb-4">Create Account for User</h2>
    
    {/* Search Form */}
    <form onSubmit={handleSearch} className="space-y-4 mb-6">
      <div className="flex space-x-2 items-end">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter username to search"
            disabled={isSearching}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching || !searchQuery.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          Search
        </button>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {users.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Search Results</label>
          <div className="mt-2 space-y-2">
            {users.map(user => (
              <div
                key={user.id}
                className={`p-3 rounded-md cursor-pointer ${
                  selectedUser?.id === user.id
                    ? 'bg-blue-100'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <p className="font-medium">Selected User:</p>
          <p>Username: {selectedUser.username}</p>
          <p>Email: {selectedUser.email}</p>
        </div>
      )}
    </form>

          {/* Account Creation Form */}
          {selectedUser && (
        <form onSubmit={handleCreateAccount} className="space-y-4 border-t pt-4">
          <div>
            <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">Account Type</label>
            <select
              id="accountType"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isLoading}
              required
            >
              <option value="">Select Account Type</option>
              <option value="1">Savings (Min: Ksh100)</option>
              <option value="2">Premium Saving (Min: Ksh20000)</option>
              <option value="3">Student Saving (Min: Ksh0)</option>
              <option value="4">Business (Min: Ksh50000)</option>
            </select>
          </div>

          <div>
            <label htmlFor="intialDeposit" className="block text-sm font-medium text-gray-700">Initial Deposit</label>
            <input
              id="intialDeposit"
              type="number"
              value={intialDeposit}
              onChange={(e) => setIntialDeposit(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!accountType || !intialDeposit || isLoading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      )}

  </div>
  )
}

export default AccountCreation
