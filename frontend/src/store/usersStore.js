import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// Create an axios instance with a base URL
const api = axios.create({
    baseURL: 'http://localhost:2000/api'
});

const useUserStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoading: false,
            error: null,
            teller: null,
            success: false,
            
            setUser: (user) => set({ user }),

            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/auth/login', credentials);
                    const { token, user, teller } = response.data;  // Assuming teller info comes in the login response
        
                    if (user && user.id) {
                        // Store the token and set headers
                        localStorage.setItem('token', token);
                        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
                        // If user is a teller and we have teller info, store the teller ID
                        if (user.role === 'teller' && teller && teller.id) {
                            localStorage.setItem('teller_id', teller.id);
                        }
        
                        set({ user, token, isLoading: false });
                        return response.data;
                    } else {
                        throw new Error("User data is missing or invalid");
                    }
                } catch (error) {
                    set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
                    throw error;
                }
            },
        

            registerUser: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/auth/register', userData);
                    set({ user: response.data, isLoading: false });
                    return response.data;
                } catch (error) {
                    set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
                    throw error;
                }
            },

            registerCustomer: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/auth/register-customer', userData);
                    set({ user: response.data, isLoading: false });
                    return response.data;
                } catch (error) {
                    set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
                    throw error;
                }
            },

            updateUser: async (userId, userData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.put(`/users/${userId}`, userData);
                    set({ user: response.data, isLoading: false });
                    return response.data;
                } catch (error) {
                    set({ error: error.response?.data?.message || 'Update failed', isLoading: false });
                    throw error;
                }
            },
            
            getTellerById: async (tellerId) => {
                set({ isLoading: true, error: null });
        
                try {
                    const response = await api.get(`users/tellers/${tellerId}`);
                    set({
                        teller: response.data.teller, // Store the fetched teller data
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Failed to fetch teller',
                        isLoading: false,
                    });
                }
            },


            resetPassword: async (username, newPassword) => {
                set({ isLoading: true, error: null, success: false });
                
                try {
                  const response = await api.post('/users/reset-password', { username, newPassword });
                  set({ success: true, isLoading: false });
                  return response.data;
                } catch (error) {
                  set({ 
                    error: error.response?.data?.message || 'Failed to reset password', 
                    isLoading: false 
                  });
                  throw error;
                }
              },


            getUserDetails: async (userId) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/users/users/${userId}`);
                    set({ isLoading: false });
                    return response.data;
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Failed to fetch user details',
                        isLoading: false
                    });
                    throw error;
                }
            },

            searchUsers: async (username) => {
                set({ isLoading: true });
                try {
                    console.log('Searching for users with username:', username);
                    const response = await api.get(`/users/search-username?username=${username}`);
                    if (response.data && response.data.data) {
                        return response.data.data; // Return the users data
                    } else {
                        set({ error: 'No users found', isLoading: false });
                        return [];
                    }
                } catch (error) {
                    console.error('Error in searchUsers:', error.response?.data?.message || error.message);
                    set({ 
                        error: error.response?.data?.message || 'Failed to search users',
                        isLoading: false 
                    });
                    throw error;
                }
            },

            logout: async () => {
                try {
                    await api.post('/auth/logout');
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                    set({ user: null, token: null });
                } catch (error) {
                    set({ error: error.response?.data?.message || 'Logout failed' });
                    throw error;
                }
            },

            // Initialize axios interceptor to handle token
            initializeAxios: () => {
                const token = localStorage.getItem('token');
                if (token) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }

                // Add response interceptor for token expiration
                api.interceptors.response.use(
                    (response) => response,
                    (error) => {
                        if (error.response?.status === 401) {
                            // Token expired or invalid
                            localStorage.removeItem('token');
                            delete api.defaults.headers.common['Authorization'];
                            set({ user: null, token: null });
                        }
                        return Promise.reject(error);
                    }
                );
            }
        }),
        {
            name: 'user-storage',
            partialize: (state) => ({ user: state.user, token: state.token })
        }
    )
);

// Initialize axios configuration when the store is created
useUserStore.getState().initializeAxios();

export default useUserStore;