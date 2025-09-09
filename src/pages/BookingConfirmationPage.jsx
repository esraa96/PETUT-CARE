import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {collection,addDoc,serverTimestamp,doc,updateDoc,getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const paymentMethods = [
  { key: "card", label: "Visa / Mastercard", icon: "credit_card" },
  { key: "cash", label: "Cash on arrival", icon: "payments" },
];

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { clinic, selectedDay, selectedTime, selectedDate } = state || {};
  const { currentUser } = useAuth();

  const [selectedPayment, setSelectedPayment] = useState("card");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  if (!clinic || !selectedDay || !selectedTime) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 font-bold">
          الموعد غير صحيح أو مفقود. يرجى العودة وإعادة المحاولة.
        </div>
      </div>
    );
  }

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const userId = currentUser?.uid || "";
      const userName = userData?.fullName || userData?.firstName || currentUser?.displayName || currentUser?.email || "Unknown Customer";
      const customerEmail = userData?.email || currentUser?.email || "";
      const customerPhone = userData?.phone || userData?.phoneNumber || currentUser?.phoneNumber || "";

      const bookingData = {
        clinicId: clinic.id,
        clinicName: clinic.clinicName || clinic.name || "Unknown Clinic",
        clinicPhone: clinic.phone ?? clinic.phoneNumber ?? "Not Provided",
        clinicLocation:
          clinic.clinicAddress || clinic.location || "Not specified",
        day: selectedDay, // التاريخ كنص
        time: selectedTime, // الوقت كنص
        date: selectedDate, // كائن التاريخ الكامل
        price: clinic.price ?? 0,
        paymentMethod:
          selectedPayment === "card" ? "Visa / Mastercard" : "Cash on arrival",
        status: "booked",
        userId,
        userName,
        patientName: userName,
        customerPhone,
        customerEmail,
        doctorId: clinic.doctorId || clinic.userId || clinic.id,
        doctorName: clinic.doctorName || "Unknown Doctor",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "bookings"), bookingData);

      // إضافة booking ID
      await updateDoc(doc(db, "bookings", docRef.id), {
        bookingId: docRef.id,
        updatedAt: serverTimestamp(), // تحديث timestamp عند إضافة ال ID
      });

      navigate("/booking-loading", {
        state: {
          clinic,
          selectedDay,
          selectedTime,
          selectedPayment: bookingData.paymentMethod,
        },
      });
    } catch (e) {
      console.error("Booking error:", e);
      setLoading(false);
      alert("فشل في حجز الموعد: " + e.message + ". يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="min-h-screen bg-secondary-light dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="  top-0 z-10 mt-11">
        <div className="max-w-2xl mx-auto px-1 py-1 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <span className="material-icons text-xl text-gray-600 dark:text-gray-300">
              arrow_back
            </span>
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white text-left flex-1 ">
            Confirm Appointment
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          {/* Clinic Info */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-secondary-light dark:bg-gray-700 overflow-hidden flex-shrink-0">
                {clinic.profileImage ? (
                  <img
                    src={clinic.profileImage}
                    alt={clinic.clinicName || clinic.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-icons text-6xl text-primary w-full h-full flex items-center justify-center">
                    local_hospital
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-xl text-gray-800 dark:text-white mb-1 truncate">
                  {clinic.clinicName || clinic.name}
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">
                  {clinic.clinicAddress || clinic.location}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="material-icons text-primary text-base">
                    star
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {clinic.rating ? `${clinic.rating}/5` : "No rating"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Time */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 bg-primary/5 dark:bg-primary/10 p-4 rounded-xl">
              <span className="material-icons text-primary text-2xl">
                event_available
              </span>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Appointment Time
                </div>
                <div className="font-semibold text-gray-800 dark:text-white">
                  {selectedDay}, {selectedTime}
                </div>
              </div>
            </div>
          </div>

          {/* Billing Details */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
              Billing Details
            </h3>
            <div className="space-y-3">
              <InfoRow label="Consultation Fee" value={`${clinic.price} $`} />
              <InfoRow label="Service Fee & Tax" value="FREE" />
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                <InfoRow
                  label="Total Amount"
                  value={`${clinic.price} $`}
                  isBold
                  textSize="text-lg"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Payment Method
              </h3>
              <button
                className="text-primary font-medium hover:text-primary/90"
                onClick={() => setShowPaymentModal(true)}
              >
                Change
              </button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-3 text-gray-800 dark:text-white">
                <span className="material-icons text-primary">
                  {selectedPayment === "card" ? "credit_card" : "payments"}
                </span>
                {paymentMethods.find((m) => m.key === selectedPayment).label}
              </div>
            </div>
          </div>
          {/* Fixed Bottom Bar */}
          <div className="bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Amount
                </div>
                <div className="text-xl font-bold text-gray-800 dark:text-white">
                  {clinic.price} $
                </div>
              </div>
              <button
                className="min-w-[160px] bg-primary text-white font-medium px-6 py-3 rounded-xl hover: bg-primary_app/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                onClick={handleConfirmBooking}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Confirm & Pay"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end z-50">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl mx-auto rounded-t-2xl">
            <div className="p-6">
              <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-6">
                Select Payment Method
              </h3>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <label
                    key={method.key}
                    className={`flex items-center p-4 rounded-xl cursor-pointer border-2 transition-colors ${
                      selectedPayment === method.key
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      checked={selectedPayment === method.key}
                      onChange={() => {
                        setSelectedPayment(method.key);
                        setShowPaymentModal(false);
                      }}
                    />
                    <span className="material-icons text-primary mr-3">
                      {method.icon}
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
              <button
                className="w-full mt-6 py-3 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function InfoRow({ label, value, isBold }) {
  return (
    <div className="flex justify-between py-1">
      <span className="dark:text-white">{label}</span>
      <span className={`${isBold ? "font-bold" : ""} dark:text-white`}>
        {value}
      </span>
    </div>
  );
}

export default BookingConfirmationPage;
