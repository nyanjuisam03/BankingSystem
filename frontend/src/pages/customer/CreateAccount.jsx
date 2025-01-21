import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import accountStore from '../../store/accountStore';
import useUserStore from '../../store/usersStore';
import { useState } from 'react';

function CreateAccount() {
  const navigate = useNavigate();
  const { openAccount, isLoading, error } = accountStore();
  const user = useUserStore((state) => state.user);
  
  const [formData, setFormData] = useState({
    account_type: '',
    intial_deposit: 0
  });

  useEffect(() => {
    // Check if user exists and has valid session
    const checkAuth = async () => {
      if (!user || !user.id) {
        navigate('/login', { state: { from: '/create-account' } });
      }
    };

    checkAuth();
  }, [user, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      navigate('/login', { state: { from: '/create-account' } });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate user authentication
    if (!user || !user.id) {
      navigate('/login');
      return;
    }

    // Validate minimum balance requirements
    const accountTypes = {
      1: { name: "Savings", minBalance: 100 },
      2: { name: "Premium Saving", minBalance: 20000 },
      3: { name: "Student Saving", minBalance: 0 },
      4: { name: "Business", minBalance: 50000 }
    };

    const selectedType = accountTypes[formData.account_type];
    if (parseFloat(formData.intial_deposit) < selectedType.minBalance) {
      alert(`Minimum deposit for ${selectedType.name} account is Ksh${selectedType.minBalance}`);
      return;
    }

    try {
      await openAccount({
        account_type: parseInt(formData.account_type),
        intial_deposit: parseFloat(formData.intial_deposit)
      });
      navigate('/customer');
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  };

  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <p className="text-center text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">Open New Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Account Type</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.account_type}
            onChange={(e) => setFormData({...formData, account_type: e.target.value})}
            required
          >
            <option value="">Select account type</option>
            {[
              { id: 1, name: "Savings", minBalance: 100 },
              { id: 2, name: "Premium Saving", minBalance: 20000 },
              { id: 3, name: "Student Saving", minBalance: 0 },
              { id: 4, name: "Business", minBalance: 50000 },
            ].map(type => (
              <option key={type.id} value={type.id}>
                {type.name} (Min: Ksh{type.minBalance})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Initial Deposit</label>
          <input
            type="number"
            step="0.01"
            className="w-full p-2 border rounded"
            value={formData.intial_deposit}
            onChange={(e) => setFormData({...formData, intial_deposit: e.target.value})}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}

export default CreateAccount;