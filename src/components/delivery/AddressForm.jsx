import React from 'react';

const FormInput = ({ id, name, label, value, onChange, error, type = 'text', placeholder, icon }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i className={`${icon} text-gray-400`}></i>
        </div>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full ${icon ? 'pl-10' : ''} pr-4 py-3 border-2 ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary_app focus:border-transparent transition-all duration-200`}
        placeholder={placeholder}
      />
    </div>
    {error && <p className="mt-2 text-sm text-red-500 flex items-center gap-1"><i className="fas fa-exclamation-circle"></i>{error}</p>}
  </div>
);

const AddressForm = ({ deliveryInfo, handleChange, errors }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary_app/10 rounded-full">
          <i className="fas fa-map-marker-alt text-primary_app"></i>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delivery Address</h2>
      </div>
      <div className="space-y-6">
        <FormInput
          id="address"
          name="address"
          label="Street Address"
          value={deliveryInfo.address}
          onChange={handleChange}
          error={errors.address}
          placeholder="123 Main St, Apt 4B"
          icon="fas fa-home"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="city"
            name="city"
            label="City"
            value={deliveryInfo.city}
            onChange={handleChange}
            error={errors.city}
            placeholder="New York"
            icon="fas fa-city"
          />
          <FormInput
            id="postalCode"
            name="postalCode"
            label="Postal Code"
            value={deliveryInfo.postalCode}
            onChange={handleChange}
            error={errors.postalCode}
            placeholder="10001"
            icon="fas fa-mail-bulk"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
