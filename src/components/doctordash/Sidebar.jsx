import { Fragment } from "react";
import { MdManageAccounts, MdDashboard } from "react-icons/md";
import { GrSchedules } from "react-icons/gr";
import { FaClinicMedical } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import petutLogo from "../../assets/petut.png";

export default function Sidebar({ open, toggleSidebar }) {
  const location = useLocation();
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
    {
      path: "/doctor-dashboard",
      icon: MdDashboard,
      label: "Dashboard",
      exact: true,
    },
    {
      path: "/doctor-dashboard/manage-clients",
      icon: MdManageAccounts,
      label: "Manage Clients",
    },
    {
      path: "/doctor-dashboard/manage-appointments",
      icon: GrSchedules,
      label: "Appointments",
    },
    {
      path: "/doctor-dashboard/manage-clinics",
      icon: FaClinicMedical,
      label: "Manage Clinics",
    },
    {
      path: "/doctor-dashboard/manage-profile",
      icon: IoPersonSharp,
      label: "Profile",
    },
  ];

  return (
    <Fragment>
      <div className={`fixed top-0 left-0 h-screen bg-slate-800 shadow-xl transition-all duration-300 z-50 ${
        open ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'
      } lg:translate-x-0 lg:static lg:w-64 lg:flex-shrink-0`}>
        {/* Sidebar Header */}
        <div className="flex items-center px-6 h-16 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              <img src={petutLogo} alt="Petut Logo" className="w-12 h-12" />
            </div>
            <span className="text-lg font-bold text-white">Petut Doctor</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 py-4 overflow-y-auto">
          <div className="px-4 mb-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">NAVIGATION</h3>
            <nav className="space-y-1">
              {menuItems.slice(0, 1).map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-yellow-500 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
          
          <div className="px-4 mb-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">MANAGEMENT</h3>
            <nav className="space-y-1">
              {menuItems.slice(1, 4).map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-yellow-500 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
          
          <div className="px-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">ACCOUNT</h3>
            <nav className="space-y-1">
              {menuItems.slice(4).map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-yellow-500 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
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
        <div className="px-4 pb-4">
          <div className="border-t border-slate-700 pt-4">
            <nav className="space-y-1">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200"
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
