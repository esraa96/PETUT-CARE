import React, { Fragment } from 'react'
import NumberClientsChart from '../../components/admindash/NumberClientsChart';
import NumberClinicsChart from '../../components/admindash/NumberClinicsChart';
import RevenuesChart from '../../components/admindash/RevenuesChart';

export default function Charts() {
    return (
        <Fragment>
            <div className="container charts mt-5 dark:bg-gray-900 min-h-screen">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Dashboard Charts</h3>
                    <p className="text-gray-600 dark:text-gray-300">Real-time data visualization and analytics</p>
                </div>
                
                <div className="row g-4">
                    {/* Clients Chart */}
                    <div className="col-12 mb-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                            <NumberClientsChart />
                        </div>
                    </div>

                    {/* Clinics Chart */}
                    <div className="col-12 mb-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                            <NumberClinicsChart />
                        </div>
                    </div>

                    {/* Revenue Chart */}
                    <div className="col-12 mb-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                            <RevenuesChart />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}