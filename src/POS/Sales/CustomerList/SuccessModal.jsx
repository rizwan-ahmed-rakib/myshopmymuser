import React from "react";
import BaseModal from "../../components/BaseModal";
import { CheckCircle, User, ShieldCheck } from 'lucide-react';

/**
 * SuccessModal - Refactored to use BaseModal and standardized backbone success aesthetics.
 * Specifically for Customer creation success.
 */
const SuccessModal = ({ isOpen, onClose, employee }) => {
    if (!isOpen || !employee) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Customer Profile Created"
            size="sm"
            variant="primary"
        >
            <div className="text-center space-y-6 py-2">
                <div className="w-20 h-20 bg-emerald-50 rounded-full mx-auto flex items-center justify-center shadow-inner">
                    <CheckCircle className="text-4xl text-emerald-500 animate-bounce" size={40} />
                </div>

                <div className="space-y-1">
                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Success!</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">New Customer Account Active</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100 text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-emerald-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                            {employee.image ? (
                                <img src={employee.image} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <User className="text-emerald-500" size={24} />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-gray-900 text-lg leading-none truncate">{employee.name}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: #{employee.id}</span>
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-dashed border-gray-200">
                        <div className="flex items-center gap-2 text-emerald-600">
                            <ShieldCheck size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Verified Customer Account</span>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95"
                    >
                        Continue to Dashboard
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default SuccessModal;