import React, { useState } from "react";
import logo from "../assets/GA.png";
import {
  User,
  LogOut,
  MessageCircle,
  Bell,
  Settings,
  ClipboardList,
  Users,
  Briefcase,
  CheckSquare,
  Clipboard,
  UserCheck,
  LayoutDashboard,
} from "lucide-react";

const ManagerDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "create member", icon: UserCheck },
    { name: "Tasks", icon: ClipboardList, badge: "02" },
    { name: "clients", icon: Users },
    { name: "clients services", icon: Users, badge: "02" },
    { name: "payments", icon: Briefcase, badge: "02" },
    { name: "Approvals", icon: CheckSquare, badge: "02" },
    { name: "Request", icon: Clipboard },
    { name: "Settings", icon: Settings },
  ];

  // Sample content for each page
  const renderContent = () => {
    switch (selectedMenu) {
      case "Dashboard":
        return <div>📊 This is the Dashboard content.</div>;
      case "create member":
        return <div>👤 Create a new member here.</div>;
      case "Tasks":
        return <div>✅ View and manage tasks.</div>;
      case "clients":
        return <div>🧑‍💼 Client details listed here.</div>;
      case "clients services":
        return <div>🔧 Services for clients shown here.</div>;
      case "payments":
        return <div>💳 Payment records and actions.</div>;
      case "Approvals":
        return <div>✔️ Pending approval requests.</div>;
      case "Request":
        return <div>📄 Request details.</div>;
      case "Settings":
        return <div>⚙️ Settings and preferences.</div>;
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-60 h-full bg-white rounded-2xl shadow-[0_0_10px_rgba(64,108,140,0.2)] outline outline-1 outline-zinc-200 flex flex-col justify-between">
        {/* Top: Logo and Menu */}
        <div className="flex flex-col overflow-hidden">
          {/* Logo */}
          <div className="h-20 p-4 border-b border-zinc-300 flex items-center justify-center">
            <img src={logo} alt="GA Digital Solutions" className="h-14 object-contain" />
          </div>

          {/* Menu */}
          <div className="flex-1 px-4 py-4 space-y-2 overflow-auto">
            {menuItems.map(({ name, icon: Icon, badge }) => (
              <button
                key={name}
                onClick={() => setSelectedMenu(name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left ${
                  selectedMenu === name
                    ? "bg-blue-500 text-white font-semibold shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3 text-sm">
                  <Icon className="w-4 h-4" />
                  {name}
                </div>
                {badge && (
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Buttons */}
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
      <div className="flex-1 flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Welcome, Manager</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-full flex justify-center items-center outline outline-1 outline-neutral-300">
                <MessageCircle className="w-5 h-5 text-gray-800" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 text-white rounded-full flex justify-center items-center text-xs font-bold">
                02
              </div>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex justify-center items-center outline outline-1 outline-neutral-300">
              <Bell className="w-5 h-5 text-gray-800" />
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex justify-center items-center outline outline-1 outline-neutral-300">
              <User className="w-5 h-5 text-gray-800" />
            </div>
          </div>
        </div>

        {/* Dynamic Page Content */}
        <div className="flex-1 bg-gray-50 rounded-xl p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
