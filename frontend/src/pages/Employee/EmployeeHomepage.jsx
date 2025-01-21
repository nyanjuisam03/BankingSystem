import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Employeesidebar from '../../components/Employeesidebar';
import useUserStore from '../../store/usersStore';

function EmployeeHomepage() {
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if no user
    if (!user) {
      navigate('/login');
    }
    // Add role-based redirect if needed
    if (user && !['admin', 'bank_manager', 'teller', 'loan_officer'].includes(user.role?.toLowerCase())) {
      navigate('/unauthorized'); // Create this route/page if needed
    }
  }, [user, navigate]);

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className='flex'>
      <Employeesidebar userRole={user} /> {/* Pass user as userRole prop */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  )
}

export default EmployeeHomepage