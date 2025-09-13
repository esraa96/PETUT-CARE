import { updateDoc, doc, query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';
import { scheduleReviewNotification, sendReviewNotification } from '../services/reviewNotificationService';

// Function to mark appointment as completed and schedule review notification
export const completeAppointment = async (appointmentId, appointmentData) => {
    try {
        // Update appointment status to completed
        await updateDoc(doc(db, 'appointments', appointmentId), {
            status: 'completed',
            completedAt: new Date(),
            reviewNotificationSent: false
        });

        // Schedule review notification for 2 hours later
        const appointmentTime = appointmentData.appointmentDateTime?.toDate() || new Date();
        await scheduleReviewNotification(
            appointmentId,
            appointmentData.clientId,
            appointmentData.doctorId,
            appointmentTime
        );

        console.log('Appointment completed and review notification scheduled');
        return true;
    } catch (error) {
        console.error('Error completing appointment:', error);
        throw error;
    }
};

// Function to check and send pending review notifications
export const processPendingReviewNotifications = async () => {
    try {
        const now = new Date();
        
        // This would typically be run by a background job/cron
        // For demo purposes, you can call this manually or set up a timer
        
        const notificationsQuery = query(
            collection(db, 'notifications'),
            where('type', '==', 'review_request'),
            where('sent', '==', false),
            where('scheduledFor', '<=', now)
        );

        const snapshot = await getDocs(notificationsQuery);
        
        for (const doc of snapshot.docs) {
            const notification = { id: doc.id, ...doc.data() };
            await sendReviewNotification(
                notification.id,
                notification.clientId,
                notification.doctorId
            );
        }
    } catch (error) {
        console.error('Error processing pending notifications:', error);
    }
};