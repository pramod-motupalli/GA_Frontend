import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(Email: ${email}\nPassword: ${password}\nRemember Me: ${rememberMe});
  };

  const handleForgotPassword = () => {
    alert("Redirect to forgot password page");
  };

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel */}
      <div className="w-[475px] h-[1024px] p-10 flex flex-col justify-center items-center border-r border-blue-500 shadow-md bg-blue-100 rounded-tr-2xl rounded-br-2xl">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Puzzle Hands"
          className="w-60 mb-6"
        />
        <h2 className="text-2xl font-semibold text-center text-blue-900 mb-4">
          Committed to Your Safety with Expertise and Care
        </h2>
        <p className="text-gray-600 text-center max-w-xs">
          Our team is built on years of proven experience and a deep commitment
          to user safety. We combine technical excellence with empathy to
          deliver secure, reliable solutions. Through strong collaboration and
          clear communication, we solve challenges with precision and care.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-slate-600 text-center">
            We're glad to see you here again!
          </h2>
          <p className="text-base text-slate-600 text-center">
            Enter your mail ID and password to get into the site.
          </p>

          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-lg">Enter your mail ID</label>
            <input
              type="email"
              placeholder="eg: sample@mailid.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-lg">Enter your password</label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-lg text-gray-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-blue-500 underline text-lg"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white text-xl font-bold rounded hover:bg-blue-600 transition"
          >
            Login
          </button>

          {/* Signup Link */}
          <div className="text-center text-base text-slate-600">
            Don’t have an account?{" "}
            <button
              onClick={goToSignup}
              className="text-blue-500 font-bold text-xl underline"
            >
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}