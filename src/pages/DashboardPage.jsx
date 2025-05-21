import React, { useState } from "react";
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
} from "lucide-react";
import logo from "../assets/GA.png";
import emptyDataIcon from "../assets/empty-data-icon.png";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Create Member");
  const [selectedTab, setSelectedTab] = useState("Client");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalUserType, setModalUserType] = useState("Client");
  const [staffMembers, setStaffMembers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    teamLead: "",
    designation: ""
  });

  const openModal = (userType) => {
    setModalUserType(userType);
    if (userType === "Staff Member") {
      setShowModal(true);
    }
    setFormData({
      name: "",
      email: "",
      teamLead: "",
      designation: ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStaffMembers([...staffMembers, formData]);
    setShowModal(false);
  };

  const handleDropdownSelect = (type) => {
    setSelectedTab(type);
    setShowDropdown(false);
    if (type === "Staff Member") {
      openModal(type);
    }
  };

  const renderModal = () => (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Staff Member</h2>
          <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-black text-xl font-bold">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <select
              className="w-full border border-gray-300 rounded-md p-2 text-gray-600"
              name="teamLead"
              value={formData.teamLead}
              onChange={handleChange}
            >
              <option value="">Select the team-lead</option>
            </select>
          </div>
          <div>
            <select
              className="w-full border border-gray-300 rounded-md p-2 text-gray-600"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            >
              <option value="">Designation</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
            </select>
          </div>
          <div>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email id"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="border px-4 py-2 rounded text-gray-600 hover:bg-gray-100"
            >
              cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Create Member", icon: UserCheck },
    { name: "Work Space", icon: Briefcase },
    { name: "Tasks TODO", icon: ClipboardList },
    { name: "Approvals", icon: BadgeCheck },
    { name: "Rise by Manager", icon: Users },
    { name: "Clients Services", icon: Briefcase },
    { name: "Client Requests", icon: Clipboard },
    { name: "Settings", icon: Settings },
  ];

  const renderCreateMembersContent = () => (
    <div className="w-full h-full bg-white rounded-xl p-6 shadow flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6">
          {["Client", "Staff Member"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`text-md font-medium pb-2 ${
                selectedTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 shadow"
          >
            + Add User <ChevronDown className="w-4 h-4" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded z-10">
              {["Client", "Staff Member"].map((type) => (
                <div
                  key={type}
                  onClick={() => handleDropdownSelect(type)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedTab === "Staff Member" && staffMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {staffMembers.map((member, index) => (
            <div key={index} className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-6 h-6 text-gray-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.designation}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                    
                  </div>
                </div>
              </div>
              <button className="w-full text-center mt-2 bg-blue-100 text-blue-600 text-sm py-1 rounded">
                View Profile
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center text-gray-500 gap-2">
          <img src={emptyDataIcon} alt="Empty Data" className="w-20 h-20 opacity-60" />
          <p>No {selectedTab.toLowerCase()}s created</p>
          {selectedTab === "Staff Member" && (
            <button
              onClick={() => openModal(selectedTab)}
              className="border border-gray-300 text-gray-600 px-4 py-1 rounded-md mt-2 hover:bg-gray-100"
            >
              + Add User
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Create Member":
        return renderCreateMembersContent();
      case "Work Space":
        return "this is workspace section";
      case "Tasks TODO":
        return "this is tasks section";
      case "Approvals":
        return "this is Approvals section";
      case "Client Services":
        return "this is for client services";
      case "Client Requests":
        return "this is for client requests";
      case "Settings":
        return "this is for settings panel";
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
            {menuItems.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left ${
                  activeTab === name
                    ? "bg-blue-500 text-white font-semibold shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {name}
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

      <div className="flex-1 flex flex-col p-6 bg-gray-50 overflow-y-auto">
        <div className="flex justify-end items-center gap-4 mb-6">
          <div className="w-12 h-12 p-3 bg-white rounded-full outline outline-1 outline-neutral-300 flex justify-center items-center">
            <MessageCircle className="w-6 h-6 text-gray-800" />
          </div>
          <div className="w-12 h-12 p-3 bg-white rounded-full outline outline-1 outline-neutral-300 flex justify-center items-center">
            <Bell className="w-6 h-6 text-gray-800" />
          </div>
          <div className="w-12 h-12 p-3 bg-white rounded-full outline outline-1 outline-neutral-300 flex justify-center items-center">
            <User className="w-6 h-6 text-gray-800" />
          </div>
        </div>
        <div className="flex-1">{renderContent()}</div>
      </div>

      {showModal && renderModal()}
    </div>
  );
};

export default Dashboard;
