import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { BeatLoader } from 'react-spinners';

export default function RecentUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentUsers();
  }, []);

  const fetchRecentUsers = async () => {
    try {
      const usersQuery = query(
        collection(db, 'users'), 
        orderBy('createdAt', 'desc'), 
        limit(5)
      );
      const usersSnapshot = await getDocs(usersQuery);
      
      const recentUsers = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        time: doc.data().createdAt ? 
          new Date(doc.data().createdAt.seconds * 1000).toLocaleDateString() : 
          'Unknown',
        status: doc.data().isActive ? 'online' : 'offline'
      }));

      setUsers(recentUsers);
    } catch (error) {
      console.error('Error fetching recent users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isApproved: true,
        isActive: true
      });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isApproved: true, status: 'online' } : user
      ));
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isApproved: false,
        isActive: false
      });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isApproved: false, status: 'offline' } : user
      ));
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  if (loading) {
    return (
      <div className="admin-card p-6">
        <div className="flex justify-center items-center h-64">
          <BeatLoader color="#D9A741" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-table">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-petut-brown-300 rounded-full mr-3"></div>
          <h3 className="text-lg font-semibold text-black dark:text-white">Recent Users</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black dark:text-white">{user.fullName || 'Unknown User'}</p>
                    <p className="text-xs text-black dark:text-white">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      user.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-xs text-black dark:text-white">{user.time}</span>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => handleReject(user.id)}
                      className="px-3 py-1 text-xs bg-red-100 dark:bg-red-600 text-red-600 dark:text-white rounded-full hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleApprove(user.id)}
                      className="admin-button text-xs px-3 py-1 rounded-full"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="sm:hidden">
                <div className="text-center mb-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-medium text-sm mx-auto mb-2">
                    {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <p className="text-sm font-medium text-black dark:text-white">{user.fullName || 'Unknown User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${
                      user.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{user.time}</span>
                  </div>
                </div>
                <div className="flex justify-center space-x-2">
                  <button 
                    onClick={() => handleReject(user.id)}
                    className="px-4 py-2 text-xs bg-red-100 dark:bg-red-600 text-red-600 dark:text-white rounded-full hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(user.id)}
                    className="admin-button text-xs px-4 py-2 rounded-full"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
