import React from 'react'
import EmployeeTable from '../../../components/Tables/EmployeeTable'

function EmployeeManagement() {
  return (
    <div className="container mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold mb-6">Bank Employees</h1>
    <EmployeeTable />
</div>
  )
}

export default EmployeeManagement
