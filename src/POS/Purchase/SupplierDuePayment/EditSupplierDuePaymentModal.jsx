// import React, { useState, useEffect, useMemo } from "react";
// import { posDuePaymentAPI } from "../../../context_or_provider/pos/Purchase/duePayment/duePaymentAPI";
// import BaseModal from "../../components/BaseModal";
// import { Receipt, FileText } from 'lucide-react';
// import { FaMoneyBillWave, FaMobileAlt, FaUniversity } from "react-icons/fa";
//
// /**
//  * EditSupplierDuePaymentModal - Refactored to use BaseModal and standardized backbone layout.
//  */
// const EditSupplierDuePaymentModal = ({ isOpen, onClose, onSuccess, item }) => {
//     const [form, setForm] = useState({
//         paid_cash: 0,
//         paid_mobile: 0,
//         paid_bank: 0,
//         mobile_operator: "",
//         transaction_id: "",
//         bank_name: "",
//         note: ""
//     });
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//
//     useEffect(() => {
//         if (item && isOpen) {
//             setForm({
//                 paid_cash: parseFloat(item.paid_cash) || 0,
//                 paid_mobile: parseFloat(item.paid_mobile) || 0,
//                 paid_bank: parseFloat(item.paid_bank) || 0,
//                 mobile_operator: item.mobile_operator || "",
//                 transaction_id: item.transaction_id || "",
//                 bank_name: item.bank_name || "",
//                 note: item.note || ""
//             });
//         }
//     }, [item, isOpen]);
//
//     const handleAmountChange = (e) => {
//         const { name, value } = e.target;
//         const val = value === "" ? 0 : parseFloat(value);
//         setForm(prev => ({ ...prev, [name]: isNaN(val) ? 0 : val }));
//     };
//
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm(prev => ({ ...prev, [name]: value }));
//     };
//
//     const totalAmount = useMemo(() => {
//         return Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank);
//     }, [form.paid_cash, form.paid_mobile, form.paid_bank]);
//
//     const handleSubmit = async (e) => {
//         if(e) e.preventDefault();
//         setLoading(true);
//         try {
//             const updatedData = { ...item, ...form, amount: totalAmount };
//             await posDuePaymentAPI.update(item.id, updatedData);
//             onSuccess?.({ ...item, ...form, amount: totalAmount });
//         } catch (err) {
//             console.error(err);
//             alert("Update failed.");
//         } finally { setLoading(false); }
//     };
//
//     if (!isOpen || !item) return null;
//
//     return (
//         <>
//             <BaseModal
//                 isOpen={isOpen}
//                 onClose={onClose}
//                 title={`Edit Payment Record #${item.invoice_no}`}
//                 size="md"
//                 icon={<Receipt className="text-white" />}
//                 showFooter={true}
//                 onSubmit={handleSubmit}
//                 submitText="Save Changes"
//                 isLoading={loading}
//             >
//                 <div className="space-y-8">
//                     {/* Supplier/Invoice Summary */}
//                     <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex justify-between items-center shadow-sm">
//                         <div className="space-y-1">
//                             <p className="text-[10px] uppercase font-black text-blue-400 tracking-[0.2em]">Supplier</p>
//                             <p className="text-lg font-black text-gray-800">{item.supplier_name}</p>
//                         </div>
//                         <div className="text-right">
//                             <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">Purchase Ref</p>
//                             <p className="font-bold text-gray-700">#{item.purchase_invoice_no || 'General'}</p>
//                         </div>
//                     </div>
//
//                     {/* Breakdown Section */}
//                     <div className="space-y-6">
//                         <div className="flex items-center gap-3">
//                             <div className="w-1.5 h-6 bg-brand-primary rounded-full"></div>
//                             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Payment Breakdown</h3>
//                         </div>
//
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             <div className="space-y-1.5">
//                                 <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-1.5"><FaMoneyBillWave /> Cash</label>
//                                 <input type="number" name="paid_cash" value={form.paid_cash} onChange={handleAmountChange} className="w-full border border-gray-200 p-3 rounded-xl font-black text-emerald-700 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all shadow-inner" />
//                             </div>
//                             <div className="space-y-1.5">
//                                 <label className="text-[9px] font-black text-purple-600 uppercase tracking-widest ml-1 flex items-center gap-1.5"><FaMobileAlt /> Mobile</label>
//                                 <input type="number" name="paid_mobile" value={form.paid_mobile} onChange={handleAmountChange} className="w-full border border-gray-200 p-3 rounded-xl font-black text-purple-700 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all shadow-inner" />
//                             </div>
//                             <div className="space-y-1.5">
//                                 <label className="text-[9px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-1.5"><FaUniversity /> Bank</label>
//                                 <input type="number" name="paid_bank" value={form.paid_bank} onChange={handleAmountChange} className="w-full border border-gray-200 p-3 rounded-xl font-black text-blue-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all shadow-inner" />
//                             </div>
//                         </div>
//
//                         {(form.paid_mobile > 0 || form.paid_bank > 0) && (
//                             <div className="grid gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 animate-in slide-in-from-top-2">
//                                 {form.paid_mobile > 0 && (
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div className="space-y-1">
//                                             <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest ml-1">Operator</label>
//                                             <select name="mobile_operator" value={form.mobile_operator} onChange={handleChange} className="w-full border border-gray-200 p-2 rounded-lg bg-white text-xs font-bold outline-none">
//                                                 <option value="">Select</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="rocket">Rocket</option>
//                                             </select>
//                                         </div>
//                                         <div className="space-y-1">
//                                             <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest ml-1">TxID</label>
//                                             <input name="transaction_id" value={form.transaction_id} onChange={handleChange} placeholder="TxID" className="w-full border border-gray-200 p-2 rounded-lg bg-white text-xs font-bold outline-none" />
//                                         </div>
//                                     </div>
//                                 )}
//                                 {form.paid_bank > 0 && (
//                                     <div className="space-y-1">
//                                         <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest ml-1">Bank Name / Ref</label>
//                                         <input name="bank_name" value={form.bank_name} onChange={handleChange} placeholder="e.g. DBBL Check #1234" className="w-full border border-gray-200 p-2 rounded-lg bg-white text-xs font-bold outline-none" />
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//
//                     <div className="space-y-2">
//                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FileText size={12} className="text-amber-500" /> Payment Note</label>
//                         <textarea name="note" value={form.note} onChange={handleChange} rows="2" className="w-full border border-gray-200 p-4 rounded-2xl text-xs font-bold text-gray-700 focus:border-gray-900 outline-none transition-all shadow-inner resize-none bg-gray-50/50" placeholder="Add any details about this update..." />
//                     </div>
//
//                     <div className="bg-gray-900 p-6 rounded-[2rem] flex justify-between items-center shadow-xl relative overflow-hidden group">
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>
//                         <div>
//                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Updated Total</p>
//                             <p className="text-3xl font-black text-white leading-none font-mono">৳{totalAmount.toLocaleString()}</p>
//                         </div>
//                         <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white/30 animate-pulse"><Receipt size={24} /></div>
//                     </div>
//                 </div>
//             </BaseModal>
//
//         </>
//     );
// };
//
// export default EditSupplierDuePaymentModal;



import React, { useState, useEffect, useMemo } from "react";
import { posDuePaymentAPI } from "../../../context_or_provider/pos/Purchase/duePayment/duePaymentAPI";
import BaseModal from "../../components/BaseModal";
import { Receipt, FileText, RefreshCcw, AlertTriangle } from 'lucide-react';
import { FaMoneyBillWave, FaMobileAlt, FaUniversity } from "react-icons/fa";

const EditSupplierDuePaymentModal = ({ isOpen, onClose, onSuccess, item }) => {
    const [form, setForm] = useState({
        transaction_type: 'payment',
        paid_cash: 0,
        paid_mobile: 0,
        paid_bank: 0,
        mobile_operator: "",
        transaction_id: "",
        bank_name: "",
        note: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (item && isOpen) {
            setForm({
                transaction_type: item.transaction_type || 'payment',
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

    const isRefund = form.transaction_type === 'refund';

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (totalAmount <= 0) {
            alert("Amount must be greater than 0.");
            return;
        }
        setLoading(true);
        try {
            const updatedData = { ...item, ...form, amount: totalAmount };
            await posDuePaymentAPI.update(item.id, updatedData);
            onSuccess?.({ ...item, ...form, amount: totalAmount });
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.non_field_errors?.[0]
                || err?.response?.data?.detail
                || "Update failed.";
            alert(msg);
        } finally { setLoading(false); }
    };

    if (!isOpen || !item) return null;

    // Color theming
    const themeColor = isRefund ? 'blue' : 'emerald';
    const headerBg = isRefund ? 'bg-blue-50/50' : 'bg-emerald-50/50';
    const headerBorder = isRefund ? 'border-blue-100' : 'border-emerald-100';
    const headerLabel = isRefund ? 'text-blue-400' : 'text-emerald-500';
    const submitLabel = isRefund ? "Update Refund" : "Update Payment";

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Edit ${isRefund ? 'Refund' : 'Payment'} Record #${item.invoice_no}`}
            size="md"
            icon={isRefund ? <RefreshCcw className="text-white" /> : <Receipt className="text-white" />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText={submitLabel}
            isLoading={loading}
        >
            <div className="space-y-6">
                {/* 🆕 Type Toggle */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, transaction_type: 'payment' }))}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                            !isRefund
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Receipt size={14} /> Payment to Supplier
                    </button>
                    <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, transaction_type: 'refund' }))}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                            isRefund
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <RefreshCcw size={14} /> Refund from Supplier
                    </button>
                </div>

                {/* Info Banner */}
                <div className={`${headerBg} p-5 rounded-2xl border ${headerBorder} flex justify-between items-center shadow-sm`}>
                    <div className="space-y-1">
                        <p className={`text-[10px] uppercase font-black ${headerLabel} tracking-[0.2em]`}>Supplier</p>
                        <p className="text-lg font-black text-gray-800">{item.supplier_name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">
                            {isRefund ? 'Refund Type' : 'Purchase Ref'}
                        </p>
                        <p className="font-bold text-gray-700">
                            {isRefund ? 'Advance Settlement' : `#${item.purchase_invoice_no || 'General'}`}
                        </p>
                    </div>
                </div>

                {/* Refund warning */}
                {isRefund && (
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2">
                        <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 leading-relaxed">
                            <strong>Refund:</strong> Supplier আপনার কাছ থেকে টাকা ফেরত দিচ্ছে। Supplier এর advance balance থেকে কেটে নেওয়া হবে।
                        </p>
                    </div>
                )}

                {/* Amount breakdown */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-6 ${isRefund ? 'bg-blue-500' : 'bg-emerald-500'} rounded-full`}></div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                            {isRefund ? 'Refund Breakdown' : 'Payment Breakdown'}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                <FaMoneyBillWave /> Cash
                            </label>
                            <input type="number" name="paid_cash" value={form.paid_cash} onChange={handleAmountChange}
                                className="w-full border border-gray-200 p-3 rounded-xl font-black text-emerald-700 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all shadow-inner" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-purple-600 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                <FaMobileAlt /> Mobile
                            </label>
                            <input type="number" name="paid_mobile" value={form.paid_mobile} onChange={handleAmountChange}
                                className="w-full border border-gray-200 p-3 rounded-xl font-black text-purple-700 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all shadow-inner" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                <FaUniversity /> Bank
                            </label>
                            <input type="number" name="paid_bank" value={form.paid_bank} onChange={handleAmountChange}
                                className="w-full border border-gray-200 p-3 rounded-xl font-black text-blue-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all shadow-inner" />
                        </div>
                    </div>

                    {(form.paid_mobile > 0 || form.paid_bank > 0) && (
                        <div className="grid gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                            {form.paid_mobile > 0 && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest ml-1">Operator</label>
                                        <select name="mobile_operator" value={form.mobile_operator} onChange={handleChange}
                                            className="w-full border border-gray-200 p-2 rounded-lg bg-white text-xs font-bold outline-none">
                                            <option value="">Select</option>
                                            <option value="bkash">bKash</option>
                                            <option value="nagad">Nagad</option>
                                            <option value="rocket">Rocket</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest ml-1">TxID</label>
                                        <input name="transaction_id" value={form.transaction_id} onChange={handleChange}
                                            placeholder="TxID" className="w-full border border-gray-200 p-2 rounded-lg bg-white text-xs font-bold outline-none" />
                                    </div>
                                </div>
                            )}
                            {form.paid_bank > 0 && (
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest ml-1">Bank Name / Ref</label>
                                    <input name="bank_name" value={form.bank_name} onChange={handleChange}
                                        placeholder="e.g. DBBL Check #1234"
                                        className="w-full border border-gray-200 p-2 rounded-lg bg-white text-xs font-bold outline-none" />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Note */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <FileText size={12} className="text-amber-500" /> {isRefund ? 'Refund Note' : 'Payment Note'}
                    </label>
                    <textarea name="note" value={form.note} onChange={handleChange} rows="2"
                        className="w-full border border-gray-200 p-4 rounded-2xl text-xs font-bold text-gray-700 focus:border-gray-900 outline-none transition-all shadow-inner resize-none bg-gray-50/50"
                        placeholder={isRefund ? "Reason for refund..." : "Add any details..."} />
                </div>

                {/* Total box */}
                <div className={`${isRefund ? 'bg-blue-900' : 'bg-gray-900'} p-6 rounded-[2rem] flex justify-between items-center shadow-xl relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">
                            {isRefund ? 'Refund Total' : 'Updated Total'}
                        </p>
                        <p className="text-3xl font-black text-white leading-none font-mono">৳{totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white/30">
                        {isRefund ? <RefreshCcw size={24} /> : <Receipt size={24} />}
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default EditSupplierDuePaymentModal;