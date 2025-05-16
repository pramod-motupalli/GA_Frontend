import React from "react";
import logo from "../assets/GA.png";
import {
  LayoutDashboard,
  UserPlus,
  ListChecks,
  Users,
  Briefcase,
  CreditCard,
  CheckCircle2,
  FileClock,
  Settings,
  User,
  LogOut,
  MessageCircle,
  Bell,
} from "lucide-react";

const ManagerDashboard = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false },
    { icon: UserPlus, label: "create member" },
    { icon: ListChecks, label: "Tasks", badge: "02" },
    { icon: Users, label: "clients" },
    { icon: Briefcase, label: "clients services", badge: "02" },
    { icon: CreditCard, label: "payments", badge: "02" },
    { icon: CheckCircle2, label: "Approvals", badge: "02", active: true },
    { icon: FileClock, label: "Request" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-[1440px] h-[1024px] relative bg-[#F9FBFC] overflow-hidden">
      {/* Sidebar */}
      <div className="w-60 h-full absolute left-[18px] top-[25px] bg-white rounded-2xl shadow-[0px_0px_10px_0px_rgba(64,108,140,0.20)] outline outline-1 outline-offset-[-1px] outline-zinc-500/10 flex flex-col justify-between">
        {/* Top - Logo & Menu */}
        <div className="flex flex-col items-center gap-4 overflow-auto py-4">
          <div className="h-20 p-2.5 border-b border-zinc-300 flex justify-center items-center">
            <img src={logo} alt="Logo" className="h-14 object-contain" />
          </div>

          {/* Menu Items */}
          <div className="w-full px-4 flex flex-col gap-1">
            {menuItems.map(({ icon: Icon, label, badge, active }, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded-lg flex justify-between items-center ${
                  active
                    ? "bg-blue-500 text-white shadow"
                    : "hover:bg-gray-100 text-neutral-600"
                } cursor-pointer`}
              >
                <div className="flex items-center gap-3 text-sm font-['Inter']">
                  <Icon className="w-4 h-4" />
                  {label}
                </div>
                {badge && (
                  <span
                    className={`text-xs font-semibold rounded-full px-2 ${
                      active
                        ? "bg-white text-blue-500"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom - Profile & Logout */}
        <div className="flex flex-col gap-3 p-4 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 bg-blue-500 rounded-lg px-4 py-2 text-white font-semibold hover:bg-blue-600 transition">
            <User className="w-4 h-4" />
            Manager
          </button>
          <button className="w-full flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 font-normal hover:bg-gray-100 transition">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Top Bar */}
      <div className="w-[1102px] absolute left-[312px] top-[21px] flex justify-between items-center pr-4">
        <div className="text-black text-2xl font-semibold font-['Lato']">
          Welcome , Manager
        </div>

        <div className="flex items-center gap-7">
          {/* Chat Icon with Badge */}
          <div className="relative">
            <div className="w-12 h-12 p-3 bg-white rounded-full outline outline-1 outline-neutral-300 flex justify-center items-center">
              <MessageCircle className="w-6 h-6 text-gray-800" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
              02
            </div>
          </div>

          {/* Notification Icon */}
          <div className="w-12 h-12 p-3 bg-white rounded-full outline outline-1 outline-neutral-300 flex justify-center items-center">
            <Bell className="w-6 h-6 text-gray-800" />
          </div>

          {/* Profile Icon */}
          <div className="p-3 bg-white rounded-full outline outline-1 outline-neutral-300 flex items-center justify-center">
            <User className="w-6 h-6 text-gray-800" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
