//
// import React, {useEffect, useState, useCallback} from "react";
// import api from '../../../context_or_provider/pos/posApi';
// import {FaTrash} from "react-icons/fa";
// 
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
//             const res = await api.patch(
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
import api from '../../../context_or_provider/pos/posApi';
import { FaTrash } from "react-icons/fa";


const EditSaleReturnModal = ({ open, onClose, purchase, onUpdated }) => {
    const [form, setForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [originalItems, setOriginalItems] = useState([]);

    // Hybrid Payment States (Internal to form)
    const [paidCash, setPaidCash] = useState(0);
    const [paidMobile, setPaidMobile] = useState(0);
    const [paidBank, setPaidBank] = useState(0);
    const [mobileOperator, setMobileOperator] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [bankAccountNo, setBankAccountNo] = useState("");
    const [globalPenalty, setGlobalPenalty] = useState(0);

    /* ================= INIT ================= */
    useEffect(() => {
        if (open && purchase) {
            const cloned = JSON.parse(JSON.stringify(purchase));
            setOriginalItems(cloned.items);

            cloned.items = cloned.items.map(item => ({
                ...item,
                _original_return_qty: Number(item.sale_return_quantity) || 0,
                _sale_item_quantity: Number(item.sold_quantity) || 0,
                penalty_amount: Number(item.penalty_amount) || 0,
            }));

            setForm(cloned);
            setPaidCash(Number(cloned.paid_cash) || 0);
            setPaidMobile(Number(cloned.paid_mobile) || 0);
            setPaidBank(Number(cloned.paid_bank) || 0);
            setMobileOperator(cloned.mobile_operator || "");
            setTransactionId(cloned.transaction_id || "");
            setBankAccountNo(cloned.bank_account_no || "");
            setGlobalPenalty(Number(cloned.global_penalty) || 0);
        }
    }, [open, purchase]);

    /* ================= RECALCULATE ================= */
    const recalculate = useCallback((data) => {
        let totalReturnAmount = 0;
        let totalItemPenalty = 0;

        data.items.forEach(item => {
            const returnQty = Number(item.sale_return_quantity) || 0;
            const unitPrice = Number(item.unit_price) || 0;
            const penalty = Number(item.penalty_amount) || 0;
            
            item.total_price = (returnQty * unitPrice).toFixed(2);
            totalReturnAmount += returnQty * unitPrice;
            totalItemPenalty += penalty;
        });

        const totalPaid = Number(paidCash) + Number(paidMobile) + Number(paidBank);
        const netReturnAmount = totalReturnAmount - totalItemPenalty - Number(globalPenalty);
        const dueAmount = netReturnAmount - totalPaid;

        // Determine payment status
        let paymentStatus = 'unpaid';
        if (totalPaid === 0) {
            paymentStatus = 'unpaid';
        } else if (totalPaid >= netReturnAmount) {
            paymentStatus = 'paid';
        } else {
            paymentStatus = 'partial';
        }

        return {
            ...data,
            total_return_amount: totalReturnAmount.toFixed(2),
            total_item_penalty: totalItemPenalty.toFixed(2),
            net_return_amount: netReturnAmount.toFixed(2),
            due_amount: dueAmount.toFixed(2),
            payment_status: paymentStatus,
            paid_cash: paidCash,
            paid_mobile: paidMobile,
            paid_bank: paidBank,
            global_penalty: globalPenalty,
        };
    }, [paidCash, paidMobile, paidBank, globalPenalty]);

    useEffect(() => {
        if (form) {
            setForm(prev => recalculate({ ...prev }));
        }
    }, [form?.items, paidCash, paidMobile, paidBank, globalPenalty, recalculate]);

    if (!open || !form) return null;

    /* ================= HELPERS ================= */
    const getAvailableQuantity = (item) => {
        const soldQty = Number(item.sold_quantity) || 0;
        // Simplified for edit: soldQty - other returns (not this one)
        // But for UI display, we'll just use soldQty as the upper bound
        return soldQty;
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
        if (window.confirm("Are you sure you want to remove this item?")) {
            setForm(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index),
            }));
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
            const soldQty = Number(item.sold_quantity) || 0;
            if (returnQty <= 0) {
                errs[index] = "Required > 0";
            } else if (returnQty > soldQty) {
                errs[index] = `Max ${soldQty}`;
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
                sale: form.sale,
                customer: form.customer,
                total_return_amount: Number(form.total_return_amount),
                total_item_penalty: Number(form.total_item_penalty),
                global_penalty: Number(globalPenalty),
                net_return_amount: Number(form.net_return_amount),
                paid_cash: Number(paidCash),
                paid_mobile: Number(paidMobile),
                paid_bank: Number(paidBank),
                mobile_operator: paidMobile > 0 ? mobileOperator : "",
                transaction_id: paidMobile > 0 ? transactionId : "",
                bank_account_no: paidBank > 0 ? bankAccountNo : "",
                payment_method: form.payment_method,
                note: form.note || "",
                return_reason: form.return_reason || "",
                items: form.items.map(item => ({
                    sale_item: item.sale_item,
                    sale_return_quantity: Number(item.sale_return_quantity),
                    unit_price: Number(item.unit_price),
                    penalty_amount: Number(item.penalty_amount || 0),
                    reason: item.reason || "Customer Return",
                })),
            };

            const res = await api.put(`/api/sale/sale-returns/${form.id}/`,
                payload
            );
            onUpdated(res.data);
            onClose();
        } catch (err) {
            console.error("Update failed:", err);
            alert(`Update failed: ${err.response?.data?.message || err.message}`);
        } finally {
            setSaving(false);
        }
    };

    /* ================= UI ================= */
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
                {/* HEADER */}
                <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Edit Sale Return</h2>
                        <p className="text-xs text-gray-400">Invoice #{form.sale_invoice_no} | Customer: {form.customer_name || 'Walk-in'}</p>
                    </div>
                    <button onClick={onClose} className="text-2xl hover:text-red-400">×</button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Return Reason</label>
                            <textarea className="input w-full border-gray-300 rounded-lg" rows="1" value={form.return_reason || ""} onChange={e => handleChange("return_reason", e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Internal Note</label>
                            <textarea className="input w-full border-gray-300 rounded-lg" rows="1" value={form.note || ""} onChange={e => handleChange("note", e.target.value)} />
                        </div>
                    </div>

                    <div className="border rounded-xl overflow-hidden shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Product</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Sold</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Return Qty</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Price</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-red-500 uppercase">Penalty</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Total</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {form.items.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium">{item.product_name}</td>
                                        <td className="px-4 py-3 text-center text-sm">{item.sold_quantity}</td>
                                        <td className="px-4 py-3">
                                            <input type="number" className="input w-20 text-center mx-auto block" value={item.sale_return_quantity} onChange={e => handleItemChange(index, "sale_return_quantity", e.target.value)} />
                                            {errors[index] && <p className="text-[10px] text-red-500 text-center mt-1">{errors[index]}</p>}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm">৳{item.unit_price}</td>
                                        <td className="px-4 py-3">
                                            <input type="number" className="input w-24 text-right mx-auto block text-red-600 font-bold" value={item.penalty_amount} onChange={e => handleItemChange(index, "penalty_amount", e.target.value)} />
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-bold">৳{item.total_price}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button onClick={() => handleRemoveItem(index)} className="text-red-400 hover:text-red-600"><FaTrash size={14}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 space-y-4">
                            <h3 className="font-bold text-blue-900 border-b border-blue-200 pb-2">Payment Adjustment</h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div><label className="text-[10px] uppercase font-bold text-blue-700">Cash</label><input type="number" className="w-full border-blue-200 p-2 rounded-lg font-bold" value={paidCash} onChange={(e) => setPaidCash(Number(e.target.value))}/></div>
                                <div><label className="text-[10px] uppercase font-bold text-blue-700">Mobile</label><input type="number" className="w-full border-blue-200 p-2 rounded-lg font-bold" value={paidMobile} onChange={(e) => setPaidMobile(Number(e.target.value))}/></div>
                                <div><label className="text-[10px] uppercase font-bold text-blue-700">Bank</label><input type="number" className="w-full border-blue-200 p-2 rounded-lg font-bold" value={paidBank} onChange={(e) => setPaidBank(Number(e.target.value))}/></div>
                            </div>
                            {paidMobile > 0 && (
                                <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-lg border border-blue-100 shadow-sm">
                                    <div><label className="text-[10px] font-bold text-gray-500">Operator</label><select className="w-full border-0 p-0 text-sm focus:ring-0" value={mobileOperator} onChange={(e) => setMobileOperator(e.target.value)}><option value="bkash">bKash</option><option value="nagad">Nagad</option></select></div>
                                    <div><label className="text-[10px] font-bold text-gray-500">Trx ID</label><input className="w-full border-0 p-0 text-sm focus:ring-0" value={transactionId} onChange={(e) => setTransactionId(e.target.value)}/></div>
                                </div>
                            )}
                            {paidBank > 0 && (
                                <div className="p-3 bg-white rounded-lg border border-blue-100 shadow-sm">
                                    <label className="text-[10px] font-bold text-gray-500">Bank Account No</label>
                                    <input className="w-full border-0 p-0 text-sm focus:ring-0" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)}/>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-900 text-white p-6 rounded-2xl space-y-3 shadow-xl">
                            <div className="flex justify-between text-sm opacity-70"><span>Gross Total</span><span>৳{form.total_return_amount}</span></div>
                            <div className="flex justify-between text-sm text-red-400"><span>Item Penalties</span><span>- ৳{form.total_item_penalty}</span></div>
                            <div className="flex justify-between items-center text-sm text-red-400">
                                <span>Global Penalty</span>
                                <input type="number" className="w-24 bg-gray-800 border-0 rounded text-right p-1 font-mono text-white focus:ring-1 focus:ring-red-500" value={globalPenalty} onChange={e => setGlobalPenalty(Number(e.target.value))} />
                            </div>
                            <div className="flex justify-between text-lg pt-2 border-t border-gray-800"><span className="font-bold">Net Return</span><span className="font-mono font-black text-2xl text-green-400">৳{form.net_return_amount}</span></div>
                            <div className="flex justify-between text-sm pt-2 border-t border-gray-800 opacity-70"><span>Total Paid Back</span><span>৳{(Number(paidCash) + Number(paidMobile) + Number(paidBank)).toFixed(2)}</span></div>
                            <div className="flex justify-between text-lg text-red-500 font-bold"><span>Balance Due</span><span className="font-mono">৳{form.due_amount}</span></div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                    <button onClick={onClose} className="btn-gray px-6 py-2 rounded-xl">Discard</button>
                    <button onClick={handleSubmit} disabled={saving} className="bg-blue-600 text-white px-10 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg disabled:bg-gray-400">
                        {saving ? "Updating..." : "Update Return"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditSaleReturnModal;