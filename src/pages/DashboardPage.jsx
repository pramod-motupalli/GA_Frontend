import React from "react";
import logo from "../assets/GA.png";
import {
  User,
  LogOut,
  MessageCircle,
  Bell,
  Settings,
  Users,
  ClipboardList,
  Briefcase,
  CheckSquare,
  BarChart2,
  Clipboard,
  UserCheck,
  LayoutDashboard,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="w-full h-screen flex bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/6 h-full pb-6 bg-white rounded-2xl shadow-[0px_0px_10px_0px_rgba(64,108,140,0.20)] outline outline-1 outline-offset-[-1px] outline-zinc-500/10 flex flex-col justify-between items-center overflow-hidden">
        {/* Scrollable top + menu */}
        <div className="w-full flex flex-col items-center gap-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {/* Logo */}
          <div className="w-full h-20 p-2.5 border-b border-zinc-300 flex justify-center items-center">
            <img src={logo} alt="GA Digital Solutions" className="h-14 object-contain" />
          </div>

          {/* Menu Items */}
          <div className="w-48 flex flex-col items-start gap-1">
            <div className="px-2.5 py-2 bg-blue-500 rounded-lg shadow-[0px_4px_4px_0px_rgba(87,144,221,0.14)] inline-flex justify-between items-center">
              <div className="flex-1 flex items-center gap-3 text-white text-sm font-semibold font-['Inter']">
                <LayoutDashboard className="w-6 h-6" />
                Dashboard
              </div>
            </div>

            {[
              { icon: <UserCheck className="w-4 h-4" />, label: "create Staff" },
              { icon: <Briefcase className="w-4 h-4" />, label: "work space" },
              { icon: <CheckSquare className="w-4 h-4" />, label: "tasks TODO" },
              { icon: <BarChart2 className="w-4 h-4" />, label: "Rise by manager" },
              { icon: <Users className="w-4 h-4" />, label: "clients services" },
              { icon: <Clipboard className="w-4 h-4" />, label: "client Requests" },
              { icon: <Settings className="w-4 h-4" />, label: "Settings" },
            ].map(({ icon, label }, index) => (
              <div
                key={index}
                className="px-2.5 py-2 rounded-lg inline-flex items-center hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex-1 flex items-center gap-3 text-neutral-500 text-sm font-normal font-['Inter']">
                  {icon}
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col items-start gap-4 p-4 border-t border-gray-200 w-full">
          <button className="w-full flex items-center gap-3 bg-blue-500 rounded-lg px-4 py-2 text-white font-semibold hover:bg-blue-600 transition">
            <User className="w-3 h-3" />
            Arjun
          </button>
          <button className="w-full flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 font-normal hover:bg-gray-100 transition">
            <LogOut className="w-3 h-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full flex flex-col">
        {/* Top Header */}
        <div className="w-full px-6 py-4 flex justify-between items-center border-b border-gray-200 bg-white">
          <div className="text-black text-2xl font-semibold font-['Lato']">
            Welcome, Arjun
          </div>
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-12 h-12 p-3 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-neutral-300 flex justify-center items-center">
                <MessageCircle className="w-6 h-6 text-gray-800" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="text-white text-xs font-semibold">02</div>
              </div>
            </div>
            <div className="w-12 h-12 p-3 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-neutral-300 flex justify-center items-center">
              <Bell className="w-6 h-6 text-gray-800" />
            </div>
            <div className="w-12 h-12 p-3 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-neutral-300 flex justify-center items-center">
              <User className="w-6 h-6 text-gray-800" />
            </div>
          </div>
        </div>

        {/* Page Content Area (can be filled later) */}
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          {/* Add dashboard cards, charts, or other components here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
