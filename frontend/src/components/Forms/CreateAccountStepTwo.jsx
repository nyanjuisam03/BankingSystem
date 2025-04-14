import React, {useState, useEffect } from 'react';
import useUserStore from '../../store/usersStore';
import accountStore from '../../store/accountStore'
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';


function CreateAccountStepTwo({ onBack }) {
    const navigate = useNavigate();
    const { openAccount, isLoading, error } = accountStore();
    const user = useUserStore((state) => state.user);
    const { enqueueSnackbar } = useSnackbar();
    
    const [formData, setFormData] = useState({
      account_type: '',
      intial_deposit: 0,
      deposit_option:'',
      employer_name: '',
      employer_address: '',
      employer_phone: '',
      national_id_file: null,
      passport_photo: null,
      tax_pin: ''
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
      enqueueSnackbar(`Minimum deposit for ${selectedType.name} account is Ksh${selectedType.minBalance}`, {
        variant: 'error',
        autoHideDuration: 3000
      });
  
      try {
         await openAccount({
         account_type: parseInt(formData.account_type),
           intial_deposit: parseFloat(formData.intial_deposit)
         });

        enqueueSnackbar('Account was created successfully', {
          variant: 'success',
          autoHideDuration: 3000
        });

          setTimeout(() => {
          navigate('/customer');
        }, 1000);

      } catch (error) {
        enqueueSnackbar(err.message || 'Failed to create account', {
          variant: 'error',
          autoHideDuration: 4000
        });
      }
    };
  
    const handleFileChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
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
    <div className="max-w-8xl mx-auto bg-white rounded-lg shadow p-6">
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
     <label className="block text-gray-700 mb-2">Deposit Options</label>
     <select
       className="w-full p-2 border rounded"
      value={formData.deposit_option}
      onChange={(e)=>setFormData({...formData,deposit_option:e.target.value})}
      >
  <option value="" disabled>Select an option</option>
        <option value="bank-transfer">Bank Transfer</option>
        <option value="mobile-money">Mobile Money (M-PESA, Airtel Money)</option>
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

      {/* Employer Details Section */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-4">Employer Details</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Employer Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.employer_name}
              onChange={(e) => setFormData({...formData, employer_name: e.target.value})}
              placeholder="Enter employer name"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Employer Address</label>
            <textarea
              className="w-full p-2 border rounded"
              value={formData.employer_address}
              onChange={(e) => setFormData({...formData, employer_address: e.target.value})}
              placeholder="Enter employer address"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Employer Phone</label>
            <input
              type="tel"
              className="w-full p-2 border rounded"
              value={formData.employer_phone}
              onChange={(e) => setFormData({...formData, employer_phone: e.target.value})}
              placeholder="Enter employer phone number"
            />
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">National ID</label>
            <input
              type="file"
              name="national_id_file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
              accept="image/*,.pdf"
            />
            <p className="text-sm text-gray-500 mt-1">Upload a clear copy of your National ID (PDF or Image)</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Passport Photo</label>
            <input
              type="file"
              name="passport_photo"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
              accept="image/*"
            />
            <p className="text-sm text-gray-500 mt-1">Upload a recent passport photo (Image only)</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">KRA PIN</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.tax_pin}
              onChange={(e) => setFormData({...formData, tax_pin: e.target.value})}
              placeholder="Enter your KRA PIN"
            />
          </div>
        </div>
      </div>
      <div className="flex space-x-4">
  <button
    type="button"
    onClick={onBack}
    className="w-1/2 border border-red-800 text-red-800 bg-white px-4 py-2 rounded hover:bg-red-800 hover:text-white"
  >
    Back
  </button>
  <button
    type="submit"
    className="w-1/2 border border-gray-800 text-gray-800 bg-white px-4 py-2 rounded hover:bg-gray-800 hover:text-white disabled:bg-gray-400"
    disabled={isLoading}
  >
    {isLoading ? 'Processing...' : 'Create Account'}
  </button>
</div>
    </form>
  </div>
  )
}

export default CreateAccountStepTwo
