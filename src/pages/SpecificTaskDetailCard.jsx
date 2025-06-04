import React, { useState, useRef, useCallback } from 'react';


import {
  ArrowLeft, Link as LinkIcon, Paperclip, MessageSquarePlus, CalendarDays, X,
  UploadCloud, Trash2, FileText,
} from 'lucide-react';

export const avatarPlaceholder = "https://via.placeholder.com/40/78909C/FFFFFF?Text=U";
export const attachmentImage1 = "https://via.placeholder.com/100x150/D1C4E9/673AB7?Text=Wisteria";
export const attachmentImage2 = "https://via.placeholder.com/100x150/B39DDB/512DA8?Text=Anemone";
export const attachmentImage3 = "https://via.placeholder.com/100x150/9575CD/7E57C2?Text=Tulip";

export const priorityStyleMapping = {
  High: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' },
  Medium: { bg: 'bg-yellow-100', text: 'text-yellow-600', dot: 'bg-yellow-500' },
  Low: { bg: 'bg-green-100', text: 'text-green-600', dot: 'bg-green-500' },
};

export const SmallPopup = ({ isOpen, onClose, title, children, onSubmit }) => {
  if (!isOpen) return null;
  const handleSubmit = (e) => { e.preventDefault(); if (onSubmit) onSubmit(); onClose(); };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-[100]"> {/* Increased z-index */}
      <div className="bg-white rounded-lg shadow-xl p-5 w-full max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"> <X size={20} /> </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">{children}</div>
          <div className="mt-6 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300">cancel</button>
            <button type="submit" className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">Submit</button>
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
  const handleDragOver = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
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
    e.target.value = null;
  };
  const removeFile = (fileNameToRemove) => setSelectedFiles(prevFiles => prevFiles.filter(file => file.name !== fileNameToRemove));
  const handleBrowseClick = () => fileInputRef.current?.click();
  const handleConfirm = () => { if (onFilesConfirm && selectedFiles.length > 0) { onFilesConfirm(selectedFiles); } setSelectedFiles([]); onClose(); };
  const handleCancel = () => { setSelectedFiles([]); onClose(); };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[110]"> {/* Increased z-index */}
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <div className={`border-2 border-dashed rounded-md p-6 text-center mb-4 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'} transition-colors duration-200`}
          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={!isDragging ? handleBrowseClick : undefined}>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
          <UploadCloud size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">Drag & drop files here, or <span className="text-blue-600 font-semibold cursor-pointer" onClick={handleBrowseClick}>click to browse</span></p>
          <p className="text-xs text-gray-500 mt-1">Max. file size: 5MB each (Example)</p>
        </div>
        {selectedFiles.length > 0 && (
          <div className="mb-4 max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Selected files:</h4>
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center justify-between bg-gray-50 p-2 rounded-md text-sm">
                <div className="flex items-center overflow-hidden min-w-0"><FileText size={16} className="mr-2 text-gray-500 flex-shrink-0" /><span className="truncate" title={file.name}>{file.name}</span><span className="ml-2 text-gray-500 text-xs flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span></div>
                <button onClick={() => removeFile(file.name)} className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0 p-1"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300">Cancel</button>
          <button type="button" onClick={handleConfirm} disabled={selectedFiles.length === 0} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed">Attach {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}</button>
        </div>
      </div>
    </div>
  );
};


const HostedTaskDetailContent = ({ taskData, onCloseProp }) => {
  const task = taskData; // Use the passed data
  const [showAttachLinkPopup, setShowAttachLinkPopup] = useState(false);
  const [showAddCommentPopup, setShowAddCommentPopup] = useState(false);
  const [showAddReplyPopup, setShowAddReplyPopup] = useState(false);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);

  if (!task) return <p>Loading task details...</p>;

  const priorityStyles = priorityStyleMapping[task.priority] || {};
  
  // Dummy data (can be fetched or part of taskData if it's rich enough)
   const dummyComments = task.commentsData || [ // Expect commentsData from taskData or use default
    { id: 1, user: 'Range', avatar: avatarPlaceholder, text: 'Lorem ipsum dolor sit amet consectetur. Sed rutrum non condimentum eu ultricies sit massa. Pulvinar pellentesque ut tellus et donec laoreet ut. Ornare risus sed aliquam ut eget aenean venenatis eu. Elementum natoque ac odio vulputate pellentesque in. Praesent congue etiam ultricies enim erat turpis.', repliesCount: '02'},
    { id: 2, user: 'Range', avatar: avatarPlaceholder, text: 'Lorem ipsum dolor sit amet consectetur. Sed rutrum non condimentum eu ultricies sit massa.' },
  ];
  const attachments = task.attachmentsData || [ // Expect attachmentsData from taskData or use default
    { type: 'image', url: attachmentImage1, name: 'Wisteria Design.png' }, { type: 'image', url: attachmentImage2, name: 'Purple Flower.jpg' }, { type: 'image', url: attachmentImage3, name: 'Tulip Inspiration.png' },
    { type: 'image', url: attachmentImage1, name: 'Wisteria Alt.png' }, { type: 'image', url: attachmentImage2, name: 'Anemone Detail.jpg' }, { type: 'image', url: attachmentImage3, name: 'Tulip Sketch.png' },
  ];
  const links = task.linksData || [ { id: 'l1', name: 'Link 1', url: '#' }, { id: 'f1', name: 'Filename.exe', url: '#' },];


  const handleAttachLinkSubmit = () => { console.log("Attach Link:", { linkName, linkUrl, taskId: task.id }); setLinkName(''); setLinkUrl('');};
  const handleAddCommentSubmit = () => { console.log("Add Comment:", { commentText, taskId: task.id }); setCommentText(''); };
  const handleAddReplySubmit = () => { console.log("Add Reply:", { replyText, commentId: replyingToCommentId, taskId: task.id }); setReplyText(''); setReplyingToCommentId(null); };
  const handleFilesAttachment = (files) => {
    console.log("Files to attach from dialog:", files.map(f => ({name: f.name, size: f.size})));
    // You might want to update `task.attachmentsData` or similar here
    alert(`${files.length} file(s) selected for attachment. Check console.`);
  };

  return (
    
    <div className="w-full animate-fadeIn p-0"> {/* No extra padding, slide-over handles it */}
       
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600 border-b pb-3">
            <div className="flex items-center space-x-3">
                <span className="font-semibold text-gray-800">{task.daysLeft || task.deadline || 'D-X'}</span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md font-medium"> 
                    {task.workspaceName || task.workspace} 
                </span>
                {task.priority && (
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium flex items-center ${priorityStyles.bg} ${priorityStyles.text}`}> 
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${priorityStyles.dot}`}></span> {task.priority} 
                    </span>
                )}
                {task.dateInfo && (
                    <span className="flex items-center"> 
                        <CalendarDays size={14} className="mr-1 text-gray-500" /> {task.dateInfo} 
                    </span>
                )}
            </div>
            {/* Optional: Add a close button here if needed, or rely on slide-over's main close */}
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">{task.title || task.clientRequest || `Task ID: ${task.taskId}`}</h2>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed"> 
            {task.description || 'No description provided.'} 
            {/* You can add more descriptive text or fallbacks here */}
        </p>

        {attachments.length > 0 && (
        <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"> {/* Adjusted grid for slide-over width */}
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
            {dummyComments.length === 0 && <p className="text-sm text-gray-500">No comments yet.</p>}
        </div>
        </div>

        {/* Helper Popups (SmallPopup, FileUploadDialog) */}
        {/* These need to have a z-index higher than the slide-over's z-index if they are to overlay it */}
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
      
      <FileUploadDialog isOpen={showFileUploadDialog} onClose={() => setShowFileUploadDialog(false)} onFilesConfirm={handleFilesAttachment} />
    </div>
  );
};

const SpecificTaskDetailCard = ({ data, onClose }) => {
    if (!data) {
        return <p className="text-center text-gray-500 p-8">No data provided for details.</p>;
    }
 
    return <HostedTaskDetailContent taskData={data} onCloseProp={onClose} />;
};

export default SpecificTaskDetailCard;