import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaEye, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function LiveStats() {
  const [liveStats, setLiveStats] = useState({
    onlineUsers: 0,
    pendingReservations: 0,
    completedToday: 0,
    systemAlerts: 0
  });

  useEffect(() => {
    // Real-time listeners for live stats
    const unsubscribeUsers = onSnapshot(
      query(collection(db, 'users'), where('isActive', '==', true)),
      (snapshot) => {
        setLiveStats(prev => ({ ...prev, onlineUsers: snapshot.size }));
      }
    );

    const unsubscribeReservations = onSnapshot(
      query(collection(db, 'reservations'), where('status', '==', 'pending')),
      (snapshot) => {
        setLiveStats(prev => ({ ...prev, pendingReservations: snapshot.size }));
      }
    );

    const unsubscribeCompleted = onSnapshot(
      collection(db, 'reservations'),
      (snapshot) => {
        const today = new Date().toDateString();
        const completedToday = snapshot.docs.filter(doc => {
          const data = doc.data();
          return data.status === 'completed' && 
                 data.updatedAt && 
                 new Date(data.updatedAt.seconds * 1000).toDateString() === today;
        }).length;
        
        setLiveStats(prev => ({ ...prev, completedToday }));
      }
    );

    return () => {
      unsubscribeUsers();
      unsubscribeReservations();
      unsubscribeCompleted();
    };
  }, []);

  const statsCards = [
    {
      title: 'Online Users',
      value: liveStats.onlineUsers,
      icon: <FaEye className="w-5 h-5" />,
      color: 'text-white',
      bgColor: 'bg-yellow-400'
    },
    {
      title: 'Pending Reservations',
      value: liveStats.pendingReservations,
      icon: <FaClock className="w-5 h-5" />,
      color: 'text-white',
      bgColor: 'bg-yellow-400'
    },
    {
      title: 'Completed Today',
      value: liveStats.completedToday,
      icon: <FaCheckCircle className="w-5 h-5" />,
      color: 'text-white',
      bgColor: 'bg-yellow-400'
    },
    {
      title: 'System Alerts',
      value: liveStats.systemAlerts,
      icon: <FaExclamationTriangle className="w-5 h-5" />,
      color: 'text-white',
      bgColor: 'bg-yellow-400'
    }
  ];

  return (
    <div className="admin-card p-6 bg-white dark:bg-gray-800">
      <div className="flex items-center mb-6">
        <div className="w-3 h-3 bg-petut-orange-500 rounded-full mr-3 animate-pulse"></div>
        <h3 className="text-xl font-bold text-black dark:text-white">Live Statistics</h3>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-shadow">
            <div className={`inline-flex items-center justify-center w-14 h-14 ${stat.bgColor} rounded-xl mb-3`}>
              <div className={stat.color}>
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-black dark:text-white mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-black dark:text-white">{stat.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}