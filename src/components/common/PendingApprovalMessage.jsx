import { FaClock, FaInfoCircle } from 'react-icons/fa';

const PendingApprovalMessage = ({ doctorName }) => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="mb-6">
                    <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                        <FaClock className="text-yellow-600 text-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Registration Under Review
                    </h2>
                    <p className="text-gray-600">
                        Hello Dr. {doctorName || 'Doctor'}
                    </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                        <FaInfoCircle className="text-yellow-600 mt-1 mr-3 flex-shrink-0" />
                        <div className="text-left">
                            <p className="text-yellow-800 font-medium mb-2">
                                Your registration is being reviewed
                            </p>
                            <p className="text-yellow-700 text-sm">
                                Our admin team is currently reviewing your doctor registration and credentials. 
                                You will receive a notification once your account has been approved.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-gray-500 space-y-2">
                    <p>• Registration typically takes 1-2 business days</p>
                    <p>• You will be notified via email once approved</p>
                    <p>• Contact support if you have any questions</p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-400">
                        Thank you for your patience
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PendingApprovalMessage;