import React, { useState } from "react";
import logo from "../assets/GA.png";
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
  BadgeCheck
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Create Staff", icon: UserCheck },
    { name: "Work Space", icon: Briefcase },
    { name: "Tasks TODO", icon: ClipboardList },
    { name: "Approvals", icon:BadgeCheck},
    { name: "Rise by Manager", icon: Users },
    { name: "Clients Services", icon: Briefcase },
    { name: "Client Requests", icon: Clipboard },
    { name: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <div>This is the Dashboard content</div>;
      case "Create Staff":
        return <div>This is the Create Staff screen</div>;
      case "Work Space":
        return <div>This is the Work Space section</div>;
      case "Approvals":
        return <div>This is the Approvals section</div>;
      case "Tasks TODO":
        return <div>Tasks to complete appear here</div>;
      case "Rise by Manager":
        return <div>Manager reports and insights</div>;
      case "Clients Services":
        return <div>All client services listed</div>;
      case "Client Requests":
        return <div>Client requests display here</div>;
      case "Settings":
        return <div>Settings panel</div>;
      default:
        return <div>Select an option</div>;
    }
  };

  return (
    <div className="flex h-screen py-4 bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-60 h-11/12 bg-white rounded-2xl shadow-[0_0_10px_rgba(64,108,140,0.2)] outline outline-1 outline-zinc-200 flex flex-col justify-between">
        <div className="flex flex-col overflow-hidden">
          {/* Logo */}
          <div className="h-20 p-4 border-b border-zinc-300 flex items-center justify-center">
            <img src={logo} alt="GA Digital Solutions" className="h-14 object-contain" />
          </div>

          {/* Menu */}
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

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          <button className="w-full flex items-center gap-3 bg-blue-500 rounded-lg px-4 py-2 text-white font-semibold hover:bg-blue-600 transition">
            <User className="w-4 h-4" />
            Arjun
          </button>
          <button className="w-full flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col p-6 bg-gray-50 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Welcome, Arjun</h1>
          <div className="flex items-center gap-4">
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
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
