import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeliveryHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg z-50 border-b border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary_app/10 rounded-full">
              <i className="fas fa-shipping-fast text-primary_app"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Information</h1>
          </div>
          
          <div className="w-10"></div> {/* Empty div for flex spacing */}
        </div>
      </div>
    </div>
  );
};

export default DeliveryHeader;
