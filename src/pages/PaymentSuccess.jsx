import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ Make sure axios is imported

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleMarkVisited = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log(token)
      const response = await axios.patch(
        'http://localhost:8000/api/users/mark-visited/',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Marked as visited:', response.data);

      // ✅ Invoke the function
      handleBackToLogin();
    } catch (error) {
      console.error('Error marking as visited:', error);
    }
  };

  return (
    <div className="text-center mt-[100px]">
      <h1 className="text-2xl text-green-600 font-semibold">✅ Payment Done</h1>
      <p className="my-5 text-[1.2rem]">Your workspace will activate soon.</p>
      <button
        onClick={handleMarkVisited}
        className="px-5 py-2 text-white text-base bg-[#0070f3] rounded-lg"
      >
        Back to Login Page
      </button>
    </div>
  );
};

export default PaymentSuccess;
