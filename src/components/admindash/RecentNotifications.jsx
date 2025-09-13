import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaBell, FaEye, FaUsers } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';

export default function RecentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSent: 0,
    totalRead: 0,
    totalUnread: 0
  });

  useEffect(() => {
    fetchRecentNotifications();
  }, []);

  const fetchRecentNotifications = async () => {
    try {
      setLoading(true);
      
      const usersSnapshot = await getDocs(
        query(collection(db, 'users'), where('role', 'in', ['doctor', 'customer']))
      );

      let allNotifications = [];
      let totalSent = 0;
      let totalRead = 0;
      let totalUnread = 0;

      usersSnapshot.docs.forEach(userDoc => {
        const userData = userDoc.data();
        if (userData.notifications && userData.notifications.length > 0) {
          userData.notifications.forEach(notification => {
            totalSent++;
            if (notification.read) {
              totalRead++;
            } else {
              totalUnread++;
            }
            
            allNotifications.push({
              ...notification,
              userId: userDoc.id,
              userName: userData.fullName || userData.email || 'Unknown User'
            });
          });
        }
      });

      allNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setNotifications(allNotifications.slice(0, 10));
      setStats({
        totalSent,
        totalRead,
        totalUnread
      });
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-center items-center h-32">
          <BeatLoader color="#D9A741" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaBell className="text-petut-brown-300 mr-3" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Recent Notifications
            </h3>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Sent</p>
              <p className="text-lg font-bold text-petut-brown-300">{stats.totalSent}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Read</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.totalRead}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Unread</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">{stats.totalUnread}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <FaBell className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400">No recent notifications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div
                key={`${notification.id}-${index}`}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  notification.read 
                    ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600' 
                    : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getNotificationTypeColor(notification.type)}`}>
                        {notification.type === 'success' ? 'Success' :
                         notification.type === 'warning' ? 'Warning' :
                         notification.type === 'error' ? 'Error' : 'Info'}
                      </span>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-petut-brown-300 rounded-full"></span>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {notification.title}
                    </h4>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {notification.body}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <FaUsers className="mr-1" />
                        To: {notification.userName}
                      </span>
                      <span>{formatDate(notification.timestamp)}</span>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {notification.read ? (
                      <FaEye className="text-green-500 dark:text-green-400" size={16} />
                    ) : (
                      <div className="w-4 h-4 bg-petut-brown-300 dark:bg-petut-brown-400 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}