import React, { Fragment, useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import MapModal from './MapModal.jsx';
import { toast } from 'react-toastify';
import { doc, updateDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase.js';
import logo from '../assets/petut.png';
import { BeatLoader } from 'react-spinners';
import { MdDelete } from 'react-icons/md';
import { IoLocation } from 'react-icons/io5';

export default function EditClinicModal({ clinic, onClose, onUpdate, showModal = false }) {
    const { name: defaultName, phone: defaultPhone, email: defaultEmail, address: defaultAddress, status: defaultStatus, price: defaultPrice, doctorName: defaultDoctorName, workingHours: defaultWorkingHours } = clinic;
    const [name, setName] = useState(defaultName);
    const [email, setEmail] = useState(defaultEmail);
    const [phone, setPhone] = useState(defaultPhone);
    const [price, setPrice] = useState(defaultPrice || '');
    const [address, setAddress] = useState(defaultAddress);
    const [doctorName, setDoctorName] = useState(defaultDoctorName);
    const [status, setStatus] = useState(defaultStatus);
    const [notEditable, setnotEditable] = useState(true);
    const [day, setDay] = useState('');
    const [openTime, setOpenTime] = useState('');
    const [closeTime, setCloseTime] = useState('');
    const [workingHours, setWorkingHours] = useState(defaultWorkingHours || []);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(defaultDoctorName);
    const [showMapModal, setShowMapModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState({
        governorate: clinic.governorate || '',
        city: clinic.city || '',
        street: clinic.street || '',
        latitude: clinic.latitude || null,
        longitude: clinic.longitude || null
    });

    const isAdmin = userData?.role === 'admin';

    const closeModal = () => {
        if (onClose) {
            onClose();
        }
        resetFields();
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            }
        };
        fetchUserData();

        const getDoctors = async () => {
            try {
                const q = query(collection(db, "users"), where("role", "==", "doctor"));
                const querySnapshot = await getDocs(q);
                const doctorsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setDoctors(doctorsData);
            } catch (error) {
                toast.error("Failed to fetch doctors: " + error.message, { autoClose: 3000 });
            }
        };
        if (isAdmin) {
            getDoctors();
        }
    }, [isAdmin]);

    const handleAddDay = () => {
        if (day && openTime && closeTime) {
            const exists = workingHours.some(item => item.day === day);
            if (!exists) {
                setWorkingHours([...workingHours, { day, openTime, closeTime }]);
                setDay('');
                setOpenTime('');
                setCloseTime('');
            }
        }
    };

    const handleDeleteDay = (dayDeleted) => {
        setWorkingHours(workingHours.filter(item => item.day !== dayDeleted));
    };

    const handleSave = async () => {
        if (loading) return;
        
        try {
            setLoading(true);
            
            if (!name || !phone || !email || !price || !status || workingHours.length === 0) {
                toast.error("Please fill all required fields.", { autoClose: 3000 });
                return;
            }

            const clinicRef = doc(db, 'clinics', clinic.id);
            const updateData = {
                name: name.trim(),
                phone: phone.trim(),
                email: email.trim(),
                price: parseFloat(price),
                status,
                workingHours,
                updatedAt: new Date()
            };

            if (selectedLocation.latitude) {
                updateData.address = `${selectedLocation?.governorate || ''} - ${selectedLocation?.city || ''} - ${selectedLocation?.street || ''}`;
                updateData.city = selectedLocation?.city;
                updateData.governorate = selectedLocation?.governorate;
                updateData.latitude = selectedLocation?.latitude;
                updateData.longitude = selectedLocation?.longitude;
                updateData.street = selectedLocation?.street;
            }

            if (isAdmin && selectedDoctor) {
                updateData.doctorId = selectedDoctor.id;
                updateData.doctorName = selectedDoctor.fullName;
            }

            await updateDoc(clinicRef, updateData);
            
            toast.success('Clinic updated successfully', { autoClose: 2000 });
            closeModal();
            
            if (onUpdate) {
                await onUpdate();
            }
            
            setnotEditable(true);

        } catch (error) {
            console.error('Update error:', error);
            toast.error("Failed to update clinic: " + error.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const resetFields = () => {
        setName(defaultName);
        setEmail(defaultEmail);
        setPhone(defaultPhone);
        setStatus(defaultStatus);
        setPrice(defaultPrice || '');
        setDoctorName(defaultDoctorName);
        setWorkingHours(defaultWorkingHours);
        setnotEditable(true);
        setAddress('');
        setDay('');
        setOpenTime('');
        setCloseTime('');
    };

    const handleOpenMapModal = () => {
        setShowMapModal(true);
    };

    const handleLocationConfirmed = (location) => {
        setSelectedLocation(location);
        setShowMapModal(false);
    };

    const handleCloseMapModal = () => {
        setShowMapModal(false);
    };
    
    if (!showModal) return null;

    return (
        <Fragment>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <img src={logo} width={60} height={60} alt="logo" className="rounded-lg" />
                                <h2 className="text-xl font-bold text-gray-800">Edit Clinic</h2>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300 disabled:bg-gray-100" 
                                        placeholder="Enter Clinic Name" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        disabled={notEditable} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300 disabled:bg-gray-100" 
                                        placeholder="Enter Phone Number" 
                                        value={phone} 
                                        onChange={(e) => setPhone(e.target.value)} 
                                        disabled={notEditable} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300 disabled:bg-gray-100" 
                                        placeholder="Enter Email Address" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        disabled={notEditable} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Cost ($)</label>
                                    <input 
                                        type="number" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300 disabled:bg-gray-100" 
                                        placeholder="Enter Cost" 
                                        value={price} 
                                        onChange={(e) => setPrice(e.target.value)} 
                                        disabled={notEditable} 
                                    />
                                </div>
                            </div>

                            {/* Doctor Selection & Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {isAdmin && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign Doctor</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300 disabled:bg-gray-100"
                                            value={selectedDoctor ? `${selectedDoctor.id}|${selectedDoctor.fullName}` : ''}
                                            onChange={(e) => {
                                                const [id, fullName] = e.target.value.split('|');
                                                setSelectedDoctor({ id, fullName });
                                            }}
                                            disabled={notEditable}
                                        >
                                            <option value="">Select a doctor</option>
                                            {doctors.map((doctor) => (
                                                <option key={doctor.id} value={`${doctor.id}|${doctor.fullName}`}>{doctor.fullName}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300 disabled:bg-gray-100" 
                                        value={status} 
                                        onChange={(e) => setStatus(e.target.value)} 
                                        disabled={notEditable}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Location</label>
                                {selectedLocation.latitude && (
                                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm font-medium text-blue-800">Current Location:</p>
                                        <p className="text-sm text-blue-700">
                                            {selectedLocation.governorate} - {selectedLocation.city} - {selectedLocation.street}
                                        </p>
                                    </div>
                                )}
                                <button 
                                    onClick={handleOpenMapModal} 
                                    className="flex items-center gap-2 px-4 py-2 bg-petut-brown-300 text-white rounded-lg hover:bg-petut-brown-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                                    type="button" 
                                    disabled={notEditable}
                                >
                                    <IoLocation className="w-4 h-4" />
                                    Choose Location
                                </button>
                            </div>

                            {/* Working Hours */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Working Hours</h3>
                                
                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                                            <select 
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300 disabled:bg-gray-100" 
                                                value={day} 
                                                onChange={(e) => setDay(e.target.value)} 
                                                disabled={notEditable}
                                            >
                                                <option value="">Select Day</option>
                                                {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Open Time</label>
                                            <input 
                                                type="time" 
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300 disabled:bg-gray-100" 
                                                value={openTime} 
                                                onChange={(e) => setOpenTime(e.target.value)} 
                                                disabled={notEditable} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Close Time</label>
                                            <input 
                                                type="time" 
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300 disabled:bg-gray-100" 
                                                value={closeTime} 
                                                onChange={(e) => setCloseTime(e.target.value)} 
                                                disabled={notEditable} 
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <button 
                                                type="button" 
                                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                                                onClick={handleAddDay} 
                                                disabled={notEditable}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {workingHours.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Current Working Days:</h4>
                                        <div className="space-y-2">
                                            {workingHours.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                                    <div>
                                                        <span className="font-medium text-green-800">{item.day}</span>
                                                        <span className="text-sm text-green-600 ml-2">{item.openTime} - {item.closeTime}</span>
                                                    </div>
                                                    <button 
                                                        className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                                                        onClick={() => handleDeleteDay(item.day)} 
                                                        disabled={notEditable}
                                                    >
                                                        <MdDelete className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                            {notEditable ? (
                                <>
                                    <button 
                                        type="button" 
                                        onClick={closeModal} 
                                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setnotEditable(false)} 
                                        className="px-6 py-2 bg-petut-brown-300 text-white rounded-lg hover:bg-petut-brown-400 transition-colors"
                                    >
                                        Edit
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        type="button" 
                                        onClick={closeModal} 
                                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={handleSave} 
                                        disabled={notEditable || loading} 
                                        className="px-6 py-2 bg-petut-brown-300 text-white rounded-lg hover:bg-petut-brown-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {loading ? <BeatLoader size={10} color="#fff" /> : "Save"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            {showMapModal && (
                <MapModal
                    onLocationConfirmed={handleLocationConfirmed}
                    onClose={handleCloseMapModal}
                    initialLocation={selectedLocation}
                />
            )}
        </Fragment>
    );
}