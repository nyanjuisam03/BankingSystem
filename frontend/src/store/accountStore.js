import { create } from "zustand";
import axios from 'axios';
import useUserStore from './usersStore';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:2000/api'
});

const accountStore = create((set) => ({
    accounts: [],
    transactions: [],
    isLoading: false,
    error: null,
    account: null,
    approvedAccountsTotal: 0,

    // Fetch all accounts for a user
    fetchAccounts: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/accounts/accounts/${userId}`);
            set({ accounts: response.data, isLoading: false });
            return response.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to fetch accounts', 
                isLoading: false 
            });
            throw error;
        }
    },


    updateAccount: async (accountId, newStatus, tellerId) => { 
        set({ isLoading: true, error: null });
        try {
            // Build the request payload dynamically
            const payload = {
                account_id: accountId,
                status: newStatus,
            };
    
            // Add teller_id only if it is provided
            if (tellerId) {
                payload.teller_id = tellerId;
            }
    
            // Send the PATCH request
            const response = await api.patch('/accounts/update-status', payload);
    
            // Update the state with the new account status
            set((state) => ({
                accounts: state.accounts.map((account) => 
                    account.id === accountId 
                        ? { ...account, status: newStatus }
                        : account
                ),
                isLoading: false
            }));
            
            return response.data;
        } catch (error) {
            // Handle errors and update the state
            set({ 
                error: error.response?.data?.message || 'Failed to update account status', 
                isLoading: false 
            });
            throw error;
        }
    },
    

    //Fetch all accounts 
    fetchAllAccount:async()=>{
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('accounts/get-accounts');
            set({ accounts: response.data, isLoading: false });
            return response.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to fetch accounts', 
                isLoading: false 
            });
            throw error;
        }
    },


    fetchApprovedAccountsTotal: async () => {
        set({ isLoading: true, error: null });
    
        try {
            const response = await api.get('accounts/get-accounts');
            
            console.log('API Response:', response.data);
            
            const accounts = response.data || [];
            
            const approvedAccountsTotal = accounts.filter(account => account.status === 'approved').length;
            
            console.log('Total Approved Accounts:', approvedAccountsTotal);
    
            set({ 
                approvedAccountsTotal, 
                isLoading: false 
            });
        } catch (error) {
            console.error('Error fetching approved accounts:', error);
            set({
                error: error.response?.data?.message || "Failed to fetch approved accounts total",
                isLoading: false,
                approvedAccountsTotal: 0
            });
        }
    },

    // Open a new account
    openAccount: async (accountData) => {
        const user = useUserStore.getState().user;
        
        if (!user || !user.id) {
            set({ error: 'User is not logged in or user ID is missing', isLoading: false });
            throw new Error('User is not logged in or user ID is missing');
        }

        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/accounts/open-account', {
                ...accountData,
                user_id: user.id
            });

            set((state) => ({
                accounts: [...state.accounts, response.data.details],
                isLoading: false
            }));

            return response.data.details;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to open account', 
                isLoading: false 
            });
            throw error;
        }
    },

    // Fetch account details
    fetchAccountDetail: async (accountId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/accounts/accounts-details/${accountId}`);
            set({ account: response.data, isLoading: false });
            return response.data;
        } catch (error) {
            console.error('Error fetching account:', error);
            set({ 
                error: error.response?.data?.error || 'Failed to fetch account', 
                isLoading: false 
            });
            throw error;
        }
    },

    // Add account transactions
    fetchTransactions: async (accountId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/transactions/transactions/${accountId}`);
            set({ transactions: response.data.data, isLoading: false });
            return response.data.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to fetch transactions', 
                isLoading: false 
            });
            throw error;
        }
    },

    // Create new transaction
    createTransaction: async (transactionData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/transactions/transactions', transactionData);
            
            // Update the transactions list with the new transaction
            set((state) => ({
                transactions: [...state.transactions, response.data.data],
                isLoading: false
            }));

            return response.data.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to create transaction', 
                isLoading: false 
            });
            throw error;
        }
    },

    // Reset account state
    resetAccountState: () => {
        set({
            accounts: [],
            transactions: [],
            account: null,
            isLoading: false,
            error: null
        });
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

export default accountStore;