import { Fragment, useState } from 'react'
import { FaUserDoctor } from "react-icons/fa6";
import { ImLocation2 } from "react-icons/im";
import { FaMobileAlt } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { IoTimer } from "react-icons/io5";
import { HiMiniUserGroup } from "react-icons/hi2";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import AppointmentsModal from './AppointmentsModal';
import Editclinicmodal from '../EditClinicModal';
import ConfirmModal from '../ConfirmModal';



//get clinics from firebase 
export default function Clinic({ clinic, onDelete, fetchClinics }) {
    const { name, address, phone, email, status } = clinic

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedClinicId, setSelectedClinicId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);



    return (
        <Fragment>
            <div className="dashboard-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <FaUserDoctor size={30} className='text-[#D9A741]' />
                        <div>
                            <h1 className='font-bold text-lg text-gray-800'>{name}</h1>
                        </div>
                    </div>
                    <div>
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                            clinic.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                        }`}>
                            {status}
                        </span>
                    </div>
                </div>
                
                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <ImLocation2 className='text-[#D9A741]' />
                        <p className='mb-0'>{address?.governorate} - {address?.city}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <FaMobileAlt className='text-[#D9A741]' />
                        <p className='mb-0'>{phone}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-600">
                            <MdOutlineMail className='text-[#D9A741]' />
                            <p className='mb-0'>{email}</p>
                        </div>
                        <button
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => {
                                setSelectedClinicId(clinic.id);
                                setShowConfirm(true);
                            }}
                        >
                            <MdDelete size={20} className='text-red-500 hover:text-red-700' />
                        </button>
                    </div>
                    {showConfirm && (
                        <ConfirmModal onDelete={() => onDelete(selectedClinicId)} setShowConfirm={setShowConfirm} setSelectedClinicId={setSelectedClinicId} whatDelete={"clinic"} />
                    )}
                    {showEditModal && (
                        <Editclinicmodal 
                            clinic={clinic} 
                            onClose={() => setShowEditModal(false)} 
                            onUpdate={fetchClinics}
                            showModal={showEditModal}
                        />
                    )}
                    {showAppointmentsModal && (
                        <AppointmentsModal 
                            clinic={clinic} 
                            onClose={() => setShowAppointmentsModal(false)}
                            showModal={showAppointmentsModal}
                        />
                    )}
                </div>
                
                <hr className='border-gray-200 my-4' />
                
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <IoTimer className='text-[#D9A741]' />
                        <button type="button" className="text-[#D9A741] hover:text-[#C19635] font-medium" onClick={() => setShowAppointmentsModal(true)}>
                            Appointments
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <HiMiniUserGroup className='text-[#D9A741]' />
                        <button type="button" className="text-[#D9A741] hover:text-[#C19635] font-medium">
                            Patients
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" className="flex items-center gap-1 text-[#D9A741] hover:text-[#C19635] font-medium" onClick={() => setShowEditModal(true)}>
                            <TbEdit />Edit data
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}


