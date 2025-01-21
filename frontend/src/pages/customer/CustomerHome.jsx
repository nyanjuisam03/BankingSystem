import React from 'react'
import { useEffect, useState } from 'react';
import useUserStore from '../../store/usersStore'
import { useNavigate } from 'react-router-dom';
import Customersidebar from '../../components/Customersidebar';
import { Outlet } from 'react-router-dom';

function CustomerHome() {
  return (
    <div className='flex'>
       <Customersidebar/>
       <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  )
}

export default CustomerHome
