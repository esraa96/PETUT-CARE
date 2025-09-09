import { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MdSchedule, MdToday, MdEvent } from 'react-icons/md'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '../../firebase'
import { BeatLoader } from 'react-spinners'
import Calendar from '../../components/doctordash/calendar/Calendar';

export default function Manageappointments() {
  const [appointmentStats, setAppointmentStats] = useState({
    today: 0,
    thisWeek: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentStats = async () => {
      if (!auth.currentUser) return;
      
      try {
        const doctorId = auth.currentUser.uid;
        
        // Get all appointments
        const appointmentsQuery = query(
          collection(db, 'bookings'),
          where('doctorId', '==', doctorId)
        );
        const snapshot = await getDocs(appointmentsQuery);
        const appointments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Calculate stats
        const today = new Date();
        const todayStr = today.toDateString();
        
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        
        const todayCount = appointments.filter(apt => {
          const aptDate = apt.date?.toDate ? apt.date.toDate() : new Date(apt.date);
          return aptDate.toDateString() === todayStr;
        }).length;
        
        const weekCount = appointments.filter(apt => {
          const aptDate = apt.date?.toDate ? apt.date.toDate() : new Date(apt.date);
          return aptDate >= startOfWeek;
        }).length;
        
        setAppointmentStats({
          today: todayCount,
          thisWeek: weekCount,
          total: appointments.length
        });
      } catch (error) {
        console.error('Error fetching appointment stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointmentStats();
  }, []);

  return (
    <Fragment>
      {/* Page Header */}
      <div className="breadcrumb-container d-flex align-items-center justify-content-between">
        <div>
          <h4 className='mb-1 fw-bold' style={{ color: '#495057' }}>Appointment Management</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/doctor-dashboard" className='text-decoration-none' style={{ color: '#D9A741' }}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Appointments</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex align-items-center gap-2">
          <MdSchedule size={24} style={{ color: '#D9A741' }} />
          <span className="fw-semibold" style={{ color: '#D9A741' }}>Schedule Overview</span>
        </div>
      </div>

      {/* Quick Stats */}
      {loading ? (
        <div className="text-center py-4">
          <BeatLoader color="#D9A741" size={15} />
        </div>
      ) : (
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="dashboard-card p-3">
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)' }}>
                  <MdToday size={20} style={{ color: '#28a745' }} />
                </div>
                <div>
                  <h6 className="mb-0">Today's Appointments</h6>
                  <p className="text-muted mb-0 small">{appointmentStats.today} scheduled</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-card p-3">
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(217, 167, 65, 0.1)' }}>
                  <MdEvent size={20} style={{ color: '#D9A741' }} />
                </div>
                <div>
                  <h6 className="mb-0">This Week</h6>
                  <p className="text-muted mb-0 small">{appointmentStats.thisWeek} appointments</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-card p-3">
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(23, 162, 184, 0.1)' }}>
                  <MdSchedule size={20} style={{ color: '#17a2b8' }} />
                </div>
                <div>
                  <h6 className="mb-0">All Appointments</h6>
                  <p className="text-muted mb-0 small">{appointmentStats.total} total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Section */}
      <div className="dashboard-card">
        <div className="p-4 border-bottom">
          <h5 className="mb-0 d-flex align-items-center gap-2">
            <MdSchedule size={20} style={{ color: '#D9A741' }} />
            Appointment Calendar
          </h5>
        </div>
        <div className="p-4">
          <Calendar doctorId={auth.currentUser?.uid} />
        </div>
      </div>
    </Fragment>
  )
}
