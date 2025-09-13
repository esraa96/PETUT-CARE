import { Fragment, useState, useEffect } from "react";
import { FaBars, FaBell, FaSearch } from "react-icons/fa";
import { MdSettings, MdLogout } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import petutLogo from "../assets/petut.png";

export default function HeaderDoctor({ toggleSidebar, doctorData }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!auth.currentUser) return;

      try {
        // Get recent appointments for notifications
        const appointmentsQuery = query(
          collection(db, "bookings"),
          where("doctorId", "==", auth.currentUser.uid),
          limit(5)
        );

        const snapshot = await getDocs(appointmentsQuery);
        const upcomingAppointments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter for today and tomorrow
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const filtered = upcomingAppointments.filter((apt) => {
          const aptDate = apt.date?.toDate
            ? apt.date.toDate()
            : new Date(apt.date);
          return aptDate >= today && aptDate <= tomorrow;
        });

        setNotifications(filtered);
        setUnreadCount(filtered.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        // Set empty notifications on error
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();

    // Refresh notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to logout");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to search results or filter current page
      navigate(
        `/doctor-dashboard/manage-clients?search=${encodeURIComponent(
          searchTerm
        )}`
      );
    }
  };

  return (
    <Fragment>
      <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
        <nav className="h-16 px-4 flex items-center">
          <div className="w-full flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors lg:hidden"
                onClick={toggleSidebar}
              >
                <FaBars size={24} />
              </button>

              <div className="flex items-center gap-3">
                <img
                  src={petutLogo}
                  alt="Petut"
                  className="w-9 h-9"
                />
                <h4 className="text-xl font-bold text-yellow-500">
                  Petut Dashboard
                </h4>
              </div>
            </div>

            {/* Center Section - Search */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex flex-1 max-w-md mx-4"
            >
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Search patients, appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative transition-colors"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <FaBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h6 className="font-semibold text-gray-800">Recent Notifications</h6>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div key={notification.id} className="p-4 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-800">Upcoming Appointment</p>
                                <p className="text-sm text-gray-600">{notification.patientName} - {notification.time}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(
                                    notification.date?.toDate
                                      ? notification.date.toDate()
                                      : notification.date
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center">
                          <p className="text-gray-500 text-sm">No new notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Doctor Profile Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-semibold text-gray-800">
                      Dr. {doctorData?.fullName}
                    </div>
                    <div className="text-xs text-gray-500">
                      Veterinarian
                    </div>
                  </div>
                  <img
                    src={doctorData?.profileImage || petutLogo}
                    alt="Doctor"
                    className="w-11 h-11 rounded-full border-2 border-yellow-400 object-cover"
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <Link
                      to="/doctor-dashboard/manage-profile"
                      className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <MdSettings size={16} />
                      Profile Settings
                    </Link>
                    <hr className="border-gray-200" />
                    <button
                      className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                      onClick={() => {
                        setShowDropdown(false);
                        handleLogout();
                      }}
                    >
                      <MdLogout size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </Fragment>
  );
}
