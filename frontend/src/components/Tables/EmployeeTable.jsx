import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmployeeStore from '../../store/employeeStore';

const EmployeeTable = () => {
    const navigate = useNavigate();
    const { 
        filteredEmployees, 
        isLoading, 
        error, 
        fetchAllEmployees,
        filterByRole,
        selectedRole 
    } = useEmployeeStore();

    useEffect(() => {
        fetchAllEmployees();
    }, [fetchAllEmployees]);

    const roles = [
        { id: 'all', name: 'All Roles' },
        { id: '1', name: 'admin' },
        { id: '2', name: 'Bank Manager' },
        { id: '3', name: 'Teller' },
        { id: '4', name: 'Loan Officer' },
        { id: '5', name: 'Customer' }
    ];

    const getRoleName = (roleId) => {
        const roleNames = {
            1: 'Admin',
            2: 'Bank Manager',
            3: 'Teller',
            4: 'Loan Officer',
            5: 'Customer'
        };
        return roleNames[roleId] || 'Unknown Role';
    };

    const getRoleColor = (roleId) => {
        const colors = {
            1: 'bg-red-100 text-red-800',
            2: 'bg-purple-100 text-purple-800',
            3: 'bg-green-100 text-green-800',
            4: 'bg-blue-100 text-blue-800',
            5: 'bg-gray-100 text-gray-800'
        };
        return colors[roleId] || 'bg-gray-100 text-gray-800';
    };

    const handleChangeRole = (employeeId) => {
        navigate(`/employee/bank-manager/employees/${employeeId}/change-role`);
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-gray-600">Loading employees...</p>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-red-500">{error}</p>
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Role Filter */}
            <div className="bg-white p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Role
                </label>
                <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => filterByRole(role.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                ${selectedRole === role.id 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            {role.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Employee Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Assigned Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEmployees.map((employee) => (
                            <tr key={employee.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {employee.user_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {employee.first_name} {employee.last_name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {employee.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                        ${getRoleColor(employee.role_id)}`}>
                                        {getRoleName(employee.role_id)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(employee.assigned_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleChangeRole(employee.id)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Change Role
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredEmployees.length === 0 && !isLoading && (
                    <div className="text-center py-4 text-gray-500">
                        No employees found for the selected role
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeTable;