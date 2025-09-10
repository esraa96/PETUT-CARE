import { Fragment } from "react";
import { MdManageAccounts, MdDashboard } from "react-icons/md";
import { GrSchedules } from "react-icons/gr";
import { FaClinicMedical } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { NavLink, useLocation } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import petutLogo from "../../assets/petut.png";

export default function Sidebar({ open, toggleSidebar }) {
  const location = useLocation();

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
      <div
        className={`sidebar fixed top-[clamp(80px,12vh,100px)] left-0 overflow-y-auto bg-white border-r border-yellow-200/40 shadow-[2px_0_10px_rgba(0,0,0,0.08)] z-50 flex flex-col h-[calc(100vh-clamp(80px,12vh,100px))] ${
          open ? "w-[260px]" : "w-[72px]"
        }`}
      >
        {/* Logo Section */}
        <div
          className="text-center py-4 border-b"
          style={{ borderColor: "rgba(217, 167, 65, 0.2)" }}
        >
          <img src={petutLogo} alt="Petut Logo" className="w-12 h-12 mx-auto" />
          <h6
            className="mt-2 mb-0 font-semibold text-[1rem]"
            style={{ color: "#D9A741" }}
          >
            Petut Dashboard
          </h6>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4">
          <ul className="list-none px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <li
                  key={item.path}
                  className={`sidebar-nav-item mb-2 ${
                    isActive ? "active" : ""
                  }`}
                >
                  <NavLink
                    to={item.path}
                    className={`flex items-center py-3 px-3 rounded transition-all duration-200 ${
                      isActive ? "bg-yellow-400 text-white" : "text-gray-700"
                    }`}
                    onClick={toggleSidebar}
                  >
                    <Icon size={20} className="me-3" />
                    <span className="text-[0.95rem] font-medium">
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Section */}
        <div
          className="border-t px-3 py-3"
          style={{ borderColor: "rgba(217, 167, 65, 0.2)" }}
        >
          <div className="sidebar-nav-item">
            <NavLink
              to="/login"
              className="text-decoration-none d-flex align-items-center py-3 px-3 rounded"
              style={{
                color: "#dc3545",
                transition: "all 0.3s ease",
              }}
              onClick={toggleSidebar}
            >
              <TbLogout2 size={20} className="me-3" />
              <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>
                Log out
              </span>
            </NavLink>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
