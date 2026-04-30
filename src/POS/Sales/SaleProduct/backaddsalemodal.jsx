import React, {useEffect, useRef, useState} from "react";
import AsyncSelect from "react-select/async";
import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
import {posCustomerAPI} from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";
import {posSaleProductAPI} from "../../../context_or_provider/pos/Sale/saleProduct/productSaleAPI";
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
    unique_serial: "",
    is_unique: false,
    stock: 0,
    success_msg: "",
    error_msg: ""
};

const AddSaleModal = ({isOpen, onClose, onSuccess}) => {
    const [supplier, setSupplier] = useState(null);
    const [items, setItems] = useState([{...emptyItem}]);
    const [paidAmount, setPaidAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [globalDiscountType, setGlobalDiscountType] = useState("fixed"); // "fixed" or "percent"
    const [globalDiscountValue, setGlobalDiscountValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);

    const barcodeRef = useRef(null);

    useEffect(() => {
        if (isOpen && barcodeRef.current) {
            barcodeRef.current.focus();
        }
    }, [isOpen]);

    if (!isOpen && !showSuccess) return null;

    const loadSupplierOptions = async (inputValue) => {
        const res = await posCustomerAPI.search(inputValue || "");
        return res.data.map(s => ({
            value: s.id,
            label: s.name,
            due_amount: Number(s.due_amount || 0)
        }));
    };

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
            updateItem(index, { error_msg: "Product already added in another row!" });
            return;
        }

        const stock = option.stock || 0;
        updateItem(index, {
            product: option.value,
            product_name: option.product_name,
            unit_price: option.unit_price,
            quantity: stock > 0 ? 1 : 0,
            is_unique: false,
            unique_serial: "",
            stock: stock,
            error_msg: stock > 0 ? "" : "Product is out of stock!",
            success_msg: ""
        });
    };

    const handleSerialVerify = async (serial, index) => {
        if (!serial || serial.length < 3) return;

        if (isSerialDuplicate(serial, index)) {
            updateItem(index, { error_msg: "This serial is already scanned!" });
            return;
        }

        try {
            const response = await fetch(`${BASE_URL_of_POS}/api/bar-qr/verify/verify/?serial=${serial}`);
            const data = await response.json();

            if (data.valid && data.status_code === 'in_stock') {
                if (isProductDuplicate(data.product_id, index)) {
                    updateItem(index, { error_msg: "Product model already added in another row!", success_msg: "" });
                    return;
                }

                updateItem(index, {
                    product: data.product_id,
                    product_name: data.product.name,
                    unit_price: Number(data.product.selling_price),
                    quantity: 1,
                    unique_serial: serial,
                    is_unique: true,
                    stock: data.product.stock,
                    success_msg: "Valid & Ready",
                    error_msg: ""
                });
            } else {
                updateItem(index, {
                    is_unique: false,
                    error_msg: !data.valid ? "Invalid Serial" : `Status: ${data.status || 'Not in stock'}`,
                    success_msg: ""
                });
            }
        } catch (error) {
            console.error("Verification error:", error);
        }
    };

    const updateQty = (index, qty) => {
        const item = items[index];
        if (item.is_unique) return;

        const maxStock = item.stock || 0;
        let finalQty = qty;
        let error_msg = "";

        if (maxStock <= 0) {
            finalQty = 0;
            error_msg = "Out of stock!";
        } else if (qty > maxStock) {
            finalQty = maxStock;
            error_msg = `Only ${maxStock} in stock!`;
        } else if (qty < 1) {
            finalQty = 1;
        }

        updateItem(index, { quantity: finalQty, error_msg });
    };

    const addRow = () => {
        const lastItem = items[items.length - 1];
        if (!lastItem.product && !lastItem.unique_serial) return;
        setItems([...items, {...emptyItem}]);
    };

    const removeRow = (index) => {
        if (items.length === 1) setItems([{...emptyItem}]);
        else setItems(items.filter((_, i) => i !== index));
    };

    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
    const globalDiscountAmount = globalDiscountType === "percent"
        ? (subtotal * globalDiscountValue) / 100
        : globalDiscountValue;

    const netTotal = Math.max(0, subtotal - globalDiscountAmount);
    const currentInvoiceDue = netTotal - paidAmount;
    const previousDue = supplier?.due_amount || 0;
    const totalCustomerDue = previousDue + currentInvoiceDue;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!supplier) return alert("Please select a customer");

        const validItems = items.filter(i => i.product);
        if (validItems.length === 0) return alert("Please add at least one product");

        // Stock check
        for (const item of validItems) {
            if (item.stock <= 0) {
                return alert(`Product "${item.product_name}" is out of stock!`);
            }
            if (item.quantity > item.stock) {
                return alert(`Product "${item.product_name}" exceeds available stock (${item.stock})!`);
            }
            if (item.quantity <= 0) {
                return alert(`Product "${item.product_name}" must have a quantity of at least 1!`);
            }
        }

        const payloadItems = [];
        const processedProducts = {};

        validItems.forEach(item => {
            const key = item.product;
            if (!processedProducts[key]) {
                processedProducts[key] = {
                    product: item.product,
                    quantity: 0,
                    unit_price: item.unit_price,
                    discount_amount: 0,
                    net_total: 0,
                    serials: []
                };
                payloadItems.push(processedProducts[key]);
            }
            processedProducts[key].quantity += item.quantity;
            processedProducts[key].discount_amount += item.discount_amount;
            processedProducts[key].net_total += item.total_price;
            if (item.is_unique) processedProducts[key].serials.push(item.unique_serial);
        });

        // Calculate itemwise total discount
        const itemwise_total_discount = validItems.reduce((sum, i) => sum + i.discount_amount, 0);

        const payload = {
            customer: supplier.value,
            paid_amount: paidAmount,
            payment_method: paymentMethod,
            subtotal: subtotal,
            itemwise_total_discount: itemwise_total_discount,
            globalDiscount: globalDiscountAmount,
            totalDiscount: itemwise_total_discount + globalDiscountAmount,
            netTotal: netTotal,
            items: payloadItems,
        };

        try {
            setLoading(true);
            const response = await posSaleProductAPI.create(payload);
            setInvoiceData(response.data);
            setShowSuccess(true);
        } catch (err) {
            console.error("SALE ERROR:", err.response?.data);
            alert(err.response?.data?.error || "Could not save sale. Check stock or try again.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
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
                                        cacheOptions
                                        defaultOptions
                                        loadOptions={loadSupplierOptions}
                                        value={supplier}
                                        onChange={setSupplier}
                                        placeholder="Select customer..."
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    />
                                </div>
                                {supplier && (
                                    <div className="bg-white px-4 py-2 rounded-md border border-blue-200 shadow-sm">
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Previous Due</p>
                                        <p className="text-xl font-black text-red-600">৳{previousDue.toFixed(2)}</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="hidden lg:grid grid-cols-12 gap-4 px-2 text-sm font-bold text-gray-600">
                                    <div className="col-span-2">Serial Scan</div>
                                    <div className="col-span-3">Product Model</div>
                                    <div className="col-span-1">Price</div>
                                    <div className="col-span-1">Qty</div>
                                    <div className="col-span-2">Discount</div>
                                    <div className="col-span-2">Total</div>
                                    <div className="col-span-1">Action</div>
                                </div>

                                <div className="space-y-3">
                                    {items.map((item, index) => (
                                        <div key={index} className="lg:grid lg:grid-cols-12 gap-4 bg-white p-3 border rounded-lg shadow-sm items-center">
                                            <div className="col-span-2">
                                                <input
                                                    type="text"
                                                    placeholder="Serial..."
                                                    className={`w-full border p-2 rounded text-sm font-mono outline-none ${item.error_msg ? 'border-red-500' : 'focus:border-blue-500'}`}
                                                    value={item.unique_serial}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        updateItem(index, { unique_serial: val });
                                                        if (val.length >= 3) handleSerialVerify(val, index);
                                                    }}
                                                />
                                                {item.error_msg && <p className="text-red-500 text-[10px] mt-1 font-semibold">{item.error_msg}</p>}
                                                {item.success_msg && <p className="text-green-600 text-[10px] mt-1 font-semibold">{item.success_msg}</p>}
                                            </div>

                                            <div className="col-span-3">
                                                <AsyncSelect
                                                    loadOptions={loadProductOptions}
                                                    defaultOptions={false}
                                                    onChange={(opt) => selectProduct(opt, index)}
                                                    value={item.product ? {value: item.product, label: item.product_name} : null}
                                                    placeholder="Search product..."
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
                                                    type="number"
                                                    value={item.quantity}
                                                    min="1"
                                                    disabled={item.is_unique}
                                                    onChange={(e) => updateQty(index, Number(e.target.value))}
                                                />
                                            </div>

                                            <div className="col-span-2 flex items-center gap-1">
                                                <select
                                                    className="border p-2 rounded text-xs bg-gray-50 outline-none focus:border-blue-500"
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
                                                <span className="font-bold font-mono text-blue-700">৳{item.total_price.toFixed(2)}</span>
                                                {item.discount_amount > 0 && <p className="text-[10px] text-green-600">Saved: ৳{item.discount_amount.toFixed(2)}</p>}
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
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['cash', 'bkash', 'bank'].map(method => (
                                                <button
                                                    key={method}
                                                    type="button"
                                                    onClick={() => setPaymentMethod(method)}
                                                    className={`py-2 rounded capitalize text-sm font-semibold transition-all ${paymentMethod === method ? 'bg-blue-600 text-white shadow-md' : 'bg-white border text-gray-600 hover:bg-gray-100'}`}
                                                >
                                                    {method === 'bkash' ? 'bKash' : method}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                        <label className="block text-sm font-semibold text-green-900 mb-2">Invoice Overall Discount</label>
                                        <div className="flex gap-2">
                                            <select
                                                className="border p-2 rounded bg-white outline-none focus:ring-2 focus:ring-green-500"
                                                value={globalDiscountType}
                                                onChange={(e) => setGlobalDiscountType(e.target.value)}
                                            >
                                                <option value="fixed">Fixed (৳)</option>
                                                <option value="percent">Percentage (%)</option>
                                            </select>
                                            <input
                                                type="number"
                                                className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-green-500 font-bold"
                                                placeholder="0.00"
                                                value={globalDiscountValue || ""}
                                                onChange={(e) => setGlobalDiscountValue(Number(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800 text-white p-6 rounded-xl space-y-4 shadow-xl">
                                    <div className="space-y-2 text-sm border-b border-gray-700 pb-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Items Subtotal</span>
                                            <span className="font-mono font-bold">৳{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-green-400">
                                            <span>Global Discount</span>
                                            <span className="font-mono font-bold">- ৳{globalDiscountAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg pt-1 border-t border-gray-700/50">
                                            <span className="text-gray-300 font-bold">Net Total</span>
                                            <span className="font-mono font-bold text-white text-xl">৳{netTotal.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
                                        <span className="text-blue-300 font-bold">Paid Amount</span>
                                        <input
                                            className="bg-gray-900 border border-gray-600 rounded px-3 py-2 text-right w-40 outline-none font-black text-white focus:border-blue-400 text-lg shadow-inner"
                                            type="number"
                                            value={paidAmount}
                                            onChange={(e) => setPaidAmount(Number(e.target.value))}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-lg">
                                            <p className="text-[10px] text-red-400 font-bold uppercase">Invoice Due</p>
                                            <p className="text-lg font-black text-red-500">৳{currentInvoiceDue.toFixed(2)}</p>
                                        </div>
                                        <div className="p-3 bg-blue-900/20 border border-blue-900/30 rounded-lg">
                                            <p className="text-[10px] text-blue-400 font-bold uppercase">Customer Total Due</p>
                                            <p className="text-lg font-black text-blue-400">৳{totalCustomerDue.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={onClose} className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50">Discard</button>
                                <button disabled={loading} className="px-12 py-3 bg-blue-600 text-white rounded-lg font-black shadow-lg hover:bg-blue-700 disabled:bg-blue-300 transition-all uppercase tracking-wider">
                                    {loading ? "Saving Invoice..." : "Confirm & Save"}
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

export default AddSaleModal;
