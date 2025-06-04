import React, { useState, useEffect } from "react";
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
  X, 
  Calendar, 
  Clock,    
  Plus      
} from "lucide-react";

import logo from "../assets/GA.png";
import emptyDataIcon from "../assets/empty-data-icon.png";
import WorkspaceCardTeamlead from './WorkspaceCardTeamlead';
import DomainHostingTableTeamlead from "./DomainHostingTableTeamlead";
import AssignMembersModal from "../pages/AssignMembersModal";

import FlowManager from "./FlowManager";
import NotificationsPage from './NotificationsPage';
import TasksPage, {
  TaskDetailModal,
  initialDummyTasks as tasksPageInitialTasks,
} from "../pages/TasksPage";
import WorkspaceTaskApprovalsTable from "./WorkspaceTaskApprovalsTable";
import TeamTaskApprovalsTable from "./TeamTaskApprovalsTable";

// TaskInfoModal Component  
const TaskInfoModal = ({ isOpen, onClose, clientRequest, staffMembers, onSubmitTask }) => {
  const [taskPriority, setTaskPriority] = useState('Low');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [assignedMembers, setAssignedMembers] = useState([
    { id: Date.now(), designation: '', memberName: '', timeEstimation: '', deadline: '' } 
  ]);

  useEffect(() => {
    if (isOpen) {
        setTaskPriority('Low');
        setTaskDeadline('');
        setAssignedMembers([{ id: Date.now(), designation: '', memberName: '', timeEstimation: '', deadline: '' }]);
    }
  }, [isOpen, clientRequest]);


  if (!isOpen) return null;

  const handlePriorityChange = (priority) => {
    setTaskPriority(priority);
  };

  const handleMemberChange = (id, field, value) => {
    const updatedMembers = assignedMembers.map(member =>
      member.id === id ? { ...member, [field]: value } : member
    );
    setAssignedMembers(updatedMembers);
  };

  const addMemberRow = () => {
    setAssignedMembers([...assignedMembers, { id: Date.now(), designation: '', memberName: '', timeEstimation: '', deadline: '' }]);
  };

  const removeMemberRow = (idToRemove) => {
    if (assignedMembers.length > 1) {
      const updatedMembers = assignedMembers.filter((member) => member.id !== idToRemove);
      setAssignedMembers(updatedMembers);
    } else {
      // Clear the fields of the last row
      setAssignedMembers([{ id: Date.now(), designation: '', memberName: '', timeEstimation: '', deadline: '' }]);
    }
  };
  
  const handleSubmit = () => {
    const taskData = {
      clientRequestId: clientRequest?.id,
      clientName: clientRequest?.clientName,
      domain: clientRequest?.domain,
      priority: taskPriority,
      overallDeadline: taskDeadline,
      members: assignedMembers.filter(m => m.designation && m.memberName), 
    };
    if (onSubmitTask) {
        onSubmitTask(taskData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Task Info</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Task Priority</label>
          <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-1 max-w-xs">
            {['Low', 'Medium', 'High'].map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => handlePriorityChange(priority)}
                className={`flex-1 py-1.5 px-3 text-sm rounded-md transition-colors
                  ${taskPriority === priority
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <span className={`inline-block w-2 h-2 rounded-full mr-2 
                  ${priority === 'Low' && taskPriority === 'Low' ? 'bg-white' : 
                    priority === 'Low' ? 'bg-blue-500' :
                    priority === 'Medium' && taskPriority === 'Medium' ? 'bg-white' : 
                    priority === 'Medium' ? 'bg-yellow-500' :
                    priority === 'High' && taskPriority === 'High' ? 'bg-white' : 'bg-red-500' 
                  }`}></span>
                {priority}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label htmlFor="taskOverallDeadline" className="block text-sm font-medium text-gray-700 mb-2">Task Deadline</label>
          <div className="relative">
            <input
              type="date"
              id="taskOverallDeadline"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
              className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              
            />
            <Calendar size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
                 <h3 className="text-lg font-medium text-gray-800">Add members</h3>
            </div>

          {assignedMembers.map((member) => (
            <div key={member.id} className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-3 items-end mb-4 p-3 border border-gray-200 rounded-md relative">
              <div className="md:col-span-3">
                <label htmlFor={`designation-${member.id}`} className="block text-xs font-medium text-gray-600 mb-1">Designation</label>
                <select
                  id={`designation-${member.id}`}
                  value={member.designation}
                  onChange={(e) => handleMemberChange(member.id, 'designation', e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Designer">Designer</option>
                  <option value="Developer">Developer</option>
                  <option value="Content Writer">Content Writer</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label htmlFor={`memberName-${member.id}`} className="block text-xs font-medium text-gray-600 mb-1">Member Name</label>
                <select
                  id={`memberName-${member.id}`}
                  value={member.memberName}
                  onChange={(e) => handleMemberChange(member.id, 'memberName', e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={!member.designation}
                >
                  <option value="">Select</option>
                  
                  {staffMembers
                    .filter(staff => !member.designation || staff.designation === member.designation)
                    .map(staff => <option key={staff.id} value={staff.id}>{staff.name}</option>)}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor={`timeEstimation-${member.id}`} className="block text-xs font-medium text-gray-600 mb-1">Time Estimation</label>
                <div className="relative">
                  <input
                    type="text"
                    id={`timeEstimation-${member.id}`}
                    placeholder="00:00"
                    value={member.timeEstimation}
                    onChange={(e) => handleMemberChange(member.id, 'timeEstimation', e.target.value)}
                    className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <Clock size={16} className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="md:col-span-3">
                <label htmlFor={`deadline-${member.id}`} className="block text-xs font-medium text-gray-600 mb-1">Deadline</label>
                <div className="relative">
                  <input
                    type="date"
                    id={`deadline-${member.id}`}
                    value={member.deadline}
                    onChange={(e) => handleMemberChange(member.id, 'deadline', e.target.value)}
                    className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <Calendar size={16} className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div className="md:col-span-1 flex items-end justify-end md:justify-start pb-0.5">
                {assignedMembers.length > 0 && (
                     <button 
                        type="button" 
                        onClick={() => removeMemberRow(member.id)} 
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove member"
                    >
                        <X size={18}/>
                    </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addMemberRow}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 border border-dashed border-gray-400 rounded-md px-4 py-2 hover:bg-gray-50 w-full justify-center"
          >
            <Plus size={16} className="mr-2" /> Add member
          </button>
        </div>

        <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-200 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-md border border-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};


const Dashboard = () => {
  const [clientRequests, setClientRequests] = useState([
    { id: 1, clientName: "Surya", domain: "Sampledomain.com", raisedDate: "2025-05-04", description: "This is a detailed description for Surya's first request regarding the sampledomain.com. We need to implement feature X, fix bug Y, and optimize performance for module Z. The client expects this to be completed by end of next month.", scopeStatus: "" },
    { id: 2, clientName: "Surya", domain: "Sampledomain.com", raisedDate: "2025-05-04", description: "Second request description for Surya.", scopeStatus: "" },
    // ... (rest of your clientRequests data)
    { id: 12, clientName: "Surya", domain: "Sampledomain.com", raisedDate: "2025-05-04", description: "...", scopeStatus: "" },
  ]);

  const [flowModalOpen, setFlowModalOpen] = useState(false); // Kept for potential other uses of FlowManager
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [modalContentType, setModalContentType] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [selectedTab, setSelectedTab] = useState("Staff Member");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalUserType, setModalUserType] = useState("Client");
  const [formData, setFormData] = useState({ name: "", email: "", teamLead: "", designation: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [teamLeads, setTeamLeads] = useState([]);
  const [isAssignMembersModalOpen, setIsAssignMembersModalOpen] = useState(false);

  const [clientRequestCurrentPage, setClientRequestCurrentPage] = useState(1);
  const [clientRequestItemsPerPage, setClientRequestItemsPerPage] = useState(10);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [clientSortOption, setClientSortOption] = useState("");


  const [activeApprovalTab, setActiveApprovalTab] = useState("workspace");
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState(null);

  const [flowManagerInitialScreen, setFlowManagerInitialScreen] = useState('default');
    const [isTaskInfoModalOpen, setIsTaskInfoModalOpen] = useState(false);


  useEffect(() => {
    const fetchTeamLeads = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/users/team-leads/");
        const data = await response.json();
        setTeamLeads(data);
      } catch (error) {
        console.error("Failed to fetch team leads:", error);
      }
    };
    setStaffMembers([
        { id: 'staff1', name: "Ameer", email: "ameer@example.com", teamLead: "Lead A", designation: "Developer" },
        { id: 'staff2', name: "Jai Teja", email: "jai@example.com", teamLead: "Lead B", designation: "Designer" },
        { id: 'staff3', name: "Surya", email: "surya@example.com", teamLead: "Lead A", designation: "Developer" },
    ]);

    fetchTeamLeads();
  }, []);

  const openModal = (userType, index = null) => {
    setModalUserType(userType);
    setShowModal(true);
    setEditingIndex(index);
    if (index !== null && staffMembers[index]) {
      setFormData(staffMembers[index]);
    } else {
      setFormData({ name: "", email: "", teamLead: "", designation: "" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/users/register-staff/", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to register staff member");
      }
      const data = await response.json();
      if (editingIndex !== null) {
        const updated = [...staffMembers];
        updated[editingIndex] = {...formData, id: staffMembers[editingIndex]?.id || data.user?.id || data.id || Date.now().toString() };
        setStaffMembers(updated);
      } else {
        setStaffMembers([...staffMembers, { ...formData, id: data.user?.id || data.id || Date.now().toString() }]);
      }
      setShowModal(false);
      setEditingIndex(null);
    } catch (error)      {
      console.error("Error creating staff member:", error);
      alert("Error: " + error.message);
    }
  };

  const handleDelete = (index) => {
    const updated = [...staffMembers];
    updated.splice(index, 1);
    setStaffMembers(updated);
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setModalContentType('request');
    setIsRequestModalOpen(true);
  };

  const handleViewTaskApproval = (taskId) => {
    const taskToView = tasksPageInitialTasks.find(task => task.id === taskId);
    if (taskToView) {
      setSelectedTaskForDetail(taskToView);
      setShowTaskDetailModal(true);
    } else {
      console.warn(`Task with ID ${taskId} not found in TasksPage initial tasks.`);
      setSelectedTaskForDetail({
        id: taskId,
        title: `Task (ID: ${taskId})`,
        description: "Detailed information for this task could not be fully loaded. Please check the task board for more details.",
        priority: "Medium",
        workspaceName: "Unknown Workspace",
        daysLeft: "N/A",
        dateInfo: "N/A",
        comments: 0,
        files: 0,
        assignees: [],
        tags: [],
      });
      setShowTaskDetailModal(true);
    }
  };
  const handleViewClientRequestForApproval = (clientRequestId) => {
  const requestToView = clientRequests.find(req => req.id.toString() === clientRequestId.toString());
  if (requestToView) {
    setSelectedRequest(requestToView);
    setModalContentType('request_approval_view');
    setIsRequestModalOpen(true);
  } else {
    console.warn("Client Request not found for ID (from approval):", clientRequestId);
    alert("Client request details not found.");
  }
};

const handleAssignTaskInApproval = (approvalItemId, staffId, approvalType) => {
    console.log(`${approvalType} Approval Item ID: ${approvalItemId}, Assigned to Staff ID: ${staffId}`);
};

  // --- Function to open the new TaskInfoModal ---
  const openNewTaskInfoModal = (request) => {
    setSelectedRequest(request); // Set the context for the modal
    setIsTaskInfoModalOpen(true);
  };

  // --- Function to handle submission from TaskInfoModal ---
  const handleCreateTaskFromInfoModal = (taskData) => {
    console.log("Task to be created from TaskInfoModal:", taskData);
    // Add logic here to send taskData to backend / update state
    alert(`Task creation initiated for client: ${taskData.clientName}. Data in console.`);
    setIsTaskInfoModalOpen(false); // Close modal after handling
  };


  const renderModal = () => (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{editingIndex !== null ? "Edit User" : "Staff Member"}</h2>
          <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-black text-xl font-bold">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <select name="teamLead" value={formData.teamLead} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-gray-600">
            <option value="">Select the team-lead</option>
            {teamLeads.map((lead) => ( <option key={lead.id || lead} value={lead.id || lead}>{lead.name || lead}</option> ))}
          </select>
          <select name="designation" value={formData.designation} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-gray-600">
            <option value="">Designation</option> 
            <option value="Developer">Developer</option> 
            <option value="Designer">Designer</option>
            <option value="Conntent Writer">Content Writer</option>
          </select>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full border border-gray-300 rounded-md p-2" />
          <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email id" className="w-full border border-gray-300 rounded-md p-2" />
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="border px-4 py-2 rounded text-gray-600 hover:bg-gray-100">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{editingIndex !== null ? "Update" : "Create User"}</button>
          </div>
        </form>
      </div>
    </div>
  );

   const renderCreateMembersContent = () => {
    const totalStaffPages = Math.ceil(staffMembers.length / itemsPerPage) || 1;
    const startIdx = (currentPage - 1) * itemsPerPage;
    const visibleMembers = staffMembers.slice(startIdx, startIdx + itemsPerPage);

    return (
      <div className="w-full h-full bg-white rounded-xl p-6 shadow flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-6">
            {["Client", "Staff Member"].map((tab) => (
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
                {["Client", "Staff Member"].map((type) => (
                  <div key={type} onClick={() => { openModal(type); setShowDropdown(false); }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">{type}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedTab === "Staff Member" && staffMembers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {visibleMembers.map((member, index) => (
                <div key={member.id || index + startIdx} className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white relative">
                  <div className="absolute top-2 right-2">
                    <div className="group relative">
                      <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
                      <div className="hidden group-hover:flex flex-col absolute right-0 top-6 bg-white border rounded shadow z-10 w-32">
                        <button onClick={() => openModal("Staff Member", staffMembers.findIndex(m => m.id === member.id))} className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 w-full text-left">Edit User</button>
                        <button onClick={() => handleDelete(staffMembers.findIndex(m => m.id === member.id))} className="px-3 py-1.5 text-xs text-red-600 hover:bg-gray-100 w-full text-left">Delete User</button>
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
              ))}
            </div>
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Page{" "}
                <select value={currentPage} onChange={(e) => setCurrentPage(Number(e.target.value))} className="border rounded px-2 py-1">
                  {Array.from({ length: totalStaffPages }, (_, i) => ( <option key={i} value={i + 1}>{i + 1}</option> ))}
                </select>{" "}
                of {totalStaffPages}
              </div>
              <div className="flex items-center gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="border rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50">{"<"}</button>
                {Array.from({ length: totalStaffPages }, (_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`border rounded-full w-8 h-8 flex items-center justify-center ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""}`}>{i + 1}</button>
                ))}
                <button disabled={currentPage === totalStaffPages} onClick={() => setCurrentPage(currentPage + 1)} className="border rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50">{">"}</button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-gray-500 gap-2">
            <img src={emptyDataIcon} alt="Empty Data" className="w-20 h-20 opacity-60" />
            <p>No {selectedTab.toLowerCase()}s created</p>
          </div>
        )}
      </div>
    );
  };

  const renderClientRequests = () => {
    let processedRequests = [...clientRequests];
    if (clientSearchTerm) {
      const lowerSearchTerm = clientSearchTerm.toLowerCase();
      processedRequests = processedRequests.filter(req =>
        req.clientName.toLowerCase().includes(lowerSearchTerm) ||
        req.domain.toLowerCase().includes(lowerSearchTerm) ||
        req.raisedDate.toLowerCase().includes(lowerSearchTerm) ||
        (req.scopeStatus && req.scopeStatus.toLowerCase().includes(lowerSearchTerm))
      );
    }
    if (clientSortOption === 'name_asc') processedRequests.sort((a, b) => a.clientName.localeCompare(b.clientName));
    else if (clientSortOption === 'name_desc') processedRequests.sort((a, b) => b.clientName.localeCompare(a.clientName));
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
        range.unshift(1); if (pageCount > 1 && !range.includes(pageCount)) range.push(pageCount); 
        return [...new Set(range)];
    };
    const pageNumbers = getPageNumbers();

    return (
      <>
         <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:flex-grow">
              <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
          <h2 className="text-xl font-semibold mb-4">Client Requests</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-[900px] w-full table-auto"> 
              <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Client Name</th>
                  <th className="px-4 py-3">Domain Name</th>
                  <th className="px-4 py-3">Request Raised Date</th>
                  <th className="px-4 py-3">Client Request</th>
                  <th className="px-4 py-3">Scope of service status</th>
                  <th className="px-4 py-3">Flow Creation</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedClientRequests.length > 0 ? paginatedClientRequests.map((req) => (
                    <tr key={req.id} className="text-sm text-gray-700 hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">{req.clientName}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{req.domain}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{req.raisedDate}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button onClick={() => handleViewRequest(req)} className="flex items-center text-blue-600 hover:text-blue-700">
                          <Eye className="w-4 h-4 mr-1" /> View Request
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {req.scopeStatus ? (
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            req.scopeStatus.toLowerCase() === "with in scope" ? "bg-green-100 text-green-800" :
                            req.scopeStatus.toLowerCase() === "out of scope" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800" }`}>
                            {req.scopeStatus}
                          </span>
                        ) : ( <span className="text-gray-400 italic">Pending</span> )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button onClick={() => openNewTaskInfoModal(req)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"> Create Flow </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button className="text-blue-500 underline hover:text-blue-700 text-xs"> Rise to manager </button>
                      </td>
                    </tr>
                  )) : ( <tr> <td colSpan="7" className="text-center py-10 text-gray-500"> No client requests found. </td> </tr> )}
              </tbody>
            </table>
            {isRequestModalOpen && selectedRequest && (modalContentType === 'request' || modalContentType === 'request_approval_view') && (
              <div className="fixed inset-0 flex items-center justify-center z-[80] bg-black bg-opacity-40 p-4"> {/* Increased z-index */}
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">
                        {modalContentType === 'request_approval_view' ? "Client Request (Approval View)" : "Client Request Details"}
                    </h3>
                    <button onClick={() => setIsRequestModalOpen(false)} className="text-gray-500 hover:text-black font-bold text-xl">×</button>
                  </div>
                  <div className="space-y-1 mb-4">
                    <p><strong>Client Name:</strong> {selectedRequest.clientName}</p>
                    <p><strong>Domain Name:</strong> {selectedRequest.domain}</p>
                    <p><strong>Request Raised Date:</strong> {selectedRequest.raisedDate}</p>
                  </div>
                  <div className="mb-4">
                    <p className="font-semibold mb-1">Description:</p>
                    <div className="text-gray-700 whitespace-pre-wrap text-sm bg-gray-50 p-3 border rounded max-h-40 overflow-y-auto">
                        {selectedRequest.description}
                    </div>
                  </div>
                   {modalContentType === 'request' && (
                     <div>
                        <h4 className="text-md font-semibold mb-3">Scope of Service Decision</h4>
                        <div className="flex items-center space-x-4">
                        <button onClick={() => { const updatedRequests = clientRequests.map((r) => r.id === selectedRequest.id ? { ...r, scopeStatus: "With in Scope" } : r ); setClientRequests(updatedRequests); setIsRequestModalOpen(false); }}
                            className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 text-sm" > With in Scope </button>
                        <button onClick={() => { const updatedRequests = clientRequests.map((r) => r.id === selectedRequest.id ? { ...r, scopeStatus: "Out of scope" } : r ); setClientRequests(updatedRequests); setIsRequestModalOpen(false); }}
                            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 text-sm" > Out of scope </button>
                        </div>
                    </div>
                   )}
                   {modalContentType === 'request_approval_view' && (
                     <div className="mt-4 flex justify-end">
                        <button onClick={() => setIsRequestModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm">
                            Close
                        </button>
                     </div>
                   )}
                </div>
              </div>
            )}
          </div>
          {processedRequests.length > 0 && (
            <div className="flex items-center justify-between mt-6 px-1 text-sm text-gray-600">
              <div>
                Page{" "} <select value={clientRequestCurrentPage} onChange={(e) => setClientRequestCurrentPage(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  {Array.from({ length: totalClientRequestPages }, (_, i) => ( <option key={i + 1} value={i + 1}>{i + 1}</option> ))} </select> {" "}of {totalClientRequestPages}
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={() => setClientRequestCurrentPage(prev => Math.max(1, prev - 1))} disabled={clientRequestCurrentPage === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"> Previous </button>
                {pageNumbers.map((page, index) => (
                  <React.Fragment key={index}>
                    {typeof page === 'number' ? (
                      <button onClick={() => setClientRequestCurrentPage(page)}
                        className={`px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 ${clientRequestCurrentPage === page ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : ''}`}> {page} </button>
                    ) : ( <span className="px-3 py-1.5"> {page} </span> )}
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
  const renderApprovalsContent = () => (
  <div className="w-full h-full bg-white rounded-xl shadow flex flex-col">
    <div className="px-6 pt-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Approvals</h1>
      <div className="flex items-center border-b border-gray-200">
        <button onClick={() => setActiveApprovalTab("workspace")}
         className={`px-5 py-3 text-sm font-medium focus:outline-none ${ activeApprovalTab === "workspace" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"}`}>
         Workspace Task Approvals
         <span className="ml-2 inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
           02 {/* This count should be dynamic */}
         </span>
       </button>
       <button onClick={() => setActiveApprovalTab("team")}
         className={`px-5 py-3 text-sm font-medium focus:outline-none ${ activeApprovalTab === "team" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"}`}>
         Team Task Approvals
       </button>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto">
      {activeApprovalTab === "workspace" ? (
        <WorkspaceTaskApprovalsTable
          onViewTask={handleViewTaskApproval}
          onViewClientRequest={handleViewClientRequestForApproval} // This prop might not be needed if slide-over handles it
          staffMembers={staffMembers}
          onAssignTask={(approvalId, staffId) => handleAssignTaskInApproval(approvalId, staffId, 'Workspace')}
        />
      ) : (
        <TeamTaskApprovalsTable
          staffMembers={staffMembers}
          onAssignTask={(approvalId, staffId) => handleAssignTaskInApproval(approvalId, staffId, 'Team')}
        />
      )}
    </div>
  </div>
);

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard": return <div className="text-center p-10 text-xl">Dashboard Content Area</div>;
      case "Create Member": return renderCreateMembersContent();
      case "Client Requests": return renderClientRequests();
      case "Tasks TODO": return <TasksPage />;
      case "Work Space": return <WorkspaceCardTeamlead />;
      case "Clients Services": return <DomainHostingTableTeamlead />;
      case "Approvals": return renderApprovalsContent();
      case "Notifications": return <NotificationsPage />;
      case "Rise by Manager": return <div className="text-center p-10 text-xl">Rise by Manager Content Area</div>;
      case "Settings": return <div className="text-center p-10 text-xl">Settings Content Area</div>;
      default:
        return <div className="text-center pt-10">Select a menu item</div>;
    }
  };

  return (
    <div className="flex h-screen py-4 bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-60 h-full bg-white rounded-2xl shadow-[0_0_10px_rgba(64,108,140,0.2)] outline outline-1 outline-zinc-200 flex flex-col justify-between">
        <div>
          <div className="h-20 p-4 border-b border-zinc-300 flex items-center justify-center">
            <img src={logo} alt="GA Digital Solutions" className="h-14 object-contain" />
          </div>
          <div className="flex-1 px-4 py-4 space-y-2 overflow-auto">
            {[
              { name: "Dashboard", icon: LayoutDashboard }, { name: "Create Member", icon: UserCheck },
              { name: "Work Space", icon: Briefcase }, { name: "Tasks TODO", icon: ClipboardList },
              { name: "Approvals", icon: BadgeCheck }, { name: "Rise by Manager", icon: Users },
              { name: "Clients Services", icon: Briefcase }, { name: "Client Requests", icon: Clipboard },
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
            <User className="w-4 h-4" /> Arjun
          </button>
          <button className="w-full flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-6 bg-gray-50 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {activeTab === "Notifications" ? "Notifications" : 
             activeTab === "Dashboard" ? "welcome, Team lead" : 
             activeTab}
          </h1>
          <div className="flex items-center gap-4">
            <div key="message-icon" className="relative w-12 h-12 p-3 bg-white rounded-full outline outline-1 outline-neutral-300 flex justify-center items-center cursor-pointer hover:bg-gray-100">
                <MessageCircle className="w-6 h-6 text-gray-800" />
                <span className="absolute top-1 right-1 flex h-5 w-5">
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 text-white text-xs items-center justify-center">02</span>
                </span>
            </div>
            <div 
              key="bell-icon" 
              className={`relative w-12 h-12 p-3 rounded-full outline outline-1 flex justify-center items-center cursor-pointer transition-colors duration-150
                          ${activeTab === "Notifications" 
                            ? "bg-blue-100 text-blue-600 border-blue-300 outline-blue-300" 
                            : "bg-white text-gray-800 border-neutral-300 outline-neutral-300 hover:bg-gray-100"
                          }`}
              onClick={() => setActiveTab("Notifications")} 
            >
                <Bell 
                    className={`w-6 h-6 
                                ${activeTab === "Notifications" ? "text-blue-600" : "text-gray-800"}`} 
                />
                <span className={`absolute top-1 right-1 flex h-5 w-5`}>
                    <span className={`relative inline-flex rounded-full h-4 w-4 text-xs items-center justify-center
                                    ${activeTab === "Notifications" ? "bg-blue-600 text-white" : "bg-blue-600 text-white"}`}>
                        02
                    </span>
                </span>
            </div>
            <div key="user-profile-icon" className="relative w-12 h-12 p-3 bg-white rounded-full outline outline-1 outline-neutral-300 flex justify-center items-center cursor-pointer hover:bg-gray-100">
                <User className="w-6 h-6 text-gray-800" />
            </div>
          </div>
        </div>
        
        <div className="flex-1">{renderContent()}</div>
      </div>
      {showModal && renderModal()}
      
      {isAssignMembersModalOpen && (
        <AssignMembersModal
          isOpen={isAssignMembersModalOpen}
          onClose={() => setIsAssignMembersModalOpen(false)}
          onSubmit={(assignmentsData) => { console.log("Assignments:", selectedRequest?.id, assignmentsData); setIsAssignMembersModalOpen(false); }}
          staffList={staffMembers.map(member => ({ id: member.id || member.email, name: member.name }))} />
      )}

      {isTaskInfoModalOpen && selectedRequest && (
        <TaskInfoModal
          isOpen={isTaskInfoModalOpen}
          onClose={() => setIsTaskInfoModalOpen(false)}
          clientRequest={selectedRequest}
          staffMembers={staffMembers}
          onSubmitTask={handleCreateTaskFromInfoModal}
        />
      )}

      {showTaskDetailModal && selectedTaskForDetail && (
        <TaskDetailModal
            isOpen={showTaskDetailModal}
            onClose={() => { setShowTaskDetailModal(false); setSelectedTaskForDetail(null); }}
            task={selectedTaskForDetail}
        />
      )}
    </div>
  );
};
export default Dashboard;