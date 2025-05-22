import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EyeIcon } from '@heroicons/react/24/outline';

const PlanRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [priceInput, setPriceInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;
  const [sortOption, setSortOption] = useState('');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');



  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSortChange = (option) => {
  setSortOption(option);
  setShowSortOptions(false);
};


  const fetchRequests = () => {
    axios.get('http://localhost:8000/api/users/plan-requests/')
      .then(res => setRequests(res.data))
      .catch(err => console.error('API error:', err));
  };

  const handleSavePrice = async () => {
    if (!selectedRequest) return;
    try {
      await axios.patch('http://localhost:8000/api/plan-requests/', {
        id: selectedRequest.id,
        price: priceInput
      });
      setSelectedRequest(null);
      setPriceInput('');
      fetchRequests();
    } catch (error) {
      console.error('Failed to update price:', error);
    }
  };
  const handleRaiseAlert = async (req) => {
  try {
    await axios.post('http://localhost:8000/api/payment-requests/', {
      plan_request: req.id,
      price: req.plan_price || 0
    });
    alert("Alert sent and payment request created ✅");
  } catch (error) {
    console.error("Failed to raise alert:", error);
  }
};

  const totalPages = Math.ceil(requests.length / requestsPerPage);
  let filteredRequests = [...requests];

if (searchQuery.trim() !== '') {
  filteredRequests = filteredRequests.filter((req) =>
    req.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.client_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.client_phone.toLowerCase().includes(searchQuery.toLowerCase())
  );
}

let sortedRequests = [...filteredRequests];

if (sortOption === 'name_asc') {
  sortedRequests.sort((a, b) => a.client_name.localeCompare(b.client_name));
} else if (sortOption === 'name_desc') {
  sortedRequests.sort((a, b) => b.client_name.localeCompare(a.client_name));
} else if (sortOption === 'price_asc') {
  sortedRequests.sort((a, b) => (a.plan_price || 0) - (b.plan_price || 0));
} else if (sortOption === 'price_desc') {
  sortedRequests.sort((a, b) => (b.plan_price || 0) - (a.plan_price || 0));
}

const paginatedRequests = sortedRequests.slice(
  (currentPage - 1) * requestsPerPage,
  currentPage * requestsPerPage
);


  return (
    <div className="rounded-xl bg-white p-5 shadow-md text-sm">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="🔍  Search...."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm w-1/3"
        />
<div className="flex space-x-2 text-sm relative">
  <div className="relative">
    <button
      onClick={() => setShowSortOptions(!showSortOptions)}
      className="px-3 py-1 border rounded-md text-gray-600 bg-white"
    >
      Sort by ▼
    </button>
    {showSortOptions && (
      <div className="absolute z-10 top-full mt-1 w-48 bg-white border shadow-md rounded-md text-sm">
        <button
          className="block w-full text-left px-3 py-2 hover:bg-gray-100"
          onClick={() => handleSortChange('name_asc')}
        >
          Client Name (A–Z)
        </button>
        <button
          className="block w-full text-left px-3 py-2 hover:bg-gray-100"
          onClick={() => handleSortChange('name_desc')}
        >
          Client Name (Z–A)
        </button>
        <button
          className="block w-full text-left px-3 py-2 hover:bg-gray-100"
          onClick={() => handleSortChange('price_asc')}
        >
          Price (Low → High)
        </button>
        <button
          className="block w-full text-left px-3 py-2 hover:bg-gray-100"
          onClick={() => handleSortChange('price_desc')}
        >
          Price (High → Low)
        </button>
      </div>
    )}
  </div>

  <button className="px-3 py-1 border rounded-md text-gray-600">Filters 🔍</button>
  <button className="px-3 py-1 border rounded-md text-gray-600">⋮</button>
</div>

      </div>

      <table className="w-full table-auto border-collapse text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="border px-4 py-2 font-medium">Client Name</th>
            <th className="border px-4 py-2 font-medium">Phone Number</th>
            <th className="border px-4 py-2 font-medium">Email</th>
            <th className="border px-4 py-2 font-medium">Client Request</th>
            <th className="border px-4 py-2 font-medium">Cost of plan</th>
            <th className="border px-4 py-2 font-medium">Send to client</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRequests.map((req, index) => (
            <tr key={index} className="border hover:bg-gray-50">
              <td className="border px-4 py-2">{req.client_name}</td>
              <td className="border px-4 py-2">{req.client_phone}</td>
              <td className="border px-4 py-2">{req.client_email}</td>
              <td
                className="border px-4 py-2 text-blue-500 cursor-pointer hover:underline flex items-center justify-center space-x-1"
                onClick={() => {
                  setSelectedRequest(req);
                  setPriceInput(req.plan_price || '');
                }}
              >
                <EyeIcon className="h-4 w-4" />
                <span className="text-sm">View Request</span>
              </td>
              <td className="border px-4 py-2">{req.plan_price}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleRaiseAlert(req)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                  Raise alert
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <span>Page</span>
          <select
            className="border px-2 py-1 rounded"
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <span>of {totalPages}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            &lt;
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'border'}`}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && <span>...</span>}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl relative">
            <h2 className="text-lg font-semibold mb-4">Request from client</h2>
            <ul className="space-y-2 mb-4">
              {selectedRequest.plan_features?.map((feature, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <span className="text-green-600">✔️</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center border rounded-md overflow-hidden">
              <input
                type="text"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder="Price for the plan"
                className="flex-1 px-3 py-1 outline-none"
              />
              <button
                onClick={handleSavePrice}
                className="bg-blue-600 text-white px-4 py-1 hover:bg-blue-700"
              >
                Save
              </button>
            </div>
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanRequests;
