import { Fragment, useEffect, useRef, useState } from 'react';
import { MdDelete } from "react-icons/md";
import { collection, addDoc, Timestamp, setDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';

import 'leaflet/dist/leaflet.css';
import { db, auth } from '../firebase.js';
import logo from '../assets/petut.png';
import { BeatLoader } from 'react-spinners';
import { IoLocation } from "react-icons/io5";

// استدعاء مكون الخريطة المبسط
import SimpleMapModal from './SimpleMapModal.jsx';

export default function AddClinicModal({ fetchClinics, loading, setLoading }) {
    // حالة المودال والبيانات
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
    // حالة ظهور مودال الخريطة
    const [showMapModal, setShowMapModal] = useState(false);

    const navigate = useNavigate();
    const isAdmin = userData?.role === 'admin';
    const location = useLocation();

    const modalRef = useRef(null);
    const [modalInstance, setModalInstance] = useState(null);

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

    // ... (باقي الدوال)
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

    const handleAddClinic = async () => {
        // التحقق من صحة البيانات
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
            resetFields();

            if (modalInstance) {
                modalInstance.hide();
            }
            
            if (fetchClinics) {
                await fetchClinics();
            }

        } catch (error) {
            toast.error("Failed to add clinic: " + error.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    // دالة لفتح مودال الخريطة
    const handleOpenMapModal = () => {
        setShowMapModal(true);
    };

    // دالة لاستقبال الموقع من مودال الخريطة
    const handleLocationConfirmed = (location) => {
        setSelectedLocation(location);
        setShowMapModal(false);
    };

    // دالة لإغلاق مودال الخريطة دون تغيير الموقع
    const handleCloseMapModal = () => {
        setShowMapModal(false);
    };

    useEffect(() => {
        // تحقق من وجود Bootstrap وإنشاء المودال
        const initModal = () => {
            if (modalRef.current && window.bootstrap && window.bootstrap.Modal) {
                const modal = new window.bootstrap.Modal(modalRef.current, {
                    keyboard: false,
                    backdrop: 'static'
                });
                setModalInstance(modal);
            }
        };
        
        // انتظار تحميل Bootstrap
        if (window.bootstrap) {
            initModal();
        } else {
            const timer = setTimeout(initModal, 1000);
            return () => clearTimeout(timer);
        }
    }, []);
    return (
        <Fragment>
            {/* هذا هو المودال الرئيسي الذي يحتوي على النموذج */}
            <div className="modal fade" id="addclinic" ref={modalRef} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-lg" style={{maxHeight: '90vh', overflowY: 'auto'}}>
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between py-0 pe-0">
                            <h1 className="modal-title fs-5">Clinic Info</h1>
                            <div className="d-flex align-items-center gap-2">
                                <img src={logo} width="90px" height="90px" alt="logo" />
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => {
                                        resetFields();
                                        if (modalInstance) {
                                            modalInstance.hide();
                                        }
                                    }}
                                ></button>
                            </div>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="clinic-name d-flex align-items-center gap-3 mb-3">
                                    <label className="form-label">Clinic Name</label>
                                    <input type="text" className="form-control w-75" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="clinic-phone d-flex align-items-center gap-3 mb-3">
                                    <label className="form-label">Phone</label>
                                    <input type="tel" className="form-control w-75" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                                <div className="clinic-email d-flex align-items-center gap-3 mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control w-75" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="clinic-price d-flex align-items-center gap-3 mb-3">
                                    <label className="form-label">Cost</label>
                                    <input type="number" className="form-control w-75" value={price} onChange={(e) => setPrice(e.target.value)} />
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
                                        >
                                            <option value="">Select a doctor</option>
                                            {doctors.map((doctor) => (
                                                <option key={doctor.id} value={`${doctor.id}|${doctor.fullName}`}>{doctor.fullName}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="status d-flex align-items-center gap-3 mb-3">
                                    <p className='mb-0'>Choose Status</p>
                                    <select className="form-select w-50" value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="">Choose Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                {/* هذا هو الزر الذي سيفتح مودال الخريطة */}
                                <div className="address d-flex align-items-center gap-3 mb-3">
                                    <p className='mb-0'>Choose Location</p>
                                    <button onClick={handleOpenMapModal} className='custom-button d-flex align-items-center gap-2' type='button'>
                                        <IoLocation /> choose location
                                    </button>
                                </div>
                                {selectedLocation && (
                                    <div className="alert alert-success mt-2">
                                        <strong>Selected Location:</strong><br/>
                                        {selectedLocation.governorate} - {selectedLocation.city}
                                        {selectedLocation.street && ` - ${selectedLocation.street}`}
                                    </div>
                                )}

                                <hr />
                                <div className="appointment mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <p className='fw-bold mb-0'>Working Hours</p>
                                        <small className="text-muted">Add at least one working day</small>
                                    </div>
                                    
                                    <div className="card border-light bg-light p-3 mb-3">
                                        <div className="row g-2 align-items-end">
                                            <div className="col-md-3">
                                                <label className="form-label small">Day</label>
                                                <select 
                                                    className="form-select" 
                                                    value={day} 
                                                    onChange={(e) => setDay(e.target.value)}
                                                >
                                                    <option value="">Select Day</option>
                                                    {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
                                                        .filter(d => !workingHours.some(wh => wh.day === d))
                                                        .map(d => (
                                                            <option key={d} value={d}>{d}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label small">Open Time</label>
                                                <input 
                                                    type="time" 
                                                    className="form-control" 
                                                    value={openTime} 
                                                    onChange={(e) => setOpenTime(e.target.value)} 
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label small">Close Time</label>
                                                <input 
                                                    type="time" 
                                                    className="form-control" 
                                                    value={closeTime} 
                                                    onChange={(e) => setCloseTime(e.target.value)} 
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <button 
                                                    type="button" 
                                                    className="btn btn-success w-100"
                                                    onClick={handleAddDay}
                                                >
                                                    + Add Day
                                                </button>

                                            </div>
                                        </div>
                                    </div>

                                    {workingHours.length > 0 && (
                                        <div className="mt-3">
                                            <h6 className="mb-2">Added Working Days ({workingHours.length}):</h6>
                                            <div className="row g-2">
                                                {workingHours.map((item, index) => (
                                                    <div key={index} className="col-12">
                                                        <div className="card border-success">
                                                            <div className="card-body p-2 d-flex justify-content-between align-items-center">
                                                                <div>
                                                                    <strong className="text-success">{item.day}</strong>
                                                                    <br/>
                                                                    <small className="text-muted">{item.openTime} - {item.closeTime}</small>
                                                                </div>
                                                                <button 
                                                                    className="btn btn-outline-danger btn-sm" 
                                                                    onClick={() => handleDeleteDay(item.day)}
                                                                    title="Remove this day"
                                                                >
                                                                    <MdDelete size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </form>
                        </div>
                        <div className="modal-footer d-flex justify-content-end gap-2">
                            <button 
                                type="button" 
                                className="btn btn-danger" 
                                onClick={() => {
                                    resetFields();
                                    if (modalInstance) {
                                        modalInstance.hide();
                                    }
                                }}
                                style={{ width: '100px' }}
                            >
                                Close
                            </button>
                            <button type="button" className="custom-button" style={{ width: '100px' }} onClick={handleAddClinic} disabled={loading}>
                                {loading ? <BeatLoader size={10} color='#fff' /> : 'Add Clinic'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* هذا هو المودال المبسط للموقع */}
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