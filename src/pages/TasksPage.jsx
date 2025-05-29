// ./TasksPage.js
import React, { useState, useRef } from 'react'; // Added useRef
import {
  Search, 
  ChevronDown, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  MoreVertical,
  MessageSquare, 
  Paperclip, 
  Flag, 
  Clock, // Icons for TaskCard and Page Header
  ArrowLeft, 
  Link as LinkIcon, 
  MessageSquarePlus, 
  FileText, 
  CalendarDays, 
  X // Icons for Modal & Small Popups
} from 'lucide-react';

// --- Constants for the entire page ---
// ... (TASK_IMAGE_URL, attachmentImage1, etc., dummyTasks, tagStyleMapping, priorityStyleMapping remain the same)
const TASK_IMAGE_URL = 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGRhdGElMjBmbG93fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60';
const attachmentImage1 = "https://via.placeholder.com/100x150/D1C4E9/673AB7?Text=Wisteria";
const attachmentImage2 = "https://via.placeholder.com/100x150/B39DDB/512DA8?Text=Anemone";
const attachmentImage3 = "https://via.placeholder.com/100x150/9575CD/7E57C2?Text=Tulip";
const avatarPlaceholder = "https://via.placeholder.com/40/78909C/FFFFFF?Text=U";

const dummyTasks = [ /* ... (dummyTasks data remains the same) ... */
    // Backlog
  {
    id: 'b1', column: 'Backlog', workspaceName: 'Workspace_Name', priority: 'High', escalation: true,
    title: 'Improve cards readability', description: 'As a team license owner, I want to use multiplied limits',
    image: TASK_IMAGE_URL,
    assignees: ['#FF5733', '#FFC300', '#C70039', '#900C3F', '#581845'],
    dateInfo: '21/03/22', timeInfo: '06:45 PM', daysLeft: 'D-1',
    comments: 12, files: 0, tags: ['Development', 'Content Writing']
  },
  {
    id: 'b2', column: 'Backlog', workspaceName: 'Workspace_Name', priority: 'Low',
    title: 'Improve cards readability', description: 'As a team license owner, I want to use multiplied limits',
    image: TASK_IMAGE_URL,
    assignees: ['#FF5733', '#FFC300', '#C70039'],
    dateInfo: '21/03/22', timeInfo: '06:45 PM', daysLeft: 'D-2',
    comments: 12, files: 0, tags: ['Designing', 'Development', 'Content Writing']
  },
  {
    id: 'b3', column: 'Backlog', workspaceName: 'Workspace_Name', priority: 'Medium', escalation: true,
    title: 'Improve cards readability', description: 'As a team license owner, I want to use multiplied limits',
    image: TASK_IMAGE_URL,
    assignees: ['#FF5733', '#FFC300'],
    dateInfo: '21/03/22', timeInfo: '06:45 PM', daysLeft: 'D-2',
    comments: 12, files: 0, tags: ['Designing', 'Development']
  },
  // TO-DO
  {
    id: 't1', column: 'TO-DO', workspaceName: 'Workspace_Name', priority: 'High',
    title: 'Improve cards readability', description: 'As a team license owner, I want to use multiplied limits',
    image: TASK_IMAGE_URL,
    assignees: ['#FF5733', '#FFC300', '#C70039', '#900C3F', '#581845'],
    dateInfo: '21/03/22', timeInfo: '06:45 PM', daysLeft: 'D-1',
    comments: 12, files: 0, tags: ['Designing', 'Development', 'Content Writing']
  },
  {
    id: 't2', column: 'TO-DO', workspaceName: 'Workspace_Name', priority: 'Low', 
    title: 'Improve cards readability', description: 'As a team license owner, I want to use multiplied limits',
    image: TASK_IMAGE_URL,
    assignees: ['#FF5733', '#FFC300', '#C70039', '#900C3F'],
    dateInfo: '21/03/22', timeInfo: '06:45 PM', daysLeft: 'D-18',
    comments: 12, files: 0, tags: ['Designing', 'Development', 'Content Writing']
  },
  {
    id: 't3', column: 'TO-DO', workspaceName: 'Workspace_Name', priority: 'Medium',
    title: 'Improve cards readability', description: 'As a team license owner, I want to use multiplied limits',
    image: TASK_IMAGE_URL,
    assignees: ['#FF5733', '#FFC300', '#C70039'],
    dateInfo: '21/03/22', timeInfo: '06:45 PM', daysLeft: 'D-2',
    comments: 12, files: 0, tags: ['Designing', 'Content Writing']
  },
  // Processing
  {
    id: 'p1', column: 'Processing', workspaceName: 'Workspace_Name', priority: 'High',
    title: 'Improve cards readability', description: 'As a team license owner, I want to use multiplied limits',
    image: TASK_IMAGE_URL,
    assignees: ['#FF5733', '#FFC300', '#C70039', '#900C3F', '#581845'],
    dateInfo: '21/03/22', timeInfo: '06:45 PM', daysLeft: 'D-1',
    comments: 12, files: 0, tags: ['Designing', 'Development', 'Content Writing']
  },
  {
    id: 'p2', column: 'Processing', workspaceName: 'Workspace_Name', priority: 'Low',
    title: 'Improve cards readability', description: 'As a team license owner, I want to use multiplied limits',
    image: TASK_IMAGE_URL,
    assignees: ['#FF5733', '#FFC300'],
    dateInfo: '21/03/22', timeInfo: '06:45 PM', daysLeft: 'D-2',
    comments: 12, files: 0, tags: ['Development', 'Content Writing']
  },
  {
    id: 'p3', column: 'Processing', workspaceName: 'Workspace_Name', priority: 'Medium', escalation: true,
    title: 'Improve cards readability', description: 'As a team license owner, I want to use multiplied limits',
    image: TASK_IMAGE_URL,
    assignees: ['#FF5733', '#FFC300', '#C70039', '#900C3F'],
    dateInfo: '21/03/22', timeInfo: '06:45 PM', daysLeft: 'D-2',
    comments: 12, files: 0, tags: ['Designing', 'Development']
  },
  // Review
  {
    id: 'r1', column: 'Review', workspaceName: 'Workspace_Name', priority: 'High',
    title: 'Improve cards readability', description: 'As a team license owner, I want to use multiplied limits',
    image: TASK_IMAGE_URL,
    assignees: ['#FF5733', '#FFC300', '#C70039', '#900C3F', '#581845'],
    dateInfo: '21/03/22', timeInfo: '06:45 PM', daysLeft: 'D-1',
    comments: 12, files: 0, tags: ['Designing', 'Development', 'Content Writing']
  },
  {
    id: 'r2', column: 'Review', workspaceName: 'Workspace_Name', priority: 'Low',
    title: 'Improve cards readability', description: 'As a team license owner, I want to use multiplied limits',
    image: TASK_IMAGE_URL,
    assignees: ['#FF5733', '#FFC300'],
    dateInfo: '21/03/22', timeInfo: '06:45 PM', daysLeft: 'D-2',
    comments: 12, files: 0, tags: ['Development', 'Content Writing']
  },
  {
    id: 'r2', column: 'Review', workspaceName: 'Workspace_Name', priority: 'Low',
    title: 'Improve cards readability', description: 'As a team license owner, I want to use multiplied limits',
    image: TASK_IMAGE_URL,
    assignees: ['#FF5733', '#FFC300'],
    dateInfo: '21/03/22', timeInfo: '06:45 PM', daysLeft: 'D-2',
    comments: 12, files: 0, tags: ['Development', 'Content Writing']
  },
  // Done
  {
    id: 'd1', column: 'Done', workspaceName: 'Workspace_Name', priority: 'High',
    title: 'Improve cards readability', description: 'As a team license owner, I want to use multiplied limits',
    image: TASK_IMAGE_URL,
    assignees: ['#FF5733', '#FFC300', '#C70039', '#900C3F', '#581845'],
    dateInfo: '21/03/22', timeInfo: '06:45 PM', daysLeft: 'D-1',
    comments: 12, files: 0, tags: ['Designing', 'Development', 'Content Writing']
  },
  {
    id: 'd2', column: 'Done', workspaceName: 'Workspace_Name', priority: 'Low',
    title: 'Improve cards readability', description: 'As a team license owner, I want to use multiplied limits',
    image: TASK_IMAGE_URL,
    assignees: ['#FF5733', '#FFC300'],
    dateInfo: '21/03/22', timeInfo: '06:45 PM', daysLeft: 'D-2',
    comments: 12, files: 0, tags: ['Development', 'Content Writing']
  },
];
const tagStyleMapping = { /* ... (tagStyleMapping remains the same) ... */
  Designing: { dot: 'bg-pink-500', text: 'text-pink-700' },
  Development: { dot: 'bg-blue-500', text: 'text-blue-700' },
  'Content Writing': { dot: 'bg-green-500', text: 'text-green-700' },
};
const priorityStyleMapping = { /* ... (priorityStyleMapping remains the same) ... */
  High: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' },
  Medium: { bg: 'bg-yellow-100', text: 'text-yellow-600', dot: 'bg-yellow-500' },
  Low: { bg: 'bg-green-100', text: 'text-green-600', dot: 'bg-green-500' },
};

// --- Generic Small Popup Component ---
const SmallPopup = ({ isOpen, onClose, title, children, onSubmit }) => { /* ... (SmallPopup remains the same) ... */
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(); 
    onClose(); 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl p-5 w-full max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {children}
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300"
            >
              cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- TaskDetailModal Component (defined within TasksPage.js) ---
const TaskDetailModal = ({ isOpen, onClose, task }) => {
  const [showAttachLinkPopup, setShowAttachLinkPopup] = useState(false);
  const [showAddCommentPopup, setShowAddCommentPopup] = useState(false);
  const [showAddReplyPopup, setShowAddReplyPopup] = useState(false);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');

  // Ref for the hidden file input
  const fileInputRef = useRef(null);

  if (!isOpen || !task) return null;

  const priorityStyles = priorityStyleMapping[task.priority] || {};
  const dummyComments = [ /* ... (dummyComments in TaskDetailModal remains the same) ... */
    {
      id: 1, user: 'Range', avatar: avatarPlaceholder,
      text: 'Lorem ipsum dolor sit amet consectetur. Sed rutrum non condimentum eu ultricies sit massa. Pulvinar pellentesque ut tellus et donec laoreet ut. Ornare risus sed aliquam ut eget aenean venenatis eu. Elementum natoque ac odio vulputate pellentesque in. Praesent congue etiam ultricies enim erat turpis.',
      repliesCount: '02',
    },
    { id: 2, user: 'Range', avatar: avatarPlaceholder, text: 'Lorem ipsum dolor sit amet consectetur. Sed rutrum non condimentum eu ultricies sit massa.' },
    { id: 3, user: 'Range', avatar: avatarPlaceholder, text: 'Lorem ipsum dolor sit amet consectetur. Sed rutrum non condimentum eu ultricies sit massa.' },
    {
      id: 4, user: 'Range', avatar: avatarPlaceholder,
      text: 'Lorem ipsum dolor sit amet consectetur. Sed rutrum non condimentum eu ultricies sit massa. Pulvinar pellentesque ut tellus et donec laoreet ut. Ornare risus sed aliquam ut eget aenean venenatis eu. Elementum natoque ac odio vulputate pellentesque in. Praesent congue etiam ultricies enim erat turpis.',
    },
  ];
  const attachments = [ /* ... (attachments in TaskDetailModal remains the same) ... */
    { type: 'image', url: attachmentImage1, name: 'Wisteria Design.png' },
    { type: 'image', url: attachmentImage2, name: 'Purple Flower.jpg' },
    { type: 'image', url: attachmentImage3, name: 'Tulip Inspiration.png' },
    { type: 'image', url: attachmentImage1, name: 'Wisteria Alt.png' },
    { type: 'image', url: attachmentImage2, name: 'Anemone Detail.jpg' },
    { type: 'image', url: attachmentImage3, name: 'Tulip Sketch.png' },
  ];
  const links = [ /* ... (links in TaskDetailModal remains the same) ... */
    { id: 'l1', name: 'Link 1', url: '#' },
    { id: 'f1', name: 'Filename.exe', url: '#' },
  ];

  const handleAttachLinkSubmit = () => { /* ... */ console.log("Attach Link:", { linkName, linkUrl, taskId: task.id }); setLinkName(''); setLinkUrl('');};
  const handleAddCommentSubmit = () => { /* ... */ console.log("Add Comment:", { commentText, taskId: task.id }); setCommentText(''); };
  const handleAddReplySubmit = () => { /* ... */ console.log("Add Reply:", { replyText, commentId: replyingToCommentId, taskId: task.id }); setReplyText(''); setReplyingToCommentId(null); };

  // Handler for the "Attach File" button click
  const handleAttachFileClick = () => {
    fileInputRef.current.click(); // Programmatically click the hidden file input
  };

  // Handler for when a file is selected
  const handleFileSelected = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log("Selected files:", files);
      // Here you would typically handle the file upload process
      // For example, prepare FormData and make an API call
      // For multiple files: Array.from(files).forEach(file => console.log(file.name));
      alert(`Selected file: ${files[0].name}`); // Simple feedback
    }
    // Reset the input value so the same file can be selected again if needed
    event.target.value = null; 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 pb-10 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 p-6 animate-fadeIn">
        {/* ... (TaskDetailModal header, title, description, attachments, links - remains the same) ... */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <button onClick={onClose} className="hover:text-gray-800">
              <ArrowLeft size={20} />
            </button>
            <span className="font-semibold text-gray-800">{task.daysLeft || 'D-X'}</span>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md font-medium">
              {task.workspaceName}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-md font-medium flex items-center ${priorityStyles.bg} ${priorityStyles.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${priorityStyles.dot}`}></span>
              {task.priority}
            </span>
            <span className="flex items-center">
                <CalendarDays size={14} className="mr-1 text-gray-500" />
                {task.dateInfo}
            </span>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{task.title}</h2>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {task.description} Lorem ipsum dolor sit amet consectetur. Volutpat amet pulvinar morbi nisl viverra cursus ornare. Amet sed elementum nisl malesuada ullamcorper velit mauris. Lobortis neque amet tellus nisl aliquam aenean eget at sit. Pharetra pellentesque a adipiscing volutpat eget. Phasellus eleifend in pretium enim nunc suspendisse.
        </p>
        {attachments.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {attachments.map((att, index) => (
                <div key={index} className="aspect-[2/3] bg-gray-200 rounded overflow-hidden">
                  <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-3 mb-6">
          {links.map(link => (
             <button key={link.id} className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md border border-gray-300">
               {link.id.startsWith('l') ? <LinkIcon size={16} className="mr-2" /> : <FileText size={16} className="mr-2" />}
               {link.name}
             </button>
          ))}
        </div>

        {/* Action Buttons - "Attach File" button updated */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button 
            onClick={() => setShowAttachLinkPopup(true)}
            className="flex items-center text-sm bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            <LinkIcon size={16} className="mr-2" /> Attach link
          </button>
          <button 
            onClick={handleAttachFileClick} // Updated onClick handler
            className="flex items-center text-sm bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            <Paperclip size={16} className="mr-2" /> Attach File
          </button>
          {/* Hidden file input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelected}
            className="hidden" 
            multiple // Allow multiple file selection if needed, remove if not
          />
          <button 
            onClick={() => setShowAddCommentPopup(true)}
            className="flex items-center text-sm bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            <MessageSquarePlus size={16} className="mr-2" /> Add Comment
          </button>
        </div>

        {/* Comments Section - Updated Reply button */}
        {/* ... (Comments section remains the same) ... */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Comments</h3>
          <div className="space-y-5">
            {dummyComments.map(comment => (
              <div key={comment.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                <div className="flex items-start space-x-3">
                  <img src={comment.avatar} alt={comment.user} className="w-8 h-8 rounded-full mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-700">{comment.user}</p>
                    <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <button 
                        onClick={() => {
                          setReplyingToCommentId(comment.id); 
                          setShowAddReplyPopup(true);
                        }}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Reply
                      </button>
                      {comment.repliesCount && (
                        <>
                         <div className="relative flex items-center">
                            <span className="text-xs text-blue-600 mr-2">View</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                              {comment.repliesCount}
                            </span>
                          </div>
                          <div className="h-0.5 bg-blue-500 w-20 rounded-full"></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Render Small Popups */}
        {/* ... (SmallPopup instances remain the same) ... */}
        <SmallPopup
          isOpen={showAttachLinkPopup}
          onClose={() => { setShowAttachLinkPopup(false); setLinkName(''); setLinkUrl(''); }}
          title="Attach Link"
          onSubmit={handleAttachLinkSubmit}
        >
          <input
            type="text"
            placeholder="Link name"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Paste the link"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </SmallPopup>

        <SmallPopup
          isOpen={showAddCommentPopup}
          onClose={() => { setShowAddCommentPopup(false); setCommentText('');}}
          title="Add comment"
          onSubmit={handleAddCommentSubmit}
        >
          <textarea
            placeholder="Comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </SmallPopup>

        <SmallPopup
          isOpen={showAddReplyPopup}
          onClose={() => { setShowAddReplyPopup(false); setReplyText(''); setReplyingToCommentId(null);}}
          title="Add Reply"
          onSubmit={handleAddReplySubmit}
        >
          <textarea
            placeholder="Comment" 
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </SmallPopup>
      </div>
    </div>
  );
};


// --- TaskCard Component ---
const TaskCard = ({ task, onCardClick }) => { /* ... (TaskCard remains the same) ... */
  const priorityStyles = priorityStyleMapping[task.priority] || {};

  return (
    <div
      className={`bg-white rounded-lg shadow p-3.5 mb-4 cursor-pointer hover:shadow-md transition-shadow ${task.selected ? 'ring-2 ring-blue-500 shadow-lg' : 'border border-gray-200'}`}
      onClick={() => onCardClick(task)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md font-medium">{task.workspaceName}</span>
          {task.escalation && (
            <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-md font-medium">Escalation</span>
          )}
           <span className={`text-xs px-2 py-0.5 rounded-md font-medium flex items-center ${priorityStyles.bg} ${priorityStyles.text}`}>
            <span className={`w-2 h-2 rounded-full mr-1.5 ${priorityStyles.dot}`}></span>
            {task.priority}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={18} />
        </button>
      </div>
      <h3 className="font-semibold text-sm text-gray-800 mb-1">{task.title}</h3>
      <p className="text-xs text-gray-500 mb-3">{task.description}</p>
      {task.image && (
        <img src={task.image} alt={task.title} className="w-full h-32 object-cover rounded-md mb-3" />
      )}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <Flag size={14} className="mr-1 text-red-500" />
            {task.dateInfo}
          </span>
          <span className="flex items-center">
            <Clock size={14} className="mr-1" />
            {task.timeInfo}
          </span>
        </div>
        <span className="font-medium text-gray-600">{task.daysLeft}</span>
      </div>
      <div className="flex justify-between items-center mb-3">
        <div className="flex -space-x-2">
          {task.assignees.slice(0, 5).map((color, index) => (
            <div key={index} className="w-6 h-6 rounded-full border-2 border-white" style={{ backgroundColor: color }}></div>
          ))}
          {task.assignees.length > 5 && (
            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs text-gray-600">
              +{task.assignees.length - 5}
            </div>
          )}
        </div>
        <div className="flex items-center text-xs text-gray-500 space-x-3">
          <span className="flex items-center"><MessageSquare size={14} className="mr-1" /> {task.comments} comments</span>
          <span className="flex items-center"><Paperclip size={14} className="mr-1" /> {task.files} files</span>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-2 flex flex-wrap gap-y-1">
        {task.tags.map(tag => {
          const style = tagStyleMapping[tag] || { dot: 'bg-gray-400', text: 'text-gray-600' };
          return (
            <span key={tag} className={`text-xs font-medium mr-2 py-0.5 flex items-center ${style.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${style.dot}`}></span>
              {tag}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// --- TasksPage Component (Main page component) ---
const TasksPage = () => { /* ... (TasksPage main logic remains the same) ... */
  const columns = ['Backlog', 'TO-DO', 'Processing', 'Review', 'Done'];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null);

  const handleCardClick = (task) => {
    setSelectedTaskForModal(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTaskForModal(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      {/* ... (Header JSX remains the same) ... */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Work Flow</h1>
        <div className="flex flex-grow sm:flex-grow-0 w-full sm:w-auto items-center gap-3">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 text-gray-600 py-2.5 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-400 text-sm">
              <option>Short by</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none text-sm">
            Filters
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-2.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      {/* ... (Kanban Board Columns JSX remains the same) ... */}
      <div className="flex-1 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        <div className="flex space-x-4 h-full py-1">
          {columns.map(columnName => (
            <div
              key={columnName}
              className="bg-gray-100 rounded-lg p-3 pt-4 flex flex-col w-[330px] sm:w-[340px] md:w-[350px] flex-shrink-0 h-full"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-semibold text-gray-700">{columnName}</h2>
                <div className="flex items-center space-x-1.5">
                  <button className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200">
                    <Plus size={18} />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {dummyTasks
                  .filter(task => task.column === columnName)
                  .map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onCardClick={handleCardClick}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TaskDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTaskForModal}
      />
    </div>
  );
};

export default TasksPage;