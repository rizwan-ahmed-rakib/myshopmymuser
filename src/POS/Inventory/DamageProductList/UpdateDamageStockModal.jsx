import React, {useState, useEffect} from "react";
import {posDamageProductAPI} from "../../../context_or_provider/pos/damageProducts/damage_productAPI";
import {
    FaBox, FaExclamationTriangle, FaBarcode, FaLayerGroup,
    FaDollarSign, FaWarehouse, FaTag, FaSave, FaTimes,
    FaInfoCircle, FaHistory, FaUser, FaCalendarAlt
} from "react-icons/fa";

const UpdateDamageStockModal = ({isOpen, onClose, onSuccess, recordData, productData, supplierData, customerData}) => {
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
    const [activeTab, setActiveTab] = useState("damage_info");
    const [damageHistory, setDamageHistory] = useState([]);
    const [showCompensation, setShowCompensation] = useState(false);

    // ============ DETERMINE IF EDIT OR CREATE ============
    const isEditMode = !!recordData?.id;

    // ============ INITIALIZE ============
    useEffect(() => {
        if (isOpen) {
            if (isEditMode && recordData) {
                // Edit mode - load existing record
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
                    reference_no: recordData.reference_no || generateReferenceNo(),
                    is_compensated: recordData.is_compensated || false,
                    compensated_amount: recordData.compensated_amount || ""
                });
                setShowCompensation(recordData.is_compensated || false);

                // Load damage history for this product
                if (recordData.product) {
                    loadDamageHistory(recordData.product);
                }
            } else if (productData) {
                // Create mode - initialize with product data
                setForm({
                    id: null,
                    product: productData.id,
                    damage_type: "returnable",
                    source_type: "manual",
                    quantity: "",
                    reason: "",
                    notes: "",
                    unit_cost: productData.purchase_price || "",
                    supplier: supplierData?.id || null,
                    customer: customerData?.id || null,
                    reference_no: generateReferenceNo(),
                    is_compensated: false,
                    compensated_amount: ""
                });
                setShowCompensation(false);

                // Load damage history for this product
                loadDamageHistory(productData.id);
            }

            setErrors({});
            setActiveTab("damage_info");
        }
    }, [isOpen, recordData, productData, supplierData, customerData, isEditMode]);

    // ============ API CALLS ============
    const loadDamageHistory = async (productId) => {
        if (!productId) return;

        try {
            const res = await posDamageProductAPI.getByProduct(productId);
            // API response format check
            const historyData = res.data?.results || res.data || [];
            setDamageHistory(Array.isArray(historyData) ? historyData.slice(0, 5) : []);
        } catch (error) {
            console.error("Failed to load damage history:", error);
            setDamageHistory([]);
        }
    };

    // ============ HELPERS ============
    const generateReferenceNo = () => {
        const date = new Date();
        return `DMG-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    };

    const validateForm = () => {
        const newErrors = {};

        // Quantity validation
        if (!form.quantity || form.quantity <= 0) {
            newErrors.quantity = "Quantity must be greater than 0";
        } else if (!isEditMode && productData?.stock && form.quantity > productData.stock) {
            newErrors.quantity = `Cannot exceed available stock (${productData.stock})`;
        }

        // Reason validation
        if (!form.reason?.trim()) {
            newErrors.reason = "Damage reason is required";
        }

        // Unit cost validation
        if (!form.unit_cost || form.unit_cost <= 0) {
            newErrors.unit_cost = "Valid unit cost is required";
        }

        // Source specific validation
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
        const {name, value, type, checked} = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: null}));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            // ✅ সঠিক Payload - DamageStock API এর জন্য
            const payload = {
                product: form.product,
                damage_type: form.damage_type,
                source_type: form.source_type,
                quantity: Number(form.quantity),
                unit_cost: Number(form.unit_cost),
                reason: form.reason,
                notes: form.notes || "",
                reference_no: form.reference_no,
                supplier: form.supplier ? Number(form.supplier) : null,
                customer: form.customer ? Number(form.customer) : null,
                is_compensated: form.is_compensated,
                compensated_amount: form.is_compensated ? Number(form.compensated_amount) : 0
            };

            console.log(`${isEditMode ? 'Updating' : 'Creating'} Damage Entry:`, payload);

            let response;
            if (isEditMode && form.id) {
                // Update existing record
                response = await posDamageProductAPI.update(form.id, payload);
            } else {
                // Create new record
                response = await posDamageProductAPI.create(payload);
            }

            // Get product name for success message
            const productName = productData?.name || recordData?.product_name || 'Product';
            const productCode = productData?.product_code || recordData?.product_code || '';

            onSuccess?.({
                ...response.data,
                product_name: productName,
                product_code: productCode
            });

            onClose();

        } catch (err) {
            console.error(`Failed to ${isEditMode ? 'update' : 'create'} damage entry:`, err);

            if (err.response?.data) {
                // Format backend validation errors
                const backendErrors = {};
                Object.keys(err.response.data).forEach(key => {
                    if (Array.isArray(err.response.data[key])) {
                        backendErrors[key] = err.response.data[key][0];
                    } else {
                        backendErrors[key] = err.response.data[key];
                    }
                });
                setErrors(backendErrors);

                // Show alert with first error
                const firstError = Object.values(backendErrors)[0];
                if (firstError) alert(firstError);
            } else {
                alert(`Failed to ${isEditMode ? 'update' : 'create'} damage entry. Please try again.`);
            }
        } finally {
            setLoading(false);
        }
    };

    // ============ UI COMPONENTS ============
    const DamageSummaryCards = () => {
        if (!productData && !recordData) return null;

        const product = productData || recordData;
        const availableStock = product?.stock || 0;
        const returnableDamage = product?.returnable_damage_stock || 0;
        const unreturnableDamage = product?.unreturnable_damage_stock || 0;
        const purchasePrice = product?.purchase_price || 0;
        const totalLoss = (returnableDamage + unreturnableDamage) * purchasePrice;

        return (
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                    <p className="text-sm text-blue-600 mb-1">Available Stock</p>
                    <div className="flex items-center justify-between">
                        <FaWarehouse className="text-blue-600 text-xl"/>
                        <span className="text-2xl font-bold text-blue-700">
                            {availableStock}
                        </span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
                    <p className="text-sm text-yellow-600 mb-1">Returnable Damage</p>
                    <div className="flex items-center justify-between">
                        <FaTag className="text-yellow-600 text-xl"/>
                        <span className="text-2xl font-bold text-yellow-700">
                            {returnableDamage}
                        </span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
                    <p className="text-sm text-red-600 mb-1">Unreturnable Damage</p>
                    <div className="flex items-center justify-between">
                        <FaExclamationTriangle className="text-red-600 text-xl"/>
                        <span className="text-2xl font-bold text-red-700">
                            {unreturnableDamage}
                        </span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                    <p className="text-sm text-purple-600 mb-1">Total Loss</p>
                    <div className="flex items-center justify-between">
                        <FaDollarSign className="text-purple-600 text-xl"/>
                        <span className="text-2xl font-bold text-purple-700">
                            ৳{totalLoss.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const ProductInfoCard = () => {
        const product = productData || recordData;
        if (!product) return null;

        return (
            <div className="bg-white border rounded-xl p-6 mb-6">
                <div className="flex items-start gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product?.image ? (
                            <img src={product.image} alt={product.name || product.product_name} className="w-full h-full object-cover"/>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <FaBox className="text-4xl text-gray-400"/>
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-gray-500">Product Name</p>
                            <p className="font-semibold">{product.name || product.product_name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Product Code</p>
                            <p className="font-semibold">{product.product_code}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Category</p>
                            <p className="font-semibold">{product.category_name || product.category || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Purchase Price</p>
                            <p className="font-semibold text-green-600">৳{product.purchase_price}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Selling Price</p>
                            <p className="font-semibold text-blue-600">৳{product.selling_price}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Unit</p>
                            <p className="font-semibold">{product.unit_name || product.unit || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const DamageForm = () => (
        <div className="space-y-6">
            {/* Row 1: Damage Type & Source Type */}
            <div className="grid grid-cols-2 gap-6">
                {/* Damage Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Damage Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setForm(prev => ({...prev, damage_type: "returnable"}))}
                            className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                                form.damage_type === "returnable"
                                    ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                                    : "border-gray-200 hover:border-yellow-300"
                            }`}
                        >
                            <FaTag className="inline mr-2"/>
                            Returnable
                        </button>
                        <button
                            type="button"
                            onClick={() => setForm(prev => ({...prev, damage_type: "non_returnable"}))}
                            className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                                form.damage_type === "non_returnable"
                                    ? "border-red-500 bg-red-50 text-red-700"
                                    : "border-gray-200 hover:border-red-300"
                            }`}
                        >
                            <FaExclamationTriangle className="inline mr-2"/>
                            Non-returnable
                        </button>
                    </div>
                </div>

                {/* Source Type */}
                <div>
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
            </div>

            {/* Row 2: Quantity & Unit Cost */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Damage Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        min="1"
                        max={!isEditMode ? productData?.stock : undefined}
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
                    {!isEditMode && productData?.stock && (
                        <p className="text-xs text-gray-500 mt-1">
                            Max: {productData.stock} units
                        </p>
                    )}
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
                        Total Loss: ৳{(Number(form.quantity) * Number(form.unit_cost)).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Row 3: Supplier/Customer (conditional) */}
            {form.source_type === 'purchase' && (
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Supplier <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="supplier"
                            value={form.supplier || ''}
                            onChange={handleChange}
                            className={`w-full p-3 border-2 rounded-xl ${
                                errors.supplier ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                            }`}
                        >
                            <option value="">Select Supplier</option>
                            {supplierData && (
                                <option value={supplierData.id}>{supplierData.name}</option>
                            )}
                        </select>
                        {errors.supplier && (
                            <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Purchase Reference
                        </label>
                        <input
                            type="text"
                            name="purchase_reference"
                            className="w-full p-3 border-2 border-gray-200 rounded-xl"
                            placeholder="Invoice #"
                            value={form.purchase_reference || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            )}

            {form.source_type === 'sale' && (
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Customer <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="customer"
                            value={form.customer || ''}
                            onChange={handleChange}
                            className={`w-full p-3 border-2 rounded-xl ${
                                errors.customer ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                            }`}
                        >
                            <option value="">Select Customer</option>
                            {customerData && (
                                <option value={customerData.id}>{customerData.name}</option>
                            )}
                        </select>
                        {errors.customer && (
                            <p className="text-red-500 text-xs mt-1">{errors.customer}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sale Reference
                        </label>
                        <input
                            type="text"
                            name="sale_reference"
                            className="w-full p-3 border-2 border-gray-200 rounded-xl"
                            placeholder="Invoice #"
                            value={form.sale_reference || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            )}

            {/* Row 4: Reason & Reference */}
            <div className="grid grid-cols-2 gap-6">
                <div>
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

                <div>
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
            </div>

            {/* Row 5: Notes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                </label>
                <textarea
                    name="notes"
                    rows="3"
                    value={form.notes}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                    placeholder="Add any additional details about the damage..."
                />
            </div>

            {/* Row 6: Compensation */}
            <div className="bg-gray-50 p-4 rounded-xl">
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
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_compensated" className="ml-2 text-sm font-medium text-gray-700">
                        Mark as Compensated
                    </label>
                </div>

                {showCompensation && (
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Compensated Amount
                            </label>
                            <input
                                type="number"
                                name="compensated_amount"
                                step="0.01"
                                min="0"
                                max={Number(form.quantity) * Number(form.unit_cost)}
                                value={form.compensated_amount}
                                onChange={handleChange}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pending Amount
                            </label>
                            <input
                                type="text"
                                value={(Number(form.quantity) * Number(form.unit_cost) - Number(form.compensated_amount)).toFixed(2)}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                                readOnly
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const DamageHistory = () => (
        <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaHistory className="text-gray-500"/>
                Recent Damage History
            </h3>
            <div className="space-y-3">
                {damageHistory.length > 0 ? (
                    damageHistory.map((damage, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            damage.damage_type === 'returnable'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {damage.damage_type}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            <FaUser className="inline mr-1"/>
                                            {damage.created_by_name || 'System'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            <FaCalendarAlt className="inline mr-1"/>
                                            {new Date(damage.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="font-medium">{damage.quantity} units - {damage.reason}</p>
                                    {damage.notes && (
                                        <p className="text-sm text-gray-600">{damage.notes}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Loss</p>
                                    <p className="font-bold text-red-600">৳{Number(damage.total_loss).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No damage history found for this product
                    </div>
                )}
            </div>
        </div>
    );

    // ============ MAIN RENDER ============
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                                <FaExclamationTriangle className="text-white text-3xl"/>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {isEditMode ? 'Update Damage Stock Entry' : 'Add Damage Stock Entry'}
                                </h2>
                                <p className="text-white text-opacity-90 mt-1">
                                    {productData?.name || recordData?.product_name} ({productData?.product_code || recordData?.product_code})
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition-colors bg-white bg-opacity-20 rounded-lg p-2"
                        >
                            <FaTimes size={20}/>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b px-6">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab("damage_info")}
                            className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                                activeTab === "damage_info"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Damage Information
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                                activeTab === "history"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Damage History
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
                    <DamageSummaryCards/>
                    <ProductInfoCard/>

                    {activeTab === "damage_info" ? (
                        <form onSubmit={handleSubmit}>
                            <DamageForm/>

                            {/* Footer Actions */}
                            <div className="mt-8 pt-6 border-t flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                                    disabled={loading}
                                >
                                    <FaTimes/> Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            {isEditMode ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            <FaSave/> {isEditMode ? 'Update Damage Entry' : 'Create Damage Entry'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <DamageHistory/>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateDamageStockModal;