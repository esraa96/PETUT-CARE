import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function SimpleMapModal({ onLocationConfirmed, onClose, initialLocation }) {
    const [location, setLocation] = useState({
        governorate: initialLocation?.governorate || '',
        city: initialLocation?.city || '',
        street: initialLocation?.street || '',
        latitude: initialLocation?.latitude || 30.0444,
        longitude: initialLocation?.longitude || 31.2357
    });

    const governorates = [
        'Cairo', 'Alexandria', 'Giza', 'Qalyubia', 'Port Said', 'Suez',
        'Luxor', 'Aswan', 'Asyut', 'Beheira', 'Beni Suef', 'Dakahlia',
        'Damietta', 'Fayyum', 'Gharbia', 'Ismailia', 'Kafr el-Sheikh',
        'Matrouh', 'Minya', 'Monufia', 'New Valley', 'North Sinai',
        'Qena', 'Red Sea', 'Sharqia', 'Sohag', 'South Sinai'
    ];

    const handleConfirm = () => {
        if (!location.governorate || !location.city) {
            toast.error('Please select governorate and city');
            return;
        }
        onLocationConfirmed(location);
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }));
                    toast.success('Location updated');
                },
                (error) => {
                    toast.error('Could not get current location');
                }
            );
        } else {
            toast.error('Geolocation is not supported');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-none sm:rounded-lg shadow-xl w-full h-full sm:max-w-2xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Select Clinic Location</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Governorate</label>
                            <select 
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300"
                                value={location.governorate}
                                onChange={(e) => setLocation(prev => ({ ...prev, governorate: e.target.value }))}
                            >
                                <option value="">Select Governorate</option>
                                {governorates.map(gov => (
                                    <option key={gov} value={gov}>{gov}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300"
                                placeholder="Enter city name"
                                value={location.city}
                                onChange={(e) => setLocation(prev => ({ ...prev, city: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Street Address</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300"
                            placeholder="Enter street address"
                            value={location.street}
                            onChange={(e) => setLocation(prev => ({ ...prev, street: e.target.value }))}
                        />
                    </div>
                    <div>
                        <button 
                            type="button" 
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                            onClick={getCurrentLocation}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Use Current Location
                        </button>
                    </div>
                    {location.governorate && location.city && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-lg">
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Selected Location:</p>
                            <p className="text-sm text-blue-700 dark:text-blue-400">
                                {location.governorate} - {location.city}
                                {location.street && ` - ${location.street}`}
                            </p>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-600">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-white bg-gray-100 dark:bg-black hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        onClick={handleConfirm}
                        disabled={!location.governorate || !location.city}
                        className="px-6 py-2 bg-petut-brown-300 text-white rounded-lg hover:bg-petut-brown-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm Location
                    </button>
                </div>
            </div>
        </div>
    );
}