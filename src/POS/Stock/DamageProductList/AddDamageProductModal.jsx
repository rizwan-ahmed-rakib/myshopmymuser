

import React, { useState, useEffect } from "react";
import { posDamageProductAPI } from "../../../context_or_provider/pos/damageProducts/damage_productAPI";
import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
import {
    FaBox, FaExclamationTriangle, FaSearch, FaBarcode,
    FaDollarSign, FaWarehouse, FaTag, FaSave, FaTimes,
    FaInfoCircle, FaUser, FaBuilding, FaShoppingCart
} from "react-icons/fa";

const AddDamageProductModal = ({ isOpen, onClose, onSuccess, initialProduct, initialSupplier, initialCustomer }) => {
    // ============ STATE MANAGEMENT ============
    const [step, setStep] = useState(1); // 1: Product Search, 2: Damage Entry
    const [selectedProduct, setSelectedProduct] = useState(initialProduct || null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const [form, setForm] = useState({
        damage_type: "returnable",
        source_type: "manual",
        quantity: 0,
        reason: "",
        notes: "",
        unit_cost: 0,
        supplier: initialSupplier?.id || null,
        customer: initialCustomer?.id || null,
        reference_no: "",
        is_compensated: false,
        compensated_amount: 0
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showCompensation, setShowCompensation] = useState(false);

    // ============ INITIALIZE ============
    useEffect(() => {
        if (isOpen) {
            if (initialProduct) {
                setSelectedProduct(initialProduct);
                setForm(prev => ({
                    ...prev,
                    unit_cost: initialProduct.purchase_price || 0,
                    reference_no: generateReferenceNo()
                }));
                setStep(2);
            } else {
                setStep(1);
            }
        }
    }, [isOpen, initialProduct]);

    // ============ HELPERS ============
    const generateReferenceNo = () => {
        const date = new Date();
        return `DMG-${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${Math.floor(Math.random() * 1000).toString().padStart(3,'0')}`;
    };

    // ============ PRODUCT SEARCH ============
    const handleProductSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        try {
            const res = await posProductAPI.search(query);
            setSearchResults(res.data);
        } catch (error) {
            console.error("Product search failed:", error);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setForm(prev => ({
            ...prev,
            unit_cost: product.purchase_price || 0,
            reference_no: generateReferenceNo()
        }));
        setStep(2);
    };

    // ============ VALIDATION ============
    const validateForm = () => {
        const newErrors = {};

        if (!form.quantity || form.quantity <= 0) {
            newErrors.quantity = "Quantity must be greater than 0";
        } else if (form.quantity > (selectedProduct?.stock || 0)) {
            newErrors.quantity = `Cannot exceed available stock (${selectedProduct?.stock})`;
        }

        if (!form.reason?.trim()) {
            newErrors.reason = "Damage reason is required";
        }

        if (!form.unit_cost || form.unit_cost <= 0) {
            newErrors.unit_cost = "Valid unit cost is required";
        }

        if (form.source_type === 'purchase' && !form.supplier) {
            newErrors.supplier = "Supplier is required for purchase damage";
        }

        if (form.source_type === 'sale' && !form.customer) {
            newErrors.customer = "Customer is required for sale damage";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ============ HANDLERS ============
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            // ✅ সঠিক DamageStock Payload
            const payload = {
                product: selectedProduct.id,
                damage_type: form.damage_type,
                source_type: form.source_type,
                quantity: Number(form.quantity),
                unit_cost: Number(form.unit_cost),
                reason: form.reason,
                notes: form.notes,
                reference_no: form.reference_no,
                supplier: form.supplier,
                customer: form.customer,
                is_compensated: form.is_compensated,
                compensated_amount: form.is_compensated ? Number(form.compensated_amount) : 0
            };

            const res = await posDamageProductAPI.create(payload);

            onSuccess?.({
                ...res.data,
                product_name: selectedProduct.name,
                product_code: selectedProduct.product_code
            });

            resetForm();
            onClose();

        } catch (err) {
            console.error("Failed to create damage entry:", err);
            if (err.response?.data) {
                setErrors(err.response.data);
            } else {
                alert("Failed to create damage entry. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({
            damage_type: "returnable",
            source_type: "manual",
            quantity: 0,
            reason: "",
            notes: "",
            unit_cost: 0,
            supplier: null,
            customer: null,
            reference_no: "",
            is_compensated: false,
            compensated_amount: 0
        });
        setSelectedProduct(null);
        setSearchQuery("");
        setSearchResults([]);
        setErrors({});
        setStep(1);
    };

    // ============ UI COMPONENTS ============
    const ProductSearchStep = () => (
        <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Select Product</h3>

            {/* Search Box */}
            <div className="relative mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleProductSearch(e.target.value);
                    }}
                    placeholder="Search product by name or code..."
                    className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                    autoFocus
                />
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            </div>

            {/* Search Results */}
            {searchLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Searching...</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {searchResults.map(product => (
                        <button
                            key={product.id}
                            onClick={() => handleSelectProduct(product)}
                            className="w-full text-left p-4 border rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <FaBox className="text-gray-400 text-xl" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold">{product.name}</h4>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                            {product.product_code}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>Stock: <strong className={product.stock <= 0 ? 'text-red-600' : 'text-green-600'}>{product.stock}</strong></span>
                                        <span>Purchase: ৳{product.purchase_price}</span>
                                        <span>Selling: ৳{product.selling_price}</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}

                    {searchQuery && searchResults.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No products found. Try a different search term.
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const DamageEntryStep = () => (
        <form onSubmit={handleSubmit} className="p-6">
            {/* Selected Product Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {selectedProduct?.image ? (
                        <img src={selectedProduct.image} alt={selectedProduct.name} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                            <FaBox className="text-blue-600 text-xl" />
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold">{selectedProduct?.name}</h3>
                        <p className="text-sm text-gray-600">Code: {selectedProduct?.product_code} | Stock: {selectedProduct?.stock}</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    Change Product
                </button>
            </div>

            {/* Damage Type */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Damage Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, damage_type: "returnable" }))}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                            form.damage_type === "returnable"
                                ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                                : "border-gray-200 hover:border-yellow-300"
                        }`}
                    >
                        <FaTag className="inline mr-2" />
                        Returnable
                    </button>
                    <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, damage_type: "unreturnable" }))}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                            form.damage_type === "unreturnable"
                                ? "border-red-500 bg-red-50 text-red-700"
                                : "border-gray-200 hover:border-red-300"
                        }`}
                    >
                        <FaExclamationTriangle className="inline mr-2" />
                        Unreturnable
                    </button>
                </div>
            </div>

            {/* Source Type */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source <span className="text-red-500">*</span>
                </label>
                <select
                    name="source_type"
                    value={form.source_type}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                >
                    <option value="manual">Manual Entry</option>
                    <option value="purchase">Purchase Related</option>
                    <option value="sale">Sale Related</option>
                    <option value="adjustment">Stock Adjustment</option>
                </select>
            </div>

            {/* Quantity & Unit Cost */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        min="1"
                        max={selectedProduct?.stock}
                        value={form.quantity}
                        onChange={handleChange}
                        className={`w-full p-3 border-2 rounded-xl ${
                            errors.quantity ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                        }`}
                        placeholder="Enter quantity"
                    />
                    {errors.quantity && (
                        <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Max: {selectedProduct?.stock || 0} units
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Cost (৳) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="unit_cost"
                        step="0.01"
                        min="0"
                        value={form.unit_cost}
                        onChange={handleChange}
                        className={`w-full p-3 border-2 rounded-xl ${
                            errors.unit_cost ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                        }`}
                    />
                    {errors.unit_cost && (
                        <p className="text-red-500 text-xs mt-1">{errors.unit_cost}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Total Loss: ৳{(form.quantity * form.unit_cost).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Supplier/Customer (conditional) */}
            {form.source_type === 'purchase' && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supplier <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            name="supplier"
                            value={form.supplier || ''}
                            onChange={handleChange}
                            placeholder="Enter Supplier ID"
                            className={`flex-1 p-3 border-2 rounded-xl ${
                                errors.supplier ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                            }`}
                        />
                        <button
                            type="button"
                            className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50"
                        >
                            <FaBuilding />
                        </button>
                    </div>
                    {errors.supplier && (
                        <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>
                    )}
                </div>
            )}

            {form.source_type === 'sale' && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            name="customer"
                            value={form.customer || ''}
                            onChange={handleChange}
                            placeholder="Enter Customer ID"
                            className={`flex-1 p-3 border-2 rounded-xl ${
                                errors.customer ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                            }`}
                        />
                        <button
                            type="button"
                            className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50"
                        >
                            <FaUser />
                        </button>
                    </div>
                    {errors.customer && (
                        <p className="text-red-500 text-xs mt-1">{errors.customer}</p>
                    )}
                </div>
            )}

            {/* Reason */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Damage Reason <span className="text-red-500">*</span>
                </label>
                <select
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    className={`w-full p-3 border-2 rounded-xl ${
                        errors.reason ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                    }`}
                >
                    <option value="">Select Reason</option>
                    <option value="customer_return">Customer Return (Damaged)</option>
                    <option value="transit_damage">Transit/Shipping Damage</option>
                    <option value="storage_damage">Storage/Warehouse Damage</option>
                    <option value="expired">Expired Product</option>
                    <option value="defective">Manufacturing Defect</option>
                    <option value="other">Other</option>
                </select>
                {errors.reason && (
                    <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
                )}
            </div>

            {/* Notes */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                </label>
                <textarea
                    name="notes"
                    rows="3"
                    value={form.notes}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                    placeholder="Add any additional details..."
                />
            </div>

            {/* Reference */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference Number
                </label>
                <input
                    type="text"
                    name="reference_no"
                    value={form.reference_no}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                    readOnly
                />
            </div>

            {/* Compensation */}
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="is_compensated"
                        name="is_compensated"
                        checked={form.is_compensated}
                        onChange={(e) => {
                            handleChange(e);
                            setShowCompensation(e.target.checked);
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="is_compensated" className="ml-2 text-sm font-medium text-gray-700">
                        Mark as Compensated
                    </label>
                </div>

                {showCompensation && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Compensated Amount
                        </label>
                        <input
                            type="number"
                            name="compensated_amount"
                            step="0.01"
                            min="0"
                            max={form.quantity * form.unit_cost}
                            value={form.compensated_amount}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Pending: ৳{(form.quantity * form.unit_cost - form.compensated_amount).toFixed(2)}
                        </p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-medium hover:from-red-700 hover:to-orange-700 disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Creating...
                        </>
                    ) : (
                        <>
                            <FaSave /> Create Damage Entry
                        </>
                    )}
                </button>
            </div>
        </form>
    );

    // ============ MAIN RENDER ============
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-5 text-white">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                                <FaExclamationTriangle className="text-white text-3xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Add Damage Stock Entry</h2>
                                <p className="text-white text-opacity-90 mt-1">
                                    {step === 1 ? "Search and select product" : `Product: ${selectedProduct?.name || ''}`}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                resetForm();
                                onClose();
                            }}
                            className="text-white hover:text-gray-200 bg-white bg-opacity-20 rounded-lg p-2"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
                    {step === 1 ? <ProductSearchStep /> : <DamageEntryStep />}
                </div>
            </div>
        </div>
    );
};

export default AddDamageProductModal;
// export default AddDamageStockModal;


///////////////////////////////////////////////////


