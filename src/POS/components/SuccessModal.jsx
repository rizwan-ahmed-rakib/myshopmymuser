import React from 'react';
import {FaCheckCircle, FaPrint} from 'react-icons/fa';
import BaseModal from './BaseModal';

const SuccessModal = ({
                          isOpen,
                          onClose,
                          title = "Success!",
                          subtitle = "Transaction Completed Successfully",
                          details = [], // [{ label: "Employee", value: "Rizwan" }, { label: "Amount", value: "৳৫,০০০" }]
                          onPrint = null, // প্রিন্ট ফাংশন পাস করলে প্রিন্ট বাটন দেখাবে
                          printText = "Print Slip",
                          variant = "primary" // primary (brand color), danger, clean
                      }) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            variant={variant}
        >
            <div className="text-center p-2 space-y-6">
                {/* animated checkmark header */}
                <div
                    className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4 shadow-inner">
                    <FaCheckCircle className="text-4xl text-green-500 animate-bounce"/>
                </div>

                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{subtitle}</p>
                </div>

                {/* Details list rendering (dynamic) */}
                {details.length > 0 && (
                    <div className="bg-gray-50 p-5 rounded-2xl space-y-3 text-sm border border-gray-100 text-left">
                        {details.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <span
                                    className="text-[10px] font-black uppercase text-gray-400 tracking-wider">{item.label}</span>
                                <span className="font-bold text-gray-800">{item.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                    {onPrint ? (
                        <button
                            onClick={onPrint}
                            className="py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-
  md"
                        >
                            <FaPrint/> {printText}
                        </button>
                    ) : null}

                    <button
                        onClick={onClose}
                        className={`py-3 border-2 border-gray-100 hover:bg-gray-50 rounded-xl font-bold text-xs transition-all ${!onPrint ? 'col-span-2' : ''}`}
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default SuccessModal;