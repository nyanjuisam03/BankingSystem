import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLoanStore from '../../store/loanStore';
import useUserStore from '../../store/usersStore';

function LoanStatus() {

  const navigate = useNavigate();
  const { loans, loading, error, fetchUserLoans } = useLoanStore();
  const user = useUserStore((state) => state.user);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    const loadLoans = async () => {
      if (user?.id) {
        try {
          await fetchUserLoans();
        } catch (err) {
          console.error('Error fetching loans:', err);
        }
      } else {
        navigate('/login');
      }
    };

    loadLoans();
  }, [user, fetchUserLoans, navigate]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredLoans(loans);
    } else {
      setFilteredLoans(loans.filter(loan => loan.status.toLowerCase() === filter));
    }
  }, [loans, filter]);

  const getLoanStatusColor = (status) => {
    const statusColors = {
      draft: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return statusColors[status.toLowerCase()] || statusColors.default;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading your loans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="sm:flex sm:items-center sm:justify-between mb-8">
      <h1 className="text-2xl font-bold text-gray-900">My Loans</h1>
      <div className="mt-4 sm:mt-0">
        <button
          onClick={() => navigate('/customer/loan/application')}
          className="border border-gray-800 text-gray-800 bg-white px-4 py-2 rounded hover:bg-gray-800 hover:text-white disabled:bg-gray-400"
        >
          Apply for New Loan
        </button>
      </div>
    </div>

    <div className="mb-6">
      <div className="flex space-x-4">
        {['all', 'draft', 'approved', 'rejected'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-md ${
              filter === filterOption
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </button>
        ))}
      </div>
    </div>

    {filteredLoans.length === 0 ? (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No loans found.</p>
      </div>
    ) : (
      <div className="bg-white shadow overflow-hidden sm:rounded-md py-3">
        <ul className="divide-y divide-gray-200 ">
          {filteredLoans.map((loan) => (
            <li key={loan.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-600 truncate">
                    {loan.loan_type.charAt(0).toUpperCase() + loan.loan_type.slice(1)} Loan
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500">
                      Amount: {formatCurrency(loan.amount)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLoanStatusColor(loan.status)}`}>
                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                    <p className="mt-2 text-sm text-gray-500">
                      Applied on: {new Date(loan.application_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="sm:flex sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Term: {loan.term_months} months
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Purpose: {loan.purpose}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/customer/loan/loan-details/${loan.id}`)}
                      className="mt-2 sm:mt-0 text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
  )
}

export default LoanStatus
