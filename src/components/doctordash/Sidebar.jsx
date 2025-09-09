import { Fragment } from 'react'
import { MdManageAccounts, MdDashboard } from "react-icons/md";
import { GrSchedules } from "react-icons/gr";
import { FaClinicMedical } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { NavLink, useLocation } from 'react-router-dom';
import { TbLogout2 } from "react-icons/tb";
import petutLogo from '../../assets/petut.png';

export default function Sidebar({ open, toggleSidebar }) {
    const location = useLocation();
    
    const menuItems = [
        {
            path: "/doctor-dashboard",
            icon: MdDashboard,
            label: "Dashboard",
            exact: true
        },
        {
            path: "/doctor-dashboard/manage-clients",
            icon: MdManageAccounts,
            label: "Manage Clients"
        },
        {
            path: "/doctor-dashboard/manage-appointments",
            icon: GrSchedules,
            label: "Appointments"
        },
        {
            path: "/doctor-dashboard/manage-clinics",
            icon: FaClinicMedical,
            label: "Manage Clinics"
        },
        {
            path: "/doctor-dashboard/manage-profile",
            icon: IoPersonSharp,
            label: "Profile"
        }
    ];

    return (
        <Fragment>
            <div className={`sidebar d-flex flex-column position-fixed h-100 ${open ? 'expanded' : 'collapsed'}`} 
                 style={{ 
                     top: 'clamp(80px, 12vh, 100px)', 
                     left: '0',
                     height: 'calc(100vh - clamp(80px, 12vh, 100px))',
                     backgroundColor: '#ffffff',
                     borderRight: '1px solid rgba(217, 167, 65, 0.2)',
                     boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
                     zIndex: '1000',
                     overflowY: 'auto'
                 }}>
                
                {/* Logo Section */}
                <div className="text-center py-4 border-bottom" style={{ borderColor: 'rgba(217, 167, 65, 0.2)' }}>
                    <img src={petutLogo} alt="Petut Logo" style={{ width: '50px', height: '50px' }} />
                    <h6 className="mt-2 mb-0 fw-bold" style={{ color: '#D9A741', fontSize: '1rem' }}>Petut Dashboard</h6>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-grow-1 py-4">
                    <ul className="list-unstyled px-3">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.exact 
                                ? location.pathname === item.path
                                : location.pathname.startsWith(item.path);
                            
                            return (
                                <li key={item.path} className={`sidebar-nav-item mb-2 ${isActive ? 'active' : ''}`}>
                                    <NavLink
                                        to={item.path}
                                        className="text-decoration-none d-flex align-items-center py-3 px-3 rounded"
                                        onClick={toggleSidebar}
                                        style={{ 
                                            color: isActive ? 'white' : '#495057',
                                            backgroundColor: isActive ? '#D9A741' : 'transparent',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <Icon size={20} className="me-3" />
                                        <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{item.label}</span>
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout Section */}
                <div className="border-top px-3 py-3" style={{ borderColor: 'rgba(217, 167, 65, 0.2)' }}>
                    <div className="sidebar-nav-item">
                        <NavLink
                            to="/login"
                            className="text-decoration-none d-flex align-items-center py-3 px-3 rounded"
                            style={{ 
                                color: '#dc3545',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={toggleSidebar}
                        >
                            <TbLogout2 size={20} className="me-3" />
                            <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>Log out</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
