// اختبار إصلاح مشكلة حجز المواعيد
// هذا الملف للاختبار فقط - يمكن حذفه بعد التأكد من عمل الإصلاح

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./src/firebase.js";

// دالة لاختبار قراءة المواعيد المحجوزة
export const testBookingRead = async (clinicId) => {
  try {
    console.log("Testing booking read for clinic:", clinicId);
    
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("clinicId", "==", clinicId));
    const snapshot = await getDocs(q);
    
    console.log("Found bookings:", snapshot.size);
    
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      console.log("Booking data:", {
        id: doc.id,
        day: data.day,
        time: data.time,
        date: data.date,
        clinicId: data.clinicId,
        status: data.status
      });
    });
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error testing booking read:", error);
    return [];
  }
};

// دالة لاختبار التحقق من توفر موعد معين
export const testSlotAvailability = async (clinicId, selectedDay, selectedTime) => {
  try {
    console.log("Testing slot availability:", { clinicId, selectedDay, selectedTime });
    
    const bookingsRef = collection(db, "bookings");
    const q = query(
      bookingsRef,
      where("clinicId", "==", clinicId),
      where("day", "==", selectedDay),
      where("time", "==", selectedTime)
    );
    
    const snapshot = await getDocs(q);
    const isAvailable = snapshot.empty;
    
    console.log("Slot available:", isAvailable);
    console.log("Conflicting bookings:", snapshot.size);
    
    if (!isAvailable) {
      snapshot.docs.forEach((doc) => {
        console.log("Conflicting booking:", doc.data());
      });
    }
    
    return isAvailable;
  } catch (error) {
    console.error("Error testing slot availability:", error);
    return false;
  }
};

// استخدام الدوال للاختبار
// يمكن استدعاء هذه الدوال من console المتصفح:
// import { testBookingRead, testSlotAvailability } from './test-booking-fix.js';
// testBookingRead('clinic-id-here');
// testSlotAvailability('clinic-id-here', 'Mon Dec 25 2023', '10:00');