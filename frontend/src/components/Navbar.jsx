import React, { useState, useRef, useEffect } from 'react';
import { IoLogOutOutline } from 'react-icons/io5';
import { FaRegUserCircle } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/usersStore';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useUserStore();

  // Dummy notifications
  const notifications = [
    {
      id: 1,
      title: "New Account Activity",
      message: "There was a recent login to your account",
      time: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      title: "Transaction Alert",
      message: "Your recent transaction has been processed",
      time: "5 hours ago",
      unread: false
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
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
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white shadow-md">
      {/* Menu Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-gray-100 rounded-lg"
      >
        <HiMenuAlt2 className="h-6 w-6 text-gray-600" />
      </button>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-4">
        {/* Notification Icon & Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="hover:bg-gray-100 rounded-full p-2 focus:outline-none relative"
          >
            <IoMdNotificationsOutline className="h-6 w-6 text-gray-600" />
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border rounded-md shadow-lg z-50">
              <div className="p-2 border-b">
                <h3 className="font-semibold text-gray-700">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                      notification.unread ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      {notification.unread && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t">
                <button className="text-sm text-blue-600 hover:text-blue-800 w-full text-center">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="hover:bg-gray-100 rounded-full p-2 focus:outline-none"
          >
            <FaRegUserCircle className="h-6 w-6 text-gray-600" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
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
      </div>
    </nav>
  );
};

export default Navbar;