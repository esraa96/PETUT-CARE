import React, { Fragment, useState, useEffect } from 'react'
import { BiSearchAlt2 } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { FaEye, FaStar } from "react-icons/fa";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase.js";
import { toast } from "react-toastify";
import DoctorReviewsModal from '../../components/admindash/DoctorReviewsModal';

export default function Reviews() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctorsWithReviews, setDoctorsWithReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDoctorsWithReviews();
    }, []);

    const fetchDoctorsWithReviews = async () => {
        setLoading(true);
        try {
            // Get all doctors
            const doctorsQuery = query(collection(db, "users"), where("role", "==", "doctor"));
            const doctorsSnapshot = await getDocs(doctorsQuery);
            
            // Get all reviews
            const reviewsSnapshot = await getDocs(collection(db, "reviews"));
            const reviewsData = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Calculate reviews for each doctor
            const doctorsData = doctorsSnapshot.docs.map(doc => {
                const doctorData = { id: doc.id, ...doc.data() };
                const doctorReviews = reviewsData.filter(review => review.doctorId === doc.id);
                
                const averageRating = doctorReviews.length > 0 
                    ? doctorReviews.reduce((sum, review) => sum + review.rating, 0) / doctorReviews.length 
                    : 0;
                
                return {
                    ...doctorData,
                    reviewCount: doctorReviews.length,
                    averageRating: Math.round(averageRating * 10) / 10
                };
            });
            
            setDoctorsWithReviews(doctorsData);
        } catch (error) {
            toast.error("Failed to fetch reviews: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-6 dark:bg-gray-900 min-h-screen'>
            <div className='mb-6'>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Doctor Reviews</h1>
                <p className='text-gray-600 dark:text-gray-300'>Manage and monitor doctor reviews and ratings</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="relative w-full sm:w-96">
                    <input
                        className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-petut-brown-300 focus:border-transparent outline-none transition-all"
                        type="text"
                        placeholder="Search by Doctor Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <BiSearchAlt2
                        size={20}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    />
                </div>
                <select 
                    className="w-full sm:w-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-petut-brown-300 focus:border-transparent outline-none transition-all"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="all">All Reviews</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                </select>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Doctor</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Specialization</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gender</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reviews</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-petut-brown-300"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : doctorsWithReviews.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No doctors found
                                    </td>
                                </tr>
                            ) : (
                                doctorsWithReviews
                                    .filter(doctor => 
                                        doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        doctor.name?.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((doctor) => (
                                        <tr key={doctor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {doctor.fullName || doctor.name || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                                    {doctor.specialization || 'General Practice'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                                    doctor.gender === 'male' 
                                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                                                        : 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300'
                                                }`}>
                                                    {doctor.gender || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">{doctor.reviewCount} reviews</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <FaStar className="text-yellow-400" size={16} />
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {doctor.averageRating > 0 ? doctor.averageRating : 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        className="text-petut-brown-300 hover:text-petut-brown-400 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                                                        title="View Reviews"
                                                        onClick={() => {
                                                            setSelectedDoctor(doctor);
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        <FaEye size={16} />
                                                    </button>
                                                    <button 
                                                        className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                                                        title="Delete Reviews"
                                                    >
                                                        <MdDelete size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <DoctorReviewsModal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                selectedDoctor={selectedDoctor}
            />
        </div>
    )
}
