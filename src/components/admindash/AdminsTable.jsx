import React, { useState } from 'react'
import { FaEdit, FaTrashAlt, FaSearch, FaEye } from "react-icons/fa";
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase.js';

export default function AdminsTable({ admins, setAdmins, fetchAdmins, loading }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const handleDeleteAdmin = async (adminId) => {
        try {
            await deleteDoc(doc(db, 'users', adminId));
            setAdmins(admins => admins.filter(admin => admin.id !== adminId));
            toast.success('Admin deleted successfully', { autoClose: 3000 });
        } catch (err) {
            toast.error("Failed to delete admin: " + err.message, { autoClose: 3000 });
        } finally {
            setShowConfirm(false);
        }
    }

    const filteredAdmins = admins.filter((admin) => {
        const nameMatch = (admin.fullName || admin.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = (admin.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || emailMatch;
    });

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                    <input
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300"
                        type="text"
                        placeholder="Search by name or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
            </div>

            {loading ? (
                <div className='text-center py-8'>
                    <BeatLoader color='#D9A741' />
                </div>
            ) : filteredAdmins.length === 0 ? (
                <div className='text-center py-8 text-black dark:text-white'>
                    {admins.length === 0 ? 'No admins found' : 'No matching admins found'}
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAdmins.map(admin => (
                                    <tr key={admin.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {admin.fullName || admin.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {admin.email || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {admin.phone || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    className="text-blue-600 hover:text-blue-800" 
                                                    onClick={() => {
                                                        setSelectedAdmin(admin);
                                                        setShowViewModal(true);
                                                    }}
                                                >
                                                    <FaEye size={16} />
                                                </button>
                                                <button 
                                                    className="text-petut-brown-300 hover:text-petut-brown-500" 
                                                    onClick={() => {
                                                        setSelectedAdmin(admin);
                                                        setShowEditModal(true);
                                                    }}
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                                <button 
                                                    className="text-red-600 hover:text-red-800" 
                                                    onClick={() => {
                                                        setSelectedAdmin(admin);
                                                        setShowConfirm(true);
                                                    }}
                                                >
                                                    <FaTrashAlt size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                        {filteredAdmins.map(admin => (
                            <div key={admin.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                                <div className="text-center mb-4">
                                    <div className="w-12 h-12 bg-petut-brown-300 rounded-full flex items-center justify-center text-white font-medium text-sm mx-auto mb-2">
                                        {(admin.fullName || admin.name || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                                        {admin.fullName || admin.name || 'N/A'}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {admin.email || 'N/A'}
                                    </p>
                                    {admin.phone && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {admin.phone}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-center space-x-2">
                                    <button 
                                        className="text-blue-600 hover:text-blue-800 p-2" 
                                        onClick={() => {
                                            setSelectedAdmin(admin);
                                            setShowViewModal(true);
                                        }}
                                    >
                                        <FaEye size={16} />
                                    </button>
                                    <button 
                                        className="text-petut-brown-300 hover:text-petut-brown-500 p-2" 
                                        onClick={() => {
                                            setSelectedAdmin(admin);
                                            setShowEditModal(true);
                                        }}
                                    >
                                        <FaEdit size={16} />
                                    </button>
                                    <button 
                                        className="text-red-600 hover:text-red-800 p-2" 
                                        onClick={() => {
                                            setSelectedAdmin(admin);
                                            setShowConfirm(true);
                                        }}
                                    >
                                        <FaTrashAlt size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Confirm Delete Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this admin?</p>
                        <div className="flex justify-end space-x-3">
                            <button 
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                onClick={() => handleDeleteAdmin(selectedAdmin.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Admin Modal */}
            {showViewModal && selectedAdmin && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Details</h3>
                        <div className="space-y-3">
                            <p><strong>Name:</strong> {selectedAdmin.fullName || selectedAdmin.name}</p>
                            <p><strong>Email:</strong> {selectedAdmin.email}</p>
                            <p><strong>Phone:</strong> {selectedAdmin.phone}</p>
                            <p><strong>Role:</strong> Admin</p>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button 
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                onClick={() => setShowViewModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}