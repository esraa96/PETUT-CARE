import { Fragment, useState } from 'react'
import { FaEdit, FaTrashAlt, FaSearch, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { deleteDoc, doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';

export default function DoctorsTable({ doctors, setDoctors, fetchDoctors, loading }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showConfirm, setShowConfirm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const handleDeleteDoctor = async (doctorId) => {
        try {
            await deleteDoc(doc(db, 'users', doctorId));
            setDoctors(doctors => doctors.filter(doctor => doctor.id !== doctorId));
            await fetchDoctors();
            toast.success('Doctor deleted successfully', { autoClose: 3000 });
        } catch (err) {
            toast.error("Failed to delete doctor: " + err.message, { autoClose: 3000 });
        } finally {
            setShowConfirm(false);
        }
    }

    const handleApproveDoctor = async (doctorId) => {
        try {
            const doctor = doctors.find(d => d.id === doctorId);
            
            await updateDoc(doc(db, 'users', doctorId), {
                status: 'approved'
            });
            
            // Create notification for doctor
            await setDoc(doc(db, "notifications", `approval_${doctorId}_${Date.now()}`), {
                type: 'doctor_approved',
                doctorId: doctorId,
                message: `Congratulations! Your doctor registration has been approved. You can now start accepting appointments.`,
                read: false,
                createdAt: serverTimestamp(),
                targetUserId: doctorId
            });
            
            await fetchDoctors();
            toast.success(
                <div>
                    Doctor approved successfully! 
                    <a href="/admin-dashboard/manage-clinics" className="underline ml-2">
                        Add clinic for this doctor
                    </a>
                </div>, 
                { autoClose: 5000 }
            );
        } catch (err) {
            toast.error("Failed to approve doctor: " + err.message, { autoClose: 3000 });
        }
    }

    const handleRejectDoctor = async (doctorId) => {
        try {
            const doctor = doctors.find(d => d.id === doctorId);
            
            await updateDoc(doc(db, 'users', doctorId), {
                status: 'rejected'
            });
            
            // Create notification for doctor
            await setDoc(doc(db, "notifications", `rejection_${doctorId}_${Date.now()}`), {
                type: 'doctor_rejected',
                doctorId: doctorId,
                message: `Your doctor registration has been rejected. Please contact support for more information.`,
                read: false,
                createdAt: serverTimestamp(),
                targetUserId: doctorId
            });
            
            await fetchDoctors();
            toast.success('Doctor rejected', { autoClose: 3000 });
        } catch (err) {
            toast.error("Failed to reject doctor: " + err.message, { autoClose: 3000 });
        }
    }

    const filteredDoctors = doctors.filter(doctor => {
        const nameMatch = (doctor.fullName || doctor.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = (doctor.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const genderMatch = genderFilter === 'all' || doctor.gender === genderFilter;
        const statusMatch = statusFilter === 'all' || doctor.status === statusFilter;
        return (nameMatch || emailMatch) && statusMatch && genderMatch;
    }).sort((a, b) => {
        // Sort pending doctors first
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (b.status === 'pending' && a.status !== 'pending') return 1;
        return 0;
    });

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                    <input
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300"
                        type="text"
                        placeholder="Search by name or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
                <select 
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300" 
                    value={genderFilter} 
                    onChange={(e) => setGenderFilter(e.target.value)}
                >
                    <option value="all">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <select 
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300" 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {loading ? (
                <div className='text-center py-8'>
                    <BeatLoader color='#D9A741' />
                </div>
            ) : filteredDoctors.length === 0 ? (
                <div className='text-center py-8 text-gray-500'>
                    {doctors.length === 0 ? 'No doctors found' : 'No matching doctors found'}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDoctors.map((doctor) => (
                                <tr key={doctor.id} className={`hover:bg-gray-50 ${
                                    doctor.status === 'pending' ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                                }`}>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex items-center">
                                            {doctor.fullName || doctor.doctorName || 'N/A'}
                                            {doctor.status === 'pending' && (
                                                <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {doctor.email || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                                            doctor.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
                                        }`}>
                                            {doctor.gender || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                                            doctor.status === 'approved' ? 'bg-green-500' : 
                                            doctor.status === 'pending' ? 'bg-yellow-500' : 
                                            doctor.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
                                        }`}>
                                            {doctor.status || 'pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                className="text-blue-600 hover:text-blue-800" 
                                                onClick={() => {
                                                    setSelectedDoctor(doctor);
                                                    setShowViewModal(true);
                                                }}
                                                title="View Details"
                                            >
                                                <FaEye size={16} />
                                            </button>
                                            {doctor.status === 'pending' && (
                                                <>
                                                    <button 
                                                        className="text-green-600 hover:text-green-800" 
                                                        onClick={() => handleApproveDoctor(doctor.id)}
                                                        title="Approve Doctor"
                                                    >
                                                        <FaCheck size={16} />
                                                    </button>
                                                    <button 
                                                        className="text-red-600 hover:text-red-800" 
                                                        onClick={() => handleRejectDoctor(doctor.id)}
                                                        title="Reject Doctor"
                                                    >
                                                        <FaTimes size={16} />
                                                    </button>
                                                </>
                                            )}
                                            <button 
                                                className="text-petut-brown-300 hover:text-petut-brown-500" 
                                                onClick={() => {
                                                    setSelectedDoctor(doctor);
                                                    setShowEditModal(true);
                                                }}
                                                title="Edit Doctor"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button 
                                                className="text-red-600 hover:text-red-800" 
                                                onClick={() => {
                                                    setSelectedDoctor(doctor);
                                                    setShowConfirm(true);
                                                }}
                                                title="Delete Doctor"
                                            >
                                                <FaTrashAlt size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this doctor?</p>
                        <div className="flex justify-end space-x-3">
                            <button 
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                onClick={() => handleDeleteDoctor(selectedDoctor.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Doctor Modal */}
            {showViewModal && selectedDoctor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Details</h3>
                        <div className="space-y-3">
                            <p><strong>Name:</strong> {selectedDoctor.fullName || selectedDoctor.doctorName}</p>
                            <p><strong>Email:</strong> {selectedDoctor.email}</p>
                            <p><strong>Phone:</strong> {selectedDoctor.phone}</p>
                            <p><strong>Gender:</strong> {selectedDoctor.gender}</p>
                            <p><strong>Status:</strong> 
                                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium text-white ${
                                    selectedDoctor.status === 'approved' ? 'bg-green-500' : 
                                    selectedDoctor.status === 'pending' ? 'bg-yellow-500' : 
                                    selectedDoctor.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
                                }`}>
                                    {selectedDoctor.status || 'pending'}
                                </span>
                            </p>
                            {selectedDoctor.doctorDetails && (
                                <>
                                    <p><strong>Experience:</strong> {selectedDoctor.doctorDetails.experience} years</p>
                                    <p><strong>Description:</strong> {selectedDoctor.doctorDetails.description}</p>
                                    {selectedDoctor.doctorDetails.cardFrontImage && (
                                        <div>
                                            <strong>Syndicate Card:</strong>
                                            <div className="mt-2 grid grid-cols-2 gap-2">
                                                <img src={selectedDoctor.doctorDetails.cardFrontImage} alt="Card Front" className="w-full h-20 object-cover rounded" />
                                                <img src={selectedDoctor.doctorDetails.cardBackImage} alt="Card Back" className="w-full h-20 object-cover rounded" />
                                            </div>
                                        </div>
                                    )}
                                    {selectedDoctor.doctorDetails.idImage && (
                                        <div>
                                            <strong>ID Image:</strong>
                                            <img src={selectedDoctor.doctorDetails.idImage} alt="ID" className="mt-2 w-full h-20 object-cover rounded" />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="flex justify-end mt-6">
                            <button 
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                onClick={() => setShowViewModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}