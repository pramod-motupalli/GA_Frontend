import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Grab the UUID from the URL: /reset-password?verify_uuid=...
  const uuid = searchParams.get("verify_uuid");
  console.log(uuid)
  const goToLogin = () => navigate("/login");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("❌ Passwords do not match.");
      return;
    }
    if (!uuid) {
      setError("Invalid reset link.");
      return;
    }

    setLoading(true);
    try {
      const resp = await axios.post(
        "http://localhost:8000/api/users/reset-password/<uuid:uuid>/",
        {
          uuid,
          new_password: password,
          confirm_password: confirmPassword,
        }
      );
      setSuccess("✅ " + resp.data.detail);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.new_password?.[0] ||
        err.response?.data?.detail ||
        "❌ Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/4 bg-blue-100 p-10 flex flex-col justify-center items-center">
        <img
          src="/hands.png"
          alt="Puzzle Hands"
          className="w-84 mb-6"
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

      {/* Right Panel */}
      <div className="w-3/4 bg-gray-50 flex items-center justify-center px-20">
        <div className="max-w-md w-full space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Reset Password
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your new password below
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 text-center">{error}</div>
          )}
          {success && (
            <div className="text-sm text-green-600 text-center">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-200 disabled:opacity-50"
            >
              {loading ? "Resetting…" : "Reset Password"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600">
            Remembered?{" "}
            <button onClick={goToLogin} className="text-blue-500 font-medium">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
