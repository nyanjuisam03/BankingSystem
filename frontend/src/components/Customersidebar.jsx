import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiDashboardLine, RiUserLine } from 'react-icons/ri';
import { BiTransfer, BiHistory } from 'react-icons/bi';
import { BsBank2 } from 'react-icons/bs';
import { AiOutlineFileText } from 'react-icons/ai';
import { LuTickets } from "react-icons/lu";

function Customersidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const sidebarRef = useRef(null);

  const toggleSubmenu = (index) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleOutsideClick = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  const handleSidebarClick = () => {
    setIsSidebarOpen(true);
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

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
    {
      title: 'Transaction History',
      icon: <BiHistory size={20} />,
      path: '/customer/transaction-history',
      permission: 'view_transaction_history',
    },
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
        {
          title: 'Apply for Loan',
          path: '/customer/loan/application',
          permission: 'apply_for_loan',
        },
        {
          title: 'Loan Status',
          path: '/customer/loan/status',
          permission: 'view_loan_status',
        },
      ],
    },
    {
      title: 'Account Statements',
      icon: <AiOutlineFileText size={20} />,
      path: '/customer/statements',
      permission: 'download_account_statement',
    },
    {
      title:"Booking Ticket",
      icon:<LuTickets  size={20}/>,
      path:'/customer/booking-ticket'
    }
  ];

  return (
    <div
      ref={sidebarRef}
      onClick={handleSidebarClick}
      className={`h-screen bg-gray-800 text-white p-4 transition-width duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="mb-8">
        <h2 className={`text-xl font-bold ${!isSidebarOpen && 'hidden'}`}>
          Online Banking
        </h2>
      </div>

      <nav>
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {!item.submenu ? (
                <Link
                  to={item.path}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-all"
                >
                  {item.icon}
                  {isSidebarOpen && <span>{item.title}</span>}
                </Link>
              ) : (
                <div>
                  <div
                    onClick={() => toggleSubmenu(index)}
                    className="flex items-center justify-between space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      {isSidebarOpen && <span>{item.title}</span>}
                    </div>
                    {isSidebarOpen && (
                      <span>{openSubmenus[index] ? '-' : '+'}</span>
                    )}
                  </div>
                  {openSubmenus[index] && isSidebarOpen && (
                    <ul className="pl-8 space-y-2">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={subItem.path}
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
  );
}

export default Customersidebar;
