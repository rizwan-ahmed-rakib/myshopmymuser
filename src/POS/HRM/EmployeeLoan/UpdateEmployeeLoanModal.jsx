import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";
import LoadingSpinner from "./LoadingSpinner";

const UpdateEmployeeLoanModal = ({ isOpen, onClose, onSuccess, advanceData }) => {
    const [form, setForm] = useState({
        amount: "",
        loan_date: "",
        reason: "",
        repayment_start_date: "",
        monthly_repayment_amount: "",
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

    useEffect(() => {
        if (advanceData && isOpen) {
            setForm({
                amount: advanceData.amount || "",
                loan_date: advanceData.loan_date || "",
                reason: advanceData.reason || "",
                repayment_start_date: advanceData.repayment_start_date || "",
                monthly_repayment_amount: advanceData.monthly_repayment_amount || "",
                is_fully_paid: advanceData.is_fully_paid || false,
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
        setForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.patch(
                `${BASE_URL_of_POS}/api/users/employee-loans/${advanceData.id}/`,
                { ...form, amount: Number(form.amount), monthly_repayment_amount: Number(form.monthly_repayment_amount) }
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
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b bg-gray-900 text-white flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold uppercase">Update Employee Loan</h2>
                        <p className="text-[10px] text-gray-400">ID: #{advanceData?.id} | {advanceData?.user_name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Loan Amount</label>
                            <input type="number" name="amount" value={form.amount} onChange={handleChange} className="w-full p-2 border-2 rounded-xl font-bold" required />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Monthly Repayment</label>
                            <input type="number" name="monthly_repayment_amount" value={form.monthly_repayment_amount} onChange={handleChange} className="w-full p-2 border-2 rounded-xl" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Loan Date</label>
                            <input type="date" name="loan_date" value={form.loan_date} onChange={handleChange} className="w-full p-2 border-2 rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Repayment Start</label>
                            <input type="date" name="repayment_start_date" value={form.repayment_start_date} onChange={handleChange} className="w-full p-2 border-2 rounded-xl" required />
                        </div>
                    </div>

                    <textarea name="reason" value={form.reason} onChange={handleChange} className="w-full p-2 border-2 rounded-xl" rows="2" placeholder="Reason" />

                    <div className="bg-gray-50 p-5 rounded-2xl border-2 space-y-4">
                        <label className="block text-[10px] font-black text-gray-500 uppercase">Payment Breakdown (Hybrid)</label>
                        <div className="grid grid-cols-3 gap-4">
                            <div><label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Cash</label><input type="number" name="paid_cash" value={form.paid_cash} onChange={handleAmountChange} className="w-full border-2 p-2 rounded-xl font-black text-center text-green-700" /></div>
                            <div><label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Mobile</label><input type="number" name="paid_mobile" value={form.paid_mobile} onChange={handleAmountChange} className="w-full border-2 p-2 rounded-xl font-black text-center text-orange-700" /></div>
                            <div><label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Bank</label><input type="number" name="paid_bank" value={form.paid_bank} onChange={handleAmountChange} className="w-full border-2 p-2 rounded-xl font-black text-center text-blue-700" /></div>
                        </div>
                        {Number(form.paid_mobile) > 0 && (
                            <div className="grid grid-cols-2 gap-3"><select name="mobile_operator" value={form.mobile_operator} onChange={handleChange} className="w-full border-2 p-2 rounded-lg font-bold"><option value="">Operator</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="rocket">Rocket</option><option value="upay">Upay</option></select><input name="transaction_id" value={form.transaction_id} onChange={handleChange} className="w-full border-2 p-2 rounded-lg" placeholder="TxID" /></div>
                        )}
                        {Number(form.paid_bank) > 0 && (
                            <input name="bank_name" value={form.bank_name} onChange={handleChange} className="w-full border-2 p-2 rounded-lg font-bold" placeholder="Bank Name / Ref" />
                        )}
                    </div>

                    <div className="flex justify-between items-center bg-gray-100 p-4 rounded-xl">
                        <label className="flex items-center gap-2 font-bold text-gray-700"><input type="checkbox" name="is_fully_paid" checked={form.is_fully_paid} onChange={handleChange} /> Fully Paid</label>
                        <p className="font-black text-lg">Total: ৳{(Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank)).toFixed(2)}</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-gray-400 uppercase text-xs">Cancel</button>
                        <button type="submit" disabled={loading} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-xs shadow-xl">{loading ? "Updating..." : "Update Loan"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

UpdateEmployeeLoanModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    advanceData: PropTypes.object.isRequired,
};

export default UpdateEmployeeLoanModal;