// import React, { useState } from "react";
// import { posPurchaseProductAPI } from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
//
// const AddPurchaseModal = ({ isOpen, onClose, onSuccess }) => {
//
//     const [form, setForm] = useState({
//         invoice_no: "",
//         supplier: "",
//         paid_amount: "",
//         payment_method: "cash",
//         items: [
//             { product: "", quantity: 1, unit_price: "" }
//         ]
//     });
//
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//
//     if (!isOpen) return null;
//
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm(prev => ({ ...prev, [name]: value }));
//     };
//
//     const handleItemChange = (index, field, value) => {
//         const items = [...form.items];
//         items[index][field] = value;
//         setForm(prev => ({ ...prev, items }));
//     };
//
//     const addItem = () => {
//         setForm(prev => ({
//             ...prev,
//             items: [...prev.items, { product: "", quantity: 1, unit_price: "" }]
//         }));
//     };
//
//     const removeItem = (index) => {
//         setForm(prev => ({
//             ...prev,
//             items: prev.items.filter((_, i) => i !== index)
//         }));
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");
//
//         try {
//             const payload = {
//                 invoice_no: form.invoice_no,
//                 supplier: Number(form.supplier),
//                 paid_amount: Number(form.paid_amount || 0),
//                 payment_method: form.payment_method,
//                 payment_status: form.payment_status,
//                 items: form.items.map(item => ({
//                     product: Number(item.product),
//                     quantity: Number(item.quantity),
//                     unit_price: Number(item.unit_price)
//                 }))
//             };
//
//             const res = await posPurchaseProductAPI.create(payload);
//             onSuccess && onSuccess(res.data);
//             onClose();
//
//         } catch (err) {
//             setError(JSON.stringify(err.response?.data || "Error"));
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl p-6 w-full max-w-3xl">
//
//                 <h2 className="text-xl font-semibold mb-4">Add Purchase</h2>
//
//                 {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
//
//                 <form onSubmit={handleSubmit} className="space-y-4">
//
//                     <div className="grid grid-cols-2 gap-4">
//                         <input
//                             placeholder="Invoice No"
//                             className="border p-2 rounded"
//                             value={form.invoice_no}
//                             onChange={e => setForm({ ...form, invoice_no: e.target.value })}
//                             required
//                         />
//                         <input
//                             placeholder="Supplier ID"
//                             type="number"
//                             className="border p-2 rounded"
//                             value={form.supplier}
//                             onChange={e => setForm({ ...form, supplier: e.target.value })}
//                             required
//                         />
//                     </div>
//
//                     <div>
//                         <h3 className="font-medium mb-2">Items</h3>
//
//                         {form.items.map((item, index) => (
//                             <div key={index} className="grid grid-cols-4 gap-2 mb-2">
//                                 <input
//                                     placeholder="Product ID"
//                                     type="number"
//                                     className="border p-2 rounded"
//                                     value={item.product}
//                                     onChange={e => handleItemChange(index, "product", e.target.value)}
//                                     required
//                                 />
//                                 <input
//                                     placeholder="Qty"
//                                     type="number"
//                                     className="border p-2 rounded"
//                                     value={item.quantity}
//                                     onChange={e => handleItemChange(index, "quantity", e.target.value)}
//                                 />
//                                 <input
//                                     placeholder="Unit Price"
//                                     type="number"
//                                     className="border p-2 rounded"
//                                     value={item.unit_price}
//                                     onChange={e => handleItemChange(index, "unit_price", e.target.value)}
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => removeItem(index)}
//                                     className="text-red-600"
//                                 >✕</button>
//                             </div>
//                         ))}
//
//                         <button type="button" onClick={addItem} className="text-blue-600 text-sm">
//                             + Add Item
//                         </button>
//                     </div>
//
//                     <div className="grid grid-cols-2 gap-4">
//                         <input
//                             placeholder="Paid Amount"
//                             type="number"
//                             className="border p-2 rounded"
//                             value={form.paid_amount}
//                             onChange={e => setForm({ ...form, paid_amount: e.target.value })}
//                         />
//                         <select
//                             className="border p-2 rounded"
//                             value={form.payment_method}
//                             onChange={e => setForm({ ...form, payment_method: e.target.value })}
//                         >
//                             <option value="cash">Cash</option>
//                             <option value="bkash">Bkash</option>
//                             <option value="nagad">Nagad</option>
//                         </select>
//                     </div>
//
//                     <div className="flex justify-end gap-3 pt-4">
//                         <button type="button" onClick={onClose} className="border px-4 py-2 rounded">
//                             Cancel
//                         </button>
//                         <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
//                             {loading ? "Saving..." : "Create Purchase"}
//                         </button>
//                     </div>
//
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default AddPurchaseModal;

//////////////////////////////////////////////////////

// import React, {useMemo, useState} from "react";
// import {posPurchaseProductAPI} from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
//
// const AddPurchaseModal = ({isOpen, onClose, onSuccess}) => {
//
//     const [form, setForm] = useState({
//         invoice_no: "",
//         supplier: "",
//         paid_amount: "",
//         payment_method: "cash",
//         items: [{product: "", quantity: 1, unit_price: ""}]
//     });
//
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//
//     // ✅ HOOK ALWAYS AT TOP
//
//     /* ================= TOTAL CALCULATION ================= */
//     const totalAmount = useMemo(() => {
//         return form.items.reduce((sum, item) => {
//             return sum + (Number(item.quantity) * Number(item.unit_price || 0));
//         }, 0);
//     }, [form.items]);
//
//     const paidAmount = Number(form.paid_amount || 0);
//     const dueAmount = totalAmount - paidAmount;
//
//     if (!isOpen) return null;
//
//
//     /* ================= HANDLERS ================= */
//     const handleItemChange = (index, field, value) => {
//         const items = [...form.items];
//         items[index][field] = value;
//         setForm({...form, items});
//     };
//
//     const addItem = () => {
//         setForm({
//             ...form,
//             items: [...form.items, {product: "", quantity: 1, unit_price: ""}]
//         });
//     };
//
//     const removeItem = (index) => {
//         setForm({
//             ...form,
//             items: form.items.filter((_, i) => i !== index)
//         });
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");
//
//         try {
//             const payload = {
//                 invoice_no: form.invoice_no,
//                 supplier: Number(form.supplier),
//                 paid_amount: paidAmount,
//                 payment_method: form.payment_method,
//                 items: form.items.map(i => ({
//                     product: Number(i.product),
//                     quantity: Number(i.quantity),
//                     unit_price: Number(i.unit_price)
//                 }))
//             };
//
//             const res = await posPurchaseProductAPI.create(payload);
//             onSuccess && onSuccess(res.data);
//             onClose();
//
//         } catch (err) {
//             setError(JSON.stringify(err.response?.data));
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//             <div className="bg-white rounded-xl w-full max-w-4xl p-6">
//
//                 <h2 className="text-xl font-semibold mb-4">🧾 New Purchase</h2>
//
//                 {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
//
//                 <form onSubmit={handleSubmit} className="space-y-4">
//
//                     {/* Invoice & Supplier */}
//                     <div className="grid grid-cols-3 gap-4">
//                         <input
//                             placeholder="Invoice No"
//                             className="border p-2 rounded"
//                             value={form.invoice_no}
//                             onChange={e => setForm({...form, invoice_no: e.target.value})}
//                             required
//                         />
//                         <input
//                             placeholder="Supplier ID"
//                             type="number"
//                             className="border p-2 rounded"
//                             value={form.supplier}
//                             onChange={e => setForm({...form, supplier: e.target.value})}
//                             required
//                         />
//                         <select
//                             className="border p-2 rounded"
//                             value={form.payment_method}
//                             onChange={e => setForm({...form, payment_method: e.target.value})}
//                         >
//                             <option value="cash">Cash</option>
//                             <option value="bkash">Bkash</option>
//                             <option value="nagad">Nagad</option>
//                         </select>
//                     </div>
//
//                     {/* Items */}
//                     <div>
//                         <h3 className="font-medium mb-2">Products</h3>
//
//                         {form.items.map((item, index) => (
//                             <div key={index} className="grid grid-cols-5 gap-2 mb-2">
//                                 <input placeholder="Product ID" type="number" className="border p-2 rounded"
//                                        value={item.product}
//                                        onChange={e => handleItemChange(index, "product", e.target.value)}
//                                        required/>
//                                 <input placeholder="Qty" type="number" className="border p-2 rounded"
//                                        value={item.quantity}
//                                        onChange={e => handleItemChange(index, "quantity", e.target.value)}/>
//                                 <input placeholder="Unit Price" type="number" className="border p-2 rounded"
//                                        value={item.unit_price}
//                                        onChange={e => handleItemChange(index, "unit_price", e.target.value)}/>
//                                 <div className="flex items-center font-medium">
//                                     ৳ {item.quantity * item.unit_price || 0}
//                                 </div>
//                                 <button type="button" onClick={() => removeItem(index)} className="text-red-600">✕
//                                 </button>
//                             </div>
//                         ))}
//
//                         <button type="button" onClick={addItem} className="text-blue-600 text-sm">
//                             + Add Item
//                         </button>
//                     </div>
//
//                     {/* Summary */}
//                     <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
//                         <div>
//                             <p className="text-sm text-gray-500">Total</p>
//                             <p className="font-semibold text-lg">৳ {totalAmount}</p>
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">Paid</p>
//                             <input
//                                 type="number"
//                                 className="border p-2 rounded w-full"
//                                 value={form.paid_amount}
//                                 onChange={e => setForm({...form, paid_amount: e.target.value})}
//                             />
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">Due</p>
//                             <p className={`font-semibold text-lg ${dueAmount > 0 ? "text-red-600" : "text-green-600"}`}>
//                                 ৳ {dueAmount}
//                             </p>
//                         </div>
//                     </div>
//
//                     {/* Actions */}
//                     <div className="flex justify-end gap-3 pt-4">
//                         <button type="button" onClick={onClose} className="border px-4 py-2 rounded">
//                             Cancel
//                         </button>
//                         <button type="submit" disabled={loading}
//                                 className="bg-blue-600 text-white px-5 py-2 rounded">
//                             {loading ? "Saving..." : "Save Purchase"}
//                         </button>
//                     </div>
//
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default AddPurchaseModal;

///////////////////////////////////


// import React, {useEffect, useRef, useState} from "react";
// import AsyncSelect from "react-select/async";
// import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
// import {posPurchaseProductAPI} from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
// import {posSupplierdAPI} from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";
//
// const emptyItem = {
//     product: null,
//     product_name: "",
//     unit_price: 0,
//     quantity: 1,
//     total_price: 0,
// };
//
// const AddPurchasePage = ({isOpen, onClose, onSuccess}) => {
//     /* -------------------- STATE -------------------- */
//     const [supplier, setSupplier] = useState(null);
//     const [items, setItems] = useState([{...emptyItem}]);
//     const [paidAmount, setPaidAmount] = useState(0);
//     const [paymentMethod, setPaymentMethod] = useState("cash");
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//
//     const barcodeRef = useRef(null);
//
//     /* -------------------- EFFECTS -------------------- */
//     useEffect(() => {
//         if (isOpen && barcodeRef.current) {
//             barcodeRef.current.focus();
//         }
//     }, [isOpen]);
//
//     if (!isOpen) return null;
//
//     /* -------------------- SUPPLIER SEARCH -------------------- */
//     const loadSupplierOptions = async (inputValue) => {
//         const res = await posSupplierdAPI.search(inputValue || "");
//         return res.data.map(s => ({
//             value: s.id,
//             label: s.name,
//             image: s.image,
//         }));
//     };
//
//     /* -------------------- PRODUCT SEARCH -------------------- */
//     const loadProductOptions = async (inputValue) => {
//         if (!inputValue) return [];
//         const res = await posProductAPI.search(inputValue);
//         return res.data.map(p => ({
//             value: p.id,
//             label: p.name,
//             unit_price: Number(p.purchase_price),
//             code: p.product_code,
//         }));
//     };
//
//     const selectProduct = (option, index) => {
//         const updated = [...items];
//         updated[index] = {
//             ...updated[index],
//             product: option.value,
//             product_name: option.label,
//             unit_price: option.unit_price,
//             quantity: 1,
//             total_price: option.unit_price,
//         };
//         setItems(updated);
//     };
//
//     /* -------------------- BARCODE SCAN -------------------- */
//     const handleBarcodeScan = async (e) => {
//         if (e.key !== "Enter") return;
//
//         const code = e.target.value.trim();
//         if (!code) return;
//
//         try {
//             const res = await posProductAPI.search(code);
//             if (res.data.length) {
//                 const p = res.data[0];
//                 selectProduct(
//                     {
//                         value: p.id,
//                         label: p.name,
//                         unit_price: Number(p.purchase_price),
//                     },
//                     0
//                 );
//             }
//         } catch (err) {
//             console.error("Barcode scan failed", err);
//         }
//
//         e.target.value = "";
//     };
//
//     /* -------------------- ITEM HANDLERS -------------------- */
//     const updateQty = (index, qty) => {
//         const updated = [...items];
//         updated[index].quantity = qty;
//         updated[index].total_price = qty * updated[index].unit_price;
//         setItems(updated);
//     };
//
//     const addRow = () => setItems([...items, {...emptyItem}]);
//     const removeRow = (index) =>
//         setItems(items.filter((_, i) => i !== index));
//
//     /* -------------------- CALCULATIONS -------------------- */
//     const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
//     const dueAmount = subtotal - paidAmount;
//
//     /* -------------------- SUBMIT -------------------- */
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrors({});
//
//         if (!supplier) {
//             setErrors({supplier: "Supplier required"});
//             return;
//         }
//
//         if (items.some(i => !i.product)) {
//             setErrors({items: "All product rows must be filled"});
//             return;
//         }
//
//         const payload = {
//             invoice_no: "",
//             supplier: supplier.value,
//             paid_amount: paidAmount,
//             payment_method: paymentMethod,
//             items: items.map(i => ({
//                 product: i.product,
//                 quantity: i.quantity,
//                 unit_price: i.unit_price,
//             })),
//         };
//
//         try {
//             setLoading(true);
//             const res = await posPurchaseProductAPI.create(payload);
//             onSuccess?.(res.data);
//             onClose();
//         } catch (err) {
//             setErrors(err.response?.data || {});
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     /* -------------------- UI -------------------- */
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
//
//                 {/* Hidden barcode input */}
//                 <input
//                     ref={barcodeRef}
//                     onKeyDown={handleBarcodeScan}
//                     className="absolute opacity-0"
//                 />
//
//                 <div className="p-6 border-b flex justify-between">
//                     <h2 className="text-2xl font-bold">New Purchase</h2>
//                     <button onClick={onClose} className="text-xl">×</button>
//                 </div>
//
//                 <form onSubmit={handleSubmit} className="p-6 space-y-6">
//
//                     {/* Supplier */}
//                     <div>
//                         <label className="font-medium">Supplier *</label>
//                         <AsyncSelect
//                             cacheOptions
//                             defaultOptions
//                             loadOptions={loadSupplierOptions}
//                             value={supplier}
//                             onChange={setSupplier}
//                             placeholder="Search supplier..."
//                         />
//                         {errors.supplier && (
//                             <p className="text-red-500 text-sm">{errors.supplier}</p>
//                         )}
//                     </div>
//
//
//
//                     {/* Items */}
//                     <div className="space-y-3">
//                         {items.map((item, index) => (
//                             <div key={index} className="grid grid-cols-12 gap-2">
//                                 <div className="col-span-5">
//                                     <AsyncSelect
//                                         loadOptions={loadProductOptions}
//                                         onChange={(opt) => selectProduct(opt, index)}
//                                         value={
//                                             item.product
//                                                 ? {value: item.product, label: item.product_name}
//                                                 : null
//                                         }
//                                         placeholder="Search product / scan barcode"
//                                     />
//                                 </div>
//                                 <input
//                                     className="col-span-2 border p-2 rounded"
//                                     value={item.unit_price}
//                                     disabled
//                                 />
//                                 <input
//                                     className="col-span-2 border p-2 rounded"
//                                     type="number"
//                                     value={item.quantity}
//                                     onChange={(e) =>
//                                         updateQty(index, Number(e.target.value))
//                                     }
//                                 />
//                                 <input
//                                     className="col-span-2 border p-2 rounded bg-gray-100"
//                                     value={item.total_price}
//                                     disabled
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => removeRow(index)}
//                                     className="col-span-1 text-red-600"
//                                 >
//                                     ×
//                                 </button>
//                             </div>
//                         ))}
//                         <button
//                             type="button"
//                             onClick={addRow}
//                             className="text-blue-600"
//                         >
//                             + Add Item
//                         </button>
//                     </div>
//
//                     {/* Summary */}
//                     <div className="grid grid-cols-3 gap-4">
//                         <div>
//                             <label>Subtotal</label>
//                             <input className="w-full border p-2 bg-gray-100" value={subtotal} disabled/>
//                         </div>
//                         <div>
//                             <label>Paid</label>
//                             <input
//                                 className="w-full border p-2"
//                                 type="number"
//                                 value={paidAmount}
//                                 onChange={(e) => setPaidAmount(Number(e.target.value))}
//                             />
//                         </div>
//                         <div>
//                             <label>Due</label>
//                             <input className="w-full border p-2 bg-gray-100" value={dueAmount} disabled/>
//                         </div>
//                     </div>
//
//                     <div>
//                         <label>Payment Method</label>
//                         <select
//                             className="w-full border p-2 rounded"
//                             value={paymentMethod}
//                             onChange={(e) => setPaymentMethod(e.target.value)}
//                         >
//                             <option value="cash">Cash</option>
//                             <option value="bcash">bKash</option>
//                             <option value="bank">Bank</option>
//                         </select>
//                     </div>
//
//                     <div className="flex justify-end gap-3">
//                         <button type="button" onClick={onClose} className="border px-6 py-2 rounded">
//                             Cancel
//                         </button>
//                         <button
//                             disabled={loading}
//                             className="bg-blue-600 text-white px-6 py-2 rounded"
//                         >
//                             {loading ? "Saving..." : "Save Purchase"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default AddPurchasePage;

////////////////////////////////////////////////

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

        // if (!invoiceNo) {
        //     setErrors({ invoice_no: "Invoice number required" });
        //     return;
        // }

        if (!supplier) {
            setErrors({ supplier: "Supplier required" });
            return;
        }

        if (items.some(i => !i.product)) {
            setErrors({ items: "All product rows must be filled" });
            return;
        }

        const payload = {
            // invoice_no: invoiceNo,
            supplier: supplier.value,
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
                            <div key={index} className="grid grid-cols-12 gap-2">
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
                            <input className="w-full border p-2 bg-gray-100" value={subtotal} disabled />
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
                            <input className="w-full border p-2 bg-gray-100" value={dueAmount} disabled />
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
                            {loading ? "Saving..." : "Save Purchase"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddPurchasePage;

