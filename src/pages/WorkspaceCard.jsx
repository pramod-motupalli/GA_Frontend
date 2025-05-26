import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toPng } from 'html-to-image';
import settingsLogo from '../assets/logos/settings.svg';
import userLogo from '../assets/logos/user.svg';
import dotsverticalLogo from '../assets/logos/dots-vertical.svg';

export default function Main() {
  const [workspaces, setWorkspaces] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const cardRefs = useRef({});

  useEffect(() => {
    axios.get('http://localhost:8000/api/users/workspaces/create/')
      .then(res => setWorkspaces(res.data))
      .catch(err => console.error('Failed to fetch workspaces:', err));
  }, []);

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
        console.error('Failed to generate image:', err);
      }
    }
  };

  const handleEdit = (id) => {
    console.log('Edit workspace', id);
  };

  const handleDelete = (id) => {
    console.log('Delete workspace', id);
  };

  const formatWorkspaceUrl = (name) => {
    return name.toLowerCase().replace(/\s+/g, '') + '.com';
  };

  return (
    <div className="max-w-[1102px] mx-auto p-5 bg-white border border-[rgba(131,131,131,0.14)] rounded-2xl shadow-[0_0_4px_0_rgba(63,107,140,0.1)]">
      {/* Search & Filters Section */}
      <div className="flex justify-between items-center w-full mb-6">
        {/* Search Input */}
        <div className="relative w-[395px]">
          <input
            type="text"
            placeholder="Search user..."
            className="w-full p-3 pl-3 pr-10 border border-[rgba(53,87,99,0.13)] rounded-lg text-sm text-[#8c97ab]"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
            viewBox="0 0 16 16"
          >
            <path
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
              fill="#8c97ab"
            />
          </svg>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-6">
          <button className="flex items-center gap-2 px-5 py-3 bg-[#fbfdff] border border-[rgba(155,156,156,0.36)] rounded-lg text-[#9ba4ab] text-base">
            Sort by
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
            </svg>
          </button>
          
          <button className="flex items-center gap-2 px-5 py-3 bg-[#fbfdff] border border-[rgba(155,156,156,0.36)] rounded-lg text-[#9ba4ab] text-base">
            Filters
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M14 12v7.88c.04.3-.06.62-.29.83a.996.996 0 0 1-1.41 0l-2.01-2.01a.989.989 0 0 1-.29-.83V12h-.03L4.21 4.62a1 1 0 0 1 .17-1.4c.19-.14.4-.22.62-.22h14c.22 0 .43.08.62.22a1 1 0 0 1 .17 1.4L14.03 12H14z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 gap-6 w-full">
        {workspaces.map(ws => (
          <div
            key={ws.id}
            ref={el => (cardRefs.current[ws.id] = el)}
            className="border border-[rgba(82,90,93,0.37)] rounded-xl hover:shadow-lg transition-shadow"
          >
            {/* Card Content */}
            <div className="p-4 flex flex-col gap-3 flex-grow">
              {/* Top Row */}
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-[#EFEFEF] rounded-full flex items-center justify-center">
                    <img src={userLogo} alt="User Icon" className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[16px] text-[#242C39]">{ws.workspace_name}</h2>
                    <a
                      href={`https://${formatWorkspaceUrl(ws.workspace_name)}`}
                      className="text-sm text-[#448FF5] hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formatWorkspaceUrl(ws.workspace_name)}
                    </a>
                  </div>
                </div>

                {/* 3-dot menu */}
                <div className="relative">
                  <button onClick={() => setMenuOpenId(menuOpenId === ws.id ? null : ws.id)} className="text-[#535860]">
                    <img src={dotsverticalLogo} alt="More Options" className="w-5 h-5" />
                  </button>
                  {menuOpenId === ws.id && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg z-10 overflow-hidden">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-[#CEE1FC] text-[#243745BF]"
                        onClick={() => handleEdit(ws.id)}
                      >
                        Edit Space
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-[#CEE1FC] text-[#243745BF]"
                        onClick={() => handleDelete(ws.id)}
                      >
                        Delete Space
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#535860] line-clamp-2">{ws.description}</p>

              {/* Avatars + Settings */}
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

            {/* View Button */}
            <button
              onClick={() => downloadImage(ws.id)}
              className="w-full py-3 bg-[#f2faff] text-[#438ef4] text-sm font-semibold rounded-b-xl hover:bg-[#CEE1FC] transition"
            >
              View Space
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[#333]">Page</span>
          <div className="border border-[#ddd] rounded-lg px-3 py-2">
            <span className="text-sm font-semibold text-[#333]">1</span>
          </div>
          <span className="text-sm font-semibold text-[#333]">of 10</span>
        </div>

        <div className="flex gap-4">
          <button className="p-2 border border-[#f1f1f1] rounded-full">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
            </svg>
          </button>
          
          <button className="px-3 py-2 bg-[#2f80ed] text-white rounded-full">1</button>
          <button className="px-3 py-2 border border-[#f1f1f1] rounded-full">2</button>
          <button className="px-3 py-2 border border-[#f1f1f1] rounded-full">3</button>
          <button className="px-3 py-2">...</button>
          <button className="px-3 py-2 border border-[#f1f1f1] rounded-full">10</button>
          
          <button className="p-2 border border-[#f1f1f1] rounded-full">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}