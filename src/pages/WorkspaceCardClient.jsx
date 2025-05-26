import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toPng } from 'html-to-image';
import settingsLogo from '../assets/logos/settings.svg';
import userLogo from '../assets/logos/user.svg';
import dotsverticalLogo from '../assets/logos/dots-vertical.svg';
import PlanList from './planSelectionPopup';

export default function Main() {
  const [workspaces, setWorkspaces] = useState([]);
  const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [tableMode, setTableMode] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [showPlanList, setShowPlanList] = useState(false);
  const [isMonthly, setIsMonthly] = useState(true);

  const billingType = isMonthly ? 'monthly' : 'yearly';

  const monthlyPlans = [
    {
      title: 'Pro',
      price: 100,
      features: ['All limited links', 'Own analytics platform', 'Chat support', 'Optimize hashtags', 'Unlimited users'],
    },
    {
      title: 'Intro',
      price: 300,
      features: ['Dedicated account', 'Tailored analytics', '24/7 support', 'AI-driven hashtag', 'Unlimited users'],
    },
    {
      title: 'Basic',
      price: 200,
      features: ['Priority support', 'Custom analytics reports', 'Phone support', 'Advanced hashtag', 'Up to 50 users'],
    },
  ];

  const yearlyPlans = [
    {
      title: 'Pro',
      price: 1000,
      features: ['All limited links', 'Own analytics platform', 'Chat support', 'Optimize hashtags', 'Unlimited users'],
    },
    {
      title: 'Intro',
      price: 2800,
      features: ['Dedicated account', 'Tailored analytics', '24/7 support', 'AI-driven hashtag', 'Unlimited users'],
    },
    {
      title: 'Basic',
      price: 1800,
      features: ['Priority support', 'Custom analytics reports', 'Phone support', 'Advanced hashtag', 'Up to 50 users'],
    },
  ];

  const plans = isMonthly ? monthlyPlans : yearlyPlans;
  const workspacesPerPage = 9;
  const cardRefs = useRef({});

  // Fetch workspaces on mount
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/users/workspaces/create/')
      .then(res => {
        setWorkspaces(res.data);
        setFilteredWorkspaces(res.data);
      })
      .catch(err => console.error('Failed to fetch workspaces:', err));
  }, []);

  // Edit workspace: open inputs
  const handleEdit = (id) => {
    const ws = workspaces.find(w => w.id === id);
    setEditValues({ name: ws.workspace_name, description: ws.description });
    setEditId(id);
    setMenuOpenId(null);
  };

  // Save edited workspace to server and update state
  const handleSave = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:8000/api/users/workspaces/create/${id}/`, {
        workspace_name: editValues.name,
        description: editValues.description,
      });
      setWorkspaces(prev => prev.map(ws => (ws.id === id ? { ...ws, ...res.data } : ws)));
      setEditId(null);
      setEditValues({});
    } catch (err) {
      console.error('Error saving workspace:', err);
    }
  };

  // Delete workspace (implement API call here)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/users/workspaces/create/${id}/`);
      setWorkspaces(prev => prev.filter(ws => ws.id !== id));
      setFilteredWorkspaces(prev => prev.filter(ws => ws.id !== id));
      setMenuOpenId(null);
    } catch (err) {
      console.error('Error deleting workspace:', err);
    }
  };

  // Format workspace name to URL-friendly string
  const formatWorkspaceUrl = (name) => {
    return name.toLowerCase().replace(/\s+/g, '') + '.com';
  };

  const totalPages = Math.ceil(filteredWorkspaces.length / workspacesPerPage);
  const indexOfLast = currentPage * workspacesPerPage;
  const indexOfFirst = indexOfLast - workspacesPerPage;
  const currentWorkspaces = filteredWorkspaces.slice(indexOfFirst, indexOfLast);

  // Pagination buttons
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

  // Workspace cards view
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
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            &lt;
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Modal for Plan List */}
      {showPlanList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-5xl overflow-auto max-h-[90vh] relative shadow-lg">
            <button
              onClick={() => setShowPlanList(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold mb-4">Relevant plans to your request</h2>
            <PlanList plans={plans} type={billingType} />
          </div>
        </div>
      )}
    </>
  );

  // Table view when viewing selected workspace requests
  const renderTableView = () => (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-semibold">Raised Requests</h2>
        <button className="bg-[#4C74DA] text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-[#3b5fc3] transition">
          + Create Request
        </button>
      </div>

      <div className="overflow-auto rounded-lg border">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-[#F9FAFB] text-gray-700 font-medium">
            <tr>
              <th className="px-6 py-3 text-left">Domain Name</th>
              <th className="px-6 py-3 text-left">Request Raised Date</th>
              <th className="px-6 py-3 text-left">Request</th>
              <th className="px-6 py-3 text-left">Scope of Service</th>
              <th className="px-6 py-3 text-left">Acceptance Status</th>
              <th className="px-6 py-3 text-left">Scope Status</th>
            </tr>
          </thead>
          {/* TODO: Add tbody and data rows */}
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => {
            setTableMode(false);
            setSelectedWorkspace(null);
          }}
          className="bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition"
        >
          ← Back to Workspaces
        </button>
      </div>
    </>
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      {tableMode ? renderTableView() : renderWorkspaceCards()}
    </div>
  );
}
