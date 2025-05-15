import React from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
const goToLogin = () => {
  navigate("/login");
};
  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/4 bg-blue-100 p-10 flex flex-col justify-center items-center border-r border-blue-500">
        <img
          src="/hands.png"
          alt="Puzzle Hands"
          className="w-60 mb-6"
        />
        <h2 className="text-2xl font-semibold text-center text-blue-900 mb-4">
          Committed to Your Safety with Expertise and Care
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          Our team is built on years of proven experience and a deep commitment
          to user safety. We combine technical excellence with empathy to
          deliver secure, reliable solutions. Through strong collaboration and
          clear communication, we solve challenges with precision and care.
        </p>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-3/4 bg-gray-50 flex items-center justify-center px-20">
        <div className="max-w-md w-full space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Forgot password
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              We are here to help
            </p>
          </div>
          <form className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                Enter your mailid
              </label>
              <input
                type="email"
                placeholder="eg:sample@gmail.com"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-200"
            >
              Send reset link
            </button>
          </form>
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
             <button onClick={goToLogin} className="text-blue-500 font-medium">
  Login
</button>

          </p>
        </div>
      </div>
    </div>
  );
}
