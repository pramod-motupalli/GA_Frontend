// File: src/components/ChatApp.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Paperclip, Send, Image as ImageIcon, Video,
  FileText, Plus, Search, Pin, X,
} from "lucide-react";
import bg from '../assets/Frame.svg';

const getChatDataForTab = (tab) => {
  switch (tab) {
    case "Work grp":
      return [
        { id: 1, name: "GA Domes", typing: true },
        { id: 2, name: "Design Team", typing: false },
      ];
    case "Personal Chat":
      return [
        { id: 101, name: "Rushi", typing: false },
        { id: 102, name: "Best Friend", typing: true },
      ];
    case "Workspace":
      return [
        { id: 201, name: "Team Hub", typing: false },
        { id: 202, name: "Management", typing: true },
      ];
    default:
      return [];
  }
};

const ChatApp = () => {
  const [chatMessages, setChatMessages] = useState({});
  const [input, setInput] = useState("");
  const [chatActiveTab, setChatActiveTab] = useState("Work grp");
  const [profileTab, setProfileTab] = useState("members");
  const [chats, setChats] = useState(getChatDataForTab("Work grp"));
  const [pinnedChats, setPinnedChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, chat: null });
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [popupMedia, setPopupMedia] = useState(null);
  const messagesEndRef = useRef(null);
  const closePopup = () => setPopupMedia(null);

  useEffect(() => {
    setChats(getChatDataForTab(chatActiveTab));
    setPinnedChats([]);
    setSelectedChat(null);
    setShowProfile(false);
  }, [chatActiveTab]);

  const messages = selectedChat ? chatMessages[selectedChat.id] || [] : [];

  const sendMessage = () => {
    if (!selectedChat || !input.trim()) return;
    const newMessage = {
      id: Date.now(),
      sender: "You",
      type: "text",
      message: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      side: "right",
    };
    const updatedMessages = [...messages, newMessage];
    setChatMessages({ ...chatMessages, [selectedChat.id]: updatedMessages });
    setInput("");
  };

  const handleFileUpload = (e) => {
    if (!selectedChat || !e.target.files.length) return;
    const files = Array.from(e.target.files);
    const uploadedMessages = files.map((file) => {
      const fileUrl = URL.createObjectURL(file);
      const type = file.type.startsWith("image") ? "image" :
                   file.type.startsWith("video") ? "video" : "file";
      return {
        id: Date.now() + Math.random(),
        sender: "You",
        type,
        src: fileUrl,
        fileName: file.name,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        side: "right",
      };
    });
    const updatedMessages = [...messages, ...uploadedMessages];
    setChatMessages({ ...chatMessages, [selectedChat.id]: updatedMessages });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handlePinChat = (chat) => {
    if (!pinnedChats.find((c) => c.id === chat.id)) {
      setPinnedChats([...pinnedChats, chat]);
      setChats(chats.filter((c) => c.id !== chat.id));
    }
  };

  const handleUnpinChat = (chat) => {
    setPinnedChats(pinnedChats.filter((c) => c.id !== chat.id));
    setChats([...chats, chat]);
  };

  const handleContextMenu = (e, chat) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY, chat });
  };

  const renderChatList = () => (
    <>
      {pinnedChats.length > 0 && (
        <>
          <p className="text-xs text-gray-500 px-2 mb-2 font-semibold">Pinned Chats</p>
          <div className="space-y-2">
            {pinnedChats.map((chat) => (
              <div key={chat.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 cursor-pointer rounded-lg"
                onClick={() => { setSelectedChat(chat); setShowProfile(false); }}
                onContextMenu={(e) => handleContextMenu(e, chat)}
              >
                <div className="flex items-center space-x-3">
                  <img src={`https://i.pravatar.cc/40?u=${chat.id}`} className="rounded-full w-10 h-10" alt="User" />
                  <div>
                    <p className="font-medium text-sm text-gray-800">{chat.name}</p>
                    {chat.typing && <p className="text-xs text-green-600">Typing...</p>}
                  </div>
                </div>
                <Pin size={16} className="text-blue-600" />
              </div>
            ))}
          </div>
          <hr className="my-3" />
        </>
      )}

      <p className="text-xs text-gray-500 px-2 mb-2 font-semibold">All Chats</p>
      <div className="space-y-2">
        {chats.map((chat) => (
          <div key={chat.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 cursor-pointer rounded-lg"
            onClick={() => { setSelectedChat(chat); setShowProfile(false); }}
            onContextMenu={(e) => handleContextMenu(e, chat)}
          >
            <div className="flex items-center space-x-3">
              <img src={`https://i.pravatar.cc/40?u=${chat.id}`} className="rounded-full w-10 h-10" alt="User" />
              <div>
                <p className="font-medium text-sm text-gray-800">{chat.name}</p>
                {chat.typing && <p className="text-xs text-green-600">Typing...</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {contextMenu.visible && (
        <div className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-md px-4 py-2 text-sm"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseLeave={() => setContextMenu({ ...contextMenu, visible: false })}
        >
          {pinnedChats.find((c) => c.id === contextMenu.chat.id) ? (
            <div className="cursor-pointer hover:text-blue-600"
              onClick={() => { handleUnpinChat(contextMenu.chat); setContextMenu({ ...contextMenu, visible: false }); }}
            >
              Unpin Chat
            </div>
          ) : (
            <div className="cursor-pointer hover:text-blue-600"
              onClick={() => { handlePinChat(contextMenu.chat); setContextMenu({ ...contextMenu, visible: false }); }}
            >
              Pin Chat
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="flex h-screen w-full relative bg-gray-50">
      <div className="w-1/4 bg-white border-r border-gray-200 overflow-y-auto p-4">
        <div className="px-2 pb-3">
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative w-full">
              <input type="text" placeholder="Searching..."
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <Search className="absolute right-4 top-3.5 text-gray-400" size={16} />
            </div>
            <button className="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition">
              <Plus size={16} className="text-blue-600" />
            </button>
          </div>

          <div className="flex space-x-2 overflow-x-auto">
            {["Workspace", "Work grp", "Personal Chat"].map((tab) => (
              <button key={tab}
                onClick={() => setChatActiveTab(tab)}
                className={`flex-shrink-0 text-xs px-3 py-1 rounded-full flex items-center space-x-1 transition ${
                  chatActiveTab === tab
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                <span>{tab}</span>
                <span className={`rounded-full px-2 text-[10px] font-semibold ${
                  chatActiveTab === tab
                    ? "bg-white text-blue-600"
                    : "bg-blue-600 text-white"
                }`}>02</span>
              </button>
            ))}
          </div>
        </div>

        {renderChatList()}
      </div>

{selectedChat && (
  <div
    className={`flex flex-col h-full transition-all duration-300 ${
      showProfile ? "w-2/4" : "w-3/4"
    } bg-white shadow-inner`}
  >
    {/* Header */}
    <div
      className="flex items-center justify-between px-5 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition"
      onClick={() => setShowProfile(true)}
    >
      <div className="flex items-center space-x-4">
        <img
          src={`https://i.pravatar.cc/40?u=${selectedChat.id}`}
          className="rounded-full w-12 h-12 shadow-sm"
          alt="User"
        />
        <div>
          <div className="font-semibold text-gray-900">{selectedChat.name}</div>
          <p className="text-sm text-gray-500 truncate max-w-xs">
            Lorem ipsum dolor sit amet consectetur...
          </p>
        </div>
      </div>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50"
  style={{ 
  backgroundImage: `url(${bg})`, 
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh'
}}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.side === "right" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-xs rounded-xl p-3 text-sm shadow-sm transition relative group ${
              msg.side === "right"
                ? "bg-blue-100 text-blue-900"
                : "bg-white border border-gray-200"
            }`}
          >
            {/* Text */}
            {msg.type === "text" && <p>{msg.message}</p>}

            {/* Image */}
            {msg.type === "image" && (
              <img
                src={msg.src}
                alt="chat-img"
                className="chat-img-thumb cursor-pointer max-w-[200px] rounded"
                onClick={() => setPopupMedia({ type: "image", src: msg.src })}
              />
            )}

            {/* Video */}
            {msg.type === "video" && (
              <video
                src={msg.src}
                className="chat-video-thumb cursor-pointer max-w-[200px] rounded"
                controls={false}
                onClick={() => setPopupMedia({ type: "video", src: msg.src })}
              />
            )}

            {/* File */}
            {msg.type === "file" && (
              <div
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => window.open(msg.src, "_blank", "noopener,noreferrer")}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                  {msg.fileName.split('.').pop().toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-blue-700 text-sm truncate max-w-[180px]">
                    {msg.fileName}
                  </p>
                  <p className="text-xs text-gray-500">Tap to view</p>
                </div>
              </div>
            )}

            {/* Time */}
            <div className="text-xs text-gray-400 mt-1 text-right">{msg.time}</div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>

    {/* Input Area */}
    <div className="p-4 border-t border-gray-200 flex items-center space-x-4 bg-white">
      <div className="relative">
        <button
          onClick={() => setShowFileOptions(!showFileOptions)}
          className="text-gray-500 hover:text-blue-600 transition"
        >
          <Paperclip size={22} />
        </button>
        {showFileOptions && (
          <div className="absolute bottom-12 left-0 bg-white border border-gray-200 shadow-lg rounded-lg p-2 flex space-x-4 z-20">
            <label className="cursor-pointer text-gray-600 hover:text-blue-600 transition">
              <ImageIcon size={20} />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <label className="cursor-pointer text-gray-600 hover:text-blue-600 transition">
              <Video size={20} />
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <label className="cursor-pointer text-gray-600 hover:text-blue-600 transition">
              <FileText size={20} />
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type your message..."
        className="flex-1 border border-gray-300 rounded-full px-5 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition shadow"
      >
        <Send size={20} />
      </button>
    </div>

    {/* Popup for image/video */}
    {popupMedia && (
      <div
        className="popup-overlay"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          padding: "10px", // some padding for small screens
        }}
        onClick={closePopup} // close on clicking outside content
      >
        <div
          className="popup-content"
          style={{
            position: "relative",
            maxWidth: "800px",
            maxHeight: "80vh",
            width: "90%",
            backgroundColor: "transparent",
            borderRadius: "8px",
            boxShadow: "0 0 15px rgba(0,0,0,0.5)",
          }}
          onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside popup content
        >
          <button
            onClick={closePopup}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              fontSize: "28px",
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              zIndex: 10,
            }}
            aria-label="Close"
          >
            &times;
          </button>

          {popupMedia.type === "image" && (
            <img
              src={popupMedia.src}
              alt="expanded"
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "80vh",
                margin: "0 auto",
                borderRadius: "6px",
              }}
            />
          )}

          {popupMedia.type === "video" && (
            <video
              src={popupMedia.src}
              controls
              autoPlay
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "80vh",
                margin: "0 auto",
                borderRadius: "6px",
                backgroundColor: "black",
              }}
            />
          )}
        </div>
      </div>
    )}
  </div>
)}



      {/* Profile Panel */}

{showProfile && selectedChat && (
  <div className="w-1/4 h-full bg-white border-l border-gray-200 p-6 overflow-y-auto shadow-inner rounded-l-lg">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
      <button
        onClick={() => setShowProfile(false)}
        className="text-gray-600 hover:text-gray-900 transition"
        aria-label="Close profile panel"
      >
        <X size={24} />
      </button>
    </div>
    <div className="flex flex-col items-center text-center space-y-3 mb-8">
      <img
        src={`https://i.pravatar.cc/80?u=${selectedChat.id}`}
        className="w-24 h-24 rounded-full shadow-md"
        alt="Profile"
      />
      <h3 className="text-xl font-semibold text-gray-900">{selectedChat.name}</h3>
      <p className="text-sm text-gray-600 max-w-xs">
        Lorem ipsum dolor sit amet consectetur. Cras est adipiscing nisi...
      </p>
      <button className="text-sm px-4 py-2 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50 transition">
        Edit Info
      </button>
    </div>

    {chatActiveTab !== "Personal Chat" && (
      <>
        {/* Toggle Buttons */}
        <div className="flex space-x-3 mb-5">
          <button
            className={`px-4 py-2 text-sm rounded-lg font-medium shadow-sm transition ${
              profileTab === "members"
                ? "bg-blue-600 text-white shadow-md"
                : "border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setProfileTab("members")}
          >
            Members
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-lg font-medium shadow-sm transition ${
              profileTab === "website"
                ? "bg-blue-600 text-white shadow-md"
                : "border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setProfileTab("website")}
          >
            Website Info
          </button>
        </div>

        {/* Conditional Content */}
        {profileTab === "members" ? (
          <>
            <input
              type="text"
              placeholder="Search Member..."
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button className="w-full mb-4 border border-blue-600 px-4 py-2 rounded-lg text-sm text-blue-600 font-semibold hover:bg-blue-50 transition text-left">
              + Add Person
            </button>
            <ul className="space-y-4">
              {[{ name: "Bill Gates", role: "Client", special: false },
                { name: "Bill Gates", role: "UI/UX Designer", special: true },
                { name: "Deen Ambros", role: "Developer" },
                { name: "Amsterdam", role: "Manager" },
                { name: "Sophie Verlaine", role: "Designer" },
                { name: "Liam Chen", role: "Product Owner" },
                { name: "Isabella Rodriguez", role: "Marketing Specialist" },
                { name: "Omar Patel", role: "Data Analyst" },
              ].map((person, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-4 hover:bg-gray-100 p-2 rounded-lg transition"
                >
                  <img
                    src={`https://i.pravatar.cc/40?img=${index + 1}`}
                    className="w-10 h-10 rounded-full shadow-sm"
                    alt={person.name}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{person.name}</p>
                    <p
                      className={`text-xs ${
                        person.special
                          ? "text-blue-600 font-semibold"
                          : "text-gray-500 font-medium"
                      }`}
                    >
                      {person.role}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-gray-500 text-center italic mt-10">No Website Info available.</p>
        )}
      </>
    )}
  </div>
)}

    </div>
  );
};

export default ChatApp;
