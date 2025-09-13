import React, { useState } from 'react';
import { FaBell, FaStar } from 'react-icons/fa';
import { useUserNotifications } from '../hooks/useAppointmentReviews';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.js';
import RateDoctorModal from './RateDoctorModal';

export default function NotificationBell({ currentUser }) {
    const notifications = useUserNotifications(currentUser?.uid);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const markAsRead = async (notificationId) => {
        try {
            await updateDoc(doc(db, 'userNotifications', notificationId), {
                read: true,
                readAt: new Date()
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleReviewClick = async (notification) => {
        // Mark as read
        await markAsRead(notification.id);
        
        // Get doctor info and show rating modal
        // You'll need to fetch doctor data here
        setSelectedDoctor({ id: notification.doctorId });
        setSelectedAppointment({ id: notification.appointmentId });
        setShowRatingModal(true);
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
                <FaBell size={20} />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications.length}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No new notifications
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => {
                                        if (notification.type === 'review_request') {
                                            handleReviewClick(notification);
                                        }
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <FaStar className="text-yellow-400" size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 text-sm">
                                                {notification.title}
                                            </h4>
                                            <p className="text-gray-600 text-sm mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-2">
                                                {notification.createdAt?.toDate?.()?.toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Rating Modal */}
            <RateDoctorModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                doctor={selectedDoctor}
                appointment={selectedAppointment}
                currentUser={currentUser}
            />
        </div>
    );
}