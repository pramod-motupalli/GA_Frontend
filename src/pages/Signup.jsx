// src/pages/SignupPage.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

// --- Auth Context Setup ---
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const storedAccess = localStorage.getItem("accessToken");
    const storedRefresh = localStorage.getItem("refreshToken");
    if (storedAccess) setAccessToken(storedAccess);
    if (storedRefresh) setRefreshToken(storedRefresh);
  }, []);

  const saveTokens = ({ access, refresh }) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  };

  const clearTokens = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, saveTokens, clearTokens }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Signup Component ---
const Signup = () => {
  const navigate = useNavigate();
  const { saveTokens } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const { data } = await axios.post("http://localhost:8000/api/users/register/", {
        email: formData.email,
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        password: formData.password,
      });
      const { access_token, refresh_token, message } = data;
      saveTokens({ access: access_token, refresh: refresh_token });
      alert(message || "Signup successful!");
      navigate("/verify-email");
    } catch (error) {
      alert("Signup failed: " + JSON.stringify(error.response?.data || error));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/4 bg-[#EBF4FF] p-10 flex flex-col justify-center items-center ">
        <img src="/hands.png" alt="Puzzle Hands" className="w-60 mb-6" />
        <h2 className="text-2xl font-semibold text-center text-blue-900 mb-4">
          Committed to Your Safety with Expertise and Care
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          Our team is built on years of proven experience and a deep commitment to user safety. We combine technical excellence with empathy to deliver secure, reliable solutions.
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-2/3 bg-gray-50 flex items-center justify-center px-20">
        <div className="max-w-md w-full space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 px-8">Welcome to GA Digital Solutions</h2>
            <p className="text-sm text-gray-500 mt-1 px-14">We're excited to connect with you. Please sign up.</p>
          </div>

          {/* Form Container */}
          <div className="bg-white p-6 rounded-xl border-1 border-gray-200 shadow-xs">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Text Fields */}
              {["email", "username", "first_name", "last_name", "phone_number"].map((field) => (
                <div key={field}>
                  <label className="block text-sm mb-1 text-gray-700">
                    {field.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                  <input
                    type={field.includes("email") ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required={field !== "last_name" && field !== "phone_number"}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}

              {/* Password Field */}
              <div className="relative">
                <label className="block text-sm mb-1 text-gray-700">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                />
                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <label className="block text-sm mb-1 text-gray-700">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                />
                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-500"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
                 
              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-200"
              >
                Next
              </button>
            </form>
          </div>

          {/* Link to Login */}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-blue-500 -end-py-2font-medium">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Export Page Wrapped with AuthProvider ---
export default function SignupPage() {
  return (
    <AuthProvider>
      <Signup />
    </AuthProvider>
  );
}
