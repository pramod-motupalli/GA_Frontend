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

useEffect(() => {
  axios.get('http://localhost:8000/api/users/submissions/')
    .then(res => {
      console.log("Full API response:", res.data);
      const approved = res.data.filter(
        plan =>
          (plan.payment_is_approved === true ||
           plan.payment_is_approved === 'Yes' ||
           plan.payment_is_approved === 1) &&
          plan.is_workspace_activated !== true 
          // plan.is_workspace_activated !== 1 ||
          // plan.is_workspace_activated !== 'Yes' ||
          // plan.is_workspace_activated !== 'yes'  // Exclude already activated
      );
      console.log("Filtered approved and not activated plans:", approved);
      setRequests(approved);
    })
    .catch(err => {
      console.error("API error:", err);
    });
  
  axios.get('http://localhost:8000/api/users/get-team-leads/', {
      headers: {
    Authorization: `Token ${token}`  // or Bearer ${token}
  }
  })
  
  .then(res => {
    setTeamLeads(res.data);
  })
  .catch(err => {
    console.error("Failed to fetch team leads:", err);
  });

    
}, []);


  const handleActivateClick = (req) => {
    setSelectedRequest(req);
    setShowModal(true);

    // Reset form fields on modal open
    setWorkspaceName('');
    setDescription('');
    setAssignStaff('');
    setHdMaintenance('');
  };

const handleConfirmActivation = async () => {
  if (!workspaceName || !description || !assignStaff || !hdMaintenance) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    await axios.post('http://localhost:8000/api/users/assign-spoc/', 
      { username: assignSpoc }, 
      {
        headers: {
          Authorization: `Token ${token}`,
        }
      }
    );
    const payload = {
      client_name: selectedRequest.client_name,
      phone_number: selectedRequest.phone_number,
      email: selectedRequest.email,
      workspace_name: workspaceName,
      description,
      assign_staff: assignStaff,
      hd_maintenance: hdMaintenance,
      is_workspace_activated: true,
    };

    // Send data to a new endpoint that stores workspace info
    await axios.post('http://localhost:8000/api/users/workspaces/create/', payload);

    // Optional: also update user’s submission as activated
    await axios.patch(`http://localhost:8000/api/users/${selectedRequest.id}/activate/`, {
      is_workspace_activated: true,
    });

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? { ...r, is_workspace_activated: true }
          : r
      )
    );
    setShowModal(false);
  } catch (error) {
    console.error('Activation failed:', error);
  }
};



  return (
    <div className="p-4">
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

      {/* Conditional Table Rendering */}
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
              {requests.map(req => (
                <tr key={req.id} className="border-t">
                  <td className="px-4 py-3">{req.client_name || 'Unknown'}</td>
                  <td className="px-4 py-3">{req.phone_number || 'N/A'}</td>
                  <td className="px-4 py-3">{req.email || 'N/A'}</td>
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
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                      onClick={() => handleActivateClick(req)}
                    >
                      Activate
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No approved payments to activate.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {/* Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative p-6">
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-xl text-gray-600 hover:text-black"
        onClick={() => setShowModal(false)}
      >
        &times;
      </button>

      {/* Modal Header */}
      <h2 className="text-xl font-semibold mb-6">Creation of workspace</h2>

      {/* Workspace Information Section */}
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">
            Workspace Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Workspace Name"
            className="w-full border rounded px-4 py-2"
            required
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            placeholder="Description"
            className="w-full border rounded px-4 py-2 h-24"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Assign Spoc */}
      <div className="mt-6">
        <label className="block font-medium mb-1">
          Assign spoc <span className="text-red-600">*</span>
        </label>
        <select
          className="w-full border rounded px-4 py-2"
          required
          value={assignSpoc}
          onChange={(e) => setAssignSpoc(e.target.value)}
        >
          <option value="" disabled>
            Select SPOC
          </option>
          {teamLeads.map((lead) => (
            <option key={lead.id} value={lead.username}>
              {lead.username}
            </option>
          ))}
        </select>

      </div>

      {/* H&D Maintenance */}
      <div className="mt-4">
        <label className="block font-medium mb-1">
          H&D Maintenance <span className="text-red-600">*</span>
        </label>
        <select
          className="w-full border rounded px-4 py-2"
          required
          value={hdMaintenance}
          onChange={(e) => setHdMaintenance(e.target.value)}
        >
          <option value="" disabled>
            Select Developer Team Lead
          </option>
          <option value="devlead1">Dev Team Lead 1</option>
          {/* Populate dynamically if needed */}
        </select>
      </div>


      {/* Assign Staff */}
      <div className="mt-4">
        <label className="block font-medium mb-1">
          Assign Staff <span className="text-red-600">*</span>
        </label>
        <select
          className="w-full border rounded px-4 py-2"
          required
          value={assignStaff}
          onChange={(e) => setAssignStaff(e.target.value)}
        >
          <option value="" disabled>
            Select Staff
          </option>
          <option value="staff1">Staff Member 1</option>
          <option value="staff2">Staff Member 2</option>
          {/* Populate dynamically if needed */}
        </select>
      </div>


      {/* Footer */}
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
          type="submit"
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
