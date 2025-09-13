import React from 'react';

const OrderSummary = ({ totalAmount, deliveryFee }) => {
  const finalTotal = totalAmount + deliveryFee;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
          <i className="fas fa-receipt text-green-600 dark:text-green-400"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="font-semibold text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
          <div className="flex items-center gap-2">
            {deliveryFee === 0 ? (
              <span className="text-green-600 dark:text-green-400 font-semibold">Free</span>
            ) : (
              <span className="font-semibold text-gray-900 dark:text-white">${deliveryFee.toFixed(2)}</span>
            )}
          </div>
        </div>
        
        <div className="border-t-2 border-gray-200 dark:border-gray-600 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
            <span className="text-2xl font-bold text-primary_app">${finalTotal.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="bg-primary_app/10 rounded-xl p-4 mt-4">
          <div className="flex items-center gap-2 text-primary_app">
            <i className="fas fa-shield-alt"></i>
            <span className="text-sm font-medium">Secure checkout with SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
