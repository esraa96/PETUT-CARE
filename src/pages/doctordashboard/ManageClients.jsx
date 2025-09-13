import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BiSearchAlt2 } from "react-icons/bi";
import { MdPeople } from "react-icons/md";
import { toast } from 'react-toastify';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { BeatLoader } from 'react-spinners';
import BookingsOneDoctor from './../../components/doctordash/BookingsOneDoctor';
import { getAuth } from 'firebase/auth';



export default function Manageclients() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const auth = getAuth();
  const currentDoctorId = auth.currentUser?.uid;



  // get bookings from firebase
  useEffect(() => {
    const fetchBookingsOneDoctor = async () => {
      if (!currentDoctorId) return;
      try {
        setLoading(true);
        const q = query(collection(db, "bookings"), where("doctorId", "==", currentDoctorId));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          setBookings([]);
          return;
        }
        const bookingsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBookings(bookingsData);
        setFilteredBookings(bookingsData);
      } catch (error) {
        toast.error("Failed to fetch bookings, error:" + error.message, { autoClose: 3000 });

      } finally {
        setLoading(false);

      }
    };
    fetchBookingsOneDoctor();
  }, [currentDoctorId]);

  // Filter and search bookings
  useEffect(() => {
    let filtered = [...bookings];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.clinicName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.patientName || '').localeCompare(b.patientName || '');
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        case 'date':
        default:
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
          return dateB - dateA;
      }
    });

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, sortBy]);

  const handleBookingUpdate = () => {
    // Refresh bookings data
    const fetchBookingsOneDoctor = async () => {
      if (!currentDoctorId) return;
      try {
        setLoading(true);
        const q = query(collection(db, "bookings"), where("doctorId", "==", currentDoctorId));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          setBookings([]);
          setFilteredBookings([]);
          return;
        }
        const bookingsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBookings(bookingsData);
        setFilteredBookings(bookingsData);
      } catch (error) {
        toast.error("Failed to fetch bookings, error:" + error.message, { autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };
    fetchBookingsOneDoctor();
  };



  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <nav aria-label="breadcrumb" className='mb-6'>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className='font-bold text-xl text-gray-800 mb-1'>Patient Management</h1>
            <ol className="flex items-center space-x-2 text-sm">
              <li><Link to="/doctor-dashboard" className='text-[#D9A741] hover:underline'>Dashboard</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700 font-medium">Patients</li>
            </ol>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-[#D9A741] text-white px-3 py-2 rounded-lg font-medium text-sm">
              {filteredBookings?.length || 0} / {bookings?.length || 0} Patients
            </span>
          </div>
        </div>
      </nav>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Patients</label>
            <div className="relative">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9A741] focus:border-transparent"
                type="text"
                placeholder="Search by name, email, or clinic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <BiSearchAlt2
                size={20}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Status</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9A741] focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Appointments</option>
              <option value="pending">Pending</option>
              <option value="booked">Active Bookings</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sort by</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9A741] focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Appointment Date</option>
              <option value="name">Patient Name</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <BeatLoader color="#D9A741" size={15} />
          <p className="mt-4 text-gray-500">Loading patients...</p>
        </div>
      ) : filteredBookings?.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="mb-4">
            <MdPeople size={64} className="text-[#D9A741] opacity-50 mx-auto" />
          </div>
          <h5 className="text-gray-500 text-lg font-semibold mb-3">No Patients Found</h5>
          <p className="text-gray-400">You don't have any patients yet. Patients will appear here when they book appointments with you.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h5 className="text-lg font-semibold">Patient List ({filteredBookings.length})</h5>
          </div>
          <BookingsOneDoctor bookings={filteredBookings} onBookingUpdate={handleBookingUpdate} />
        </div>
      )}
    </div>
  )
}
