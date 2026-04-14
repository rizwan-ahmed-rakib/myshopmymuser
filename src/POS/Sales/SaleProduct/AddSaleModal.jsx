import React, {useEffect, useRef, useState} from "react";
import AsyncSelect from "react-select/async";
import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
import {posCustomerAPI} from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";
import {posSaleProductAPI} from "../../../context_or_provider/pos/Sale/saleProduct/productSaleAPI";

const emptyItem = {
    product: null,
    product_name: "",
    unit_price: 0,
    quantity: 1,
    total_price: 0,
};

const AddSaleModal = ({isOpen, onClose, onSuccess}) => {
    /* ---------------- STATE ---------------- */
    const [invoiceNo, setInvoiceNo] = useState("");
    const [supplier, setSupplier] = useState(null);
    const [items, setItems] = useState([{...emptyItem}]);

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
        const res = await posCustomerAPI.search(inputValue || "");
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
    const updateQty = (index, qty) => {
        const updated = [...items];
        updated[index].quantity = qty;
        updated[index].total_price = qty * updated[index].unit_price;
        setItems(updated);
    };

    const addRow = () => setItems([...items, {...emptyItem}]);
    const removeRow = (index) =>
        setItems(items.filter((_, i) => i !== index));

    /* ---------------- CALCULATIONS ---------------- */
    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
    const dueAmount = subtotal - paidAmount;

    /* ---------------- SUBMIT ---------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // if (!invoiceNo) {
        //     setErrors({invoice_no: "Invoice number required"});
        //     return;
        // }

        if (!supplier) {
            setErrors({supplier: "Customer required"});
            return;
        }

        if (items.some(i => !i.product)) {
            setErrors({items: "All product rows must be filled"});
            return;
        }

        const payload = {
            // invoice_no: invoiceNo,
            customer: supplier.value,
            paid_amount: paidAmount,
            payment_method: paymentMethod,
            items: items.map(i => ({
                product: i.product,
                quantity: i.quantity,
                unit_price: i.unit_price,
            })),
        };

        try {
            setLoading(true);
            console.log(
                "SALE PAYLOAD 👉",
                JSON.parse(JSON.stringify(payload))
            );

            const res = await posSaleProductAPI.create(payload);
            onSuccess?.(res.data);
            onClose();
        } catch (err) {
            setErrors(err.response?.data || {});
            console.error("SALE ERROR 👉", err.response?.data);

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
                    <h2 className="text-2xl font-bold">New Sale</h2>
                    <button onClick={onClose} className="text-xl">×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Invoice */}

                    {/*<div>*/}
                    {/*    <label className="font-medium">Invoice No *</label>*/}
                    {/*    <input*/}
                    {/*        className="w-full border p-2 rounded"*/}
                    {/*        value={invoiceNo}*/}
                    {/*        onChange={(e) => setInvoiceNo(e.target.value)}*/}
                    {/*    />*/}
                    {/*    {errors.invoice_no && (*/}
                    {/*        <p className="text-red-500 text-sm">{errors.invoice_no}</p>*/}
                    {/*    )}*/}
                    {/*</div>*/}

                    {/* Customer */}
                    <div>
                        <label className="font-medium">Customer *</label>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={loadSupplierOptions}
                            value={supplier}
                            onChange={setSupplier}
                            placeholder="Search customer..."
                        />
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2">
                                <div className="col-span-5">
                                    <AsyncSelect
                                        loadOptions={loadProductOptions}
                                        defaultOptions={false}
                                        onChange={(opt) => selectProduct(opt, index)}
                                        value={
                                            item.product
                                                ? {value: item.product, label: item.product_name}
                                                : null
                                        }
                                        placeholder="Search / scan product"
                                    />
                                </div>

                                <input className="col-span-2 border p-2 rounded" value={item.unit_price} disabled/>
                                <input
                                    className="col-span-2 border p-2 rounded"
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateQty(index, Number(e.target.value))}
                                />
                                <input
                                    className="col-span-2 border p-2 rounded bg-gray-100"
                                    value={item.total_price}
                                    disabled
                                />
                                <button
                                    type="button"
                                    onClick={() => removeRow(index)}
                                    className="col-span-1 text-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addRow} className="text-blue-600">
                            + Add Item
                        </button>
                    </div>

                    {/* Payment */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label>Subtotal</label>
                            <input className="w-full border p-2 bg-gray-100" value={subtotal} disabled/>
                        </div>
                        <div>
                            <label>Paid</label>
                            <input
                                className="w-full border p-2"
                                type="number"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label>Due</label>
                            <input className="w-full border p-2 bg-gray-100" value={dueAmount} disabled/>
                        </div>
                    </div>

                    <div>
                        <label>Payment Method</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="cash">Cash</option>
                            <option value="bcash">bKash</option>
                            <option value="bank">Bank</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="border px-6 py-2 rounded">
                            Cancel
                        </button>
                        <button disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded">
                            {loading ? "Saving..." : "Save Sale"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddSaleModal;

