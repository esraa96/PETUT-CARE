import React, { Fragment, useEffect, useState } from 'react'
import { FaCalendarCheck, FaClock } from 'react-icons/fa'
import { MdPeople } from 'react-icons/md'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db, auth } from '../../firebase'
import { BeatLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import image from '../../assets/hello-doctor.jpg'
import DashboardStats from '../../components/doctordash/DashboardStats'

export default function HelloDoctor() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    weekAppointments: 0
  })
  const [loading, setLoading] = useState(true)
  const [doctorName, setDoctorName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!auth.currentUser) return
      
      try {
        const doctorId = auth.currentUser.uid
        
        // Get doctor name from users collection
        try {
          const userQuery = query(collection(db, 'users'), where('uid', '==', doctorId))
          const userSnapshot = await getDocs(userQuery)
          if (!userSnapshot.empty) {
            setDoctorName(userSnapshot.docs[0].data().fullName)
          }
        } catch (userError) {
          console.log('Could not fetch user data:', userError)
          setDoctorName('Doctor')
        }

        // Get appointments data
        const appointmentsQuery = query(
          collection(db, 'bookings'),
          where('doctorId', '==', doctorId)
        )
        const appointmentsSnapshot = await getDocs(appointmentsQuery)
        const appointments = appointmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        // Calculate today's appointments
        const today = new Date()
        const todayStr = today.toDateString()
        const todayAppointments = appointments.filter(apt => {
          const aptDate = apt.date?.toDate ? apt.date.toDate() : new Date(apt.date)
          return aptDate.toDateString() === todayStr
        }).length
        
        // Calculate completed appointments
        const completed = appointments.filter(apt => apt.status === 'completed').length
        
        // Get unique patients
        const uniquePatients = new Set(appointments.map(apt => apt.userId)).size
        
        // Calculate this week's appointments
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        const weekAppointments = appointments.filter(apt => {
          const aptDate = apt.date?.toDate ? apt.date.toDate() : new Date(apt.date)
          return aptDate >= startOfWeek
        }).length
        
        setStats({
          totalPatients: uniquePatients,
          todayAppointments,
          totalAppointments: appointments.length,
          completedAppointments: completed,
          weekAppointments
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
    
    // Set up real-time listener for appointments
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchDashboardData()
      }
    })

    return () => unsubscribe()
  }, [])

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <BeatLoader color="#D9A741" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#D9A741] to-[#E6B84A] rounded-xl p-6 mb-6 text-white">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1 order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{getGreeting()}, Dr. {doctorName}!</h2>
            <p className="text-yellow-100 mb-4">Welcome back to your dashboard. Here's what's happening today.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <FaClock size={16} />
                <span className="text-sm">{getCurrentTime()}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarCheck size={16} />
                <span className="text-sm hidden sm:inline">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="text-sm sm:hidden">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 mb-4 md:mb-0">
            <img src={image} alt="Doctor" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/30" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h5 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h5>
          <div className="space-y-3">
            <button 
              className="w-full btn-primary-petut flex items-center justify-center gap-2" 
              onClick={() => navigate('/doctor-dashboard/manage-appointments')}
              disabled={loading}
            >
              <FaCalendarCheck size={16} />
              <span>View Today's Appointments</span>
            </button>
            <button 
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors" 
              onClick={() => navigate('/doctor-dashboard/manage-clients')}
              disabled={loading}
            >
              <MdPeople size={16} />
              <span>Manage Patients</span>
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h5 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h5>
          <div className="text-gray-600 space-y-2">
            <p className="text-sm">• {stats.todayAppointments} appointments scheduled for today</p>
            <p className="text-sm">• {stats.totalPatients} patients in your care</p>
            <p className="text-sm">• {stats.weekAppointments} appointments this week</p>
            <p className="text-sm">• {((stats.completedAppointments / stats.totalAppointments) * 100 || 0).toFixed(1)}% completion rate</p>
          </div>
        </div>
      </div>
    </div>
  )
}
