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

    updateEmployeeRole: async (employeeId, roleId) => {
        try {
            await api.put(`/users/employees/${employeeId}/role`, { roleId });
            set((state) => ({
                employees: state.employees.map((emp) =>
                    emp.user_id === employeeId ? { ...emp, role_id: roleId } : emp
                ),
                filteredEmployees: state.filteredEmployees.map((emp) =>
                    emp.user_id === employeeId ? { ...emp, role_id: roleId } : emp
                ),
            }));
            return { success: true };
        } catch (error) {
            console.error('Error updating role:', error);
            return { success: false, error: error.response?.data?.message || 'Failed to update role' };
        }
    },

    filterByRole: (roleId) => {
        const { employees } = get();
        set({ selectedRole: roleId });
    
        if (!roleId || roleId === 'All') { // Handle both 'All' and null
            set({ filteredEmployees: employees });
        } else {
            const filtered = employees.filter(employee => String(employee.role_id) === String(roleId)); // Ensure type match
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