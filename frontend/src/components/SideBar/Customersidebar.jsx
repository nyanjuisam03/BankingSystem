import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiDashboardLine, RiUserLine } from 'react-icons/ri';
import { BiTransfer, BiHistory } from 'react-icons/bi';
import { BsBank2 } from 'react-icons/bs';
import { AiOutlineFileText } from 'react-icons/ai';
import { LuTickets } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import useUserStore from '../../store/usersStore';

function Customersidebar({ isOpen, onClose }) {
  const [openSubmenus, setOpenSubmenus] = useState({});
  const sidebarRef = useRef(null);
  const user = useUserStore((state) => state.user);
  const userId = user?.id || "unauthorized";

  const toggleSubmenu = (index) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const menuItems = [
    {
      title: 'Account Services',
      icon: <BsBank2 size={20} />,
      path: '/accounts',
      submenu: [
        {
          title: 'Create Account',
          path: '/customer/accounts/create',
          permission: 'open_customer_account',
        },
        {
          title: 'Account Overview',
          path: '/customer/accounts/overview',
          permission: 'view_own_account',
        },
      ],
    },
    // {
    //   title: 'Transaction History',
    //   icon: <BiHistory size={20} />,
    //   path: '/customer/transaction-history',
    //   permission: 'view_transaction_history',
    // },
    {
      title: 'Personal Information',
      icon: <RiUserLine size={20} />,
      path: '/customer/personal-information',
      permission: 'update_personal_contact',
    },
    {
      title: 'Loan Services',
      icon: <RiDashboardLine size={20} />,
      path: '/loans',
      submenu: [
        // {
        //   title: 'Apply for Loan',
        //   path: '/customer/loan/application',
        //   permission: 'apply_for_loan',
        // },
        {
          title: 'Loan Status',
          path: '/customer/loan/status',
          permission: 'view_loan_status',
        },
      ],
    },
    // {
    //   title: 'Account Statements',
    //   icon: <AiOutlineFileText size={20} />,
    //   path: '/customer/statements',
    //   permission: 'download_account_statement',
    // },
    {
      title:"Booking Ticket",
      icon:<LuTickets  size={20}/>,
      path:'booking-ticket',
      submenu:[
        {
          title:"Booking Ticket",
          path:'/customer/booking-ticket/booking-tickets'
        },
        {
          title:"Ticket Status",
          path:`/customer/booking-ticket/ticket-status/${userId}`
        }
      ]
    }
  ];

  return (
    <>
    {/* Overlay for mobile */}
    {isOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
    )}

    {/* Sidebar */}
    <div
      ref={sidebarRef}
      className={`fixed lg:static h-screen bg-gray-800 text-white transition-all duration-300 z-50
        ${isOpen ? 'w-80 left-0' : '-left-64'} 
        lg:w-64 lg:block`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
        <img
  src="/pictures/FamilyBankLogo.png"
  alt="Logo"
  className="w-32 h-auto" // Adjust width as needed
/>
          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <nav className="mt-6">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                {!item.submenu ? (
                  <Link
                    to={item.path}
                    onClick={handleLinkClick}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <div>
                    <div
                      onClick={() => toggleSubmenu(index)}
                      className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      <span>{openSubmenus[index] ? '-' : '+'}</span>
                    </div>
                    {openSubmenus[index] && (
                      <ul className="pl-8 space-y-2 mt-2">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              onClick={handleLinkClick}
                              className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-all text-sm"
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  </>
  );
}

export default Customersidebar;
