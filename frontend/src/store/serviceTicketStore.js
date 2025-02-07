import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:2000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

const useServiceTicket=create((set,get)=>({
    tickets: [],
    isLoading: false,
    error: null,

    createTicket: async (ticketData) => {
        try {
            const response = await api.post('/management/create-service-ticket', ticketData);
            set((state) => ({
                tickets: [...state.tickets, response.data.data],
            }));
            return { success: true };
        } catch (error) {
            console.error('Error creating ticket:', error);
            return { success: false, error: error.response?.data?.message || 'Failed to create ticket' };
        }
    },


    updateTicketStatus: async (ticketId, newStatus,assignedTechnician = 'John Doe') => {
        try {
            await api.put(`/management/service-tickets/${ticketId}/status`, { status: newStatus });
            set((state) => ({
                tickets: state.tickets.map((ticket) =>
                    ticket.ticket_id === ticketId ? { ...ticket, status: newStatus } : ticket
                ),
            }));
            return { success: true };
        } catch (error) {
            console.error('Error updating ticket status:', error);
            return { success: false, error: error.response?.data?.message || 'Failed to update ticket status' };
        }
    },


    updateServiceTicketStatus: async (ticketId, newStatus) => {
        try {
            await api.put(`/management/service-tickets/${ticketId}/status`, { status: newStatus });
            set((state) => ({
                tickets: state.tickets.map((ticket) =>
                    ticket.ticket_id === ticketId ? { ...ticket, status: newStatus } : ticket
                ),
            }));
            return { success: true };
        } catch (error) {
            console.error('Error updating ticket status:', error);
            return { success: false, error: error.response?.data?.message || 'Failed to update ticket status' };
        }
    },

    fetchAllTickets: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('management/all-service-tickets');
            set({
                tickets: response.data.data,
                isLoading: false,
            });
        } catch (error) {
            console.error('Error fetching tickets:', error);
            set({
                error: error.response?.data?.message || 'Failed to fetch tickets',
                isLoading: false,
            });
        }
    },

    // Fetch tickets for a specific user
    fetchUserTickets: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/management/service-tickets/${userId}`);
            set({
                tickets: response.data.data,
                isLoading: false,
            });
        } catch (error) {
            console.error('Error fetching user tickets:', error);
            set({
                error: error.response?.data?.message || 'Failed to fetch user tickets',
                isLoading: false,
            });
        }
    },

}))

export default useServiceTicket;