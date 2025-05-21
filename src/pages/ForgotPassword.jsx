import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // If verify_uuid is present, auto-verify
  useEffect(() => {
    const verifyUuid = searchParams.get("verify_uuid");
    if (verifyUuid) {
      setVerifying(true);
      axios
        .get(
          `http://localhost:8000/api/users/verify-password/?verify_uuid=${verifyUuid}`
        )
        .then(() => {
          setMessage("✅ Email verified! Redirecting to login…");
          setTimeout(() => navigate("/login"), 2000);
        })
        .catch(() => {
          setMessage("❌ Verification failed or link expired.");
        })
        .finally(() => setVerifying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendLink = (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("❌ Email is required to send verification link.");
      return;
    }

    setSending(true);
    setMessage("Sending verification email…");

    axios
      .post("http://localhost:8000/api/users/forgot-password/", { email })
      .then(() => {
        setMessage("✅ Check your inbox for a verification link.");
      })
      .catch((error) => {
        const err =
          error.response?.data?.detail ||
          "❌ Could not send verification link.";
        setMessage(err);
      })
      .finally(() => setSending(false));
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/4 bg-[#EBF4FF] p-10 flex flex-col justify-center items-center">
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

      {/* Right Panel - Forgot Password Form */}
      <div className="w-3/4 bg-gray-50 flex items-center justify-center px-20">
        <div className="w-1/2 py-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Forgot Password
            </h2>
            <p className="text-sm text-gray-500 mt-1">We are here to help</p>
          </div>

          {message && (
            <div className="text-center text-sm text-gray-700">{message}</div>
          )}

          <form
            onSubmit={sendLink}
            className="space-y-4 flex flex-col items-center"
          >
            <div className="w-full border border-gray-200 px-2 py-4 rounded-3xl">
              <label className="block text-sm mb-1 text-left text-gray-700">
                Enter your email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eg: sample@gmail.com"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              disabled={sending || verifying}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-200 disabled:opacity-50"
            >
              {verifying
                ? "Verifying..."
                : sending
                ? "Sending..."
                : "Send reset link"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <button
              onClick={goToLogin}
              className="text-blue-500 font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
