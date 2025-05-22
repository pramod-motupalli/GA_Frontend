import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYouCustom = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen bg-transparent p-5">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
        <h1 className="text-4xl mb-2 text-[#447DCB]">✅ Thank You!</h1>
        <p className="text-lg text-gray-700 my-2">Your customization request has been sent.</p>
        <p className="text-lg text-gray-700 my-2">Please wait for approval. We’ll notify you once it’s ready.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#447DCB] text-white px-6 py-3 rounded-lg text-base font-semibold mt-5 hover:bg-[#447DCB]"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYouCustom;
