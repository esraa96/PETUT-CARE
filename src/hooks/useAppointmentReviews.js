import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { scheduleReviewNotification } from '../services/reviewNotificationService';

// Hook to handle appointment completion and review scheduling
export const useAppointmentReviews = (currentUser) => {
    useEffect(() => {
        if (!currentUser) return;

        // Listen for completed appointments that need review notifications
        const appointmentsQuery = query(
            collection(db, 'appointments'),
            where('status', '==', 'completed'),
            where('reviewNotificationSent', '==', false)
        );

        const unsubscribe = onSnapshot(appointmentsQuery, (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                if (change.type === 'added' || change.type === 'modified') {
                    const appointment = { id: change.doc.id, ...change.doc.data() };
                    
                    // Check if appointment was completed recently (within last 3 hours)
                    const now = new Date();
                    const appointmentTime = appointment.appointmentDateTime?.toDate();
                    const timeDiff = now - appointmentTime;
                    const hoursAgo = timeDiff / (1000 * 60 * 60);

                    if (hoursAgo >= 1 && hoursAgo <= 3) {
                        // Schedule review notification
                        await scheduleReviewNotification(
                            appointment.id,
                            appointment.clientId,
                            appointment.doctorId,
                            appointmentTime
                        );

                        // Mark as notification sent
                        await updateDoc(doc(db, 'appointments', appointment.id), {
                            reviewNotificationSent: true
                        });
                    }
                }
            });
        });

        return () => unsubscribe();
    }, [currentUser]);
};

// Hook to get user notifications
export const useUserNotifications = (userId) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!userId) return;

        const notificationsQuery = query(
            collection(db, 'userNotifications'),
            where('userId', '==', userId),
            where('read', '==', false)
        );

        const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
            const notificationsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotifications(notificationsData);
        });

        return () => unsubscribe();
    }, [userId]);

    return notifications;
};