// ./components/NotificationsPage.js (or ./pages/NotificationsPage.js)
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { Search, Filter, ArrowLeft } from 'lucide-react';
import GADigitalSolutionsLogo from '../assets/GA.png'; // MAKE SURE THIS PATH IS CORRECT

// dummyNotificationsData and userAvatar constant are removed.

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
        src={notification.avatarUrl} // API should provide this
        alt={notification.name} 
        className={`w-9 h-9 rounded-full flex-shrink-0 ${isDetailListContext ? 'mr-3' : 'mr-4'}`} 
    />
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center">
        <div> 
            <p className={`font-medium text-sm ${isSelected && isDetailListContext ? 'text-gray-800' : 'text-gray-700'}`}>{notification.name}</p>
        </div>
        <p className="text-xs text-gray-500 flex-shrink-0 ml-2">{notification.time}</p>
      </div>
      <p className={`text-xs mt-1 leading-snug text-gray-600 ${!isDetailListContext || (isSelected && isDetailListContext) ? '' : 'truncate'}`}>
        {notification.message}
      </p>
    </div>
  </div>
);

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
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start flex-1 min-w-0">
          {onBackToListView && (
            <button 
                onClick={onBackToListView} 
                className="mr-3 text-gray-700 hover:text-black p-1 rounded-full hover:bg-gray-200 mt-1 md:mt-0"
                title="Back to notifications list"
            >
                <ArrowLeft size={22} />
            </button>
          )}
          <img src={notification.avatarUrl} alt={notification.name} className="w-10 h-10 rounded-full mr-3 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 truncate">{notification.name}</p>
            {notification.message && (
              <p className="text-xs text-gray-600 mt-0.5 leading-snug truncate">{notification.message}</p>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 flex-shrink-0 ml-2 mt-1 md:mt-0">{notification.timestampDetail}</p>
      </div>

      <div className="mb-6">
        <img src={GADigitalSolutionsLogo} alt="Digital Solutions" className="h-8 mb-6" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          {notification.subject || "Notification Details"} 
        </h1>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {notification.fullContent || "This notification does not have detailed content."}
        </p>
      </div>

      <div className="mt-auto pt-6">
        <div className="mb-6">
          <p className="text-sm text-gray-700">Best Regards,</p>
          <p className="text-sm text-gray-700 font-medium">{notification.senderSignatureName || "The Team"}</p>
        </div>
        {notification.ctaText && (
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition mb-8 text-sm font-medium">
            {notification.ctaText}
            </button>
        )}
        <div className="text-center text-sm text-gray-600 mb-6">
          For any queries? <a href="#" className="text-blue-600 hover:underline font-medium">Raise a Ticket</a>
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

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]); // Holds fetched notifications
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotificationForDetail, setSelectedNotificationForDetail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailView, setShowDetailView] = useState(false); 

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken'); // Or however you store your token

      if (!token) {
        setError("Authentication token not found. Please log in.");
        setIsLoading(false);
        setNotifications([]); // Ensure notifications array is empty
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/users/notifications/my/', {
          headers: {
            // 'Content-Type': 'application/json', // Not strictly needed for GET with axios
            'Authorization': `Bearer ${token}`,
          },
        });

        // console.log('API Response Data:', response.data); // For debugging the raw response
        
        // Expecting API to return { "notifications": [...] }
        if (response.data && Array.isArray(response.data.notifications)) {
          setNotifications(response.data.notifications);
        } else {
          console.error("API response is not in the expected format. Expected { notifications: [...] } array.", response.data);
          setNotifications([]); 
          setError("Invalid data format received from the server.");
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
        let errorMessage = 'Failed to fetch notifications.';
        if (err.response) {
          // Server responded with a status code out of 2xx range
          errorMessage = err.response.data?.detail || err.response.data?.message || `Error ${err.response.status}: ${err.response.statusText}`;
          if (err.response.status === 401) {
            errorMessage = "Unauthorized. Please check your login or token.";
          } else if (err.response.status === 403) {
            errorMessage = "Forbidden. You do not have permission to access these notifications.";
          }
        } else if (err.request) {
          // Request was made but no response was received
          errorMessage = "No response from server. Check network or if server is running.";
        } else {
          // Something happened in setting up the request
          errorMessage = err.message;
        }
        setError(errorMessage);
        setNotifications([]); // Clear notifications on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []); // Empty dependency array: runs once on mount

  const filteredNotifications = notifications.filter(
    notif => 
      (notif.name && notif.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (notif.message && notif.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (notif.subject && notif.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (notif.fullContent && notif.fullContent.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    if (showDetailView) {
      if (selectedNotificationForDetail && !filteredNotifications.find(n => n.id === selectedNotificationForDetail.id)) {
        setSelectedNotificationForDetail(filteredNotifications.length > 0 ? filteredNotifications[0] : null);
      } else if (!selectedNotificationForDetail && filteredNotifications.length > 0) {
        setSelectedNotificationForDetail(filteredNotifications[0]);
      } else if (filteredNotifications.length === 0) {
        setSelectedNotificationForDetail(null);
      }
    }
  }, [filteredNotifications, showDetailView, selectedNotificationForDetail]);

  const handleSwitchToDetailView = (notification) => {
    setSelectedNotificationForDetail(notification);
    setShowDetailView(true); 
  };

  const handleSwitchToFullListView = () => {
    setShowDetailView(false);
  };

  const renderFullWidthListView = () => (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 bg-white rounded-lg shadow-sm border border-gray-200">
      {isLoading && <div className="p-10 text-center text-gray-500">Loading notifications...</div>}
      {error && <div className="p-10 text-center text-red-500">Error: {error}</div>}
      {!isLoading && !error && filteredNotifications.length > 0 ? (
        filteredNotifications.map(notif => (
          <NotificationItem 
              key={notif.id} 
              notification={notif} 
              onClick={handleSwitchToDetailView}
              isSelected={selectedNotificationForDetail?.id === notif.id && showDetailView}
              isDetailListContext={false}
          />
        ))
      ) : (
        !isLoading && !error && (
          <div className="text-center text-gray-500 p-10">
            {notifications.length === 0 && !searchTerm ? "You have no notifications." : 
             `No notifications found${searchTerm ? " matching your search." : "."}`
            }
          </div>
        )
      )}
    </div>
  );

  const renderTwoColumnDetailView = () => (
    <div className="flex-1 flex overflow-hidden border border-gray-200 rounded-lg shadow-sm">
      <div className="w-full md:w-[45%] lg:w-2/5 flex flex-col bg-white border-r border-gray-200">
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1">
          {isLoading && <div className="p-10 text-center text-gray-500">Loading...</div>}
          {error && <div className="p-10 text-center text-red-500">Error: {error}</div>}
          {!isLoading && !error && filteredNotifications.length > 0 ? (
            filteredNotifications.map(notif => (
              <NotificationItem 
                  key={notif.id} 
                  notification={notif} 
                  onClick={(n) => setSelectedNotificationForDetail(n)} 
                  isSelected={selectedNotificationForDetail?.id === notif.id}
                  isDetailListContext={true}
              />
            ))
          ) : (
            !isLoading && !error && (
              <div className="text-center text-gray-500 p-10">
                 {notifications.length === 0 && !searchTerm ? "No notifications." :
                  `No notifications found${searchTerm ? " matching your search." : "."}`
                 }
              </div>
            )
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
    <div className="h-full flex flex-col p-4 bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div className="relative w-full sm:w-auto sm:flex-grow sm:max-w-md">
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none text-sm shadow-sm self-start sm:self-center whitespace-nowrap">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>

      {showDetailView ? renderTwoColumnDetailView() : renderFullWidthListView()}
      
      {showDetailView && selectedNotificationForDetail && (
        <div className="md:hidden fixed inset-0 z-50 overflow-y-auto bg-white">
          <NotificationDetailView 
            notification={selectedNotificationForDetail}
            onBackToListView={() => {
              setSelectedNotificationForDetail(null); 
            }}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;