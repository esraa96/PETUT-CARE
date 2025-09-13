import React, { useState } from 'react';
import Modal from '../common/Modal';
import TermsOfService from '../legal/TermsOfService';
import PrivacyPolicy from '../legal/PrivacyPolicy';

const SignUpForm = ({ handleSubmit, handleChange, formData, formErrors, loading, error }) => {
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    
    console.log('SignUpForm rendered - loading:', loading);
    console.log('SignUpForm rendered - formData:', formData);

    return (
        <>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            autoComplete="name"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`appearance-none relative block w-full px-3 py-3 border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} dark:border-gray-500 dark:bg-[#313340] dark:text-white rounded-lg placeholder-gray-500 dark:placeholder:text-white focus:outline-none focus:ring-primary_app focus:border-primary focus:z-10 sm:text-sm`}
                            placeholder="Full Name"
                        />
                        {formErrors.fullName && <p className="mt-1 text-sm text-red-500">{formErrors.fullName}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`appearance-none relative block w-full px-3 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} dark:border-gray-500 dark:bg-[#313340] dark:text-white rounded-lg placeholder-gray-500 dark:placeholder:text-white focus:outline-none focus:ring-primary_app focus:border-primary focus:z-10 sm:text-sm`}
                            placeholder="Email address"
                        />
                        {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                autoComplete="name"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`appearance-none relative block w-full px-3 py-3 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} dark:border-gray-500 dark:bg-[#313340] dark:text-white rounded-lg placeholder-gray-500 dark:placeholder:text-white focus:outline-none focus:ring-primary_app focus:border-primary focus:z-10 sm:text-sm`}
                                placeholder="Phone"
                            />

                            {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                                Gender
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                type="select"
                                autoComplete="name"
                                value={formData.gender}
                                onChange={handleChange}
                                className={`appearance-none relative block w-full px-3 py-3 border ${formErrors.gender ? 'border-red-500' : 'border-gray-300'} dark:border-gray-500 dark:bg-[#313340] dark:text-white rounded-lg placeholder-gray-500 dark:placeholder:text-white focus:outline-none focus:ring-primary_app focus:border-primary focus:z-10 sm:text-sm`}
                                placeholder="Gender"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            {formErrors.gender && <p className="mt-1 text-sm text-red-500">{formErrors.gender}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`appearance-none relative block w-full px-3 py-3 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} dark:border-gray-500 dark:bg-[#313340] dark:text-white rounded-lg placeholder-gray-500 dark:placeholder:text-white focus:outline-none focus:ring-primary_app focus:border-primary focus:z-10 sm:text-sm`}
                            placeholder="Password"
                        />
                        {formErrors.password && <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`appearance-none relative block w-full px-3 py-3 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} dark:border-gray-500 dark:bg-[#313340] dark:text-white rounded-lg placeholder-gray-500 dark:placeholder:text-white focus:outline-none focus:ring-primary_app focus:border-primary focus:z-10 sm:text-sm`}
                            placeholder="Confirm Password"
                        />
                        {formErrors.confirmPassword && <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>}
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        id="agree-terms"
                        name="agreeTerms"
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className={`h-4 w-4 text-primary_app focus:ring-primary_app border-gray-300 rounded ${formErrors.agreeTerms ? 'border-red-500' : ''}`}
                    />
                    <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900 dark:text-white">
                        I agree to the{' '}
                        <button
                            type="button"
                            onClick={() => setIsTermsModalOpen(true)}
                            className="font-medium text-primary_app hover:underline focus:outline-none"
                        >
                            Terms of Service
                        </button>{' '}
                        and{' '}
                        <button
                            type="button"
                            onClick={() => setIsPolicyModalOpen(true)}
                            className="font-medium text-primary_app hover:underline focus:outline-none"
                        >
                            Privacy Policy
                        </button>
                    </label>
                </div>
                {formErrors.agreeTerms && <p className="mt-1 text-sm text-red-500">{formErrors.agreeTerms}</p>}

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ pointerEvents: loading ? 'none' : 'auto' }}
                        onClick={(e) => {
                            console.log('Button clicked!');
                            console.log('Loading state:', loading);
                            console.log('Form data:', formData);
                            
                            // Fallback: if form doesn't submit, call handleSubmit directly
                            if (!loading) {
                                setTimeout(() => {
                                    console.log('Calling handleSubmit directly...');
                                    handleSubmit(e);
                                }, 100);
                            }
                        }}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-primary_app hover:bg-primary_app/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary_app disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                        ) : 'Create Account'}
                    </button>
                </div>
            </form>

            <Modal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
                title="Terms of Service"
            >
                <TermsOfService />
            </Modal>

            <Modal
                isOpen={isPolicyModalOpen}
                onClose={() => setIsPolicyModalOpen(false)}
                title="Privacy Policy"
            >
                <PrivacyPolicy />
            </Modal>
        </>
    );
};

export default SignUpForm;