import React, { useState } from "react";

const SidebarChatList = ({ activeTab, setActiveTab, setSelectedChat }) => {
  const tabs = [
    { label: "Workspace", key: "workspace" },
    { label: "Work grp", key: "workgrp" },
    { label: "Personal", key: "personal" },
  ];

  // Example chat data with id and recent message time
  const initialChats = [
    { id: 1, name: "GA Domes", subtitle: "Arjun Typing...", time: "10:30 AM" },
    { id: 2, name: "Ocean View", subtitle: "1 video", time: "11:30 AM" },
    { id: 3, name: "Urban Jungle", subtitle: "1 video", time: "1:00 PM" },
    { id: 4, name: "Sunset Squad", subtitle: "Meeting at 5", time: "9:45 AM" },
    { id: 5, name: "Work Buddies", subtitle: "Report ready", time: "2:15 PM" },
  ];

  const [chats, setChats] = useState(initialChats);
  const [pinnedChatIds, setPinnedChatIds] = useState([]);
  const [contextMenu, setContextMenu] = useState(null); // { mouseX, mouseY, chatId, isPinned }

  // Separate pinned and unpinned chats
  const pinnedChats = chats.filter((chat) => pinnedChatIds.includes(chat.id));
  const unpinnedChats = chats.filter((chat) => !pinnedChatIds.includes(chat.id));

  // Right-click handler
  const handleContextMenu = (event, chatId, isPinned) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      chatId,
      isPinned,
    });
  };

  // Pin or unpin a chat
  const togglePinChat = () => {
    if (!contextMenu) return;
    const { chatId, isPinned } = contextMenu;
    if (isPinned) {
      // Unpin
      setPinnedChatIds(pinnedChatIds.filter((id) => id !== chatId));
    } else {
      // Pin
      setPinnedChatIds([...pinnedChatIds, chatId]);
    }
    closeContextMenu();
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Search */}
      <div className="p-4">
        <div className="flex items-center w-full border border-gray-300 rounded-full px-4 py-2 shadow-sm bg-white">
          <input
            type="text"
            placeholder="Searching..."
            className="flex-1 bg-transparent text-sm text-gray-600 outline-none"
          />
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 overflow-x-auto">
        <div className="flex gap-2 whitespace-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full transition ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border border-blue-600"
              }`}
            >
              {tab.label}
              <span className="text-xs font-semibold px-2 py-0.5 bg-white text-blue-600 rounded-full">
                02
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="mt-4 px-2 flex-1 overflow-y-auto">
        {/* Pinned Chats */}
        {pinnedChats.length > 0 && (
          <>
            <p className="text-xs text-gray-500 px-2 mb-2 font-semibold">
              Pinned Chats
            </p>
            {pinnedChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                onContextMenu={(e) => handleContextMenu(e, chat.id, true)}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 cursor-pointer rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm">{chat.name}</p>
                  <p className="text-xs text-green-600">{chat.subtitle}</p>
                </div>
                <div className="text-xs text-gray-500">{chat.time}</div>
              </div>
            ))}
            <hr className="my-3" />
          </>
        )}

        {/* All Chats */}
        <p className="text-xs text-gray-500 px-2 mb-2 font-semibold">All Chats</p>
        {unpinnedChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setSelectedChat(chat)}
            onContextMenu={(e) => handleContextMenu(e, chat.id, false)}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 cursor-pointer rounded-lg"
          >
            <div>
              <p className="font-medium text-sm">{chat.name}</p>
              <p className="text-xs text-green-600">{chat.subtitle}</p>
            </div>
            <div className="text-xs text-gray-500">{chat.time}</div>
          </div>
        ))}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ul
          className="absolute bg-white border border-gray-300 rounded shadow-md text-sm"
          style={{
            top: contextMenu.mouseY,
            left: contextMenu.mouseX,
            zIndex: 1000,
            minWidth: 120,
          }}
          onMouseLeave={closeContextMenu}
        >
          <li
            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            onClick={togglePinChat}
          >
            {contextMenu.isPinned ? "Unpin Chat" : "Pin Chat"}
          </li>
        </ul>
      )}
    </div>
  );
};

export default SidebarChatList;
