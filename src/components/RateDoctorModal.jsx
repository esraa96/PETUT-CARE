import React, { useState } from 'react';
import { FaTimes, FaStar } from 'react-icons/fa';
import { submitReview } from '../services/reviewNotificationService';
import { toast } from 'react-toastify';

export default function RateDoctorModal({ isOpen, onClose, doctor, appointment, currentUser }) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setSubmitting(true);
        try {
            await submitReview({
                doctorId: doctor.id,
                clientId: currentUser.uid,
                appointmentId: appointment?.id,
                rating: rating,
                comment: comment,
                patientName: currentUser.displayName || currentUser.fullName || 'Anonymous'
            });

            toast.success('Thank you for your review!');
            onClose();
            setRating(0);
            setComment('');
        } catch (error) {
            toast.error('Failed to submit review: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Rate Your Experience</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="text-center mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            How was your appointment with Dr. {doctor?.fullName || doctor?.name}?
                        </h3>
                        <p className="text-gray-600">Your feedback helps us improve our service</p>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex justify-center mb-6">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-colors"
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <FaStar 
                                        size={32}
                                        className={
                                            star <= (hoveredRating || rating)
                                                ? 'text-yellow-400' 
                                                : 'text-gray-300'
                                        }
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Comments (Optional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-transparent outline-none resize-none"
                            placeholder="Tell us about your experience..."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || rating === 0}
                            className="flex-1 px-4 py-2 bg-petut-brown-300 text-white rounded-lg hover:bg-petut-brown-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}