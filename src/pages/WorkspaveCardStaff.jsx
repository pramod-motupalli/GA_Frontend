import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toPng } from 'html-to-image';
import settingsLogo from '../assets/logos/settings.svg';
import userLogo from '../assets/logos/user.svg';
import dotsverticalLogo from '../assets/logos/dots-vertical.svg';

export default function WorkspaceDashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [globalMenuOpen, setGlobalMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const workspacesPerPage = 9;
  const cardRefs = useRef({});

  useEffect(() => {
    axios.get('http://localhost:8000/api/users/workspaces/create/')
      .then(res => {
        setWorkspaces(res.data);
        setFilteredWorkspaces(res.data);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  useEffect(() => {
    let temp = [...workspaces];
    if (searchTerm) {
      temp = temp.filter(ws =>
        ws.workspace_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortOption === 'name_asc') temp.sort((a, b) => a.workspace_name.localeCompare(b.workspace_name));
    if (sortOption === 'name_desc') temp.sort((a, b) => b.workspace_name.localeCompare(a.workspace_name));
    setFilteredWorkspaces(temp);
    setCurrentPage(1);
  }, [searchTerm, sortOption, workspaces]);

  const handleEdit = (id) => {
    const ws = workspaces.find(w => w.id === id);
    setEditValues({ name: ws.workspace_name, description: ws.description });
    setEditId(id);
    setMenuOpenId(null);
  };

  const handleSave = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:8000/api/users/workspaces/create/${id}/`, editValues);
      setWorkspaces(prev => prev.map(ws => (ws.id === id ? { ...ws, ...res.data } : ws)));
      setEditId(null);
      setEditValues({});
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleDelete = (id) => {
    console.log('Delete', id);
  };

  const downloadImage = async (id) => {
    const node = cardRefs.current[id];
    if (node) {
      try {
        const dataUrl = await toPng(node);
        const link = document.createElement('a');
        link.download = `${id}_workspace.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Image download failed:', err);
      }
    }
  };

  const formatWorkspaceUrl = (name) => name.toLowerCase().replace(/\s+/g, '') + '.com';

  const toggleSelectAll = () => {
    setSelectedIds(selectAll ? [] : filteredWorkspaces.map(ws => ws.id));
    setSelectAll(!selectAll);
    setGlobalMenuOpen(false);
  };

  const deleteSelected = () => {
    console.log('Deleting:', selectedIds);
    setWorkspaces(prev => prev.filter(ws => !selectedIds.includes(ws.id)));
    setSelectedIds([]);
    setSelectAll(false);
    setGlobalMenuOpen(false);
  };

  const totalPages = Math.ceil(filteredWorkspaces.length / workspacesPerPage);
  const currentWorkspaces = filteredWorkspaces.slice(
    (currentPage - 1) * workspacesPerPage,
    currentPage * workspacesPerPage
  );

  return (
    <div className="max-w-[1102px] mx-auto p-5 bg-white border rounded-2xl shadow">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div className="flex gap-3 items-center flex-wrap">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md text-sm w-64"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md text-sm"
          >
            <option value="">Sort By</option>
            <option value="name_asc">Name A-Z</option>
            <option value="name_desc">Name Z-A</option>
          </select>
          <button className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded">Filter</button>
        </div>

        <div className="relative">
          <button onClick={() => setGlobalMenuOpen(!globalMenuOpen)}>
            <img src={dotsverticalLogo} className="w-5 h-5" alt="menu" />
          </button>
          {globalMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg z-20">
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-[#CEE1FC]" onClick={toggleSelectAll}>
                {selectAll ? 'Deselect All' : 'Select All'}
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-[#CEE1FC]" onClick={deleteSelected}>
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentWorkspaces.map(ws => (
          <div
            key={ws.id}
            ref={el => (cardRefs.current[ws.id] = el)}
            className={`border rounded-xl relative transition-shadow ${selectedIds.includes(ws.id) ? 'ring-2 ring-blue-400' : ''}`}
            onClick={() => {
              if (selectAll) {
                setSelectedIds(prev =>
                  prev.includes(ws.id) ? prev.filter(id => id !== ws.id) : [...prev, ws.id]
                );
              }
            }}
          >
            <div className="p-4 flex flex-col gap-3">
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
                          onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                        />
                        <p className="text-sm text-[#448FF5]">{formatWorkspaceUrl(editValues.name)}</p>
                      </>
                    ) : (
                      <>
                        <h2 className="font-bold text-[16px] text-[#242C39]">{ws.workspace_name}</h2>
                        <a href={`https://${formatWorkspaceUrl(ws.workspace_name)}`} target="_blank" rel="noreferrer" className="text-sm text-[#448FF5] hover:underline">
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
                      <button className="w-full text-left px-4 py-2 text-sm hover:bg-[#CEE1FC]" onClick={() => handleEdit(ws.id)}>Edit Space</button>
                      <button className="w-full text-left px-4 py-2 text-sm hover:bg-[#CEE1FC]" onClick={() => handleDelete(ws.id)}>Delete Space</button>
                    </div>
                  )}
                </div>
              </div>

              {editId === ws.id ? (
                <textarea
                  className="text-sm text-[#535860] border px-2 py-1 rounded resize-none"
                  rows={3}
                  value={editValues.description}
                  onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                />
              ) : (
                <p className="text-sm text-[#535860] line-clamp-2">{ws.description}</p>
              )}

              <div className="flex justify-between items-center mt-2">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <img key={i} src={`https://i.pravatar.cc/40?img=${i + 1}`} alt="avatar" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                  ))}
                </div>
                <img src={settingsLogo} alt="Settings Icon" className="w-5 h-5" />
              </div>
            </div>

            {editId === ws.id ? (
              <button
                onClick={() => handleSave(ws.id)}
                className="w-full py-3 bg-green-100 text-green-700 text-sm font-semibold rounded-b-xl hover:bg-green-200"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => downloadImage(ws.id)}
                className="w-full py-3 bg-[#f2faff] text-[#438ef4] text-sm font-semibold rounded-b-xl hover:bg-[#CEE1FC]"
              >
                View Space
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm">Page {currentPage} of {totalPages}</div>
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-full ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
