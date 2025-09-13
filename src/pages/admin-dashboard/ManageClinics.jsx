import React, { Fragment, useEffect, useState } from 'react'
import { FaUserMd, FaUsers, FaCalendarAlt, FaBuilding } from "react-icons/fa";
import { RiAddLine } from "react-icons/ri";
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { BeatLoader } from 'react-spinners';
import ClinicsTable from '../../components/admindash/ClinicsTable';
import { toast } from 'react-toastify';
import AddClinicModal from '../../components/AddClinicModal';

export default function ManageClinics() {
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [stats, setStats] = useState({
        totalClinics: 0,
        activeDoctors: 0,
        totalClients: 0,
        totalReservations: 0
    });

    useEffect(() => {
        fetchClinicsAndStats();
    }, []);

    const fetchClinicsAndStats = async () => {
        try {
            setLoading(true);
            
            // Fetch clinics
            const clinicsSnapshot = await getDocs(collection(db, 'clinics'));
            const clinicsData = clinicsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setClinics(clinicsData);

            // Fetch stats
            const [doctorsSnapshot, clientsSnapshot, reservationsSnapshot] = await Promise.all([
                getDocs(query(collection(db, 'users'), where('role', '==', 'doctor'))),
                getDocs(query(collection(db, 'users'), where('role', '==', 'customer'))),
                getDocs(collection(db, 'reservations'))
            ]);

            setStats({
                totalClinics: clinicsSnapshot.size,
                activeDoctors: doctorsSnapshot.size,
                totalClients: clientsSnapshot.size,
                totalReservations: reservationsSnapshot.size
            });
        } catch (error) {
            toast.error("Failed to fetch data: " + error.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const fetchClinics = async () => {
        try {
            const clinicsRef = collection(db, 'clinics');
            const clinicsSnapshot = await getDocs(clinicsRef);
            const clinicsData = clinicsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setClinics(clinicsData);
            setStats(prev => ({ ...prev, totalClinics: clinicsSnapshot.size }));
        } catch (error) {
            toast.error("Failed to fetch clinics: " + error.message, { autoClose: 3000 });
        }
    };

    const handleDeleteClinic = async (id) => {
        try {
            await deleteDoc(doc(db, 'clinics', id));
            setClinics(clinics => clinics.filter(clinic => clinic.id !== id));
            setStats(prev => ({ ...prev, totalClinics: prev.totalClinics - 1 }));
            toast.success('Clinic deleted successfully', { autoClose: 3000 });
        } catch (error) {
            toast.error("Failed to delete clinic: " + error.message, { autoClose: 3000 });
        }
    };

    const statistics = [
        { title: 'Total Clinics', count: stats.totalClinics, icon: <FaBuilding className="w-8 h-8" /> },
        { title: 'Active Doctors', count: stats.activeDoctors, icon: <FaUserMd className="w-8 h-8" /> },
        { title: 'Total Clients', count: stats.totalClients, icon: <FaUsers className="w-8 h-8" /> },
        { title: 'Total Reservations', count: stats.totalReservations, icon: <FaCalendarAlt className="w-8 h-8" /> },
    ];

    return (
        <Fragment>
            <div className='p-4 lg:p-6 bg-white dark:bg-gray-900 min-h-screen'>
                <div className='mb-6'>
                    <h1 className="text-3xl font-bold text-black dark:text-white">Clinic Management</h1>
                    <p className='text-black dark:text-white'>Managing all clinics and responsible doctors</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <BeatLoader color="#D9A741" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {statistics.map((statistic, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-black dark:text-white mb-2">{statistic.title}</h3>
                                            <p className="text-3xl font-bold text-black dark:text-white">{statistic.count}</p>
                                        </div>
                                        <div className="text-yellow-400">
                                            {statistic.icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='flex justify-end mb-6'>
                            <button 
                                className='bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2 font-semibold'
                                onClick={() => setShowAddModal(true)}
                            >
                                <RiAddLine className="w-5 h-5" /> Add Clinic
                            </button>
                        </div>

                        {showAddModal && (
                            <AddClinicModal 
                                clinics={clinics} 
                                setClinics={setClinics} 
                                fetchClinics={fetchClinics} 
                                setLoading={setLoading}
                                showModal={showAddModal}
                                setShowModal={setShowAddModal}
                            />
                        )}

                        <ClinicsTable 
                            clinics={clinics} 
                            fetchClinics={fetchClinics} 
                            onDelete={handleDeleteClinic} 
                            loading={false}
                            setLoading={setLoading} 
                        />
                    </>
                )}
            </div>
        </Fragment>
    )
}