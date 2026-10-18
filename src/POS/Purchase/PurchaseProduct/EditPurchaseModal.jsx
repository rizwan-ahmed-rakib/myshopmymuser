// import React, {useState, useEffect} from "react";
// import AsyncSelect from "react-select/async";
// import {posSupplierAPI} from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";
// import api from '../../../context_or_provider/pos/posApi';
//
// import {Trash2, ShoppingCart, User, Package, Wallet, Banknote, Tag, Info, Layers} from 'lucide-react';
// import BaseModal from "../../components/BaseModal";
//
// /**
//  * EditPurchaseModal - Highly optimized to allow complete Supplier Editing,
//  * explicit field labels, and distinct Percentage (%) / Fixed (৳) discount operators.
//  */
// const EditPurchaseModal = ({open, onClose, purchase, onUpdated}) => {
//     /* ---------------- STATES ---------------- */
//     const [supplier, setSupplier] = useState(null);
//     const [editablePurchase, setEditablePurchase] = useState(null);
//     const [instances, setInstances] = useState({});
//     const [removedSerials, setRemovedSerials] = useState({});
//     const [paymentProof, setPaymentProof] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [activeSerialTab, setActiveSerialTab] = useState(null);
//
//     /* ---------------- EFFECTS & DATA HYDRATION ---------------- */
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
//
//             // Prefill supplier state for structural updates
//             setSupplier({
//                 value: purchase.supplier,
//                 label: purchase.supplier_name,
//                 due_amount: Number(purchase.supplier_due_amount || 0) - Number(purchase.due_amount || 0)
//             });
//
//             // Map standard layout objects with structural flags
//             const itemsWithDiscountType = (mappedPurchase.items || []).map(item => ({
//                 ...item,
//                 discount_type: item.discount_type || "fixed",
//                 discount_value: Number(item.discount_value || item.discount_amount || 0),
//             }));
//
//             mappedPurchase.items = itemsWithDiscountType;
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
//     const loadSupplierOptions = async (inputValue) => {
//         const res = await posSupplierAPI.search(inputValue || "");
//         return res.data.map(s => ({
//             value: s.id,
//             label: s.name,
//             due_amount: Number(s.due_amount || 0),
//         }));
//     };
//
//     if (!open || !editablePurchase) return null;
//
//     /* ---------------- ADVANCED REALTIME ARITHMETIC ENGINE ---------------- */
//     const calculateUpdatedTotals = (currentPurchase) => {
//         let total_amount = 0;
//         let itemwise_total_discount = 0;
//
//         const updatedItems = currentPurchase.items.map(item => {
//             const quantity = parseFloat(item.quantity) || 0;
//             const unitPrice = parseFloat(item.unit_price) || 0;
//             const discValue = parseFloat(item.discount_value) || 0;
//
//             const base_total_price = quantity * unitPrice;
//             let calculated_discount = 0;
//
//             if (item.discount_type === "percent") {
//                 calculated_discount = (base_total_price * discValue) / 100;
//             } else {
//                 calculated_discount = discValue;
//             }
//
//             const net_total = Math.max(0, base_total_price - calculated_discount);
//             total_amount += base_total_price;
//             itemwise_total_discount += calculated_discount;
//
//             return {
//                 ...item,
//                 discount_amount: calculated_discount.toFixed(2),
//                 total_price: base_total_price.toFixed(2),
//                 net_total: net_total.toFixed(2)
//             };
//         });
//
//         const global_discount = parseFloat(currentPurchase.global_discount) || 0;
//         const total_discount = itemwise_total_discount + global_discount;
//         const net_total = Math.max(0, total_amount - total_discount);
//         const subtotal = total_amount - itemwise_total_discount;
//
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
//     /* ---------------- WORKSPACE MUTATORS ---------------- */
//     const handleItemChange = (index, field, value) => {
//         const updatedItems = [...editablePurchase.items];
//         updatedItems[index] = {...updatedItems[index], [field]: value};
//         setEditablePurchase(calculateUpdatedTotals({...editablePurchase, items: updatedItems}));
//     };
//
//     const handleRemoveItem = (index) => {
//         const updatedItems = editablePurchase.items.filter((_, i) => i !== index);
//         setEditablePurchase(calculateUpdatedTotals({...editablePurchase, items: updatedItems}));
//     };
//
//     const handleTopLevelChange = (field, value) => {
//         setEditablePurchase(calculateUpdatedTotals({...editablePurchase, [field]: value}));
//     };
//
//     const handleSupplierChange = (selectedOption) => {
//         setSupplier(selectedOption);
//         if (selectedOption) {
//             setEditablePurchase(prev => ({
//                 ...prev,
//                 supplier: selectedOption.value,
//                 supplier_name: selectedOption.label
//             }));
//         }
//     };
//
//     /* ---------------- FORM DISPATCH REQUEST ---------------- */
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
//                 discount_type: item.discount_type,
//                 discount_value: parseFloat(item.discount_value) || 0,
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
//     /* ---------------- MATH SUMMARY METRICS ---------------- */
//     const otherInvoicesDue = supplier?.due_amount || 0;
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
//             icon={<ShoppingCart className="text-white"/>}
//             showFooter={true}
//             onSubmit={handleSubmit}
//             submitText="Update Invoice"
//             isLoading={loading}
//         >
//             <div className="space-y-6">
//                 {/* Editable Supplier Module */}
//                 <div
//                     className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                     <div className="w-full md:w-1/2 space-y-2">
//                         <label
//                             className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-2">
//                             <User size={12}/> Supplier Account (Editable)
//                         </label>
//                         <AsyncSelect
//                             cacheOptions
//                             defaultOptions
//                             loadOptions={loadSupplierOptions}
//                             value={supplier}
//                             onChange={handleSupplierChange}
//                             placeholder="Change supplier..."
//                             menuPortalTarget={document.body}
//                             styles={{
//                                 menuPortal: base => ({...base, zIndex: 9999}),
//                                 control: (base) => ({...base, borderRadius: '12px', padding: '2px'})
//                             }}
//                         />
//                     </div>
//                     {supplier && (
//                         <div
//                             className="bg-white px-5 py-3 rounded-xl border border-blue-200 shadow-sm flex justify-between items-center min-w-[220px]">
//                             <div>
//                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Other Ledger
//                                     Due</p>
//                                 <p className="text-2xl font-black text-rose-600 font-mono">৳{otherInvoicesDue.toLocaleString()}</p>
//                             </div>
//                             <div
//                                 className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 ml-4">
//                                 <Wallet size={20}/></div>
//                         </div>
//                     )}
//                 </div>
//
//                 {/* Purchase Items Container */}
//                 <div className="space-y-4">
//                     <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
//                         <Package size={14} className="text-brand-primary"/> Adjusted Product Lineup
//                     </h3>
//
//                     {/* Desktop Headers */}
//                     <div
//                         className="hidden lg:grid grid-cols-12 gap-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">
//                         <div className="col-span-4">Product Description</div>
//                         <div className="col-span-2 text-center">Cost Price (৳)</div>
//                         <div className="col-span-1 text-center">Qty</div>
//                         <div className="col-span-2 text-center">Discount Layer</div>
//                         <div className="col-span-2 text-right">Line Total</div>
//                         <div className="col-span-1 text-center">Action</div>
//                     </div>
//
//                     <div className="space-y-3">
//                         {editablePurchase.items.map((item, index) => (
//                             <div key={item.id || index}
//                                  className="group border border-gray-100 rounded-2xl bg-white hover:border-blue-200 transition-all overflow-hidden shadow-sm hover:shadow-md">
//                                 <div className="grid lg:grid-cols-12 gap-4 p-4 items-center">
//                                     {/* Product Meta Data */}
//                                     <div className="lg:col-span-4 space-y-1.5">
//                                         <label
//                                             className="text-[9px] font-black text-gray-400 uppercase tracking-wider block lg:hidden">Product</label>
//                                         <p className="font-black text-gray-800 text-sm leading-tight">{item.product_name}</p>
//                                         <button
//                                             type="button"
//                                             onClick={() => setActiveSerialTab(activeSerialTab === item.product ? null : item.product)}
//                                             className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${activeSerialTab === item.product ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
//                                         >
//                                             <Layers size={10}/> Track Unique Serials
//                                         </button>
//                                     </div>
//
//                                     {/* Cost Price */}
//                                     <div className="lg:col-span-2 space-y-1">
//                                         <label
//                                             className="text-[9px] font-black text-gray-400 uppercase tracking-wider block lg:hidden">Cost
//                                             Price (৳)</label>
//                                         <input
//                                             className="w-full border border-gray-200 p-2 rounded-lg text-right font-bold text-sm focus:border-blue-500 outline-none font-mono"
//                                             type="number" step="0.01" value={item.unit_price}
//                                             onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}/>
//                                     </div>
//
//                                     {/* Qty */}
//                                     <div className="lg:col-span-1 space-y-1">
//                                         <label
//                                             className="text-[9px] font-black text-gray-400 uppercase tracking-wider block lg:hidden text-center">Qty</label>
//                                         <input
//                                             className="w-full border border-gray-200 p-2 rounded-lg text-center font-black text-sm focus:border-blue-500 outline-none font-mono"
//                                             type="number" value={item.quantity}
//                                             onChange={(e) => handleItemChange(index, "quantity", e.target.value)}/>
//                                     </div>
//
//                                     {/* Percentage / Fixed Dynamic Discount Selector */}
//                                     <div className="lg:col-span-2 space-y-1">
//                                         <label
//                                             className="text-[9px] font-black text-gray-400 uppercase tracking-wider block lg:hidden">Discount
//                                             Operator</label>
//                                         <div className="flex items-center gap-1">
//                                             <select
//                                                 className="border border-gray-200 p-2 rounded-lg text-[10px] font-bold bg-gray-50 outline-none h-[38px]"
//                                                 value={item.discount_type || "fixed"}
//                                                 onChange={(e) => handleItemChange(index, "discount_type", e.target.value)}>
//                                                 <option value="fixed">৳</option>
//                                                 <option value="percent">%</option>
//                                             </select>
//                                             <input type="number"
//                                                    className="w-full border border-gray-200 p-2 rounded-lg text-right text-sm font-bold outline-none font-mono focus:border-blue-500 h-[38px]"
//                                                    placeholder="0" value={item.discount_value || ""}
//                                                    onChange={(e) => handleItemChange(index, "discount_value", e.target.value)}/>
//                                         </div>
//                                     </div>
//
//                                     {/* Calculated Line Net Total */}
//                                     <div className="lg:col-span-2 text-right px-2">
//                                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-0.5 lg:hidden">Line
//                                             Net Total</p>
//                                         <span
//                                             className="font-black text-blue-700 text-base font-mono">৳{parseFloat(item.net_total).toLocaleString()}</span>
//                                         {parseFloat(item.discount_amount) > 0 &&
//                                             <p className="text-[10px] text-green-600 font-bold">Saved:
//                                                 ৳{parseFloat(item.discount_amount).toFixed(2)}</p>}
//                                     </div>
//
//                                     {/* Row Drop action */}
//                                     <div className="lg:col-span-1 flex justify-center lg:justify-end">
//                                         <button type="button" onClick={() => handleRemoveItem(index)}
//                                                 className="p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all border border-transparent hover:border-rose-100">
//                                             <Trash2 size={18}/></button>
//                                     </div>
//                                 </div>
//
//                                 {/* Serial Management Tracking Engine */}
//                                 {activeSerialTab === item.product && (
//                                     <div
//                                         className="p-4 bg-blue-50/30 border-t border-blue-100 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
//                                         <div
//                                             className="flex justify-between items-center border-b border-gray-100 pb-2">
//                                             <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
//                                                 <Info size={12} className="text-blue-500"/> Stock Serials Reconciliation
//                                             </h4>
//                                             <div className="flex gap-2">
//                                                 <span
//                                                     className="bg-blue-100 text-blue-700 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-tighter">In Ledger: {instances[item.product]?.length || 0}</span>
//                                                 <span
//                                                     className="bg-rose-100 text-rose-700 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-tighter">Required: {item.quantity}</span>
//                                             </div>
//                                         </div>
//                                         <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
//                                             {(instances[item.product] || []).map(inst => {
//                                                 const isRemoved = (removedSerials[item.product] || []).includes(inst.unique_serial);
//                                                 const isSold = inst.status !== 'in_stock';
//                                                 return (
//                                                     <div
//                                                         key={inst.id}
//                                                         onClick={() => !isSold && setRemovedSerials(prev => ({
//                                                             ...prev,
//                                                             [item.product]: isRemoved ? (prev[item.product] || []).filter(s => s !== inst.unique_serial) : [...(prev[item.product] || []), inst.unique_serial]
//                                                         }))}
//                                                         className={`p-2 border rounded-xl cursor-pointer transition-all flex flex-col items-center gap-1 select-none ${isRemoved ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-inner' : isSold ? 'opacity-40 grayscale cursor-not-allowed border-gray-100 bg-gray-50' : 'bg-white border-gray-100 hover:border-blue-300 shadow-sm'}`}
//                                                     >
//                                                         <span
//                                                             className="text-[10px] font-mono font-bold truncate w-full text-center">{inst.unique_serial.split('-').pop()}</span>
//                                                         <span
//                                                             className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${isRemoved ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'}`}>{isRemoved ? 'Removed' : 'Active'}</span>
//                                                     </div>
//                                                 );
//                                             })}
//                                         </div>
//                                     </div>
//                                 )}
//
//                                 {/* Expiry Management Segment */}
//                                 {(item.has_expiry || purchase.items.find(pi => pi.product === item.product)?.has_expiry) && (
//                                     <div
//                                         className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/30 border-t border-orange-100">
//                                         <div className="space-y-1.5">
//                                             <label
//                                                 className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Manufacturing
//                                                 Date</label>
//                                             <input type="date"
//                                                    className="w-full border border-orange-100 p-2 rounded-lg text-xs font-bold outline-none bg-white focus:border-orange-300"
//                                                    value={item.manufacturing_date || ""}
//                                                    onChange={(e) => handleItemChange(index, "manufacturing_date", e.target.value)}/>
//                                         </div>
//                                         <div className="space-y-1.5">
//                                             <label
//                                                 className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Shelf
//                                                 Life (Days)</label>
//                                             <input type="number"
//                                                    className="w-full border border-orange-100 p-2 rounded-lg text-xs font-bold outline-none bg-white focus:border-orange-300 font-mono"
//                                                    value={item.shelf_life_days || 0}
//                                                    onChange={(e) => handleItemChange(index, "shelf_life_days", e.target.value)}/>
//                                         </div>
//                                         <div className="space-y-1.5">
//                                             <label
//                                                 className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Batch
//                                                 Number Reference</label>
//                                             <input
//                                                 className="w-full border border-orange-100 p-2 rounded-lg text-xs font-bold outline-none bg-white focus:border-orange-300"
//                                                 value={item.batch_no || ""}
//                                                 onChange={(e) => handleItemChange(index, "batch_no", e.target.value)}/>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//
//                 {/* Bottom Reconciliation Workspace */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
//                     <div className="space-y-6">
//                         {/* Channels Split Ledger */}
//                         <div className="bg-gray-50/50 p-5 rounded-[2rem] border border-gray-100 space-y-5">
//                             <label
//                                 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
//                                 <Banknote size={14} className="text-brand-primary"/> Payment Reconciliation Split
//                             </label>
//                             <div className="grid grid-cols-3 gap-4">
//                                 <div className="space-y-1.5">
//                                     <label
//                                         className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Cash
//                                         Paid Amount</label>
//                                     <input type="number"
//                                            className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-emerald-600 text-sm focus:border-emerald-300 outline-none font-mono"
//                                            value={editablePurchase.paid_cash || ""} placeholder="0"
//                                            onChange={(e) => handleTopLevelChange("paid_cash", e.target.value)}/>
//                                 </div>
//                                 <div className="space-y-1.5">
//                                     <label
//                                         className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile
//                                         Paid Amount</label>
//                                     <input type="number"
//                                            className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-purple-600 text-sm focus:border-purple-300 outline-none font-mono"
//                                            value={editablePurchase.paid_mobile || ""} placeholder="0"
//                                            onChange={(e) => handleTopLevelChange("paid_mobile", e.target.value)}/>
//                                 </div>
//                                 <div className="space-y-1.5">
//                                     <label
//                                         className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank
//                                         Paid Amount</label>
//                                     <input type="number"
//                                            className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-blue-600 text-sm focus:border-blue-300 outline-none font-mono"
//                                            value={editablePurchase.paid_bank || ""} placeholder="0"
//                                            onChange={(e) => handleTopLevelChange("paid_bank", e.target.value)}/>
//                                 </div>
//                             </div>
//
//                             {/* Mobile MFS validation nodes */}
//                             {parseFloat(editablePurchase.paid_mobile) > 0 && (
//                                 <div
//                                     className="grid grid-cols-2 gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100 animate-in fade-in slide-in-from-top-2 duration-300">
//                                     <div className="space-y-1.5">
//                                         <label className="text-[9px] font-black text-purple-600 uppercase">MFS Gateway
//                                             Operator</label>
//                                         <select
//                                             className="w-full border border-purple-100 p-2 rounded-lg bg-white text-xs font-bold outline-none"
//                                             value={editablePurchase.mobile_operator}
//                                             onChange={(e) => handleTopLevelChange("mobile_operator", e.target.value)}>
//                                             <option value="">Select Operator</option>
//                                             <option value="bkash">bKash</option>
//                                             <option value="nagad">Nagad</option>
//                                             <option value="rocket">Rocket</option>
//                                             <option value="upay">Upay</option>
//                                         </select>
//                                     </div>
//                                     <div className="space-y-1.5">
//                                         <label className="text-[9px] font-black text-purple-600 uppercase">Transaction
//                                             ID Ref</label>
//                                         <input
//                                             className="w-full border border-purple-100 p-2 rounded-lg text-xs font-bold outline-none font-mono"
//                                             placeholder="Txn ID" value={editablePurchase.transaction_id}
//                                             onChange={(e) => handleTopLevelChange("transaction_id", e.target.value)}/>
//                                     </div>
//                                 </div>
//                             )}
//
//                             <div className="space-y-1.5">
//                                 <label
//                                     className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Payment
//                                     Document Proof Attachment</label>
//                                 <input type="file"
//                                        className="w-full text-[10px] font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
//                                        onChange={(e) => setPaymentProof(e.target.files[0])}/>
//                             </div>
//                         </div>
//
//                         {/* Flat Invoice Discount Adjusted Panel */}
//                         <div className="bg-emerald-50/50 p-5 rounded-[2rem] border border-emerald-100 space-y-2">
//                             <label
//                                 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
//                                 <Tag size={14}/> Adjust Global Flat Invoice Discount (৳)
//                             </label>
//                             <input type="number" step="0.01"
//                                    className="w-full border border-emerald-100 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-emerald-200 font-black text-emerald-700 font-mono h-[42px]"
//                                    placeholder="0.00" value={editablePurchase.global_discount}
//                                    onChange={(e) => handleTopLevelChange("global_discount", e.target.value)}/>
//                         </div>
//                     </div>
//
//                     {/*/!* Dark Premium Summary Sidebar *!/*/}
//                     {/*<div className="bg-gray-900 text-white p-8 rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden group flex flex-col justify-between">*/}
//                     {/*    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>*/}
//
//                     {/*    <div className="space-y-4 relative z-10">*/}
//                     {/*        <div className="flex justify-between items-center text-gray-500 text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-3">*/}
//                     {/*            <span>Adjusted Subtotal</span>*/}
//                     {/*            <span className="font-mono text-base font-bold">৳{parseFloat(editablePurchase.subtotal).toLocaleString()}</span>*/}
//                     {/*        </div>*/}
//                     {/*        <div className="flex justify-between items-center text-emerald-400 text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-3">*/}
//                     {/*            <span>Accumulated Discounts</span>*/}
//                     {/*            <span className="font-mono text-base font-bold">- ৳{parseFloat(editablePurchase.total_discount).toLocaleString()}</span>*/}
//                     {/*        </div>*/}
//                     {/*        <div className="flex justify-between items-center pt-2">*/}
//                     {/*            <span className="text-gray-400 font-black uppercase tracking-[0.2em]">Net Invoice Amount</span>*/}
//                     {/*            <span className="font-mono font-black text-3xl text-white">৳{parseFloat(editablePurchase.net_total).toLocaleString()}</span>*/}
//                     {/*        </div>*/}
//                     {/*    </div>*/}
//
//                     {/*    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3 relative z-10 my-4">*/}
//                     {/*        <div className="flex justify-between items-center text-blue-400 font-black uppercase text-[10px] tracking-widest">*/}
//                     {/*            <span>Total Paid Reconciled</span>*/}
//                     {/*            <span className="font-mono text-xl text-white font-black">৳{editablePurchase.paid_amount.toLocaleString()}</span>*/}
//                     {/*        </div>*/}
//                     {/*        <div className="flex justify-between items-center pt-3 border-t border-white/5">*/}
//                     {/*            <div className="space-y-1">*/}
//                     {/*                <p className="text-[8px] text-rose-400 font-black uppercase tracking-widest">Current Invoice Due</p>*/}
//                     {/*                <p className="text-lg font-black text-rose-500 font-mono">৳{currentInvoiceDue.toLocaleString()}</p>*/}
//                     {/*            </div>*/}
//                     {/*            <div className="text-right space-y-1">*/}
//                     {/*                <p className="text-[8px] text-blue-400 font-black uppercase tracking-widest">Combined Due Balance</p>*/}
//                     {/*                <p className="text-lg font-black text-blue-400 font-mono">৳{totalSupplierDue.toLocaleString()}</p>*/}
//                     {/*            </div>*/}
//                     {/*        </div>*/}
//                     {/*    </div>*/}
//                     {/*</div>*/}
//
//
//                     {/* Dark Premium Summary Sidebar */}
//                     <div
//                         className="bg-gray-900 text-white p-6 rounded-2xl space-y-4 shadow-xl relative overflow-hidden group">
//                         <div
//                             className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
//
//                         {/* Subtotal & Discount Section */}
//                         <div className="space-y-2 text-sm border-b border-gray-800 pb-3 relative z-10">
//                             <div className="flex justify-between">
//                                 <span className="text-gray-500 font-medium">Adjusted Subtotal</span>
//                                 <span
//                                     className="font-mono font-bold">৳{parseFloat(editablePurchase?.subtotal || 0).toLocaleString()}</span>
//                             </div>
//                             <div className="flex justify-between text-green-400">
//                                 <span>Accumulated Discounts</span>
//                                 <span
//                                     className="font-mono font-bold">- ৳{parseFloat(editablePurchase?.total_discount || 0).toLocaleString()}</span>
//                             </div>
//                             <div className="flex justify-between text-lg pt-2 border-t border-gray-800">
//                                 <span className="text-gray-400 font-bold">Net Invoice Amount</span>
//                                 <span
//                                     className="font-mono font-black text-white text-2xl">৳{parseFloat(editablePurchase?.net_total || 0).toLocaleString()}</span>
//                             </div>
//                         </div>
//
//                         {/* Total Paid Section */}
//                         <div
//                             className="space-y-3 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-inner relative z-10">
//                             <div className="flex justify-between items-center">
//                                 <span className="text-sm font-bold text-blue-400 uppercase">Total Paid Reconciled</span>
//                                 <span
//                                     className="font-mono font-black text-white text-xl">৳{parseFloat(editablePurchase?.paid_amount || 0).toLocaleString()}</span>
//                             </div>
//                         </div>
//
//                         {/* Due Grid Section */}
//                         <div className="grid grid-cols-2 gap-4 pt-2 relative z-10">
//                             <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-xl text-center">
//                                 <p className="text-[10px] text-red-500 font-bold uppercase mb-1">Current Invoice Due</p>
//                                 <p className="text-xl font-black text-red-500">৳{currentInvoiceDue.toLocaleString()}</p>
//                             </div>
//                             <div className="p-3 bg-blue-900/20 border border-blue-900/30 rounded-xl text-center">
//                                 <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Combined Due
//                                     Balance</p>
//                                 <p className="text-xl font-black text-blue-400">৳{totalSupplierDue.toLocaleString()}</p>
//                             </div>
//                         </div>
//                     </div>
//
//
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
import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
import api from '../../../context_or_provider/pos/posApi';

import {
    Trash2, ShoppingCart, User, Package, Wallet, Banknote, Tag, Info, Layers, Plus
} from 'lucide-react';
import BaseModal from "../../components/BaseModal";

/* ---------------- EMPTY ITEM TEMPLATE ---------------- */
const emptyItem = {
    id: null,
    product: null,
    product_name: "",
    unit_price: 0,
    quantity: 1,
    discount_type: "fixed",
    discount_value: 0,
    discount_amount: 0,
    total_price: 0,
    net_total: 0,
    manufacturing_date: "",
    shelf_life_days: 0,
    batch_no: "",
    has_expiry: false,
    instance_tracking_mode: "serial",
    stock: 0,
};

/**
 * EditPurchaseModal — Updated with:
 *  - Product add capability
 *  - Bulk stock fetch (no N+1)
 *  - Payment Adjustment Warning Panel (purchase-specific)
 *  - Supplier Balance Impact
 *  - Serial reconciliation
 *  - Expiry tracking
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
    const [serialErrors, setSerialErrors] = useState({});
    const [removedItems, setRemovedItems] = useState([]);

    /* ═══════════════════════════════════════════════════════
       CALCULATION ENGINE (before useEffect — hoisting fix)
       ═══════════════════════════════════════════════════════ */
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

    /* ═══════════════════════════════════════════════════════
       EFFECTS — hydrate modal from purchase prop
       ═══════════════════════════════════════════════════════ */
    useEffect(() => {
        if (!purchase) return;

        const hydrate = async () => {
            const mappedPurchase = {
                ...purchase,
                paid_cash: purchase.paid_cash || 0,
                paid_mobile: purchase.paid_mobile || 0,
                paid_bank: purchase.paid_bank || 0,
                global_discount: purchase.global_discount || purchase.globalDiscount || 0,
                mobile_operator: purchase.mobile_operator || "",
                transaction_id: purchase.transaction_id || "",
                bank_account_no: purchase.bank_account_no || "",

                // 🆕 Original snapshot (never change)
                _original_paid_amount: Number(
                    purchase.paid_amount ||
                    (Number(purchase.paid_cash || 0) +
                        Number(purchase.paid_mobile || 0) +
                        Number(purchase.paid_bank || 0))
                ),
                _original_net_total: Number(purchase.net_total || purchase.total_amount || 0),
                _original_due_amount: Number(purchase.due_amount || 0),
            };

            // Prefill supplier state
            setSupplier({
                value: purchase.supplier,
                label: purchase.supplier_name,
                due_amount: Number(purchase.supplier_due_amount || 0) - Number(purchase.due_amount || 0)
            });

            // ✅ Bulk stock fetch (no N+1)
            const productIds = [
                ...new Set((mappedPurchase.items || []).map(i => i.product).filter(Boolean))
            ];
            let stockMap = {};
            if (productIds.length > 0) {
                try {
                    const res = await posProductAPI.getByIds(productIds);
                    (res.data.results || []).forEach(p => {
                        stockMap[p.id] = {
                            stock: p.stock ?? 0,
                            has_expiry: p.has_expiry || false,
                            tracking_mode: p.instance_tracking_mode || 'serial',
                        };
                    });
                } catch (err) {
                    console.error("Stock fetch failed:", err);
                }
            }

            const itemsWithExtras = (mappedPurchase.items || []).map(item => {
                const stockInfo = stockMap[item.product] || {};
                return {
                    ...item,
                    discount_type: item.discount_type || "fixed",
                    discount_value: Number(item.discount_value || item.discount_amount || 0),
                    has_expiry: item.has_expiry || stockInfo.has_expiry || false,
                    instance_tracking_mode: stockInfo.tracking_mode || 'serial',
                    stock: stockInfo.stock || 0,
                    _original_quantity: item.quantity ?? 1,  // 🆕 original snapshot
                };
            });

            mappedPurchase.items = itemsWithExtras.length > 0
                ? itemsWithExtras
                : [{...emptyItem}];

            setEditablePurchase(calculateUpdatedTotals(JSON.parse(JSON.stringify(mappedPurchase))));
            setRemovedItems([]);
            fetchInstances(purchase.invoice_no);
        };

        hydrate();
    }, [purchase]);

    /* ---------------- FETCH SERIAL INSTANCES ---------------- */
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

    /* ---------------- OPTION LOADERS ---------------- */
    const loadSupplierOptions = async (inputValue) => {
        const res = await posSupplierAPI.search(inputValue || "");
        return res.data.map(s => ({
            value: s.id,
            label: s.name,
            due_amount: Number(s.due_amount || 0),
        }));
    };

    const loadProductOptions = async (inputValue) => {
        if (!inputValue || inputValue.trim().length < 1) return [];
        try {
            const res = await posProductAPI.search(inputValue, {page_size: 20});
            return (res.data.results || []).map((p) => ({
                value: p.id,
                label: `${p.name} (${p.product_code})`,
                product_name: p.name,
                unit_price: Number(p.purchase_price || 0),
                stock: p.stock || 0,
                has_expiry: p.has_expiry || false,
                tracking_mode: p.instance_tracking_mode || 'serial',
            }));
        } catch (err) {
            console.error("Error loading products:", err);
            return [];
        }
    };

    if (!open || !editablePurchase) return null;

    /* ═══════════════════════════════════════════════════════
       ORIGINAL vs NEW COMPARISON — Purchase specific
       ═══════════════════════════════════════════════════════ */
    const originalPaid = Number(editablePurchase._original_paid_amount || 0);
    const newPaid = Number(editablePurchase.paid_amount || 0);
    const paymentDiff = newPaid - originalPaid;

    const originalDue = Number(editablePurchase._original_due_amount || 0);
    const originalNetTotal = Number(editablePurchase._original_net_total || 0);
    const newNetTotal = Number(editablePurchase.net_total || 0);

    const currentInvoiceDue = newNetTotal - newPaid;

    const paidLessNow = paymentDiff < 0 ? Math.abs(paymentDiff) : 0;
    const paidMoreNow = paymentDiff > 0 ? paymentDiff : 0;

    const otherInvoicesDue = supplier?.due_amount || 0;
    const totalSupplierDue = otherInvoicesDue + currentInvoiceDue;

    /* ═══════════════════════════════════════════════════════
       ITEM MUTATORS
       ═══════════════════════════════════════════════════════ */
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...editablePurchase.items];
        updatedItems[index] = {...updatedItems[index], [field]: value};
        setEditablePurchase(calculateUpdatedTotals({...editablePurchase, items: updatedItems}));
    };

    const handleRemoveItem = (index) => {
        const item = editablePurchase.items[index];
        // Soft-delete: move to removedItems tray if item has a product
        if (item.product) {
            setRemovedItems(prev => [...prev, item]);
        }
        if (editablePurchase.items.length === 1) {
            setEditablePurchase(calculateUpdatedTotals({
                ...editablePurchase,
                items: [{...emptyItem}]
            }));
            return;
        }
        const updatedItems = editablePurchase.items.filter((_, i) => i !== index);
        setEditablePurchase(calculateUpdatedTotals({...editablePurchase, items: updatedItems}));
    };

    const restoreItem = (removedIndex) => {
        const item = removedItems[removedIndex];
        setRemovedItems(prev => prev.filter((_, i) => i !== removedIndex));
        const items = editablePurchase.items;
        const lastItem = items[items.length - 1];
        const isLastEmpty = !lastItem.product;
        const newItems = isLastEmpty
            ? [...items.slice(0, -1), item]
            : [...items, item];
        setEditablePurchase(calculateUpdatedTotals({...editablePurchase, items: newItems}));
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

    const handleAddNewRow = () => {
        setEditablePurchase(prev => ({
            ...prev,
            items: [...prev.items, {...emptyItem}]
        }));
    };

    const isProductDuplicate = (productId, currentIndex) => {
        return editablePurchase.items.some(
            (item, idx) => idx !== currentIndex && item.product === productId
        );
    };

    const handleSelectProduct = (option, index) => {
        if (isProductDuplicate(option.value, index)) {
            setSerialErrors(prev => ({...prev, [index]: "এই product already added!"}));
            return;
        }
        setSerialErrors(prev => {
            const copy = {...prev};
            delete copy[index];
            return copy;
        });

        const updatedItems = [...editablePurchase.items];
        updatedItems[index] = {
            ...updatedItems[index],
            product: option.value,
            product_name: option.product_name,
            unit_price: option.unit_price,
            quantity: 1,
            stock: option.stock,
            has_expiry: option.has_expiry,
            instance_tracking_mode: option.tracking_mode,
            manufacturing_date: "",
            shelf_life_days: 0,
            batch_no: "",
        };

        setEditablePurchase(calculateUpdatedTotals({
            ...editablePurchase,
            items: updatedItems
        }));
    };

    const handleQuantityChange = (index, newQty) => {
        if (newQty === "" || newQty === null || newQty === undefined) {
            handleItemChange(index, "quantity", "");
            return;
        }
        const qty = parseInt(newQty, 10);
        handleItemChange(index, "quantity", isNaN(qty) ? "" : Math.max(1, qty));
    };

    /* ═══════════════════════════════════════════════════════
       SUBMIT
       ═══════════════════════════════════════════════════════ */
    const handleSubmit = async () => {
        const validItems = editablePurchase.items.filter(i => i.product);
        if (validItems.length === 0) {
            alert("কমপক্ষে একটি item যোগ করুন");
            return;
        }

        // Expiry requirement check for new items
        for (const item of validItems) {
            if (item.has_expiry) {
                if (!item.manufacturing_date) {
                    alert(`"${item.product_name}" এর জন্য manufacturing date প্রয়োজন`);
                    return;
                }
                if (!item.shelf_life_days || item.shelf_life_days <= 0) {
                    alert(`"${item.product_name}" এর জন্য shelf life days প্রয়োজন`);
                    return;
                }
                if (!item.batch_no) {
                    alert(`"${item.product_name}" এর জন্য batch number প্রয়োজন`);
                    return;
                }
            }
        }

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

            const itemsPayload = validItems.map(item => ({
                ...(item.id ? {id: item.id} : {}),
                product: item.product,
                quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
                unit_price: parseFloat(item.unit_price) || 0,
                discount_amount: parseFloat(item.discount_amount) || 0,
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
            console.error("=== UPDATE ERROR ===");
            console.error("Status:", err.response?.status);
            console.error("Data:", err.response?.data);

            const errorData = err.response?.data;
            let errorMsg = "Update operation failed.";
            if (typeof errorData === "string") errorMsg = errorData;
            else if (errorData?.error) errorMsg = errorData.error;
            else if (errorData?.detail) errorMsg = errorData.detail;
            else if (errorData && typeof errorData === "object") {
                errorMsg = Object.entries(errorData)
                    .map(([field, msgs]) => {
                        const msg = Array.isArray(msgs) ? msgs.join(", ") : msgs;
                        return `${field}: ${msg}`;
                    })
                    .join("\n");
            }
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    /* ═══════════════════════════════════════════════════════
       RENDER
       ═══════════════════════════════════════════════════════ */
    return (
        <BaseModal
            isOpen={open}
            onClose={onClose}
            title={`Modify Purchase Invoice #${editablePurchase.invoice_no}`}
            size="2xl"
            icon={<ShoppingCart className="text-white"/>}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Update Invoice"
            isLoading={loading}
        >
            <div className="space-y-6">
                {/* Supplier Section */}
                <div
                    className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="w-full md:w-1/2 space-y-2">
                        <label
                            className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-2">
                            <User size={12}/> Supplier Account (Editable)
                        </label>
                        <AsyncSelect
                            cacheOptions defaultOptions
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
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    Other Ledger Due
                                </p>
                                <p className={`text-2xl font-black font-mono ${otherInvoicesDue < 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                                    ৳{otherInvoicesDue.toLocaleString()}
                                </p>
                            </div>
                            <div
                                className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 ml-4">
                                <Wallet size={20}/>
                            </div>
                        </div>
                    )}
                </div>

                {/* Items Section */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
                        <Package size={14} className="text-brand-primary"/> Adjusted Product Lineup
                    </h3>

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
                            <div key={item.id || `new-${index}`}
                                 className="group border border-gray-100 rounded-2xl bg-white hover:border-blue-200 transition-all overflow-hidden shadow-sm hover:shadow-md">

                                <div className="grid lg:grid-cols-12 gap-4 p-4 items-center">
                                    {/* Product / AsyncSelect */}
                                    <div className="lg:col-span-4 space-y-1.5">
                                        <label
                                            className="text-[9px] font-black text-gray-400 uppercase tracking-wider block lg:hidden">
                                            Product
                                        </label>

                                        {item.id ? (
                                            <div>
                                                <p className="font-black text-gray-800 text-sm leading-tight">
                                                    {item.product_name}
                                                </p>
                                                {item.product && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveSerialTab(activeSerialTab === item.product ? null : item.product)}
                                                        className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 mt-1 ${activeSerialTab === item.product ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                                    >
                                                        <Layers size={10}/> Track Unique Serials
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <AsyncSelect
                                                loadOptions={loadProductOptions}
                                                defaultOptions={false}
                                                onChange={(opt) => handleSelectProduct(opt, index)}
                                                value={item.product ? {
                                                    value: item.product,
                                                    label: item.product_name
                                                } : null}
                                                placeholder="Find product to add..."
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: base => ({...base, zIndex: 9999}),
                                                    control: (base) => ({...base, borderRadius: '10px'})
                                                }}
                                            />
                                        )}
                                        {serialErrors[index] && (
                                            <p className="text-red-500 text-[10px] font-bold">{serialErrors[index]}</p>
                                        )}
                                        {item.product && (
                                            <p className="text-blue-500 text-[10px] font-bold">
                                                Current Stock: {item.stock}
                                                {item.instance_tracking_mode === 'batch' && ' (batch)'}
                                            </p>
                                        )}
                                    </div>

                                    {/* Cost Price */}
                                    <div className="lg:col-span-2 space-y-1">
                                        <label
                                            className="text-[9px] font-black text-gray-400 uppercase tracking-wider block lg:hidden">
                                            Cost Price (৳)
                                        </label>
                                        <input
                                            className="w-full border border-gray-200 p-2 rounded-lg text-right font-bold text-sm focus:border-blue-500 outline-none font-mono"
                                            type="number" step="0.01"
                                            value={item.unit_price}
                                            onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}
                                        />
                                    </div>

                                    {/* Qty */}
                                    <div className="lg:col-span-1 space-y-1">
                                        <label
                                            className="text-[9px] font-black text-gray-400 uppercase tracking-wider block lg:hidden text-center">
                                            Qty
                                        </label>
                                        <input
                                            className="w-full border border-gray-200 p-2 rounded-lg text-center font-black text-sm focus:border-blue-500 outline-none font-mono"
                                            type="number" min="1"
                                            value={item.quantity === "" ? "" : item.quantity}
                                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                                            onBlur={() => {
                                                if (item.quantity === "" || Number(item.quantity) < 1) {
                                                    handleQuantityChange(index, 1);
                                                }
                                            }}
                                        />
                                        {/* Qty Diff Badge */}
                                        {item.quantity !== "" && item.quantity != null && (() => {
                                            const orig = item._original_quantity ?? (item.id ? Number(item.quantity) : null);
                                            if (orig == null) return null;
                                            const diff = Number(item.quantity) - orig;
                                            if (diff === 0) return null;
                                            return (
                                                <p className={`text-[10px] font-black text-center mt-0.5 ${diff > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {orig} {diff > 0 ? `+${diff}` : diff}
                                                </p>
                                            );
                                        })()}
                                    </div>

                                    {/* Discount */}
                                    <div className="lg:col-span-2 space-y-1">
                                        <label
                                            className="text-[9px] font-black text-gray-400 uppercase tracking-wider block lg:hidden">
                                            Discount
                                        </label>
                                        <div className="flex items-center gap-1">
                                            <select
                                                className="border border-gray-200 p-2 rounded-lg text-[10px] font-bold bg-gray-50 outline-none h-[38px]"
                                                value={item.discount_type || "fixed"}
                                                onChange={(e) => handleItemChange(index, "discount_type", e.target.value)}
                                            >
                                                <option value="fixed">৳</option>
                                                <option value="percent">%</option>
                                            </select>
                                            <input
                                                type="number"
                                                className="w-full border border-gray-200 p-2 rounded-lg text-right text-sm font-bold outline-none font-mono focus:border-blue-500 h-[38px]"
                                                placeholder="0"
                                                value={item.discount_value || ""}
                                                onChange={(e) => handleItemChange(index, "discount_value", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Line Total */}
                                    <div className="lg:col-span-2 text-right px-2">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-0.5 lg:hidden">
                                            Line Net Total
                                        </p>
                                        <span className="font-black text-blue-700 text-base font-mono">
                                            ৳{parseFloat(item.net_total || 0).toLocaleString()}
                                        </span>
                                        {parseFloat(item.discount_amount) > 0 && (
                                            <p className="text-[10px] text-green-600 font-bold">
                                                Saved: ৳{parseFloat(item.discount_amount).toFixed(2)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Delete */}
                                    <div className="lg:col-span-1 flex justify-center lg:justify-end">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(index)}
                                            className="p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all border border-transparent hover:border-rose-100"
                                        >
                                            <Trash2 size={18}/>
                                        </button>
                                    </div>
                                </div>

                                {/* Serial Reconciliation (existing items only) */}
                                {item.id && activeSerialTab === item.product && (
                                    <div className="p-4 bg-blue-50/30 border-t border-blue-100 space-y-4">
                                        <div
                                            className="flex justify-between items-center border-b border-gray-100 pb-2">
                                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <Info size={12} className="text-blue-500"/> Stock Serials Reconciliation
                                            </h4>
                                            <div className="flex gap-2">
                                                <span
                                                    className="bg-blue-100 text-blue-700 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-tighter">
                                                    In Ledger: {instances[item.product]?.length || 0}
                                                </span>
                                                <span
                                                    className="bg-rose-100 text-rose-700 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-tighter">
                                                    Required: {item.quantity}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                                            {(instances[item.product] || []).map(inst => {
                                                const isRemoved = (removedSerials[item.product] || []).includes(inst.unique_serial);
                                                const isSold = inst.status !== 'in_stock';
                                                return (
                                                    <div
                                                        key={inst.id}
                                                        onClick={() => {
                                                            if (isSold) return;
                                                            const currentList = removedSerials[item.product] || [];
                                                            const nextList = isRemoved
                                                                ? currentList.filter(s => s !== inst.unique_serial)
                                                                : [...currentList, inst.unique_serial];

                                                            setRemovedSerials(prev => ({
                                                                ...prev,
                                                                [item.product]: nextList
                                                            }));

                                                            const totalInsts = (instances[item.product] || []).length;
                                                            const remainingActive = Math.max(1, totalInsts - nextList.length);
                                                            handleItemChange(index, "quantity", remainingActive);
                                                        }}
                                                        className={`p-2 border rounded-xl cursor-pointer transition-all flex flex-col items-center gap-1 select-none ${
                                                            isRemoved
                                                                ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-inner'
                                                                : isSold
                                                                    ? 'opacity-40 grayscale cursor-not-allowed border-gray-100 bg-gray-50'
                                                                    : 'bg-white border-gray-100 hover:border-blue-300 shadow-sm'
                                                        }`}
                                                    >
                                                        <span
                                                            className="text-[10px] font-mono font-bold truncate w-full text-center">
                                                            {inst.unique_serial.split('-').pop()}
                                                        </span>
                                                        <span
                                                            className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                                                                isRemoved ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'
                                                            }`}>
                                                            {isRemoved ? 'Removed' : 'Active'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Expiry Fields */}
                                {item.has_expiry && item.product && (
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/30 border-t border-orange-100">
                                        <div className="space-y-1.5">
                                            <label
                                                className="text-[9px] font-black text-orange-600 uppercase tracking-widest">
                                                Manufacturing Date *
                                            </label>
                                            <input
                                                type="date"
                                                className="w-full border border-orange-100 p-2 rounded-lg text-xs font-bold outline-none bg-white focus:border-orange-300"
                                                value={item.manufacturing_date || ""}
                                                onChange={(e) => handleItemChange(index, "manufacturing_date", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label
                                                className="text-[9px] font-black text-orange-600 uppercase tracking-widest">
                                                Shelf Life (Days) *
                                            </label>
                                            <input
                                                type="number"
                                                className="w-full border border-orange-100 p-2 rounded-lg text-xs font-bold outline-none bg-white focus:border-orange-300 font-mono"
                                                value={item.shelf_life_days || 0}
                                                onChange={(e) => handleItemChange(index, "shelf_life_days", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label
                                                className="text-[9px] font-black text-orange-600 uppercase tracking-widest">
                                                Batch Number *
                                            </label>
                                            <input
                                                className="w-full border border-orange-100 p-2 rounded-lg text-xs font-bold outline-none bg-white focus:border-orange-300"
                                                value={item.batch_no || ""}
                                                onChange={(e) => handleItemChange(index, "batch_no", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add new product */}
                        <button
                            type="button"
                            onClick={handleAddNewRow}
                            className="flex items-center gap-2 text-blue-600 font-bold px-4 py-3 border-2 border-dashed border-blue-200 rounded-2xl hover:bg-blue-50 transition-colors w-full justify-center"
                        >
                            <Plus size={18}/> Add New Product to this Invoice
                        </button>

                        {/* Removed Items — Soft Delete Tray */}
                        {removedItems.length > 0 && (
                            <div className="border border-dashed border-red-200 rounded-2xl bg-red-50/40 p-4 space-y-2">
                                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
                                    ✕ Removed Items — click Restore to bring back
                                </p>
                                {removedItems.map((ri, ri_index) => (
                                    <div key={ri_index}
                                         className="flex items-center justify-between bg-white border border-red-100 rounded-xl px-3 py-2 gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-500 line-through truncate">{ri.product_name}</p>
                                            <p className="text-[10px] text-gray-400 font-mono">
                                                Qty: {ri._original_quantity ?? ri.quantity} &nbsp;·&nbsp; ৳{Number(ri.unit_price).toFixed(2)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => restoreItem(ri_index)}
                                            className="text-[11px] font-black text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-all whitespace-nowrap"
                                        >
                                            ↩ Restore
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                    <div className="space-y-6">
                        {/* Payment Split */}
                        <div className="bg-gray-50/50 p-5 rounded-[2rem] border border-gray-100 space-y-5">
                            <label
                                className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Banknote size={14} className="text-brand-primary"/> Payment Reconciliation Split
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label
                                        className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Cash</label>
                                    <input type="number"
                                           className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-emerald-600 text-sm focus:border-emerald-300 outline-none font-mono"
                                           value={editablePurchase.paid_cash || ""} placeholder="0"
                                           onChange={(e) => handleTopLevelChange("paid_cash", e.target.value)}/>
                                </div>
                                <div className="space-y-1.5">
                                    <label
                                        className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile</label>
                                    <input type="number"
                                           className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-purple-600 text-sm focus:border-purple-300 outline-none font-mono"
                                           value={editablePurchase.paid_mobile || ""} placeholder="0"
                                           onChange={(e) => handleTopLevelChange("paid_mobile", e.target.value)}/>
                                </div>
                                <div className="space-y-1.5">
                                    <label
                                        className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank</label>
                                    <input type="number"
                                           className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-blue-600 text-sm focus:border-blue-300 outline-none font-mono"
                                           value={editablePurchase.paid_bank || ""} placeholder="0"
                                           onChange={(e) => handleTopLevelChange("paid_bank", e.target.value)}/>
                                </div>
                            </div>

                            {parseFloat(editablePurchase.paid_mobile) > 0 && (
                                <div
                                    className="grid grid-cols-2 gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-purple-600 uppercase">MFS
                                            Gateway</label>
                                        <select
                                            className="w-full border border-purple-100 p-2 rounded-lg bg-white text-xs font-bold outline-none"
                                            value={editablePurchase.mobile_operator}
                                            onChange={(e) => handleTopLevelChange("mobile_operator", e.target.value)}>
                                            <option value="">Select</option>
                                            <option value="bkash">bKash</option>
                                            <option value="nagad">Nagad</option>
                                            <option value="rocket">Rocket</option>
                                            <option value="upay">Upay</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-purple-600 uppercase">Txn
                                            ID</label>
                                        <input
                                            className="w-full border border-purple-100 p-2 rounded-lg text-xs font-bold outline-none font-mono"
                                            placeholder="Txn ID"
                                            value={editablePurchase.transaction_id}
                                            onChange={(e) => handleTopLevelChange("transaction_id", e.target.value)}/>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label
                                    className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 block">
                                    Payment Proof
                                </label>
                                <input type="file"
                                       className="w-full text-[10px] font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                       onChange={(e) => setPaymentProof(e.target.files[0])}/>
                            </div>
                        </div>

                        {/* Global Discount */}
                        <div className="bg-emerald-50/50 p-5 rounded-[2rem] border border-emerald-100 space-y-2">
                            <label
                                className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Tag size={14}/> Adjust Global Flat Discount (৳)
                            </label>
                            <input type="number" step="0.01"
                                   className="w-full border border-emerald-100 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-emerald-200 font-black text-emerald-700 font-mono h-[42px]"
                                   placeholder="0.00"
                                   value={editablePurchase.global_discount}
                                   onChange={(e) => handleTopLevelChange("global_discount", e.target.value)}/>
                        </div>

                        {/* ═══════════════════════════════════════════════════════ */}
                        {/* 🆕 Payment Adjustment Warning Panel (Purchase)         */}
                        {/* ═══════════════════════════════════════════════════════ */}
                        {(paymentDiff !== 0 || originalNetTotal !== newNetTotal) && (
                            <div className={`p-4 rounded-xl border-2 space-y-3 ${
                                paymentDiff < 0
                                    ? 'bg-amber-50 border-amber-300'
                                    : paymentDiff > 0
                                        ? 'bg-blue-50 border-blue-300'
                                        : 'bg-purple-50 border-purple-300'
                            }`}>
                                <div className="flex items-center gap-2">
                                    {paymentDiff < 0 ? (
                                        <>
                                            <span className="text-amber-700 text-lg">⚠️</span>
                                            <h4 className="font-bold text-amber-800">
                                                Payment Reduced — Supplier কে আরো দিতে হবে
                                            </h4>
                                        </>
                                    ) : paymentDiff > 0 ? (
                                        <>
                                            <span className="text-blue-700 text-lg">✅</span>
                                            <h4 className="font-bold text-blue-800">
                                                Extra Payment to Supplier
                                            </h4>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-purple-700 text-lg">ℹ️</span>
                                            <h4 className="font-bold text-purple-800">
                                                Invoice Amount Changed
                                            </h4>
                                        </>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-white/70 p-3 rounded-lg border border-gray-200">
                                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Original
                                            Paid</p>
                                        <p className="text-lg font-black text-gray-800">৳{originalPaid.toFixed(2)}</p>
                                    </div>
                                    <div className="bg-white/70 p-3 rounded-lg border border-gray-200">
                                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">New Paid</p>
                                        <p className={`text-lg font-black ${
                                            paymentDiff < 0
                                                ? 'text-amber-600'
                                                : paymentDiff > 0
                                                    ? 'text-blue-600'
                                                    : 'text-gray-800'
                                        }`}>
                                            ৳{newPaid.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {paymentDiff !== 0 && (
                                    <div className={`p-3 rounded-lg font-bold text-center border-2 ${
                                        paymentDiff < 0
                                            ? 'bg-amber-100 border-amber-300 text-amber-800'
                                            : 'bg-blue-100 border-blue-300 text-blue-800'
                                    }`}>
                                        {paymentDiff < 0 ? (
                                            <div>
                                                <p className="text-xs uppercase tracking-wider opacity-80">
                                                    Additional Payment to Supplier
                                                </p>
                                                <p className="text-2xl font-black mt-1">৳{paidLessNow.toFixed(2)}</p>
                                                <p className="text-[10px] mt-1 opacity-70">
                                                    Supplier কে এই invoice এ আরো ৳{paidLessNow.toFixed(2)} দিতে হবে
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-xs uppercase tracking-wider opacity-80">
                                                    Supplier কে কম দিতে হবে
                                                </p>
                                                <p className="text-2xl font-black mt-1">৳{paidMoreNow.toFixed(2)}</p>
                                                <p className="text-[10px] mt-1 opacity-70">
                                                    নতুন payment count এ supplier এর due কমেছে ৳{paidMoreNow.toFixed(2)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-current/20">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Original
                                            Due</p>
                                        <p className="text-base font-bold text-gray-700">৳{originalDue.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">New Due</p>
                                        <p className={`text-base font-bold ${
                                            currentInvoiceDue > originalDue
                                                ? 'text-amber-600'
                                                : currentInvoiceDue < originalDue
                                                    ? 'text-blue-600'
                                                    : 'text-gray-700'
                                        }`}>
                                            ৳{currentInvoiceDue.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-current/20">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Original Total</span>
                                        <span className="font-bold">৳{originalNetTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs mt-1">
                                        <span className="text-gray-600">New Total</span>
                                        <span className="font-bold">৳{newNetTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Supplier Balance Impact */}
                                <div className="pt-3 border-t border-current/20 space-y-2">
                                    <p className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">
                                        Supplier Balance Impact
                                    </p>

                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div className="bg-white/70 p-2 rounded-lg border border-gray-200">
                                            <p className="text-[9px] uppercase font-bold text-gray-500">Old Balance</p>
                                            <p className={`text-sm font-black ${
                                                otherInvoicesDue < 0 ? 'text-blue-600' : 'text-rose-600'
                                            }`}>
                                                ৳{otherInvoicesDue.toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="bg-white/70 p-2 rounded-lg border border-gray-200">
                                            <p className="text-[9px] uppercase font-bold text-gray-500">This Invoice</p>
                                            <p className={`text-sm font-black ${
                                                currentInvoiceDue > 0 ? 'text-rose-600' : 'text-gray-700'
                                            }`}>
                                                ৳{currentInvoiceDue.toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="bg-white/70 p-2 rounded-lg border-2 border-blue-300">
                                            <p className="text-[9px] uppercase font-bold text-blue-700">New Balance</p>
                                            <p className={`text-sm font-black ${
                                                totalSupplierDue < 0 ? 'text-blue-600' : 'text-rose-600'
                                            }`}>
                                                ৳{totalSupplierDue.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className="text-xs bg-blue-50 border border-blue-200 p-2 rounded-lg text-blue-800 leading-relaxed">
                                        {currentInvoiceDue > 0 && otherInvoicesDue >= 0 && (
                                            <p>
                                                ℹ️ Invoice Due <strong>৳{currentInvoiceDue.toFixed(2)}</strong> will be
                                                <strong> added</strong> to supplier's balance.
                                                New total we owe: <strong>৳{totalSupplierDue.toFixed(2)}</strong>
                                            </p>
                                        )}
                                        {currentInvoiceDue > 0 && otherInvoicesDue < 0 && (
                                            <p>
                                                ℹ️ Invoice Due <strong>৳{currentInvoiceDue.toFixed(2)}</strong> will
                                                <strong> offset</strong> supplier's advance
                                                of <strong>৳{Math.abs(otherInvoicesDue).toFixed(2)}</strong>.
                                                {Math.abs(otherInvoicesDue) >= currentInvoiceDue
                                                    ? ` Remaining advance with supplier: ৳${(otherInvoicesDue + currentInvoiceDue).toFixed(2)}`
                                                    : ` Remaining due to supplier: ৳${totalSupplierDue.toFixed(2)}`
                                                }
                                            </p>
                                        )}
                                        {currentInvoiceDue < 0 && (
                                            <p>
                                                💰 Supplier now owes
                                                us <strong>৳{Math.abs(currentInvoiceDue).toFixed(2)}</strong>
                                                (advance). We overpaid this invoice.
                                                New balance: <strong>৳{totalSupplierDue.toFixed(2)}</strong>
                                            </p>
                                        )}
                                        {currentInvoiceDue === 0 && (
                                            <p>
                                                ✅ This invoice is fully paid. Supplier balance remains
                                                <strong> ৳{otherInvoicesDue.toFixed(2)}</strong>.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Dark Summary Panel */}
                    <div
                        className="bg-gray-900 text-white p-6 rounded-2xl space-y-4 shadow-xl relative overflow-hidden group">
                        <div
                            className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>

                        <div className="space-y-2 text-sm border-b border-gray-800 pb-3 relative z-10">
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Adjusted Subtotal</span>
                                <span className="font-mono font-bold">
                                    ৳{parseFloat(editablePurchase?.subtotal || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-green-400">
                                <span>Accumulated Discounts</span>
                                <span className="font-mono font-bold">
                                    - ৳{parseFloat(editablePurchase?.total_discount || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg pt-2 border-t border-gray-800">
                                <span className="text-gray-400 font-bold">Net Invoice Amount</span>
                                <span className="font-mono font-black text-white text-2xl">
                                    ৳{parseFloat(editablePurchase?.net_total || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div
                            className="space-y-3 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-inner relative z-10">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-blue-400 uppercase">Total Paid</span>
                                <span className="font-mono font-black text-white text-xl">
                                    ৳{parseFloat(editablePurchase?.paid_amount || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 relative z-10">
                            <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-xl text-center">
                                <p className="text-[10px] text-red-500 font-bold uppercase mb-1">Current Invoice Due</p>
                                <p className={`text-xl font-black ${
                                    currentInvoiceDue < 0 ? 'text-emerald-400' : 'text-red-500'
                                }`}>
                                    ৳{currentInvoiceDue.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-900/20 border border-blue-900/30 rounded-xl text-center">
                                <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Combined Due</p>
                                <p className={`text-xl font-black ${
                                    totalSupplierDue < 0 ? 'text-emerald-400' : 'text-blue-400'
                                }`}>
                                    ৳{totalSupplierDue.toLocaleString()}
                                </p>
                                <p className="text-[9px] text-blue-300 mt-1">
                                    (৳{otherInvoicesDue.toFixed(2)} other + ৳{currentInvoiceDue.toFixed(2)} this)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default EditPurchaseModal;