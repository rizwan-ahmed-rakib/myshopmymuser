// import React, { useState, useEffect, useMemo } from "react";
// import api from '../../../context_or_provider/pos/posApi';
// import Select from "react-select";
// import {
//     FaMoneyBillWave, FaMobileAlt, FaUniversity,
//     FaRegStickyNote, FaCheckCircle, FaTimes,
//     FaCogs, FaHashtag, FaInfoCircle, FaPlusCircle,
//     FaCoins, FaCalendarAlt, FaUserTie, FaHistory
// } from "react-icons/fa";
// 
// import { useUserWithProfile } from "../../../context_or_provider/pos/profile/userWithProfile";
// import BaseModal from "../../components/BaseModal";
// import EmployeeSelect from "../components/EmployeeSelect";
//
// const AddEmployeeLoanModal = ({ isOpen, onClose, onSuccess }) => {
//     const { allProfile } = useUserWithProfile();
//
//     const [form, setForm] = useState({
//         user: "",
//         amount: "",
//         loan_date: new Date().toISOString().split('T')[0],
//         reason: "",
//         repayment_start_date: "",
//         monthly_repayment_amount: "",
//         is_fully_paid: false,
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
//         const counts = [Number(form.paid_cash) > 0, Number(form.paid_mobile) > 0, Number(form.paid_bank) > 0].filter(Boolean).length;
//         let method = "cash";
//         if (counts > 1) method = "hybrid";
//         else if (Number(form.paid_mobile) > 0) method = "mobile_banking";
//         else if (Number(form.paid_bank) > 0) method = "bank";
//         setForm(prev => ({ ...prev, payment_method: method }));
//     }, [form.paid_cash, form.paid_mobile, form.paid_bank]);
//
//     const employeeOptions = useMemo(() =>
//         allProfile?.map(emp => ({ value: emp.id, label: `${emp.name} (${emp.role})` })) || [],
//         [allProfile]
//     );
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
//         const val = value === "" ? 0 : parseFloat(value);
//         setForm(prev => ({ ...prev, [name]: isNaN(val) ? 0 : val }));
//     };
//
//     const handleSelectChange = (option) => {
//         setForm(prev => ({ ...prev, user: option ? option.value : "" }));
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//
//         if (!form.user) {
//             alert("Please select an employee");
//             setLoading(false);
//             return;
//         }
//
//         const totalPaid = Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank);
//         if (totalPaid !== Number(form.amount)) {
//             alert(`Total disbursement (৳${totalPaid}) must match loan amount (৳${form.amount})`);
//             setLoading(false);
//             return;
//         }
//
//         try {
//             const res = await api.post(
//                 `${BASE_URL_of_POS}/api/users/employee-loans/`,
//                 { ...form, amount: Number(form.amount), monthly_repayment_amount: Number(form.monthly_repayment_amount) }
//             );
//             onSuccess?.(res.data);
//             handleClose();
//         } catch (err) {
//             console.error(err);
//             alert("Failed to record loan disbursement");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleClose = () => {
//         setForm({
//             user: "", amount: "", loan_date: new Date().toISOString().split('T')[0], reason: "", repayment_start_date: "",
//             monthly_repayment_amount: "", is_fully_paid: false,
//             paid_cash: 0, paid_mobile: 0, paid_bank: 0, payment_method: "cash",
//             mobile_operator: "", transaction_id: "", bank_name: ""
//         });
//         onClose();
//     };
//
//     const customSelectStyles = {
//         control: (base) => ({ ...base, borderRadius: '1rem', padding: '0.4rem', border: '2px solid #f3f4f6', boxShadow: 'none', '&:hover': { borderColor: '#2563eb' } }),
//         option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#eff6ff' : 'white', fontWeight: 'bold' }),
//         menuPortal: base => ({ ...base, zIndex: 9999 })
//     };
//
//     return (
//         <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300">
//             <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-white/20">
//                 <div className="px-8 py-6 bg-gray-900 text-white flex justify-between items-center sticky top-0 z-10">
//                     <div className="flex items-center gap-4">
//                         <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-600/30"><FaPlusCircle /></div>
//                         <div><h2 className="text-xl font-black uppercase tracking-tight">New Employee Loan</h2><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Disburse Principal with Breakdown</p></div>
//                     </div>
//                     <button onClick={handleClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-red-500 transition-all duration-300 group"><FaTimes className="group-hover:rotate-90 transition-transform" /></button>
//                 </div>
//
//                 <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="space-y-2">
//                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FaUserTie/> Select Employee *</label>
//                             <Select options={employeeOptions} onChange={handleSelectChange} placeholder="Search name..." isClearable styles={customSelectStyles} menuPortalTarget={document.body} />
//                         </div>
//                         <div className="space-y-2">
//                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FaCoins/> Loan Principal *</label>
//                             <div className="relative">
//                                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-black text-sm">৳</span>
//                                 <input type="number" name="amount" value={form.amount} onChange={handleChange} className="w-full bg-blue-50/30 border-2 border-blue-50 pl-8 pr-4 py-4 rounded-2xl font-black text-blue-700 focus:bg-white focus:border-blue-500 outline-none transition-all" placeholder="0.00" required />
//                             </div>
//                         </div>
//                     </div>
//
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="space-y-2">
//                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FaCalendarAlt/> Disbursement Date</label>
//                             <input type="date" name="loan_date" value={form.loan_date} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl font-bold focus:bg-white focus:border-gray-900 outline-none transition-all" />
//                         </div>
//                         <div className="space-y-2">
//                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FaHistory/> Repayment Start</label>
//                             <input type="date" name="repayment_start_date" value={form.repayment_start_date} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl font-bold focus:bg-white focus:border-gray-900 outline-none transition-all" required />
//                         </div>
//                     </div>
//
//                     <div className="space-y-2">
//                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FaCoins/> Monthly Installment *</label>
//                         <div className="relative">
//                             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 font-black text-sm">৳</span>
//                             <input type="number" name="monthly_repayment_amount" value={form.monthly_repayment_amount} onChange={handleChange} className="w-full bg-amber-50/30 border-2 border-amber-50 pl-8 pr-4 py-4 rounded-2xl font-black text-amber-700 focus:bg-white focus:border-amber-500 outline-none transition-all" placeholder="0.00" required />
//                         </div>
//                     </div>
//
//                     <div className="space-y-2">
//                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FaRegStickyNote/> Reason / Note</label>
//                         <textarea name="reason" value={form.reason} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-3xl text-sm font-medium focus:bg-white focus:border-gray-900 outline-none transition-all resize-none" rows="2" placeholder="e.g. Personal emergency, Home renovation..." />
//                     </div>
//
//                     <div className="space-y-6">
//                         <div className="flex items-center gap-3"><div className="w-1.5 h-6 bg-blue-600 rounded-full"></div><h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Payment Breakdown</h3></div>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             <div className="relative"><label className="text-[10px] font-black text-green-600 uppercase mb-2 ml-1 flex items-center gap-1.5"><FaMoneyBillWave /> Cash</label>
//                                 <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 font-black text-sm">৳</span><input type="number" name="paid_cash" value={form.paid_cash} onChange={handleAmountChange} className="w-full bg-green-50/30 border-2 border-green-100 pl-8 pr-4 py-4 rounded-2xl font-black text-green-700 focus:bg-white focus:border-green-500 outline-none transition-all" /></div>
//                             </div>
//                             <div className="relative"><label className="text-[10px] font-black text-purple-600 uppercase mb-2 ml-1 flex items-center gap-1.5"><FaMobileAlt /> Mobile</label>
//                                 <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600 font-black text-sm">৳</span><input type="number" name="paid_mobile" value={form.paid_mobile} onChange={handleAmountChange} className="w-full bg-purple-50/30 border-2 border-purple-100 pl-8 pr-4 py-4 rounded-2xl font-black text-purple-700 focus:bg-white focus:border-purple-500 outline-none transition-all" /></div>
//                             </div>
//                             <div className="relative"><label className="text-[10px] font-black text-blue-600 uppercase mb-2 ml-1 flex items-center gap-1.5"><FaUniversity /> Bank</label>
//                                 <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-black text-sm">৳</span><input type="number" name="paid_bank" value={form.paid_bank} onChange={handleAmountChange} className="w-full bg-blue-50/30 border-2 border-blue-100 pl-8 pr-4 py-4 rounded-2xl font-black text-blue-700 focus:bg-white focus:border-blue-500 outline-none transition-all" /></div>
//                             </div>
//                         </div>
//
//                         {Number(form.paid_mobile) > 0 && (
//                             <div className="grid grid-cols-2 gap-4 p-6 bg-purple-50/50 rounded-3xl border border-purple-100 animate-in slide-in-from-top-4 duration-500">
//                                 <div className="space-y-2"><label className="text-[9px] font-black text-purple-600 uppercase ml-1 tracking-widest">Operator</label><select name="mobile_operator" value={form.mobile_operator} onChange={handleChange} className="w-full bg-white border-2 border-purple-100 p-3 rounded-xl font-bold text-sm focus:border-purple-500 outline-none transition-all" required><option value="">Select</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="rocket">Rocket</option><option value="upay">Upay</option></select></div>
//                                 <div className="space-y-2"><label className="text-[9px] font-black text-purple-600 uppercase ml-1 tracking-widest">Transaction ID</label><div className="relative"><FaHashtag className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" /><input name="transaction_id" value={form.transaction_id} onChange={handleChange} className="w-full bg-white border-2 border-purple-100 pl-9 pr-3 py-3 rounded-xl text-sm font-bold focus:border-purple-500 outline-none transition-all" placeholder="TxID" /></div></div>
//                             </div>
//                         )}
//                         {Number(form.paid_bank) > 0 && (
//                             <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 animate-in slide-in-from-top-4 duration-500 space-y-2"><label className="text-[9px] font-black text-blue-600 uppercase ml-1 tracking-widest">Bank Name / Reference</label><div className="relative"><FaInfoCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" /><input name="bank_name" value={form.bank_name} onChange={handleChange} className="w-full bg-white border-2 border-blue-100 pl-9 pr-3 py-3 rounded-xl font-bold text-sm focus:border-blue-500 outline-none transition-all" placeholder="e.g. Dutch Bangla Bank, Check #1234" required /></div></div>
//                         )}
//                     </div>
//
//                     <div className="bg-gray-900 p-8 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden group">
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
//                         <div className="relative z-10 text-center sm:text-left"><p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Total Payout</p><p className="text-4xl font-black text-white"><span className="text-green-500 text-2xl mr-1">৳</span>{(Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
//                         <div className="relative z-10 text-center sm:text-right border-t sm:border-t-0 sm:border-l border-gray-800 pt-6 sm:pt-0 sm:pl-8"><p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Target Amount</p><p className="text-2xl font-black text-blue-400">৳{Number(form.amount || 0).toLocaleString()}</p></div>
//                     </div>
//
//                     <div className="flex gap-4 pt-4 border-t-2 border-dashed border-gray-100">
//                         <button type="button" onClick={handleClose} className="flex-1 px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.3em] hover:text-gray-900 transition-colors">Discard</button>
//                         <button type="submit" disabled={loading || Number(form.amount) <= 0} className="flex-[2] bg-blue-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-blue-600/30 active:scale-95 hover:bg-blue-500 transition-all flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400">
//                             {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><FaCheckCircle /> Disburse Loan</>}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default AddEmployeeLoanModal;



import React, { useState, useEffect } from "react";
import api from '../../../context_or_provider/pos/posApi';
import {
    FaMoneyBillWave, FaMobileAlt, FaUniversity,
    FaRegStickyNote, FaCheckCircle,
    FaHashtag, FaInfoCircle,
    FaCalendarAlt, FaCoins, FaUserTie, FaHistory
} from "react-icons/fa";

import { useUserWithProfile } from "../../../context_or_provider/pos/profile/userWithProfile";
import BaseModal from "../../components/BaseModal";
import EmployeeSelect from "../components/EmployeeSelect";

const AddEmployeeLoanModal = ({ isOpen, onClose, onSuccess }) => {
    const { allProfile } = useUserWithProfile();

    const [form, setForm] = useState({
        user: "",
        amount: 0,
        loan_date: new Date().toISOString().split('T')[0],
        reason: "",
        repayment_start_date: "",
        monthly_repayment_amount: 0,
        is_fully_paid: false,
        paid_cash: 0,
        paid_mobile: 0,
        paid_bank: 0,
        payment_method: "cash",
        mobile_operator: "",
        transaction_id: "",
        bank_name: ""
    });

    const [loading, setLoading] = useState(false);

    // পেমেন্ট মেথড অটো-আপডেট লজিক
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

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        const val = value === "" ? 0 : parseFloat(value);
        setForm(prev => ({ ...prev, [name]: isNaN(val) ? 0 : val }));
    };

    // এমপ্লয়ী সিলেক্ট চেঞ্জ হ্যান্ডলার
    const handleEmployeeChange = (e) => {
        const userId = e.target.value;
        const selectedEmp = allProfile?.find(emp => emp.id === parseInt(userId));

        if (selectedEmp) {
            setForm(prev => ({
                ...prev,
                user: selectedEmp.id
            }));
        } else {
            setForm(prev => ({ ...prev, user: "" }));
        }
    };

    const totalPaid = Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        if (!form.user) {
            alert("Please select an employee");
            setLoading(false);
            return;
        }

        if (totalPaid !== Number(form.amount)) {
            alert(`Total disbursement (৳${totalPaid}) must match loan amount (৳${form.amount})`);
            setLoading(false);
            return;
        }

        try {
            const res = await api.post(`/api/users/employee-loans/`,
                {
                    ...form,
                    amount: Number(form.amount),
                    monthly_repayment_amount: Number(form.monthly_repayment_amount)
                }
            );
            onSuccess?.(res.data);
            handleClose();
        } catch (err) {
            console.error(err);
            alert("Failed to record loan disbursement");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setForm({
            user: "", amount: 0, loan_date: new Date().toISOString().split('T')[0], reason: "", repayment_start_date: "",
            monthly_repayment_amount: 0, is_fully_paid: false,
            paid_cash: 0, paid_mobile: 0, paid_bank: 0, payment_method: "cash",
            mobile_operator: "", transaction_id: "", bank_name: ""
        });
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="New Employee Loan"
            size="lg"
            icon={<FaCoins />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Disburse Loan"
            isLoading={loading}
        >
            <div className="space-y-6">
                {/* এমপ্লয়ী ও প্রিন্সিপাল অ্যামাউন্ট গ্রিড */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EmployeeSelect
                        value={form.user}
                        onChange={handleEmployeeChange}
                        label="Select Employee *"
                    />
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <FaCoins/> Loan Principal *
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-black text-sm">৳</span>
                            <input
                                type="number"
                                name="amount"
                                value={form.amount || ""}
                                onChange={handleNumberChange}
                                className="w-full bg-blue-50/30 border-2 border-blue-50 pl-8 pr-4 py-3.5 rounded-2xl font-black text-blue-700 focus:bg-white focus:border-blue-500 outline-none transition-all"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* তারিখ গ্রিড */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <FaCalendarAlt/> Disbursement Date
                        </label>
                        <input
                            type="date"
                            name="loan_date"
                            value={form.loan_date}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-gray-100 p-3.5 rounded-2xl font-bold focus:bg-white focus:border-gray-900 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <FaHistory/> Repayment Start
                        </label>
                        <input
                            type="date"
                            name="repayment_start_date"
                            value={form.repayment_start_date}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-gray-100 p-3.5 rounded-2xl font-bold focus:bg-white focus:border-gray-900 outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                {/* মান্থলি ইন্সটলমেন্ট */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <FaCoins/> Monthly Installment *
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 font-black text-sm">৳</span>
                        <input
                            type="number"
                            name="monthly_repayment_amount"
                            value={form.monthly_repayment_amount || ""}
                            onChange={handleNumberChange}
                            className="w-full bg-amber-50/30 border-2 border-amber-50 pl-8 pr-4 py-3.5 rounded-2xl font-black text-amber-700 focus:bg-white focus:border-amber-500 outline-none transition-all"
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>

                {/* লোন নোট / রিজন */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <FaRegStickyNote/> Reason / Note
                    </label>
                    <textarea
                        name="reason"
                        value={form.reason}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-3xl text-sm font-medium focus:bg-white focus:border-gray-900 outline-none transition-all resize-none"
                        rows="2"
                        placeholder="e.g. Personal emergency, Home renovation..."
                    />
                </div>

                {/* পেমেন্ট ব্রেকডাউন সেকশন */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Payment Breakdown</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <label className="text-[10px] font-black text-green-600 uppercase mb-2 ml-1 flex items-center gap-1.5"><FaMoneyBillWave /> Cash</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 font-black text-sm">৳</span>
                                <input type="number" name="paid_cash" value={form.paid_cash || ""} onChange={handleNumberChange} className="w-full bg-green-50/30 border-2 border-green-100 pl-8 pr-4 py-3 rounded-2xl font-black text-green-700 focus:bg-white focus:border-green-500 outline-none transition-all" />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="text-[10px] font-black text-purple-600 uppercase mb-2 ml-1 flex items-center gap-1.5"><FaMobileAlt /> Mobile</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600 font-black text-sm">৳</span>
                                <input type="number" name="paid_mobile" value={form.paid_mobile || ""} onChange={handleNumberChange} className="w-full bg-purple-50/30 border-2 border-purple-100 pl-8 pr-4 py-3 rounded-2xl font-black text-purple-700 focus:bg-white focus:border-purple-500 outline-none transition-all" />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="text-[10px] font-black text-blue-600 uppercase mb-2 ml-1 flex items-center gap-1.5"><FaUniversity /> Bank</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-black text-sm">৳</span>
                                <input type="number" name="paid_bank" value={form.paid_bank || ""} onChange={handleNumberChange} className="w-full bg-blue-50/30 border-2 border-blue-100 pl-8 pr-4 py-3 rounded-2xl font-black text-blue-700 focus:bg-white focus:border-blue-500 outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* মোবাইল গেটওয়ে এক্সট্রা ফিল্ডস */}
                    {Number(form.paid_mobile) > 0 && (
                        <div className="grid grid-cols-2 gap-4 p-6 bg-purple-50/50 rounded-3xl border border-purple-100 animate-in slide-in-from-top-4 duration-500">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-purple-600 uppercase ml-1 tracking-widest">Operator</label>
                                <select name="mobile_operator" value={form.mobile_operator} onChange={handleChange} className="w-full bg-white border-2 border-purple-100 p-3 rounded-xl font-bold text-sm focus:border-purple-500 outline-none transition-all" required>
                                    <option value="">Select</option>
                                    <option value="bkash">bKash</option>
                                    <option value="nagad">Nagad</option>
                                    <option value="rocket">Rocket</option>
                                    <option value="upay">Upay</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-purple-600 uppercase ml-1 tracking-widest">Transaction ID</label>
                                <div className="relative">
                                    <FaHashtag className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" />
                                    <input name="transaction_id" value={form.transaction_id} onChange={handleChange} className="w-full bg-white border-2 border-purple-100 pl-9 pr-3 py-2.5 rounded-xl text-sm font-bold focus:border-purple-500 outline-none transition-all" placeholder="TxID" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ব্যাংক রেফারেন্স এক্সট্রা ফিল্ডস */}
                    {Number(form.paid_bank) > 0 && (
                        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 animate-in slide-in-from-top-4 duration-500 space-y-2">
                            <label className="text-[9px] font-black text-blue-600 uppercase ml-1 tracking-widest">Bank Name / Reference</label>
                            <div className="relative">
                                <FaInfoCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                                <input name="bank_name" value={form.bank_name} onChange={handleChange} className="w-full bg-white border-2 border-blue-100 pl-9 pr-3 py-2.5 rounded-xl font-bold text-sm focus:border-blue-500 outline-none transition-all" placeholder="e.g. City Bank Deposit, Check #1234" required />
                            </div>
                        </div>
                    )}
                </div>

                {/* বটম সামারি কার্ড */}
                <div className="bg-gray-900 p-8 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="relative z-10 text-center sm:text-left">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Total Payout</p>
                        <p className="text-4xl font-black text-white"><span className="text-emerald-500 text-2xl mr-1">৳</span>{totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="relative z-10 text-center sm:text-right border-t sm:border-t-0 sm:border-l border-gray-800 pt-6 sm:pt-0 sm:pl-8">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Target Amount</p>
                        <p className="text-2xl font-black text-blue-400">৳{Number(form.amount || 0).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default AddEmployeeLoanModal;