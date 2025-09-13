import React, { Fragment, useState, useEffect } from 'react'
import { FaTimes, FaStar } from 'react-icons/fa'
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase.js";
import { toast } from "react-toastify";
import logo from '../../assets/petut.png'

export default function DoctorReviewsModal({ isOpen, onClose, doctorName, selectedDoctor }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && selectedDoctor?.id) {
            fetchDoctorReviews();
        }
    }, [isOpen, selectedDoctor]);

    const fetchDoctorReviews = async () => {
        setLoading(true);
        try {
            const reviewsQuery = query(
                collection(db, "reviews"), 
                where("doctorId", "==", selectedDoctor.id)
            );
            const reviewsSnapshot = await getDocs(reviewsQuery);
            const reviewsData = reviewsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'
            }));
            setReviews(reviewsData);
        } catch (error) {
            toast.error("Failed to fetch reviews: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Fragment>
            <div 
                className="fixed inset-0 bg-black dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div 
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Reviews for {selectedDoctor?.fullName || selectedDoctor?.name || doctorName}
                        </h2>
                        <div className="flex items-center gap-4">
                            <img src={logo} width={60} height={60} alt="Petut Logo" className="rounded-full" />
                            <button 
                                onClick={onClose}
                                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-petut-brown-300"></div>
                            </div>
                        ) : reviews.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    {review.patientName || review.clientName || 'Anonymous'}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar 
                                                        key={i} 
                                                        size={16} 
                                                        className={i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} 
                                                    />
                                                ))}
                                                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {review.rating}/5
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">{review.comment || review.review || 'No comment provided'}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400">No reviews available for this doctor.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
                        <button 
                            onClick={onClose}
                            className="px-6 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
