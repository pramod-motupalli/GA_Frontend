import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentRequests = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPaymentRequests();
  }, []);

  const fetchPaymentRequests = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/users/payment-requests/');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching payment requests:', err);
    }
  };

  return (
    <div className="rounded-xl bg-white p-5 shadow-md text-sm">
      <h2 className="text-xl font-semibold mb-4">Client Payment Requests</h2>
      <table className="w-full table-auto border-collapse text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="border px-4 py-2 font-medium">Payment Request</th>
            <th className="border px-4 py-2 font-medium">Price</th>
            <th className="border px-4 py-2 font-medium">Proceed to Payment</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req, i) => (
            <tr key={i} className="border hover:bg-gray-50">
              <td className="border px-4 py-2 text-gray-500 italic text-center">—</td>
              <td className="border px-4 py-2">{req.price}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => navigate('/payment')}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Proceed to Payment
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentRequests;
