import React, {useEffect, useRef, useState} from "react";
import AsyncSelect from "react-select/async";
import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
import {posCustomerAPI} from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";
import {posSaleProductAPI} from "../../../context_or_provider/pos/Sale/saleProduct/productSaleAPI";
import BASE_URL_of_POS from "../../../posConfig";
import SuccessModal from "./SuccessModal";
import axios from "axios";

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

const AddSaleModal = ({isOpen, onClose, onSuccess}) => {
    /* ---------------- STATE ---------------- */
    const [supplier, setSupplier] = useState(null);
    const [items, setItems] = useState([{...emptyItem}]);

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

    /* ---------------- CUSTOMER SEARCH ---------------- */
    const loadSupplierOptions = async (inputValue) => {
        const res = await posCustomerAPI.search(inputValue || "");
        return res.data.map(s => ({
            value: s.id,
            label: s.name,
            due_amount: Number(s.due_amount || 0)
        }));
    };

    /* ---------------- PRODUCT SEARCH ---------------- */
    const loadProductOptions = async (inputValue) => {
        if (!inputValue) return [];
        const res = await posProductAPI.search(inputValue);
        return res.data.map(p => ({
            value: p.id,
            label: `${p.name} (${p.product_code})`,
            unit_price: Number(p.selling_price),
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
            const newItem = { ...updated[index], ...updates };
            const { total_price, discount_amount } = calculateItemTotal(newItem);
            updated[index] = { ...newItem, total_price, discount_amount };
            return updated;
        });
    };

    const selectProduct = (option, index) => {
        if (isProductDuplicate(option.value, index)) {
            updateItem(index, { error_msg: "Product already added!" });
            return;
        }
        updateItem(index, {
            product: option.value,
            product_name: option.product_name,
            unit_price: option.unit_price,
            quantity: 1,
            stock: option.stock,
            is_unique: false,
            unique_serial: "",
            error_msg: "",
            success_msg: ""
        });
    };

    /* ---------------- SERIAL VERIFY ---------------- */
    const handleSerialVerify = async (serial, index) => {
        if (!serial || serial.length < 3) return;
        if (isSerialDuplicate(serial, index)) {
            updateItem(index, { error_msg: "Already scanned!" });
            return;
        }
        try {
            const response = await fetch(`${BASE_URL_of_POS}/api/bar-qr/verify/verify/?serial=${serial}`);
            const data = await response.json();
            if (data.valid && data.status_code === 'in_stock') {
                // if (isProductDuplicate(data.product_id, index)) {
                //     updateItem(index, { error_msg: "Model already added!", success_msg: "" });
                //     return;
                // }
                updateItem(index, {
                    product: data.product_id,
                    product_name: data.product.name,
                    unit_price: Number(data.product.selling_price),
                    quantity: 1,
                    unique_serial: serial,
                    is_unique: true,
                    stock: data.product.stock,
                    success_msg: "Valid",
                    error_msg: ""
                });
            } else {
                updateItem(index, { is_unique: false, error_msg: !data.valid ? "Invalid" : "Not in stock", success_msg: "" });
            }
        } catch (err) { console.error(err); }
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
        updateItem(index, { quantity: finalQty, error_msg });
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
    const currentInvoiceDue = netTotal - totalPaid;
    const previousDue = supplier?.due_amount || 0;
    const totalCustomerDue = previousDue + currentInvoiceDue;

    /* ---------------- SUBMIT ---------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!supplier) return alert("Please select a customer");
        const validItems = items.filter(i => i.product);
        if (validItems.length === 0) return alert("Please add products");

        const itemsPayload = validItems.map(item => ({
            product: item.product,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.unit_price * item.quantity, // Added missing total_price
            discount_amount: item.discount_amount,
            net_total: item.total_price,
            serials: item.unique_serial ? [item.unique_serial] : []
        }));

        const itemwise_total_discount = validItems.reduce((sum, i) => sum + i.discount_amount, 0);

        const payload = {
            customer: supplier.value,
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
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            let res;

            if (paymentProof) {
                const formData = new FormData();
                Object.keys(payload).forEach(key => {
                    if (key === 'items') formData.append(key, JSON.stringify(payload[key]));
                    else formData.append(key, payload[key]);
                });
                formData.append("payment_proof", paymentProof);
                res = await axios.post(`${BASE_URL_of_POS}/api/sale/sales/`, formData, { headers });
            } else {
                res = await posSaleProductAPI.create(payload);
            }
            setInvoiceData(res.data);
            setShowSuccess(true);
        } catch (err) {
            alert(err.response?.data?.error || "Failed to save sale");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white w-full max-w-6xl rounded-xl shadow-lg max-h-[95vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                            <h2 className="text-2xl font-bold text-gray-800">Create Sale Invoice</h2>
                            <button onClick={onClose} type="button" className="text-3xl font-light hover:text-red-500 transition-colors">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="w-full md:w-1/2">
                                    <label className="block text-sm font-semibold text-blue-900 mb-2">Customer *</label>
                                    <AsyncSelect
                                        cacheOptions defaultOptions
                                        loadOptions={loadSupplierOptions}
                                        value={supplier}
                                        onChange={setSupplier}
                                        placeholder="Select customer..."
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

                            <div className="space-y-4">
                                <div className="hidden lg:grid grid-cols-12 gap-4 px-2 text-sm font-bold text-gray-600 uppercase tracking-wider">
                                    <div className="col-span-2">Serial Scan</div>
                                    <div className="col-span-3">Product / Item</div>
                                    <div className="col-span-1 text-right">Price</div>
                                    <div className="col-span-1 text-center">Qty</div>
                                    <div className="col-span-2 text-center">Discount</div>
                                    <div className="col-span-2 text-right">Total</div>
                                    <div className="col-span-1 text-center">Action</div>
                                </div>

                                <div className="space-y-3">
                                    {items.map((item, index) => (
                                        <div key={index} className="lg:grid lg:grid-cols-12 gap-4 bg-white p-3 border rounded-lg shadow-sm items-center">
                                            <div className="col-span-2">
                                                <input
                                                    type="text" placeholder="Serial..."
                                                    className={`w-full border p-2 rounded text-sm font-mono outline-none ${item.error_msg ? 'border-red-500' : 'focus:border-blue-500'}`}
                                                    value={item.unique_serial}
                                                    onChange={(e) => {
                                                        updateItem(index, { unique_serial: e.target.value });
                                                        if (e.target.value.length >= 3) handleSerialVerify(e.target.value, index);
                                                    }}
                                                />
                                                {item.error_msg && <p className="text-red-500 text-[10px] mt-1 font-semibold">{item.error_msg}</p>}
                                                {item.success_msg && <p className="text-green-600 text-[10px] mt-1 font-semibold">{item.success_msg}</p>}
                                            </div>

                                            <div className="col-span-3">
                                                <AsyncSelect
                                                    loadOptions={loadProductOptions} defaultOptions={false}
                                                    onChange={(opt) => selectProduct(opt, index)}
                                                    value={item.product ? {value: item.product, label: item.product_name} : null}
                                                    placeholder="Find product..."
                                                    isDisabled={item.is_unique}
                                                    menuPortalTarget={document.body}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                />
                                                {item.product && !item.is_unique && <p className="text-blue-500 text-[10px] mt-1">Stock: {item.stock}</p>}
                                            </div>

                                            <div className="col-span-1">
                                                <input className="w-full border p-2 rounded bg-gray-50 text-right font-mono text-sm" value={item.unit_price} disabled/>
                                            </div>

                                            <div className="col-span-1">
                                                <input
                                                    className={`w-full border p-2 rounded text-center font-bold ${item.is_unique ? 'bg-yellow-50 cursor-not-allowed' : 'bg-white'}`}
                                                    type="number" value={item.quantity} min="1"
                                                    disabled={item.is_unique}
                                                    onChange={(e) => updateQty(index, Number(e.target.value))}
                                                />
                                            </div>

                                            <div className="col-span-2 flex items-center gap-1">
                                                <select className="border p-2 rounded text-xs bg-gray-50 outline-none" value={item.discount_type} onChange={(e) => updateItem(index, { discount_type: e.target.value })}>
                                                    <option value="fixed">৳</option><option value="percent">%</option>
                                                </select>
                                                <input type="number" className="w-full border p-2 rounded text-right text-sm outline-none focus:border-blue-500" value={item.discount_value || ""} onChange={(e) => updateItem(index, { discount_value: Number(e.target.value) })}/>
                                            </div>

                                            <div className="col-span-2 text-right px-2">
                                                <span className="font-bold font-mono text-blue-700 text-lg">৳{item.total_price.toFixed(2)}</span>
                                                {item.discount_amount > 0 && <p className="text-[10px] text-green-600 font-bold">Saved: ৳{item.discount_amount.toFixed(2)}</p>}
                                            </div>

                                            <div className="col-span-1 flex justify-center">
                                                <button type="button" onClick={() => removeRow(index)} className="text-red-400 hover:text-red-600 p-2 text-2xl">×</button>
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addRow} className="flex items-center gap-2 text-blue-600 font-bold px-4 py-2 border-2 border-dashed border-blue-200 rounded-lg hover:bg-blue-50 transition-colors w-full justify-center">
                                        + Add Another Product
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t">
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-xl border space-y-4">
                                        <label className="block text-sm font-semibold text-gray-700">Payment Breakdown</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div><label className="text-[10px] uppercase font-bold text-gray-500">Cash</label><input type="number" className="w-full border p-2 rounded-lg font-bold" value={paidCash} onChange={(e) => setPaidCash(Number(e.target.value))}/></div>
                                            <div><label className="text-[10px] uppercase font-bold text-gray-500">Mobile</label><input type="number" className="w-full border p-2 rounded-lg font-bold" value={paidMobile} onChange={(e) => setPaidMobile(Number(e.target.value))}/></div>
                                            <div><label className="text-[10px] uppercase font-bold text-gray-500">Bank</label><input type="number" className="w-full border p-2 rounded-lg font-bold" value={paidBank} onChange={(e) => setPaidBank(Number(e.target.value))}/></div>
                                        </div>

                                        {paidMobile > 0 && (
                                            <div className="grid grid-cols-2 gap-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                                                <div><label className="text-[10px] uppercase font-bold text-orange-700">Mobile Operator</label><select className="w-full border p-2 rounded-lg bg-white" value={mobileOperator} onChange={(e) => setMobileOperator(e.target.value)}><option value="">Select</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="rocket">Rocket</option></select></div>
                                                <div><label className="text-[10px] uppercase font-bold text-orange-700">Trx ID</label><input className="w-full border p-2 rounded-lg" value={transactionId} onChange={(e) => setTransactionId(e.target.value)}/></div>
                                            </div>
                                        )}

                                        {paidBank > 0 && (
                                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100"><label className="text-[10px] uppercase font-bold text-blue-700">Bank A/C Number</label><input className="w-full border p-2 rounded-lg" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)}/></div>
                                        )}

                                        <div><label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Payment Proof (Optional)</label><input type="file" className="w-full text-xs" onChange={(e) => setPaymentProof(e.target.files[0])}/></div>
                                    </div>

                                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                        <label className="block text-sm font-semibold text-green-900 mb-2">Overall Invoice Discount</label>
                                        <div className="flex gap-2">
                                            <select className="border p-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-green-500 text-sm" value={globalDiscountType} onChange={(e) => setGlobalDiscountType(e.target.value)}><option value="fixed">Fixed (৳)</option><option value="percent">Percentage (%)</option></select>
                                            <input type="number" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500 font-bold" placeholder="0.00" value={globalDiscountValue || ""} onChange={(e) => setGlobalDiscountValue(Number(e.target.value))}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-900 text-white p-6 rounded-2xl space-y-4 shadow-xl">
                                    <div className="space-y-2 text-sm border-b border-gray-800 pb-3">
                                        <div className="flex justify-between"><span className="text-gray-500 font-medium">Items Subtotal</span><span className="font-mono font-bold">৳{subtotal.toFixed(2)}</span></div>
                                        <div className="flex justify-between text-green-400"><span>Global Discount</span><span className="font-mono font-bold">- ৳{globalDiscountAmount.toFixed(2)}</span></div>
                                        <div className="flex justify-between text-lg pt-2 border-t border-gray-800"><span className="text-gray-400 font-bold">Net Total</span><span className="font-mono font-black text-white text-2xl">৳{netTotal.toFixed(2)}</span></div>
                                    </div>

                                    <div className="space-y-3 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-inner">
                                        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest text-center">Payment ({paymentMethod.replace('_', ' ')})</p>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-700"><span className="text-sm font-bold text-blue-400 uppercase">Total Received</span><span className="font-mono font-black text-white text-xl">৳{totalPaid.toFixed(2)}</span></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-xl text-center"><p className="text-[10px] text-red-500 font-bold uppercase mb-1">Invoice Due</p><p className="text-xl font-black text-red-500">৳{currentInvoiceDue.toFixed(2)}</p></div>
                                        <div className="p-3 bg-blue-900/20 border border-blue-900/30 rounded-xl text-center"><p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Total Balance</p><p className="text-xl font-black text-blue-400">৳{totalCustomerDue.toFixed(2)}</p></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={onClose} className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors">Discard</button>
                                <button disabled={loading} className="px-12 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg hover:bg-blue-700 disabled:bg-blue-300 transition-all uppercase tracking-wider">{loading ? "Processing..." : "Confirm Sale"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <SuccessModal isOpen={showSuccess} onClose={() => { setShowSuccess(false); onSuccess?.(invoiceData); onClose(); }} invoice={invoiceData} previousDue={previousDue}/>
        </>
    );
};

export default AddSaleModal;