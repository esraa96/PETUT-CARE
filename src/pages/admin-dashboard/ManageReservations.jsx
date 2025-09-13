import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUser, FaUserMd, FaHospital, FaPhone, FaEnvelope, FaClock, FaEye } from 'react-icons/fa';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';

export default function ManageReservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const reservationsSnapshot = await getDocs(collection(db, 'bookings'));
            const reservationsData = [];

            for (const reservationDoc of reservationsSnapshot.docs) {
                const reservationData = { id: reservationDoc.id, ...reservationDoc.data() };
                
                // Fetch client details
                if (reservationData.userId) {
                    try {
                        const clientDoc = await getDoc(doc(db, 'users', reservationData.userId));
                        if (clientDoc.exists()) {
                            reservationData.clientDetails = clientDoc.data();
                        }
                    } catch (clientError) {
                        console.warn('Failed to fetch client details:', clientError);
                    }
                }

                // Fetch doctor details
                if (reservationData.doctorId) {
                    try {
                        const doctorDoc = await getDoc(doc(db, 'users', reservationData.doctorId));
                        if (doctorDoc.exists()) {
                            reservationData.doctorDetails = doctorDoc.data();
                        }
                    } catch (doctorError) {
                        console.warn('Failed to fetch doctor details:', doctorError);
                    }
                }

                reservationsData.push(reservationData);
            }

            setReservations(reservationsData);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            toast.error('Failed to fetch reservations: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (reservation) => {
        try {
            if (reservation?.day && reservation?.time) {
                return `${reservation.day} - ${reservation.time}`;
            }
            if (reservation?.date) {
                const date = reservation.date.toDate ? reservation.date.toDate() : new Date(reservation.date);
                return date.toLocaleDateString('en-US') + ' ' + date.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            }
            return 'Not specified';
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'booked': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const viewDetails = (reservation) => {
        setSelectedReservation(reservation);
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 dark:bg-gray-900">
                <BeatLoader color="#D4A574" size={15} />
            </div>
        );
    }

    return (
        <div className="p-6 dark:bg-gray-900 min-h-screen">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                    <FaCalendarAlt className="text-petut-brown-300" />
                    Manage Reservations
                </h1>
                <p className="text-gray-600 dark:text-gray-300">View and manage all appointment bookings in the system</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        All Reservations ({reservations.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Doctor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Date & Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {reservations.map((reservation) => (
                                <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaUser className="text-gray-400 dark:text-gray-500 mr-2" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {reservation.clientDetails?.fullName || reservation.userName || reservation.patientName || 'Not specified'}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {reservation.clientDetails?.email || reservation.customerEmail || 'Not specified'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaUserMd className="text-petut-brown-300 mr-2" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {reservation.doctorDetails?.fullName || reservation.doctorName || 'Not specified'}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {reservation.doctorDetails?.specialization || 'Not specified'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaClock className="text-gray-400 dark:text-gray-500 mr-2" />
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {formatDate(reservation)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                                            {reservation.status === 'booked' ? 'Booked' :
                                             reservation.status === 'confirmed' ? 'Confirmed' :
                                             reservation.status === 'pending' ? 'Pending' :
                                             reservation.status === 'cancelled' ? 'Cancelled' :
                                             reservation.status === 'completed' ? 'Completed' : reservation.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => viewDetails(reservation)}
                                            className="text-petut-brown-300 hover:text-petut-brown-400 dark:text-petut-brown-200 dark:hover:text-petut-brown-300 flex items-center gap-1"
                                        >
                                            <FaEye />
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {reservations.length === 0 && (
                    <div className="text-center py-12">
                        <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No reservations found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No bookings were found in the system</p>
                    </div>
                )}
            </div>

            {/* Modal for viewing reservation details */}
            {showModal && selectedReservation && (
                <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-700 w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Reservation Details</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Client Details */}
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                        <FaUser className="text-petut-brown-300" />
                                        Client Information
                                    </h4>
                                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                        <p><strong>Name:</strong> {selectedReservation.clientDetails?.fullName || selectedReservation.userName || selectedReservation.patientName || 'Not specified'}</p>
                                        <p className="flex items-center gap-2">
                                            <FaEnvelope className="text-gray-400 dark:text-gray-500" />
                                            {selectedReservation.clientDetails?.email || selectedReservation.customerEmail || 'Not specified'}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <FaPhone className="text-gray-400 dark:text-gray-500" />
                                            {selectedReservation.clientDetails?.phoneNumber || selectedReservation.customerPhone || 'Not specified'}
                                        </p>
                                    </div>
                                </div>

                                {/* Doctor Details */}
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                        <FaUserMd className="text-petut-brown-300" />
                                        Doctor Information
                                    </h4>
                                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                        <p><strong>Name:</strong> {selectedReservation.doctorDetails?.fullName || selectedReservation.doctorName || 'Not specified'}</p>
                                        <p><strong>Specialization:</strong> {selectedReservation.doctorDetails?.specialization || 'Not specified'}</p>
                                        <p className="flex items-center gap-2">
                                            <FaEnvelope className="text-gray-400 dark:text-gray-500" />
                                            {selectedReservation.doctorDetails?.email || 'Not specified'}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <FaPhone className="text-gray-400 dark:text-gray-500" />
                                            {selectedReservation.doctorDetails?.phoneNumber || 'Not specified'}
                                        </p>
                                    </div>
                                </div>

                                {/* Clinic Details */}
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                        <FaHospital className="text-petut-brown-300" />
                                        Clinic Information
                                    </h4>
                                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                        <p><strong>Clinic Name:</strong> {selectedReservation.doctorDetails?.clinicName || selectedReservation.clinicName || 'Not specified'}</p>
                                        <p><strong>Address:</strong> {selectedReservation.doctorDetails?.clinicAddress || selectedReservation.clinicLocation || 'Not specified'}</p>
                                        <p><strong>Clinic Phone:</strong> {selectedReservation.doctorDetails?.clinicPhone || selectedReservation.clinicPhone || 'Not specified'}</p>
                                    </div>
                                </div>

                                {/* Appointment Details */}
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                        <FaCalendarAlt className="text-petut-brown-300" />
                                        Appointment Details
                                    </h4>
                                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                        <p><strong>Date & Time:</strong> {formatDate(selectedReservation)}</p>
                                        <p><strong>Price:</strong> ${selectedReservation.price || 0}</p>
                                        <p><strong>Payment Method:</strong> {selectedReservation.paymentMethod || 'Not specified'}</p>
                                        <p><strong>Status:</strong> 
                                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedReservation.status)}`}>
                                                {selectedReservation.status === 'booked' ? 'Booked' :
                                                 selectedReservation.status === 'confirmed' ? 'Confirmed' :
                                                 selectedReservation.status === 'pending' ? 'Pending' :
                                                 selectedReservation.status === 'cancelled' ? 'Cancelled' :
                                                 selectedReservation.status === 'completed' ? 'Completed' : selectedReservation.status}
                                            </span>
                                        </p>
                                        {selectedReservation.notes && (
                                            <p><strong>Notes:</strong> {selectedReservation.notes}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-petut-brown-300 text-white px-4 py-2 rounded-lg hover:bg-petut-brown-400 dark:bg-petut-brown-400 dark:hover:bg-petut-brown-500 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}