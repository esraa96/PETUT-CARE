import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { datePickerStyles } from "../styles/datePickerStyles";

const ClinicDetailsScreen = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const clinic = state?.clinic;
  const [doctorData, setDoctorData] = useState(null);
  
  // دالة مساعدة لتحويل الوقت إلى دقائق
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!clinic?.doctorId) return;
      try {
        const docRef = doc(db, "users", clinic.doctorId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDoctorData(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching doctor data:", err);
      }
    };
    fetchDoctorData();
  }, [clinic.uid, clinic.id]);

  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!clinic?.id) return;
      try {
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("clinicId", "==", clinic.id));
        const snapshot = await getDocs(q);
        const slots = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            date: data.day || data.date, // استخدام day أولاً ثم date كبديل
            day: data.day,
            time: data.time,
            datetime: data.day && data.time ? new Date(`${data.day} ${data.time}`) : null,
          };
        });
        setBookedSlots(slots.filter(slot => slot.datetime)); // فلترة المواعيد الصحيحة فقط
      } catch (err) {
        console.error("Error fetching booked slots:", err);
      }
    };
    fetchBookedSlots();
  }, [clinic.id]);



  const isSlotBooked = (date) => {
    if (!date) return false;
    const dateStr = date.toDateString();
    const timeStr = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return bookedSlots.some(
      (slot) => (slot.date === dateStr || slot.day === dateStr) && slot.time === timeStr
    );
  };

  const filterAvailableTimes = (date) => {
    if (date < new Date()) return false;
    
    // التحقق من وجود ساعات العمل
    if (!clinic?.workingHours || clinic.workingHours.length === 0) {
      return !isSlotBooked(date);
    }
    
    // التحقق من أن اليوم ضمن أيام العمل
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const todayWorkingHours = clinic.workingHours.find(wh => wh.day === dayName);
    
    if (!todayWorkingHours) return false;
    
    // التحقق من أن الوقت ضمن ساعات العمل
    const selectedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const selectedTimeMinutes = timeToMinutes(selectedTime);
    const openTimeMinutes = timeToMinutes(todayWorkingHours.openTime);
    const closeTimeMinutes = timeToMinutes(todayWorkingHours.closeTime);
    
    if (selectedTimeMinutes < openTimeMinutes || selectedTimeMinutes >= closeTimeMinutes) {
      return false;
    }
    
    return !isSlotBooked(date);
  };

  const handleBook = async () => {
    if (!selectedDateTime) {
      setError("يرجى اختيار التاريخ والوقت.");
      return;
    }
    
    // التحقق من أن الموعد في المستقبل
    if (selectedDateTime < new Date()) {
      setError("لا يمكن حجز موعد في الماضي. يرجى اختيار وقت مستقبلي.");
      return;
    }
    
    // التحقق المبسط من المواعيد المحجوزة
    const selectedDay = selectedDateTime.toDateString();
    const selectedTime = selectedDateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    
    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(
        bookingsRef,
        where("clinicId", "==", clinic.id),
        where("day", "==", selectedDay),
        where("time", "==", selectedTime)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        setError("هذا الموعد محجوز بالفعل. يرجى اختيار وقت آخر.");
        return;
      }
    } catch (e) {
      console.error("Error checking booking:", e);
    }
    
    navigate("/booking-confirmation", {
      state: {
        clinic,
        selectedDay,
        selectedTime,
        selectedDate: selectedDateTime,
      },
    });
  };

  let displayAddress = "Unknown Address";
  if (clinic.address && typeof clinic.address === "string") {
    displayAddress = clinic.address;
  } else if (
    clinic.address &&
    typeof clinic.address === "object" &&
    clinic.address.city &&
    clinic.address.governorate
  ) {
    displayAddress = `${clinic.address.city}, ${clinic.address.governorate}`;
  } else if (clinic.clinicAddress) {
    displayAddress = clinic.clinicAddress;
  } else if (clinic.location) {
    displayAddress = clinic.location;
  }

  if (!clinic) {
    return (
      <div className="p-8 text-center text-neutral">No clinic data found.</div>
    );
  }

  const rating = clinic.rating || 0;
  const reviews = clinic.reviews || [
    {
      name: "Ahmed M.",
      text: "Very professional doctor, listened carefully and explained everything.",
    },
    {
      name: "Sara A.",
      text: "The clinic was clean and the staff was helpful.",
    },
  ];

  return (
    <div className="min-h-screen bg-secondary-light dark:bg-gray-900 pb-8">
      <style>{datePickerStyles}</style>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 mt-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span className="material-icons text-2xl text-gray-600 dark:text-gray-300">
              arrow_back
            </span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {clinic.clinicName || clinic.doctorName}
          </h1>
        </div>

        {/* Connected White Background Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          {/* Doctor Profile Card */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-secondary-light dark:bg-gray-700 flex-shrink-0">
                {clinic.profileImage ? (
                  <img
                    src={clinic.profileImage}
                    alt="Doctor"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-icons text-6xl text-primary w-full h-full flex items-center justify-center">
                    person
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-xl text-gray-800 dark:text-white mb-2 truncate">
                  {clinic.clinicName || clinic.doctorName}
                </h2>

                <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
                  <div className="flex items-center gap-1">
                    <span className="material-icons text-primary text-base">
                      star
                    </span>
                    <span>{rating.toFixed(1)}</span>
                  </div>

                  {(clinic.phone || clinic.phoneNumber) && (
                    <div className="flex items-center gap-1">
                      <span className="material-icons text-primary text-base">
                        phone
                      </span>
                      <span>{clinic.phone || clinic.phoneNumber}</span>
                    </div>
                  )}

                  {(doctorData?.doctorDetails?.experience ||
                    clinic.experience) && (
                    <div className="flex items-center gap-1">
                      <span className="material-icons text-primary text-base">
                        work_history
                      </span>
                      <span>
                        Experience:
                        {doctorData?.doctorDetails?.experience ||
                          clinic.experience}{" "}
                        years
                      </span>
                    </div>
                  )}
                </div>

                {/* Clinic Info */}
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-primary text-base">
                      location_on
                    </span>
                    <span className="truncate">{displayAddress}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="material-icons text-primary text-base">
                      payments
                    </span>
                    <span>
                      {clinic.price ? `${clinic.price} EGP` : "Price not set"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Picker */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="material-icons text-primary">event</span>
              Choose Appointment Date & Time
            </h3>

            <DatePicker
              selected={selectedDateTime}
              onChange={(date) => setSelectedDateTime(date)}
              minDate={new Date()}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              dateFormat="MMMM d, yyyy h:mm aa"
              filterTime={filterAvailableTimes}
              placeholderText="Select date and time"
              excludeTimes={bookedSlots
                .map((slot) => slot.datetime)
                .filter(Boolean)}
              className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              wrapperClassName="w-full"
            />

            {selectedDateTime && (
              <div className="mt-4 p-4 bg-primary/10 dark:bg-primary/20 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <span className="material-icons text-base">
                    event_available
                  </span>
                  <span>
                    {selectedDateTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {" at "}
                    {selectedDateTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-6 pb-6">
              <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-center font-medium">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="material-icons text-primary">reviews</span>
              Patient Reviews
            </h3>

            <div className="space-y-4">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="font-medium text-gray-800 dark:text-white mb-1">
                    {review.name}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
            {/* Action Buttons */}
            <div className="flex gap-4  bottom-4 mt-14 ">
              <button
                className="flex-1 flex items-center justify-center  gap-2  bg-secondary-light dark:bg-gray-800 text-primary font-medium px-6 py-3 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() =>
                  window.open(`tel:${clinic.phone || clinic.phoneNumber}`)
                }
              >
                <span className="material-icons">call</span>
                <span>Call Clinic</span>
              </button>

              <button
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white   font-medium px-6 py-3 rounded-xl shadow-sm hover:bg-primary/90 disabled:opacity-50  disabled:cursor-not-allowed transition-colors"
                disabled={!selectedDateTime || loading}
                onClick={handleBook}
              >
                <span className="material-icons">event_available</span>
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicDetailsScreen;
