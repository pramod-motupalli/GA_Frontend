import React, { useState, useEffect, useMemo } from "react";
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
  updateTeamLead: (id) => `http://localhost:8000/api/users/team-lead/${id}/`,
  deleteTeamLead: (id) => `http://localhost:8000/api/users/team-lead/${id}/`,
  updateStaffMember: (id) => `http://localhost:8000/api/users/staff-member/${id}/`,
  deleteStaffMember: (id) => `http://localhost:8000/api/users/staff-member/${id}/`,
  updateAccountant: (id) => `http://localhost:8000/api/users/accountant/${id}/`,
  deleteAccountant: (id) => `http://localhost:8000/api/users/accountant/${id}/`,
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
  
  // State for the "Request" section
  const [requestSubTab, setRequestSubTab] = useState("customPlans");
  const [activeRequestType, setActiveRequestType] = useState("client"); // "client" or "teamLead"

  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [cardOptionsMenuOpen, setCardOptionsMenuOpen] = useState(null);


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

  const handleCreateSubmit = (createFn, fetchFnWhichUpdatesState, closeModalFn, entityName) => {
    return async (userData) => {
      try {
        await createFn(userData);
        closeModalFn(false);
        await fetchFnWhichUpdatesState(); 
        alert(`${entityName} created successfully!`);
      } catch (error) {
        console.error(`${entityName} Creation failed:`, error);
        throw error; 
      }
    };
  };

  const handleCreateTeamLeadSubmit = handleCreateSubmit(
    (data) => createEntityRequest(API_ENDPOINTS.createTeamLead, data, "Team Lead"),
    () => fetchData(API_ENDPOINTS.fetchTeamLeads, setTeamLeads, "team leads"),
    setShowCreateTeamLeadModal,
    "Team Lead"
  );

  const handleCreateStaffSubmit = handleCreateSubmit(
    (data) => createEntityRequest(API_ENDPOINTS.createStaff, data, "Staff Member"),
    () => fetchData(API_ENDPOINTS.fetchStaffMembers, setStaffMembers, "staff members"),
    setShowCreateStaffModal,
    "Staff Member"
  );

  const handleCreateAccountantSubmit = handleCreateSubmit(
    (data) => createEntityRequest(API_ENDPOINTS.createAccountant, data, "Accountant"),
    () => fetchData(API_ENDPOINTS.fetchAccountants, setAccountants, "accountants"),
    setShowCreateAccountantModal,
    "Accountant"
  );

    const handleOpenEditModal = (userToEdit, userType) => {
        let initialEditData = {
            name: userToEdit.name || userToEdit.user?.username || "",
            email: userToEdit.email || userToEdit.user?.email || "",
            // Include original ID for update reference if it's not part of userToEdit directly
            id: userToEdit.id,
        };

        if (userType === "Team-leads" || userType === "Staff-members") {
            initialEditData.designation = userToEdit.designation || "";
        }
        
        if (userType === "Staff-members") {
            // Ensure team_lead is the ID, not the object, for the form
             initialEditData.team_lead = typeof userToEdit.team_lead === 'object' && userToEdit.team_lead !== null
                                       ? userToEdit.team_lead.id
                                       : userToEdit.team_lead; 
        }
        
        setEditingUser({ user: { ...userToEdit, ...initialEditData }, type: userType });
        setShowEditModal(true);
        setCardOptionsMenuOpen(null);
    };

    const handleUpdateUserSubmit = async (updatedFormData) => {
        if (!editingUser) return;

        const { user: originalUser, type: userType } = editingUser;
        let updateUrl;
        let fetchFnToUpdateState; 
        let entityNameForAlert;

        // Construct payload carefully, ensuring all required fields for the specific user type are present
        const payload = {
            // Common fields - ensure your backend expects 'name' or 'username'
            name: updatedFormData.name, // Assuming backend expects 'name' for updates
            email: updatedFormData.email,
        };

        if (userType === "Team-leads") {
            payload.designation = updatedFormData.designation;
            updateUrl = API_ENDPOINTS.updateTeamLead(originalUser.id);
            fetchFnToUpdateState = () => fetchData(API_ENDPOINTS.fetchTeamLeads, setTeamLeads, "team leads");
            entityNameForAlert = "Team Lead";
        } else if (userType === "Staff-members") {
            payload.designation = updatedFormData.designation;
            payload.team_lead = updatedFormData.team_lead; // Ensure this is the ID
            updateUrl = API_ENDPOINTS.updateStaffMember(originalUser.id);
            fetchFnToUpdateState = () => fetchData(API_ENDPOINTS.fetchStaffMembers, setStaffMembers, "staff members");
            entityNameForAlert = "Staff Member";
        } else if (userType === "Accountant") {
            // Accountants might not have designation or team_lead, adjust payload as needed
            updateUrl = API_ENDPOINTS.updateAccountant(originalUser.id);
            fetchFnToUpdateState = () => fetchData(API_ENDPOINTS.fetchAccountants, setAccountants, "accountants");
            entityNameForAlert = "Accountant";
        } else {
            throw new Error("Invalid user type for update.");
        }
        
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("Access token not found.");
            
            const response = await fetch(updateUrl, {
                method: "PUT", 
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({ detail: "Unknown error body" }));
                const errorMessage = Object.values(errorBody).flat().join(' ') || `Failed to update ${entityNameForAlert}`;
                throw new Error(`${errorMessage} (Status: ${response.status})`);
            }

            setShowEditModal(false);
            setEditingUser(null);
            await fetchFnToUpdateState(); 
            alert(`${entityNameForAlert} updated successfully!`);

        } catch (error) {
            console.error("User Update failed:", error);
            throw error; 
        }
    };

    const handleDeleteUser = async (userId, userType) => {
        setCardOptionsMenuOpen(null);
        const userTypeNameForConfirm = userType.replace('-', ' ').replace(/s$/, ''); // "Team-lead" -> "Team lead"
        if (!window.confirm(`Are you sure you want to delete this ${userTypeNameForConfirm}? This action cannot be undone.`)) {
            return;
        }

        let deleteUrl;
        let fetchFnToUpdateState; 
        let entityNameForAlert;

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("Access token not found.");

            if (userType === "Team-leads") {
                deleteUrl = API_ENDPOINTS.deleteTeamLead(userId);
                fetchFnToUpdateState = () => fetchData(API_ENDPOINTS.fetchTeamLeads, setTeamLeads, "team leads");
                entityNameForAlert = "Team Lead";
            } else if (userType === "Staff-members") {
                deleteUrl = API_ENDPOINTS.deleteStaffMember(userId);
                fetchFnToUpdateState = () => fetchData(API_ENDPOINTS.fetchStaffMembers, setStaffMembers, "staff members");
                entityNameForAlert = "Staff Member";
            } else if (userType === "Accountant") {
                deleteUrl = API_ENDPOINTS.deleteAccountant(userId);
                fetchFnToUpdateState = () => fetchData(API_ENDPOINTS.fetchAccountants, setAccountants, "accountants");
                entityNameForAlert = "Accountant";
            } else {
                throw new Error("Invalid user type for deletion.");
            }

            const response = await fetch(deleteUrl, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok && response.status !== 204) { 
                const errorBody = await response.text().catch(() => "Unknown error body");
                throw new Error(`Failed to delete ${entityNameForAlert}: ${response.status} ${response.statusText} - ${errorBody}`);
            }
            
            await fetchFnToUpdateState(); 
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
      if (activeTab === 'Staff-members' && user.team_lead) { 
          const leadIdToFind = typeof user.team_lead === 'object' ? user.team_lead.id : user.team_lead;
          if (leadIdToFind) {
              const foundLead = teamLeads.find(lead => lead.id === leadIdToFind);
              staffTeamLeadNameInfo = foundLead?.name?.toLowerCase() || foundLead?.user?.username?.toLowerCase() || "";
          } else if (user.team_lead_name) { 
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
            if (item.team_lead) { 
                if (typeof item.team_lead === 'object' && item.team_lead !== null) {
                    leadName = item.team_lead.name || item.team_lead.username || "N/A";
                } else if (item.team_lead) { 
                    const foundLead = teamLeads.find(lead => lead.id === item.team_lead);
                    leadName = foundLead?.name || foundLead?.user?.username || "N/A";
                }
            } else if (item.team_lead_name) { 
                leadName = item.team_lead_name;
            }
            teamLeadDisplayInfo = <p className="text-xs text-gray-500 mt-1">{`Team Lead: ${leadName}`}</p>;
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
                      <p className="text-sm text-gray-400 break-all">{itemEmail}</p>
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
  
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (cardOptionsMenuOpen && !event.target.closest('.relative > button > svg') && !event.target.closest('.absolute.right-0.mt-2')) {
            setCardOptionsMenuOpen(null);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cardOptionsMenuOpen]);

  const teamLeadCreateFields = useMemo(() => [
    { type: "select", placeholder: "Designation", options: ["Manager", "Senior Lead"], name: "designation", required: true },
    { type: "text", placeholder: "Name", name: "name", required: true },
    { type: "email", placeholder: "Email id", name: "email", required: true },
  ], []);

  const staffCreateFields = useMemo(() => [
    {
      type: "select", placeholder: "Select Team Lead",
      options: teamLeads.map(tl => ({ value: tl.id, label: tl.name || tl.user?.username || `Lead ID ${tl.id}` })),
      name: "team_lead", required: true
    },
    { type: "select", placeholder: "Designation", options: ["Senior Staff", "Junior Staff", "UI/UX Designer"], name: "designation", required: true },
    { type: "text", placeholder: "Name", name: "name", required: true },
    { type: "email", placeholder: "Email id", name: "email", required: true },
  ], [teamLeads]);

  const accountantCreateFields = useMemo(() => [
    { type: "text", placeholder: "Name", name: "name", required: true },
    { type: "email", placeholder: "Email id", name: "email", required: true },
  ], []);

  const editModalFields = useMemo(() => {
    if (!editingUser) return []; 

    if (editingUser.type === "Team-leads") {
      return [
        { type: "select", placeholder: "Designation", options: ["Manager", "Senior Lead"], name: "designation", required: true },
        { type: "text", placeholder: "Name", name: "name", required: true },
        { type: "email", placeholder: "Email id", name: "email", required: true },
      ];
    } else if (editingUser.type === "Staff-members") {
      return [
        {
          type: "select", placeholder: "Select Team Lead",
          options: teamLeads.map(tl => ({ value: tl.id, label: tl.name || tl.user?.username || `Lead ID: ${tl.id}` })),
          name: "team_lead", required: true
        },
        { type: "select", placeholder: "Designation", options: ["Senior Staff", "Junior Staff", "UI/UX Designer"], name: "designation", required: true },
        { type: "text", placeholder: "Name", name: "name", required: true },
        { type: "email", placeholder: "Email id", name: "email", required: true },
      ];
    } else if (editingUser.type === "Accountant") { 
      return [
        { type: "text", placeholder: "Name", name: "name", required: true },
        { type: "email", placeholder: "Email id", name: "email", required: true },
      ];
    }
    return [];
  }, [editingUser, teamLeads]);

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
                > {tab.replace('-', ' ')} </button>
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
                <button
                    onClick={() => setActiveRequestType("client")}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                        activeRequestType === "client"
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                > Client Request </button>
                <button
                    onClick={() => setActiveRequestType("teamLead")}
                    className={`px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
                        activeRequestType === "teamLead"
                        ? "bg-blue-600 text-white" // Or another active style if preferred
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                    Team Lead Request
                    <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center transition-colors ${
                        activeRequestType === "teamLead"
                        ? "bg-blue-800 text-white" // Darker shade for active badge
                        : "bg-gradient-to-br from-[#BDD9FE] to-[#223E65] text-white"
                    }`}>02</span>
                </button>
                </div>

                {activeRequestType === "client" && (
                    <>
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
                )}
                {activeRequestType === "teamLead" && (
                    <div className="flex-1 flex items-center justify-center h-full text-gray-500 text-lg bg-white rounded-xl shadow p-10">
                        Content for Team Lead Requests will be displayed here. <br/> (This section is currently empty or under development)
                    </div>
                )}
            </>
        ) : ( <div className="flex-1 flex items-center justify-center h-full text-gray-600 text-lg"> This is the {selectedMenuItem} panel. </div> )}
      </main>

      {/* Create Modals */}
      {showCreateTeamLeadModal && (
        <Modal
          title="Create Team Lead"
          fields={teamLeadCreateFields} 
          onClose={() => setShowCreateTeamLeadModal(false)}
          onSubmit={handleCreateTeamLeadSubmit}
          submitButtonText="Create User"
        />
      )}
      {showCreateStaffModal && (
        <Modal
          title="Create Staff Member"
          fields={staffCreateFields} 
          onClose={() => setShowCreateStaffModal(false)}
          onSubmit={handleCreateStaffSubmit}
          submitButtonText="Create User"
        />
      )}
      {showCreateAccountantModal && (
        <Modal
          title="Create Accountant"
          fields={accountantCreateFields} 
          onClose={() => setShowCreateAccountantModal(false)}
          onSubmit={handleCreateAccountantSubmit}
          submitButtonText="Create User"
        />
      )}

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <Modal
            title={`Edit ${editingUser.type.replace('-', ' ').replace(/s$/, '')}`} // Make singular
            initialData={editingUser.user}
            fields={editModalFields} 
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
        const defaultData = {};
        fields.forEach(field => {
            if (initialData.hasOwnProperty(field.name)) {
                defaultData[field.name] = initialData[field.name];
            } else {
                defaultData[field.name] = (field.type === 'select' && field.options?.length > 0 ? '' : ""); 
            }
        });
        setFormData(defaultData);
        setFormErrors({}); 
    }, [fields, initialData]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name] || formErrors._general) { 
      setFormErrors(prev => ({...prev, [name]: null, _general: null}));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    fields.forEach(field => {
      if (field.required && (formData[field.name] === undefined || formData[field.name] === null || formData[field.name].toString().trim() === '')) { 
        errors[field.name] = `${field.placeholder || field.name.replace(/_/g, ' ')} is required.`;
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
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormErrors(prev => ({ ...prev, _general: null })); 
    try {
        await onSubmit(formData);
        // onClose(); // Let parent component handle closing on success if needed for re-fetching data.
    } catch (submitError) {
        console.error("Submission error in Modal:", submitError);
        setFormErrors(prev => ({ ...prev, _general: submitError.message || "An unexpected error occurred." }));
    } finally {
        setIsSubmitting(false);
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
            {formErrors._general && <p className="text-red-500 text-sm mb-3 p-2 bg-red-50 rounded-md">{formErrors._general}</p>}
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
                    {field.options?.map((opt, idx) => ( 
                      opt ? 
                      (typeof opt === 'string' ?
                      <option key={idx} value={opt}>{opt}</option> :
                      <option key={opt.value ?? idx} value={opt.value}>{opt.label}</option>) 
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