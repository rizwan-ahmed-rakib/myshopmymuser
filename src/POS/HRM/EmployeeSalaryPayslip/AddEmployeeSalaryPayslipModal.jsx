import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";
import { useUserWithProfile } from "../../../context_or_provider/pos/profile/userWithProfile";

const AddEmployeeSalaryPayslipModal = ({ isOpen, onClose, onSuccess }) => {
    const { allProfile } = useUserWithProfile();

    const [form, setForm] = useState({
        user: "",
        month: "",
        year: "",
        basic_salary: "",
        allowances: "",
        deductions: "",
        net_salary: 0,
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

    // 👉 Auto calculate net salary
    useEffect(() => {
        const basic = Number(form.basic_salary) || 0;
        const allowance = Number(form.allowances) || 0;
        const deduction = Number(form.deductions) || 0;
        setForm(prev => ({ ...prev, net_salary: basic + allowance - deduction }));
    }, [form.basic_salary, form.allowances, form.deductions]);

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
        if (totalPaid !== Number(form.net_salary)) {
            alert(`Total payment (৳${totalPaid}) must match net salary (৳${form.net_salary})`);
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(
                `${BASE_URL_of_POS}/api/users/payslips/`,
                { 
                    ...form, 
                    month: Number(form.month), 
                    year: Number(form.year),
                    basic_salary: Number(form.basic_salary),
                    allowances: Number(form.allowances),
                    deductions: Number(form.deductions),
                    net_salary: Number(form.net_salary)
                }
            );

            onSuccess?.(res.data);
            handleClose();
        } catch (err) {
            console.error(err);
            alert("Failed to add payslip");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setForm({
            user: "", month: "", year: "", basic_salary: "", allowances: "", deductions: "",
            net_salary: 0, paid_cash: 0, paid_mobile: 0, paid_bank: 0,
            payment_method: "cash", mobile_operator: "", transaction_id: "", bank_name: ""
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
                <div className="px-6 py-4 border-b bg-gray-900 text-white rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Generate Payslip</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Process Monthly Salary with Hybrid Payout</p>
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
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Month</label>
                                <input type="number" name="month" min="1" max="12" value={form.month} onChange={handleChange} className="w-full p-2 border-2 border-gray-100 rounded-xl font-bold" placeholder="MM" required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Year</label>
                                <input type="number" name="year" min="2000" value={form.year} onChange={handleChange} className="w-full p-2 border-2 border-gray-100 rounded-xl font-bold" placeholder="YYYY" required />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Basic Salary</label>
                            <input type="number" name="basic_salary" value={form.basic_salary} onChange={handleChange} className="w-full p-2 border-2 border-gray-100 rounded-xl" placeholder="0.00" required />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Allowances</label>
                            <input type="number" name="allowances" value={form.allowances} onChange={handleChange} className="w-full p-2 border-2 border-gray-100 rounded-xl text-green-600 font-bold" placeholder="0.00" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Deductions</label>
                            <input type="number" name="deductions" value={form.deductions} onChange={handleChange} className="w-full p-2 border-2 border-gray-100 rounded-xl text-red-600 font-bold" placeholder="0.00" />
                        </div>
                    </div>

                    {/* Hybrid Payout Breakdown */}
                    <div className="bg-gray-50 p-5 rounded-2xl border-2 border-gray-100 space-y-4 shadow-inner">
                        <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Salary Payout Breakdown (Hybrid)</label>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Cash</label>
                                <input type="number" name="paid_cash" value={form.paid_cash} onChange={handleAmountChange} className="w-full border-2 border-white p-2 rounded-xl font-black text-center text-green-700 focus:border-green-500 outline-none shadow-sm" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Mobile</label>
                                <input type="number" name="paid_mobile" value={form.paid_mobile} onChange={handleAmountChange} className="w-full border-2 border-white p-2 rounded-xl font-black text-center text-orange-700 focus:border-orange-500 outline-none shadow-sm" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Bank</label>
                                <input type="number" name="paid_bank" value={form.paid_bank} onChange={handleAmountChange} className="w-full border-2 border-white p-2 rounded-xl font-black text-center text-blue-700 focus:border-blue-500 outline-none shadow-sm" />
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
                                    <input name="transaction_id" value={form.transaction_id} onChange={handleChange} className="w-full border-2 border-gray-50 p-2 rounded-lg font-mono text-xs" placeholder="Optional" />
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
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Distributed</p>
                            <p className="text-2xl font-black text-green-400 font-mono">৳{(Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank)).toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Calculated Net</p>
                            <p className="text-xl font-black text-blue-400 font-mono">৳{form.net_salary.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={handleClose} className="px-6 py-3 font-bold text-gray-400 uppercase text-xs tracking-widest hover:text-gray-600 transition-all">Discard</button>
                        <button type="submit" disabled={loading} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 disabled:bg-gray-200 transition-all shadow-xl active:scale-95">
                            {loading ? "Processing..." : "Process Payout"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeeSalaryPayslipModal;