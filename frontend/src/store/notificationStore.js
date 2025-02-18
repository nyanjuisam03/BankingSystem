import { create } from 'zustand';
import axios from 'axios';

// Axios instance with authentication interceptor
const api = axios.create({
  baseURL: 'http://localhost:2000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Zustand store
const useNotificationStore = create((set) => ({
  notifications: [],
  loading: false,
  error: null,
  notificationStatus: null,
  confirmedTickets: [],
  approvedLoans: [],
  rejectedLoans: [],

  // Send account approval notifications
  sendAccountApprovalNotification: async () => {
    try {
      set({ loading: true });
      const response = await api.post('/notification/approved-accounts');
      
      set({
        notificationStatus: response.data,
        loading: false,
        error: null
      });
      
      return response.data;
    } catch (error) {
      // Handle authentication errors specifically
      if (error.response?.status === 401) {
        set({ 
          error: 'Authentication token expired or invalid. Please log in again.',
          loading: false,
          notificationStatus: null
        });
      } else {
        set({ 
          error: error.response?.data?.message || 'Failed to send notifications',
          loading: false,
          notificationStatus: null
        });
      }
      throw error;
    }
  },

  // Get notification history
  getNotificationHistory: async () => {
    try {
      set({ loading: true });
      const response = await api.get('/notification/history');
      
      set({
        notifications: response.data.data,
        loading: false,
        error: null
      });
    } catch (error) {
      // Handle authentication errors specifically
      if (error.response?.status === 401) {
        set({ 
          error: 'Authentication token expired or invalid. Please log in again.',
          loading: false 
        });
      } else {
        set({ 
          error: error.response?.data?.message || 'Failed to fetch notification history',
          loading: false 
        });
      }
    }
  },

  // Send Ticket Status
  sendTicketStatusChangeNotification: async () => {
    try {
      set({ loading: true });
      const response = await api.post('/notification/tickets-confirmed');
      
      set({
        notificationStatus: response.data,
        loading: false,
        error: null
      });

      // If successful, update confirmed tickets list
      if (response.data.status === 'success') {
        set(state => ({
          confirmedTickets: [
            ...state.confirmedTickets,
            ...response.data.data.successfulTickets
          ]
        }));
      }
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        set({ 
          error: 'Authentication token expired or invalid. Please log in again.',
          loading: false,
          notificationStatus: null
        });
      } else {
        set({ 
          error: error.response?.data?.message || 'Failed to send ticket notifications',
          loading: false,
          notificationStatus: null
        });
      }
      throw error;
    }
  },

  //Send loan approval notifications
  sendLoanApprovalNotification: async () => {
    try {
      set({ loading: true });
      const response = await api.post('/notification/approved-loans');
      
      set({
        notificationStatus: response.data,
        loading: false,
        error: null
      });

      if (response.data.status === 'success') {
        set(state => ({
          approvedLoans: [
            ...state.approvedLoans,
            ...response.data.data.successfulLoans
          ]
        }));
      }
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        set({ 
          error: 'Authentication token expired or invalid. Please log in again.',
          loading: false,
          notificationStatus: null
        });
      } else {
        set({ 
          error: error.response?.data?.message || 'Failed to send approval notifications',
          loading: false,
          notificationStatus: null
        });
      }
      throw error;
    }
  },

  // Send loan rejection notifications
  sendLoanRejectNotification: async () => {
    try {
      set({ loading: true });
      const response = await api.post('/notification/rejected-loans');
      
      set({
        notificationStatus: response.data,
        loading: false,
        error: null
      });

      if (response.data.status === 'success') {
        set(state => ({
          rejectedLoans: [
            ...state.rejectedLoans,
            ...response.data.data.successfulLoans
          ]
        }));
      }
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        set({ 
          error: 'Authentication token expired or invalid. Please log in again.',
          loading: false,
          notificationStatus: null
        });
      } else {
        set({ 
          error: error.response?.data?.message || 'Failed to send rejection notifications',
          loading: false,
          notificationStatus: null
        });
      }
      throw error;
    }
  },

// Notify user when incident is assigned
sendIncidentAssignedNotification: async () => {
  try {
    set({ loading: true });
    const response = await api.post('/notification/notify-assigned');

    set({
      notificationStatus: response.data,
      loading: false,
      error: null,
    });

    return response.data;
  } catch (error) {
    // Handle authentication errors specifically
    if (error.response?.status === 401) {
      set({
        error: 'Authentication token expired or invalid. Please log in again.',
        loading: false,
        notificationStatus: null,
      });
    } else {
      set({
        error: error.response?.data?.message || 'Failed to send notification',
        loading: false,
        notificationStatus: null,
      });
    }
    throw error;
  }
},

// Notify user when incident is completed
sendIncidentCompletedNotification: async () => {
  try {
    set({ loading: true });
    const response = await api.post('/notification/notify-completed');

    set({
      notificationStatus: response.data,
      loading: false,
      error: null,
    });

    return response.data;
  } catch (error) {
    // Handle authentication errors specifically
    if (error.response?.status === 401) {
      set({
        error: 'Authentication token expired or invalid. Please log in again.',
        loading: false,
        notificationStatus: null,
      });
    } else {
      set({
        error: error.response?.data?.message || 'Failed to send notification',
        loading: false,
        notificationStatus: null,
      });
    }
    throw error;
  }
},
  // Clear notification status
  clearNotificationStatus: () => {
    set({ notificationStatus: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));

export default useNotificationStore;