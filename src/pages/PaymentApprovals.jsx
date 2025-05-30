import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentApprovals = () => {
  const [requests, setRequests] = useState([]);

  // Retrieve token from localStorage or a global state/store
  const token = localStorage.getItem('accessToken'); // Example: 'Token abc123'

  useEffect(() => {
    axios.get('http://localhost:8000/api/users/submissions/', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(res => {
      const unapproved = res.data.filter(
        req => req.payment_is_approved !== true &&
               req.payment_is_approved !== "Yes" &&
               req.payment_is_approved !== 1
      );
      setRequests(unapproved);
    })
    .catch(err => console.error(err));
  }, [token]);

  const handleApprove = async (planId) => {
    try {
      await axios.post(`http://localhost:8000/api/users/${planId}/approve/`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setRequests(prev =>
        prev.map(req =>
          req.id === planId ? { ...req, payment_is_approved: "Yes" } : req
        )
      );
    } catch (error) {
      console.error('Failed to approve payment:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3">Client Name</th>
              <th className="px-4 py-3">Phone Number</th>
              <th className="px-4 py-3">E-mail ID</th>
              <th className="px-4 py-3">Amount Received</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Approve</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id} className="border-t">
                <td className="px-4 py-3">{req.client?.username || 'Unknown'}</td>
                <td className="px-4 py-3">{req.client?.contact_number || 'N/A'}</td>
                <td className="px-4 py-3">{req.client?.email || 'N/A'}</td>
                <td className="px-4 py-3">${req.price}</td>
                <td className="px-4 py-3">Category 1</td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium w-fit ${
                    req.title === 'Pro' ? 'bg-green-100 text-green-700' :
                    req.title === 'Plan Customization' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      req.title === 'Pro' ? 'bg-green-700' :
                      req.title === 'Plan Customization' ? 'bg-blue-700' :
                      'bg-gray-700'
                    }`} />
                    {req.title}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentApprovals;
