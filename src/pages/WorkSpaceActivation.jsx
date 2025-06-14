import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OutOfScope1 from './OutOfScope1'; // ✅ Import your component here

const ActivatedPayments = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [description, setDescription] = useState('');
  const [assignSpoc, setAssignSpoc] = useState('');
  const [teamLeads, setTeamLeads] = useState([]);
  const [hdLeads, setHdLeads] = useState([]);
  const [hdMaintenance, setHdMaintenance] = useState('');
  const [assignStaff, setAssignStaff] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [activeTab, setActiveTab] = useState('new');

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    axios.get('http://localhost:8000/api/users/submissions/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (Array.isArray(res.data)) {
          const approved = res.data.filter(
            plan =>
              (plan.payment_is_approved === true ||
                plan.payment_is_approved === 'Yes' ||
                plan.payment_is_approved === 1) &&
              plan.is_workspace_activated !== true
          );
          setRequests(approved);
        } else {
          setRequests([]);
        }
      })
      .catch(() => setRequests([]));

    if (token) {
      axios.get('http://localhost:8000/api/users/team-leads', {
        headers: { Authorization: `Token ${token}` }
      })
        .then(res => setTeamLeads(Array.isArray(res.data) ? res.data : []))
        .catch(() => setTeamLeads([]));

      axios.get('http://localhost:8000/api/users/team-leads/', {
        headers: { Authorization: `Token ${token}` }
      })
        .then(res => setHdLeads(Array.isArray(res.data) ? res.data : []))
        .catch(() => setHdLeads([]));

      axios.get('http://localhost:8000/api/users/staff-members/', {
        headers: { Authorization: `Token ${token}` }
      })
        .then(res => setStaffList(Array.isArray(res.data) ? res.data : []))
        .catch(() => setStaffList([]));
    }
  }, []);

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

    if (!token) {
      alert("Authentication token is missing.");
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/users/assign-spoc/',
        { id: assignSpoc },
        { headers: { Authorization: `Token ${token}` } }
      );

      const payload = {
        client: typeof selectedRequest.client === 'object' ? selectedRequest.client.id : selectedRequest.client,
        workspace_name: workspaceName,
        description,
        assign_spoc: assignSpoc,
        assign_staff: assignStaff,
        hd_maintenance: hdMaintenance,
        is_workspace_activated: true,
      };

      await axios.post('http://localhost:8000/api/users/workspaces/create/', payload, {
        headers: { Authorization: `Token ${token}` }
      });

      await axios.patch(`http://localhost:8000/api/users/${selectedRequest.id}/activate/`, {
        is_workspace_activated: true,
      }, {
        headers: { Authorization: `Token ${token}` }
      });

      setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
      setShowModal(false);
      alert('Workspace activated successfully!');
    } catch (error) {
      alert(`Activation failed: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
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

      {activeTab === 'out' ? (
        <OutOfScope1 />
      ) : activeTab === 'new' ? (
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
                    No new purchases to activate.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : null}

      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative p-6 overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-xl text-gray-600 hover:text-black z-10"
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-6">Creation of workspace for {selectedRequest.client_name}</h2>

            <div className="space-y-4">
              {/* Workspace Name */}
              <div>
                <label htmlFor="workspaceName" className="block font-medium mb-1">
                  Workspace Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="workspaceName"
                  type="text"
                  placeholder="Workspace Name"
                  className="w-full border rounded px-4 py-2"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block font-medium mb-1">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="description"
                  placeholder="Description"
                  className="w-full border rounded px-4 py-2 h-24"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Assign SPOC */}
              <div>
                <label htmlFor="assignSpoc" className="block font-medium mb-1">
                  Assign SPOC <span className="text-red-600">*</span>
                </label>
                <select
                  id="assignSpoc"
                  className="w-full border rounded px-4 py-2"
                  value={assignSpoc}
                  onChange={(e) => setAssignSpoc(e.target.value)}
                >
                  <option value="" disabled>Select SPOC</option>
                  {teamLeads.map((spoc) => (
                    <option key={spoc.id} value={spoc.id}>{spoc.username}</option>
                  ))}
                </select>
              </div>

              {/* H&D Maintenance */}
              <div>
                <label htmlFor="hdMaintenance" className="block font-medium mb-1">
                  H&D Maintenance <span className="text-red-600">*</span>
                </label>
                <select
                  id="hdMaintenance"
                  className="w-full border rounded px-4 py-2"
                  value={hdMaintenance}
                  onChange={(e) => setHdMaintenance(e.target.value)}
                >
                  <option value="" disabled>Select Developer Team Lead</option>
                  {hdLeads.map((lead) => (
                    <option key={lead.id} value={lead.id}>{lead.username}</option>
                  ))}
                </select>
              </div>

              {/* Assign Staff */}
              <div>
                <label htmlFor="assignStaff" className="block font-medium mb-1">
                  Assign Staff <span className="text-red-600">*</span>
                </label>
                <select
                  id="assignStaff"
                  className="w-full border rounded px-4 py-2"
                  value={assignStaff}
                  onChange={(e) => setAssignStaff(e.target.value)}
                >
                  <option value="" disabled>Select Staff</option>
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.id}>{staff.username}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleConfirmActivation}>
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
