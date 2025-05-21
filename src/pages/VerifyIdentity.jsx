import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import identityImg from "../assets/identity.svg"; // adjust path if needed

export default function VerifyIdentity() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleVerify = () => {
    const email = localStorage.getItem("email"); // get email from localStorage
    console.log("Email from localStorage:", email);  
    if (!email) {
      // setErrorMsg("No email found. Please log in first.");
      console.log("No email found in localStorage");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    axios
      .post("http://localhost:8000/api/users/verify-email/", { email })
      .then((response) => {
        console.log("Backend response:", response.data);
        alert("Your account is verified...")
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error sending email to backend:", error);
        setErrorMsg("Failed to verify email. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/4 bg-[#EBF4FF] p-10 flex flex-col justify-center items-center">
        <img src="/hands.png" alt="Puzzle Hands" className="w-2xl mb-6" />
        <h2 className="text-xl font-semibold text-center text-blue-900 mb-4">
          Committed to Your Safety with Expertise and Care
        </h2>
        <p className="text-gray-600 text-center text-sm px-4">
          Our team is built on years of proven experience and a deep commitment
          to user safety. We combine technical excellence with empathy to deliver
          secure, reliable solutions. Through strong collaboration and clear
          communication, we solve challenges with precision and care.
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-2/3 bg-white flex items-center justify-center px-10">
        <div className="text-center">
          <img
            src={identityImg}
            alt="Phone Verification"
            className="w-60 mx-auto mb-6"
          />
          <div className="text-center translate-x-[-280px]">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verify Your Identity
            </h2>
          </div>
          <div className="text-center translate-x-[-270px]">
            <p className="text-sm text-gray-500 mb-6">
              Keeping your account safe — always.
            </p>
          </div>
          <div className="text-center translate-x-[-80px]">
            <div className="bg-white shadow-lg rounded-xl p-5 mx-auto w-[650px]">
              {errorMsg && (
                <p className="text-red-600 mb-4 font-semibold">{errorMsg}</p>
              )}
              <button
                onClick={handleVerify}
                disabled={loading}
                className={`${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                } text-white font-semibold px-60 py-2 rounded-md shadow transition duration-200`}
              >
                {loading ? "Verifying..." : "Verify account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
