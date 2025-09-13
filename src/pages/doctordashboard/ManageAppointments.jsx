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
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <nav aria-label="breadcrumb" className='mb-6'>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className='font-bold text-xl text-gray-800 mb-1'>Appointment Management</h1>
            <ol className="flex items-center space-x-2 text-sm">
              <li><Link to="/doctor-dashboard" className='text-[#D9A741] hover:underline'>Dashboard</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700 font-medium">Appointments</li>
            </ol>
          </div>
          <div className="flex items-center gap-2">
            <MdSchedule size={24} className="text-[#D9A741]" />
            <span className="font-semibold text-[#D9A741]">Schedule Overview</span>
          </div>
        </div>
      </nav>

      {/* Quick Stats */}
      {loading ? (
        <div className="text-center py-8">
          <BeatLoader color="#D9A741" size={15} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-100">
                <MdToday size={20} className="text-green-600" />
              </div>
              <div>
                <h6 className="font-semibold text-gray-800">Today's Appointments</h6>
                <p className="text-gray-500 text-sm">{appointmentStats.today} scheduled</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-yellow-100">
                <MdEvent size={20} className="text-yellow-600" />
              </div>
              <div>
                <h6 className="font-semibold text-gray-800">This Week</h6>
                <p className="text-gray-500 text-sm">{appointmentStats.thisWeek} appointments</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100">
                <MdSchedule size={20} className="text-blue-600" />
              </div>
              <div>
                <h6 className="font-semibold text-gray-800">All Appointments</h6>
                <p className="text-gray-500 text-sm">{appointmentStats.total} total</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Section */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h5 className="text-lg font-semibold flex items-center gap-2">
            <MdSchedule size={20} className="text-[#D9A741]" />
            Appointment Calendar
          </h5>
        </div>
        <div className="p-6">
          <Calendar doctorId={auth.currentUser?.uid} />
        </div>
      </div>
    </div>
  )
}
