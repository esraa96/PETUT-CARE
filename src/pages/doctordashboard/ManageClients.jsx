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
    <Fragment>
      {/* Page Header */}
      <div className="breadcrumb-container d-flex align-items-center justify-content-between">
        <div>
          <h4 className='mb-1 fw-bold' style={{ color: '#495057' }}>Patient Management</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/doctor-dashboard" className='text-decoration-none' style={{ color: '#D9A741' }}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Patients</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge" style={{ backgroundColor: '#D9A741', color: 'white', padding: '8px 12px' }}>
            {filteredBookings?.length || 0} / {bookings?.length || 0} Patients
          </span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="dashboard-card p-4 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <label className="form-label fw-semibold mb-2">Search Patients</label>
            <div className="search-box position-relative">
              <input
                className="form-control"
                type="text"
                placeholder="Search by name, email, or clinic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <BiSearchAlt2
                size={20}
                className="position-absolute"
                style={{ top: '50%', right: '15px', transform: 'translateY(-50%)', color: '#6c757d' }}
              />
            </div>
          </div>
          <div className="col-md-3">
            <label className="form-label fw-semibold mb-2">Filter by Status</label>
            <select 
              className="form-select"
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
          <div className="col-md-3">
            <label className="form-label fw-semibold mb-2">Sort by</label>
            <select 
              className="form-select"
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
        <div className="loading-container">
          <div className="text-center">
            <BeatLoader color="#D9A741" size={15} />
            <p className="mt-3 text-muted">Loading patients...</p>
          </div>
        </div>
      ) : filteredBookings?.length === 0 ? (
        <div className="dashboard-card p-5 text-center">
          <div className="mb-4">
            <MdPeople size={64} style={{ color: '#D9A741', opacity: 0.5 }} />
          </div>
          <h5 className="text-muted mb-3">No Patients Found</h5>
          <p className="text-muted">You don't have any patients yet. Patients will appear here when they book appointments with you.</p>
        </div>
      ) : (
        <div className="dashboard-card">
          <div className="p-4 border-bottom">
            <h5 className="mb-0">Patient List ({filteredBookings.length})</h5>
          </div>
          <BookingsOneDoctor bookings={filteredBookings} onBookingUpdate={handleBookingUpdate} />
        </div>
      )}
    </Fragment>
  )
}
