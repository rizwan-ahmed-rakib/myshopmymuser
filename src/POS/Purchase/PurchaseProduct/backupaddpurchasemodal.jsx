import React, { useEffect, useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
import { posPurchaseProductAPI } from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
import { posSupplierAPI } from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";
import BASE_URL_of_POS from "../../../posConfig";
import SuccessModal from "./SuccessModal";

const emptyItem = {
    product: null,
    product_name: "",
    unit_price: 0,
    quantity: 1,
    discount_type: "fixed", // "fixed" or "percent"
    discount_value: 0,
    discount_amount: 0,
    total_price: 0,
    has_expiry: false,
    manufacturing_date: "",
    shelf_life_days: 0,
    batch_no: "",
};

const AddPurchasePage = ({ isOpen, onClose, onSuccess }) => {
    /* ---------------- STATE ---------------- */
    const [supplier, setSupplier] = useState(null);
    const [items, setItems] = useState([{ ...emptyItem }]);

    // Hybrid Payment States
    const [paidCash, setPaidCash] = useState(0);
    const [paidMobile, setPaidMobile] = useState(0);
    const [paidBank, setPaidBank] = useState(0);

    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [globalDiscountType, setGlobalDiscountType] = useState("fixed"); // "fixed" or "percent"
    const [globalDiscountValue, setGlobalDiscountValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);

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

    useEffect(() => {
        if (isOpen && barcodeRef.current) {
            barcodeRef.current.focus();
        }
    }, [isOpen]);

    if (!isOpen && !showSuccess) return null;

    /* ---------------- SUPPLIER SEARCH ---------------- */
    const loadSupplierOptions = async (inputValue) => {
        const res = await posSupplierAPI.search(inputValue || "");
        return res.data.map(s => ({
            value: s.id,
            label: s.name,
            due_amount: Number(s.due_amount || 0),
            image: s.image,
        }));
    };

    /* ---------------- PRODUCT SEARCH ---------------- */
    const loadProductOptions = async (inputValue) => {
        if (!inputValue) return [];
        const res = await posProductAPI.search(inputValue);
        return res.data.map(p => ({
            value: p.id,
            label: `${p.name} (${p.product_code})`,
            unit_price: Number(p.purchase_price),
            product_name: p.name,
            has_expiry: p.has_expiry,
        }));
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
            const newItem = { ...updated[index], ...updates };
            const { total_price, discount_amount } = calculateItemTotal(newItem);
            updated[index] = { ...newItem, total_price, discount_amount };
            return updated;
        });
    };

    const selectProduct = (option, index) => {
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

    /* ---------------- BARCODE SCAN ---------------- */
    const handleBarcodeScan = async (e) => {
        if (e.key !== "Enter") return;

        const code = e.target.value.trim();
        if (!code) return;

        try {
            const res = await posProductAPI.search(code);
            if (res.data.length) {
                const p = res.data[0];
                selectProduct(
                    {
                        value: p.id,
                        label: p.name,
                        product_name: p.name,
                        unit_price: Number(p.purchase_price),
                        has_expiry: p.has_expiry,
                    },
                    items.length - 1
                );
            }
        } catch (err) {
            console.error("Barcode scan failed", err);
        }

        e.target.value = "";
    };

    /* ---------------- ITEM HANDLERS ---------------- */
    const updateItemField = (index, field, value) => {
        updateItem(index, { [field]: value });
    };

    const updateQty = (index, qty) => {
        updateItem(index, { quantity: qty });
    };

    const addRow = () => setItems([...items, { ...emptyItem }]);
    const removeRow = (index) => {
        if (items.length === 1) setItems([{ ...emptyItem }]);
        else setItems(items.filter((_, i) => i !== index));
    };

    /* ---------------- CALCULATIONS ---------------- */
    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
    const globalDiscountAmount = globalDiscountType === "percent"
        ? (subtotal * globalDiscountValue) / 100
        : globalDiscountValue;

    const netTotal = Math.max(0, subtotal - globalDiscountAmount);
    const totalPaid = Number(paidCash) + Number(paidMobile) + Number(paidBank);
    const currentInvoiceDue = netTotal - totalPaid;
    const previousDue = supplier?.due_amount || 0;
    const totalSupplierDue = previousDue + currentInvoiceDue;

    // payment methods active count for UI styling
    const activePaymentMethodsCount = [paidCash > 0, paidMobile > 0, paidBank > 0].filter(Boolean).length;

    /* ---------------- SUBMIT ---------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!supplier) {
            setErrors({ supplier: "Supplier required" });
            return;
        }

        if (items.some(i => !i.product)) {
            setErrors({ items: "All product rows must be filled" });
            return;
        }

        // Calculate itemwise total discount
        const itemwise_total_discount = items.reduce((sum, i) => sum + i.discount_amount, 0);

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
            items: items.map(i => ({
                product: i.product,
                quantity: i.quantity,
                unit_price: i.unit_price,
                discount_amount: i.discount_amount,
                net_total: i.total_price,
                manufacturing_date: i.has_expiry ? i.manufacturing_date : null,
                shelf_life_days: i.has_expiry ? i.shelf_life_days : 0,
                batch_no: i.has_expiry ? i.batch_no : "",
            })),
        };

        try {
            setLoading(true);
            const res = await posPurchaseProductAPI.create(payload);
            setInvoiceData(res.data);
            setShowSuccess(true);
        } catch (err) {
            setErrors(err.response?.data || {});
            console.error("Purchase creation failed", err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- UI ---------------- */
    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white w-full max-w-6xl rounded-xl shadow-lg max-h-[95vh] overflow-y-auto">

                        <input
                            ref={barcodeRef}
                            onKeyDown={handleBarcodeScan}
                            className="absolute opacity-0"
                        />

                        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                            <h2 className="text-2xl font-bold text-gray-800">New Purchase Invoice</h2>
                            <button onClick={onClose} type="button" className="text-3xl font-light hover:text-red-500 transition-colors">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-blue-900 mb-2">Supplier *</label>
                                        <AsyncSelect
                                            cacheOptions
                                            defaultOptions
                                            loadOptions={loadSupplierOptions}
                                            value={supplier}
                                            onChange={setSupplier}
                                            placeholder="Select supplier..."
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        />
                                    </div>
                                    {supplier && (
                                        <div className="bg-white px-4 py-2 rounded-md border border-blue-200 shadow-sm min-w-[150px]">
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Previous Due</p>
                                            <p className="text-xl font-black text-red-600">৳{previousDue.toFixed(2)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="hidden lg:grid grid-cols-12 gap-4 px-2 text-sm font-bold text-gray-600 uppercase tracking-wider">
                                    <div className="col-span-4">Product / Item</div>
                                    <div className="col-span-1 text-right">Price</div>
                                    <div className="col-span-1 text-center">Qty</div>
                                    <div className="col-span-2 text-center">Discount</div>
                                    <div className="col-span-2 text-right">Total</div>
                                    <div className="col-span-2 text-center">Action</div>
                                </div>

                                <div className="space-y-3">
                                    {items.map((item, index) => (
                                        <div key={index} className="border rounded-xl bg-white shadow-sm overflow-hidden">
                                            <div className="lg:grid lg:grid-cols-12 gap-4 p-4 items-center bg-white">
                                                <div className="col-span-4">
                                                    <AsyncSelect
                                                        loadOptions={loadProductOptions}
                                                        defaultOptions
                                                        onChange={(opt) => selectProduct(opt, index)}
                                                        value={item.product ? { value: item.product, label: item.product_name } : null}
                                                        placeholder="Search or scan..."
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                    />
                                                </div>

                                                <div className="col-span-1">
                                                    <input className="w-full border p-2 rounded text-right font-mono text-sm bg-gray-50" value={item.unit_price} disabled />
                                                </div>

                                                <div className="col-span-1">
                                                    <input
                                                        className="w-full border p-2 rounded text-center font-bold outline-none focus:border-blue-500"
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updateQty(index, Number(e.target.value))}
                                                    />
                                                </div>

                                                <div className="col-span-2 flex items-center gap-1">
                                                    <select
                                                        className="border p-2 rounded text-xs bg-gray-50 outline-none"
                                                        value={item.discount_type}
                                                        onChange={(e) => updateItem(index, { discount_type: e.target.value })}
                                                    >
                                                        <option value="fixed">৳</option>
                                                        <option value="percent">%</option>
                                                    </select>
                                                    <input
                                                        type="number"
                                                        className="w-full border p-2 rounded text-right text-sm outline-none focus:border-blue-500"
                                                        placeholder="0"
                                                        value={item.discount_value || ""}
                                                        onChange={(e) => updateItem(index, { discount_value: Number(e.target.value) })}
                                                    />
                                                </div>

                                                <div className="col-span-2 text-right px-2">
                                                    <span className="font-bold font-mono text-blue-700 text-lg">৳{item.total_price.toFixed(2)}</span>
                                                    {item.discount_amount > 0 && <p className="text-[10px] text-green-600 font-bold">Saved: ৳{item.discount_amount.toFixed(2)}</p>}
                                                </div>

                                                <div className="col-span-2 flex justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRow(index)}
                                                        className="px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100 font-bold"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {item.has_expiry && (
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 border-t border-blue-100">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">Manufacturing Date</label>
                                                        <input
                                                            type="date"
                                                            className="w-full border border-blue-200 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                                            value={item.manufacturing_date}
                                                            onChange={(e) => updateItemField(index, "manufacturing_date", e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">Shelf Life (Days)</label>
                                                        <input
                                                            type="number"
                                                            className="w-full border border-blue-200 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                                            value={item.shelf_life_days}
                                                            placeholder="0"
                                                            onChange={(e) => updateItemField(index, "shelf_life_days", Number(e.target.value))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">Batch Number</label>
                                                        <input
                                                            className="w-full border border-blue-200 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Batch No"
                                                            value={item.batch_no}
                                                            onChange={(e) => updateItemField(index, "batch_no", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={addRow} className="flex items-center gap-2 text-blue-600 font-bold px-4 py-2 border-2 border-dashed border-blue-200 rounded-xl hover:bg-blue-50 transition-all w-full justify-center">
                                        + Add Another Product Row
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t">
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-xl border">
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Payment Method Status</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {['cash', 'mobile_banking', 'bank', 'hybrid'].map(method => (
                                                <button
                                                    key={method}
                                                    type="button"
                                                    className={`py-2 px-1 rounded-lg capitalize text-[10px] font-bold transition-all ${paymentMethod === method ? 'bg-blue-600 text-white shadow-md' : 'bg-white border text-gray-400 opacity-50'}`}
                                                    disabled={true}
                                                >
                                                    {method.replace('_', ' ')}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-2 italic">* Auto-detected based on payment inputs below</p>
                                    </div>

                                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                        <label className="block text-sm font-semibold text-green-900 mb-2">Overall Invoice Discount</label>
                                        <div className="flex gap-2">
                                            <select
                                                className="border p-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                                value={globalDiscountType}
                                                onChange={(e) => setGlobalDiscountType(e.target.value)}
                                            >
                                                <option value="fixed">Fixed (৳)</option>
                                                <option value="percent">Percentage (%)</option>
                                            </select>
                                            <input
                                                type="number"
                                                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500 font-bold"
                                                placeholder="0.00"
                                                value={globalDiscountValue || ""}
                                                onChange={(e) => setGlobalDiscountValue(Number(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-900 text-white p-6 rounded-2xl space-y-4 shadow-xl">
                                    <div className="space-y-2 text-sm border-b border-gray-800 pb-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 font-medium">Items Subtotal</span>
                                            <span className="font-mono font-bold">৳{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-green-400">
                                            <span className="font-medium">Global Discount</span>
                                            <span className="font-mono font-bold">- ৳{globalDiscountAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg pt-2 border-t border-gray-800">
                                            <span className="text-gray-400 font-bold">Net Total</span>
                                            <span className="font-mono font-black text-white text-2xl">৳{netTotal.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-inner">
                                        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 text-center">Payment Details ({paymentMethod.replace('_', ' ')})</p>

                                        <div className="flex justify-between items-center gap-4">
                                            <span className="text-xs font-semibold text-gray-400">Cash</span>
                                            <input
                                                className="bg-gray-950 border border-gray-700 rounded-lg px-2 py-1 text-right w-28 outline-none font-bold text-white focus:border-blue-500"
                                                type="number"
                                                value={paidCash}
                                                onChange={(e) => setPaidCash(Number(e.target.value))}
                                                placeholder="0"
                                            />
                                        </div>

                                        <div className="flex justify-between items-center gap-4">
                                            <span className="text-xs font-semibold text-gray-400">Mobile Banking</span>
                                            <input
                                                className="bg-gray-950 border border-gray-700 rounded-lg px-2 py-1 text-right w-28 outline-none font-bold text-white focus:border-blue-500"
                                                type="number"
                                                value={paidMobile}
                                                onChange={(e) => setPaidMobile(Number(e.target.value))}
                                                placeholder="0"
                                            />
                                        </div>

                                        <div className="flex justify-between items-center gap-4">
                                            <span className="text-xs font-semibold text-gray-400">Bank Transfer</span>
                                            <input
                                                className="bg-gray-950 border border-gray-700 rounded-lg px-2 py-1 text-right w-28 outline-none font-bold text-white focus:border-blue-500"
                                                type="number"
                                                value={paidBank}
                                                onChange={(e) => setPaidBank(Number(e.target.value))}
                                                placeholder="0"
                                            />
                                        </div>

                                        <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                                            <span className="text-sm font-bold text-blue-400 uppercase">Total Paid</span>
                                            <span className="font-mono font-black text-white text-xl">৳{totalPaid.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-xl">
                                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-1">Invoice Due</p>
                                            <p className="text-xl font-black text-red-500">৳{currentInvoiceDue.toFixed(2)}</p>
                                        </div>
                                        <div className="p-3 bg-blue-900/20 border border-blue-900/30 rounded-xl">
                                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Total Supplier Due</p>
                                            <p className="text-xl font-black text-blue-400">৳{totalSupplierDue.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={onClose} className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors">Discard</button>
                                <button disabled={loading} className="px-12 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg hover:bg-blue-700 disabled:bg-blue-300 transition-all uppercase tracking-wider">
                                    {loading ? "Processing..." : "Confirm Purchase"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            <SuccessModal
                isOpen={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    onSuccess?.(invoiceData);
                    onClose();
                }}
                invoice={invoiceData}
                previousDue={previousDue}
            />
        </>
    );
};

export default AddPurchasePage;



///////////////////////////////////////////////////


// import React, { useEffect, useRef, useState } from "react";
// import AsyncSelect from "react-select/async";
// import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
// import { posPurchaseProductAPI } from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
// import { posSupplierAPI } from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";
// import BASE_URL_of_POS from "../../../posConfig";
// import SuccessModal from "./SuccessModal";
// import axios from "axios";
//
// const emptyItem = {
//     product: null,
//     product_name: "",
//     unit_price: 0,
//     quantity: 1,
//     discount_type: "fixed",
//     discount_value: 0,
//     discount_amount: 0,
//     total_price: 0,
//     has_expiry: false,
//     manufacturing_date: "",
//     shelf_life_days: 0,
//     batch_no: "",
// };
//
// const AddPurchasePage = ({ isOpen, onClose, onSuccess }) => {
//     const [supplier, setSupplier] = useState(null);
//     const [items, setItems] = useState([{ ...emptyItem }]);
//
//     // Hybrid Payment States
//     const [paidCash, setPaidCash] = useState(0);
//     const [paidMobile, setPaidMobile] = useState(0);
//     const [paidBank, setPaidBank] = useState(0);
//
//     // Detail States
//     const [mobileOperator, setMobileOperator] = useState("");
//     const [transactionId, setTransactionId] = useState("");
//     const [bankAccountNo, setBankAccountNo] = useState("");
//     const [paymentProof, setPaymentProof] = useState(null);
//
//     const [paymentMethod, setPaymentMethod] = useState("cash");
//     const [globalDiscountType, setGlobalDiscountType] = useState("fixed");
//     const [globalDiscountValue, setGlobalDiscountValue] = useState(0);
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [showSuccess, setShowSuccess] = useState(false);
//     const [invoiceData, setInvoiceData] = useState(null);
//
//     const barcodeRef = useRef(null);
//
//     useEffect(() => {
//         const counts = [paidCash > 0, paidMobile > 0, paidBank > 0].filter(Boolean).length;
//         if (counts > 1) setPaymentMethod("hybrid");
//         else if (paidMobile > 0) setPaymentMethod("mobile_banking");
//         else if (paidBank > 0) setPaymentMethod("bank");
//         else setPaymentMethod("cash");
//     }, [paidCash, paidMobile, paidBank]);
//
//     useEffect(() => {
//         if (isOpen && barcodeRef.current) barcodeRef.current.focus();
//     }, [isOpen]);
//
//     if (!isOpen && !showSuccess) return null;
//
//     const loadSupplierOptions = async (inputValue) => {
//         const res = await posSupplierAPI.search(inputValue || "");
//         return res.data.map(s => ({
//             value: s.id,
//             label: s.name,
//             due_amount: Number(s.due_amount || 0),
//         }));
//     };
//
//     const loadProductOptions = async (inputValue) => {
//         if (!inputValue) return [];
//         const res = await posProductAPI.search(inputValue);
//         return res.data.map(p => ({
//             value: p.id,
//             label: `${p.name} (${p.product_code})`,
//             unit_price: Number(p.purchase_price),
//             product_name: p.name,
//             has_expiry: p.has_expiry,
//         }));
//     };
//
//     const calculateItemTotal = (item) => {
//         const baseTotal = item.unit_price * item.quantity;
//         let discount = item.discount_type === "percent" ? (baseTotal * item.discount_value) / 100 : item.discount_value;
//         return { total_price: Math.max(0, baseTotal - discount), discount_amount: discount };
//     };
//
//     const updateItem = (index, updates) => {
//         setItems(prev => {
//             const updated = [...prev];
//             const newItem = { ...updated[index], ...updates };
//             const { total_price, discount_amount } = calculateItemTotal(newItem);
//             updated[index] = { ...newItem, total_price, discount_amount };
//             return updated;
//         });
//     };
//
//     const selectProduct = (option, index) => {
//         updateItem(index, {
//             product: option.value,
//             product_name: option.product_name,
//             unit_price: option.unit_price,
//             quantity: 1,
//             has_expiry: option.has_expiry,
//         });
//     };
//
//     const handleBarcodeScan = async (e) => {
//         if (e.key !== "Enter") return;
//         const code = e.target.value.trim();
//         if (!code) return;
//         try {
//             const res = await posProductAPI.search(code);
//             if (res.data.length) {
//                 const p = res.data[0];
//                 selectProduct({ value: p.id, label: p.name, product_name: p.name, unit_price: Number(p.purchase_price), has_expiry: p.has_expiry }, items.length - 1);
//             }
//         } catch (err) { console.error(err); }
//         e.target.value = "";
//     };
//
//     const updateQty = (index, qty) => updateItem(index, { quantity: qty });
//     const addRow = () => setItems([...items, { ...emptyItem }]);
//     const removeRow = (index) => setItems(items.length === 1 ? [{ ...emptyItem }] : items.filter((_, i) => i !== index));
//
//     const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
//     const globalDiscountAmount = globalDiscountType === "percent" ? (subtotal * globalDiscountValue) / 100 : globalDiscountValue;
//     const netTotal = Math.max(0, subtotal - globalDiscountAmount);
//     const totalPaid = Number(paidCash) + Number(paidMobile) + Number(paidBank);
//     const currentInvoiceDue = netTotal - totalPaid;
//     const previousDue = supplier?.due_amount || 0;
//     const totalSupplierDue = previousDue + currentInvoiceDue;
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!supplier) { setErrors({ supplier: "Supplier required" }); return; }
//         if (items.some(i => !i.product)) { setErrors({ items: "Fill all product rows" }); return; }
//
//         const itemwise_total_discount = items.reduce((sum, i) => sum + i.discount_amount, 0);
//
//         // Prepare FormData for file upload support
//         const formData = new FormData();
//         formData.append("supplier", supplier.value);
//         formData.append("paid_cash", paidCash);
//         formData.append("paid_mobile", paidMobile);
//         formData.append("paid_bank", paidBank);
//         formData.append("payment_method", paymentMethod);
//         formData.append("subtotal", subtotal);
//         formData.append("itemwise_total_discount", itemwise_total_discount);
//         formData.append("global_discount", globalDiscountAmount);
//         formData.append("total_discount", itemwise_total_discount + globalDiscountAmount);
//         formData.append("net_total", netTotal);
//
//         // Add detail fields
//         if (paidMobile > 0) {
//             formData.append("mobile_operator", mobileOperator);
//             formData.append("transaction_id", transactionId);
//         }
//         if (paidBank > 0) {
//             formData.append("bank_account_no", bankAccountNo);
//         }
//         if (paymentProof) {
//             formData.append("payment_proof", paymentProof);
//         }
//
//         formData.append("items", JSON.stringify(items.map(i => ({
//             product: i.product,
//             quantity: i.quantity,
//             unit_price: i.unit_price,
//             discount_amount: i.discount_amount,
//             net_total: i.total_price,
//             manufacturing_date: i.has_expiry ? i.manufacturing_date : null,
//             shelf_life_days: i.has_expiry ? i.shelf_life_days : 0,
//             batch_no: i.has_expiry ? i.batch_no : "",
//         }))));
//
//         try {
//             setLoading(true);
//             // Directly using axios because FormData handling in some API wrappers can be tricky
//             const res = await axios.post(`${BASE_URL_of_POS}/api/purchase/purchases/`, formData, {
//                 headers: { "Content-Type": "multipart/form-data" }
//             });
//             setInvoiceData(res.data);
//             setShowSuccess(true);
//         } catch (err) {
//             setErrors(err.response?.data || {});
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <>
//             {isOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
//                     <div className="bg-white w-full max-w-6xl rounded-xl shadow-lg max-h-[95vh] overflow-y-auto">
//                         <input ref={barcodeRef} onKeyDown={handleBarcodeScan} className="absolute opacity-0" />
//                         <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
//                             <h2 className="text-2xl font-bold text-gray-800">New Purchase Invoice</h2>
//                             <button onClick={onClose} type="button" className="text-3xl font-light hover:text-red-500">×</button>
//                         </div>
//
//                         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-4">
//                                     <div className="w-full">
//                                         <label className="block text-sm font-semibold text-blue-900 mb-2">Supplier *</label>
//                                         <AsyncSelect cacheOptions defaultOptions loadOptions={loadSupplierOptions} value={supplier} onChange={setSupplier} placeholder="Select supplier..." />
//                                     </div>
//                                     {supplier && (
//                                         <div className="bg-white px-4 py-2 rounded-md border border-blue-200 shadow-sm min-w-[150px]">
//                                             <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Previous Due</p>
//                                             <p className="text-xl font-black text-red-600">৳{previousDue.toFixed(2)}</p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//
//                             <div className="space-y-4">
//                                 {/* Items Table Logic (Same as before) */}
//                                 {items.map((item, index) => (
//                                     <div key={index} className="border rounded-xl p-4 bg-white shadow-sm space-y-4">
//                                         <div className="lg:grid lg:grid-cols-12 gap-4 items-center">
//                                             <div className="col-span-4">
//                                                 <AsyncSelect loadOptions={loadProductOptions} defaultOptions onChange={(opt) => selectProduct(opt, index)} value={item.product ? { value: item.product, label: item.product_name } : null} placeholder="Search product..." />
//                                             </div>
//                                             <div className="col-span-2">
//                                                 <input className="w-full border p-2 rounded text-right bg-gray-50" value={item.unit_price} disabled />
//                                             </div>
//                                             <div className="col-span-2">
//                                                 <input className="w-full border p-2 rounded text-center font-bold" type="number" value={item.quantity} onChange={(e) => updateQty(index, Number(e.target.value))} />
//                                             </div>
//                                             <div className="col-span-2 flex items-center gap-1">
//                                                 <select className="border p-2 rounded text-xs" value={item.discount_type} onChange={(e) => updateItem(index, { discount_type: e.target.value })}>
//                                                     <option value="fixed">৳</option>
//                                                     <option value="percent">%</option>
//                                                 </select>
//                                                 <input type="number" className="w-full border p-2 rounded text-right" value={item.discount_value || ""} onChange={(e) => updateItem(index, { discount_value: Number(e.target.value) })} />
//                                             </div>
//                                             <div className="col-span-1 text-right font-bold text-blue-700">৳{item.total_price.toFixed(2)}</div>
//                                             <div className="col-span-1 flex justify-center"><button type="button" onClick={() => removeRow(index)} className="text-red-500 font-bold">Remove</button></div>
//                                         </div>
//                                     </div>
//                                 ))}
//                                 <button type="button" onClick={addRow} className="w-full py-2 border-2 border-dashed border-blue-200 rounded-xl text-blue-600 font-bold">+ Add Row</button>
//                             </div>
//
//                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t">
//                                 <div className="space-y-4">
//                                     <div className="bg-gray-50 p-4 rounded-xl border space-y-4">
//                                         <label className="block text-sm font-semibold text-gray-700">Payment Breakdown</label>
//                                         <div className="grid grid-cols-3 gap-4">
//                                             <div>
//                                                 <label className="text-[10px] uppercase font-bold text-gray-500">Cash</label>
//                                                 <input type="number" className="w-full border p-2 rounded-lg font-bold" value={paidCash} onChange={(e) => setPaidCash(Number(e.target.value))} />
//                                             </div>
//                                             <div>
//                                                 <label className="text-[10px] uppercase font-bold text-gray-500">Mobile</label>
//                                                 <input type="number" className="w-full border p-2 rounded-lg font-bold" value={paidMobile} onChange={(e) => setPaidMobile(Number(e.target.value))} />
//                                             </div>
//                                             <div>
//                                                 <label className="text-[10px] uppercase font-bold text-gray-500">Bank</label>
//                                                 <input type="number" className="w-full border p-2 rounded-lg font-bold" value={paidBank} onChange={(e) => setPaidBank(Number(e.target.value))} />
//                                             </div>
//                                         </div>
//
//                                         {/* Dynamic Detail Fields */}
//                                         {paidMobile > 0 && (
//                                             <div className="grid grid-cols-2 gap-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
//                                                 <div>
//                                                     <label className="text-[10px] uppercase font-bold text-orange-700">Mobile Operator</label>
//                                                     <select className="w-full border p-2 rounded-lg bg-white" value={mobileOperator} onChange={(e) => setMobileOperator(e.target.value)}>
//                                                         <option value="">Select Operator</option>
//                                                         <option value="bkash">bKash</option>
//                                                         <option value="nagad">Nagad</option>
//                                                         <option value="rocket">Rocket</option>
//                                                         <option value="upay">Upay</option>
//                                                     </select>
//                                                 </div>
//                                                 <div>
//                                                     <label className="text-[10px] uppercase font-bold text-orange-700">Transaction ID</label>
//                                                     <input className="w-full border p-2 rounded-lg" placeholder="TXN123..." value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
//                                                 </div>
//                                             </div>
//                                         )}
//
//                                         {paidBank > 0 && (
//                                             <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
//                                                 <label className="text-[10px] uppercase font-bold text-blue-700">Bank Account Number</label>
//                                                 <input className="w-full border p-2 rounded-lg" placeholder="A/C No..." value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} />
//                                             </div>
//                                         )}
//
//                                         <div>
//                                             <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Payment Proof (Optional)</label>
//                                             <input type="file" className="w-full text-xs" onChange={(e) => setPaymentProof(e.target.files[0])} />
//                                         </div>
//                                     </div>
//                                 </div>
//
//                                 <div className="bg-gray-900 text-white p-6 rounded-2xl space-y-4 shadow-xl">
//                                     <div className="flex justify-between text-lg pt-2 border-t border-gray-800">
//                                         <span className="text-gray-400 font-bold">Net Total</span>
//                                         <span className="font-mono font-black text-white text-2xl">৳{netTotal.toFixed(2)}</span>
//                                     </div>
//                                     <div className="flex justify-between items-center bg-gray-800 p-3 rounded-xl border border-gray-700">
//                                         <span className="text-blue-400 font-bold uppercase text-xs">Total Paid</span>
//                                         <span className="font-mono font-black text-white text-2xl">৳{totalPaid.toFixed(2)}</span>
//                                     </div>
//                                     <div className="grid grid-cols-2 gap-4 pt-2">
//                                         <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-xl text-center">
//                                             <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Due</p>
//                                             <p className="text-xl font-black text-red-500">৳{currentInvoiceDue.toFixed(2)}</p>
//                                         </div>
//                                         <div className="p-3 bg-blue-900/20 border border-blue-900/30 rounded-xl text-center">
//                                             <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Method</p>
//                                             <p className="text-sm font-bold text-blue-400 capitalize">{paymentMethod.replace('_', ' ')}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//
//                             <div className="flex justify-end gap-4 pt-4">
//                                 <button type="button" onClick={onClose} className="px-8 py-3 border border-gray-300 rounded-xl font-bold">Discard</button>
//                                 <button disabled={loading} className="px-12 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg hover:bg-blue-700 disabled:bg-blue-300 uppercase">
//                                     {loading ? "Processing..." : "Confirm Purchase"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//
//             <SuccessModal isOpen={showSuccess} onClose={() => { setShowSuccess(false); onSuccess?.(invoiceData); onClose(); }} invoice={invoiceData} previousDue={previousDue} />
//         </>
//     );
// };
//
// export default AddPurchasePage;
