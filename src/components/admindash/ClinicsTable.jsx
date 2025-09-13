import { Fragment, useEffect, useState } from 'react'
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import EditClinicModal from '../EditClinicModal';
import { BiSearchAlt2 } from "react-icons/bi";
import ConfirmModal from '../ConfirmModal';
import { FaEye } from "react-icons/fa";
import { BeatLoader } from 'react-spinners';
import ViewClinicModal from './ViewClinicModal';

export default function ClinicsTable({ clinics, fetchClinics, onDelete, loading }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedClinicId, setSelectedClinicId] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState(null);

    useEffect(() => {
        if (clinics.length === 0) {
            fetchClinics();
        }
    }, []);

    const filterClinics = clinics.filter(clinic => {
        const nameMatch = (clinic.name || clinic.clinicName || '').toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = (clinic.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const doctorMatch = (clinic.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase());
        const addressMatch = (clinic.governorate || clinic.address || '').toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = statusFilter === 'all' || clinic.status === statusFilter;
        return (nameMatch || emailMatch || doctorMatch || addressMatch) && statusMatch;
    });

    const handleView = (clinic) => {
        setSelectedClinic(clinic);
        setShowViewModal(true);
    };

    const handleEdit = (clinic) => {
        setSelectedClinic(clinic);
        setShowEditModal(true);
    };

    const handleDelete = (clinicId) => {
        setShowConfirm(true);
        setSelectedClinicId(clinicId);
    };

    return (
        <Fragment>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 my-6">
                <div className="relative w-full sm:w-1/2">
                    <input
                        className="w-full pl-4 pr-12 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        type="text"
                        placeholder="Search by name, email, doctor, or address"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <BiSearchAlt2
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                    />
                </div>
                <select 
                    className="w-full sm:w-1/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300" 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {loading ? (
                <div className='flex justify-center items-center h-64'>
                    <BeatLoader color='#D9A741' />
                </div>
            ) : clinics?.length === 0 ? (
                <div className='text-center mt-8 text-gray-600'>No clinics found</div>
            ) : filterClinics.length === 0 ? (
                <div className='text-center mt-8 text-gray-600'>No clinics match your search</div>
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Clinic Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Address
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Specialty
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                                {filterClinics.map((clinic) => (
                                    <tr key={clinic.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {clinic.name || clinic.clinicName || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {clinic.governorate || clinic.address || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {clinic.phone || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                ${clinic.price || '0'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {clinic.specialty || 'General'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                clinic.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {clinic.status || 'inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-3">
                                                <button 
                                                    onClick={() => handleView(clinic)}
                                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                                    title="View Details"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleEdit(clinic)}
                                                    className="text-petut-brown-300 hover:text-petut-brown-400 transition-colors"
                                                    title="Edit Clinic"
                                                >
                                                    <TbEdit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(clinic.id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                    title="Delete Clinic"
                                                >
                                                    <MdDelete className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modals */}
            {showConfirm && (
                <ConfirmModal 
                    onDelete={onDelete} 
                    setShowConfirm={setShowConfirm} 
                    selectedId={selectedClinicId} 
                    whatDelete="clinic" 
                />
            )}

            {showViewModal && selectedClinic && (
                <ViewClinicModal 
                    clinic={selectedClinic}
                    onClose={() => setShowViewModal(false)}
                />
            )}

            {showEditModal && selectedClinic && (
                <EditClinicModal 
                    clinic={selectedClinic}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={fetchClinics}
                />
            )}
        </Fragment>
    )
}