import React, { useState, useRef, useCallback } from 'react'; 
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
  Clock, 
  ArrowLeft, 
  Link as LinkIcon, 
  MessageSquarePlus, 
  FileText, 
  CalendarDays, 
  X,
  UploadCloud, 
  Trash2,      
} from 'lucide-react';

export const TASK_IMAGE_URL = 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGRhdGElMjBmbG93fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60';
export const attachmentImage1 = "https://via.placeholder.com/100x150/D1C4E9/673AB7?Text=Wisteria";
export const attachmentImage2 = "https://via.placeholder.com/100x150/B39DDB/512DA8?Text=Anemone";
export const attachmentImage3 = "https://via.placeholder.com/100x150/9575CD/7E57C2?Text=Tulip";
export const avatarPlaceholder = "https://via.placeholder.com/40/78909C/FFFFFF?Text=U";

export const initialDummyTasks = [ // Renamed to initialDummyTasks
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
    id: 'r3', column: 'Review', workspaceName: 'Workspace_Name', priority: 'Low',
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

export const tagStyleMapping = {
  Designing: { dot: 'bg-pink-500', text: 'text-pink-700' },
  Development: { dot: 'bg-blue-500', text: 'text-blue-700' },
  'Content Writing': { dot: 'bg-green-500', text: 'text-green-700' },
};

export const priorityStyleMapping = {
  High: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' },
  Medium: { bg: 'bg-yellow-100', text: 'text-yellow-600', dot: 'bg-yellow-500' },
  Low: { bg: 'bg-green-100', text: 'text-green-600', dot: 'bg-green-500' },
};

// --- Generic Small Popup Component ---
export const SmallPopup = ({ isOpen, onClose, title, children, onSubmit }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(); 
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

export const FileUploadDialog = ({ isOpen, onClose, onFilesConfirm }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(prevFiles => {
        const newFiles = files.filter(f => !prevFiles.some(pf => pf.name === f.name && pf.lastModified === f.lastModified && pf.size === f.size));
        return [...prevFiles, ...newFiles];
    });
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prevFiles => {
        const newFiles = files.filter(f => !prevFiles.some(pf => pf.name === f.name && pf.lastModified === f.lastModified && pf.size === f.size));
        return [...prevFiles, ...newFiles];
    });
    e.target.value = null; // Reset file input
  };

  const removeFile = (fileNameToRemove) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => file.name !== fileNameToRemove));
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleConfirm = () => {
    if (onFilesConfirm && selectedFiles.length > 0) {
        onFilesConfirm(selectedFiles);
    }
    setSelectedFiles([]);
    onClose();
  };
  
  const handleCancel = () => {
    setSelectedFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[70]">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-md p-6 text-center mb-4
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            transition-colors duration-200`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={!isDragging ? handleBrowseClick : undefined}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
          <UploadCloud size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            Drag & drop files here, or <span className="text-blue-600 font-semibold cursor-pointer" onClick={handleBrowseClick}>click to browse</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">Max. file size: 5MB each (Example)</p>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mb-4 max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Selected files:</h4>
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center justify-between bg-gray-50 p-2 rounded-md text-sm">
                <div className="flex items-center overflow-hidden min-w-0">
                  <FileText size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                  <span className="truncate" title={file.name}>{file.name}</span>
                  <span className="ml-2 text-gray-500 text-xs flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button onClick={() => removeFile(file.name)} className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={handleCancel} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleConfirm}
            disabled={selectedFiles.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Attach {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- TaskDetailModal Component (defined within TasksPage.js) ---
export const TaskDetailModal = ({ isOpen, onClose, task }) => {
  const [showAttachLinkPopup, setShowAttachLinkPopup] = useState(false);
  const [showAddCommentPopup, setShowAddCommentPopup] = useState(false);
  const [showAddReplyPopup, setShowAddReplyPopup] = useState(false);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);

  if (!isOpen || !task) return null;

  const priorityStyles = priorityStyleMapping[task.priority] || {};
  const dummyComments = [
    { id: 1, user: 'Range', avatar: avatarPlaceholder, text: 'Lorem ipsum dolor sit amet consectetur. Sed rutrum non condimentum eu ultricies sit massa. Pulvinar pellentesque ut tellus et donec laoreet ut. Ornare risus sed aliquam ut eget aenean venenatis eu. Elementum natoque ac odio vulputate pellentesque in. Praesent congue etiam ultricies enim erat turpis.', repliesCount: '02'},
    { id: 2, user: 'Range', avatar: avatarPlaceholder, text: 'Lorem ipsum dolor sit amet consectetur. Sed rutrum non condimentum eu ultricies sit massa.' },
  ];
  const attachments = [
    { type: 'image', url: attachmentImage1, name: 'Wisteria Design.png' }, { type: 'image', url: attachmentImage2, name: 'Purple Flower.jpg' }, { type: 'image', url: attachmentImage3, name: 'Tulip Inspiration.png' },
    { type: 'image', url: attachmentImage1, name: 'Wisteria Alt.png' }, { type: 'image', url: attachmentImage2, name: 'Anemone Detail.jpg' }, { type: 'image', url: attachmentImage3, name: 'Tulip Sketch.png' },
  ];
  const links = [ { id: 'l1', name: 'Link 1', url: '#' }, { id: 'f1', name: 'Filename.exe', url: '#' },];

  const handleAttachLinkSubmit = () => { console.log("Attach Link:", { linkName, linkUrl, taskId: task.id }); setLinkName(''); setLinkUrl('');};
  const handleAddCommentSubmit = () => { console.log("Add Comment:", { commentText, taskId: task.id }); setCommentText(''); };
  const handleAddReplySubmit = () => { console.log("Add Reply:", { replyText, commentId: replyingToCommentId, taskId: task.id }); setReplyText(''); setReplyingToCommentId(null); };
  const handleFilesAttachment = (files) => {
    console.log("Files to attach from dialog:", files.map(f => ({name: f.name, size: f.size})));
    alert(`${files.length} file(s) selected for attachment. Check console.`);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 pb-10 z-50 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 p-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <button onClick={onClose} className="hover:text-gray-800 p-1"> <ArrowLeft size={20} /> </button>
              <span className="font-semibold text-gray-800">{task.daysLeft || 'D-X'}</span>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md font-medium"> {task.workspaceName} </span>
              <span className={`text-xs px-2 py-0.5 rounded-md font-medium flex items-center ${priorityStyles.bg} ${priorityStyles.text}`}> <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${priorityStyles.dot}`}></span> {task.priority} </span>
              <span className="flex items-center"> <CalendarDays size={14} className="mr-1 text-gray-500" /> {task.dateInfo} </span>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{task.title}</h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed"> {task.description} Lorem ipsum dolor sit amet consectetur. Volutpat amet pulvinar morbi nisl viverra cursus ornare. Amet sed elementum nisl malesuada ullamcorper velit mauris. Lobortis neque amet tellus nisl aliquam aenean eget at sit. Pharetra pellentesque a adipiscing volutpat eget. Phasellus eleifend in pretium enim nunc suspendisse. </p>
          {attachments.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {attachments.map((att, index) => (
                  <div key={index} className="aspect-[2/3] bg-gray-200 rounded overflow-hidden group relative">
                    <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity"> {att.name} </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {links.length > 0 && (
            <div className="mb-6">
                 <h4 className="text-sm font-semibold text-gray-700 mb-2">Links</h4>
                <div className="flex flex-wrap gap-3">
                    {links.map(link => (
                    <button key={link.id} onClick={() => window.open(link.url, '_blank')} className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md border border-gray-300" >
                        {link.id.startsWith('l') ? <LinkIcon size={16} className="mr-2" /> : <FileText size={16} className="mr-2" />} {link.name}
                    </button>
                    ))}
                </div>
            </div>
          )}
          <div className="flex flex-wrap gap-3 mb-8">
            <button onClick={() => setShowAttachLinkPopup(true)} className="flex items-center text-sm bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md"> <LinkIcon size={16} className="mr-2" /> Attach link </button>
            <button onClick={() => setShowFileUploadDialog(true)} className="flex items-center text-sm bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md"> <Paperclip size={16} className="mr-2" /> Attach File </button>
            <button onClick={() => setShowAddCommentPopup(true)} className="flex items-center text-sm bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md"> <MessageSquarePlus size={16} className="mr-2" /> Add Comment </button>
          </div>
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
                        <button onClick={() => { setReplyingToCommentId(comment.id); setShowAddReplyPopup(true); }} className="text-xs text-blue-600 hover:underline" > Reply </button>
                        {comment.repliesCount && (
                          <div className="relative flex items-center">
                              <span className="text-xs text-blue-600 mr-2 cursor-pointer hover:underline">View replies</span>
                              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium"> {comment.repliesCount} </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <SmallPopup isOpen={showAttachLinkPopup} onClose={() => { setShowAttachLinkPopup(false); setLinkName(''); setLinkUrl(''); }} title="Attach Link" onSubmit={handleAttachLinkSubmit} >
            <input type="text" placeholder="Link name" value={linkName} onChange={(e) => setLinkName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <input type="text" placeholder="Paste the link" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </SmallPopup>
          <SmallPopup isOpen={showAddCommentPopup} onClose={() => { setShowAddCommentPopup(false); setCommentText('');}} title="Add comment" onSubmit={handleAddCommentSubmit} >
            <textarea placeholder="Comment" value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </SmallPopup>
          <SmallPopup isOpen={showAddReplyPopup} onClose={() => { setShowAddReplyPopup(false); setReplyText(''); setReplyingToCommentId(null);}} title="Add Reply" onSubmit={handleAddReplySubmit} >
            <textarea placeholder="Your reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </SmallPopup>
        </div>
      </div>
      <FileUploadDialog isOpen={showFileUploadDialog} onClose={() => setShowFileUploadDialog(false)} onFilesConfirm={handleFilesAttachment} />
    </>
  );
};

// --- TaskCard Component ---
const TaskCard = ({ task, onCardClick, onDragStartItem, onDragEndItem, isBeingDragged }) => { // Added D&D props
  const priorityStyles = priorityStyleMapping[task.priority] || {};

  return (
    <div
      draggable="true" // Make the card draggable
      onDragStart={onDragStartItem} // Attach drag start handler
      onDragEnd={onDragEndItem}     // Attach drag end handler
      className={`bg-white rounded-lg shadow p-3.5 mb-4 cursor-grab hover:shadow-md transition-shadow 
                  ${task.selected ? 'ring-2 ring-blue-500 shadow-lg' : 'border border-gray-200'}
                  ${isBeingDragged ? 'opacity-50 ring-2 ring-blue-400 scale-105' : ''}`} // Style for dragged item + cursor changed to grab
      onClick={() => {
        // Prevent click if a drag operation might be starting (this is a simple check, browser often handles this)
        if (!isBeingDragged) { // Only open modal if not currently in a drag state (might need more robust check)
          onCardClick(task);
        }
      }}
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
        <button className="text-gray-400 hover:text-gray-600 p-0.5 rounded hover:bg-gray-100">
          <MoreVertical size={18} />
        </button>
      </div>
      <h3 className="font-semibold text-sm text-gray-800 mb-1">{task.title}</h3>
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
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
            <div key={index} className="w-6 h-6 rounded-full border-2 border-white" style={{ backgroundColor: color }} title={`Assignee ${index + 1}`}></div>
          ))}
          {task.assignees.length > 5 && (
            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs text-gray-600">
              +{task.assignees.length - 5}
            </div>
          )}
        </div>
        <div className="flex items-center text-xs text-gray-500 space-x-3">
          <span className="flex items-center"><MessageSquare size={14} className="mr-1" /> {task.comments}</span>
          <span className="flex items-center"><Paperclip size={14} className="mr-1" /> {task.files}</span>
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
const TasksPage = () => {
  const columns = ['Backlog', 'TO-DO', 'Processing', 'Review', 'Done'];
  const [tasks, setTasks] = useState(initialDummyTasks); // Use state for tasks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null);

  // State for drag and drop
  const [draggedTask, setDraggedTask] = useState(null); // ID of the task being dragged
  const [draggingOverColumn, setDraggingOverColumn] = useState(null); // Name of column being dragged over

  const handleCardClick = (task) => {
    // A safety check: if a drag was just completed, draggedTask might still be set briefly.
    // However, standard D&D usually prevents click events on the source after a successful drag.
    // This check ensures modal doesn't open if for some reason click fires during/after drag.
    if (draggedTask === task.id) return; 

    setSelectedTaskForModal(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTaskForModal(null);
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
    setDraggedTask(taskId);
    // Optional: add a class to body to indicate dragging is happening
    // document.body.classList.add('dragging');
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDragEnterColumn = (columnName) => {
    if (draggedTask) { // Only highlight if a task is actually being dragged
        setDraggingOverColumn(columnName);
    }
  };

  const handleDragLeaveColumn = (e, columnName) => {
    // Check if the mouse is truly leaving the column or just moving over a child element
    if (e.currentTarget.contains(e.relatedTarget)) {
        return;
    }
    if (draggingOverColumn === columnName) {
        setDraggingOverColumn(null);
    }
  };

  const handleDrop = (e, targetColumnName) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    // Check if the task exists and is not already in the target column (optional optimization)
    const taskToMove = tasks.find(t => t.id === taskId);
    if (taskToMove && taskToMove.column !== targetColumnName) {
        setTasks(prevTasks =>
            prevTasks.map(task =>
            task.id === taskId ? { ...task, column: targetColumnName } : task
            )
        );
    }
    // Cleanup
    setDraggedTask(null);
    setDraggingOverColumn(null);
    // document.body.classList.remove('dragging');
  };
  
  const handleDragEnd = () => {
    // This event fires on the source element after the drag operation.
    setDraggedTask(null);
    setDraggingOverColumn(null); // Ensure highlighting is cleared
    // document.body.classList.remove('dragging');
  };


  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 flex flex-col">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Work Flow</h1>
        <div className="flex flex-grow sm:flex-grow-0 w-full sm:w-auto items-center gap-3">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 text-gray-600 py-2.5 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-400 text-sm">
              <option>Sort by</option>
              <option>Priority</option>
              <option>Due Date</option>
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
      <div className="flex-1 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        <div className="flex space-x-4 h-full py-1 min-w-max">
          {columns.map(columnName => (
            <div
              key={columnName}
              className={`rounded-lg p-3 pt-4 flex flex-col w-[330px] sm:w-[340px] md:w-[350px] flex-shrink-0 h-full transition-colors duration-150
                          ${draggingOverColumn === columnName ? 'bg-blue-100 border-2 border-blue-400' : 'bg-gray-100 border-2 border-transparent'}`} // Dynamic styling for drop zone
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, columnName)}
              onDragEnter={() => handleDragEnterColumn(columnName)}
              onDragLeave={(e) => handleDragLeaveColumn(e, columnName)}
            >
              <div className="flex justify-between items-center mb-3 px-1">
                <h2 className="text-sm font-semibold text-gray-700">{columnName.toUpperCase()} ({tasks.filter(t => t.column === columnName).length})</h2>
                <div className="flex items-center space-x-1.5">
                  <button className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200">
                    <Plus size={18} />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-[calc(100vh-200px)]">
                {tasks // Use state variable 'tasks' here
                  .filter(task => task.column === columnName)
                  .map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onCardClick={handleCardClick}
                        onDragStartItem={(e) => handleDragStart(e, task.id)} // Pass handler
                        onDragEndItem={handleDragEnd} // Pass handler
                        isBeingDragged={draggedTask === task.id} // Pass boolean
                    />
                  ))}
                  {tasks.filter(task => task.column === columnName).length === 0 && (
                    <div className="text-center text-sm text-gray-500 py-4">No tasks in this column.</div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedTaskForModal && (
        <TaskDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            task={selectedTaskForModal}
        />
      )}
    </div>
  );
};

export default TasksPage;