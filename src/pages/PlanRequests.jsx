import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EyeIcon } from '@heroicons/react/24/outline';

const PlanRequests = ({ type = "custom" }) => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [priceInput, setPriceInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;
  const [sortOption, setSortOption] = useState('');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

const dummyTaskRequests = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  client_name: "Elon Musk",
  domain_name: "Sampledomain.com",
  request_date: "04-05-2025",
  scope_status: i % 3 === 0 ? "Not Updated" : i % 3 === 1 ? "with in scope" : "out of scope",
  assigned_to: "Mamatha",
  task_status: i % 3 === 0 ? "Not started yet" : i % 3 === 1 ? "Completed" : "Processing",
}));


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
      await axios.patch('http://localhost:8000/api/users/plan-requests/', {
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
      // Call PATCH API to update price and set is_approved = True
      await axios.patch('http://localhost:8000/api/users/plan-requests/', {
        id: req.id,
        price: req.plan_price || 0
      });

      // Then create payment request as before
      await axios.post('http://localhost:8000/api/users/payment-requests/', {
        plan_request: req.id,
        price: req.plan_price || 0
      });

      alert("Alert sent and payment request created ✅");
      fetchRequests(); // refresh data to show changes
    } catch (error) {
      console.error("Failed to raise alert:", error);
    }
  };

   
  const totalPages = Math.ceil(dummyTaskRequests.length / requestsPerPage);
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

if (type === 'task') { 
  return (
     <>
    {/* Horizontal scrollable table wrapper */}
    <div className="overflow-x-auto w-full bg-white rounded-xl shadow-md">
  <table className="min-w-[1100px] w-full text-sm text-left text-gray-700">
    <thead className="bg-[#F8FAFC] text-gray-800 font-medium">
      <tr>
        <th className="px-4 py-3 whitespace-nowrap">Client Name</th>
        <th className="px-4 py-3 whitespace-nowrap">Domain Name</th>
        <th className="px-4 py-3 whitespace-nowrap">Request Raised Date</th>
        <th className="px-4 py-3 whitespace-nowrap">Client Request</th>
        <th className="px-4 py-3 whitespace-nowrap">Scope of service</th>
        <th className="px-4 py-3 whitespace-nowrap">Scope of service status</th>

        {/* These columns will go out of view initially */}
        <th className="px-4 py-3 whitespace-nowrap">Assigned to</th>
        <th className="px-4 py-3 whitespace-nowrap">Task Status</th>
        <th className="px-4 py-3 whitespace-nowrap">Rise an alert</th>
      </tr>
    </thead>
    <tbody>
      {dummyTaskRequests.map((req, index) => (
        <tr key={index} className="hover:bg-gray-50">
          <td className="px-4 py-3">{req.client_name}</td>
          <td className="px-4 py-3">{req.domain_name}</td>
          <td className="px-4 py-3">{req.request_date}</td>
          <td className="px-4 py-3 text-blue-600 font-medium cursor-pointer">
            <div className="flex items-center gap-1">
              <EyeIcon className="h-4 w-4" />
              View Request
            </div>
          </td>
          <td className="px-4 py-3 text-blue-600 font-medium cursor-pointer">View Scope</td>
          <td className="px-4 py-3">
            <span className={`text-xs px-3 py-1 rounded-full ${
              req.scope_status === "with in scope" ? "bg-green-100 text-green-700" :
              req.scope_status === "out of scope" ? "bg-orange-100 text-orange-600" :
              "bg-gray-200 text-gray-600"
            }`}>
              {req.scope_status}
            </span>
          </td>

          {/* These will be off-screen initially */}
          <td className="px-4 py-3">{req.assigned_to}</td>
          <td className="px-4 py-3">
            <span className={`text-xs px-3 py-1 rounded-full ${
              req.task_status === "Completed" ? "bg-green-100 text-green-700" :
              req.task_status === "Processing" ? "bg-orange-100 text-orange-600" :
              "bg-gray-200 text-gray-600"
            }`}>
              {req.task_status}
            </span>
          </td>
          <td className="px-4 py-3">
            <button className="bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600">
              Rise alert
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


    {/* Pagination stays outside scroll box */}
    <div className="flex justify-between items-center mt-2 text-sm">
      <div className="flex items-center gap-2">
        <span>Page</span>
        <select
          className="border rounded px-2 py-1"
          value={currentPage}
          onChange={(e) => setCurrentPage(Number(e.target.value))}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        <span>of {totalPages}</span>
      </div>
      <div className="flex gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
              className={`px-3 py-1 rounded ${
                currentPage === pageNum ? 'bg-blue-600 text-white' : 'border'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        {totalPages > 5 && <span>...</span>}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  </>
)}
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

      <table className="w-full text-sm text-left text-gray-700 border">
        <thead className="bg-[#F8FAFC] text-gray-800 font-medium">
          <tr>
            <th className="px-4 py-3">Client Name</th>
            <th className="px-4 py-3">Phone Number</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Client Request</th>
            <th className="px-4 py-3">Cost of plan</th>
            <th className="px-4 py-3">Send to client</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRequests.map((req, index) => (
            <tr key={index} className="border hover:bg-gray-50">
              <td className="px-4 py-3">{req.client_name}</td>
              <td className="px-4 py-3">{req.client_phone}</td>
              <td className="px-4 py-3">{req.client_email}</td>
              <td
                className="px-4 py-2 text-blue-00 font-medium cursor-pointer flex items-center gap-1"
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
                  <span className="text-green-600">✔</span>
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