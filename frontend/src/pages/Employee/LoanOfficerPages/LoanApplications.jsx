import React, { useState } from 'react';
import useUserStore from '../../../store/usersStore';
import loanStore from "../../../store/loanStore"

function LoanApplications() {

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  
  // Loan creation states
  const [formData, setFormData] = useState({
    loan_type: '',
    amount: '',
    purpose: '',
    term_months: '',
    monthly_income: '',
    employment_status: '',
    employer_name: '',
    job_title: '',
    years_employed: '',
    credit_score: '',
    existing_loans_monthly_payment: '0'
  });

  const { createCustomerLoans}=loanStore()
  const { searchUsers } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError('');
    try {
      const searchResults = await searchUsers(searchQuery);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateLoan = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    // Loan types with minimum requirements
    const loanTypes = {
      personal: { name: 'Personal Loan', minIncome: 30000 },
      home: { name: 'Home Loan', minIncome: 80000 },
      auto: { name: 'Auto Loan', minIncome: 45000 },
      business: { name: 'Business Loan', minIncome: 100000 }
    };

    const selectedType = loanTypes[formData.loan_type];
    
    if (!selectedType) {
      alert('Invalid loan type');
      return;
    }

    // Validate monthly income
    const monthlyIncome = parseFloat(formData.monthly_income);
    if (monthlyIncome < selectedType.minIncome) {
      alert(`Minimum monthly income for ${selectedType.name} is Ksh${selectedType.minIncome}`);
      return;
    }

    try {
      await createCustomerLoans({
        ...formData,
        user_id: selectedUser.id
      });

      // Reset form on success
      setFormData({
        loan_type: '',
        amount: '',
        purpose: '',
        term_months: '',
        monthly_income: '',
        employment_status: '',
        employer_name: '',
        job_title: '',
        years_employed: '',
        credit_score: '',
        existing_loans_monthly_payment: '0'
      });
      setSelectedUser(null);
      setSearchQuery('');
      setUsers([]);
    } catch (error) {
      console.error('Failed to create loan:', error);
      alert('Failed to create loan. Please check the error in the console.');
    }
  };
  return (
    <div className="w-full max-w-xl mx-auto bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create Loan for User</h2>
      
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

      {/* Loan Creation Form */}
      {selectedUser && (
        <form onSubmit={handleCreateLoan} className="space-y-4 border-t pt-4">
          <div>
            <label htmlFor="loan_type" className="block text-sm font-medium text-gray-700">Loan Type</label>
            <select
              id="loan_type"
              name="loan_type"
              value={formData.loan_type}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">Select Loan Type</option>
              <option value="personal">Personal Loan (Min Income: Ksh30,000)</option>
              <option value="home">Home Loan (Min Income: Ksh80,000)</option>
              <option value="auto">Auto Loan (Min Income: Ksh45,000)</option>
              <option value="business">Business Loan (Min Income: Ksh100,000)</option>
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Loan Amount</label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter loan amount"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Loan Purpose</label>
            <input
              id="purpose"
              name="purpose"
              type="text"
              value={formData.purpose}
              onChange={handleInputChange}
              placeholder="Enter loan purpose"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="term_months" className="block text-sm font-medium text-gray-700">Term (Months)</label>
            <input
              id="term_months"
              name="term_months"
              type="number"
              value={formData.term_months}
              onChange={handleInputChange}
              placeholder="Enter loan term in months"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="monthly_income" className="block text-sm font-medium text-gray-700">Monthly Income</label>
            <input
              id="monthly_income"
              name="monthly_income"
              type="number"
              value={formData.monthly_income}
              onChange={handleInputChange}
              placeholder="Enter monthly income"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="employment_status" className="block text-sm font-medium text-gray-700">Employment Status</label>
            <select
              id="employment_status"
              name="employment_status"
              value={formData.employment_status}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">Select Status</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="self_employed">Self Employed</option>
              <option value="unemployed">Unemployed</option>
            </select>
          </div>

          <div>
            <label htmlFor="employer_name" className="block text-sm font-medium text-gray-700">Employer Name</label>
            <input
              id="employer_name"
              name="employer_name"
              type="text"
              value={formData.employer_name}
              onChange={handleInputChange}
              placeholder="Enter employer name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="job_title" className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              id="job_title"
              name="job_title"
              type="text"
              value={formData.job_title}
              onChange={handleInputChange}
              placeholder="Enter job title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="years_employed" className="block text-sm font-medium text-gray-700">Years Employed</label>
            <input
              id="years_employed"
              name="years_employed"
              type="number"
              value={formData.years_employed}
              onChange={handleInputChange}
              placeholder="Enter years employed"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="credit_score" className="block text-sm font-medium text-gray-700">Credit Score</label>
            <input
              id="credit_score"
              name="credit_score"
              type="number"
              value={formData.credit_score}
              onChange={handleInputChange}
              placeholder="Enter credit score"
              min="300"
              max="850"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="existing_loans_monthly_payment" className="block text-sm font-medium text-gray-700">
              Existing Monthly Loan Payments
            </label>
            <input
              id="existing_loans_monthly_payment"
              name="existing_loans_monthly_payment"
              type="number"
              value={formData.existing_loans_monthly_payment}
              onChange={handleInputChange}
              placeholder="Enter existing monthly payments"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Create Loan
          </button>
        </form>
      )}
    </div>
  )
}

export default LoanApplications
