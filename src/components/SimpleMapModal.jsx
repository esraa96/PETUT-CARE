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
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
            <div className="modal-backdrop fade show"></div>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Select Clinic Location</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Governorate</label>
                                <select 
                                    className="form-select"
                                    value={location.governorate}
                                    onChange={(e) => setLocation(prev => ({ ...prev, governorate: e.target.value }))}
                                >
                                    <option value="">Select Governorate</option>
                                    {governorates.map(gov => (
                                        <option key={gov} value={gov}>{gov}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">City</label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    placeholder="Enter city name"
                                    value={location.city}
                                    onChange={(e) => setLocation(prev => ({ ...prev, city: e.target.value }))}
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Street Address</label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    placeholder="Enter street address"
                                    value={location.street}
                                    onChange={(e) => setLocation(prev => ({ ...prev, street: e.target.value }))}
                                />
                            </div>
                            <div className="col-12">
                                <button 
                                    type="button" 
                                    className="btn btn-outline-primary"
                                    onClick={getCurrentLocation}
                                >
                                    📍 Use Current Location
                                </button>
                            </div>
                            {location.governorate && location.city && (
                                <div className="col-12">
                                    <div className="alert alert-info">
                                        <strong>Selected Location:</strong><br/>
                                        {location.governorate} - {location.city}
                                        {location.street && ` - ${location.street}`}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            className="custom-button" 
                            onClick={handleConfirm}
                            disabled={!location.governorate || !location.city}
                        >
                            Confirm Location
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}