import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';

const PlanRequests = ({ type = "custom" }) => {
  // 'custom' type states
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null); // For 'custom' type modal view
  const [priceInput, setPriceInput] = useState(''); // For 'custom' type modal price input

  // 'task' type states
  const initialDummyTasks = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    client_name: "Elon Musk",
    domain_name: "Sampledomain.com",
    request_date: "04-05-2025",
    scope_status: "Not Updated", // Initially all "Not Updated"
    assigned_to: "Mamatha",
    task_status: i % 3 === 0 ? "Not started yet" : i % 3 === 1 ? "Completed" : "Processing",
    dummy_request_details: `This is a sample service request for ${"Sampledomain.com"}.
The client, ${"Elon Musk"}, requires assistance with initial setup and configuration of their new online platform.
Key areas of focus include:
- User account migration from the old system.
- Integration with a third-party payment gateway.
- Basic SEO optimization for the main landing pages.
Please review and confirm the scope of work.
Contact email: elon.musk@example.com
Contact phone: +1-555-0100
Request ID: TASK-${1001 + i}`
  }));

  const [tasks, setTasks] = useState(initialDummyTasks); // State for task data
  const [showScopeModal, setShowScopeModal] = useState(false);
  const [selectedTaskForScope, setSelectedTaskForScope] = useState(null);
  
  // New state for "View Request" modal (task type)
  const [showViewRequestModal, setShowViewRequestModal] = useState(false);
  const [currentTaskForRequestView, setCurrentTaskForRequestView] = useState(null);

  // Common states
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;
  const [sortOption, setSortOption] = useState('');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (type === 'custom') {
      fetchRequests();
    } else if (type === 'task') {
      // Reset tasks to initial state ensuring scope_status is "Not Updated"
      setTasks(initialDummyTasks.map(task => ({ ...task, scope_status: "Not Updated" })));
    }
    setCurrentPage(1); // Reset page on type change
  }, [type]);

  const handleSortChange = (option) => {
    setSortOption(option);
    setShowSortOptions(false);
    setCurrentPage(1);
  };

  const fetchRequests = () => {
    axios.get('http://localhost:8000/api/users/plan-requests/')
      .then(res => setRequests(res.data))
      .catch(err => console.error('API error:', err));
  };

  const handleSavePrice = async () => { // For 'custom' type
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
      if (type === 'custom') {
        await axios.patch('http://localhost:8000/api/users/plan-requests/', {
          id: req.id,
          price: req.plan_price || 0
        });
        await axios.post('http://localhost:8000/api/users/payment-requests/', {
          plan_request: req.id,
          price: req.plan_price || 0
        });
        alert("Alert sent and payment request created ✅");
        fetchRequests();
      } else if (type === 'task') {
        alert(`Alert raised for task ID: ${req.id}, Client: ${req.client_name}`);
      }
    } catch (error) {
      console.error("Failed to raise alert:", error);
    }
  };

  // --- Scope Update Logic for 'task' type ---
  const handleOpenScopeModal = (task) => {
    setSelectedTaskForScope(task);
    setShowScopeModal(true);
  };

  const handleUpdateScopeStatus = (newStatus) => {
    if (!selectedTaskForScope) return;
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === selectedTaskForScope.id
          ? { ...task, scope_status: newStatus }
          : task
      )
    );
    setShowScopeModal(false);
    setSelectedTaskForScope(null);
  };

  // --- "View Request" Modal Logic for 'task' type ---
  const handleOpenViewRequestModal = (task) => {
    setCurrentTaskForRequestView(task);
    setShowViewRequestModal(true);
  };

  const handleCloseViewRequestModal = () => {
    setShowViewRequestModal(false);
    setCurrentTaskForRequestView(null);
  };


  // --- Filtering and Sorting for 'custom' type ---
  let filteredCustomRequests = [...requests];
  if (type === 'custom' && searchQuery.trim() !== '') {
    filteredCustomRequests = filteredCustomRequests.filter((req) =>
      (req.client_name && req.client_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.client_email && req.client_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.client_phone && req.client_phone.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  let sortedCustomRequests = [...filteredCustomRequests];
  if (type === 'custom') {
    if (sortOption === 'name_asc') {
      sortedCustomRequests.sort((a, b) => a.client_name.localeCompare(b.client_name));
    } else if (sortOption === 'name_desc') {
      sortedCustomRequests.sort((a, b) => b.client_name.localeCompare(a.client_name));
    } else if (sortOption === 'price_asc') {
      sortedCustomRequests.sort((a, b) => (a.plan_price || 0) - (b.plan_price || 0));
    } else if (sortOption === 'price_desc') {
      sortedCustomRequests.sort((a, b) => (b.plan_price || 0) - (a.plan_price || 0));
    }
  }
  
  const paginatedCustomRequests = sortedCustomRequests.slice(
    (currentPage - 1) * requestsPerPage,
    currentPage * requestsPerPage
  );
  const totalPagesCustom = Math.ceil(sortedCustomRequests.length / requestsPerPage);


  if (type === 'task') {
    const totalPagesTask = Math.ceil(tasks.length / requestsPerPage);
    const paginatedTaskRequests = tasks.slice(
      (currentPage - 1) * requestsPerPage,
      currentPage * requestsPerPage
    );
    const tableMinWidth = "1600px";

    return (
      <>
        <div className="overflow-x-auto w-full bg-white rounded-xl shadow-md">
          <table
            className="table-fixed text-sm text-left text-gray-700"
            style={{ minWidth: tableMinWidth }}
          >
            <colgroup>
              <col style={{ width: '224px' }} /> {/* Client Name */}
              <col style={{ width: '224px' }} /> {/* Domain Name */}
              <col style={{ width: '176px' }} /> {/* Request Raised Date */}
              <col style={{ width: '160px' }} /> {/* Client Request */}
              <col style={{ width: '160px' }} /> {/* Scope of service */}
              <col style={{ width: '192px' }} /> {/* Scope of service status */}
              <col style={{ width: '160px' }} /> {/* Assigned to */}
              <col style={{ width: '160px' }} /> {/* Task Status */}
              <col style={{ width: '144px' }} /> {/* Rise an alert */}
            </colgroup>
            <thead className="bg-[#F8FAFC] text-gray-800 font-medium">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Client Name</th>
                <th className="px-4 py-3 whitespace-nowrap">Domain Name</th>
                <th className="px-4 py-3 whitespace-nowrap">Request Raised Date</th>
                <th className="px-4 py-3 whitespace-nowrap">Client Request</th>
                <th className="px-4 py-3 whitespace-nowrap">Scope of service</th>
                <th className="px-4 py-3 whitespace-nowrap">Scope of service status</th>
                <th className="px-4 py-3 whitespace-nowrap">Assigned to</th>
                <th className="px-4 py-3 whitespace-nowrap">Task Status</th>
                <th className="px-4 py-3 whitespace-nowrap">Rise an alert to SPOC</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTaskRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 border-b">
                  <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis" title={req.client_name}>{req.client_name}</td>
                  <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis" title={req.domain_name}>{req.domain_name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{req.request_date}</td>
                  <td
                    className="px-4 py-3 whitespace-nowrap text-blue-600 font-medium cursor-pointer hover:underline"
                    onClick={() => handleOpenViewRequestModal(req)}
                  >
                    <div className="flex items-center gap-1">
                      <EyeIcon className="h-4 w-4" />
                      View Request
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 whitespace-nowrap text-blue-600 font-medium cursor-pointer hover:underline"
                    onClick={() => handleOpenScopeModal(req)}
                  >
                    View Scope
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                      req.scope_status === "with in scope" ? "bg-green-100 text-green-700" :
                      req.scope_status === "out of scope" ? "bg-red-100 text-red-700" :
                      "bg-gray-200 text-gray-600"
                    }`}>
                      {req.scope_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis" title={req.assigned_to}>{req.assigned_to}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      req.task_status === "Completed" ? "bg-green-100 text-green-700" :
                      req.task_status === "Processing" ? "bg-orange-100 text-orange-600" :
                      "bg-gray-200 text-gray-600"
                    }`}>
                      {req.task_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => handleRaiseAlert(req)}
                      className="bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600 text-xs"
                    >
                      Rise alert
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedTaskRequests.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-4">No task requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination for Task Table */}
        {totalPagesTask > 0 && (
          <div className="flex justify-between items-center mt-2 text-sm">
            <div className="flex items-center gap-2">
              <span>Page</span>
              <select
                className="border rounded px-2 py-1"
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
              >
                {Array.from({ length: totalPagesTask }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <span>of {totalPagesTask}</span>
            </div>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                &lt;
              </button>
              {(() => {
                  const pageNumbers = []; const maxPagesToShow = 5; let startPage, endPage;
                  if (totalPagesTask <= maxPagesToShow) { startPage = 1; endPage = totalPagesTask; } 
                  else { const halfPagesToShow = Math.floor(maxPagesToShow / 2);
                      if (currentPage <= halfPagesToShow) { startPage = 1; endPage = maxPagesToShow; } 
                      else if (currentPage + halfPagesToShow >= totalPagesTask) { startPage = totalPagesTask - maxPagesToShow + 1; endPage = totalPagesTask; } 
                      else { startPage = currentPage - halfPagesToShow; endPage = currentPage + halfPagesToShow; }
                  }
                  for (let i = startPage; i <= endPage; i++) { pageNumbers.push( <button key={i} onClick={() => setCurrentPage(i)} className={`px-3 py-1 rounded ${currentPage === i ? 'bg-blue-600 text-white' : 'border'}`} > {i} </button> ); }
                  return pageNumbers;
              })()}
              <button
                disabled={currentPage === totalPagesTask}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPagesTask))}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </div>
        )}

        {/* Scope Update Modal for Task Type */}
        {showScopeModal && selectedTaskForScope && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm relative">
                    <button
                        onClick={() => { setShowScopeModal(false); setSelectedTaskForScope(null); }}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Update Scope Status</h3>
                    <p className="text-sm text-gray-600 mb-2">Client: <span className="font-medium">{selectedTaskForScope.client_name}</span></p>
                    <p className="text-sm text-gray-600 mb-6">Domain: <span className="font-medium">{selectedTaskForScope.domain_name}</span></p>
                    
                    <div className="flex justify-around space-x-3">
                        <button
                            onClick={() => handleUpdateScopeStatus("out of scope")}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
                        >
                            Out of Scope
                        </button>
                        <button
                            onClick={() => handleUpdateScopeStatus("with in scope")}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
                        >
                            Within Scope
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* "View Request" Modal for Task Type */}
        {showViewRequestModal && currentTaskForRequestView && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[51] p-4"> {/* Increased z-index */}
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
                    <button
                        onClick={handleCloseViewRequestModal}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Client Service Request</h3>
                    <div className="space-y-3 text-sm text-gray-700 max-h-[60vh] overflow-y-auto pr-2">
                        <p><strong>Client:</strong> {currentTaskForRequestView.client_name}</p>
                        <p><strong>Domain:</strong> {currentTaskForRequestView.domain_name}</p>
                        <p><strong>Request Date:</strong> {currentTaskForRequestView.request_date}</p>
                        <hr className="my-3"/>
                        <p className="font-medium text-gray-800">Request Details:</p>
                        <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded-md border border-gray-200 font-sans text-sm">
                            {currentTaskForRequestView.dummy_request_details}
                        </pre>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleCloseViewRequestModal}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )}
      </>
    );
  }

  // --- CUSTOM TYPE TABLE AND MODAL ---
  return (
    <div className="rounded-xl bg-white p-5 shadow-md text-sm">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="🔍  Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
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
              <div className="absolute z-10 top-full right-0 mt-1 w-48 bg-white border shadow-md rounded-md text-sm">
                <button className="block w-full text-left px-3 py-2 hover:bg-gray-100" onClick={() => handleSortChange('name_asc')}>Client Name (A–Z)</button>
                <button className="block w-full text-left px-3 py-2 hover:bg-gray-100" onClick={() => handleSortChange('name_desc')}>Client Name (Z–A)</button>
                <button className="block w-full text-left px-3 py-2 hover:bg-gray-100" onClick={() => handleSortChange('price_asc')}>Price (Low → High)</button>
                <button className="block w-full text-left px-3 py-2 hover:bg-gray-100" onClick={() => handleSortChange('price_desc')}>Price (High → Low)</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
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
            {paginatedCustomRequests.map((req) => (
              <tr key={req.id} className="border hover:bg-gray-50">
                <td className="px-4 py-3">{req.client_name}</td>
                <td className="px-4 py-3">{req.client_phone}</td>
                <td className="px-4 py-3">{req.client_email}</td>
                <td
                  className="px-4 py-3 text-blue-600 font-medium cursor-pointer flex items-center gap-1"
                  onClick={() => {
                    setSelectedRequest(req); // This sets the state for the 'custom' type modal
                    setPriceInput(req.plan_price || '');
                  }}
                >
                  <EyeIcon className="h-4 w-4" />
                  <span className="text-sm">View Request</span>
                </td>
                <td className="px-4 py-3">{req.plan_price ? `$${req.plan_price}` : 'Not set'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleRaiseAlert(req)}
                    disabled={!req.plan_price}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    Raise alert
                  </button>
                </td>
              </tr>
            ))}
             {paginatedCustomRequests.length === 0 && (
                <tr>
                    <td colSpan="6" className="text-center py-4">No plan requests found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPagesCustom > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <span>Page</span>
            <select
              className="border px-2 py-1 rounded"
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
            >
              {Array.from({ length: totalPagesCustom }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <span>of {totalPagesCustom}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              &lt;
            </button>
            {(() => {
                const pageNumbers = []; const maxPagesToShow = 5; let startPage, endPage;
                if (totalPagesCustom <= maxPagesToShow) { startPage = 1; endPage = totalPagesCustom; } 
                else { const halfPagesToShow = Math.floor(maxPagesToShow / 2);
                    if (currentPage <= halfPagesToShow) { startPage = 1; endPage = maxPagesToShow; } 
                    else if (currentPage + halfPagesToShow >= totalPagesCustom) { startPage = totalPagesCustom - maxPagesToShow + 1; endPage = totalPagesCustom; } 
                    else { startPage = currentPage - halfPagesToShow; endPage = currentPage + halfPagesToShow; }
                }
                for (let i = startPage; i <= endPage; i++) { pageNumbers.push( <button key={i} onClick={() => setCurrentPage(i)} className={`px-3 py-1 rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'border'}`} > {i} </button> ); }
                return pageNumbers;
            })()}
            <button
              disabled={currentPage === totalPagesCustom}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      )}

      {/* MODAL for 'custom' type ('View Request' to set price) */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4"> {/* Ensure z-index is appropriate */}
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative">
            <h2 className="text-lg font-semibold mb-4">Request from {selectedRequest.client_name}</h2>
             <div className="mb-3">
                <p className="text-xs text-gray-500">Email: {selectedRequest.client_email}</p>
                <p className="text-xs text-gray-500">Phone: {selectedRequest.client_phone}</p>
            </div>
            <p className="text-sm font-medium mb-1">Selected Features:</p>
            <ul className="space-y-1 mb-4 max-h-40 overflow-y-auto text-sm">
              {selectedRequest.plan_features?.length > 0 ? selectedRequest.plan_features?.map((feature, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-green-600 pt-0.5">✔</span>
                  <span>{feature}</span>
                </li>
              )) : (
                <li className="text-gray-500">No specific features listed.</li>
              )}
            </ul>
             {selectedRequest.description && (
                <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Additional Notes/Description:</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded border">{selectedRequest.description}</p>
                </div>
            )}
            <div className="flex items-center border rounded-md overflow-hidden">
              <span className="px-3 text-gray-500">$</span>
              <input
                type="number"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder="Set Plan Price"
                className="flex-1 py-2 outline-none appearance-none" // Removed appearance-none for number input arrows if desired
                style={{MozAppearance: 'textfield'}} // For Firefox to hide arrows
              />
              <button
                onClick={handleSavePrice}
                className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 text-sm"
              >
                Save Price
              </button>
            </div>
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-2xl leading-none"
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