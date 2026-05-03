// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import axios from "axios";
// import BASE_URL_of_POS from "../../../posConfig";
// import LoadingSpinner from "./LoadingSpinner";
//
// const UpdateSalaryAdvanceModal = ({ isOpen, onClose, onSuccess, advanceData }) => {
//     const [form, setForm] = useState({
//         amount: "",
//         reason: "",
//         is_approved: false,
//         paid_cash: 0,
//         paid_mobile: 0,
//         paid_bank: 0,
//         payment_method: "cash",
//         mobile_operator: "",
//         transaction_id: "",
//         bank_name: ""
//     });
//
//     const [loading, setLoading] = useState(false);
//
//     useEffect(() => {
//         if (advanceData && isOpen) {
//             setForm({
//                 amount: advanceData.amount || "",
//                 reason: advanceData.reason || "",
//                 is_approved: advanceData.is_approved || false,
//                 paid_cash: advanceData.paid_cash || 0,
//                 paid_mobile: advanceData.paid_mobile || 0,
//                 paid_bank: advanceData.paid_bank || 0,
//                 payment_method: advanceData.payment_method || "cash",
//                 mobile_operator: advanceData.mobile_operator || "",
//                 transaction_id: advanceData.transaction_id || "",
//                 bank_name: advanceData.bank_name || ""
//             });
//         }
//     }, [advanceData, isOpen]);
//
//     useEffect(() => {
//         const counts = [Number(form.paid_cash) > 0, Number(form.paid_mobile) > 0, Number(form.paid_bank) > 0].filter(Boolean).length;
//         let method = "cash";
//         if (counts > 1) method = "hybrid";
//         else if (Number(form.paid_mobile) > 0) method = "mobile_banking";
//         else if (Number(form.paid_bank) > 0) method = "bank";
//         setForm(prev => ({ ...prev, payment_method: method }));
//     }, [form.paid_cash, form.paid_mobile, form.paid_bank]);
//
//     if (!isOpen) return null;
//
//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
//     };
//
//     const handleAmountChange = (e) => {
//         const { name, value } = e.target;
//         setForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const res = await axios.patch(
//                 `${BASE_URL_of_POS}/api/users/salary-advances/${advanceData.id}/`,
//                 { ...form, amount: Number(form.amount) }
//             );
//             onSuccess?.(res.data);
//             onClose();
//         } catch (err) {
//             console.error(err);
//             alert("Update failed");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
//             <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
//                 <div className="px-6 py-4 border-b bg-gray-800 text-white flex justify-between items-center sticky top-0 z-10">
//                     <div>
//                         <h2 className="text-xl font-bold uppercase tracking-tight">Update Salary Advance</h2>
//                         <p className="text-[10px] text-gray-400">ID: #{advanceData?.id} | {advanceData?.user_name}</p>
//                     </div>
//                     <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
//                 </div>
//
//                 <form onSubmit={handleSubmit} className="p-6 space-y-6">
//                     <div>
//                         <label className="block text-[10px] font-black text-gray-500 uppercase mb-1 tracking-widest">Advance Amount</label>
//                         <input type="number" name="amount" value={form.amount} onChange={handleChange} className="w-full p-3 border-2 border-gray-100 rounded-xl font-black text-blue-700 text-lg focus:border-blue-500 outline-none" required />
//                     </div>
//
//                     <div>
//                         <label className="block text-[10px] font-black text-gray-500 uppercase mb-1 tracking-widest">Reason</label>
//                         <textarea name="reason" value={form.reason} onChange={handleChange} className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none" rows="2" placeholder="Reason for advance" />
//                     </div>
//
//                     {/* Hybrid Payment Breakdown */}
//                     <div className="bg-gray-50 p-5 rounded-2xl border-2 border-gray-100 space-y-4 shadow-inner">
//                         <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest text-center">Disbursement Breakdown (Hybrid)</label>
//                         <div className="grid grid-cols-3 gap-4">
//                             <div>
//                                 <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Cash</label>
//                                 <input type="number" name="paid_cash" value={form.paid_cash} onChange={handleAmountChange} className="w-full border-2 border-white p-2 rounded-xl font-black text-center text-green-700 focus:border-green-500 outline-none" />
//                             </div>
//                             <div>
//                                 <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Mobile</label>
//                                 <input type="number" name="paid_mobile" value={form.paid_mobile} onChange={handleAmountChange} className="w-full border-2 border-white p-2 rounded-xl font-black text-center text-orange-700 focus:border-orange-500 outline-none" />
//                             </div>
//                             <div>
//                                 <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Bank</label>
//                                 <input type="number" name="paid_bank" value={form.paid_bank} onChange={handleAmountChange} className="w-full border-2 border-white p-2 rounded-xl font-black text-center text-blue-700 focus:border-blue-500 outline-none" />
//                             </div>
//                         </div>
//
//                         {(Number(form.paid_mobile) > 0 || Number(form.paid_bank) > 0) && (
//                             <div className="space-y-3 animate-fadeIn">
//                                 {Number(form.paid_mobile) > 0 && (
//                                     <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-orange-100 shadow-sm">
//                                         <select name="mobile_operator" value={form.mobile_operator} onChange={handleChange} className="p-2 border rounded-lg font-bold bg-orange-50/30">
//                                             <option value="">Operator</option>
//                                             <option value="bkash">bKash</option>
//                                             <option value="nagad">Nagad</option>
//                                             <option value="rocket">Rocket</option>
//                                             <option value="upay">Upay</option>
//                                         </select>
//                                         <input name="transaction_id" value={form.transaction_id} onChange={handleChange} className="p-2 border rounded-lg" placeholder="TxID (Optional)" />
//                                     </div>
//                                 )}
//                                 {Number(form.paid_bank) > 0 && (
//                                     <input name="bank_name" value={form.bank_name} onChange={handleChange} className="w-full p-2 border rounded-xl font-bold bg-blue-50/30" placeholder="Bank Name / Reference No" />
//                                 )}
//                             </div>
//                         )}
//                     </div>
//
//                     <div className="flex justify-between items-center bg-gray-900 p-5 rounded-2xl shadow-xl">
//                         <div className="flex items-center gap-3">
//                             <input type="checkbox" name="is_approved" checked={form.is_approved} onChange={handleChange} className="w-5 h-5 rounded accent-blue-500" />
//                             <label className="text-sm font-black text-white uppercase tracking-widest">Approved</label>
//                         </div>
//                         <div className="text-right">
//                              <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Total Disbursed</p>
//                              <p className="text-2xl font-black text-green-400 font-mono">৳{(Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank)).toFixed(2)}</p>
//                         </div>
//                     </div>
//
//                     <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
//                         <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-gray-400 uppercase text-xs tracking-widest hover:text-gray-600 transition-all">Cancel</button>
//                         <button type="submit" disabled={loading} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 disabled:bg-gray-200 transition-all shadow-xl active:scale-95">
//                             {loading ? (
//                                 <div className="flex items-center gap-2"><LoadingSpinner size="xs" /> Updating...</div>
//                             ) : "Update Advance"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// UpdateSalaryAdvanceModal.propTypes = {
//     isOpen: PropTypes.bool.isRequired,
//     onClose: PropTypes.func.isRequired,
//     onSuccess: PropTypes.func,
//     advanceData: PropTypes.object.isRequired,
// };
//
// export default UpdateSalaryAdvanceModal;


import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { 
  FaMoneyBillWave, FaMobileAlt, FaUniversity, 
  FaRegStickyNote, FaCheckCircle, FaTimes,
  FaCogs, FaHashtag, FaInfoCircle,
  FaCoins, FaCalendarAlt, FaHistory
} from "react-icons/fa";
import BASE_URL_of_POS from "../../../posConfig";

const UpdateSalaryAdvanceModal = ({ isOpen, onClose, onSuccess, advanceData }) => {
    const [form, setForm] = useState({
        amount: "",
        request_date: "",
        reason: "",
        paid_cash: 0,
        paid_mobile: 0,
        paid_bank: 0,
        payment_method: "cash",
        mobile_operator: "",
        transaction_id: "",
        bank_name: ""
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (advanceData && isOpen) {
            setForm({
                amount: advanceData.amount || "",
                request_date: advanceData.request_date || "",
                reason: advanceData.reason || "",
                paid_cash: advanceData.paid_cash || 0,
                paid_mobile: advanceData.paid_mobile || 0,
                paid_bank: advanceData.paid_bank || 0,
                payment_method: advanceData.payment_method || "cash",
                mobile_operator: advanceData.mobile_operator || "",
                transaction_id: advanceData.transaction_id || "",
                bank_name: advanceData.bank_name || ""
            });
        }
    }, [advanceData, isOpen]);

    useEffect(() => {
        const counts = [Number(form.paid_cash) > 0, Number(form.paid_mobile) > 0, Number(form.paid_bank) > 0].filter(Boolean).length;
        let method = "cash";
        if (counts > 1) method = "hybrid";
        else if (Number(form.paid_mobile) > 0) method = "mobile_banking";
        else if (Number(form.paid_bank) > 0) method = "bank";
        setForm(prev => ({ ...prev, payment_method: method }));
    }, [form.paid_cash, form.paid_mobile, form.paid_bank]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleAmountChange = (e) => {
        const { name, value } = e.target;
        const val = value === "" ? 0 : parseFloat(value);
        setForm(prev => ({ ...prev, [name]: isNaN(val) ? 0 : val }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const totalPaid = Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank);
        if (totalPaid !== Number(form.amount)) {
            alert(`Total disbursement (৳${totalPaid}) must match advance amount (৳${form.amount})`);
            setLoading(false);
            return;
        }

        try {
            const res = await axios.patch(
                `${BASE_URL_of_POS}/api/users/salary-advances/${advanceData.id}/`,
                { ...form, amount: Number(form.amount) }
            );
            onSuccess?.(res.data);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-white/20">
                <div className="px-8 py-6 bg-gray-900 text-white flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-600/30"><FaCogs /></div>
                        <div><h2 className="text-xl font-black uppercase tracking-tight">Edit Salary Advance</h2><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: #{advanceData?.id} | {advanceData?.user_name}</p></div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-red-500 transition-all duration-300 group"><FaTimes className="group-hover:rotate-90 transition-transform" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FaCoins/> Advance Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-black text-sm">৳</span>
                                <input type="number" name="amount" value={form.amount} onChange={handleChange} className="w-full bg-blue-50/30 border-2 border-blue-50 pl-8 pr-4 py-4 rounded-2xl font-black text-blue-700 focus:bg-white focus:border-blue-500 outline-none transition-all" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FaCalendarAlt/> Payment Date</label>
                            <input type="date" name="request_date" value={form.request_date} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl font-bold focus:bg-white focus:border-gray-900 outline-none transition-all" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FaRegStickyNote/> Reason / Note</label>
                        <textarea name="reason" value={form.reason} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-3xl text-sm font-medium focus:bg-white focus:border-gray-900 outline-none transition-all resize-none" rows="2" />
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3"><div className="w-1.5 h-6 bg-blue-600 rounded-full"></div><h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Payment Breakdown</h3></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative"><label className="text-[10px] font-black text-green-600 uppercase mb-2 ml-1 flex items-center gap-1.5"><FaMoneyBillWave /> Cash</label>
                                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 font-black text-sm">৳</span><input type="number" name="paid_cash" value={form.paid_cash} onChange={handleAmountChange} className="w-full bg-green-50/30 border-2 border-green-100 pl-8 pr-4 py-4 rounded-2xl font-black text-green-700 focus:bg-white focus:border-green-500 outline-none transition-all" /></div>
                            </div>
                            <div className="relative"><label className="text-[10px] font-black text-purple-600 uppercase mb-2 ml-1 flex items-center gap-1.5"><FaMobileAlt /> Mobile</label>
                                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600 font-black text-sm">৳</span><input type="number" name="paid_mobile" value={form.paid_mobile} onChange={handleAmountChange} className="w-full bg-purple-50/30 border-2 border-purple-100 pl-8 pr-4 py-4 rounded-2xl font-black text-purple-700 focus:bg-white focus:border-purple-500 outline-none transition-all" /></div>
                            </div>
                            <div className="relative"><label className="text-[10px] font-black text-blue-600 uppercase mb-2 ml-1 flex items-center gap-1.5"><FaUniversity /> Bank</label>
                                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-black text-sm">৳</span><input type="number" name="paid_bank" value={form.paid_bank} onChange={handleAmountChange} className="w-full bg-blue-50/30 border-2 border-blue-100 pl-8 pr-4 py-4 rounded-2xl font-black text-blue-700 focus:bg-white focus:border-blue-500 outline-none transition-all" /></div>
                            </div>
                        </div>

                        {Number(form.paid_mobile) > 0 && (
                            <div className="grid grid-cols-2 gap-4 p-6 bg-purple-50/50 rounded-3xl border border-purple-100 animate-in slide-in-from-top-4 duration-500">
                                <div className="space-y-2"><label className="text-[9px] font-black text-purple-600 uppercase ml-1 tracking-widest">Operator</label><select name="mobile_operator" value={form.mobile_operator} onChange={handleChange} className="w-full bg-white border-2 border-purple-100 p-3 rounded-xl font-bold text-sm focus:border-purple-500 outline-none transition-all" required><option value="">Select</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="rocket">Rocket</option><option value="upay">Upay</option></select></div>
                                <div className="space-y-2"><label className="text-[9px] font-black text-purple-600 uppercase ml-1 tracking-widest">Transaction ID</label><div className="relative"><FaHashtag className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" /><input name="transaction_id" value={form.transaction_id} onChange={handleChange} className="w-full bg-white border-2 border-purple-100 pl-9 pr-3 py-3 rounded-xl text-sm font-bold focus:border-purple-500 outline-none transition-all" /></div></div>
                            </div>
                        )}
                        {Number(form.paid_bank) > 0 && (
                            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 animate-in slide-in-from-top-4 duration-500 space-y-2"><label className="text-[9px] font-black text-blue-600 uppercase ml-1 tracking-widest">Bank Name / Reference</label><div className="relative"><FaInfoCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" /><input name="bank_name" value={form.bank_name} onChange={handleChange} className="w-full bg-white border-2 border-blue-100 pl-9 pr-3 py-3 rounded-xl font-bold text-sm focus:border-blue-500 outline-none transition-all" required /></div></div>
                        )}
                    </div>

                    <div className="bg-gray-900 p-8 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="relative z-10 text-center sm:text-left"><p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Updated Total</p><p className="text-4xl font-black text-white"><span className="text-green-500 text-2xl mr-1">৳</span>{(Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
                        <div className="relative z-10 text-center sm:text-right border-t sm:border-t-0 sm:border-l border-gray-800 pt-6 sm:pt-0 sm:pl-8">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Target Amount</p>
                            <p className="text-2xl font-black text-blue-400">৳{Number(form.amount || 0).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t-2 border-dashed border-gray-100">
                        <button type="button" onClick={onClose} className="flex-1 px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.3em] hover:text-gray-900 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-[2] bg-blue-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-blue-600/30 active:scale-95 hover:bg-blue-500 transition-all flex items-center justify-center gap-3 disabled:bg-gray-200">
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><FaCheckCircle /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

UpdateSalaryAdvanceModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    advanceData: PropTypes.object.isRequired,
};

export default UpdateSalaryAdvanceModal;
