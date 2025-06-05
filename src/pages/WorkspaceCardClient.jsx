import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import settingsLogo from '../assets/logos/settings.svg';
import userLogo from '../assets/logos/user.svg';
import dotsverticalLogo from '../assets/logos/dots-vertical.svg';
import PlanList from './planSelectionPopup'; // Assuming this is the correct path
import OutOfScope2 from './OutofScope2'; 

// Import ReactQuill and its styles
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Snow theme CSS

// Helper to get CSRF token if your Django setup uses it for POST requests from JS
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie('csrftoken'); // Get CSRF token

// Add CSRF token to Axios default headers if available
if (csrftoken) {
  axios.defaults.headers.common['X-CSRFToken'] = csrftoken;
}
// If you use session-based authentication, ensure 'withCredentials' is true
// axios.defaults.withCredentials = true;
// If you use token-based authentication (e.g., JWT), you'll need to add
// the Authorization header, e.g., in handleCreateRequestSubmit or globally.
// axios.defaults.headers.common['Authorization'] = `Bearer ${yourAuthToken}`;


export default function Main() {
  const [workspaces, setWorkspaces] = useState([]);
  const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [tableMode, setTableMode] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [showPlanList, setShowPlanList] = useState(false);
  const [isMonthly, setIsMonthly] = useState(true);

  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);
  const [requestSubject, setRequestSubject] = useState('');
  const [requestDescription, setRequestDescription] = useState(''); // This will now store HTML
  const [requestFiles, setRequestFiles] = useState([]);
  const fileInputRef = useRef(null);

  // State for tasks in the table view
  const [tasksForWorkspace, setTasksForWorkspace] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [activeTab, setActiveTab] = useState('raised');



  const currentUserAvatar = 'https://i.pravatar.cc/40?img=68';
  const filePreviewImage = 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwY2hhcnR8ZW58MHx8MHx8&auto=format&fit=crop&w=130&h=80&q=80'; // Uncommented this

  const billingType = isMonthly ? 'monthly' : 'yearly';
  const monthlyPlans = [
    { title: 'Pro', price: 100, features: ['All limited links', 'Own analytics platform', 'Chat support', 'Optimize hashtags', 'Unlimited users'] },
    { title: 'Intro', price: 300, features: ['Dedicated account', 'Tailored analytics', '24/7 support', 'AI-driven hashtag', 'Unlimited users'] },
    { title: 'Basic', price: 200, features: ['Priority support', 'Custom analytics reports', 'Phone support', 'Advanced hashtag', 'Up to 50 users'] },
  ];
  const yearlyPlans = [
    { title: 'Pro', price: 1000, features: ['All limited links', 'Own analytics platform', 'Chat support', 'Optimize hashtags', 'Unlimited users'] },
    { title: 'Intro', price: 2800, features: ['Dedicated account', 'Tailored analytics', '24/7 support', 'AI-driven hashtag', 'Unlimited users'] },
    { title: 'Basic', price: 1800, features: ['Priority support', 'Custom analytics reports', 'Phone support', 'Advanced hashtag', 'Up to 50 users'] },
  ];
  const plans = isMonthly ? monthlyPlans : yearlyPlans;

  const workspacesPerPage = 9;
  const cardRefs = useRef({});
  const selectedIds = editId ? [editId] : [];


  // Fetch initial workspaces
useEffect(() => {
  const token = localStorage.getItem('accessToken');
  axios.get('http://localhost:8000/api/users/workspaces/client/', {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => {
    setWorkspaces(res.data);
    setFilteredWorkspaces(res.data);
  })
  .catch(() => {
    setWorkspaces([]);
    setFilteredWorkspaces([]);
  });
}, []);


  // Fetch tasks when selectedWorkspace changes and in tableMode
 useEffect(() => {
  if (tableMode && selectedWorkspace) {
    setIsLoadingTasks(true);

    const token = localStorage.getItem("accessToken");

    axios.get(`http://localhost:8000/api/users/workspaces/${selectedWorkspace.id}/tasks/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setTasksForWorkspace(res.data);
        setIsLoadingTasks(false);
      })
      .catch(err => {
        console.error('Failed to fetch tasks:', err.response ? err.response.data : err.message);
        setIsLoadingTasks(false);
        setTasksForWorkspace([]);
      });
  } else {
    setTasksForWorkspace([]); // Clear tasks if not in table mode or no workspace selected
  }
}, [tableMode, selectedWorkspace]);

  const handleEdit = (id) => {
    const ws = workspaces.find(w => w.id === id);
    setEditValues({ name: ws.workspace_name, description: ws.description });
    setEditId(id);
    setMenuOpenId(null);
  };

  const handleSave = async (id) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await axios.patch(`http://localhost:8000/api/users/workspaces/create/${id}/`, {
        workspace_name: editValues.name,
        description: editValues.description,
      }, {
        headers: { Authorization: `Bearer ${token}` } // Assuming edit needs auth
      });
      setWorkspaces(prev => prev.map(ws => (ws.id === id ? { ...ws, ...res.data } : ws)));
      setFilteredWorkspaces(prev => prev.map(ws => (ws.id === id ? { ...ws, ...res.data } : ws))); // Also update filtered
      setEditId(null);
      setEditValues({});
    } catch (err) {
      console.error('Error saving workspace:', err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`http://localhost:8000/api/users/workspaces/create/${id}/`, {
        headers: { Authorization: `Bearer ${token}` } // Assuming delete needs auth
      });
      setWorkspaces(prev => prev.filter(ws => ws.id !== id));
      setFilteredWorkspaces(prev => prev.filter(ws => ws.id !== id));
      setMenuOpenId(null);
    } catch (err) {
      console.error('Error deleting workspace:', err);
    }
  };

  const formatWorkspaceUrl = (name) => {
    return name ? name.toLowerCase().replace(/\s+/g, '') + '.com' : '';
  };

  const totalPages = Math.ceil(filteredWorkspaces.length / workspacesPerPage);
  const indexOfLast = currentPage * workspacesPerPage;
  const indexOfFirst = indexOfLast - workspacesPerPage;
  const currentWorkspaces = filteredWorkspaces.slice(indexOfFirst, indexOfLast);

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-8 h-8 rounded-full ${
            currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const renderWorkspaceCards = () => (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <button
          onClick={() => setShowPlanList(true)}
          className="flex items-center gap-2 bg-[#4C74DA] text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-[#3b5fc3] transition"
        >
          <span className="text-lg">+</span>
          New Project Request
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentWorkspaces.map(ws => (
          <div
            key={ws.id}
            ref={el => (cardRefs.current[ws.id] = el)}
            className={`border rounded-xl transition-shadow relative ${
              selectedIds.includes(ws.id) ? 'ring-2 ring-blue-400' : ''
            }`}
          >
            <div className="p-4 flex flex-col gap-3 flex-grow">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-[#EFEFEF] rounded-full flex items-center justify-center">
                    <img src={userLogo} alt="User Icon" className="w-5 h-5" />
                  </div>
                  <div>
                    {editId === ws.id ? (
                      <>
                        <input
                          type="text"
                          className="font-bold text-[16px] text-[#242C39] w-full border px-2 py-1 rounded"
                          value={editValues.name}
                          onChange={e => setEditValues({ ...editValues, name: e.target.value })}
                        />
                        <p className="text-sm text-[#448FF5]">{formatWorkspaceUrl(editValues.name)}</p>
                      </>
                    ) : (
                      <>
                        <h2 className="font-bold text-[16px] text-[#242C39]">{ws.workspace_name}</h2>
                        <a
                          href={`https://${formatWorkspaceUrl(ws.workspace_name)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-[#448FF5] hover:underline"
                        >
                          {formatWorkspaceUrl(ws.workspace_name)}
                        </a>
                      </>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <button onClick={() => setMenuOpenId(menuOpenId === ws.id ? null : ws.id)}>
                    <img src={dotsverticalLogo} className="w-5 h-5" alt="menu" />
                  </button>
                  {menuOpenId === ws.id && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg z-10">
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-[#CEE1FC]"
                        onClick={() => handleEdit(ws.id)}
                      >
                        Edit Space
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-[#CEE1FC]"
                        onClick={() => handleDelete(ws.id)}
                      >
                        Delete Space
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {editId === ws.id ? (
                <textarea
                  className="text-sm text-[#535860] border px-2 py-1 rounded resize-none"
                  rows={3}
                  value={editValues.description}
                  onChange={e => setEditValues({ ...editValues, description: e.target.value })}
                />
              ) : (
                <p className="text-sm text-[#535860] line-clamp-2">{ws.description}</p>
              )}

              <div className="flex justify-between items-center mt-2">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/40?img=${i + 1}`}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    />
                  ))}
                </div>
                <img src={settingsLogo} alt="Settings Icon" className="w-5 h-5" />
              </div>
            </div>

            {editId === ws.id ? (
              <button
                onClick={() => handleSave(ws.id)}
                className="w-full py-3 bg-green-100 text-green-700 text-sm font-semibold rounded-b-xl hover:bg-green-200 transition"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedWorkspace(ws);
                  setTableMode(true);
                }}
                className="w-full py-3 bg-[#f2faff] text-[#438ef4] text-sm font-semibold rounded-b-xl hover:bg-[#CEE1FC] transition"
              >
                View Space
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-1 items-center">
          <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50">-</button>
          {renderPageNumbers()}
          <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50">+</button>
        </div>
      </div>

      {showPlanList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-5xl overflow-auto max-h-[90vh] relative shadow-lg">
            <button onClick={() => setShowPlanList(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
            <h2 className="text-2xl font-semibold mb-4">Relevant plans to your request</h2>
            <PlanList plans={plans} type={billingType} />
          </div>
        </div>
      )}
    </>
  );

const renderTableView = () => (
  <>
    {/* Tabs */}
    <div className="flex justify-between items-center mb-4">
      <div className="text-sm text-black">
        Workspace → <span className="text-blue-600 font-semibold">{selectedWorkspace?.workspace_name}</span>
      </div>
      <button
        onClick={() => { setSubmitError(''); setShowCreateRequestModal(true);} }
        className="bg-[#4C74DA] text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-[#3b5fc3] transition"
      >
        + Create Request
      </button>
    </div>

    {/* Tab headers */}
    <div className="flex space-x-6 border-b border-gray-200 mb-6">
      <button
        onClick={() => setActiveTab('raised')}
        className={`pb-2 text-sm font-medium ${
          activeTab === 'raised'
            ? 'text-black border-b-2 border-blue-600'
            : 'text-gray-600 hover:text-blue-600'
        }`}
      >
        Raised Requests
      </button>
      <button
        onClick={() => setActiveTab('organization')}
        className={`pb-2 text-sm font-medium ${
          activeTab === 'organization'
            ? 'text-black border-b-2 border-blue-600'
            : 'text-gray-600 hover:text-blue-600'
        }`}
      >
        Organization Requests
      </button>
    </div>

    {/* Tab content */}
    {activeTab === 'raised' ? (
      <>
        <div className="overflow-auto rounded-lg border">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-[#F9FAFB] text-gray-700 font-medium">
              <tr>
                <th className="px-6 py-3 text-left">Domain Name</th>
                <th className="px-6 py-3 text-left">Request Raised Date</th>
                <th className="px-6 py-3 text-left">Request (Title)</th>
                <th className="px-6 py-3 text-left">Scope of Service</th>
                <th className="px-6 py-3 text-left">Acceptance Status</th>
                <th className="px-6 py-3 text-left">Scope Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingTasks ? (
                <tr><td colSpan="6" className="text-center py-4">Loading requests...</td></tr>
              ) : tasksForWorkspace.length > 0 ? (
                tasksForWorkspace.map(task => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{selectedWorkspace?.workspace_name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(task.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{task.title}</td>
                    <td className="px-6 py-4">{task.scope_of_service || 'N/A'}</td>
                    <td className="px-6 py-4">{task.acceptance_status || task.status || 'Pending'}</td>
                    <td className="px-6 py-4">{task.scope_status || task.status || 'Pending'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-4">No requests found for this workspace.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    ) : (
      <OutOfScope2 />
    )}

    <div className="mt-6 flex justify-between items-center">
      <button
        onClick={() => {
          setTableMode(false);
          setSelectedWorkspace(null);
          setActiveTab('raised'); // Reset tab on exit
        }}
        className="bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition"
      >
        ← Back to Workspaces
      </button>
    </div>
  </>
);


  const handleCloseCreateRequestModal = () => {
    setShowCreateRequestModal(false);
    setRequestSubject('');
    setRequestDescription('');
    setRequestFiles([]);
    setSubmitError(''); // Clear any previous submission errors
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      name: file.name,
      fileObject: file,
      id: Date.now() + Math.random().toString(36).substr(2, 9)
    }));
    setRequestFiles(prevFiles => [...prevFiles, ...newFiles].slice(0, 3));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (fileIdToRemove) => {
    setRequestFiles(prevFiles => prevFiles.filter(file => file.id !== fileIdToRemove));
  };

  const handleCreateRequestSubmit = async () => {
    const token = localStorage.getItem("accessToken"); // Moved token retrieval here
    if (!selectedWorkspace) {
      setSubmitError("No workspace selected. Cannot create request.");
      console.error("No workspace selected to associate the request with.");
      return;
    }
    setSubmitError(''); // Clear previous error

    const formData = new FormData();
    formData.append('title', requestSubject);
    formData.append('description', requestDescription); // This will now be HTML from Quill

    if (requestFiles.length > 0) {
      requestFiles.forEach(file => {
        formData.append('attachments', file.fileObject, file.name);
      });
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/users/workspaces/${selectedWorkspace.id}/tasks/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
        }
      );
      console.log('Request submitted successfully:', response.data);
      setTasksForWorkspace(prevTasks => [response.data, ...prevTasks]);
      handleCloseCreateRequestModal();
    } catch (error) {
      console.error('Error submitting request:', error.response ? error.response.data : error.message);
      const errorMsg = error.response && error.response.data ?
                       (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data))
                       : error.message;
      setSubmitError(`Failed to create request: ${errorMsg}`);
    }
  };

  // Quill editor modules and formats
  const quillModules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'},
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'], // 'image' and 'video' might require custom handlers for server-side upload
      ['clean']
    ],
    // You can add more modules here, like image resizing, etc.
    // clipboard: {
    //   matchVisual: false, // important for pasting from Word, etc.
    // }
  };

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', // 'video'
  ];

  const renderCreateRequestModal = () => {
    if (!showCreateRequestModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out">
        <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl transform transition-all duration-300 ease-in-out scale-100">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-gray-800">Rise a Request</h2>
            <button onClick={handleCloseCreateRequestModal} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {submitError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{submitError}</div>}

          <div className="space-y-4">
            <div>
              <input type="text" value={requestSubject} onChange={(e) => setRequestSubject(e.target.value)} placeholder="Subject" className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#4C74DA] focus:border-[#4C74DA] sm:text-sm" />
            </div>
            <div>
              {/* Replace textarea with ReactQuill */}
              <ReactQuill
                theme="snow"
                value={requestDescription}
                onChange={setRequestDescription} // Directly sets the HTML content
                placeholder="Describe the Problem"
                modules={quillModules}
                formats={quillFormats}
                className="mt-1 block w-full sm:text-sm"
                style={{ height: '200px', marginBottom: '40px' }} // Quill needs explicit height; margin for toolbar
              />
            </div>
            <div className="flex flex-wrap gap-3 my-3 pt-6"> {/* Added pt-6 to avoid overlap with Quill toolbar */}
              {requestFiles.map((file) => (
                <div key={file.id} className="relative border border-gray-200 rounded-md overflow-hidden shadow-sm flex flex-col w-[130px]">
                  <div className="relative h-[80px] bg-gray-100">
                    <img src={filePreviewImage} alt="File preview" className="w-full h-full object-cover" />
                    <button onClick={() => handleRemoveFile(file.id)} className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-gray-700 hover:text-black shadow-md focus:outline-none" aria-label="Remove file"><span className="text-xs font-bold">×</span></button>
                  </div>
                  <div className="p-1.5 text-center bg-white"><p className="text-xs text-gray-600 truncate" title={file.name}>{file.name}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-5 mt-3 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} disabled={requestFiles.length >= 3} className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4C74DA] hover:bg-[#3b5fc3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4C74DA] disabled:opacity-50">Add a file<span className="ml-1.5 text-base font-semibold">+</span></button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip" />
              <img src={currentUserAvatar} alt="User avatar" className="w-9 h-9 rounded-full" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={handleCloseCreateRequestModal} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400">cancel</button>
              <button type="button" onClick={handleCreateRequestSubmit} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4C74DA] hover:bg-[#3b5fc3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4C74DA]">Rise a Request</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {tableMode ? renderTableView() : renderWorkspaceCards()}
      {renderCreateRequestModal()}
    </div>
  );
}