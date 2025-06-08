import React, { useState } from "react";
import logo from "../assets/GA.png";
import WorkspaceCardStaff from './WorkspaveCardStaff';
import NotificationsPage from "./NotificationsPage"; // 1. Import the NotificationsPage component
import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  Settings,
  User,
  LogOut,
  MessageCircle,
  Bell,
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Work Space", icon: Briefcase, badge: "02" },
    { name: "tasks", icon: ClipboardList, badge: "02" },
    { name: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <div>This is the Dashboard content</div>;
      case "Work Space":
        return <div><WorkspaceCardStaff /></div>;
      case "tasks":
        return <div><Tasks /></div>;
      case "Settings":
        return <div>Settings panel</div>;
      // 2. Add a case to render the NotificationsPage
      case "Notifications":
        return <NotificationsPage />;
      default:
        return <div>Select an option</div>;
    }
  };

  return (
    <div className="flex h-screen py-4 bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-60 h-full max-h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-[0_0_10px_rgba(64,108,140,0.2)] outline outline-1 outline-zinc-200 flex flex-col justify-between">
        <div className="flex flex-col overflow-hidden">
          {/* Logo */}
          <div className="h-20 p-4 border-b border-zinc-300 flex items-center justify-center">
            <img src={logo} alt="GA Digital Solutions" className="h-14 object-contain" />
          </div>

          {/* Menu */}
          <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {menuItems.map(({ name, icon: Icon, badge }) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left ${
                  activeTab === name
                    ? "bg-blue-500 text-white font-semibold shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {name}
                </div>
                {badge && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      activeTab === name ? "bg-white text-blue-600" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          <button className="w-full flex items-center gap-3 bg-blue-500 rounded-lg px-4 py-2 text-white font-semibold hover:bg-blue-600 transition">
            <User className="w-4 h-4" />
            Staff
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
           {/* 3. Make the header title dynamic */}
          <h1 className="text-2xl font-semibold text-gray-800">
            {activeTab === 'Notifications' ? 'Notifications' : 'Welcome, Aravind'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 p-3 bg-white rounded-full outline outline-1 outline-neutral-300 flex justify-center items-center cursor-pointer hover:bg-gray-100">
              <MessageCircle className="w-6 h-6 text-gray-800" />
              <span className="absolute top-1 right-1 flex h-5 w-5">
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 text-white text-xs items-center justify-center">
                      02
                  </span>
              </span>
            </div>
             {/* 4. Make the Bell icon interactive and dynamic */}
            <div
                onClick={() => setActiveTab("Notifications")}
                className={`relative w-12 h-12 p-3 rounded-full outline outline-1 flex justify-center items-center cursor-pointer transition-colors duration-150
                  ${
                      activeTab === "Notifications"
                          ? "bg-blue-100 text-blue-600 outline-blue-300"
                          : "bg-white text-gray-800 outline-neutral-300 hover:bg-gray-100"
                  }`}
            >
              <Bell className={`w-6 h-6 ${activeTab === "Notifications" ? "text-blue-600" : "text-gray-800"}`}/>
              <span className="absolute top-1 right-1 flex h-5 w-5">
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 text-white text-xs items-center justify-center">
                      05 
                  </span>
              </span>
            </div>
            <div className="w-12 h-12 p-3 bg-white rounded-full outline outline-1 outline-neutral-300 flex justify-center items-center cursor-pointer hover:bg-gray-100">
              <User className="w-6 h-6 text-gray-800" />
            </div>
          </div>
        </div>

        {/* Content: Render the active component */}
        <div className="flex-1 bg-white rounded-xl shadow p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;