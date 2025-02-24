import { create } from 'zustand';
import axios from 'axios';
import useUserStore from './usersStore';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:2000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to inject auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const useLoanStore = create((set, get) => ({
  // State
  loans: [],
  currentLoan: null,
  loading: false,
  error: null,
  successMessage: null,
  approvedLoansTotal: 0,
  isLoading: false,

  // Create new loan
  createLoan: async (loanData) => {
    const user = useUserStore.getState().user;

    if (!user?.id) {
      set({ error: 'User is not logged in or user ID is missing', loading: false });
      throw new Error('User is not logged in or user ID is missing');
    }

    set({ loading: true, error: null, successMessage: null });

    try {
      // Validate required fields
      const requiredFields = [
        'loan_type',
        'amount',
        'purpose',
        'term_months',
        'monthly_income',
        'employment_status',
         'account_number'
      ];


      const missingFields = requiredFields.filter(field => !loanData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Required fields missing: ${missingFields.join(', ')}`);
      }

      // Prepare loan data with proper null handling
      const preparedLoanData = {
        ...loanData,
        user_id: user.id,
        employer_name: loanData.employer_name || null,
        job_title: loanData.job_title || null,
        years_employed: loanData.years_employed || null,
        credit_score: loanData.credit_score || null,
        existing_loans_monthly_payment: loanData.existing_loans_monthly_payment || 0,
        account_number: loanData.account_number || null
      };

      const response = await api.post('/loans/loans/create-loan', preparedLoanData);

      // Update state with new loan data
      set(state => ({
        loans: [...state.loans, response.data.details],
        currentLoan: response.data.details,
        loading: false,
        successMessage: response.data.message || 'Loan application submitted successfully',
        error: null
      }));

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create loan application';
      set({
        error: errorMessage,
        loading: false,
        successMessage: null
      });
      throw new Error(errorMessage);
    }
  },

  setCurrentLoan: (loan) => set({ currentLoan: loan }),


  updateLoanStatus: async (loanId, statusData) => {
    const user = useUserStore.getState().user;
  
    if (!user?.id) {
      set({ error: 'User is not logged in or user ID is missing', loading: false });
      throw new Error('User is not logged in or user ID is missing');
    }
  
    set({ loading: true, error: null, successMessage: null });
  
    try {
      // Validate status
      const validStatuses = ['draft', 'submitted', 'under_review', 'approved', 'rejected'];
      if (!validStatuses.includes(statusData.status)) {
        throw new Error('Invalid status');
      }
  
      // Add user_id to headers
      const config = {
        headers: {
          'user-id': user.id,
        },
      };
  
      const response = await api.patch(
        `/loans/loans/${loanId}/status`,
        statusData,
        config
      );
  
      // Update the loan status in the local state
      set((state) => ({
        loans: state.loans.map((loan) =>
          loan.id === loanId
            ? { ...loan, status: statusData.status }
            : loan
        ),
        currentLoan:
          state.currentLoan?.id === loanId
            ? { ...state.currentLoan, status: statusData.status }
            : state.currentLoan,
        loading: false,
        successMessage: 'Loan status updated successfully',
        error: null,
      }));
  
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to update loan status';
      set({
        error: errorMessage,
        loading: false,
        successMessage: null,
      });
      throw new Error(errorMessage);
    }
  },


  createCustomerLoans: async(loanData)=>{
    set({ isLoading: true, error: null });
    try {
        const response = await api.post('/loans/loan-officer/create-loan', loanData);
        set(state => ({
            loans: [...state.loans, response.data.details],
            isLoading: false
        }));
        return response.data;
    } catch (error) {
        set({ error: error.response?.data?.message || 'Error creating loan', isLoading: false });
        throw error;
    }
  },
  // Fetch user loans
  fetchUserLoans: async () => {
    const user = useUserStore.getState().user;
    
    if (!user?.id) {
      set({ error: 'User is not logged in', loading: false });
      throw new Error('User is not logged in');
    }

    set({ loading: true, error: null });

    try {
      const response = await api.get(`/loans/loans/loan-customer/${user.id}`);
      
      set({ 
        loans: response.data.loans || [], 
        loading: false, 
        error: null 
      });

      return response.data.loans;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch loans';
      set({ 
        error: errorMessage, 
        loading: false 
      });
      throw new Error(errorMessage);
    }
  },

  // Fetch single loan
  fetchSingleLoan: async (loanId) => {
    const user = useUserStore.getState().user;
    
    if (!user?.id) {
      set({ error: 'User is not logged in', loading: false });
      throw new Error('User is not logged in');
    }

    if (!loanId) {
      set({ error: 'Loan ID is required', loading: false });
      throw new Error('Loan ID is required');
    }

    set({ loading: true, error: null });

    try {
      const response = await api.get(`/loans/loan-customer/${user.id}`, {
        params: { loan_id: loanId }
      });

      const loanData = response.data.loans;
      
      set({ 
        currentLoan: loanData, 
        loading: false, 
        error: null 
      });

      return loanData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch loan details';
      set({ 
        error: errorMessage, 
        loading: false 
      });
      throw new Error(errorMessage);
    }
  },


  fetchLoanDetails: async (loanId) => {
    if (!loanId) {
      set({ error: 'Loan ID is required', loading: false });
      throw new Error('Loan ID is required');
    }
  
    set({ loading: true, error: null });
  
    try {
      const response = await api.get(`/loans/loans/${loanId}`);
      set({ loanDetails: response.data, loading: false, error: null });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching loan details';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  fetchAllLoans: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get('/loans/all-loans');
      
   
      if (Array.isArray(response.data.loans)) {
        set({ loans: response.data.loans, loading: false });
      } else {
        set({ error: 'Loans data is not an array', loading: false });
      }
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Failed to fetch loans', 
        loading: false 
      });
    }
  },



  fetchPendingLoans: async () => {
    try {
        set({ loading: true, error: null });
        const response = await api.get('/loans/all-loans');
        
        // Filter only pending loans
        const pendingLoans = response.data.loans.filter(loan => 
            loan.status === 'draft'
        );
        
        set({ 
            loans: pendingLoans, 
            loading: false 
        });
    } catch (err) {
        set({ 
            error: err.response?.data?.message || 'Failed to fetch pending loans', 
            loading: false 
        });
    }
},


fetchApprovedLoansTotal: async () => {
  set({ isLoading: true, error: null });

  try {
      const response = await api.get('/loans/all-loans');
      
      console.log('API Response:', response.data);
      
      const loans = response.data.loans || [];
      
      console.log('Filtered Approved Loans:', loans.filter(loan => loan.status === 'approved'));

      const totalApprovedLoans = loans
          .filter(loan => loan.status === 'approved')
          .reduce((sum, loan) => sum + Number(loan.amount), 0);
      
      console.log('Calculated Approved Loans Total:', totalApprovedLoans);

      set({ 
          approvedLoansTotal: totalApprovedLoans || 0,
          isLoading: false 
      });
  } catch (error) {
      console.error('Error fetching approved loans:', error);
      set({
          error: error.response?.data?.message || "Failed to fetch approved loans total",
          isLoading: false,
          approvedLoansTotal: 0
      });
  }
},

  // Utility functions
  clearError: () => set({ error: null }),
  clearSuccessMessage: () => set({ successMessage: null }),
  clearCurrentLoan: () => set({ currentLoan: null }),
  clearStore: () => set({ 
    loans: [], 
    currentLoan: null, 
    loading: false, 
    error: null, 
    successMessage: null 
  })
}));

export default useLoanStore;