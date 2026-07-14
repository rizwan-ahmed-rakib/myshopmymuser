import React, {useEffect, useRef, useState} from "react";
import AsyncSelect from "react-select/async";
import {posProductAPI} from "../../context_or_provider/pos/products/productAPI";
import {posPurchaseProductAPI} from "../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
import {posSupplierAPI} from "../../context_or_provider/pos/Purchase/suppliers/supplierAPI";
import {posCategoryAPI} from "../../context_or_provider/pos/categories/categoryAPI";
import {posSubCategoryAPI} from "../../context_or_provider/pos/subcategories/subCategoryApi";
import {posBrandAPI} from "../../context_or_provider/pos/brands/brandAPI";
import {posSizeAPI} from "../../context_or_provider/pos/sizes/sizeAPI";
import {posUnitAPI} from "../../context_or_provider/pos/units/unitAPI";
import BASE_URL_of_POS from "../../posConfig";
import Navbar from "../components/Navbar";
import api from '../../context_or_provider/pos/posApi';
import axios from "axios";
import BaseModal from "../components/BaseModal";
import SuccessModal from "../components/SuccessModal";
import {
    ShoppingCart, User, Package, Trash2, Plus, Banknote, Tag, Wallet, Eye, UserPlus, 
    Search, Sparkles, ChevronRight, Coins, RefreshCcw, Folder, FolderOpen
} from 'lucide-react';
import AddSupplierModal from "./SupplierList/AddSupplierModal";
import {getPurchasePrintLayout} from "./PurchaseProduct/PurchasePrintLayout";
import {getBrandedVoucher} from "../utils/printTemplates";
import { useQuickCash } from "../../context_or_provider/pos/QuickCash/quick_cash_provider";

const emptyItem = {
    product: null,
    product_name: "",
    unit_price: 0,
    quantity: 1,
    discount_type: "fixed",
    discount_value: 0,
    discount_amount: 0,
    total_price: 0,
    has_expiry: false,
    manufacturing_date: "",
    shelf_life_days: 0,
    batch_no: "",
};

const PosPurchase = () => {
    /* ---------------- STATES ---------------- */
    const [supplier, setSupplier] = useState(null);
    const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
    const [isViewSupplierOpen, setIsViewSupplierOpen] = useState(false);
    const [supplierDetails, setSupplierDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const [items, setItems] = useState([{...emptyItem}]);

    const [paidCash, setPaidCash] = useState(0);
    const [paidMobile, setPaidMobile] = useState(0);
    const [paidBank, setPaidBank] = useState(0);

    const [mobileOperator, setMobileOperator] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [bankAccountNo, setBankAccountNo] = useState("");
    const [paymentProof, setPaymentProof] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [globalDiscountType, setGlobalDiscountType] = useState("fixed");
    const [globalDiscountValue, setGlobalDiscountValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Quick Cash states
    const { quickCashList, addQuickCashOption } = useQuickCash();
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

    // Success & Print States
    const [showSuccess, setShowSuccess] = useState(false);
    const [successData, setSuccessData] = useState(null);

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

    const barcodeRef = useRef(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
    const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(window.innerWidth >= 1024);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) {
                setIsMobileCartOpen(false);
                setIsCategorySidebarOpen(true);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /* ---------------- EFFECTS ---------------- */
    useEffect(() => {
        const counts = [paidCash > 0, paidMobile > 0, paidBank > 0].filter(Boolean).length;
        if (counts > 1) setPaymentMethod("hybrid");
        else if (paidMobile > 0) setPaymentMethod("mobile_banking");
        else if (paidBank > 0) setPaymentMethod("bank");
        else setPaymentMethod("cash");
    }, [paidCash, paidMobile, paidBank]);

    useEffect(() => {
        if (barcodeRef.current) {
            barcodeRef.current.focus();
        }
    }, []);

    // Initial Fetch on Mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                await loadProducts();

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
                console.error("Error loading database:", err);
            }
        };
        fetchData();
    }, []);

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
            result = result.filter(p => p.category == selectedCategory || p.category_id == selectedCategory);
        }

        if (selectedBrand !== "All") {
            result = result.filter(p => p.brand == selectedBrand || p.brand_id == selectedBrand);
        }

        if (selectedSize !== "All") {
            result = result.filter(p => p.size == selectedSize || p.size_id == selectedSize || p.size_name == selectedSize);
        }

        if (selectedUnit !== "All") {
            result = result.filter(p => p.unit == selectedUnit || p.unit_id == selectedUnit || p.unit_name == selectedUnit);
        }

        setFilteredProducts(result);
    }, [searchTerm, selectedCategory, selectedSubCategory, selectedBrand, selectedSize, selectedUnit, allProducts]);

    /* ---------------- OPTION LOADERS ---------------- */
    const loadSupplierOptions = async (inputValue) => {
        const res = await posSupplierAPI.search(inputValue || "");
        return res.data.map(s => ({
            value: s.id,
            label: `${s.name} ${s.phone ? `(${s.phone})` : ''}`,
            due_amount: Number(s.due_amount || 0)
        }));
    };

    const loadProducts = async () => {
        try {
            const productRes = await posProductAPI.search("");
            if (productRes?.data) {
                setAllProducts(productRes.data);
                setFilteredProducts(productRes.data);
            }
        } catch (err) {
            console.error("Error loading products:", err);
        }
    };

    const loadProductOptions = async (inputValue) => {
        if (!inputValue) return [];
        try {
            const res = await posProductAPI.search(inputValue);
            return res.data.map(p => ({
                value: p.id,
                label: `${p.name} (${p.product_code || ""})`,
                unit_price: Number(p.purchase_price || 0),
                product_name: p.name,
                has_expiry: p.has_expiry,
            }));
        } catch (err) {
            console.error("Error loading product options:", err);
            return [];
        }
    };

    const isProductDuplicate = (productId, currentIndex) => {
        return items.some((item, index) => index !== currentIndex && item.product === productId);
    };

    const selectProduct = (option, index) => {
        if (isProductDuplicate(option.value, index)) {
            alert("Product already added!");
            return;
        }
        updateItem(index, {
            product: option.value,
            product_name: option.product_name,
            unit_price: option.unit_price,
            quantity: 1,
            has_expiry: option.has_expiry,
            manufacturing_date: "",
            shelf_life_days: 0,
            batch_no: "",
        });
    };

    /* ---------------- REALTIME ENGINE ---------------- */
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

    const handleAddProductToCart = (product) => {
        let currentItems = [...items];
        const isEmptyFirstRow = currentItems.length === 1 && currentItems[0].product === null && !currentItems[0].manufacturing_date;

        const existingIndex = currentItems.findIndex(item => item.product === product.id);

        if (existingIndex > -1) {
            const currentQty = currentItems[existingIndex].quantity;
            const updatedItem = {...currentItems[existingIndex], quantity: currentQty + 1};
            const {total_price, discount_amount} = calculateItemTotal(updatedItem);
            currentItems[existingIndex] = {...updatedItem, total_price, discount_amount};
            setItems(currentItems);
        } else {
            const newItem = {
                product: product.id,
                product_name: product.name,
                unit_price: Number(product.purchase_price || 0),
                quantity: 1,
                discount_type: "fixed",
                discount_value: 0,
                discount_amount: 0,
                total_price: Number(product.purchase_price || 0),
                has_expiry: product.has_expiry,
                manufacturing_date: "",
                shelf_life_days: 0,
                batch_no: "",
            };

            if (isEmptyFirstRow) {
                setItems([newItem]);
            } else {
                setItems([...items, newItem]);
            }
        }
    };

    /* ---------------- AUTOMATIC BARCODE SCANNER ---------------- */
    const handleBarcodeScan = async (e) => {
        if (e.key !== "Enter") return;
        const code = e.target.value.trim();
        if (!code) return;

        try {
            const res = await posProductAPI.search(code);
            if (res.data.length) {
                const p = res.data[0];
                const productData = {
                    value: p.id,
                    product_name: p.name,
                    unit_price: Number(p.purchase_price),
                    has_expiry: p.has_expiry,
                };

                setItems(prev => {
                    const lastItem = prev[prev.length - 1];
                    if (!lastItem.product) {
                        const updated = [...prev];
                        const newItem = {
                            ...lastItem,
                            product: productData.value,
                            product_name: productData.product_name,
                            unit_price: productData.unit_price,
                            has_expiry: productData.has_expiry
                        };
                        const {total_price, discount_amount} = calculateItemTotal(newItem);
                        updated[prev.length - 1] = {...newItem, total_price, discount_amount};
                        return updated;
                    } else {
                        const newItem = {
                            ...emptyItem,
                            product: productData.value,
                            product_name: productData.product_name,
                            unit_price: productData.unit_price,
                            has_expiry: productData.has_expiry
                        };
                        const {total_price, discount_amount} = calculateItemTotal(newItem);
                        return [...prev, {...newItem, total_price, discount_amount}];
                    }
                });
            }
        } catch (err) {
            console.error("Barcode scan engine error", err);
        }
        e.target.value = "";
    };

    const addRow = () => setItems([...items, {...emptyItem}]);
    const removeRow = (index) => {
        if (items.length === 1) setItems([{...emptyItem}]);
        else setItems(items.filter((_, i) => i !== index));
    };

    /* ---------------- MATHEMATICAL SUMMARY ---------------- */
    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
    const globalDiscountAmount = globalDiscountType === "percent" ? (subtotal * globalDiscountValue) / 100 : globalDiscountValue;
    const netTotal = Math.max(0, subtotal - globalDiscountAmount);
    const totalPaid = Number(paidCash) + Number(paidMobile) + Number(paidBank);
    const currentInvoiceDue = netTotal - totalPaid;
    const previousDue = supplier?.due_amount || 0;
    const totalSupplierDue = previousDue + currentInvoiceDue;

    const remainingBalance = Math.max(0, netTotal - paidMobile - paidBank);

    useEffect(() => {
        if (givenCash > 0) {
            setPaidCash(Math.min(givenCash, remainingBalance));
        } else {
            setPaidCash(0);
        }
    }, [givenCash, remainingBalance]);

    const handleAddQuickCash = async (e) => {
        e.preventDefault();
        if (!quickCashAmount || Number(quickCashAmount) <= 0) { alert("Please enter a valid amount"); return; }
        try {
            setQuickCashLoading(true);
            const formData = new FormData();
            formData.append("amount", quickCashAmount);
            formData.append("name", quickCashName || `${quickCashAmount} Taka`);
            await addQuickCashOption(formData);
            setQuickCashAmount(''); setQuickCashName(''); setIsAddQuickCashOpen(false);
            if (isMobile) setIsMobileCartOpen(true);
        } catch { alert("Failed to add quick cash option."); }
        finally { setQuickCashLoading(false); }
    };

    /* ---------------- ACTIONS SUBMIT ---------------- */
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setErrors({});

        if (!supplier) {
            alert("Supplier is required");
            return;
        }
        if (items.some(i => !i.product)) {
            alert("All product rows must be filled");
            return;
        }

        const validItems = items.filter(i => i.product);
        const itemwise_total_discount = validItems.reduce((sum, i) => sum + i.discount_amount, 0);
        const itemsPayload = validItems.map(i => ({
            product: i.product,
            quantity: i.quantity,
            unit_price: i.unit_price,
            discount_amount: i.discount_amount,
            net_total: i.total_price,
            manufacturing_date: i.has_expiry ? i.manufacturing_date : null,
            shelf_life_days: i.has_expiry ? i.shelf_life_days : 0,
            batch_no: i.has_expiry ? i.batch_no : "",
        }));

        const payload = {
            supplier: supplier.value,
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
                    if (key === 'items') formData.append(key, JSON.stringify(payload[key]));
                    else if (payload[key] !== null && payload[key] !== undefined) formData.append(key, payload[key]);
                });
                formData.append("payment_proof", paymentProof);
                const token = localStorage.getItem("token");
                const headers = token ? {Authorization: `Bearer ${token}`} : {};
                res = await axios.post(`${BASE_URL_of_POS}/api/purchase/purchases/`, formData, {headers});
            } else {
                res = await posPurchaseProductAPI.create(payload);
            }

            await loadProducts();

            setSuccessData(res.data);
            setShowSuccess(true);
            setItems([{...emptyItem}]);
            setSupplier(null);
            setPaidCash(0);
            setPaidMobile(0);
            setPaidBank(0);
            setGivenCash(0);
            setMobileOperator("");
            setTransactionId("");
            setBankAccountNo("");
            setPaymentProof(null);
            setGlobalDiscountValue(0);
            setIsPaymentModalOpen(false);
        } catch (err) {
            console.error("Submission failed:", err);
            alert(err.response?.data?.error || "Failed to record purchase invoice");
            setErrors(err.response?.data || {});
        } finally {
            setLoading(false);
        }
    };

    const handleSupplierAdded = (newSupplier) => {
        const formattedSupplier = {
            value: newSupplier.id,
            label: `${newSupplier.name} ${newSupplier.phone ? `(${newSupplier.phone})` : ''}`,
            due_amount: Number(newSupplier.due_amount || 0)
        };
        setSupplier(formattedSupplier);
        setIsAddSupplierOpen(false);
    };

    const handleViewSupplierDetails = async (id) => {
        if (!id) return;
        try {
            setLoadingDetails(true);
            setIsViewSupplierOpen(true);
            const res = await posSupplierAPI.getById(id);
            setSupplierDetails(res.data);
        } catch (err) {
            console.error("Failed to load supplier details:", err);
            alert("Could not load supplier details");
            setIsViewSupplierOpen(false);
            if (isMobile) setIsMobileCartOpen(true);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handlePrint = (invoice) => {
        if (!invoice) return;
        const tableContent = getPurchasePrintLayout(invoice);
        const fullHTML = getBrandedVoucher("Purchase Invoice", tableContent, invoice.invoice_no, "#1d4ed8");
        const printWindow = window.open("", "_blank", "width=850,height=900");
        printWindow.document.write(fullHTML);
        printWindow.document.close();
    };

    const renderRightPanel = (isMobileCartContext = false) => {
        return (
            <div className={`flex flex-col h-full overflow-hidden space-y-4 ${isMobileCartContext ? 'w-full' : 'w-full lg:w-[35%]'}`}>
                {/* Supplier Info Head Banner */}
                <div
                    className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 shadow-inner">
                    <div className="w-full sm:w-[65%] flex items-end gap-2">
                        <div className="flex-1">
                            <label
                                className="block text-[9px] font-extrabold uppercase text-blue-900 tracking-wider mb-1">Supplier
                                CRM *</label>
                            <AsyncSelect
                                cacheOptions defaultOptions
                                loadOptions={loadSupplierOptions}
                                value={supplier}
                                onChange={setSupplier}
                                placeholder="Find supplier CRM..."
                                menuPortalTarget={document.body}
                                styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                className="text-xs"
                            />
                        </div>
                        <div className="flex gap-1 shrink-0">
                            {supplier && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleViewSupplierDetails(supplier.value);
                                        if (isMobile) setIsMobileCartOpen(false);
                                    }}
                                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-all duration-200 shadow-sm"
                                    title="View Supplier Details"
                                >
                                    <Eye size={16}/>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAddSupplierOpen(true);
                                    if (isMobile) setIsMobileCartOpen(false);
                                }}
                                className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-xl border border-green-200 transition-all duration-200 shadow-sm"
                                title="Add New Supplier"
                            >
                                <UserPlus size={16}/>
                            </button>
                        </div>
                    </div>
                    {supplier && (
                        <div
                            className="bg-white px-3 py-1 rounded border border-blue-200 shadow-sm min-w-[120px] text-right">
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">CRM Due
                                Balance</p>
                            <p className="text-sm font-black text-red-655">৳{previousDue.toFixed(2)}</p>
                        </div>
                    )}
                </div>

                {/* Cart Mapping Grid */}
                <div
                    className="flex-1 overflow-y-auto p-3 border border-gray-200 rounded-xl bg-white scrollbar-thin">
                    <div className="flex justify-between items-center mb-2 px-1 shrink-0">
                        <h3 className="text-xs font-black uppercase text-gray-700 tracking-wider flex items-center gap-1.5">🛒
                            Cart Items ({items.length})</h3>
                        <button
                            type="button"
                            onClick={addRow}
                            className="text-[9px] font-bold text-blue-600 bg-blue-500/10 hover:bg-blue-500 hover:text-white border border-blue-200 px-3 py-1 rounded-xl transition-all duration-200 flex items-center gap-1"
                        >
                            <Plus size={11}/> Add Row
                        </button>
                    </div>

                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                        <tr className="border-b border-gray-200 text-gray-400 text-[8px] uppercase font-bold tracking-wider bg-gray-55 sticky top-0 z-10">
                            <th className="py-2 px-1 w-[40%]">Item Description</th>
                            <th className="py-2 px-1 w-[18%] text-right font-bold">Cost Price</th>
                            <th className="py-2 px-1 text-center w-[12%]">Qty</th>
                            <th className="py-2 px-1 w-[18%]">Discount</th>
                            <th className="py-2 px-1 w-[12%] text-right font-bold">Total</th>
                            <th className="py-2 px-1"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {items.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50/40 transition-colors text-[11px]">
                                <td className="py-2 px-1 align-top">
                                    <div className="space-y-1.5">
                                        <AsyncSelect
                                            loadOptions={loadProductOptions}
                                            defaultOptions
                                            onChange={(opt) => selectProduct(opt, index)}
                                            value={item.product ? {
                                                value: item.product,
                                                label: item.product_name
                                            } : null}
                                            placeholder="Find product..."
                                            menuPortalTarget={document.body}
                                            styles={{
                                                menuPortal: base => ({...base, zIndex: 9999}),
                                                control: (base) => ({
                                                    ...base,
                                                    borderRadius: '10px',
                                                    fontSize: '11px',
                                                    minHeight: '32px'
                                                })
                                            }}
                                        />
                                        {item.has_expiry && (
                                            <div
                                                className="grid grid-cols-3 gap-1.5 p-2 bg-orange-50/50 border border-orange-100 rounded-xl animate-in fade-in duration-200">
                                                <div className="space-y-0.5">
                                                    <label
                                                        className="text-[7px] font-black text-orange-600 uppercase block">Mfg
                                                        Date</label>
                                                    <input
                                                        type="date"
                                                        className="w-full border border-orange-100 p-1 rounded bg-white text-[9px] font-bold outline-none"
                                                        value={item.manufacturing_date}
                                                        onChange={(e) => updateItem(index, {manufacturing_date: e.target.value})}
                                                    />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <label
                                                        className="text-[7px] font-black text-orange-600 uppercase block">Shelf
                                                        Life (Days)</label>
                                                    <input
                                                        type="number"
                                                        className="w-full border border-orange-100 p-1 rounded bg-white text-[9px] font-mono outline-none"
                                                        placeholder="Days"
                                                        value={item.shelf_life_days || ""}
                                                        onChange={(e) => updateItem(index, {shelf_life_days: Number(e.target.value)})}
                                                    />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <label
                                                        className="text-[7px] font-black text-orange-600 uppercase block">Batch
                                                        No</label>
                                                    <input
                                                        type="text"
                                                        className="w-full border border-orange-100 p-1 rounded bg-white text-[9px] outline-none"
                                                        placeholder="Batch #"
                                                        value={item.batch_no}
                                                        onChange={(e) => updateItem(index, {batch_no: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>

                                <td className="py-2 px-1 align-top">
                                    <input
                                        type="number"
                                        className="w-full border p-1 rounded text-right font-mono text-[10px] bg-white text-gray-800 focus:border-blue-500 outline-none"
                                        value={item.unit_price || ""}
                                        onChange={(e) => updateItem(index, {unit_price: Number(e.target.value)})}
                                    />
                                </td>

                                <td className="py-2 px-1 align-top text-center">
                                    <div
                                        className="flex items-center justify-center inline-flex bg-gray-50 border border-gray-300 rounded-lg overflow-hidden h-6">
                                        <button
                                            type="button"
                                            onClick={() => updateItem(index, {quantity: Math.max(1, item.quantity - 1)})}
                                            className="w-5 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-655 font-extrabold text-[11px]"
                                        >
                                            -
                                        </button>
                                        <span
                                            className="w-6 text-center text-[10px] font-bold font-mono text-gray-800 select-none">
                                            {item.quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => updateItem(index, {quantity: item.quantity + 1})}
                                            className="w-5 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-655 font-extrabold text-[11px]"
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>

                                <td className="py-2 px-1 align-top">
                                    <div
                                        className="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                                        <select
                                            className="bg-gray-50 text-[8px] p-0.5 border-r border-gray-200 outline-none cursor-pointer text-gray-700 font-bold"
                                            value={item.discount_type}
                                            onChange={(e) => updateItem(index, {discount_type: e.target.value})}
                                        >
                                            <option value="fixed">৳</option>
                                            <option value="percent">%</option>
                                        </select>
                                        <input
                                            type="number"
                                            className="w-full bg-transparent p-0.5 text-[9px] font-bold text-center text-gray-800 outline-none font-mono"
                                            placeholder="0"
                                            value={item.discount_value || ""}
                                            onChange={(e) => updateItem(index, {discount_value: Number(e.target.value)})}
                                        />
                                    </div>
                                </td>

                                <td className="py-2 px-1 text-right align-top">
                                    <span
                                        className="font-bold font-mono text-blue-700 text-[11px] block mt-0.5">৳{item.total_price.toFixed(2)}</span>
                                    {item.discount_amount > 0 && (
                                        <span
                                            className="text-[7px] text-green-600 font-bold block leading-none">Saved: ৳{item.discount_amount.toFixed(0)}</span>
                                    )}
                                </td>

                                <td className="py-2 px-1 text-center align-top">
                                    <button
                                        type="button"
                                        onClick={() => removeRow(index)}
                                        className="text-gray-400 hover:text-red-500 transition-colors text-base font-bold"
                                    >
                                        ×
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

                    <div className="flex justify-between items-center text-[10px] text-gray-550 font-bold border-t border-gray-200 pt-1">
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
                                        setItems([{
                                            product: "",
                                            product_name: "",
                                            unit_price: 0,
                                            quantity: 1,
                                            discount_type: "fixed",
                                            discount_value: 0,
                                            discount_amount: 0,
                                            total_price: 0,
                                            has_expiry: false,
                                            manufacturing_date: "",
                                            shelf_life_days: 0,
                                            batch_no: ""
                                        }]);
                                        setPaidCash(0);
                                        setGivenCash(0);
                                        setPaidMobile(0);
                                        setPaidBank(0);
                                        setGlobalDiscountValue(0);
                                    }
                                }}
                                className="w-1/3 py-1 border border-gray-400 rounded-lg text-gray-500 hover:bg-gray-100 font-bold text-[9px] uppercase tracking-wider transition-all text-center animate-all">
                            Clear Cart
                        </button>
                        <button type="button"
                                onClick={() => {
                                    if (!supplier) return alert("Please select a supplier");
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
        <div className="flex flex-col h-screen overflow-hidden bg-white">
            <Navbar/>
            <div className="flex-1 p-3 overflow-hidden">
                <form onSubmit={(e) => { e.preventDefault(); }}
                      className="flex flex-col lg:flex-row gap-4 h-full overflow-hidden text-gray-800">

                    {/* Background Invisible Barcode Receptor */}
                    <input ref={barcodeRef} onKeyDown={handleBarcodeScan}
                           className="absolute opacity-0 pointer-events-none"/>

                    {/* LEFT PANEL: Category & Subcategory Product List Filter */}
                    <div
                        className="w-full lg:w-[65%] flex flex-col h-full bg-gray-50 p-2.5 rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300">
                    {/* Search & Filters Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-3 shrink-0 items-end">
                        {/* Toggle sidebar button and Search Input */}
                        <div className="flex gap-1.5 items-end lg:col-span-1">
                            <button
                                type="button"
                                onClick={() => setIsCategorySidebarOpen(!isCategorySidebarOpen)}
                                title={isCategorySidebarOpen ? "Hide Categories" : "Show Categories"}
                                className="p-1.5 bg-white border border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-500 transition-colors shadow-sm cursor-pointer shrink-0 h-[28px] flex items-center justify-center mb-[1px]"
                            >
                                {isCategorySidebarOpen ? <FolderOpen size={14} /> : <Folder size={14} />}
                            </button>
                            <div className="relative flex-1">
                                <label
                                    className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">Search</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-400">
                                        <Search size={12}/>
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Code/title..."
                                        className="w-full pl-8 pr-2 py-1 bg-white border border-gray-300 rounded-lg text-[10px] font-bold text-gray-700 outline-none focus:border-blue-500 transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label
                                className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">Category</label>
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
                                className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">Subcategory</label>
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
                                className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">Brand</label>
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
                                className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">Size</label>
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
                                className="block text-[8px] font-black uppercase text-gray-500 tracking-wider mb-0.5 pl-0.5">Unit</label>
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
                                className={`w-full text-[9px] font-extrabold px-2 py-1 rounded-lg transition-all duration-200 border flex items-center justify-center gap-1 h-[28px] ${
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
                            className="flex justify-between items-center px-1 pb-2 mb-2 border-b border-gray-200 text-[10px] text-gray-550 font-bold tracking-wide shrink-0">
                            <span>
                                Showing {filteredProducts.length} of {allProducts.length} products
                            </span>
                        </div>

                        {/* Categories sidebar list & product catalog list grid */}
                        <div className="flex flex-1 overflow-hidden gap-2">
                            {/* Categories List (w-1/3) */}
                            <div
                                className={`border-r border-gray-200 overflow-y-auto pr-1 text-[10px] scrollbar-thin transition-all duration-300 ${
                                    isCategorySidebarOpen ? "w-[25%] block" : "hidden"
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

                            {/* Product Cards List (w-2/3) */}
                            <div
                                className={`overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 p-0.5 content-start scrollbar-thin transition-all duration-300 ${
                                    isCategorySidebarOpen ? "w-[75%]" : "w-full"
                                }`}
                            >
                                {filteredProducts.map((product) => {
                                    const isLowStock = Number(product.stock) <= Number(product.alarm_when_stock_is_lessthanOrEqualto);
                                    const isOutOfStock = Number(product.stock) <= 0;
                                    return (
                                        <div
                                            key={product.id}
                                            onClick={() => handleAddProductToCart(product)}
                                            className="group bg-white rounded-xl border border-gray-200 p-2 flex flex-col justify-between transition-all duration-200 relative overflow-hidden cursor-pointer hover:border-blue-500 hover:shadow-md active:scale-95"
                                        >
                                            <div
                                                className="relative aspect-video rounded-lg overflow-hidden bg-gray-50 mb-1.5 shrink-0">
                                                <img
                                                    src={product.image || "https://assets.turbologo.com/blog/en/2021/09/10093610/photo-camera-958x575.png"}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                                                />
                                                <span
                                                    className={`absolute top-0.5 left-0.5 px-1 py-0.5 text-[7px] font-black rounded text-white shadow-sm z-10 uppercase tracking-wider ${
                                                        isOutOfStock ? 'bg-gray-500 shadow-gray-500/10' : isLowStock ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/10' : 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/10'
                                                    }`}
                                                >
                                                    Qty: {product.stock}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-bold text-gray-800 line-clamp-1 leading-tight mb-0.5">{product.name}</h4>
                                                <p className="text-[8px] text-gray-400 font-mono tracking-wider">#{product.product_code || '---'}</p>
                                            </div>
                                            <div
                                                className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-100">
                                                <span
                                                    className="text-[10px] font-extrabold text-blue-600">৳{Number(product.purchase_price).toLocaleString()}</span>
                                                <span
                                                    className="text-[8px] text-gray-400 uppercase tracking-wide font-medium">{product.unit_name || 'pcs'}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Mobile Floating Cart Trigger */}
                        {isMobile && (
                            <div className="p-2 bg-white border-t border-gray-200 mt-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsMobileCartOpen(true)}
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={14}/>
                                    <span>View Invoice Cart ({items.length} items - ৳{netTotal.toFixed(0)})</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {!isMobile && renderRightPanel(false)}
                </form>
            </div>

            {/* Supplier CRM Modals */}
            <AddSupplierModal
                isOpen={isAddSupplierOpen}
                onClose={() => {
                    setIsAddSupplierOpen(false);
                    if (isMobile) setIsMobileCartOpen(true);
                }}
                onSuccess={(newSupplier) => {
                    handleSupplierAdded(newSupplier);
                    if (isMobile) setIsMobileCartOpen(true);
                }}
            />

            <BaseModal
                isOpen={isViewSupplierOpen}
                onClose={() => {
                    setIsViewSupplierOpen(false);
                    if (isMobile) setIsMobileCartOpen(true);
                }}
                title="Supplier Profile Details"
                size="md"
                variant="clean"
                showFooter={false}
                isLoading={loadingDetails}
                icon={<Eye className="text-blue-600"/>}
            >
                {supplierDetails ? (
                    <div className="space-y-6 text-gray-800">
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center py-2">
                            <div
                                className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-150 shadow-lg bg-gray-100 flex items-center justify-center">
                                {supplierDetails.image ? (
                                    <img src={supplierDetails.image} className="w-full h-full object-cover"
                                         alt={supplierDetails.name}/>
                                ) : (
                                    <span
                                        className="text-gray-300 text-3xl font-black">{supplierDetails.name?.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <h3 className="mt-3 text-lg font-black text-gray-800">{supplierDetails.name}</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Supplier
                                Details Profile</p>
                        </div>

                        <div className="grid gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        className="text-[9px] font-black text-gray-450 uppercase tracking-wider block mb-0.5">Phone
                                        Number</label>
                                    <span
                                        className="font-bold text-gray-800 text-sm font-mono">{supplierDetails.phone}</span>
                                </div>
                                <div>
                                    <label
                                        className="text-[9px] font-black text-gray-450 uppercase tracking-wider block mb-0.5">Email
                                        Address</label>
                                    <span
                                        className="font-bold text-gray-855 text-sm font-mono break-all">{supplierDetails.email || "N/A"}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200/60">
                                <div>
                                    <label
                                        className="text-[9px] font-black text-gray-450 uppercase tracking-wider block mb-0.5">Address
                                        Location</label>
                                    <span
                                        className="font-bold text-gray-855 text-xs block leading-relaxed">{supplierDetails.address || "N/A"}</span>
                                </div>
                                <div>
                                    <label
                                        className="text-[9px] font-black text-red-500 uppercase tracking-wider block mb-0.5">Vendor
                                        Balance / Due</label>
                                    <span
                                        className="font-black text-red-600 text-base font-mono">৳{Number(supplierDetails.due_amount || 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsViewSupplierOpen(false);
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
                        <p className="text-xs font-bold uppercase tracking-wider">Loading Supplier Details...</p>
                    </div>
                )}
            </BaseModal>

            {/* Success Invoice Recorded Modal */}
            {successData && (
                <SuccessModal
                    isOpen={showSuccess}
                    onClose={() => {
                        setShowSuccess(false);
                        setSuccessData(null);
                    }}
                    title="Purchase Recorded Successfully"
                    subtitle={successData ? `Invoice #${successData.invoice_no} Generated` : ""}
                    details={successData ? [
                        {label: "Net Cost Payable", value: `৳${parseFloat(successData.net_total || 0).toLocaleString()}`},
                        {label: "Total Paid", value: `৳${parseFloat(successData.paid_amount || 0).toLocaleString()}`},
                        {label: "Invoice Due", value: `৳${parseFloat(successData.due_amount || 0).toLocaleString()}`},
                    ] : []}
                    onPrint={successData ? () => handlePrint(successData) : null}
                    printText="Print Voucher"
                />
            )}

            {/* Mobile Cart Modal */}
            {isMobile && (
                <BaseModal
                    isOpen={isMobileCartOpen}
                    onClose={() => setIsMobileCartOpen(false)}
                    title="Purchase Invoice Cart"
                    size="4xl"
                    variant="clean"
                    showFooter={false}
                    icon={<ShoppingCart className="text-blue-600"/>}
                >
                    <div className="max-h-[80vh] overflow-y-auto p-1 text-gray-800">
                        {renderRightPanel(true)}
                    </div>
                </BaseModal>
            )}

            {/* Add Quick Cash Modal */}
            <BaseModal
                isOpen={isAddQuickCashOpen}
                onClose={() => {
                    setIsAddQuickCashOpen(false);
                    if (isMobile) setIsMobileCartOpen(true);
                }}
                title="Add Quick Cash Option"
                size="sm"
                onSubmit={handleAddQuickCash}
                submitText="Save"
                isLoading={quickCashLoading}
                icon={<Coins className="text-emerald-600"/>}
            >
                <div className="space-y-4 text-gray-800">
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Amount (৳) *</label>
                        <input
                            type="number"
                            required
                            className="w-full border border-gray-200 p-2.5 rounded-xl font-bold mt-1"
                            value={quickCashAmount}
                            onChange={(e) => setQuickCashAmount(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Name / Label (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. 500 Taka Note"
                            className="w-full border border-gray-200 p-2.5 rounded-xl font-bold mt-1"
                            value={quickCashName}
                            onChange={(e) => setQuickCashName(e.target.value)}
                        />
                    </div>
                </div>
            </BaseModal>

            {/* Payment Modal */}
            <BaseModal
                isOpen={isPaymentModalOpen}
                onClose={() => {
                    setIsPaymentModalOpen(false);
                    if (isMobile) setIsMobileCartOpen(true);
                }}
                title="Purchase Payment Processing"
                size="2xl"
                variant="clean"
                showFooter={false}
                icon={<Coins className="text-blue-600"/>}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:max-h-[75vh] max-h-[75vh] lg:overflow-hidden overflow-y-auto text-gray-800 scrollbar-thin animate-in fade-in duration-200">
                    {/* Left Column: Cart Overview */}
                    <div className="lg:col-span-5 flex flex-col lg:h-full lg:overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 pr-0 lg:pr-4">
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 mb-3 shrink-0">
                            <span
                                className="text-[9px] font-black uppercase text-blue-900 block mb-0.5">Selected Supplier</span>
                            <div className="font-extrabold text-sm text-gray-800">
                                {supplier?.label}
                            </div>
                            <div className="mt-1 flex justify-between text-[10px] text-gray-550 font-bold">
                                <span>Previous CRM Balance:</span>
                                <span className="text-red-655 font-black">৳{previousDue.toFixed(2)}</span>
                            </div>
                        </div>

                        <h4 className="text-[10px] font-black uppercase text-gray-550 tracking-wider mb-2 shrink-0">Cart Items Overview</h4>
                        <div
                            className="lg:flex-1 max-h-[160px] lg:max-h-none overflow-y-auto border border-gray-150 rounded-xl bg-gray-55 mb-3 scrollbar-thin">
                            <table className="w-full text-left border-collapse text-[10px]">
                                <thead>
                                <tr className="border-b border-gray-250 text-gray-400 uppercase font-bold bg-gray-100/90 sticky top-0">
                                    <th className="py-2 px-2">Item</th>
                                    <th className="py-2 px-2 text-right">Cost Price</th>
                                    <th className="py-2 px-2 text-center">Qty</th>
                                    <th className="py-2 px-2 text-right">Total</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-150 bg-white">
                                {items.filter(i => i.product).map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-55/50">
                                        <td className="py-2 px-2 font-medium">
                                            <div className="line-clamp-1">{item.product_name}</div>
                                        </td>
                                        <td className="py-2 px-2 text-right font-mono font-bold text-gray-700">৳{Number(item.unit_price).toFixed(0)}</td>
                                        <td className="py-2 px-2 text-center font-mono font-bold text-gray-800">{item.quantity}</td>
                                        <td className="py-2 px-2 text-right font-mono font-black text-blue-600">৳{item.total_price.toFixed(0)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Invoice Summary Card below cart */}
                        <div
                            className="bg-gray-900 text-white py-2 px-3 rounded-xl flex items-center justify-between gap-3 shadow-md mb-2 shrink-0">
                            <div className="flex items-center gap-4 text-[10px] w-full justify-center">
                                <div className="text-gray-400">
                                    Subtotal:<span
                                    className="font-mono font-bold text-white ml-1">৳{subtotal.toFixed(0)}</span>
                                </div>
                                {globalDiscountAmount > 0 && (
                                    <div className="text-green-400">
                                        Disc:<span
                                        className="font-mono font-bold ml-1">-৳{globalDiscountAmount.toFixed(0)}</span>
                                    </div>
                                )}
                                <div className="text-emerald-400 font-bold text-[11px]">
                                    Net:<span
                                    className="font-mono font-black text-sm ml-1">৳{netTotal.toFixed(0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment Inputs */}
                    <div className="lg:col-span-7 flex flex-col space-y-4">
                        {/* Interactive Payments Channels */}
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-3 shadow-inner">
                            <label className="block text-[10px] font-black uppercase text-gray-555 tracking-wider">Payment Channels</label>
                            
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="text-[8px] font-extrabold uppercase text-slate-400">Cash</label>
                                    <input
                                        type="number"
                                        className="w-full border p-1 rounded-lg font-bold text-xs bg-white focus:border-blue-500 outline-none font-mono focus:shadow-md mt-0.5"
                                        value={paidCash || ""}
                                        onChange={(e) => setPaidCash(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="text-[8px] font-extrabold uppercase text-slate-400">Mobile</label>
                                    <input
                                        type="number"
                                        className="w-full border p-1 rounded-lg font-bold text-xs bg-white focus:border-blue-500 outline-none font-mono focus:shadow-md mt-0.5"
                                        value={paidMobile || ""}
                                        onChange={(e) => setPaidMobile(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="text-[8px] font-extrabold uppercase text-slate-400">Bank</label>
                                    <input
                                        type="number"
                                        className="w-full border p-1 rounded-lg font-bold text-xs bg-white focus:border-blue-500 outline-none font-mono focus:shadow-md mt-0.5"
                                        value={paidBank || ""}
                                        onChange={(e) => setPaidBank(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            {/* Mobile operator details */}
                            {paidMobile > 0 && (
                                <div className="grid grid-cols-2 gap-2.5 p-2.5 bg-orange-50/50 rounded-xl border border-orange-100 animate-in fade-in duration-200">
                                    <div>
                                        <label className="text-[9px] uppercase font-black text-orange-850">Operator</label>
                                        <select
                                            className="w-full border p-1.5 rounded-lg bg-white text-xs outline-none font-bold mt-1"
                                            value={mobileOperator}
                                            onChange={(e) => setMobileOperator(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="bkash">bKash</option>
                                            <option value="nagad">Nagad</option>
                                            <option value="rocket">Rocket</option>
                                            <option value="upay">Upay</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[9px] uppercase font-black text-orange-855">Trx ID</label>
                                        <input
                                            className="w-full border p-1.5 rounded-lg bg-white text-xs font-mono outline-none mt-1"
                                            value={transactionId}
                                            onChange={(e) => setTransactionId(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Bank details */}
                            {paidBank > 0 && (
                                <div className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-200 animate-in fade-in duration-200">
                                    <label className="text-[9px] uppercase font-black text-blue-700">Bank A/C Number</label>
                                    <input
                                        className="w-full border p-1.5 rounded-lg bg-white text-xs font-mono outline-none mt-1"
                                        value={bankAccountNo}
                                        onChange={(e) => setBankAccountNo(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-between text-[10px] border-t border-gray-100 pt-2.5 mt-1">
                                <span className="text-gray-400 font-bold uppercase">Payment Proof File</span>
                                <input
                                    type="file"
                                    className="text-[9px] font-bold text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[9px] file:font-black file:bg-blue-55 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    onChange={(e) => setPaymentProof(e.target.files[0])}
                                />
                            </div>
                        </div>

                        {/* Cash Calculator */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-250 p-4 rounded-xl space-y-3 shadow-sm">
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
                                    <label className="text-[9px] font-black uppercase text-emerald-750 block mb-1">Cash Given (৳)</label>
                                    <input type="number" min="0"
                                           className="w-full border-2 border-emerald-300 p-2 rounded-lg font-black text-sm bg-white outline-none font-mono focus:border-emerald-500 text-emerald-800 placeholder-emerald-200"
                                           placeholder="0.00" value={givenCash || ""}
                                           onChange={(e) => setGivenCash(Number(e.target.value))}/>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase text-rose-700 block mb-1">Change / Overpay (৳)</label>
                                    <div
                                        className={`w-full border-2 rounded-lg p-2 font-black text-sm font-mono text-center flex items-center justify-center h-[34px] ${
                                            givenCash > netTotal ? 'bg-rose-100 border-rose-400 text-rose-700' :
                                                givenCash > 0 ? 'bg-yellow-100 border-yellow-350 text-yellow-855 font-bold' :
                                                    'bg-gray-100 border-gray-300 text-gray-400'
                                        }`}>৳{Math.max(0, givenCash - netTotal).toFixed(0)}</div>
                                </div>
                            </div>
                            
                            {/* Quick cash shortcuts */}
                            {quickCashList && quickCashList.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-emerald-200/50 items-center">
                                    {quickCashList.map((qc) => (
                                        <button key={qc.id} type="button"
                                                onClick={() => setGivenCash(prev => Number(prev) + Number(qc.amount))}
                                                className="flex items-center gap-1 px-2 py-1 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-600 hover:text-white hover:border-emerald-650 transition-all active:scale-95 shadow-sm group">
                                            {qc.image ? (
                                                <img src={qc.image} alt={qc.name}
                                                     className="w-4 h-4 object-contain rounded"/>
                                            ) : (
                                                <span className="text-[9px] font-black text-emerald-700 group-hover:text-white">৳</span>
                                            )}
                                            <span className="text-[10px] font-black text-gray-700 group-hover:text-white font-mono">
                                                 {Number(qc.amount) >= 1000 ? `${(Number(qc.amount) / 1000).toFixed(Number(qc.amount) % 1000 === 0 ? 0 : 1)}K` : Number(qc.amount).toFixed(0)}
                                             </span>
                                        </button>
                                    ))}
                                    <button type="button" onClick={() => {
                                        setIsAddQuickCashOpen(true);
                                        if (isMobile) setIsMobileCartOpen(false);
                                    }}
                                            className="flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-dashed border-emerald-355 rounded-lg transition-all active:scale-95 text-emerald-700 hover:border-emerald-600 font-bold text-[9px] shadow-sm group">
                                        <Coins size={10} className="text-emerald-600 group-hover:text-white"/>
                                        <span>Add Shortcuts</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Summary & Buttons */}
                        <div className="bg-gray-100 p-3.5 rounded-xl space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center text-[10px]">
                                {/* Amount Received */}
                                <div className="p-2 bg-white border border-gray-200 rounded-lg flex flex-col justify-center min-w-0">
                                    <p className="text-gray-500 font-bold uppercase mb-0.5 truncate">Total Paid</p>
                                    <p className="text-xs font-black font-mono text-blue-650">৳{totalPaid.toFixed(2)}</p>
                                </div>

                                {/* Invoice Due */}
                                <div className="p-2 bg-white border border-gray-200 rounded-lg flex flex-col justify-center min-w-0">
                                    <p className="text-gray-550 font-bold uppercase mb-0.5 truncate">Invoice Due</p>
                                    <p className="text-xs font-black font-mono text-red-500">৳{currentInvoiceDue.toFixed(2)}</p>
                                </div>

                                {/* Supplier Due Balance */}
                                <div className="p-2 bg-blue-55 border border-blue-200 rounded-lg flex flex-col justify-center min-w-0">
                                    <p className="text-blue-600 font-bold uppercase mb-0.5 truncate">Vendor Due</p>
                                    <p className="text-xs font-black text-blue-700 font-mono">৳{totalSupplierDue.toFixed(2)}</p>
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
                                        disabled={loading}
                                        className="flex-1 py-2.5 font-black rounded-xl text-xs uppercase tracking-widest text-white shadow-md transition-all active:scale-98 bg-blue-600 hover:bg-blue-700 shadow-blue-500/10">
                                    {loading ? "Processing..." : "✓ Confirm Purchase"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseModal>
        </div>
    );
};

export default PosPurchase;
