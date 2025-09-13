import React, { useState, useEffect } from 'react';
import { FaTrophy, FaLightbulb, FaMapMarkerAlt } from 'react-icons/fa';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { BeatLoader } from 'react-spinners';

export default function UpcomingEvents() {
  const [stats, setStats] = useState({
    upcomingReservations: 0,
    totalPosts: 0,
    totalClinics: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventStats();
  }, []);

  const fetchEventStats = async () => {
    try {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const reservationsSnapshot = await getDocs(collection(db, 'reservations'));
      const upcomingReservations = reservationsSnapshot.docs.filter(doc => {
        const data = doc.data();
        if (data.date && data.date.seconds) {
          const reservationDate = new Date(data.date.seconds * 1000);
          return reservationDate >= new Date() && reservationDate <= nextWeek;
        }
        return false;
      }).length;

      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const clinicsSnapshot = await getDocs(collection(db, 'clinics'));
      
      const completedReservations = reservationsSnapshot.docs.filter(doc => 
        doc.data().status === 'completed'
      ).length;
      const totalReservations = reservationsSnapshot.size;
      const completionRate = totalReservations > 0 ? 
        Math.round((completedReservations / totalReservations) * 100) : 0;

      setStats({
        upcomingReservations,
        totalPosts: postsSnapshot.size,
        totalClinics: clinicsSnapshot.size,
        completionRate
      });
    } catch (error) {
      console.error('Error fetching event stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <BeatLoader color="#D9A741" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-petut-orange-200 dark:border-gray-600 p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-white">Upcoming Reservations</h3>
          <span className="px-3 py-1 bg-petut-orange-100 dark:bg-gray-700 text-black dark:text-white rounded-full text-sm font-medium">
            {stats.completionRate}%
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-black dark:text-white mb-2">{stats.upcomingReservations}</p>
            <p className="text-sm text-black dark:text-white">Next 7 Days</p>
            <p className="text-xs text-black dark:text-white mt-1">Completion rate: {stats.completionRate}%</p>
          </div>
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
            <FaTrophy className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-petut-orange-200 dark:border-gray-600 p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-black dark:text-white mb-2">{stats.totalPosts}</p>
            <p className="text-sm text-black dark:text-white">TOTAL POSTS</p>
          </div>
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
            <FaLightbulb className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-petut-orange-200 dark:border-gray-600 p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-black dark:text-white mb-2">{stats.totalClinics}</p>
            <p className="text-sm text-black dark:text-white">TOTAL CLINICS</p>
          </div>
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
            <FaMapMarkerAlt className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}