import React from 'react';

const DeliveryMethodSelector = ({ deliveryMethods, selectedMethod, handleChange }) => {
  const getMethodIcon = (methodId) => {
    switch(methodId) {
      case 'standard': return 'fas fa-truck';
      case 'express': return 'fas fa-shipping-fast';
      case 'pickup': return 'fas fa-store';
      default: return 'fas fa-truck';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary_app/10 rounded-full">
          <i className="fas fa-shipping-fast text-primary_app"></i>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delivery Method</h2>
      </div>
      <div className="space-y-4">
        {deliveryMethods.map(method => (
          <label
            key={method.id}
            className={`block p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedMethod === method.id 
                ? 'border-primary_app bg-primary_app/5 shadow-lg' 
                : 'border-gray-200 dark:border-gray-600 hover:border-primary_app/50'
            } bg-white dark:bg-gray-700`}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={handleChange}
                  className="h-5 w-5 text-primary_app focus:ring-primary_app border-gray-300"
                />
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-600 rounded-full">
                <i className={`${getMethodIcon(method.id)} text-primary_app`}></i>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 dark:text-white">{method.name}</span>
                  <span className={`font-bold text-lg ${
                    method.price === 0 ? 'text-green-600 dark:text-green-400' : 'text-primary_app'
                  }`}>
                    {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{method.description}</p>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default DeliveryMethodSelector;
