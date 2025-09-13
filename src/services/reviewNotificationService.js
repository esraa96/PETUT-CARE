import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";

// Function to schedule review notification after appointment
export const scheduleReviewNotification = async (appointmentId, clientId, doctorId, appointmentDateTime) => {
    try {
        // Calculate notification time (2 hours after appointment)
        const notificationTime = new Date(appointmentDateTime.getTime() + (2 * 60 * 60 * 1000));
        
        const notificationData = {
            type: 'review_request',
            clientId: clientId,
            doctorId: doctorId,
            appointmentId: appointmentId,
            scheduledFor: notificationTime,
            sent: false,
            createdAt: new Date(),
            title: 'Rate Your Recent Appointment',
            message: 'How was your experience? Please rate your recent appointment with the doctor.',
        };

        await addDoc(collection(db, "notifications"), notificationData);
        console.log("Review notification scheduled successfully");
    } catch (error) {
        console.error("Error scheduling review notification:", error);
    }
};

// Function to send review notification (to be called by a scheduled job)
export const sendReviewNotification = async (notificationId, clientId, doctorId) => {
    try {
        // Get doctor and client details
        const doctorDoc = await getDoc(doc(db, "users", doctorId));
        const clientDoc = await getDoc(doc(db, "users", clientId));
        
        if (!doctorDoc.exists() || !clientDoc.exists()) {
            throw new Error("Doctor or client not found");
        }

        const doctorData = doctorDoc.data();
        const clientData = clientDoc.data();

        // Create in-app notification
        const inAppNotification = {
            userId: clientId,
            type: 'review_request',
            title: 'Rate Your Recent Appointment',
            message: `Please rate your recent appointment with Dr. ${doctorData.fullName || doctorData.name}`,
            doctorId: doctorId,
            read: false,
            createdAt: new Date(),
            actionUrl: `/rate-doctor/${doctorId}`
        };

        await addDoc(collection(db, "userNotifications"), inAppNotification);

        // Mark notification as sent
        await updateDoc(doc(db, "notifications", notificationId), {
            sent: true,
            sentAt: new Date()
        });

        console.log("Review notification sent successfully");
    } catch (error) {
        console.error("Error sending review notification:", error);
    }
};

// Function to submit a review
export const submitReview = async (reviewData) => {
    try {
        const review = {
            doctorId: reviewData.doctorId,
            clientId: reviewData.clientId,
            appointmentId: reviewData.appointmentId,
            rating: reviewData.rating,
            comment: reviewData.comment,
            patientName: reviewData.patientName,
            createdAt: new Date(),
            approved: true // Auto-approve for now, can add moderation later
        };

        const docRef = await addDoc(collection(db, "reviews"), review);
        console.log("Review submitted successfully with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error submitting review:", error);
        throw error;
    }
};