import { Fragment } from 'react'
import logo from '../../assets/petut.png'

export default function ViewClientModal({ client, modalId }) {
    if (!client) return null;
    return (
        <Fragment>
            <div className="modal fade" id={`viewclient-${modalId}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center justify-content-between py-0 pe-0">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">User Details</h1>
                            <img src={logo} width={'90px'} height={'90px'} alt="logo" />
                        </div>
                        <div className="modal-body d-flex align-items-center gap-5 ">
                            <div className="left user-image text-center mb-3">
                                <img src={client?.profileImage} alt="user-image"  style={{  width: '250px', height: '250px'}} />
                            </div>
                            <div className="right user-details d-flex flex-1 align-items-start gap-3">
                                <div className="">
                                    <p>User Name :</p>
                                    <p>Email :</p>
                                    <p>Phone :</p>
                                    <p>Gender :</p>
                                    <p >Role :</p>
                                </div>
                                <div className="flex-1">
                                    <p>{client.fullName || ''}</p>
                                    <p>{client.email || ''}</p>
                                    <p>{client.phone || ''}</p>
                                    <p style={{ color: 'white', backgroundColor: client.gender === 'male' ? '#007BFF ' : '#E91E63 ', fontSize: '14px' }} className='px-3 py-1 rounded rounded-5 w-25 text-center'>{client.gender || ''}</p>
                                    <p style={{ color: 'white', backgroundColor: client.role === 'customer' ? '#12101285 ' : '#007BFF ', fontSize: '14px' }} className='px-3 py-1 mb-0 rounded rounded-5 w-25 text-center'>{client.role || ''}</p>
                                </div>
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
