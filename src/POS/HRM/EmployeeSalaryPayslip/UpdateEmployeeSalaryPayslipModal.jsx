import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";
import LoadingSpinner from "./LoadingSpinner";

const UpdateEmployeeSalaryPayslipModal = ({ isOpen, onClose, onSuccess, advanceData }) => {
    const [form, setForm] = useState({
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

    useEffect(() => {
        if (advanceData && isOpen) {
            setForm({
                month: advanceData.month || "",
                year: advanceData.year || "",
                basic_salary: advanceData.basic_salary || "",
                allowances: advanceData.allowances || "",
                deductions: advanceData.deductions || "",
                net_salary: advanceData.net_salary || 0,
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
        try {
            const res = await axios.patch(
                `${BASE_URL_of_POS}/api/users/payslips/${advanceData.id}/`,
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
            onClose();
        } catch (err) {
            console.error(err);
            alert("Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
                <div className="px-6 py-4 border-b bg-gray-900 text-white flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold uppercase tracking-tight">Update Payslip</h2>
                        <p className="text-[10px] text-gray-400">ID: #{advanceData?.id} | {advanceData?.user_name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Month (1-12)</label>
                            <input type="number" name="month" value={form.month} onChange={handleChange} className="w-full p-2 border-2 rounded-xl font-bold" required />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Year</label>
                            <input type="number" name="year" value={form.year} onChange={handleChange} className="w-full p-2 border-2 rounded-xl font-bold" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Basic</label>
                            <input type="number" name="basic_salary" value={form.basic_salary} onChange={handleChange} className="w-full p-2 border-2 rounded-xl" required />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Allowances</label>
                            <input type="number" name="allowances" value={form.allowances} onChange={handleChange} className="w-full p-2 border-2 rounded-xl text-green-600 font-bold" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Deductions</label>
                            <input type="number" name="deductions" value={form.deductions} onChange={handleChange} className="w-full p-2 border-2 rounded-xl text-red-600 font-bold" />
                        </div>
                    </div>

                    {/* Hybrid Payment Breakdown */}
                    <div className="bg-gray-50 p-5 rounded-2xl border-2 space-y-4 shadow-inner">
                        <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest text-center">Payout Breakdown (Hybrid)</label>
                        <div className="grid grid-cols-3 gap-4">
                            <div><label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Cash</label><input type="number" name="paid_cash" value={form.paid_cash} onChange={handleAmountChange} className="w-full border-2 p-2 rounded-xl font-black text-center text-green-700" /></div>
                            <div><label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Mobile</label><input type="number" name="paid_mobile" value={form.paid_mobile} onChange={handleAmountChange} className="w-full border-2 p-2 rounded-xl font-black text-center text-orange-700" /></div>
                            <div><label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Bank</label><input type="number" name="paid_bank" value={form.paid_bank} onChange={handleAmountChange} className="w-full border-2 p-2 rounded-xl font-black text-center text-blue-700" /></div>
                        </div>
                        {Number(form.paid_mobile) > 0 && (
                            <div className="grid grid-cols-2 gap-3 animate-slideDown"><select name="mobile_operator" value={form.mobile_operator} onChange={handleChange} className="p-2 border rounded-lg font-bold"><option value="">Operator</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="rocket">Rocket</option><option value="upay">Upay</option></select><input name="transaction_id" value={form.transaction_id} onChange={handleChange} className="p-2 border rounded-lg" placeholder="TxID" /></div>
                        )}
                        {Number(form.paid_bank) > 0 && (
                            <input name="bank_name" value={form.bank_name} onChange={handleChange} className="w-full p-2 border rounded-xl font-bold animate-slideDown" placeholder="Bank Name / Reference" />
                        )}
                    </div>

                    <div className="bg-gray-900 p-5 rounded-2xl flex justify-between items-center shadow-xl">
                        <div className="text-white">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Distributed</p>
                            <p className="text-2xl font-black text-green-400 font-mono">৳{(Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank)).toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Calculated Net</p>
                             <p className="text-xl font-black text-blue-400 font-mono">৳{form.net_salary.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-gray-400 uppercase text-xs tracking-widest">Cancel</button>
                        <button type="submit" disabled={loading} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95">
                            {loading ? "Updating..." : "Update Payslip"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

UpdateEmployeeSalaryPayslipModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    advanceData: PropTypes.object.isRequired,
};

export default UpdateEmployeeSalaryPayslipModal;