import { useState } from 'react'
import Login from './pages/Login'
import Homepage from './pages/Homepage'
import SignIn from './pages/SignIn'
import CustomerHome from './pages/customer/CustomerHome'
import CreateAccount from './pages/customer/CreateAccount'
import AccountOverview from './pages/customer/AccountOverview'
import TransactionHistory from './pages/customer/TransactionHistory'
import AccountDetails from './pages/customer/AccountDetails'
import PersonalInfo from "./pages/customer/PersonalInfo"
import LoanFile from "./pages/customer/LoanFile"
import LoanStatus from './pages/customer/LoanStatus'
import AccountStatement from './pages/customer/AccountStatement'
import BookingTicket from './pages/customer/BookingTicket'
import EmployeeHomepage from './pages/Employee/EmployeeHomepage'
import Admindashboard from './pages/Employee/AdminPages/Admindashboard'
import UserManagement from './pages/Employee/AdminPages/UserManagement'
import SystemConfig from './pages/Employee/AdminPages/SystemConfig'
import AccessControl from './pages/Employee/AdminPages/AccessControl'
import AuditLogs from './pages/Employee/AdminPages/AuditLogs'
import TellerDashboard from './pages/Employee/TellerPages/TellerDashboard'
import VirtualTransaction from './pages/Employee/TellerPages/VirtualTransaction'
import AccountService from './pages/Employee/TellerPages/AccountService'
import CustomerSupport from './pages/Employee/TellerPages/CustomerSupport'
import VerifyAccounts from './pages/Employee/TellerPages/VerifyAccounts'
import CardCraetion from './pages/Employee/TellerPages/CardCraetion'
import AccountCreation from './pages/Employee/TellerPages/AccountCreation'
import PasswordReset from "./pages/Employee/TellerPages/PasswordReset"
import LoanDashboard from './pages/Employee/LoanOfficerPages/LoanDashboard'
import LoanApplications from './pages/Employee/LoanOfficerPages/LoanApplications'
import LoanApproval from './pages/Employee/LoanOfficerPages/LoanApproval'
import ManagerDashboard from './pages/Employee/BankManagerPages/ManagerDashboard'
import EmployeeManagement from './pages/Employee/BankManagerPages/EmployeeManagement'
import PerformanceMonitorin from './pages/Employee/BankManagerPages/PerformanceMonitorin'
import BranchOperation from './pages/Employee/BankManagerPages/BranchOperation'
import ChangeRoles from './pages/Employee/BankManagerPages/ChangeRoles'
import RegisterNewEmployee from './pages/Employee/BankManagerPages/RegisterNewEmployee'
import LoanDetailsPage from './pages/customer/LoanDetailsPage'
import RequistionForm from "./pages/Employee/RequistionForm"
import IncidentPage from './pages/Employee/IncidentPage'
import LoanTickets from './pages/Employee/LoanOfficerPages/LoanTickets'
import CustomersAccount from './pages/Employee/BankManagerPages/CustomersAccount'
import AllLoans from './pages/Employee/BankManagerPages/AllLoans'
import AssignIcidents from './pages/Employee/BankManagerPages/AssignIcidents'
import RequistionSupplier from './pages/Employee/SupplierPages/RequistionSupplier'
import SupplierDashboard from './pages/Employee/SupplierPages/SupplierDashboard'
import TicketStatus from './pages/customer/TicketStatus'
import AllConsumables from './pages/Employee/BankManagerPages/AllConsuambles'
import AllAssets from './pages/Employee/BankManagerPages/AllAssets'
import ConsumableDetails from './pages/Employee/BankManagerPages/ConsuambleDetails'
import AssetDetails from './pages/Employee/BankManagerPages/AssetsDetails'
import AddAssets from './pages/Employee/BankManagerPages/AddAssets'
import AddConsumable from './pages/Employee/BankManagerPages/AddCosumables'
import LoanDibursed from './pages/Employee/LoanOfficerPages/LoanDibursed'

import {BrowserRouter,Routes,Route} from "react-router-dom"
import "./index.css"

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/login' element= {<Login/>} />
      <Route path='/homepage' element={<Homepage/>}/>
      <Route path='/signIn' element={<SignIn/>}/>

      <Route path='/customer' element={<CustomerHome/>}>
      <Route path='accounts'>
            <Route path='create' element={<CreateAccount />} />
            <Route path='overview' element={<AccountOverview/>}/>
            <Route path=':accountId' element={<AccountDetails/>}/>
          </Route>
          <Route path='transaction-history' element={<TransactionHistory/>}/>
          <Route path='personal-information' element={<PersonalInfo/>}/>
          <Route path='loan'>
            <Route path='application/:accountNumber' element={<LoanFile/>}/>
            <Route path='status' element={<LoanStatus/>}/>
            <Route path="loan-details/:loanId" element={<LoanDetailsPage />} />
          </Route>
          <Route path='statements' element={<AccountStatement/>}/>
          <Route path='booking-ticket'>
            <Route path="booking-tickets"element={<BookingTicket/>}/>
            <Route path='ticket-status/:userId' element={<TicketStatus/>}/>
             
            </Route>
       </Route>

       <Route path='/employee' element={<EmployeeHomepage/>}>

        <Route path="admin" >
        <Route path="dashboard" element={<Admindashboard />} />
       <Route path="user-management" element={<UserManagement />} />
      <Route path="system-config" element={<SystemConfig />} />
      <Route path="access-control" element={<AccessControl />} />
      <Route path="audit-logs" element={<AuditLogs />} />
        </Route>

        <Route path='teller'>
         <Route path='teller-dashboard' element={<TellerDashboard/>}/>
         <Route path='virtual-transactions' element={<VirtualTransaction/>}/>
         <Route path='account-services' element={<AccountService/>}/>
         <Route path="customer-support" element={<CustomerSupport/>}/>
         <Route path='verify-accounts' element={<VerifyAccounts/>}/>
         <Route path='card-creation' element={<CardCraetion/>}/>
         <Route path='account-creation' element={<AccountCreation/>}/>
         <Route path='password-reset' element={<PasswordReset/>}/>
         <Route path='requistion' element={<RequistionForm/>}/>
         <Route path='incident' element={<IncidentPage/>}/>
        </Route>

        <Route path='loan_officer'>
        <Route path='dashboard' element={<LoanDashboard/>}/>
        <Route path='approval' element={<LoanApproval/>}/>
        <Route path='applications' element={<LoanApplications/>}/>
        <Route path='customer-support' element={<LoanTickets/>}/>
        <Route path='requisition' element={<RequistionForm/>}/>
        <Route path='incident' element={<IncidentPage/>}/>
        <Route path='disburse' element={<LoanDibursed/>}/>
        </Route>


      <Route path='bank-manager'>
        <Route path='manager-dashboard' element={<ManagerDashboard/>}/>
         <Route path='employees' element={<EmployeeManagement/>}/>
         <Route path='performance' element={<PerformanceMonitorin/>}/>
         <Route path='operations' element={<BranchOperation/>}/>
         <Route path='employees/:employeeId/change-role' element={<ChangeRoles />} />
         <Route path='register' element={<RegisterNewEmployee/>}/>
         <Route path='transactions' element={<VirtualTransaction/>}/>
         <Route path='accounts' element={<CustomersAccount/>}/>
         <Route path='loans' element={<AllLoans/>}/>
         <Route path='incident' element={<AssignIcidents/>}/>
         <Route path='assets' element={<AllAssets/>}/>
         <Route path='consumable' element={<AllConsumables/>}/>
         <Route path='consumable/:consumableId' element={<ConsumableDetails/>}/>
         <Route path='assets/:assetId' element={<AssetDetails/>}/>
         <Route path='add-assets' element={<AddAssets/>}/>
         <Route path='add-consumable' element={<AddConsumable/>}/>
      </Route>

      <Route path='supplier'>
        <Route path='dashboard'  element={<SupplierDashboard/>}/>
        <Route path='requisition' element={<RequistionSupplier/>}/>
        <Route path='incident' element={<IncidentPage/>}/>

      </Route>


       </Route>



    </Routes>
    </BrowserRouter>
     
    </>
  )
}

export default App
