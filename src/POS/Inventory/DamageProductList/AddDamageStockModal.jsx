// import React, {useState, useEffect} from "react";
// import {posDamageProductAPI} from "../../../context_or_provider/pos/damageProducts/damage_productAPI";
// import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
// import {
//     FaBox, FaExclamationTriangle, FaSearch, FaBarcode,
//     FaDollarSign, FaWarehouse, FaTag, FaSave, FaTimes,
//     FaInfoCircle, FaUser, FaBuilding, FaShoppingCart,
//     FaArrowLeft, FaCheck, FaHistory, FaCalendarAlt,
//     FaFileInvoice, FaPercent, FaBalanceScale
// } from "react-icons/fa";
// import {posSupplierAPI} from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";
// import {posCustomerAPI} from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";
//
// const AddDamageStockModal = ({isOpen, onClose, onSuccess, initialProduct, initialSupplier, initialCustomer}) => {
//     // ============ STATE MANAGEMENT ============
//     const [step, setStep] = useState(1); // 1: Product Search, 2: Damage Entry
//     const [selectedProduct, setSelectedProduct] = useState(initialProduct || null);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [searchResults, setSearchResults] = useState([]);
//     const [searchLoading, setSearchLoading] = useState(false);
//     const [searchDebounce, setSearchDebounce] = useState(null);
//
//     const [form, setForm] = useState({
//         damage_type: "returnable",
//         source_type: "manual",
//         quantity: "",
//         reason: "",
//         notes: "",
//         unit_cost: "",
//         supplier: initialSupplier?.id || null,
//         customer: initialCustomer?.id || null,
//         reference_no: "",
//         is_compensated: false,
//         compensated_amount: ""
//     });
//
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [showCompensation, setShowCompensation] = useState(false);
//     const [supplierSearch, setSupplierSearch] = useState("");
//     const [customerSearch, setCustomerSearch] = useState("");
//     const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
//     const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
//     const [suppliers, setSuppliers] = useState([]);
//     const [customers, setCustomers] = useState([]);
//
//     // ============ INITIALIZE ============
//     useEffect(() => {
//         if (isOpen) {
//             if (initialProduct) {
//                 setSelectedProduct(initialProduct);
//                 setForm(prev => ({
//                     ...prev,
//                     unit_cost: initialProduct.purchase_price || "",
//                     reference_no: generateReferenceNo()
//                 }));
//                 setStep(2);
//             } else {
//                 setStep(1);
//                 setSearchQuery("");
//                 setSearchResults([]);
//             }
//
//             // Load suppliers and customers if needed
//             loadSuppliers();
//             loadCustomers();
//         }
//     }, [isOpen, initialProduct]);
//
//     // ============ LOAD SUPPLIERS & CUSTOMERS ============
//     const loadSuppliers = async () => {
//         try {
//             // এখানে আপনার সাপ্লায়ার API কল করুন
//             const res = await posSupplierAPI.getAll();
//             setSuppliers(res.data);
//             // setSuppliers([
//             //     {id: 1, name: "Supplier A", company: "Company A"},
//             //     {id: 2, name: "Supplier B", company: "Company B"},
//             // ]);
//         } catch (error) {
//             console.error("Failed to load suppliers:", error);
//         }
//     };
//
//     const loadCustomers = async () => {
//         try {
//             // এখানে আপনার কাস্টমার API কল করুন
//             const res = await posCustomerAPI.getAll();
//             setCustomers(res.data);
//             // setCustomers([
//             //     {id: 1, name: "Customer A", phone: "017xxxx"},
//             //     {id: 2, name: "Customer B", phone: "018xxxx"},
//             // ]);
//         } catch (error) {
//             console.error("Failed to load customers:", error);
//         }
//     };
//
//     // ============ HELPERS ============
//     const generateReferenceNo = () => {
//         const date = new Date();
//         return `DMG-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
//     };
//
//     // ============ PRODUCT SEARCH ============
//     const handleProductSearch = (query) => {
//         setSearchQuery(query);
//
//         // Debounce search
//         if (searchDebounce) clearTimeout(searchDebounce);
//
//         if (!query.trim()) {
//             setSearchResults([]);
//             return;
//         }
//
//         setSearchDebounce(setTimeout(async () => {
//             setSearchLoading(true);
//             try {
//                 const res = await posProductAPI.search(query);
//                 setSearchResults(res.data);
//             } catch (error) {
//                 console.error("Product search failed:", error);
//             } finally {
//                 setSearchLoading(false);
//             }
//         }, 500));
//     };
//
//     const handleSelectProduct = (product) => {
//         setSelectedProduct(product);
//         setForm(prev => ({
//             ...prev,
//             unit_cost: product.purchase_price || "",
//             reference_no: generateReferenceNo()
//         }));
//         setStep(2);
//     };
//
//     // ============ VALIDATION ============
//     const validateForm = () => {
//         const newErrors = {};
//
//         // Quantity validation
//         if (!form.quantity || form.quantity <= 0) {
//             newErrors.quantity = "Quantity must be greater than 0";
//         } else if (form.quantity > (selectedProduct?.stock || 0)) {
//             newErrors.quantity = `Cannot exceed available stock (${selectedProduct?.stock})`;
//         }
//
//         // Reason validation
//         if (!form.reason?.trim()) {
//             newErrors.reason = "Damage reason is required";
//         }
//
//         // Unit cost validation
//         if (!form.unit_cost || form.unit_cost <= 0) {
//             newErrors.unit_cost = "Valid unit cost is required";
//         }
//
//         // Source specific validation
//         if (form.source_type === 'purchase' && !form.supplier) {
//             newErrors.supplier = "Supplier is required for purchase damage";
//         }
//
//         if (form.source_type === 'sale' && !form.customer) {
//             newErrors.customer = "Customer is required for sale damage";
//         }
//
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };
//
//     // ============ HANDLERS ============
//     // const handleChange = (e) => {
//     //     const {name, value, type, checked} = e.target;
//     //
//     //     // Handle number fields
//     //     if (type === 'number') {
//     //         setForm(prev => ({
//     //             ...prev,
//     //             [name]: value === '' ? '' : Number(value)
//     //         }));
//     //     } else {
//     //         setForm(prev => ({
//     //             ...prev,
//     //             [name]: type === 'checkbox' ? checked : value
//     //         }));
//     //     }
//     //
//     //     // Clear error for this field
//     //     if (errors[name]) {
//     //         setErrors(prev => ({...prev, [name]: null}));
//     //     }
//     // };
//
//     const handleChange = (e) => {
//         const {name, value, type, checked} = e.target;
//
//         // Handle different input types
//         if (type === 'checkbox') {
//             setForm(prev => ({
//                 ...prev,
//                 [name]: checked
//             }));
//         }
//         // Handle supplier and customer selects
//         else if (name === 'supplier' || name === 'customer') {
//             setForm(prev => ({
//                 ...prev,
//                 [name]: value ? Number(value) : null  // ✅ খালি string হলে null
//             }));
//         }
//         // Handle number inputs
//         else if (type === 'number') {
//             setForm(prev => ({
//                 ...prev,
//                 [name]: value === '' ? '' : Number(value)
//             }));
//         }
//         // Handle other inputs
//         else {
//             setForm(prev => ({
//                 ...prev,
//                 [name]: value
//             }));
//         }
//
//         // Clear error for this field
//         if (errors[name]) {
//             setErrors(prev => ({...prev, [name]: null}));
//         }
//     };
//     // const handleSupplierSelect = (supplier) => {
//     //     setForm(prev => ({...prev, supplier: supplier.id}));
//     //     setSupplierSearch(supplier.name);
//     //     setShowSupplierDropdown(false);
//     // };
//     //
//     // const handleCustomerSelect = (customer) => {
//     //     setForm(prev => ({...prev, customer: customer.id}));
//     //     setCustomerSearch(customer.name);
//     //     setShowCustomerDropdown(false);
//     // };
//
//
//     const handleSupplierSelect = (supplier) => {
//         setForm(prev => ({...prev, supplier: Number(supplier.id)})); // ✅ Number এ convert
//         // setSupplierSearch(supplier.name);
//         setSupplierSearch(supplier.id);
//         setShowSupplierDropdown(false);
//     };
//
//     const handleCustomerSelect = (customer) => {
//         setForm(prev => ({...prev, customer: Number(customer.id)})); // ✅ Number এ convert
//         // setCustomerSearch(customer.name);
//         setCustomerSearch(customer.id);
//         setShowCustomerDropdown(false);
//     };
//
//     // const handleSubmit = async (e) => {
//     //     e.preventDefault();
//     //     if (!validateForm()) return;
//     //
//     //     setLoading(true);
//     //     setErrors({});
//     //
//     //     try {
//     //         // ✅ সঠিক DamageStock Payload
//     //         const payload = {
//     //             product: selectedProduct.id,
//     //             damage_type: form.damage_type,
//     //             source_type: form.source_type,
//     //             quantity: Number(form.quantity),
//     //             unit_cost: Number(form.unit_cost),
//     //             reason: form.reason,
//     //             notes: form.notes || "",
//     //             reference_no: form.reference_no,
//     //             supplier: form.supplier ? Number(form.supplier) : null,
//     //             customer: form.customer ? Number(form.customer) : null,
//     //             is_compensated: form.is_compensated,
//     //             compensated_amount: form.is_compensated ? Number(form.compensated_amount) : 0
//     //         };
//     //
//     //         console.log("Creating Damage Entry:", payload);
//     //
//     //         const res = await posDamageProductAPI.create(payload);
//     //
//     //         onSuccess?.({
//     //             ...res.data,
//     //             product_name: selectedProduct.name,
//     //             product_code: selectedProduct.product_code
//     //         });
//     //
//     //         resetForm();
//     //         onClose();
//     //
//     //     } catch (err) {
//     //         console.error("Failed to create damage entry:", err);
//     //         if (err.response?.data) {
//     //             // Format backend errors
//     //             const backendErrors = {};
//     //             Object.keys(err.response.data).forEach(key => {
//     //                 if (Array.isArray(err.response.data[key])) {
//     //                     backendErrors[key] = err.response.data[key][0];
//     //                 } else {
//     //                     backendErrors[key] = err.response.data[key];
//     //                 }
//     //             });
//     //             setErrors(backendErrors);
//     //
//     //             // Show first error as alert
//     //             const firstError = Object.values(backendErrors)[0];
//     //             if (firstError) alert(firstError);
//     //         } else {
//     //             alert("Failed to create damage entry. Please try again.");
//     //         }
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };
//
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateForm()) return;
//
//         setLoading(true);
//         setErrors({});
//
//         try {
//             // ডিবাগ: form state চেক করুন
//             console.log("Form state before submit:", {
//                 supplier: form.supplier,
//                 supplierType: typeof form.supplier,
//                 customer: form.customer,
//                 customerType: typeof form.customer
//             });
//
//             const payload = {
//                 product: selectedProduct.id,
//                 damage_type: form.damage_type,
//                 source_type: form.source_type,
//                 quantity: Number(form.quantity),
//                 unit_cost: Number(form.unit_cost),
//                 reason: form.reason,
//                 notes: form.notes || "",
//                 reference_no: form.reference_no,
//                 supplier: form.supplier ? Number(form.supplier) : null,
//                 customer: form.customer ? Number(form.customer) : null,
//                 is_compensated: form.is_compensated,
//                 compensated_amount: form.is_compensated ? Number(form.compensated_amount) : 0
//             };
//
//             console.log("Payload being sent:", payload);
//
//             const res = await posDamageProductAPI.create(payload);
//
//             onSuccess?.({
//                 ...res.data,
//                 product_name: selectedProduct.name,
//                 product_code: selectedProduct.product_code
//             });
//
//             resetForm();
//             onClose();
//
//         } catch (err) {
//             console.error("Failed to create damage entry:", err);
//             if (err.response?.data) {
//                 setErrors(err.response.data);
//                 // Show first error as alert
//                 const firstError = Object.values(err.response.data)[0];
//                 if (Array.isArray(firstError)) {
//                     alert(firstError[0]);
//                 } else {
//                     alert(firstError);
//                 }
//             } else {
//                 alert("Failed to create damage entry. Please try again.");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const resetForm = () => {
//         setForm({
//             damage_type: "returnable",
//             source_type: "manual",
//             quantity: "",
//             reason: "",
//             notes: "",
//             unit_cost: "",
//             supplier: null,
//             customer: null,
//             reference_no: "",
//             is_compensated: false,
//             compensated_amount: ""
//         });
//         setSelectedProduct(null);
//         setSearchQuery("");
//         setSearchResults([]);
//         setErrors({});
//         setStep(1);
//         setShowCompensation(false);
//     };
//
//     const goBack = () => {
//         setStep(1);
//         setSelectedProduct(null);
//     };
//
//     // ============ CALCULATIONS ============
//     const totalLoss = (Number(form.quantity) || 0) * (Number(form.unit_cost) || 0);
//     const pendingAmount = totalLoss - (Number(form.compensated_amount) || 0);
//
//     // ============ UI COMPONENTS ============
//     const ProductSearchStep = () => (
//         <div className="p-6">
//             <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-2">Select Product</h3>
//                 <p className="text-sm text-gray-500">Search and select the product that is damaged</p>
//             </div>
//
//             {/* Search Box */}
//             <div className="relative mb-6">
//                 <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => handleProductSearch(e.target.value)}
//                     placeholder="Search product by name or code..."
//                     className="w-full p-4 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
//                     autoFocus
//                 />
//                 <FaSearch className="absolute left-4 top-4 text-gray-400 text-xl"/>
//                 {searchLoading && (
//                     <div className="absolute right-4 top-4">
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
//                     </div>
//                 )}
//             </div>
//
//             {/* Search Results */}
//             {searchLoading ? (
//                 <div className="text-center py-12">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
//                     <p className="text-gray-500 mt-4">Searching products...</p>
//                 </div>
//             ) : (
//                 <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
//                     {searchResults.map(product => (
//                         <button
//                             key={product.id}
//                             onClick={() => handleSelectProduct(product)}
//                             className="w-full text-left p-4 border-2 border-gray-100 rounded-xl hover:border-red-200 hover:bg-red-50 transition-all group"
//                         >
//                             <div className="flex items-center gap-4">
//                                 {/* Product Image */}
//                                 <div className="relative">
//                                     {product.image ? (
//                                         <img
//                                             src={product.image}
//                                             alt={product.name}
//                                             className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200 group-hover:border-red-200"
//                                         />
//                                     ) : (
//                                         <div
//                                             className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200 group-hover:border-red-200">
//                                             <FaBox className="text-gray-400 text-2xl"/>
//                                         </div>
//                                     )}
//                                     {/* Stock Badge */}
//                                     <span
//                                         className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
//                                             product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
//                                         }`}>
//                                         {product.stock}
//                                     </span>
//                                 </div>
//
//                                 {/* Product Info */}
//                                 <div className="flex-1">
//                                     <div className="flex items-center gap-2 mb-2">
//                                         <h4 className="font-semibold text-gray-800 group-hover:text-red-600">
//                                             {product.name}
//                                         </h4>
//                                         <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
//                                             {product.product_code}
//                                         </span>
//                                     </div>
//
//                                     <div className="grid grid-cols-3 gap-4 text-sm">
//                                         <div>
//                                             <p className="text-gray-500">Purchase</p>
//                                             <p className="font-semibold text-green-600">৳{product.purchase_price}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-gray-500">Selling</p>
//                                             <p className="font-semibold text-blue-600">৳{product.selling_price}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-gray-500">Category</p>
//                                             <p className="font-semibold text-gray-700">{product.category_name || 'N/A'}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//
//                                 {/* Select Indicator */}
//                                 <div
//                                     className="w-8 h-8 rounded-full border-2 border-gray-300 group-hover:border-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                                     <FaCheck className="text-red-500 text-sm"/>
//                                 </div>
//                             </div>
//                         </button>
//                     ))}
//
//                     {searchQuery && searchResults.length === 0 && (
//                         <div className="text-center py-12">
//                             <FaBox className="text-5xl text-gray-300 mx-auto mb-4"/>
//                             <h4 className="text-lg font-medium text-gray-700 mb-2">No Products Found</h4>
//                             <p className="text-gray-500">Try searching with a different keyword</p>
//                         </div>
//                     )}
//
//                     {!searchQuery && (
//                         <div className="text-center py-12">
//                             <FaSearch className="text-5xl text-gray-300 mx-auto mb-4"/>
//                             <h4 className="text-lg font-medium text-gray-700 mb-2">Search Products</h4>
//                             <p className="text-gray-500">Type product name or code to search</p>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
//
//     const DamageEntryStep = () => (
//         <form onSubmit={handleSubmit} className="p-6">
//             {/* Selected Product Banner */}
//             <div
//                 className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl mb-6 flex items-center justify-between border border-red-100">
//                 <div className="flex items-center gap-4">
//                     {selectedProduct?.image ? (
//                         <img
//                             src={selectedProduct.image}
//                             alt={selectedProduct.name}
//                             className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
//                         />
//                     ) : (
//                         <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
//                             <FaBox className="text-red-500 text-2xl"/>
//                         </div>
//                     )}
//                     <div>
//                         <h3 className="font-semibold text-lg text-gray-800">{selectedProduct?.name}</h3>
//                         <div className="flex items-center gap-3 mt-1">
//                             <span className="text-sm bg-white px-3 py-1 rounded-full text-gray-600">
//                                 Code: {selectedProduct?.product_code}
//                             </span>
//                             <span className={`text-sm px-3 py-1 rounded-full ${
//                                 selectedProduct?.stock > 0
//                                     ? 'bg-green-100 text-green-700'
//                                     : 'bg-red-100 text-red-700'
//                             }`}>
//                                 Stock: {selectedProduct?.stock} units
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//                 <button
//                     type="button"
//                     onClick={goBack}
//                     className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
//                 >
//                     <FaArrowLeft/> Change
//                 </button>
//             </div>
//
//             {/* Progress Steps */}
//             <div className="flex items-center gap-2 mb-6">
//                 <div className="flex items-center">
//                     <div
//                         className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">
//                         1
//                     </div>
//                     <span className="ml-2 text-sm font-medium text-gray-700">Product</span>
//                 </div>
//                 <div className="flex-1 h-0.5 bg-gray-200"></div>
//                 <div className="flex items-center">
//                     <div
//                         className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">
//                         2
//                     </div>
//                     <span className="ml-2 text-sm font-medium text-gray-700">Damage Info</span>
//                 </div>
//             </div>
//
//             {/* Form Grid */}
//             <div className="grid grid-cols-2 gap-6">
//                 {/* Left Column */}
//                 <div className="space-y-6">
//                     {/* Damage Type */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Damage Type <span className="text-red-500">*</span>
//                         </label>
//                         <div className="flex gap-3">
//                             <button
//                                 type="button"
//                                 onClick={() => setForm(prev => ({...prev, damage_type: "returnable"}))}
//                                 className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
//                                     form.damage_type === "returnable"
//                                         ? "border-yellow-500 bg-yellow-50 text-yellow-700 shadow-md"
//                                         : "border-gray-200 hover:border-yellow-300 hover:bg-yellow-50"
//                                 }`}
//                             >
//                                 <FaTag className="inline mr-2"/>
//                                 Returnable
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={() => setForm(prev => ({...prev, damage_type: "non_returnable"}))}
//                                 className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
//                                     form.damage_type === "non-returnable"
//                                         ? "border-red-500 bg-red-50 text-red-700 shadow-md"
//                                         : "border-gray-200 hover:border-red-300 hover:bg-red-50"
//                                 }`}
//                             >
//                                 <FaExclamationTriangle className="inline mr-2"/>
//                                 Non-returnable
//                             </button>
//                         </div>
//                     </div>
//
//                     {/* Source Type */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Source <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                             name="source_type"
//                             value={form.source_type}
//                             onChange={handleChange}
//                             className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
//                         >
//                             <option value="manual">📝 Manual Entry</option>
//                             <option value="purchase">📦 Purchase Related</option>
//                             <option value="sale">🛒 Sale Related</option>
//                             <option value="adjustment">⚖️ Stock Adjustment</option>
//                         </select>
//                     </div>
//
//                     {/* Quantity */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Quantity <span className="text-red-500">*</span>
//                         </label>
//                         <div className="relative">
//                             <input
//                                 type="number"
//                                 name="quantity"
//                                 min="1"
//                                 max={selectedProduct?.stock}
//                                 value={form.quantity}
//                                 onChange={handleChange}
//                                 className={`w-full p-3 pl-10 border-2 rounded-xl transition-all ${
//                                     errors.quantity
//                                         ? "border-red-500 bg-red-50"
//                                         : "border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"
//                                 }`}
//                                 placeholder="Enter quantity"
//                             />
//                             <FaWarehouse className="absolute left-3 top-3.5 text-gray-400"/>
//                         </div>
//                         {errors.quantity && (
//                             <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                                 <FaInfoCircle/> {errors.quantity}
//                             </p>
//                         )}
//                         <p className="text-xs text-gray-500 mt-1">
//                             Max available: {selectedProduct?.stock || 0} units
//                         </p>
//                     </div>
//
//                     {/* Reason */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Damage Reason <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                             name="reason"
//                             value={form.reason}
//                             onChange={handleChange}
//                             className={`w-full p-3 border-2 rounded-xl transition-all ${
//                                 errors.reason
//                                     ? "border-red-500 bg-red-50"
//                                     : "border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"
//                             }`}
//                         >
//                             <option value="">Select Reason</option>
//                             <option value="customer_return">🔄 Customer Return (Damaged)</option>
//                             <option value="transit_damage">🚚 Transit/Shipping Damage</option>
//                             <option value="storage_damage">🏭 Storage/Warehouse Damage</option>
//                             <option value="expired">⏰ Expired Product</option>
//                             <option value="defective">🔧 Manufacturing Defect</option>
//                             <option value="other">❓ Other</option>
//                         </select>
//                         {errors.reason && (
//                             <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                                 <FaInfoCircle/> {errors.reason}
//                             </p>
//                         )}
//                     </div>
//                 </div>
//
//                 {/* Right Column */}
//                 <div className="space-y-6">
//                     {/* Unit Cost */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Unit Cost (৳) <span className="text-red-500">*</span>
//                         </label>
//                         <div className="relative">
//                             <input
//                                 type="number"
//                                 name="unit_cost"
//                                 step="0.01"
//                                 min="0"
//                                 value={form.unit_cost}
//                                 onChange={handleChange}
//                                 className={`w-full p-3 pl-10 border-2 rounded-xl transition-all ${
//                                     errors.unit_cost
//                                         ? "border-red-500 bg-red-50"
//                                         : "border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"
//                                 }`}
//                             />
//                             <FaDollarSign className="absolute left-3 top-3.5 text-gray-400"/>
//                         </div>
//                         {errors.unit_cost && (
//                             <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                                 <FaInfoCircle/> {errors.unit_cost}
//                             </p>
//                         )}
//                     </div>
//
//                     {/* Supplier/Customer (conditional) */}
//
//                     {/*{form.source_type === 'purchase' && (*/}
//                     {/*    <div className="relative">*/}
//                     {/*        <label className="block text-sm font-medium text-gray-700 mb-2">*/}
//                     {/*            Supplier <span className="text-red-500">*</span>*/}
//                     {/*        </label>*/}
//                     {/*        <div className="relative">*/}
//                     {/*            <input*/}
//                     {/*                type="text"*/}
//                     {/*                value={supplierSearch}*/}
//                     {/*                onChange={(e) => {*/}
//                     {/*                    setSupplierSearch(e.target.value);*/}
//                     {/*                    setShowSupplierDropdown(true);*/}
//                     {/*                }}*/}
//                     {/*                onFocus={() => setShowSupplierDropdown(true)}*/}
//                     {/*                placeholder="Search supplier..."*/}
//                     {/*                className={`w-full p-3 pl-10 border-2 rounded-xl transition-all ${*/}
//                     {/*                    errors.supplier*/}
//                     {/*                        ? "border-red-500 bg-red-50"*/}
//                     {/*                        : "border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"*/}
//                     {/*                }`}*/}
//                     {/*            />*/}
//                     {/*            <FaBuilding className="absolute left-3 top-3.5 text-gray-400"/>*/}
//
//                     {/*            {showSupplierDropdown && (*/}
//                     {/*                <div*/}
//                     {/*                    className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">*/}
//                     {/*                    {suppliers.map(supplier => (*/}
//                     {/*                        <button*/}
//                     {/*                            key={supplier.id}*/}
//                     {/*                            type="button"*/}
//                     {/*                            onClick={() => handleSupplierSelect(supplier)}*/}
//                     {/*                            className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors"*/}
//                     {/*                        >*/}
//                     {/*                            <div className="font-medium">{supplier.name}</div>*/}
//                     {/*                            <div className="text-sm text-gray-500">{supplier.company}</div>*/}
//                     {/*                        </button>*/}
//                     {/*                    ))}*/}
//                     {/*                </div>*/}
//                     {/*            )}*/}
//                     {/*        </div>*/}
//                     {/*        {errors.supplier && (*/}
//                     {/*            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">*/}
//                     {/*                <FaInfoCircle/> {errors.supplier}*/}
//                     {/*            </p>*/}
//                     {/*        )}*/}
//                     {/*    </div>*/}
//                     {/*)}*/}
//
//                     {/*{form.source_type === 'sale' && (*/}
//                     {/*    <div className="relative">*/}
//                     {/*        <label className="block text-sm font-medium text-gray-700 mb-2">*/}
//                     {/*            Customer <span className="text-red-500">*</span>*/}
//                     {/*        </label>*/}
//                     {/*        <div className="relative">*/}
//                     {/*            <input*/}
//                     {/*                type="text"*/}
//                     {/*                value={customerSearch}*/}
//                     {/*                onChange={(e) => {*/}
//                     {/*                    setCustomerSearch(e.target.value);*/}
//                     {/*                    setShowCustomerDropdown(true);*/}
//                     {/*                }}*/}
//                     {/*                onFocus={() => setShowCustomerDropdown(true)}*/}
//                     {/*                placeholder="Search customer..."*/}
//                     {/*                className={`w-full p-3 pl-10 border-2 rounded-xl transition-all ${*/}
//                     {/*                    errors.customer*/}
//                     {/*                        ? "border-red-500 bg-red-50"*/}
//                     {/*                        : "border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"*/}
//                     {/*                }`}*/}
//                     {/*            />*/}
//                     {/*            <FaUser className="absolute left-3 top-3.5 text-gray-400"/>*/}
//
//                     {/*            {showCustomerDropdown && (*/}
//                     {/*                <div*/}
//                     {/*                    className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">*/}
//                     {/*                    {customers.map(customer => (*/}
//                     {/*                        <button*/}
//                     {/*                            key={customer.id}*/}
//                     {/*                            type="button"*/}
//                     {/*                            onClick={() => handleCustomerSelect(customer)}*/}
//                     {/*                            className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors"*/}
//                     {/*                        >*/}
//                     {/*                            <div className="font-medium">{customer.name}</div>*/}
//                     {/*                            <div className="text-sm text-gray-500">{customer.phone}</div>*/}
//                     {/*                        </button>*/}
//                     {/*                    ))}*/}
//                     {/*                </div>*/}
//                     {/*            )}*/}
//                     {/*        </div>*/}
//                     {/*        {errors.customer && (*/}
//                     {/*            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">*/}
//                     {/*                <FaInfoCircle/> {errors.customer}*/}
//                     {/*            </p>*/}
//                     {/*        )}*/}
//                     {/*    </div>*/}
//                     {/*)}*/}
//
//
//                     {form.source_type === 'purchase' && (
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Supplier <span className="text-red-500">*</span>
//                             </label>
//                             <select
//                                 name="supplier"
//                                 value={form.supplier || ''}
//                                 onChange={handleChange}  // ✅ শুধু handleChange ব্যবহার করুন
//                                 className={`w-full p-3 border-2 rounded-xl ${
//                                     errors.supplier ? "border-red-500 bg-red-50" : "border-gray-200"
//                                 }`}
//                             >
//                                 <option value="">Select Supplier</option>
//                                 {suppliers.map(supplier => (
//                                     <option key={supplier.id} value={supplier.id}>
//                                         {supplier.name}
//                                     </option>
//                                 ))}
//                             </select>
//                             {errors.supplier && (
//                                 <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                                     <FaInfoCircle/> {errors.supplier}
//                                 </p>
//                             )}
//                         </div>
//                     )}
//
//                     {form.source_type === 'sale' && (
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Customer <span className="text-red-500">*</span>
//                             </label>
//                             <select
//                                 name="customer"
//                                 value={form.customer || ''}
//                                 onChange={handleChange}  // ✅ শুধু handleChange ব্যবহার করুন
//                                 className={`w-full p-3 border-2 rounded-xl ${
//                                     errors.customer ? "border-red-500 bg-red-50" : "border-gray-200"
//                                 }`}
//                             >
//                                 <option value="">Select Customer</option>
//                                 {customers.map(customer => (
//                                     <option key={customer.id} value={customer.id}>
//                                         {customer.name}
//                                     </option>
//                                 ))}
//                             </select>
//                             {errors.customer && (
//                                 <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                                     <FaInfoCircle/> {errors.customer}
//                                 </p>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>
//
//             {/* Notes */}
//             <div className="mt-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Additional Notes
//                 </label>
//                 <textarea
//                     name="notes"
//                     rows="3"
//                     value={form.notes}
//                     onChange={handleChange}
//                     className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
//                     placeholder="Add any additional details about the damage..."
//                 />
//             </div>
//
//             {/* Reference & Summary */}
//             <div className="mt-6 grid grid-cols-2 gap-6">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Reference Number
//                     </label>
//                     <div className="relative">
//                         <input
//                             type="text"
//                             name="reference_no"
//                             value={form.reference_no}
//                             onChange={handleChange}
//                             className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl bg-gray-50"
//                             readOnly
//                         />
//                         <FaFileInvoice className="absolute left-3 top-3.5 text-gray-400"/>
//                     </div>
//                 </div>
//
//                 {/* Summary Card */}
//                 <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
//                     <h4 className="text-sm font-medium text-gray-600 mb-3">Loss Summary</h4>
//                     <div className="space-y-2">
//                         <div className="flex justify-between text-sm">
//                             <span className="text-gray-600">Quantity:</span>
//                             <span className="font-medium">{form.quantity || 0} units</span>
//                         </div>
//                         <div className="flex justify-between text-sm">
//                             <span className="text-gray-600">Unit Cost:</span>
//                             <span className="font-medium">৳{Number(form.unit_cost).toFixed(2)}</span>
//                         </div>
//                         <div className="border-t border-gray-200 my-2"></div>
//                         <div className="flex justify-between font-semibold">
//                             <span>Total Loss:</span>
//                             <span className="text-red-600">৳{totalLoss.toFixed(2)}</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Compensation */}
//             <div className="mt-6 bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
//                 <div className="flex items-center mb-4">
//                     <input
//                         type="checkbox"
//                         id="is_compensated"
//                         name="is_compensated"
//                         checked={form.is_compensated}
//                         onChange={(e) => {
//                             handleChange(e);
//                             setShowCompensation(e.target.checked);
//                         }}
//                         className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
//                     />
//                     <label htmlFor="is_compensated" className="ml-3 text-sm font-medium text-gray-700">
//                         Mark as Compensated (ক্ষতিপূরণ দেওয়া হয়েছে)
//                     </label>
//                 </div>
//
//                 {showCompensation && (
//                     <div className="grid grid-cols-2 gap-6">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Compensated Amount
//                             </label>
//                             <div className="relative">
//                                 <input
//                                     type="number"
//                                     name="compensated_amount"
//                                     step="0.01"
//                                     min="0"
//                                     max={totalLoss}
//                                     value={form.compensated_amount}
//                                     onChange={handleChange}
//                                     className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200"
//                                 />
//                                 <FaDollarSign className="absolute left-3 top-3.5 text-gray-400"/>
//                             </div>
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Pending Amount
//                             </label>
//                             <div className="relative">
//                                 <input
//                                     type="text"
//                                     value={`৳${pendingAmount.toFixed(2)}`}
//                                     className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl bg-gray-100"
//                                     readOnly
//                                 />
//                                 <FaBalanceScale className="absolute left-3 top-3.5 text-gray-400"/>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//
//             {/* Form Actions */}
//             <div className="mt-8 pt-6 border-t flex justify-end gap-3">
//                 <button
//                     type="button"
//                     onClick={() => {
//                         resetForm();
//                         onClose();
//                     }}
//                     className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
//                     disabled={loading}
//                 >
//                     <FaTimes/> Cancel
//                 </button>
//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-medium hover:from-red-700 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
//                 >
//                     {loading ? (
//                         <>
//                             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                             Creating...
//                         </>
//                     ) : (
//                         <>
//                             <FaSave/> Create Damage Entry
//                         </>
//                     )}
//                 </button>
//             </div>
//         </form>
//     );
//
//     // ============ MAIN RENDER ============
//     if (!isOpen) return null;
//
//     return (
//         <div
//             className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//             <div
//                 className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden animate-slideIn">
//
//                 {/* Header */}
//                 <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-5 text-white">
//                     <div className="flex justify-between items-start">
//                         <div className="flex items-center gap-4">
//                             <div className="bg-white bg-opacity-20 p-3 rounded-xl">
//                                 <FaExclamationTriangle className="text-white text-3xl"/>
//                             </div>
//                             <div>
//                                 <h2 className="text-2xl font-bold">
//                                     {step === 1 ? 'Add Damage Stock' : 'Damage Entry Form'}
//                                 </h2>
//                                 <p className="text-white text-opacity-90 mt-1">
//                                     {step === 1
//                                         ? 'Search and select the damaged product'
//                                         : `Product: ${selectedProduct?.name || ''}`
//                                     }
//                                 </p>
//                             </div>
//                         </div>
//                         <button
//                             onClick={() => {
//                                 resetForm();
//                                 onClose();
//                             }}
//                             className="text-white hover:text-gray-200 bg-white bg-opacity-20 rounded-lg p-2 transition-colors"
//                         >
//                             <FaTimes size={20}/>
//                         </button>
//                     </div>
//                 </div>
//
//                 {/* Content */}
//                 <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
//                     {step === 1 ? <ProductSearchStep/> : <DamageEntryStep/>}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default AddDamageStockModal;




import React, {useState, useEffect} from "react";
import {posDamageProductAPI} from "../../../context_or_provider/pos/damageProducts/damage_productAPI";
import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
import {
    FaBox, FaExclamationTriangle, FaSearch,
    FaDollarSign, FaWarehouse, FaTag, FaSave, FaTimes,
    FaInfoCircle, FaUser, FaBuilding,
    FaArrowLeft, FaCheck,
    FaFileInvoice, FaBalanceScale
} from "react-icons/fa";
import {posSupplierAPI} from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";
import {posCustomerAPI} from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";

const AddDamageStockModal = ({isOpen, onClose, onSuccess, initialProduct, initialSupplier, initialCustomer}) => {
    // ============ STATE MANAGEMENT ============
    const [step, setStep] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(initialProduct || null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchDebounce, setSearchDebounce] = useState(null);

    const [form, setForm] = useState({
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
    const [suppliers, setSuppliers] = useState([]);
    const [customers, setCustomers] = useState([]);

    // ============ INITIALIZE ============
    useEffect(() => {
        if (isOpen) {
            // Reset form when modal opens
            resetForm();

            if (initialProduct) {
                setSelectedProduct(initialProduct);
                setForm(prev => ({
                    ...prev,
                    unit_cost: initialProduct.purchase_price || "",
                    reference_no: generateReferenceNo(),
                    supplier: initialSupplier?.id || null,
                    customer: initialCustomer?.id || null
                }));
                setStep(2);
            }

            // Load suppliers and customers
            loadSuppliers();
            loadCustomers();
        }
    }, [isOpen, initialProduct, initialSupplier, initialCustomer]);

    // ============ LOAD SUPPLIERS & CUSTOMERS ============
    const loadSuppliers = async () => {
        try {
            const res = await posSupplierAPI.getAll();
            setSuppliers(res.data || []);
        } catch (error) {
            console.error("Failed to load suppliers:", error);
        }
    };

    const loadCustomers = async () => {
        try {
            const res = await posCustomerAPI.getAll();
            setCustomers(res.data || []);
        } catch (error) {
            console.error("Failed to load customers:", error);
        }
    };

    // ============ HELPERS ============
    const generateReferenceNo = () => {
        const date = new Date();
        return `DMG-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    };

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
            unit_cost: product.purchase_price || "",
            reference_no: generateReferenceNo()
        }));
        setStep(2);
    };

    // ============ VALIDATION ============
    const validateForm = () => {
        const newErrors = {};

        if (!form.quantity || form.quantity <= 0) {
            newErrors.quantity = "Quantity must be greater than 0";
        } else if (Number(form.quantity) > (selectedProduct?.stock || 0)) {
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

        // Handle different input types
        if (type === 'checkbox') {
            setForm(prev => ({ ...prev, [name]: checked }));
        }
        else if (name === 'supplier' || name === 'customer') {
            // Convert to number or null
            const newValue = value === '' ? null : Number(value);
            setForm(prev => ({ ...prev, [name]: newValue }));
        }
        else if (type === 'number') {
            setForm(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
        }
        else {
            setForm(prev => ({ ...prev, [name]: value }));
        }

        // Clear error for this field
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
            // Prepare payload - ensure all values are correct types
            const payload = {
                product: selectedProduct.id,
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

            console.log("Submitting payload:", payload);

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
                const firstError = Object.values(err.response.data)[0];
                if (Array.isArray(firstError)) {
                    alert(firstError[0]);
                } else {
                    alert(firstError);
                }
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
            quantity: "",
            reason: "",
            notes: "",
            unit_cost: "",
            supplier: null,
            customer: null,
            reference_no: generateReferenceNo(),
            is_compensated: false,
            compensated_amount: ""
        });
        setSelectedProduct(null);
        setSearchQuery("");
        setSearchResults([]);
        setErrors({});
        setStep(1);
        setShowCompensation(false);
    };

    const goBack = () => {
        setStep(1);
        setSelectedProduct(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // ============ CALCULATIONS ============
    const totalLoss = (Number(form.quantity) || 0) * (Number(form.unit_cost) || 0);
    const pendingAmount = totalLoss - (Number(form.compensated_amount) || 0);

    // ============ RENDER METHODS ============
    const ProductSearchStep = () => (
        <div className="p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Select Product</h3>
                <p className="text-sm text-gray-500">Search and select the product that is damaged</p>
            </div>

            <div className="relative mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleProductSearch(e.target.value)}
                    placeholder="Search product by name or code..."
                    className="w-full p-4 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                    autoFocus
                />
                <FaSearch className="absolute left-4 top-4 text-gray-400 text-xl"/>
                {searchLoading && (
                    <div className="absolute right-4 top-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                    </div>
                )}
            </div>

            {searchLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Searching products...</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {searchResults.map(product => (
                        <button
                            key={product.id}
                            onClick={() => handleSelectProduct(product)}
                            className="w-full text-left p-4 border-2 border-gray-100 rounded-xl hover:border-red-200 hover:bg-red-50 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200 group-hover:border-red-200"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200 group-hover:border-red-200">
                                            <FaBox className="text-gray-400 text-2xl"/>
                                        </div>
                                    )}
                                    <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                        product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                                    }`}>
                                        {product.stock}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold text-gray-800 group-hover:text-red-600">
                                            {product.name}
                                        </h4>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                                            {product.product_code}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Purchase</p>
                                            <p className="font-semibold text-green-600">৳{product.purchase_price}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Selling</p>
                                            <p className="font-semibold text-blue-600">৳{product.selling_price}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Category</p>
                                            <p className="font-semibold text-gray-700">{product.category_name || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-8 h-8 rounded-full border-2 border-gray-300 group-hover:border-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FaCheck className="text-red-500 text-sm"/>
                                </div>
                            </div>
                        </button>
                    ))}

                    {searchQuery && searchResults.length === 0 && (
                        <div className="text-center py-12">
                            <FaBox className="text-5xl text-gray-300 mx-auto mb-4"/>
                            <h4 className="text-lg font-medium text-gray-700 mb-2">No Products Found</h4>
                            <p className="text-gray-500">Try searching with a different keyword</p>
                        </div>
                    )}

                    {!searchQuery && (
                        <div className="text-center py-12">
                            <FaSearch className="text-5xl text-gray-300 mx-auto mb-4"/>
                            <h4 className="text-lg font-medium text-gray-700 mb-2">Search Products</h4>
                            <p className="text-gray-500">Type product name or code to search</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const DamageEntryStep = () => (
        <form onSubmit={handleSubmit} className="p-6">
            {/* Selected Product Banner */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl mb-6 flex items-center justify-between border border-red-100">
                <div className="flex items-center gap-4">
                    {selectedProduct?.image ? (
                        <img
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <FaBox className="text-red-500 text-2xl"/>
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800">{selectedProduct?.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm bg-white px-3 py-1 rounded-full text-gray-600">
                                Code: {selectedProduct?.product_code}
                            </span>
                            <span className={`text-sm px-3 py-1 rounded-full ${
                                selectedProduct?.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                Stock: {selectedProduct?.stock} units
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                    <FaArrowLeft/> Change
                </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">
                        1
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">Product</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200"></div>
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">
                        2
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">Damage Info</span>
                </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
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
                                        ? "border-yellow-500 bg-yellow-50 text-yellow-700 shadow-md"
                                        : "border-gray-200 hover:border-yellow-300 hover:bg-yellow-50"
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
                                        ? "border-red-500 bg-red-50 text-red-700 shadow-md"
                                        : "border-gray-200 hover:border-red-300 hover:bg-red-50"
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
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                        >
                            <option value="manual">📝 Manual Entry</option>
                            <option value="purchase">📦 Purchase Related</option>
                            <option value="sale">🛒 Sale Related</option>
                            <option value="adjustment">⚖️ Stock Adjustment</option>
                        </select>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                name="quantity"
                                min="1"
                                max={selectedProduct?.stock}
                                value={form.quantity}
                                onChange={handleChange}
                                className={`w-full p-3 pl-10 border-2 rounded-xl transition-all ${
                                    errors.quantity
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                }`}
                                placeholder="Enter quantity"
                            />
                            <FaWarehouse className="absolute left-3 top-3.5 text-gray-400"/>
                        </div>
                        {errors.quantity && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <FaInfoCircle/> {errors.quantity}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Max available: {selectedProduct?.stock || 0} units
                        </p>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Damage Reason <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            className={`w-full p-3 border-2 rounded-xl transition-all ${
                                errors.reason
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                            }`}
                        >
                            <option value="">Select Reason</option>
                            <option value="customer_return">🔄 Customer Return (Damaged)</option>
                            <option value="transit_damage">🚚 Transit/Shipping Damage</option>
                            <option value="storage_damage">🏭 Storage/Warehouse Damage</option>
                            <option value="expired">⏰ Expired Product</option>
                            <option value="defective">🔧 Manufacturing Defect</option>
                            <option value="other">❓ Other</option>
                        </select>
                        {errors.reason && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <FaInfoCircle/> {errors.reason}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Unit Cost */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unit Cost (৳) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                name="unit_cost"
                                step="0.01"
                                min="0"
                                value={form.unit_cost}
                                onChange={handleChange}
                                className={`w-full p-3 pl-10 border-2 rounded-xl transition-all ${
                                    errors.unit_cost
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                }`}
                            />
                            <FaDollarSign className="absolute left-3 top-3.5 text-gray-400"/>
                        </div>
                        {errors.unit_cost && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <FaInfoCircle/> {errors.unit_cost}
                            </p>
                        )}
                    </div>

                    {/* Supplier/Customer conditional */}
                    {form.source_type === 'purchase' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Supplier <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="supplier"
                                value={form.supplier === null ? '' : form.supplier}
                                onChange={handleChange}
                                className={`w-full p-3 border-2 rounded-xl ${
                                    errors.supplier ? "border-red-500 bg-red-50" : "border-gray-200"
                                }`}
                            >
                                <option value="">Select Supplier</option>
                                {suppliers.map(supplier => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                            {errors.supplier && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <FaInfoCircle/> {errors.supplier}
                                </p>
                            )}
                        </div>
                    )}

                    {form.source_type === 'sale' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Customer <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="customer"
                                value={form.customer === null ? '' : form.customer}
                                onChange={handleChange}
                                className={`w-full p-3 border-2 rounded-xl ${
                                    errors.customer ? "border-red-500 bg-red-50" : "border-gray-200"
                                }`}
                            >
                                <option value="">Select Customer</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                            {errors.customer && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <FaInfoCircle/> {errors.customer}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                </label>
                <textarea
                    name="notes"
                    rows="3"
                    value={form.notes}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                    placeholder="Add any additional details about the damage..."
                />
            </div>

            {/* Reference & Summary */}
            <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reference Number
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="reference_no"
                            value={form.reference_no}
                            onChange={handleChange}
                            className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl bg-gray-50"
                            readOnly
                        />
                        <FaFileInvoice className="absolute left-3 top-3.5 text-gray-400"/>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-600 mb-3">Loss Summary</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Quantity:</span>
                            <span className="font-medium">{form.quantity || 0} units</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Unit Cost:</span>
                            <span className="font-medium">৳{Number(form.unit_cost).toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="flex justify-between font-semibold">
                            <span>Total Loss:</span>
                            <span className="text-red-600">৳{totalLoss.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Compensation */}
            <div className="mt-6 bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
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
                        className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <label htmlFor="is_compensated" className="ml-3 text-sm font-medium text-gray-700">
                        Mark as Compensated (ক্ষতিপূরণ দেওয়া হয়েছে)
                    </label>
                </div>

                {showCompensation && (
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Compensated Amount
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="compensated_amount"
                                    step="0.01"
                                    min="0"
                                    max={totalLoss}
                                    value={form.compensated_amount}
                                    onChange={handleChange}
                                    className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                />
                                <FaDollarSign className="absolute left-3 top-3.5 text-gray-400"/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pending Amount
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={`৳${pendingAmount.toFixed(2)}`}
                                    className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl bg-gray-100"
                                    readOnly
                                />
                                <FaBalanceScale className="absolute left-3 top-3.5 text-gray-400"/>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Form Actions */}
            <div className="mt-8 pt-6 border-t flex justify-end gap-3">
                <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                    disabled={loading}
                >
                    <FaTimes/> Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-medium hover:from-red-700 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Creating...
                        </>
                    ) : (
                        <>
                            <FaSave/> Create Damage Entry
                        </>
                    )}
                </button>
            </div>
        </form>
    );

    // ============ MAIN RENDER ============
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden animate-slideIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-5 text-white">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                                <FaExclamationTriangle className="text-white text-3xl"/>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {step === 1 ? 'Add Damage Stock' : 'Damage Entry Form'}
                                </h2>
                                <p className="text-white text-opacity-90 mt-1">
                                    {step === 1
                                        ? 'Search and select the damaged product'
                                        : `Product: ${selectedProduct?.name || ''}`
                                    }
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white hover:text-gray-200 bg-white bg-opacity-20 rounded-lg p-2 transition-colors"
                        >
                            <FaTimes size={20}/>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
                    {step === 1 ? <ProductSearchStep/> : <DamageEntryStep/>}
                </div>
            </div>
        </div>
    );
};

export default AddDamageStockModal;