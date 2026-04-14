//
// import React, {useEffect, useState, useCallback} from "react";
// import axios from "axios";
// import {FaTrash} from "react-icons/fa";
// import BASE_URL_of_POS from "../../../posConfig";
//
// const EditSaleReturnModal = ({open, onClose, purchase, onUpdated}) => {
//     const [form, setForm] = useState(null);
//     const [saving, setSaving] = useState(false);
//     const [errors, setErrors] = useState({});
//
//     /* ================= INIT ================= */
//     useEffect(() => {
//         if (open && purchase) {
//             // Deep copy + preserve original returned qty
//             const cloned = JSON.parse(JSON.stringify(purchase));
//             cloned.items = cloned.items.map(item => ({
//                 ...item,
//                 _original_quantity: Number(item.quantity), // for edit validation
//             }));
//             setForm(cloned);
//         }
//     }, [open, purchase]);
//
//     /* ================= RECALCULATE ================= */
//     const recalculate = useCallback((data) => {
//         let total = 0;
//
//         data.items.forEach(item => {
//             const qty = Number(item.quantity) || 0;
//             const price = Number(item.unit_price) || 0;
//             item.total_price = (qty * price).toFixed(2);
//             total += qty * price;
//         });
//
//         const paid = Number(data.paid_amount) || 0;
//
//         return {
//             ...data,
//             total_return_amount: total.toFixed(2),
//             due_amount: (total - paid).toFixed(2),
//         };
//     }, []);
//
//     useEffect(() => {
//         if (form) {
//             setForm(prev => recalculate({...prev}));
//         }
//     }, [form?.items, form?.paid_amount, recalculate]);
//
//     if (!open || !form) return null;
//
//     /* ================= HELPERS ================= */
//     const getAvailableQty = (item) => {
//         // return (
//         //     Number(item.purchased_quantity) -
//         //     (Number(item._original_quantity) - Number(item.quantity))
//         // );
//         return (
//             Number(item.available_quantity));
//     };
//
//     /* ================= HANDLERS ================= */
//     const handleItemChange = (index, field, value) => {
//         setForm(prev => {
//             const items = [...prev.items];
//             items[index][field] = value;
//             return {...prev, items};
//         });
//     };
//
//     const handleRemoveItem = (index) => {
//         setForm(prev => ({
//             ...prev,
//             items: prev.items.filter((_, i) => i !== index),
//         }));
//     };
//
//     const handleChange = (field, value) => {
//         setForm(prev => ({...prev, [field]: value}));
//     };
//
//     /* ================= VALIDATION ================= */
//     const validate = () => {
//         const errs = {};
//
//         form.items.forEach((item, index) => {
//             const qty = Number(item.quantity);
//             const available = getAvailableQty(item);
//
//             if (qty <= 0) {
//                 errs[index] = "Quantity must be greater than 0";
//             } else if (qty > available) {
//                 errs[index] = `Max allowed: ${available}`;
//             }
//         });
//
//         setErrors(errs);
//         return Object.keys(errs).length === 0;
//     };
//
//     /* ================= SUBMIT ================= */
//     const handleSubmit = async () => {
//         if (!validate()) return;
//
//         try {
//             setSaving(true);
//
//             const payload = {
//                 payment_method: form.payment_method,
//                 paid_amount: Number(form.paid_amount) || 0,
//                 note: form.note || "",
//                 return_reason: form.return_reason || "",
//                 items: form.items.map(item => ({
//                     id: item.id,
//                     purchase_item: item.purchase_item,
//                     available_quantity:item.available_quantity,
//                     quantity: Number(item.quantity),
//                     unit_price: Number(item.unit_price),
//                     reason: item.reason || "",
//                 })),
//             };
//
//             const res = await axios.patch(
//                 `${BASE_URL_of_POS}/api/sale/sale-returns/${form.id}/`,
//                 payload
//             );
//
//             onUpdated(res.data);
//             onClose();
//         } catch (err) {
//             console.error("Update failed", err);
//             alert("Update failed. Check console.");
//         } finally {
//             setSaving(false);
//         }
//     };
//
//     /* ================= UI ================= */
//     return (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//
//                 {/* HEADER */}
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold">
//                         Edit Purchase Return – Invoice #{form.purchase_invoice_no}
//                     </h2>
//                     <button onClick={onClose} className="text-2xl">&times;</button>
//                 </div>
//
//                 {/* ITEMS */}
//                 <table className="w-full border mb-6">
//                     <thead className="bg-gray-100">
//                     <tr>
//                         <th className="px-4 py-2 text-left">Product</th>
//                         <th className="px-4 py-2">Returned Qty</th>
//                         <th className="px-4 py-2">Unit Price</th>
//                         <th className="px-4 py-2 text-right">Total</th>
//                         <th/>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {form.items.map((item, index) => {
//                         const available = getAvailableQty(item);
//                         return (
//                             <tr key={item.id} className="border-t">
//                                 <td className="px-4 py-2">
//                                     <div className="font-medium">{item.product_name}</div>
//                                     <div className="text-xs text-gray-500">
//                                         Purchased: {item.purchased_quantity} |
//                                         Already Returned: {item._original_quantity} |
//                                         Available: {available}
//                                     </div>
//                                 </td>
//
//                                 <td className="px-4 py-2">
//                                     <input
//                                         type="number"
//                                         min="1"
//                                         max={available}
//                                         value={item.quantity}
//                                         onChange={e =>
//                                             handleItemChange(index, "quantity", e.target.value)
//                                         }
//                                         className="input w-24 text-center"
//                                     />
//                                     {errors[index] && (
//                                         <p className="text-xs text-red-600 mt-1">
//                                             {errors[index]}
//                                         </p>
//                                     )}
//                                 </td>
//
//                                 <td className="px-4 py-2">
//                                     <input
//                                         type="number"
//                                         step="0.01"
//                                         value={item.unit_price}
//                                         onChange={e =>
//                                             handleItemChange(index, "unit_price", e.target.value)
//                                         }
//                                         className="input w-32 text-right"
//                                     />
//                                 </td>
//
//                                 <td className="px-4 py-2 text-right">
//                                     ৳{item.total_price}
//                                 </td>
//
//                                 <td className="px-4 py-2 text-center">
//                                     <button
//                                         onClick={() => handleRemoveItem(index)}
//                                         className="text-red-500 hover:text-red-700"
//                                     >
//                                         <FaTrash/>
//                                     </button>
//                                 </td>
//                             </tr>
//                         );
//                     })}
//                     </tbody>
//                 </table>
//
//                 {/* PAYMENT */}
//                 <div className="grid md:grid-cols-2 gap-6 mb-6">
//                     <div>
//                         <label className="font-semibold block mb-2">Payment Method</label>
//                         <select
//                             className="input"
//                             value={form.payment_method || ""}
//                             onChange={e => handleChange("payment_method", e.target.value)}
//                         >
//                             <option value="">Select</option>
//                             <option value="cash">Cash</option>
//                             <option value="bkash">Bkash</option>
//                             <option value="bank">Bank</option>
//                         </select>
//                     </div>
//
//                     <div className="space-y-2">
//                         <div className="flex justify-between">
//                             <span>Subtotal</span>
//                             <strong>৳{form.total_return_amount}</strong>
//                         </div>
//                         <div className="flex justify-between items-center">
//                             <span>Paid</span>
//                             <input
//                                 type="number"
//                                 step="0.01"
//                                 value={form.paid_amount}
//                                 onChange={e =>
//                                     handleChange("paid_amount", e.target.value)
//                                 }
//                                 className="input w-32 text-right"
//                             />
//                         </div>
//                         <div className="flex justify-between border-t pt-2">
//                             <span className="font-semibold">Due</span>
//                             <strong className="text-red-600">
//                                 ৳{form.due_amount}
//                             </strong>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* ACTIONS */}
//                 <div className="flex justify-end gap-4">
//                     <button onClick={onClose} className="btn-gray">Cancel</button>
//                     <button
//                         onClick={handleSubmit}
//                         disabled={saving}
//                         className="btn-primary"
//                     >
//                         {saving ? "Saving..." : "Save Changes"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default EditSaleReturnModal;
//





import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import BASE_URL_of_POS from "../../../posConfig";

const EditSaleReturnModal = ({ open, onClose, purchase, onUpdated }) => {
    const [form, setForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [originalItems, setOriginalItems] = useState([]);

    /* ================= INIT ================= */
    useEffect(() => {
        if (open && purchase) {
            // Deep copy of sale return
            const cloned = JSON.parse(JSON.stringify(purchase));

            // Store original items for comparison
            setOriginalItems(cloned.items);

            // Map items for editing
            cloned.items = cloned.items.map(item => ({
                ...item,
                _original_return_qty: Number(item.sale_return_quantity) || 0,
                _sale_item_quantity: Number(item.sold_quantity) || 0,
            }));

            setForm(cloned);
        }
    }, [open, purchase]);

    /* ================= RECALCULATE ================= */
    const recalculate = useCallback((data) => {
        let totalReturnAmount = 0;

        data.items.forEach(item => {
            const returnQty = Number(item.sale_return_quantity) || 0;
            const unitPrice = Number(item.unit_price) || 0;
            item.total_price = (returnQty * unitPrice).toFixed(2);
            totalReturnAmount += returnQty * unitPrice;
        });

        const paid = Number(data.paid_amount) || 0;
        const dueAmount = totalReturnAmount - paid;

        // Determine payment status
        let paymentStatus = 'unpaid';
        if (paid === 0) {
            paymentStatus = 'unpaid';
        } else if (paid >= totalReturnAmount) {
            paymentStatus = 'paid';
        } else {
            paymentStatus = 'partial';
        }

        return {
            ...data,
            total_return_amount: totalReturnAmount.toFixed(2),
            due_amount: dueAmount.toFixed(2),
            payment_status: paymentStatus,
        };
    }, []);

    useEffect(() => {
        if (form) {
            setForm(prev => recalculate({ ...prev }));
        }
    }, [form?.items, form?.paid_amount, recalculate]);

    if (!open || !form) return null;

    /* ================= HELPERS ================= */
    const getAvailableQuantity = (item) => {
        const soldQty = Number(item.sold_quantity) || 0;
        const alreadyReturned = originalItems
            .filter(orig => orig.sale_item === item.sale_item)
            .reduce((sum, orig) => sum + (Number(orig.sale_return_quantity) || 0), 0);

        // return soldQty - alreadyReturned + (Number(item.sale_return_quantity) || 0);
        return soldQty - alreadyReturned;
    };

    const getOriginalSaleInfo = (item) => {
        const originalItem = originalItems.find(orig => orig.sale_item === item.sale_item);
        return {
            originalReturnQty: originalItem ? Number(originalItem.sale_return_quantity) || 0 : 0,
            alreadyReturned: originalItems
                .filter(orig => orig.sale_item === item.sale_item)
                .reduce((sum, orig) => sum + (Number(orig.sale_return_quantity) || 0), 0)
        };
    };

    /* ================= HANDLERS ================= */
    const handleItemChange = (index, field, value) => {
        setForm(prev => {
            const items = [...prev.items];
            items[index][field] = value;
            return { ...prev, items };
        });
    };

    const handleRemoveItem = (index) => {
        if (window.confirm("Are you sure you want to remove this item from the return?")) {
            setForm(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index),
            }));
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[index];
                return newErrors;
            });
        }
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    /* ================= VALIDATION ================= */
    const validate = () => {
        const errs = {};

        form.items.forEach((item, index) => {
            const returnQty = Number(item.sale_return_quantity) || 0;
            const available = getAvailableQuantity(item);
            const soldQty = Number(item.sold_quantity) || 0;

            if (returnQty <= 0) {
                errs[index] = "Return quantity must be greater than 0";
            } else if (returnQty > soldQty) {
                errs[index] = `Cannot return more than sold quantity (${soldQty})`;
            }
            // else if (returnQty > available) {
            //     const originalInfo = getOriginalSaleInfo(item) + soldQty;
            //     errs[index] = `Exceeds available quantity. Available: ${available} (Sold: ${soldQty}, Already returned in other returns: ${originalInfo.alreadyReturned - originalInfo.originalReturnQty})`;
            // }
        });

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setSaving(true);

            const payload = {
                sale: form.sale,
                customer: form.customer,
                payment_method: form.payment_method,
                paid_amount: Number(form.paid_amount) || 0,
                note: form.note || "",
                return_reason: form.return_reason || "",
                items: form.items.map(item => ({
                    sale_item: item.sale_item,
                    sale_return_quantity: Number(item.sale_return_quantity) || 0,
                    unit_price: Number(item.unit_price) || 0,
                    reason: item.reason || "Customer Return",
                })),
            };

            console.log("Update payload:", payload);

            const res = await axios.put(
                `${BASE_URL_of_POS}/api/sale/sale-returns/${form.id}/`,
                payload
            );

            onUpdated(res.data);
            onClose();
        } catch (err) {
            console.error("Update failed:", err.response?.data || err.message);
            alert(`Update failed: ${err.response?.data?.message || err.message}`);
        } finally {
            setSaving(false);
        }
    };

    /* ================= UI ================= */
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">

                {/* HEADER */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Edit Sale Return
                            </h2>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                    Invoice #{form.sale_invoice_no}
                                </span>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                                    {form.customer_name || 'Walk-in Customer'}
                                </span>
                                <span className={`px-3 py-1 rounded-full font-medium ${
                                    form.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                    form.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {form.payment_status?.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-2xl text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            &times;
                        </button>
                    </div>
                </div>

                {/* MAIN CONTENT - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Return Info */}
                    <div className="mb-6 grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Return Reason
                            </label>
                            <textarea
                                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows="2"
                                value={form.return_reason || ""}
                                onChange={e => handleChange("return_reason", e.target.value)}
                                placeholder="Reason for return..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Notes
                            </label>
                            <textarea
                                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows="2"
                                value={form.note || ""}
                                onChange={e => handleChange("note", e.target.value)}
                                placeholder="Additional notes..."
                            />
                        </div>
                    </div>

                    {/* ITEMS TABLE */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Return Items</h3>
                        <div className="overflow-x-auto rounded-lg border shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sold
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Available
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Return Qty
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Unit Price
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {form.items.map((item, index) => {
                                        const available = getAvailableQuantity(item);
                                        const originalInfo = getOriginalSaleInfo(item);

                                        return (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{item.product_name}</div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        <div>Original Return: {originalInfo.originalReturnQty}</div>
                                                        <div>Total Already Returned: {originalInfo.alreadyReturned}</div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-center">
                                                    {/*<span className="font-medium">{item.sold_quantity}</span>*/}
                                                    <span className={`font-medium ${item.sold_quantity < item.sale_return_quantity ? 'text-red-600' : 'text-green-600'}`}>{item.sold_quantity}</span>
                                                </td>

                                                <td className="px-6 py-4 text-center">
                                                    <span className={`font-medium ${available < item.sale_return_quantity ? 'text-red-600' : 'text-green-600'}`}>
                                                        {available}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col items-center">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={available}
                                                            value={item.sale_return_quantity || ""}
                                                            onChange={e =>
                                                                handleItemChange(index, "sale_return_quantity", e.target.value)
                                                            }
                                                            className="w-24 text-center border rounded-lg py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                        {errors[index] && (
                                                            <p className="text-xs text-red-600 mt-1 text-center">
                                                                {errors[index]}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={item.unit_price || ""}
                                                        onChange={e =>
                                                            handleItemChange(index, "unit_price", e.target.value)
                                                        }
                                                        className="w-32 text-right border rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </td>

                                                <td className="px-6 py-4 text-right font-medium text-gray-900">
                                                    ৳{item.total_price || "0.00"}
                                                </td>

                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => handleRemoveItem(index)}
                                                        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                                                        title="Remove item"
                                                    >
                                                        <FaTrash size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PAYMENT SECTION */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Payment Method */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Payment Method
                                </label>
                                <select
                                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    value={form.payment_method || ""}
                                    onChange={e => handleChange("payment_method", e.target.value)}
                                >
                                    <option value="">Select Method</option>
                                    <option value="hand cash">Hand Cash</option>
                                    <option value="bkash">bKash</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="card">Credit/Debit Card</option>
                                    <option value="due">Due</option>
                                </select>
                            </div>

                            {/* Payment Summary */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-gray-600">Total Return Amount:</span>
                                    <strong className="text-xl text-gray-900">
                                        ৳{form.total_return_amount || "0.00"}
                                    </strong>
                                </div>

                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-gray-600">Paid Amount:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">৳</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max={form.total_return_amount || 0}
                                            value={form.paid_amount || ""}
                                            onChange={e => handleChange("paid_amount", e.target.value)}
                                            className="w-40 text-right border rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-semibold text-gray-700">Due Amount:</span>
                                    <strong className={`text-2xl ${
                                        Number(form.due_amount) > 0 ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                        ৳{form.due_amount || "0.00"}
                                    </strong>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Payment Status:</span>
                                    <span className={`px-3 py-1 rounded-full font-medium ${
                                        form.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                        form.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {form.payment_status?.toUpperCase() || 'UNPAID'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER - Fixed at bottom */}
                <div className="border-t bg-white px-6 py-4">
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={saving || form.items.length === 0}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                    Updating...
                                </span>
                            ) : (
                                "Update Sale Return"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditSaleReturnModal;