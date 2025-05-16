import React from "react";
import logo from "../assets/GA.png";
import { User, LogOut, MessageCircle, Bell, Settings, Users, ClipboardList, Briefcase, CheckSquare, BarChart2, Clipboard, UserCheck,LayoutDashboard  } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="w-full h-screen relative bg-white overflow-hidden">
      <div className="w-60 h-11/12 pb-6 left-[18px] top-[25px] absolute bg-white rounded-2xl shadow-[0px_0px_10px_0px_rgba(64,108,140,0.20)] outline outline-1 outline-offset-[-1px] outline-zinc-500/10 flex flex-col justify-between items-center overflow-hidden">
        
        {/* Scrollable top + menu */}
        <div className="self-stretch flex flex-col justify-start items-center gap-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {/* Logo */}
          <div className="self-stretch h-20 p-2.5 border-b border-zinc-300 flex flex-col justify-center items-center gap-2.5">
            <img src={logo} alt="GA Digital Solutions" className="h-14 object-contain" />
          </div>

          {/* Menu Items */}
          <div className="w-48 flex flex-col justify-start items-start gap-1">
            <div className="px-2.5 py-2 bg-blue-500 rounded-lg shadow-[0px_4px_4px_0px_rgba(87,144,221,0.14)] inline-flex justify-between items-center">
              <div className="flex-1 flex justify-start items-center gap-3 text-white text-sm font-semibold font-['Inter']">
                    <LayoutDashboard  className="w-6 h-6" />
                Dashboard
              </div>
            </div>

            <div className="px-2.5 py-2 rounded-lg inline-flex justify-between items-center hover:bg-gray-100 cursor-pointer">
              <div className="flex-1 flex justify-start items-center gap-3 text-neutral-500 text-sm font-normal font-['Inter']">
                <UserCheck className="w-4 h-4" />
                create Staff
              </div>
            </div>

            <div className="px-2.5 py-2 rounded-lg inline-flex justify-between items-center hover:bg-gray-100 cursor-pointer">
              <div className="flex-1 flex justify-start items-center gap-3 text-neutral-500 text-sm font-normal font-['Inter']">
                <Briefcase className="w-4 h-4" />
                work space
              </div>
            </div>

            <div className="px-2.5 py-2 rounded-lg inline-flex justify-between items-center hover:bg-gray-100 cursor-pointer">
              <div className="flex-1 flex justify-start items-center gap-3 text-neutral-500 text-sm font-normal font-['Inter']">
                <CheckSquare className="w-4 h-4" />
                tasks TODO
              </div>
            </div>

            <div className="px-2.5 py-2 rounded-lg inline-flex justify-between items-center hover:bg-gray-100 cursor-pointer">
              <div className="flex-1 flex justify-start items-center gap-3 text-neutral-500 text-sm font-normal font-['Inter']">
                <BarChart2 className="w-4 h-4" />
                Rise by manager
              </div>
            </div>

            <div className="px-2.5 py-2 rounded-lg inline-flex justify-between items-center hover:bg-gray-100 cursor-pointer">
              <div className="flex-1 flex justify-start items-center gap-3 text-neutral-500 text-sm font-normal font-['Inter']">
                <Users className="w-4 h-4" />
                clients services
              </div>
            </div>

            <div className="px-2.5 py-2 rounded-lg inline-flex justify-between items-center hover:bg-gray-100 cursor-pointer">
              <div className="flex-1 flex justify-start items-center gap-3 text-neutral-500 text-sm font-normal font-['Inter']">
                <Clipboard className="w-4 h-4" />
                client Requests
              </div>
            </div>

            <div className="px-2.5 py-2 rounded-lg inline-flex justify-between items-center hover:bg-gray-100 cursor-pointer">
              <div className="flex-1 flex justify-start items-center gap-3 text-neutral-500 text-sm font-normal font-['Inter']">
                <Settings className="w-4 h-4" />
                Settings
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col justify-start items-start gap-4 p-4 border-t border-gray-200 w-full">
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

      {/* Header + right icons */}
      <div className="w-[1102px] left-[312px] top-[21px] absolute inline-flex justify-between items-center">
        <div className="justify-start text-black text-2xl font-semibold font-['Lato']">Welcome, Arjun</div>
        <div className="flex justify-start items-center gap-7">
          <div className="w-12 h-12 p-3 relative bg-white rounded-[34px] outline outline-1 outline-offset-[-1px] outline-neutral-300 flex justify-center items-center gap-2.5">
            <MessageCircle className="w-6 h-6 text-gray-800" />
            <div className="w-7 h-7 left-[33px] top-[-8px] absolute bg-blue-500 rounded-3xl overflow-hidden flex justify-center items-center">
              <div className="text-white text-sm font-semibold font-['Inter']">02</div>
            </div>
          </div>
          <div className="w-12 h-12 p-3 bg-white rounded-[34px] outline outline-1 outline-offset-[-1px] outline-neutral-300 flex justify-center items-center gap-2.5">
            <Bell className="w-6 h-6 text-gray-800" />
          </div>
          <div className="p-3 bg-white rounded-[48px] outline outline-1 outline-offset-[-1px] outline-neutral-300 flex justify-start items-center gap-2.5">
            <User className="w-6 h-6 text-gray-800" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
