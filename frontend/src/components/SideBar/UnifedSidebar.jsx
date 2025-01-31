import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiDashboardLine, RiUserLine, RiAdminLine } from 'react-icons/ri';
import { BiTransfer, BiHistory } from 'react-icons/bi';
import { BsBank2 } from 'react-icons/bs';
import { AiOutlineFileText } from 'react-icons/ai';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { LuTickets } from "react-icons/lu";

function UnifedSideBar({ userRole }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState({});
    const sidebarRef = useRef(null);
    const navigate = useNavigate();
  
    const customerMenuItems = [
      {
        title: 'Account Services',
        icon: <BsBank2 size={20} />,
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
        title: "Booking Ticket",
        icon: <LuTickets size={20}/>,
        path: '/customer/booking-ticket'
      }
    ];
  
    const employeeMenuItems = {
      admin: {
        title: 'System Administrator',
        icon: <RiAdminLine size={20} />,
        submenu: [
          { title: 'Dashboard', path: '/employee/admin/dashboard' },
          { title: 'User Management', path: '/employee/admin/user-management' },
          { title: 'System Configuration', path: '/employee/admin/system-config' },
          { title: 'Access Control', path: '/employee/admin/access-control' },
          { title: 'Audit Logs', path: '/employee/admin/audit-logs' },
        ],
      },
      bank_manager: {
        title: 'Bank Manager',
        icon: <BsBank2 size={20} />,
        submenu: [
          { title: 'Dashboard', path: '/employee/bank-manager/manager-dashboard' },
          { title: 'Employee Management', path: '/employee/bank-manager/employees' },
          { title: 'Branch Operations', path: '/employee/bank-manager/operations' },
          { title: 'Performance Monitoring', path: '/employee/bank-manager/performance' },
        ],
      },
      teller: {
        dashboard: {
          title: 'Dashboard',
          icon: <HiOutlineUserGroup size={20} />,
          submenu: [
            { title: 'Dashboard Home', path: '/employee/teller/teller-dashboard' },
          ],
        },
        accountServices: {
          title: 'Account Services',
          icon: <HiOutlineUserGroup size={20} />,
          submenu: [
            { title: 'Verify Accounts', path: '/employee/teller/verify-accounts' },
            { title: 'Password Reset', path: '/employee/teller/password-reset' },
            { title: 'Making Accounts', path: '/employee/teller/account-creation' },
            { title: 'Debit/Credit Cards', path: '/employee/teller/card-creation' },
          ],
        },
        customerSupport: {
          title: 'Customer Support',
          icon: <HiOutlineUserGroup size={20} />,
          submenu: [
            { title: 'Support Home', path: '/employee/teller/customer-support' },
          ],
        },
        virtualTransactions: {
          title: 'Virtual Transactions',
          icon: <HiOutlineUserGroup size={20} />,
          submenu: [
            { title: 'Check Users Transactions', path: '/employee/teller/virtual-transactions' },
          ],
        },
      },
      loan_officer: {
        title: 'Loan Officer',
        icon: <FaRegMoneyBillAlt size={20} />,
        submenu: [
          { title: 'Dashboard', path: '/employee/loan_officer/dashboard' },
          { title: 'Loan Applications', path: '/employee/loan_officer/applications' },
          { title: 'Loan Approval', path: '/employee/loan_officer/approval' },
        ],
      },
    };
  
    const getMenuItemsByRole = (role) => {
      if (!role) return [];
      
      const normalizedRole = role.toLowerCase();
      
      // Handle customer role
      if (normalizedRole === 'customer') {
        return customerMenuItems;
      }
      
      // Handle employee roles
      switch (normalizedRole) {
        case 'admin':
          return [employeeMenuItems.admin];
        case 'bank_manager':
          return [employeeMenuItems.bank_manager];
        case 'teller':
          return Object.values(employeeMenuItems.teller);
        case 'loan_officer':
          return [employeeMenuItems.loan_officer];
        default:
          return [];
      }
    };
  
    const toggleSubmenu = (index) => {
      setIsSidebarOpen(true);
      setOpenSubmenus(prev => ({
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
  
    const renderMenuItem = (item) => {
      if (!item.submenu) {
        return (
          <Link
            to={item.path}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-all"
          >
            {item.icon}
            {isSidebarOpen && <span>{item.title}</span>}
          </Link>
        );
      }
    }
  return (
    <div>
      
    </div>
  )
}

export default UnifedSideBar
