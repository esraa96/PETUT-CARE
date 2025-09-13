import React, { useState } from 'react'
import { FaEdit, FaTrashAlt, FaSearch, FaEye } from "react-icons/fa";
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase.js';

export default function Clientstable({ clients, setClients, fetchClients, loading }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('all');
    const [showConfirm, setShowConfirm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    const handleDeleteClient = async (clientId) => {
        try {
            await deleteDoc(doc(db, 'users', clientId));
            setClients(clients => clients.filter(client => client.id !== clientId));
            toast.success('Client deleted successfully', { autoClose: 3000 });
        } catch (err) {
            toast.error("Failed to delete client: " + err.message, { autoClose: 3000 });
        } finally {
            setShowConfirm(false);
        }
    }

    const filteredClients = clients.filter((client) => {
        const nameMatch = (client.fullName || client.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = (client.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const genderMatch = genderFilter === 'all' || client.gender === genderFilter;
        return (nameMatch || emailMatch) && genderMatch;
    });

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                    <input
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        type="text"
                        placeholder="Search by name or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
                <select 
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300" 
                    value={genderFilter} 
                    onChange={(e) => setGenderFilter(e.target.value)}
                >
                    <option value="all">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            {loading ? (
                <div className='text-center py-8'>
                    <BeatLoader color='#D9A741' />
                </div>
            ) : filteredClients.length === 0 ? (
                <div className='text-center py-8 text-black dark:text-white'>
                    {clients.length === 0 ? 'No clients found' : 'No matching clients found'}
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200 dark:divide-gray-600">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                                {filteredClients.map(client => (
                                    <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                            {client.fullName || client.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                            {client.email || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                            {client.phone || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                                                client.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
                                            }`}>
                                                {client.gender || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    className="text-blue-600 hover:text-blue-800" 
                                                    onClick={() => {
                                                        setSelectedClient(client);
                                                        setShowViewModal(true);
                                                    }}
                                                >
                                                    <FaEye size={16} />
                                                </button>
                                                <button 
                                                    className="text-yellow-400 hover:text-yellow-500" 
                                                    onClick={() => {
                                                        setSelectedClient(client);
                                                        setShowEditModal(true);
                                                    }}
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                                <button 
                                                    className="text-red-600 hover:text-red-800" 
                                                    onClick={() => {
                                                        setSelectedClient(client);
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
                        {filteredClients.map(client => (
                            <div key={client.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                                <div className="text-center mb-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-sm mx-auto mb-2 ${
                                        client.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
                                    }`}>
                                        {(client.fullName || client.name || 'C').charAt(0).toUpperCase()}
                                    </div>
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                                        {client.fullName || client.name || 'N/A'}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {client.email || 'N/A'}
                                    </p>
                                    {client.phone && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {client.phone}
                                        </p>
                                    )}
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white mt-2 ${
                                        client.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
                                    }`}>
                                        {client.gender || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-center space-x-2">
                                    <button 
                                        className="text-blue-600 hover:text-blue-800 p-2" 
                                        onClick={() => {
                                            setSelectedClient(client);
                                            setShowViewModal(true);
                                        }}
                                    >
                                        <FaEye size={16} />
                                    </button>
                                    <button 
                                        className="text-yellow-400 hover:text-yellow-500 p-2" 
                                        onClick={() => {
                                            setSelectedClient(client);
                                            setShowEditModal(true);
                                        }}
                                    >
                                        <FaEdit size={16} />
                                    </button>
                                    <button 
                                        className="text-red-600 hover:text-red-800 p-2" 
                                        onClick={() => {
                                            setSelectedClient(client);
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
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this client?</p>
                        <div className="flex justify-end space-x-3">
                            <button 
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                onClick={() => handleDeleteClient(selectedClient.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Client Modal */}
            {showViewModal && selectedClient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Details</h3>
                        <div className="space-y-3">
                            <p><strong>Name:</strong> {selectedClient.fullName || selectedClient.name}</p>
                            <p><strong>Email:</strong> {selectedClient.email}</p>
                            <p><strong>Phone:</strong> {selectedClient.phone}</p>
                            <p><strong>Gender:</strong> {selectedClient.gender}</p>
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