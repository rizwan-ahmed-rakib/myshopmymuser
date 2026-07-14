import React, {useEffect, useRef, useState} from "react";
import AsyncSelect from "react-select/async";
import api from "../../../context_or_provider/pos/posApi";
import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
import {posSaleProductAPI} from "../../../context_or_provider/pos/Sale/saleProduct/productSaleAPI";
import {posCustomerAPI} from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";
import BASE_URL_of_POS from "../../../posConfig";

import BaseModal from "../../components/BaseModal";
import {posCategoryAPI} from "../../../context_or_provider/pos/categories/categoryAPI";
import {posSubCategoryAPI} from "../../../context_or_provider/pos/subcategories/subCategoryApi";
import {posBrandAPI} from "../../../context_or_provider/pos/brands/brandAPI";
import {posSizeAPI} from "../../../context_or_provider/pos/sizes/sizeAPI";
import {posUnitAPI} from "../../../context_or_provider/pos/units/unitAPI";
import {Search, Sparkles, ChevronRight, Plus, Eye, UserPlus, Coins, Banknote, RefreshCcw, AlertTriangle, FolderOpen, Folder} from "lucide-react";
import SuccessModal from "../../components/SuccessModal";
import { usePrintManager } from "../../utils/usePrintManager";
import AddCustomerModal from "../CustomerList/AddCustomerModal";
import {useQuickCash} from "../../../context_or_provider/pos/QuickCash/quick_cash_provider";

const emptyItem = {
    product: null,
    product_name: "",
    unit_price: 0,
    quantity: 1,
    discount_type: "fixed", // "fixed" or "percent"
    discount_value: 0,
    discount_amount: 0,
    total_price: 0,
    unique_serial: "",
    is_unique: false,
    stock: 0,
    success_msg: "",
    error_msg: ""
};

/**
 * AddSaleModal - Split POS Invoice & Product Browser Modal (Layout "2xl" max-w-6xl)
 */
const AddSaleModal = ({isOpen, onClose, onSuccess}) => {
    /* ---------------- STATE ---------------- */
    const [customer, setCustomer] = useState(null);

    // Customer Modals & Details State
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
    const [isViewCustomerOpen, setIsViewCustomerOpen] = useState(false);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const [items, setItems] = useState([{...emptyItem}]);

    // Mobile Responsive States
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setIsMobileCartOpen(false);
        }
    }, [isOpen]);

    // Hybrid Payment States
    const [paidCash, setPaidCash] = useState(0);
    const [paidMobile, setPaidMobile] = useState(0);
    const [paidBank, setPaidBank] = useState(0);

    // Detail States
    const [mobileOperator, setMobileOperator] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [bankAccountNo, setBankAccountNo] = useState("");
    const [paymentProof, setPaymentProof] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [globalDiscountType, setGlobalDiscountType] = useState("fixed"); // "fixed" or "percent"
    const [globalDiscountValue, setGlobalDiscountValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Quick Cash states
    const {quickCashList, addQuickCashOption} = useQuickCash();
    const [givenCash, setGivenCash] = useState(0);
    const [isAddQuickCashOpen, setIsAddQuickCashOpen] = useState(false);
    const [quickCashAmount, setQuickCashAmount] = useState('');
    const [quickCashName, setQuickCashName] = useState('');
    const [quickCashLoading, setQuickCashLoading] = useState(false);

    // Product Browser States
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [units, setUnits] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState("All");
    const [selectedSize, setSelectedSize] = useState("All");
    const [selectedUnit, setSelectedUnit] = useState("All");

    const hasActiveFilters =
        selectedCategory !== "All" ||
        selectedSubCategory !== null ||
        selectedBrand !== "All" ||
        selectedSize !== "All" ||
        selectedUnit !== "All" ||
        searchTerm !== "";

    const handleClearFilters = () => {
        setSelectedCategory("All");
        setSelectedSubCategory(null);
        setSelectedBrand("All");
        setSelectedSize("All");
        setSelectedUnit("All");
        setSearchTerm("");
    };

    // Success & Print States
    const [showSuccess, setShowSuccess] = useState(false);
    const [successData, setSuccessData] = useState(null);
    // Key to force AsyncSelect remount after each sale (clears cacheOptions stale data)
    const [customerSelectKey, setCustomerSelectKey] = useState(0);
    const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(window.innerWidth >= 1024);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const barcodeRef = useRef(null);

    // Auto update payment method based on inputs
    useEffect(() => {
        const counts = [paidCash > 0, paidMobile > 0, paidBank > 0].filter(Boolean).length;
        if (counts > 1) {
            setPaymentMethod("hybrid");
        } else if (paidMobile > 0) {
            setPaymentMethod("mobile_banking");
        } else if (paidBank > 0) {
            setPaymentMethod("bank");
        } else {
            setPaymentMethod("cash");
        }
    }, [paidCash, paidMobile, paidBank]);

    // Focus barcode ref
    useEffect(() => {
        if (isOpen && barcodeRef.current) {
            barcodeRef.current.focus();
        }
    }, [isOpen]);

    // Fetch Walk-in Customer dynamically on modal open/reset
    const fetchAndSetWalkInCustomer = async () => {
        try {
            const res = await posCustomerAPI.search("");
            const walkIn = res.data.find(c => c.is_walk_in === true || c.is_walk_in === "true");
            if (walkIn) {
                setCustomer({
                    value: walkIn.id,
                    label: `${walkIn.name} ${walkIn.phone ? `(${walkIn.phone})` : ''}`,
                    due_amount: Number(walkIn.due_amount || 0),
                    is_walk_in: true
                });
            }
        } catch (err) {
            console.error("Error fetching default walk-in customer:", err);
        }
    };

    // Initial Fetch when Modal opens
    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const productRes = await posProductAPI.search("");
                    if (productRes?.data) {
                        setAllProducts(productRes.data);
                        setFilteredProducts(productRes.data);
                    }
                    await fetchAndSetWalkInCustomer(); // ডিফল্ট Walk-in কাস্টমার সেট

                    const categoryRes = await posCategoryAPI.getAll();
                    if (categoryRes?.data) setCategories(categoryRes.data);

                    const subCategoryRes = await posSubCategoryAPI.getAll();
                    if (subCategoryRes?.data) setSubCategories(subCategoryRes.data);

                    const brandRes = await posBrandAPI.getAll();
                    if (brandRes?.data) setBrands(brandRes.data);

                    const sizeRes = await posSizeAPI.getAll();
                    if (sizeRes?.data) setSizes(sizeRes.data);

                    const unitRes = await posUnitAPI.getAll();
                    if (unitRes?.data) setUnits(unitRes.data);
                } catch (err) {
                    console.error("Error loading modal database:", err);
                }
            };
            fetchData();
        }
    }, [isOpen, customerSelectKey]);

    // Filter products locally
    useEffect(() => {
        let result = allProducts;

        if (searchTerm) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.product_code && p.product_code.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (selectedSubCategory) {
            result = result.filter(p => p.sub_category == selectedSubCategory || p.sub_category_id == selectedSubCategory || p.subcategory == selectedSubCategory || p.subcategory_id == selectedSubCategory);
        } else if (selectedCategory !== "All") {
            result = result.filter(p => p.category === selectedCategory || p.category_id === selectedCategory);
        }

        if (selectedBrand !== "All") {
            result = result.filter(p => p.brand == selectedBrand || p.brand_id == selectedBrand);
        }

        if (selectedSize !== "All") {
            result = result.filter(p => String(p.size) === String(selectedSize) || String(p.size_id) === String(selectedSize) || String(p.size_name) === String(selectedSize));
        }

        if (selectedUnit !== "All") {
            result = result.filter(p => String(p.unit) === String(selectedUnit) || String(p.unit_id) === String(selectedUnit) || String(p.unit_name) === String(selectedUnit));
        }

        setFilteredProducts(result);
    }, [searchTerm, selectedCategory, selectedSubCategory, selectedBrand, selectedSize, selectedUnit, allProducts]);

    /* ---------------- CUSTOMER SEARCH ---------------- */
    const loadCustomerOptions = async (inputValue) => {
        const res = await posCustomerAPI.search(inputValue || "");
        return res.data.map(s => ({
            value: s.id,
            label: `${s.name} ${s.phone ? `(${s.phone})` : ''}`,
            due_amount: Number(s.due_amount || 0),
            is_walk_in: s.is_walk_in // ড্রপডাউনে এই ফ্ল্যাগটি রিসিভ করা হলো
        }));
    };

    const handleViewCustomerDetails = async (id) => {
        if (!id) return;
        try {
            setLoadingDetails(true);
            setIsViewCustomerOpen(true);
            const res = await posCustomerAPI.getById(id);
            setCustomerDetails(res.data);
        } catch (err) {
            console.error("Failed to load customer details:", err);
            alert("Could not load customer details");
            setIsViewCustomerOpen(false);
            if (isMobile) setIsMobileCartOpen(true);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleCustomerAdded = (newCustomer) => {
        const formattedCustomer = {
            value: newCustomer.id,
            label: `${newCustomer.name} ${newCustomer.phone ? `(${newCustomer.phone})` : ''}`,
            due_amount: Number(newCustomer.due_amount || 0),
            is_walk_in: newCustomer.is_walk_in
        };
        setCustomer(formattedCustomer);
        setIsAddCustomerOpen(false);
    };

    /* ---------------- PRODUCT SEARCH ---------------- */
    const loadProductOptions = async (inputValue) => {
        if (!inputValue) return [];
        const res = await posProductAPI.search(inputValue);
        return res.data.map(p => ({
            value: p.id,
            label: `${p.name} (${p.product_code})`,
            unit_price: Number(p.sale_price || p.selling_price),
            product_name: p.name,
            stock: p.stock
        }));
    };

    const isProductDuplicate = (productId, currentIndex) => {
        return items.some((item, index) => index !== currentIndex && item.product === productId);
    };

    const isSerialDuplicate = (serial, currentIndex) => {
        return items.some((item, index) => index !== currentIndex && item.unique_serial === serial);
    };

    const calculateItemTotal = (item) => {
        const baseTotal = item.unit_price * item.quantity;
        let discount = 0;
        if (item.discount_type === "percent") {
            discount = (baseTotal * item.discount_value) / 100;
        } else {
            discount = item.discount_value;
        }
        return {
            total_price: Math.max(0, baseTotal - discount),
            discount_amount: discount
        };
    };

    const updateItem = (index, updates) => {
        setItems(prev => {
            const updated = [...prev];
            const newItem = {...updated[index], ...updates};
            const {total_price, discount_amount} = calculateItemTotal(newItem);
            updated[index] = {...newItem, total_price, discount_amount};
            return updated;
        });
    };

    const selectProduct = (option, index) => {
        if (isProductDuplicate(option.value, index)) {
            updateItem(index, {error_msg: "Product already added!"});
            return;
        }
        updateItem(index, {
            product: option.value,
            product_name: option.product_name,
            unit_price: option.unit_price,
            quantity: 1,
            stock: option.stock,
            is_unique: false,
            isScanned: false, // <--- এই লাইনটি যোগ করুন (প্রাইস এডিট করার সুযোগ দিতে)
            unique_serial: "",
            error_msg: "",
            success_msg: ""
        });
    };

    const handleAddProductToCart = (product) => {
        if (Number(product.stock) <= 0) {
            alert(`${product.name} is out of stock!`);
            return;
        }

        let currentItems = [...items];
        const isEmptyFirstRow = currentItems.length === 1 && currentItems[0].product === null && !currentItems[0].unique_serial;

        const existingIndex = currentItems.findIndex(item => item.product === product.id && !item.is_unique);

        if (existingIndex > -1) {
            const currentQty = currentItems[existingIndex].quantity;
            if (currentQty >= product.stock) {
                alert(`Cannot exceed available stock (${product.stock})`);
                return;
            }
            const updatedItem = {...currentItems[existingIndex], quantity: currentQty + 1};
            const {total_price, discount_amount} = calculateItemTotal(updatedItem);
            currentItems[existingIndex] = {...updatedItem, total_price, discount_amount};
            setItems(currentItems);
        } else {
            const newItem = {
                product: product.id,
                product_name: product.name,
                unit_price: Number(product.selling_price || product.sale_price || 0),
                quantity: 1,
                discount_type: "fixed",
                discount_value: 0,
                discount_amount: 0,
                total_price: Number(product.selling_price || product.sale_price || 0),
                unique_serial: "",
                is_unique: false,
                stock: product.stock,
                success_msg: "",
                error_msg: ""
            };

            if (isEmptyFirstRow) {
                setItems([newItem]);
            } else {
                setItems([...items, newItem]);
            }
        }
    };

    /* ---------------- SERIAL VERIFY ---------------- */
    const handleSerialVerify = async (serial, index) => {
        if (!serial || serial.length < 3) return;
        if (isSerialDuplicate(serial, index)) {
            updateItem(index, {error_msg: "Already scanned!"});
            return;
        }
        try {
            const response = await fetch(`${BASE_URL_of_POS}/api/bar-qr/verify/verify/?serial=${serial}`);
            const data = await response.json();
            if (data.valid && data.status_code === 'in_stock') {
                updateItem(index, {
                    product: data.product_id,
                    product_name: data.product.name,
                    unit_price: Number(data.product.sale_price || data.product.selling_price),
                    quantity: 1,
                    unique_serial: serial,
                    is_unique: true,
                    isScanned: true, // <--- এই লাইনটি যোগ করুন (প্রাইস লক করার জন্য)
                    stock: data.product.stock,
                    success_msg: "Valid",
                    error_msg: ""
                });
            } else {
                updateItem(index, {
                    is_unique: false,
                    error_msg: !data.valid ? "Invalid" : "Not in stock",
                    success_msg: ""
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateQty = (index, qty) => {
        const item = items[index];
        if (item.is_unique) return;
        const maxStock = item.stock || 0;
        let finalQty = qty;
        let error_msg = "";
        if (qty > maxStock) {
            finalQty = maxStock;
            error_msg = `Only ${maxStock} in stock!`;
        } else if (qty < 1) {
            finalQty = 1;
        }
        updateItem(index, {quantity: finalQty, error_msg});
    };

    const addRow = () => setItems([...items, {...emptyItem}]);
    const removeRow = (index) => {
        if (items.length === 1) setItems([{...emptyItem}]);
        else setItems(items.filter((_, i) => i !== index));
    };

    /* ---------------- CALCULATIONS ---------------- */
    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
    const globalDiscountAmount = globalDiscountType === "percent"
        ? (subtotal * globalDiscountValue) / 100
        : globalDiscountValue;

    const netTotal = Math.max(0, subtotal - globalDiscountAmount);
    const totalPaid = Number(paidCash) + Number(paidMobile) + Number(paidBank);
    const currentInvoiceDue = Number((netTotal - totalPaid).toFixed(2));
    const previousDue = customer?.due_amount || 0;
    const totalCustomerDue = previousDue + currentInvoiceDue;

    const remainingBalance = Math.max(0, netTotal - paidMobile - paidBank);

    // Walk-in কাস্টমার চেক করার শর্টকাট ভেরিয়েবল
    const isWalkInActive = customer?.is_walk_in === true || customer?.is_walk_in === "true";
    // ডিউ থাকলে এবং Walk-in হলে লক কন্ডিশন
    const isDueBlockActive = isWalkInActive && currentInvoiceDue > 0;

    useEffect(() => {
        if (givenCash > 0) {
            setPaidCash(Math.min(givenCash, remainingBalance));
        } else {
            setPaidCash(0);
        }
    }, [givenCash, remainingBalance]);

    /* ---------------- QUICK CASH HANDLER ---------------- */
    const handleAddQuickCash = async (e) => {
        e.preventDefault();
        if (!quickCashAmount || Number(quickCashAmount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        try {
            setQuickCashLoading(true);
            const formData = new FormData();
            formData.append("amount", quickCashAmount);
            formData.append("name", quickCashName || `${quickCashAmount} Taka`);
            await addQuickCashOption(formData);
            setQuickCashAmount('');
            setQuickCashName('');
            setIsAddQuickCashOpen(false);
        } catch (error) {
            alert("Failed to add quick cash option.");
        } finally {
            setQuickCashLoading(false);
        }
    };

    const { handlePrintInvoice, printFormat, setPrintFormat } = usePrintManager();
    const handlePrint = (invoice) => handlePrintInvoice(invoice);

    /* ---------------- SUBMIT ---------------- */
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!customer) return alert("Please select a customer");

        // Walk-in customer-এর ক্ষেত্রে due রাখা যাবে না
        if (isDueBlockActive) {
            alert("Walk-in customer-এর ক্ষেত্রে কোনো ডিউ রাখা যাবে না! পুরো টাকা পরিশোধ করুন।");
            return;
        }

        const validItems = items.filter(i => i.product);
        if (validItems.length === 0) return alert("Please add products");

        const itemsPayload = validItems.map(item => ({
            product: item.product,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.unit_price * item.quantity,
            discount_amount: item.discount_amount,
            net_total: item.total_price,
            serials: item.unique_serial ? [item.unique_serial] : []
        }));

        const itemwise_total_discount = validItems.reduce((sum, i) => sum + i.discount_amount, 0);

        const payload = {
            customer: customer.value,
            paid_cash: paidCash,
            paid_mobile: paidMobile,
            paid_bank: paidBank,
            payment_method: paymentMethod,
            subtotal: subtotal,
            itemwise_total_discount: itemwise_total_discount,
            global_discount: globalDiscountAmount,
            total_discount: itemwise_total_discount + globalDiscountAmount,
            net_total: netTotal,
            items: itemsPayload,
            mobile_operator: paidMobile > 0 ? mobileOperator : "",
            transaction_id: paidMobile > 0 ? transactionId : "",
            bank_account_no: paidBank > 0 ? bankAccountNo : "",
        };

        try {
            setLoading(true);
            let res;

            if (paymentProof) {
                const formData = new FormData();
                Object.keys(payload).forEach(key => {
                    if (key === 'items') {
                        formData.append(key, JSON.stringify(payload[key]));
                    } else if (payload[key] !== null && payload[key] !== undefined) {
                        formData.append(key, payload[key]);
                    }
                });
                formData.append("payment_proof", paymentProof);
                res = await api.post("/api/sale/sales/", formData, {
                    headers: {
                        "Content-Type": undefined,
                    },
                });
            } else {
                res = await posSaleProductAPI.create(payload);
            }

            setSuccessData(res.data);
            setShowSuccess(true);
            setIsPaymentModalOpen(false);
            setIsMobileCartOpen(false);
            setItems([{...emptyItem}]);
            setPaidCash(0);
            setGivenCash(0);
            setPaidMobile(0);
            setPaidBank(0);
            setMobileOperator("");
            setTransactionId("");
            setBankAccountNo("");
            setPaymentProof(null);
            setGlobalDiscountValue(0);

            // সেল শেষ হওয়ার পর আবার ডিফল্ট Walk-in সিলেক্ট করবে
            setCustomerSelectKey(k => k + 1);
        } catch (err) {
            console.error("Sale Submit Error Detail:", err.response?.data);
            alert(err.response?.data?.error || "Failed to save sale");
        } finally {
            setLoading(false);
        }
    };

    const renderRightPanel = (isMobileView = false) => {
        return (
            <div className={`flex flex-col h-full overflow-hidden space-y-2 ${isMobileView ? "p-1" : ""}`}>
                {/* Customer Info Head Banner */}
                <div
                    className="bg-blue-50/70 p-1.5 rounded-lg border border-blue-100 flex justify-between items-center gap-2 shrink-0 shadow-inner">
                    <div className="flex-1 flex items-center gap-1.5">
                        <div className="flex-1">
                            <label
                                className="block text-[8px] font-black uppercase text-blue-900 tracking-wider mb-0.5">
                                Customer CRM * {isWalkInActive && <span className="text-[7.5px] ml-1 bg-blue-600 text-white px-1 py-0.5 rounded font-black">🚶 Walk-In</span>}
                            </label>
                            <AsyncSelect
                                key={customerSelectKey}
                                cacheOptions defaultOptions
                                loadOptions={loadCustomerOptions}
                                value={customer}
                                onChange={setCustomer}
                                placeholder="Select customer..."
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: base => ({...base, zIndex: 9999}),
                                    control: base => ({...base, minHeight: '28px', height: '28px'}),
                                    valueContainer: base => ({...base, height: '28px', padding: '0 6px'}),
                                    input: base => ({...base, margin: '0px'}),
                                    indicatorsContainer: base => ({...base, height: '28px'}),
                                }}
                                className="text-[11px] font-medium"
                            />
                        </div>
                        <div className="flex gap-1 shrink-0 items-center">
                            {customer && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleViewCustomerDetails(customer.value);
                                        if (isMobile) setIsMobileCartOpen(false);
                                    }}
                                    className="p-1 bg-blue-100 hover:bg-blue-200 text-blue-650 rounded-md transition-all duration-200 shadow-sm"
                                    title="View Customer Details"
                                >
                                    <Eye size={12}/>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAddCustomerOpen(true);
                                    if (isMobile) setIsMobileCartOpen(false);
                                }}
                                className="p-1 bg-green-105 hover:bg-green-200 text-green-605 rounded-md border border-green-200 transition-all duration-200 shadow-sm"
                                  title="Add New Customer"
                            >
                                <UserPlus size={12}/>
                            </button>
                        </div>
                    </div>

                    {customer && !isWalkInActive && (
                        <div
                            className="bg-white px-2 py-0.5 rounded border border-blue-200 shadow-sm text-right leading-none min-w-[70px]">
                            <p className="text-[7.5px] text-gray-400 font-bold uppercase leading-none">CRM Bal</p>
                            <p className="text-[10px] font-black text-red-655 font-mono leading-none">৳{previousDue.toFixed(0)}</p>
                        </div>
                    )}
                </div>

                {/* Cart Mapping Grid */}
                <div
                    className="flex-1 overflow-auto p-1.5 border border-gray-150 rounded-xl bg-gray-55/30 scrollbar-thin">
                    <div className="flex justify-between items-center mb-1.5 px-1 shrink-0">
                        <h3 className="text-xs font-black uppercase text-gray-700 tracking-wider flex items-center gap-1">🛒
                            Cart Items ({items.length})</h3>
                        <button
                            type="button"
                            onClick={addRow}
                            className="text-[9px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-650 hover:text-white border border-blue-200 px-2 py-1 rounded-lg transition-all flex items-center gap-0.5"
                        >
                            <Plus size={10}/> Add Row
                        </button>
                    </div>

                    <table className="min-w-[340px] w-full text-left border-collapse text-xs">
                        <thead>
                        <tr className="border-b border-gray-255 text-gray-455 text-[9px] uppercase font-bold tracking-wider bg-gray-50/70 sticky top-0 z-10">
                            <th className="py-1.5 px-1 w-[4%] min-w-[12px] text-center bg-gray-100/90">#</th>
                            <th className="py-1.5 px-1 w-[14%] min-w-[50px] bg-gray-100/90">Serial</th>
                            <th className="py-1.5 px-1 w-[25%] min-w-[75px] bg-gray-100/90">Item</th>
                            <th className="py-1.5 px-1 w-[11%] min-w-[40px] text-right bg-gray-100/90">Price</th>
                            <th className="py-1.5 px-1 w-[11%] min-w-[40px] text-center bg-gray-100/90">Qty</th>
                            <th className="py-1.5 px-1 w-[20%] min-w-[75px] text-center bg-gray-100/90">Discount</th>
                            <th className="py-1.5 px-1 w-[11%] min-w-[40px] text-right bg-gray-100/90">Total</th>
                            <th className="py-1.5 px-0.5 w-[4%] min-w-[13px] text-center bg-gray-100/90"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                        {items.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-55/40 transition-colors text-xs">
                                <td className="py-1 px-1 text-gray-400 font-bold text-center w-[4%] min-w-[12px]">{index + 1}</td>

                                {/* Barcode Verify Scan */}
                                <td className="py-1 px-1 w-[14%] min-w-[50px]">
                                    <input
                                        ref={index === 0 ? barcodeRef : null}
                                        type="text" placeholder="Scan..."
                                        className={`w-full border p-0.5 rounded font-mono text-[9px] sm:text-[10px] outline-none transition-all ${item.error_msg ? 'border-red-400 bg-red-55 text-red-750 font-bold' : 'border-gray-300 focus:border-blue-500'}`}
                                        value={item.unique_serial}
                                        onChange={(e) => {
                                            updateItem(index, {unique_serial: e.target.value});
                                            if (e.target.value.length >= 3) handleSerialVerify(e.target.value, index);
                                        }}
                                    />
                                    {item.error_msg &&
                                        <p className="text-red-500 text-[8px] font-bold mt-0.5 leading-none">{item.error_msg}</p>}
                                    {item.success_msg &&
                                        <p className="text-green-600 text-[8px] font-bold mt-0.5 leading-none">{item.success_msg}</p>}
                                </td>

                                {/* Product Dropdown Selector */}
                                <td className="py-1 px-1 w-[25%] min-w-[75px]">
                                    <AsyncSelect
                                        loadOptions={loadProductOptions} defaultOptions={false}
                                        onChange={(opt) => selectProduct(opt, index)}
                                        value={item.product ? {
                                            value: item.product,
                                            label: item.product_name
                                        } : null}
                                        placeholder="Find..."
                                        isDisabled={item.is_unique}
                                        menuPortalTarget={document.body}
                                        styles={{
                                            menuPortal: base => ({...base, zIndex: 9999}),
                                            control: base => ({...base, minHeight: '24px', height: '24px'}),
                                            valueContainer: base => ({...base, height: '24px', padding: '0 4px'}),
                                            input: base => ({...base, margin: '0px'}),
                                            indicatorsContainer: base => ({...base, height: '24px'}),
                                        }}
                                        className="text-[9px] sm:text-[10px]"
                                    />
                                    {item.product && !item.is_unique && <span
                                        className="text-[8px] font-bold text-blue-500 mt-0.5 block leading-none">Stock: {item.stock}</span>}
                                </td>

                                {/* Unit Price */}
                                <td className="py-1 px-1 w-[11%] min-w-[40px]">
                                    <input
                                        type="number"
                                        value={item.unit_price || 0}
                                        onChange={(e) => updateItem(index, {unit_price: Number(e.target.value)})}
                                        readOnly={item.isScanned}
                                        className={`w-full border p-0.5 rounded text-right font-mono text-[9px] sm:text-[10px] ${
                                            item.isScanned ? "bg-gray-100 cursor-not-allowed text-gray-550" : "bg-white text-gray-805 focus:border-blue-500 outline-none"
                                        }`}
                                    />
                                </td>

                                {/* Editable Quantity (Stepper mode) */}
                                <td className="py-1 px-1 w-[11%] min-w-[40px]">
                                    {item.is_unique ? (
                                        <div className="text-center">
                                             <span
                                                 className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1 py-0.5 rounded border border-amber-200">Unique</span>
                                        </div>
                                    ) : (
                                        <div
                                            className="flex items-center justify-center bg-gray-50 border border-gray-300 rounded-lg overflow-hidden h-6 sm:h-7 inline-flex">
                                            <button type="button"
                                                    onClick={() => updateQty(index, item.quantity - 1)}
                                                    className="w-3.5 sm:w-4.5 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 font-bold text-xs">-
                                            </button>
                                            <span
                                                className="w-4 sm:w-5 text-center text-[9px] sm:text-xs font-bold font-mono">{item.quantity}</span>
                                            <button type="button"
                                                    onClick={() => updateQty(index, item.quantity + 1)}
                                                    className="w-3.5 sm:w-4.5 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 font-bold text-xs">+</button>
                                        </div>
                                    )}
                                </td>

                                {/* Item Wise Discount */}
                                <td className="py-1 px-1 w-[20%] min-w-[75px]">
                                    <div
                                        className="flex items-center border border-gray-300 rounded overflow-hidden bg-white h-6 sm:h-7">
                                        <select
                                            className="bg-gray-55 text-[8.5px] sm:text-[9.5px] p-0.5 border-r border-gray-300 outline-none cursor-pointer font-extrabold shrink-0 appearance-none text-center w-5 sm:w-6"
                                            value={item.discount_type}
                                            onChange={(e) => updateItem(index, {discount_type: e.target.value})}>
                                            <option value="fixed">Fixed</option>
                                            <option value="percent">% Ratio</option>
                                        </select>
                                        <input type="number"
                                               className="w-full min-w-0 bg-transparent p-0.5 px-1 text-[9px] sm:text-[10px] font-extrabold text-center text-gray-850 outline-none font-mono"
                                               placeholder="0" value={item.discount_value || ""}
                                               onChange={(e) => updateItem(index, {discount_value: Number(e.target.value)})}/>
                                    </div>
                                </td>

                                {/* Total Accumulator Price */}
                                <td className="py-1 px-1 text-right w-[11%] min-w-[40px]">
                                     <span
                                         className="font-bold font-mono text-blue-700 text-[10px] sm:text-[11px] block">৳{item.total_price.toFixed(0)}</span>
                                    {item.discount_amount > 0 &&
                                        <span
                                            className="text-[8px] text-green-600 font-bold block leading-none mt-0.5">Saved: ৳{item.discount_amount.toFixed(0)}</span>}
                                </td>

                                {/* Remove Action */}
                                <td className="py-1 px-0.5 text-center w-[4%] min-w-[13px]">
                                    <button type="button" onClick={() => removeRow(index)}
                                            className="text-gray-400 hover:text-red-500 font-bold text-sm sm:text-base p-0.5">×
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Overall invoice discount and subtotal details in one compact block */}
                <div className="bg-gray-100 p-2 rounded-xl border border-gray-200 shrink-0 space-y-1.5 mt-auto">
                    <div className="flex gap-2 items-center">
                        <label className="text-[8px] font-black uppercase text-green-700 tracking-wider">Overall Discount</label>
                        <div className="flex gap-1 items-center flex-1">
                            <select className="border p-0.5 rounded bg-white outline-none text-[9px] h-6"
                                    value={globalDiscountType}
                                    onChange={(e) => setGlobalDiscountType(e.target.value)}>
                                <option value="fixed">Fixed (৳)</option>
                                <option value="percent">% Ratio</option>
                            </select>
                            <input type="number"
                                   className="w-full border p-0.5 rounded outline-none font-mono font-bold text-xs bg-white focus:border-green-500 h-6"
                                   placeholder="0.00" value={globalDiscountValue || ""}
                                   onChange={(e) => setGlobalDiscountValue(Number(e.target.value))}/>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold border-t border-gray-200 pt-1">
                        <span>Items Subtotal: <span className="font-mono text-gray-800 font-black">৳{subtotal.toFixed(0)}</span></span>
                        {globalDiscountAmount > 0 && (
                            <span className="text-green-600">Discount: <span className="font-mono font-black">- ৳{globalDiscountAmount.toFixed(0)}</span></span>
                        )}
                        <div className="text-gray-900 font-black text-xs">
                            Net Payable: <span className="font-mono text-blue-700 text-sm">৳{netTotal.toFixed(0)}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-1 border-t border-gray-200">
                        <button type="button"
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to clear the cart?")) {
                                        setItems([{...emptyItem}]);
                                        setPaidCash(0);
                                        setGivenCash(0);
                                        setPaidMobile(0);
                                        setPaidBank(0);
                                        setGlobalDiscountValue(0);
                                        setCustomerSelectKey(k => k + 1);
                                    }
                                }}
                                className="w-1/3 py-1 border border-gray-400 rounded-lg text-gray-500 hover:bg-gray-100 font-bold text-[9px] uppercase tracking-wider transition-all text-center">
                            Clear Cart
                        </button>
                        <button type="button"
                                onClick={() => {
                                    if (!customer) return alert("Please select a customer");
                                    const validItems = items.filter(i => i.product);
                                    if (validItems.length === 0) return alert("Please add products");
                                    setIsPaymentModalOpen(true);
                                    if (isMobile) setIsMobileCartOpen(false);
                                }}
                                className="flex-1 py-1 font-black rounded-lg text-[10px] uppercase tracking-wider text-white shadow-lg bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 transition-all active:scale-98 text-center">
                            Make Payment
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                title="Create Sale Invoice"
                size="3xl"
                isLoading={loading}
                showFooter={false}
            >
                <form onSubmit={handleSubmit}
                      className="flex flex-col lg:flex-row gap-4 lg:h-[78vh] h-[72vh] overflow-hidden text-gray-800">

                    {/* LEFT PANEL: Category & Subcategory Product List Filter (65% width) */}
                    <div
                        className="w-full lg:w-[65%] flex flex-col h-full bg-gray-50 p-2.5 rounded-2xl border border-gray-200 overflow-hidden transition-all duration-350">
                        {/* Search and Toggle Sidebar Field */}
                        <div className="flex gap-2 mb-3 shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsCategorySidebarOpen(!isCategorySidebarOpen)}
                                className="p-1.5 bg-white hover:bg-gray-100 text-gray-655 rounded-xl border border-gray-300 transition-all duration-205 flex items-center justify-center shadow-sm"
                                title={isCategorySidebarOpen ? "Collapse Categories" : "Expand Categories"}
                            >
                                {isCategorySidebarOpen ? <FolderOpen size={14} /> : <Folder size={14} />}
                            </button>
                            <div className="relative flex-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <Search size={14}/>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search code or title..."
                                    className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-gray-300 rounded-xl focus:border-blue-500 outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Dropdown Filters Grid */}
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2 shrink-0">
                            <div>
                                <label
                                    className="block text-[8px] font-black uppercase text-gray-505 tracking-wider mb-0.5 pl-0.5">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        setSelectedSubCategory(null);
                                    }}
                                    className="w-full px-2 py-1 bg-white border border-gray-300 rounded-lg text-[10px] font-bold text-gray-700 outline-none focus:border-blue-500 transition-colors cursor-pointer"
                                >
                                    <option value="All">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    className="block text-[8px] font-black uppercase text-gray-550 tracking-wider mb-0.5 pl-0.5">Subcategory</label>
                                <select
                                    value={selectedSubCategory || "All"}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSelectedSubCategory(val === "All" ? null : val);
                                    }}
                                    className="w-full px-2 py-1 bg-white border border-gray-300 rounded-lg text-[10px] font-bold text-gray-700 outline-none focus:border-blue-500 transition-colors cursor-pointer"
                                >
                                    <option value="All">All Subcategories</option>
                                    {(selectedCategory === "All"
                                            ? subCategories
                                            : subCategories.filter(sub => sub.category == selectedCategory || sub.category_id == selectedCategory)
                                    ).map((sub) => (
                                        <option key={sub.id} value={sub.id}>{sub.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    className="block text-[8px] font-black uppercase text-gray-550 tracking-wider mb-0.5 pl-0.5">Brand</label>
                                <select
                                    value={selectedBrand}
                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                    className="w-full px-2 py-1 bg-white border border-gray-300 rounded-lg text-[10px] font-bold text-gray-700 outline-none focus:border-blue-500 transition-colors cursor-pointer"
                                >
                                    <option value="All">All Brands</option>
                                    {brands.map((br) => (
                                        <option key={br.id} value={br.id}>{br.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    className="block text-[8px] font-black uppercase text-gray-550 tracking-wider mb-0.5 pl-0.5">Size</label>
                                <select
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                    className="w-full px-2 py-1 bg-white border border-gray-300 rounded-lg text-[10px] font-bold text-gray-700 outline-none focus:border-blue-500 transition-colors cursor-pointer"
                                >
                                    <option value="All">All Sizes</option>
                                    {sizes.map((sz) => (
                                        <option key={sz.id} value={sz.id}>{sz.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    className="block text-[8px] font-black uppercase text-gray-550 tracking-wider mb-0.5 pl-0.5">Unit</label>
                                <select
                                    value={selectedUnit}
                                    onChange={(e) => setSelectedUnit(e.target.value)}
                                    className="w-full px-2 py-1 bg-white border border-gray-300 rounded-lg text-[10px] font-bold text-gray-700 outline-none focus:border-blue-500 transition-colors cursor-pointer"
                                >
                                    <option value="All">All Units</option>
                                    {units.map((ut) => (
                                        <option key={ut.id} value={ut.id}>{ut.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    className="block text-[8px] font-black uppercase text-transparent select-none mb-0.5 pl-0.5">Action</label>
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    disabled={!hasActiveFilters}
                                    className={`w-full text-[9px] font-extrabold px-2 py-1 rounded-lg transition-all duration-200 border flex items-center justify-center gap-1 ${
                                        hasActiveFilters
                                            ? "text-red-500 bg-red-50 hover:bg-red-100 border-red-200 cursor-pointer shadow-sm active:scale-95"
                                             : "text-gray-300 bg-gray-50 border-gray-200 cursor-not-allowed"
                                    }`}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap gap-1 mb-2 px-1 shrink-0">
                                {selectedCategory !== "All" && (
                                    <span
                                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-blue-200">
                                        <span>Cat: {categories.find(c => c.id == selectedCategory)?.title || selectedCategory}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedCategory("All");
                                                setSelectedSubCategory(null);
                                            }}
                                            className="text-blue-500 hover:text-blue-900 font-bold focus:outline-none"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {selectedSubCategory && (
                                    <span
                                        className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-indigo-200">
                                        <span>Sub: {subCategories.find(s => s.id == selectedSubCategory)?.title || selectedSubCategory}</span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedSubCategory(null)}
                                            className="text-indigo-500 hover:text-indigo-900 font-bold focus:outline-none"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {selectedBrand !== "All" && (
                                    <span
                                        className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-amber-200">
                                        <span>Brand: {brands.find(b => b.id == selectedBrand)?.title || selectedBrand}</span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedBrand("All")}
                                            className="text-amber-500 hover:text-amber-900 font-bold focus:outline-none"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {selectedSize !== "All" && (
                                    <span
                                        className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-200">
                                        <span>Size: {sizes.find(s => s.id == selectedSize)?.title || selectedSize}</span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedSize("All")}
                                            className="text-emerald-500 hover:text-emerald-900 font-bold focus:outline-none"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {selectedUnit !== "All" && (
                                    <span
                                        className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-purple-200">
                                        <span>Unit: {units.find(u => u.id == selectedUnit)?.title || selectedUnit}</span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedUnit("All")}
                                            className="text-purple-500 hover:text-purple-900 font-bold focus:outline-none"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {searchTerm && (
                                    <span
                                        className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-gray-300">
                                        <span>Search: "{searchTerm}"</span>
                                        <button
                                            type="button"
                                            onClick={() => setSearchTerm("")}
                                            className="text-gray-500 hover:text-gray-900 font-bold focus:outline-none"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Filtering Status Line */}
                        <div
                            className="flex justify-between items-center px-1 pb-1.5 mb-1.5 border-b border-gray-200 text-[10px] text-gray-550 font-bold tracking-wide shrink-0">
                            <span>
                                Showing {filteredProducts.length} of {allProducts.length} products
                            </span>
                        </div>

                        {/* Categories sidebar list & product catalog list grid */}
                        <div className="flex flex-1 overflow-hidden gap-2">
                            {/* Categories List */}
                            <div
                                className={`overflow-y-auto text-[10px] scrollbar-thin transition-all duration-300 ${
                                    isCategorySidebarOpen 
                                        ? "w-[25%] border-r border-gray-200 pr-1" 
                                        : "w-0 overflow-hidden border-none opacity-0"
                                }`}
                            >
                                <h4 className="font-extrabold text-gray-400 uppercase text-[8px] tracking-wider mb-2 flex items-center gap-1">
                                    <Sparkles size={9} className="text-blue-500"/> Categories
                                </h4>
                                <div className="space-y-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedCategory("All");
                                            setSelectedSubCategory(null);
                                        }}
                                        className={`w-full text-left px-2 py-1 rounded font-bold transition-all ${
                                            selectedCategory === "All" ? "bg-blue-50 text-blue-600 border border-blue-100/50" : "text-gray-600 hover:bg-gray-100 border border-transparent"
                                        }`}
                                    >
                                        📦 All Items
                                    </button>
                                    {categories.map((cat) => {
                                        const isCatSelected = selectedCategory == cat.id;
                                        const currentSubs = subCategories.filter(sub => sub.category == cat.id);
                                        return (
                                            <div key={cat.id} className="space-y-0.5">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (selectedCategory == cat.id) {
                                                            setSelectedCategory("All");
                                                        } else {
                                                            setSelectedCategory(cat.id);
                                                        }
                                                        setSelectedSubCategory(null);
                                                    }}
                                                    className={`w-full flex justify-between items-center text-left px-2 py-1.5 rounded font-bold transition-all ${
                                                        isCatSelected && !selectedSubCategory ? "bg-blue-600 text-white shadow-sm font-extrabold" : isCatSelected ? "text-blue-600 bg-blue-50/50 font-bold" : "text-gray-700 hover:bg-gray-100"
                                                    }`}
                                                >
                                                    <span className="truncate">{cat.title}</span>
                                                    {currentSubs.length > 0 && <ChevronRight size={10}
                                                                                             className={`transform transition-transform shrink-0 ${isCatSelected ? 'rotate-90 text-blue-500' : 'text-gray-400'}`}/>}
                                                </button>
                                                {currentSubs.length > 0 && isCatSelected && (
                                                    <div
                                                        className="pl-2 border-l border-gray-200 ml-2 mt-1 space-y-0.5">
                                                        {currentSubs.map((sub) => (
                                                            <button
                                                                type="button"
                                                                key={sub.id}
                                                                onClick={() => {
                                                                    if (selectedSubCategory == sub.id) {
                                                                        setSelectedSubCategory(null);
                                                                    } else {
                                                                        setSelectedCategory(cat.id);
                                                                        setSelectedSubCategory(sub.id);
                                                                    }
                                                                }}
                                                                className={`w-full text-left px-2 py-1 rounded text-[9px] transition-all duration-150 ${
                                                                    selectedSubCategory == sub.id ? "bg-blue-100 text-blue-700 font-extrabold" : "text-gray-500 hover:bg-gray-100"
                                                                }`}
                                                            >
                                                                • {sub.title}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Product Cards List */}
                            <div
                                className={`overflow-y-auto p-0.5 content-start scrollbar-thin transition-all duration-350 ${
                                    isCategorySidebarOpen ? "w-[75%]" : "w-full"
                                }`}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))',
                                    gap: '8px'
                                }}
                            >
                                {filteredProducts.map((product) => {
                                    const isLowStock = Number(product.stock) <= Number(product.alarm_when_stock_is_lessthanOrEqualto);
                                    const isOutOfStock = Number(product.stock) <= 0;
                                    return (
                                        <div
                                            key={product.id}
                                            onClick={() => !isOutOfStock && handleAddProductToCart(product)}
                                            className={`group bg-white rounded-xl border border-gray-200 p-2 flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${isOutOfStock ? 'opacity-50 cursor-not-allowed border-dashed' : 'cursor-pointer hover:border-blue-500 hover:shadow-md active:scale-95'}`}
                                        >
                                            <div
                                                className="relative aspect-video rounded-lg overflow-hidden bg-gray-50 mb-1.5 shrink-0">
                                                <img
                                                    src={product.image || "https://assets.turbologo.com/blog/en/2021/09/10093610/photo-camera-958x575.png"}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                                                />
                                                {isOutOfStock ? (
                                                    <div
                                                        className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                                                        <span
                                                            className="text-[8px] uppercase tracking-wider font-extrabold bg-red-100 text-red-650 border border-red-200 px-1 py-0.5 rounded">Out</span>
                                                    </div>
                                                ) : (
                                                    <span
                                                        className={`absolute top-0.5 left-0.5 px-1 py-0.5 text-[7px] font-black rounded text-white shadow-sm z-10 uppercase tracking-wider ${
                                                            isLowStock ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/10' : 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/10'
                                                        }`}
                                                    >
                                                        Qty: {product.stock}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-[9px] font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight mb-0.5">{product.name}</h4>
                                                <p className="text-[8px] text-gray-400 font-mono">#{product.product_code || '---'}</p>
                                            </div>
                                            <div
                                                className="flex items-center justify-between mt-1 pt-1 border-t border-gray-100">
                                                <span
                                                    className="text-[10px] font-extrabold text-gray-900">৳{Number(product.selling_price || product.sale_price).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Mobile Cart Trigger Button */}
                        {isMobile && (
                            <div className="lg:hidden shrink-0 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsMobileCartOpen(true)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-between shadow-lg active:scale-95 transition-all text-xs"
                                >
                                    <span className="flex items-center gap-2">
                                        🛒 Cart ({items.filter(i => i.product).length})
                                    </span>
                                    <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-mono font-bold">
                                        ৳{subtotal.toFixed(0)}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* RIGHT PANEL: Customer selector, Cart items table, Checkout (35% width) */}
                    {!isMobile && (
                        <div className="w-full lg:w-[35%] flex flex-col h-full overflow-hidden space-y-2">
                            {renderRightPanel(false)}
                        </div>
                    )}
                </form>
            </BaseModal>

            {/* Payment Modal */}
            <BaseModal
                isOpen={isPaymentModalOpen}
                onClose={() => {
                    setIsPaymentModalOpen(false);
                    if (isMobile) setIsMobileCartOpen(true);
                }}
                title="POS Payment Processing"
                size="2xl"
                variant="clean"
                showFooter={false}
                icon={<Coins className="text-blue-600"/>}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:max-h-[75vh] max-h-[75vh] lg:overflow-hidden overflow-y-auto text-gray-800 scrollbar-thin">
                    {/* Left Column: Cart Overview */}
                    <div className="lg:col-span-5 flex flex-col lg:h-full lg:overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 pr-0 lg:pr-4">
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 mb-3 shrink-0">
                            <span
                                className="text-[9px] font-black uppercase text-blue-900 block mb-0.5">Selected Customer</span>
                            <div className="font-extrabold text-sm text-gray-800">
                                {customer?.label}
                            </div>
                            {isWalkInActive ? (
                                <span
                                    className="inline-block mt-1 text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded font-black uppercase">🚶 Walk-In Customer</span>
                            ) : (
                                <div className="mt-1 flex justify-between text-[10px] text-gray-550 font-bold">
                                    <span>CRM Balance:</span>
                                    <span className="text-red-655 font-black">৳{previousDue.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-wider mb-2 shrink-0">Cart Items Overview</h4>
                        <div
                            className="lg:flex-1 max-h-[160px] lg:max-h-none overflow-y-auto border border-gray-150 rounded-xl bg-gray-55 mb-3 scrollbar-thin">
                            <table className="w-full text-left border-collapse text-[10px]">
                                <thead>
                                <tr className="border-b border-gray-250 text-gray-400 uppercase font-bold bg-gray-100/90 sticky top-0">
                                    <th className="py-2 px-2">Item</th>
                                    <th className="py-2 px-2 text-right">Price</th>
                                    <th className="py-2 px-2 text-center">Qty</th>
                                    <th className="py-2 px-2 text-right">Total</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-150 bg-white">
                                {items.filter(i => i.product).map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-55/50">
                                        <td className="py-2 px-2 font-medium">
                                            <div
                                                className="font-bold text-gray-800 line-clamp-1">{item.product_name}</div>
                                            {item.unique_serial && (
                                                <span
                                                    className="text-[8px] font-mono text-gray-450 bg-gray-100 px-1 py-0.5 rounded">
                                                         SN: {item.unique_serial}
                                                     </span>
                                            )}
                                        </td>
                                        <td className="py-2 px-2 text-right font-mono text-gray-600">৳{item.unit_price}</td>
                                        <td className="py-2 px-2 text-center font-bold text-gray-700">{item.quantity}</td>
                                        <td className="py-2 px-2 text-right font-mono font-bold text-blue-700">৳{item.total_price.toFixed(0)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-gray-900 text-white p-3 rounded-xl space-y-2 shrink-0">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Subtotal</span>
                                <span className="font-mono">৳{subtotal.toFixed(2)}</span>
                            </div>
                            {globalDiscountAmount > 0 && (
                                <div className="flex justify-between text-xs text-green-400">
                                    <span>Discount</span>
                                    <span className="font-mono">- ৳{globalDiscountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                                <span className="text-xs font-black uppercase text-gray-400">Net Payable</span>
                                <span
                                    className="font-mono font-black text-xl text-emerald-450">৳{netTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment Processing */}
                    <div
                        className="lg:col-span-7 flex flex-col lg:max-h-[75vh] lg:overflow-y-auto pr-0 lg:pr-1 space-y-4 scrollbar-thin">
                        {isDueBlockActive && (
                            <div
                                className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 flex items-start gap-2 shrink-0 animate-pulse">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5"/>
                                <div className="text-[10px] font-bold leading-tight">
                                    Walk-in Customer Alert: ফুল পেমেন্ট আবশ্যক। বকেয়া: ৳{currentInvoiceDue}
                                </div>
                            </div>
                        )}

                        {/* Payment Channels */}
                        <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-3">
                            <label className="block text-[10px] font-black uppercase text-gray-505 tracking-wider">Payment Channels</label>
                            <div className="grid grid-cols-3 gap-2.5">
                                <div>
                                    <label className="text-[9px] font-black uppercase text-gray-450">Cash (৳)</label>
                                    <input type="number"
                                           className="w-full border-2 border-gray-300 p-2 rounded-lg font-black text-sm bg-white focus:border-blue-600 outline-none font-mono mt-1"
                                           value={paidCash || ""}
                                           onChange={(e) => setPaidCash(Number(e.target.value))}/>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase text-gray-455">Mobile (৳)</label>
                                    <input type="number"
                                           className="w-full border-2 border-gray-300 p-2 rounded-lg font-black text-sm bg-white focus:border-blue-600 outline-none font-mono mt-1"
                                           value={paidMobile || ""}
                                           onChange={(e) => setPaidMobile(Number(e.target.value))}/>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase text-gray-455">Bank (৳)</label>
                                    <input type="number"
                                           className="w-full border-2 border-gray-300 p-2 rounded-lg font-black text-sm bg-white focus:border-blue-600 outline-none font-mono mt-1"
                                           value={paidBank || ""}
                                           onChange={(e) => setPaidBank(Number(e.target.value))}/>
                                </div>
                            </div>

                            {paidMobile > 0 && (
                                <div
                                    className="grid grid-cols-2 gap-2.5 p-2.5 bg-orange-50/50 rounded-xl border border-orange-200">
                                    <div>
                                        <label
                                            className="text-[9px] uppercase font-black text-orange-850">Operator</label>
                                        <select
                                            className="w-full border p-1.5 rounded-lg bg-white text-xs outline-none font-bold mt-1"
                                            value={mobileOperator} onChange={(e) => setMobileOperator(e.target.value)}>
                                            <option value="">Select</option>
                                            <option value="bkash">bKash</option>
                                            <option value="nagad">Nagad</option>
                                            <option value="rocket">Rocket</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[9px] uppercase font-black text-orange-855">Trx ID</label>
                                        <input
                                            className="w-full border p-1.5 rounded-lg bg-white text-xs font-mono outline-none mt-1"
                                            value={transactionId} onChange={(e) => setTransactionId(e.target.value)}/>
                                    </div>
                                </div>
                            )}

                            {paidBank > 0 && (
                                <div className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-200">
                                    <label className="text-[9px] uppercase font-black text-blue-700">Bank A/C Number</label>
                                    <input
                                        className="w-full border p-1.5 rounded-lg bg-white text-xs font-mono outline-none mt-1"
                                        value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)}/>
                                </div>
                            )}

                            <div
                                className="flex items-center justify-between text-[10px] border-t border-gray-100 pt-2.5 mt-1">
                                <span className="text-gray-400 font-bold uppercase">Payment Proof</span>
                                <input type="file"
                                       className="text-[9px] font-bold text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[9px] file:font-black file:bg-blue-55 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                       onChange={(e) => setPaymentProof(e.target.files[0])}/>
                            </div>
                        </div>

                        {/* Cash Calculator */}
                        <div
                            className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-250 p-4 rounded-xl space-y-3 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Banknote size={15} className="text-emerald-600"/>
                                    <span className="text-[10px] font-black uppercase text-emerald-705 tracking-wider">Cash Calculator</span>
                                </div>
                                {givenCash > 0 && (
                                    <button type="button" onClick={() => setGivenCash(0)}
                                            className="flex items-center gap-0.5 text-[9px] font-bold text-gray-400 hover:text-red-500">
                                        <RefreshCcw size={10}/> Clear
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[9px] font-black uppercase text-emerald-750 block mb-1">Customer Given (৳)</label>
                                    <input type="number" min="0"
                                           className="w-full border-2 border-emerald-300 p-2 rounded-lg font-black text-sm bg-white outline-none font-mono focus:border-emerald-500 text-emerald-800 placeholder-emerald-200"
                                           placeholder="0.00" value={givenCash || ""}
                                           onChange={(e) => setGivenCash(Number(e.target.value))}/>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase text-rose-700 block mb-1">Return Change (৳)</label>
                                    <div
                                        className={`w-full border-2 rounded-lg p-2 font-black text-sm font-mono text-center flex items-center justify-center h-[34px] ${
                                            givenCash > netTotal ? 'bg-rose-100 border-rose-400 text-rose-700' :
                                                givenCash > 0 ? 'bg-yellow-100 border-yellow-350 text-yellow-850 font-bold' :
                                                    'bg-gray-100 border-gray-300 text-gray-400'
                                        }`}>৳{Math.max(0, givenCash - netTotal).toFixed(0)}</div>
                                </div>
                            </div>

                            {/* Quick cash shortcuts */}
                            <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-emerald-200/50 items-center">
                                {quickCashList && quickCashList.map((qc) => (
                                    <button key={qc.id} type="button"
                                            onClick={() => setGivenCash(prev => Number(prev) + Number(qc.amount))}
                                            className="flex items-center gap-1 px-2 py-1 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-600 hover:text-white hover:border-emerald-650 transition-all active:scale-95 shadow-sm group">
                                        {qc.image ?
                                            <img src={qc.image} alt={qc.name}
                                                 className="w-4 h-4 object-contain rounded"/> :
                                            <span
                                                className="text-[9px] font-black text-emerald-700 group-hover:text-white">৳</span>}
                                        <span
                                            className="text-[10px] font-black text-gray-700 group-hover:text-white font-mono">
                                             {Number(qc.amount) >= 1000 ? `${(Number(qc.amount) / 1000).toFixed(Number(qc.amount) % 1000 === 0 ? 0 : 1)}K` : Number(qc.amount).toFixed(0)}
                                         </span>
                                    </button>
                                ))}
                                <button type="button" onClick={() => setIsAddQuickCashOpen(true)}
                                        className="flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-dashed border-emerald-350 rounded-lg transition-all active:scale-95 text-emerald-700 hover:border-emerald-600 font-bold text-[9px] shadow-sm group">
                                    <Coins size={10} className="text-emerald-600 group-hover:text-white"/>
                                    <span>Add Shortcuts</span>
                                </button>
                            </div>
                        </div>

                        {/* Summary & Buttons */}
                        <div className="bg-gray-100 p-3.5 rounded-xl space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center text-[10px]">
                                {/* Amount Received */}
                                <div
                                    className="p-2 bg-white border border-gray-200 rounded-lg flex flex-col justify-center min-w-0">
                                    <p className="text-gray-500 font-bold uppercase mb-0.5 truncate">Amount Received</p>
                                    <p className="text-xs font-black font-mono text-blue-650">৳{totalPaid.toFixed(2)}</p>
                                </div>

                                {/* Invoice Due */}
                                <div
                                    className="p-2 bg-white border border-gray-200 rounded-lg flex flex-col justify-center min-w-0">
                                    <p className="text-gray-500 font-bold uppercase mb-0.5 truncate">Invoice Due</p>
                                    <p className={`text-xs font-black font-mono ${isWalkInActive ? 'text-amber-500' : 'text-red-500'}`}>
                                        ৳{currentInvoiceDue.toFixed(2)}
                                    </p>
                                </div>

                                {/* CRM Balance */}
                                <div
                                    className="p-2 bg-blue-50 border border-blue-200 rounded-lg flex flex-col justify-center min-w-0">
                                    <p className="text-blue-600 font-bold uppercase mb-0.5 truncate">CRM Balance</p>
                                    <p className="text-xs font-black text-blue-700 font-mono">
                                        {isWalkInActive ? "৳0.00 (Walk-In)" : `৳${totalCustomerDue.toFixed(2)}`}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-1">
                                <button type="button"
                                        onClick={() => {
                                            setIsPaymentModalOpen(false);
                                            if (isMobile) setIsMobileCartOpen(true);
                                        }}
                                        className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-black text-xs uppercase tracking-wider transition-all">
                                    Cancel
                                </button>
                                <button type="button"
                                        onClick={() => handleSubmit()}
                                        disabled={loading || isDueBlockActive}
                                        className={`flex-1 py-2.5 font-black rounded-xl text-xs uppercase tracking-widest text-white shadow-md transition-all active:scale-98 ${
                                            isDueBlockActive ? "bg-gray-400 cursor-not-allowed shadow-none" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/10"
                                        }`}>
                                    {loading ? "Processing..." : "✓ Confirm Sale"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseModal>

            <AddCustomerModal
                isOpen={isAddCustomerOpen}
                onClose={() => {
                    setIsAddCustomerOpen(false);
                    if (isMobile) setIsMobileCartOpen(true);
                }}
                onSuccess={(newCustomer) => {
                    handleCustomerAdded(newCustomer);
                    if (isMobile) setIsMobileCartOpen(true);
                }}
            />

            {successData && (
                <SuccessModal
                    isOpen={showSuccess}
                    onClose={() => {
                        setShowSuccess(false);
                        onSuccess?.(successData);
                        onClose();
                    }}
                    title="Sale Recorded Successfully"
                    subtitle={successData ? `Invoice #${successData.invoice_no} Generated` : ""}
                    details={successData ? [
                        {label: "Net Payable", value: `৳${parseFloat(successData.net_total || 0).toLocaleString()}`},
                        {
                            label: "Total Received",
                            value: `৳${parseFloat(successData.paid_amount || 0).toLocaleString()}`
                        },
                        {label: "Current Due", value: `৳${parseFloat(successData.due_amount || 0).toLocaleString()}`},
                    ] : []}
                    onPrint={successData ? () => handlePrint(successData) : null}
                    printText="Print Slip"
                />
            )}

            <BaseModal
                isOpen={isViewCustomerOpen}
                onClose={() => {
                    setIsViewCustomerOpen(false);
                    if (isMobile) setIsMobileCartOpen(true);
                }}
                title="Customer Details"
                size="md"
                variant="clean"
                showFooter={false}
                isLoading={loadingDetails}
                icon={<Eye className="text-blue-600"/>}
            >
                {customerDetails ? (
                    <div className="space-y-6 text-gray-800">
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center py-2">
                            <div
                                className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-150 shadow-lg bg-gray-100 flex items-center justify-center">
                                {customerDetails.image ? (
                                    <img src={customerDetails.image} className="w-full h-full object-cover"
                                         alt={customerDetails.name}/>
                                ) : (
                                    <span
                                        className="text-gray-300 text-3xl font-black">{customerDetails.name?.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <h3 className="mt-3 text-lg font-black text-gray-800">{customerDetails.name}</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer
                                Details Profile</p>
                        </div>

                        <div className="grid gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        className="text-[9px] font-black text-gray-450 uppercase tracking-wider block mb-0.5">Phone
                                        Number</label>
                                    <span
                                        className="font-bold text-gray-800 text-sm font-mono">{customerDetails.phone}</span>
                                </div>
                                <div>
                                    <label
                                        className="text-[9px] font-black text-gray-450 uppercase tracking-wider block mb-0.5">Email
                                        Address</label>
                                    <span
                                        className="font-bold text-gray-850 text-sm font-mono break-all">{customerDetails.email || "N/A"}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200/60">
                                <div>
                                    <label
                                        className="text-[9px] font-black text-gray-450 uppercase tracking-wider block mb-0.5">Billing
                                        Address</label>
                                    <span
                                        className="font-bold text-gray-850 text-xs block leading-relaxed">{customerDetails.address || "N/A"}</span>
                                </div>
                                <div>
                                    <label
                                        className="text-[9px] font-black text-red-500 uppercase tracking-wider block mb-0.5">Current
                                        Balance / Due</label>
                                    <span
                                        className="font-black text-red-600 text-base font-mono">৳{Number(customerDetails.due_amount || 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsViewCustomerOpen(false);
                                    if (isMobile) setIsMobileCartOpen(true);
                                }}
                                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all text-xs"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                        <p className="text-xs font-bold uppercase tracking-wider">Loading Customer Details...</p>
                    </div>
                )}
            </BaseModal>

            {/* ─── Add Quick Cash Modal ─── */}
            <BaseModal
                isOpen={isAddQuickCashOpen}
                onClose={() => {
                    setIsAddQuickCashOpen(false);
                    setQuickCashAmount('');
                    setQuickCashName('');
                }}
                title="Add Quick Cash Shortcut"
                size="sm"
                variant="clean"
                showFooter={true}
                isLoading={quickCashLoading}
                onSubmit={handleAddQuickCash}
                submitText="Save Shortcut"
                submitColor="bg-emerald-600 hover:bg-emerald-700 text-white"
                icon={<Coins className="text-emerald-600"/>}
            >
                <div className="space-y-4">
                    <div
                        className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-[10px] text-emerald-700 font-medium">
                        💡 Quick Cash shortcuts appear as buttons for fast denomination selection.
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1">Amount
                            (৳) <span className="text-red-500">*</span></label>
                        <input type="number" required
                               className="w-full border-2 border-gray-200 p-2 rounded-xl text-sm font-black font-mono outline-none focus:border-emerald-500 transition-colors"
                               placeholder="e.g. 500"
                               value={quickCashAmount}
                               onChange={(e) => setQuickCashAmount(e.target.value)}/>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1">Display
                            Name <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input type="text"
                               className="w-full border-2 border-gray-200 p-2 rounded-xl text-xs outline-none focus:border-emerald-500 transition-colors"
                               placeholder="e.g. 500 Taka Note"
                               value={quickCashName}
                               onChange={(e) => setQuickCashName(e.target.value)}/>
                        <p className="text-[9px] text-gray-400 mt-1">যদি খালি রাখেন, তাহলে
                            "{quickCashAmount || '...'} Taka" নাম হবে।</p>
                    </div>
                </div>
            </BaseModal>

            {/* Mobile Cart Modal */}
            {isMobile && (
                <BaseModal
                    isOpen={isMobileCartOpen}
                    onClose={() => setIsMobileCartOpen(false)}
                    title="POS Cart & Customer"
                    size="xl"
                    showFooter={false}
                >
                    <div className="h-[75vh] overflow-hidden flex flex-col">
                        {renderRightPanel(true)}
                    </div>
                </BaseModal>
            )}
        </>
    );
};

export default AddSaleModal;