import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Customersidebar from '../../components/SideBar/Customersidebar';
import Navbar from '../../components/Navbar';

function CustomerHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Customersidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1">
        <Navbar 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
        />
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CustomerHome;