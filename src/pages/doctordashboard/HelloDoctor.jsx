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
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <BeatLoader color="#D9A741" />
      </div>
    )
  }

  return (
    <Fragment>
      {/* Welcome Section */}
      <div className="welcome-section mb-3 mb-md-4">
        <div className="row align-items-center">
          <div className="col-md-8 order-2 order-md-1">
            <h2 className="mb-2" style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)' }}>{getGreeting()}, Dr. {doctorName}!</h2>
            <p className="mb-3 opacity-90" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>Welcome back to your dashboard. Here's what's happening today.</p>
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2 gap-sm-3">
              <div className="d-flex align-items-center gap-2">
                <FaClock size={14} />
                <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>{getCurrentTime()}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaCalendarCheck size={14} />
                <span className="d-none d-sm-inline" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="d-inline d-sm-none" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
          <div className="col-md-4 text-center order-1 order-md-2 mb-3 mb-md-0">
            <img src={image} alt="Doctor" className="img-fluid rounded-circle" style={{ maxWidth: 'clamp(100px, 20vw, 150px)', border: '4px solid rgba(255,255,255,0.3)' }} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Quick Actions */}
      <div className="row g-3 g-md-4">
        <div className="col-lg-6 col-12">
          <div className="dashboard-card p-3 p-md-4">
            <h5 className="mb-3" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>Quick Actions</h5>
            <div className="d-grid gap-2">
              <button 
                className="custom-button d-flex align-items-center justify-content-center gap-2" 
                onClick={() => navigate('/doctor-dashboard/manage-appointments')}
                disabled={loading}
              >
                <FaCalendarCheck size={14} />
                <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>View Today's Appointments</span>
              </button>
              <button 
                className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2" 
                onClick={() => navigate('/doctor-dashboard/manage-clients')}
                disabled={loading}
              >
                <MdPeople size={14} />
                <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>Manage Patients</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6 col-12">
          <div className="dashboard-card p-3 p-md-4">
            <h5 className="mb-3" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>Recent Activity</h5>
            <div className="text-muted">
              <p className="mb-2" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>• {stats.todayAppointments} appointments scheduled for today</p>
              <p className="mb-2" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>• {stats.totalPatients} patients in your care</p>
              <p className="mb-2" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>• {stats.weekAppointments} appointments this week</p>
              <p className="mb-0" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>• {((stats.completedAppointments / stats.totalAppointments) * 100 || 0).toFixed(1)}% completion rate</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
