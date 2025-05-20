import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function VerifyMail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [email, setEmail] = useState("");

  // Auto-verify when landing with ?verify_uuid=...
  useEffect(() => {
    const verifyUuid = searchParams.get("verify_uuid");
    if (verifyUuid) {
      setVerifying(true);
      axios
        .get(`http://localhost:8000/api/users/verify-email/?verify_uuid=${verifyUuid}`)
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

  // Send (or resend) the verification email
  const sendLink = (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("❌ Email is required to send verification link.");
      return;
    }
    localStorage.setItem("email",email);
    setSending(true);
    setMessage("Sending verification email…");

    axios
      .post("http://localhost:8000/api/users/send-verification/", { email })
      .then(() => {
        setMessage("✅ Check your inbox for a verification link.");
      })
      .catch((error) => {
        const err = error.response?.data?.detail ||
          "❌ Could not send verification link.";
        setMessage(err);
      })
      .finally(() => setSending(false));
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel */}
      <div
        className="hidden md:flex flex-col justify-center items-center"
        style={{
          width: '395px',
          height: '100vh',
          borderRadius: '16px 0 0 16px',
          backgroundColor: '#EBF4FF',
        }}
      >
        <img src="/hands.png" alt="Puzzle Hands" className="w-60 mb-6" />
        <h2 className="text-2xl font-semibold text-center text-blue-900 mb-4">
          Committed to Your Safety with Expertise and Care
        </h2>
        <p className="text-gray-600 text-center max-w-xs px-4">
          Our team is built on years of proven experience and a deep commitment
          to user safety. We combine technical excellence with empathy to
          deliver secure, reliable solutions. Through strong collaboration and
          clear communication, we solve challenges with precision and care.
        </p>
      </div>

      {/* Right Panel */}
      <div
        className="flex-1 flex items-center justify-center p-6"
      >
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verify your email
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your email below to receive a verification link.
          </p>

          {verifying && (
            <p className="text-yellow-600 mb-4">Verifying your email…</p>
          )}

          {message && (
            <p
              className={`mb-4 ${
                message.startsWith("✅")
                  ? "text-green-700"
                  : message.startsWith("❌")
                  ? "text-red-700"
                  : "text-gray-700"
              }`}
            >
              {message}
            </p>
          )}

          {!verifying && (
            <form onSubmit={sendLink} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Enter your email address
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
                disabled={sending}
                className={`w-full font-semibold py-2 rounded-md transition duration-200 text-white ${
                  sending
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {sending ? 'Sending…' : 'Send Verification Link'}
              </button>
            </form>
          )}

          <button
            onClick={() => navigate('/login')}
            className="mt-4 w-full text-center text-blue-600 hover:underline"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
