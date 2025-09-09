import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'

export default function ContentDoctorDash({doctorData, setDoctorData}) {
    return (
        <Fragment>
            <main className='content-area fade-in' style={{
                marginTop:'clamp(80px, 12vh, 120px)', 
                minHeight: 'calc(100vh - clamp(80px, 12vh, 120px))',
                width: '100%'
            }}>
                <div className="container-fluid px-3 px-md-4 py-3">
                    <Outlet doctorData={doctorData} setDoctorData={setDoctorData} />
                </div>
            </main>
        </Fragment>
    )
}
