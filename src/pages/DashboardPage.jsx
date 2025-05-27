import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  UserCheck,
  Briefcase,
  ClipboardList,
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

import AssignMembersModal from "./AssignMembersModal";

// Place at the top of Dashboard.jsx (after imports)
function FlowManager({ isOpen, onClose }) {
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [flowSteps, setFlowSteps] = useState([]);
  const [hours, setHours] = useState([]);

  const handleAddFlow = () => {
    setFlowSteps([...flowSteps, ""]);
  };

  const handleFlowChange = (index, value) => {
    const updatedSteps = [...flowSteps];
    updatedSteps[index] = value;
    setFlowSteps(updatedSteps);
  };

  const handleCreateFlow = () => {
    const initialHours = flowSteps.map(() => 0);
    setHours(initialHours);
    setShowHoursModal(true);
  };

  const handleHourChange = (index, value) => {
    const updatedHours = [...hours];
    updatedHours[index] = value;
    setHours(updatedHours);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-white w-[400px] p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Work Flow</h2>
              <button onClick={onClose}>✕</button>
            </div>
            <div>
              {flowSteps.map((step, idx) => (
                <input
                  key={idx}
                  className="w-full border rounded px-3 py-2 mb-2"
                  placeholder={`Step ${idx + 1}`}
                  value={step}
                  onChange={(e) => handleFlowChange(idx, e.target.value)}
                />
              ))}
              <button
                onClick={handleAddFlow}
                className="text-blue-600 underline mb-4"
              >
                + add to flow
              </button>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={onClose} className="border px-4 py-1 rounded">
                Cancel
              </button>
              <button
                onClick={handleCreateFlow}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                Create Flow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scope of Hours Modal */}
      {showHoursModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Scope of Hours</h2>
              <button onClick={() => setShowHoursModal(false)}>✕</button>
            </div>
            <table className="w-full mb-4">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-1">Category</th>
                  <th className="py-1">Hours</th>
                </tr>
              </thead>
              <tbody>
                {flowSteps.map((step, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{step}</td>
                    <td>
                      <input
                        type="number"
                        value={hours[idx]}
                        onChange={(e) => handleHourChange(idx, e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end">
              <button
                onClick={() => setShowHoursModal(false)}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


const Dashboard = () => {
  const [clientRequests, setClientRequests] = useState([
  {
    id: 1,
    clientName: "Surya",
    domain: "abc.com",
    raisedDate: "2025-05-20",
    description: "I need to build a block that allows users to submit feedback via a form and store it in the database.",
    scopeStatus: "",
  },
  {
    id: 2,
    clientName: "Surya",
    domain: "abc.com",
    raisedDate: "2025-05-20",
    description: "I need to build a block that allows users to submit feedback via a form and store it in the database.",
    scopeStatus: "",
  },
  {
    id: 3,
    clientName: "Surya",
    domain: "abc.com",
    raisedDate: "2025-05-20",
    description: "I need to build a block that allows users to submit feedback via a form and store it in the database.",
    scopeStatus: "",
  },
  {
    id: 4,
    clientName: "Surya",
    domain: "abc.com",
    raisedDate: "2025-05-20",
    description: "I need to build a block that allows users to submit feedback via a form and store it in the database.",
    scopeStatus: "",
  },
  {
    id: 5,
    clientName: "Surya",
    domain: "abc.com",
    raisedDate: "2025-05-20",
    description: "I need to build a block that allows users to submit feedback via a form and store it in the database.",
    scopeStatus: "",
  },
  {
    id: 6,
    clientName: "Surya",
    domain: "abc.com",
    raisedDate: "2025-05-20",
    description: "I need to build a block that allows users to submit feedback via a form and store it in the database.",
    scopeStatus: "",
  },
  {
    id: 7,
    clientName: "Surya",
    domain: "abc.com",
    raisedDate: "2025-05-20",
    description: "I need to build a block that allows users to submit feedback via a form and store it in the database.",
    scopeStatus: "",
  },
  {
    id: 8,
    clientName: "Surya",
    domain: "abc.com",
    raisedDate: "2025-05-20",
    description: "I need to build a block that allows users to submit feedback via a form and store it in the database.",
    scopeStatus: "",
  },
  {
    id: 9,
    clientName: "Surya",
    domain: "abc.com",
    raisedDate: "2025-05-20",
    description: "I need to build a block that allows users to submit feedback via a form and store it in the database.",
    scopeStatus: "",
  },
]);

  const [searchTerm, setSearchTerm] = useState("");
  const [flowModalOpen, setFlowModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [modalContentType, setModalContentType] = useState(null); // 'request' or 'scope'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Create Member");
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

  const totalPages = Math.ceil(staffMembers.length / itemsPerPage);
  

  useEffect(() => {
    const fetchTeamLeads = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/users/team-leads/");
        const data = await response.json();
        console.log(data)
        setTeamLeads(data);
      } catch (error) {
        console.error("Failed to fetch team leads:", error);
      }
    };

    fetchTeamLeads();
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
      throw new Error("Failed to register staff member");
    }

    const data = await response.json();
    console.log("User created:", data);

    if (editingIndex !== null) {
      // Update existing
      const updated = [...staffMembers];
      updated[editingIndex] = formData;
      setStaffMembers(updated);
    } else {
      // Add new
      setStaffMembers([...staffMembers, formData]);
    }

    setShowModal(false);
    setEditingIndex(null);
  } catch (error) {
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
 const handleViewScope = (request) => {
  setSelectedRequest(request);
  setModalContentType('scope');
  setIsRequestModalOpen(true);
};

  const renderModal = () => (
    <div className="fixed inset-0 flex justify-center items-center z-50 ">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 max-w-full">
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
              <option key={lead} value={lead}>{lead}</option>
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
                <div key={index + startIdx} className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white relative">
                  <div className="absolute top-2 right-2">
                    <div className="group relative">
                      <MoreVertical className="w-5 h-5 text-gray-500 cursor-pointer" />
                      <div className="hidden group-hover:flex flex-col absolute right-0 top-6 bg-white border rounded shadow z-10">
                        <button onClick={() => openModal("Staff Member", index + startIdx)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit User</button>
                        <button onClick={() => handleDelete(index + startIdx)} className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete User</button>
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
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="border rounded-full w-8 h-8 flex items-center justify-center">&lt;</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`border rounded-full w-8 h-8 flex items-center justify-center ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""}`}>{i + 1}</button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="border rounded-full w-8 h-8 flex items-center justify-center">&gt;</button>
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
 
  const renderClientRequests = () => (
    <>
    <div className="w-full bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Client Requests</h2>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-[1200px] w-full table-auto border-collapse">
        <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
          <tr className="border-b">
            <th className="px-4 py-3 whitespace-nowrap">Client Name</th>
            <th className="px-4 py-3 whitespace-nowrap">Domain Name</th>
            <th className="px-4 py-3 whitespace-nowrap">Request Raised Date</th>
            <th className="px-4 py-3 whitespace-nowrap">client requests</th>    
            <th className="px-4 py-3 whitespace-nowrap">Scope of service</th>         
            <th className="px-4 py-3 whitespace-nowrap">scope of service status</th>
            <th className="px-4 py-3 whitespace-nowrap">Task Assigned to</th>
            <th className="px-4 py-3 whitespace-nowrap">Flow Creation</th>
            <th className="px-4 py-3 whitespace-nowrap">Workhours</th>
            <th className="px-4 py-3 whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {clientRequests.map((req) => (
            <tr key={req.id} className=" text-sm text-gray-700">
              <td className="px-4 py-2">{req.clientName}</td>
              <td className="px-4 py-2">{req.domain}</td>
              <td className="px-4 py-2">{req.raisedDate}</td>
              <td className="px-4 py-2 font-semibold text-blue-600 cursor-pointer">           
                    <button onClick={() => handleViewRequest(req)}>View Request</button>           
              </td>
              <td className="px-4 py-2 font-semibold text-blue-600 cursor-pointer">
                <button onClick={() => handleViewScope(req)}>View Scope</button>
              </td>
              <td className="px-4 py-2">
                {req.scopeStatus ? (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${req.scopeStatus === "Within Scope" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {req.scopeStatus}
                  </span>
                ):(
                  <span className="text-gray-400 italic">Pending</span>
                )}
              </td>
              <td className="px-4 py-2">
                <select className="border rounded px-2 py-1">
                  <option>Select</option>
                  <option>Staff 1</option>
                  <option>Staff 2</option>
                </select>
              </td>
              
              <td className="px-4 py-2">
                
                <button 
                onClick={() => setFlowModalOpen(true)}
                className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600">
                  Create Flow
                </button>
              </td>
              <td className="px-4 py-2 text-blue-600">Working hours</td>
              <td className="px-4 py-2 text-blue-600">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-blue-600 hover:underline mr-2"
                >
                  Create Work
                </button>

                <button className="text-blue-500 underline hover:text-blue-700">
                  Rise to manager
                </button>
                </td>
                
            </tr>
            
          ))}
        </tbody> 
      </table>
          {isRequestModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-lg w-full">
        <div className=" flex justify-between items-center mb-4">
          <h3 className=" text-xl font-semibold mb-4">{modalContentType === "request" ? "Client Request" : "Scope Decision"}</h3>
          <button onClick={() => setIsRequestModalOpen(false)} className="text-gray-500 hover:text-black font-bold text-xl">×</button>
        </div>
        {modalContentType === "request" ? (
          <p className="text-gray-700">{selectedRequest?.description}</p>
        ) : (
          <div className="flex justify-between">
            <button
              onClick={() => {
                const updatedRequests = clientRequests.map((r) =>
                  r.id === selectedRequest.id ? { ...r, scopeStatus: "Within Scope" } : r
                );
                setClientRequests(updatedRequests);
                setIsRequestModalOpen(false);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Within Scope
            </button>
            <button
              onClick={() => {
                const updatedRequests = clientRequests.map((r) =>
                  r.id === selectedRequest.id ? { ...r, scopeStatus: "Out of Scope" } : r
                );
                setClientRequests(updatedRequests);
                setIsRequestModalOpen(false);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Out of Scope
            </button>
          </div>
        )}
      </div>
    </div>
  )}  
      
    </div>
    <div className="flex items-center justify-between mt-4 px-2">
      <div className="text-sm text-gray-500">Page <span className="font-medium">1</span> of 10</div>
      <div className="flex space-x-1">
        <button className="px-3 py-1 border rounded">1</button>
        <button className="px-3 py-1 border rounded">2</button>
        <button className="px-3 py-1 border rounded">3</button>
        <span className="px-3 py-1">...</span>
        <button className="px-3 py-1 border rounded">10</button>
      </div>
    </div>
    </div>
        <AssignMembersModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
        />
  </>
  );



const handleScopeDecision = (status) => {
  if (!selectedRequest) return;
  const updatedRequests = clientRequests.map((req) =>
    req.id === selectedRequest.id ? { ...req, scopeStatus: status } : req
  );
  setClientRequests(updatedRequests);
  setShowRequestModal(false); // Optionally close the modal after decision
};


  const renderContent = () => {
    switch (activeTab) {
      case "Create Member":
        return renderCreateMembersContent();
      case "Client Requests":
        return renderClientRequests();
      default:
        return <div className="text-center pt-10">Select a menu item</div>;
    }
  };
 const renderRequestModal = () => (
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


  return (
    <div className="flex h-screen py-4 bg-white overflow-hidden">
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
          <FlowManager isOpen={flowModalOpen} onClose={() => setFlowModalOpen(false)} />
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
      {showModal && renderModal()}
      {showRequestModal && renderRequestModal()}
    </div>
  );

};
export default Dashboard;
