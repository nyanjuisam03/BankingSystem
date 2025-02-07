import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiDashboardLine, RiUserLine, RiAdminLine } from 'react-icons/ri';
import { BiTransfer, BiHistory } from 'react-icons/bi';
import { BsBank2 } from 'react-icons/bs';
import { AiOutlineFileText } from 'react-icons/ai';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { HiOutlineUserGroup } from 'react-icons/hi';
import useUserStore from '../../store/usersStore';

function Employeesidebar({ userRole }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState({});
    const sidebarRef = useRef(null);
    const { user } = useUserStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const allMenuItems = {
        admin: {
            title: 'System Administrator',
            icon: <RiAdminLine size={20} />,
            submenu: [
                {
                    title: 'Dashboard',
                    path: '/employee/admin/dashboard',
                },
                {
                    title: 'User Management',
                    path: '/employee/admin/user-management',
                },
                {
                    title: 'System Configuration',
                    path: '/employee/admin/system-config',
                },
                {
                    title: 'Access Control',
                    path: '/employee/admin/access-control',
                },
                {
                    title: 'Audit Logs',
                    path: '/employee/admin/audit-logs',
                },
            ],
        },
        bank_manager: {
            dashboard: {
                title: 'Dashboard',
                icon: <BsBank2 size={20} />,
                submenu: [
                    {
                        title: 'Dashboard Home',
                        path: '/employee/bank-manager/manager-dashboard',
                    },
                ],
            },
            employeeManagement: {
                title: 'Employee Management',
                icon: <BsBank2 size={20} />,
                submenu: [
                    {
                        title: 'Employee List',
                        path: '/employee/bank-manager/employees',
                    },
                    {
                        title: 'Performance Reviews',
                        path: '/employee/bank-manager/performance',
                    },
                   {
                    title:'Register New Employees',
                    path:'/employee/bank-manager/register'
                   }
                ],
            },
            transactionFunds: {
                title: 'Transaction and Fund Management',
                icon: <BsBank2 size={20} />,
                submenu: [
                    {
                        title: 'View Customer Accounts',
                        path: '/employee/bank-manager/accounts',
                    },
                    {
                        title: 'Monitor Customer Transactions',
                        path: '/employee/bank-manager/transactions',
                    },
                    // {
                    //     title: 'Resource Management',
                    //     path: '/employee/bank-manager/resources',
                    // },
                ],
            },
            loanCredit: {
                title: 'Loan and Credit Management',
                icon: <BsBank2 size={20} />,
                submenu: [
                    {
                        title: 'Loans Overview',
                        path: '/employee/bank-manager/loans',
                    },
                    // {
                    //     title: 'KPI Dashboard',
                    //     path: '/employee/bank-manager/kpi',
                    // },
                    // {
                    //     title: 'Analytics',
                    //     path: '/employee/bank-manager/analytics',
                    // },
                ],
            },
            incidentTickets: {
                title: 'Incident Assignment',
                icon: <BsBank2 size={20} />,
                submenu: [
                    {
                        title: 'Assign Incidents',
                        path: '/employee/bank-manager/incident',
                    },
                    // {
                    //     title: 'KPI Dashboard',
                    //     path: '/employee/bank-manager/kpi',
                    // },
                    // {
                    //     title: 'Analytics',
                    //     path: '/employee/bank-manager/analytics',
                    // },
                ],
            },
        },
        teller: {
            dashboard: {
                title: 'Dashboard',
                icon: <HiOutlineUserGroup size={20} />,
                submenu: [
                    {
                        title: 'Dashboard Home',
                        path: '/employee/teller/teller-dashboard',
                    },
                ],
            },
            accountServices: {
                title: 'Account Services',
                icon: <HiOutlineUserGroup size={20} />,
                submenu: [
                    {
                        title: 'Verify Accounts',
                        path: '/employee/teller/verify-accounts',
                    },
                    {
                        title: 'Password Reset',
                        path: '/employee/teller/password-reset',
                    },
                    {
                        title: 'Making Accounts',
                        path: '/employee/teller/account-creation',
                    },
                    // {
                    //     title: 'Debit/Credit Cards',
                    //     path: '/employee/teller/card-creation',
                    // },
                ],
            },
            customerSupport: {
                title: 'Customer Support',
                icon: <HiOutlineUserGroup size={20} />,
                submenu: [
                    {
                        title: 'Support Home',
                        path: '/employee/teller/customer-support',
                    },
                ],
            },
            virtualTransactions: {
                title: 'Virtual Transactions',
                icon: <HiOutlineUserGroup size={20} />,
                submenu: [
                    {
                        title: 'Check Users Transactions',
                        path: '/employee/teller/virtual-transactions',
                    },
                ],
            },
            HelpDesk: {
                title: 'Helpdesk Services',
                icon: <HiOutlineUserGroup size={20} />,
                submenu: [
                    {
                        title: 'Requistion',
                        path: '/employee/teller/requistion',
                    },
                    {
                        title: 'Incident Report',
                        path: '/employee/teller/incident',
                    },
                ],
            },
            
        },

      loan_officer: {
  dashboard: {
    title: 'Dashboard',
    icon: <FaRegMoneyBillAlt size={20} />,
    submenu: [
      { 
        title: 'Dashboard Home', 
        path: '/employee/loan_officer/dashboard' 
      },
    ],
  },
  loanManagement: {
    title: 'Loan Management',
    icon: <FaRegMoneyBillAlt size={20} />,
    submenu: [
      { 
        title: 'Loan Applications', 
        path: '/employee/loan_officer/applications' 
      },
      { 
        title: 'Loan Approval', 
        path: '/employee/loan_officer/approval' 
      },
    ],
  },
//   disbursement: {
//     title: 'Loan Disbursement',
//     icon: <FaRegMoneyBillAlt size={20} />,
//     submenu: [
//       { 
//         title: 'Disbursements Overview', 
//         path: '/employee/loan_officer/disbursement/overview' 
//       },
//       { 
//         title: 'Pending Disbursements', 
//         path: '/employee/loan_officer/disbursement/pending' 
//       },
//       { 
//         title: 'Approved Disbursements', 
//         path: '/employee/loan_officer/disbursement/approved' 
//       },
//     ],
//   },
  customerSupport: {
    title: 'Customer Support',
    icon: <FaRegMoneyBillAlt size={20} />,
    submenu: [
      { 
        title: 'Support Home', 
        path: '/employee/loan_officer/customer-support' 
      },
    ],
  },
  helpDesk: {
    title: 'Helpdesk Services',
    icon: <FaRegMoneyBillAlt size={20} />,
    submenu: [
      { 
        title: 'Requisition', 
        path: '/employee/loan_officer/requisition' 
      },
      { 
        title: 'Incident Report', 
        path: '/employee/loan_officer/incident' 
      },
    ],
  },
},
supplier: {
    dashboard: {
        title: 'Dashboard',
        icon: <HiOutlineUserGroup size={20} />,
        submenu: [
            {
                title: 'Dashboard Home',
                path: '/employee/supplier/dashboard',
            },
        ],
    },
    requisitionRequest: {
        title: 'Requisition Request',
        icon: <HiOutlineUserGroup size={20} />,
        submenu: [
            {
                title: 'New Request',
                path: '/employee/supplier/requisition',
            },
            
        ],
    },
    helpdeskServices: {
        title: 'Helpdesk Services',
        icon: <HiOutlineUserGroup size={20} />,
        submenu: [
            {
                title: 'Repoert Incident',
                path: '/employee/supplier/incident',
            },
           
            
           
        ],
    },
},
    };

    const getMenuItemsByRole = (userRole) => {
        const role = userRole?.role?.toLowerCase() || '';
        switch (role) {
            case 'admin':
                return [allMenuItems.admin];
            case 'bank_manager':
                return Object.values(allMenuItems.bank_manager);
            case 'teller':
                // Flatten teller's modules
                return Object.values(allMenuItems.teller);
            case 'loan_officer':
                return  Object.values(allMenuItems.loan_officer);
                case 'supplier':
                    return Object.values(allMenuItems.supplier)
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

    const menuItems = getMenuItemsByRole(userRole);

    const renderMenuItem = (item) => {
        if (item.submenu) {
            return (
                <div>
                    <div
                        onClick={() => toggleSubmenu(item.title)}
                        className="flex items-center justify-between space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-all"
                    >
                        <div className="flex items-center space-x-3">
                            {item.icon}
                            {isSidebarOpen && <span>{item.title}</span>}
                        </div>
                        {isSidebarOpen && (
                            <span>{openSubmenus[item.title] ? '-' : '+'}</span>
                        )}
                    </div>
                    {openSubmenus[item.title] && isSidebarOpen && (
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
            );
        } else {
            return (
                <Link
                    to={item.path}
                    className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-all"
                >
                    {item.icon}
                    {isSidebarOpen && <span>{item.title}</span>}
                </Link>
            );
        }
    };

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
                    {user?.role ? user.role.replace('_', ' ').replace(/(^\w|\s\w)/g, letter => letter.toUpperCase()) : 'Employee Portal'}
                </h2>
            </div>

            <nav>
                <ul className="space-y-2">
                    {menuItems.map((item, index) => (
                        <li key={index}>{renderMenuItem(item)}</li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default Employeesidebar;