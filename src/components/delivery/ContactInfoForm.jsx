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

const ContactInfoForm = ({ deliveryInfo, handleChange, errors }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary_app/10 rounded-full">
          <i className="fas fa-user text-primary_app"></i>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
      </div>
      <div className="space-y-6">
        <FormInput
          id="fullName"
          name="fullName"
          label="Full Name"
          value={deliveryInfo.fullName}
          onChange={handleChange}
          error={errors.fullName}
          placeholder="Enter your full name"
          icon="fas fa-user"
        />
        <FormInput
          id="phone"
          name="phone"
          label="Phone Number"
          type="tel"
          value={deliveryInfo.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="+1 (555) 123-4567"
          icon="fas fa-phone"
        />
        <FormInput
          id="email"
          name="email"
          label="Email Address"
          type="email"
          value={deliveryInfo.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="your.email@example.com"
          icon="fas fa-envelope"
        />
      </div>
    </div>
  );
};

export default ContactInfoForm;
