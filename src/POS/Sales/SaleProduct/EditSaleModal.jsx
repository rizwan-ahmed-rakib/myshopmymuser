// import React, {useState, useEffect} from "react";
// import api from '../../../context_or_provider/pos/posApi';
//
// import { Trash2, ShoppingCart, User, Package, Wallet, Banknote, CreditCard, Tag, CheckCircle, Info } from 'lucide-react';
// // import SuccessModal from "./SuccessModal";
// import BaseModal from "../../components/BaseModal";
//
// /**
//  * EditSaleModal - Refactored to use BaseModal and standardized backbone layout.
//  */
// const EditSaleModal = ({open, onClose, purchase, onUpdated}) => {
//     const [editableSale, setEditableSale] = useState(null);
//     const [loading, setLoading] = useState(false);
//
//     useEffect(() => {
//         if (purchase) {
//             const mappedSale = {
//                 ...purchase,
//                 paid_cash: purchase.paid_cash || 0,
//                 paid_mobile: purchase.paid_mobile || 0,
//                 paid_bank: purchase.paid_bank || 0,
//                 global_discount: purchase.global_discount || purchase.globalDiscount || 0,
//                 mobile_operator: purchase.mobile_operator || "",
//                 transaction_id: purchase.transaction_id || "",
//                 bank_account_no: purchase.bank_account_no || "",
//             };
//             setEditableSale(JSON.parse(JSON.stringify(mappedSale)));
//         }
//     }, [purchase]);
//
//     if (!open || !editableSale) return null;
//
//     const calculateUpdatedTotals = (currentSale) => {
//         let total_amount = 0;
//         let itemwise_total_discount = 0;
//         const updatedItems = currentSale.items.map(item => {
//             const quantity = parseFloat(item.quantity) || 0;
//             const unitPrice = parseFloat(item.unit_price) || 0;
//             const discount_amount = parseFloat(item.discount_amount) || 0;
//             const total_price = quantity * unitPrice;
//             const net_total = total_price - discount_amount;
//             total_amount += total_price;
//             itemwise_total_discount += discount_amount;
//             return { ...item, total_price: total_price.toFixed(2), net_total: net_total.toFixed(2) };
//         });
//
//         const global_discount = parseFloat(currentSale.global_discount) || 0;
//         const total_discount = itemwise_total_discount + global_discount;
//         const net_total = total_amount - total_discount;
//         const subtotal = total_amount - itemwise_total_discount;
//         const paid_cash = parseFloat(currentSale.paid_cash) || 0;
//         const paid_mobile = parseFloat(currentSale.paid_mobile) || 0;
//         const paid_bank = parseFloat(currentSale.paid_bank) || 0;
//         const totalPaid = paid_cash + paid_mobile + paid_bank;
//         const due_amount = net_total - totalPaid;
//
//         let payment_method = "cash";
//         const counts = [paid_cash > 0, paid_mobile > 0, paid_bank > 0].filter(Boolean).length;
//         if (counts > 1) payment_method = "hybrid";
//         else if (paid_mobile > 0) payment_method = "mobile_banking";
//         else if (paid_bank > 0) payment_method = "bank";
//
//         return {
//             ...currentSale, items: updatedItems, total_amount: total_amount.toFixed(2), itemwise_total_discount: itemwise_total_discount.toFixed(2),
//             subtotal: subtotal.toFixed(2), global_discount: global_discount.toFixed(2), total_discount: total_discount.toFixed(2),
//             net_total: net_total.toFixed(2), paid_cash, paid_mobile, paid_bank, paid_amount: totalPaid, due_amount: due_amount.toFixed(2), payment_method
//         };
//     };
//
//     const handleItemChange = (index, field, value) => {
//         const updatedItems = [...editableSale.items];
//         updatedItems[index] = { ...updatedItems[index], [field]: value };
//         setEditableSale(calculateUpdatedTotals({ ...editableSale, items: updatedItems }));
//     };
//
//     const handleRemoveItem = (index) => {
//         const updatedItems = editableSale.items.filter((_, i) => i !== index);
//         setEditableSale(calculateUpdatedTotals({ ...editableSale, items: updatedItems }));
//     };
//
//     const handleTopLevelChange = (field, value) => {
//         setEditableSale(calculateUpdatedTotals({ ...editableSale, [field]: value }));
//     };
//
//     const handleSubmit = async () => {
//         setLoading(true);
//         try {
//             const payload = {
//                 customer: editableSale.customer,
//                 paid_cash: editableSale.paid_cash,
//                 paid_mobile: editableSale.paid_mobile,
//                 paid_bank: editableSale.paid_bank,
//                 payment_method: editableSale.payment_method,
//                 global_discount: editableSale.global_discount,
//                 mobile_operator: editableSale.mobile_operator || "",
//                 transaction_id: editableSale.transaction_id || "",
//                 bank_account_no: editableSale.bank_account_no || "",
//                 items: editableSale.items.map(item => ({
//                     product: item.product,
//                     quantity: parseInt(item.quantity, 10) || 0,
//                     unit_price: parseFloat(item.unit_price) || 0,
//                     discount_amount: parseFloat(item.discount_amount) || 0,
//                     net_total: parseFloat(item.net_total) || 0,
//                 }))
//             };
//
//             const originalInvoiceDue = parseFloat(purchase?.due_amount) || 0;
//             const otherInvoicesDue = (parseFloat(purchase?.customer_due_amount) || 0) - originalInvoiceDue;
//
//             const response = await api.patch(`/api/sale/sales/${purchase.id}/`, payload);
//             onUpdated?.({
//                 ...purchase,
//                 ...response.data,
//                 previousDue: otherInvoicesDue
//             });
//             onClose();
//         } catch (err) {
//             console.error(err);
//             alert("Update failed.");
//         } finally { setLoading(false); }
//     };
//
//     const originalInvoiceDue = parseFloat(purchase?.due_amount) || 0;
//     const otherInvoicesDue = (parseFloat(purchase?.customer_due_amount) || 0) - originalInvoiceDue;
//     const currentInvoiceDue = (parseFloat(editableSale.net_total) || 0) - (parseFloat(editableSale.paid_amount) || 0);
//     const totalCustomerDue = otherInvoicesDue + currentInvoiceDue;
//
//     return (
//         <>
//             <BaseModal
//                 isOpen={open}
//                 onClose={onClose}
//                 title={`Edit Sale Invoice #${editableSale.invoice_no}`}
//                 size="xl"
//                 icon={<ShoppingCart className="text-white" />}
//                 showFooter={true}
//                 onSubmit={handleSubmit}
//                 submitText="Update Invoice"
//                 isLoading={loading}
//             >
//                 <div className="space-y-6">
//                     {/* Header Info */}
//                     <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 flex justify-between items-center">
//                         <div className="space-y-1">
//                             <p className="text-[10px] uppercase font-black text-emerald-600 tracking-[0.2em] flex items-center gap-2"><User size={12} /> Customer Account</p>
//                             <p className="text-xl font-black text-gray-800">{editableSale.customer_name || 'Walk-in Customer'}</p>
//                         </div>
//                         <div className="bg-white px-5 py-3 rounded-xl border border-emerald-200 shadow-sm text-right">
//                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Other Due</p>
//                             <p className="text-2xl font-black text-rose-600">৳{otherInvoicesDue.toLocaleString()}</p>
//                         </div>
//                     </div>
//
//                     {/* Items Table */}
//                     <div className="space-y-4">
//                         <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
//                             <Package size={14} className="text-brand-primary" /> Sale Items
//                         </h3>
//                         <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
//                             <table className="w-full text-left border-collapse">
//                                 <thead className="bg-gray-50 border-b border-gray-100">
//                                     <tr>
//                                         <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">Product Description</th>
//                                         <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center w-24">Qty</th>
//                                         <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right w-32">Unit Price</th>
//                                         <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right w-32">Discount</th>
//                                         <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right w-32">Total</th>
//                                         <th className="px-5 py-3 w-16"></th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-50">
//                                     {editableSale.items.map((item, index) => (
//                                         <tr key={item.id || index} className="hover:bg-gray-50/50 transition-colors group">
//                                             <td className="px-5 py-4 font-bold text-gray-900">{item.product_name}</td>
//                                             <td className="px-5 py-4">
//                                                 <input type="number" className="w-full border border-gray-200 p-2 rounded-lg text-center font-black text-sm focus:border-blue-500 outline-none" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
//                                             </td>
//                                             <td className="px-5 py-4">
//                                                 <input type="number" step="0.01" className="w-full border border-gray-200 p-2 rounded-lg text-right font-bold text-sm focus:border-blue-500 outline-none" value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", e.target.value)} />
//                                             </td>
//                                             <td className="px-5 py-4">
//                                                 <input type="number" step="0.01" className="w-full border border-gray-200 p-2 rounded-lg text-right text-sm outline-none" value={item.discount_amount} onChange={(e) => handleItemChange(index, "discount_amount", e.target.value)} />
//                                             </td>
//                                             <td className="px-5 py-4 text-right">
//                                                 <span className="font-black text-blue-700 text-sm">৳{parseFloat(item.net_total).toLocaleString()}</span>
//                                             </td>
//                                             <td className="px-5 py-4 text-right">
//                                                 <button onClick={() => handleRemoveItem(index)} className="p-2 text-rose-300 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
//                         <div className="space-y-6">
//                             {/* Payment Breakdown */}
//                             <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
//                                 <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
//                                     <Banknote size={14} className="text-brand-primary" /> Collection Adjustment
//                                 </label>
//                                 <div className="grid grid-cols-3 gap-4">
//                                     <div className="space-y-1.5">
//                                         <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Cash</label>
//                                         <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-emerald-600 text-sm outline-none" value={editableSale.paid_cash} onChange={(e) => handleTopLevelChange("paid_cash", e.target.value)} />
//                                     </div>
//                                     <div className="space-y-1.5">
//                                         <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile</label>
//                                         <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-purple-600 text-sm outline-none" value={editableSale.paid_mobile} onChange={(e) => handleTopLevelChange("paid_mobile", e.target.value)} />
//                                     </div>
//                                     <div className="space-y-1.5">
//                                         <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank</label>
//                                         <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-blue-600 text-sm outline-none" value={editableSale.paid_bank} onChange={(e) => handleTopLevelChange("paid_bank", e.target.value)} />
//                                     </div>
//                                 </div>
//
//                                 {parseFloat(editableSale.paid_mobile) > 0 && (
//                                     <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100 animate-in fade-in slide-in-from-top-2">
//                                         <div className="space-y-1.5">
//                                             <label className="text-[9px] font-black text-purple-400 uppercase">Operator</label>
//                                             <select className="w-full border border-purple-100 p-2 rounded-lg bg-white text-xs font-bold outline-none" value={editableSale.mobile_operator} onChange={(e) => handleTopLevelChange("mobile_operator", e.target.value)}>
//                                                 <option value="">Select Operator</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="rocket">Rocket</option><option value="upay">Upay</option>
//                                             </select>
//                                         </div>
//                                         <div className="space-y-1.5">
//                                             <label className="text-[9px] font-black text-purple-400 uppercase">TxID</label>
//                                             <input className="w-full border border-purple-100 p-2 rounded-lg text-xs font-bold outline-none" value={editableSale.transaction_id} onChange={(e) => handleTopLevelChange("transaction_id", e.target.value)} />
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//
//                             <div className="bg-emerald-50/50 p-6 rounded-[2.5rem] border border-emerald-100 space-y-4">
//                                 <label className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
//                                     <Tag size={14} /> Global Discount Adjust
//                                 </label>
//                                 <input type="number" step="0.01" className="w-full border border-emerald-100 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-200 font-black text-emerald-700 text-lg shadow-inner" placeholder="0.00" value={editableSale.global_discount} onChange={(e) => handleTopLevelChange("global_discount", e.target.value)} />
//                             </div>
//                         </div>
//
//                         {/* Totals Summary */}
//                         <div className="bg-gray-900 text-white p-8 rounded-[3rem] space-y-6 shadow-2xl relative overflow-hidden group">
//                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
//                             <div className="space-y-4 relative z-10">
//                                 <div className="flex justify-between items-center text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-800 pb-4">
//                                     <span>Subtotal</span> <span className="font-mono text-base">৳{parseFloat(editableSale.subtotal).toLocaleString()}</span>
//                                 </div>
//                                 <div className="flex justify-between items-center text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-800 pb-4">
//                                     <span>Discount</span> <span className="font-mono text-base">- ৳{parseFloat(editableSale.total_discount).toLocaleString()}</span>
//                                 </div>
//                                 <div className="flex justify-between items-center pt-2">
//                                     <span className="text-gray-400 font-black uppercase tracking-[0.3em]">Net Payable</span>
//                                     <span className="font-mono font-black text-4xl text-white">৳{parseFloat(editableSale.net_total).toLocaleString()}</span>
//                                 </div>
//                             </div>
//
//                             <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4 relative z-10">
//                                 <div className="flex justify-between items-center text-blue-400 font-black uppercase text-[10px] tracking-widest">
//                                     <span>Total Collected</span> <span className="font-mono text-2xl text-white">৳{editableSale.paid_amount.toLocaleString()}</span>
//                                 </div>
//                                 <div className="flex justify-between items-center pt-4 border-t border-white/5">
//                                     <div className="space-y-1">
//                                         <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em]">Invoice Due</p>
//                                         <p className="text-xl font-black text-rose-500 font-mono">৳{currentInvoiceDue.toLocaleString()}</p>
//                                     </div>
//                                     <div className="text-right space-y-1">
//                                         <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.2em]">Total Balance</p>
//                                         <p className="text-xl font-black text-blue-400 font-mono">৳{totalCustomerDue.toLocaleString()}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </BaseModal>
//         </>
//     );
// };
//
// export default EditSaleModal;






import React, { useState, useEffect, useRef } from "react";
import AsyncSelect from "react-select/async";
import api from '../../../context_or_provider/pos/posApi';
import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
import { posCustomerAPI } from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";
import BASE_URL_of_POS from "../../../posConfig";

import { Trash2, ShoppingCart, User, Package, Banknote, Tag } from 'lucide-react';
import BaseModal from "../../components/BaseModal";

const emptyItem = {
    product: null,
    product_name: "",
    unit_price: 0,
    quantity: 1,
    discount_type: "fixed",
    discount_value: 0,
    discount_amount: 0,
    total_price: 0,
    unique_serial: "",
    is_unique: false,
    stock: 0,
    success_msg: "",
    error_msg: ""
};

/**
 * EditSaleModal - Updated with Customer editing, Product appending capabilities,
 * and seamless integration with BaseModal layout structures.
 */
const EditSaleModal = ({ open, onClose, purchase, onUpdated }) => {
    /* ---------------- STATE ---------------- */
    const [customer, setCustomer] = useState(null);
    const [editableSale, setEditableSale] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (purchase) {
            // ইনিশিয়াল কাস্টমার সেটআপ
            setCustomer({
                value: purchase.customer,
                label: purchase.customer_name || "Walk-in Customer",
                due_amount: Number(purchase.customer_due_amount || 0) - Number(purchase.due_amount || 0)
            });

            // প্রোডাক্ট আইটেম ম্যাপিং ও স্টেট রেডি করা
            const mappedItems = (purchase.items || []).map(item => {
                const uPrice = Number(item.unit_price || 0);
                const qty = Number(item.quantity || 1);
                const discAmount = Number(item.discount_amount || 0);
                const baseTotal = uPrice * qty;

                return {
                    id: item.id, // এডিটের ট্র্যাকিং এর জন্য আইডি রাখা হলো
                    product: item.product,
                    product_name: item.product_name || "",
                    unit_price: uPrice,
                    quantity: qty,
                    discount_type: "fixed",
                    discount_value: discAmount / qty, // আনুমানিক রেট বের করার জন্য
                    discount_amount: discAmount,
                    total_price: Math.max(0, baseTotal - discAmount),
                    unique_serial: item.serials && item.serials.length > 0 ? item.serials[0] : "",
                    is_unique: !!(item.serials && item.serials.length > 0),
                    stock: item.stock || 999, // সেফ সাইড ব্যাকআপ
                    success_msg: item.serials && item.serials.length > 0 ? "Scanned" : "",
                    error_msg: ""
                };
            });

            const mappedSale = {
                ...purchase,
                items: mappedItems.length > 0 ? mappedItems : [{ ...emptyItem }],
                paid_cash: Number(purchase.paid_cash || 0),
                paid_mobile: Number(purchase.paid_mobile || 0),
                paid_bank: Number(purchase.paid_bank || 0),
                global_discount: Number(purchase.global_discount || purchase.globalDiscount || 0),
                mobile_operator: purchase.mobile_operator || "",
                transaction_id: purchase.transaction_id || "",
                bank_account_no: purchase.bank_account_no || "",
            };

            setEditableSale(JSON.parse(JSON.stringify(mappedSale)));
        }
    }, [purchase]);

    if (!open || !editableSale) return null;

    /* ---------------- OPTION LOADERS ---------------- */
    const loadCustomerOptions = async (inputValue) => {
        const res = await posCustomerAPI.search(inputValue || "");
        return res.data.map(s => ({
            value: s.id,
            label: `${s.name} ${s.phone ? `(${s.phone})` : ''}`,
            due_amount: Number(s.due_amount || 0)
        }));
    };

    const loadProductOptions = async (inputValue) => {
        if (!inputValue) return [];
        const res = await posProductAPI.search(inputValue);
        return res.data.map(p => ({
            value: p.id,
            label: `${p.name} (${p.product_code})`,
            unit_price: Number(p.sale_price || p.selling_price),
            product_name: p.name,
            stock: p.stock
        }));
    };

    /* ---------------- DYNAMIC CALCULATIONS ---------------- */
    const calculateUpdatedTotals = (currentSale) => {
        let subtotal = 0;
        let itemwise_total_discount = 0;

        const updatedItems = currentSale.items.map(item => {
            const baseTotal = item.unit_price * item.quantity;
            let discount = 0;
            if (item.discount_type === "percent") {
                discount = (baseTotal * item.discount_value) / 100;
            } else {
                discount = item.discount_value;
            }
            const total_price = Math.max(0, baseTotal - discount);

            subtotal += total_price;
            itemwise_total_discount += discount;

            return { ...item, total_price, discount_amount: discount };
        });

        const global_discount = Number(currentSale.global_discount) || 0;
        const net_total = Math.max(0, subtotal - global_discount);

        const paid_cash = Number(currentSale.paid_cash) || 0;
        const paid_mobile = Number(currentSale.paid_mobile) || 0;
        const paid_bank = Number(currentSale.paid_bank) || 0;
        const totalPaid = paid_cash + paid_mobile + paid_bank;

        let payment_method = "cash";
        const counts = [paid_cash > 0, paid_mobile > 0, paid_bank > 0].filter(Boolean).length;
        if (counts > 1) payment_method = "hybrid";
        else if (paid_mobile > 0) payment_method = "mobile_banking";
        else if (paid_bank > 0) payment_method = "bank";

        return {
            ...currentSale,
            items: updatedItems,
            subtotal,
            itemwise_total_discount,
            total_discount: itemwise_total_discount + global_discount,
            net_total,
            paid_amount: totalPaid,
            payment_method
        };
    };

    /* ---------------- TABLE ROW CONTROLLERS ---------------- */
    const updateItem = (index, updates) => {
        const updatedItems = [...editableSale.items];
        updatedItems[index] = { ...updatedItems[index], ...updates };
        setEditableSale(calculateUpdatedTotals({ ...editableSale, items: updatedItems }));
    };

    const isProductDuplicate = (productId, currentIndex) => {
        return editableSale.items.some((item, index) => index !== currentIndex && item.product === productId);
    };

    const isSerialDuplicate = (serial, currentIndex) => {
        return editableSale.items.some((item, index) => index !== currentIndex && item.unique_serial === serial);
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
                updateItem(index, {
                    product: data.product_id,
                    product_name: data.product.name,
                    unit_price: Number(data.product.sale_price || data.product.selling_price),
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
        const item = editableSale.items[index];
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

    const addRow = () => {
        setEditableSale(prev => ({ ...prev, items: [...prev.items, { ...emptyItem }] }));
    };

    const removeRow = (index) => {
        if (editableSale.items.length === 1) {
            setEditableSale(prev => ({ ...prev, items: [{ ...emptyItem }] }));
        } else {
            const filtered = editableSale.items.filter((_, i) => i !== index);
            setEditableSale(calculateUpdatedTotals({ ...editableSale, items: filtered }));
        }
    };

    const handleTopLevelChange = (field, value) => {
        setEditableSale(calculateUpdatedTotals({ ...editableSale, [field]: value }));
    };

    /* ---------------- ACTIONS SUBMIT ---------------- */
    const handleSubmit = async () => {
        if (!customer) return alert("Please select a customer");
        const validItems = editableSale.items.filter(i => i.product);
        if (validItems.length === 0) return alert("Please add products");

        setLoading(true);
        try {
            const payload = {
                customer: customer.value,
                paid_cash: editableSale.paid_cash,
                paid_mobile: editableSale.paid_mobile,
                paid_bank: editableSale.paid_bank,
                payment_method: editableSale.payment_method,
                global_discount: editableSale.global_discount,
                mobile_operator: editableSale.paid_mobile > 0 ? editableSale.mobile_operator : "",
                transaction_id: editableSale.paid_mobile > 0 ? editableSale.transaction_id : "",
                bank_account_no: editableSale.paid_bank > 0 ? editableSale.bank_account_no : "",
                items: validItems.map(item => ({
                    product: item.product,
                    quantity: parseInt(item.quantity, 10) || 0,
                    unit_price: parseFloat(item.unit_price) || 0,
                    discount_amount: parseFloat(item.discount_amount) || 0,
                    net_total: parseFloat(item.total_price) || 0,
                    serials: item.unique_serial ? [item.unique_serial] : []
                }))
            };

            const response = await api.patch(`/api/sale/sales/${purchase.id}/`, payload);

            const otherInvoicesDue = customer.due_amount; // ম্যাপড করা চাইল্ড প্রপার্টি
            onUpdated?.({
                ...purchase,
                ...response.data,
                previousDue: otherInvoicesDue
            });
            onClose();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Update failed.");
        } finally { setLoading(false); }
    };

    /* ---------------- DUES CALCULATION DISPLAY ---------------- */
    const otherInvoicesDue = customer?.due_amount || 0;
    const currentInvoiceDue = (Number(editableSale.net_total) || 0) - (Number(editableSale.paid_amount) || 0);
    const totalCustomerDue = otherInvoicesDue + currentInvoiceDue;

    return (
        <BaseModal
            isOpen={open}
            onClose={onClose}
            title={`Edit Sale Invoice #${editableSale.invoice_no}`}
            size="2xl" // ২xl আপনার ফাইলের নিয়মানুযায়ী max-w-6xl লোড নিবে
            // variant="clean"
            icon={<ShoppingCart className="text-white" />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Update Invoice"
            isLoading={loading}
        >
            <div className="space-y-6">
                {/* Editable Customer Account Banner */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-semibold text-blue-900 mb-2">Customer Adjustment *</label>
                        <AsyncSelect
                            cacheOptions defaultOptions
                            loadOptions={loadCustomerOptions}
                            value={customer}
                            onChange={setCustomer}
                            placeholder="Change Customer..."
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        />
                    </div>
                    <div className="bg-white px-4 py-2 rounded-md border border-blue-200 shadow-sm min-w-[150px]">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Other Invoices Due</p>
                        <p className="text-xl font-black text-red-600">৳{otherInvoicesDue.toFixed(2)}</p>
                    </div>
                </div>

                {/* Main Dynamic Product Entry Sheet */}
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
                        {editableSale.items.map((item, index) => (
                            <div key={index} className="lg:grid lg:grid-cols-12 gap-4 bg-white p-3 border rounded-lg shadow-sm items-center">
                                {/* Barcode Serial Controller */}
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

                                {/* Async Select Option Appender */}
                                <div className="col-span-3">
                                    <AsyncSelect
                                        loadOptions={loadProductOptions} defaultOptions={false}
                                        onChange={(opt) => selectProduct(opt, index)}
                                        value={item.product ? { value: item.product, label: item.product_name } : null}
                                        placeholder="Find product..."
                                        isDisabled={item.is_unique}
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    />
                                    {item.product && !item.is_unique && <p className="text-blue-500 text-[10px] mt-1">Stock: {item.stock}</p>}
                                </div>

                                {/* Price Field */}
                                <div className="col-span-1">
                                    <input className="w-full border p-2 rounded bg-gray-50 text-right font-mono text-sm" value={item.unit_price} disabled />
                                </div>

                                {/* Qty Multiplier Field */}
                                <div className="col-span-1">
                                    <input
                                        className={`w-full border p-2 rounded text-center font-bold ${item.is_unique ? 'bg-yellow-50 cursor-not-allowed' : 'bg-white'}`}
                                        type="number" value={item.quantity} min="1"
                                        disabled={item.is_unique}
                                        onChange={(e) => updateQty(index, Number(e.target.value))}
                                    />
                                </div>

                                {/* Discount Logic Field */}
                                <div className="col-span-2 flex items-center gap-1">
                                    <select className="border p-2 rounded text-xs bg-gray-50 outline-none" value={item.discount_type} onChange={(e) => updateItem(index, { discount_type: e.target.value })}>
                                        <option value="fixed">৳</option>
                                        <option value="percent">%</option>
                                    </select>
                                    <input type="number" className="w-full border p-2 rounded text-right text-sm outline-none focus:border-blue-500" value={item.discount_value || ""} onChange={(e) => updateItem(index, { discount_value: Number(e.target.value) })} />
                                </div>

                                {/* Item Wise Real Time Total Price */}
                                <div className="col-span-2 text-right px-2">
                                    <span className="font-bold font-mono text-blue-700 text-lg">৳{item.total_price.toFixed(2)}</span>
                                    {item.discount_amount > 0 && <p className="text-[10px] text-green-600 font-bold">Saved: ৳{item.discount_amount.toFixed(2)}</p>}
                                </div>

                                {/* Row Clean / Trash Trigger */}
                                <div className="col-span-1 flex justify-center">
                                    <button type="button" onClick={() => removeRow(index)} className="text-red-400 hover:text-red-600 p-2 text-2xl">×</button>
                                </div>
                            </div>
                        ))}

                        {/* New Core Action Button To Append Empty Invoice Rows */}
                        <button type="button" onClick={addRow} className="flex items-center gap-2 text-blue-600 font-bold px-4 py-2 border-2 border-dashed border-blue-200 rounded-lg hover:bg-blue-50 transition-colors w-full justify-center">
                            + Add New Product to this Invoice
                        </button>
                    </div>
                </div>

                {/* Bottom Core Dashboard Grid Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t">
                    <div className="space-y-4">
                        {/* Multi-Channel Balance Collectors Framework */}
                        <div className="bg-gray-50 p-4 rounded-xl border space-y-4">
                            <label className="block text-sm font-semibold text-gray-700">Collection Adjustment Breakdown</label>
                            <div className="grid grid-cols-3 gap-4">
                                <div><label className="text-[10px] uppercase font-bold text-gray-500">Cash</label><input type="number" className="w-full border p-2 rounded-lg font-bold" value={editableSale.paid_cash} onChange={(e) => handleTopLevelChange("paid_cash", e.target.value)} /></div>
                                <div><label className="text-[10px] uppercase font-bold text-gray-500">Mobile</label><input type="number" className="w-full border p-2 rounded-lg font-bold" value={editableSale.paid_mobile} onChange={(e) => handleTopLevelChange("paid_mobile", e.target.value)} /></div>
                                <div><label className="text-[10px] uppercase font-bold text-gray-500">Bank</label><input type="number" className="w-full border p-2 rounded-lg font-bold" value={editableSale.paid_bank} onChange={(e) => handleTopLevelChange("paid_bank", e.target.value)} /></div>
                            </div>

                            {/* Digital Gateways Metadata */}
                            {Number(editableSale.paid_mobile) > 0 && (
                                <div className="grid grid-cols-2 gap-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-purple-700">Mobile Operator</label>
                                        <select className="w-full border p-2 rounded-lg bg-white" value={editableSale.mobile_operator} onChange={(e) => handleTopLevelChange("mobile_operator", e.target.value)}>
                                            <option value="">Select</option>
                                            <option value="bkash">bKash</option>
                                            <option value="nagad">Nagad</option>
                                            <option value="rocket">Rocket</option>
                                        </select>
                                    </div>
                                    <div><label className="text-[10px] uppercase font-bold text-purple-700">Trx ID</label><input className="w-full border p-2 rounded-lg" value={editableSale.transaction_id} onChange={(e) => handleTopLevelChange("transaction_id", e.target.value)} /></div>
                                </div>
                            )}

                            {/* Bank Details Collector */}
                            {Number(editableSale.paid_bank) > 0 && (
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <label className="text-[10px] uppercase font-bold text-blue-700">Bank A/C Number</label>
                                    <input className="w-full border p-2 rounded-lg" value={editableSale.bank_account_no} onChange={(e) => handleTopLevelChange("bank_account_no", e.target.value)} />
                                </div>
                            )}
                        </div>

                        {/* Invoice Overall Flat Discount Box */}
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 space-y-2">
                            <label className="block text-sm font-semibold text-emerald-900 flex items-center gap-2">
                                <Tag size={14} /> Global Discount Adjust (Flat ৳)
                            </label>
                            <input type="number" step="0.01" className="w-full border border-emerald-100 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-bold" placeholder="0.00" value={editableSale.global_discount} onChange={(e) => handleTopLevelChange("global_discount", e.target.value)} />
                        </div>
                    </div>

                    {/* Branded Dark Matrix Board Terminal */}
                    <div className="bg-gray-900 text-white p-6 rounded-2xl space-y-4 shadow-xl">
                        <div className="space-y-2 text-sm border-b border-gray-800 pb-3">
                            <div className="flex justify-between"><span className="text-gray-500 font-medium">Items Subtotal</span><span className="font-mono font-bold">৳{(Number(editableSale.subtotal) || 0).toFixed(2)}</span></div>
                            <div className="flex justify-between text-green-400"><span>Adjusted Discount</span><span className="font-mono font-bold">- ৳{(Number(editableSale.total_discount) || 0).toFixed(2)}</span></div>
                            <div className="flex justify-between text-lg pt-2 border-t border-gray-800"><span className="text-gray-400 font-bold">Net Total</span><span className="font-mono font-black text-white text-2xl">৳{(Number(editableSale.net_total) || 0).toFixed(2)}</span></div>
                        </div>

                        <div className="space-y-3 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-inner">
                            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest text-center">Payment ({editableSale.payment_method?.replace('_', ' ')})</p>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-700"><span className="text-sm font-bold text-blue-400 uppercase">Total Collected</span><span className="font-mono font-black text-white text-xl">৳{(Number(editableSale.paid_amount) || 0).toFixed(2)}</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-xl text-center"><p className="text-[10px] text-red-500 font-bold uppercase mb-1">Invoice Due</p><p className="text-xl font-black text-red-500">৳{currentInvoiceDue.toFixed(2)}</p></div>
                            <div className="p-3 bg-blue-900/20 border border-blue-900/30 rounded-xl text-center"><p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Total Customer Balance</p><p className="text-xl font-black text-blue-400">৳{totalCustomerDue.toFixed(2)}</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default EditSaleModal;