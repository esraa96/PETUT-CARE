import { Fragment } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaUsers } from "react-icons/fa6";
import { FaChartBar, FaClinicMedical } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { GrOverview } from "react-icons/gr";
import { IoStatsChart } from "react-icons/io5";
import { MdReviews } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { HiShoppingBag } from "react-icons/hi2";
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import logo from '../../assets/petut.png';

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
    { to: "/admin-dashboard/manage-users", icon: FaUsers, label: "Manage Users" },
    { to: "/admin-dashboard/manage-clinics", icon: FaClinicMedical, label: "Manage Clinics" },
    { to: "/admin-dashboard/manage-reservations", icon: FaCalendarAlt, label: "Reservations" },
    { to: "/admin-dashboard/reviews", icon: MdReviews, label: "Reviews" },
    { to: "/admin-dashboard/store", icon: HiShoppingBag, label: "Store" },
    { to: "/admin-dashboard/charts", icon: IoStatsChart, label: "Charts" },
    { to: "/admin-dashboard/support", icon: BiSupport, label: "Support" },
  ];

  return (
    <Fragment>
      <div className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 z-50 ${
        open ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'
      } lg:translate-x-0 lg:static lg:h-screen`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-center h-20 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Petut Logo" className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-petut-brown-300">Petut</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-petut-brown-300 to-petut-brown-400 text-white shadow-lg shadow-petut-brown-300/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-petut-brown-300'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
          >
            <TbLogout2 className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
            <span>Logout</span>
          </button>
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
  )
}
