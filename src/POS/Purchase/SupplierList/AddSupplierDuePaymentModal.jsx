// import React, { useState, useEffect, useMemo } from "react";
// import api from '../../../context_or_provider/pos/posApi';
// import Select from "react-select";
// import AsyncSelect from "react-select/async";
// import {
//   FaMoneyBillWave, FaMobileAlt, FaUniversity,
//   FaRegStickyNote, FaCheckCircle, FaTimes,
//   FaCogs, FaHashtag, FaInfoCircle, FaSearch,
//   FaPlusCircle, FaReceipt, FaPrint
// } from "react-icons/fa";
//
// import { posPurchaseProductAPI } from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
// import BaseModal from "../../components/BaseModal";
// import { Wallet, Banknote, CreditCard, Search, Info, CheckCircle, Receipt, PlusCircle } from 'lucide-react';
//
// /**
//  * AddSupplierDuePaymentModal - Refactored to use BaseModal and standardized backbone layout.
//  */
// const AddSupplierDuePaymentModal = ({ isOpen, onClose, onSuccess, suppliers = [] }) => {
//   const [form, setForm] = useState({
//     supplier: "",
//     purchase: "",
//     paid_cash: 0,
//     paid_mobile: 0,
//     paid_bank: 0,
//     payment_method: "cash",
//     mobile_operator: "",
//     transaction_id: "",
//     bank_name: "",
//     note: "",
//   });
//
//   const [loading, setLoading] = useState(false);
//   const [purchasesLoading, setPurchasesLoading] = useState(false);
//   const [supplierPurchases, setSupplierPurchases] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [invoiceData, setInvoiceData] = useState(null);
//
//   useEffect(() => {
//     const counts = [Number(form.paid_cash) > 0, Number(form.paid_mobile) > 0, Number(form.paid_bank) > 0].filter(Boolean).length;
//     let method = "cash";
//     if (counts > 1) method = "hybrid";
//     else if (Number(form.paid_mobile) > 0) method = "mobile_banking";
//     else if (Number(form.paid_bank) > 0) method = "bank";
//     setForm(prev => ({ ...prev, payment_method: method }));
//   }, [form.paid_cash, form.paid_mobile, form.paid_bank]);
//
//   useEffect(() => {
//     if (form.supplier && isOpen) {
//       const fetchPurchases = async () => {
//         setPurchasesLoading(true);
//         try {
//           const res = await posPurchaseProductAPI.getAll();
//           const purchasesData = Array.isArray(res.data) ? res.data : (res.data.results || []);
//           const filtered = purchasesData.filter(p => {
//              const suppId = typeof p.supplier === 'object' ? p.supplier.id : p.supplier;
//              return Number(suppId) === Number(form.supplier) && Number(p.due_amount) > 0;
//           });
//           setSupplierPurchases(filtered);
//         } catch (err) { console.error(err); } finally { setPurchasesLoading(false); }
//       };
//       fetchPurchases();
//     } else {
//       setSupplierPurchases([]); setForm(prev => ({ ...prev, purchase: "" }));
//     }
//   }, [form.supplier, isOpen]);
//
//   const supplierOptions = useMemo(() =>
//     suppliers.map(s => ({ value: s.id, label: `${s.name} ${s.phone ? `(${s.phone})` : ""}`, due: s.due_amount })),
//     [suppliers]
//   );
//
//   const purchaseOptions = useMemo(() =>
//     supplierPurchases.map(p => ({ value: p.id, label: `#${p.invoice_no} (Due: ৳${p.due_amount})`, due: p.due_amount })),
//     [supplierPurchases]
//   );
//
//   const loadInvoiceOptions = async (inputValue) => {
//     if (!inputValue || inputValue.length < 1) return [];
//     try {
//       const res = await posPurchaseProductAPI.search(inputValue);
//       const purchasesData = Array.isArray(res.data) ? res.data : (res.data.results || []);
//       return purchasesData.filter(p => Number(p.due_amount) > 0).map(p => ({
//           value: p.id, label: `#${p.invoice_no} - ${p.supplier_name} (Due: ৳${p.due_amount})`,
//           supplier: typeof p.supplier === 'object' ? p.supplier.id : p.supplier, due: p.due_amount
//         }));
//     } catch (err) { console.error(err); return []; }
//   };
//
//   const handleGlobalInvoiceSelect = (option) => {
//     if (option) {
//       setForm(prev => ({ ...prev, supplier: option.supplier, purchase: option.value, paid_cash: parseFloat(option.due), paid_mobile: 0, paid_bank: 0 }));
//     }
//   };
//
//   const handleAmountChange = (e) => {
//     const { name, value } = e.target;
//     const val = value === "" ? 0 : parseFloat(value);
//     setForm((prev) => ({ ...prev, [name]: isNaN(val) ? 0 : val }));
//   };
//
//   const selectedSupplier = suppliers.find((s) => s.id === Number(form.supplier));
//   const totalAmount = Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank);
//
//   const handleSubmit = async (e) => {
//     if(e) e.preventDefault();
//     setLoading(true); setErrors({});
//     if (!form.supplier || totalAmount <= 0) {
//       setErrors({ message: "Select a supplier and enter a valid payment amount." });
//       setLoading(false); return;
//     }
//     try {
//       const res = await api.post(`/api/purchase/due-payments/`, { ...form, amount: totalAmount, purchase: form.purchase || null });
//       setInvoiceData(res.data);
//       setShowSuccess(true);
//       onSuccess?.(res.data);
//     } catch (err) {
//       setErrors(err.response?.data || { message: "Network error" });
//     } finally { setLoading(false); }
//   };
//
//   const customSelectStyles = {
//     control: (base) => ({ ...base, borderRadius: '1rem', padding: '0.2rem', borderWidth: '2px', borderColor: '#f3f4f6', '&:hover': { borderColor: '#10b981' } }),
//     option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#ecfdf5' : 'white', color: state.isSelected ? 'white' : '#1f2937', fontWeight: 'bold' }),
//     menuPortal: base => ({ ...base, zIndex: 9999 })
//   };
//
//   const handlePrint = () => {
//     if (!invoiceData) return;
//     const win = window.open("", "_blank");
//     win.document.write(`
//       <html><head><title>Receipt</title><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap'); body{font-family:'Inter', sans-serif;padding:40px;color:#111827;} .header{text-align:center;border-bottom:4px solid #111827;padding-bottom:20px;margin-bottom:30px;} .table{width:100%;border-collapse:collapse;margin-bottom:30px;} .table th{text-align:left;padding:12px;font-size:10px;font-weight:900;text-transform:uppercase;color:#4b5563;border-bottom:2px solid #e5e7eb;} .table td{padding:15px 12px;border-bottom:1px solid #f3f4f6;font-weight:600;} .total-box{background:#111827;color:white;padding:20px;border-radius:12px;text-align:right;} .total-amount{font-size:32px;font-weight:900;} </style></head>
//       <body><div class="header"><h1>MY SHOP POS</h1><p>Payment Receipt #${invoiceData.invoice_no}</p></div><p><strong>Supplier:</strong> ${invoiceData.supplier_name}</p><p><strong>Date:</strong> ${new Date(invoiceData.created_at).toLocaleString()}</p><table class="table"><thead><tr><th>Method</th><th style="text-align:right;">Amount</th></tr></thead><tbody>${Number(invoiceData.paid_cash)>0?`<tr><td>Cash</td><td style="text-align:right;">৳${parseFloat(invoiceData.paid_cash).toLocaleString()}</td></tr>`:''}${Number(invoiceData.paid_mobile)>0?`<tr><td>Mobile</td><td style="text-align:right;">৳${parseFloat(invoiceData.paid_mobile).toLocaleString()}</td></tr>`:''}${Number(invoiceData.paid_bank)>0?`<tr><td>Bank</td><td style="text-align:right;">৳${parseFloat(invoiceData.paid_bank).toLocaleString()}</td></tr>`:''}</tbody></table><div class="total-box"><div>Total Settled</div><div class="total-amount">৳${parseFloat(invoiceData.amount).toLocaleString()}</div></div><script>window.onload=function(){window.print();window.close();}</script></body></html>
//     `);
//     win.document.close();
//   };
//
//   const handleClose = () => {
//     setForm({ supplier: "", purchase: "", paid_cash: 0, paid_mobile: 0, paid_bank: 0, payment_method: "cash", mobile_operator: "", transaction_id: "", bank_name: "", note: "" });
//     setShowSuccess(false); setInvoiceData(null); setErrors({}); onClose();
//   };
//
//   return (
//     <BaseModal
//       isOpen={isOpen}
//       onClose={handleClose}
//       title="Record Supplier Payout"
//       size="md"
//       icon={<PlusCircle className="text-white" />}
//       showFooter={!showSuccess}
//       onSubmit={handleSubmit}
//       submitText="Confirm Payment"
//       isLoading={loading}
//     >
//       {showSuccess && invoiceData ? (
//           <div className="text-center space-y-6 py-2">
//               <div className="w-20 h-20 bg-emerald-50 rounded-full mx-auto flex items-center justify-center shadow-inner">
//                   <CheckCircle className="text-4xl text-emerald-500 animate-bounce" size={40} />
//               </div>
//               <div className="space-y-1">
//                   <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Payment Recorded</h3>
//                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Transaction #{invoiceData.invoice_no} Successful</p>
//               </div>
//               <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100 text-left">
//                   <div className="flex justify-between items-center">
//                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Settled Amount</span>
//                       <span className="font-black text-emerald-600 text-2xl font-mono">৳{parseFloat(invoiceData.amount).toLocaleString()}</span>
//                   </div>
//                   <div className="pt-4 border-t border-dashed border-gray-200">
//                       <div className="flex justify-between items-center text-xs">
//                           <span className="text-gray-500 font-bold">Supplier</span>
//                           <span className="font-black text-gray-800">{invoiceData.supplier_name}</span>
//                       </div>
//                   </div>
//               </div>
//               <div className="grid grid-cols-2 gap-3 pt-2">
//                   <button onClick={handlePrint} className="py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg">
//                       <Receipt size={14} /> Print Receipt
//                   </button>
//                   <button onClick={handleClose} className="py-3.5 border-2 border-gray-100 text-gray-700 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all">
//                       Dismiss
//                   </button>
//               </div>
//           </div>
//       ) : (
//           <div className="space-y-6">
//               {/* Quick Search */}
//               <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 space-y-3">
//                   <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
//                       <Search size={12} /> Quick Search Invoice
//                   </label>
//                   <AsyncSelect
//                       cacheOptions defaultOptions loadOptions={loadInvoiceOptions} onChange={handleGlobalInvoiceSelect}
//                       placeholder="Type invoice #..." styles={customSelectStyles} isClearable
//                       menuPortalTarget={document.body}
//                   />
//                   <p className="text-[9px] text-gray-400 font-bold italic uppercase tracking-tighter">* Search across all suppliers with due</p>
//               </div>
//
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div className="space-y-1.5">
//                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Supplier *</label>
//                       <Select options={supplierOptions} onChange={(opt) => setForm(prev => ({ ...prev, supplier: opt ? opt.value : "", purchase: "" }))} placeholder="Search name..." isClearable styles={customSelectStyles} value={supplierOptions.find(o => o.value === Number(form.supplier))} menuPortalTarget={document.body} />
//                   </div>
//                   <div className="space-y-1.5">
//                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Linked Invoice</label>
//                       <Select options={purchaseOptions} onChange={(opt) => setForm(prev => ({ ...prev, purchase: opt ? opt.value : "", paid_cash: opt ? parseFloat(opt.due) : prev.paid_cash }))} placeholder="Select due invoice..." isClearable styles={customSelectStyles} isDisabled={!form.supplier || purchasesLoading} value={purchaseOptions.find(o => o.value === Number(form.purchase))} menuPortalTarget={document.body} />
//                   </div>
//               </div>
//
//               {selectedSupplier && (
//                   <div className="bg-blue-600 p-6 rounded-2xl flex justify-between items-center shadow-lg relative overflow-hidden group">
//                       <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-700"></div>
//                       <div className="relative z-10">
//                           <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Total Outstanding</p>
//                           <p className="text-3xl font-black text-white leading-none">৳{Number(selectedSupplier.due_amount).toLocaleString()}</p>
//                       </div>
//                       <Info className="text-white/30" size={32} />
//                   </div>
//               )}
//
//               {/* Breakdown */}
//               <div className="space-y-4">
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
//                       <Banknote size={12} className="text-brand-primary" /> Payout Breakdown
//                   </label>
//                   <div className="grid grid-cols-3 gap-4">
//                       <div className="space-y-1">
//                           <label className="text-[9px] font-black text-emerald-600 uppercase ml-1 tracking-tighter">Cash</label>
//                           <input type="number" name="paid_cash" value={form.paid_cash} onChange={handleAmountChange} className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-center text-emerald-700 focus:border-emerald-400 outline-none shadow-inner" />
//                       </div>
//                       <div className="space-y-1">
//                           <label className="text-[9px] font-black text-purple-600 uppercase ml-1 tracking-tighter">Mobile</label>
//                           <input type="number" name="paid_mobile" value={form.paid_mobile} onChange={handleAmountChange} className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-center text-purple-700 focus:border-purple-400 outline-none shadow-inner" />
//                       </div>
//                       <div className="space-y-1">
//                           <label className="text-[9px] font-black text-blue-600 uppercase ml-1 tracking-tighter">Bank</label>
//                           <input type="number" name="paid_bank" value={form.paid_bank} onChange={handleAmountChange} className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-center text-blue-700 focus:border-blue-400 outline-none shadow-inner" />
//                       </div>
//                   </div>
//
//                   {(Number(form.paid_mobile) > 0 || Number(form.paid_bank) > 0) && (
//                       <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 animate-in fade-in duration-300">
//                           {Number(form.paid_mobile) > 0 && (
//                               <div className="grid grid-cols-2 gap-3">
//                                   <select name="mobile_operator" value={form.mobile_operator} onChange={(e) => setForm(prev => ({...prev, mobile_operator: e.target.value}))} className="border border-gray-200 p-2 rounded-lg text-xs font-bold outline-none bg-white">
//                                       <option value="">Operator</option><option value="bkash">bKash</option><option value="nagad">Nagad</option>
//                                   </select>
//                                   <input name="transaction_id" value={form.transaction_id} onChange={(e) => setForm(prev => ({...prev, transaction_id: e.target.value}))} className="border border-gray-200 p-2 rounded-lg text-xs font-bold outline-none bg-white" placeholder="TxID" />
//                               </div>
//                           )}
//                           {Number(form.paid_bank) > 0 && (
//                               <input name="bank_name" value={form.bank_name} onChange={(e) => setForm(prev => ({...prev, bank_name: e.target.value}))} className="w-full border border-gray-200 p-2 rounded-lg text-xs font-bold outline-none bg-white" placeholder="Bank Name / Reference" />
//                           )}
//                       </div>
//                   )}
//               </div>
//
//               <div className="bg-gray-900 p-6 rounded-[2rem] flex justify-between items-center shadow-xl">
//                   <div>
//                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Payment</p>
//                       <p className="text-3xl font-black text-green-400 font-mono">৳{totalAmount.toLocaleString()}</p>
//                   </div>
//                   {selectedSupplier && (
//                       <div className="text-right">
//                           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">New Balance</p>
//                           <p className="text-xl font-black text-rose-500 font-mono">৳{(Number(selectedSupplier.due_amount) - totalAmount).toLocaleString()}</p>
//                       </div>
//                   )}
//               </div>
//
//               {errors.message && (
//                   <p className="bg-rose-50 text-rose-600 p-3 rounded-xl border border-rose-100 text-[10px] font-black uppercase tracking-widest text-center">{errors.message}</p>
//               )}
//           </div>
//       )}
//     </BaseModal>
//   );
// };
//
// export default AddSupplierDuePaymentModal;



import React, { useState, useEffect, useMemo } from "react";
import api from '../../../context_or_provider/pos/posApi';
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { posPurchaseProductAPI } from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
import BaseModal from "../../components/BaseModal";
import {
  Banknote, Search, Info, CheckCircle, Receipt, PlusCircle,
  RefreshCcw, AlertTriangle, FileText
} from 'lucide-react';
import { FaMoneyBillWave, FaMobileAlt, FaUniversity } from "react-icons/fa";

/**
 * AddSupplierDuePaymentModal — supports both:
 *   • payment → we pay the supplier (settle due, or leave advance)
 *   • refund  → supplier returns money (from advance balance)
 */
const AddSupplierDuePaymentModal = ({ isOpen, onClose, onSuccess, suppliers = [] }) => {
  const [form, setForm] = useState({
    transaction_type: 'payment',
    supplier: "",
    purchase: "",
    paid_cash: 0,
    paid_mobile: 0,
    paid_bank: 0,
    payment_method: "cash",
    mobile_operator: "",
    transaction_id: "",
    bank_name: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [purchasesLoading, setPurchasesLoading] = useState(false);
  const [supplierPurchases, setSupplierPurchases] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  const isRefund = form.transaction_type === 'refund';

  /* ─── Auto-detect payment_method from breakdown ─── */
  useEffect(() => {
    const counts = [
      Number(form.paid_cash) > 0,
      Number(form.paid_mobile) > 0,
      Number(form.paid_bank) > 0,
    ].filter(Boolean).length;
    let method = "cash";
    if (counts > 1) method = "hybrid";
    else if (Number(form.paid_mobile) > 0) method = "mobile_banking";
    else if (Number(form.paid_bank) > 0) method = "bank";
    setForm(prev => ({ ...prev, payment_method: method }));
  }, [form.paid_cash, form.paid_mobile, form.paid_bank]);

  /* ─── Load invoices — only for payment mode ─── */
  useEffect(() => {
    if (form.supplier && isOpen && !isRefund) {
      const fetchPurchases = async () => {
        setPurchasesLoading(true);
        try {
          const res = await posPurchaseProductAPI.getAll();
          const purchasesData = Array.isArray(res.data) ? res.data : (res.data.results || []);
          const filtered = purchasesData.filter(p => {
            const suppId = typeof p.supplier === 'object' ? p.supplier.id : p.supplier;
            return Number(suppId) === Number(form.supplier) && Number(p.due_amount) > 0;
          });
          setSupplierPurchases(filtered);
        } catch (err) {
          console.error(err);
        } finally {
          setPurchasesLoading(false);
        }
      };
      fetchPurchases();
    } else {
      setSupplierPurchases([]);
      setForm(prev => ({ ...prev, purchase: "" }));
    }
  }, [form.supplier, isOpen, isRefund]);

  /* ─── Supplier options — filtered in refund mode ─── */
  const supplierOptions = useMemo(() => {
    const source = isRefund
      ? suppliers.filter(s => Number(s.due_amount) < 0) // only suppliers with advance
      : suppliers;

    return source.map(s => {
      const due = Number(s.due_amount);
      const isAdvance = due < 0;
      const displayAmount = isAdvance
        ? `Advance: ৳${Math.abs(due).toLocaleString()}`
        : `Due: ৳${due.toLocaleString()}`;
      return {
        value: s.id,
        label: `${s.name}${s.phone ? ` (${s.phone})` : ""} — ${displayAmount}`,
        due,
      };
    });
  }, [suppliers, isRefund]);

  const purchaseOptions = useMemo(
    () =>
      supplierPurchases.map(p => ({
        value: p.id,
        label: `#${p.invoice_no} (Due: ৳${p.due_amount})`,
        due: p.due_amount,
      })),
    [supplierPurchases]
  );

  /* ─── Quick invoice search (payment only) ─── */
  const loadInvoiceOptions = async (inputValue) => {
    if (isRefund || !inputValue || inputValue.length < 1) return [];
    try {
      const res = await posPurchaseProductAPI.search(inputValue);
      const purchasesData = Array.isArray(res.data) ? res.data : (res.data.results || []);
      return purchasesData
        .filter(p => Number(p.due_amount) > 0)
        .map(p => ({
          value: p.id,
          label: `#${p.invoice_no} - ${p.supplier_name} (Due: ৳${p.due_amount})`,
          supplier: typeof p.supplier === 'object' ? p.supplier.id : p.supplier,
          due: p.due_amount,
        }));
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const handleGlobalInvoiceSelect = (option) => {
    if (option) {
      setForm(prev => ({
        ...prev,
        supplier: option.supplier,
        purchase: option.value,
        paid_cash: parseFloat(option.due),
        paid_mobile: 0,
        paid_bank: 0,
      }));
    }
  };

  const handleAmountChange = (e) => {
    const { name, value } = e.target;
    const val = value === "" ? 0 : parseFloat(value);
    setForm(prev => ({ ...prev, [name]: isNaN(val) ? 0 : val }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const selectedSupplier = suppliers.find(s => s.id === Number(form.supplier));
  const totalAmount = Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank);

  const currentDue = selectedSupplier ? Number(selectedSupplier.due_amount) : 0;
  const availableAdvance = currentDue < 0 ? Math.abs(currentDue) : 0;
  const newBalance = isRefund
    ? currentDue + totalAmount   // refund → due_amount increases toward 0
    : currentDue - totalAmount;  // payment → due_amount decreases

  const refundExceedsAdvance = isRefund && selectedSupplier && totalAmount > availableAdvance;
  const hasNoAdvanceSuppliers = isRefund && supplierOptions.length === 0;

  /* ─── Submit ─── */
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!form.supplier || totalAmount <= 0) {
      setErrors({ message: "Select a supplier and enter a valid amount." });
      setLoading(false);
      return;
    }

    if (isRefund && totalAmount > availableAdvance) {
      setErrors({
        message: `Refund amount (৳${totalAmount.toLocaleString()}) exceeds available advance (৳${availableAdvance.toLocaleString()}).`,
      });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        amount: totalAmount,
        purchase: isRefund ? null : (form.purchase || null),
      };
      const res = await api.post(`/api/purchase/due-payments/`, payload);
      setInvoiceData(res.data);
      setShowSuccess(true);
      onSuccess?.(res.data);
    } catch (err) {
      const data = err.response?.data;
      const msg =
        data?.non_field_errors?.[0] ||
        data?.detail ||
        data?.message ||
        "Network error";
      setErrors({ message: msg });
    } finally {
      setLoading(false);
    }
  };

  /* ─── Styles ─── */
  const accent = isRefund ? '#3b82f6' : '#10b981';
  const accentSoft = isRefund ? '#eff6ff' : '#ecfdf5';

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: '1rem',
      padding: '0.2rem',
      borderWidth: '2px',
      borderColor: '#f3f4f6',
      '&:hover': { borderColor: accent },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? accent : state.isFocused ? accentSoft : 'white',
      color: state.isSelected ? 'white' : '#1f2937',
      fontWeight: 'bold',
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
  };

  /* ─── Print ─── */
  const handlePrint = () => {
    if (!invoiceData) return;
    const refund = invoiceData.transaction_type === 'refund';
    const badge = refund
      ? `<span style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:10px;font-weight:900;letter-spacing:2px;background:#dbeafe;color:#1d4ed8;">REFUND FROM SUPPLIER</span>`
      : `<span style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:10px;font-weight:900;letter-spacing:2px;background:#d1fae5;color:#047857;">PAYMENT TO SUPPLIER</span>`;

    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Receipt</title><style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body{font-family:'Inter',sans-serif;padding:40px;color:#111827;}
        .header{text-align:center;border-bottom:4px solid #111827;padding-bottom:20px;margin-bottom:30px;}
        .table{width:100%;border-collapse:collapse;margin-bottom:30px;}
        .table th{text-align:left;padding:12px;font-size:10px;font-weight:900;text-transform:uppercase;color:#4b5563;border-bottom:2px solid #e5e7eb;}
        .table td{padding:15px 12px;border-bottom:1px solid #f3f4f6;font-weight:600;}
        .total-box{background:#111827;color:white;padding:20px;border-radius:12px;text-align:right;}
        .total-amount{font-size:32px;font-weight:900;}
      </style></head>
      <body>
        <div class="header">
          <h1>MY SHOP POS</h1>
          <p>${refund ? 'Refund' : 'Payment'} Receipt #${invoiceData.invoice_no}</p>
          <div style="margin-top:8px;">${badge}</div>
        </div>
        <p><strong>Supplier:</strong> ${invoiceData.supplier_name}</p>
        <p><strong>Date:</strong> ${new Date(invoiceData.created_at).toLocaleString()}</p>
        <table class="table"><thead><tr><th>Method</th><th style="text-align:right;">Amount</th></tr></thead><tbody>
          ${Number(invoiceData.paid_cash) > 0 ? `<tr><td>Cash</td><td style="text-align:right;">৳${parseFloat(invoiceData.paid_cash).toLocaleString()}</td></tr>` : ''}
          ${Number(invoiceData.paid_mobile) > 0 ? `<tr><td>Mobile</td><td style="text-align:right;">৳${parseFloat(invoiceData.paid_mobile).toLocaleString()}</td></tr>` : ''}
          ${Number(invoiceData.paid_bank) > 0 ? `<tr><td>Bank</td><td style="text-align:right;">৳${parseFloat(invoiceData.paid_bank).toLocaleString()}</td></tr>` : ''}
        </tbody></table>
        <div class="total-box">
          <div>${refund ? 'Total Refunded' : 'Total Settled'}</div>
          <div class="total-amount">৳${parseFloat(invoiceData.amount).toLocaleString()}</div>
        </div>
        <script>window.onload=function(){window.print();window.close();}</script>
      </body></html>
    `);
    win.document.close();
  };

  const handleClose = () => {
    setForm({
      transaction_type: 'payment',
      supplier: "", purchase: "",
      paid_cash: 0, paid_mobile: 0, paid_bank: 0,
      payment_method: "cash",
      mobile_operator: "", transaction_id: "", bank_name: "", note: "",
    });
    setShowSuccess(false);
    setInvoiceData(null);
    setErrors({});
    onClose();
  };

  const handleTypeSwitch = (type) => {
    if (type === form.transaction_type) return;
    setForm(prev => ({
      ...prev,
      transaction_type: type,
      supplier: "",
      purchase: "",
      paid_cash: 0,
      paid_mobile: 0,
      paid_bank: 0,
    }));
    setErrors({});
  };

  /* ─── Theme tokens ─── */
  const theme = isRefund
    ? {
        bg: 'bg-blue-600',
        bgDark: 'bg-blue-900',
        text: 'text-blue-600',
        light: 'bg-blue-50/50',
        border: 'border-blue-100',
        labelText: 'text-blue-400',
        icon: <RefreshCcw className="text-white" />,
        title: 'Record Supplier Refund',
        submitText: 'Confirm Refund',
      }
    : {
        bg: 'bg-emerald-600',
        bgDark: 'bg-gray-900',
        text: 'text-emerald-600',
        light: 'bg-emerald-50/50',
        border: 'border-emerald-100',
        labelText: 'text-emerald-500',
        icon: <PlusCircle className="text-white" />,
        title: 'Record Supplier Payout',
        submitText: 'Confirm Payment',
      };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={theme.title}
      size="md"
      icon={theme.icon}
      showFooter={!showSuccess}
      onSubmit={handleSubmit}
      submitText={theme.submitText}
      isLoading={loading}
    >
      {showSuccess && invoiceData ? (
        /* ═══════════════ SUCCESS VIEW ═══════════════ */
        <div className="text-center space-y-6 py-2">
          <div className="w-20 h-20 bg-emerald-50 rounded-full mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle className="text-4xl text-emerald-500 animate-bounce" size={40} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">
              {invoiceData.transaction_type === 'refund' ? 'Refund Recorded' : 'Payment Recorded'}
            </h3>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
              Transaction #{invoiceData.invoice_no} Successful
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100 text-left">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                {invoiceData.transaction_type === 'refund' ? 'Refund Amount' : 'Settled Amount'}
              </span>
              <span className="font-black text-emerald-600 text-2xl font-mono">
                ৳{parseFloat(invoiceData.amount).toLocaleString()}
              </span>
            </div>
            <div className="pt-4 border-t border-dashed border-gray-200">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-bold">Supplier</span>
                <span className="font-black text-gray-800">{invoiceData.supplier_name}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <Receipt size={14} /> Print Receipt
            </button>
            <button
              onClick={handleClose}
              className="py-3.5 border-2 border-gray-100 text-gray-700 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : (
        /* ═══════════════ FORM VIEW ═══════════════ */
        <div className="space-y-5">
          {/* ── Type toggle ── */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeSwitch('payment')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                !isRefund ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Receipt size={14} /> Pay Supplier
            </button>
            <button
              type="button"
              onClick={() => handleTypeSwitch('refund')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                isRefund ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <RefreshCcw size={14} /> Refund from Supplier
            </button>
          </div>

          {/* ── Empty-advance warning ── */}
          {hasNoAdvanceSuppliers && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>কোনো Supplier-এর কাছে advance নেই।</strong> Refund শুধু তখনই record করা যাবে
                যখন supplier-এর কাছে আপনার advance/credit আছে (যেমন advance payment দিয়েছিলেন কিন্তু
                product deliver হয়নি)।
              </p>
            </div>
          )}

          {/* ── Quick invoice search — payment only ── */}
          {!isRefund && (
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 space-y-3">
              <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <Search size={12} /> Quick Search Invoice
              </label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadInvoiceOptions}
                onChange={handleGlobalInvoiceSelect}
                placeholder="Type invoice #..."
                styles={customSelectStyles}
                isClearable
                menuPortalTarget={document.body}
              />
              <p className="text-[9px] text-gray-400 font-bold italic uppercase tracking-tighter">
                * Search across all suppliers with due
              </p>
            </div>
          )}

          {/* ── Refund info banner ── */}
          {isRefund && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Refund:</strong> Supplier আপনার কাছ থেকে টাকা ফেরত দিচ্ছে।
                Supplier-এর advance balance থেকে কেটে নেওয়া হবে।
              </p>
            </div>
          )}

          {/* ── Supplier / Invoice selection ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Select Supplier *
              </label>
              <Select
                options={supplierOptions}
                onChange={(opt) =>
                  setForm(prev => ({ ...prev, supplier: opt ? opt.value : "", purchase: "" }))
                }
                placeholder={isRefund ? "Search supplier with advance..." : "Search name..."}
                isClearable
                styles={customSelectStyles}
                value={supplierOptions.find(o => o.value === Number(form.supplier))}
                menuPortalTarget={document.body}
              />
            </div>

            {/* Invoice selector — payment only */}
            {!isRefund && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Linked Invoice
                </label>
                <Select
                  options={purchaseOptions}
                  onChange={(opt) =>
                    setForm(prev => ({
                      ...prev,
                      purchase: opt ? opt.value : "",
                      paid_cash: opt ? parseFloat(opt.due) : prev.paid_cash,
                    }))
                  }
                  placeholder="Select due invoice..."
                  isClearable
                  styles={customSelectStyles}
                  isDisabled={!form.supplier || purchasesLoading}
                  value={purchaseOptions.find(o => o.value === Number(form.purchase))}
                  menuPortalTarget={document.body}
                />
              </div>
            )}
          </div>

          {/* ── Balance card ── */}
          {selectedSupplier && (
            <div className={`${theme.bg} p-6 rounded-2xl flex justify-between items-center shadow-lg relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-700" />
              <div className="relative z-10">
                <p className={`text-[10px] font-black ${isRefund ? 'text-blue-200' : 'text-emerald-200'} uppercase tracking-widest mb-1`}>
                  {isRefund ? 'Available Advance' : 'Total Outstanding'}
                </p>
                <p className="text-3xl font-black text-white leading-none">
                  ৳{(isRefund ? availableAdvance : Math.max(0, currentDue)).toLocaleString()}
                </p>
                {!isRefund && currentDue < 0 && (
                  <p className="text-[10px] text-emerald-100 mt-1 font-bold">
                    (Supplier has ৳{Math.abs(currentDue).toLocaleString()} advance)
                  </p>
                )}
              </div>
              <Info className="text-white/30" size={32} />
            </div>
          )}

          {/* ── Breakdown ── */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Banknote size={12} className={theme.text} />
              {isRefund ? 'Refund Breakdown' : 'Payout Breakdown'}
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-emerald-600 uppercase ml-1 tracking-tighter flex items-center gap-1">
                  <FaMoneyBillWave size={10} /> Cash
                </label>
                <input
                  type="number"
                  name="paid_cash"
                  value={form.paid_cash}
                  onChange={handleAmountChange}
                  className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-center text-emerald-700 focus:border-emerald-400 outline-none shadow-inner"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-purple-600 uppercase ml-1 tracking-tighter flex items-center gap-1">
                  <FaMobileAlt size={10} /> Mobile
                </label>
                <input
                  type="number"
                  name="paid_mobile"
                  value={form.paid_mobile}
                  onChange={handleAmountChange}
                  className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-center text-purple-700 focus:border-purple-400 outline-none shadow-inner"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-blue-600 uppercase ml-1 tracking-tighter flex items-center gap-1">
                  <FaUniversity size={10} /> Bank
                </label>
                <input
                  type="number"
                  name="paid_bank"
                  value={form.paid_bank}
                  onChange={handleAmountChange}
                  className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-center text-blue-700 focus:border-blue-400 outline-none shadow-inner"
                />
              </div>
            </div>

            {(Number(form.paid_mobile) > 0 || Number(form.paid_bank) > 0) && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                {Number(form.paid_mobile) > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      name="mobile_operator"
                      value={form.mobile_operator}
                      onChange={handleChange}
                      className="border border-gray-200 p-2 rounded-lg text-xs font-bold outline-none bg-white"
                    >
                      <option value="">Operator</option>
                      <option value="bkash">bKash</option>
                      <option value="nagad">Nagad</option>
                      <option value="rocket">Rocket</option>
                    </select>
                    <input
                      name="transaction_id"
                      value={form.transaction_id}
                      onChange={handleChange}
                      className="border border-gray-200 p-2 rounded-lg text-xs font-bold outline-none bg-white"
                      placeholder="TxID"
                    />
                  </div>
                )}
                {Number(form.paid_bank) > 0 && (
                  <input
                    name="bank_name"
                    value={form.bank_name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-2 rounded-lg text-xs font-bold outline-none bg-white"
                    placeholder="Bank Name / Reference"
                  />
                )}
              </div>
            )}
          </div>

          {/* ── Refund exceeds warning ── */}
          {refundExceedsAdvance && (
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-start gap-2">
              <AlertTriangle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-rose-800 font-semibold leading-relaxed">
                Refund amount ৳{totalAmount.toLocaleString()} — available advance only ৳
                {availableAdvance.toLocaleString()}. কমিয়ে দিন।
              </p>
            </div>
          )}

          {/* ── Note ── */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <FileText size={12} className="text-amber-500" />
              {isRefund ? 'Refund Note' : 'Payment Note'}
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows="2"
              className="w-full border border-gray-200 p-3 rounded-2xl text-xs font-bold text-gray-700 focus:border-gray-900 outline-none resize-none bg-gray-50/50"
              placeholder={isRefund ? "Reason for refund (e.g. undelivered goods)..." : "Any extra details..."}
            />
          </div>

          {/* ── Total box ── */}
          <div className={`${theme.bgDark} p-6 rounded-[2rem] flex justify-between items-center shadow-xl`}>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                {isRefund ? 'Total Refund' : 'Total Payment'}
              </p>
              <p className={`text-3xl font-black font-mono ${isRefund ? 'text-blue-300' : 'text-green-400'}`}>
                ৳{totalAmount.toLocaleString()}
              </p>
            </div>
            {selectedSupplier && (
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  New Balance
                </p>
                <p className={`text-xl font-black font-mono ${newBalance < 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                  ৳{newBalance.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {errors.message && (
            <p className="bg-rose-50 text-rose-600 p-3 rounded-xl border border-rose-100 text-[10px] font-black uppercase tracking-widest text-center">
              {errors.message}
            </p>
          )}
        </div>
      )}
    </BaseModal>
  );
};

export default AddSupplierDuePaymentModal;