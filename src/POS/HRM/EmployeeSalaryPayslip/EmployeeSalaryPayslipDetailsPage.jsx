import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaUndo, FaUser, FaDollarSign, FaMoneyBillWave, 
  FaMobileAlt, FaUniversity, FaEdit, 
  FaInfoCircle, FaCalendarAlt, FaHashtag, FaStickyNote,
  FaArrowLeft, FaPrint, FaRegCalendarAlt, FaCheckCircle,
  FaUserTie, FaCoins, FaHistory, FaCalendarCheck,
  FaWallet, FaPlusCircle, FaMinusCircle
} from "react-icons/fa";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";
import UpdateEmployeeSalaryPayslipModal from "./UpdateEmployeeSalaryPayslipModal";

const EmployeeSalaryPayslipDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const fetchPayslip = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL_of_POS}/api/users/payslips/${id}/`);
      setPayslip(res.data);
    } catch (err) {
      console.error("Error fetching payslip details:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPayslip();
  }, [fetchPayslip]);

  const handleEditSuccess = (updatedData) => {
    setPayslip(updatedData);
    setEditOpen(false);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=800,height=900");
    const content = `
      <html>
        <head>
          <title>Salary Payslip #${payslip.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #111827; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: start; border-bottom: 4px solid #111827; padding-bottom: 20px; margin-bottom: 30px; }
            .company-info h1 { margin: 0; font-size: 24px; font-weight: 900; text-transform: uppercase; }
            .voucher-title { text-align: right; }
            .voucher-title h2 { margin: 0; font-size: 32px; font-weight: 900; text-transform: uppercase; color: #2563eb; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .info-section h3 { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #6b7280; margin-bottom: 8px; }
            .info-section p { margin: 0; font-weight: 700; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table th { background: #f9fafb; text-align: left; padding: 12px; font-size: 10px; font-weight: 900; text-transform: uppercase; border-bottom: 2px solid #e5e7eb; }
            .table td { padding: 15px 12px; border-bottom: 1px solid #f3f4f6; font-weight: 600; }
            .total-box { background: #111827; color: white; padding: 20px 40px; border-radius: 12px; text-align: right; float: right; }
            .total-amount { font-size: 32px; font-weight: 900; }
            .footer { margin-top: 60px; display: flex; justify-content: space-between; clear: both; }
            .signature { border-top: 2px solid #e5e7eb; width: 200px; text-align: center; padding-top: 10px; font-size: 10px; font-weight: 900; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info"><h1>MY SHOP POS</h1><p style="font-size: 12px; color: #6b7280;">Monthly Salary Payslip</p></div>
            <div class="voucher-title"><h2>Payslip</h2><p style="font-size: 14px; font-weight: 700;">${payslip.month}/${payslip.year}</p></div>
          </div>
          
          <div class="info-grid">
            <div class="info-section"><h3>Employee</h3><p>${payslip.user_name}</p><p style="font-size: 12px; color: #6b7280;">${payslip.user_designation || ''}</p></div>
            <div class="info-section" style="text-align: right;"><h3>Payment Date</h3><p>${new Date(payslip.payment_date).toLocaleDateString()}</p></div>
          </div>

          <table class="table">
            <thead><tr><th>Earnings/Deductions</th><th style="text-align: right;">Amount</th></tr></thead>
            <tbody>
              <tr><td>Basic Salary</td><td style="text-align: right;">৳${parseFloat(payslip.basic_salary).toLocaleString()}</td></tr>
              <tr><td>Allowances (+)</td><td style="text-align: right; color: #059669;">৳${parseFloat(payslip.allowances).toLocaleString()}</td></tr>
              <tr><td>Deductions (-)</td><td style="text-align: right; color: #dc2626;">৳${parseFloat(payslip.deductions).toLocaleString()}</td></tr>
            </tbody>
          </table>

          <div style="border-top: 4px solid #111827; padding-top: 20px;">
             <h3>Payment Distribution</h3>
             <table class="table">
                <thead><tr><th>Method</th><th style="text-align: right;">Amount</th></tr></thead>
                <tbody>
                  ${Number(payslip.paid_cash) > 0 ? `<tr><td>Cash Payment</td><td style="text-align: right;">৳${parseFloat(payslip.paid_cash).toLocaleString()}</td></tr>` : ''}
                  ${Number(payslip.paid_mobile) > 0 ? `<tr><td>Mobile (${payslip.mobile_operator})</td><td style="text-align: right;">৳${parseFloat(payslip.paid_mobile).toLocaleString()}</td></tr>` : ''}
                  ${Number(payslip.paid_bank) > 0 ? `<tr><td>Bank (${payslip.bank_name})</td><td style="text-align: right;">৳${parseFloat(payslip.paid_bank).toLocaleString()}</td></tr>` : ''}
                </tbody>
             </table>
          </div>

          <div class="total-box"><div style="font-size: 10px; text-transform: uppercase; color: #9ca3af;">Net Salary Paid</div><div class="total-amount">৳${parseFloat(payslip.net_salary).toLocaleString()}</div></div>
          
          <div class="footer"><div class="signature">Employee Signature</div><div class="signature">Authorized By</div></div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (!payslip) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">!</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase">Payslip Not Found</h2>
        <button onClick={() => navigate(-1)} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-gray-800 transition mt-6"><FaArrowLeft /> Go Back</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 font-black text-xs uppercase tracking-widest transition-all">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:shadow-md transition-all"><FaArrowLeft/></div>
                Back to Grid
              </button>
              
              <div className="flex gap-3 w-full md:w-auto">
                <button onClick={handlePrint} className="flex-1 md:flex-none bg-white border border-gray-200 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition shadow-sm print:hidden">
                  <FaPrint/> Print Payslip
                </button>
                <button onClick={() => setEditOpen(true)} className="flex-1 md:flex-none bg-blue-600 px-6 py-3 rounded-xl font-black text-white text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 print:hidden">
                  <FaEdit/> Edit Payslip
                </button>
              </div>
          </div>
          
          <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 md:p-12 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">Salary Payslip</span>
                    <span className="bg-white/10 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">{payslip.month}/{payslip.year}</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black mb-2 flex items-center gap-3"><span className="text-gray-500">#</span>{payslip.id}</h1>
                  <div className="flex flex-wrap items-center gap-6 mt-4 opacity-60 font-bold text-xs">
                    <div className="flex items-center gap-2"><FaRegCalendarAlt className="text-blue-400"/> Paid On: {new Date(payslip.payment_date).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2"><FaUserTie className="text-blue-400"/> Employee: {payslip.user_name}</div>
                  </div>
              </div>
              <div className="mt-8 md:mt-0 text-right relative z-10">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-2">Net Salary</p>
                  <p className="text-5xl md:text-6xl font-black text-white leading-none">
                    <span className="text-blue-500 text-3xl mr-1">৳</span>{parseFloat(payslip.net_salary).toLocaleString()}
                  </p>
              </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Earnings & Deductions */}
                <div className="grid sm:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"><p className="text-[10px] font-black uppercase text-gray-400 mb-1">Basic Salary</p><p className="text-xl font-black text-gray-900 leading-none">৳{parseFloat(payslip.basic_salary).toLocaleString()}</p></div>
                    <div className="bg-green-50/30 p-6 rounded-2xl border border-green-50 flex items-center justify-between"><div><p className="text-[10px] font-black uppercase text-green-600 mb-1">Allowances (+)</p><p className="text-xl font-black text-green-700 leading-none">৳{parseFloat(payslip.allowances).toLocaleString()}</p></div><FaPlusCircle className="text-green-500 opacity-20 text-2xl"/></div>
                    <div className="bg-red-50/30 p-6 rounded-2xl border border-red-50 flex items-center justify-between"><div><p className="text-[10px] font-black uppercase text-red-600 mb-1">Deductions (-)</p><p className="text-xl font-black text-red-700 leading-none">৳{parseFloat(payslip.deductions).toLocaleString()}</p></div><FaMinusCircle className="text-red-500 opacity-20 text-2xl"/></div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <h2 className="font-black text-xl uppercase tracking-tighter flex items-center gap-3 mb-8">
                        <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                        Payout Breakdown
                    </h2>
                    
                    <div className="grid gap-4">
                        {Number(payslip.paid_cash) > 0 && (
                          <div className="flex items-center justify-between p-5 bg-green-50/30 rounded-2xl border border-green-50">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><FaMoneyBillWave/></div>
                              <div><p className="font-black text-sm text-gray-900">Cash Payment</p><p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hand-to-hand payout</p></div>
                            </div>
                            <span className="font-black text-lg text-green-700 font-mono">৳{parseFloat(payslip.paid_cash).toLocaleString()}</span>
                          </div>
                        )}
                        {Number(payslip.paid_mobile) > 0 && (
                          <div className="flex items-center justify-between p-5 bg-purple-50/30 rounded-2xl border border-purple-50">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><FaMobileAlt/></div>
                              <div><p className="font-black text-sm text-gray-900">Mobile Transfer</p><p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Operator: {payslip.mobile_operator || 'N/A'}</p></div>
                            </div>
                            <div className="text-right">
                              <span className="font-black text-lg text-purple-700 font-mono block">৳{parseFloat(payslip.paid_mobile).toLocaleString()}</span>
                              {payslip.transaction_id && <span className="text-[9px] font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded uppercase tracking-tighter">TxID: {payslip.transaction_id}</span>}
                            </div>
                          </div>
                        )}
                        {Number(payslip.paid_bank) > 0 && (
                          <div className="flex items-center justify-between p-5 bg-blue-50/30 rounded-2xl border border-blue-50">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><FaUniversity/></div>
                              <div><p className="font-black text-sm text-gray-900">Bank Transfer</p><p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">A/C: {payslip.bank_name || 'Direct Deposit'}</p></div>
                            </div>
                            <span className="font-black text-lg text-blue-700 font-mono">৳{parseFloat(payslip.paid_bank).toLocaleString()}</span>
                          </div>
                        )}
                    </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <h2 className="font-black text-sm uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2"><FaStickyNote className="text-amber-400"/> Salary Note</h2>
                    <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-50">
                      <p className="text-sm font-medium text-gray-700 italic leading-relaxed">{payslip.note || "No additional remarks provided for this payslip."}</p>
                    </div>
                </div>

                <div className="bg-gray-900 p-8 rounded-[2rem] shadow-xl text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                    <h2 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">Payment Info</h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-1 h-12 bg-blue-500 rounded-full"></div>
                            <div><p className="text-[10px] font-black uppercase text-blue-400">Processed On</p><p className="text-sm font-bold">{new Date(payslip.payment_date).toLocaleString()}</p></div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1 h-12 bg-emerald-500 rounded-full"></div>
                            <div><p className="text-[10px] font-black uppercase text-emerald-400">Salary Method</p><p className="text-sm font-bold uppercase tracking-widest">{payslip.payment_method?.replace('_', ' ')}</p></div>
                        </div>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-green-400 uppercase tracking-widest border border-green-400/30 p-3 rounded-xl justify-center"><FaCheckCircle/> Official Disbursement</div>
                </div>
              </div>
          </div>
        </div>

        {editOpen && (
          <UpdateEmployeeSalaryPayslipModal 
            isOpen={editOpen} 
            onClose={() => setEditOpen(false)} 
            onSuccess={handleEditSuccess} 
            advanceData={payslip} 
          />
        )}
    </div>
  );
};

export default EmployeeSalaryPayslipDetailsPage;
