import React from 'react';

export default function StatsCard({ title, count, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-black dark:text-white mb-2">{title}</h3>
          <p className="text-3xl font-bold text-black dark:text-white">{count}</p>
        </div>
        <div className="text-yellow-400">
          {icon}
        </div>
      </div>
    </div>
  );
}