import React, { useEffect, useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
import { posPurchaseProductAPI } from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
import { posSupplierAPI } from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";

const emptyItem = {
    product: null,
    product_name: "",
    unit_price: 0,
    quantity: 1,
    total_price: 0,
    has_expiry: false,
    manufacturing_date: "",
    shelf_life_days: 0,
    batch_no: "",
};

const AddPurchasePage = ({ isOpen, onClose, onSuccess }) => {
    /* ---------------- STATE ---------------- */
    const [invoiceNo, setInvoiceNo] = useState("");
    const [supplier, setSupplier] = useState(null);
    const [items, setItems] = useState([{ ...emptyItem }]);

    const [paidAmount, setPaidAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("cash");

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const barcodeRef = useRef(null);

    useEffect(() => {
        if (isOpen && barcodeRef.current) {
            barcodeRef.current.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    /* ---------------- SUPPLIER SEARCH ---------------- */
    const loadSupplierOptions = async (inputValue) => {
        const res = await posSupplierAPI.search(inputValue || "");
        return res.data.map(s => ({
            value: s.id,
            label: s.name,
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

    const selectProduct = (option, index) => {
        const updated = [...items];
        updated[index] = {
            ...updated[index],
            product: option.value,
            product_name: option.product_name,
            unit_price: option.unit_price,
            quantity: 1,
            total_price: option.unit_price,
            has_expiry: option.has_expiry,
            manufacturing_date: "",
            shelf_life_days: 0,
            batch_no: "",
        };
        setItems(updated);
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
                    0
                );
            }
        } catch (err) {
            console.error("Barcode scan failed", err);
        }

        e.target.value = "";
    };

    /* ---------------- ITEM HANDLERS ---------------- */
    const updateItemField = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    const updateQty = (index, qty) => {
        const updated = [...items];
        updated[index].quantity = qty;
        updated[index].total_price = qty * updated[index].unit_price;
        setItems(updated);
    };

    const addRow = () => setItems([...items, { ...emptyItem }]);
    const removeRow = (index) =>
        setItems(items.filter((_, i) => i !== index));

    /* ---------------- CALCULATIONS ---------------- */
    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
    const dueAmount = subtotal - paidAmount;

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

        const payload = {
            invoice_no: invoiceNo,
            supplier: supplier.value,
            paid_amount: paidAmount,
            payment_method: paymentMethod,
            items: items.map(i => ({
                product: i.product,
                quantity: i.quantity,
                unit_price: i.unit_price,
                manufacturing_date: i.has_expiry ? i.manufacturing_date : null,
                shelf_life_days: i.has_expiry ? i.shelf_life_days : 0,
                batch_no: i.has_expiry ? i.batch_no : "",
            })),
        };

        try {
            setLoading(true);
            const res = await posPurchaseProductAPI.create(payload);
            onSuccess?.(res.data);
            onClose();
        } catch (err) {
            setErrors(err.response?.data || {});
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- UI ---------------- */
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">

                {/* Barcode hidden input */}
                <input
                    ref={barcodeRef}
                    onKeyDown={handleBarcodeScan}
                    className="absolute opacity-0"
                />

                <div className="p-6 border-b flex justify-between">
                    <h2 className="text-2xl font-bold">New Purchase</h2>
                    <button onClick={onClose} className="text-xl">×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Invoice */}
                    <div>
                        <label className="font-medium">Invoice No *</label>
                        <input
                            className="w-full border p-2 rounded"
                            value={invoiceNo}
                            onChange={(e) => setInvoiceNo(e.target.value)}
                        />
                        {errors.invoice_no && (
                            <p className="text-red-500 text-sm">{errors.invoice_no}</p>
                        )}
                    </div>

                    {/* Supplier */}
                    <div>
                        <label className="font-medium">Supplier *</label>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={loadSupplierOptions}
                            value={supplier}
                            onChange={setSupplier}
                            placeholder="Search supplier..."
                        />
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div key={index} className="border p-4 rounded-lg bg-gray-50">
                                <div className="grid grid-cols-12 gap-2">
                                    <div className="col-span-5">
                                        <AsyncSelect
                                            loadOptions={loadProductOptions}
                                            defaultOptions={false}
                                            onChange={(opt) => selectProduct(opt, index)}
                                            value={
                                                item.product
                                                    ? { value: item.product, label: item.product_name }
                                                    : null
                                            }
                                            placeholder="Search / scan product"
                                        />
                                    </div>

                                    <input className="col-span-2 border p-2 rounded" value={item.unit_price} disabled />
                                    <input
                                        className="col-span-2 border p-2 rounded"
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateQty(index, Number(e.target.value))}
                                    />
                                    <input
                                        className="col-span-2 border p-2 rounded bg-white"
                                        value={item.total_price}
                                        disabled
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeRow(index)}
                                        className="col-span-1 text-red-600 font-bold"
                                    >
                                        ×
                                    </button>
                                </div>

                                {item.has_expiry && (
                                    <div className="grid grid-cols-3 gap-4 mt-3 p-3 bg-blue-50 border border-blue-100 rounded">
                                        <div>
                                            <label className="block text-xs font-semibold text-blue-700 mb-1">Manufacturing Date</label>
                                            <input
                                                type="date"
                                                className="w-full border p-1 rounded text-sm"
                                                value={item.manufacturing_date}
                                                onChange={(e) => updateItemField(index, "manufacturing_date", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-blue-700 mb-1">Shelf Life (Days)</label>
                                            <input
                                                type="number"
                                                className="w-full border p-1 rounded text-sm"
                                                value={item.shelf_life_days}
                                                onChange={(e) => updateItemField(index, "shelf_life_days", Number(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-blue-700 mb-1">Batch Number</label>
                                            <input
                                                className="w-full border p-1 rounded text-sm"
                                                placeholder="Batch No"
                                                value={item.batch_no}
                                                onChange={(e) => updateItemField(index, "batch_no", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addRow} className="text-blue-600 font-medium">
                            + Add Another Product
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg">
                        <div>
                            <label className="text-sm font-medium">Subtotal</label>
                            <input className="w-full border p-2 bg-white rounded font-bold" value={subtotal} disabled />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Paid Amount</label>
                            <input
                                className="w-full border p-2 rounded"
                                type="number"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Due Amount</label>
                            <input className="w-full border p-2 bg-white rounded text-red-600 font-bold" value={dueAmount} disabled />
                        </div>
                    </div>

                    <div>
                        <label className="font-medium">Payment Method</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="cash">Cash</option>
                            <option value="bkash">bKash</option>
                            <option value="nagad">Nagad</option>
                            <option value="bank">Bank</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="border px-6 py-2 rounded hover:bg-gray-50">
                            Cancel
                        </button>
                        <button disabled={loading} className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 font-bold">
                            {loading ? "Saving..." : "Save Purchase"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddPurchasePage;
