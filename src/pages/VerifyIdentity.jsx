import React from "react";
import identityImg from "../assets/identity.svg"; // adjust path if needed
export default function VerifyIdentity() {
  const handleVerify = () => {
    alert("Identity verification triggered.");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/3 bg-blue-50 p-10 flex flex-col justify-center items-center">
        <img
          src="/hands.png"
          alt="Puzzle Hands"
          className="w-48 mb-6"
        />
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
          </p></div>
          <div className="text-center translate-x-[-80px]">
          <div className="bg-white shadow-lg rounded-xl p-5 mx-auto w-[650px]">
            
          <button
            onClick={handleVerify}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-60 py-2 rounded-md shadow transition duration-200"
          >
            Verify account
          </button></div></div>
        </div>
      </div>
    </div>
  );
}
