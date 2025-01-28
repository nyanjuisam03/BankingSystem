import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:2000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

const useEmployeeStore = create((set, get) => ({
    employees: [],
    filteredEmployees: [],
    selectedRole: 'all',
    isLoading: false,
    error: null,

    fetchAllEmployees: async () => {
         set({ isLoading: true, error: null });
        try {
            const response = await api.get('/users/employees'); 
            set({
                employees: response.data.data,
                filteredEmployees: response.data.data,
                isLoading: false,
            });
        } catch (error) {
            console.error('Error fetching employees:', error);
            set({
                error: error.response?.data?.message || 'Failed to fetch employees',
                isLoading: false,
            });
        }
    },

    filterByRole: (roleId) => {
        const { employees } = get();
        set({ selectedRole: roleId });
        
        if (roleId === 'all') {
            set({ filteredEmployees: employees });
        } else {
            const filtered = employees.filter(employee => employee.role_id === roleId);
            set({ filteredEmployees: filtered });
        }
    },

    clearFilters: () => {
        const { employees } = get();
        set({ 
            selectedRole: 'all',
            filteredEmployees: employees
        });
    }
}));

export default useEmployeeStore;