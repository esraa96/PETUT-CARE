import React, { Fragment } from 'react';
import NotificationManager from '../../components/admindash/NotificationManager';
import NotificationStats from '../../components/admindash/NotificationStats';
import RecentNotifications from '../../components/admindash/RecentNotifications';

export default function NotificationsPage() {
  return (
    <Fragment>
      <div className="p-4 lg:p-6 space-y-6 dark:bg-gray-900 min-h-screen">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Notifications Management</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Send and track notifications to users and doctors
          </p>
        </div>

        {/* Notification Statistics */}
        <NotificationStats />

        {/* Notification Manager */}
        <NotificationManager />

        {/* Recent Notifications */}
        <RecentNotifications />
      </div>
    </Fragment>
  );
}