import React, { Fragment } from 'react'
import { FiActivity, FiUsers, FiCalendar } from "react-icons/fi"; // أيقونات بسيطة
import DashboardAnalytics from '../../components/admindash/DashboardAnalytics';
import LiveStats from '../../components/admindash/LiveStats';
import RecentUsers from '../../components/admindash/RecentUsers';
import UpcomingEvents from '../../components/admindash/UpcomingEvents';

export default function Overview() {
    return (
        <Fragment>
            <div className='p-4 lg:p-6 bg-white dark:bg-gray-900 min-h-screen'>
                <div className='mb-8'>
                    {/* العنوان الرئيسي */}
                    <div className='mb-6 flex items-center gap-3'>
                        <div className="p-2 bg-petut-brown-100 dark:bg-gray-700 rounded-lg">
                            <FiActivity className="text-petut-brown-300 dark:text-yellow-400 text-2xl" />
                        </div>
                        <h1 className="text-3xl font-bold text-black dark:text-white">
                            Main Control Panel
                        </h1>
                    </div>
                    <p className='text-black dark:text-white'>
                        Real-time Activities Overview & Analytics
                    </p>

                    {/* Live Statistics */}
                    <div className="mb-6">
                        <LiveStats />
                    </div>

                    {/* Dynamic Analytics Cards */}
                    <div className="mb-6">
                        <DashboardAnalytics />
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Recent Users */}
                        <div className="admin-card lg:col-span-1 p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-petut-brown-100 dark:bg-gray-700 rounded-lg">
                                    <FiUsers className="text-petut-brown-300 dark:text-yellow-400 text-xl" />
                                </div>
                                <h2 className="font-semibold text-lg text-black dark:text-white">
                                    Recent Users
                                </h2>
                            </div>
                            <RecentUsers />
                            <button className="admin-button mt-4">
                                View All
                            </button>
                        </div>

                        {/* Upcoming Events */}
                        <div className="admin-card lg:col-span-1 p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-petut-brown-100 dark:bg-gray-700 rounded-lg">
                                    <FiCalendar className="text-petut-brown-300 dark:text-yellow-400 text-xl" />
                                </div>
                                <h2 className="font-semibold text-lg text-black dark:text-white">
                                    Upcoming Events
                                </h2>
                            </div>
                            <UpcomingEvents />
                            <button className="admin-button mt-4">
                                See Calendar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
