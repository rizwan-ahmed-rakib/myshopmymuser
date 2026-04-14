
import React from 'react';

const SuccessModal = ({ isOpen, onClose, employee, type = 'create' }) => {
    if (!isOpen) return null;

    const isUpdate = type === 'update';

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300">
                
                {/* Header/Icon */}
                <div className={`${isUpdate ? 'bg-blue-500' : 'bg-green-500'} p-8 flex justify-center transition-colors duration-500`}>
                    <div className="bg-white/20 rounded-full p-4">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {isUpdate ? 'Successfully Updated!' : 'Successfully Created!'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Salary advance for <strong>{employee?.user_name || 'the employee'}</strong> has been {isUpdate ? 'updated' : 'recorded'}.
                    </p>

                    {/* Details Box */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left border border-gray-100">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500 text-sm">Amount:</span>
                            <span className={`font-semibold ${isUpdate ? 'text-blue-600' : 'text-green-600'}`}>৳ {employee?.amount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Status:</span>
                            <span className="font-semibold text-gray-700">
                                {employee?.is_approved ? 'Approved' : 'Pending'}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className={`w-full py-3 ${isUpdate ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-xl font-semibold transition-colors shadow-lg`}
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
