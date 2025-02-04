import React from 'react'
import { Outlet } from 'react-router-dom';
import Customersidebar from '../../components/SideBar/Customersidebar';
import Navbar from '../../components/Navbar';


function CustomerHome() {
  return (
    <div className='flex h-screen'>
      <Customersidebar/>
      <div className='flex flex-col flex-1'>
        <Navbar />
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default CustomerHome