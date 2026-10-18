// import React, { useState, useEffect, useRef } from "react";
// import AsyncSelect from "react-select/async";
// import api from '../../../context_or_provider/pos/posApi';
// import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
// import { posCustomerAPI } from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";
// import BASE_URL_of_POS from "../../../posConfig";
//
// import { Trash2, ShoppingCart, User, Package, Banknote, Tag } from 'lucide-react';
// import BaseModal from "../../components/BaseModal";
//
// const emptyItem = {
//     product: null,
//     product_name: "",
//     unit_price: 0,
//     quantity: 1,
//     discount_type: "fixed",
//     discount_value: 0,
//     discount_amount: 0,
//     total_price: 0,
//     unique_serial: "",
//     is_unique: false,
//     stock: 0,
//     success_msg: "",
//     error_msg: ""
// };
//
// /**
//  * EditSaleModal - Updated with Customer editing, Product appending capabilities,
//  * and seamless integration with BaseModal layout structures.
//  */
// const EditSaleModal = ({ open, onClose, purchase, onUpdated }) => {
//     /* ---------------- STATE ---------------- */
//     const [customer, setCustomer] = useState(null);
//     const [editableSale, setEditableSale] = useState(null);
//     const [loading, setLoading] = useState(false);
//
//     useEffect(() => {
//         if (purchase) {
//             // ইনিশিয়াল কাস্টমার সেটআপ
//             setCustomer({
//                 value: purchase.customer,
//                 label: purchase.customer_name || "Walk-in Customer",
//                 due_amount: Number(purchase.customer_due_amount || 0) - Number(purchase.due_amount || 0)
//             });
//
//             // প্রোডাক্ট আইটেম ম্যাপিং ও স্টেট রেডি করা
//             const mappedItems = (purchase.items || []).map(item => {
//                 const uPrice = Number(item.unit_price || 0);
//                 const qty = Number(item.quantity || 1);
//                 const discAmount = Number(item.discount_amount || 0);
//                 const baseTotal = uPrice * qty;
//
//                 return {
//                     id: item.id, // এডিটের ট্র্যাকিং এর জন্য আইডি রাখা হলো
//                     product: item.product,
//                     product_name: item.product_name || "",
//                     unit_price: uPrice,
//                     quantity: qty,
//                     discount_type: "fixed",
//                     discount_value: discAmount / qty, // আনুমানিক রেট বের করার জন্য
//                     discount_amount: discAmount,
//                     total_price: Math.max(0, baseTotal - discAmount),
//                     unique_serial: item.serials && item.serials.length > 0 ? item.serials[0] : "",
//                     is_unique: !!(item.serials && item.serials.length > 0),
//                     stock: item.stock || 999, // সেফ সাইড ব্যাকআপ
//                     success_msg: item.serials && item.serials.length > 0 ? "Scanned" : "",
//                     error_msg: ""
//                 };
//             });
//
//             const mappedSale = {
//                 ...purchase,
//                 items: mappedItems.length > 0 ? mappedItems : [{ ...emptyItem }],
//                 paid_cash: Number(purchase.paid_cash || 0),
//                 paid_mobile: Number(purchase.paid_mobile || 0),
//                 paid_bank: Number(purchase.paid_bank || 0),
//                 global_discount: Number(purchase.global_discount || purchase.globalDiscount || 0),
//                 mobile_operator: purchase.mobile_operator || "",
//                 transaction_id: purchase.transaction_id || "",
//                 bank_account_no: purchase.bank_account_no || "",
//             };
//
//             setEditableSale(JSON.parse(JSON.stringify(mappedSale)));
//         }
//     }, [purchase]);
//
//     if (!open || !editableSale) return null;
//
//     /* ---------------- OPTION LOADERS ---------------- */
//     const loadCustomerOptions = async (inputValue) => {
//         const res = await posCustomerAPI.search(inputValue || "");
//         return res.data.map(s => ({
//             value: s.id,
//             label: `${s.name} ${s.phone ? `(${s.phone})` : ''}`,
//             due_amount: Number(s.due_amount || 0)
//         }));
//     };
//
//     const loadProductOptions = async (inputValue) => {
//         if (!inputValue) return [];
//         const res = await posProductAPI.search(inputValue);
//         return res.data.map(p => ({
//             value: p.id,
//             label: `${p.name} (${p.product_code})`,
//             unit_price: Number(p.sale_price || p.selling_price),
//             product_name: p.name,
//             stock: p.stock
//         }));
//     };
//
//     /* ---------------- DYNAMIC CALCULATIONS ---------------- */
//     const calculateUpdatedTotals = (currentSale) => {
//         let subtotal = 0;
//         let itemwise_total_discount = 0;
//
//         const updatedItems = currentSale.items.map(item => {
//             const baseTotal = item.unit_price * item.quantity;
//             let discount = 0;
//             if (item.discount_type === "percent") {
//                 discount = (baseTotal * item.discount_value) / 100;
//             } else {
//                 discount = item.discount_value;
//             }
//             const total_price = Math.max(0, baseTotal - discount);
//
//             subtotal += total_price;
//             itemwise_total_discount += discount;
//
//             return { ...item, total_price, discount_amount: discount };
//         });
//
//         const global_discount = Number(currentSale.global_discount) || 0;
//         const net_total = Math.max(0, subtotal - global_discount);
//
//         const paid_cash = Number(currentSale.paid_cash) || 0;
//         const paid_mobile = Number(currentSale.paid_mobile) || 0;
//         const paid_bank = Number(currentSale.paid_bank) || 0;
//         const totalPaid = paid_cash + paid_mobile + paid_bank;
//
//         let payment_method = "cash";
//         const counts = [paid_cash > 0, paid_mobile > 0, paid_bank > 0].filter(Boolean).length;
//         if (counts > 1) payment_method = "hybrid";
//         else if (paid_mobile > 0) payment_method = "mobile_banking";
//         else if (paid_bank > 0) payment_method = "bank";
//
//         return {
//             ...currentSale,
//             items: updatedItems,
//             subtotal,
//             itemwise_total_discount,
//             total_discount: itemwise_total_discount + global_discount,
//             net_total,
//             paid_amount: totalPaid,
//             payment_method
//         };
//     };
//
//     /* ---------------- TABLE ROW CONTROLLERS ---------------- */
//     const updateItem = (index, updates) => {
//         const updatedItems = [...editableSale.items];
//         updatedItems[index] = { ...updatedItems[index], ...updates };
//         setEditableSale(calculateUpdatedTotals({ ...editableSale, items: updatedItems }));
//     };
//
//     const isProductDuplicate = (productId, currentIndex) => {
//         return editableSale.items.some((item, index) => index !== currentIndex && item.product === productId);
//     };
//
//     const isSerialDuplicate = (serial, currentIndex) => {
//         return editableSale.items.some((item, index) => index !== currentIndex && item.unique_serial === serial);
//     };
//
//     const selectProduct = (option, index) => {
//         if (isProductDuplicate(option.value, index)) {
//             updateItem(index, { error_msg: "Product already added!" });
//             return;
//         }
//         updateItem(index, {
//             product: option.value,
//             product_name: option.product_name,
//             unit_price: option.unit_price,
//             quantity: 1,
//             stock: option.stock,
//             is_unique: false,
//             unique_serial: "",
//             error_msg: "",
//             success_msg: ""
//         });
//     };
//
//     const handleSerialVerify = async (serial, index) => {
//         if (!serial || serial.length < 3) return;
//         if (isSerialDuplicate(serial, index)) {
//             updateItem(index, { error_msg: "Already scanned!" });
//             return;
//         }
//         try {
//             const response = await fetch(`${BASE_URL_of_POS}/api/bar-qr/verify/verify/?serial=${serial}`);
//             const data = await response.json();
//             if (data.valid && data.status_code === 'in_stock') {
//                 updateItem(index, {
//                     product: data.product_id,
//                     product_name: data.product.name,
//                     unit_price: Number(data.product.sale_price || data.product.selling_price),
//                     quantity: 1,
//                     unique_serial: serial,
//                     is_unique: true,
//                     stock: data.product.stock,
//                     success_msg: "Valid",
//                     error_msg: ""
//                 });
//             } else {
//                 updateItem(index, { is_unique: false, error_msg: !data.valid ? "Invalid" : "Not in stock", success_msg: "" });
//             }
//         } catch (err) { console.error(err); }
//     };
//
//     const updateQty = (index, qty) => {
//         const item = editableSale.items[index];
//         if (item.is_unique) return;
//         const maxStock = item.stock || 0;
//         let finalQty = qty;
//         let error_msg = "";
//         if (qty > maxStock) {
//             finalQty = maxStock;
//             error_msg = `Only ${maxStock} in stock!`;
//         } else if (qty < 1) {
//             finalQty = 1;
//         }
//         updateItem(index, { quantity: finalQty, error_msg });
//     };
//
//     const addRow = () => {
//         setEditableSale(prev => ({ ...prev, items: [...prev.items, { ...emptyItem }] }));
//     };
//
//     const removeRow = (index) => {
//         if (editableSale.items.length === 1) {
//             setEditableSale(prev => ({ ...prev, items: [{ ...emptyItem }] }));
//         } else {
//             const filtered = editableSale.items.filter((_, i) => i !== index);
//             setEditableSale(calculateUpdatedTotals({ ...editableSale, items: filtered }));
//         }
//     };
//
//     const handleTopLevelChange = (field, value) => {
//         setEditableSale(calculateUpdatedTotals({ ...editableSale, [field]: value }));
//     };
//
//     /* ---------------- ACTIONS SUBMIT ---------------- */
//     const handleSubmit = async () => {
//         if (!customer) return alert("Please select a customer");
//         const validItems = editableSale.items.filter(i => i.product);
//         if (validItems.length === 0) return alert("Please add products");
//
//         setLoading(true);
//         try {
//             const payload = {
//                 customer: customer.value,
//                 paid_cash: editableSale.paid_cash,
//                 paid_mobile: editableSale.paid_mobile,
//                 paid_bank: editableSale.paid_bank,
//                 payment_method: editableSale.payment_method,
//                 global_discount: editableSale.global_discount,
//                 mobile_operator: editableSale.paid_mobile > 0 ? editableSale.mobile_operator : "",
//                 transaction_id: editableSale.paid_mobile > 0 ? editableSale.transaction_id : "",
//                 bank_account_no: editableSale.paid_bank > 0 ? editableSale.bank_account_no : "",
//                 items: validItems.map(item => ({
//                     product: item.product,
//                     quantity: parseInt(item.quantity, 10) || 0,
//                     unit_price: parseFloat(item.unit_price) || 0,
//                     discount_amount: parseFloat(item.discount_amount) || 0,
//                     net_total: parseFloat(item.total_price) || 0,
//                     serials: item.unique_serial ? [item.unique_serial] : []
//                 }))
//             };
//
//             const response = await api.patch(`/api/sale/sales/${purchase.id}/`, payload);
//
//             const otherInvoicesDue = customer.due_amount; // ম্যাপড করা চাইল্ড প্রপার্টি
//             onUpdated?.({
//                 ...purchase,
//                 ...response.data,
//                 previousDue: otherInvoicesDue
//             });
//             onClose();
//         } catch (err) {
//             console.error(err);
//             alert(err.response?.data?.error || "Update failed.");
//         } finally { setLoading(false); }
//     };
//
//     /* ---------------- DUES CALCULATION DISPLAY ---------------- */
//     const otherInvoicesDue = customer?.due_amount || 0;
//     const currentInvoiceDue = (Number(editableSale.net_total) || 0) - (Number(editableSale.paid_amount) || 0);
//     const totalCustomerDue = otherInvoicesDue + currentInvoiceDue;
//
//     return (
//         <BaseModal
//             isOpen={open}
//             onClose={onClose}
//             title={`Edit Sale Invoice #${editableSale.invoice_no}`}
//             size="2xl" // ২xl আপনার ফাইলের নিয়মানুযায়ী max-w-6xl লোড নিবে
//             // variant="clean"
//             icon={<ShoppingCart className="text-white" />}
//             showFooter={true}
//             onSubmit={handleSubmit}
//             submitText="Update Invoice"
//             isLoading={loading}
//         >
//             <div className="space-y-6">
//                 {/* Editable Customer Account Banner */}
//                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                     <div className="w-full md:w-1/2">
//                         <label className="block text-sm font-semibold text-blue-900 mb-2">Customer Adjustment *</label>
//                         <AsyncSelect
//                             cacheOptions defaultOptions
//                             loadOptions={loadCustomerOptions}
//                             value={customer}
//                             onChange={setCustomer}
//                             placeholder="Change Customer..."
//                             menuPortalTarget={document.body}
//                             styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
//                         />
//                     </div>
//                     <div className="bg-white px-4 py-2 rounded-md border border-blue-200 shadow-sm min-w-[150px]">
//                         <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Other Invoices Due</p>
//                         <p className="text-xl font-black text-red-600">৳{otherInvoicesDue.toFixed(2)}</p>
//                     </div>
//                 </div>
//
//                 {/* Main Dynamic Product Entry Sheet */}
//                 <div className="space-y-4">
//                     <div className="hidden lg:grid grid-cols-12 gap-4 px-2 text-sm font-bold text-gray-600 uppercase tracking-wider">
//                         <div className="col-span-2">Serial Scan</div>
//                         <div className="col-span-3">Product / Item</div>
//                         <div className="col-span-1 text-right">Price</div>
//                         <div className="col-span-1 text-center">Qty</div>
//                         <div className="col-span-2 text-center">Discount</div>
//                         <div className="col-span-2 text-right">Total</div>
//                         <div className="col-span-1 text-center">Action</div>
//                     </div>
//
//                     <div className="space-y-3">
//                         {editableSale.items.map((item, index) => (
//                             <div key={index} className="lg:grid lg:grid-cols-12 gap-4 bg-white p-3 border rounded-lg shadow-sm items-center">
//                                 {/* Barcode Serial Controller */}
//                                 <div className="col-span-2">
//                                     <input
//                                         type="text" placeholder="Serial..."
//                                         className={`w-full border p-2 rounded text-sm font-mono outline-none ${item.error_msg ? 'border-red-500' : 'focus:border-blue-500'}`}
//                                         value={item.unique_serial}
//                                         onChange={(e) => {
//                                             updateItem(index, { unique_serial: e.target.value });
//                                             if (e.target.value.length >= 3) handleSerialVerify(e.target.value, index);
//                                         }}
//                                     />
//                                     {item.error_msg && <p className="text-red-500 text-[10px] mt-1 font-semibold">{item.error_msg}</p>}
//                                     {item.success_msg && <p className="text-green-600 text-[10px] mt-1 font-semibold">{item.success_msg}</p>}
//                                 </div>
//
//                                 {/* Async Select Option Appender */}
//                                 <div className="col-span-3">
//                                     <AsyncSelect
//                                         loadOptions={loadProductOptions} defaultOptions={false}
//                                         onChange={(opt) => selectProduct(opt, index)}
//                                         value={item.product ? { value: item.product, label: item.product_name } : null}
//                                         placeholder="Find product..."
//                                         isDisabled={item.is_unique}
//                                         menuPortalTarget={document.body}
//                                         styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
//                                     />
//                                     {item.product && !item.is_unique && <p className="text-blue-500 text-[10px] mt-1">Stock: {item.stock}</p>}
//                                 </div>
//
//                                 {/* Price Field */}
//                                 <div className="col-span-1">
//                                     <input className="w-full border p-2 rounded bg-gray-50 text-right font-mono text-sm" value={item.unit_price} disabled />
//                                 </div>
//
//                                 {/* Qty Multiplier Field */}
//                                 <div className="col-span-1">
//                                     <input
//                                         className={`w-full border p-2 rounded text-center font-bold ${item.is_unique ? 'bg-yellow-50 cursor-not-allowed' : 'bg-white'}`}
//                                         type="number" value={item.quantity} min="1"
//                                         disabled={item.is_unique}
//                                         onChange={(e) => updateQty(index, Number(e.target.value))}
//                                     />
//                                 </div>
//
//                                 {/* Discount Logic Field */}
//                                 <div className="col-span-2 flex items-center gap-1">
//                                     <select className="border p-2 rounded text-xs bg-gray-50 outline-none" value={item.discount_type} onChange={(e) => updateItem(index, { discount_type: e.target.value })}>
//                                         <option value="fixed">৳</option>
//                                         <option value="percent">%</option>
//                                     </select>
//                                     <input type="number" className="w-full border p-2 rounded text-right text-sm outline-none focus:border-blue-500" value={item.discount_value || ""} onChange={(e) => updateItem(index, { discount_value: Number(e.target.value) })} />
//                                 </div>
//
//                                 {/* Item Wise Real Time Total Price */}
//                                 <div className="col-span-2 text-right px-2">
//                                     <span className="font-bold font-mono text-blue-700 text-lg">৳{item.total_price.toFixed(2)}</span>
//                                     {item.discount_amount > 0 && <p className="text-[10px] text-green-600 font-bold">Saved: ৳{item.discount_amount.toFixed(2)}</p>}
//                                 </div>
//
//                                 {/* Row Clean / Trash Trigger */}
//                                 <div className="col-span-1 flex justify-center">
//                                     <button type="button" onClick={() => removeRow(index)} className="text-red-400 hover:text-red-600 p-2 text-2xl">×</button>
//                                 </div>
//                             </div>
//                         ))}
//
//                         {/* New Core Action Button To Append Empty Invoice Rows */}
//                         <button type="button" onClick={addRow} className="flex items-center gap-2 text-blue-600 font-bold px-4 py-2 border-2 border-dashed border-blue-200 rounded-lg hover:bg-blue-50 transition-colors w-full justify-center">
//                             + Add New Product to this Invoice
//                         </button>
//                     </div>
//                 </div>
//
//                 {/* Bottom Core Dashboard Grid Section */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t">
//                     <div className="space-y-4">
//                         {/* Multi-Channel Balance Collectors Framework */}
//                         <div className="bg-gray-50 p-4 rounded-xl border space-y-4">
//                             <label className="block text-sm font-semibold text-gray-700">Collection Adjustment Breakdown</label>
//                             <div className="grid grid-cols-3 gap-4">
//                                 <div><label className="text-[10px] uppercase font-bold text-gray-500">Cash</label><input type="number" className="w-full border p-2 rounded-lg font-bold" value={editableSale.paid_cash} onChange={(e) => handleTopLevelChange("paid_cash", e.target.value)} /></div>
//                                 <div><label className="text-[10px] uppercase font-bold text-gray-500">Mobile</label><input type="number" className="w-full border p-2 rounded-lg font-bold" value={editableSale.paid_mobile} onChange={(e) => handleTopLevelChange("paid_mobile", e.target.value)} /></div>
//                                 <div><label className="text-[10px] uppercase font-bold text-gray-500">Bank</label><input type="number" className="w-full border p-2 rounded-lg font-bold" value={editableSale.paid_bank} onChange={(e) => handleTopLevelChange("paid_bank", e.target.value)} /></div>
//                             </div>
//
//                             {/* Digital Gateways Metadata */}
//                             {Number(editableSale.paid_mobile) > 0 && (
//                                 <div className="grid grid-cols-2 gap-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
//                                     <div>
//                                         <label className="text-[10px] uppercase font-bold text-purple-700">Mobile Operator</label>
//                                         <select className="w-full border p-2 rounded-lg bg-white" value={editableSale.mobile_operator} onChange={(e) => handleTopLevelChange("mobile_operator", e.target.value)}>
//                                             <option value="">Select</option>
//                                             <option value="bkash">bKash</option>
//                                             <option value="nagad">Nagad</option>
//                                             <option value="rocket">Rocket</option>
//                                         </select>
//                                     </div>
//                                     <div><label className="text-[10px] uppercase font-bold text-purple-700">Trx ID</label><input className="w-full border p-2 rounded-lg" value={editableSale.transaction_id} onChange={(e) => handleTopLevelChange("transaction_id", e.target.value)} /></div>
//                                 </div>
//                             )}
//
//                             {/* Bank Details Collector */}
//                             {Number(editableSale.paid_bank) > 0 && (
//                                 <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
//                                     <label className="text-[10px] uppercase font-bold text-blue-700">Bank A/C Number</label>
//                                     <input className="w-full border p-2 rounded-lg" value={editableSale.bank_account_no} onChange={(e) => handleTopLevelChange("bank_account_no", e.target.value)} />
//                                 </div>
//                             )}
//                         </div>
//
//                         {/* Invoice Overall Flat Discount Box */}
//                         <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 space-y-2">
//                             <label className="block text-sm font-semibold text-emerald-900 flex items-center gap-2">
//                                 <Tag size={14} /> Global Discount Adjust (Flat ৳)
//                             </label>
//                             <input type="number" step="0.01" className="w-full border border-emerald-100 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-bold" placeholder="0.00" value={editableSale.global_discount} onChange={(e) => handleTopLevelChange("global_discount", e.target.value)} />
//                         </div>
//                     </div>
//
//                     {/* Branded Dark Matrix Board Terminal */}
//                     <div className="bg-gray-900 text-white p-6 rounded-2xl space-y-4 shadow-xl">
//                         <div className="space-y-2 text-sm border-b border-gray-800 pb-3">
//                             <div className="flex justify-between"><span className="text-gray-500 font-medium">Items Subtotal</span><span className="font-mono font-bold">৳{(Number(editableSale.subtotal) || 0).toFixed(2)}</span></div>
//                             <div className="flex justify-between text-green-400"><span>Adjusted Discount</span><span className="font-mono font-bold">- ৳{(Number(editableSale.total_discount) || 0).toFixed(2)}</span></div>
//                             <div className="flex justify-between text-lg pt-2 border-t border-gray-800"><span className="text-gray-400 font-bold">Net Total</span><span className="font-mono font-black text-white text-2xl">৳{(Number(editableSale.net_total) || 0).toFixed(2)}</span></div>
//                         </div>
//
//                         <div className="space-y-3 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-inner">
//                             <p className="text-xs font-bold text-blue-400 uppercase tracking-widest text-center">Payment ({editableSale.payment_method?.replace('_', ' ')})</p>
//                             <div className="flex justify-between items-center pt-2 border-t border-gray-700"><span className="text-sm font-bold text-blue-400 uppercase">Total Collected</span><span className="font-mono font-black text-white text-xl">৳{(Number(editableSale.paid_amount) || 0).toFixed(2)}</span></div>
//                         </div>
//
//                         <div className="grid grid-cols-2 gap-4 pt-2">
//                             <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-xl text-center"><p className="text-[10px] text-red-500 font-bold uppercase mb-1">Invoice Due</p><p className="text-xl font-black text-red-500">৳{currentInvoiceDue.toFixed(2)}</p></div>
//                             <div className="p-3 bg-blue-900/20 border border-blue-900/30 rounded-xl text-center"><p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Total Customer Balance</p><p className="text-xl font-black text-blue-400">৳{totalCustomerDue.toFixed(2)}</p></div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </BaseModal>
//     );
// };
//
// export default EditSaleModal;


import React, {useState, useEffect, useRef} from "react";
import AsyncSelect from "react-select/async";
import api from '../../../context_or_provider/pos/posApi';
import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
import {posCustomerAPI} from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";
import BASE_URL_of_POS from "../../../posConfig";

import {Trash2, ShoppingCart, User, Package, Banknote, Tag} from 'lucide-react';
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
 * EditSaleModal - Updated with:
 *  - Customer editing
 *  - Product appending
 *  - Bulk stock fetch (no N+1)
 *  - Payment Adjustment Warning Panel
 *  - Customer Balance Impact Preview
 *  - BaseModal layout integration
 */
const EditSaleModal = ({open, onClose, purchase, onUpdated}) => {
    /* ---------------- STATE ---------------- */
    const [customer, setCustomer] = useState(null);
    const [editableSale, setEditableSale] = useState(null);
    const [loading, setLoading] = useState(false);
    const [removedItems, setRemovedItems] = useState([]);

    /* ═══════════════════════════════════════════════════════
       INITIALIZE SALE — async with bulk stock fetch
       ═══════════════════════════════════════════════════════ */
    useEffect(() => {
        if (!purchase) return;

        const initializeSale = async () => {
            // STEP 1: Customer setup
            setCustomer({
                value: purchase.customer,
                label: purchase.customer_name || "Walk-in Customer",
                due_amount: Number(purchase.customer_due_amount || 0) - Number(purchase.due_amount || 0)
            });

            // STEP 2: Unique product IDs
            const rawItems = purchase.items || [];
            const uniqueProductIds = [
                ...new Set(rawItems.map(i => i.product).filter(Boolean))
            ];

            // STEP 3: Bulk fetch — only invoice's products
            let stockMap = {};
            if (uniqueProductIds.length > 0) {
                try {
                    const res = await posProductAPI.getByIds(uniqueProductIds);
                    (res.data.results || []).forEach(p => {
                        stockMap[p.id] = p.stock ?? 0;
                    });
                } catch (err) {
                    console.error("Stock prefetch failed:", err);
                }
            }

            // STEP 4: Items mapping with actual stock
            const mappedItems = rawItems.map(item => {
                const uPrice = Number(item.unit_price || 0);
                const qty = Number(item.quantity || 1);
                const discAmount = Number(item.discount_amount || 0);
                const baseTotal = uPrice * qty;

                return {
                    id: item.id,
                    product: item.product,
                    product_name: item.product_name || "",
                    unit_price: uPrice,
                    quantity: qty,
                    _original_quantity: qty,
                    discount_type: "fixed",
                    discount_value: discAmount / qty,
                    discount_amount: discAmount,
                    total_price: Math.max(0, baseTotal - discAmount),
                    unique_serial: item.serials && item.serials.length > 0 ? item.serials[0] : (item.unique_serial || ""),
                    serials: item.serials || [],
                    is_unique: !!(item.serials && item.serials.length > 0) || !!item.unique_serial,
                    stock: stockMap[item.product] ?? 0,
                    success_msg: item.serials && item.serials.length > 0 ? "Scanned" : "",
                    error_msg: ""
                };
            });

            // STEP 5: Sale state — with ORIGINAL values preserved
            const mappedSale = {
                ...purchase,
                items: mappedItems.length > 0 ? mappedItems : [{...emptyItem}],
                paid_cash: Number(purchase.paid_cash || 0),
                paid_mobile: Number(purchase.paid_mobile || 0),
                paid_bank: Number(purchase.paid_bank || 0),
                global_discount: Number(purchase.global_discount || purchase.globalDiscount || 0),
                mobile_operator: purchase.mobile_operator || "",
                transaction_id: purchase.transaction_id || "",
                bank_account_no: purchase.bank_account_no || "",

                // 🆕 Original values — কখনো পরিবর্তন হবে না
                _original_paid_amount: Number(
                    purchase.paid_amount ||
                    (Number(purchase.paid_cash || 0) +
                        Number(purchase.paid_mobile || 0) +
                        Number(purchase.paid_bank || 0))
                ),
                _original_net_total: Number(purchase.net_total || purchase.total_amount || 0),
                _original_due_amount: Number(purchase.due_amount || 0),
            };

            setEditableSale(JSON.parse(JSON.stringify(mappedSale)));
            setRemovedItems([]);
        };

        initializeSale();
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
        if (!inputValue || inputValue.trim().length < 1) return [];
        try {
            const res = await posProductAPI.search(inputValue, {page_size: 20});
            return (res.data.results || []).map((p) => ({
                value: p.id,
                label: `${p.name} (${p.product_code})`,
                unit_price: Number(p.selling_price || p.sale_price || 0),
                product_name: p.name,
                stock: p.stock || 0,
                has_expiry: p.has_expiry,
                tracking_mode: p.instance_tracking_mode,
            }));
        } catch (err) {
            console.error("Error loading product options:", err);
            return [];
        }
    };

    /* ---------------- DYNAMIC CALCULATIONS ---------------- */
    const calculateUpdatedTotals = (currentSale) => {
        let subtotal = 0;
        let itemwise_total_discount = 0;

        const updatedItems = currentSale.items.map(item => {
            const qty = Number(item.quantity) || 0;
            const baseTotal = item.unit_price * qty;
            let discount = 0;
            if (item.discount_type === "percent") {
                discount = (baseTotal * item.discount_value) / 100;
            } else {
                discount = item.discount_value;
            }
            const total_price = Math.max(0, baseTotal - discount);

            subtotal += total_price;
            itemwise_total_discount += discount;

            return {...item, total_price, discount_amount: discount};
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
        updatedItems[index] = {...updatedItems[index], ...updates};
        setEditableSale(calculateUpdatedTotals({...editableSale, items: updatedItems}));
    };

    const isProductDuplicate = (productId, currentIndex) => {
        return editableSale.items.some((item, index) => index !== currentIndex && item.product === productId && !item.is_unique);
    };

    const isSerialDuplicate = (serial, currentIndex) => {
        return editableSale.items.some((item, index) => index !== currentIndex && item.unique_serial === serial);
    };

    const selectProduct = (option, index) => {
        const isUniqueProduct = option.tracking_mode === 'serial';
        if (!isUniqueProduct && isProductDuplicate(option.value, index)) {
            updateItem(index, {error_msg: "Product already added!"});
            return;
        }
        updateItem(index, {
            product: option.value,
            product_name: option.product_name,
            unit_price: option.unit_price,
            quantity: 1,
            stock: option.stock,
            is_unique: isUniqueProduct,
            unique_serial: "",
            error_msg: "",
            success_msg: ""
        });
    };

    const handleSerialVerify = async (serial, index) => {
        if (!serial || serial.length < 3) return;
        if (isSerialDuplicate(serial, index)) {
            updateItem(index, {error_msg: "Already scanned!"});
            return;
        }
        try {
            const response = await fetch(`${BASE_URL_of_POS}/api/bar-qr/verify/verify/?serial=${serial}`);
            const data = await response.json();
            const isBelongingToCurrentSale = data.status_code === 'sold' && data.sale_info?.invoice_no === editableSale.invoice_no;

            if (data.valid && (data.status_code === 'in_stock' || isBelongingToCurrentSale)) {
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
                updateItem(index, {
                    is_unique: false,
                    error_msg: !data.valid ? "Invalid" : "Not in stock",
                    success_msg: ""
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateQty = (index, rawValue) => {
        const item = editableSale.items[index];
        if (item.is_unique) return;

        if (rawValue === "" || rawValue === null || rawValue === undefined) {
            updateItem(index, {quantity: "", error_msg: ""});
            return;
        }

        const qty = Number(rawValue);
        const availableStock = (Number(item.stock) || 0) + (Number(item._original_quantity) || 0);
        let finalQty = qty;
        let error_msg = "";
        if (availableStock > 0 && qty > availableStock) {
            finalQty = availableStock;
            error_msg = `Only ${availableStock} available!`;
        } else if (qty < 0) {
            finalQty = 1;
        }
        updateItem(index, {quantity: finalQty, error_msg});
    };

    const addRow = () => {
        setEditableSale(prev => ({...prev, items: [...prev.items, {...emptyItem}]}));
    };

    const removeRow = (index) => {
        const item = editableSale.items[index];
        // If item has a product (real row), soft-delete: move to removedItems
        if (item.product) {
            setRemovedItems(prev => [...prev, item]);
        }
        if (editableSale.items.length === 1) {
            setEditableSale(prev => ({...prev, items: [{...emptyItem}]}));
        } else {
            const filtered = editableSale.items.filter((_, i) => i !== index);
            setEditableSale(calculateUpdatedTotals({...editableSale, items: filtered}));
        }
    };

    const restoreItem = (removedIndex) => {
        const item = removedItems[removedIndex];
        // Remove from removedItems
        setRemovedItems(prev => prev.filter((_, i) => i !== removedIndex));
        // If current last row is an empty placeholder, replace it; else append
        const items = editableSale.items;
        const lastItem = items[items.length - 1];
        const isLastEmpty = !lastItem.product;
        const newItems = isLastEmpty
            ? [...items.slice(0, -1), item]
            : [...items, item];
        setEditableSale(calculateUpdatedTotals({...editableSale, items: newItems}));
    };

    const handleTopLevelChange = (field, value) => {
        setEditableSale(calculateUpdatedTotals({...editableSale, [field]: value}));
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
                    ...(item.id ? { id: item.id } : {}),
                    product: item.product,
                    quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
                    unit_price: parseFloat(item.unit_price) || 0,
                    discount_amount: parseFloat(item.discount_amount) || 0,
                    net_total: parseFloat(item.total_price) || 0,
                    serials: item.unique_serial ? [item.unique_serial] : (item.serials || [])
                }))
            };

            const response = await api.patch(`/api/sale/sales/${purchase.id}/`, payload);

            const otherInvoicesDue = customer.due_amount;
            onUpdated?.({
                ...purchase,
                ...response.data,
                previousDue: otherInvoicesDue
            });
            onClose();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Update failed.");
        } finally {
            setLoading(false);
        }
    };

    /* ═══════════════════════════════════════════════════════
       DUES & COMPARISON CALCULATIONS
       ═══════════════════════════════════════════════════════ */
    const otherInvoicesDue = customer?.due_amount || 0;
    const currentInvoiceDue = (Number(editableSale.net_total) || 0) - (Number(editableSale.paid_amount) || 0);
    const totalCustomerDue = otherInvoicesDue + currentInvoiceDue;

    // 🆕 Original vs New Comparison
    const originalPaid = Number(editableSale._original_paid_amount || 0);
    const newPaid = Number(editableSale.paid_amount || 0);
    const paymentDiff = newPaid - originalPaid;

    const originalDue = Number(editableSale._original_due_amount || 0);
    const originalNetTotal = Number(editableSale._original_net_total || 0);

    const refundAmount = paymentDiff < 0 ? Math.abs(paymentDiff) : 0;
    const additionalCollect = paymentDiff > 0 ? paymentDiff : 0;

    return (
        <BaseModal
            isOpen={open}
            onClose={onClose}
            title={`Edit Sale Invoice #${editableSale.invoice_no}`}
            size="2xl"
            icon={<ShoppingCart className="text-white"/>}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Update Invoice"
            isLoading={loading}
        >
            <div className="space-y-6">
                {/* Editable Customer Account Banner */}
                <div
                    className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-semibold text-blue-900 mb-2">Customer Adjustment *</label>
                        <AsyncSelect
                            cacheOptions defaultOptions
                            loadOptions={loadCustomerOptions}
                            value={customer}
                            onChange={setCustomer}
                            placeholder="Change Customer..."
                            menuPortalTarget={document.body}
                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        />
                    </div>
                    <div className="bg-white px-4 py-2 rounded-md border border-blue-200 shadow-sm min-w-[150px]">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Originally Collected</p>
                        <p className="text-xl font-black text-gray-700">
                            ৳{originalPaid.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-md border border-blue-200 shadow-sm min-w-[150px]">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Other Invoices Due</p>
                        <p className={`text-xl font-black ${otherInvoicesDue < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            ৳{otherInvoicesDue.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Main Dynamic Product Entry Sheet */}
                <div className="space-y-4">
                    <div
                        className="hidden lg:grid grid-cols-12 gap-4 px-2 text-sm font-bold text-gray-600 uppercase tracking-wider">
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
                            <div key={index}
                                 className="lg:grid lg:grid-cols-12 gap-4 bg-white p-3 border rounded-lg shadow-sm items-center">
                                {/* Barcode Serial Controller */}
                                <div className="col-span-2">
                                    <input
                                        type="text" placeholder="Serial..."
                                        className={`w-full border p-2 rounded text-sm font-mono outline-none ${item.error_msg ? 'border-red-500' : 'focus:border-blue-500'}`}
                                        value={item.unique_serial}
                                        onChange={(e) => {
                                            updateItem(index, {unique_serial: e.target.value});
                                            if (e.target.value.length >= 3) handleSerialVerify(e.target.value, index);
                                        }}
                                    />
                                    {item.error_msg &&
                                        <p className="text-red-500 text-[10px] mt-1 font-semibold">{item.error_msg}</p>}
                                    {item.success_msg &&
                                        <p className="text-green-600 text-[10px] mt-1 font-semibold">{item.success_msg}</p>}
                                </div>

                                {/* Async Select Option Appender */}
                                <div className="col-span-3">
                                    <AsyncSelect
                                        loadOptions={loadProductOptions} defaultOptions={false}
                                        onChange={(opt) => selectProduct(opt, index)}
                                        value={item.product ? {value: item.product, label: item.product_name} : null}
                                        placeholder="Find product..."
                                        isDisabled={item.is_unique}
                                        menuPortalTarget={document.body}
                                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                    />
                                    {item.product && !item.is_unique && (
                                        <p className="text-blue-500 text-[10px] mt-1">Stock: {item.stock}</p>
                                    )}
                                </div>

                                {/* Price Field */}
                                <div className="col-span-1">
                                    <input className="w-full border p-2 rounded bg-gray-50 text-right font-mono text-sm"
                                           value={item.unit_price} disabled/>
                                </div>

                                {/* Qty Multiplier Field */}
                                <div className="col-span-1">
                                    <input
                                        className={`w-full border p-2 rounded text-center font-bold ${item.is_unique ? 'bg-yellow-50 cursor-not-allowed' : 'bg-white'}`}
                                        type="number"
                                        value={item.quantity === "" ? "" : item.quantity}
                                        min="1"
                                        disabled={item.is_unique}
                                        onChange={(e) => updateQty(index, e.target.value)}
                                        onBlur={() => {
                                            if (item.quantity === "" || Number(item.quantity) < 1) {
                                                updateQty(index, 1);
                                            }
                                        }}
                                    />
                                    {/* Qty Diff Badge */}
                                    {item._original_quantity != null && Number(item.quantity) !== item._original_quantity && item.quantity !== "" && (() => {
                                        const diff = Number(item.quantity) - item._original_quantity;
                                        return (
                                            <p className={`text-[10px] font-black text-center mt-0.5 ${diff > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                {item._original_quantity} {diff > 0 ? `+${diff}` : diff}
                                            </p>
                                        );
                                    })()}
                                </div>

                                {/* Discount Logic Field */}
                                <div className="col-span-2 flex items-center gap-1">
                                    <select className="border p-2 rounded text-xs bg-gray-50 outline-none"
                                            value={item.discount_type}
                                            onChange={(e) => updateItem(index, {discount_type: e.target.value})}>
                                        <option value="fixed">৳</option>
                                        <option value="percent">%</option>
                                    </select>
                                    <input type="number"
                                           className="w-full border p-2 rounded text-right text-sm outline-none focus:border-blue-500"
                                           value={item.discount_value || ""}
                                           onChange={(e) => updateItem(index, {discount_value: Number(e.target.value)})}/>
                                </div>

                                {/* Item Wise Real Time Total Price */}
                                <div className="col-span-2 text-right px-2">
                                    <span
                                        className="font-bold font-mono text-blue-700 text-lg">৳{item.total_price.toFixed(2)}</span>
                                    {item.discount_amount > 0 &&
                                        <p className="text-[10px] text-green-600 font-bold">Saved:
                                            ৳{item.discount_amount.toFixed(2)}</p>}
                                </div>

                                {/* Row Clean / Trash Trigger */}
                                <div className="col-span-1 flex justify-center">
                                    <button type="button" onClick={() => removeRow(index)}
                                            className="text-red-400 hover:text-red-600 p-2 text-2xl">×
                                    </button>
                                </div>
                            </div>
                        ))}


                        {/* New Core Action Button To Append Empty Invoice Rows */}
                        <button type="button" onClick={addRow}
                                className="flex items-center gap-2 text-blue-600 font-bold px-4 py-2 border-2 border-dashed border-blue-200 rounded-lg hover:bg-blue-50 transition-colors w-full justify-center">
                            + Add New Product to this Invoice
                        </button>

                        {/* Removed Items — Soft Delete Tray */}
                        {removedItems.length > 0 && (
                            <div className="border border-dashed border-red-200 rounded-lg bg-red-50/40 p-3 space-y-2">
                                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
                                    ✕ Removed Items — click Restore to bring back
                                </p>
                                {removedItems.map((ri, ri_index) => (
                                    <div key={ri_index}
                                         className="flex items-center justify-between bg-white border border-red-100 rounded-lg px-3 py-2 gap-2">
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

                {/* Bottom Core Dashboard Grid Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t">
                    <div className="space-y-4">
                        {/* Multi-Channel Balance Collectors Framework */}
                        <div className="bg-gray-50 p-4 rounded-xl border space-y-4">
                            <label className="block text-sm font-semibold text-gray-700">Collection Adjustment
                                Breakdown</label>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500">Cash</label>
                                    <input type="number" className="w-full border p-2 rounded-lg font-bold"
                                           value={editableSale.paid_cash}
                                           onChange={(e) => handleTopLevelChange("paid_cash", e.target.value)}/>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500">Mobile</label>
                                    <input type="number" className="w-full border p-2 rounded-lg font-bold"
                                           value={editableSale.paid_mobile}
                                           onChange={(e) => handleTopLevelChange("paid_mobile", e.target.value)}/>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500">Bank</label>
                                    <input type="number" className="w-full border p-2 rounded-lg font-bold"
                                           value={editableSale.paid_bank}
                                           onChange={(e) => handleTopLevelChange("paid_bank", e.target.value)}/>
                                </div>
                            </div>

                            {/* Digital Gateways Metadata */}
                            {Number(editableSale.paid_mobile) > 0 && (
                                <div
                                    className="grid grid-cols-2 gap-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-purple-700">Mobile
                                            Operator</label>
                                        <select className="w-full border p-2 rounded-lg bg-white"
                                                value={editableSale.mobile_operator}
                                                onChange={(e) => handleTopLevelChange("mobile_operator", e.target.value)}>
                                            <option value="">Select</option>
                                            <option value="bkash">bKash</option>
                                            <option value="nagad">Nagad</option>
                                            <option value="rocket">Rocket</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-purple-700">Trx
                                            ID</label>
                                        <input className="w-full border p-2 rounded-lg"
                                               value={editableSale.transaction_id}
                                               onChange={(e) => handleTopLevelChange("transaction_id", e.target.value)}/>
                                    </div>
                                </div>
                            )}

                            {/* Bank Details Collector */}
                            {Number(editableSale.paid_bank) > 0 && (
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <label className="text-[10px] uppercase font-bold text-blue-700">Bank A/C
                                        Number</label>
                                    <input className="w-full border p-2 rounded-lg" value={editableSale.bank_account_no}
                                           onChange={(e) => handleTopLevelChange("bank_account_no", e.target.value)}/>
                                </div>
                            )}
                        </div>

                        {/* Invoice Overall Flat Discount Box */}
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 space-y-2">
                            <label className="block text-sm font-semibold text-emerald-900 flex items-center gap-2">
                                <Tag size={14}/> Global Discount Adjust (Flat ৳)
                            </label>
                            <input type="number" step="0.01"
                                   className="w-full border border-emerald-100 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                                   placeholder="0.00" value={editableSale.global_discount}
                                   onChange={(e) => handleTopLevelChange("global_discount", e.target.value)}/>
                        </div>

                        {/* ═══════════════════════════════════════════════════════ */}
                        {/* 🆕 Payment Adjustment Warning Panel                    */}
                        {/* ═══════════════════════════════════════════════════════ */}
                        {(paymentDiff !== 0 || originalDue !== currentInvoiceDue) && (
                            <div className={`p-4 rounded-xl border-2 space-y-3 ${
                                paymentDiff < 0
                                    ? 'bg-red-50 border-red-300'
                                    : paymentDiff > 0
                                        ? 'bg-emerald-50 border-emerald-300'
                                        : 'bg-amber-50 border-amber-300'
                            }`}>
                                <div className="flex items-center gap-2">
                                    {paymentDiff < 0 ? (
                                        <>
                                            <span className="text-red-700 text-lg">⚠️</span>
                                            <h4 className="font-bold text-red-800">Payment Adjusted Downward</h4>
                                        </>
                                    ) : paymentDiff > 0 ? (
                                        <>
                                            <span className="text-emerald-700 text-lg">✅</span>
                                            <h4 className="font-bold text-emerald-800">Additional Payment Collected</h4>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-amber-700 text-lg">ℹ️</span>
                                            <h4 className="font-bold text-amber-800">Invoice Amount Changed</h4>
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
                                            paymentDiff < 0 ? 'text-red-600' : paymentDiff > 0 ? 'text-emerald-600' : 'text-gray-800'
                                        }`}>৳{newPaid.toFixed(2)}</p>
                                    </div>
                                </div>

                                {paymentDiff !== 0 && (
                                    <div className={`p-3 rounded-lg font-bold text-center border-2 ${
                                        paymentDiff < 0
                                            ? 'bg-red-100 border-red-300 text-red-800'
                                            : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                                    }`}>
                                        {paymentDiff < 0 ? (
                                            <div>
                                                <p className="text-xs uppercase tracking-wider opacity-80">Refund to
                                                    Customer</p>
                                                <p className="text-2xl font-black mt-1">৳{refundAmount.toFixed(2)}</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-xs uppercase tracking-wider opacity-80">Additional to
                                                    Collect</p>
                                                <p className="text-2xl font-black mt-1">৳{additionalCollect.toFixed(2)}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Due comparison */}
                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-current/20">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Original
                                            Due</p>
                                        <p className="text-base font-bold text-gray-700">৳{originalDue.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">New Due</p>
                                        <p className={`text-base font-bold ${
                                            currentInvoiceDue > originalDue ? 'text-red-600' :
                                                currentInvoiceDue < originalDue ? 'text-emerald-600' : 'text-gray-700'
                                        }`}>৳{currentInvoiceDue.toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* Net total change */}
                                <div className="pt-2 border-t border-current/20">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Original Total</span>
                                        <span className="font-bold">৳{originalNetTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs mt-1">
                                        <span className="text-gray-600">New Total</span>
                                        <span
                                            className="font-bold">৳{(Number(editableSale.net_total) || 0).toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* ═══════════════════════════════════════════════════════ */}
                                {/* 🆕 Customer Balance Impact Preview                     */}
                                {/* ═══════════════════════════════════════════════════════ */}
                                <div className="pt-3 border-t border-current/20 space-y-2">
                                    <p className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">
                                        Customer Balance Impact
                                    </p>

                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div className="bg-white/70 p-2 rounded-lg border border-gray-200">
                                            <p className="text-[9px] uppercase font-bold text-gray-500">Old Balance</p>
                                            <p className={`text-sm font-black ${
                                                otherInvoicesDue < 0 ? 'text-emerald-600' : 'text-red-600'
                                            }`}>
                                                ৳{otherInvoicesDue.toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="bg-white/70 p-2 rounded-lg border border-gray-200">
                                            <p className="text-[9px] uppercase font-bold text-gray-500">This Invoice
                                                Due</p>
                                            <p className={`text-sm font-black ${
                                                currentInvoiceDue > 0 ? 'text-red-600' : 'text-gray-700'
                                            }`}>
                                                ৳{currentInvoiceDue.toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="bg-white/70 p-2 rounded-lg border-2 border-blue-300">
                                            <p className="text-[9px] uppercase font-bold text-blue-700">New Balance</p>
                                            <p className={`text-sm font-black ${
                                                totalCustomerDue < 0 ? 'text-emerald-600' : 'text-red-600'
                                            }`}>
                                                ৳{totalCustomerDue.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Human-readable explanation */}
                                    <div
                                        className="text-xs bg-blue-50 border border-blue-200 p-2 rounded-lg text-blue-800 leading-relaxed">
                                        {currentInvoiceDue > 0 && otherInvoicesDue >= 0 && (
                                            <p>
                                                ℹ️ Invoice Due <strong>৳{currentInvoiceDue.toFixed(2)}</strong> will be
                                                <strong> added</strong> to customer's existing balance.
                                                New total: <strong>৳{totalCustomerDue.toFixed(2)}</strong>
                                            </p>
                                        )}
                                        {currentInvoiceDue > 0 && otherInvoicesDue < 0 && (
                                            <p>
                                                ℹ️ Invoice Due <strong>৳{currentInvoiceDue.toFixed(2)}</strong> will
                                                <strong> offset</strong> customer's advance
                                                of <strong>৳{Math.abs(otherInvoicesDue).toFixed(2)}</strong>.
                                                {Math.abs(otherInvoicesDue) >= currentInvoiceDue
                                                    ? ` Remaining advance: ৳${(otherInvoicesDue + currentInvoiceDue).toFixed(2)}`
                                                    : ` Remaining due: ৳${totalCustomerDue.toFixed(2)}`
                                                }
                                            </p>
                                        )}
                                        {currentInvoiceDue < 0 && (
                                            <p>
                                                💰 Customer is overpaid
                                                by <strong>৳{Math.abs(currentInvoiceDue).toFixed(2)}</strong>.
                                                This will become customer's advance balance.
                                                New balance: <strong>৳{totalCustomerDue.toFixed(2)}</strong>
                                            </p>
                                        )}
                                        {currentInvoiceDue === 0 && (
                                            <p>
                                                ✅ This invoice is fully paid. Customer balance remains
                                                <strong> ৳{otherInvoicesDue.toFixed(2)}</strong>.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Branded Dark Matrix Board Terminal */}
                    <div className="bg-gray-900 text-white p-6 rounded-2xl space-y-4 shadow-xl">
                        <div className="space-y-2 text-sm border-b border-gray-800 pb-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Items Subtotal</span>
                                <span
                                    className="font-mono font-bold">৳{(Number(editableSale.subtotal) || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-green-400">
                                <span>Adjusted Discount</span>
                                <span
                                    className="font-mono font-bold">- ৳{(Number(editableSale.total_discount) || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg pt-2 border-t border-gray-800">
                                <span className="text-gray-400 font-bold">Net Total</span>
                                <span
                                    className="font-mono font-black text-white text-2xl">৳{(Number(editableSale.net_total) || 0).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="space-y-3 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-inner">
                            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest text-center">
                                Payment ({editableSale.payment_method?.replace('_', ' ')})
                            </p>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                                <span className="text-sm font-bold text-blue-400 uppercase">Total Collected</span>
                                <span
                                    className="font-mono font-black text-white text-xl">৳{(Number(editableSale.paid_amount) || 0).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-xl text-center">
                                <p className="text-[10px] text-red-500 font-bold uppercase mb-1">Invoice Due</p>
                                <p className={`text-xl font-black ${currentInvoiceDue < 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                                    ৳{currentInvoiceDue.toFixed(2)}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-900/20 border border-blue-900/30 rounded-xl text-center">
                                <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Total Customer
                                    Balance</p>
                                <p className={`text-xl font-black ${totalCustomerDue < 0 ? 'text-emerald-400' : 'text-blue-400'}`}>
                                    ৳{totalCustomerDue.toFixed(2)}
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

export default EditSaleModal;