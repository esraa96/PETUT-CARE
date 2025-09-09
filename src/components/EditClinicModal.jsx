import React, { Fragment, useState, useEffect, useRef } from 'react';
import MapModal from './MapModal.jsx';
import { toast } from 'react-toastify';
import { doc, updateDoc, collection, query, where, getDocs, getDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase.js';
import logo from '../assets/petut.png';
import { BeatLoader } from 'react-spinners';
import { MdDelete } from 'react-icons/md';
import { IoLocation } from 'react-icons/io5';

export default function EditClinicModal({ clinic, modalId, fetchClinics }) {
    const { name: defaultName, phone: defaultPhone, email: defaultEmail,address: defaultAddress, status: defaultStatus, price: defaultPrice, doctorName: defaultDoctorName, workingHours: defaultWorkingHours } = clinic;

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
    
    const modalRef = useRef(null);
    const [modalInstance, setModalInstance] = useState(null);

    const isAdmin = userData?.role === 'admin';


    useEffect(() => {
        if (modalRef.current && window.bootstrap) {
            const modal = new window.bootstrap.Modal(modalRef.current, {
                keyboard: false,
                backdrop: 'static'
            });
            setModalInstance(modal);
        }
    }, []);

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
        if (loading) return; // منع التنفيذ المتعدد
        
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

            // إضافة بيانات الموقع إذا كانت متوفرة
            if (selectedLocation.latitude) {
                updateData.address = `${selectedLocation?.governorate || ''} - ${selectedLocation?.city || ''} - ${selectedLocation?.street || ''}`;
                updateData.city = selectedLocation?.city;
                updateData.governorate = selectedLocation?.governorate;
                updateData.latitude = selectedLocation?.latitude;
                updateData.longitude = selectedLocation?.longitude;
                updateData.street = selectedLocation?.street;
            }

            // إضافة بيانات الطبيب للأدمن
            if (isAdmin && selectedDoctor) {
                updateData.doctorId = selectedDoctor.id;
                updateData.doctorName = selectedDoctor.fullName;
            }

            await updateDoc(clinicRef, updateData);
            
            toast.success('Clinic updated successfully', { autoClose: 2000 });
            
            // إغلاق المودال
            if (modalInstance) {
                modalInstance.hide();
            }
            
            // تحديث البيانات
            if (fetchClinics) {
                await fetchClinics();
            }
            
            // إعادة تعيين حالة التحرير
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
        if (modalInstance) {
            modalInstance.hide();
        }
        setShowMapModal(true);
    };

    const handleLocationConfirmed = (location) => {
        setSelectedLocation(location);
        setShowMapModal(false);
        if (modalInstance) {
            modalInstance.show();
        }
    };

    const handleCloseMapModal = () => {
        setShowMapModal(false);
        if (modalInstance) {
            modalInstance.show();
        }
    };
    
    return (
        <Fragment>
            <div className="modal fade" id={`editclinic-${modalId}`} ref={modalRef} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Clinic Info</h1>
                            <img src={logo} width={'90px'} height={'90px'} alt="logo" />
                        </div>
                        <div className="modal-body">
                            <form action="#">
                                {/* Clinic Info */}
                                <div className="clinic-name d-flex align-items-center gap-3 mb-3">
                                    <label className="form-label" htmlFor='clinic-name'>Clinic Name</label>
                                    <input type="text" className="form-control w-75" id='clinic-name' placeholder='Enter Clinic Name' value={name} onChange={(e) => setName(e.target.value)} disabled={notEditable} />
                                </div>
                                <div className="clinic-phone d-flex align-items-center gap-3 mb-3">
                                    <label className="form-label" htmlFor='clinic-phone'>Phone</label>
                                    <input type="tel" className="form-control w-75" id='clinic-phone' placeholder='Enter Clinic Phone' value={phone} onChange={(e) => setPhone(e.target.value)} disabled={notEditable} />
                                </div>
                                <div className="clinic-email d-flex align-items-center gap-3 mb-3">
                                    <label className="form-label" htmlFor='clinic-email'>Email</label>
                                    <input type="email" className="form-control w-75" id='clinic-email' placeholder='Enter Clinic Email' value={email} onChange={(e) => setEmail(e.target.value)} disabled={notEditable} />
                                </div>
                                <div className="clinic-price d-flex align-items-center gap-3 mb-3">
                                    <label className="form-label" htmlFor='clinic-price'>Cost</label>
                                    <input type="number" className="form-control w-75" id='clinic-price' placeholder='Enter Cost' value={price} onChange={(e) => setPrice(e.target.value)} disabled={notEditable} />
                                </div>
                                {isAdmin && (
                                    <div className="mb-3 d-flex align-items-center gap-3">
                                        <label className="form-label">Doctor</label>
                                        <select
                                            className="form-select w-50"
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
                                {selectedLocation.latitude && (
                                    <p className="mb-3"><span>Location: </span>{selectedLocation.governorate} - {selectedLocation.city} - {selectedLocation.street}</p>
                                )}
                                <div className="address d-flex align-items-center gap-3 mb-3">
                                    <p className='mb-0'>Choose Location</p>
                                    <button onClick={handleOpenMapModal} className='custom-button d-flex align-items-center gap-2' type='button' disabled={notEditable}>
                                        <IoLocation /> choose location
                                    </button>
                                </div>
                                <div className="status d-flex align-items-center gap-3 mb-3">
                                    <p className='mb-0'>Choose Status</p>
                                    <select name="status" id="status" className="form-select w-50" value={status} onChange={(e) => setStatus(e.target.value)} disabled={notEditable}>
                                        <option value="">Choose Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <hr />
                                <div className="appointment mb-3">
                                    <p className='fw-bold mb-2'>Working Hours</p>
                                    <div className="d-flex align-items-center gap-3 flex-wrap">
                                        <select className="form-select w-auto" value={day} onChange={(e) => setDay(e.target.value)} disabled={notEditable}>
                                            <option value="">Select Day</option>
                                            {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                        <span>from</span>
                                        <input type="time" className="form-control w-auto" value={openTime} onChange={(e) => setOpenTime(e.target.value)} disabled={notEditable} />
                                        <span>to</span>
                                        <input type="time" className="form-control w-auto" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} disabled={notEditable} />
                                        <button type="button" className="btn btn-success ms-2" onClick={handleAddDay} disabled={notEditable}>Add</button>
                                    </div>
                                    {workingHours.length > 0 && (
                                        <ul className="mt-3  list-group w-75">
                                            {workingHours.map((item, index) => (
                                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center mb-2 border rounded px-3 py-2">
                                                    <span>{item.day}: {item.openTime} - {item.closeTime}</span>
                                                    <button className="btn border-0" onClick={() => handleDeleteDay(item.day)} disabled={notEditable}>
                                                        <MdDelete size={25} className='text-danger' />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </form>
                        </div>
                        {notEditable ? (
                            <div className="modal-footer d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-danger" id='close-btn-edit' data-bs-dismiss="modal" style={{ width: '100px' }}>Close</button>
                                <button type="button" className="custom-button" style={{ width: '100px' }} onClick={() => setnotEditable(false)}>Edit</button>
                            </div>
                        ) : (
                            <div className="modal-footer d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-danger" id='close-btn-edit' data-bs-dismiss="modal" style={{ width: '100px' }} onClick={() => {
                                    resetFields();
                                }}>Cancel</button>
                                <button type="button" className="custom-button" style={{ width: '100px' }} onClick={handleSave} disabled={notEditable || loading}>{loading ? <BeatLoader size={10} color="#fff" /> : "Save"}</button>
                            </div>
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