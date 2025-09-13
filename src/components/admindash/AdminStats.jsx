import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaUsers, FaUserMd, FaCalendarAlt, FaShoppingCart } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';

export default function AdminStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalClients: 0,
    totalReservations: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const [
        doctorsSnapshot,
        clientsSnapshot,
        reservationsSnapshot,
        ordersSnapshot
      ] = await Promise.all([
        getDocs(query(collection(db, 'users'), where('role', '==', 'doctor'))),
        getDocs(query(collection(db, 'users'), where('role', '==', 'customer'))),
        getDocs(collection(db, 'reservations')),
        getDocs(collection(db, 'orders'))
      ]);

      setStats({
        totalDoctors: doctorsSnapshot.size,
        totalClients: clientsSnapshot.size,
        totalUsers: doctorsSnapshot.size + clientsSnapshot.size,
        totalReservations: reservationsSnapshot.size,
        totalOrders: ordersSnapshot.size
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FaUsers,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Doctors',
      value: stats.totalDoctors,
      icon: FaUserMd,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      title: 'Clients',
      value: stats.totalClients,
      icon: FaUsers,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      title: 'Reservations',
      value: stats.totalReservations,
      icon: FaCalendarAlt,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    {
      title: 'Orders',
      value: stats.totalOrders,
      icon: FaShoppingCart,
      color: 'bg-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <BeatLoader color="#D9A741" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} ${stat.borderColor} p-4 rounded-lg border transition-all duration-300 hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}