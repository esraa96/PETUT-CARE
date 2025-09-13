import React from 'react';

const DeliveryTimeSelector = ({ deliveryTimes, selectedTime, handleChange }) => {
  const getTimeIcon = (timeId) => {
    switch(timeId) {
      case 'anytime': return 'fas fa-clock';
      case 'morning': return 'fas fa-sun';
      case 'afternoon': return 'fas fa-cloud-sun';
      case 'evening': return 'fas fa-moon';
      default: return 'fas fa-clock';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary_app/10 rounded-full">
          <i className="fas fa-clock text-primary_app"></i>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Preferred Delivery Time</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deliveryTimes.map(time => (
          <label
            key={time.id}
            className={`block p-4 border-2 rounded-xl cursor-pointer text-center transition-all duration-200 hover:shadow-md ${
              selectedTime === time.id 
                ? 'border-primary_app bg-primary_app/5 shadow-lg' 
                : 'border-gray-200 dark:border-gray-600 hover:border-primary_app/50'
            } bg-white dark:bg-gray-700`}
          >
            <input
              type="radio"
              name="deliveryTime"
              value={time.id}
              checked={selectedTime === time.id}
              onChange={handleChange}
              className="sr-only"
            />
            <div className="flex flex-col items-center gap-2">
              <div className={`p-3 rounded-full ${
                selectedTime === time.id 
                  ? 'bg-primary_app text-white' 
                  : 'bg-gray-100 dark:bg-gray-600 text-primary_app'
              }`}>
                <i className={getTimeIcon(time.id)}></i>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{time.name}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default DeliveryTimeSelector;
