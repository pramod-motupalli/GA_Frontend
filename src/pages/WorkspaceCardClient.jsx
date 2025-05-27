import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import settingsLogo from "../assets/logos/settings.svg"; // Adjust path as needed
import userLogo from "../assets/logos/user.svg"; // Adjust path as needed
import dotsverticalLogo from "../assets/logos/dots-vertical.svg"; // Adjust path as needed
// import PlanList from "./planSelectionPopup"; // Uncomment if this component is used

export default function Main() {
    // --- State ---
    const [workspaces, setWorkspaces] = useState([]);
    // Keeping filteredWorkspaces for potential future filtering implementation
    const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);
    const [menuOpenId, setMenuOpenId] = useState(null); // ID of workspace whose menu is open
    const [currentPage, setCurrentPage] = useState(1); // Current page for workspace pagination
    const [editId, setEditId] = useState(null); // ID of workspace currently being edited
    // State to hold values in edit form, includes all editable Workspace fields
    const [editValues, setEditValues] = useState({
        workspace_name: "",
        description: "",
        client_name: "",
        phone_number: "",
        email: "",
        assign_staff: "",
        hd_maintenance: "",
        is_workspace_activated: false, // Default to false
    });
    const [tableMode, setTableMode] = useState(false); // True for Task table view, False for Workspace cards view
    const [selectedWorkspace, setSelectedWorkspace] = useState(null); // Stores the workspace object when viewing its tasks
    const [showCreateRequestModal, setShowCreateRequestModal] = useState(false); // Controls Request modal visibility
    // State for the request form, mapping to Task model fields
    const [requestForm, setRequestForm] = useState({
        request: "", // Maps to backend 'title'
        scopeOfService: "", // Maps to backend 'description'
    });
    const [requests, setRequests] = useState([]); // Holds tasks fetched from backend for the selected workspace

    // --- Loading/Error States ---
    const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const [workspaceError, setWorkspaceError] = useState(null);
    const [taskError, setTaskError] = useState(null);

    // Unused states/refs - commented out for cleanup
    // const [selectAll, setSelectAll] = useState(false);
    // const [selectedIds, setSelectedIds] = useState([]);
    // const cardRefs = useRef({});
    // const [showPlanList, setShowPlanList] = useState(false);
    // const [isMonthly, setIsMonthly] = useState(true);
    // const monthlyPlans = []; // Define or remove if PlanList is removed
    // const yearlyPlans = []; // Define or remove if PlanList is removed
    // const plans = isMonthly ? monthlyPlans : yearlyPlans; // Define or remove
    // const billingType = isMonthly ? "monthly" : "yearly"; // Define or remove

    // Pagination constant for workspace cards
    const workspacesPerPage = 9;
     const token = localStorage.getItem("accessToken");

    // --- Effects ---

    // Fetch workspaces on mount
    useEffect(() => {
        setIsLoadingWorkspaces(true);
        setWorkspaceError(null);
        // Fetch from the Workspace ListCreate API endpoint
        axios
    .get("http://localhost:8000/api/users/workspaces/", {
        headers: {
            Authorization: `Bearer ${token}`,
            // Add any other custom headers here if needed
        },
    })
    .then((res) => {
        setWorkspaces(res.data);
        setFilteredWorkspaces(res.data); // Initialize filtered list
        setIsLoadingWorkspaces(false);
    })
    .catch((err) => {
        console.error("Failed to fetch workspaces:", err.response?.data || err.message);
        setWorkspaceError("Failed to load workspaces. Please try again.");
        setIsLoadingWorkspaces(false);
    });

    }, []); // Empty dependency array: runs only once on component mount

    // Fetch tasks when selectedWorkspace changes and tableMode is true
    useEffect(() => {
        // Check if tableMode is true and a workspace object with an ID is selected
        if (tableMode && selectedWorkspace?.id) {
            fetchTasksForSelectedWorkspace(selectedWorkspace.id);
        } else {
             // Clear tasks and errors when leaving table mode or no workspace is selected
             setRequests([]);
             setTaskError(null);
        }
        // Dependency array: re-run when tableMode changes or the selected workspace ID changes
    }, [tableMode, selectedWorkspace?.id]);


     // --- Helper Functions ---

     // Function to fetch tasks for a specific workspace ID
     const fetchTasksForSelectedWorkspace = async (workspaceId) => {
    setIsLoadingTasks(true);
    setTaskError(null);

    const token = localStorage.getItem("accessToken");

    try {
        const res = await axios.get(
            `http://localhost:8000/api/users/workspaces/${workspaceId}/tasks/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setRequests(res.data); // Set tasks fetched from backend
    } catch (err) {
        console.error(
            `Failed to fetch tasks for workspace ${workspaceId}:`,
            err.response?.data || err.message
        );
        setTaskError("Failed to load requests for this workspace. Please try again.");
    } finally {
        setIsLoadingTasks(false);
    }
};


    // --- Handlers ---

    // Placeholder for file handling
    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files.length === 0) return;
        console.log("Files selected:", files);
        // Implement actual file upload logic here if needed
        // This would typically involve creating FormData and sending a separate POST request
        // to a file upload endpoint, then associating the uploaded file with the task
        // after the task is created, or including it in the task creation request payload
        // if your backend supports it.
    };

    // Handles submitting the "Create Request" form
    const handleRequestSubmit = async () => {
    if (!selectedWorkspace?.id) {
        alert('Internal Error: No workspace selected for request submission.');
        console.error("Submission failed: No workspace selected.");
        return;
    }

    if (!requestForm.request.trim()) {
        alert('Subject is required.');
        return;
    }

    const payload = {
        title: requestForm.request.trim(),
        description: requestForm.scopeOfService.trim(),
    };

    const token = localStorage.getItem("accessToken");

    try {
        const res = await axios.post(
            `http://localhost:8000/api/users/workspaces/${selectedWorkspace.id}/tasks/`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Request submitted successfully:", res.data);
        fetchTasksForSelectedWorkspace(selectedWorkspace.id);
        setShowCreateRequestModal(false);
        setRequestForm({ request: "", scopeOfService: "" });
    } catch (error) {
        console.error("Error submitting request:", error.response?.data || error.message);
        const errorMessage =
            error.response?.data?.detail ||
            Object.values(error.response?.data || {}).flat().join(', ') ||
            'Failed to submit request.';
        alert(`Submission Failed: ${errorMessage}`);
    }
};



    // Edit workspace: open inputs and populate editValues state
    const handleEdit = (id) => {
        const ws = workspaces.find((w) => w.id === id);
        if (ws) { // Check if workspace object is found
            // Populate editValues with existing workspace data, handling potential nulls
            setEditValues({
                workspace_name: ws.workspace_name || '',
                description: ws.description || '',
                client_name: ws.client_name || '',
                phone_number: ws.phone_number || '',
                email: ws.email || '',
                assign_staff: ws.assign_staff || '',
                hd_maintenance: ws.hd_maintenance || '',
                is_workspace_activated: ws.is_workspace_activated || false, // Boolean default
            });
            setEditId(id); // Set the ID of the workspace being edited
            setMenuOpenId(null); // Close the options menu
        }
    };

    // Save edited workspace to server and update state
    const handleSave = async (id) => {
         // Simple validation check for workspace_name
        if (!editValues.workspace_name.trim()) {
            alert('Workspace Name is required.');
            return;
        }

        try {
            // PATCH request to the Workspace Detail View endpoint
            const res = await axios.patch(
                `http://localhost:8000/api/users/workspaces/${id}/`, // Use the correct detail URL with ID
                editValues // Send the entire editValues object
            );
            console.log("Workspace saved successfully:", res.data);

            // Update the workspace lists with the saved data
            setWorkspaces((prev) =>
                prev.map((ws) => (ws.id === id ? { ...ws, ...res.data } : ws))
            );
            setFilteredWorkspaces((prev) =>
                prev.map((ws) => (ws.id === id ? { ...ws, ...res.data } : ws))
            );

            setEditId(null); // Exit edit mode
            setEditValues({}); // Clear edit values state
             // alert("Workspace saved successfully."); // Removed alert for smoother UX

             // If the currently selected workspace was the one being edited, update it
             // This ensures the table view title updates immediately if the name changed
             if (selectedWorkspace && selectedWorkspace.id === id) {
                 setSelectedWorkspace(res.data);
             }

        } catch (err) {
            console.error("Error saving workspace:", err.response?.data || err.message);
            // Extract and display backend validation/error messages
            const errorMessage = err.response?.data?.detail || Object.values(err.response?.data || {}).flat().join(', ') || 'Failed to save workspace.';
             alert(`Save Failed: ${errorMessage}`);
        }
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditId(null); // Exit edit mode
        setEditValues({}); // Clear edit values
    };

    // Delete workspace
    const handleDelete = async (id) => {
        // Confirmation dialog
        if (!window.confirm("Are you sure you want to delete this workspace? This action cannot be undone.")) {
            return; // Stop if user cancels
        }
        try {
            // DELETE request to the Workspace Detail View endpoint
            await axios.delete(`http://localhost:8000/api/users/workspaces/${id}/`); // Use the correct detail URL with ID
            console.log("Workspace deleted:", id);

            // Update the workspace lists to remove the deleted item
            const remainingWorkspaces = workspaces.filter((ws) => ws.id !== id);
            setWorkspaces(remainingWorkspaces);
            setFilteredWorkspaces(remainingWorkspaces); // Update filtered list as well

            setMenuOpenId(null); // Close the menu
            // alert("Workspace deleted successfully."); // Removed alert

            // If the deleted workspace was the one currently viewed in table mode, switch back
            if (selectedWorkspace && selectedWorkspace.id === id) {
                 setTableMode(false);
                 setSelectedWorkspace(null);
                 setRequests([]); // Clear tasks from the removed workspace
                 setTaskError(null); // Clear task errors
            }
            // Recalculate pagination and adjust currentPage if the last item of the last page was deleted
             const newTotalPages = Math.ceil((remainingWorkspaces.length) / workspacesPerPage) || 1;
             setCurrentPage(prev => Math.min(prev, newTotalPages));


        } catch (err) {
            console.error("Error deleting workspace:", err.response?.data || err.message);
            const errorMessage = err.response?.data?.detail || 'Failed to delete workspace.';
             alert(`Deletion Failed: ${errorMessage}`);
        }
    };

    // Format workspace name for a hypothetical URL
    const formatWorkspaceUrl = (name) => {
         if (!name) return '';
        // Replace spaces with hyphens, convert to lowercase, add .com
        // Remove characters that are not letters, numbers, or hyphens
        return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + ".com";
    };

    // --- Pagination Logic (for workspace cards) ---
    // Use filteredWorkspaces for pagination if filtering is active, otherwise use workspaces
    const workspacesToPaginate = filteredWorkspaces;
    const totalPages = Math.ceil(workspacesToPaginate.length / workspacesPerPage);
    // Ensure currentPage doesn't exceed totalPages after data changes
    // This useEffect ensures the page is reset if the total pages decrease below the current page
    useEffect(() => {
        const newTotalPages = Math.ceil(filteredWorkspaces.length / workspacesPerPage) || 1;
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        } else if (currentPage === 0 && newTotalPages > 0) {
             setCurrentPage(1); // Ensure page is 1 if data becomes available
        }
    }, [filteredWorkspaces.length, workspacesPerPage, currentPage]);


    const indexOfLast = currentPage * workspacesPerPage;
    const indexOfFirst = indexOfLast - workspacesPerPage;
    const currentWorkspaces = workspacesToPaginate.slice(
        indexOfFirst,
        indexOfLast
    );

    // Render pagination buttons
    const renderPageNumbers = () => {
        const pages = [];
        if (totalPages <= 1) return null; // Don't show pagination if only one page

        // Simple pagination (could enhance with ellipsis for many pages)
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition ${
                        currentPage === i
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    // --- Rendering Views ---

    // Workspace cards view component
    const renderWorkspaceCards = () => (
        <>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                 <h2 className="text-2xl font-semibold text-gray-800">Your Workspaces</h2>
                 {/* Add a button to create a new workspace if you have that functionality */}
                 {/* <button className="bg-green-500 text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-green-600 transition flex items-center gap-1">
                     <span className="text-lg">+</span> Create Workspace
                 </button> */}
                 {/* Example: A search/filter input could go here */}
                 {/* <input type="text" placeholder="Search workspaces..." className="px-3 py-2 border rounded-md" /> */}
            </div>

            {/* Loading/Error/Empty States for Workspaces */}
            {isLoadingWorkspaces && <div className="text-center text-gray-500 text-lg">Loading workspaces...</div>}
            {workspaceError && <div className="text-center text-red-500 text-lg">{workspaceError}</div>}
            {!isLoadingWorkspaces && !workspaceError && currentWorkspaces.length === 0 && (
                 <div className="text-center text-gray-500 text-lg">No workspaces found.</div>
            )}

            {/* Workspace Card Grid */}
            {!isLoadingWorkspaces && !workspaceError && currentWorkspaces.length > 0 && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentWorkspaces.map((ws) => (
                        <div
                            key={ws.id} // Use backend ID as key
                            className={`border rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden ${ // Added overflow-hidden
                                editId === ws.id ? 'bg-blue-50 border-blue-400' : '' // Highlight item being edited
                            }`}
                        >
                            <div className="p-4 flex flex-col gap-3 flex-grow">
                                {/* Header: Icon, Name/URL, Menu */}
                                <div className="flex justify-between items-start">
                                    {/* Icon and Workspace Name/URL */}
                                    <div className="flex gap-3 items-start flex-grow min-w-0"> {/* min-w-0 allows text to shrink */}
                                        <div className="w-10 h-10 bg-[#EFEFEF] rounded-full flex items-center justify-center shrink-0">
                                            <img src={userLogo} alt="Workspace Icon" className="w-5 h-5" />
                                        </div>
                                        <div className="flex-grow min-w-0"> {/* Allow text content to grow, prevent overflow */}
                                            {editId === ws.id ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        className="font-bold text-base text-[#242C39] w-full border px-2 py-1 rounded focus:outline-none focus:ring-1 focus-within:ring-blue-500"
                                                        value={editValues.workspace_name}
                                                        onChange={(e) =>
                                                            setEditValues({ ...editValues, workspace_name: e.target.value })
                                                        }
                                                        placeholder="Workspace Name"
                                                    />
                                                    {editValues.workspace_name && (
                                                        <p className="text-sm text-blue-600 mt-1 truncate"> {/* Truncate long URLs */}
                                                            {formatWorkspaceUrl(editValues.workspace_name)}
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <h2 className="font-bold text-base text-[#242C39] truncate"> {/* Truncate long names */}
                                                        {ws.workspace_name}
                                                    </h2>
                                                    <a
                                                        href={`https://${formatWorkspaceUrl(ws.workspace_name)}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-sm text-blue-600 hover:underline truncate block"
                                                    >
                                                        {formatWorkspaceUrl(ws.workspace_name)}
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Options Menu Button */}
                                    <div className="relative shrink-0 ml-2"> {/* shrink-0 and ml-2 for spacing */}
                                        <button
                                             className="p-1 rounded-full hover:bg-gray-100 transition"
                                            onClick={() =>
                                                setMenuOpenId(menuOpenId === ws.id ? null : ws.id)
                                            }
                                        >
                                            <img src={dotsverticalLogo} className="w-5 h-5" alt="menu" />
                                        </button>
                                        {/* Menu Dropdown */}
                                        {menuOpenId === ws.id && (
                                            <div
                                                className="absolute top-full right-0 mt-2 w-36 bg-white border rounded shadow-lg z-10 origin-top-right animate-scale-in"
                                                 // Optional: Add onMouseLeave to close menu when mouse leaves the menu area
                                                 // onMouseLeave={() => setMenuOpenId(null)}
                                            >
                                                {/* Show options only if not currently editing */}
                                                {editId !== ws.id && (
                                                    <>
                                                        <button
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => handleEdit(ws.id)}
                                                        >
                                                            Edit Space
                                                        </button>
                                                        <button
                                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                            onClick={() => handleDelete(ws.id)}
                                                        >
                                                            Delete Space
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Editable Fields (Client Info, Description, Staff, etc.) */}
                                {editId === ws.id ? (
                                    <div className="space-y-2 text-sm">
                                        {/* Add input fields for all editable Workspace model fields */}
                                        <div>
                                            <label className="block text-gray-700 text-xs font-medium mb-0.5">Client Name:</label>
                                             <input type="text" className="w-full border px-2 py-1 text-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus-within:ring-blue-500" placeholder="Client Name" value={editValues.client_name} onChange={(e) => setEditValues({...editValues, client_name: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-xs font-medium mb-0.5">Phone:</label>
                                             <input type="text" className="w-full border px-2 py-1 text-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus-within:ring-blue-500" placeholder="Phone Number" value={editValues.phone_number} onChange={(e) => setEditValues({...editValues, phone_number: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-xs font-medium mb-0.5">Email:</label>
                                             <input type="email" className="w-full border px-2 py-1 text-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus-within:ring-blue-500" placeholder="Email Address" value={editValues.email} onChange={(e) => setEditValues({...editValues, email: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-xs font-medium mb-0.5">Description:</label>
                                            <textarea
                                                className="w-full border px-2 py-1 rounded resize-y text-gray-700 text-sm focus:outline-none focus:ring-1 focus-within:ring-blue-500"
                                                rows={2} // Adjust rows as needed
                                                value={editValues.description}
                                                onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                                                placeholder="Workspace description"
                                            />
                                        </div>
                                         <div>
                                            <label className="block text-gray-700 text-xs font-medium mb-0.5">Assigned Staff:</label>
                                             <input type="text" className="w-full border px-2 py-1 text-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus-within:ring-blue-500" placeholder="Assigned Staff" value={editValues.assign_staff} onChange={(e) => setEditValues({...editValues, assign_staff: e.target.value})} />
                                         </div>
                                         <div>
                                            <label className="block text-gray-700 text-xs font-medium mb-0.5">HD Maintenance:</label>
                                             <input type="text" className="w-full border px-2 py-1 text-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus-within:ring-blue-500" placeholder="HD Maintenance" value={editValues.hd_maintenance} onChange={(e) => setEditValues({...editValues, hd_maintenance: e.target.value})} />
                                         </div>
                                          {/* Checkbox for activation status */}
                                         <div className="flex items-center gap-2">
                                            <input
                                                 type="checkbox"
                                                 id={`activated-${ws.id}`}
                                                 checked={editValues.is_workspace_activated}
                                                 onChange={(e) => setEditValues({...editValues, is_workspace_activated: e.target.checked})}
                                                 className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                             />
                                            <label htmlFor={`activated-${ws.id}`} className="text-sm text-gray-700 cursor-pointer">Workspace Activated</label>
                                         </div>
                                    </div>
                                ) : (
                                     <>
                                         {/* Display Description and potentially other key info when not editing */}
                                         <p className="text-sm text-[#535860] line-clamp-3 flex-grow"> {/* Allow more lines if needed */}
                                             {ws.description || 'No description provided.'}
                                         </p>
                                         {/* Optional: Display other read-only info like client name, staff */}
                                         {/* <div className="text-xs text-gray-600 mt-2 space-y-0.5">
                                             {ws.client_name && <p>Client: {ws.client_name}</p>}
                                             {ws.assign_staff && <p>Staff: {ws.assign_staff}</p>}
                                             <p>Status: {ws.is_workspace_activated ? 'Activated' : 'Pending Activation'}</p>
                                         </div> */}
                                     </>
                                )}

                                {/* Users (Placeholder) and Settings Icon */}
                                <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-100"> {/* Added top border for separation */}
                                    <div className="flex -space-x-2">
                                        {/* Placeholder Avatars */}
                                        {[...Array(Math.min(5, 5))].map((_, i) => (
                                            <img
                                                key={i}
                                                src={`https://i.pravatar.cc/40?img=${i + 10 + ws.id}`} // Use ws.id for variation
                                                alt="avatar"
                                                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                            />
                                        ))}
                                         {/* Example: Display total user count if > 5 (requires backend count) */}
                                         {/* {ws.users_count > 5 && (
                                             <span className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 text-gray-700 text-xs flex items-center justify-center shadow-sm">
                                                 +{ws.users_count - 5}
                                             </span>
                                         )} */}
                                    </div>
                                    {/* Settings icon - clickable if settings functionality exists */}
                                    <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition">
                                        <img src={settingsLogo} alt="Settings Icon" className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Action Button (Save/Cancel or View Space) */}
                            {editId === ws.id ? (
                                <div className="flex gap-2 p-3 border-t bg-gray-50">
                                    <button
                                        onClick={() => handleSave(ws.id)}
                                        className="flex-1 py-2 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!editValues.workspace_name.trim()} // Disable save if name is empty
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex-1 py-2 bg-gray-300 text-gray-800 text-sm font-semibold rounded-md hover:bg-gray-400 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setSelectedWorkspace(ws); // Store the workspace object
                                        setTableMode(true); // Switch to table view
                                        setCurrentPage(1); // Reset workspace pagination when switching views
                                    }}
                                    className="w-full py-3 bg-[#f2faff] text-blue-600 text-sm font-semibold rounded-b-xl hover:bg-[#CEE1FC] transition"
                                >
                                    View Space
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls (for workspace cards) */}
             {!isLoadingWorkspaces && !workspaceError && workspacesToPaginate.length > workspacesPerPage && (
                <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                         {/* Displaying items count */}
                        Showing {indexOfFirst + 1} - {Math.min(indexOfLast, workspacesToPaginate.length)} of {workspacesToPaginate.length} workspaces
                    </div>
                    <div className="flex gap-1 items-center">
                        {/* Previous page button */}
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1}
                            className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition p-1"
                        >
                            
                        </button> 
                       
                        {renderPageNumbers()}
                       
                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(totalPages, prev + 1)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition p-1"
                        >
                            
                        </button>
                    </div>
                </div>
             )}

            {/* Plan List Modal - Remove this section if PlanList component and associated logic are not needed */}
            {/* {showPlanList && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                     <div className="bg-white p-6 rounded-lg w-full max-w-5xl overflow-auto max-h-[90vh] relative shadow-lg">
                         <button onClick={() => setShowPlanList(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
                         <h2 className="text-2xl font-semibold mb-4">Relevant plans</h2>
                         <PlanList plans={plans} type={billingType} />
                         <div className="mt-6 text-right">
                             <button onClick={() => setShowPlanList(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Close</button>
                         </div>
                     </div>
                 </div>
             )} */}
        </>
    );

    // Table view component for tasks (requests)
    const renderTableView = () => (
        <>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                <h2 className="text-xl font-semibold text-gray-800">
                    Requests for "{selectedWorkspace?.workspace_name || 'Selected Workspace'}"
                </h2>
                {/* Show "Create Request" button only if a workspace is selected (which it will be in this view) */}
                 {selectedWorkspace && (
                    <button
                        onClick={() => setShowCreateRequestModal(true)}
                        className="bg-[#4C74DA] text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-[#3b5fc3] transition flex items-center gap-1"
                    >
                        <span className="text-lg">+</span> Create Request
                    </button>
                 )}
            </div>

            {/* Loading/Error/Empty States for Tasks */}
            {isLoadingTasks && <div className="text-center text-gray-500 text-lg">Loading requests...</div>}
            {taskError && <div className="text-center text-red-500 text-lg">{taskError}</div>}

            {!isLoadingTasks && !taskError && requests.length === 0 && (
                 <div className="text-center text-gray-500 text-lg">No requests found for this workspace.</div>
            )}

            {/* Task Table */}
            {!isLoadingTasks && !taskError && requests.length > 0 && (
                 <div className="overflow-x-auto rounded-lg border shadow-sm">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-[#F9FAFB] text-gray-700 font-medium">
                            <tr>
                                {/* Removed Domain Name column as it's implicit from the workspace */}
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Request Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Acceptance Status</th> {/* Maps to backend status */}
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Progress Status</th> {/* Maps to backend status */}
                                {/* Add more columns here if needed (e.g., Due Date, Assigned Staff for Task) */}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requests.map((req) => (
                                <tr key={req.id}> {/* Use backend task ID as key */}
                                    {/* Format date nicely */}
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                                         {req.created_at ? new Date(req.created_at).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-800">{req.title}</td> {/* Maps to backend 'title' */}
                                    <td className="px-6 py-4 text-gray-800">{req.description || '-'}</td> {/* Maps to backend 'description', handle null/blank */}
                                    {/* Displaying Acceptance Status based on backend status */}
                                     <td className={`px-6 py-4 whitespace-nowrap font-medium ${
                                         req.status === 'accepted' ? 'text-green-600' :
                                         req.status === 'rejected' ? 'text-red-600' :
                                         'text-orange-600' // pending, in_progress, completed
                                     }`}>
                                         {/* Simple mapping for Acceptance */}
                                         {req.status === 'accepted' ? 'Accepted' :
                                          req.status === 'rejected' ? 'Rejected' :
                                          'Pending Review'} {/* Display this for pending, in_progress, completed */}
                                     </td>
                                     {/* Displaying Progress Status based on backend status */}
                                     <td className={`px-6 py-4 whitespace-nowrap font-medium ${
                                         req.status === 'completed' ? 'text-green-600' :
                                         req.status === 'in_progress' ? 'text-blue-600' :
                                         'text-gray-500' // pending, accepted, rejected
                                     }`}>
                                          {/* Simple mapping for Scope Progress */}
                                        {req.status === 'in_progress' ? 'In Progress' :
                                         req.status === 'completed' ? 'Completed' :
                                         'Not Started'} {/* Display this for pending, accepted, rejected */}
                                     </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


            {/* Back Button */}
            <div className="mt-6 flex justify-start items-center">
                <button
                    onClick={() => {
                        setTableMode(false); // Switch back to card view
                        setSelectedWorkspace(null); // Clear selected workspace state
                        setRequests([]); // Clear tasks from previous view
                        setTaskError(null); // Clear task errors
                        // No need to reset workspace pagination here, done in the other useEffect
                    }}
                    className="bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition flex items-center gap-2"
                >
                     ← Back to Workspaces
                </button>
            </div>
        </>
    );

    // Determine which view to render based on 'tableMode'
    const renderContent = () => {
        if (tableMode) {
            return renderTableView();
        } else {
            return renderWorkspaceCards();
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans"> {/* Added basic background and font */}
            {/* Render either the workspace cards or the task table */}
            {renderContent()}

            {/* Create Request Modal */}
            {/* Conditionally render modal only if selectedWorkspace is not null */}
            {showCreateRequestModal && selectedWorkspace && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative shadow-lg max-h-[90vh] overflow-y-auto transform transition-all scale-100 opacity-100"> {/* Added transition/transform for potential animation */}
                         {/* Close button */}
                        <button
                            onClick={() => setShowCreateRequestModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none" // leading-none for better centering
                        >
                            ×
                        </button>
                        {/* Modal Title */}
                        <h2 className="text-xl font-semibold mb-6 text-gray-800">
                            Raise a Request for "{selectedWorkspace.workspace_name || 'Selected Workspace'}"
                        </h2>

                        {/* Request Form */}
                        <div className="space-y-4">
                            {/* Subject Field (maps to Task.title) */}
                            <div>
                                <label htmlFor="requestSubject" className="block text-sm font-medium text-gray-700">
                                    Subject <span className="text-red-500">*</span> {/* Mark as required */}
                                </label>
                                <input
                                    id="requestSubject"
                                    type="text"
                                    value={requestForm.request}
                                    onChange={(e) =>
                                        setRequestForm({
                                            ...requestForm,
                                            request: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
                                    placeholder="e.g. Hosting Setup"
                                    required // HTML5 required attribute (optional, validation handled by JS too)
                                />
                            </div>

                            {/* Description Field (maps to Task.description) */}
                            <div>
                                <label htmlFor="scopeOfService" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="scopeOfService"
                                    rows={4}
                                    value={requestForm.scopeOfService}
                                    onChange={(e) =>
                                        setRequestForm({
                                            ...requestForm,
                                            scopeOfService: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y text-gray-800"
                                    placeholder="Provide details about your request..."
                                ></textarea>
                            </div>

                             {/* File Upload Area (Placeholder) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Attachments (Optional)
                                </label>
                                <input
                                     type="file"
                                     onChange={handleFileChange}
                                     className="block w-full text-sm text-gray-500
                                     file:mr-4 file:py-2 file:px-4
                                     file:rounded-md file:border-0
                                     file:text-sm file:font-semibold
                                     file:bg-blue-50 file:text-blue-700
                                     hover:file:bg-blue-100 cursor-pointer"
                                     multiple
                                 />
                                 {/* Note: Actual file upload integration requires backend support */}
                            </div>

                        </div>

                        {/* Modal Actions */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowCreateRequestModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRequestSubmit} // Trigger the submit handler
                                disabled={!requestForm.request.trim()} // Disable if Subject is empty or only whitespace
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Note: For the animate-scale-in class, add the following to your global CSS file (e.g., src/index.css):
/*
@keyframes scale-in {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-scale-in {
  animation: scale-in 0.1s ease-out;
}
*/