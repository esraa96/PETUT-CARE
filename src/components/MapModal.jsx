// MapModal.jsx

import React, { Fragment, useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { toast } from 'react-toastify';
import 'leaflet/dist/leaflet.css';
import { BeatLoader } from 'react-spinners';

// 💡 تأكد من أن هذه الأسطر موجودة كما هي
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder'; 

export default function MapModal({ onLocationConfirmed, onClose, initialLocation }) {
    const mapRef = useRef(null);
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [loading, setLoading] = useState(false);

    const [position, setPosition] = useState(initialLocation ? { lat: initialLocation.latitude, lng: initialLocation.longitude } : null);

useEffect(() => {
    const showModal = () => {
        const modalElement = document.getElementById('map-modal');
        if (modalElement) {
            // Manual modal display
            modalElement.classList.add('show');
            modalElement.style.display = 'block';
            document.body.classList.add('modal-open');
            
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            backdrop.id = 'map-modal-backdrop';
            document.body.appendChild(backdrop);
        }
    };

    const timer = setTimeout(showModal, 100);
    
    return () => {
        clearTimeout(timer);
        const modalElement = document.getElementById('map-modal');
        const backdrop = document.getElementById('map-modal-backdrop');
        if (modalElement) {
            modalElement.classList.remove('show');
            modalElement.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
        if (backdrop) {
            backdrop.remove();
        }
    };
}, []);

    useEffect(() => {
        const initMap = () => {
            const mapContainer = document.getElementById('map-container');
            if (!mapContainer || mapRef.current) return;
            
            setLoading(true);
            const initialCoords = initialLocation ? [initialLocation.latitude, initialLocation.longitude] : [30.0444, 31.2357];
            
            try {
                const map = L.map('map-container').setView(initialCoords, 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const geocoder = L.Control.Geocoder.nominatim();
            const control = L.Control.geocoder({
                geocoder: geocoder,
                defaultMarkGeocode: false
            }).on('markgeocode', function (e) {
                const latlng = e.geocode.center;
                map.setView(latlng, 16);
                handleMarkerUpdate(latlng.lat, latlng.lng);
            }).addTo(map);

            let marker = L.marker(initialCoords).addTo(map);
             
            const handleMarkerUpdate = async (lat, lng) => {
                setLoading(true);
                marker.setLatLng([lat, lng]);
                
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const data = await response.json();
                    
                    const address = data.address;
                    setSelectedLocation({
                        latitude: lat,
                        longitude: lng,
                        governorate: address.state || address.province || '',
                        city: address.city || address.town || address.village || '',
                        street: address.road || address.street || ''
                    });
                } catch (error) {
                    toast.error("Failed to get address: " + error.message, { autoClose: 3000 });
                } finally {
                    setLoading(false);
                }
            };
            
            map.on('click', (e) => {
                handleMarkerUpdate(e.latlng.lat, e.latlng.lng);
            });

                mapRef.current = map;
                setLoading(false);
            } catch (error) {
                console.error('Error initializing map:', error);
                setLoading(false);
            }
        };
        
        // Wait for modal to be fully shown
        const timer = setTimeout(initMap, 500);
        return () => clearTimeout(timer);
    }, [initialLocation]);

    // Cleanup map on unmount
    useEffect(() => {
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return (
        <div className="modal fade" id="map-modal" tabIndex={-1} aria-labelledby="mapModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content" style={{ height: '90vh' }}>
                    <div className="modal-header">
                        <h5 className="modal-title" id="mapModalLabel">Select Clinic Location</h5>
                        <button type="button" className="btn-close" onClick={() => {
                            if (mapRef.current) {
                                mapRef.current.remove();
                                mapRef.current = null;
                            }
                            onClose();
                        }}></button>
                    </div>
                    <div className="modal-body">
                        <div className="position-relative" style={{ height: '500px' }}>
                            {loading && (
                                <div className="d-flex justify-content-center align-items-center position-absolute w-100 h-100" style={{ zIndex: 1000, backgroundColor: 'rgba(255,255,255,0.8)' }}>
                                    <BeatLoader color="#D9A741" />
                                </div>
                            )}
                            <div id="map-container" style={{ height: '100%', width: '100%', minHeight: '500px' }}></div>
                        </div>
                        {selectedLocation && (
                            <div className="mt-3">
                                <p><strong>Selected Address:</strong> {selectedLocation.governorate}, {selectedLocation.city}, {selectedLocation.street}</p>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer mt-5">
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            if (mapRef.current) {
                                mapRef.current.remove();
                                mapRef.current = null;
                            }
                            onClose();
                        }}>Close</button>
                        <button type="button" className="btn custom-button" onClick={() => {
                            if (mapRef.current) {
                                mapRef.current.remove();
                                mapRef.current = null;
                            }
                            onLocationConfirmed(selectedLocation);
                        }} disabled={loading}>
                            Confirm Location
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}