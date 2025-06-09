import React, { useState, useRef, useCallback, useEffect } from "react";
import axios from 'axios';
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
} from "lucide-react";
import GA from '../assets/GA.png'; // Correct relative path

export const TASK_IMAGE_URL = GA; // Default/fallback image for tasks

export const attachmentImage1 =
    "https://via.placeholder.com/100x150/D1C4E9/673AB7?Text=Wisteria";
export const attachmentImage2 =
    "https://via.placeholder.com/100x150/B39DDB/512DA8?Text=Anemone";
export const attachmentImage3 =
    "https://via.placeholder.com/100x150/9575CD/7E57C2?Text=Tulip";
export const avatarPlaceholder =
    "https://via.placeholder.com/40/78909C/FFFFFF?Text=U";

export const initialDummyTasks = []; // Tasks will be populated from API

export const tagStyleMapping = {
    Designing: { dot: "bg-pink-500", text: "text-pink-700" },
    Development: { dot: "bg-blue-500", text: "text-blue-700" },
    "Content Writing": { dot: "bg-green-500", text: "text-green-700" },
    Infrastructure: { dot: "bg-purple-500", text: "text-purple-700" },
    UX: { dot: "bg-yellow-500", text: "text-yellow-700" },
    Documentation: { dot: "bg-indigo-500", text: "text-indigo-700" },
    Backend: { dot: "bg-teal-500", text: "text-teal-700" },
    Feedback: { dot: "bg-orange-500", text: "text-orange-700" },
    Deployment: { dot: "bg-lime-500", text: "text-lime-700" },
    Release: { dot: "bg-cyan-500", text: "text-cyan-700" },
};

export const priorityStyleMapping = {
    High: { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" },
    Medium: {
        bg: "bg-yellow-100",
        text: "text-yellow-600",
        dot: "bg-yellow-500",
    },
    Low: { bg: "bg-green-100", text: "text-green-600", dot: "bg-green-500" },
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
                    <h3 className="text-base font-semibold text-gray-900">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">{children}</div>
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

    const handleDropEvent = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        setSelectedFiles((prevFiles) => {
            const newFiles = files.filter(
                (f) =>
                    !prevFiles.some(
                        (pf) =>
                            pf.name === f.name &&
                            pf.lastModified === f.lastModified &&
                            pf.size === f.size
                    )
            );
            return [...prevFiles, ...newFiles];
        });
    }, []);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles((prevFiles) => {
            const newFiles = files.filter(
                (f) =>
                    !prevFiles.some(
                        (pf) =>
                            pf.name === f.name &&
                            pf.lastModified === f.lastModified &&
                            pf.size === f.size
                    )
            );
            return [...prevFiles, ...newFiles];
        });
        e.target.value = null;
    };

    const removeFile = (fileNameToRemove) => {
        setSelectedFiles((prevFiles) =>
            prevFiles.filter((file) => file.name !== fileNameToRemove)
        );
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
                    <h3 className="text-lg font-semibold text-gray-900">
                        Upload Files
                    </h3>
                    <button
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div
                    className={`border-2 border-dashed rounded-md p-6 text-center mb-4
            ${isDragging
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }
            transition-colors duration-200`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDropEvent}
                    onClick={!isDragging ? handleBrowseClick : undefined}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        multiple
                    />
                    <UploadCloud
                        size={48}
                        className="mx-auto text-gray-400 mb-2"
                    />
                    <p className="text-sm text-gray-600">
                        Drag & drop files here, or{" "}
                        <span
                            className="text-blue-600 font-semibold cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleBrowseClick();
                            }}
                        >
                            click to browse
                        </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Max. file size: 5MB each (Example)
                    </p>
                </div>

                {selectedFiles.length > 0 && (
                    <div className="mb-4 max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                            Selected files:
                        </h4>
                        {selectedFiles.map((file, index) => (
                            <div
                                key={`${file.name}-${file.lastModified}-${index}`}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded-md text-sm"
                            >
                                <div className="flex items-center overflow-hidden min-w-0">
                                    <FileText
                                        size={16}
                                        className="mr-2 text-gray-500 flex-shrink-0"
                                    />
                                    <span
                                        className="truncate"
                                        title={file.name}
                                    >
                                        {file.name}
                                    </span>
                                    <span className="ml-2 text-gray-500 text-xs flex-shrink-0">
                                        ({(file.size / 1024).toFixed(1)} KB)
                                    </span>
                                </div>
                                <button
                                    onClick={() => removeFile(file.name)}
                                    className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0 p-1"
                                >
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
                        Attach{" "}
                        {selectedFiles.length > 0
                            ? `(${selectedFiles.length})`
                            : ""}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const TaskDetailModal = ({ isOpen, onClose, task }) => {
    const [showAttachLinkPopup, setShowAttachLinkPopup] = useState(false);
    const [showAddCommentPopup, setShowAddCommentPopup] = useState(false);
    const [showAddReplyPopup, setShowAddReplyPopup] = useState(false);
    const [replyingToCommentId, setReplyingToCommentId] = useState(null);
    const [linkName, setLinkName] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [commentText, setCommentText] = useState("");
    const [replyText, setReplyText] = useState("");
    const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);

    if (!isOpen || !task) return null;

    const priorityStyles = priorityStyleMapping[task.priority] || priorityStyleMapping["Medium"]; // Default to medium if not found

    // Dummy data for modal display - API for my-task-assignments doesn't provide these details
    const dummyComments = (task && task.commentsData && task.commentsData.length > 0) ? task.commentsData : [
        {
            id: 1,
            user: "System Note",
            avatar: avatarPlaceholder,
            text: "This task was assigned to you. Detailed comments and replies are managed elsewhere.",
            repliesCount: "0",
        },
    ];
    const attachments = (task && task.attachmentsData && task.attachmentsData.length > 0) ? task.attachmentsData : [];
    const links = (task && task.linksData && task.linksData.length > 0) ? task.linksData : [];


    const handleAttachLinkSubmit = () => {
        console.log("Attach Link:", { linkName, linkUrl, taskId: task.id });
        // Here you would typically make an API call to attach the link
        // For now, we'll just log and close the popup
        setLinkName("");
        setLinkUrl("");
    };
    const handleAddCommentSubmit = () => {
        console.log("Add Comment:", { commentText, taskId: task.id });
        // API call to add comment
        setCommentText("");
    };
    const handleAddReplySubmit = () => {
        console.log("Add Reply:", {
            replyText,
            commentId: replyingToCommentId,
            taskId: task.id,
        });
        // API call to add reply
        setReplyText("");
        setReplyingToCommentId(null);
    };
    const handleFilesAttachment = (files) => {
        console.log(
            "Files to attach from dialog:",
            files.map((f) => ({ name: f.name, size: f.size }))
        );
        alert(
            `${files.length} file(s) selected for attachment. Check console for details. (Frontend demo only)`
        );
        // API call to upload/attach files
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 pb-10 z-50 overflow-y-auto">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 p-6 animate-fadeIn">
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onClose}
                                className="hover:text-gray-800 p-1"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <span className="font-semibold text-gray-800">
                                {task.daysLeft || "N/A"}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md font-medium">
                                {task.workspaceName}
                            </span>
                            <span
                                className={`text-xs px-2 py-0.5 rounded-md font-medium flex items-center ${priorityStyles.bg} ${priorityStyles.text}`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${priorityStyles.dot}`}
                                ></span>
                                {task.priority}
                            </span>
                            <span className="flex items-center">
                                <CalendarDays
                                    size={14}
                                    className="mr-1 text-gray-500"
                                />
                                {task.dateInfo}
                            </span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        {task.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                        {task.description}
                    </p>

                    {/* Displaying original API data for reference if needed */}
                    {task.original_api_data && (
                        <div className="mb-6 p-3 bg-gray-50 rounded-md border border-gray-200 text-xs">
                            <h4 className="text-sm font-semibold text-gray-700 mb-1">Assignment Details (from API):</h4>
                            <p><strong>Designation:</strong> {task.original_api_data.designation_at_assignment || 'N/A'}</p>
                            <p><strong>Deadline:</strong> {task.original_api_data.deadline ? new Date(task.original_api_data.deadline).toLocaleString() : 'N/A'}</p>
                            <p><strong>Status:</strong> {task.original_api_data.status || 'N/A'}</p>
                            <p><strong>Review Status:</strong> {task.original_api_data.review_status || 'N/A'}</p>
                            <p><strong>Order:</strong> {task.original_api_data.order === null || task.original_api_data.order === undefined ? 'N/A' : task.original_api_data.order}</p>
                            <p><strong>Time Estimation:</strong> {task.original_api_data.time_estimation || 'N/A'}</p>
                        </div>
                    )}


                    {attachments.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                Attachments (Demo)
                            </h4>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {attachments.map((att, index) => (
                                    <div
                                        key={index}
                                        className="aspect-[2/3] bg-gray-200 rounded overflow-hidden group relative"
                                    >
                                        <img
                                            src={att.url}
                                            alt={att.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                            {att.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {links.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                Links (Demo)
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {links.map((link) => (
                                    <button
                                        key={link.id}
                                        onClick={() =>
                                            window.open(link.url, "_blank", "noopener,noreferrer")
                                        }
                                        className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md border border-gray-300"
                                    >
                                        {link.id.startsWith("l") ? (
                                            <LinkIcon
                                                size={16}
                                                className="mr-2"
                                            />
                                        ) : (
                                            <FileText
                                                size={16}
                                                className="mr-2"
                                            />
                                        )}
                                        {link.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex flex-wrap gap-3 mb-8">
                        <button
                            onClick={() => setShowAttachLinkPopup(true)}
                            className="flex items-center text-sm bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
                        >
                            <LinkIcon size={16} className="mr-2" /> Attach link
                        </button>
                        <button
                            onClick={() => setShowFileUploadDialog(true)}
                            className="flex items-center text-sm bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
                        >
                            <Paperclip size={16} className="mr-2" /> Attach File
                        </button>
                        <button
                            onClick={() => setShowAddCommentPopup(true)}
                            className="flex items-center text-sm bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
                        >
                            <MessageSquarePlus size={16} className="mr-2" /> Add
                            Comment
                        </button>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Comments (Demo)
                        </h3>
                        <div className="space-y-5">
                            {dummyComments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="p-4 border border-gray-200 rounded-lg bg-white"
                                >
                                    <div className="flex items-start space-x-3">
                                        <img
                                            src={comment.avatar}
                                            alt={comment.user}
                                            className="w-8 h-8 rounded-full mt-1"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-gray-700">
                                                {comment.user}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {comment.text}
                                            </p>
                                            <div className="mt-2 flex items-center space-x-4">
                                                <button
                                                    onClick={() => {
                                                        setReplyingToCommentId(
                                                            comment.id
                                                        );
                                                        setShowAddReplyPopup(
                                                            true
                                                        );
                                                    }}
                                                    className="text-xs text-blue-600 hover:underline"
                                                >
                                                    Reply
                                                </button>
                                                {comment.repliesCount && comment.repliesCount !== "0" && (
                                                    <div className="relative flex items-center">
                                                        <span className="text-xs text-blue-600 mr-2 cursor-pointer hover:underline">
                                                            View replies
                                                        </span>
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                                                            {
                                                                comment.repliesCount
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <SmallPopup
                        isOpen={showAttachLinkPopup}
                        onClose={() => {
                            setShowAttachLinkPopup(false);
                            setLinkName("");
                            setLinkUrl("");
                        }}
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
                            type="url" // Changed to type="url"
                            placeholder="Paste the link (e.g., https://example.com)"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </SmallPopup>
                    <SmallPopup
                        isOpen={showAddCommentPopup}
                        onClose={() => {
                            setShowAddCommentPopup(false);
                            setCommentText("");
                        }}
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
                        onClose={() => {
                            setShowAddReplyPopup(false);
                            setReplyText("");
                            setReplyingToCommentId(null);
                        }}
                        title="Add Reply"
                        onSubmit={handleAddReplySubmit}
                    >
                        <textarea
                            placeholder="Your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </SmallPopup>
                </div>
            </div>
            <FileUploadDialog
                isOpen={showFileUploadDialog}
                onClose={() => setShowFileUploadDialog(false)}
                onFilesConfirm={handleFilesAttachment}
            />
        </>
    );
};

const TaskCard = ({
    task,
    onCardClick,
    onDragStartItem,
    onDragEndItem,
    isBeingDragged,
}) => {
    const priorityStyles = priorityStyleMapping[task.priority] || priorityStyleMapping["Medium"]; // Default to medium

    return (
        <div
            draggable="true"
            onDragStart={onDragStartItem}
            onDragEnd={onDragEndItem}
            className={`bg-white rounded-lg shadow p-3.5 mb-4 cursor-grab hover:shadow-md transition-shadow
                  ${task.selected
                    ? "ring-2 ring-blue-500 shadow-lg"
                    : "border border-gray-200"
                }
                  ${isBeingDragged
                    ? "opacity-50 ring-2 ring-blue-400 scale-105"
                    : ""
                }`}
            onClick={() => {
                if (!isBeingDragged) {
                    onCardClick(task);
                }
            }}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md font-medium">
                        {task.workspaceName}
                    </span>
                    {task.escalation && (
                        <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-md font-medium">
                            Escalation
                        </span>
                    )}
                    <span
                        className={`text-xs px-2 py-0.5 rounded-md font-medium flex items-center ${priorityStyles.bg} ${priorityStyles.text}`}
                    >
                        <span
                            className={`w-2 h-2 rounded-full mr-1.5 ${priorityStyles.dot}`}
                        ></span>
                        {task.priority}
                    </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-0.5 rounded hover:bg-gray-100">
                    <MoreVertical size={18} />
                </button>
            </div>
            <h3 className="font-semibold text-sm text-gray-800 mb-1">
                {task.title}
            </h3>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                {task.description}
            </p>
            {task.image && (
                <img
                    src={task.image}
                    alt={task.title}
                    className="w-full h-32 object-cover rounded-md mb-3"
                />
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
                <span className="font-medium text-gray-600">
                    {task.daysLeft}
                </span>
            </div>
            <div className="flex justify-between items-center mb-3">
                <div className="flex -space-x-2">
                    {task.assignees.slice(0, 5).map((assignee, index) => (
                        <div
                            key={index}
                            className="w-6 h-6 rounded-full border-2 border-white"
                            style={{ backgroundColor: typeof assignee === 'string' ? assignee : (assignee.color || '#ccc') }}
                            title={typeof assignee === 'string' ? `Assignee ${index + 1}` : (assignee.name || `Assignee ${index + 1}`)}
                        ></div>
                    ))}
                    {task.assignees.length > 5 && (
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                            +{task.assignees.length - 5}
                        </div>
                    )}
                     {task.assignees.length === 0 && ( // Show placeholder if no assignees
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-500" title="No assignees">
                            ?
                        </div>
                    )}
                </div>
                <div className="flex items-center text-xs text-gray-500 space-x-3">
                    <span className="flex items-center">
                        <MessageSquare size={14} className="mr-1" />
                        {task.comments}
                    </span>
                    <span className="flex items-center">
                        <Paperclip size={14} className="mr-1" /> {task.files}
                    </span>
                </div>
            </div>
            <div className="border-t border-gray-200 pt-2 flex flex-wrap gap-y-1">
                {task.tags.map((tag) => {
                    const style = tagStyleMapping[tag] || {
                        dot: "bg-gray-400",
                        text: "text-gray-600",
                    };
                    return (
                        <span
                            key={tag}
                            className={`text-xs font-medium mr-2 py-0.5 flex items-center ${style.text}`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${style.dot}`}
                            ></span>
                            {tag}
                        </span>
                    );
                })}
                 {task.tags.length === 0 && ( // Show placeholder if no tags
                    <span className="text-xs text-gray-400 italic">No tags</span>
                )}
            </div>
        </div>
    );
};

// --- Mappings ---
const backendStatusToFrontendColumn = {
    "backlog": "Backlog",
    "todo": "TO-DO",
    "to-do": "TO-DO", // common variations
    "pending": "TO-DO",
    "processing": "Processing",
    "in_progress": "Processing", // common variations
    "inprogress": "Processing",
    "review": "Review",
    "in_review": "Review", // common variations
    "inreview": "Review",
    "done": "Done",
    "completed": "Done" // common variations
};

const frontendColumnToBackendStatus = {
    "Backlog": "backlog",
    "TO-DO": "todo",
    "Processing": "processing",
    "Review": "review",
    "Done": "done"
};

// Helper function to calculate days left
function calculateDaysLeft(deadline) {
    if (!deadline) return "N/A";
    const today = new Date();
    const deadlineDate = new Date(deadline);
    today.setHours(0, 0, 0, 0); 
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime(); // Use getTime() for reliable comparison
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return `Overdue ${Math.abs(diffDays)}d`;
    } else if (diffDays === 0) {
        return "Due Today";
    } else {
        return `D-${diffDays}`;
    }
}


const TasksPage = () => {
    const columns = ["Backlog", "TO-DO", "Processing", "Review", "Done"];
    const [tasks, setTasks] = useState(initialDummyTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTaskForModal, setSelectedTaskForModal] = useState(null);
    const [draggedTask, setDraggedTask] = useState(null);
    const [draggingOverColumn, setDraggingOverColumn] = useState(null);
    
    useEffect(() => {
        const yourAccessToken = localStorage.getItem("accessToken");
        if (!yourAccessToken) {
            console.warn("Access token not found. Tasks will not be fetched.");
            setTasks([]); // Or set to some demo tasks if preferred for logged-out state
            return;
        }

        const fetchTasks = async () => {
            try {
                // Use the new API path for fetching user's task assignments
                const response = await axios.get('http://localhost:8000/api/users/my-task-assignments/', {
                    headers: {
                        'Authorization': `Bearer ${yourAccessToken}`,
                    },
                });

                // The API returns a direct array of assignments
                const rawTasks = Array.isArray(response.data) ? response.data : [];
                
                if (!rawTasks) {
                    console.error("Tasks data is not in the expected array format or is null:", response.data);
                    setTasks([]);
                    return;
                }

                const processedTasks = rawTasks.map(apiTask => {
                    const backendTaskStatus = (apiTask.status || 'todo').toLowerCase(); // Default to 'todo' if status is null/undefined
                    const frontendColumn = backendStatusToFrontendColumn[backendTaskStatus] || "TO-DO"; // Default to TO-DO if no mapping

                    const descriptionParts = [];
                    if (apiTask.designation_at_assignment) descriptionParts.push(`Designation: ${apiTask.designation_at_assignment}`);
                    if (apiTask.review_status) descriptionParts.push(`Review Status: ${apiTask.review_status}`);
                    if (apiTask.order !== null && apiTask.order !== undefined) descriptionParts.push(`Order: ${apiTask.order}`);
                    const description = descriptionParts.length > 0 ? descriptionParts.join('. ') : "No additional details provided for this assignment.";

                    return {
                        id: apiTask.task_id.toString(), // Using task_id as the unique ID for the card
                        title: apiTask.task_title || "Untitled Task",
                        description: description,
                        column: frontendColumn, // Mapped from apiTask.status
                        priority: "Medium", // Default value
                        workspaceName: apiTask.workspace || "Default Workspace", // From apiTask.task.workspace.workspace_name
                        escalation: false, // Default value, not in API response
                        
                        image: TASK_IMAGE_URL, // Default image
                        dateInfo: apiTask.deadline ? new Date(apiTask.deadline).toLocaleDateString() : "No Deadline",
                        timeInfo: apiTask.time_estimation || "N/A", // From apiTask.time_estimation
                        daysLeft: apiTask.deadline ? calculateDaysLeft(apiTask.deadline) : "N/A", // Calculated or default

                        assignees: [], // Default, as this API focuses on "my" assignments, not all assignees of a task
                        comments: 0, // Default, not directly in this API response
                        files: 0, // Default, not directly in this API response
                        tags: apiTask.designation_at_assignment ? [apiTask.designation_at_assignment] : [], // Use designation as a tag

                        original_api_data: apiTask, // Store the raw assignment data for detailed view

                        // For TaskDetailModal's dummy sections - not provided by this specific API
                        commentsData: [], 
                        attachmentsData: [], 
                        linksData: [], 
                    };
                });
                
                setTasks(processedTasks);

            } catch (error) {
                console.error('Failed to fetch tasks:', error.response ? error.response.data : error.message);
                setTasks([]); // Set to empty on error to avoid breaking the UI
            }
        };

        fetchTasks();
    }, []);


    const handleCardClick = (task) => {
        if (draggedTask === task.id) return;
        setSelectedTaskForModal(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTaskForModal(null);
    };

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData("taskId", taskId);
        setDraggedTask(taskId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragEnterColumn = (columnName) => {
        if (draggedTask) {
            setDraggingOverColumn(columnName);
        }
    };

    const handleDragLeaveColumn = (e, columnName) => {
        // Check if the mouse is leaving the column div for a child element or outside entirely
        if (e.currentTarget.contains(e.relatedTarget)) {
            return; // Do not remove highlight if moving to a child
        }
        if (draggingOverColumn === columnName) {
            setDraggingOverColumn(null);
        }
    };

    const handleDrop = async (e, targetColumnName) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId"); // This is task.id (originally task_id from API)
        const yourAccessToken = localStorage.getItem("accessToken");

        if (!yourAccessToken) {
            console.error("Access token not found. Cannot update task status.");
            alert("Authentication error. Please log in again.");
            setDraggedTask(null);
            setDraggingOverColumn(null);
            return;
        }

        const taskToMove = tasks.find((t) => t.id === taskId);

        if (taskToMove && taskToMove.column !== targetColumnName) {
            const originalColumn = taskToMove.column;
            const originalTasksState = JSON.parse(JSON.stringify(tasks)); 

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId
                        ? { ...task, column: targetColumnName } 
                        : task
                )
            );

            try {
                const backendStatus = frontendColumnToBackendStatus[targetColumnName];
                if (!backendStatus) {
                    console.error(`No backend status mapping found for column: ${targetColumnName}`);
                    setTasks(originalTasksState);
                    alert(`Error: Could not map column "${targetColumnName}" to a backend status.`);
                    setDraggedTask(null);
                    setDraggingOverColumn(null);
                    return;
                }
                
                // IMPORTANT: This PATCH request goes to a different endpoint than the GET request.
                // This endpoint (`.../tasks/cards/${taskId}/`) is assumed to handle status updates
                // for a task (or the user's assignment to it).
                // The payload field is changed to "status" to align with TaskAssignment.status.
                // If your backend expects "task_status", change it back.
            //    const loggedInUserId = currentUser.id; // get logged-in user's ID from auth state/context
// const taskId = someTaskId;

await axios.patch(
  `http://localhost:8000/api/users/task-assignment/${taskId}/status/`,
  { status: backendStatus },
  {
    headers: { Authorization: `Bearer ${yourAccessToken}` }
  }
);

                // Update the original_api_data as well for consistency if modal is reopened
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === taskId
                            ? { ...task, original_api_data: {...task.original_api_data, status: backendStatus} } 
                            : task
                    )
                );

                // console.log(`Task '${taskToMove.title}' status updated to '${backendStatus}' on server.`);
                // alert(
                //     `Task '${taskToMove.title}' (ID: ${taskId}) shifted from '${originalColumn}' to '${targetColumnName}'. Status updated on the server.`
                // );


            } catch (error) {
                console.error('Failed to update task status on backend:', error.response ? error.response.data : error.message);
                setTasks(originalTasksState); 
                const errorMessage = error.response?.data?.detail ||
                    (typeof error.response?.data === 'object' ? JSON.stringify(error.response.data) : error.response?.data) ||
                    error.message;
                alert(
                    `Failed to update task '${taskToMove.title}' status. Reverting change.\nError: ${errorMessage}`
                );
            }
        }

        setDraggedTask(null);
        setDraggingOverColumn(null);
    };


    const handleDragEnd = () => {
        setDraggedTask(null);
        setDraggingOverColumn(null);
    };

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-6 flex flex-col">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-semibold text-gray-800">
                    My Task Assignments
                </h1>
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
                            <option>Deadline</option>
                            <option>Priority (N/A for this view)</option>
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

            <div className="flex-1 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                <div className="flex space-x-4 h-full py-1 min-w-max">
                    {columns.map((columnName) => (
                        <div
                            key={columnName}
                            className={`rounded-lg p-3 pt-4 flex flex-col w-[330px] sm:w-[340px] md:w-[350px] flex-shrink-0 h-full transition-colors duration-150
                          ${draggingOverColumn === columnName && draggedTask
                                    ? "bg-blue-100 border-2 border-blue-400"
                                    : "bg-gray-100 border-2 border-transparent"
                                }`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, columnName)}
                            onDragEnter={() =>
                                handleDragEnterColumn(columnName)
                            }
                            onDragLeave={(e) =>
                                handleDragLeaveColumn(e, columnName)
                            }
                        >
                            <div className="flex justify-between items-center mb-3 px-1">
                                <h2 className="text-sm font-semibold text-gray-700">
                                    {columnName.toUpperCase()} (
                                    {
                                        tasks.filter(
                                            (t) => t.column === columnName
                                        ).length
                                    }
                                    )
                                </h2>
                                <div className="flex items-center space-x-1.5">
                                    <button className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200" title="Add new task (disabled)">
                                        <Plus size={18} />
                                    </button>
                                    <button className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200" title="More options (disabled)">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-[calc(100vh-200px)]">
                                {tasks
                                    .filter(
                                        (task) => task.column === columnName
                                    )
                                    .map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onCardClick={handleCardClick}
                                            onDragStartItem={(e) =>
                                                handleDragStart(e, task.id)
                                            }
                                            onDragEndItem={handleDragEnd}
                                            isBeingDragged={
                                                draggedTask === task.id
                                            }
                                        />
                                    ))}
                                {tasks.filter(
                                    (task) => task.column === columnName
                                ).length === 0 && (
                                        <div className="text-center text-sm text-gray-500 py-4">
                                            No tasks in {columnName}.
                                        </div>
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