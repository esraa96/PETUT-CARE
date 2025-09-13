import React, { useState, useEffect } from 'react';
import { FaBell, FaUsers, FaUserMd, FaPaperPlane, FaTrash } from 'react-icons/fa';
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';

export default function NotificationManager() {
  const [notification, setNotification] = useState({
    title: '',
    body: '',
    type: 'info'
  });
  const [targetAudience, setTargetAudience] = useState('all');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalClients: 0
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const [doctorsSnapshot, clientsSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'users'), where('role', '==', 'doctor'))),
        getDocs(query(collection(db, 'users'), where('role', '==', 'customer')))
      ]);

      setStats({
        totalDoctors: doctorsSnapshot.size,
        totalClients: clientsSnapshot.size,
        totalUsers: doctorsSnapshot.size + clientsSnapshot.size
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendNotification = async () => {
    if (!notification.title.trim() || !notification.body.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      let query_condition;
      
      switch (targetAudience) {
        case 'doctors':
          query_condition = query(collection(db, 'users'), where('role', '==', 'doctor'));
          break;
        case 'clients':
          query_condition = query(collection(db, 'users'), where('role', '==', 'customer'));
          break;
        default:
          query_condition = query(collection(db, 'users'), where('role', 'in', ['doctor', 'customer']));
      }

      const usersSnapshot = await getDocs(query_condition);
      const notificationData = {
        id: Date.now().toString(),
        title: notification.title,
        body: notification.body,
        type: notification.type,
        timestamp: new Date().toISOString(),
        read: false,
        sender: 'admin'
      };

      const updatePromises = usersSnapshot.docs.map(userDoc => 
        updateDoc(doc(db, 'users', userDoc.id), {
          notifications: arrayUnion(notificationData)
        })
      );

      await Promise.all(updatePromises);

      toast.success(`Notification sent to ${usersSnapshot.size} users successfully`);
      
      // Reset form
      setNotification({
        title: '',
        body: '',
        type: 'info'
      });
      
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Error occurred while sending notification');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setNotification({
      title: '',
      body: '',
      type: 'info'
    });
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <FaBell className="mr-3 text-petut-brown-300" />
          Notification Manager
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Send notifications to users and doctors
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-petut-brown-300 dark:text-petut-brown-200">Total Users</p>
              <p className="text-2xl font-bold text-petut-brown-400 dark:text-petut-brown-300">{stats.totalUsers}</p>
            </div>
            <FaUsers className="text-petut-brown-300 dark:text-petut-brown-200 text-2xl" />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">Doctors</p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-300">{stats.totalDoctors}</p>
            </div>
            <FaUserMd className="text-green-500 dark:text-green-400 text-2xl" />
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 dark:text-amber-400">Clients</p>
              <p className="text-2xl font-bold text-amber-800 dark:text-amber-300">{stats.totalClients}</p>
            </div>
            <FaUsers className="text-amber-500 dark:text-amber-400 text-2xl" />
          </div>
        </div>
      </div>

      {/* Notification Form */}
      <div className="space-y-6">
        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target Audience
          </label>
          <select
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-petut-brown-300"
          >
            <option value="all">All Users ({stats.totalUsers})</option>
            <option value="doctors">Doctors Only ({stats.totalDoctors})</option>
            <option value="clients">Clients Only ({stats.totalClients})</option>
          </select>
        </div>

        {/* Notification Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notification Type
          </label>
          <select
            name="type"
            value={notification.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-petut-brown-300"
          >
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notification Title *
          </label>
          <input
            type="text"
            name="title"
            value={notification.title}
            onChange={handleInputChange}
            placeholder="Enter notification title..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-petut-brown-300"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {notification.title.length}/100 characters
          </p>
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notification Content *
          </label>
          <textarea
            name="body"
            value={notification.body}
            onChange={handleInputChange}
            placeholder="Enter notification content..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-petut-brown-300 resize-none"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {notification.body.length}/500 characters
          </p>
        </div>

        {/* Preview */}
        {(notification.title || notification.body) && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notification Preview:</h4>
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notification.type === 'success' ? 'bg-green-500' :
                  notification.type === 'warning' ? 'bg-yellow-500' :
                  notification.type === 'error' ? 'bg-red-500' : 'bg-petut-brown-300'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {notification.title || 'Notification Title'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    {notification.body || 'Notification Content'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={sendNotification}
            disabled={loading || !notification.title.trim() || !notification.body.trim()}
            className="flex-1 bg-petut-brown-300 hover:bg-petut-brown-400 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {loading ? (
              <BeatLoader color="white" size={8} />
            ) : (
              <>
                <FaPaperPlane className="mr-2" />
                Send Notification
              </>
            )}
          </button>

          <button
            onClick={clearForm}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center"
          >
            <FaTrash className="mr-2" />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}