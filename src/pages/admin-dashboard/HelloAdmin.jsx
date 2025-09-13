import React, { Fragment, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase.js'
import image from '../../assets/petut.png'
import AdminStats from '../../components/admindash/AdminStats'
import AdminAvatar from '../../components/admindash/AdminAvatar'
import { FaClinicMedical, FaUsers, FaStore } from 'react-icons/fa'

export default function HelloAdmin() {
  const [adminData, setAdminData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const adminRef = doc(db, 'users', user.uid)
          const adminSnap = await getDoc(adminRef)
          const data = adminSnap.data()
          
          if (data?.role === 'admin') {
            setAdminData(data)
          }
        } catch (error) {
          console.error('Error fetching admin data:', error)
        }
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <Fragment>
        <div className="p-4 lg:p-6 bg-white dark:bg-gray-900 min-h-screen">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-petut-brown-300 dark:border-yellow-400"></div>
          </div>
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <div className="p-4 lg:p-6 bg-white dark:bg-gray-900 min-h-screen">
        {/* Admin Profile Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <AdminAvatar 
              size="lg" 
              showStatus={true} 
              className="border-3 border-petut-brown-300 shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">
                Welcome, {adminData?.fullName || 'Admin'}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {adminData?.email || 'admin@petut.com'}
              </p>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-petut-brown-100 dark:bg-gray-700 text-petut-brown-800 dark:text-yellow-400 mt-2">
                System Administrator
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              Welcome to Petut Admin Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
              From here you can manage all aspects of the application, monitor statistics, manage users and doctors, 
              and oversee the store and reservations. We wish you an easy and effective management experience.
            </p>
          </div>

          {/* Dynamic Statistics */}
          <div className="mb-8">
            <AdminStats />
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="admin-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-petut-brown-100 dark:bg-gray-700 rounded-lg">
                  <FaClinicMedical className="text-petut-brown-300 dark:text-yellow-400 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-black dark:text-white">Manage Clinics</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Monitor and manage registered clinics</p>
              <button 
                className="admin-button w-full"
                onClick={() => navigate('/admin-dashboard/manage-clinics')}
              >
                View Clinics
              </button>
            </div>
            
            <div className="admin-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-petut-brown-100 dark:bg-gray-700 rounded-lg">
                  <FaUsers className="text-petut-brown-300 dark:text-yellow-400 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-black dark:text-white">Manage Users</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Monitor doctors and clients</p>
              <button 
                className="admin-button w-full"
                onClick={() => navigate('/admin-dashboard/manage-users')}
              >
                View Users
              </button>
            </div>
            
            <div className="admin-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-petut-brown-100 dark:bg-gray-700 rounded-lg">
                  <FaStore className="text-petut-brown-300 dark:text-yellow-400 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-black dark:text-white">Manage Store</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Manage products and orders</p>
              <button 
                className="admin-button w-full"
                onClick={() => navigate('/admin-dashboard/store')}
              >
                View Store
              </button>
            </div>
          </div>

          {/* Petut Logo */}
          <div className="text-center">
            <img 
              src={image} 
              alt="Petut Logo" 
              className="w-48 h-48 object-contain mx-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>
      </div>
    </Fragment>
  )
}
