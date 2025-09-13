import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { BeatLoader } from 'react-spinners';
import { 
  FaUsers, 
  FaUserMd, 
  FaBuilding, 
  FaCalendarAlt, 
  FaShoppingCart, 
  FaDollarSign,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

export default function DashboardAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalClinics: 0,
    totalReservations: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [usersSnapshot, doctorsSnapshot, clinicsSnapshot, reservationsSnapshot, ordersSnapshot] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(query(collection(db, 'users'), where('role', '==', 'doctor'))),
        getDocs(collection(db, 'clinics')),
        getDocs(collection(db, 'reservations')),
        getDocs(collection(db, 'orders'))
      ]);

      const orders = ordersSnapshot.docs.map(doc => doc.data());
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      const currentMonth = new Date().getMonth();
      const currentMonthOrders = orders.filter(order => {
        if (order.createdAt && order.createdAt.seconds) {
          const orderDate = new Date(order.createdAt.seconds * 1000);
          return orderDate.getMonth() === currentMonth;
        }
        return false;
      });

      const lastMonthOrders = orders.filter(order => {
        if (order.createdAt && order.createdAt.seconds) {
          const orderDate = new Date(order.createdAt.seconds * 1000);
          return orderDate.getMonth() === (currentMonth - 1 + 12) % 12;
        }
        return false;
      });

      const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      const monthlyGrowth = lastMonthRevenue > 0 ? 
        ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : 0;

      const activeUsers = usersSnapshot.docs.filter(doc => doc.data().isActive).length;

      setAnalytics({
        totalUsers: usersSnapshot.size,
        totalDoctors: doctorsSnapshot.size,
        totalClinics: clinicsSnapshot.size,
        totalReservations: reservationsSnapshot.size,
        totalOrders: ordersSnapshot.size,
        totalRevenue,
        monthlyGrowth: Math.round(monthlyGrowth),
        activeUsers
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyticsCards = [
    {
      title: 'Total Users',
      value: analytics.totalUsers,
      icon: <FaUsers className="w-8 h-8" />,
      color: 'bg-yellow-400',
      textColor: 'text-white'
    },
    {
      title: 'Active Users',
      value: analytics.activeUsers,
      icon: <FaUsers className="w-8 h-8" />,
      color: 'bg-yellow-400',
      textColor: 'text-white'
    },
    {
      title: 'Total Doctors',
      value: analytics.totalDoctors,
      icon: <FaUserMd className="w-8 h-8" />,
      color: 'bg-yellow-400',
      textColor: 'text-white'
    },
    {
      title: 'Total Clinics',
      value: analytics.totalClinics,
      icon: <FaBuilding className="w-8 h-8" />,
      color: 'bg-yellow-400',
      textColor: 'text-white'
    },
    {
      title: 'Total Reservations',
      value: analytics.totalReservations,
      icon: <FaCalendarAlt className="w-8 h-8" />,
      color: 'bg-yellow-400',
      textColor: 'text-white'
    },
    {
      title: 'Total Orders',
      value: analytics.totalOrders,
      icon: <FaShoppingCart className="w-8 h-8" />,
      color: 'bg-yellow-400',
      textColor: 'text-white'
    },
    {
      title: 'Total Revenue',
      value: `$${analytics.totalRevenue.toFixed(2)}`,
      icon: <FaDollarSign className="w-8 h-8" />,
      color: 'bg-yellow-400',
      textColor: 'text-white'
    },
    {
      title: 'Monthly Growth',
      value: `${analytics.monthlyGrowth}%`,
      icon: analytics.monthlyGrowth >= 0 ? 
        <FaArrowUp className="w-8 h-8" /> : 
        <FaArrowDown className="w-8 h-8" />,
      color: 'bg-yellow-400',
      textColor: 'text-white'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <BeatLoader color="#D9A741" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {analyticsCards.map((card, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-petut-orange-200 dark:border-gray-600 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black dark:text-white mb-2">{card.title}</p>
              <p className="text-3xl font-bold text-black dark:text-white">{card.value}</p>
            </div>
            <div className={`p-3 rounded-full ${card.color}`}>
              <div className={card.textColor}>
                {card.icon}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}