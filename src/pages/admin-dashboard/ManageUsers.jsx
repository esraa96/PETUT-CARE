import { Fragment, useState, useEffect } from 'react'
import { FaUsers, FaUserTie, FaUserMd, FaPlus, FaBell } from "react-icons/fa";
import DoctorsTable from '../../components/admindash/DoctorsTable';
import AddClientModal from '../../components/admindash/AddClientModal';
import AddDoctorModal from '../../components/admindash/AddDoctorModal';
import Clientstable from '../../components/admindash/ClientsTable';
import AddAdminModal from '../../components/admindash/AddAdminModal';
import AdminsTable from '../../components/admindash/AdminsTable';
import { BeatLoader } from 'react-spinners';

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase.js";
import { toast } from "react-toastify";

export default function ManageUsers() {
    const [activeTab, setActiveTab] = useState('doctors');
    const [doctors, setDoctors] = useState([]);
    const [clients, setClients] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalClients: 0,
        totalAdmins: 0,
        totalUsers: 0,
        pendingDoctors: 0
    });

    useEffect(() => {
        fetchAllStats();
        fetchDoctors();
    }, []);

    useEffect(() => {
        if (activeTab === 'doctors') {
            fetchDoctors();
        } else if (activeTab === 'clients') {
            fetchClients();
        } else if (activeTab === 'admins') {
            fetchAdmins();
        }
    }, [activeTab]);

    const fetchAllStats = async () => {
        try {
            const [doctorsSnapshot, clientsSnapshot, adminsSnapshot, pendingDoctorsSnapshot] = await Promise.all([
                getDocs(query(collection(db, 'users'), where('role', '==', 'doctor'))),
                getDocs(query(collection(db, 'users'), where('role', '==', 'customer'))),
                getDocs(query(collection(db, 'users'), where('role', '==', 'admin'))),
                getDocs(query(collection(db, 'users'), where('role', '==', 'doctor'), where('status', '==', 'pending')))
            ]);

            setStats({
                totalDoctors: doctorsSnapshot.size,
                totalClients: clientsSnapshot.size,
                totalAdmins: adminsSnapshot.size,
                totalUsers: doctorsSnapshot.size + clientsSnapshot.size + adminsSnapshot.size,
                pendingDoctors: pendingDoctorsSnapshot.size
            });
        } catch (error) {
            console.error("Stats fetch error:", error);
            toast.error("فشل في تحميل الإحصائيات", { autoClose: 3000 });
        }
    };

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "users"), where("role", "==", "doctor"));
            const querySnapshot = await getDocs(q);
            const doctorsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDoctors(doctorsData);
        } catch (error) {
            console.error("Doctors fetch error:", error);
            toast.error("فشل في تحميل الأطباء", { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "users"), where("role", "==", "customer"));
            const querySnapshot = await getDocs(q);
            const clientsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setClients(clientsData);
        } catch (error) {
            console.error("Clients fetch error:", error);
            toast.error("فشل في تحميل العملاء", { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "users"), where("role", "==", "admin"));
            const querySnapshot = await getDocs(q);
            const adminsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAdmins(adminsData);
        } catch (error) {
            console.error("Admins fetch error:", error);
            toast.error("فشل في تحميل المديرين", { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const statistics = [
        { title: 'Total Users', count: stats.totalUsers, icon: <FaUsers className="w-8 h-8" /> },
        { title: 'Doctors', count: stats.totalDoctors, icon: <FaUserMd className="w-8 h-8" /> },
        { title: 'Clients', count: stats.totalClients, icon: <FaUsers className="w-8 h-8" /> },
        { title: 'Admins', count: stats.totalAdmins, icon: <FaUserTie className="w-8 h-8" /> },
        { 
            title: 'Pending Doctors', 
            count: stats.pendingDoctors, 
            icon: <FaUserMd className="w-8 h-8" />,
            highlight: stats.pendingDoctors > 0
        },
    ];

    return (
        <div className='p-4 sm:p-6 bg-white dark:bg-gray-900 min-h-screen'>
            <div className='mb-4 sm:mb-6 text-center sm:text-left'>
                <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">User Management</h1>
                <p className='text-sm sm:text-base text-gray-600 dark:text-gray-300'>Manage all doctors, clients and admins in the system</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
                {statistics.map((statistic, index) => (
                    <div key={index} className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 lg:p-6 border hover:shadow-md transition-shadow ${
                        statistic.highlight ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-600'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <h3 className={`text-xs sm:text-sm font-medium mb-1 sm:mb-2 truncate ${
                                    statistic.highlight ? 'text-yellow-700 dark:text-yellow-600' : 'text-gray-600 dark:text-gray-400'
                                }`}>{statistic.title}</h3>
                                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
                                    statistic.highlight ? 'text-yellow-800 dark:text-yellow-700' : 'text-gray-900 dark:text-white'
                                }`}>{statistic.count}</p>
                                {statistic.highlight && statistic.count > 0 && (
                                    <p className="text-xs text-yellow-600 mt-1 hidden sm:block">Needs Review</p>
                                )}
                            </div>
                            <div className={`flex-shrink-0 ml-2 ${statistic.highlight ? 'text-yellow-600' : 'text-petut-brown-300'}`}>
                                <div className="w-6 h-6 sm:w-8 sm:h-8">
                                    {statistic.icon}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                {/* Desktop Tabs */}
                <div className="hidden sm:flex border-b border-gray-200 dark:border-gray-600">
                    <button
                        onClick={() => setActiveTab('doctors')}
                        className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'doctors'
                                ? 'border-petut-brown-300 text-petut-brown-300'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        <FaUserMd className='mr-2' size={20} />
                        Doctors
                    </button>
                    <button
                        onClick={() => setActiveTab('clients')}
                        className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'clients'
                                ? 'border-petut-brown-300 text-petut-brown-300'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        <FaUsers className='mr-2' size={20} />
                        Clients
                    </button>
                    <button
                        onClick={() => setActiveTab('admins')}
                        className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'admins'
                                ? 'border-petut-brown-300 text-petut-brown-300'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        <FaUserTie className='mr-2' size={20} />
                        Admins
                    </button>
                </div>
                
                {/* Mobile Tabs */}
                <div className="sm:hidden border-b border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-3 gap-1 p-2">
                        <button
                            onClick={() => setActiveTab('doctors')}
                            className={`flex flex-col items-center py-3 px-2 rounded-lg text-xs font-medium transition-colors ${
                                activeTab === 'doctors'
                                    ? 'bg-petut-brown-300 text-white'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                        >
                            <FaUserMd size={16} className='mb-1' />
                            Doctors
                        </button>
                        <button
                            onClick={() => setActiveTab('clients')}
                            className={`flex flex-col items-center py-3 px-2 rounded-lg text-xs font-medium transition-colors ${
                                activeTab === 'clients'
                                    ? 'bg-petut-brown-300 text-white'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                        >
                            <FaUsers size={16} className='mb-1' />
                            Clients
                        </button>
                        <button
                            onClick={() => setActiveTab('admins')}
                            className={`flex flex-col items-center py-3 px-2 rounded-lg text-xs font-medium transition-colors ${
                                activeTab === 'admins'
                                    ? 'bg-petut-brown-300 text-white'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                        >
                            <FaUserTie size={16} className='mb-1' />
                            Admins
                        </button>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    {activeTab === 'doctors' && stats.pendingDoctors > 0 && (
                        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-600 rounded-lg">
                            <div className="flex items-center">
                                <FaBell className="text-yellow-600 dark:text-yellow-400 mr-2" />
                                <p className="text-yellow-800 dark:text-yellow-300 font-medium">
                                    You have {stats.pendingDoctors} doctor{stats.pendingDoctors > 1 ? 's' : ''} waiting for approval.
                                </p>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex justify-center sm:justify-end mb-6">
                        <button 
                            className='bg-petut-brown-300 text-white px-4 py-2 rounded-lg hover:bg-petut-brown-400 transition-colors flex items-center gap-2 font-semibold text-sm sm:text-base w-full sm:w-auto justify-center'
                            onClick={() => setShowAddModal(true)}
                        >
                            <FaPlus size={16} />
                            <span className="hidden sm:inline">
                                {activeTab === 'doctors' ? 'Add Doctor' : activeTab === 'clients' ? 'Add Client' : 'Add Admin'}
                            </span>
                            <span className="sm:hidden">
                                Add {activeTab === 'doctors' ? 'Dr.' : activeTab === 'clients' ? 'Client' : 'Admin'}
                            </span>
                        </button>
                    </div>

                    {activeTab === 'doctors' && (
                        <DoctorsTable 
                            fetchDoctors={fetchDoctors} 
                            doctors={doctors} 
                            setDoctors={setDoctors} 
                            loading={loading} 
                            setLoading={setLoading} 
                        />
                    )}
                    {activeTab === 'clients' && (
                        <Clientstable 
                            fetchClients={fetchClients} 
                            clients={clients} 
                            setClients={setClients} 
                            loading={loading} 
                            setLoading={setLoading} 
                        />
                    )}
                    {activeTab === 'admins' && (
                        <AdminsTable 
                            fetchAdmins={fetchAdmins} 
                            admins={admins} 
                            setAdmins={setAdmins} 
                            loading={loading} 
                            setLoading={setLoading} 
                        />
                    )}
                </div>
            </div>

            {showAddModal && (
                <>
                    {activeTab === 'doctors' && (
                        <AddDoctorModal 
                            fetchDoctors={fetchDoctors} 
                            doctors={doctors} 
                            setDoctors={setDoctors}
                            showModal={showAddModal}
                            setShowModal={setShowAddModal}
                        />
                    )}
                    {activeTab === 'clients' && (
                        <AddClientModal 
                            fetchClients={fetchClients} 
                            clients={clients} 
                            setClients={setClients}
                            showModal={showAddModal}
                            setShowModal={setShowAddModal}
                        />
                    )}
                    {activeTab === 'admins' && (
                        <AddAdminModal 
                            fetchAdmins={fetchAdmins} 
                            admins={admins} 
                            setAdmins={setAdmins}
                            showModal={showAddModal}
                            setShowModal={setShowAddModal}
                        />
                    )}
                </>
            )}
        </div>
    )
}