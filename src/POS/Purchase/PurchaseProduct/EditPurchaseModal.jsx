// import React, {useState, useEffect} from "react";
// import api from '../../../context_or_provider/pos/posApi';
//
// import { Trash2, ShoppingCart, User, Package, Wallet, Banknote, CreditCard, Tag, CheckCircle, Info } from 'lucide-react';
// import BaseModal from "../../components/BaseModal";
//
// /**
//  * EditPurchaseModal - Refactored to use BaseModal and standardized backbone layout.
//  */
// const EditPurchaseModal = ({open, onClose, purchase, onUpdated}) => {
//     const [editablePurchase, setEditablePurchase] = useState(null);
//     const [instances, setInstances] = useState({});
//     const [removedSerials, setRemovedSerials] = useState({});
//     const [paymentProof, setPaymentProof] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [activeSerialTab, setActiveSerialTab] = useState(null);
//
//     useEffect(() => {
//         if (purchase) {
//             const mappedPurchase = {
//                 ...purchase,
//                 paid_cash: purchase.paid_cash || 0,
//                 paid_mobile: purchase.paid_mobile || 0,
//                 paid_bank: purchase.paid_bank || 0,
//                 global_discount: purchase.global_discount || purchase.globalDiscount || 0,
//                 mobile_operator: purchase.mobile_operator || "",
//                 transaction_id: purchase.transaction_id || "",
//                 bank_account_no: purchase.bank_account_no || "",
//             };
//             setEditablePurchase(JSON.parse(JSON.stringify(mappedPurchase)));
//             fetchInstances(purchase.invoice_no);
//         }
//     }, [purchase]);
//
//     const fetchInstances = async (invoiceNo) => {
//         try {
//             const response = await api.get(`/api/bar-qr/instances/?purchase_invoice_no=${invoiceNo}`);
//             const grouped = response.data.reduce((acc, curr) => {
//                 const pid = curr.product;
//                 if (!acc[pid]) acc[pid] = [];
//                 acc[pid].push(curr);
//                 return acc;
//             }, {});
//             setInstances(grouped);
//         } catch (err) { console.error(err); }
//     };
//
//     if (!open || !editablePurchase) return null;
//
//     const calculateUpdatedTotals = (currentPurchase) => {
//         let total_amount = 0;
//         let itemwise_total_discount = 0;
//         const updatedItems = currentPurchase.items.map(item => {
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
//         const global_discount = parseFloat(currentPurchase.global_discount) || 0;
//         const total_discount = itemwise_total_discount + global_discount;
//         const net_total = total_amount - total_discount;
//         const subtotal = total_amount - itemwise_total_discount;
//         const paid_cash = parseFloat(currentPurchase.paid_cash) || 0;
//         const paid_mobile = parseFloat(currentPurchase.paid_mobile) || 0;
//         const paid_bank = parseFloat(currentPurchase.paid_bank) || 0;
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
//             ...currentPurchase, items: updatedItems, total_amount: total_amount.toFixed(2), itemwise_total_discount: itemwise_total_discount.toFixed(2),
//             subtotal: subtotal.toFixed(2), global_discount: global_discount.toFixed(2), total_discount: total_discount.toFixed(2),
//             net_total: net_total.toFixed(2), paid_cash, paid_mobile, paid_bank, paid_amount: totalPaid, due_amount: due_amount.toFixed(2), payment_method
//         };
//     };
//
//     const handleItemChange = (index, field, value) => {
//         const updatedItems = [...editablePurchase.items];
//         updatedItems[index] = { ...updatedItems[index], [field]: value };
//         setEditablePurchase(calculateUpdatedTotals({ ...editablePurchase, items: updatedItems }));
//     };
//
//     const handleRemoveItem = (index) => {
//         const updatedItems = editablePurchase.items.filter((_, i) => i !== index);
//         setEditablePurchase(calculateUpdatedTotals({ ...editablePurchase, items: updatedItems }));
//     };
//
//     const handleTopLevelChange = (field, value) => {
//         setEditablePurchase(calculateUpdatedTotals({ ...editablePurchase, [field]: value }));
//     };
//
//     const handleSubmit = async () => {
//         setLoading(true);
//         try {
//             const formData = new FormData();
//             formData.append("supplier", editablePurchase.supplier);
//             formData.append("paid_cash", editablePurchase.paid_cash);
//             formData.append("paid_mobile", editablePurchase.paid_mobile);
//             formData.append("paid_bank", editablePurchase.paid_bank);
//             formData.append("payment_method", editablePurchase.payment_method);
//             formData.append("global_discount", editablePurchase.global_discount);
//             formData.append("mobile_operator", editablePurchase.mobile_operator || "");
//             formData.append("transaction_id", editablePurchase.transaction_id || "");
//             formData.append("bank_account_no", editablePurchase.bank_account_no || "");
//             if (paymentProof) formData.append("payment_proof", paymentProof);
//
//             const itemsPayload = editablePurchase.items.map(item => ({
//                 product: item.product, quantity: parseInt(item.quantity, 10) || 0, unit_price: parseFloat(item.unit_price) || 0,
//                 discount_amount: parseFloat(item.discount_amount) || 0, net_total: parseFloat(item.net_total) || 0,
//                 manufacturing_date: item.manufacturing_date || null, shelf_life_days: item.shelf_life_days || 0, batch_no: item.batch_no || "",
//                 removed_serials: removedSerials[item.product] || [],
//             }));
//             formData.append("items", JSON.stringify(itemsPayload));
//
//             const response = await api.patch(`/api/purchase/purchases/${purchase.id}/`, formData);
//             onUpdated?.(response.data);
//             onClose();
//         } catch (err) {
//             console.error(err);
//             alert("Update failed.");
//         } finally { setLoading(false); }
//     };
//
//     const originalInvoiceDue = parseFloat(purchase?.due_amount) || 0;
//     const otherInvoicesDue = (parseFloat(purchase?.supplier_due_amount) || 0) - originalInvoiceDue;
//     const currentInvoiceDue = (parseFloat(editablePurchase.net_total) || 0) - (parseFloat(editablePurchase.paid_amount) || 0);
//     const totalSupplierDue = otherInvoicesDue + currentInvoiceDue;
//
//     return (
//         <BaseModal
//                 isOpen={open}
//                 onClose={onClose}
//                 title={`Edit Purchase Invoice #${editablePurchase.invoice_no}`}
//                 size="xl"
//                 icon={<ShoppingCart className="text-white" />}
//                 showFooter={true}
//                 onSubmit={handleSubmit}
//                 submitText="Update Invoice"
//                 isLoading={loading}
//             >
//                 <div className="space-y-6">
//                     {/* Header Info */}
//                     <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex justify-between items-center">
//                         <div className="space-y-1">
//                             <p className="text-[10px] uppercase font-black text-blue-400 tracking-[0.2em] flex items-center gap-2"><User size={12} /> Supplier Account</p>
//                             <p className="text-xl font-black text-gray-800">{editablePurchase.supplier_name}</p>
//                         </div>
//                         <div className="bg-white px-5 py-3 rounded-xl border border-blue-200 shadow-sm text-right">
//                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Previous Balance</p>
//                             <p className="text-2xl font-black text-rose-600">৳{otherInvoicesDue.toLocaleString()}</p>
//                         </div>
//                     </div>
//
//                     {/* Items Table */}
//                     <div className="space-y-4">
//                         <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
//                             <Package size={14} className="text-brand-primary" /> Purchase Items
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
//                                     {editablePurchase.items.map((item, index) => (
//                                         <React.Fragment key={item.id || index}>
//                                             <tr className="hover:bg-gray-50/50 transition-colors group">
//                                                 <td className="px-5 py-4">
//                                                     <p className="font-bold text-gray-900">{item.product_name}</p>
//                                                     <button onClick={() => setActiveSerialTab(activeSerialTab === item.product ? null : item.product)} className={`mt-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full transition-all ${activeSerialTab === item.product ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>Manage Serials</button>
//                                                 </td>
//                                                 <td className="px-5 py-4">
//                                                     <input type="number" className="w-full border border-gray-200 p-2 rounded-lg text-center font-black text-sm focus:border-blue-500 outline-none" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
//                                                 </td>
//                                                 <td className="px-5 py-4">
//                                                     <input type="number" step="0.01" className="w-full border border-gray-200 p-2 rounded-lg text-right font-bold text-sm focus:border-blue-500 outline-none" value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", e.target.value)} />
//                                                 </td>
//                                                 <td className="px-5 py-4">
//                                                     <input type="number" step="0.01" className="w-full border border-gray-200 p-2 rounded-lg text-right text-sm outline-none" value={item.discount_amount} onChange={(e) => handleItemChange(index, "discount_amount", e.target.value)} />
//                                                 </td>
//                                                 <td className="px-5 py-4 text-right">
//                                                     <span className="font-black text-blue-700 text-sm">৳{parseFloat(item.net_total).toLocaleString()}</span>
//                                                 </td>
//                                                 <td className="px-5 py-4 text-right">
//                                                     <button onClick={() => handleRemoveItem(index)} className="p-2 text-rose-300 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
//                                                 </td>
//                                             </tr>
//
//                                             {activeSerialTab === item.product && (
//                                                 <tr className="bg-blue-50/30">
//                                                     <td colSpan="6" className="px-8 py-5">
//                                                         <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-inner space-y-4">
//                                                             <div className="flex justify-between items-center border-b border-gray-100 pb-3">
//                                                                 <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Info size={12} className="text-blue-500" /> Serial Management</h4>
//                                                                 <div className="flex gap-2">
//                                                                     <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">In Stock: {instances[item.product]?.length || 0}</span>
//                                                                     <span className="bg-rose-100 text-rose-700 text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">Target Qty: {item.quantity}</span>
//                                                                 </div>
//                                                             </div>
//                                                             <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
//                                                                 {(instances[item.product] || []).map(inst => {
//                                                                     const isRemoved = (removedSerials[item.product] || []).includes(inst.unique_serial);
//                                                                     const isSold = inst.status !== 'in_stock';
//                                                                     return (
//                                                                         <div key={inst.id} onClick={() => !isSold && setRemovedSerials(prev => ({...prev, [item.product]: isRemoved ? (prev[item.product] || []).filter(s => s !== inst.unique_serial) : [...(prev[item.product] || []), inst.unique_serial]}))} className={`p-2 border rounded-xl cursor-pointer transition-all flex flex-col items-center gap-1 ${isRemoved ? 'bg-rose-50 border-rose-200 text-rose-600' : isSold ? 'opacity-40 grayscale cursor-not-allowed border-gray-100' : 'bg-white border-gray-100 hover:border-blue-300 shadow-sm'}`}>
//                                                                             <span className="text-[9px] font-bold truncate w-full text-center">{inst.unique_serial.split('-').pop()}</span>
//                                                                             <span className={`text-[7px] font-black px-1.5 rounded-full uppercase tracking-widest ${isRemoved ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'}`}>{isRemoved ? 'Remove' : 'Keep'}</span>
//                                                                         </div>
//                                                                     );
//                                                                 })}
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             )}
//
//                                             {(item.has_expiry || purchase.items.find(pi => pi.product === item.product)?.has_expiry) && (
//                                                 <tr className="bg-orange-50/20">
//                                                     <td colSpan="6" className="px-8 py-3">
//                                                         <div className="grid grid-cols-3 gap-6">
//                                                             <div className="space-y-1">
//                                                                 <label className="text-[9px] font-black text-orange-600 uppercase tracking-widest ml-1">Mfg Date</label>
//                                                                 <input type="date" className="w-full border border-orange-100 p-2 rounded-xl text-xs font-bold bg-white focus:border-orange-300 outline-none" value={item.manufacturing_date || ""} onChange={(e) => handleItemChange(index, "manufacturing_date", e.target.value)} />
//                                                             </div>
//                                                             <div className="space-y-1">
//                                                                 <label className="text-[9px] font-black text-orange-600 uppercase tracking-widest ml-1">Shelf Life (Days)</label>
//                                                                 <input type="number" className="w-full border border-orange-100 p-2 rounded-xl text-xs font-bold bg-white focus:border-orange-300 outline-none" value={item.shelf_life_days || 0} onChange={(e) => handleItemChange(index, "shelf_life_days", e.target.value)} />
//                                                             </div>
//                                                             <div className="space-y-1">
//                                                                 <label className="text-[9px] font-black text-orange-600 uppercase tracking-widest ml-1">Batch Number</label>
//                                                                 <input className="w-full border border-orange-100 p-2 rounded-xl text-xs font-bold bg-white focus:border-orange-300 outline-none" value={item.batch_no || ""} onChange={(e) => handleItemChange(index, "batch_no", e.target.value)} />
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             )}
//                                         </React.Fragment>
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
//                                     <Banknote size={14} className="text-brand-primary" /> Payment Reconciliation
//                                 </label>
//                                 <div className="grid grid-cols-3 gap-4">
//                                     <div className="space-y-1.5">
//                                         <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Cash</label>
//                                         <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-emerald-600 text-sm outline-none" value={editablePurchase.paid_cash} onChange={(e) => handleTopLevelChange("paid_cash", e.target.value)} />
//                                     </div>
//                                     <div className="space-y-1.5">
//                                         <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile</label>
//                                         <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-purple-600 text-sm outline-none" value={editablePurchase.paid_mobile} onChange={(e) => handleTopLevelChange("paid_mobile", e.target.value)} />
//                                     </div>
//                                     <div className="space-y-1.5">
//                                         <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank</label>
//                                         <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-blue-600 text-sm outline-none" value={editablePurchase.paid_bank} onChange={(e) => handleTopLevelChange("paid_bank", e.target.value)} />
//                                     </div>
//                                 </div>
//
//                                 {parseFloat(editablePurchase.paid_mobile) > 0 && (
//                                     <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100 animate-in fade-in slide-in-from-top-2">
//                                         <div className="space-y-1.5">
//                                             <label className="text-[9px] font-black text-purple-400 uppercase">Operator</label>
//                                             <select className="w-full border border-purple-100 p-2 rounded-lg bg-white text-xs font-bold outline-none" value={editablePurchase.mobile_operator} onChange={(e) => handleTopLevelChange("mobile_operator", e.target.value)}>
//                                                 <option value="">Select Operator</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="rocket">Rocket</option><option value="upay">Upay</option>
//                                             </select>
//                                         </div>
//                                         <div className="space-y-1.5">
//                                             <label className="text-[9px] font-black text-purple-400 uppercase">TxID</label>
//                                             <input className="w-full border border-purple-100 p-2 rounded-lg text-xs font-bold outline-none" value={editablePurchase.transaction_id} onChange={(e) => handleTopLevelChange("transaction_id", e.target.value)} />
//                                         </div>
//                                     </div>
//                                 )}
//
//                                 <div className="pt-2">
//                                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Payment Proof (New Image)</label>
//                                     <input type="file" className="w-full text-[10px] font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-700 cursor-pointer" onChange={(e) => setPaymentProof(e.target.files[0])} />
//                                 </div>
//                             </div>
//
//                             <div className="bg-emerald-50/50 p-6 rounded-[2.5rem] border border-emerald-100 space-y-4">
//                                 <label className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
//                                     <Tag size={14} /> Global Discount Adjust
//                                 </label>
//                                 <input type="number" step="0.01" className="w-full border border-emerald-100 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-200 font-black text-emerald-700 text-lg shadow-inner" placeholder="0.00" value={editablePurchase.global_discount} onChange={(e) => handleTopLevelChange("global_discount", e.target.value)} />
//                             </div>
//                         </div>
//
//                         {/* Totals Summary */}
//                         <div className="bg-gray-900 text-white p-8 rounded-[3rem] space-y-6 shadow-2xl relative overflow-hidden group">
//                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
//                             <div className="space-y-4 relative z-10">
//                                 <div className="flex justify-between items-center text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-800 pb-4">
//                                     <span>Subtotal</span> <span className="font-mono text-base">৳{parseFloat(editablePurchase.subtotal).toLocaleString()}</span>
//                                 </div>
//                                 <div className="flex justify-between items-center text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-800 pb-4">
//                                     <span>Discount</span> <span className="font-mono text-base">- ৳{parseFloat(editablePurchase.total_discount).toLocaleString()}</span>
//                                 </div>
//                                 <div className="flex justify-between items-center pt-2">
//                                     <span className="text-gray-400 font-black uppercase tracking-[0.3em]">Net Total</span>
//                                     <span className="font-mono font-black text-4xl text-white">৳{parseFloat(editablePurchase.net_total).toLocaleString()}</span>
//                                 </div>
//                             </div>
//
//                             <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4 relative z-10">
//                                 <div className="flex justify-between items-center text-blue-400 font-black uppercase text-[10px] tracking-widest">
//                                     <span>Total Reconciled</span> <span className="font-mono text-2xl text-white">৳{editablePurchase.paid_amount.toLocaleString()}</span>
//                                 </div>
//                                 <div className="flex justify-between items-center pt-4 border-t border-white/5">
//                                     <div className="space-y-1">
//                                         <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em]">Invoice Due</p>
//                                         <p className="text-xl font-black text-rose-500 font-mono">৳{currentInvoiceDue.toLocaleString()}</p>
//                                     </div>
//                                     <div className="text-right space-y-1">
//                                         <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.2em]">Combined Due</p>
//                                         <p className="text-xl font-black text-blue-400 font-mono">৳{totalSupplierDue.toLocaleString()}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </BaseModal>
//     );
// };
//
// export default EditPurchaseModal;


//
// import React, { useState, useEffect } from "react";
// import api from '../../../context_or_provider/pos/posApi';
//
// import { Trash2, ShoppingCart, User, Package, Wallet, Banknote, Tag, Info, Layers } from 'lucide-react';
// import BaseModal from "../../components/BaseModal";
//
// /**
//  * EditPurchaseModal - Fully refactored to match the premium dual-column dashboard matrix
//  * layout and unified input styling of the Add Purchase module.
//  */
// const EditPurchaseModal = ({ open, onClose, purchase, onUpdated }) => {
//     /* ---------------- STATES ---------------- */
//     const [editablePurchase, setEditablePurchase] = useState(null);
//     const [instances, setInstances] = useState({});
//     const [removedSerials, setRemovedSerials] = useState({});
//     const [paymentProof, setPaymentProof] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [activeSerialTab, setActiveSerialTab] = useState(null);
//
//     /* ---------------- EFFECTS & HYDRATION ---------------- */
//     useEffect(() => {
//         if (purchase) {
//             const mappedPurchase = {
//                 ...purchase,
//                 paid_cash: purchase.paid_cash || 0,
//                 paid_mobile: purchase.paid_mobile || 0,
//                 paid_bank: purchase.paid_bank || 0,
//                 global_discount: purchase.global_discount || purchase.globalDiscount || 0,
//                 mobile_operator: purchase.mobile_operator || "",
//                 transaction_id: purchase.transaction_id || "",
//                 bank_account_no: purchase.bank_account_no || "",
//             };
//             setEditablePurchase(JSON.parse(JSON.stringify(mappedPurchase)));
//             fetchInstances(purchase.invoice_no);
//         }
//     }, [purchase]);
//
//     const fetchInstances = async (invoiceNo) => {
//         try {
//             const response = await api.get(`/api/bar-qr/instances/?purchase_invoice_no=${invoiceNo}`);
//             const grouped = response.data.reduce((acc, curr) => {
//                 const pid = curr.product;
//                 if (!acc[pid]) acc[pid] = [];
//                 acc[pid].push(curr);
//                 return acc;
//             }, {});
//             setInstances(grouped);
//         } catch (err) {
//             console.error("Failed fetching serial instances:", err);
//         }
//     };
//
//     if (!open || !editablePurchase) return null;
//
//     /* ---------------- CALCULATION ENGINE ---------------- */
//     const calculateUpdatedTotals = (currentPurchase) => {
//         let total_amount = 0;
//         let itemwise_total_discount = 0;
//         const updatedItems = currentPurchase.items.map(item => {
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
//         const global_discount = parseFloat(currentPurchase.global_discount) || 0;
//         const total_discount = itemwise_total_discount + global_discount;
//         const net_total = total_amount - total_discount;
//         const subtotal = total_amount - itemwise_total_discount;
//         const paid_cash = parseFloat(currentPurchase.paid_cash) || 0;
//         const paid_mobile = parseFloat(currentPurchase.paid_mobile) || 0;
//         const paid_bank = parseFloat(currentPurchase.paid_bank) || 0;
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
//             ...currentPurchase,
//             items: updatedItems,
//             total_amount: total_amount.toFixed(2),
//             itemwise_total_discount: itemwise_total_discount.toFixed(2),
//             subtotal: subtotal.toFixed(2),
//             global_discount: global_discount.toFixed(2),
//             total_discount: total_discount.toFixed(2),
//             net_total: net_total.toFixed(2),
//             paid_cash,
//             paid_mobile,
//             paid_bank,
//             paid_amount: totalPaid,
//             due_amount: due_amount.toFixed(2),
//             payment_method
//         };
//     };
//
//     /* ---------------- MUTATION HANDLERS ---------------- */
//     const handleItemChange = (index, field, value) => {
//         const updatedItems = [...editablePurchase.items];
//         updatedItems[index] = { ...updatedItems[index], [field]: value };
//         setEditablePurchase(calculateUpdatedTotals({ ...editablePurchase, items: updatedItems }));
//     };
//
//     const handleRemoveItem = (index) => {
//         const updatedItems = editablePurchase.items.filter((_, i) => i !== index);
//         setEditablePurchase(calculateUpdatedTotals({ ...editablePurchase, items: updatedItems }));
//     };
//
//     const handleTopLevelChange = (field, value) => {
//         setEditablePurchase(calculateUpdatedTotals({ ...editablePurchase, [field]: value }));
//     };
//
//     /* ---------------- SUBMISSION TRIGGER ---------------- */
//     const handleSubmit = async () => {
//         setLoading(true);
//         try {
//             const formData = new FormData();
//             formData.append("supplier", editablePurchase.supplier);
//             formData.append("paid_cash", editablePurchase.paid_cash);
//             formData.append("paid_mobile", editablePurchase.paid_mobile);
//             formData.append("paid_bank", editablePurchase.paid_bank);
//             formData.append("payment_method", editablePurchase.payment_method);
//             formData.append("global_discount", editablePurchase.global_discount);
//             formData.append("mobile_operator", editablePurchase.mobile_operator || "");
//             formData.append("transaction_id", editablePurchase.transaction_id || "");
//             formData.append("bank_account_no", editablePurchase.bank_account_no || "");
//             if (paymentProof) formData.append("payment_proof", paymentProof);
//
//             const itemsPayload = editablePurchase.items.map(item => ({
//                 product: item.product,
//                 quantity: parseInt(item.quantity, 10) || 0,
//                 unit_price: parseFloat(item.unit_price) || 0,
//                 discount_amount: parseFloat(item.discount_amount) || 0,
//                 net_total: parseFloat(item.net_total) || 0,
//                 manufacturing_date: item.manufacturing_date || null,
//                 shelf_life_days: item.shelf_life_days || 0,
//                 batch_no: item.batch_no || "",
//                 removed_serials: removedSerials[item.product] || [],
//             }));
//             formData.append("items", JSON.stringify(itemsPayload));
//
//             const response = await api.patch(`/api/purchase/purchases/${purchase.id}/`, formData);
//             onUpdated?.(response.data);
//             onClose();
//         } catch (err) {
//             console.error(err);
//             alert("Update operation failed.");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     /* ---------------- MATH METRICS SUMMARY ---------------- */
//     const originalInvoiceDue = parseFloat(purchase?.due_amount) || 0;
//     const otherInvoicesDue = (parseFloat(purchase?.supplier_due_amount) || 0) - originalInvoiceDue;
//     const currentInvoiceDue = (parseFloat(editablePurchase.net_total) || 0) - (parseFloat(editablePurchase.paid_amount) || 0);
//     const totalSupplierDue = otherInvoicesDue + currentInvoiceDue;
//
//     return (
//         <BaseModal
//             isOpen={open}
//             onClose={onClose}
//             title={`Modify Purchase Invoice #${editablePurchase.invoice_no}`}
//             size="2xl"
//             // variant="clean"
//             icon={<ShoppingCart className="text-white" />}
//             showFooter={true}
//             onSubmit={handleSubmit}
//             submitText="Update Invoice"
//             isLoading={loading}
//         >
//             <div className="space-y-6">
//                 {/* Fixed Supplier Static Dashboard Card */}
//                 <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                     <div className="space-y-1">
//                         <p className="text-[10px] uppercase font-black text-blue-500 tracking-[0.2em] flex items-center gap-2">
//                             <User size={12} /> Registered Vendor
//                         </p>
//                         <p className="text-xl font-black text-gray-800">{editablePurchase.supplier_name}</p>
//                     </div>
//                     <div className="bg-white px-5 py-3 rounded-xl border border-blue-200 shadow-sm flex justify-between items-center min-w-[200px]">
//                         <div>
//                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Other Pending Balance</p>
//                             <p className="text-2xl font-black text-rose-600 font-mono">৳{otherInvoicesDue.toLocaleString()}</p>
//                         </div>
//                         <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 ml-4"><Wallet size={20} /></div>
//                     </div>
//                 </div>
//
//                 {/* Purchase Matrix Items Sheets */}
//                 <div className="space-y-4">
//                     <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
//                         <Package size={14} className="text-brand-primary" /> Adjusted Product Lineup
//                     </h3>
//
//                     <div className="space-y-3">
//                         {editablePurchase.items.map((item, index) => (
//                             <div key={item.id || index} className="group border border-gray-100 rounded-2xl bg-white hover:border-blue-200 transition-all overflow-hidden shadow-sm hover:shadow-md">
//                                 <div className="grid lg:grid-cols-12 gap-4 p-4 items-center">
//                                     {/* Static Product Details */}
//                                     <div className="lg:col-span-4 space-y-1.5">
//                                         <label className="lg:hidden text-[9px] font-black text-gray-400 uppercase">Product Name</label>
//                                         <p className="font-black text-gray-800 text-sm leading-tight">{item.product_name}</p>
//                                         <button
//                                             type="button"
//                                             onClick={() => setActiveSerialTab(activeSerialTab === item.product ? null : item.product)}
//                                             className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${activeSerialTab === item.product ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
//                                         >
//                                             <Layers size={10} /> Track Unique Serials
//                                         </button>
//                                     </div>
//
//                                     {/* Cost Unit Price Field */}
//                                     <div className="lg:col-span-2 space-y-1">
//                                         <label className="lg:hidden text-[9px] font-black text-gray-400 uppercase text-right">Cost Price</label>
//                                         <input className="w-full border border-gray-200 p-2 rounded-lg text-right font-bold text-sm focus:border-blue-500 outline-none font-mono" type="number" step="0.01" value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", e.target.value)} />
//                                     </div>
//
//                                     {/* Item Quantity Input */}
//                                     <div className="lg:col-span-1 space-y-1">
//                                         <label className="lg:hidden text-[9px] font-black text-gray-400 uppercase text-center">Qty</label>
//                                         <input className="w-full border border-gray-200 p-2 rounded-lg text-center font-black text-sm focus:border-blue-500 outline-none font-mono" type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
//                                     </div>
//
//                                     {/* Row Item Total Discount Input */}
//                                     <div className="lg:col-span-2 space-y-1">
//                                         <label className="lg:hidden text-[9px] font-black text-gray-400 uppercase text-right">Item Discount (৳)</label>
//                                         <input className="w-full border border-gray-200 p-2 rounded-lg text-right text-sm font-bold outline-none font-mono focus:border-blue-500" type="number" step="0.01" value={item.discount_amount} onChange={(e) => handleItemChange(index, "discount_amount", e.target.value)} />
//                                     </div>
//
//                                     {/* Total Calculated Row Matrix */}
//                                     <div className="lg:col-span-2 text-right px-2">
//                                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">Line Net Total</p>
//                                         <span className="font-black text-blue-700 text-base font-mono">৳{parseFloat(item.net_total).toLocaleString()}</span>
//                                     </div>
//
//                                     {/* Remove Line Row Trigger */}
//                                     <div className="lg:col-span-1 flex justify-center lg:justify-end">
//                                         <button type="button" onClick={() => handleRemoveItem(index)} className="p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all border border-transparent hover:border-rose-100"><Trash2 size={18} /></button>
//                                     </div>
//                                 </div>
//
//                                 {/* Dynamic Advanced Serial Management Subsection */}
//                                 {activeSerialTab === item.product && (
//                                     <div className="p-4 bg-blue-50/30 border-t border-blue-100 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
//                                         <div className="flex justify-between items-center border-b border-gray-100 pb-2">
//                                             <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Info size={12} className="text-blue-500" /> Stock Serials Reconciliation</h4>
//                                             <div className="flex gap-2">
//                                                 <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-tighter">In Ledger: {instances[item.product]?.length || 0}</span>
//                                                 <span className="bg-rose-100 text-rose-700 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-tighter">Required: {item.quantity}</span>
//                                             </div>
//                                         </div>
//                                         <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
//                                             {(instances[item.product] || []).map(inst => {
//                                                 const isRemoved = (removedSerials[item.product] || []).includes(inst.unique_serial);
//                                                 const isSold = inst.status !== 'in_stock';
//                                                 return (
//                                                     <div
//                                                         key={inst.id}
//                                                         onClick={() => !isSold && setRemovedSerials(prev => ({...prev, [item.product]: isRemoved ? (prev[item.product] || []).filter(s => s !== inst.unique_serial) : [...(prev[item.product] || []), inst.unique_serial]}))}
//                                                         className={`p-2 border rounded-xl cursor-pointer transition-all flex flex-col items-center gap-1 select-none ${isRemoved ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-inner' : isSold ? 'opacity-40 grayscale cursor-not-allowed border-gray-100 bg-gray-50' : 'bg-white border-gray-100 hover:border-blue-300 shadow-sm'}`}
//                                                     >
//                                                         <span className="text-[10px] font-mono font-bold truncate w-full text-center">{inst.unique_serial.split('-').pop()}</span>
//                                                         <span className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${isRemoved ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'}`}>{isRemoved ? 'Removed' : 'Active'}</span>
//                                                     </div>
//                                                 );
//                                             })}
//                                         </div>
//                                     </div>
//                                 )}
//
//                                 {/* Expiry Data Sheets */}
//                                 {(item.has_expiry || purchase.items.find(pi => pi.product === item.product)?.has_expiry) && (
//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/30 border-t border-orange-100 animate-in fade-in slide-in-from-top-1 duration-200">
//                                         <div className="space-y-1">
//                                             <label className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Manufacturing Date</label>
//                                             <input type="date" className="w-full border border-orange-100 p-2 rounded-lg text-xs font-bold outline-none bg-white focus:border-orange-300" value={item.manufacturing_date || ""} onChange={(e) => handleItemChange(index, "manufacturing_date", e.target.value)} />
//                                         </div>
//                                         <div className="space-y-1">
//                                             <label className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Shelf Life (Days)</label>
//                                             <input type="number" className="w-full border border-orange-100 p-2 rounded-lg text-xs font-bold outline-none bg-white focus:border-orange-300 font-mono" value={item.shelf_life_days || 0} onChange={(e) => handleItemChange(index, "shelf_life_days", e.target.value)} />
//                                         </div>
//                                         <div className="space-y-1">
//                                             <label className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Batch Number Reference</label>
//                                             <input className="w-full border border-orange-100 p-2 rounded-lg text-xs font-bold outline-none bg-white focus:border-orange-300" value={item.batch_no || ""} onChange={(e) => handleItemChange(index, "batch_no", e.target.value)} />
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//
//                 {/* Bottom Financial Matrix Structure */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
//                     <div className="space-y-6">
//                         {/* Split Channel Ledger Modification */}
//                         <div className="bg-gray-50/50 p-5 rounded-[2rem] border border-gray-100 space-y-5">
//                             <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
//                                 <Banknote size={14} className="text-brand-primary" /> Payment Reconciliation Split
//                             </label>
//                             <div className="grid grid-cols-3 gap-4">
//                                 <div className="space-y-1.5">
//                                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Cash</label>
//                                     <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-emerald-600 text-sm focus:border-emerald-300 outline-none font-mono" value={editablePurchase.paid_cash || ""} placeholder="0" onChange={(e) => handleTopLevelChange("paid_cash", e.target.value)} />
//                                 </div>
//                                 <div className="space-y-1.5">
//                                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile</label>
//                                     <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-purple-600 text-sm focus:border-purple-300 outline-none font-mono" value={editablePurchase.paid_mobile || ""} placeholder="0" onChange={(e) => handleTopLevelChange("paid_mobile", e.target.value)} />
//                                 </div>
//                                 <div className="space-y-1.5">
//                                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank</label>
//                                     <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-blue-600 text-sm focus:border-blue-300 outline-none font-mono" value={editablePurchase.paid_bank || ""} placeholder="0" onChange={(e) => handleTopLevelChange("paid_bank", e.target.value)} />
//                                 </div>
//                             </div>
//
//                             {/* Mobile operators dynamic checking hooks */}
//                             {parseFloat(editablePurchase.paid_mobile) > 0 && (
//                                 <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100 animate-in fade-in slide-in-from-top-2 duration-300">
//                                     <div className="space-y-1.5">
//                                         <label className="text-[9px] font-black text-purple-600 uppercase">Gateway Operator</label>
//                                         <select className="w-full border border-purple-100 p-2 rounded-lg bg-white text-xs font-bold outline-none" value={editablePurchase.mobile_operator} onChange={(e) => handleTopLevelChange("mobile_operator", e.target.value)}>
//                                             <option value="">Select Operator</option>
//                                             <option value="bkash">bKash</option>
//                                             <option value="nagad">Nagad</option>
//                                             <option value="rocket">Rocket</option>
//                                             <option value="upay">Upay</option>
//                                         </select>
//                                     </div>
//                                     <div className="space-y-1.5">
//                                         <label className="text-[9px] font-black text-purple-600 uppercase">Transaction ID</label>
//                                         <input className="w-full border border-purple-100 p-2 rounded-lg text-xs font-bold outline-none font-mono" placeholder="Txn ID" value={editablePurchase.transaction_id} onChange={(e) => handleTopLevelChange("transaction_id", e.target.value)} />
//                                     </div>
//                                 </div>
//                             )}
//
//                             <div className="pt-2">
//                                 <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Payment Document Proof (New File)</label>
//                                 <input type="file" className="w-full text-[10px] font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer" onChange={(e) => setPaymentProof(e.target.files[0])} />
//                             </div>
//                         </div>
//
//                         {/* Flat Master Invoice Discounts adjusting container */}
//                         <div className="bg-emerald-50/50 p-5 rounded-[2rem] border border-emerald-100 space-y-4">
//                             <label className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
//                                 <Tag size={14} /> Adjust Global Flat Discount (৳)
//                             </label>
//                             <input type="number" step="0.01" className="w-full border border-emerald-100 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-emerald-200 font-black text-emerald-700 font-mono h-[42px]" placeholder="0.00" value={editablePurchase.global_discount} onChange={(e) => handleTopLevelChange("global_discount", e.target.value)} />
//                         </div>
//                     </div>
//
//                     {/* Dark Premium Invoice Ledger Summary Panel */}
//                     <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden group flex flex-col justify-between">
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
//
//                         <div className="space-y-4 relative z-10">
//                             <div className="flex justify-between items-center text-gray-500 text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-3">
//                                 <span>Adjusted Subtotal</span>
//                                 <span className="font-mono text-base font-bold">৳{parseFloat(editablePurchase.subtotal).toLocaleString()}</span>
//                             </div>
//                             <div className="flex justify-between items-center text-emerald-400 text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-3">
//                                 <span>Accumulated Discount</span>
//                                 <span className="font-mono text-base font-bold">- ৳{parseFloat(editablePurchase.total_discount).toLocaleString()}</span>
//                             </div>
//                             <div className="flex justify-between items-center pt-2">
//                                 <span className="text-gray-400 font-black uppercase tracking-[0.2em]">Net Invoice Amount</span>
//                                 <span className="font-mono font-black text-3xl text-white">৳{parseFloat(editablePurchase.net_total).toLocaleString()}</span>
//                             </div>
//                         </div>
//
//                         <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3 relative z-10 my-4">
//                             <div className="flex justify-between items-center text-blue-400 font-black uppercase text-[10px] tracking-widest">
//                                 <span>Total Paid Reconciled</span>
//                                 <span className="font-mono text-xl text-white font-black">৳{editablePurchase.paid_amount.toLocaleString()}</span>
//                             </div>
//                             <div className="flex justify-between items-center pt-3 border-t border-white/5">
//                                 <div className="space-y-1">
//                                     <p className="text-[8px] text-rose-400 font-black uppercase tracking-widest">Current Invoice Due</p>
//                                     <p className="text-lg font-black text-rose-500 font-mono">৳{currentInvoiceDue.toLocaleString()}</p>
//                                 </div>
//                                 <div className="text-right space-y-1">
//                                     <p className="text-[8px] text-blue-400 font-black uppercase tracking-widest">Combined Due Balance</p>
//                                     <p className="text-lg font-black text-blue-400 font-mono">৳{totalSupplierDue.toLocaleString()}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </BaseModal>
//     );
// };
//
// export default EditPurchaseModal;


import React, {useState, useEffect} from "react";
import AsyncSelect from "react-select/async";
import {posSupplierAPI} from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";
import api from '../../../context_or_provider/pos/posApi';

import {Trash2, ShoppingCart, User, Package, Wallet, Banknote, Tag, Info, Layers} from 'lucide-react';
import BaseModal from "../../components/BaseModal";

/**
 * EditPurchaseModal - Highly optimized to allow complete Supplier Editing,
 * explicit field labels, and distinct Percentage (%) / Fixed (৳) discount operators.
 */
const EditPurchaseModal = ({open, onClose, purchase, onUpdated}) => {
    /* ---------------- STATES ---------------- */
    const [supplier, setSupplier] = useState(null);
    const [editablePurchase, setEditablePurchase] = useState(null);
    const [instances, setInstances] = useState({});
    const [removedSerials, setRemovedSerials] = useState({});
    const [paymentProof, setPaymentProof] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeSerialTab, setActiveSerialTab] = useState(null);

    /* ---------------- EFFECTS & DATA HYDRATION ---------------- */
    useEffect(() => {
        if (purchase) {
            const mappedPurchase = {
                ...purchase,
                paid_cash: purchase.paid_cash || 0,
                paid_mobile: purchase.paid_mobile || 0,
                paid_bank: purchase.paid_bank || 0,
                global_discount: purchase.global_discount || purchase.globalDiscount || 0,
                mobile_operator: purchase.mobile_operator || "",
                transaction_id: purchase.transaction_id || "",
                bank_account_no: purchase.bank_account_no || "",
            };

            // Prefill supplier state for structural updates
            setSupplier({
                value: purchase.supplier,
                label: purchase.supplier_name,
                due_amount: Number(purchase.supplier_due_amount || 0) - Number(purchase.due_amount || 0)
            });

            // Map standard layout objects with structural flags
            const itemsWithDiscountType = (mappedPurchase.items || []).map(item => ({
                ...item,
                discount_type: item.discount_type || "fixed",
                discount_value: Number(item.discount_value || item.discount_amount || 0),
            }));

            mappedPurchase.items = itemsWithDiscountType;
            setEditablePurchase(JSON.parse(JSON.stringify(mappedPurchase)));
            fetchInstances(purchase.invoice_no);
        }
    }, [purchase]);

    const fetchInstances = async (invoiceNo) => {
        try {
            const response = await api.get(`/api/bar-qr/instances/?purchase_invoice_no=${invoiceNo}`);
            const grouped = response.data.reduce((acc, curr) => {
                const pid = curr.product;
                if (!acc[pid]) acc[pid] = [];
                acc[pid].push(curr);
                return acc;
            }, {});
            setInstances(grouped);
        } catch (err) {
            console.error("Failed fetching serial instances:", err);
        }
    };

    const loadSupplierOptions = async (inputValue) => {
        const res = await posSupplierAPI.search(inputValue || "");
        return res.data.map(s => ({
            value: s.id,
            label: s.name,
            due_amount: Number(s.due_amount || 0),
        }));
    };

    if (!open || !editablePurchase) return null;

    /* ---------------- ADVANCED REALTIME ARITHMETIC ENGINE ---------------- */
    const calculateUpdatedTotals = (currentPurchase) => {
        let total_amount = 0;
        let itemwise_total_discount = 0;

        const updatedItems = currentPurchase.items.map(item => {
            const quantity = parseFloat(item.quantity) || 0;
            const unitPrice = parseFloat(item.unit_price) || 0;
            const discValue = parseFloat(item.discount_value) || 0;

            const base_total_price = quantity * unitPrice;
            let calculated_discount = 0;

            if (item.discount_type === "percent") {
                calculated_discount = (base_total_price * discValue) / 100;
            } else {
                calculated_discount = discValue;
            }

            const net_total = Math.max(0, base_total_price - calculated_discount);
            total_amount += base_total_price;
            itemwise_total_discount += calculated_discount;

            return {
                ...item,
                discount_amount: calculated_discount.toFixed(2),
                total_price: base_total_price.toFixed(2),
                net_total: net_total.toFixed(2)
            };
        });

        const global_discount = parseFloat(currentPurchase.global_discount) || 0;
        const total_discount = itemwise_total_discount + global_discount;
        const net_total = Math.max(0, total_amount - total_discount);
        const subtotal = total_amount - itemwise_total_discount;

        const paid_cash = parseFloat(currentPurchase.paid_cash) || 0;
        const paid_mobile = parseFloat(currentPurchase.paid_mobile) || 0;
        const paid_bank = parseFloat(currentPurchase.paid_bank) || 0;
        const totalPaid = paid_cash + paid_mobile + paid_bank;
        const due_amount = net_total - totalPaid;

        let payment_method = "cash";
        const counts = [paid_cash > 0, paid_mobile > 0, paid_bank > 0].filter(Boolean).length;
        if (counts > 1) payment_method = "hybrid";
        else if (paid_mobile > 0) payment_method = "mobile_banking";
        else if (paid_bank > 0) payment_method = "bank";

        return {
            ...currentPurchase,
            items: updatedItems,
            total_amount: total_amount.toFixed(2),
            itemwise_total_discount: itemwise_total_discount.toFixed(2),
            subtotal: subtotal.toFixed(2),
            global_discount: global_discount.toFixed(2),
            total_discount: total_discount.toFixed(2),
            net_total: net_total.toFixed(2),
            paid_cash,
            paid_mobile,
            paid_bank,
            paid_amount: totalPaid,
            due_amount: due_amount.toFixed(2),
            payment_method
        };
    };

    /* ---------------- WORKSPACE MUTATORS ---------------- */
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...editablePurchase.items];
        updatedItems[index] = {...updatedItems[index], [field]: value};
        setEditablePurchase(calculateUpdatedTotals({...editablePurchase, items: updatedItems}));
    };

    const handleRemoveItem = (index) => {
        const updatedItems = editablePurchase.items.filter((_, i) => i !== index);
        setEditablePurchase(calculateUpdatedTotals({...editablePurchase, items: updatedItems}));
    };

    const handleTopLevelChange = (field, value) => {
        setEditablePurchase(calculateUpdatedTotals({...editablePurchase, [field]: value}));
    };

    const handleSupplierChange = (selectedOption) => {
        setSupplier(selectedOption);
        if (selectedOption) {
            setEditablePurchase(prev => ({
                ...prev,
                supplier: selectedOption.value,
                supplier_name: selectedOption.label
            }));
        }
    };

    /* ---------------- FORM DISPATCH REQUEST ---------------- */
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("supplier", editablePurchase.supplier);
            formData.append("paid_cash", editablePurchase.paid_cash);
            formData.append("paid_mobile", editablePurchase.paid_mobile);
            formData.append("paid_bank", editablePurchase.paid_bank);
            formData.append("payment_method", editablePurchase.payment_method);
            formData.append("global_discount", editablePurchase.global_discount);
            formData.append("mobile_operator", editablePurchase.mobile_operator || "");
            formData.append("transaction_id", editablePurchase.transaction_id || "");
            formData.append("bank_account_no", editablePurchase.bank_account_no || "");
            if (paymentProof) formData.append("payment_proof", paymentProof);

            const itemsPayload = editablePurchase.items.map(item => ({
                product: item.product,
                quantity: parseInt(item.quantity, 10) || 0,
                unit_price: parseFloat(item.unit_price) || 0,
                discount_type: item.discount_type,
                discount_value: parseFloat(item.discount_value) || 0,
                discount_amount: parseFloat(item.discount_amount) || 0,
                net_total: parseFloat(item.net_total) || 0,
                manufacturing_date: item.manufacturing_date || null,
                shelf_life_days: item.shelf_life_days || 0,
                batch_no: item.batch_no || "",
                removed_serials: removedSerials[item.product] || [],
            }));
            formData.append("items", JSON.stringify(itemsPayload));

            const response = await api.patch(`/api/purchase/purchases/${purchase.id}/`, formData);
            onUpdated?.(response.data);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Update operation failed.");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- MATH SUMMARY METRICS ---------------- */
    const otherInvoicesDue = supplier?.due_amount || 0;
    const currentInvoiceDue = (parseFloat(editablePurchase.net_total) || 0) - (parseFloat(editablePurchase.paid_amount) || 0);
    const totalSupplierDue = otherInvoicesDue + currentInvoiceDue;

    return (
        <BaseModal
            isOpen={open}
            onClose={onClose}
            title={`Modify Purchase Invoice #${editablePurchase.invoice_no}`}
            size="2xl"
            // variant="clean"
            icon={<ShoppingCart className="text-white"/>}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Update Invoice"
            isLoading={loading}
        >
            <div className="space-y-6">
                {/* Editable Supplier Module */}
                <div
                    className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="w-full md:w-1/2 space-y-2">
                        <label
                            className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-2">
                            <User size={12}/> Supplier Account (Editable)
                        </label>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={loadSupplierOptions}
                            value={supplier}
                            onChange={handleSupplierChange}
                            placeholder="Change supplier..."
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: base => ({...base, zIndex: 9999}),
                                control: (base) => ({...base, borderRadius: '12px', padding: '2px'})
                            }}
                        />
                    </div>
                    {supplier && (
                        <div
                            className="bg-white px-5 py-3 rounded-xl border border-blue-200 shadow-sm flex justify-between items-center min-w-[220px]">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Other Ledger
                                    Due</p>
                                <p className="text-2xl font-black text-rose-600 font-mono">৳{otherInvoicesDue.toLocaleString()}</p>
                            </div>
                            <div
                                className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 ml-4">
                                <Wallet size={20}/></div>
                        </div>
                    )}
                </div>

                {/* Purchase Items Container */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
                        <Package size={14} className="text-brand-primary"/> Adjusted Product Lineup
                    </h3>

                    {/* Desktop Headers */}
                    <div
                        className="hidden lg:grid grid-cols-12 gap-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                        <div className="col-span-4">Product Description</div>
                        <div className="col-span-2 text-center">Cost Price (৳)</div>
                        <div className="col-span-1 text-center">Qty</div>
                        <div className="col-span-2 text-center">Discount Layer</div>
                        <div className="col-span-2 text-right">Line Total</div>
                        <div className="col-span-1 text-center">Action</div>
                    </div>

                    <div className="space-y-3">
                        {editablePurchase.items.map((item, index) => (
                            <div key={item.id || index}
                                 className="group border border-gray-100 rounded-2xl bg-white hover:border-blue-200 transition-all overflow-hidden shadow-sm hover:shadow-md">
                                <div className="grid lg:grid-cols-12 gap-4 p-4 items-center">
                                    {/* Product Meta Data */}
                                    <div className="lg:col-span-4 space-y-1.5">
                                        <label
                                            className="text-[9px] font-black text-gray-400 uppercase tracking-wider block lg:hidden">Product</label>
                                        <p className="font-black text-gray-800 text-sm leading-tight">{item.product_name}</p>
                                        <button
                                            type="button"
                                            onClick={() => setActiveSerialTab(activeSerialTab === item.product ? null : item.product)}
                                            className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${activeSerialTab === item.product ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                        >
                                            <Layers size={10}/> Track Unique Serials
                                        </button>
                                    </div>

                                    {/* Cost Price */}
                                    <div className="lg:col-span-2 space-y-1">
                                        <label
                                            className="text-[9px] font-black text-gray-400 uppercase tracking-wider block lg:hidden">Cost
                                            Price (৳)</label>
                                        <input
                                            className="w-full border border-gray-200 p-2 rounded-lg text-right font-bold text-sm focus:border-blue-500 outline-none font-mono"
                                            type="number" step="0.01" value={item.unit_price}
                                            onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}/>
                                    </div>

                                    {/* Qty */}
                                    <div className="lg:col-span-1 space-y-1">
                                        <label
                                            className="text-[9px] font-black text-gray-400 uppercase tracking-wider block lg:hidden text-center">Qty</label>
                                        <input
                                            className="w-full border border-gray-200 p-2 rounded-lg text-center font-black text-sm focus:border-blue-500 outline-none font-mono"
                                            type="number" value={item.quantity}
                                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}/>
                                    </div>

                                    {/* Percentage / Fixed Dynamic Discount Selector */}
                                    <div className="lg:col-span-2 space-y-1">
                                        <label
                                            className="text-[9px] font-black text-gray-400 uppercase tracking-wider block lg:hidden">Discount
                                            Operator</label>
                                        <div className="flex items-center gap-1">
                                            <select
                                                className="border border-gray-200 p-2 rounded-lg text-[10px] font-bold bg-gray-50 outline-none h-[38px]"
                                                value={item.discount_type || "fixed"}
                                                onChange={(e) => handleItemChange(index, "discount_type", e.target.value)}>
                                                <option value="fixed">৳</option>
                                                <option value="percent">%</option>
                                            </select>
                                            <input type="number"
                                                   className="w-full border border-gray-200 p-2 rounded-lg text-right text-sm font-bold outline-none font-mono focus:border-blue-500 h-[38px]"
                                                   placeholder="0" value={item.discount_value || ""}
                                                   onChange={(e) => handleItemChange(index, "discount_value", e.target.value)}/>
                                        </div>
                                    </div>

                                    {/* Calculated Line Net Total */}
                                    <div className="lg:col-span-2 text-right px-2">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-0.5 lg:hidden">Line
                                            Net Total</p>
                                        <span
                                            className="font-black text-blue-700 text-base font-mono">৳{parseFloat(item.net_total).toLocaleString()}</span>
                                        {parseFloat(item.discount_amount) > 0 &&
                                            <p className="text-[10px] text-green-600 font-bold">Saved:
                                                ৳{parseFloat(item.discount_amount).toFixed(2)}</p>}
                                    </div>

                                    {/* Row Drop action */}
                                    <div className="lg:col-span-1 flex justify-center lg:justify-end">
                                        <button type="button" onClick={() => handleRemoveItem(index)}
                                                className="p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all border border-transparent hover:border-rose-100">
                                            <Trash2 size={18}/></button>
                                    </div>
                                </div>

                                {/* Serial Management Tracking Engine */}
                                {activeSerialTab === item.product && (
                                    <div
                                        className="p-4 bg-blue-50/30 border-t border-blue-100 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <div
                                            className="flex justify-between items-center border-b border-gray-100 pb-2">
                                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <Info size={12} className="text-blue-500"/> Stock Serials Reconciliation
                                            </h4>
                                            <div className="flex gap-2">
                                                <span
                                                    className="bg-blue-100 text-blue-700 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-tighter">In Ledger: {instances[item.product]?.length || 0}</span>
                                                <span
                                                    className="bg-rose-100 text-rose-700 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-tighter">Required: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                                            {(instances[item.product] || []).map(inst => {
                                                const isRemoved = (removedSerials[item.product] || []).includes(inst.unique_serial);
                                                const isSold = inst.status !== 'in_stock';
                                                return (
                                                    <div
                                                        key={inst.id}
                                                        onClick={() => !isSold && setRemovedSerials(prev => ({
                                                            ...prev,
                                                            [item.product]: isRemoved ? (prev[item.product] || []).filter(s => s !== inst.unique_serial) : [...(prev[item.product] || []), inst.unique_serial]
                                                        }))}
                                                        className={`p-2 border rounded-xl cursor-pointer transition-all flex flex-col items-center gap-1 select-none ${isRemoved ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-inner' : isSold ? 'opacity-40 grayscale cursor-not-allowed border-gray-100 bg-gray-50' : 'bg-white border-gray-100 hover:border-blue-300 shadow-sm'}`}
                                                    >
                                                        <span
                                                            className="text-[10px] font-mono font-bold truncate w-full text-center">{inst.unique_serial.split('-').pop()}</span>
                                                        <span
                                                            className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${isRemoved ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'}`}>{isRemoved ? 'Removed' : 'Active'}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Expiry Management Segment */}
                                {(item.has_expiry || purchase.items.find(pi => pi.product === item.product)?.has_expiry) && (
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/30 border-t border-orange-100">
                                        <div className="space-y-1.5">
                                            <label
                                                className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Manufacturing
                                                Date</label>
                                            <input type="date"
                                                   className="w-full border border-orange-100 p-2 rounded-lg text-xs font-bold outline-none bg-white focus:border-orange-300"
                                                   value={item.manufacturing_date || ""}
                                                   onChange={(e) => handleItemChange(index, "manufacturing_date", e.target.value)}/>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label
                                                className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Shelf
                                                Life (Days)</label>
                                            <input type="number"
                                                   className="w-full border border-orange-100 p-2 rounded-lg text-xs font-bold outline-none bg-white focus:border-orange-300 font-mono"
                                                   value={item.shelf_life_days || 0}
                                                   onChange={(e) => handleItemChange(index, "shelf_life_days", e.target.value)}/>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label
                                                className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Batch
                                                Number Reference</label>
                                            <input
                                                className="w-full border border-orange-100 p-2 rounded-lg text-xs font-bold outline-none bg-white focus:border-orange-300"
                                                value={item.batch_no || ""}
                                                onChange={(e) => handleItemChange(index, "batch_no", e.target.value)}/>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Reconciliation Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                    <div className="space-y-6">
                        {/* Channels Split Ledger */}
                        <div className="bg-gray-50/50 p-5 rounded-[2rem] border border-gray-100 space-y-5">
                            <label
                                className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Banknote size={14} className="text-brand-primary"/> Payment Reconciliation Split
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label
                                        className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Cash
                                        Paid Amount</label>
                                    <input type="number"
                                           className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-emerald-600 text-sm focus:border-emerald-300 outline-none font-mono"
                                           value={editablePurchase.paid_cash || ""} placeholder="0"
                                           onChange={(e) => handleTopLevelChange("paid_cash", e.target.value)}/>
                                </div>
                                <div className="space-y-1.5">
                                    <label
                                        className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile
                                        Paid Amount</label>
                                    <input type="number"
                                           className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-purple-600 text-sm focus:border-purple-300 outline-none font-mono"
                                           value={editablePurchase.paid_mobile || ""} placeholder="0"
                                           onChange={(e) => handleTopLevelChange("paid_mobile", e.target.value)}/>
                                </div>
                                <div className="space-y-1.5">
                                    <label
                                        className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank
                                        Paid Amount</label>
                                    <input type="number"
                                           className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-blue-600 text-sm focus:border-blue-300 outline-none font-mono"
                                           value={editablePurchase.paid_bank || ""} placeholder="0"
                                           onChange={(e) => handleTopLevelChange("paid_bank", e.target.value)}/>
                                </div>
                            </div>

                            {/* Mobile MFS validation nodes */}
                            {parseFloat(editablePurchase.paid_mobile) > 0 && (
                                <div
                                    className="grid grid-cols-2 gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-purple-600 uppercase">MFS Gateway
                                            Operator</label>
                                        <select
                                            className="w-full border border-purple-100 p-2 rounded-lg bg-white text-xs font-bold outline-none"
                                            value={editablePurchase.mobile_operator}
                                            onChange={(e) => handleTopLevelChange("mobile_operator", e.target.value)}>
                                            <option value="">Select Operator</option>
                                            <option value="bkash">bKash</option>
                                            <option value="nagad">Nagad</option>
                                            <option value="rocket">Rocket</option>
                                            <option value="upay">Upay</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-purple-600 uppercase">Transaction
                                            ID Ref</label>
                                        <input
                                            className="w-full border border-purple-100 p-2 rounded-lg text-xs font-bold outline-none font-mono"
                                            placeholder="Txn ID" value={editablePurchase.transaction_id}
                                            onChange={(e) => handleTopLevelChange("transaction_id", e.target.value)}/>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label
                                    className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Payment
                                    Document Proof Attachment</label>
                                <input type="file"
                                       className="w-full text-[10px] font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                                       onChange={(e) => setPaymentProof(e.target.files[0])}/>
                            </div>
                        </div>

                        {/* Flat Invoice Discount Adjusted Panel */}
                        <div className="bg-emerald-50/50 p-5 rounded-[2rem] border border-emerald-100 space-y-2">
                            <label
                                className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Tag size={14}/> Adjust Global Flat Invoice Discount (৳)
                            </label>
                            <input type="number" step="0.01"
                                   className="w-full border border-emerald-100 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-emerald-200 font-black text-emerald-700 font-mono h-[42px]"
                                   placeholder="0.00" value={editablePurchase.global_discount}
                                   onChange={(e) => handleTopLevelChange("global_discount", e.target.value)}/>
                        </div>
                    </div>

                    {/*/!* Dark Premium Summary Sidebar *!/*/}
                    {/*<div className="bg-gray-900 text-white p-8 rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden group flex flex-col justify-between">*/}
                    {/*    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>*/}

                    {/*    <div className="space-y-4 relative z-10">*/}
                    {/*        <div className="flex justify-between items-center text-gray-500 text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-3">*/}
                    {/*            <span>Adjusted Subtotal</span>*/}
                    {/*            <span className="font-mono text-base font-bold">৳{parseFloat(editablePurchase.subtotal).toLocaleString()}</span>*/}
                    {/*        </div>*/}
                    {/*        <div className="flex justify-between items-center text-emerald-400 text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-3">*/}
                    {/*            <span>Accumulated Discounts</span>*/}
                    {/*            <span className="font-mono text-base font-bold">- ৳{parseFloat(editablePurchase.total_discount).toLocaleString()}</span>*/}
                    {/*        </div>*/}
                    {/*        <div className="flex justify-between items-center pt-2">*/}
                    {/*            <span className="text-gray-400 font-black uppercase tracking-[0.2em]">Net Invoice Amount</span>*/}
                    {/*            <span className="font-mono font-black text-3xl text-white">৳{parseFloat(editablePurchase.net_total).toLocaleString()}</span>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3 relative z-10 my-4">*/}
                    {/*        <div className="flex justify-between items-center text-blue-400 font-black uppercase text-[10px] tracking-widest">*/}
                    {/*            <span>Total Paid Reconciled</span>*/}
                    {/*            <span className="font-mono text-xl text-white font-black">৳{editablePurchase.paid_amount.toLocaleString()}</span>*/}
                    {/*        </div>*/}
                    {/*        <div className="flex justify-between items-center pt-3 border-t border-white/5">*/}
                    {/*            <div className="space-y-1">*/}
                    {/*                <p className="text-[8px] text-rose-400 font-black uppercase tracking-widest">Current Invoice Due</p>*/}
                    {/*                <p className="text-lg font-black text-rose-500 font-mono">৳{currentInvoiceDue.toLocaleString()}</p>*/}
                    {/*            </div>*/}
                    {/*            <div className="text-right space-y-1">*/}
                    {/*                <p className="text-[8px] text-blue-400 font-black uppercase tracking-widest">Combined Due Balance</p>*/}
                    {/*                <p className="text-lg font-black text-blue-400 font-mono">৳{totalSupplierDue.toLocaleString()}</p>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}


                    {/* Dark Premium Summary Sidebar */}
                    <div
                        className="bg-gray-900 text-white p-6 rounded-2xl space-y-4 shadow-xl relative overflow-hidden group">
                        <div
                            className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>

                        {/* Subtotal & Discount Section */}
                        <div className="space-y-2 text-sm border-b border-gray-800 pb-3 relative z-10">
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Adjusted Subtotal</span>
                                <span
                                    className="font-mono font-bold">৳{parseFloat(editablePurchase?.subtotal || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-green-400">
                                <span>Accumulated Discounts</span>
                                <span
                                    className="font-mono font-bold">- ৳{parseFloat(editablePurchase?.total_discount || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-lg pt-2 border-t border-gray-800">
                                <span className="text-gray-400 font-bold">Net Invoice Amount</span>
                                <span
                                    className="font-mono font-black text-white text-2xl">৳{parseFloat(editablePurchase?.net_total || 0).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Total Paid Section */}
                        <div
                            className="space-y-3 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-inner relative z-10">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-blue-400 uppercase">Total Paid Reconciled</span>
                                <span
                                    className="font-mono font-black text-white text-xl">৳{parseFloat(editablePurchase?.paid_amount || 0).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Due Grid Section */}
                        <div className="grid grid-cols-2 gap-4 pt-2 relative z-10">
                            <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-xl text-center">
                                <p className="text-[10px] text-red-500 font-bold uppercase mb-1">Current Invoice Due</p>
                                <p className="text-xl font-black text-red-500">৳{currentInvoiceDue.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-blue-900/20 border border-blue-900/30 rounded-xl text-center">
                                <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Combined Due
                                    Balance</p>
                                <p className="text-xl font-black text-blue-400">৳{totalSupplierDue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </BaseModal>
    );
};

export default EditPurchaseModal;