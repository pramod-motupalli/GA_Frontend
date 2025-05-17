import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/users/token/", {
        email,
        password,
      });

      const { access, refresh,role } = response.data;

      if (rememberMe) {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
      } else {
        sessionStorage.setItem("accessToken", access);
        sessionStorage.setItem("refreshToken", refresh);
      }
        console.log(role)
      alert("Login successful!");
      if(role === "client"){
        navigate("/client");
      }
      if(role === "manager"){
        navigate("/manager");
      }
      if(role === "manager"){
        navigate("/manager");
      }
      else{
      navigate("/dashboard");
      }
    } catch (error) {
      const err = error.response?.data;
      const message =
        err?.detail || err?.non_field_errors?.[0] || "Login failed. Please try again.";
      alert(`Login failed: ${message}`);
    }
  };

  const handleForgotPassword = () => {
    // Replace with navigation logic if needed
    navigate("/forgot-password");
  };

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel */}
      <div className="w-97 bg-blue-100 p-10 flex flex-col justify-center items-center">
        <img src="/hands.png" alt="Puzzle Hands" className="w-84 mb-6" />
        <h2 className="text-2xl font-semibold text-center text-blue-900 mb-4">
          Committed to Your Safety with Expertise and Care
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          Our team is built on years of proven experience and a deep commitment to user safety. We combine technical excellence with empathy to deliver secure, reliable solutions. Through strong collaboration and clear communication, we solve challenges with precision and care.
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-2/3 bg-gray-50 flex items-center justify-center px-20">
        <div className=" w-2/3 space-y-6 px-4 py-8 border-1 border-gray-200 rounded-3xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">We are glad to see you again!</h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your email and password to get into the site.
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1 text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eg:sample@mailid.com"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                Remember me
              </label>
              <button type="button" onClick={handleForgotPassword} className="text-blue-500 hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-200"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <button onClick={goToSignup} className="text-blue-500 font-medium">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}