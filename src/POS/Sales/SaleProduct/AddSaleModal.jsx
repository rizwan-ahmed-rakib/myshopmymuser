import React, {useEffect, useRef, useState} from "react";
import AsyncSelect from "react-select/async";
import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
import {posCustomerAPI} from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";
import {posSaleProductAPI} from "../../../context_or_provider/pos/Sale/saleProduct/productSaleAPI";
import BASE_URL_of_POS from "../../../posConfig";

const emptyItem = {
    product: null,
    product_name: "",
    unit_price: 0,
    quantity: 1,
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
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const loadSupplierOptions = async (inputValue) => {
        const res = await posCustomerAPI.search(inputValue || "");
        return res.data.map(s => ({
            value: s.id,
            label: s.name,
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

    const selectProduct = (option, index) => {
        if (isProductDuplicate(option.value, index)) {
            const updated = [...items];
            updated[index].error_msg = "Product already added in another row!";
            setItems(updated);
            return;
        }

        const updated = [...items];
        const stock = option.stock || 0;
        updated[index] = {
            ...updated[index],
            product: option.value,
            product_name: option.product_name,
            unit_price: option.unit_price,
            quantity: stock > 0 ? 1 : 0,
            total_price: stock > 0 ? option.unit_price : 0,
            is_unique: false, 
            unique_serial: "",
            stock: stock,
            error_msg: stock > 0 ? "" : "Product is out of stock!",
            success_msg: ""
        };
        setItems(updated);
    };

    const handleSerialVerify = async (serial, index) => {
        if (!serial || serial.length < 3) return;

        if (isSerialDuplicate(serial, index)) {
            const updated = [...items];
            updated[index].error_msg = "This serial is already scanned!";
            setItems(updated);
            return;
        }
        
        try {
            const response = await fetch(`${BASE_URL_of_POS}/api/bar-qr/verify/verify/?serial=${serial}`);
            const data = await response.json();

            const updated = [...items];
            if (data.valid && data.status_code === 'in_stock') {
                if (isProductDuplicate(data.product_id, index)) {
                    updated[index].error_msg = "Product model already added in another row!";
                    updated[index].success_msg = "";
                    setItems(updated);
                    return;
                }

                updated[index] = {
                    ...updated[index],
                    product: data.product_id, 
                    product_name: data.product.name,
                    unit_price: Number(data.product.selling_price),
                    quantity: 1,
                    total_price: Number(data.product.selling_price),
                    unique_serial: serial,
                    is_unique: true,
                    stock: data.product.stock,
                    success_msg: "Valid & Ready",
                    error_msg: ""
                };
                setItems(updated);
            } else {
                updated[index].is_unique = false;
                updated[index].error_msg = !data.valid ? "Invalid Serial" : `Status: ${data.status || 'Not in stock'}`;
                updated[index].success_msg = "";
                setItems(updated);
            }
        } catch (error) {
            console.error("Verification error:", error);
        }
    };

    const updateQty = (index, qty) => {
        const updated = [...items];
        if (updated[index].is_unique) return;

        const maxStock = updated[index].stock || 0;
        let finalQty = qty;

        if (maxStock <= 0) {
            finalQty = 0;
            updated[index].error_msg = "Out of stock!";
        } else if (qty > maxStock) {
            finalQty = maxStock;
            updated[index].error_msg = `Only ${maxStock} in stock!`;
        } else if (qty < 1) {
            finalQty = 1;
            updated[index].error_msg = "";
        } else {
            updated[index].error_msg = "";
        }
        
        updated[index].quantity = finalQty;
        updated[index].total_price = finalQty * updated[index].unit_price;
        setItems(updated);
    };

    const addRow = () => {
        // Prevent adding new row if last row is empty
        const lastItem = items[items.length - 1];
        if (!lastItem.product && !lastItem.unique_serial) return;
        setItems([...items, {...emptyItem}]);
    };

    const removeRow = (index) => {
        if (items.length === 1) setItems([{...emptyItem}]);
        else setItems(items.filter((_, i) => i !== index));
    };

    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
    const dueAmount = subtotal - paidAmount;

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
                    serials: []
                };
                payloadItems.push(processedProducts[key]);
            }
            processedProducts[key].quantity += item.quantity;
            if (item.is_unique) processedProducts[key].serials.push(item.unique_serial);
        });

        const payload = {
            customer: supplier.value,
            paid_amount: paidAmount,
            payment_method: paymentMethod,
            items: payloadItems,
        };

        try {
            setLoading(true);
            const response = await posSaleProductAPI.create(payload);
            onSuccess?.(response.data);
            onClose();
        } catch (err) {
            console.error("SALE ERROR:", err.response?.data);
            alert(err.response?.data?.error || "Could not save sale. Check stock or try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-6xl rounded-xl shadow-lg max-h-[95vh] overflow-y-auto">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h2 className="text-2xl font-bold text-gray-800">Create Sale Invoice</h2>
                    <button onClick={onClose} type="button" className="text-3xl font-light hover:text-red-500 transition-colors">×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <label className="block text-sm font-semibold text-blue-900 mb-2">Customer *</label>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={loadSupplierOptions}
                            value={supplier}
                            onChange={setSupplier}
                            placeholder="Select customer..."
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="hidden lg:grid grid-cols-12 gap-4 px-2 text-sm font-bold text-gray-600">
                            <div className="col-span-3">Unique Serial Scan</div>
                            <div className="col-span-3">Product Model</div>
                            <div className="col-span-2">Unit Price</div>
                            <div className="col-span-1">Qty</div>
                            <div className="col-span-2">Total</div>
                            <div className="col-span-1">Action</div>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div key={index} className="lg:grid lg:grid-cols-12 gap-4 bg-white p-3 border rounded-lg shadow-sm">
                                    <div className="col-span-3">
                                        <input
                                            type="text"
                                            placeholder="Scan/Paste Serial..."
                                            className={`w-full border p-2 rounded text-sm font-mono outline-none ${item.error_msg ? 'border-red-500' : 'focus:border-blue-500'}`}
                                            value={item.unique_serial}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const updated = [...items];
                                                updated[index].unique_serial = val;
                                                setItems(updated);
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
                                        />
                                        {item.product && !item.is_unique && <p className="text-blue-500 text-[10px] mt-1">Available Stock: {item.stock}</p>}
                                    </div>

                                    <div className="col-span-2">
                                        <input className="w-full border p-2 rounded bg-gray-50 text-right font-mono" value={item.unit_price} disabled/>
                                    </div>

                                    <div className="col-span-1">
                                        <input
                                            className={`w-full border p-2 rounded text-center font-bold ${item.is_unique ? 'bg-yellow-50 cursor-not-allowed' : 'bg-white'}`}
                                            type="number"
                                            value={item.quantity}
                                            min="1"
                                            disabled={item.is_unique}
                                            onKeyDown={(e) => {
                                                // Prevent typing if unique
                                                if (item.is_unique) e.preventDefault();
                                            }}
                                            onChange={(e) => updateQty(index, Number(e.target.value))}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <input className="w-full border p-2 rounded bg-gray-50 text-right font-bold font-mono text-blue-700" value={item.total_price.toFixed(2)} disabled/>
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
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['cash', 'bcash', 'bank'].map(method => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setPaymentMethod(method)}
                                        className={`py-2 rounded capitalize text-sm font-semibold transition-all ${paymentMethod === method ? 'bg-blue-600 text-white shadow-md' : 'bg-white border text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        {method === 'bcash' ? 'bKash' : method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-800 text-white p-6 rounded-xl space-y-3 shadow-xl">
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-gray-400 font-medium">Subtotal</span>
                                <span className="font-mono text-xl font-bold">৳ {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 font-medium">Paid Amount</span>
                                <input className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-right w-32 outline-none font-bold text-white focus:border-blue-400" type="number" value={paidAmount} onChange={(e) => setPaidAmount(Number(e.target.value))}/>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                                <span className="text-xl font-bold text-gray-300">Total Due</span>
                                <span className={`text-2xl font-bold font-mono ${dueAmount > 0 ? 'text-red-400' : 'text-green-400'}`}>৳ {dueAmount.toFixed(2)}</span>
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
    );
};

export default AddSaleModal;
