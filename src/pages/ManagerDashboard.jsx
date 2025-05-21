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

  const renderTabContent = () => (
    <div className="flex-1 flex flex-col justify-center items-center bg-white rounded-xl shadow p-6 text-center">
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
  );

  return (
    <div className="flex h-screen py-4 bg-white overflow-hidden">
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
      <div className="flex-1 flex flex-col p-6 bg-gray-50 overflow-y-auto">
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
          <>
            <div className="flex gap-6 border-b mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 ${
                    activeTab === tab
                      ? "border-b-2 border-blue-500 font-medium text-blue-600"
                      : "text-gray-600 hover:text-blue-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {renderTabContent()}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center h-full text-gray-600 text-lg">
            This is {selectedMenuItem} panel.
          </div>
        )}
      </div>

      {/* Team Lead Modal */}
      {showTeamLeadModal && (
        <Modal
          title="Create Team Lead"
          onClose={() => setShowTeamLeadModal(false)}
          fields={[
            { type: "select", placeholder: "Designation", options: ["Manager", "Senior Lead"] },
            { type: "text", placeholder: "Name" },
            { type: "email", placeholder: "Email id" },
          ]}
        />
      )}

      {/* Staff Member Modal */}
      {showStaffModal && (
        <Modal
          title="Create Staff Member"
          onClose={() => setShowStaffModal(false)}
          fields={[
            { type: "select", placeholder: "Select Team Lead", options: ["Lead A", "Lead B"] },
            { type: "select", placeholder: "Designation", options: ["Senior Staff", "Junior Staff"] },
            { type: "text", placeholder: "Name" },
            { type: "email", placeholder: "Email id" },
          ]}
        />
      )}

      {/* Accountant Modal */}
      {showAccountantModal && (
        <Modal
          title="Create Accountant"
          onClose={() => setShowAccountantModal(false)}
          fields={[
            { type: "text", placeholder: "Name" },
            { type: "email", placeholder: "Email id" },
          ]}
        />
      )}
    </div>
  );
};

const Modal = ({ title, onClose, fields }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-96 rounded-lg p-6 shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">
            ×
          </button>
        </div>
        <div className="space-y-4">
          {fields.map((field, idx) =>
            field.type === "select" ? (
              <select key={idx} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700">
                <option>{field.placeholder}</option>
                {field.options.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                key={idx}
                type={field.type}
                placeholder={field.placeholder}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            )
          )}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMembers;