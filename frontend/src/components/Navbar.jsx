import React, { useState, useRef, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { IoLogOutOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { FaRegUserCircle } from "react-icons/fa";
import useUserStore from '../store/usersStore';


const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useUserStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout failed', error);
     
    }
  };

  return (
    <nav className="flex justify-end p-2 bg-white shadow-md">
     
    

      {/* Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {/* Profile Icon */}
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="hover:bg-gray-100 rounded-full px-9 focus:outline-none"
        >
          <FaRegUserCircle className="h-6 w-6 text-gray-600" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
            >
              <IoLogOutOutline className="h-5 w-5 mr-2 text-gray-600" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;