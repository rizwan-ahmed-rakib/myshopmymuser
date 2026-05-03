import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaUndo, FaTruck, FaDollarSign, FaMoneyBillWave, 
  FaMobileAlt, FaUniversity, FaFilePdf, FaEdit, 
  FaInfoCircle, FaCalendarAlt, FaHashtag, FaStickyNote,
  FaArrowLeft, FaPrint, FaRegCalendarAlt, FaCheckCircle
} from "react-icons/fa";
import { posDuePaymentAPI } from "../../../context_or_provider/pos/Purchase/duePayment/duePaymentAPI";
import EditSupplierDuePaymentModal from "./EditSupplierDuePaymentModal";

const SupplierDuePaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const fetchItem = useCallback(async () => {
    try {
      const res = await posDuePaymentAPI.getById(id);
      setItem(res.data);
    } catch (err) {
      console.error("Error fetching payment details:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const handleEditSuccess = () => {
    fetchItem();
    setEditOpen(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (!item) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">!</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase">Record Not Found</h2>
        <p className="text-gray-500 font-medium mb-8">The payment record you are looking for might have been deleted or moved.</p>
        <button onClick={() => navigate(-1)} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-gray-800 transition">
          <FaArrowLeft /> Go Back
        </button>
      </div>
    </div>
  );

  const InfoCard = ({ icon, title, value, color = "text-gray-900", subValue }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${color.replace('text-', 'bg-').replace('600', '50')} ${color}`}>
          {icon}
        </div>
        <div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{title}</p>
            <p className={`text-lg font-black ${color} leading-none`}>{value}</p>
            {subValue && <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-tighter">{subValue}</p>}
        </div>
    </div>
  );

  const getMethodBadge = (method) => {
    const colors = {
      cash: "bg-green-100 text-green-700",
      bank: "bg-blue-100 text-blue-700",
      mobile: "bg-purple-100 text-purple-700",
      mobile_banking: "bg-purple-100 text-purple-700",
      hybrid: "bg-amber-100 text-amber-700"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${colors[method] || "bg-gray-100 text-gray-700"}`}>
        {method?.replace('_', ' ')}
      </span>
    );
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=800,height=900");
    const content = `
      <html>
        <head>
          <title>Payment Voucher #${item.invoice_no}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #111827; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: start; border-bottom: 4px solid #111827; padding-bottom: 20px; margin-bottom: 30px; }
            .company-info h1 { margin: 0; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.025em; }
            .voucher-title { text-align: right; }
            .voucher-title h2 { margin: 0; font-size: 32px; font-weight: 900; text-transform: uppercase; color: #2563eb; }
            .info-grid { display: grid; grid-cols: 2; gap: 40px; margin-bottom: 40px; }
            .info-section h3 { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #6b7280; letter-spacing: 0.1em; margin-bottom: 8px; }
            .info-section p { margin: 0; font-weight: 700; font-size: 16px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table th { background: #f9fafb; text-align: left; padding: 12px; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #4b5563; border-bottom: 2px solid #e5e7eb; }
            .table td { padding: 15px 12px; border-bottom: 1px solid #f3f4f6; font-weight: 600; font-size: 14px; }
            .total-section { display: flex; justify-content: flex-end; }
            .total-box { background: #111827; color: white; padding: 20px 40px; border-radius: 12px; text-align: right; }
            .total-label { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #9ca3af; margin-bottom: 5px; }
            .total-amount { font-size: 32px; font-weight: 900; }
            .footer { margin-top: 60px; display: flex; justify-content: space-between; }
            .signature-line { border-top: 2px solid #e5e7eb; width: 200px; text-align: center; padding-top: 10px; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #6b7280; }
            @media print { body { padding: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info">
              <h1>MY SHOP POS</h1>
              <p style="font-size: 12px; color: #6b7280; font-weight: 600;">Standard Payment Voucher</p>
            </div>
            <div class="voucher-title">
              <h2>Voucher</h2>
              <p style="font-size: 14px; font-weight: 700;">#${item.invoice_no}</p>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
            <div class="info-section">
              <h3>Supplier Details</h3>
              <p>${item.supplier_name}</p>
              <p style="font-size: 12px; color: #6b7280;">${item.supplier_phone || ''}</p>
            </div>
            <div class="info-section" style="text-align: right;">
              <h3>Payment Date</h3>
              <p>${new Date(item.created_at).toLocaleString()}</p>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Method</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${Number(item.paid_cash) > 0 ? `<tr><td>Cash Payment</td><td>CASH</td><td style="text-align: right;">৳${parseFloat(item.paid_cash).toLocaleString()}</td></tr>` : ''}
              ${Number(item.paid_mobile) > 0 ? `<tr><td>Mobile Banking (${item.mobile_operator})</td><td>MOBILE</td><td style="text-align: right;">৳${parseFloat(item.paid_mobile).toLocaleString()}</td></tr>` : ''}
              ${Number(item.paid_bank) > 0 ? `<tr><td>Bank Transfer (${item.bank_name})</td><td>BANK</td><td style="text-align: right;">৳${parseFloat(item.paid_bank).toLocaleString()}</td></tr>` : ''}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-box">
              <div class="total-label">Total Amount Settled</div>
              <div class="total-amount">৳${parseFloat(item.amount).toLocaleString()}</div>
            </div>
          </div>

          <div style="margin-top: 40px; padding: 20px; background: #f9fafb; border-radius: 12px; font-size: 12px;">
            <h3 style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #6b7280; margin-bottom: 8px;">Remarks</h3>
            <p style="margin: 0; font-weight: 600;">${item.note || 'No additional remarks provided.'}</p>
          </div>

          <div class="footer">
            <div class="signature-line">Recipient Signature</div>
            <div class="signature-line">Authorized By</div>
          </div>
          
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <button 
                onClick={() => navigate(-1)} 
                className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 font-black text-xs uppercase tracking-widest transition-all"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
                  <FaArrowLeft/> 
                </div>
                Back to List
              </button>
              
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={handlePrint} 
                  className="flex-1 md:flex-none bg-white border border-gray-200 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition shadow-sm print:hidden"
                >
                  <FaPrint/> Print
                </button>
                <button 
                  onClick={() => setEditOpen(true)} 
                  className="flex-1 md:flex-none bg-blue-600 px-6 py-3 rounded-xl font-black text-white text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 print:hidden"
                >
                  <FaEdit/> Edit Record
                </button>
              </div>
          </div>
          
          {/* Header Card */}
          <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 md:p-12 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">Payment Voucher</span>
                    <span className="bg-white/10 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">{item.status || "Completed"}</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black mb-2 flex items-center gap-3">
                    <span className="text-gray-500">#</span>{item.invoice_no}
                  </h1>
                  <div className="flex flex-wrap items-center gap-6 mt-4 opacity-60">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <FaRegCalendarAlt className="text-blue-400"/> {new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <FaHashtag className="text-blue-400"/> Purchase: {item.purchase_invoice_no || "N/A"}
                    </div>
                  </div>
              </div>
              <div className="mt-8 md:mt-0 text-right relative z-10">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-2">Total Amount</p>
                  <p className="text-5xl md:text-6xl font-black text-white leading-none">
                    <span className="text-blue-500 text-3xl mr-1">৳</span>{parseFloat(item.amount).toLocaleString()}
                  </p>
              </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Stats Grid */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <InfoCard 
                    icon={<FaTruck/>} 
                    title="Supplier" 
                    value={item.supplier_name} 
                    subValue={item.supplier_phone || "Contact not available"}
                  />
                  <InfoCard 
                    icon={<FaMoneyBillWave/>} 
                    title="Payment Status" 
                    value="Paid" 
                    color="text-green-600"
                    subValue={`Processed by ${item.created_by_name || 'System'}`}
                  />
                </div>

                {/* Breakdown Card */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="font-black text-xl uppercase tracking-tighter flex items-center gap-3">
                        <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                        Payment Breakdown
                      </h2>
                      {getMethodBadge(item.payment_method)}
                    </div>
                    
                    <div className="grid gap-4">
                        {Number(item.paid_cash) > 0 && (
                          <div className="flex items-center justify-between p-5 bg-green-50/30 rounded-2xl border border-green-50">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><FaMoneyBillWave/></div>
                              <div>
                                <p className="font-black text-sm text-gray-900">Cash Payment</p>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">On-hand currency</p>
                              </div>
                            </div>
                            <span className="font-black text-lg text-green-700 font-mono">৳{parseFloat(item.paid_cash).toLocaleString()}</span>
                          </div>
                        )}
                        
                        {Number(item.paid_mobile) > 0 && (
                          <div className="flex items-center justify-between p-5 bg-purple-50/30 rounded-2xl border border-purple-50">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><FaMobileAlt/></div>
                              <div>
                                <p className="font-black text-sm text-gray-900">Mobile Banking</p>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Operator: {item.mobile_operator || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-black text-lg text-purple-700 font-mono block">৳{parseFloat(item.paid_mobile).toLocaleString()}</span>
                              {item.transaction_id && <span className="text-[9px] font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded uppercase tracking-tighter">TxID: {item.transaction_id}</span>}
                            </div>
                          </div>
                        )}
                        
                        {Number(item.paid_bank) > 0 && (
                          <div className="flex items-center justify-between p-5 bg-blue-50/30 rounded-2xl border border-blue-50">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><FaUniversity/></div>
                              <div>
                                <p className="font-black text-sm text-gray-900">Bank Transfer</p>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">A/C: {item.bank_name || 'Direct Transfer'}</p>
                              </div>
                            </div>
                            <span className="font-black text-lg text-blue-700 font-mono">৳{parseFloat(item.paid_bank).toLocaleString()}</span>
                          </div>
                        )}
                    </div>

                    <div className="mt-8 pt-8 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Total Settled</span>
                        <span className="text-3xl font-black text-gray-900">৳{parseFloat(item.amount).toLocaleString()}</span>
                    </div>
                </div>
              </div>

              {/* Right Column: Secondary Info */}
              <div className="space-y-8">
                {/* Note Card */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <h2 className="font-black text-sm uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                      <FaStickyNote className="text-amber-400"/> Remarks
                    </h2>
                    <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-50">
                      <p className="text-sm font-medium text-gray-700 italic leading-relaxed">
                        {item.note || "No additional remarks provided for this transaction."}
                      </p>
                    </div>
                </div>

                {/* Audit Card */}
                <div className="bg-gray-900 p-8 rounded-[2rem] shadow-xl text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                    <h2 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">Audit Log</h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-1 h-12 bg-blue-500 rounded-full"></div>
                            <div>
                              <p className="text-[10px] font-black uppercase text-blue-400">Created At</p>
                              <p className="text-sm font-bold">{new Date(item.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1 h-12 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="text-[10px] font-black uppercase text-green-400">Last Updated</p>
                              <p className="text-sm font-bold">{item.updated_at ? new Date(item.updated_at).toLocaleString() : new Date(item.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-xs font-black text-green-400 uppercase tracking-widest">
                      <FaCheckCircle/> Verified Transaction
                    </div>
                </div>
              </div>
          </div>
        </div>

        {editOpen && (
          <EditSupplierDuePaymentModal 
            isOpen={editOpen} 
            onClose={() => setEditOpen(false)} 
            item={item} 
            onSuccess={handleEditSuccess} 
          />
        )}
    </div>
  );
};

export default SupplierDuePaymentDetails;
