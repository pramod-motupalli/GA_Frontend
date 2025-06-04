import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  UserCheck,
  Briefcase,
  ClipboardList,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Clipboard,
  Settings,
  Users,
  User,
  LogOut,
  MessageCircle,
  Bell,
  BadgeCheck,
  ChevronDown,
  X // X icon is imported but not used explicitly in this snippet, keep if needed elsewhere
} from "lucide-react";

import logo from "../assets/GA.png"; // Ensure this path is correct
import emptyDataIcon from "../assets/empty-data-icon.png"; // Ensure this path is correct
import WorkspaceCardTeamlead from './WorkspaceCardTeamlead'; // Ensure component exists
import DomainHostingTableTeamlead from "./DomainHostingTableTeamlead"; // Ensure component exists
import AssignMembersModal from "../pages/AssignMembersModal"; // Ensure component exists
import FlowManager from "./FlowManager"; // Ensure component exists and props are handled
import TasksPage, {
  TaskDetailModal,
  // initialDummyTasks as tasksPageInitialTasks, // Using API data instead of dummy
} from "../pages/TasksPage"; // Ensure component exists
import WorkspaceTaskApprovalsTable from "./WorkspaceTaskApprovalsTable"; // Ensure component exists
import TeamTaskApprovalsTable from "./TeamTaskApprovalsTable";    // Ensure component exists

const Dashboard = () => {
  const [clientRequests, setClientRequests] = useState([]); // This state now holds tasks

  // --- useEffect to fetch initial tasks ---
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        console.error("Access token not found. Please login.");
        // Optionally, redirect to login or display a message to the user
        return;
    }

    axios.get("http://localhost:8000/api/users/spoc/tasks/", { // Ensure this endpoint is correct
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        const formattedData = response.data.map(item => ({
          id: item.id,
          clientName: item.client_name || "N/A", // From TaskDetailSerializer
          domain: item.domain_name || "N/A", // From TaskDetailSerializer
          raisedDate: item.created_at ? item.created_at.split('T')[0] : "N/A",
          description: item.description || "",
          scopeStatus: item.status, // This is the Task.status field from backend
        }));
        setClientRequests(formattedData);
      })
      .catch(error => {
        console.error("Failed to fetch tasks:", error.response ? error.response.data : error.message);
      });
  }, []);


  const [flowModalOpen, setFlowModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false); // Controls the main task detail/scope modal
  const [modalContentType, setModalContentType] = useState(null); // To differentiate modal content if needed
  const [selectedRequest, setSelectedRequest] = useState(null); // Holds the task selected for viewing/editing

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [selectedTab, setSelectedTab] = useState("Staff Member"); // For "Create Member" section
  const [showDropdown, setShowDropdown] = useState(false); // For "Add User" dropdown
  const [showModal, setShowModal] = useState(false); // Controls the staff creation/edit modal
  const [modalUserType, setModalUserType] = useState("Client"); // For staff/client creation modal
  const [formData, setFormData] = useState({ name: "", email: "", teamLead: "", designation: "" }); // For staff form
  const [editingIndex, setEditingIndex] = useState(null); // For editing staff
  const [staffMembers, setStaffMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // For staff pagination
  const itemsPerPage = 8; // For staff pagination

  const [teamLeads, setTeamLeads] = useState([]);
  const [isAssignMembersModalOpen, setIsAssignMembersModalOpen] = useState(false);

  // Pagination and filtering for the tasks table (formerly client requests)
  const [clientRequestCurrentPage, setClientRequestCurrentPage] = useState(1);
  const [clientRequestItemsPerPage, setClientRequestItemsPerPage] = useState(10);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [clientSortOption, setClientSortOption] = useState("");

  // This state seems redundant if isRequestModalOpen is primary for task details.
  // If it's for a different modal, ensure its usage is clear.
  // For now, assuming isRequestModalOpen is the main one.
  const [showRequestModal_Legacy, setShowRequestModal_Legacy] = useState(false);

  const [activeApprovalTab, setActiveApprovalTab] = useState("workspace");
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false); // For TaskDetailModal from TasksPage
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState(null); // For TaskDetailModal

  const [flowManagerInitialScreen, setFlowManagerInitialScreen] = useState('default');

  // --- Fetch Team Leads ---
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    const fetchTeamLeads = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users/team-leads/", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        setTeamLeads(response.data.map(lead => ({ id: lead.username, name: lead.username }))); // Assuming structure
      } catch (error) {
        console.error("Failed to fetch team leads:", error.response ? error.response.data : error.message);
      }
    };
    fetchTeamLeads();
  }, []);

  // --- Fetch Staff Members ---
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    const fetchStaffMembers = async () => {
      try {
        // Use consistent auth (Bearer token) if that's your standard
        const response = await axios.get('http://localhost:8000/api/users/get-staff-members/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const formattedData = response.data.map((staff) => ({
          id: staff.id, // Crucial for key and selection
          name: staff.name || `${staff.first_name} ${staff.last_name}`.trim(), // Adjust based on your CustomUser fields
          email: staff.email,
          designation: staff.designation || "N/A", // Access designation via profile
        }));
        setStaffMembers(formattedData);
      } catch (error) {
        console.error('Failed to fetch staff members:', error.response ? error.response.data : error.message);
      }
    };
    fetchStaffMembers();
  }, []);

  // --- Staff Creation/Edit Modal Logic ---
  const openModal = (userType, staffMemberOriginalIndex = null) => {
    setModalUserType(userType); // "Client" or "Staff Member"
    if (userType === "Staff Member") {
        setEditingIndex(staffMemberOriginalIndex);
        if (staffMemberOriginalIndex !== null && staffMembers[staffMemberOriginalIndex]) {
            const staffToEdit = staffMembers[staffMemberOriginalIndex];
            setFormData({
                name: staffToEdit.name,
                email: staffToEdit.email,
                teamLead: staffToEdit.team_lead_id || "", // Assuming you have team_lead_id
                designation: staffToEdit.designation || "",
            });
            console.log(teamLead);
        } else {
            setFormData({ name: "", email: "", teamLead: "", designation: "" });
        }
        setShowModal(true); // This controls the staff creation/edit modal
    } else {
        // Handle "Client" user creation if different UI/logic
        alert("Client creation UI not implemented in this modal.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Staff creation/update submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert("Authentication error. Please log in.");
      return;
    }
    // Determine API endpoint and method based on editingIndex
    // This is a simplified example; backend needs to handle create/update for staff
    const apiEndpoint = editingIndex !== null
      ? `http://localhost:8000/api/users/staff/${staffMembers[editingIndex].id}/update/` // Placeholder for update
      : "http://localhost:8000/api/users/register-staff/"; // For creation

    const method = editingIndex !== null ? "PUT" : "POST"; // Or PATCH for update

    try {
      const response = await axios({
        method: method,
        url: apiEndpoint,
        data: { // Send data expected by backend (e.g., username, email, password, role, profile_data)
            username: formData.name, 
            // Assuming name is username for simplicity
            email: formData.email,
            password: "123", // Handle password securely in a real app
            role: "team_member", // Or derive from designation
            team_lead_id: formData.teamLead || null, // Send team lead ID
            designation: formData.designation
        },
        
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

        
      const savedStaffData = response.data; // Assuming backend returns the created/updated staff member
      const staffMemberForState = {
          id: savedStaffData.user?.id || savedStaffData.id,
          name: savedStaffData.user?.username || savedStaffData.username || formData.name,
          email: savedStaffData.user?.email || savedStaffData.email || formData.email,
          designation: savedStaffData.staff_profile?.designation || formData.designation,
          teamLead: formData.teamLead // Keep this for display consistency if needed
      };

      if (editingIndex !== null) {
        const updatedStaffList = staffMembers.map((member, index) =>
          index === editingIndex ? staffMemberForState : member
        );
        setStaffMembers(updatedStaffList);
      } else {
        setStaffMembers([...staffMembers, staffMemberForState]);
      }
      setShowModal(false);
      setEditingIndex(null);
      setFormData({ name: "", email: "", teamLead: "", designation: "" }); // Reset form
    } catch (error) {
      console.error("Error creating/updating staff member:", error.response ? error.response.data : error.message);
      alert("Error: " + (error.response?.data?.detail || error.message || "Could not save staff member."));
    }
  };

  // Staff deletion
  const handleDelete = async (staffMemberOriginalIndex) => {
    if (staffMemberOriginalIndex === null || !staffMembers[staffMemberOriginalIndex]) return;

    const memberToDelete = staffMembers[staffMemberOriginalIndex];
    if (!window.confirm(`Are you sure you want to delete ${memberToDelete.name}?`)) return;

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        alert("Authentication error.");
        return;
    }
    try {
        // await axios.delete(`http://localhost:8000/api/users/staff/${memberToDelete.id}/delete/`, { // Placeholder for delete endpoint
        //     headers: { Authorization: `Bearer ${accessToken}` }
        // });
        console.log(`Placeholder: API call to delete staff member ${memberToDelete.id}`); // Replace with actual API call

        const updatedStaffList = staffMembers.filter((_, index) => index !== staffMemberOriginalIndex);
        setStaffMembers(updatedStaffList);
    } catch (error) {
        console.error("Failed to delete staff member:", error.response ? error.response.data : error.message);
        alert("Error deleting staff member.");
    }
  };

  // --- Task/Request Modal & Action Logic ---
  const handleViewRequest = (request) => { // 'request' here is actually a task object
    setSelectedRequest(request);
    setModalContentType('request'); // Indicates content for the main task detail modal
    setIsRequestModalOpen(true);
  };

  // Update task status via PATCH request
  const handleScopeStatusUpdate = async (taskId, newBackendStatus) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!taskId || !accessToken) {
      console.error("Task ID or access token is missing.");
      alert("Could not update status: Critical information missing.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:8000/api/users/spoc/tasks/${taskId}/update-status/`,
        { status: newBackendStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200 && response.data) {
        const updatedTaskFromServer = response.data;
        const updatedClientRequests = clientRequests.map((req) =>
          req.id === taskId
            ? {
                ...req, // Keep existing frontend fields if any
                id: updatedTaskFromServer.id,
                clientName: updatedTaskFromServer.client_name || "N/A",
                domain: updatedTaskFromServer.domain_name || "N/A",
                raisedDate: updatedTaskFromServer.created_at ? updatedTaskFromServer.created_at.split('T')[0] : "N/A",
                description: updatedTaskFromServer.description || "",
                scopeStatus: updatedTaskFromServer.status, // Use the updated status from backend
              }
            : req
        );
        setClientRequests(updatedClientRequests);
        setIsRequestModalOpen(false); // Close the task detail modal
        alert("Task status updated successfully!");
      } else {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.status?.[0] || // Specific validation error for status
                       error.response?.data?.detail ||       // General DRF error
                       error.message ||                      // Axios or network error
                       "Failed to update task status.";
      console.error("Error updating task status:", error.response ? error.response.data : errorMsg);
      alert(`Error: ${errorMsg}`);
    }
  };


  // --- Approvals Tab Logic ---
  const handleViewTaskApproval = (taskData) => { // taskData should be the full task object
    if (taskData) {
      setSelectedTaskForDetail(taskData); // This taskData comes from WorkspaceTaskApprovalsTable
      setShowTaskDetailModal(true); // This opens the TaskDetailModal from TasksPage
    } else {
      console.warn(`Task data not provided for approval view.`);
    }
  };

  const handleViewClientRequestForApproval = (clientRequestItem) => { // clientRequestItem is a task
    if (clientRequestItem) {
        setSelectedRequest(clientRequestItem); // Use selectedRequest for consistency if modal is similar
        setModalContentType('request_approval_view'); // Differentiate if UI is different
        setIsRequestModalOpen(true); // Open the main task detail modal
    } else {
        console.warn("Client Request (Task) not found for ID from approval");
        alert("Task details not found.");
    }
  };

  const handleAssignTaskInApproval = (approvalItemId, staffId, approvalType) => {
    console.log(`${approvalType} Approval Item ID: ${approvalItemId}, Assigned to Staff ID: ${staffId}`);
    // Implement API call to assign task
  };


  // --- Render Methods ---

  // Staff Creation/Edit Modal
  const renderStaffModal = () => (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{editingIndex !== null ? "Edit Staff Member" : "Create Staff Member"}</h2>
          <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-black text-xl font-bold">X</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <select name="teamLead" value={formData.teamLead} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-gray-600">
            <option value="">Select Team Lead</option>
            {teamLeads.map((lead) => (<option key={lead.id} value={lead.id}>{lead.name}</option>))}
          </select>
          <select name="designation" value={formData.designation} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-gray-600">
            <option value="">Select Designation</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            {/* Add other dynamic designations if available */}
          </select>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name / Username" className="w-full border border-gray-300 rounded-md p-2" />
          <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email ID" className="w-full border border-gray-300 rounded-md p-2" />
          {/* Consider password field for creation, handle securely */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="border px-4 py-2 rounded text-gray-600 hover:bg-gray-100">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{editingIndex !== null ? "Update User" : "Create User"}</button>
          </div>
        </form>
      </div>
    </div>
  );

  // "Create Member" Tab Content
  const renderCreateMembersContent = () => {
    const totalStaffPages = Math.ceil(staffMembers.length / itemsPerPage) || 1;
    const startIdx = (currentPage - 1) * itemsPerPage;
    const visibleMembers = staffMembers.slice(startIdx, startIdx + itemsPerPage);

    return (
      <div className="w-full h-full bg-white rounded-xl p-6 shadow flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-6">
            {["Staff Member", "Client"].map((tab) => ( // "Client" tab needs its own UI if selected
              <button key={tab} onClick={() => setSelectedTab(tab)}
                className={`text-md font-medium pb-2 ${selectedTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="relative">
            <button onClick={() => setShowDropdown(!showDropdown)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 shadow">
              + Add User <ChevronDown className="w-4 h-4" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded z-10">
                {["Staff Member", "Client"].map((type) => (
                  <div key={type} onClick={() => { openModal(type); setShowDropdown(false); }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">{type}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedTab === "Staff Member" ? (
          staffMembers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {visibleMembers.map((member) => {
                  const originalIndex = staffMembers.findIndex(m => m.id === member.id);
                  return (
                    <div key={member.id} className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white relative">
                      <div className="absolute top-2 right-2">
                        <div className="group relative">
                          <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
                          <div className="hidden group-hover:flex flex-col absolute right-0 top-6 bg-white border rounded shadow z-10 w-32">
                            <button onClick={() => openModal("Staff Member", originalIndex)} className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 w-full text-left">Edit User</button>
                            <button onClick={() => handleDelete(originalIndex)} className="px-3 py-1.5 text-xs text-red-600 hover:bg-gray-100 w-full text-left">Delete User</button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-6 h-6 text-gray-600" />
                        <div>
                          <h3 className="font-semibold text-gray-800">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.designation}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <button className="w-full text-center mt-2 bg-blue-100 text-blue-600 text-sm py-1 rounded">View Profile</button>
                    </div>
                  );
                })}
              </div>
              {/* Pagination for Staff Members */}
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-600">
                  Page{" "}
                  <select value={currentPage} onChange={(e) => setCurrentPage(Number(e.target.value))} className="border rounded px-2 py-1">
                    {Array.from({ length: totalStaffPages }, (_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}
                  </select>{" "}
                  of {totalStaffPages}
                </div>
                <div className="flex items-center gap-2">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="border rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50">{"<"}</button>
                  {Array.from({ length: totalStaffPages }, (_, i) => (
                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`border rounded-full w-8 h-8 flex items-center justify-center ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""}`}>{i + 1}</button>
                  ))}
                  <button disabled={currentPage === totalStaffPages} onClick={() => setCurrentPage(currentPage + 1)} className="border rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50">{">"}</button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-gray-500 gap-2">
              <img src={emptyDataIcon} alt="Empty Data" className="w-20 h-20 opacity-60" />
              <p>No Staff Members created</p>
            </div>
          )
        ) : ( // Placeholder for "Client" tab in Create Member section
            <div className="flex-1 flex flex-col justify-center items-center text-gray-500 gap-2">
                <img src={emptyDataIcon} alt="Empty Data" className="w-20 h-20 opacity-60" />
                <p>Client management UI not implemented here.</p>
            </div>
        )}
      </div>
    );
  };

  // Tasks Table (formerly Client Requests)
  const renderClientRequestsTable = () => {
    let processedRequests = [...clientRequests]; // clientRequests are tasks
    if (clientSearchTerm) {
      const lowerSearchTerm = clientSearchTerm.toLowerCase();
      processedRequests = processedRequests.filter(req =>
        (req.clientName || "").toLowerCase().includes(lowerSearchTerm) ||
        (req.domain || "").toLowerCase().includes(lowerSearchTerm) ||
        (req.raisedDate || "").toLowerCase().includes(lowerSearchTerm) ||
        (req.scopeStatus && req.scopeStatus.replace(/_/g, ' ').toLowerCase().includes(lowerSearchTerm)) || // Search readable status
        (req.description || "").toLowerCase().includes(lowerSearchTerm)
      );
    }
    if (clientSortOption === 'name_asc') processedRequests.sort((a, b) => (a.clientName || "").localeCompare(b.clientName || ""));
    else if (clientSortOption === 'name_desc') processedRequests.sort((a, b) => (b.clientName || "").localeCompare(a.clientName || ""));
    else if (clientSortOption === 'date_new') processedRequests.sort((a, b) => new Date(b.raisedDate) - new Date(a.raisedDate));
    else if (clientSortOption === 'date_old') processedRequests.sort((a, b) => new Date(a.raisedDate) - new Date(b.raisedDate));

    const totalClientRequestPages = Math.ceil(processedRequests.length / clientRequestItemsPerPage) || 1;
    const clientRequestStartIdx = (clientRequestCurrentPage - 1) * clientRequestItemsPerPage;
    const paginatedClientRequests = processedRequests.slice(clientRequestStartIdx, clientRequestStartIdx + clientRequestItemsPerPage);

    const getPageNumbers = () => {
      const pageCount = totalClientRequestPages; const currentPage = clientRequestCurrentPage; const delta = 1; const range = [];
      for (let i = Math.max(2, currentPage - delta); i <= Math.min(pageCount - 1, currentPage + delta); i++) range.push(i);
      if (currentPage - delta > 2) range.unshift("...");
      if (currentPage + delta < pageCount - 1) range.push("...");
      range.unshift(1); if (pageCount > 1) range.push(pageCount);
      return [...new Set(range)];
    };
    const pageNumbers = getPageNumbers();

    return (
      <>
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:flex-grow">
              <input type="text" placeholder="Search tasks by client, domain, status, or description..." className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={clientSearchTerm} onChange={(e) => { setClientSearchTerm(e.target.value); setClientRequestCurrentPage(1); }} />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 text-gray-600 py-2.5 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-400 text-sm"
                  value={clientSortOption} onChange={(e) => { setClientSortOption(e.target.value); setClientRequestCurrentPage(1); }}>
                  <option value="">Sort by</option> <option value="name_asc">Client Name (A-Z)</option> <option value="name_desc">Client Name (Z-A)</option>
                  <option value="date_new">Date (Newest)</option> <option value="date_old">Date (Oldest)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {/* Placeholder for Filters button */}
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none text-sm">
                Filters <Filter className="w-4 h-4" />
              </button>
              <button className="p-2.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Tasks Overview</h2> {/* Renamed title */}
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-[1100px] w-full table-auto">
              <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Client Name</th> <th className="px-4 py-3">Domain Name</th> <th className="px-4 py-3">Raised Date</th>
                  <th className="px-4 py-3">Task Details</th> <th className="px-4 py-3">Status</th> <th className="px-4 py-3">Assigned To</th>
                  <th className="px-4 py-3">Flow/Hours</th> <th className="px-4 py-3">Workhours</th> <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedClientRequests.length > 0 ? paginatedClientRequests.map((task) => ( // 'task' instead of 'req'
                    <tr key={task.id} className="text-sm text-gray-700 hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">{task.clientName}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{task.domain}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{task.raisedDate}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button onClick={() => handleViewRequest(task)} className="flex items-center text-blue-600 hover:text-blue-700">
                          <Eye className="w-4 h-4 mr-1" /> View Details
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {task.scopeStatus ? (
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            task.scopeStatus.toLowerCase() === "completed" ? "bg-green-100 text-green-800" :
                            task.scopeStatus.toLowerCase() === "in_progress" ? "bg-blue-100 text-blue-800" :
                            task.scopeStatus.toLowerCase() === "pending" ? "bg-yellow-100 text-yellow-800" : 
                            "bg-gray-100 text-gray-800" // Default for other statuses
                          }`}>
                            {task.scopeStatus.replace(/_/g, ' ')} {/* Display "in progress" from "in_progress" */}
                          </span>
                        ) : ( <span className="text-gray-400 italic">N/A</span> )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <select className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
                          <option value="">Select Staff</option>
                          {staffMembers.map(staff => ( <option key={staff.id} value={staff.id}>{staff.name}</option> ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button onClick={() => {
                            setSelectedRequest(task); // Pass the task to FlowManager
                            setFlowManagerInitialScreen('default');
                            setFlowModalOpen(true);
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"> Manage Flow </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedRequest(task);
                            setFlowManagerInitialScreen('scopeOfHours');
                            setFlowModalOpen(true);
                          }}
                          className="text-blue-600 hover:underline text-xs focus:outline-none"
                        >
                          Scope Hours
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {/* Placeholder for more actions */}
                        <button className="text-blue-500 underline hover:text-blue-700 text-xs"> Rise to manager </button>
                      </td>
                    </tr>
                  )) : ( <tr> <td colSpan="9" className="text-center py-10 text-gray-500"> No tasks found. </td> </tr> )}
              </tbody>
            </table>
          </div>
          {/* Pagination for Tasks Table */}
          {processedRequests.length > 0 && (
            <div className="flex items-center justify-between mt-6 px-1 text-sm text-gray-600">
              <div>
                Page{" "} <select value={clientRequestCurrentPage} onChange={(e) => setClientRequestCurrentPage(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  {Array.from({ length: totalClientRequestPages }, (_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))} </select> {" "}of {totalClientRequestPages}
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={() => setClientRequestCurrentPage(prev => Math.max(1, prev - 1))} disabled={clientRequestCurrentPage === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"> Previous </button>
                {pageNumbers.map((page, index) => (
                  <React.Fragment key={index}>
                    {typeof page === 'number' ? (
                      <button onClick={() => setClientRequestCurrentPage(page)}
                        className={`px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 ${clientRequestCurrentPage === page ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : ''}`}> {page} </button>
                    ) : (<span className="px-3 py-1.5"> {page} </span>)}
                  </React.Fragment>
                ))}
                <button onClick={() => setClientRequestCurrentPage(prev => Math.min(totalClientRequestPages, prev + 1))} disabled={clientRequestCurrentPage === totalClientRequestPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"> Next </button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  // Main Task Detail & Scope Update Modal
  const renderTaskDetailModal = () => {
    if (!isRequestModalOpen || !selectedRequest) return null;

    // Determine title based on modalContentType (if used for different contexts)
    const modalTitle = modalContentType === 'request_approval_view'
        ? "Task Details (Approval View)"
        : "Task Details & Scope";

    return (
      <div className="fixed inset-0 flex items-center justify-center z-[60] bg-black bg-opacity-40 p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{modalTitle}</h3>
            <button onClick={() => setIsRequestModalOpen(false)} className="text-gray-500 hover:text-black font-bold text-xl">X</button>
          </div>
          <div className="space-y-1 mb-4">
            <p><strong>Client Name:</strong> {selectedRequest.clientName}</p>
            <p><strong>Domain Name:</strong> {selectedRequest.domain}</p>
            <p><strong>Raised Date:</strong> {selectedRequest.raisedDate}</p>
            <p><strong>Current Status:</strong> <span className="font-medium">{selectedRequest.scopeStatus?.replace(/_/g, ' ') || "N/A"}</span></p>
          </div>
          <div className="mb-4">
            <p className="font-semibold mb-1">Description:</p>
            <div className="text-gray-700 whitespace-pre-wrap text-sm bg-gray-50 p-3 border rounded max-h-40 overflow-y-auto">
              {selectedRequest.description}
            </div>
          </div>

          {/* Scope/Status update buttons only if not in 'approval_view' or if actions allowed in approval view */}
          {modalContentType !== 'request_approval_view' && (
            <div>
              <h4 className="text-md font-semibold mb-3">Update Task Status (Scope Decision)</h4>
              <div className="flex flex-wrap items-center gap-2"> {/* Use gap-2 and flex-wrap */}
                <button onClick={() => handleScopeStatusUpdate(selectedRequest.id, 'in_progress')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">
                  Mark as "In Progress"
                </button>
                <button onClick={() => handleScopeStatusUpdate(selectedRequest.id, 'completed')}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm">
                  Mark as "Completed"
                </button>
                <button onClick={() => handleScopeStatusUpdate(selectedRequest.id, 'pending')}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 text-sm">
                  Mark as "Pending"
                </button>
                {/* Add more status update buttons if needed, e.g., for 'out_of_scope' if it's a distinct status */}
              </div>
            </div>
          )}
          {/* Close button for approval view */}
          {modalContentType === 'request_approval_view' && (
            <div className="mt-4 flex justify-end">
              <button onClick={() => setIsRequestModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };


  // Legacy modal, if still needed for a different purpose.
  // Ensure its state (showRequestModal_Legacy) is managed correctly.
  const handleLegacyScopeDecision = (backendStatus) => {
    if (!selectedRequest) return;
    // This should ideally also call the PATCH request
    // handleScopeStatusUpdate(selectedRequest.id, backendStatus);
    console.log(`Legacy modal: Setting status to ${backendStatus} for task ${selectedRequest.id}. API call needed.`);
    // For now, just updating local state if it's a different part of UI
    const updatedRequests = clientRequests.map((req) =>
      req.id === selectedRequest.id ? { ...req, scopeStatus: backendStatus } : req // This won't persist
    );
    setClientRequests(updatedRequests);
    setShowRequestModal_Legacy(false);
  };

  const renderLegacyRequestModal = () => {
    if (!showRequestModal_Legacy || !selectedRequest) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
        <div className="bg-white rounded-lg p-6 w-[400px] max-w-full shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Legacy Request Description</h2>
            <button onClick={() => setShowRequestModal_Legacy(false)} className="text-xl font-bold text-gray-600">X</button>
          </div>
          <p className="text-gray-700 text-sm mb-4">{selectedRequest?.description}</p>
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">View Scope (Legacy)</h3>
            <div className="flex gap-4">
              <button onClick={() => handleLegacyScopeDecision('in_progress')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"> Within Scope </button>
              <button onClick={() => handleLegacyScopeDecision('completed')} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"> Out of Scope </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Approvals Tab Content
  const renderApprovalsContent = () => (
    <div className="w-full h-full bg-white rounded-xl shadow flex flex-col">
      <div className="px-6 pt-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Approvals</h1>
        <div className="flex items-center border-b border-gray-200">
          <button onClick={() => setActiveApprovalTab("workspace")}
          className={`px-5 py-3 text-sm font-medium focus:outline-none ${ activeApprovalTab === "workspace" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"}`}>
          Workspace Task Approvals
          <span className="ml-2 inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {/* Placeholder for dynamic count. WorkspaceTaskApprovalsTable might need to provide this. */}
            {/* e.g., workspaceApprovals.length */}02
          </span>
        </button>
        <button onClick={() => setActiveApprovalTab("team")}
          className={`px-5 py-3 text-sm font-medium focus:outline-none ${ activeApprovalTab === "team" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"}`}>
          Team Task Approvals
          {/* Add count for team approvals if available */}
        </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6"> {/* Added p-6 for padding */}
        {activeApprovalTab === "workspace" ? (
          <WorkspaceTaskApprovalsTable
            onViewTask={handleViewTaskApproval} // This is for generic task detail view from approvals
            onViewClientRequest={handleViewClientRequestForApproval} // This is for specific "client request" (task) view
            staffMembers={staffMembers}
            onAssignTask={(approvalId, staffId) => handleAssignTaskInApproval(approvalId, staffId, 'Workspace')}
          />
        ) : (
          <TeamTaskApprovalsTable
            staffMembers={staffMembers}
            onAssignTask={(approvalId, staffId) => handleAssignTaskInApproval(approvalId, staffId, 'Team')}
            // Add onViewTask or similar if TeamTaskApprovalsTable needs to open a detail modal
          />
        )}
      </div>
    </div>
  );

  // Main Content Renderer
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard": return <div className="text-center p-10 text-xl bg-white rounded-xl shadow">Dashboard Content Area</div>;
      case "Create Member": return renderCreateMembersContent();
      case "Client Requests": return renderClientRequestsTable(); // Renamed for clarity (shows tasks)
      case "Tasks TODO": return <div className="bg-white rounded-xl shadow p-1"><TasksPage /></div>; // Added padding
      case "Work Space": return <div className="bg-white rounded-xl shadow p-1"><WorkspaceCardTeamlead /></div>;
      case "Clients Services": return <div className="bg-white rounded-xl shadow p-1"><DomainHostingTableTeamlead /></div>;
      case "Approvals": return renderApprovalsContent();
      case "Rise by Manager": return <div className="text-center p-10 text-xl bg-white rounded-xl shadow">Rise by Manager Content Area</div>;
      case "Settings": return <div className="text-center p-10 text-xl bg-white rounded-xl shadow">Settings Content Area</div>;
      default:
        return <div className="text-center pt-10 bg-white rounded-xl shadow">Select a menu item</div>;
    }
  };

  // --- Main JSX ---
  return (
    <div className="flex h-screen py-4 bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-60 h-full max-h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-[0_0_10px_rgba(64,108,140,0.2)] outline outline-1 outline-zinc-200 flex flex-col justify-between">
        <div>
          <div className="h-20 p-4 border-b border-zinc-300 flex items-center justify-center">
            <img src={logo} alt="GA Digital Solutions" className="h-14 object-contain" />
          </div>
          <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto"> {/* Added overflow-y-auto */}
            {[
              { name: "Dashboard", icon: LayoutDashboard }, { name: "Create Member", icon: UserCheck },
              { name: "Work Space", icon: Briefcase }, { name: "Tasks TODO", icon: ClipboardList },
              { name: "Approvals", icon: BadgeCheck }, { name: "Rise by Manager", icon: Users },
              { name: "Clients Services", icon: Briefcase }, { name: "Client Requests", icon: Clipboard }, // This tab title might need update if it's just tasks
              { name: "Settings", icon: Settings },
            ].map(({ name, icon: Icon }) => (
              <button key={name} onClick={() => setActiveTab(name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left ${activeTab === name ? "bg-blue-500 text-white font-semibold shadow" : "text-gray-600 hover:bg-gray-100"}`}>
                <Icon className="w-4 h-4" /> {name}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 space-y-3">
          <button className="w-full flex items-center gap-3 bg-blue-500 rounded-lg px-4 py-2 text-white font-semibold hover:bg-blue-600 transition">
            <User className="w-4 h-4" /> Arjun {/* Placeholder for dynamic user name */}
          </button>
          <button
            onClick={() => {
                localStorage.removeItem('accessToken');
                // Implement actual navigation to login page, e.g., using useNavigate from react-router-dom
                // navigate('/login');
                alert("Logged out. Please implement navigation to login page.");
            }}
            className="w-full flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-6 bg-gray-50 overflow-y-auto">
        <div className="flex justify-end items-center gap-4 mb-6">
          {[MessageCircle, Bell, User].map((Icon, i) => (
            <div key={i} className="w-12 h-12 p-3 bg-white rounded-full outline outline-1 outline-neutral-300 flex justify-center items-center cursor-pointer">
              <Icon className="w-6 h-6 text-gray-800" />
            </div>
          ))}
        </div>
        <div className="flex-1">{renderContent()}</div>
      </div>

      {/* Modals Section */}
      {showModal && renderStaffModal()} {/* Staff creation/edit modal */}
      {isRequestModalOpen && renderTaskDetailModal()} {/* Main task detail/scope update modal */}
      {showRequestModal_Legacy && renderLegacyRequestModal()} {/* Legacy modal if still needed */}

      {isAssignMembersModalOpen && (
        <AssignMembersModal
          isOpen={isAssignMembersModalOpen}
          onClose={() => setIsAssignMembersModalOpen(false)}
          onSubmit={(assignmentsData) => {
            console.log("Assignments for task:", selectedRequest?.id, "Data:", assignmentsData);
            // API call to save assignments
            setIsAssignMembersModalOpen(false);
          }}
          staffList={staffMembers.map(member => ({ id: member.id, name: member.name }))}
        />
      )}

      <FlowManager
        isOpen={flowModalOpen}
        onClose={() => {
            setFlowModalOpen(false);
            setFlowManagerInitialScreen('default');
            setSelectedRequest(null); // Clear selected task when FlowManager closes
        }}
        staffList={staffMembers.map(member => ({ id: member.id, name: member.name }))}
        initialScreen={flowManagerInitialScreen}
        clientRequest={selectedRequest} // Pass the whole task object
        // onSaveFlow={(flowData) => { /* API call to save flow data for selectedRequest.id */ }}
      />

      {/* TaskDetailModal from TasksPage (used for approvals view) */}
      {showTaskDetailModal && selectedTaskForDetail && (
        <TaskDetailModal
            isOpen={showTaskDetailModal}
            onClose={() => { setShowTaskDetailModal(false); setSelectedTaskForDetail(null); }}
            task={selectedTaskForDetail} // Ensure TaskDetailModal can handle this task structure
            // onUpdateTask={(updatedTaskData) => { /* Handle updates from this modal if needed */ }}
        />
      )}
    </div>
  );
};

export default Dashboard;