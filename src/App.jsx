import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Signin";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";
import Dashboard from "./pages/DashboardPage";
import ManagerDashboard from "./pages/ManagerDashboard"; // <-- Add this line

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/teamlead" element={<Dashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} /> {/* <-- New route */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
}

export default App;
