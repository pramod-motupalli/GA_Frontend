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

const Dashboard = () => {
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

  const [teamLeads, setTeamLeads] = useState([]); // <-- ✅ team leads state

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

  const renderContent = () => {
    switch (activeTab) {
      case "Create Member":
        return renderCreateMembersContent();
      default:
        return <div className="text-center pt-10">Select a menu item</div>;
    }
  };

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
        </div>
        <div className="p-4 border-t border-gray-200 space-y-3">
          <button className="w-full flex items-center gap-3 bg-blue-500 rounded-lg px-4 py-2 text-white font-semibold hover:bg-blue-600 transition">
            <User className="w-4 h-4" /> Manager
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
    </div>
  );
};

export default Dashboard;
