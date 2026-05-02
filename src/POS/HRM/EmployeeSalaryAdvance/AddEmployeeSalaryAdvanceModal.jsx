import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";
import { useUserWithProfile } from "../../../context_or_provider/pos/profile/userWithProfile";

const AddEmployeeSalaryAdvanceModal = ({ isOpen, onClose, onSuccess }) => {
    const { allProfile } = useUserWithProfile();

    const [form, setForm] = useState({
        user: "",
        amount: "",
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
    const [errors, setErrors] = useState({});

    // Auto update payment method based on inputs
    useEffect(() => {
        const counts = [Number(form.paid_cash) > 0, Number(form.paid_mobile) > 0, Number(form.paid_bank) > 0].filter(Boolean).length;
        let method = "cash";
        if (counts > 1) {
            method = "hybrid";
        } else if (Number(form.paid_mobile) > 0) {
            method = "mobile_banking";
        } else if (Number(form.paid_bank) > 0) {
            method = "bank";
        }
        setForm(prev => ({ ...prev, payment_method: method }));
    }, [form.paid_cash, form.paid_mobile, form.paid_bank]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAmountChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        if (!form.user) {
            setErrors({ user: "Employee required" });
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
            const res = await axios.post(
                `${BASE_URL_of_POS}/api/users/salary-advances/`,
                { ...form, amount: Number(form.amount) }
            );

            onSuccess?.(res.data);
            handleClose();
        } catch (err) {
            console.error(err);
            alert("Failed to add salary advance");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setForm({
            user: "", amount: "", reason: "",
            paid_cash: 0, paid_mobile: 0, paid_bank: 0, payment_method: "cash",
            mobile_operator: "", transaction_id: "", bank_name: ""
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
                <div className="px-6 py-4 border-b bg-gray-900 text-white rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Add Salary Advance</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Employee Cash/Digital Disbursement</p>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Select Employee *</label>
                            <select name="user" value={form.user} onChange={handleChange} className="w-full p-2 border-2 border-gray-100 rounded-xl font-bold focus:border-blue-500 outline-none" required>
                                <option value="">Select Employee</option>
                                {allProfile?.map(emp => (
                                    <option key={emp.id} value={emp.user}>
                                        {emp.name} ({emp.role})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Advance Amount *</label>
                            <input type="number" name="amount" value={form.amount} onChange={handleChange} className="w-full p-2 border-2 border-gray-100 rounded-xl font-black text-blue-700" placeholder="0.00" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Reason</label>
                        <textarea name="reason" value={form.reason} onChange={handleChange} className="w-full p-2 border-2 border-gray-100 rounded-xl" rows="2" placeholder="Why this advance?" />
                    </div>

                    {/* Hybrid Payment Breakdown */}
                    <div className="bg-gray-50 p-5 rounded-2xl border-2 border-gray-100 space-y-4 shadow-inner">
                        <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Payout Breakdown (Hybrid)</label>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Cash</label>
                                <input type="number" name="paid_cash" value={form.paid_cash} onChange={handleAmountChange} className="w-full border-2 border-white p-2 rounded-xl font-black text-center text-green-700 focus:border-green-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Mobile</label>
                                <input type="number" name="paid_mobile" value={form.paid_mobile} onChange={handleAmountChange} className="w-full border-2 border-white p-2 rounded-xl font-black text-center text-orange-700 focus:border-orange-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Bank</label>
                                <input type="number" name="paid_bank" value={form.paid_bank} onChange={handleAmountChange} className="w-full border-2 border-white p-2 rounded-xl font-black text-center text-blue-700 focus:border-blue-500 outline-none" />
                            </div>
                        </div>

                        {Number(form.paid_mobile) > 0 && (
                            <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border-2 border-orange-50 animate-slideDown">
                                <div>
                                    <label className="text-[9px] font-black text-orange-600 uppercase">Operator</label>
                                    <select name="mobile_operator" value={form.mobile_operator} onChange={handleChange} className="w-full border-2 border-gray-50 p-2 rounded-lg font-bold" required>
                                        <option value="">Select</option>
                                        <option value="bkash">bKash</option>
                                        <option value="nagad">Nagad</option>
                                        <option value="rocket">Rocket</option>
                                        <option value="upay">Upay</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-orange-600 uppercase">TxID</label>
                                    <input name="transaction_id" value={form.transaction_id} onChange={handleChange} className="w-full border-2 border-gray-50 p-2 rounded-lg" placeholder="Optional" />
                                </div>
                            </div>
                        )}
                        {Number(form.paid_bank) > 0 && (
                            <div className="p-3 bg-white rounded-xl border-2 border-blue-50 animate-slideDown">
                                <label className="text-[9px] font-black text-blue-600 uppercase block mb-1">Bank / Reference</label>
                                <input name="bank_name" value={form.bank_name} onChange={handleChange} className="w-full border-2 border-gray-50 p-2 rounded-lg font-bold" required />
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-900 p-5 rounded-2xl flex justify-between items-center shadow-xl">
                        <div className="text-white">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Payout</p>
                            <p className="text-2xl font-black text-green-400 font-mono">৳{(Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank)).toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Target Amount</p>
                            <p className="text-xl font-black text-blue-400 font-mono">৳{Number(form.amount || 0).toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={handleClose} className="px-6 py-3 font-bold text-gray-400 uppercase text-xs tracking-widest hover:text-gray-600 transition-all">Discard</button>
                        <button type="submit" disabled={loading} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 disabled:bg-gray-200 transition-all shadow-xl active:scale-95">
                            {loading ? "Processing..." : "Disburse Advance"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeeSalaryAdvanceModal;