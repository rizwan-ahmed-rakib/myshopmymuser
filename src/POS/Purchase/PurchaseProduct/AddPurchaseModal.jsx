import React, { useEffect, useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
import { posPurchaseProductAPI } from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
import { posSupplierAPI } from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";

import SuccessModal from "./SuccessModal";
import api from '../../../context_or_provider/pos/posApi';
import BaseModal from "../../components/BaseModal";
import { ShoppingCart, User, Package, Trash2, Plus, Banknote, CreditCard, Wallet, Percent, Tag, Receipt } from 'lucide-react';

const emptyItem = {
    product: null,
    product_name: "",
    unit_price: 0,
    quantity: 1,
    discount_type: "fixed",
    discount_value: 0,
    discount_amount: 0,
    total_price: 0,
    has_expiry: false,
    manufacturing_date: "",
    shelf_life_days: 0,
    batch_no: "",
};

/**
 * AddPurchaseModal - Refactored to use BaseModal and standardized backbone layout.
 */
const AddPurchaseModal = ({ isOpen, onClose, onSuccess }) => {
    const [supplier, setSupplier] = useState(null);
    const [items, setItems] = useState([{ ...emptyItem }]);
    const [paidCash, setPaidCash] = useState(0);
    const [paidMobile, setPaidMobile] = useState(0);
    const [paidBank, setPaidBank] = useState(0);
    const [mobileOperator, setMobileOperator] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [bankAccountNo, setBankAccountNo] = useState("");
    const [paymentProof, setPaymentProof] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [globalDiscountType, setGlobalDiscountType] = useState("fixed");
    const [globalDiscountValue, setGlobalDiscountValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);

    const barcodeRef = useRef(null);

    useEffect(() => {
        const counts = [paidCash > 0, paidMobile > 0, paidBank > 0].filter(Boolean).length;
        if (counts > 1) setPaymentMethod("hybrid");
        else if (paidMobile > 0) setPaymentMethod("mobile_banking");
        else if (paidBank > 0) setPaymentMethod("bank");
        else setPaymentMethod("cash");
    }, [paidCash, paidMobile, paidBank]);

    useEffect(() => {
        if (isOpen && barcodeRef.current) {
            barcodeRef.current.focus();
        }
    }, [isOpen]);

    const loadSupplierOptions = async (inputValue) => {
        const res = await posSupplierAPI.search(inputValue || "");
        return res.data.map(s => ({
            value: s.id,
            label: s.name,
            due_amount: Number(s.due_amount || 0),
            image: s.image,
        }));
    };

    const loadProductOptions = async (inputValue) => {
        if (!inputValue) return [];
        const res = await posProductAPI.search(inputValue);
        return res.data.map(p => ({
            value: p.id,
            label: `${p.name} (${p.product_code})`,
            unit_price: Number(p.purchase_price),
            product_name: p.name,
            has_expiry: p.has_expiry,
        }));
    };

    const calculateItemTotal = (item) => {
        const baseTotal = item.unit_price * item.quantity;
        let discount = 0;
        if (item.discount_type === "percent") {
            discount = (baseTotal * item.discount_value) / 100;
        } else {
            discount = item.discount_value;
        }
        return {
            total_price: Math.max(0, baseTotal - discount),
            discount_amount: discount
        };
    };

    const updateItem = (index, updates) => {
        setItems(prev => {
            const updated = [...prev];
            const newItem = { ...updated[index], ...updates };
            const { total_price, discount_amount } = calculateItemTotal(newItem);
            updated[index] = { ...newItem, total_price, discount_amount };
            return updated;
        });
    };

    const selectProduct = (option, index) => {
        updateItem(index, {
            product: option.value,
            product_name: option.product_name,
            unit_price: option.unit_price,
            quantity: 1,
            has_expiry: option.has_expiry,
            manufacturing_date: "",
            shelf_life_days: 0,
            batch_no: "",
        });
    };

    const handleBarcodeScan = async (e) => {
        if (e.key !== "Enter") return;
        const code = e.target.value.trim();
        if (!code) return;
        try {
            const res = await posProductAPI.search(code);
            if (res.data.length) {
                const p = res.data[0];
                const productData = {
                    value: p.id,
                    product_name: p.name,
                    unit_price: Number(p.purchase_price),
                    has_expiry: p.has_expiry,
                };
                setItems(prev => {
                    const lastItem = prev[prev.length - 1];
                    if (!lastItem.product) {
                        const updated = [...prev];
                        const newItem = { ...lastItem, product: productData.value, product_name: productData.product_name, unit_price: productData.unit_price, has_expiry: productData.has_expiry };
                        const { total_price, discount_amount } = calculateItemTotal(newItem);
                        updated[prev.length - 1] = { ...newItem, total_price, discount_amount };
                        return updated;
                    } else {
                        const newItem = { ...emptyItem, product: productData.value, product_name: productData.product_name, unit_price: productData.unit_price, has_expiry: productData.has_expiry };
                        const { total_price, discount_amount } = calculateItemTotal(newItem);
                        return [...prev, { ...newItem, total_price, discount_amount }];
                    }
                });
            }
        } catch (err) { console.error(err); }
        e.target.value = "";
    };

    const addRow = () => setItems([...items, { ...emptyItem }]);
    const removeRow = (index) => {
        if (items.length === 1) setItems([{ ...emptyItem }]);
        else setItems(items.filter((_, i) => i !== index));
    };

    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
    const globalDiscountAmount = globalDiscountType === "percent" ? (subtotal * globalDiscountValue) / 100 : globalDiscountValue;
    const netTotal = Math.max(0, subtotal - globalDiscountAmount);
    const totalPaid = Number(paidCash) + Number(paidMobile) + Number(paidBank);
    const currentInvoiceDue = netTotal - totalPaid;
    const previousDue = supplier?.due_amount || 0;
    const totalSupplierDue = previousDue + currentInvoiceDue;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        if (!supplier) { setErrors({ supplier: "Supplier required" }); return; }
        if (items.some(i => !i.product)) { setErrors({ items: "All product rows must be filled" }); return; }

        const itemwise_total_discount = items.reduce((sum, i) => sum + i.discount_amount, 0);
        const itemsPayload = items.map(i => ({
            product: i.product, quantity: i.quantity, unit_price: i.unit_price, discount_amount: i.discount_amount, net_total: i.total_price,
            manufacturing_date: i.has_expiry ? i.manufacturing_date : null, shelf_life_days: i.has_expiry ? i.shelf_life_days : 0, batch_no: i.has_expiry ? i.batch_no : "",
        }));

        const payload = {
            supplier: supplier.value, paid_cash: paidCash, paid_mobile: paidMobile, paid_bank: paidBank, payment_method: paymentMethod,
            subtotal: subtotal, itemwise_total_discount: itemwise_total_discount, global_discount: globalDiscountAmount, total_discount: itemwise_total_discount + globalDiscountAmount,
            net_total: netTotal, items: itemsPayload, mobile_operator: paidMobile > 0 ? mobileOperator : "", transaction_id: paidMobile > 0 ? transactionId : "", bank_account_no: paidBank > 0 ? bankAccountNo : "",
        };

        try {
            setLoading(true);
            let res;
            if (paymentProof) {
                const formData = new FormData();
                Object.keys(payload).forEach(key => {
                    if (key === 'items') formData.append(key, JSON.stringify(payload[key]));
                    else if (payload[key] !== null && payload[key] !== undefined) formData.append(key, payload[key]);
                });
                formData.append("payment_proof", paymentProof);
                res = await api.post(`/api/purchase/purchases/`, formData);
            } else {
                res = await posPurchaseProductAPI.create(payload);
            }
            setInvoiceData(res.data);
            setShowSuccess(true);
        } catch (err) {
            setErrors(err.response?.data || {});
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                title="New Purchase Invoice"
                size="xl"
                icon={<ShoppingCart className="text-white" />}
                showFooter={true}
                onSubmit={handleSubmit}
                submitText="Confirm Purchase"
                isLoading={loading}
            >
                <div className="space-y-6">
                    <input ref={barcodeRef} onKeyDown={handleBarcodeScan} className="absolute opacity-0" />

                    {/* Supplier Section */}
                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 grid md:grid-cols-2 gap-6 items-center">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-blue-500 tracking-widest flex items-center gap-2">
                                <User size={12} /> Supplier Account
                            </label>
                            <AsyncSelect
                                cacheOptions defaultOptions loadOptions={loadSupplierOptions} value={supplier} onChange={setSupplier}
                                placeholder="Search supplier..." menuPortalTarget={document.body}
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }), control: (base) => ({ ...base, borderRadius: '12px', padding: '2px' }) }}
                            />
                            {errors.supplier && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-tighter ml-1">{errors.supplier}</p>}
                        </div>
                        {supplier && (
                            <div className="bg-white px-5 py-3 rounded-xl border border-blue-200 shadow-sm flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Previous Balance</p>
                                    <p className="text-2xl font-black text-rose-600">৳{previousDue.toLocaleString()}</p>
                                </div>
                                <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-500"><Wallet size={20} /></div>
                            </div>
                        )}
                    </div>

                    {/* Items Table */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Package size={14} className="text-brand-primary" /> Purchase Items
                            </h3>
                            <button type="button" onClick={addRow} className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5 hover:text-blue-700">
                                <Plus size={12} /> Add Row
                            </button>
                        </div>

                        <div className="space-y-3">
                            {errors.items && <p className="bg-rose-50 text-rose-600 p-3 rounded-xl border border-rose-100 text-xs font-bold text-center">{errors.items}</p>}
                            {items.map((item, index) => (
                                <div key={index} className="group border border-gray-100 rounded-2xl bg-white hover:border-blue-200 transition-all overflow-hidden shadow-sm hover:shadow-md">
                                    <div className="grid lg:grid-cols-12 gap-4 p-4 items-center">
                                        <div className="lg:col-span-4 space-y-1">
                                            <label className="lg:hidden text-[9px] font-black text-gray-400 uppercase">Product</label>
                                            <AsyncSelect
                                                loadOptions={loadProductOptions} defaultOptions onChange={(opt) => selectProduct(opt, index)}
                                                value={item.product ? { value: item.product, label: item.product_name } : null}
                                                placeholder="Search product..." menuPortalTarget={document.body}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }), control: (base) => ({ ...base, borderRadius: '10px' }) }}
                                            />
                                        </div>
                                        <div className="lg:col-span-1 space-y-1">
                                            <label className="lg:hidden text-[9px] font-black text-gray-400 uppercase text-right">Price</label>
                                            <input className="w-full border border-gray-200 p-2 rounded-lg text-right font-bold text-sm focus:border-blue-500 outline-none" type="number" value={item.unit_price} onChange={(e) => updateItem(index, { unit_price: Number(e.target.value) })} />
                                        </div>
                                        <div className="lg:col-span-1 space-y-1">
                                            <label className="lg:hidden text-[9px] font-black text-gray-400 uppercase text-center">Qty</label>
                                            <input className="w-full border border-gray-200 p-2 rounded-lg text-center font-black text-sm focus:border-blue-500 outline-none" type="number" value={item.quantity} onChange={(e) => updateItem(index, { quantity: Number(e.target.value) })} />
                                        </div>
                                        <div className="lg:col-span-2 space-y-1">
                                            <label className="lg:hidden text-[9px] font-black text-gray-400 uppercase">Discount</label>
                                            <div className="flex items-center gap-1">
                                                <select className="border border-gray-200 p-2 rounded-lg text-[10px] font-bold bg-gray-50 outline-none" value={item.discount_type} onChange={(e) => updateItem(index, { discount_type: e.target.value })}>
                                                    <option value="fixed">৳</option>
                                                    <option value="percent">%</option>
                                                </select>
                                                <input type="number" className="w-full border border-gray-200 p-2 rounded-lg text-right text-sm font-bold outline-none" placeholder="0" value={item.discount_value || ""} onChange={(e) => updateItem(index, { discount_value: Number(e.target.value) })} />
                                            </div>
                                        </div>
                                        <div className="lg:col-span-2 text-right px-2">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">Net Total</p>
                                            <span className="font-black text-blue-700 text-base">৳{item.total_price.toLocaleString()}</span>
                                        </div>
                                        <div className="lg:col-span-2 flex justify-center lg:justify-end">
                                            <button type="button" onClick={() => removeRow(index)} className="p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all border border-transparent hover:border-rose-100"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                    {item.has_expiry && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50/30 border-t border-orange-100">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Mfg Date</label>
                                                <input type="date" className="w-full border border-orange-100 p-2 rounded-lg text-xs font-bold outline-none bg-white focus:border-orange-300" value={item.manufacturing_date} onChange={(e) => updateItem(index, { manufacturing_date: e.target.value })} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Shelf Life (Days)</label>
                                                <input type="number" className="w-full border border-orange-100 p-2 rounded-lg text-xs font-bold outline-none bg-white focus:border-orange-300" value={item.shelf_life_days} onChange={(e) => updateItem(index, { shelf_life_days: Number(e.target.value) })} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Batch No</label>
                                                <input className="w-full border border-orange-100 p-2 rounded-lg text-xs font-bold outline-none bg-white focus:border-orange-300" placeholder="Batch Number" value={item.batch_no} onChange={(e) => updateItem(index, { batch_no: e.target.value })} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                        <div className="space-y-6">
                            {/* Payment Breakdown */}
                            <div className="bg-gray-50/50 p-5 rounded-[2rem] border border-gray-100 space-y-5">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Banknote size={14} className="text-brand-primary" /> Payment Breakdown
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Cash</label>
                                        <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-emerald-600 text-sm focus:border-emerald-300 outline-none" value={paidCash} onChange={(e) => setPaidCash(Number(e.target.value))} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile</label>
                                        <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-purple-600 text-sm focus:border-purple-300 outline-none" value={paidMobile} onChange={(e) => setPaidMobile(Number(e.target.value))} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank</label>
                                        <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-blue-600 text-sm focus:border-blue-300 outline-none" value={paidBank} onChange={(e) => setPaidBank(Number(e.target.value))} />
                                    </div>
                                </div>

                                {paidMobile > 0 && (
                                    <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-purple-400 uppercase">Operator</label>
                                            <select className="w-full border border-purple-100 p-2 rounded-lg bg-white text-xs font-bold outline-none" value={mobileOperator} onChange={(e) => setMobileOperator(e.target.value)}>
                                                <option value="">Select Operator</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="rocket">Rocket</option><option value="upay">Upay</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-purple-400 uppercase">Transaction ID</label>
                                            <input className="w-full border border-purple-100 p-2 rounded-lg text-xs font-bold outline-none" placeholder="TxID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
                                        </div>
                                    </div>
                                )}

                                {paidBank > 0 && (
                                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-[9px] font-black text-blue-400 uppercase">Bank Account / Reference</label>
                                        <input className="w-full border border-blue-100 p-2 rounded-lg text-xs font-bold outline-none" placeholder="A/C No..." value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} />
                                    </div>
                                )}

                                <div className="pt-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Payment Proof (Optional)</label>
                                    <input type="file" className="w-full text-[10px] font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer" onChange={(e) => setPaymentProof(e.target.files[0])} />
                                </div>
                            </div>

                            {/* Global Discount */}
                            <div className="bg-emerald-50/50 p-5 rounded-[2rem] border border-emerald-100 space-y-4">
                                <label className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Tag size={14} /> Global Invoice Discount
                                </label>
                                <div className="flex gap-3">
                                    <select className="border border-emerald-100 p-2 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-200 text-xs font-bold" value={globalDiscountType} onChange={(e) => setGlobalDiscountType(e.target.value)}>
                                        <option value="fixed">Fixed (৳)</option><option value="percent">Percentage (%)</option>
                                    </select>
                                    <input type="number" className="w-full border border-emerald-100 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-emerald-200 font-black text-emerald-700" placeholder="0.00" value={globalDiscountValue || ""} onChange={(e) => setGlobalDiscountValue(Number(e.target.value))} />
                                </div>
                            </div>
                        </div>

                        {/* Financial Summary */}
                        <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center text-gray-500 text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-3">
                                    <span>Subtotal</span> <span className="font-mono">৳{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-emerald-400 text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-3">
                                    <span>Discount</span> <span className="font-mono">- ৳{globalDiscountAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-gray-400 font-black uppercase tracking-[0.2em]">Net Total</span>
                                    <span className="font-mono font-black text-3xl text-white">৳{netTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3 relative z-10">
                                <div className="flex justify-between items-center text-blue-400 font-black uppercase text-[10px] tracking-widest">
                                    <span>Total Paid</span> <span className="font-mono text-xl text-white">৳{totalPaid.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                    <div className="space-y-1">
                                        <p className="text-[8px] text-rose-400 font-black uppercase tracking-widest">Invoice Due</p>
                                        <p className="text-lg font-black text-rose-500 font-mono">৳{currentInvoiceDue.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-[8px] text-blue-400 font-black uppercase tracking-widest">Combined Due</p>
                                        <p className="text-lg font-black text-blue-400 font-mono">৳{totalSupplierDue.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseModal>

            {invoiceData && (
                <SuccessModal
                    isOpen={showSuccess}
                    onClose={() => {
                        setShowSuccess(false);
                        onSuccess?.(invoiceData);
                        onClose();
                    }}
                    invoice={invoiceData}
                    previousDue={previousDue}
                />
            )}
        </>
    );
};

export default AddPurchaseModal;