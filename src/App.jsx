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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/teamlead" element={<Dashboard />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/manager" element={<ManagerDashboard />} /> {/* <-- New route */}
        <Route path="/client" element={<ClientPage />}/>
        <Route path="/accountant" element={<AccountantPage/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"element={<ResetPassword />}
        />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
}

export default App;
