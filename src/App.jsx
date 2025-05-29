import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Signin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/DashboardPage";
import ManagerDashboard from "./pages/ManagerDashboard"; // <-- Add this line
import StaffPage from "./pages/StaffPage"; 
import ClientPage from "./pages/ClientPage";
import AccountantPage from "./pages/AccountantPage"
import VerifyIdentity from "./pages/VerifyIdentity";
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlanSelection from './pages/PlanSelection';
import Payment from './pages/Payment';
import Customization from './pages/Customization';
import DomainHostingPage from './pages/DomainHosting';
import ThankYouCustom from './pages/ThankYouCustom';
import PaymentSuccess from './pages/PaymentSuccess';
import PlanRequests from './pages/PlanRequests';
import DomainHostingTable from './pages/DomainHostingTable';
import DomainHostingTableTeamlead from './pages/DomainHostingTableTeamlead';
import DomainHostingTableClient from './pages/DomainHostingTableClient';
import PaymentRequests from './pages/PaymentRequests';
// import api from "./api/axiosClient";
import Main from "./pages/WorkspaceCard";
import WorkSpaceActivation from './pages/WorkSpaceActivation';
import WorkspaceCardTeamlead from "./pages/WorkspaceCardTeamlead";
import DomainHostingTableManager from './pages/DomainHostingTableManager';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/teamlead" element={<Dashboard />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/manager" element={<ManagerDashboard />} /> {/* <-- New route */}
        <Route path="/client" element={<ClientPage />}/>
        <Route path="/form" element={<client/>}/>
        <Route path="/accountant" element={<AccountantPage/>}/>
        <Route path="/identity" element={<VerifyIdentity/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"element={<ResetPassword />}/>
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/plans" element={<PlanSelection />} />
        <Route path="/Customization" element={<Customization />} />
        <Route path="/thankyou-custom" element={<ThankYouCustom />} />
        <Route path="/domain-hosting" element={<DomainHostingPage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/plan-requests" element={<PlanRequests />} />
        <Route path="/plan-requests-domain" element={<DomainHostingTable />} />
        <Route path="/Domain-teamlead" element={<DomainHostingTableTeamlead />} />
        <Route path="/Domain-client" element={<DomainHostingTableClient />} />
        <Route path="/payment-requests" element={<PaymentRequests />} />
        <Route path="/main" element={<Main />} />
        <Route path="/WorkSpaceActivation" element={<WorkSpaceActivation />} />
        <Route path="/WorkspaceCardTeamlead" element={<WorkspaceCardTeamlead />} />
        <Route path="/Domain-Manager" element={<DomainHostingTableManager />} />
      </Routes>
    </Router>
  );
}

export default App;
