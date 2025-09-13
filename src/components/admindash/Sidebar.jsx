import { Fragment } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa6";
import { FaChartBar, FaClinicMedical, FaBell } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { GrOverview } from "react-icons/gr";
import { IoStatsChart } from "react-icons/io5";
import { MdReviews } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { HiShoppingBag } from "react-icons/hi2";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import logo from "../../assets/petut.png";

export default function Sidebar({ open, toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out", { autoClose: 3000 });
    }
  };

  const menuItems = [
    { to: "/admin-dashboard/overview", icon: GrOverview, label: "Overview" },
    {
      to: "/admin-dashboard/manage-users",
      icon: FaUsers,
      label: "Manage Users",
    },
    {
      to: "/admin-dashboard/manage-clinics",
      icon: FaClinicMedical,
      label: "Manage Clinics",
    },
    {
      to: "/admin-dashboard/manage-reservations",
      icon: FaCalendarAlt,
      label: "Reservations",
    },
    {
      to: "/admin-dashboard/notifications",
      icon: FaBell,
      label: "Notifications",
    },
    { to: "/admin-dashboard/reviews", icon: MdReviews, label: "Reviews" },
    { to: "/admin-dashboard/store", icon: HiShoppingBag, label: "Store" },
    { to: "/admin-dashboard/charts", icon: IoStatsChart, label: "Charts" },
    { to: "/admin-dashboard/support", icon: BiSupport, label: "Support" },
  ];

  return (
    <Fragment>
      <div
        className={`fixed top-0 left-0 h-screen bg-slate-800 dark:bg-gray-900 shadow-xl transition-all duration-300 z-50 flex flex-col ${
          open ? "w-64 translate-x-0" : "w-64 -translate-x-full"
        } lg:translate-x-0 lg:fixed lg:top-0 lg:left-0 lg:w-64 lg:flex-shrink-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center px-6 h-16 border-b border-slate-700 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              <img src={logo} alt="Petut Logo" className="w-12 h-12" />
            </div>
            <span className="text-lg font-bold text-white">Petut Admin</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 py-4 overflow-y-auto">
          <div className="px-4 mb-4">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-gray-400 uppercase tracking-wider mb-3">
              NAVIGATION
            </h3>
            <nav className="space-y-1">
              {menuItems.slice(0, 1).map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-petut-brown-300 text-white"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="px-4 mb-4">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-gray-400 uppercase tracking-wider mb-3">
              MANAGEMENT
            </h3>
            <nav className="space-y-1">
              {menuItems.slice(1, 7).map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-petut-brown-300 text-white"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="px-4">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-gray-400 uppercase tracking-wider mb-3">
              ANALYTICS
            </h3>
            <nav className="space-y-1">
              {menuItems.slice(7).map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-petut-brown-300 text-white"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Logout Section */}
        <div className="px-4 pb-4 mt-auto">
          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-gray-400 uppercase tracking-wider mb-3">
              ACCOUNT
            </h3>
            <nav className="space-y-1">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-200"
              >
                <TbLogout2 className="w-4 h-4 mr-3" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </Fragment>
  );
}
