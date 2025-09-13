import React, { Fragment } from 'react'
import logo from '../../assets/petut.png'
export default function ViewClinicModal({ clinic, modalId }) {
    if (!clinic) return null;
    const { name, address = {}, phone, email, status, workingHours= [], doctorName, price } = clinic;
    const { governorate, city } = address;
    const { day, openTime, closeTime } = workingHours;
    return (
        <Fragment>
            <div className="modal fade" id={`viewclinic-${modalId}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between py-0 pe-0">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Clinic Details</h1>
                            <img src={logo} width={'90px'} height={'90px'} alt="logo" />
                        </div>
                        <div className="modal-body d-flex align-items-center gap-5">
                            <div className="">
                                <p>Clinic Name :</p>
                                <p>Doctor Name :</p>
                                <p>Address :</p>
                                <p>Email :</p>
                                <p>Phone :</p>
                                <p>Price :</p>
                                <p>Status :</p>
                                <p>Working Hours :</p>
                            </div>
                            <div className="">

                                <p>{name || ''}</p>
                                <p>{doctorName || 'N/A'}</p>
                                <p>{address?.governorate || ''} - {address?.city || ''}</p>
                                <p>{email || ''}</p>
                                <p >{phone || ''}</p>
                                <p >{price || ''} EGP</p>
                                <p style={{ color: 'white', backgroundColor: clinic.status === 'active' ? '#28a745  ' : '#6c757d   ', fontSize: '14px' }} className='px-3 py-1 rounded rounded-5 w-50 text-center '>{status || ''}</p>
                                <p>
                                    {Array.isArray(workingHours) && workingHours.length > 0
                                        ? workingHours.map((day, i) => (
                                            <span key={i} className='d-block'>
                                                {day.day}: {day.openTime} - {day.closeTime}
                                            </span>
                                        ))
                                        : 'No Working Hours'}
                                </p>
                            </div>

                        </div>

                        <div className="modal-footer d-flex justify-content-end gap-2">
                            <button type="button" id='close-btn-edit' className="w-[100px] px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors">Close</button>

                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
