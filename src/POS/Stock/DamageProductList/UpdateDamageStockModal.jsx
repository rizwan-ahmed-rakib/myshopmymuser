import React, {useState, useEffect} from "react";
import {posDamageProductAPI} from "../../../context_or_provider/pos/damageProducts/damage_productAPI";
import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
import {
    FaBox, FaExclamationTriangle, FaDollarSign, FaWarehouse, 
    FaSave, FaSearch, FaCheck, FaBalanceScale
} from "react-icons/fa";
import BaseModal from "../../components/BaseModal";

const UpdateDamageStockModal = ({isOpen, onClose, onSuccess, recordData}) => {
    const [step, setStep] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchDebounce, setSearchDebounce] = useState(null);

    const [form, setForm] = useState({
        product: null, damage_type: "returnable", quantity: "", reason: "",
        notes: "", unit_cost: "", reference_no: "",
        is_compensated: false, compensated_amount: ""
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showCompensation, setShowCompensation] = useState(false);

    useEffect(() => {
        if (isOpen && recordData) {
            setForm({
                product: recordData.product,
                damage_type: recordData.damage_type || "returnable",
                quantity: recordData.quantity || "",
                reason: recordData.reason || "",
                notes: recordData.notes || "",
                unit_cost: recordData.unit_cost || "",
                reference_no: recordData.reference_no || "",
                is_compensated: recordData.is_compensated || false,
                compensated_amount: recordData.compensated_amount || ""
            });
            setSelectedProduct({
                id: recordData.product, name: recordData.product_name, product_code: recordData.product_code
            });
            setShowCompensation(recordData.is_compensated || false);
            setStep(1);
        }
    }, [isOpen, recordData]);

    const handleProductSearch = (q) => {
        setSearchQuery(q);
        if (searchDebounce) clearTimeout(searchDebounce);
        if (!q.trim()) { setSearchResults([]); return; }
        setSearchDebounce(setTimeout(async () => {
            setSearchLoading(true);
            try { const res = await posProductAPI.search(q); setSearchResults(res.data || []); } catch (e) {} finally { setSearchLoading(false); }
        }, 500));
    };

    const handleSelectProduct = (p) => {
        setSelectedProduct(p);
        setForm(prev => ({ ...prev, product: p.id, unit_cost: p.purchase_price || prev.unit_cost }));
        setStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...form, quantity: Number(form.quantity), unit_cost: Number(form.unit_cost), compensated_amount: form.is_compensated ? Number(form.compensated_amount) : 0 };
            const res = await posDamageProductAPI.update(recordData.id, payload);
            onSuccess?.({ ...res.data, product_name: selectedProduct?.name || recordData.product_name, product_code: selectedProduct?.product_code || recordData.product_code });
            onClose();
        } catch (err) {
            if (err.response?.data) setErrors(err.response.data);
            else alert("Failed to update record.");
        } finally { setLoading(false); }
    };

    if (!isOpen) return null;

    const totalLoss = (Number(form.quantity) || 0) * (Number(form.unit_cost) || 0);
    const pendingAmount = totalLoss - (Number(form.compensated_amount) || 0);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={step === 1 ? "Update Damage Record" : "Change Product"}
            maxWidth="max-w-3xl"
            headerColor="bg-blue-600"
            icon={<FaExclamationTriangle className="text-white text-xl"/>}
        >
            {step === 2 ? (
                <div className="p-6">
                    <div className="relative mb-6">
                        <input type="text" value={searchQuery} onChange={(e) => handleProductSearch(e.target.value)} placeholder="Search product..." className="w-full p-4 pl-12 border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500" autoFocus/>
                        <FaSearch className="absolute left-4 top-4 text-gray-400 text-xl"/>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {searchResults.map(p => (
                            <button key={p.id} onClick={() => handleSelectProduct(p)} className="w-full text-left p-4 border-2 border-gray-50 rounded-xl hover:border-blue-200 transition-all flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <FaBox className="text-gray-400"/>
                                    <div><h4 className="font-bold">{p.name}</h4><p className="text-xs text-gray-500">{p.product_code}</p></div>
                                </div>
                                <FaCheck className="text-blue-500"/>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between border border-blue-100">
                        <div className="flex items-center gap-4">
                            <FaBox className="text-blue-500 text-xl"/>
                            <div><h3 className="font-bold text-blue-900">{selectedProduct?.name}</h3><p className="text-xs text-blue-600">Code: {selectedProduct?.product_code}</p></div>
                        </div>
                        <button type="button" onClick={() => setStep(2)} className="text-xs font-bold text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100">Change Product</button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Damage Type</label>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setForm(p => ({...p, damage_type: "returnable"}))} className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-bold transition-all ${form.damage_type === "returnable" ? "border-yellow-500 bg-yellow-50 text-yellow-700" : "border-gray-100 text-gray-500"}`}>Returnable</button>
                                    <button type="button" onClick={() => setForm(p => ({...p, damage_type: "non_returnable"}))} className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-bold transition-all ${form.damage_type === "non_returnable" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-100 text-gray-500"}`}>Non-Returnable</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Quantity</label>
                                <input type="number" value={form.quantity} onChange={(e) => setForm(p => ({...p, quantity: e.target.value}))} className="w-full p-2.5 border-2 border-gray-100 rounded-lg focus:border-blue-500 outline-none"/>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Unit Cost (৳)</label>
                                <input type="number" value={form.unit_cost} onChange={(e) => setForm(p => ({...p, unit_cost: e.target.value}))} className="w-full p-2.5 border-2 border-gray-100 rounded-lg focus:border-blue-500 outline-none"/>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Total Loss</p>
                                <p className="font-black text-red-600 text-lg">৳{totalLoss.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <label className="flex items-center gap-3 cursor-pointer mb-3">
                            <input type="checkbox" checked={form.is_compensated} onChange={(e) => { setForm(p => ({...p, is_compensated: e.target.checked})); setShowCompensation(e.target.checked); }} className="w-5 h-5 text-green-600 rounded"/>
                            <span className="text-sm font-bold text-gray-700">Mark as Compensated</span>
                        </label>
                        {showCompensation && (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                                <div><label className="block text-xs font-bold text-green-700 mb-1 uppercase">Amount</label><input type="number" value={form.compensated_amount} onChange={(e) => setForm(p => ({...p, compensated_amount: e.target.value}))} className="w-full p-2.5 border-2 border-green-100 rounded-lg focus:border-green-500 outline-none"/></div>
                                <div><label className="block text-xs font-bold text-amber-700 mb-1 uppercase">Pending</label><div className="p-2.5 border-2 border-amber-100 rounded-lg bg-amber-50 text-amber-700 font-bold">৳{pendingAmount.toFixed(2)}</div></div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border-2 border-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-[2] px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><FaSave /> Update Record</>}
                        </button>
                    </div>
                </form>
            )}
        </BaseModal>
    );
};

export default UpdateDamageStockModal;
