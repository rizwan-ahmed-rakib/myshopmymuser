

// import React, {useState, useEffect, useCallback} from "react";
// import axios from "axios";
// import BASE_URL_of_POS from "../../../posConfig";
// import {FaTrash} from "react-icons/fa";
//
// const EditPurchaseReturnModal = ({open, onClose, purchase, onUpdated}) => {
//     const [editableReturn, setEditableReturn] = useState(null);
//     const [saving, setSaving] = useState(false);
//
//     /* ================= INIT DATA ================= */
//     useEffect(() => {
//         if (purchase && open) {
//             setEditableReturn(JSON.parse(JSON.stringify(purchase)));
//         }
//     }, [purchase, open]);
//
//     /* ================= RECALCULATE ================= */
//     const recalculateTotals = useCallback((data) => {
//         const total = data.items.reduce((sum, item) => {
//             const qty = Number(item.quantity) || 0;
//             const price = Number(item.unit_price) || 0;
//             return sum + qty * price;
//         }, 0);
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
//         if (editableReturn) {
//             setEditableReturn((prev) => recalculateTotals(prev));
//         }
//     }, [editableReturn?.items, editableReturn?.paid_amount, recalculateTotals]);
//
//     if (!open || !editableReturn) return null;
//
//     /* ================= HANDLERS ================= */
//     const handleItemChange = (index, field, value) => {
//         setEditableReturn((prev) => {
//             const items = [...prev.items];
//             items[index] = {...items[index], [field]: value};
//             return {...prev, items};
//         });
//     };
//
//     const handleRemoveItem = (index) => {
//         setEditableReturn((prev) => ({
//             ...prev,
//             items: prev.items.filter((_, i) => i !== index),
//         }));
//     };
//
//     const handleChange = (field, value) => {
//         setEditableReturn((prev) => ({...prev, [field]: value}));
//     };
//
//     /* ================= SUBMIT ================= */
//     const handleSubmit = async () => {
//         try {
//             setSaving(true);
//
//             const payload = {
//                 payment_method: editableReturn.payment_method,
//                 paid_amount: Number(editableReturn.paid_amount) || 0,
//                 note: editableReturn.note || "",
//                 return_reason: editableReturn.return_reason || "",
//                 items: editableReturn.items.map((item) => ({
//                     id: item.id,
//                     purchase_item: item.purchase_item,
//                     quantity: Number(item.quantity),
//                     unit_price: Number(item.unit_price),
//                     reason: item.reason || "",
//                 })),
//             };
//
//             const res = await axios.patch(
//                 `${BASE_URL_of_POS}/api/purchase/purchase-returns/${editableReturn.id}/`,
//                 payload
//             );
//
//             onUpdated(res.data);
//             onClose();
//         } catch (err) {
//             console.error("Purchase return update failed:", err);
//             alert("Update failed. Please check console.");
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
//                         Edit Purchase Return (Invoice #{editableReturn.purchase_invoice_no})
//                     </h2>
//                     <button onClick={onClose} className="text-2xl">&times;</button>
//                 </div>
//
//                 {/* ITEMS */}
//                 <div className="mb-6">
//                     <h3 className="text-lg font-semibold mb-2">Returned Items</h3>
//
//                     <table className="w-full border">
//                         <thead className="bg-gray-100">
//                         <tr>
//                             <th className="px-4 py-2 text-left">Product</th>
//                             <th className="px-4 py-2">Returned Qty</th>
//                             <th className="px-4 py-2">Unit Price</th>
//                             <th className="px-4 py-2 text-right">Total</th>
//                             <th/>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {editableReturn.items.map((item, index) => (
//                             <tr key={item.id} className="border-t">
//                                 <td className="px-4 py-2">{item.product_name}</td>
//                                 <td className="px-4 py-2">
//                                     <input
//                                         type="number"
//                                         min="0"
//                                         max={item.purchased_quantity}
//                                         value={item.quantity}
//                                         onChange={(e) =>
//                                             handleItemChange(index, "quantity", e.target.value)
//                                         }
//                                         className="input w-24 text-center"
//                                     />
//                                 </td>
//                                 <td className="px-4 py-2">
//                                     <input
//                                         type="number"
//                                         step="0.01"
//                                         value={item.unit_price}
//                                         onChange={(e) =>
//                                             handleItemChange(index, "unit_price", e.target.value)
//                                         }
//                                         className="input w-32 text-right"
//                                     />
//                                 </td>
//                                 <td className="px-4 py-2 text-right">
//                                     ৳{item.total_price}
//                                 </td>
//                                 <td className="px-4 py-2 text-center">
//                                     <button
//                                         onClick={() => handleRemoveItem(index)}
//                                         className="text-red-500 hover:text-red-700"
//                                     >
//                                         <FaTrash/>
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 </div>
//
//                 {/* PAYMENT */}
//                 <div className="grid md:grid-cols-2 gap-6">
//                     <div>
//                         <label className="font-semibold block mb-2">Payment Method</label>
//                         <select
//                             className="input"
//                             value={editableReturn.payment_method || ""}
//                             onChange={(e) =>
//                                 handleChange("payment_method", e.target.value)
//                             }
//                         >
//                             <option value="">Select</option>
//                             <option value="cash">Cash</option>
//                             <option value="bkash">Bkash</option>
//                             <option value="bank">Bank</option>
//                         </select>
//                     </div>
//
//                     <div className="space-y-3">
//                         <div className="flex justify-between">
//                             <span>Subtotal</span>
//                             <strong>৳{editableReturn.total_return_amount}</strong>
//                         </div>
//
//                         <div className="flex justify-between items-center">
//                             <span>Paid</span>
//                             <input
//                                 type="number"
//                                 step="0.01"
//                                 className="input w-32 text-right"
//                                 value={editableReturn.paid_amount}
//                                 onChange={(e) =>
//                                     handleChange("paid_amount", e.target.value)
//                                 }
//                             />
//                         </div>
//
//                         <div className="flex justify-between border-t pt-3">
//                             <span className="font-semibold">Due</span>
//                             <strong className="text-red-600">
//                                 ৳{editableReturn.due_amount}
//                             </strong>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* ACTIONS */}
//                 <div className="flex justify-end gap-4 mt-8">
//                     <button onClick={onClose} className="btn-gray">
//                         Cancel
//                     </button>
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
// export default EditPurchaseReturnModal;


import React, {useEffect, useState, useCallback} from "react";
import axios from "axios";
import {FaTrash} from "react-icons/fa";
import BASE_URL_of_POS from "../../../posConfig";

const EditPurchaseReturnModal = ({open, onClose, purchase, onUpdated}) => {
    const [form, setForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    /* ================= INIT ================= */
    useEffect(() => {
        if (open && purchase) {
            // Deep copy + preserve original returned qty
            const cloned = JSON.parse(JSON.stringify(purchase));
            cloned.items = cloned.items.map(item => ({
                ...item,
                _original_quantity: Number(item.quantity), // for edit validation
            }));
            setForm(cloned);
        }
    }, [open, purchase]);

    /* ================= RECALCULATE ================= */
    const recalculate = useCallback((data) => {
        let total = 0;

        data.items.forEach(item => {
            const qty = Number(item.quantity) || 0;
            const price = Number(item.unit_price) || 0;
            item.total_price = (qty * price).toFixed(2);
            total += qty * price;
        });

        const paid = Number(data.paid_amount) || 0;

        return {
            ...data,
            total_return_amount: total.toFixed(2),
            due_amount: (total - paid).toFixed(2),
        };
    }, []);

    useEffect(() => {
        if (form) {
            setForm(prev => recalculate({...prev}));
        }
    }, [form?.items, form?.paid_amount, recalculate]);

    if (!open || !form) return null;

    /* ================= HELPERS ================= */
    const getAvailableQty = (item) => {
        // return (
        //     Number(item.purchased_quantity) -
        //     (Number(item._original_quantity) - Number(item.quantity))
        // );
        return (
            Number(item.available_quantity));
    };

    /* ================= HANDLERS ================= */
    const handleItemChange = (index, field, value) => {
        setForm(prev => {
            const items = [...prev.items];
            items[index][field] = value;
            return {...prev, items};
        });
    };

    const handleRemoveItem = (index) => {
        setForm(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const handleChange = (field, value) => {
        setForm(prev => ({...prev, [field]: value}));
    };

    /* ================= VALIDATION ================= */
    const validate = () => {
        const errs = {};

        form.items.forEach((item, index) => {
            const qty = Number(item.quantity);
            const available = getAvailableQty(item);

            if (qty <= 0) {
                errs[index] = "Quantity must be greater than 0";
            } else if (qty > available) {
                errs[index] = `Max allowed: ${available}`;
            }
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
                payment_method: form.payment_method,
                paid_amount: Number(form.paid_amount) || 0,
                note: form.note || "",
                return_reason: form.return_reason || "",
                items: form.items.map(item => ({
                    id: item.id,
                    purchase_item: item.purchase_item,
                    available_quantity:item.available_quantity,
                    quantity: Number(item.quantity),
                    unit_price: Number(item.unit_price),
                    reason: item.reason || "",
                })),
            };

            const res = await axios.patch(
                `${BASE_URL_of_POS}/api/purchase/purchase-returns/${form.id}/`,
                payload
            );

            onUpdated(res.data);
            onClose();
        } catch (err) {
            console.error("Update failed", err);
            alert("Update failed. Check console.");
        } finally {
            setSaving(false);
        }
    };

    /* ================= UI ================= */
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        Edit Purchase Return – Invoice #{form.purchase_invoice_no}
                    </h2>
                    <button onClick={onClose} className="text-2xl">&times;</button>
                </div>

                {/* ITEMS */}
                <table className="w-full border mb-6">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2">Returned Qty</th>
                        <th className="px-4 py-2">Unit Price</th>
                        <th className="px-4 py-2 text-right">Total</th>
                        <th/>
                    </tr>
                    </thead>
                    <tbody>
                    {form.items.map((item, index) => {
                        const available = getAvailableQty(item);
                        return (
                            <tr key={item.id} className="border-t">
                                <td className="px-4 py-2">
                                    <div className="font-medium">{item.product_name}</div>
                                    <div className="text-xs text-gray-500">
                                        Purchased: {item.purchased_quantity} |
                                        Already Returned: {item._original_quantity} |
                                        Available: {available}
                                    </div>
                                </td>

                                <td className="px-4 py-2">
                                    <input
                                        type="number"
                                        min="1"
                                        max={available}
                                        value={item.quantity}
                                        onChange={e =>
                                            handleItemChange(index, "quantity", e.target.value)
                                        }
                                        className="input w-24 text-center"
                                    />
                                    {errors[index] && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {errors[index]}
                                        </p>
                                    )}
                                </td>

                                <td className="px-4 py-2">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={item.unit_price}
                                        onChange={e =>
                                            handleItemChange(index, "unit_price", e.target.value)
                                        }
                                        className="input w-32 text-right"
                                    />
                                </td>

                                <td className="px-4 py-2 text-right">
                                    ৳{item.total_price}
                                </td>

                                <td className="px-4 py-2 text-center">
                                    <button
                                        onClick={() => handleRemoveItem(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash/>
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                {/* PAYMENT */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="font-semibold block mb-2">Payment Method</label>
                        <select
                            className="input"
                            value={form.payment_method || ""}
                            onChange={e => handleChange("payment_method", e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="cash">Cash</option>
                            <option value="bkash">Bkash</option>
                            <option value="bank">Bank</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <strong>৳{form.total_return_amount}</strong>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Paid</span>
                            <input
                                type="number"
                                step="0.01"
                                value={form.paid_amount}
                                onChange={e =>
                                    handleChange("paid_amount", e.target.value)
                                }
                                className="input w-32 text-right"
                            />
                        </div>
                        <div className="flex justify-between border-t pt-2">
                            <span className="font-semibold">Due</span>
                            <strong className="text-red-600">
                                ৳{form.due_amount}
                            </strong>
                        </div>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="btn-gray">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="btn-primary"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPurchaseReturnModal;

