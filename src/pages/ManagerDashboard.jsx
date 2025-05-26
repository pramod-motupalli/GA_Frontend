import React, { useState } from "react";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  CreditCard,
  FileText,
  BadgeCheck,
  Settings,
  LogOut,
  User,
  MessageCircle,
  Bell,
  Filter,
  Search,
} from "lucide-react";
import logo from "../assets/GA.png";
import emptyImage from "../assets/empty-data-icon.png";

const CreateMembers = () => {
  const [activeTab, setActiveTab] = useState("Team-leads");
  const [selectedMenuItem, setSelectedMenuItem] = useState("create member");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTeamLeadModal, setShowTeamLeadModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showAccountantModal, setShowAccountantModal] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const [teamLeads, setTeamLeads] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [accountants, setAccountants] = useState([]);

  const tabs = ["Team-leads", "Staff-members", "Accountant", "Clients"];

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "create member", icon: UserPlus },
    { name: "Tasks", icon: FileText, badge: "02" },
    { name: "clients", icon: Users },
    { name: "clients services", icon: FileText, badge: "02" },
    { name: "payments", icon: CreditCard, badge: "02" },
    { name: "Approvals", icon: BadgeCheck },
    { name: "Request", icon: FileText },
    { name: "Settings", icon: Settings },
  ];

  const handleCreateUser = (userData) => {
    const tab = activeTab;
    if (tab === "Team-leads") {
      setTeamLeads([...teamLeads, userData]);
    } else if (tab === "Staff-members") {
      setStaffMembers([...staffMembers, userData]);
    } else if (tab === "Accountant") {
      setAccountants([...accountants, userData]);
    }

    setShowTeamLeadModal(false);
    setShowStaffModal(false);
    setShowAccountantModal(false);
  };
  const renderUserList = () => {
  let users = [];
  if (activeTab === "Team-leads") users = teamLeads;
  else if (activeTab === "Staff-members") users = staffMembers;
  else if (activeTab === "Accountant") users = accountants;

  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
if (users.length === 0) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full h-full bg-white rounded-xl shadow p-6 text-center flex flex-col items-center justify-center">
        <img src={emptyImage} alt="Empty" className="w-20 h-20 mb-4 opacity-60" />
        <p className="text-gray-500 mb-4">No {activeTab.toLowerCase()} created</p>
        <button
          onClick={() => {
            if (activeTab === "Team-leads") setShowTeamLeadModal(true);
            else if (activeTab === "Staff-members") setShowStaffModal(true);
            else if (activeTab === "Accountant") setShowAccountantModal(true);
          }}
          className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2"
        >
          + Add User
        </button>
      </div>
    </div>
  );
}

  
return (
  <div className="flex-1 min-h-[calc(100vh-250px)] px-0">
  <div className="w-full h-full bg-white rounded-xl shadow p-6 flex flex-col justify-center items-center">
    {/* Search + Filter */}
    <div className="flex justify-between items-center mb-6 w-full">
      <div className="relative w-full">
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"/>
        <input
          type="text"
          placeholder="Search user..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
        />
      </div>
      <button className="ml-4 p-2 border border-gray-300 rounded-md hover:bg-gray-100">
        <Filter className="w-3 h-3" />
      </button>
    </div>
    {/*User Card Grids */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {currentUsers.map((user, index) => (
        <div key={index} className="bg-white shadow rounded-xl overflow-hidden">
          <div className="p-4 flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex justify-center items-center text-gray-500">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-md font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.designation}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">⋮</button>
          </div>
          <div className="bg-blue-100 px-4 py-2 text-center text-blue-600 font-medium cursor-pointer">
            View Profile
          </div>
        </div>
      ))}
    </div>

    {/* Pagination Controls */}
    <div className="flex justify-between items-center mt-auto pt-4">
      <div className="flex items-center gap-2">
        <span>Page</span>
        <select
          value={currentPage}
          onChange={(e) => setCurrentPage(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
        <span>of {totalPages}</span>
      </div>

      <div className="flex gap-1 items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-100'}`}
        >
          ‹
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 rounded ${num === currentPage ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
          >
            {num}
          </button>
        ))}

        {totalPages > 5 && (
          <>
            <span className="px-2 text-gray-500">...</span>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'}`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${currentPage === totalPages ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-100'}`}
        >
          ›
        </button>
      </div>
    </div>
  </div>
  </div>
);
  };


return (
    <div className="flex h-screen py-4 bg-white overflow-hidden relative">
      {/* Sidebar */}
      <div className="w-60 bg-white rounded-2xl shadow-md outline outline-1 outline-zinc-200 flex flex-col justify-between">
        <div className="flex flex-col overflow-hidden">
          <div className="h-20 p-4 border-b border-zinc-300 flex items-center justify-center">
            <img src={logo} alt="GA Digital Solutions" className="h-14 object-contain" />
          </div>
          <div className="flex-1 px-4 py-4 space-y-2 overflow-auto">
            {menuItems.map(({ name, icon: Icon, badge }) => (
              <button
                key={name}
                onClick={() => setSelectedMenuItem(name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left ${
                  name === selectedMenuItem
                    ? "bg-blue-500 text-white font-semibold shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {name}
                </span>
                {badge && (
                  <span className="text-xs rounded-full px-2 py-0.5 bg-blue-100 text-blue-600">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 space-y-3">
          <button className="w-full flex items-center gap-3 bg-blue-500 rounded-lg px-4 py-2 text-white font-semibold hover:bg-blue-600 transition">
            <User className="w-4 h-4" />
            Manager
          </button>
          <button className="w-full flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto px-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold capitalize">{selectedMenuItem}</h1>
          <div className="flex items-center gap-4 relative">
            <span className="text-gray-700 font-medium">Welcome Manager</span>
            <div className="w-12 h-12 p-3 bg-white rounded-full outline outline-1 outline-neutral-300 flex justify-center items-center">
              <MessageCircle className="w-6 h-6 text-gray-800" />
            </div>
            <div className="w-12 h-12 p-3 bg-white rounded-full outline outline-1 outline-neutral-300 flex justify-center items-center">
              <Bell className="w-6 h-6 text-gray-800" />
            </div>
            <div className="w-12 h-12 p-3 bg-white rounded-full outline outline-1 outline-neutral-300 flex justify-center items-center">
              <User className="w-6 h-6 text-gray-800" />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                + Add User
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-20 border">
                  <ul className="py-1 text-sm text-gray-800">
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setShowTeamLeadModal(true);
                        setShowDropdown(false);
                      }}
                    >
                      Team Lead
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setShowStaffModal(true);
                        setShowDropdown(false);
                      }}
                    >
                      Staff Member
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setShowAccountantModal(true);
                        setShowDropdown(false);
                      }}
                    >
                      Accountant
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedMenuItem === "create member" ? (
          <div className="bg-white w-full rounded-xl shadow p-6 flex flex-col min-h-[calc(100vh-180px)]">
            <div className="flex gap-6 mb-4 border-b border-gray-200 pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 ${activeTab === tab ? "font-medium text-blue-600" : "text-gray-600 hover:text-blue-500"}`}

                  
                >
                  {tab}
                </button>
              ))}
            </div>
            {renderUserList()}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center h-full text-gray-600 text-lg">
            This is {selectedMenuItem} panel.
          </div>
        )}
      </div>

      {showTeamLeadModal && (
        <Modal
          title="Create Team Lead"
          fields={[
            { type: "select", placeholder: "Designation", options: ["Manager", "Senior Lead"], name: "designation" },
            { type: "text", placeholder: "Name", name: "name" },
            { type: "email", placeholder: "Email id", name: "email" },
          ]}
          onClose={() => setShowTeamLeadModal(false)}
          onSubmit={handleCreateUser}
        />
      )}

      {showStaffModal && (
        <Modal
          title="Create Staff Member"
          fields={[
            { type: "select", placeholder: "Select Team Lead", options: ["Lead A", "Lead B"], name: "teamLead" },
            { type: "select", placeholder: "Designation", options: ["Senior Staff", "Junior Staff"], name: "designation" },
            { type: "text", placeholder: "Name", name: "name" },
            { type: "email", placeholder: "Email id", name: "email" },
          ]}
          onClose={() => setShowStaffModal(false)}
          onSubmit={handleCreateUser}
        />
      )}

      {showAccountantModal && (
        <Modal
          title="Create Accountant"
          fields={[
            { type: "text", placeholder: "Name", name: "name" },
            { type: "email", placeholder: "Email id", name: "email" },
          ]}
          onClose={() => setShowAccountantModal(false)}
          onSubmit={handleCreateUser}
        />
      )}
    </div>
  );
};

const Modal = ({ title, onClose, fields, onSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="bg-white w-96 rounded-lg p-6 shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">×</button>
        </div>
        <div className="space-y-4">
          {fields.map((field, idx) =>
            field.type === "select" ? (
              <select
                key={idx}
                name={field.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
              >
                <option value="">{field.placeholder}</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                key={idx}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            )
          )}
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => onSubmit(formData)}
            >
              Create User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMembers;