import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaBell, FaEye, FaEyeSlash, FaPaperPlane } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';

export default function NotificationStats() {
  const [stats, setStats] = useState({
    totalSent: 0,
    totalRead: 0,
    totalUnread: 0,
    readPercentage: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'users'), where('role', 'in', ['doctor', 'customer'])),
      (snapshot) => {
        calculateStats(snapshot);
      },
      (error) => {
        console.error('Error listening to notifications:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const calculateStats = (snapshot) => {
    let totalSent = 0;
    let totalRead = 0;
    let totalUnread = 0;

    snapshot.docs.forEach(userDoc => {
      const userData = userDoc.data();
      if (userData.notifications && userData.notifications.length > 0) {
        userData.notifications.forEach(notification => {
          totalSent++;
          if (notification.read) {
            totalRead++;
          } else {
            totalUnread++;
          }
        });
      }
    });

    const readPercentage = totalSent > 0 ? Math.round((totalRead / totalSent) * 100) : 0;

    setStats({
      totalSent,
      totalRead,
      totalUnread,
      readPercentage
    });
    setLoading(false);
  };

  const statsData = [
    {
      title: 'Total Sent',
      value: stats.totalSent,
      icon: FaPaperPlane,
      color: 'text-petut-brown-300 dark:text-petut-brown-200',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    {
      title: 'Read',
      value: stats.totalRead,
      icon: FaEye,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      title: 'Unread',
      value: stats.totalUnread,
      icon: FaEyeSlash,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    {
      title: 'Read Rate',
      value: `${stats.readPercentage}%`,
      icon: FaBell,
      color: 'text-petut-brown-400 dark:text-petut-brown-300',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-6 animate-pulse">
            <div className="h-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} ${stat.borderColor} p-6 rounded-lg border transition-all duration-300 hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            
            {/* Progress bar for read percentage */}
            {stat.title === 'Read Rate' && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-petut-brown-300 dark:bg-petut-brown-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.readPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}