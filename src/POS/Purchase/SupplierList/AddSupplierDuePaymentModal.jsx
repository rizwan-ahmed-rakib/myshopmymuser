import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import BASE_URL_of_POS from "../../../posConfig";
import { posPurchaseProductAPI } from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";

const AddSupplierDuePaymentModal = ({ isOpen, onClose, onSuccess, suppliers = [] }) => {
  const [form, setForm] = useState({
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

  // Auto update payment method based on inputs
  useEffect(() => {
    const counts = [Number(form.paid_cash) > 0, Number(form.paid_mobile) > 0, Number(form.paid_bank) > 0].filter(Boolean).length;
    let method = "cash";
    if (counts > 1) {
      method = "hybrid";
    } else if (Number(form.paid_mobile) > 0) {
      method = "mobile_banking";
    } else if (Number(form.paid_bank) > 0) {
      method = "bank";
    }
    setForm(prev => ({ ...prev, payment_method: method }));
  }, [form.paid_cash, form.paid_mobile, form.paid_bank]);

  // Fetch supplier purchases when supplier is selected
  useEffect(() => {
    if (form.supplier && isOpen) {
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
          console.error("Failed to fetch supplier purchases:", err);
        } finally {
          setPurchasesLoading(false);
        }
      };
      fetchPurchases();
    } else {
      setSupplierPurchases([]);
      setForm(prev => ({ ...prev, purchase: "" }));
    }
  }, [form.supplier, isOpen]);

  // Select Options
  const supplierOptions = useMemo(() => 
    suppliers.map(s => ({ value: s.id, label: `${s.name} ${s.phone ? `(${s.phone})` : ""}` })),
    [suppliers]
  );

  const purchaseOptions = useMemo(() => 
    supplierPurchases.map(p => ({ value: p.id, label: `#${p.invoice_no} (Due: ৳${p.due_amount})`, due: p.due_amount })),
    [supplierPurchases]
  );

  if (!isOpen) return null;

  // 🔹 Global Invoice Search (Async)
  const loadInvoiceOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 1) return [];
    try {
      const res = await posPurchaseProductAPI.search(inputValue);
      const purchasesData = Array.isArray(res.data) ? res.data : (res.data.results || []);
      return purchasesData
        .filter(p => Number(p.due_amount) > 0)
        .map(p => ({
          value: p.id,
          label: `#${p.invoice_no} - ${p.supplier_name} (Due: ৳${p.due_amount})`,
          supplier: typeof p.supplier === 'object' ? p.supplier.id : p.supplier,
          due: p.due_amount
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
        paid_bank: 0
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSupplierSelect = (option) => {
    setForm(prev => ({ ...prev, supplier: option ? option.value : "", purchase: "" }));
  };

  const handlePurchaseSelect = (option) => {
    const purchaseId = option ? option.value : "";
    setForm(prev => ({ ...prev, purchase: purchaseId }));
    if (option && Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank) === 0) {
      setForm(prev => ({ ...prev, paid_cash: parseFloat(option.due) }));
    }
  };

  const selectedSupplier = suppliers.find((s) => s.id === Number(form.supplier));
  const totalAmount = Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    if (!form.supplier || totalAmount <= 0) {
      setErrors({ message: "Select a supplier and enter a valid payment amount." });
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post(`${BASE_URL_of_POS}/api/purchase/due-payments/`, { ...form, amount: totalAmount, purchase: form.purchase || null });
      setInvoiceData(res.data);
      setShowSuccess(true);
      onSuccess?.(res.data);
    } catch (err) {
      if (err.response?.data) setErrors(err.response.data);
      else alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  const customSelectStyles = {
    control: (base) => ({ ...base, borderRadius: '0.75rem', padding: '0.2rem', borderWidth: '2px', borderColor: '#f3f4f6', '&:hover': { borderColor: '#10b981' } }),
    option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#ecfdf5' : 'white', color: state.isSelected ? 'white' : '#1f2937', fontWeight: 'bold' }),
    menuPortal: base => ({ ...base, zIndex: 9999 })
  };

  const handlePrint = () => {
    if (!invoiceData || !selectedSupplier) return;
    const prevDue = Number(selectedSupplier.due_amount || 0);
    const amountPaid = Number(invoiceData.amount || 0);
    const currDue = prevDue - amountPaid;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Receipt</title><style>body{font-family:monospace;padding:20px;max-width:300px;margin:0 auto;border:1px solid #000;}.header{text-align:center;border-bottom:1px dashed #000;padding-bottom:10px;}.row{display:flex;justify-content:space-between;margin:5px 0;font-size:12px;}.bold{font-weight:bold;}.footer{text-align:center;margin-top:15px;font-size:10px;border-top:1px dashed #000;padding-top:5px;}</style></head>
      <body><div class="header"><h3>DUE PAYMENT</h3><p>#${invoiceData.invoice_no}</p></div><div class="row"><span>Date:</span><span>${new Date(invoiceData.created_at).toLocaleDateString()}</span></div><div class="row"><span>Supplier:</span><span>${invoiceData.supplier_name}</span></div>${invoiceData.purchase_invoice_no ? `<div class="row"><span>Invoice:</span><span>#${invoiceData.purchase_invoice_no}</span></div>` : ''}<hr/><div class="row"><span>Old Due:</span><span>৳${prevDue.toFixed(2)}</span></div><div class="row bold"><span>Paid:</span><span>৳${amountPaid.toFixed(2)}</span></div><div class="row bold" style="border-top:1px solid #000"><span>Remaining:</span><span>৳${currDue.toFixed(2)}</span></div><div style="margin-top:10px;font-size:10px"><b>BREAKDOWN:</b>${Number(invoiceData.paid_cash)>0?`<div class="row"><span>Cash:</span><span>৳${invoiceData.paid_cash}</span></div>`:''}${Number(invoiceData.paid_mobile)>0?`<div class="row"><span>Mobile:</span><span>৳${invoiceData.paid_mobile}</span></div>`:''}${Number(invoiceData.paid_bank)>0?`<div class="row"><span>Bank:</span><span>৳${invoiceData.paid_bank}</span></div>`:''}</div><div class="footer"><p>Payment Recorded</p></div><script>window.print();</script></body></html>
    `);
    win.document.close();
  };

  const handleClose = () => {
    setForm({ supplier: "", purchase: "", paid_cash: 0, paid_mobile: 0, paid_bank: 0, payment_method: "cash", mobile_operator: "", transaction_id: "", bank_name: "", note: "" });
    setShowSuccess(false); setInvoiceData(null); setErrors({}); onClose();
  };

  if (showSuccess && invoiceData) {
    const prevDue = Number(selectedSupplier?.due_amount || 0);
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-green-600 p-8 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-4"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>
            <h2 className="text-xl font-black uppercase">Success!</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 p-4 rounded-2xl space-y-2 text-sm">
              <div className="flex justify-between"><span>Supplier</span><span className="font-bold">{invoiceData.supplier_name}</span></div>
              <div className="flex justify-between"><span>Amount Paid</span><span className="font-bold text-green-600">৳{Number(invoiceData.amount).toFixed(2)}</span></div>
              <div className="flex justify-between border-t pt-2 mt-2"><span>Remaining Due</span><span className="font-black text-red-600">৳{(prevDue - Number(invoiceData.amount)).toFixed(2)}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3"><button onClick={handlePrint} className="py-3 bg-gray-900 text-white rounded-xl font-bold flex justify-center gap-2 text-sm">Print</button><button onClick={handleClose} className="py-3 border-2 rounded-xl font-bold text-sm">Done</button></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b bg-gray-900 text-white rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
          <div><h2 className="text-xl font-black uppercase tracking-tight">Supplier Due Payment</h2><p className="text-[10px] text-gray-400 font-bold uppercase">Record Payment</p></div>
          <button onClick={handleClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-green-600/5 p-4 rounded-2xl border-2 border-green-100">
             <label className="block text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Quick Search Invoice (Type #)</label>
             <AsyncSelect
                cacheOptions defaultOptions loadOptions={loadInvoiceOptions} onChange={handleGlobalInvoiceSelect}
                placeholder="Type invoice number to search..." styles={customSelectStyles} isClearable
                menuPortalTarget={document.body} menuPosition="fixed"
             />
             <p className="text-[9px] text-gray-400 mt-2 italic">* Find invoices across all suppliers easily.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Select Supplier *</label>
              <Select options={supplierOptions} onChange={handleSupplierSelect} placeholder="Search name..." isClearable styles={customSelectStyles} value={supplierOptions.find(o => o.value === Number(form.supplier))} menuPortalTarget={document.body} menuPosition="fixed" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Linked Invoice</label>
              <Select options={purchaseOptions} onChange={handlePurchaseSelect} placeholder="Select invoice..." isClearable styles={customSelectStyles} isDisabled={!form.supplier || purchasesLoading} value={purchaseOptions.find(o => o.value === Number(form.purchase))} menuPortalTarget={document.body} menuPosition="fixed" />
            </div>
          </div>
          {selectedSupplier && (
            <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 flex justify-between items-center"><span className="text-[10px] font-black text-blue-600 uppercase">Current Due</span><span className="text-xl font-black text-blue-900">৳{Number(selectedSupplier.due_amount).toFixed(2)}</span></div>
          )}
          <div className="bg-gray-50 p-5 rounded-2xl border-2 border-gray-100 space-y-4">
             <label className="block text-[10px] font-black text-gray-500 uppercase">Payment Breakdown</label>
             <div className="grid grid-cols-3 gap-4">
                <div><label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Cash</label><input type="number" name="paid_cash" value={form.paid_cash} onChange={handleAmountChange} className="w-full border-2 border-white p-2 rounded-xl font-black text-center text-green-700 focus:border-green-500 outline-none" /></div>
                <div><label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Mobile</label><input type="number" name="paid_mobile" value={form.paid_mobile} onChange={handleAmountChange} className="w-full border-2 border-white p-2 rounded-xl font-black text-center text-orange-700 focus:border-orange-500 outline-none" /></div>
                <div><label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Bank</label><input type="number" name="paid_bank" value={form.paid_bank} onChange={handleAmountChange} className="w-full border-2 border-white p-2 rounded-xl font-black text-center text-blue-700 focus:border-blue-500 outline-none" /></div>
             </div>
             {Number(form.paid_mobile) > 0 && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border-2 border-orange-50">
                    <div><label className="text-[9px] font-black text-orange-600 uppercase">Operator</label><select name="mobile_operator" value={form.mobile_operator} onChange={handleChange} className="w-full border-2 border-gray-50 p-2 rounded-lg font-bold"><option value="">Select</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="rocket">Rocket</option></select></div>
                    <div><label className="text-[9px] font-black text-orange-600 uppercase">TxID</label><input name="transaction_id" value={form.transaction_id} onChange={handleChange} className="w-full border-2 border-gray-50 p-2 rounded-lg" /></div>
                </div>
             )}
             {Number(form.paid_bank) > 0 && (
                <div className="p-3 bg-white rounded-xl border-2 border-blue-50"><label className="text-[9px] font-black text-blue-600 uppercase block mb-1">Bank Name / Ref</label><input name="bank_name" value={form.bank_name} onChange={handleChange} className="w-full border-2 border-gray-50 p-2 rounded-lg font-bold" /></div>
             )}
          </div>
          <div className="bg-gray-900 p-5 rounded-2xl flex justify-between items-center shadow-xl">
             <div className="text-white"><p className="text-[10px] font-black text-gray-500 uppercase">Total Payment</p><p className="text-2xl font-black text-green-400">৳{totalAmount.toFixed(2)}</p></div>
             {selectedSupplier && (
                <div className="text-right"><p className="text-[10px] font-black text-gray-500 uppercase">Remaining Due</p><p className="text-xl font-black text-red-400">৳{(Number(selectedSupplier.due_amount) - totalAmount).toFixed(2)}</p></div>
             )}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100"><button type="button" onClick={handleClose} className="px-6 py-3 font-bold text-gray-400 text-xs uppercase">Discard</button><button type="submit" disabled={loading || totalAmount <= 0} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-xs shadow-xl active:scale-95">{loading ? "Wait..." : "Pay Due"}</button></div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierDuePaymentModal;
