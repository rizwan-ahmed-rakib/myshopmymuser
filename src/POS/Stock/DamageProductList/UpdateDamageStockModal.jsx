import React, {useState, useEffect} from "react";
import {posDamageProductAPI} from "../../../context_or_provider/pos/damageProducts/damage_productAPI";
import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
import {
    FaBox, FaExclamationTriangle, FaDollarSign, FaWarehouse, 
    FaTag, FaSave, FaTimes, FaInfoCircle, FaFileInvoice, 
    FaBalanceScale, FaSearch, FaArrowLeft, FaCheck
} from "react-icons/fa";

const UpdateDamageStockModal = ({isOpen, onClose, onSuccess, recordData}) => {
    // ============ STATE MANAGEMENT ============
    const [step, setStep] = useState(1); // 1: Info/Edit, 2: Product Search
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchDebounce, setSearchDebounce] = useState(null);

    const [form, setForm] = useState({
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
            
            // Mock selected product from record data
            setSelectedProduct({
                id: recordData.product,
                name: recordData.product_name,
                product_code: recordData.product_code,
                image: recordData.product_image // assuming this might be available
            });

            setShowCompensation(recordData.is_compensated || false);
            setStep(1);
        }
    }, [isOpen, recordData]);

    // ============ PRODUCT SEARCH ============
    const handleProductSearch = (query) => {
        setSearchQuery(query);
        if (searchDebounce) clearTimeout(searchDebounce);
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setSearchDebounce(setTimeout(async () => {
            setSearchLoading(true);
            try {
                const res = await posProductAPI.search(query);
                setSearchResults(res.data || []);
            } catch (error) {
                console.error("Product search failed:", error);
            } finally {
                setSearchLoading(false);
            }
        }, 500));
    };

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setForm(prev => ({
            ...prev,
            product: product.id,
            unit_cost: product.purchase_price || prev.unit_cost
        }));
        setStep(1);
        setSearchQuery("");
        setSearchResults([]);
    };

    // ============ HANDLERS ============
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setForm(prev => ({ ...prev, [name]: checked }));
            if (name === 'is_compensated') setShowCompensation(checked);
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.quantity || form.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0";
        if (!form.reason?.trim()) newErrors.reason = "Damage reason is required";
        if (!form.unit_cost || form.unit_cost <= 0) newErrors.unit_cost = "Valid unit cost is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                ...form,
                quantity: Number(form.quantity),
                unit_cost: Number(form.unit_cost),
                compensated_amount: form.is_compensated ? Number(form.compensated_amount) : 0
            };

            const res = await posDamageProductAPI.update(recordData.id, payload);
            
            // 🔥 Crucial: Ensure the success data has the names for the modal
            const successData = {
                ...res.data,
                product_name: selectedProduct?.name || recordData.product_name,
                product_code: selectedProduct?.product_code || recordData.product_code
            };

            console.log("Update success, calling onSuccess with:", successData);
            onSuccess?.(successData);
            onClose();
        } catch (err) {
            console.error("Failed to update damage entry:", err);
            if (err.response?.data) {
                setErrors(err.response.data);
            } else {
                alert("Failed to update damage entry. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const totalLoss = (Number(form.quantity) || 0) * (Number(form.unit_cost) || 0);
    const pendingAmount = totalLoss - (Number(form.compensated_amount) || 0);

    const ProductSearchStep = () => (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Change Product</h3>
                    <p className="text-sm text-gray-500">Search for a different product to associate with this damage record</p>
                </div>
                <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700">
                    <FaTimes size={20}/>
                </button>
            </div>

            <div className="relative mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleProductSearch(e.target.value)}
                    placeholder="Search product by name or code..."
                    className="w-full p-4 pl-12 pr-4 border-2 border-gray-100 rounded-xl focus:border-blue-500 transition-all outline-none"
                    autoFocus
                />
                <FaSearch className="absolute left-4 top-4 text-gray-400 text-xl"/>
                {searchLoading && (
                    <div className="absolute right-4 top-4 animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                )}
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {searchResults.map(product => (
                    <button
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="w-full text-left p-4 border-2 border-gray-50 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FaBox className="text-gray-400"/>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">{product.name}</h4>
                                <p className="text-xs text-gray-500">{product.product_code} | Stock: {product.stock}</p>
                            </div>
                            <FaCheck className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideIn">
                {step === 2 ? <ProductSearchStep /> : (
                    <>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                                        <FaExclamationTriangle className="text-white text-2xl"/>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Update Damage Record</h2>
                                        <p className="text-blue-100 text-sm mt-0.5">
                                            Reference: {form.reference_no}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors">
                                    <FaTimes size={20}/>
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto p-6 max-h-[calc(90vh-80px)]">
                            <form onSubmit={handleSubmit}>
                                {/* Product Info Banner with Change Option */}
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                            <FaBox className="text-blue-500 text-xl"/>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-blue-900">{selectedProduct?.name}</h3>
                                            <p className="text-xs text-blue-600 font-mono">Code: {selectedProduct?.product_code}</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="text-xs font-bold text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-all flex items-center gap-1.5"
                                    >
                                        <FaSearch size={10}/> Change Product
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Damage Type</label>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setForm(prev => ({...prev, damage_type: "returnable"}))}
                                                    className={`flex-1 py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                                        form.damage_type === "returnable"
                                                            ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                                                            : "border-gray-100 hover:bg-gray-50 text-gray-600"
                                                    }`}
                                                >
                                                    Returnable
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setForm(prev => ({...prev, damage_type: "non_returnable"}))}
                                                    className={`flex-1 py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                                        form.damage_type === "non_returnable"
                                                            ? "border-red-500 bg-red-50 text-red-700"
                                                            : "border-gray-100 hover:bg-gray-50 text-gray-600"
                                                    }`}
                                                >
                                                    Non-Returnable
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantity (pcs)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="quantity"
                                                    value={form.quantity}
                                                    onChange={handleChange}
                                                    className={`w-full p-2.5 pl-10 border-2 rounded-lg outline-none transition-all ${
                                                        errors.quantity ? "border-red-500 bg-red-50" : "border-gray-100 focus:border-blue-500"
                                                    }`}
                                                />
                                                <FaWarehouse className="absolute left-3 top-3.5 text-gray-400 text-sm"/>
                                            </div>
                                            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Unit Cost (৳)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="unit_cost"
                                                    step="0.01"
                                                    value={form.unit_cost}
                                                    onChange={handleChange}
                                                    className={`w-full p-2.5 pl-10 border-2 rounded-lg outline-none transition-all ${
                                                        errors.unit_cost ? "border-red-500 bg-red-50" : "border-gray-100 focus:border-blue-500"
                                                    }`}
                                                />
                                                <FaDollarSign className="absolute left-3 top-3.5 text-gray-400 text-sm"/>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason</label>
                                            <select
                                                name="reason"
                                                value={form.reason}
                                                onChange={handleChange}
                                                className={`w-full p-2.5 border-2 rounded-lg outline-none transition-all ${
                                                    errors.reason ? "border-red-500 bg-red-50" : "border-gray-100 focus:border-blue-500"
                                                }`}
                                            >
                                                <option value="customer_return">Customer Return (Damaged)</option>
                                                <option value="transit_damage">Transit/Shipping Damage</option>
                                                <option value="storage_damage">Storage/Warehouse Damage</option>
                                                <option value="expired">Expired Product</option>
                                                <option value="defective">Manufacturing Defect</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Loss Summary</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Total Loss:</span>
                                                    <span className="font-bold text-red-600">৳{totalLoss.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes</label>
                                    <textarea
                                        name="notes"
                                        rows="2"
                                        value={form.notes}
                                        onChange={handleChange}
                                        className="w-full p-3 border-2 border-gray-100 rounded-lg focus:border-blue-500 outline-none transition-all"
                                        placeholder="Additional details..."
                                    />
                                </div>

                                {/* Compensation Section */}
                                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
                                    <label className="flex items-center gap-3 cursor-pointer group mb-4">
                                        <input
                                            type="checkbox"
                                            name="is_compensated"
                                            checked={form.is_compensated}
                                            onChange={handleChange}
                                            className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-sm font-bold text-gray-700 group-hover:text-green-600 transition-colors">Mark as Compensated</span>
                                    </label>

                                    {showCompensation && (
                                        <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                                            <div>
                                                <label className="block text-xs font-bold text-green-700 mb-1.5 uppercase">Compensated Amount</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        name="compensated_amount"
                                                        value={form.compensated_amount}
                                                        onChange={handleChange}
                                                        className="w-full p-2.5 pl-8 border-2 border-green-100 rounded-lg focus:border-green-500 outline-none bg-white"
                                                    />
                                                    <FaDollarSign className="absolute left-3 top-3.5 text-green-400 text-xs"/>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-amber-700 mb-1.5 uppercase">Pending Amount</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={`৳${pendingAmount.toFixed(2)}`}
                                                        className="w-full p-2.5 pl-8 border-2 border-amber-100 rounded-lg bg-amber-50 text-amber-700 font-bold"
                                                        readOnly
                                                    />
                                                    <FaBalanceScale className="absolute left-3 top-3.5 text-amber-400 text-xs"/>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex gap-3">
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
                                        className="flex-[2] px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <><FaSave /> Update Record</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UpdateDamageStockModal;
