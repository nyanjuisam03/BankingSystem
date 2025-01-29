import React, { useState } from 'react';
import useEmployeeStore from '../../store/employeeStore';

function EmployeePerformancTable() {
    const employeeData = [
        {
          id: 1,
          name: "John Smith",
          role: "Teller",
          accountsCompleted: 145,
          ticketsCompleted: 89,
          loansApproved: null
        },
        {
          id: 2,
          name: "Sarah Johnson",
          role: "Teller",
          accountsCompleted: 167,
          ticketsCompleted: 92,
          loansApproved: null
        },
        {
          id: 3,
          name: "Michael Brown",
          role: "Loan Officer",
          accountsCompleted: null,
          ticketsCompleted: 45,
          loansApproved: 78
        }
      ];
    
      const [selectedRole, setSelectedRole] = useState('All');
    
      const filteredEmployees = selectedRole === 'All' 
        ? employeeData 
        : employeeData.filter(emp => emp.role === selectedRole);
  return (
    <div className="p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">Employee Performance</h2>
      <select 
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="px-3 py-2 border rounded-md"
      >
        <option value="All">All Roles</option>
        <option value="Teller">Teller</option>
        <option value="Loan Officer">Loan Officer</option>
      </select>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Accounts Completed
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Tickets Completed
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Loans Approved
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredEmployees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {employee.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${employee.role === 'Teller' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {employee.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {employee.accountsCompleted ?? '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {employee.ticketsCompleted}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {employee.loansApproved ?? '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default EmployeePerformancTable
