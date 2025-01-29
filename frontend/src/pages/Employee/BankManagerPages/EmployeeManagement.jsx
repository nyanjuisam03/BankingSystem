import React from 'react'
import EmployeeTable from '../../../components/Tables/EmployeeTable'
import EmployeePerformancTable from '../../../components/Tables/EmployeePerformancTable'
import Card from '../../../components/Cards/FunctionCard'
import { useNavigate } from 'react-router-dom'

function EmployeeManagement() {
 const navigate=useNavigate()
  const handleNavigate = (path) => {
    navigate('/employee/bank-manager/register-employees')
    console.log(`Navigating to ${path}`);
  };
  return (
    <div className=" grid grid-cols-1">
    <h1 className="text-2xl font-bold mb-6">Bank Employees</h1>
    <EmployeeTable />
    <EmployeePerformancTable/>
    <Card
        title="Register Employees"
        description="Add new employees to the banking system"
        onClick={() => handleNavigate('/register-employees')}
      />
</div>
  )
}

export default EmployeeManagement
