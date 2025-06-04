// ./components/NotificationsPage.js (or ./pages/NotificationsPage.js)
import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import GADigitalSolutionsLogo from '../assets/GA.png'; // MAKE SURE THIS PATH IS CORRECT

const userAvatar = 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

// --- DUMMY DATA (senderRole removed, message is already there) ---
const dummyNotificationsData = {
  today: [
    { 
      id: 't1', 
      avatarUrl: userAvatar, 
      name: 'GA Domes', 
      // senderRole: 'Team Lead', // No longer needed for this specific display request
      message: 'Lorem ipsum dolor sit amet consectetur. Tellus donec turpis consequat nam adipiscing sollicitudin. Cras accumsan habitasse nulla nunc.', 
      time: '10:30 A.M',
      subject: 'Lorem ipsum dolor sit amet consectetur. Massa sollicitudin aliquam libero id. Diam eget sed et gravida pellentesque.',
      fullContent: 'Lorem ipsum dolor sit amet consectetur. Ultrices ornare est amet enim sodales dignissim magna. Volutpat bibendum venenatis tincidunt nunc a elementum. Nunc sed sed volutpat sed enim. Varius lacus sed leo aenean vel. Lectus auctor scelerisque odio semper at donec mauris.\n\nLorem ipsum dolor sit amet consectetur. Ultrices ornare est amet enim sodales dignissim magna. Volutpat bibendum venenatis tincidunt nunc a elementum. Nunc sed sed volutpat sed enim. Varius lacus sed leo aenean vel. Lectus auctor scelerisque odio semper at donec mauris.',
      senderSignatureName: 'Somename',
      ctaText: 'CTA Button',
      timestampDetail: '10:30 A.M', 
    },
    { 
      id: 't2', 
      avatarUrl: userAvatar, 
      name: 'Jane Doe', 
      // senderRole: 'Security Department',
      message: 'Important update regarding your account security. Please review the details and take necessary actions.', 
      time: '10:35 A.M', 
      subject: 'Account Security Update', 
      fullContent: 'This is the full content for the second notification. We have noticed some unusual activity and recommend you update your password immediately. Please click the button below to secure your account. If you have any questions, contact support.', 
      senderSignatureName: 'Security Team', 
      ctaText: 'Secure Account', 
      timestampDetail: '10:35:15 A.M' 
    },
     { id: 't3',
       avatarUrl: userAvatar, 
       name: 'GA Domes', 
       message: 'Lorem ipsum dolor sit amet consectetur. Tellus donec turpis consequat nam adipiscing sollicitudin. Cras accumsan habitasse nulla nunc.', 
       time: '10:30 A.M' 
    },
    { id: 't4', 
      avatarUrl: userAvatar, 
      name: 'GA Domes', 
      message: 'Lorem ipsum dolor sit amet consectetur. Tellus donec turpis consequat nam adipiscing sollicitudin. Cras accumsan habitasse nulla nunc.', 
      time: '10:30 A.M' 
    },
    { id: 't5', avatarUrl: userAvatar, 
      name: 'GA Domes', 
      message: 'Lorem ipsum dolor sit amet consectetur. Tellus donec turpis consequat nam adipiscing sollicitudin. Cras accumsan habitasse nulla nunc.', 
      time: '10:30 A.M' 
    },
    // ... other notifications, ensure they have a 'message' field
  ],
  yesterday: [
    { 
      id: 'y1', 
      avatarUrl: userAvatar, 
      name: 'Project Alpha Bot', 
      // senderRole: 'Project Management Office',
      message: 'Reminder: Project Alpha deadline is approaching this Friday. Ensure all tasks are completed.', 
      time: '04:30 P.M', 
      subject: 'Project Alpha Deadline Reminder', 
      fullContent: 'This is a friendly reminder that the deadline for Project Alpha submissions is this coming Friday. Please ensure all your deliverables are submitted on time through the project portal. Contact your project lead if you have any questions or require assistance.',
      senderSignatureName: 'PMO', 
      ctaText: 'Go to Project Portal', 
      timestampDetail: 'Yesterday 04:30:22 P.M' 
    },
     { id: 'y2', avatarUrl: userAvatar, name: 'GA Domes', message: 'Lorem ipsum dolor sit amet consectetur. Tellus donec turpis consequat nam adipiscing sollicitudin. Cras accumsan habitasse nulla nunc.', time: '10:30 A.M' },
    { id: 'y3', avatarUrl: userAvatar, name: 'GA Domes', message: 'Lorem ipsum dolor sit amet consectetur. Tellus donec turpis consequat nam adipiscing sollicitudin. Cras accumsan habitasse nulla nunc.', time: '10:30 A.M' },
    { id: 'y4', avatarUrl: userAvatar, name: 'GA Domes', message: 'Lorem ipsum dolor sit amet consectetur. Tellus donec turpis consequat nam adipiscing sollicitudin. Cras accumsan habitasse nulla nunc.', time: '10:30 A.M' },
    { id: 'y5', avatarUrl: userAvatar, name: 'GA Domes', message: 'Lorem ipsum dolor sit amet consectetur. Tellus donec turpis consequat nam adipiscing sollicitudin. Cras accumsan habitasse nulla nunc.', time: '10:30 A.M' },
    { id: 'y6', avatarUrl: userAvatar, name: 'GA Domes', message: 'Lorem ipsum dolor sit amet consectetur. Tellus donec turpis consequat nam adipiscing sollicitudin. Cras accumsan habitasse nulla nunc.', time: '10:30 A.M' },
    { id: 'y7', avatarUrl: userAvatar, name: 'GA Domes', message: 'Lorem ipsum dolor sit amet consectetur. Tellus donec turpis consequat nam adipiscing sollicitudin. Cras accumsan habitasse nulla nunc.', time: '10:30 A.M' },
  ]
};

// --- NotificationItem (No change needed for this specific request) ---
const NotificationItem = ({ notification, onClick, isSelected, isDetailListContext = false }) => (
  <div 
    className={`flex items-start p-4 cursor-pointer border-b border-gray-200 
                ${isSelected && isDetailListContext ? 'bg-slate-50' : 'hover:bg-gray-100'}
                ${!isDetailListContext ? 'bg-gray-50 mb-px' : ''}`}
    onClick={() => onClick(notification)}
    style={{ minHeight: '80px' }}
  >
    {isDetailListContext && isSelected && ( 
        <div className="flex-shrink-0 mr-1.5 relative pt-1">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
        </div>
    )}
    <img 
        src={notification.avatarUrl} 
        alt={notification.name} 
        className={`w-9 h-9 rounded-full flex-shrink-0 ${isDetailListContext ? 'mr-3' : 'mr-4'}`} 
    />
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center">
        {/* This div is for name and potentially role if you bring it back */}
        <div> 
            <p className={`font-medium text-sm ${isSelected && isDetailListContext ? 'text-gray-800' : 'text-gray-700'}`}>{notification.name}</p>
            {/* If you decide to show senderRole in the list view item: */}
            {/* {notification.senderRole && !isDetailListContext && (
                 <p className="text-xs text-gray-500">{notification.senderRole}</p>
            )} */}
        </div>
        <p className="text-xs text-gray-500 flex-shrink-0 ml-2">{notification.time}</p>
      </div>
      <p className={`text-xs mt-1 leading-snug text-gray-600 ${!isDetailListContext || (isSelected && isDetailListContext) ? '' : 'truncate'}`}>
        {notification.message}
      </p>
    </div>
  </div>
);


// --- NotificationDetailView (MODIFIED) ---
const NotificationDetailView = ({ notification, onBackToListView }) => {
  if (!notification) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white text-gray-500">
        <p>No notification selected.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 md:p-8 bg-white overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <div className="flex justify-between items-start mb-6"> {/* Changed items-center to items-start for multi-line text */}
        <div className="flex items-start"> {/* Changed items-center to items-start */}
          {onBackToListView && (
            <button 
                onClick={onBackToListView} 
                className="mr-3 text-gray-700 hover:text-black p-1 rounded-full hover:bg-gray-200 mt-1" // Added mt-1 for alignment
                title="Back to notifications list"
            >
                <ArrowLeft size={22} />
            </button>
          )}
          <img src={notification.avatarUrl} alt={notification.name} className="w-10 h-10 rounded-full mr-3 flex-shrink-0" />
          <div className="flex-1 min-w-0"> {/* Added flex-1 min-w-0 for potential wrapping */}
            <p className="font-semibold text-gray-800">{notification.name}</p>
            {/* VVV --- DISPLAYING THE SHORT 'message' --- VVV */}
            {notification.message && (
              <p className="text-xs text-gray-600 mt-0.5 leading-snug">{notification.message}</p>
            )}
            {/* ^^^ --- DISPLAYING THE SHORT 'message' --- ^^^ */}
          </div>
        </div>
        <p className="text-xs text-gray-500 flex-shrink-0 ml-2 mt-1">{notification.timestampDetail}</p> {/* Added mt-1 for alignment */}
      </div>

      {/* Main content body */}
      <div className="mb-6">
        <img src={GADigitalSolutionsLogo} alt="Digital Solutions" className="h-8 mb-6" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          {notification.subject || "Notification"} 
        </h1>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {notification.fullContent}
        </p>
      </div>

      {/* Footer section */}
      <div className="mt-auto pt-6">
        <div className="mb-6">
          <p className="text-sm text-gray-700">Best Regards,</p>
          <p className="text-sm text-gray-700 font-medium">{notification.senderSignatureName}</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition mb-8 text-sm font-medium">
          {notification.ctaText}
        </button>
        <div className="text-center text-sm text-gray-600 mb-6">
          For any queries? <a href="#" className="text-blue-600 hover:underline font-medium">Rise a Ticket</a>
        </div>
        <div 
            className="h-40 bg-contain bg-no-repeat bg-center border border-gray-200 rounded-md p-4 flex items-center justify-center text-gray-400"
        >
            <img src={GADigitalSolutionsLogo} alt="Digital Solutions Footer Graphic" className="opacity-50 h-12" />
        </div>
      </div>
    </div>
  );
};

// --- Main NotificationsPage Component (No changes to logic needed for this request) ---
const NotificationsPage = () => {
  const [selectedNotificationForDetail, setSelectedNotificationForDetail] = useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showDetailView, setShowDetailView] = useState(false); 

  const handleSwitchToDetailView = (notification) => {
    setSelectedNotificationForDetail(notification);
    setShowDetailView(true); 
  };

  const handleSwitchToFullListView = () => {
    setShowDetailView(false);
  };

  const filteredNotificationsData = Object.entries(dummyNotificationsData).reduce((acc, [groupName, notifications]) => {
    const filtered = notifications.filter(
      notif => 
        (notif.name && notif.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (notif.message && notif.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (notif.subject && notif.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    if (filtered.length > 0) {
      acc[groupName] = filtered;
    }
    return acc;
  }, {});

  const renderFullWidthListView = () => (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 bg-white rounded-lg shadow-sm border border-gray-200">
      {Object.entries(filteredNotificationsData).length > 0 ? (
        Object.entries(filteredNotificationsData).map(([groupName, notifications]) => (
          <React.Fragment key={groupName}>
            <div className="flex items-center text-center my-6 px-4">
                <span className="flex-grow border-t border-gray-300"></span>
                <span className="text-xs text-gray-500 font-medium px-3 py-0.5 bg-gray-100 rounded-full mx-2">
                    {groupName === 'today' ? "Today's Notifications" : "Yesterday's Notifications"}
                </span>
                <span className="flex-grow border-t border-gray-300"></span>
            </div>
            {notifications.map(notif => (
              <NotificationItem 
                  key={notif.id} 
                  notification={notif} 
                  onClick={handleSwitchToDetailView} 
                  isSelected={false} 
                  isDetailListContext={false}
              />
            ))}
          </React.Fragment>
        ))
      ) : (
        <div className="text-center text-gray-500 p-10">No notifications found matching your search.</div>
      )}
    </div>
  );

  const renderTwoColumnDetailView = () => (
    <div className="flex-1 flex overflow-hidden border border-gray-200 rounded-lg shadow-sm">
      <div className="w-full md:w-[45%] lg:w-2/5 flex flex-col bg-white border-r border-gray-200">
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1">
          {Object.entries(filteredNotificationsData).length > 0 ? (
            Object.entries(filteredNotificationsData).map(([groupName, notifications]) => (
            <React.Fragment key={groupName}>
              <div className="flex items-center text-center my-4 px-4">
                  <span className="flex-grow border-t border-gray-300"></span>
                  <span className="text-xs text-gray-500 font-medium px-3 py-0.5 bg-gray-100 rounded-full mx-2">
                      {groupName === 'today' ? "Today's Notifications" : "Yesterday's Notifications"}
                  </span>
                  <span className="flex-grow border-t border-gray-300"></span>
              </div>
              {notifications.map(notif => (
                <NotificationItem 
                    key={notif.id} 
                    notification={notif} 
                    onClick={(n) => setSelectedNotificationForDetail(n)} 
                    isSelected={selectedNotificationForDetail?.id === notif.id}
                    isDetailListContext={true}
                />
              ))}
            </React.Fragment>
          ))
          ) : (
            <div className="text-center text-gray-500 p-10">No notifications to display in list.</div>
          )}
        </div>
      </div>

      <div className="hidden md:flex flex-1 flex-col bg-white">
           {selectedNotificationForDetail ? (
              <NotificationDetailView 
                notification={selectedNotificationForDetail} 
                onBackToListView={handleSwitchToFullListView}
              />
           ) : ( 
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p>Select a notification to read detailed view.</p>
              </div>
           )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-1">
        <div className="relative w-full sm:w-auto sm:flex-grow sm:max-w-xs">
          <input
            type="text"
            placeholder="Searching..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none text-sm self-start sm:self-center">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {showDetailView ? renderTwoColumnDetailView() : renderFullWidthListView()}
    </div>
  );
};

export default NotificationsPage;