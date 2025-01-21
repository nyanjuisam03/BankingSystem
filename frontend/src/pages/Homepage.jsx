import React from 'react'
import { useEffect, useState } from 'react';
import useUserStore from '../store/usersStore'
import { useNavigate } from 'react-router-dom';

function Homepage() {
  const { getUserDetails, isLoading, user,logout  } = useUserStore(); // Get user from store
  const [userDetails, setUserDetails] = useState(null);
  const navigate=useNavigate()

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // console.log(user.id)
  useEffect(() => {
      const fetchUserDetails = async () => {
          try {
              if (user?.id) { // Only fetch if we have a user ID
                  console.log('Fetching user with ID:', user.id);
                  const details = await getUserDetails(user.id);
                  setUserDetails(details);
              }
          } catch (error) {
              console.error('Failed to fetch user details:', error);
          }
      };

      fetchUserDetails();
  }, [user?.id]); // Depend on user.id instead of userId prop

  if (isLoading) return <div>Loading...</div>;
  if (!userDetails) return <div>No user found</div>;

  return (
     <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Details</h2>
      <div className="space-y-2">
          <p><strong>Username:</strong> {userDetails.username}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>First Name:</strong> {userDetails.firstName}</p>
          <p><strong>Last Name:</strong> {userDetails.lastName}</p>
          <p><strong>Role:</strong> {userDetails.role}</p>
      </div>

      <div>
      <button 
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
      </div>
    </div>
  )
}

export default Homepage
