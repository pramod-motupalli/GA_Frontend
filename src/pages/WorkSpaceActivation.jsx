import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivatedPayments = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [description, setDescription] = useState('');
  const [assignSpoc, setAssignSpoc] = useState('');
  const [teamLeads, setTeamLeads] = useState([]);
  const [hdMaintenance, setHdMaintenance] = useState('');
  const [assignStaff, setAssignStaff] = useState('');
  const [activeTab, setActiveTab] = useState('new');

  // --- RECTIFICATION: Token Placeholder ---
  // IMPORTANT: Replace 'YOUR_AUTH_TOKEN_PLACEHOLDER' with your actual token
  // retrieval logic (e.g., from localStorage, context, or props).
  // const token = localStorage.getItem('authToken');
  const token = 'YOUR_AUTH_TOKEN_PLACEHOLDER';

useEffect(() => {
  // Fetch Submissions
  axios.get('http://localhost:8000/api/users/submissions/')
    .then(res => {
      console.log("Full API response for submissions:", res.data);
      // --- RECTIFICATION: Ensure res.data is an array before filtering ---
      if (Array.isArray(res.data)) {
        const approved = res.data.filter(
          plan =>
            (plan.payment_is_approved === true ||
             plan.payment_is_approved === 'Yes' ||
             plan.payment_is_approved === 1) &&
            plan.is_workspace_activated !== true
        );
        console.log("Filtered approved and not activated plans:", approved);
        setRequests(approved);
      } else {
        console.error("API response for submissions is not an array:", res.data);
        setRequests([]); // Set to empty array on unexpected format
      }
    })
    .catch(err => {
      console.error("API error fetching submissions:", err.response ? err.response.data : err.message, err);
      setRequests([]); // Ensure requests is always an array even on API failure
    });
  
  // Fetch Team Leads (conditionally, if token exists)
  if (token && token !== 'YOUR_AUTH_TOKEN_PLACEHOLDER') { // Added check to ensure placeholder isn't used
    axios.get('http://localhost:8000/api/users/team-leads/no-spoc/', {
        headers: {
      Authorization: `Token ${token}`
    }
    })
    .then(res => {
      if (Array.isArray(res.data)) {
        setTeamLeads(res.data);
      } else {
        console.error("API response for team leads is not an array:", res.data);
        setTeamLeads([]);
      }
    })
    .catch(err => {
      console.error("Failed to fetch team leads:", err.response ? err.response.data : err.message, err);
      setTeamLeads([]); // Ensure teamLeads is an array on failure
    });
  } else {
    if (token === 'YOUR_AUTH_TOKEN_PLACEHOLDER') {
        console.warn("Using placeholder token. Skipping fetch for team leads. Please replace placeholder.");
    } else {
        console.warn("Auth token is not available. Skipping fetch for team leads.");
    }
    setTeamLeads([]); // Initialize as empty if no token
  }
    
}, []); // Effect runs once on mount


  const handleActivateClick = (req) => {
    setSelectedRequest(req);
    setShowModal(true);
    setWorkspaceName('');
    setDescription('');
    setAssignSpoc('');
    setAssignStaff('');
    setHdMaintenance('');
  };

const handleConfirmActivation = async () => {
  if (!workspaceName || !description || !assignSpoc || !assignStaff || !hdMaintenance) {
    alert("Please fill in all required fields.");
    return;
  }

  if (!token || token === 'YOUR_AUTH_TOKEN_PLACEHOLDER') {
    alert("Authentication token is missing or is a placeholder. Cannot proceed with activation.");
    console.error('Activation failed: Auth token missing or is placeholder.');
    return;
  }

  try {
    // 1. Assign SPOC
    await axios.post('http://localhost:8000/api/users/assign-spoc/', 
      { username: assignSpoc }, 
      {
        headers: {
          Authorization: `Token ${token}`,
        }
      }
    );

    // 2. Create Workspace
    const payload = {
      client_name: selectedRequest.client_name,
      phone_number: selectedRequest.phone_number,
      email: selectedRequest.email,
      workspace_name: workspaceName,
      description,
      assign_staff: assignStaff,
      hd_maintenance: hdMaintenance,
      is_workspace_activated: true, // This might refer to the workspace record itself
    };
    await axios.post('http://localhost:8000/api/users/workspaces/create/', payload, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });

    // 3. Update User's Submission as Activated
    // Ensure selectedRequest.id is the correct identifier for the submission
    await axios.patch(`http://localhost:8000/api/users/submissions/${selectedRequest.id}/activate/`, {
      is_workspace_activated: true, // This updates the submission record
    }, {
        headers: {
            Authorization: `Token ${token}`,
        }
    });

    // Update local state to reflect activation
    setRequests((prev) =>
      prev.filter((r) => r.id !== selectedRequest.id) // Remove activated request from the list
      // Or, if you want to keep it but mark it differently (though current filter would hide it):
      // prev.map((r) =>
      //   r.id === selectedRequest.id
      //     ? { ...r, is_workspace_activated: true } 
      //     : r
      // )
    );
    setShowModal(false);
    alert('Workspace activated successfully!'); // User feedback
  } catch (error) {
    console.error('Activation failed:', error.response ? error.response.data : error.message, error);
    alert(`Activation failed: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
  }
};


  // If there's an error and requests is empty, this will show "No approved payments..."
  // If the component itself fails to render, this return statement might not even be reached.
  return (
    <div className="p-4">
    {/* ... (rest of your JSX is likely fine, assuming no syntax errors) ... */}
    <div className="flex gap-6 mb-4">
        {['new', 'out', 'monthly'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-base capitalize pb-1 border-b-2 transition ${
              activeTab === tab ? 'border-black font-medium' : 'border-transparent text-gray-600'
            }`}
          >
            {tab === 'new' && 'New Purchases'}
            {tab === 'out' && 'Out of Scope'}
            {tab === 'monthly' && 'Monthly Requests'}
          </button>
        ))}
      </div>

      {activeTab === 'new' && (
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
                <th className="px-4 py-3">Activate</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? requests.map(req => (
                <tr key={req.id} className="border-t">
                  <td className="px-4 py-3">{req.client_name || 'Unknown'}</td>
                  <td className="px-4 py-3">{req.phone_number || 'N/A'}</td>
                  <td className="px-4 py-3">{req.email || 'N/A'}</td>
                  <td className="px-4 py-3">${req.price}</td>
                  <td className="px-4 py-3">Category 1</td> {/* This is hardcoded, ensure it's intended */}
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
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                      onClick={() => handleActivateClick(req)}
                    >
                      Activate
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    {/* Changed message to be more generic if requests array is empty for any reason */}
                    No new purchases to activate.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

{showModal && selectedRequest && ( // Ensure selectedRequest is not null before rendering modal
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative p-6 overflow-y-auto max-h-[90vh]"> {/* max-h for viewport height */}
      <button
        className="absolute top-4 right-4 text-xl text-gray-600 hover:text-black z-10"
        onClick={() => setShowModal(false)}
        aria-label="Close modal" // Accessibility
      >
        ×
      </button>

      <h2 className="text-xl font-semibold mb-6">Creation of workspace for {selectedRequest.client_name}</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="workspaceName" className="block font-medium mb-1">
            Workspace Name <span className="text-red-600">*</span>
          </label>
          <input
            id="workspaceName"
            type="text"
            placeholder="Workspace Name"
            className="w-full border rounded px-4 py-2"
            required
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            id="description"
            placeholder="Description"
            className="w-full border rounded px-4 py-2 h-24"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="assignSpoc" className="block font-medium mb-1">
          Assign SPOC <span className="text-red-600">*</span>
        </label>
        <select
          id="assignSpoc"
          className="w-full border rounded px-4 py-2"
          required
          value={assignSpoc}
          onChange={(e) => setAssignSpoc(e.target.value)}
        >
          <option value="" disabled>Select SPOC</option>
          {teamLeads.map((lead) => (
            <option key={lead.id || lead.username} value={lead.username}> {/* Added fallback key */}
              {lead.username} {lead.first_name && lead.last_name ? `(${lead.first_name} ${lead.last_name})` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="hdMaintenance" className="block font-medium mb-1">
          H&D Maintenance <span className="text-red-600">*</span>
        </label>
        <select
          id="hdMaintenance"
          className="w-full border rounded px-4 py-2"
          required
          value={hdMaintenance}
          onChange={(e) => setHdMaintenance(e.target.value)}
        >
          <option value="" disabled>Select Developer Team Lead</option>
          <option value="devlead1">Dev Team Lead 1</option>
          {/* Populate dynamically if needed */}
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="assignStaff" className="block font-medium mb-1">
          Assign Staff <span className="text-red-600">*</span>
        </label>
        <select
          id="assignStaff"
          className="w-full border rounded px-4 py-2"
          required
          value={assignStaff}
          onChange={(e) => setAssignStaff(e.target.value)}
        >
          <option value="" disabled>Select Staff</option>
          <option value="staff1">Staff Member 1</option>
          <option value="staff2">Staff Member 2</option>
          {/* Populate dynamically if needed */}
        </select>
      </div>

      <div className="mt-6 flex justify-end space-x-2">
        <button
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleConfirmActivation}
        >
          Create workspace
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ActivatedPayments;