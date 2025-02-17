import React, { useEffect, useState } from 'react';
import accountStore from '../../../../store/accountStore';
import useUserStore from '../../../../store/usersStore';
import useNotificationStore from '../../../../store/notificationStore';

function VerifyAccountStepTwo({ onBack }) {
  const { account, isLoading: accountLoading, updateAccount, fetchAccountDetail } = accountStore();
  const { getUserDetails, getTellerById, teller, error: storeError } = useUserStore();
  const { 
    sendAccountApprovalNotification, 
    loading, 
    notificationStatus 
  } = useNotificationStore();
  const [userDetails, setUserDetails] = useState(null);
  const [tellerDetails, setTellerDetails] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchUserDetails = async () => {
      if (account && account.user_id) {
        setIsLoadingUser(true);
        try {
          const userData = await getUserDetails(account.user_id);
          // Simulating additional user details that would come from the API
          const enhancedUserData = {
            ...userData,
            phoneNumber: '+254 712 345 678',
            kraPin: 'A012345678B',
            employer: {
              name: 'Tech Solutions Ltd',
              address: 'Business Park, Nairobi',
              position: 'Senior Developer',
              employmentDuration: '3 years'
            },
            documents: {
              nationalId: {
                number: '12345678',
                url: '/api/placeholder/300/200'
              },
              passport: {
                url: '/api/placeholder/300/400'
              }
            }
          };
          setUserDetails(enhancedUserData);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoadingUser(false);
        }
      }
    };

    fetchUserDetails();
  }, [account, getUserDetails]);

  // Add new useEffect to fetch teller details when component mounts
  useEffect(() => {
    const fetchTellerDetails = async () => {
      const userId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
      if (userId) {
        try {
          const tellerData = await getTellerById(userId);
          setTellerDetails(tellerData);
          console.log(tellerData)
        } catch (err) {
          setError('Failed to fetch teller details. Please ensure you are logged in as a teller.');
        }
      }
    };

    fetchTellerDetails();
  }, [getTellerById]);

  const handleApprove = async () => {
    try {
        // Ensure `tellerDetails` is optional
        const tellerId = tellerDetails?.id || null;

        // Call the `updateAccount` function without forcing `tellerId`
        await sendAccountApprovalNotification();
        await updateAccount(account.id, 'approved', tellerId);
        console.log(`Account ${account.id} successfully approved`);

        // Refresh account details after update
        await fetchAccountDetail(account.id);

        // Success feedback
        alert('Account successfully approved!');
    } catch (error) {
        // Provide error feedback to the user
        setError(error.response?.data?.message || 'Failed to approve the account');
        console.error('Error approving account:', error);
    }
};

  const handleReject = async () => {
    try {
      if (!tellerDetails || !tellerDetails.id) {
        throw new Error('Teller ID not found. Please ensure you are logged in as a teller.');
      }

      // Use the teller.id from the fetched teller details
      await updateAccount(account.id, 'rejected', tellerDetails.id);
      
      // Refresh account details after update
      await fetchAccountDetail(account.id);
      
      // Success feedback
      alert('Account has been rejected');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reject the account');
    }
  };

  
  if (accountLoading || isLoadingUser) return <div className="p-4">Loading details...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!account) return <div className="p-4">No account selected</div>;

  // Disable actions if account is already approved or rejected
  const isActionable = account.status === 'pending';


    return (
      <div className="w-full max-w-7xl p-6 bg-white shadow rounded-lg">
      <header className="mb-4">
        <h2 className="text-2xl font-bold">Step 2: Verify Account Details</h2>
      </header>
      <div className="space-y-6">
        {userDetails && (
          <>
            <div>
              <h3 className="text-lg font-medium mb-2">Account Owner Details</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                <div>
                  <p className="font-medium">Name</p>
                  <p>{userDetails.firstName} {userDetails.lastName}</p>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p>{userDetails.email}</p>
                </div>
                <div>
                  <p className="font-medium">Phone Number</p>
                  <p>{userDetails.phoneNumber}</p>
                </div>
                <div>
                  <p className="font-medium">KRA PIN</p>
                  <p>{userDetails.kraPin}</p>
                </div>
                <div>
                  <p className="font-medium">Username</p>
                  <p>{userDetails.username}</p>
                </div>
                <div>
                  <p className="font-medium">Role</p>
                  <p className="capitalize">{userDetails.role}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Employment Information</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                <div>
                  <p className="font-medium">Employer Name</p>
                  <p>{userDetails.employer.name}</p>
                </div>
                <div>
                  <p className="font-medium">Work Address</p>
                  <p>{userDetails.employer.address}</p>
                </div>
                <div>
                  <p className="font-medium">Position</p>
                  <p>{userDetails.employer.position}</p>
                </div>
                <div>
                  <p className="font-medium">Employment Duration</p>
                  <p>{userDetails.employer.employmentDuration}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Identity Documents</h3>
              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded">
                <div>
                  <p className="font-medium mb-2">National ID</p>
                  <p className="mb-2">ID Number: {userDetails.documents.nationalId.number}</p>
                  <img 
                    src={userDetails.documents.nationalId.url} 
                    alt="National ID" 
                    className="w-full h-auto rounded border border-gray-300"
                  />
                </div>
                <div>
                  <p className="font-medium mb-2">Passport Photo</p>
                  <img 
                    src={userDetails.documents.passport.url} 
                    alt="Passport Photo" 
                    className="w-full h-auto rounded border border-gray-300"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div>
          <h3 className="text-lg font-medium mb-2">Account Information</h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
            <div>
              <p className="font-medium">Account Number</p>
              <p>{account.account_number}</p>
            </div>
            <div>
              <p className="font-medium">Account Type</p>
              <p>Type {account.account_type}</p>
            </div>
            <div>
              <p className="font-medium">Balance</p>
              <p>Ksh {parseFloat(account.balance).toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium">Initial Deposit</p>
              <p>Ksh {parseFloat(account.intial_deposit).toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium">Created At</p>
              <p>{new Date(account.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium">Status</p>
              <p className={`capitalize ${
                account.status === 'approved' ? 'text-green-600' :
                account.status === 'rejected' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {account.status}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 border rounded hover:bg-gray-50"
            onClick={onBack}
          >
            Back
          </button>
          {isActionable && (
            <div className="space-x-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleReject}
                disabled={accountLoading || isLoadingUser}
              >
                {accountLoading || isLoadingUser ? 'Processing...' : 'Reject'}
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleApprove}
                disabled={accountLoading || isLoadingUser}
              >
                {accountLoading || isLoadingUser ? 'Processing...' : 'Approve'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    );
}

export default VerifyAccountStepTwo;