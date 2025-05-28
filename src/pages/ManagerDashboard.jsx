import React, { useState, useEffect } from "react";
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
import logo from "../assets/GA.png"; // Ensure this path is correct
import emptyImage from "../assets/empty-data-icon.png"; // Ensure this path is correct
import ActivatedPayments from "./WorkSpaceActivation"; // adjust path as needed
import WorkspaceCard from "./WorkspaceCard"; // adjust path as needed
import PlanRequests from "./PlanRequests"; // adjust path as needed

// Define API_ENDPOINTS with both fetch and create URLs
const API_ENDPOINTS = {
  // Fetch Endpoints (based on original code's apparent list endpoints)
  fetchTeamLeads: "http://localhost:8000/api/users/get-team-leads/",
  fetchStaffMembers: "http://localhost:8000/api/users/get-staff-members/",
  fetchAccountants: "http://localhost:8000/api/users/get-accountants/",

  // Create Endpoints (based on provided new logic)
  createTeamLead: "http://localhost:8000/api/users/teamlead/register/",
  createStaff: "http://localhost:8000/api/users/register-staff/",
  createAccountant: "http://localhost:8000/api/users/create-accountant/",

  // Assuming there might also be a fetch endpoint specifically for *all* team leads if different from the display list
  // If fetchTeamLeads above provides the full list, we don't need a separate one for the dropdown.
};

const CreateMembers = () => {
  const [activeTab, setActiveTab] = useState("Team-leads");
  const [selectedMenuItem, setSelectedMenuItem] = useState("create member");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTeamLeadModal, setShowTeamLeadModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showAccountantModal, setShowAccountantModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [teamLeads, setTeamLeads] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [accountants, setAccountants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRequestTab, setActiveRequestTab] = useState("Client Request");
  const [activeSubTab, setActiveSubTab] = useState("Task Request");
  const [requestSubTab, setRequestSubTab] = useState("customPlans");

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

  // --- Fetching Data ---
  const fetchTeamLeads = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Access token not found. Please log in."); // Handle authentication
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    const res = await fetch(API_ENDPOINTS.fetchTeamLeads, { headers });
    if (!res.ok) throw new Error(`Failed to fetch team leads: ${res.statusText}`);
    const data = await res.json();
     // Assuming API returns an array directly or an object with a 'results' key
    const leads = data.results || data || [];
    // console.log("Fetched Team Leads:", leads); // Log the fetched data
    return leads;
  };

  const fetchStaffMembers = async () => {
    const token = localStorage.getItem("accessToken");
     if (!token) throw new Error("Access token not found. Please log in.");
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    const res = await fetch(API_ENDPOINTS.fetchStaffMembers, { headers });
    if (!res.ok) throw new Error(`Failed to fetch staff members: ${res.statusText}`);
    const data = await res.json();
    const staff = data.results || data || [];
    // console.log("Fetched Staff Members:", staff); // Log the fetched data
     return staff;
  };

  const fetchAccountants = async () => {
    const token = localStorage.getItem("accessToken");
     if (!token) throw new Error("Access token not found. Please log in.");
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    const res = await fetch(API_ENDPOINTS.fetchAccountants, { headers });
    if (!res.ok) throw new Error(`Failed to fetch accountants: ${res.statusText}`);
    const data = await res.json();
     const accountants = data.results || data || [];
     // console.log("Fetched Accountants:", accountants); // Log the fetched data
     return accountants;
  };

  // Initial Data Fetch Effect
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [teamData, staffData, accData] = await Promise.all([
          fetchTeamLeads(),
          fetchStaffMembers(),
          fetchAccountants(),
        ]);
        setTeamLeads(teamData);
        setStaffMembers(staffData);
        setAccountants(accData);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "An unknown error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array: runs once on mount

  // --- Creating Users (API Calls) ---
  const createTeamLeadRequest = async (userData) => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Access token not found. Please log in.");
    const response = await fetch(API_ENDPOINTS.createTeamLead, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    // Check for non-OK responses and include body in error if possible
    if (!response.ok) {
      const errorBody = await response.text().catch(() => "Unknown error body"); // Try to get error body
      throw new Error(`Failed to create team lead: ${response.status} ${response.statusText} - ${errorBody}`);
    }
    return response.json(); // Return the created object if API does
  };

  const createStaffRequest = async (userData) => {
    const token = localStorage.getItem("accessToken");
     if (!token) throw new Error("Access token not found. Please log in.");
    const response = await fetch(API_ENDPOINTS.createStaff, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
     console.log(userData) // Log data sent to API
    if (!response.ok) {
       const errorBody = await response.text().catch(() => "Unknown error body");
       throw new Error(`Failed to create staff: ${response.status} ${response.statusText} - ${errorBody}`);
    }
    return response.json();
  };

  const createAccountantRequest = async (userData) => {
    const token = localStorage.getItem("accessToken");
     if (!token) throw new Error("Access token not found. Please log in.");
    const response = await fetch(API_ENDPOINTS.createAccountant, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
       const errorBody = await response.text().catch(() => "Unknown error body");
       throw new Error(`Failed to create accountant: ${response.status} ${response.statusText} - ${errorBody}`);
    }
    return response.json();
  };

  // --- Modal Submission Handlers ---
  const handleCreateTeamLeadSubmit = async (userData) => {
    try {
      await createTeamLeadRequest(userData);
      setShowTeamLeadModal(false);
      // Re-fetch the list to update the UI
      const updatedTeamLeads = await fetchTeamLeads();
      setTeamLeads(updatedTeamLeads);
      alert("Team Lead created successfully!"); // Simple success feedback
    } catch (error) {
      console.error("Team Lead Creation failed:", error);
      alert(`Failed to create Team Lead: ${error.message}`); // Simple error feedback
    }
  };

  const handleCreateStaffSubmit = async (userData) => {
    try {
      // Note: Assuming the backend expects 'team_lead_id' and expects the ID value
      // If your backend expects a different field name or the full object, adjust here.
      // The Modal sends 'team_lead_id' with the ID from the selected option.
      await createStaffRequest(userData);
      setShowStaffModal(false);
      // Re-fetch the list to update the UI
      const updatedStaffMembers = await fetchStaffMembers();
      setStaffMembers(updatedStaffMembers);
      alert("Staff Member created successfully!");
    } catch (error) {
      console.error("Staff Member Creation failed:", error);
      alert(`Failed to create Staff Member: ${error.message}`);
    }
  };

  const handleCreateAccountantSubmit = async (userData) => {
    try {
      await createAccountantRequest(userData);
      setShowAccountantModal(false);
      // Re-fetch the list to update the UI
      const updatedAccountants = await fetchAccountants();
      setAccountants(updatedAccountants);
      alert("Accountant created successfully!");
    } catch (error) {
      console.error("Accountant Creation failed:", error);
      alert(`Failed to create Accountant: ${error.message}`);
    }
  };

  function getUsersByTab() {
    if (activeTab === "Team-leads") return teamLeads;
    if (activeTab === "Staff-members") return staffMembers;
    if (activeTab === "Accountant") return accountants;
    if (activeTab === "Clients") return []; // Placeholder for clients data
    return [];
  }

  const usersToDisplay = getUsersByTab().filter((user) =>
    // Ensure user, user.name, and user.email exist before calling .toLowerCase() or .includes()
    user && (
        (user.name && typeof user.name === 'string' && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && typeof user.email === 'string' && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (activeTab === 'Staff-members' && user.team_lead && user.team_lead.username && typeof user.team_lead.username === 'string' && user.team_lead.username.toLowerCase().includes(searchTerm.toLowerCase())) // Also search by team lead username for staff
    )
  );

  const renderUserList = () => {
    if (isLoading) {
      return <div className="text-center p-10">Loading users...</div>;
    }
    if (error) {
      return <div className="text-center p-10 text-red-500">Error: {error}</div>;
    }

    const currentTabUsers = getUsersByTab(); // Get all users for the current tab before filtering

    if (currentTabUsers.length === 0 && searchTerm === "") {
      const addUserButtonText = `+ Add ${activeTab.replace('-', ' ').slice(0, -1)}`; // Remove 's' for singular (Team-lead, Staff-member, Accountant)
      return (
        <div className="flex flex-col justify-center items-center bg-white rounded-xl shadow p-6 text-center">
          <img src={emptyImage} alt="Empty" className="w-20 h-20 mb-4 opacity-60" />
          <p className="text-gray-500 mb-4">No {activeTab.toLowerCase().replace('-', ' ')} created yet.</p>
          <button
            onClick={() => {
              if (activeTab === "Team-leads") setShowTeamLeadModal(true);
              else if (activeTab === "Staff-members") setShowStaffModal(true);
              else if (activeTab === "Accountant") setShowAccountantModal(true);
              // Clients tab might need a different action
            }}
            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-200"
          >
            {addUserButtonText}
          </button>
        </div>
      );
    }

    if (usersToDisplay.length === 0 && searchTerm !== "") {
      return (
        <div className="flex flex-col justify-center items-center bg-white rounded-xl shadow p-6 text-center">
          <img src={emptyImage} alt="No results" className="w-20 h-20 mb-4 opacity-60" />
          <p className="text-gray-500 mb-4">No {activeTab.toLowerCase().replace('-', ' ')} found matching "{searchTerm}".</p>
        </div>
      );
    }

    // Render the list of users
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {usersToDisplay.map((user, index) => (
           <div key={user.id || user.email || index} className="bg-white shadow rounded-xl overflow-hidden flex flex-col">
           <div className="p-4 flex-grow">
             <div className="flex justify-between items-start">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-gray-200 rounded-full flex justify-center items-center text-gray-500">
                   <User className="w-5 h-5" />
                 </div>
                 <div>
                   {/* Display based on active tab */}
                   {activeTab === "Team-leads" && (
                       <>
                           {/* Assuming Team Lead data has name, email, designation */}
                           <h3 className="text-md font-semibold">{user.name || user.email || "Team Lead"}</h3>
                           <p className="text-sm text-gray-500">{user.designation || "Team Lead"}</p>
                           <p className="text-sm text-gray-400">{user.email || "N/A"}</p>
                           {/* Add other Team Lead specific info if available */}
                           {/* <p className="text-sm text-gray-400">Projects: {user.project_count}</p> */}
                       </>
                   )}
                   {activeTab === "Staff-members" && (
                        <>
                           {/* Assuming Staff data has name, email, designation, and potentially a team_lead object/id */}
                           <h3 className="text-md font-semibold">{user.name || user.email || "Staff Member"}</h3>
                           <p className="text-sm text-gray-500">{user.designation || "Staff Member"}</p>
                           <p className="text-sm text-gray-400">{user.email || "N/A"}</p>
                           {/* Display Team Lead's username if available in staff data */}
                           {user.team_lead && user.team_lead.username && (
                                <p className="text-xs text-gray-500 mt-1">Team Lead: {user.team_lead.username}</p>
                           )}
                            {/* Or if your backend returns only the team_lead ID, you might need to find the lead from the teamLeads array */}
                            {/* {user.team_lead_id && teamLeads.find(lead => lead.id === user.team_lead_id)?.name && (
                                <p className="text-xs text-gray-500 mt-1">Team Lead: {teamLeads.find(lead => lead.id === user.team_lead_id).name}</p>
                            )} */}
                           {/* Add other Staff specific info if available */}
                        </>
                   )}
                    {activeTab === "Accountant" && (
                        <>
                           {/* Assuming Accountant data has name, email */}
                           <h3 className="text-md font-semibold">{user.name || user.email || "Accountant"}</h3>
                           <p className="text-sm text-gray-500">Accountant</p> {/* Role is fixed */}
                           <p className="text-sm text-gray-400">{user.email || "N/A"}</p>
                           {/* Add other Accountant specific info if available */}
                        </>
                   )}
                   {activeTab === "Clients" && (
                        <>
                           {/* Assuming Client data has name, email, maybe company name */}
                           <h3 className="text-md font-semibold">{user.name || user.email || "Client"}</h3>
                           <p className="text-sm text-gray-500">Client</p> {/* Role is fixed */}
                           <p className="text-sm text-gray-400">{user.email || "N/A"}</p>
                           {/* Add other Client specific info if available */}
                            {/* <p className="text-sm text-gray-400">Company: {user.company_name || 'N/A'}</p> */}
                        </>
                   )}

                    {/* Fallback display if structure is unexpected */}
                    {!["Team-leads", "Staff-members", "Accountant", "Clients"].includes(activeTab) && (
                         <>
                            <h3 className="text-md font-semibold">{user.name || user.email || "User"}</h3>
                            <p className="text-sm text-gray-500">{user.designation || user.role || "User"}</p>
                            <p className="text-sm text-gray-400">{user.email || "N/A"}</p>
                         </>
                    )}
                 </div>
               </div>
               {/* Dropdown/Options button (e.g., for Edit/Delete) */}
               <button className="text-gray-400 hover:text-gray-600 p-1">⋮</button>
             </div>
           </div>
           {/* Optional: View Profile Link */}
           <div className="bg-blue-50 hover:bg-blue-100 px-4 py-2 text-center text-blue-600 font-medium cursor-pointer border-t border-blue-200">
             View Profile
           </div>
         </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen py-4 bg-white overflow-hidden relative">
      {/* Sidebar */}
      <aside className="w-60 bg-white rounded-2xl shadow-md outline outline-1 outline-zinc-200 flex flex-col justify-between">
        <div className="flex flex-col overflow-hidden">
          <div className="h-20 p-4 border-b border-zinc-300 flex items-center justify-center">
            <img src={logo} alt="GA Digital Solutions" className="h-14 object-contain" />
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-auto">
            {menuItems.map(({ name, icon: Icon, badge }) => (
              <button
                key={name}
                onClick={() => setSelectedMenuItem(name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors duration-150 ${
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
                  <span className={`text-xs rounded-full px-2 py-0.5 ${name === selectedMenuItem ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-600'}`}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 bg-gray-50 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold capitalize">{selectedMenuItem}</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Welcome Manager</span>
            <div className="w-10 h-10 p-2 bg-white rounded-full outline outline-1 outline-neutral-300 flex justify-center items-center cursor-pointer hover:bg-gray-100">
              <MessageCircle className="w-5 h-5 text-gray-700" />
            </div>
            <div className="w-10 h-10 p-2 bg-white rounded-full outline outline-1 outline-neutral-300 flex justify-center items-center cursor-pointer hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-700" />
            </div>
            <div className="w-10 h-10 p-2 bg-white rounded-full outline outline-1 outline-neutral-300 flex justify-center items-center cursor-pointer hover:bg-gray-100">
              <User className="w-5 h-5 text-gray-700" />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
              >
                <UserPlus size={18}/> Add User
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-20 border py-1">
                  <ul>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                      onClick={() => {
                        setShowTeamLeadModal(true);
                        setShowDropdown(false);
                      }}
                    >
                      Team Lead
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                      onClick={() => {
                        setShowStaffModal(true);
                        setShowDropdown(false);
                      }}
                    >
                      Staff Member
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
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
        </header>

        {selectedMenuItem === "create member" ? (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder={`Search in ${activeTab.replace('-', ' ')}...`}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-6 border-b mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSearchTerm(""); // Clear search term when changing tabs
                  }}
                  className={`pb-2 text-sm sm:text-base ${
                    activeTab === tab
                      ? "border-b-2 border-blue-500 font-semibold text-blue-600"
                      : "text-gray-600 hover:text-blue-500 hover:border-b-2 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {renderUserList()}
          </>
        ) : selectedMenuItem === "Approvals" ? (
          <ActivatedPayments />
        ) : selectedMenuItem === "Dashboard" ? (
            <WorkspaceCard />
          ) : selectedMenuItem === "Request" ? (
           <>
    {/* Request Header */}
   

    {/* Top Tabs (Client Request / Team Lead Request) */}
    <div className="inline-flex items-center gap-1 p-1 mb-4 bg-gradient-to-br from-white to-neutral-100 rounded-full shadow">
      <button className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">
        Client Request
      </button>
      <button className="px-5 py-2 text-gray-700 rounded-full text-sm font-medium flex items-center gap-2">
        Team Lead Request <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#BDD9FE] to-[#223E65] text-white text-xs flex items-center justify-center">02</span>
      </button>
    </div>

    {/* Sub Tabs (Custom Plans / Task Request) */}
    <div className="flex gap-6 mb-4 text-sm font-semibold">
      <button
        onClick={() => setRequestSubTab("customPlans")}
        className={`pb-1 ${requestSubTab === "customPlans" ? "text-gray-800 border-b-2 border-gray-700" : "text-gray-400"}`}
      >
        Custom plans <span className="ml-1 rounded-full bg-gradient-to-br from-[#BDD9FE] to-[#223E65] text-white px-2 text-xs">02</span>
      </button>
      <button
        onClick={() => setRequestSubTab("taskRequest")}
        className={`pb-1 ${requestSubTab === "taskRequest" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"}`}
      >
        Task Request
      </button>
    </div>

    {/* Table Section (only from search bar downward) */}
    <div className="bg-white rounded-xl shadow p-4 mt-2">
      {requestSubTab === "customPlans" ? (
        <PlanRequests type="custom" />
      ) : (
        <PlanRequests type="task" />
      )}
    </div>
  </>
) : (
          <div className="flex-1 flex items-center justify-center h-full text-gray-600 text-lg">
            This is the {selectedMenuItem} panel.
          </div>
        )}
      </main>

      {/* Modals */}
      {showTeamLeadModal && (
        <Modal
          title="Create Team Lead"
          fields={[
            { type: "select", placeholder: "Designation", options: ["Manager", "Senior Lead"], name: "designation", required: true },
            { type: "text", placeholder: "Name", name: "name", required: true },
            { type: "email", placeholder: "Email id", name: "email", required: true },
            //  { type: "password", placeholder: "Password", name: "password", required: true },
            //  { type: "password", placeholder: "Confirm Password", name: "password2", required: true },
          ]}
          onClose={() => setShowTeamLeadModal(false)}
          onSubmit={handleCreateTeamLeadSubmit} // Pass the specific submit handler
        />
      )}

      {showStaffModal && (
        <Modal
          title="Create Staff Member"
          fields={[
            // Use fetched teamLeads for the dropdown options
            // Assuming teamLeads objects have a nested 'user' object with 'username' and a top-level 'id'
            {
              type: "select",
              placeholder: "Select Team Lead",
              // Map teamLeads state to { value: id, label: username } format for the select options
              options: teamLeads.map(tl => ({ value: tl.id, label: tl.user?.username || tl.email || `Lead ${tl.id}` })), // Use tl.id as the value if backend expects ID
              name: "team_lead", // Use a name matching the backend field (guessing 'team_lead' or 'team_lead_id')
              required: true
            },
            { type: "select", placeholder: "Designation", options: ["Senior Staff", "Junior Staff"], name: "designation", required: true },
            { type: "text", placeholder: "Name", name: "name", required: true },
            { type: "email", placeholder: "Email id", name: "email", required: true },
            //  { type: "password", placeholder: "Password", name: "password", required: true },
            //  { type: "password", placeholder: "Confirm Password", name: "password2", required: true },
          ]}
          onClose={() => setShowStaffModal(false)}
          onSubmit={handleCreateStaffSubmit} // Pass the specific submit handler
        />
      )}

      {showAccountantModal && (
        <Modal
          title="Create Accountant"
          fields={[
            { type: "text", placeholder: "Name", name: "name", required: true },
            { type: "email", placeholder: "Email id", name: "email", required: true },
            //  { type: "password", placeholder: "Password", name: "password", required: true },
            // { type: "password", placeholder: "Confirm Password", name: "password2", required: true },
          ]}
          onClose={() => setShowAccountantModal(false)}
          onSubmit={handleCreateAccountantSubmit} // Pass the specific submit handler
        />
      )}
    </div>
  );
};

const Modal = ({ title, onClose, fields, onSubmit }) => {
  // Initialize formData based on the provided fields
  const initialFormData = fields.reduce((acc, field) => {
    // Handle potential default values for select if needed
    if (field.type === 'select' && field.options && field.options.length > 0) {
         // Might set a default value, but '' for the placeholder is usually better initially
         acc[field.name] = '';
    } else {
        acc[field.name] = "";
    }
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state

  useEffect(() => {
      // Reset form data when fields prop changes (i.e., modal type changes)
      // This ensures that closing one modal and opening another clears the form
      setFormData(initialFormData);
      setFormErrors({});
      setIsSubmitting(false);
  }, [fields, title]); // Depend on fields and title to reset when modal type changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific error when user starts typing in that field
    if (formErrors[name]) {
      setFormErrors(prev => ({...prev, [name]: null}));
    }
     // Also clear password confirmation error if either password field changes
    if (name === 'password' || name === 'password2') {
         if (formErrors.password2) {
             setFormErrors(prev => ({...prev, password2: null}));
         }
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    fields.forEach(field => {
      // Required validation
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.placeholder || field.name} is required.`;
        isValid = false;
      }

      // Email format validation
      if (field.type === 'email' && formData[field.name] && !/\S+@\S+\.\S+/.test(formData[field.name])) {
        errors[field.name] = 'Invalid email format.';
        isValid = false;
      }
    });

    // Password confirmation validation (only if password fields are included)
    const passwordField = fields.find(f => f.name === 'password');
    const confirmPasswordField = fields.find(f => f.name === 'password2');

    if (passwordField && confirmPasswordField) {
        if (formData.password && formData.password2 && formData.password !== formData.password2) {
             errors.password2 = "Passwords do not match.";
             isValid = false;
        }
         // Ensure confirm password is required if password is required and present
         if (passwordField.required && formData.password && confirmPasswordField.required && !formData.password2) {
             errors.password2 = "Confirm Password is required.";
             isValid = false;
         } else if (confirmPasswordField.required && !formData.password2 && !formData.password){
             // If confirm password is required, both passwords might be missing
             errors.password2 = `${confirmPasswordField.placeholder || confirmPasswordField.name} is required.`;
             isValid = false;
         }
    }

    setFormErrors(errors);
    return isValid;
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      // Call the onSubmit prop provided by the parent component
      // Added error handling for the onSubmit call itself
      try {
          await onSubmit(formData);
           // If onSubmit was successful, setIsSubmitting will be set to false
      } catch (submitError) {
          // onSubmit function should handle showing specific API errors
          // but we ensure submitting state is reset
          console.error("Submission error in Modal:", submitError);
      } finally {
           setIsSubmitting(false);
      }

      // Reset form after successful submission (or handled by parent closing modal)
      // setFormData(initialFormData); // Parent handles closing, so no need to reset here
    }
  }

  return (
    // Fixed positioning to overlay the entire viewport
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-xl relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        {/* Use a div instead of form if you handle submission entirely with button onClick */}
        {/* Or use form and prevent default, then trigger handleSubmit */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                    required={field.required}
                  >
                    <option value="" disabled>{field.placeholder}</option>
                    {/* Options can be simple strings or {value, label} objects */}
                    {field.options && field.options.map((opt, idx) => (
                      // Ensure opt is not null/undefined before accessing properties
                      opt ?
                      (typeof opt === 'string' ?
                      <option key={idx} value={opt}>{opt}</option> :
                      <option key={opt.value || idx} value={opt.value}>{opt.label}</option>)
                      : null // Skip rendering null/undefined options
                    ))}
                     {/* Add a fallback option if options are empty */}
                     {(!field.options || field.options.length === 0) && <option value="" disabled>No options available</option>}
                  </select>
                ) : (
                  <input
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                    required={field.required}
                  />
                )}
                {formErrors[field.name] && <p className="text-red-500 text-xs mt-1">{formErrors[field.name]}</p>}
              </div>
            ))}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button" // Use type="button" to prevent form submission if wrapped in a form
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit" // Use type="submit" to allow form submission if using form tag
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMembers;

