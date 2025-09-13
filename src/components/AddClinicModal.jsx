import { Fragment, useEffect, useState } from 'react';
import { MdDelete } from "react-icons/md";
import { FaTimes } from 'react-icons/fa';
import { collection, addDoc, Timestamp, setDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db, auth } from '../firebase.js';
import logo from '../assets/petut.png';
import { BeatLoader } from 'react-spinners';
import { IoLocation } from "react-icons/io5";
import SimpleMapModal from './SimpleMapModal.jsx';

export default function AddClinicModal({ fetchClinics, loading, setLoading, showModal, setShowModal }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [price, setPrice] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [day, setDay] = useState('');
    const [openTime, setOpenTime] = useState('');
    const [closeTime, setCloseTime] = useState('');
    const [workingHours, setWorkingHours] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [userData, setUserData] = useState(null);
    const [showMapModal, setShowMapModal] = useState(false);

    const isAdmin = userData?.role === 'admin';



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
    }, []);

    useEffect(() => {
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
        if (!day || !openTime || !closeTime) {
            toast.error('Please select day and time', { autoClose: 2000 });
            return;
        }
        
        const exists = workingHours.some(item => item.day === day);
        if (exists) {
            toast.error('This day is already added', { autoClose: 2000 });
            return;
        }
        
        if (openTime >= closeTime) {
            toast.error('Close time must be after open time', { autoClose: 2000 });
            return;
        }
        
        setWorkingHours(prev => [...prev, { day, openTime, closeTime }]);
        setDay('');
        setOpenTime('');
        setCloseTime('');
        toast.success('Working day added successfully', { autoClose: 1500 });
    };

    const handleDeleteDay = (dayDeleted) => {
        setWorkingHours(workingHours.filter(item => item.day !== dayDeleted));
    };

    const resetFields = () => {
        setName('');
        setPhone('');
        setEmail('');
        setStatus('');
        setWorkingHours([]);
        setPrice('');
        setDay('');
        setOpenTime('');
        setCloseTime('');
        setSelectedDoctor(null);
        setSelectedLocation('');
    };

    const closeModal = () => {
        if (setShowModal) {
            setShowModal(false);
        }
        resetFields();
    };

    const handleAddClinic = async () => {
        if (!name.trim()) {
            toast.error('Please enter clinic name', { autoClose: 3000 });
            return;
        }
        if (!phone.trim()) {
            toast.error('Please enter phone number', { autoClose: 3000 });
            return;
        }
        if (!email.trim()) {
            toast.error('Please enter email', { autoClose: 3000 });
            return;
        }
        if (!price.trim()) {
            toast.error('Please enter consultation cost', { autoClose: 3000 });
            return;
        }
        if (!status) {
            toast.error('Please select clinic status', { autoClose: 3000 });
            return;
        }
        if (!selectedLocation) {
            toast.error('Please select clinic location', { autoClose: 3000 });
            return;
        }
        if (workingHours.length === 0) {
            toast.error('Please add at least one working day', { autoClose: 3000 });
            return;
        }
        if (isAdmin && !selectedDoctor) {
            toast.error('Please select a doctor', { autoClose: 3000 });
            return;
        }
        
        setLoading(true);

        try {
            const clinicData = {
                name: name.trim(),
                phone: phone.trim(),
                email: email.trim(),
                workingHours: workingHours || [],
                status,
                price: parseFloat(price),
                address: `${selectedLocation?.governorate || ''} - ${selectedLocation?.city || ''} - ${selectedLocation?.street || ''}`,
                city: selectedLocation?.city || '',
                governorate: selectedLocation?.governorate || '',
                latitude: selectedLocation?.latitude || 0,
                longitude: selectedLocation?.longitude || 0,
                street: selectedLocation?.street || '',
                doctorId: isAdmin ? selectedDoctor?.id : auth.currentUser?.uid,
                doctorName: isAdmin ? selectedDoctor?.fullName : userData?.fullName || '',
                createdAt: Timestamp.now(),
            };

            const docRef = await addDoc(collection(db, 'clinics'), clinicData);
            await setDoc(docRef, { ...clinicData, clinicId: docRef.id });
            toast.success('Clinic added successfully', { autoClose: 3000 });
            closeModal();
            
            if (fetchClinics) {
                await fetchClinics();
            }

        } catch (error) {
            toast.error("Failed to add clinic: " + error.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
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

    return (
        <Fragment>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                            <div className="flex items-center gap-3">
                                <img src={logo} width={60} height={60} alt="logo" className="rounded-lg" />
                                <h2 className="text-xl font-bold text-black dark:text-white">Add New Clinic</h2>
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
                                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Enter Clinic Name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Enter Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Enter Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Cost ($)</label>
                                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Enter Cost" value={price} onChange={(e) => setPrice(e.target.value)} />
                                </div>
                            </div>

                            {/* Doctor Selection & Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {isAdmin && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign Doctor</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300"
                                            value={selectedDoctor ? `${selectedDoctor.id}|${selectedDoctor.fullName}` : ''}
                                            onChange={(e) => {
                                                const [id, fullName] = e.target.value.split('|');
                                                setSelectedDoctor({ id, fullName });
                                            }}
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
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="">Select Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Location</label>
                                <button onClick={handleOpenMapModal} className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors" type="button">
                                    <IoLocation className="w-4 h-4" />
                                    Choose Location
                                </button>
                                {selectedLocation && (
                                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm font-medium text-green-800">Selected Location:</p>
                                        <p className="text-sm text-green-700">
                                            {selectedLocation.governorate} - {selectedLocation.city}
                                            {selectedLocation.street && ` - ${selectedLocation.street}`}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Working Hours */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-800">Working Hours</h3>
                                    <span className="text-sm text-gray-500">Add at least one working day</span>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" value={day} onChange={(e) => setDay(e.target.value)}>
                                                <option value="">Select Day</option>
                                                {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
                                                    .filter(d => !workingHours.some(wh => wh.day === d))
                                                    .map(d => (
                                                        <option key={d} value={d}>{d}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Open Time</label>
                                            <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" value={openTime} onChange={(e) => setOpenTime(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Close Time</label>
                                            <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} />
                                        </div>
                                        <div className="flex items-end">
                                            <button type="button" className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" onClick={handleAddDay}>
                                                + Add Day
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {workingHours.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Added Working Days ({workingHours.length}):</h4>
                                        <div className="space-y-2">
                                            {workingHours.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                                    <div>
                                                        <span className="font-medium text-green-800">{item.day}</span>
                                                        <span className="text-sm text-green-600 ml-2">{item.openTime} - {item.closeTime}</span>
                                                    </div>
                                                    <button className="text-red-600 hover:text-red-800 transition-colors" onClick={() => handleDeleteDay(item.day)} title="Remove this day">
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
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-600">
                            <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button type="button" onClick={handleAddClinic} disabled={loading} className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                {loading ? <BeatLoader size={10} color='#fff' /> : 'Add Clinic'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showMapModal && (
                <SimpleMapModal
                    onLocationConfirmed={handleLocationConfirmed}
                    onClose={handleCloseMapModal}
                    initialLocation={selectedLocation}
                />
            )}
        </Fragment>
    );
}