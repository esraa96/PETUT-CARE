import React, { Fragment, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase.js";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import logo from "../../../assets/petut.png";

export default function Calendar({ doctorId }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  //get booking data from firebase for specific doctor
  useEffect(() => {
    const fetchDoctorBookings = async () => {
      if (!doctorId) return;

      try {
        const bookingsQuery = query(
          collection(db, "bookings"),
          where("doctorId", "==", doctorId)
        );
        const querySnapshot = await getDocs(bookingsQuery);
        const bookingsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingsData);
      } catch (error) {
        toast.error("Failed to fetch bookings: " + error.message, {
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorBookings();
  }, [doctorId]);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setShowModal(true);
  };

  const calendarEvents = bookings.map((book) => {
    let formattedDate = "";
    if (book.date?.toDate) {
      formattedDate = book.date.toDate().toISOString().split("T")[0];
    } else if (typeof book.date === "string") {
      formattedDate = new Date(book.date).toISOString().split("T")[0];
    }

    // Color code based on status
    let backgroundColor = "#C19635"; // default
    let borderColor = "#C19635";

    switch (book.status) {
      case "completed":
        backgroundColor = "#28a745";
        borderColor = "#28a745";
        break;
      case "cancelled":
        backgroundColor = "#dc3545";
        borderColor = "#dc3545";
        break;
      case "pending":
        backgroundColor = "#ffc107";
        borderColor = "#ffc107";
        break;
      default:
        backgroundColor = "#17a2b8";
        borderColor = "#17a2b8";
    }

    return {
      id: book.id,
      title: `${book.patientName || "Patient"} - ${book.time || ""}`,
      date: formattedDate,
      backgroundColor,
      borderColor,
      extendedProps: {
        status: book.status,
        patientName: book.patientName,
        clinicName: book.clinicName,
        time: book.time,
        phone: book.clinicPhone,
      },
    };
  });
  const selectedDayBookings = bookings.filter((book) => {
    const bookDate = book.date?.toDate
      ? book.date.toDate().toISOString().split("T")[0]
      : new Date(book.date).toISOString().split("T")[0];
    return bookDate === selectedDate;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#28a745";
      case "cancelled":
        return "#dc3545";
      case "pending":
        return "#ffc107";
      default:
        return "#17a2b8";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold";
      case "cancelled":
        return "bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold";
      case "pending":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-semibold";
      default:
        return "bg-sky-100 text-sky-800 px-2 py-1 rounded text-sm font-semibold";
    }
  };

  return (
    <Fragment>
      <div className="container mx-auto px-4 my-4">
        {loading ? (
          <h3 className="text-center mt-5">
            <BeatLoader color="#D9A741" />
          </h3>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              right: "prev today next",
              left: "title",
              // left: 'dayGridMonth,dayGridWeek'
            }}
            dateClick={handleDateClick}
            events={calendarEvents}
            height={530}
            width="100%"
          />
        )}
      </div>

      {showModal && (
        <>
          {/* Modal (Tailwind) */}
          <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-auto"
            aria-modal="true"
            role="dialog"
          >
            <div className="w-full max-w-3xl px-4 mt-36">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex items-center justify-between py-4 px-4 border-b">
                  <h5 className="text-lg font-medium">
                    Day data: {selectedDate}
                  </h5>
                  <img src={logo} width="90" height="90" alt="logo" />
                </div>

                <div className="p-4">
                  {selectedDayBookings.length > 0 ? (
                    <div className="grid gap-3">
                      {selectedDayBookings.map((item, index) => (
                        <div key={index} className="w-full">
                          <div
                            className="border-l-4 bg-white rounded"
                            style={{ borderColor: getStatusColor(item.status) }}
                          >
                            <div className="p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h6 className="text-sm font-semibold mb-1">
                                    {item.patientName || "Unknown Patient"}
                                  </h6>
                                  <p className="text-sm mb-1">
                                    <strong>Time:</strong>{" "}
                                    {item.time || "Not specified"}
                                  </p>
                                  <p className="text-sm mb-1">
                                    <strong>Clinic:</strong>{" "}
                                    {item.clinicName || "Not specified"}
                                  </p>
                                  <p className="text-sm mb-0">
                                    <strong>Phone:</strong>{" "}
                                    {item.clinicPhone || "Not specified"}
                                  </p>
                                </div>
                                <span
                                  className={`${getStatusBadgeClass(
                                    item.status
                                  )}`}
                                >
                                  {item.status || "pending"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">
                        No appointments scheduled for this day.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 p-4 border-t">
                  <button
                    type="button"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowModal(false)}
          ></div>
        </>
      )}
    </Fragment>
  );
}
