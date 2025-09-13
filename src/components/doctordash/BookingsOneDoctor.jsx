import React, { Fragment, useState } from "react";
import {
  FaEye,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";
import { MdPerson, MdEmail } from "react-icons/md";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";

export default function BookingsOneDoctor({ bookings, onBookingUpdate }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const getStatusBadge = (status) => {
    const statusConfig = {
      booked: {
        bg: "rgba(23, 162, 184, 0.1)",
        color: "#17a2b8",
        text: "Booked",
      },
      completed: {
        bg: "rgba(40, 167, 69, 0.1)",
        color: "#28a745",
        text: "Completed",
      },
      cancelled: {
        bg: "rgba(220, 53, 69, 0.1)",
        color: "#dc3545",
        text: "Cancelled",
      },
      pending: {
        bg: "rgba(255, 193, 7, 0.1)",
        color: "#ffc107",
        text: "Pending",
      },
    };

    const config = statusConfig[status] || statusConfig["pending"];

    return (
      <span
        className="inline-block px-3 py-2 text-sm font-semibold rounded"
        style={{
          backgroundColor: config.bg,
          color: config.color,
          border: `1px solid ${config.color}30`,
        }}
      >
        {config.text}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";
    try {
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "-";
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingStatus(bookingId);
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, {
        status: newStatus,
        updatedAt: new Date(),
      });

      toast.success(`Appointment status updated to ${newStatus}`);

      // Update selected booking if it's the one being updated
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
      }

      // Notify parent component to refresh data
      if (onBookingUpdate) {
        onBookingUpdate();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update appointment status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <Fragment>
      <div className="overflow-x-auto max-h-96 lg:max-h-[600px]">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                Patient Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider table-cell md:hidden">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                Clinic Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Appointment
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings && bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  {/* Patient Info */}
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <MdPerson size={20} className="text-yellow-600" />
                      </div>
                      <div>
                        <h6 className="text-sm font-semibold text-gray-900">
                          {booking?.patientName || "Unknown Patient"}
                        </h6>
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <MdEmail size={12} />
                          <span>{booking?.patientEmail || "No email"}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Patient Info Mobile */}
                  <td className="px-6 py-4 whitespace-nowrap table-cell md:hidden">
                    <div>
                      <h6 className="text-sm font-semibold text-gray-900">
                        {booking?.patientName || "Unknown"}
                      </h6>
                      <p className="text-xs text-gray-500">
                        {booking?.patientEmail || "No email"}
                      </p>
                    </div>
                  </td>

                  {/* Clinic Details */}
                  <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div>
                      <h6 className="text-sm font-semibold text-gray-900">
                        {booking?.clinicName || "-"}
                      </h6>
                      <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                        <FaMapMarkerAlt size={10} />
                        <span>{booking?.clinicLocation || "No location"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <FaPhone size={10} />
                        <span>{booking?.clinicPhone || "No phone"}</span>
                      </div>
                    </div>
                  </td>

                  {/* Appointment Details */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt size={12} className="text-yellow-500" />
                        <span className="text-sm font-semibold text-gray-900">
                          {formatDate(booking?.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock size={12} className="text-blue-500" />
                        <span className="text-sm text-gray-600">
                          {booking?.time || "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 hidden sm:flex">
                        <FaDollarSign size={12} className="text-green-500" />
                        <span className="text-sm font-semibold text-gray-900">
                          {booking?.price || "-"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      {getStatusBadge(booking?.status)}
                      <select
                        className="hidden md:block w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        value={booking?.status || "pending"}
                        onChange={(e) =>
                          handleStatusChange(booking.id, e.target.value)
                        }
                        disabled={updatingStatus === booking.id}
                      >
                        <option value="pending">Pending</option>
                        <option value="booked">Booked</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <FaEye size={12} />
                        <span className="hidden lg:inline">View</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <MdPerson size={48} className="mx-auto mb-3 opacity-30" />
                    <h6 className="text-lg font-semibold mb-2">
                      No appointments found
                    </h6>
                    <p className="text-sm">
                      Appointments will appear here when patients book with you.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900">
                Appointment Details
              </h5>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setSelectedBooking(null)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h6 className="font-bold text-gray-900 mb-4">
                    Patient Information
                  </h6>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.patientName || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.patientEmail || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.patientPhone || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h6 className="font-bold text-gray-900 mb-4">
                    Appointment Details
                  </h6>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Date:</span>
                      <span className="ml-2 text-gray-900">
                        {formatDate(selectedBooking.date)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Time:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.time || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Price:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.price || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className="ml-2">
                        {getStatusBadge(selectedBooking.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <button
                type="button"
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={selectedBooking?.status || "pending"}
                onChange={(e) =>
                  handleStatusChange(selectedBooking?.id, e.target.value)
                }
              >
                <option value="pending">Pending</option>
                <option value="booked">Booked</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
