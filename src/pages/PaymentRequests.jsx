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
              <td className="px-4 py-3">
                {req.title?.trim().toLowerCase() === 'plan customization' ? (
                  <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-blue-600 rounded-full" />
                    Customization
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-600 rounded-full" />
                    for payment settle of payment
                  </span>
                )}
              </td>
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
  );
};

export default PaymentRequests;
