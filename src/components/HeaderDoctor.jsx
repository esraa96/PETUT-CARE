import { Fragment, useState, useEffect } from 'react'
import { FaBars, FaBell, FaSearch } from "react-icons/fa";
import { MdSettings, MdLogout } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import petutLogo from '../assets/petut.png';

export default function HeaderDoctor({ toggleSidebar, doctorData }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!auth.currentUser) return;
            
            try {
                // Get recent appointments for notifications
                const appointmentsQuery = query(
                    collection(db, 'bookings'),
                    where('doctorId', '==', auth.currentUser.uid),
                    limit(5)
                );
                
                const snapshot = await getDocs(appointmentsQuery);
                const upcomingAppointments = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                // Filter for today and tomorrow
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                
                const filtered = upcomingAppointments.filter(apt => {
                    const aptDate = apt.date?.toDate ? apt.date.toDate() : new Date(apt.date);
                    return aptDate >= today && aptDate <= tomorrow;
                });
                
                setNotifications(filtered);
                setUnreadCount(filtered.length);
            } catch (error) {
                console.error('Error fetching notifications:', error);
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
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('Failed to logout');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Navigate to search results or filter current page
            navigate(`/doctor-dashboard/manage-clients?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <Fragment>
            <header className="header-dash">
                <nav className="navbar container-fluid py-3 px-4 align-items-center position-fixed top-0 start-0 end-0" 
                     style={{ height: '100px', zIndex: '1001' }}>
                    
                    <div className="container-fluid d-flex align-items-center justify-content-between">
                        {/* Left Section */}
                        <div className="d-flex align-items-center gap-4">
                            <button 
                                className="btn btn-link p-0 border-0" 
                                onClick={toggleSidebar}
                                style={{ color: '#D9A741' }}
                            >
                                <FaBars size={24} />
                            </button>
                            
                            <div className="d-flex align-items-center gap-2 gap-md-3">
                                <img src={petutLogo} alt="Petut" style={{ width: '35px', height: '35px' }} className="d-block" />
                                <h4 className="mb-0 fw-bold d-none d-sm-block" style={{ color: '#D9A741', fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>Petut Dashboard</h4>
                            </div>
                        </div>

                        {/* Center Section - Search */}
                        <form onSubmit={handleSearch} className="search-container d-none d-lg-flex" style={{ maxWidth: '400px', flex: '1', margin: '0 1rem' }}>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0" style={{ borderColor: '#e9ecef' }}>
                                    <FaSearch size={16} style={{ color: '#6c757d' }} />
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0" 
                                    placeholder="Search patients, appointments..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ borderColor: '#e9ecef' }}
                                />
                            </div>
                        </form>

                        {/* Right Section */}
                        <div className="d-flex align-items-center gap-3">
                            {/* Notifications */}
                            <div className="dropdown position-relative">
                                <button 
                                    className="btn btn-link p-2 border-0 position-relative" 
                                    style={{ color: '#6c757d' }}
                                    data-bs-toggle="dropdown"
                                >
                                    <FaBell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" 
                                              style={{ backgroundColor: '#dc3545', fontSize: '10px' }}>
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                                <div className="dropdown-menu dropdown-menu-end" style={{ width: '300px', maxHeight: '400px', overflowY: 'auto' }}>
                                    <h6 className="dropdown-header">Recent Notifications</h6>
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <div key={notification.id} className="dropdown-item-text p-3 border-bottom">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="flex-grow-1">
                                                        <small className="fw-semibold">Upcoming Appointment</small>
                                                        <div className="text-muted small">
                                                            {notification.patientName} - {notification.time}
                                                        </div>
                                                        <div className="text-muted small">
                                                            {new Date(notification.date?.toDate ? notification.date.toDate() : notification.date).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="dropdown-item-text text-center p-3">
                                            <small className="text-muted">No new notifications</small>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Doctor Profile Dropdown */}
                            <div className="dropdown">
                                <button 
                                    className="btn btn-link p-0 border-0 d-flex align-items-center gap-2 text-decoration-none"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    style={{ color: '#495057' }}
                                >
                                    <div className="text-end d-none d-md-block">
                                        <div className="fw-semibold" style={{ fontSize: 'clamp(12px, 2vw, 14px)' }}>Dr. {doctorData?.fullName}</div>
                                        <div className="text-muted" style={{ fontSize: 'clamp(10px, 1.5vw, 12px)' }}>Veterinarian</div>
                                    </div>
                                    <img 
                                        src={doctorData?.profileImage || petutLogo} 
                                        alt="Doctor" 
                                        className="rounded-circle border"
                                        style={{ width: '45px', height: '45px', objectFit: 'cover', borderColor: '#D9A741 !important' }} 
                                    />
                                </button>
                                
                                {showDropdown && (
                                    <div className="dropdown-menu dropdown-menu-end show position-absolute" 
                                         style={{ top: '100%', right: '0', minWidth: '200px', zIndex: '1050' }}>
                                        <Link to="/doctor-dashboard/manage-profile" 
                                              className="dropdown-item d-flex align-items-center gap-2"
                                              onClick={() => setShowDropdown(false)}>
                                            <MdSettings size={16} />
                                            Profile Settings
                                        </Link>
                                        <hr className="dropdown-divider" />
                                        <button 
                                              className="dropdown-item d-flex align-items-center gap-2 text-danger border-0 bg-transparent w-100"
                                              onClick={() => {
                                                  setShowDropdown(false);
                                                  handleLogout();
                                              }}>
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
    )
}
