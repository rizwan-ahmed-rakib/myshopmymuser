// import React, { useState, useEffect } from "react";
// import api from '../../../context_or_provider/pos/posApi';
// 
// import { useUserWithProfile } from "../../../context_or_provider/pos/profile/userWithProfile";
//
// const AddEmployeeSalaryAdvanceModal = ({ isOpen, onClose, onSuccess }) => {
//     const { allProfile } = useUserWithProfile();
//
//     const [form, setForm] = useState({
//         user: "",
//         amount: "",
//         reason: "",
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
//     const [errors, setErrors] = useState({});
//
//     // Auto update payment method based on inputs
//     useEffect(() => {
//         const counts = [Number(form.paid_cash) > 0, Number(form.paid_mobile) > 0, Number(form.paid_bank) > 0].filter(Boolean).length;
//         let method = "cash";
//         if (counts > 1) {
//             method = "hybrid";
//         } else if (Number(form.paid_mobile) > 0) {
//             method = "mobile_banking";
//         } else if (Number(form.paid_bank) > 0) {
//             method = "bank";
//         }
//         setForm(prev => ({ ...prev, payment_method: method }));
//     }, [form.paid_cash, form.paid_mobile, form.paid_bank]);
//
//     if (!isOpen) return null;
//
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm(prev => ({ ...prev, [name]: value }));
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
//         setErrors({});
//
//         if (!form.user) {
//             setErrors({ user: "Employee required" });
//             setLoading(false);
//             return;
//         }
//
//         const totalPaid = Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank);
//         if (totalPaid !== Number(form.amount)) {
//             alert(`Total payment (৳${totalPaid}) must match advance amount (৳${form.amount})`);
//             setLoading(false);
//             return;
//         }
//
//         try {
//             const res = await api.post(
//                 `${BASE_URL_of_POS}/api/users/salary-advances/`,
//                 { ...form, amount: Number(form.amount) }
//             );
//
//             onSuccess?.(res.data);
//             handleClose();
//         } catch (err) {
//             console.error(err);
//             alert("Failed to add salary advance");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleClose = () => {
//         setForm({
//             user: "", amount: "", reason: "",
//             paid_cash: 0, paid_mobile: 0, paid_bank: 0, payment_method: "cash",
//             mobile_operator: "", transaction_id: "", bank_name: ""
//         });
//         onClose();
//     };
//
//     return (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
//             <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
//                 <div className="px-6 py-4 border-b bg-gray-900 text-white rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
//                     <div>
//                         <h2 className="text-xl font-black uppercase tracking-tight">Add Salary Advance</h2>
//                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Employee Cash/Digital Disbursement</p>
//                     </div>
//                     <button onClick={handleClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
//                 </div>
//
//                 <form onSubmit={handleSubmit} className="p-6 space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Select Employee *</label>
//                             <select name="user" value={form.user} onChange={handleChange} className="w-full p-2 border-2 border-gray-100 rounded-xl font-bold focus:border-blue-500 outline-none" required>
//                                 <option value="">Select Employee</option>
//                                 {allProfile?.map(emp => (
//                                     <option key={emp.id} value={emp.user}>
//                                         {emp.name} ({emp.role})
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Advance Amount *</label>
//                             <input type="number" name="amount" value={form.amount} onChange={handleChange} className="w-full p-2 border-2 border-gray-100 rounded-xl font-black text-blue-700" placeholder="0.00" required />
//                         </div>
//                     </div>
//
//                     <div>
//                         <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Reason</label>
//                         <textarea name="reason" value={form.reason} onChange={handleChange} className="w-full p-2 border-2 border-gray-100 rounded-xl" rows="2" placeholder="Why this advance?" />
//                     </div>
//
//                     {/* Hybrid Payment Breakdown */}
//                     <div className="bg-gray-50 p-5 rounded-2xl border-2 border-gray-100 space-y-4 shadow-inner">
//                         <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Payout Breakdown (Hybrid)</label>
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
//                         {Number(form.paid_mobile) > 0 && (
//                             <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border-2 border-orange-50 animate-slideDown">
//                                 <div>
//                                     <label className="text-[9px] font-black text-orange-600 uppercase">Operator</label>
//                                     <select name="mobile_operator" value={form.mobile_operator} onChange={handleChange} className="w-full border-2 border-gray-50 p-2 rounded-lg font-bold" required>
//                                         <option value="">Select</option>
//                                         <option value="bkash">bKash</option>
//                                         <option value="nagad">Nagad</option>
//                                         <option value="rocket">Rocket</option>
//                                         <option value="upay">Upay</option>
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label className="text-[9px] font-black text-orange-600 uppercase">TxID</label>
//                                     <input name="transaction_id" value={form.transaction_id} onChange={handleChange} className="w-full border-2 border-gray-50 p-2 rounded-lg" placeholder="Optional" />
//                                 </div>
//                             </div>
//                         )}
//                         {Number(form.paid_bank) > 0 && (
//                             <div className="p-3 bg-white rounded-xl border-2 border-blue-50 animate-slideDown">
//                                 <label className="text-[9px] font-black text-blue-600 uppercase block mb-1">Bank / Reference</label>
//                                 <input name="bank_name" value={form.bank_name} onChange={handleChange} className="w-full border-2 border-gray-50 p-2 rounded-lg font-bold" required />
//                             </div>
//                         )}
//                     </div>
//
//                     <div className="bg-gray-900 p-5 rounded-2xl flex justify-between items-center shadow-xl">
//                         <div className="text-white">
//                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Payout</p>
//                             <p className="text-2xl font-black text-green-400 font-mono">৳{(Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank)).toFixed(2)}</p>
//                         </div>
//                         <div className="text-right">
//                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Target Amount</p>
//                             <p className="text-xl font-black text-blue-400 font-mono">৳{Number(form.amount || 0).toFixed(2)}</p>
//                         </div>
//                     </div>
//
//                     <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
//                         <button type="button" onClick={handleClose} className="px-6 py-3 font-bold text-gray-400 uppercase text-xs tracking-widest hover:text-gray-600 transition-all">Discard</button>
//                         <button type="submit" disabled={loading} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 disabled:bg-gray-200 transition-all shadow-xl active:scale-95">
//                             {loading ? "Processing..." : "Disburse Advance"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default AddEmployeeSalaryAdvanceModal;

import React, { useState, useEffect } from "react";
import api from '../../../context_or_provider/pos/posApi';
import { 
  FaMoneyBillWave, FaMobileAlt, FaUniversity, 
  FaRegStickyNote, FaCheckCircle,
  FaHashtag, FaInfoCircle, FaPlusCircle,
  FaCoins, FaCalendarAlt
} from "react-icons/fa";

import BaseModal from "../../components/BaseModal";
import EmployeeSelect from "../components/EmployeeSelect";

const AddEmployeeSalaryAdvanceModal = ({ isOpen, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        user: "",
        amount: "",
        request_date: new Date().toISOString().split('T')[0],
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

    const handleEmployeeChange = (e) => {
        setForm(prev => ({ ...prev, user: e.target.value }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        if (!form.user) {
            alert("Please select an employee");
            setLoading(false);
            return;
        }

        const totalPaid = Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank);
        if (totalPaid !== Number(form.amount)) {
            alert(`Total payment (৳${totalPaid}) must match advance amount (৳${form.amount})`);
            setLoading(false);
            return;
        }

        try {
            const res = await api.post(`/api/users/salary-advances/`,
                { ...form, amount: Number(form.amount) }
            );
            onSuccess?.(res.data);
            handleClose();
        } catch (err) {
            console.error(err);
            alert("Failed to record salary advance");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setForm({
            user: "", amount: "", request_date: new Date().toISOString().split('T')[0], reason: "",
            paid_cash: 0, paid_mobile: 0, paid_bank: 0, payment_method: "cash",
            mobile_operator: "", transaction_id: "", bank_name: ""
        });
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Salary Advance"
            size="lg"
            variant="primary"
            icon={<FaPlusCircle />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Record Advance"
            submitColor="bg-emerald-600 hover:bg-emerald-700 text-white"
            isLoading={loading}
        >
            <div className="p-1 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EmployeeSelect 
                        value={form.user} 
                        onChange={handleEmployeeChange} 
                        label="Select Employee *"
                    />
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FaCoins/> Advance Amount *</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-sm">৳</span>
                            <input type="number" name="amount" value={form.amount} onChange={handleChange} className="w-full bg-emerald-50/30 border-2 border-emerald-50 pl-8 pr-4 py-4 rounded-2xl font-black text-emerald-700 focus:bg-white focus:border-emerald-500 outline-none transition-all" placeholder="0.00" required />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FaCalendarAlt/> Payment Date</label>
                    <input type="date" name="request_date" value={form.request_date} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl font-bold focus:bg-white focus:border-gray-900 outline-none transition-all" />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FaRegStickyNote/> Reason / Note</label>
                    <textarea name="reason" value={form.reason} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-3xl text-sm font-medium focus:bg-white focus:border-gray-900 outline-none transition-all resize-none" rows="2" placeholder="e.g. Salary advance for May 2024..." />
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3"><div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div><h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Payment Breakdown</h3></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative"><label className="text-[10px] font-black text-green-600 uppercase mb-2 ml-1 flex items-center gap-1.5"><FaMoneyBillWave /> Cash</label>
                            <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 font-black text-sm">৳</span><input type="number" name="paid_cash" value={form.paid_cash} onChange={handleAmountChange} className="w-full bg-green-50/30 border-2 border-green-100 pl-8 pr-4 py-3 rounded-2xl font-black text-green-700 focus:bg-white focus:border-green-500 outline-none transition-all" /></div>
                        </div>
                        <div className="relative"><label className="text-[10px] font-black text-purple-600 uppercase mb-2 ml-1 flex items-center gap-1.5"><FaMobileAlt /> Mobile</label>
                            <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600 font-black text-sm">৳</span><input type="number" name="paid_mobile" value={form.paid_mobile} onChange={handleAmountChange} className="w-full bg-purple-50/30 border-2 border-purple-100 pl-8 pr-4 py-3 rounded-2xl font-black text-purple-700 focus:bg-white focus:border-purple-500 outline-none transition-all" /></div>
                        </div>
                        <div className="relative"><label className="text-[10px] font-black text-blue-600 uppercase mb-2 ml-1 flex items-center gap-1.5"><FaUniversity /> Bank</label>
                            <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-black text-sm">৳</span><input type="number" name="paid_bank" value={form.paid_bank} onChange={handleAmountChange} className="w-full bg-blue-50/30 border-2 border-blue-100 pl-8 pr-4 py-3 rounded-2xl font-black text-blue-700 focus:bg-white focus:border-blue-500 outline-none transition-all" /></div>
                        </div>
                    </div>

                    {Number(form.paid_mobile) > 0 && (
                        <div className="grid grid-cols-2 gap-4 p-6 bg-purple-50/50 rounded-3xl border border-purple-100 animate-in slide-in-from-top-4 duration-500">
                            <div className="space-y-2"><label className="text-[9px] font-black text-purple-600 uppercase ml-1 tracking-widest">Operator</label><select name="mobile_operator" value={form.mobile_operator} onChange={handleChange} className="w-full bg-white border-2 border-purple-100 p-3 rounded-xl font-bold text-sm focus:border-purple-500 outline-none transition-all" required><option value="">Select</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="rocket">Rocket</option><option value="upay">Upay</option></select></div>
                            <div className="space-y-2"><label className="text-[9px] font-black text-purple-600 uppercase ml-1 tracking-widest">Transaction ID</label><div className="relative"><FaHashtag className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" /><input name="transaction_id" value={form.transaction_id} onChange={handleChange} className="w-full bg-white border-2 border-purple-100 pl-9 pr-3 py-2.5 rounded-xl text-sm font-bold focus:border-purple-500 outline-none transition-all" placeholder="TxID" /></div></div>
                        </div>
                    )}
                    {Number(form.paid_bank) > 0 && (
                        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 animate-in slide-in-from-top-4 duration-500 space-y-2"><label className="text-[9px] font-black text-blue-600 uppercase ml-1 tracking-widest">Bank Name / Reference</label><div className="relative"><FaInfoCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" /><input name="bank_name" value={form.bank_name} onChange={handleChange} className="w-full bg-white border-2 border-blue-100 pl-9 pr-3 py-2.5 rounded-xl font-bold text-sm focus:border-blue-500 outline-none transition-all" placeholder="e.g. DBBL Check #1234" required /></div></div>
                    )}
                </div>

                <div className="bg-gray-900 p-8 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="relative z-10 text-center sm:text-left"><p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Total Disbursed</p><p className="text-4xl font-black text-white"><span className="text-emerald-500 text-2xl mr-1">৳</span>{(Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
                    <div className="relative z-10 text-center sm:text-right border-t sm:border-t-0 sm:border-l border-gray-800 pt-6 sm:pt-0 sm:pl-8"><p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Target Advance</p><p className="text-2xl font-black text-blue-400">৳{Number(form.amount || 0).toLocaleString()}</p></div>
                </div>
            </div>
        </BaseModal>
    );
};

export default AddEmployeeSalaryAdvanceModal;
