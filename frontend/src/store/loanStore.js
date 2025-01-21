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
        'employment_status'
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
        existing_loans_monthly_payment: loanData.existing_loans_monthly_payment || 0
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