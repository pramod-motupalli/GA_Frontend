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
  MoreVertical,
} from "lucide-react";
import logo from "../assets/GA.png";
import emptyDataIcon from "../assets/empty-data-icon.png";
import WorkspaceCardTeamlead from './WorkspaceCardTeamlead'
import DomainHostingTableTeamlead from "./DomainHostingTableTeamlead";
import AssignMembersModal from "../pages/AssignMembersModal"; 
import FlowManager from "./FlowManager"; 

import TasksPage from "../pages/TasksPage";


const Dashboard = () => {
    
    const [clientRequests, setClientRequests] = useState([
    { id: 1, clientName: "Surya", domain: "Sampledomain.com", raisedDate: "2025-05-04", description: "...", scopeStatus: "" },
    { id: 2, clientName: "Surya", domain: "Sampledomain.com", raisedDate: "2025-05-04", description: "...", scopeStatus: "" },
    { id: 3, clientName: "Surya", domain: "Sampledomain.com", raisedDate: "2025-05-04", description: "...", scopeStatus: "" },
    { id: 4, clientName: "Surya", domain: "Sampledomain.com", raisedDate: "2025-05-04", description: "...", scopeStatus: "" },
    { id: 5, clientName: "Surya", domain: "Sampledomain.com", raisedDate: "2025-05-04", description: "...", scopeStatus: "" },
    { id: 6, clientName: "Surya", domain: "Sampledomain.com", raisedDate: "2025-05-04", description: "...", scopeStatus: "" },
    { id: 7, clientName: "Surya", domain: "Sampledomain.com", raisedDate: "2025-05-04", description: "...", scopeStatus: "" },
    { id: 8, clientName: "Surya", domain: "Sampledomain.com", raisedDate: "2025-05-04", description: "...", scopeStatus: "" },
    { id: 9, clientName: "Surya", domain: "Sampledomain.com", raisedDate: "2025-05-04", description: "...", scopeStatus: "" },
    { id: 10, clientName: "Surya", domain: "Sampledomain.com", raisedDate: "2025-05-04", description: "...", scopeStatus: "" },
    { id: 11, clientName: "Surya", domain: "Sampledomain.com", raisedDate: "2025-05-04", description: "...", scopeStatus: "" },
    { id: 12, clientName: "Surya", domain: "Sampledomain.com", raisedDate: "2025-05-04", description: "...", scopeStatus: "" },
    // ... other requests
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [flowModalOpen, setFlowModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [modalContentType, setModalContentType] = useState(null); 
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  const [activeTab, setActiveTab] = useState("Client Requests"); 
  const [selectedTab, setSelectedTab] = useState("Staff Member");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [modalUserType, setModalUserType] = useState("Client");
  const [formData, setFormData] = useState({ name: "", email: "", teamLead: "", designation: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]); // KEEP THIS
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const [teamLeads, setTeamLeads] = useState([]); 
  const [isAssignMembersModalOpen, setIsAssignMembersModalOpen] = useState(false); 

  const totalPages = Math.ceil(staffMembers.length / itemsPerPage);
  const [clientRequestCurrentPage, setClientRequestCurrentPage] = useState(1);
  const [clientRequestItemsPerPage, setClientRequestItemsPerPage] = useState(10); 
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [clientSortOption, setClientSortOption] = useState("");
  
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

    
    fetchTeamLeads();
  }, []);

  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        const token = localStorage.getItem('token'); // Adjust if using a different auth method
        const response = await axios.get('http://localhost:8000/api/users/get-staff-members/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        // Optional: Add 'teamLead' if needed by mapping
        const formattedData = response.data.map((staff) => ({
          // id: staff.id,
          name: staff.name,
          email: staff.email,
          designation: staff.designation,
          // teamLead: 'N/A', // Add team lead logic if needed
        }));

        setStaffMembers(formattedData);
      } catch (error) {
        console.error('Failed to fetch staff members:', error);
      }
    };

    fetchStaffMembers();
  }, []);

  const openModal = (userType, index = null) => {
    setModalUserType(userType);
    setShowModal(true);
    setEditingIndex(index);
    if (index !== null) {
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
    console.log(formData)

    try {
      const response = await fetch("http://localhost:8000/api/users/register-staff/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to register staff member");
      }

      const data = await response.json();
      console.log("User created:", data);

      if (editingIndex !== null) {
        const updated = [...staffMembers];
        updated[editingIndex] = {...formData, id: staffMembers[editingIndex].id }; // Preserve ID on edit
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
    // Add API call for deletion here if needed
    const updated = [...staffMembers];
    updated.splice(index, 1);
    setStaffMembers(updated);
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setModalContentType('request');
    setIsRequestModalOpen(true); 
  };

 const handleViewScope = (request) => {
    setSelectedRequest(request);
    setModalContentType('scope');
    setIsRequestModalOpen(true); 
  };

  const renderModal = () => (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{editingIndex !== null ? "Edit User" : "Staff Member"}</h2>
          <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-black text-xl font-bold">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            name="teamLead"
            value={formData.teamLead}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-gray-600"
          >
            <option value="">Select the team-lead</option>
            {teamLeads.map((lead) => (
              <option key={lead.id || lead} value={lead.id || lead}>{lead.name || lead}</option> // Adapt if teamLeads is array of objects
            ))}
          </select>
          <select name="designation" value={formData.designation} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-gray-600">
            <option value="">Designation</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            
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
    const startIdx = (currentPage - 1) * itemsPerPage;
    const visibleMembers = staffMembers.slice(startIdx, startIdx + itemsPerPage);

    return (
      <div className="w-full h-full bg-white rounded-xl p-6 shadow flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-6">
            {["Client", "Staff Member"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`text-md font-medium pb-2 ${selectedTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
              >
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
                      <MoreVertical className="w-5 h-5 text-gray-500 cursor-pointer" />
                      <div className="hidden group-hover:flex flex-col absolute right-0 top-6 bg-white border rounded shadow z-10">
                        <button onClick={() => openModal("Staff Member", staffMembers.findIndex(m => m.id === member.id))} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Edit User</button>
                        <button onClick={() => handleDelete(staffMembers.findIndex(m => m.id === member.id))} className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">Delete User</button>
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
                  {Array.from({ length: totalPages }, (_, i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>{" "}
                of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="border rounded-full w-8 h-8 flex items-center justify-center"></button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`border rounded-full w-8 h-8 flex items-center justify-center ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""}`}>{i + 1}</button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="border rounded-full w-8 h-8 flex items-center justify-center"></button>
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
    // ... (Data Processing and Pagination Calculation for Client Requests - UNCHANGED) ...
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
    if (clientSortOption === 'name_asc') {
      processedRequests.sort((a, b) => a.clientName.localeCompare(b.clientName));
    } else if (clientSortOption === 'name_desc') {
      processedRequests.sort((a, b) => b.clientName.localeCompare(a.clientName));
    } else if (clientSortOption === 'date_new') {
      processedRequests.sort((a, b) => new Date(b.raisedDate) - new Date(a.raisedDate));
    } else if (clientSortOption === 'date_old') {
      processedRequests.sort((a, b) => new Date(a.raisedDate) - new Date(b.raisedDate));
    }
    const totalClientRequestPages = Math.ceil(processedRequests.length / clientRequestItemsPerPage) || 1;
    const clientRequestStartIdx = (clientRequestCurrentPage - 1) * clientRequestItemsPerPage;
    const paginatedClientRequests = processedRequests.slice(clientRequestStartIdx, clientRequestStartIdx + clientRequestItemsPerPage);
    const getPageNumbers = () => {
        const pageCount = totalClientRequestPages;
        const currentPage = clientRequestCurrentPage;
        const delta = 1; 
        const range = [];
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(pageCount - 1, currentPage + delta); i++) {
            range.push(i);
        }
        if (currentPage - delta > 2) {
            range.unshift("...");
        }
        if (currentPage + delta < pageCount - 1) {
            range.push("...");
        }
        range.unshift(1);
        if (pageCount > 1) {
            range.push(pageCount);
        }
        return [...new Set(range)];
    };
    const pageNumbers = getPageNumbers();

    return (
      <>
        {/* --- Header Section for Client Requests --- (UNCHANGED) */}
         <div className="mb-6"> 
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:flex-grow"> 
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={clientSearchTerm}
                onChange={(e) => {
                  setClientSearchTerm(e.target.value);
                  setClientRequestCurrentPage(1); 
                }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 text-gray-600 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-400 text-sm"
                  value={clientSortOption}
                  onChange={(e) => {
                    setClientSortOption(e.target.value);
                    setClientRequestCurrentPage(1); 
                  }}
                >
                  <option value="">Sort by</option>
                  <option value="name_asc">Client Name (A-Z)</option>
                  <option value="name_desc">Client Name (Z-A)</option>
                  <option value="date_new">Date (Newest)</option>
                  <option value="date_old">Date (Oldest)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none text-sm">
                Filters
                <Filter className="w-4 h-4" />
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
            <table className="min-w-[1200px] w-full table-auto"> 
              <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"> 
                <tr>
                  <th className="px-4 py-3">Client Name</th>
                  <th className="px-4 py-3">Domain Name</th>
                  <th className="px-4 py-3">Request Raised Date</th>
                  <th className="px-4 py-3">Client Request</th>
                  <th className="px-4 py-3">Scope of service</th>
                  <th className="px-4 py-3">Scope of service status</th>
                  <th className="px-4 py-3">Task Assigned to</th>
                  <th className="px-4 py-3">Flow Creation</th>
                  <th className="px-4 py-3">Workhours</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedClientRequests.length > 0 ? (
                  paginatedClientRequests.map((req) => (
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
                        <button onClick={() => handleViewScope(req)} className="flex items-center text-blue-600 hover:text-blue-700">
                          <Eye className="w-4 h-4 mr-1" /> View Scope
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {req.scopeStatus ? (
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            req.scopeStatus.toLowerCase() === "with in scope" ? "bg-green-100 text-green-800" :
                            req.scopeStatus.toLowerCase() === "out of scope" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800" 
                          }`}>
                            {req.scopeStatus}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <select className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
                          <option>Select</option>
                          {staffMembers.map(staff => (
                            <option key={staff.id} value={staff.id}>{staff.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedRequest(req); 
                            setFlowModalOpen(true);
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                        >
                          Create Flow
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-blue-600 text-xs">Working hours</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          
                          <button className="text-blue-500 underline hover:text-blue-700 text-xs">
                            Rise to manager
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-10 text-gray-500">
                      No client requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {isRequestModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                  <div className=" flex justify-between items-center mb-4">
                    <h3 className=" text-xl font-semibold">{modalContentType === "request" ? "Client Request" : "Scope Decision"}</h3>
                    <button onClick={() => setIsRequestModalOpen(false)} className="text-gray-500 hover:text-black font-bold text-xl">×</button>
                  </div>
                  {modalContentType === "request" ? (
                    <p className="text-gray-700">{selectedRequest?.description}</p>
                  ) : (
                    <div className="flex justify-around items-center pt-2">
                      <button
                        onClick={() => {
                          const updatedRequests = clientRequests.map((r) =>
                            r.id === selectedRequest.id ? { ...r, scopeStatus: "With in Scope" } : r
                          );
                          setClientRequests(updatedRequests);
                          setIsRequestModalOpen(false);
                        }}
                        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
                      >
                        With in Scope
                      </button>
                      <button
                        onClick={() => {
                          const updatedRequests = clientRequests.map((r) =>
                            r.id === selectedRequest.id ? { ...r, scopeStatus: "Out of scope" } : r
                          );
                          setClientRequests(updatedRequests);
                          setIsRequestModalOpen(false);
                        }}
                        className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
                      >
                        Out of scope
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* --- Pagination Section for Client Requests --- (UNCHANGED) */}
          {processedRequests.length > 0 && (
            <div className="flex items-center justify-between mt-6 px-1 text-sm text-gray-600">
              <div>
                Page{" "}
                <select
                  value={clientRequestCurrentPage}
                  onChange={(e) => setClientRequestCurrentPage(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {Array.from({ length: totalClientRequestPages }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                {" "}of {totalClientRequestPages}
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setClientRequestCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={clientRequestCurrentPage === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  
                </button>
                {pageNumbers.map((page, index) => (
                  <React.Fragment key={index}> 
                    {typeof page === 'number' ? (
                      <button
                        onClick={() => setClientRequestCurrentPage(page)}
                        className={`px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 ${clientRequestCurrentPage === page ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : ''}`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span className="px-3 py-1.5">
                        {page}
                      </span>
                    )}
                  </React.Fragment>
                ))}
                <button
                  onClick={() => setClientRequestCurrentPage(prev => Math.min(totalClientRequestPages, prev + 1))}
                  disabled={clientRequestCurrentPage === totalClientRequestPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  
                </button>
              </div>
            </div>
          )}
        </div>
      </> 
    );
  };

const handleScopeDecision = (status) => {
  if (!selectedRequest) return;
  const updatedRequests = clientRequests.map((req) =>
    req.id === selectedRequest.id ? { ...req, scopeStatus: status } : req
  );
  setClientRequests(updatedRequests);
  setShowRequestModal(false); // Close the 'Request Description' modal
};

  const renderContent = () => {
    switch (activeTab) {
      case "Create Member":
        return renderCreateMembersContent();
      case "Client Requests":
        return renderClientRequests();
      case "Tasks TODO":
        return <TasksPage />;
      case "Work Space":
        return <WorkspaceCardTeamlead />;
      case "Clients Services":
        return <DomainHostingTableTeamlead />;
      default:
        return <div className="text-center pt-10">Select a menu item</div>;
    }
  };

  // This modal is for viewing request description and making scope decision (different from isRequestModalOpen above)
  // This specific renderRequestModal was not being used actively for the view/scope from table.
  // The logic for that is now inside renderClientRequests's modal.
  // If you need a separate modal triggered by 'showRequestModal', you can use this.
 const renderRequestModal = () => {
    if (!showRequestModal || !selectedRequest) return null; // Ensure it only renders when needed
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-[400px] max-w-full shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Request Description</h2>
            <button onClick={() => setShowRequestModal(false)} className="text-xl font-bold text-gray-600">×</button>
          </div>
          <p className="text-gray-700 text-sm mb-4">{selectedRequest?.description}</p>
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">View Scope</h3>
            <div className="flex gap-4">
              <button
                onClick={() => handleScopeDecision("Within Scope")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Within Scope
              </button>
              <button
                onClick={() => handleScopeDecision("Out of Scope")}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
              Out of Scope
            </button>
          </div>
          </div>
        </div>
      </div>
    );
 };

  return (
    <div className="flex h-screen py-4 bg-white overflow-hidden">
      {/* Sidebar - UNCHANGED */}
      <div className="w-60 h-11/12 bg-white rounded-2xl shadow-[0_0_10px_rgba(64,108,140,0.2)] outline outline-1 outline-zinc-200 flex flex-col justify-between">
        <div>
          <div className="h-20 p-4 border-b border-zinc-300 flex items-center justify-center">
            <img src={logo} alt="GA Digital Solutions" className="h-14 object-contain" />
          </div>
          <div className="flex-1 px-4 py-4 space-y-2 overflow-auto">
            {[
              { name: "Dashboard", icon: LayoutDashboard },
              { name: "Create Member", icon: UserCheck },
              { name: "Work Space", icon: Briefcase },
              { name: "Tasks TODO", icon: ClipboardList },
              { name: "Approvals", icon: BadgeCheck },
              { name: "Rise by Manager", icon: Users },
              { name: "Clients Services", icon: Briefcase },
              { name: "Client Requests", icon: Clipboard },
              { name: "Settings", icon: Settings },
            ].map(({ name, icon: Icon }) => (
              <button key={name} onClick={() => setActiveTab(name)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left ${activeTab === name ? "bg-blue-500 text-white font-semibold shadow" : "text-gray-600 hover:bg-gray-100"}`}>
                <Icon className="w-4 h-4" />
                {name}
              </button>
            ))}
          </div>
          {/* FlowManager call updated with staffList */}
          <FlowManager 
            isOpen={flowModalOpen} 
            onClose={() => setFlowModalOpen(false)} 
            staffList={staffMembers.map(member => ({ id: member.id || member.email, name: member.name }))}
          />
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

      {/* Main Content Area - UNCHANGED */}
      <div className="flex-1 flex flex-col p-6 bg-gray-50 overflow-y-auto">
        <div className="flex justify-end items-center gap-4 mb-6">
          {[MessageCircle, Bell, User].map((Icon, i) => (
            <div key={i} className="w-12 h-12 p-3 bg-white rounded-full outline outline-1 outline-neutral-300 flex justify-center items-center">
              <Icon className="w-6 h-6 text-gray-800" />
            </div>
          ))}
        </div>
        <div className="flex-1">{renderContent()}</div>
      </div>

      {/* Modal for Create/Edit Staff Member */}
      {showModal && renderModal()} 
      
      {/* AssignMembersModal (if still used for other purposes) */}
      {isAssignMembersModalOpen && (
        <AssignMembersModal
          isOpen={isAssignMembersModalOpen}
          onClose={() => setIsAssignMembersModalOpen(false)}
          onSubmit={(assignmentsData) => {
            console.log("Task Assignments (from original AssignMembersModal):", selectedRequest?.id, assignmentsData);
            // This modal's functionality might need review if its trigger was removed.
            setIsAssignMembersModalOpen(false);
          }}
          staffList={staffMembers.map(member => ({ id: member.id || member.email, name: member.name }))}
        />
      )}
    </div>
  );

};
export default Dashboard;

