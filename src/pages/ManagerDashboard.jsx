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
  Edit3, // For Edit icon
  Trash2, // For Delete icon
} from "lucide-react";
import logo from "../assets/GA.png";
import emptyImage from "../assets/empty-data-icon.png";
import ActivatedPayments from "./WorkSpaceActivation";
import WorkspaceCard from "./WorkspaceCard";
import PlanRequests from "./PlanRequests";
import DomainHostingTableManager from './DomainHostingTableManager';


const API_ENDPOINTS = {
  fetchTeamLeads: "http://localhost:8000/api/users/get-team-leads/",
  fetchStaffMembers: "http://localhost:8000/api/users/get-staff-members/",
  fetchAccountants: "http://localhost:8000/api/users/get-accountants/",
  createTeamLead: "http://localhost:8000/api/users/teamlead/register/",
  createStaff: "http://localhost:8000/api/users/register-staff/",
  createAccountant: "http://localhost:8000/api/users/create-accountant/",
  // Define UPDATE and DELETE endpoints - replace <id> with actual ID at runtime
  updateTeamLead: (id) => `http://localhost:8000/api/users/team-lead/${id}/`, // Example
  deleteTeamLead: (id) => `http://localhost:8000/api/users/team-lead/${id}/`, // Example
  updateStaffMember: (id) => `http://localhost:8000/api/users/staff-member/${id}/`, // Example
  deleteStaffMember: (id) => `http://localhost:8000/api/users/staff-member/${id}/`, // Example
  updateAccountant: (id) => `http://localhost:8000/api/users/accountant/${id}/`, // Example
  deleteAccountant: (id) => `http://localhost:8000/api/users/accountant/${id}/`, // Example
};

const CreateMembers = () => {
  const [activeTab, setActiveTab] = useState("Team-leads");
  const [selectedMenuItem, setSelectedMenuItem] = useState("create member");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateTeamLeadModal, setShowCreateTeamLeadModal] = useState(false);
  const [showCreateStaffModal, setShowCreateStaffModal] = useState(false);
  const [showCreateAccountantModal, setShowCreateAccountantModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [teamLeads, setTeamLeads] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [accountants, setAccountants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [activeRequestTab, setActiveRequestTab] = useState("Client Request"); // Unused
  // const [activeSubTab, setActiveSubTab] = useState("Task Request"); // Unused
  const [requestSubTab, setRequestSubTab] = useState("customPlans");

  // States for Edit/Delete
  const [editingUser, setEditingUser] = useState(null); // { user: object, type: 'Team-leads' | 'Staff-members' | 'Accountant' }
  const [showEditModal, setShowEditModal] = useState(false);
  const [cardOptionsMenuOpen, setCardOptionsMenuOpen] = useState(null); // Stores the ID of the user whose menu is open


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

  const fetchData = async (url, setterFunction, entityName) => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Access token not found. Please log in.");
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Failed to fetch ${entityName}: ${res.statusText}`);
    const data = await res.json();
    const entities = Array.isArray(data) ? data : data.results || [];
    // console.log(`Fetched ${entityName}:`, entities);
    setterFunction(entities);
    return entities;
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchData(API_ENDPOINTS.fetchTeamLeads, setTeamLeads, "team leads"),
          fetchData(API_ENDPOINTS.fetchStaffMembers, setStaffMembers, "staff members"),
          fetchData(API_ENDPOINTS.fetchAccountants, setAccountants, "accountants"),
        ]);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "An unknown error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const createEntityRequest = async (url, userData, entityName) => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Access token not found.");
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorBody = await response.text().catch(() => "Unknown error body");
      throw new Error(`Failed to create ${entityName}: ${response.status} ${response.statusText} - ${errorBody}`);
    }
    return response.json();
  };

  const handleCreateSubmit = (createFn, fetchFn, setterFn, closeModalFn, entityName) => {
    return async (userData) => {
      try {
        await createFn(userData);
        closeModalFn(false);
        const updatedList = await fetchFn(); // Re-fetch the specific list
        setterFn(updatedList); // Update state with the fresh list
        alert(`${entityName} created successfully!`);
      } catch (error) {
        console.error(`${entityName} Creation failed:`, error);
        alert(`Failed to create ${entityName}: ${error.message}`);
      }
    };
  };

  const handleCreateTeamLeadSubmit = handleCreateSubmit(
    (data) => createEntityRequest(API_ENDPOINTS.createTeamLead, data, "Team Lead"),
    () => fetchData(API_ENDPOINTS.fetchTeamLeads, setTeamLeads, "team leads"), // Pass setter to fetchData
    setTeamLeads,
    setShowCreateTeamLeadModal,
    "Team Lead"
  );

  const handleCreateStaffSubmit = handleCreateSubmit(
    (data) => createEntityRequest(API_ENDPOINTS.createStaff, data, "Staff Member"),
    () => fetchData(API_ENDPOINTS.fetchStaffMembers, setStaffMembers, "staff members"),
    setStaffMembers,
    setShowCreateStaffModal,
    "Staff Member"
  );

  const handleCreateAccountantSubmit = handleCreateSubmit(
    (data) => createEntityRequest(API_ENDPOINTS.createAccountant, data, "Accountant"),
    () => fetchData(API_ENDPOINTS.fetchAccountants, setAccountants, "accountants"),
    setAccountants,
    setShowCreateAccountantModal,
    "Accountant"
  );

  // --- Edit User Logic ---
    const handleOpenEditModal = (userToEdit, userType) => {
        // Pre-fill form data for the modal
        // The 'name' and 'email' for TeamLead/Accountant usually come directly from user object.
        // For Staff, 'name' and 'email' might be direct or under a 'user' sub-object.
        // 'designation' is direct. 'team_lead' for staff needs to be the ID.

        let initialEditData = {
            name: userToEdit.name || userToEdit.user?.username || "",
            email: userToEdit.email || userToEdit.user?.email || "",
            designation: userToEdit.designation || "",
        };

        if (userType === "Staff-members") {
            // For staff, team_lead should be the ID of the team lead
            initialEditData.team_lead = typeof userToEdit.team_lead === 'object' && userToEdit.team_lead !== null
                                       ? userToEdit.team_lead.id
                                       : userToEdit.team_lead; // Assumes it's already an ID if not an object
        }
        
        setEditingUser({ user: { ...userToEdit, ...initialEditData }, type: userType });
        setShowEditModal(true);
        setCardOptionsMenuOpen(null);
    };


    const handleUpdateUserSubmit = async (updatedFormData) => {
        if (!editingUser) return;

        const { user: originalUser, type: userType } = editingUser;
        let updateUrl;
        let fetchFn;
        let setterFn;
        let entityNameForAlert;

        // Construct payload based on what backend expects
        // The 'name' from form might need to be 'username' for backend user model
        // 'email' is likely 'email'
        // 'designation' is direct
        // 'team_lead' for staff should be the ID
        const payload = {
            name: updatedFormData.name, // Or username: updatedFormData.name if backend user model has username
            email: updatedFormData.email,
            designation: updatedFormData.designation,
        };
        if (userType === "Staff-members") {
            payload.team_lead = updatedFormData.team_lead; // Modal should provide this as ID
        }


        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("Access token not found.");

            if (userType === "Team-leads") {
                updateUrl = API_ENDPOINTS.updateTeamLead(originalUser.id);
                fetchFn = () => fetchData(API_ENDPOINTS.fetchTeamLeads, setTeamLeads, "team leads");
                setterFn = setTeamLeads;
                entityNameForAlert = "Team Lead";
            } else if (userType === "Staff-members") {
                updateUrl = API_ENDPOINTS.updateStaffMember(originalUser.id);
                fetchFn = () => fetchData(API_ENDPOINTS.fetchStaffMembers, setStaffMembers, "staff members");
                setterFn = setStaffMembers;
                entityNameForAlert = "Staff Member";
            } else if (userType === "Accountant") {
                updateUrl = API_ENDPOINTS.updateAccountant(originalUser.id);
                fetchFn = () => fetchData(API_ENDPOINTS.fetchAccountants, setAccountants, "accountants");
                setterFn = setAccountants;
                entityNameForAlert = "Accountant";
            } else {
                throw new Error("Invalid user type for update.");
            }
            
            const response = await fetch(updateUrl, {
                method: "PUT", // Or PATCH
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response.text().catch(() => "Unknown error body");
                throw new Error(`Failed to update ${entityNameForAlert}: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            setShowEditModal(false);
            setEditingUser(null);
            const updatedList = await fetchFn();
            setterFn(updatedList);
            alert(`${entityNameForAlert} updated successfully!`);

        } catch (error) {
            console.error("User Update failed:", error);
            alert(`Failed to update ${entityNameForAlert || 'User'}: ${error.message}`);
        }
    };

    // --- Delete User Logic ---
    const handleDeleteUser = async (userId, userType) => {
        setCardOptionsMenuOpen(null);
        if (!window.confirm(`Are you sure you want to delete this ${userType.replace('-', ' ').slice(0, -1)}? This action cannot be undone.`)) {
            return;
        }

        let deleteUrl;
        let fetchFn;
        let setterFn;
        let entityNameForAlert;

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("Access token not found.");

            if (userType === "Team-leads") {
                deleteUrl = API_ENDPOINTS.deleteTeamLead(userId);
                fetchFn = () => fetchData(API_ENDPOINTS.fetchTeamLeads, setTeamLeads, "team leads");
                setterFn = setTeamLeads; // Not strictly needed if fetchFn updates state, but good for clarity
                entityNameForAlert = "Team Lead";
            } else if (userType === "Staff-members") {
                deleteUrl = API_ENDPOINTS.deleteStaffMember(userId);
                fetchFn = () => fetchData(API_ENDPOINTS.fetchStaffMembers, setStaffMembers, "staff members");
                setterFn = setStaffMembers;
                entityNameForAlert = "Staff Member";
            } else if (userType === "Accountant") {
                deleteUrl = API_ENDPOINTS.deleteAccountant(userId);
                fetchFn = () => fetchData(API_ENDPOINTS.fetchAccountants, setAccountants, "accountants");
                setterFn = setAccountants;
                entityNameForAlert = "Accountant";
            } else {
                throw new Error("Invalid user type for deletion.");
            }

            const response = await fetch(deleteUrl, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            // APIs often return 204 No Content on successful DELETE
            if (!response.ok && response.status !== 204) {
                const errorBody = await response.text().catch(() => "Unknown error body");
                throw new Error(`Failed to delete ${entityNameForAlert}: ${response.status} ${response.statusText} - ${errorBody}`);
            }
            
            const updatedList = await fetchFn(); // Re-fetch to update the list
            // setterFn(updatedList); // fetchFn now handles setting state
            alert(`${entityNameForAlert} deleted successfully!`);

        } catch (error) {
            console.error("User Deletion failed:", error);
            alert(`Failed to delete ${entityNameForAlert || 'User'}: ${error.message}`);
        }
    };


  function getUsersByTab() {
    let users;
    if (activeTab === "Team-leads") users = teamLeads;
    else if (activeTab === "Staff-members") users = staffMembers;
    else if (activeTab === "Accountant") users = accountants;
    else if (activeTab === "Clients") users = [];
    else users = [];

    if (!searchTerm.trim()) return users;

    return users.filter((user) => {
      const term = searchTerm.toLowerCase();
      const name = user?.name?.toLowerCase() || user?.user?.username?.toLowerCase() || "";
      const email = user?.email?.toLowerCase() || user?.user?.email?.toLowerCase() || "";
      let staffTeamLeadNameInfo = "";
      if (activeTab === 'Staff-members') {
          const leadIdToFind = typeof user?.team_lead === 'object' ? user?.team_lead?.id : user?.team_lead;
          if (leadIdToFind) {
              const foundLead = teamLeads.find(lead => lead.id === leadIdToFind);
              staffTeamLeadNameInfo = foundLead?.name?.toLowerCase() || foundLead?.user?.username?.toLowerCase() || "";
          } else if (user?.team_lead_name) {
            staffTeamLeadNameInfo = user.team_lead_name.toLowerCase();
          }
      }
      return name.includes(term) || email.includes(term) || staffTeamLeadNameInfo.includes(term);
    });
  }

  const usersToDisplay = getUsersByTab();

  const renderUserList = () => {
    if (isLoading) return <div className="text-center p-10">Loading users...</div>;
    if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

    let currentTabUsersAll;
    if (activeTab === "Team-leads") currentTabUsersAll = teamLeads;
    else if (activeTab === "Staff-members") currentTabUsersAll = staffMembers;
    else if (activeTab === "Accountant") currentTabUsersAll = accountants;
    else currentTabUsersAll = [];

    if (currentTabUsersAll.length === 0 && !searchTerm) {
      const addUserButtonText = `+ Add ${activeTab.replace('-', ' ').slice(0, -1)}`;
      return (
        <div className="flex flex-col justify-center items-center bg-white rounded-xl shadow p-6 text-center">
          <img src={emptyImage} alt="Empty" className="w-20 h-20 mb-4 opacity-60" />
          <p className="text-gray-500 mb-4">No {activeTab.toLowerCase().replace('-', ' ')} created yet.</p>
          <button
            onClick={() => {
              if (activeTab === "Team-leads") setShowCreateTeamLeadModal(true);
              else if (activeTab === "Staff-members") setShowCreateStaffModal(true);
              else if (activeTab === "Accountant") setShowCreateAccountantModal(true);
            }}
            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-200"
          > {addUserButtonText} </button>
        </div>
      );
    }
    
    if (usersToDisplay.length === 0 && searchTerm) {
      return (
        <div className="flex flex-col justify-center items-center bg-white rounded-xl shadow p-6 text-center">
          <img src={emptyImage} alt="No results" className="w-20 h-20 mb-4 opacity-60" />
          <p className="text-gray-500 mb-4">No {activeTab.toLowerCase().replace('-', ' ')} found matching "{searchTerm}".</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {usersToDisplay.map((item, index) => {
          const itemName = item?.name || item?.user?.username || "N/A";
          const itemEmail = item?.email || item?.user?.email || "N/A";
          let itemDesignation = item?.designation || "";
          let teamLeadDisplayInfo = null;

          if (activeTab === "Team-leads") {
            itemDesignation = item.designation || "Team Lead";
          } else if (activeTab === "Staff-members") {
            itemDesignation = item.designation || "Staff Member";
            let leadName = "N/A";
            if (typeof item.team_lead === 'object' && item.team_lead !== null) {
                leadName = item.team_lead.name || item.team_lead.username || "N/A";
            } else if (typeof item.team_lead === 'string' && item.team_lead) { 
                const foundLead = teamLeads.find(lead => lead.id === item.team_lead);
                leadName = foundLead?.name || foundLead?.user?.username || "N/A";
            } else if (item.team_lead_name) { // If API returns a direct name like 'Sub: Arjun'
                leadName = item.team_lead_name;
            }
            // Check if the image shows "Sub: Arjun" or similar. If so, and your data for staff
            // has a `sub_to` (or similar) field with the team lead's name, use that.
            // Example: if item has item.sub_to_lead = "Arjun"
            // leadName = item.sub_to_lead || leadName;
            // For now, using the example from image "Sub: Arjun"
            if(item.team_lead_name_display) { // You might need to add this field to your staff data from backend
                teamLeadDisplayInfo = <p className="text-xs text-gray-500 mt-1">{item.team_lead_name_display}</p>;
            } else {
                teamLeadDisplayInfo = <p className="text-xs text-gray-500 mt-1">Team Lead: {leadName}</p>;
            }


          } else if (activeTab === "Accountant") {
            itemDesignation = "Accountant";
          } else if (activeTab === "Clients") {
            itemDesignation = "Client";
          }

          return (
            <div key={item.id || itemEmail || index} className="bg-white shadow rounded-xl overflow-hidden flex flex-col relative">
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex justify-center items-center text-gray-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-md font-semibold">{itemName}</h3>
                      <p className="text-sm text-gray-500">{itemDesignation}</p>
                      <p className="text-sm text-gray-400">{itemEmail}</p>
                      {teamLeadDisplayInfo}
                    </div>
                  </div>
                  <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setCardOptionsMenuOpen(cardOptionsMenuOpen === item.id ? null : item.id);
                        }}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>
                    {cardOptionsMenuOpen === item.id && (
                        <div
                            className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-20 border border-gray-200 py-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => handleOpenEditModal(item, activeTab)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                                <Edit3 size={14} /> Edit User
                            </button>
                            <button
                                onClick={() => handleDeleteUser(item.id, activeTab)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <Trash2 size={14} /> Delete User
                            </button>
                        </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 hover:bg-blue-100 px-4 py-2 text-center text-blue-600 font-medium cursor-pointer border-t border-blue-200">
                View Profile
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Close options menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
        // A more robust check might involve checking if the click target is outside all card option menus
        if (cardOptionsMenuOpen && !event.target.closest('.relative > button > svg') && !event.target.closest('.absolute.right-0.mt-2')) {
            setCardOptionsMenuOpen(null);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cardOptionsMenuOpen]);


  return (
    <div className="flex h-screen py-4 bg-white overflow-hidden relative">
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
                <span className="flex items-center gap-3"> <Icon className="w-4 h-4" /> {name} </span>
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
            <User className="w-4 h-4" /> Manager
          </button>
          <button className="w-full flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

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
                > <UserPlus size={18}/> Add User </button>
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-20 border py-1">
                    <ul>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                            onClick={() => { setShowCreateTeamLeadModal(true); setShowDropdown(false); }}> Team Lead </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                            onClick={() => { setShowCreateStaffModal(true); setShowDropdown(false); }}> Staff Member </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                            onClick={() => { setShowCreateAccountantModal(true); setShowDropdown(false); }}> Accountant </li>
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
                  onClick={() => { setActiveTab(tab); setSearchTerm(""); setCardOptionsMenuOpen(null); }}
                  className={`pb-2 text-sm sm:text-base ${
                    activeTab === tab
                      ? "border-b-2 border-blue-500 font-semibold text-blue-600"
                      : "text-gray-600 hover:text-blue-500 hover:border-b-2 hover:border-gray-300"
                  }`}
                > {tab} </button>
              ))}
            </div>
            {renderUserList()}
          </>
        ) : selectedMenuItem === "Approvals" ? ( <ActivatedPayments /> )
          : selectedMenuItem === "Dashboard" ? ( <WorkspaceCard /> )
          : selectedMenuItem === "clients services" ? ( <DomainHostingTableManager /> )
          : selectedMenuItem === "Request" ? (
            <>
                <div className="inline-flex items-center gap-1 p-1 mb-4 bg-gradient-to-br from-white to-neutral-100 rounded-full shadow">
                <button className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold"> Client Request </button>
                <button className="px-5 py-2 text-gray-700 rounded-full text-sm font-medium flex items-center gap-2">
                    Team Lead Request <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#BDD9FE] to-[#223E65] text-white text-xs flex items-center justify-center">02</span>
                </button>
                </div>
                <div className="flex gap-6 mb-4 text-sm font-semibold">
                <button
                    onClick={() => setRequestSubTab("customPlans")}
                    className={`pb-1 ${requestSubTab === "customPlans" ? "text-gray-800 border-b-2 border-gray-700" : "text-gray-400"}`}
                > Custom plans <span className="ml-1 rounded-full bg-gradient-to-br from-[#BDD9FE] to-[#223E65] text-white px-2 text-xs">02</span> </button>
                <button
                    onClick={() => setRequestSubTab("taskRequest")}
                    className={`pb-1 ${requestSubTab === "taskRequest" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"}`}
                > Task Request </button>
                </div>
                <div className="bg-white rounded-xl shadow p-4 mt-2">
                {requestSubTab === "customPlans" ? <PlanRequests type="custom" /> : <PlanRequests type="task" />}
                </div>
            </>
        ) : ( <div className="flex-1 flex items-center justify-center h-full text-gray-600 text-lg"> This is the {selectedMenuItem} panel. </div> )}
      </main>

      {/* Create Modals */}
      {showCreateTeamLeadModal && (
        <Modal
          title="Create Team Lead"
          fields={[
            { type: "select", placeholder: "Designation", options: ["Manager", "Senior Lead"], name: "designation", required: true },
            { type: "text", placeholder: "Name", name: "name", required: true },
            { type: "email", placeholder: "Email id", name: "email", required: true },
          ]}
          onClose={() => setShowCreateTeamLeadModal(false)}
          onSubmit={handleCreateTeamLeadSubmit}
          submitButtonText="Create User"
        />
      )}
      {showCreateStaffModal && (
        <Modal
          title="Create Staff Member"
          fields={[
            {
              type: "select", placeholder: "Select Team Lead",
              options: teamLeads.map(tl => ({ value: tl.id, label: tl.name || tl.user?.username || `Lead ID: ${tl.id}` })),
              name: "team_lead", required: true
            },
            { type: "select", placeholder: "Designation", options: ["Senior Staff", "Junior Staff", "UI/UX Designer"], name: "designation", required: true },
            { type: "text", placeholder: "Name", name: "name", required: true },
            { type: "email", placeholder: "Email id", name: "email", required: true },
          ]}
          onClose={() => setShowCreateStaffModal(false)}
          onSubmit={handleCreateStaffSubmit}
          submitButtonText="Create User"
        />
      )}
      {showCreateAccountantModal && (
        <Modal
          title="Create Accountant"
          fields={[
            { type: "text", placeholder: "Name", name: "name", required: true },
            { type: "email", placeholder: "Email id", name: "email", required: true },
          ]}
          onClose={() => setShowCreateAccountantModal(false)}
          onSubmit={handleCreateAccountantSubmit}
          submitButtonText="Create User"
        />
      )}

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <Modal
            title={`Edit ${editingUser.type.replace('-', ' ').slice(0, -1)}`}
            initialData={editingUser.user} // Pass existing data to pre-fill
            fields={
                editingUser.type === "Team-leads" ? [
                    { type: "select", placeholder: "Designation", options: ["Manager", "Senior Lead"], name: "designation", required: true },
                    { type: "text", placeholder: "Name", name: "name", required: true },
                    { type: "email", placeholder: "Email id", name: "email", required: true },
                ] : editingUser.type === "Staff-members" ? [
                    {
                        type: "select", placeholder: "Select Team Lead",
                        options: teamLeads.map(tl => ({ value: tl.id, label: tl.name || tl.user?.username || `Lead ID: ${tl.id}` })),
                        name: "team_lead", required: true
                    },
                    { type: "select", placeholder: "Designation", options: ["Senior Staff", "Junior Staff", "UI/UX Designer"], name: "designation", required: true },
                    { type: "text", placeholder: "Name", name: "name", required: true },
                    { type: "email", placeholder: "Email id", name: "email", required: true },
                ] : [ // Accountant
                    { type: "text", placeholder: "Name", name: "name", required: true },
                    { type: "email", placeholder: "Email id", name: "email", required: true },
                ]
            }
            onClose={() => { setShowEditModal(false); setEditingUser(null); }}
            onSubmit={handleUpdateUserSubmit}
            submitButtonText="Update User"
        />
      )}
    </div>
  );
};

const Modal = ({ title, onClose, fields, onSubmit, initialData = {}, submitButtonText = "Submit" }) => {
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Initialize formData based on fields and initialData
        const data = fields.reduce((acc, field) => {
            acc[field.name] = initialData[field.name] || (field.type === 'select' && field.options && field.options.length > 0 ? '' : "");
            return acc;
        }, {});
        setFormData(data);
        setFormErrors({});
        setIsSubmitting(false);
    }, [/*fields, title, initialData*/]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({...prev, [name]: null}));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.placeholder || field.name} is required.`;
        isValid = false;
      }
      if (field.type === 'email' && formData[field.name] && !/\S+@\S+\.\S+/.test(formData[field.name])) {
        errors[field.name] = 'Invalid email format.';
        isValid = false;
      }
    });
    setFormErrors(errors);
    return isValid;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
          await onSubmit(formData);
      } catch (submitError) {
          console.error("Submission error in Modal:", submitError);
           // Optionally, display a generic error message in the modal
           setFormErrors(prev => ({ ...prev, _general: submitError.message || "An error occurred." }));
      } finally {
           setIsSubmitting(false);
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-xl relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {formErrors._general && <p className="text-red-500 text-sm mb-2">{formErrors._general}</p>}
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
                    {field.options && field.options.map((opt, idx) => (
                      opt ?
                      (typeof opt === 'string' ?
                      <option key={idx} value={opt}>{opt}</option> :
                      <option key={opt.value || idx} value={opt.value}>{opt.label}</option>)
                      : null
                    ))}
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
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              > Cancel </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              > {isSubmitting ? 'Submitting...' : submitButtonText} </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMembers;