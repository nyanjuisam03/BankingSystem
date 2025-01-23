import { create } from 'zustand';
import axios from 'axios';


// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:2000/api',
});

const useTransactionStore = create((set, get) => ({
    transactions: [],  // Object to store transactions by account ID
    isLoading: false,
    error: null,

    // Fetch transactions for a specific account
    fetchTransactions: async (accountId) => {
        if (!accountId) {
            console.error('No account ID provided');
            return;
        }

        set({ isLoading: true, error: null });
        try {
            console.log('Fetching transactions for account:', accountId);
            
            const response = await api.get(`/transactions/transactions/${accountId}`);
            console.log("Full API Response:", response);
            console.log("Response data:", response.data);
            
            // Update state with new transactions
            set({
                transactions: {
                    [accountId]: response.data.data  // Store the transactions array directly
                },
                isLoading: false
            });

            // Log the updated state to verify
            const currentState = get();
            console.log('Updated store state:', {
                transactions: currentState.transactions,
                isLoading: currentState.isLoading,
                error: currentState.error
            });

        } catch (error) {
            console.error("Detailed API Error:", {
                message: error.message,
                response: error.response,
                data: error.response?.data,
                status: error.response?.status
            });
            
            set({
                error: error.response?.data?.message || "Failed to fetch transactions",
                isLoading: false,
            });
        }
    },

    // Helper method to log current state
    logCurrentState: () => {
        const state = get();
        console.log('Current Transaction Store State:', {
            transactions: state.transactions,
            isLoading: state.isLoading,
            error: state.error
        });
    },

    // Get transactions for a specific account
    getAccountTransactions: (accountId) => {
        const state = get();
        return state.transactions[accountId] || [];
    },


    // Create a new transaction
    createTransaction: async (transactionData) => {
        set({ isLoading: true, error: null });
        try {
            // Ensure the correct transaction type string is used
            const type = transactionData.type === 'withdraw' ? 'withdrawal' : transactionData.type;

            const response = await api.post('/transactions/transactions', {
                account_id: transactionData.account_id,
                type: type,
                amount: parseFloat(transactionData.amount),
                description: transactionData.description
            });

            // Extract the new transaction data
            const newTransaction = response.data.data;

            // Update the transactions list in the store
            set((state) => {
                const accountTransactions = state.transactions[transactionData.account_id] || [];
                
                return {
                    transactions: {
                        ...state.transactions,
                        [transactionData.account_id]: [newTransaction, ...accountTransactions]
                    },
                    isLoading: false
                };
            });

            return response.data.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create transaction';
            set({ 
                error: errorMessage, 
                isLoading: false 
            });
            throw error;
        }
    },

   

    fetchAllTransactions: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.get('/transactions/all-transactions');
            set({ transactions: response.data.data, isLoading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to fetch transactions",
                isLoading: false,
            });
        }
    },
    // Clear errors
    clearError: () => set({ error: null }),

    // Reset store for an account
    resetTransactions: (accountId) => {
        set(state => ({
            transactions: {
                ...state.transactions,
                [accountId]: []
            }
        }));
    },

    // Refresh transactions for an account
    refreshTransactions: async (accountId) => {
        await get().fetchTransactions(accountId);
    },

    // Format transaction amount
    formatAmount: (amount, type) => {
        const formattedAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
        return type === 'withdrawal' ? `-${formattedAmount}` : formattedAmount;
    }
}));

// Initialize axios interceptor for token handling
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
export default useTransactionStore;