import React, { Fragment, useState } from 'react'
import { FaEye, FaPhone, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import { MdPerson, MdEmail } from "react-icons/md";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify';

export default function BookingsOneDoctor({ bookings, onBookingUpdate }) {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);

    const getStatusBadge = (status) => {
        const statusConfig = {
            'booked': { bg: 'rgba(23, 162, 184, 0.1)', color: '#17a2b8', text: 'Booked' },
            'completed': { bg: 'rgba(40, 167, 69, 0.1)', color: '#28a745', text: 'Completed' },
            'cancelled': { bg: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', text: 'Cancelled' },
            'pending': { bg: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', text: 'Pending' }
        };
        
        const config = statusConfig[status] || statusConfig['pending'];
        
        return (
            <span 
                className="badge px-3 py-2 fw-semibold"
                style={{ 
                    backgroundColor: config.bg, 
                    color: config.color,
                    border: `1px solid ${config.color}30`
                }}
            >
                {config.text}
            </span>
        );
    };

    const formatDate = (date) => {
        if (!date) return '-';
        try {
            const dateObj = date.toDate ? date.toDate() : new Date(date);
            return dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return '-';
        }
    };

    const handleStatusChange = async (bookingId, newStatus) => {
        setUpdatingStatus(bookingId);
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, {
                status: newStatus,
                updatedAt: new Date()
            });
            
            toast.success(`Appointment status updated to ${newStatus}`);
            
            // Update selected booking if it's the one being updated
            if (selectedBooking?.id === bookingId) {
                setSelectedBooking(prev => ({ ...prev, status: newStatus }));
            }
            
            // Notify parent component to refresh data
            if (onBookingUpdate) {
                onBookingUpdate();
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update appointment status');
        } finally {
            setUpdatingStatus(null);
        }
    };

    return (
        <Fragment>
            <div className="table-responsive" style={{ maxHeight: 'clamp(400px, 60vh, 600px)', overflowY: 'auto' }}>
                <table className="table table-hover mb-0">
                    <thead className="position-sticky top-0">
                        <tr>
                            <th className="border-0 fw-semibold d-none d-md-table-cell">Patient Info</th>
                            <th className="border-0 fw-semibold d-table-cell d-md-none">Patient</th>
                            <th className="border-0 fw-semibold d-none d-lg-table-cell">Clinic Details</th>
                            <th className="border-0 fw-semibold">Appointment</th>
                            <th className="border-0 fw-semibold">Status</th>
                            <th className="border-0 fw-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings && bookings.length > 0 ? bookings.map((booking) => (
                            <tr key={booking.id} className="align-middle">
                                {/* Patient Info */}
                                <td className="d-none d-md-table-cell">
                                    <div className="d-flex align-items-center gap-2 gap-md-3">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center" 
                                             style={{ width: 'clamp(35px, 6vw, 45px)', height: 'clamp(35px, 6vw, 45px)', backgroundColor: 'rgba(217, 167, 65, 0.1)' }}>
                                            <MdPerson size={20} style={{ color: '#D9A741' }} />
                                        </div>
                                        <div>
                                            <h6 className="mb-1 fw-semibold" style={{ fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>{booking?.patientName || 'Unknown Patient'}</h6>
                                            <div className="d-flex align-items-center gap-1 text-muted small">
                                                <MdEmail size={12} />
                                                <span style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}>{booking?.patientEmail || 'No email'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                
                                {/* Patient Info Mobile */}
                                <td className="d-table-cell d-md-none">
                                    <div>
                                        <h6 className="mb-1 fw-semibold" style={{ fontSize: '0.9rem' }}>{booking?.patientName || 'Unknown'}</h6>
                                        <small className="text-muted">{booking?.patientEmail || 'No email'}</small>
                                    </div>
                                </td>
                                
                                {/* Clinic Details */}
                                <td className="d-none d-lg-table-cell">
                                    <div>
                                        <h6 className="mb-1 fw-semibold" style={{ fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>{booking?.clinicName || '-'}</h6>
                                        <div className="d-flex align-items-center gap-1 text-muted small mb-1">
                                            <FaMapMarkerAlt size={10} />
                                            <span style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}>{booking?.clinicLocation || 'No location'}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-1 text-muted small">
                                            <FaPhone size={10} />
                                            <span style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}>{booking?.clinicPhone || 'No phone'}</span>
                                        </div>
                                    </div>
                                </td>
                                
                                {/* Appointment Details */}
                                <td>
                                    <div>
                                        <div className="d-flex align-items-center gap-1 mb-1 mb-md-2">
                                            <FaCalendarAlt size={12} style={{ color: '#D9A741' }} />
                                            <span className="fw-semibold" style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)' }}>{formatDate(booking?.date)}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-1 mb-1 mb-md-2">
                                            <FaClock size={12} style={{ color: '#17a2b8' }} />
                                            <span style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)' }}>{booking?.time || '-'}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-1 d-none d-sm-flex">
                                            <FaDollarSign size={12} style={{ color: '#28a745' }} />
                                            <span className="fw-semibold" style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)' }}>{booking?.price || '-'}</span>
                                        </div>
                                    </div>
                                </td>
                                
                                {/* Status */}
                                <td>
                                    <div className="d-flex flex-column gap-1 gap-md-2">
                                        {getStatusBadge(booking?.status)}
                                        <select 
                                            className="form-select form-select-sm d-none d-md-block" 
                                            value={booking?.status || 'pending'}
                                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                            disabled={updatingStatus === booking.id}
                                            style={{ fontSize: 'clamp(10px, 1.5vw, 12px)' }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="booked">Booked</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </td>
                                
                                {/* Actions */}
                                <td>
                                    <div className="d-flex gap-1 gap-md-2">
                                        <button 
                                            type="button" 
                                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                                            onClick={() => setSelectedBooking(booking)}
                                            data-bs-toggle="modal" 
                                            data-bs-target="#bookingDetailsModal"
                                            style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', padding: 'clamp(4px, 1vw, 8px) clamp(8px, 2vw, 12px)' }}
                                        >
                                            <FaEye size={12} />
                                            <span className="d-none d-lg-inline">View</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center py-5">
                                    <div className="text-muted">
                                        <MdPerson size={48} className="mb-3" style={{ opacity: 0.3 }} />
                                        <h6>No appointments found</h6>
                                        <p className="mb-0">Appointments will appear here when patients book with you.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Booking Details Modal */}
            <div className="modal fade" id="bookingDetailsModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Appointment Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            {selectedBooking && (
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <h6 className="fw-bold mb-3">Patient Information</h6>
                                        <div className="mb-2">
                                            <strong>Name:</strong> {selectedBooking.patientName || 'N/A'}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Email:</strong> {selectedBooking.patientEmail || 'N/A'}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Phone:</strong> {selectedBooking.patientPhone || 'N/A'}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold mb-3">Appointment Details</h6>
                                        <div className="mb-2">
                                            <strong>Date:</strong> {formatDate(selectedBooking.date)}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Time:</strong> {selectedBooking.time || 'N/A'}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Price:</strong> {selectedBooking.price || 'N/A'}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Status:</strong> {getStatusBadge(selectedBooking.status)}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <select 
                                className="form-select me-2" 
                                style={{ width: 'auto' }}
                                value={selectedBooking?.status || 'pending'}
                                onChange={(e) => handleStatusChange(selectedBooking?.id, e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="booked">Booked</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
