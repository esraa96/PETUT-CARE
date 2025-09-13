import React, { Fragment } from 'react'
import logo from '../../assets/petut.png';
import { MdDelete } from 'react-icons/md';
export default function AppointmentsModal({ clinic, onClose, showModal = false }) {
    const { workingHours: defaultHours } = clinic;

    if (!showModal) return null;

    return (
        <Fragment>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Clinic Appointments</h2>
                        <img src={logo} width={60} height={60} alt="logo" className="rounded-lg" />
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <h3 className="font-bold text-lg mb-3 text-gray-800">Working Hours</h3>
                            {defaultHours?.length > 0 ? (
                                <div className="space-y-2">
                                    {defaultHours.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                            <span className="text-gray-600">{item.day}: {item.openTime} - {item.closeTime}</span>
                                            <button className="text-red-500 cursor-not-allowed opacity-50" disabled>
                                                <MdDelete size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No working hours set</p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end p-6 border-t border-gray-200">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
