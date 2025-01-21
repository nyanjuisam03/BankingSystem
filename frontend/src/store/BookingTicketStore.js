import { create } from 'zustand';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:2000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

const useTicketStore = create((set, get) => ({
    tickets: {},  // Object to store tickets by user ID
    isLoading: false,
    error: null,

    // Fetch tickets for a specific user
    fetchUserTickets: async (userId) => {
        if (!userId) {
            console.error('No user ID provided');
            return;
        }

        set({ isLoading: true, error: null });
        try {
            console.log('Fetching tickets for user:', userId);
            
            const response = await api.get(`/booking/booking-ticket/${userId}`);
            console.log("Full API Response:", response);
            console.log("Response data:", response.data);
            
            // Update state with new tickets
            set({
                tickets: {
                    [userId]: response.data.data
                },
                isLoading: false
            });

            // Log the updated state to verify
            const currentState = get();
            console.log('Updated store state:', {
                tickets: currentState.tickets,
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
                error: error.response?.data?.message || "Failed to fetch tickets",
                isLoading: false,
            });
        }
    },

    // Helper method to log current state
    logCurrentState: () => {
        const state = get();
        console.log('Current Ticket Store State:', {
            tickets: state.tickets,
            isLoading: state.isLoading,
            error: state.error
        });
    },

    // Get tickets for a specific user
    getUserTickets: (userId) => {
        const state = get();
        return state.tickets[userId] || [];
    },

    // Create a new ticket
    createTicket: async (ticketData) => {
        set({ isLoading: true, error: null });
        try {
            // Log the request payload
            console.log('Creating ticket with data:', ticketData);
    
            const payload = {
                userId: ticketData.userId,
                ticketType: ticketData.ticketType,
                appointmentDate: ticketData.appointmentDate,
                appointmentTime: ticketData.appointmentTime,
                description: ticketData.description
            };
    
            // Log the formatted payload
            console.log('Formatted API payload:', payload);
    
            const response = await api.post('/booking/create-booking-ticket', payload);
    
            // Log successful response
            console.log('Server response:', response.data);
    
            const newTicket = response.data.data;
    
            set((state) => {
                const userTickets = state.tickets[ticketData.userId] || [];
                return {
                    tickets: {
                        ...state.tickets,
                        [ticketData.userId]: [newTicket, ...userTickets]
                    },
                    isLoading: false
                };
            });
    
            return response.data.data;
        } catch (error) {
            // Enhanced error logging
            console.error('Error creating ticket:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                originalError: error
            });
    
            const errorMessage = error.response?.data?.message || 'Failed to create ticket';
            set({ 
                error: errorMessage, 
                isLoading: false 
            });
            throw error;
        }
    },

    // Cancel a ticket
    cancelTicket: async (ticketId, userId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.patch(`/booking/cancel-booking-ticket`);
            
            // Update the ticket status in the store
            set((state) => {
                const userTickets = state.tickets[userId] || [];
                const updatedTickets = userTickets.map(ticket => 
                    ticket.id === ticketId 
                        ? { ...ticket, status: 'CANCELLED' }
                        : ticket
                );
                
                return {
                    tickets: {
                        ...state.tickets,
                        [userId]: updatedTickets
                    },
                    isLoading: false
                };
            });

            return response.data.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to cancel ticket';
            set({ 
                error: errorMessage, 
                isLoading: false 
            });
            throw error;
        }
    },

    // Clear errors
    clearError: () => set({ error: null }),

    // Reset store for a user
    resetTickets: (userId) => {
        set(state => ({
            tickets: {
                ...state.tickets,
                [userId]: []
            }
        }));
    },

    // Refresh tickets for a user
    refreshTickets: async (userId) => {
        await get().fetchUserTickets(userId);
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

export default useTicketStore;