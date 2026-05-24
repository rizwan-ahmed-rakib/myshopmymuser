import React, {useState, useEffect} from "react";
import {posDamageProductAPI} from "../../../context_or_provider/pos/damageProducts/damage_productAPI";
import {
    FaBox, FaExclamationTriangle, FaBarcode, FaLayerGroup,
    FaDollarSign, FaWarehouse, FaTag, FaSave, FaTimes,
    FaInfoCircle, FaHistory, FaUser, FaCalendarAlt
} from "react-icons/fa";

const UpdateDamageStockModal = ({isOpen, onClose, onSuccess, recordData}) => {
    // ============ STATE MANAGEMENT ============
    const [form, setForm] = useState({
        id: null,
        product: null,
        damage_type: "returnable",
        source_type: "manual",
        quantity: "",
        reason: "",
        notes: "",
        unit_cost: "",
        supplier: null,
        customer: null,
        reference_no: "",
        is_compensated: false,
        compensated_amount: ""
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showCompensation, setShowCompensation] = useState(false);

    // ============ INITIALIZE ============
    useEffect(() => {
        if (isOpen && recordData) {
            setForm({
                id: recordData.id,
                product: recordData.product,
                damage_type: recordData.damage_type || "returnable",
                source_type: recordData.source_type || "manual",
                quantity: recordData.quantity || "",
                reason: recordData.reason || "",
                notes: recordData.notes || "",
                unit_cost: recordData.unit_cost || "",
                supplier: recordData.supplier || null,
                customer: recordData.customer || null,
                reference_no: recordData.reference_no || "",
                is_compensated: recordData.is_compensated || false,
                compensated_amount: recordData.compensated_amount || ""
            });
            setShowCompensation(recordData.is_compensated || false);
        }
    }, [isOpen, recordData]);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (name === 'is_compensated') {
            setShowCompensation(checked);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.quantity || form.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0";
        if (!form.unit_cost || form.unit_cost < 0) newErrors.unit_cost = "Unit cost cannot be negative";
        if (!form.reason) newErrors.reason = "Reason is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                ...form,
                quantity: Number(form.quantity),
                unit_cost: Number(form.unit_cost),
                compensated_amount: form.is_compensated ? Number(form.compensated_amount) : 0,
                total_loss: Number(form.quantity) * Number(form.unit_cost)
            };

            const res = await posDamageProductAPI.update(form.id, payload);
            if (onSuccess) onSuccess(res.data);
            onClose();
        } catch (error) {
            console.error("Error updating damage record:", error);
            setErrors({submit: "Failed to update record. Please try again."});
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const totalLoss = Number(form.quantity || 0) * Number(form.unit_cost || 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center text-white">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <FaExclamationTriangle /> Edit Damage Record
                    </h2>
                    <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all">
                        <FaTimes size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Damage Type */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Damage Type</label>
                            <select
                                name="damage_type"
                                value={form.damage_type}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-500 transition-all outline-none"
                            >
                                <option value="returnable">Returnable</option>
                                <option value="non_returnable">Non-Returnable</option>
                            </select>
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Quantity (pcs)</label>
                            <input
                                type="number"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                className={`w-full border-2 rounded-xl p-3 outline-none transition-all ${errors.quantity ? 'border-red-500' : 'border-gray-100 focus:border-blue-500'}`}
                            />
                            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                        </div>

                        {/* Unit Cost */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Unit Cost (৳)</label>
                            <input
                                type="number"
                                name="unit_cost"
                                value={form.unit_cost}
                                onChange={handleChange}
                                className={`w-full border-2 rounded-xl p-3 outline-none transition-all ${errors.unit_cost ? 'border-red-500' : 'border-gray-100 focus:border-blue-500'}`}
                            />
                            {errors.unit_cost && <p className="text-red-500 text-xs mt-1">{errors.unit_cost}</p>}
                        </div>

                        {/* Reference No */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Reference No</label>
                            <input
                                type="text"
                                name="reference_no"
                                value={form.reference_no}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Reason</label>
                        <textarea
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            rows="2"
                            className={`w-full border-2 rounded-xl p-3 outline-none transition-all ${errors.reason ? 'border-red-500' : 'border-gray-100 focus:border-blue-500'}`}
                        ></textarea>
                        {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
                    </div>

                    {/* Total Loss Summary */}
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <div className="flex justify-between items-center text-red-800 font-bold">
                            <span>Total Financial Loss:</span>
                            <span className="text-xl">৳ {totalLoss.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Compensation */}
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="is_compensated"
                                checked={form.is_compensated}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Mark as Compensated</span>
                        </label>

                        {showCompensation && (
                            <div className="animate-in slide-in-from-top duration-300">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Compensated Amount (৳)</label>
                                <input
                                    type="number"
                                    name="compensated_amount"
                                    value={form.compensated_amount}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                        )}
                    </div>

                    {errors.submit && <p className="text-red-500 text-center font-bold">{errors.submit}</p>}

                    {/* Footer Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Record"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateDamageStockModal;
