import { create } from 'zustand';
import axios from 'axios';

// Axios instance
const api = axios.create({
  baseURL: 'http://localhost:2000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Zustand store
const useCardStore = create((set) => ({
  cards: [],
  loading: false,
  error: null,

  // Fetch user cards function
  fetchUserCards: async (userId) => {
    try {
      set({ loading: true }); // Set loading to true
      const response = await api.get(`/card/get-user-card/${userId}`);
      set({ cards: response.data.data, loading: false }); // Set fetched cards
    } catch (error) {
      set({ error: error.message, loading: false }); // Set error if API fails
    }
  },

  // Create card function
  createCard: async (cardData) => {
    try {
      set({ loading: true }); // Set loading to true
      await api.post('/card/card-creation', cardData); // API call
      set((state) => ({
        cards: [...state.cards, cardData], // Add new card to cards array
        loading: false, // Set loading to false
      }));
    } catch (error) {
      set({ error: error.message, loading: false }); // Handle error
    }
  },
}));

export default useCardStore;
