import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="text-center mt-[100px]">
      <h1 className="text-2xl text-green-600 font-semibold">✅ Payment Done</h1>
      <p className="my-5 text-[1.2rem]">Your workspace will activate soon.</p>
      <button
        onClick={handleBackToLogin}
        className="px-5 py-2 text-white text-base bg-[#0070f3] rounded-lg"
      >
        Back to Login Page
      </button>
    </div>
  );
};

export default PaymentSuccess;
