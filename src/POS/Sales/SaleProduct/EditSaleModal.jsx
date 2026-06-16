import React, {useState, useEffect} from "react";
import api from '../../../context_or_provider/pos/posApi';

import { Trash2, ShoppingCart, User, Package, Wallet, Banknote, CreditCard, Tag, CheckCircle, Info } from 'lucide-react';
import SuccessModal from "./SuccessModal";
import BaseModal from "../../components/BaseModal";

/**
 * EditSaleModal - Refactored to use BaseModal and standardized backbone layout.
 */
const EditSaleModal = ({open, onClose, purchase, onUpdated}) => {
    const [editableSale, setEditableSale] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (purchase) {
            const mappedSale = {
                ...purchase,
                paid_cash: purchase.paid_cash || 0,
                paid_mobile: purchase.paid_mobile || 0,
                paid_bank: purchase.paid_bank || 0,
                global_discount: purchase.global_discount || purchase.globalDiscount || 0,
                mobile_operator: purchase.mobile_operator || "",
                transaction_id: purchase.transaction_id || "",
                bank_account_no: purchase.bank_account_no || "",
            };
            setEditableSale(JSON.parse(JSON.stringify(mappedSale)));
        }
    }, [purchase]);

    if (!open || !editableSale) return null;

    const calculateUpdatedTotals = (currentSale) => {
        let total_amount = 0;
        let itemwise_total_discount = 0;
        const updatedItems = currentSale.items.map(item => {
            const quantity = parseFloat(item.quantity) || 0;
            const unitPrice = parseFloat(item.unit_price) || 0;
            const discount_amount = parseFloat(item.discount_amount) || 0;
            const total_price = quantity * unitPrice;
            const net_total = total_price - discount_amount;
            total_amount += total_price;
            itemwise_total_discount += discount_amount;
            return { ...item, total_price: total_price.toFixed(2), net_total: net_total.toFixed(2) };
        });

        const global_discount = parseFloat(currentSale.global_discount) || 0;
        const total_discount = itemwise_total_discount + global_discount;
        const net_total = total_amount - total_discount;
        const subtotal = total_amount - itemwise_total_discount;
        const paid_cash = parseFloat(currentSale.paid_cash) || 0;
        const paid_mobile = parseFloat(currentSale.paid_mobile) || 0;
        const paid_bank = parseFloat(currentSale.paid_bank) || 0;
        const totalPaid = paid_cash + paid_mobile + paid_bank;
        const due_amount = net_total - totalPaid;

        let payment_method = "cash";
        const counts = [paid_cash > 0, paid_mobile > 0, paid_bank > 0].filter(Boolean).length;
        if (counts > 1) payment_method = "hybrid";
        else if (paid_mobile > 0) payment_method = "mobile_banking";
        else if (paid_bank > 0) payment_method = "bank";

        return {
            ...currentSale, items: updatedItems, total_amount: total_amount.toFixed(2), itemwise_total_discount: itemwise_total_discount.toFixed(2),
            subtotal: subtotal.toFixed(2), global_discount: global_discount.toFixed(2), total_discount: total_discount.toFixed(2),
            net_total: net_total.toFixed(2), paid_cash, paid_mobile, paid_bank, paid_amount: totalPaid, due_amount: due_amount.toFixed(2), payment_method
        };
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...editableSale.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setEditableSale(calculateUpdatedTotals({ ...editableSale, items: updatedItems }));
    };

    const handleRemoveItem = (index) => {
        const updatedItems = editableSale.items.filter((_, i) => i !== index);
        setEditableSale(calculateUpdatedTotals({ ...editableSale, items: updatedItems }));
    };

    const handleTopLevelChange = (field, value) => {
        setEditableSale(calculateUpdatedTotals({ ...editableSale, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                customer: editableSale.customer,
                paid_cash: editableSale.paid_cash,
                paid_mobile: editableSale.paid_mobile,
                paid_bank: editableSale.paid_bank,
                payment_method: editableSale.payment_method,
                global_discount: editableSale.global_discount,
                mobile_operator: editableSale.mobile_operator || "",
                transaction_id: editableSale.transaction_id || "",
                bank_account_no: editableSale.bank_account_no || "",
                items: editableSale.items.map(item => ({
                    product: item.product,
                    quantity: parseInt(item.quantity, 10) || 0,
                    unit_price: parseFloat(item.unit_price) || 0,
                    discount_amount: parseFloat(item.discount_amount) || 0,
                    net_total: parseFloat(item.net_total) || 0,
                }))
            };

            const response = await api.patch(`/api/sale/sales/${purchase.id}/`, payload);
            setInvoiceData(response.data);
            setShowSuccessModal(true);
        } catch (err) {
            console.error(err);
            alert("Update failed.");
        } finally { setLoading(false); }
    };

    const originalInvoiceDue = parseFloat(purchase?.due_amount) || 0;
    const otherInvoicesDue = (parseFloat(purchase?.customer_due_amount) || 0) - originalInvoiceDue;
    const currentInvoiceDue = (parseFloat(editableSale.net_total) || 0) - (parseFloat(editableSale.paid_amount) || 0);
    const totalCustomerDue = otherInvoicesDue + currentInvoiceDue;

    return (
        <>
            <BaseModal
                isOpen={open}
                onClose={onClose}
                title={`Edit Sale Invoice #${editableSale.invoice_no}`}
                size="xl"
                icon={<ShoppingCart className="text-white" />}
                showFooter={true}
                onSubmit={handleSubmit}
                submitText="Update Invoice"
                isLoading={loading}
            >
                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 flex justify-between items-center">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-black text-emerald-600 tracking-[0.2em] flex items-center gap-2"><User size={12} /> Customer Account</p>
                            <p className="text-xl font-black text-gray-800">{editableSale.customer_name || 'Walk-in Customer'}</p>
                        </div>
                        <div className="bg-white px-5 py-3 rounded-xl border border-emerald-200 shadow-sm text-right">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Other Due</p>
                            <p className="text-2xl font-black text-rose-600">৳{otherInvoicesDue.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
                            <Package size={14} className="text-brand-primary" /> Sale Items
                        </h3>
                        <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">Product Description</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center w-24">Qty</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right w-32">Unit Price</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right w-32">Discount</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right w-32">Total</th>
                                        <th className="px-5 py-3 w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {editableSale.items.map((item, index) => (
                                        <tr key={item.id || index} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-5 py-4 font-bold text-gray-900">{item.product_name}</td>
                                            <td className="px-5 py-4">
                                                <input type="number" className="w-full border border-gray-200 p-2 rounded-lg text-center font-black text-sm focus:border-blue-500 outline-none" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
                                            </td>
                                            <td className="px-5 py-4">
                                                <input type="number" step="0.01" className="w-full border border-gray-200 p-2 rounded-lg text-right font-bold text-sm focus:border-blue-500 outline-none" value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", e.target.value)} />
                                            </td>
                                            <td className="px-5 py-4">
                                                <input type="number" step="0.01" className="w-full border border-gray-200 p-2 rounded-lg text-right text-sm outline-none" value={item.discount_amount} onChange={(e) => handleItemChange(index, "discount_amount", e.target.value)} />
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <span className="font-black text-blue-700 text-sm">৳{parseFloat(item.net_total).toLocaleString()}</span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <button onClick={() => handleRemoveItem(index)} className="p-2 text-rose-300 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                        <div className="space-y-6">
                            {/* Payment Breakdown */}
                            <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Banknote size={14} className="text-brand-primary" /> Collection Adjustment
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Cash</label>
                                        <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-emerald-600 text-sm outline-none" value={editableSale.paid_cash} onChange={(e) => handleTopLevelChange("paid_cash", e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile</label>
                                        <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-purple-600 text-sm outline-none" value={editableSale.paid_mobile} onChange={(e) => handleTopLevelChange("paid_mobile", e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank</label>
                                        <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-blue-600 text-sm outline-none" value={editableSale.paid_bank} onChange={(e) => handleTopLevelChange("paid_bank", e.target.value)} />
                                    </div>
                                </div>

                                {parseFloat(editableSale.paid_mobile) > 0 && (
                                    <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-purple-400 uppercase">Operator</label>
                                            <select className="w-full border border-purple-100 p-2 rounded-lg bg-white text-xs font-bold outline-none" value={editableSale.mobile_operator} onChange={(e) => handleTopLevelChange("mobile_operator", e.target.value)}>
                                                <option value="">Select Operator</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="rocket">Rocket</option><option value="upay">Upay</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-purple-400 uppercase">TxID</label>
                                            <input className="w-full border border-purple-100 p-2 rounded-lg text-xs font-bold outline-none" value={editableSale.transaction_id} onChange={(e) => handleTopLevelChange("transaction_id", e.target.value)} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-emerald-50/50 p-6 rounded-[2.5rem] border border-emerald-100 space-y-4">
                                <label className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Tag size={14} /> Global Discount Adjust
                                </label>
                                <input type="number" step="0.01" className="w-full border border-emerald-100 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-200 font-black text-emerald-700 text-lg shadow-inner" placeholder="0.00" value={editableSale.global_discount} onChange={(e) => handleTopLevelChange("global_discount", e.target.value)} />
                            </div>
                        </div>

                        {/* Totals Summary */}
                        <div className="bg-gray-900 text-white p-8 rounded-[3rem] space-y-6 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-800 pb-4">
                                    <span>Subtotal</span> <span className="font-mono text-base">৳{parseFloat(editableSale.subtotal).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-800 pb-4">
                                    <span>Discount</span> <span className="font-mono text-base">- ৳{parseFloat(editableSale.total_discount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-gray-400 font-black uppercase tracking-[0.3em]">Net Payable</span>
                                    <span className="font-mono font-black text-4xl text-white">৳{parseFloat(editableSale.net_total).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4 relative z-10">
                                <div className="flex justify-between items-center text-blue-400 font-black uppercase text-[10px] tracking-widest">
                                    <span>Total Collected</span> <span className="font-mono text-2xl text-white">৳{editableSale.paid_amount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                    <div className="space-y-1">
                                        <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em]">Invoice Due</p>
                                        <p className="text-xl font-black text-rose-500 font-mono">৳{currentInvoiceDue.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.2em]">Total Balance</p>
                                        <p className="text-xl font-black text-blue-400 font-mono">৳{totalCustomerDue.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseModal>

            {showSuccessModal && (
                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => {
                        setShowSuccessModal(false);
                        onUpdated(invoiceData);
                        onClose();
                    }}
                    invoice={invoiceData}
                    previousDue={otherInvoicesDue}
                />
            )}
        </>
    );
};

export default EditSaleModal;