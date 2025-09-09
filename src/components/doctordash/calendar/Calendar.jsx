import React, { Fragment, useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './calendar.css'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase.js';
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';
import logo from '../../../assets/petut.png';

export default function Calendar({ doctorId }) {

    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    //get booking data from firebase for specific doctor
    useEffect(() => {
        const fetchDoctorBookings = async () => {
            if (!doctorId) return;
            
            try {
                const bookingsQuery = query(
                    collection(db, "bookings"),
                    where("doctorId", "==", doctorId)
                );
                const querySnapshot = await getDocs(bookingsQuery);
                const bookingsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setBookings(bookingsData);
            } catch (error) {
                toast.error("Failed to fetch bookings: " + error.message, { autoClose: 3000 });
            } finally {
                setLoading(false);
            }
        }
        fetchDoctorBookings();

    }, [doctorId]);

    const handleDateClick = (arg) => {
        setSelectedDate(arg.dateStr);
        setShowModal(true);
    };

    const calendarEvents = bookings.map(book => {
        let formattedDate = "";
        if (book.date?.toDate) {
            formattedDate = book.date.toDate().toISOString().split("T")[0];
        }
        else if (typeof book.date === 'string') {
            formattedDate = new Date(book.date).toISOString().split("T")[0];
        }

        // Color code based on status
        let backgroundColor = '#D9A741'; // default
        let borderColor = '#D9A741';
        
        switch (book.status) {
            case 'completed':
                backgroundColor = '#28a745';
                borderColor = '#28a745';
                break;
            case 'cancelled':
                backgroundColor = '#dc3545';
                borderColor = '#dc3545';
                break;
            case 'pending':
                backgroundColor = '#ffc107';
                borderColor = '#ffc107';
                break;
            default:
                backgroundColor = '#17a2b8';
                borderColor = '#17a2b8';
        }

        return {
            id: book.id,
            title: `${book.patientName || 'Patient'} - ${book.time || ''}`,
            date: formattedDate,
            backgroundColor,
            borderColor,
            extendedProps: {
                status: book.status,
                patientName: book.patientName,
                clinicName: book.clinicName,
                time: book.time,
                phone: book.clinicPhone
            }
        };
    });
    const selectedDayBookings = bookings.filter(book => {
    const bookDate = book.date?.toDate ? book.date.toDate().toISOString().split("T")[0] : new Date(book.date).toISOString().split("T")[0];
    return bookDate === selectedDate;

    });


    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#28a745';
            case 'cancelled': return '#dc3545';
            case 'pending': return '#ffc107';
            default: return '#17a2b8';
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'completed': return 'bg-success';
            case 'cancelled': return 'bg-danger';
            case 'pending': return 'bg-warning text-dark';
            default: return 'bg-info';
        }
    };

    return (
        <Fragment>

            <div className="container my-4">
                {loading ? (
                    <h3 className='text-center mt-5'><BeatLoader color="#D9A741" /></h3>) : (
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            right: 'prev today next',
                            left: 'title',
                            // left: 'dayGridMonth,dayGridWeek'
                        }}
                        dateClick={handleDateClick}
                        events={calendarEvents}
                        height={530}
                        width="100%"
                    />
                )
                }
            </div>

            {showModal && (
                <>
                    <div className="modal modal-lg large show fade d-block" tabIndex={-1} role="dialog" style={{ marginTop: '150px' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header d-flex align-items-center justify-content-between py-0 pe-0">
                                    <h5 className="modal-title">Day data: {selectedDate}</h5>
                                    <img src={logo} width="90" height="90" alt="logo" />
                                </div>

                                <div className="modal-body">
                                    {selectedDayBookings.length > 0 ? (
                                        <div className="row g-3">
                                            {selectedDayBookings.map((item, index) => (
                                                <div key={index} className="col-12">
                                                    <div className="card border-start border-4" style={{ borderColor: getStatusColor(item.status) }}>
                                                        <div className="card-body p-3">
                                                            <div className="d-flex justify-content-between align-items-start">
                                                                <div>
                                                                    <h6 className="card-title mb-1">{item.patientName || 'Unknown Patient'}</h6>
                                                                    <p className="card-text mb-1">
                                                                        <strong>Time:</strong> {item.time || 'Not specified'}
                                                                    </p>
                                                                    <p className="card-text mb-1">
                                                                        <strong>Clinic:</strong> {item.clinicName || 'Not specified'}
                                                                    </p>
                                                                    <p className="card-text mb-0">
                                                                        <strong>Phone:</strong> {item.clinicPhone || 'Not specified'}
                                                                    </p>
                                                                </div>
                                                                <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                                                                    {item.status || 'pending'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-muted">No appointments scheduled for this day.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}



        </Fragment>
    )
}
