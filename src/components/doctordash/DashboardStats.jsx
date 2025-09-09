import React, { useState, useEffect } from 'react'
import { 
  MdPeople, 
  MdSchedule, 
  MdLocalHospital, 
  MdTrendingUp,
  MdCalendarToday,
  MdAccessTime 
} from 'react-icons/md'
import { FaChartLine, FaUserCheck, FaClock } from 'react-icons/fa'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db, auth } from '../../firebase'

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    weekAppointments: 0,
    monthAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    revenue: 0,
    avgRating: 0,
    cancelledAppointments: 0,
    totalClinics: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!auth.currentUser) return
      
      try {
        const doctorId = auth.currentUser.uid
        
        // Get all appointments for this doctor
        const appointmentsQuery = query(
          collection(db, 'bookings'),
          where('doctorId', '==', doctorId)
        )
        const appointmentsSnapshot = await getDocs(appointmentsQuery)
        const appointments = appointmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        // Calculate date ranges
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const todayStr = today.toDateString()
        
        // Calculate statistics
        const todayAppointments = appointments.filter(apt => {
          const aptDate = apt.date?.toDate ? apt.date.toDate() : new Date(apt.date)
          return aptDate.toDateString() === todayStr
        }).length
        
        const weekAppointments = appointments.filter(apt => {
          const aptDate = apt.date?.toDate ? apt.date.toDate() : new Date(apt.date)
          return aptDate >= startOfWeek
        }).length
        
        const monthAppointments = appointments.filter(apt => {
          const aptDate = apt.date?.toDate ? apt.date.toDate() : new Date(apt.date)
          return aptDate >= startOfMonth
        }).length
        
        const completedAppointments = appointments.filter(apt => 
          apt.status === 'completed'
        ).length
        
        const pendingAppointments = appointments.filter(apt => 
          apt.status === 'pending' || apt.status === 'booked'
        ).length
        
        const uniquePatients = new Set(appointments.map(apt => apt.userId)).size
        
        const cancelledAppointments = appointments.filter(apt => 
          apt.status === 'cancelled'
        ).length
        
        const revenue = appointments
          .filter(apt => apt.status === 'completed')
          .reduce((sum, apt) => sum + (parseFloat(apt.price) || 0), 0)
        
        // Get clinics count
        let totalClinics = 0;
        try {
          const clinicsQuery = query(
            collection(db, 'clinics'),
            where('doctorId', '==', doctorId)
          )
          const clinicsSnapshot = await getDocs(clinicsQuery)
          totalClinics = clinicsSnapshot.size
        } catch (clinicsError) {
          console.log('Could not fetch clinics:', clinicsError)
        }
        
        setStats({
          totalPatients: uniquePatients,
          todayAppointments,
          weekAppointments,
          monthAppointments,
          completedAppointments,
          pendingAppointments,
          revenue,
          avgRating: 4.8,
          cancelledAppointments,
          totalClinics
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statsCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: MdPeople,
      color: '#D9A741',
      bgColor: 'rgba(217, 167, 65, 0.1)',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: MdCalendarToday,
      color: '#28a745',
      bgColor: 'rgba(40, 167, 69, 0.1)',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'This Week',
      value: stats.weekAppointments,
      icon: MdSchedule,
      color: '#17a2b8',
      bgColor: 'rgba(23, 162, 184, 0.1)',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Completed',
      value: stats.completedAppointments,
      icon: FaUserCheck,
      color: '#6f42c1',
      bgColor: 'rgba(111, 66, 193, 0.1)',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Pending',
      value: stats.pendingAppointments,
      icon: FaClock,
      color: '#ffc107',
      bgColor: 'rgba(255, 193, 7, 0.1)',
      change: '-3%',
      changeType: 'negative'
    },
    {
      title: 'Total Clinics',
      value: stats.totalClinics,
      icon: FaChartLine,
      color: '#20c997',
      bgColor: 'rgba(32, 201, 151, 0.1)',
      change: '+5%',
      changeType: 'positive'
    }
  ]

  if (loading) {
    return (
      <div className="row g-3 g-md-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6">
            <div className="stats-card">
              <div className="d-flex align-items-center justify-content-between">
                <div className="placeholder-glow flex-grow-1">
                  <span className="placeholder col-8 mb-2"></span>
                  <span className="placeholder col-6"></span>
                </div>
                <div className="placeholder-glow">
                  <span className="placeholder rounded-circle" style={{ width: 'clamp(35px, 8vw, 50px)', height: 'clamp(35px, 8vw, 50px)' }}></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="row g-3 g-md-4">
      {statsCards.map((card, index) => {
        const Icon = card.icon
        return (
          <div key={index} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6">
            <div className="stats-card">
              <div className="d-flex align-items-center justify-content-between flex-wrap">
                <div className="flex-grow-1">
                  <h3 className="mb-1 fw-bold" style={{ color: card.color, fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
                    {card.value}
                  </h3>
                  <p className="text-muted mb-1" style={{ fontSize: 'clamp(0.7rem, 2vw, 0.9rem)' }}>{card.title}</p>
                  <div className="d-flex align-items-center gap-1 d-none d-sm-flex">
                    <span 
                      className={`fw-semibold ${
                        card.changeType === 'positive' ? 'text-success' : 'text-danger'
                      }`}
                      style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)' }}
                    >
                      {card.change}
                    </span>
                    <span className="text-muted" style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)' }}>vs last month</span>
                  </div>
                </div>
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ 
                    backgroundColor: card.bgColor,
                    width: 'clamp(35px, 8vw, 50px)',
                    height: 'clamp(35px, 8vw, 50px)'
                  }}
                >
                  <Icon size={20} style={{ color: card.color }} />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}