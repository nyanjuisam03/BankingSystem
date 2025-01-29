import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useEmployeeStore from '../../../store/employeeStore';

function ChangeRoles() {
    const { employeeId } = useParams();
    const navigate = useNavigate();
    const { employees, updateEmployeeRole } = useEmployeeStore();
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    console.log(employeeId)
    const roles = [
        { id: '1', name: 'Admin' },
        { id: '2', name: 'Bank Manager' },
        { id: '3', name: 'Teller' },
        { id: '4', name: 'Loan Officer' },
        { id: '5', name: 'Customer' }
    ];

    const employee = employees.find(emp => emp.id === parseInt(employeeId));
    console.log(employees)

    useEffect(() => {
        if (employee) {
            setSelectedRole(employee.role_id.toString());
        }
    }, [employee]);

    const handleRoleChange = async () => {
        setIsLoading(true);
        setError(null);
        const result = await updateEmployeeRole(employeeId, selectedRole);
        setIsLoading(false);
        if (result.success) {
            navigate('/employee/bank-manager');
        } else {
            setError(result.error);
        }
    };

    if (!employee) return <p className="text-center text-red-500">Employee not found</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Role for {employee.first_name} {employee.last_name}</h2>

    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select New Role</label>
        <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
        >
            {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
            ))}
        </select>
    </div>

    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

    <div className="flex justify-end gap-2">
        <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
            onClick={() => navigate('/employee/bank-manager/employees')}
        >
            Cancel
        </button>
        <button
            className={`px-4 py-2 rounded-md text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            onClick={handleRoleChange}
            disabled={isLoading}
        >
            {isLoading ? 'Updating...' : 'Change Role'}
        </button>
    </div>
</div>
  )
}

export default ChangeRoles
