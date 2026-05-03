// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import Select from "react-select";
// import AsyncSelect from "react-select/async";
// import BASE_URL_of_POS from "../../../posConfig";
// import { posSaleProductAPI } from "../../../context_or_provider/pos/Sale/saleProduct/productSaleAPI";
//
// const AddCustomerDueCollectionModal = ({ isOpen, onClose, onSuccess, customers = [] }) => {
//   const [form, setForm] = useState({
//     customer: "",
//     sale: "",
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
//   const [salesLoading, setSalesLoading] = useState(false);
//   const [customerSales, setCustomerSales] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [invoiceData, setInvoiceData] = useState(null);
//
//   // Auto update payment method based on inputs
//   useEffect(() => {
//     const counts = [Number(form.paid_cash) > 0, Number(form.paid_mobile) > 0, Number(form.paid_bank) > 0].filter(Boolean).length;
//     let method = "cash";
//     if (counts > 1) {
//       method = "hybrid";
//     } else if (Number(form.paid_mobile) > 0) {
//       method = "mobile_banking";
//     } else if (Number(form.paid_bank) > 0) {
//       method = "bank";
//     }
//     setForm(prev => ({ ...prev, payment_method: method }));
//   }, [form.paid_cash, form.paid_mobile, form.paid_bank]);
//
//   // Fetch customer sales when customer is selected
//   useEffect(() => {
//     if (form.customer && isOpen) {
//       const fetchSales = async () => {
//         setSalesLoading(true);
//         try {
//           const res = await posSaleProductAPI.getAll();
//           const salesData = Array.isArray(res.data) ? res.data : (res.data.results || []);
//           const filtered = salesData.filter(s => {
//              const custId = typeof s.customer === 'object' ? s.customer.id : s.customer;
//              return Number(custId) === Number(form.customer) && Number(s.due_amount) > 0;
//           });
//           setCustomerSales(filtered);
//         } catch (err) {
//           console.error("Failed to fetch customer sales:", err);
//         } finally {
//           setSalesLoading(false);
//         }
//       };
//       fetchSales();
//     } else {
//       setCustomerSales([]);
//       setForm(prev => ({ ...prev, sale: "" }));
//     }
//   }, [form.customer, isOpen]);
//
//   // Select Options
//   const customerOptions = useMemo(() =>
//     customers.map(c => ({ value: c.id, label: `${c.name} ${c.phone ? `(${c.phone})` : ""}` })),
//     [customers]
//   );
//
//   const saleOptions = useMemo(() =>
//     customerSales.map(s => ({ value: s.id, label: `#${s.invoice_no} (Due: ৳${s.due_amount})`, due: s.due_amount })),
//     [customerSales]
//   );
//
//   if (!isOpen) return null;
//
//   // 🔹 Global Invoice Search (Async)
//   const loadInvoiceOptions = async (inputValue) => {
//     if (!inputValue || inputValue.length < 1) return [];
//     try {
//       const res = await posSaleProductAPI.search(inputValue);
//       const salesData = Array.isArray(res.data) ? res.data : (res.data.results || []);
//       return salesData
//         .filter(s => Number(s.due_amount) > 0)
//         .map(s => ({
//           value: s.id,
//           label: `#${s.invoice_no} - ${s.customer_name} (Due: ৳${s.due_amount})`,
//           customer: typeof s.customer === 'object' ? s.customer.id : s.customer,
//           due: s.due_amount
//         }));
//     } catch (err) {
//       console.error(err);
//       return [];
//     }
//   };
//
//   const handleGlobalInvoiceSelect = (option) => {
//     if (option) {
//       setForm(prev => ({
//         ...prev,
//         customer: option.customer,
//         sale: option.value,
//         paid_cash: parseFloat(option.due),
//         paid_mobile: 0,
//         paid_bank: 0
//       }));
//     }
//   };
//
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };
//
//   const handleAmountChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
//   };
//
//   const handleCustomerSelect = (option) => {
//     setForm(prev => ({ ...prev, customer: option ? option.value : "", sale: "" }));
//   };
//
//   const handleSaleSelect = (option) => {
//     const saleId = option ? option.value : "";
//     setForm(prev => ({ ...prev, sale: saleId }));
//     if (option && Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank) === 0) {
//       setForm(prev => ({ ...prev, paid_cash: parseFloat(option.due) }));
//     }
//   };
//
//   const selectedCustomer = customers.find((c) => c.id === Number(form.customer));
//   const totalAmount = Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank);
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrors({});
//     if (!form.customer || totalAmount <= 0) {
//       setErrors({ message: "Select a customer and enter a valid collection amount." });
//       setLoading(false);
//       return;
//     }
//     try {
//       const res = await axios.post(`${BASE_URL_of_POS}/api/sale/due-collections/`, { ...form, amount: totalAmount, sale: form.sale || null });
//       setInvoiceData(res.data);
//       setShowSuccess(true);
//       onSuccess?.(res.data);
//     } catch (err) {
//       if (err.response?.data) setErrors(err.response.data);
//       else alert("Network error");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const customSelectStyles = {
//     control: (base) => ({ ...base, borderRadius: '0.75rem', padding: '0.2rem', borderWidth: '2px', borderColor: '#f3f4f6', '&:hover': { borderColor: '#3b82f6' } }),
//     option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white', color: state.isSelected ? 'white' : '#1f2937', fontWeight: 'bold' }),
//     menuPortal: base => ({ ...base, zIndex: 9999 })
//   };
//
//   const handlePrint = () => {
//     if (!invoiceData || !selectedCustomer) return;
//     const prevDue = Number(selectedCustomer.due_amount || 0);
//     const amountCollected = Number(invoiceData.amount || 0);
//     const currDue = prevDue - amountCollected;
//     const win = window.open("", "_blank");
//     win.document.write(`
//       <html><head><title>Receipt</title><style>body{font-family:monospace;padding:20px;max-width:300px;margin:0 auto;border:1px solid #000;}.header{text-align:center;border-bottom:1px dashed #000;padding-bottom:10px;}.row{display:flex;justify-content:space-between;margin:5px 0;font-size:12px;}.bold{font-weight:bold;}.footer{text-align:center;margin-top:15px;font-size:10px;border-top:1px dashed #000;padding-top:5px;}</style></head>
//       <body><div class="header"><h3>DUE COLLECTION</h3><p>#${invoiceData.invoice_no}</p></div><div class="row"><span>Date:</span><span>${new Date(invoiceData.created_at).toLocaleDateString()}</span></div><div class="row"><span>Customer:</span><span>${invoiceData.customer_name}</span></div>${invoiceData.sale_invoice_no ? `<div class="row"><span>Invoice:</span><span>#${invoiceData.sale_invoice_no}</span></div>` : ''}<hr/><div class="row"><span>Old Due:</span><span>৳${prevDue.toFixed(2)}</span></div><div class="row bold"><span>Collected:</span><span>৳${amountCollected.toFixed(2)}</span></div><div class="row bold" style="border-top:1px solid #000"><span>New Due:</span><span>৳${currDue.toFixed(2)}</span></div><div style="margin-top:10px;font-size:10px"><b>BREAKDOWN:</b>${Number(invoiceData.paid_cash)>0?`<div class="row"><span>Cash:</span><span>৳${invoiceData.paid_cash}</span></div>`:''}${Number(invoiceData.paid_mobile)>0?`<div class="row"><span>Mobile:</span><span>৳${invoiceData.paid_mobile}</span></div>`:''}${Number(invoiceData.paid_bank)>0?`<div class="row"><span>Bank:</span><span>৳${invoiceData.paid_bank}</span></div>`:''}</div><div class="footer"><p>Thank you!</p></div><script>window.print();</script></body></html>
//     `);
//     win.document.close();
//   };
//
//   const handleClose = () => {
//     setForm({ customer: "", sale: "", paid_cash: 0, paid_mobile: 0, paid_bank: 0, payment_method: "cash", mobile_operator: "", transaction_id: "", bank_name: "", note: "" });
//     setShowSuccess(false); setInvoiceData(null); setErrors({}); onClose();
//   };
//
//   if (showSuccess && invoiceData) {
//     const prevDue = Number(selectedCustomer?.due_amount || 0);
//     return (
//       <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
//           <div className="bg-blue-600 p-8 text-center text-white">
//             <div className="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-4"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>
//             <h2 className="text-xl font-black uppercase">Success!</h2>
//           </div>
//           <div className="p-6 space-y-4">
//             <div className="bg-gray-50 p-4 rounded-2xl space-y-2 text-sm">
//               <div className="flex justify-between"><span>Customer</span><span className="font-bold">{invoiceData.customer_name}</span></div>
//               <div className="flex justify-between"><span>Amount Collected</span><span className="font-bold text-green-600">৳{Number(invoiceData.amount).toFixed(2)}</span></div>
//               <div className="flex justify-between border-t pt-2 mt-2"><span>New Balance</span><span className="font-black text-red-600">৳{(prevDue - Number(invoiceData.amount)).toFixed(2)}</span></div>
//             </div>
//             <div className="grid grid-cols-2 gap-3"><button onClick={handlePrint} className="py-3 bg-gray-900 text-white rounded-xl font-bold flex justify-center gap-2 text-sm">Print</button><button onClick={handleClose} className="py-3 border-2 rounded-xl font-bold text-sm">Done</button></div>
//           </div>
//         </div>
//       </div>
//     );
//   }
//
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4">
//       <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
//         <div className="px-6 py-4 border-b bg-gray-900 text-white rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
//           <div><h2 className="text-xl font-black uppercase tracking-tight">Due Collection</h2><p className="text-[10px] text-gray-400 font-bold uppercase">Record Payment</p></div>
//           <button onClick={handleClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
//         </div>
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div className="bg-blue-600/5 p-4 rounded-2xl border-2 border-blue-100">
//              <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 font-sans">Quick Search Invoice (Type #)</label>
//              <AsyncSelect
//                 cacheOptions defaultOptions loadOptions={loadInvoiceOptions} onChange={handleGlobalInvoiceSelect}
//                 placeholder="Type invoice number to search..." styles={customSelectStyles} isClearable
//                 menuPortalTarget={document.body} menuPosition="fixed"
//              />
//              <p className="text-[9px] text-gray-400 mt-2 italic">* Find invoices across all customers easily.</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Select Customer *</label>
//               <Select options={customerOptions} onChange={handleCustomerSelect} placeholder="Search name..." isClearable styles={customSelectStyles} value={customerOptions.find(o => o.value === Number(form.customer))} menuPortalTarget={document.body} menuPosition="fixed" />
//             </div>
//             <div>
//               <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Linked Invoice</label>
//               <Select options={saleOptions} onChange={handleSaleSelect} placeholder="Select invoice..." isClearable styles={customSelectStyles} isDisabled={!form.customer || salesLoading} value={saleOptions.find(o => o.value === Number(form.sale))} menuPortalTarget={document.body} menuPosition="fixed" />
//             </div>
//           </div>
//           {selectedCustomer && (
//             <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 flex justify-between items-center"><span className="text-[10px] font-black text-blue-600 uppercase">Outstanding Due</span><span className="text-xl font-black text-blue-900">৳{Number(selectedCustomer.due_amount).toFixed(2)}</span></div>
//           )}
//           <div className="bg-gray-50 p-5 rounded-2xl border-2 border-gray-100 space-y-4">
//              <label className="block text-[10px] font-black text-gray-500 uppercase">Collection Breakdown</label>
//              <div className="grid grid-cols-3 gap-4">
//                 <div><label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Cash</label><input type="number" name="paid_cash" value={form.paid_cash} onChange={handleAmountChange} className="w-full border-2 border-white p-2 rounded-xl font-black text-center text-green-700 focus:border-green-500 outline-none" /></div>
//                 <div><label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Mobile</label><input type="number" name="paid_mobile" value={form.paid_mobile} onChange={handleAmountChange} className="w-full border-2 border-white p-2 rounded-xl font-black text-center text-orange-700 focus:border-orange-500 outline-none" /></div>
//                 <div><label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Bank</label><input type="number" name="paid_bank" value={form.paid_bank} onChange={handleAmountChange} className="w-full border-2 border-white p-2 rounded-xl font-black text-center text-blue-700 focus:border-blue-500 outline-none" /></div>
//              </div>
//              {Number(form.paid_mobile) > 0 && (
//                 <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border-2 border-orange-50">
//                     <div><label className="text-[9px] font-black text-orange-600 uppercase">Operator</label><select name="mobile_operator" value={form.mobile_operator} onChange={handleChange} className="w-full border-2 border-gray-50 p-2 rounded-lg font-bold"><option value="">Select</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="rocket">Rocket</option></select></div>
//                     <div><label className="text-[9px] font-black text-orange-600 uppercase">TxID</label><input name="transaction_id" value={form.transaction_id} onChange={handleChange} className="w-full border-2 border-gray-50 p-2 rounded-lg" /></div>
//                 </div>
//              )}
//              {Number(form.paid_bank) > 0 && (
//                 <div className="p-3 bg-white rounded-xl border-2 border-blue-50"><label className="text-[9px] font-black text-blue-600 uppercase block mb-1">Bank / Ref</label><input name="bank_name" value={form.bank_name} onChange={handleChange} className="w-full border-2 border-gray-50 p-2 rounded-lg font-bold" /></div>
//              )}
//           </div>
//           <div className="bg-gray-900 p-5 rounded-2xl flex justify-between items-center shadow-xl">
//              <div className="text-white"><p className="text-[10px] font-black text-gray-500 uppercase">Total Collection</p><p className="text-2xl font-black text-green-400">৳{totalAmount.toFixed(2)}</p></div>
//              {selectedCustomer && (
//                 <div className="text-right"><p className="text-[10px] font-black text-gray-500 uppercase">New Balance</p><p className="text-xl font-black text-red-400">৳{(Number(selectedCustomer.due_amount) - totalAmount).toFixed(2)}</p></div>
//              )}
//           </div>
//           <div className="flex justify-end gap-3 pt-4 border-t border-gray-100"><button type="button" onClick={handleClose} className="px-6 py-3 font-bold text-gray-400 text-xs uppercase">Discard</button><button type="submit" disabled={loading || totalAmount <= 0} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-xs shadow-xl active:scale-95">{loading ? "Wait..." : "Collect Due"}</button></div>
//         </form>
//       </div>
//     </div>
//   );
// };
//
// export default AddCustomerDueCollectionModal;


import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { 
  FaMoneyBillWave, FaMobileAlt, FaUniversity, 
  FaRegStickyNote, FaCheckCircle, FaTimes,
  FaCogs, FaHashtag, FaInfoCircle, FaSearch,
  FaPlusCircle, FaReceipt, FaPrint, FaUser
} from "react-icons/fa";
import BASE_URL_of_POS from "../../../posConfig";
import { posSaleProductAPI } from "../../../context_or_provider/pos/Sale/saleProduct/productSaleAPI";

const AddCustomerDueCollectionModal = ({ isOpen, onClose, onSuccess, customers = [] }) => {
  const [form, setForm] = useState({
    customer: "",
    sale: "",
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
  const [salesLoading, setSalesLoading] = useState(false);
  const [customerSales, setCustomerSales] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

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

  useEffect(() => {
    if (form.customer && isOpen) {
      const fetchSales = async () => {
        setSalesLoading(true);
        try {
          const res = await posSaleProductAPI.getAll();
          const salesData = Array.isArray(res.data) ? res.data : (res.data.results || []);
          const filtered = salesData.filter(s => {
             const custId = typeof s.customer === 'object' ? s.customer.id : s.customer;
             return Number(custId) === Number(form.customer) && Number(s.due_amount) > 0;
          });
          setCustomerSales(filtered);
        } catch (err) {
          console.error("Failed to fetch customer sales:", err);
        } finally {
          setSalesLoading(false);
        }
      };
      fetchSales();
    } else {
      setCustomerSales([]);
      setForm(prev => ({ ...prev, sale: "" }));
    }
  }, [form.customer, isOpen]);

  const customerOptions = useMemo(() =>
    customers.map(c => ({ value: c.id, label: `${c.name} ${c.phone ? `(${c.phone})` : ""}`, due: c.due_amount })),
    [customers]
  );

  const saleOptions = useMemo(() =>
    customerSales.map(s => ({ value: s.id, label: `#${s.invoice_no} (Due: ৳${s.due_amount})`, due: s.due_amount })),
    [customerSales]
  );

  if (!isOpen) return null;

  const loadInvoiceOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 1) return [];
    try {
      const res = await posSaleProductAPI.search(inputValue);
      const salesData = Array.isArray(res.data) ? res.data : (res.data.results || []);
      return salesData
        .filter(s => Number(s.due_amount) > 0)
        .map(s => ({
          value: s.id,
          label: `#${s.invoice_no} - ${s.customer_name} (Due: ৳${s.due_amount})`,
          customer: typeof s.customer === 'object' ? s.customer.id : s.customer,
          due: s.due_amount
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
        customer: option.customer,
        sale: option.value,
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
    const val = value === "" ? 0 : parseFloat(value);
    setForm((prev) => ({ ...prev, [name]: isNaN(val) ? 0 : val }));
  };

  const handleCustomerSelect = (option) => {
    setForm(prev => ({ ...prev, customer: option ? option.value : "", sale: "" }));
  };

  const handleSaleSelect = (option) => {
    const saleId = option ? option.value : "";
    setForm(prev => ({ ...prev, sale: saleId }));
    if (option && Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank) === 0) {
      setForm(prev => ({ ...prev, paid_cash: parseFloat(option.due) }));
    }
  };

  const selectedCustomer = customers.find((c) => c.id === Number(form.customer));
  const totalAmount = Number(form.paid_cash) + Number(form.paid_mobile) + Number(form.paid_bank);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    if (!form.customer || totalAmount <= 0) {
      setErrors({ message: "Select a customer and enter a valid collection amount." });
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post(`${BASE_URL_of_POS}/api/sale/due-collections/`, { ...form, amount: totalAmount, sale: form.sale || null });
      setInvoiceData(res.data);
      setShowSuccess(true);
      onSuccess?.(res.data);
    } catch (err) {
      if (err.response?.data) setErrors(err.response.data);
      else alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const customSelectStyles = {
    control: (base) => ({ 
      ...base, 
      borderRadius: '1rem', 
      padding: '0.4rem', 
      borderWidth: '2px', 
      borderColor: '#f3f4f6', 
      boxShadow: 'none',
      '&:hover': { borderColor: '#3b82f6' } 
    }),
    option: (base, state) => ({ 
      ...base, 
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white', 
      color: state.isSelected ? 'white' : '#1f2937', 
      fontWeight: 'bold',
      padding: '12px'
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    placeholder: (base) => ({ ...base, color: '#9ca3af', fontWeight: '600', fontSize: '14px' }),
    singleValue: (base) => ({ ...base, fontWeight: '700', color: '#111827' })
  };

  const handlePrint = () => {
    if (!invoiceData) return;
    const printWindow = window.open("", "_blank", "width=800,height=900");
    const content = `
      <html>
        <head>
          <title>Collection Voucher #${invoiceData.invoice_no}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #111827; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: start; border-bottom: 4px solid #111827; padding-bottom: 20px; margin-bottom: 30px; }
            .company-info h1 { margin: 0; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.025em; }
            .voucher-title { text-align: right; }
            .voucher-title h2 { margin: 0; font-size: 32px; font-weight: 900; text-transform: uppercase; color: #10b981; }
            .info-section h3 { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #6b7280; letter-spacing: 0.1em; margin-bottom: 8px; }
            .info-section p { margin: 0; font-weight: 700; font-size: 16px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table th { background: #f9fafb; text-align: left; padding: 12px; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #4b5563; border-bottom: 2px solid #e5e7eb; }
            .table td { padding: 15px 12px; border-bottom: 1px solid #f3f4f6; font-weight: 600; font-size: 14px; }
            .total-box { background: #111827; color: white; padding: 20px 40px; border-radius: 12px; text-align: right; float: right; }
            .total-label { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #9ca3af; margin-bottom: 5px; }
            .total-amount { font-size: 32px; font-weight: 900; }
            .footer { margin-top: 60px; display: flex; justify-content: space-between; clear: both; }
            .signature-line { border-top: 2px solid #e5e7eb; width: 200px; text-align: center; padding-top: 10px; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info"><h1>MY SHOP POS</h1><p>Customer Due Collection Voucher</p></div>
            <div class="voucher-title"><h2>Receipt</h2><p>#${invoiceData.invoice_no}</p></div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
            <div class="info-section"><h3>Customer</h3><p>${invoiceData.customer_name}</p></div>
            <div class="info-section" style="text-align: right;"><h3>Date</h3><p>${new Date(invoiceData.created_at).toLocaleString()}</p></div>
          </div>
          <table class="table">
            <thead><tr><th>Description</th><th>Method</th><th style="text-align: right;">Amount</th></tr></thead>
            <tbody>
              ${Number(invoiceData.paid_cash) > 0 ? `<tr><td>Cash Collection</td><td>CASH</td><td style="text-align: right;">৳${parseFloat(invoiceData.paid_cash).toLocaleString()}</td></tr>` : ''}
              ${Number(invoiceData.paid_mobile) > 0 ? `<tr><td>Mobile (${invoiceData.mobile_operator})</td><td>MOBILE</td><td style="text-align: right;">৳${parseFloat(invoiceData.paid_mobile).toLocaleString()}</td></tr>` : ''}
              ${Number(invoiceData.paid_bank) > 0 ? `<tr><td>Bank (${invoiceData.bank_name})</td><td>BANK</td><td style="text-align: right;">৳${parseFloat(invoiceData.paid_bank).toLocaleString()}</td></tr>` : ''}
            </tbody>
          </table>
          <div class="total-box"><div class="total-label">Total Received</div><div class="total-amount">৳${parseFloat(invoiceData.amount).toLocaleString()}</div></div>
          <div class="footer"><div class="signature-line">Customer Signature</div><div class="signature-line">Received By</div></div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  const handleClose = () => {
    setForm({ customer: "", sale: "", paid_cash: 0, paid_mobile: 0, paid_bank: 0, payment_method: "cash", mobile_operator: "", transaction_id: "", bank_name: "", note: "" });
    setShowSuccess(false); setInvoiceData(null); setErrors({}); onClose();
  };

  if (showSuccess && invoiceData) {
    const prevDue = Number(selectedCustomer?.due_amount || 0);
    return (
      <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300">
        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/20">
          <div className="bg-emerald-600 p-10 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="w-24 h-24 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl backdrop-blur-sm">
                <FaCheckCircle className="text-4xl text-white" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Collection Recorded</h2>
            <p className="text-emerald-100 mt-2 font-bold uppercase text-[10px] tracking-widest">Transaction Successful</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="bg-gray-50 p-6 rounded-[2rem] space-y-4 text-sm border border-gray-100">
              <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Customer</span>
                  <span className="font-black text-gray-900">{invoiceData.customer_name}</span>
              </div>
              <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-4">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Amount Collected</span>
                  <span className="font-black text-2xl text-emerald-600 font-mono">৳{Number(invoiceData.amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-4">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">New Balance</span>
                  <span className="font-black text-lg text-red-600 font-mono">৳{(prevDue - Number(invoiceData.amount)).toLocaleString()}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <button onClick={handlePrint} className="py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg">
                    <FaPrint /> Print Receipt
                </button>
                <button onClick={handleClose} className="py-4 border-2 border-gray-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition">
                    Done
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl max-h-[95vh] flex flex-col border border-white/20">
        <div className="px-8 py-6 bg-gray-900 text-white rounded-t-[2.5rem] flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-emerald-600/30">
                  <FaPlusCircle />
              </div>
              <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">New Collection</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Record Customer Receipt</p>
              </div>
          </div>
          <button onClick={handleClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-red-500 transition-all duration-300 group">
              <FaTimes className="group-hover:rotate-90 transition-transform text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
          {/* Quick Search */}
          <div className="bg-emerald-600/5 p-6 rounded-[2rem] border-2 border-emerald-100 space-y-4">
             <div className="flex items-center gap-2">
                 <FaSearch className="text-emerald-600" />
                 <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Quick Search Invoice</label>
             </div>
             <AsyncSelect
                cacheOptions defaultOptions loadOptions={loadInvoiceOptions} onChange={handleGlobalInvoiceSelect}
                placeholder="Type sale invoice number (e.g. #1001)..." styles={customSelectStyles} isClearable
                menuPortalTarget={document.body} menuPosition="fixed"
             />
             <p className="text-[9px] text-gray-400 font-bold italic uppercase tracking-tighter">* Searches across all customers with outstanding due.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Customer *</label>
              <Select options={customerOptions} onChange={handleCustomerSelect} placeholder="Search customer..." isClearable styles={customSelectStyles} value={customerOptions.find(o => o.value === Number(form.customer))} menuPortalTarget={document.body} menuPosition="fixed" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Linked Invoice</label>
              <Select options={saleOptions} onChange={handleSaleSelect} placeholder="Select pending invoice..." isClearable styles={customSelectStyles} isDisabled={!form.customer || salesLoading} value={saleOptions.find(o => o.value === Number(form.sale))} menuPortalTarget={document.body} menuPosition="fixed" />
            </div>
          </div>

          {selectedCustomer && (
            <div className="bg-emerald-600 p-8 rounded-[2rem] flex justify-between items-center shadow-xl shadow-emerald-600/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                <div>
                    <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.3em] mb-1">Outstanding Due</p>
                    <p className="text-4xl font-black text-white leading-none">৳{Number(selectedCustomer.due_amount).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white/50"><FaUser/></div>
            </div>
          )}

          {/* Breakdown Section */}
          <div className="space-y-6">
             <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Payment Breakdown</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <label className="text-[9px] font-black text-emerald-600 uppercase mb-2 ml-1 flex items-center gap-1.5"><FaMoneyBillWave /> Cash</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-sm">৳</span>
                        <input type="number" name="paid_cash" value={form.paid_cash} onChange={handleAmountChange} className="w-full bg-emerald-50/30 border-2 border-emerald-100 pl-8 pr-4 py-4 rounded-2xl font-black text-emerald-700 focus:bg-white focus:border-emerald-500 transition-all outline-none" />
                    </div>
                </div>
                <div className="relative">
                    <label className="text-[9px] font-black text-purple-600 uppercase mb-2 ml-1 flex items-center gap-1.5"><FaMobileAlt /> Mobile</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600 font-black text-sm">৳</span>
                        <input type="number" name="paid_mobile" value={form.paid_mobile} onChange={handleAmountChange} className="w-full bg-purple-50/30 border-2 border-purple-100 pl-8 pr-4 py-4 rounded-2xl font-black text-purple-700 focus:bg-white focus:border-purple-500 transition-all outline-none" />
                    </div>
                </div>
                <div className="relative">
                    <label className="text-[9px] font-black text-blue-600 uppercase mb-2 ml-1 flex items-center gap-1.5"><FaUniversity /> Bank</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-black text-sm">৳</span>
                        <input type="number" name="paid_bank" value={form.paid_bank} onChange={handleAmountChange} className="w-full bg-blue-50/30 border-2 border-blue-100 pl-8 pr-4 py-4 rounded-2xl font-black text-blue-700 focus:bg-white focus:border-blue-500 transition-all outline-none" />
                    </div>
                </div>
             </div>

             {Number(form.paid_mobile) > 0 && (
                <div className="grid grid-cols-2 gap-4 p-6 bg-purple-50/50 rounded-3xl border border-purple-100 animate-in slide-in-from-top-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-purple-600 uppercase ml-1 tracking-widest">Operator</label>
                        <select name="mobile_operator" value={form.mobile_operator} onChange={handleChange} className="w-full bg-white border-2 border-purple-100 p-3 rounded-xl font-bold text-sm focus:border-purple-500 outline-none transition-all">
                            <option value="">Select</option>
                            <option value="bkash">bKash</option>
                            <option value="nagad">Nagad</option>
                            <option value="rocket">Rocket</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-purple-600 uppercase ml-1 tracking-widest">Transaction ID</label>
                        <div className="relative">
                            <FaHashtag className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" />
                            <input name="transaction_id" value={form.transaction_id} onChange={handleChange} className="w-full bg-white border-2 border-purple-100 pl-9 pr-3 py-3 rounded-xl text-sm font-bold focus:border-purple-500 outline-none transition-all" />
                        </div>
                    </div>
                </div>
             )}

             {Number(form.paid_bank) > 0 && (
                <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 animate-in slide-in-from-top-4 space-y-2">
                    <label className="text-[9px] font-black text-blue-600 uppercase ml-1 tracking-widest">Bank Name / Reference</label>
                    <div className="relative">
                        <FaInfoCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                        <input name="bank_name" value={form.bank_name} onChange={handleChange} placeholder="e.g. City Bank Deposit" className="w-full bg-white border-2 border-blue-100 pl-9 pr-3 py-3 rounded-xl font-bold text-sm focus:border-blue-500 outline-none transition-all" />
                    </div>
                </div>
             )}
          </div>

          <div className="bg-gray-900 p-8 rounded-[2.5rem] flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
             <div className="relative z-10 text-center sm:text-left">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Total Collection</p>
                <p className="text-4xl font-black text-white leading-none"><span className="text-emerald-500 text-2xl mr-1">৳</span>{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
             </div>
             {selectedCustomer && (
                <div className="relative z-10 text-center sm:text-right border-t sm:border-t-0 sm:border-l border-gray-800 pt-6 sm:pt-0 sm:pl-8">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">New Balance</p>
                    <p className="text-2xl font-black text-red-500 leading-none">৳{(Number(selectedCustomer.due_amount) - totalAmount).toLocaleString()}</p>
                </div>
             )}
          </div>

          <div className="flex gap-4 pt-4 border-t-2 border-dashed border-gray-100">
              <button type="button" onClick={handleClose} className="flex-1 px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.3em] hover:text-gray-900 transition-colors">Discard</button>
              <button type="submit" disabled={loading || totalAmount <= 0} className="flex-[2] bg-blue-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-blue-600/30 active:scale-95 hover:bg-blue-500 transition-all flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <><FaReceipt /> Record Collection</>
                  )}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerDueCollectionModal;
