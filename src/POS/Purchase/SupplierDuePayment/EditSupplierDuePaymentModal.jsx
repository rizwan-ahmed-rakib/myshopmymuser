import React, { useState, useEffect, useMemo } from "react";
import { 
  FaMoneyBillWave, FaMobileAlt, FaUniversity, 
  FaRegStickyNote, FaCheckCircle, FaTimes,
  FaCogs, FaHashtag, FaInfoCircle, FaPrint
} from "react-icons/fa";
import { posDuePaymentAPI } from "../../../context_or_provider/pos/Purchase/duePayment/duePaymentAPI";
import SuccessModal from "./SuccessModal";

const EditSupplierDuePaymentModal = ({ isOpen, onClose, onSuccess, item }) => {
    const [form, setForm] = useState({
        paid_cash: 0,
        paid_mobile: 0,
        paid_bank: 0,
        mobile_operator: "",
        transaction_id: "",
        bank_name: "",
        note: ""
    });
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (item && isOpen) {
            setForm({
                paid_cash: parseFloat(item.paid_cash) || 0,
                paid_mobile: parseFloat(item.paid_mobile) || 0,
                paid_bank: parseFloat(item.paid_bank) || 0,
                mobile_operator: item.mobile_operator || "",
                transaction_id: item.transaction_id || "",
                bank_name: item.bank_name || "",
                note: item.note || ""
            });
        }
    }, [item, isOpen]);

    const handleAmountChange = (e) => {
        const { name, value } = e.target;
        const val = value === "" ? 0 : parseFloat(value);
        setForm(prev => ({ ...prev, [name]: isNaN(val) ? 0 : val }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const totalAmount = useMemo(() => {
        return Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank);
    }, [form.paid_cash, form.paid_mobile, form.paid_bank]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedData = {
                ...item,
                ...form,
                amount: totalAmount
            };
            await posDuePaymentAPI.update(item.id, updatedData);
            setShowSuccess(true);
        } catch (err) {
            console.error("Update error:", err);
            alert("Update failed. Please check your connection or try again.");
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        onSuccess?.();
        onClose();
    };

    if (!isOpen || !item) return null;

    return (
        <>
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300 print:hidden">
            <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-white/20">
                {/* Header */}
                <div className="px-8 py-6 bg-gray-900 text-white flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-600/30">
                            <FaCogs />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tight">Edit Payment</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">Invoice: #{item.invoice_no}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-red-500 hover:text-white transition-all duration-300 group">
                        <FaTimes className="text-lg group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">

                    {/* Payment Adjustment Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Payment Breakdown</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Cash Input */}
                            <div className="relative group">
                                <label className="text-[10px] font-black text-green-600 uppercase mb-2 ml-1 flex items-center gap-1.5">
                                    <FaMoneyBillWave /> Cash
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 font-black text-sm">৳</span>
                                    <input type="number" name="paid_cash" value={form.paid_cash} onChange={handleAmountChange}
                                        className="w-full bg-green-50/30 border-2 border-green-100 pl-8 pr-4 py-4 rounded-2xl font-black text-green-700 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all" />
                                </div>
                            </div>

                            {/* Mobile Input */}
                            <div className="relative group">
                                <label className="text-[10px] font-black text-purple-600 uppercase mb-2 ml-1 flex items-center gap-1.5">
                                    <FaMobileAlt /> Mobile
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600 font-black text-sm">৳</span>
                                    <input type="number" name="paid_mobile" value={form.paid_mobile} onChange={handleAmountChange}
                                        className="w-full bg-purple-50/30 border-2 border-purple-100 pl-8 pr-4 py-4 rounded-2xl font-black text-purple-700 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all" />
                                </div>
                            </div>

                            {/* Bank Input */}
                            <div className="relative group">
                                <label className="text-[10px] font-black text-blue-600 uppercase mb-2 ml-1 flex items-center gap-1.5">
                                    <FaUniversity /> Bank
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-black text-sm">৳</span>
                                    <input type="number" name="paid_bank" value={form.paid_bank} onChange={handleAmountChange}
                                        className="w-full bg-blue-50/30 border-2 border-blue-100 pl-8 pr-4 py-4 rounded-2xl font-black text-blue-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Banking Details */}
                        {Number(form.paid_mobile) > 0 && (
                            <div className="grid grid-cols-2 gap-4 p-6 bg-purple-50/50 rounded-3xl border border-purple-100 animate-in slide-in-from-top-4 duration-500">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-purple-600 uppercase ml-1 tracking-widest">Operator</label>
                                    <select name="mobile_operator" value={form.mobile_operator} onChange={handleChange} 
                                        className="w-full bg-white border-2 border-purple-100 p-3 rounded-xl font-bold text-sm focus:border-purple-500 outline-none shadow-sm transition-all">
                                        <option value="">Select</option>
                                        <option value="bkash">bKash</option>
                                        <option value="nagad">Nagad</option>
                                        <option value="rocket">Rocket</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-purple-600 uppercase ml-1 tracking-widest">Transaction ID</label>
                                    <div className="relative">
                                        <FaHashtag className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" />
                                        <input name="transaction_id" value={form.transaction_id} onChange={handleChange} placeholder="TxID"
                                            className="w-full bg-white border-2 border-purple-100 pl-9 pr-3 py-3 rounded-xl text-sm font-bold focus:border-purple-500 outline-none shadow-sm transition-all" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bank Details */}
                        {Number(form.paid_bank) > 0 && (
                            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 animate-in slide-in-from-top-4 duration-500 space-y-2">
                                <label className="text-[9px] font-black text-blue-600 uppercase ml-1 tracking-widest">Bank Name / Reference</label>
                                <div className="relative">
                                    <FaInfoCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                                    <input name="bank_name" value={form.bank_name} onChange={handleChange} placeholder="e.g. Dutch Bangla Bank, Check #1234"
                                        className="w-full bg-white border-2 border-blue-100 pl-9 pr-3 py-3 rounded-xl font-bold text-sm focus:border-blue-500 outline-none shadow-sm transition-all" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Note Section */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                            <FaRegStickyNote className="text-amber-500" /> Additional Notes
                        </label>
                        <textarea name="note" value={form.note} onChange={handleChange} rows="3"
                            className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-3xl text-sm font-medium focus:bg-white focus:border-gray-900 outline-none transition-all resize-none shadow-inner"
                            placeholder="Add any specific details about this payment update..." />
                    </div>

                    {/* Summary Footer */}
                    <div className="bg-gray-900 p-8 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>

                        <div className="relative z-10 text-center sm:text-left">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Updated Total</p>
                            <p className="text-4xl font-black text-white">
                                <span className="text-blue-500 text-2xl mr-1">৳</span>{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto relative z-10">
                            <button type="button" onClick={onClose}
                                className="flex-1 px-8 py-4 font-black text-gray-400 text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading || totalAmount <= 0}
                                className="flex-[2] bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-600/30 active:scale-95 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:shadow-none transition-all flex items-center justify-center gap-2">
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <><FaCheckCircle /> Save Changes</>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        {showSuccess && (
            <SuccessModal 
                isOpen={showSuccess} 
                onClose={handleSuccessClose} 
                title="Update Successful" 
                data={{...item, ...form, amount: totalAmount}}
                message={`Payment #${item.invoice_no} has been successfully updated with the new breakdown.`}
            />
        )}
        </>
    );};

export default EditSupplierDuePaymentModal;