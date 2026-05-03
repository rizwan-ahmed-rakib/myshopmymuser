
import React from 'react';
import { FaCheckCircle, FaPrint, FaTimes, FaMoneyBillWave, FaMobileAlt, FaUniversity } from 'react-icons/fa';

const SuccessModal = ({ isOpen, onClose, employee, type = 'create' }) => {
    if (!isOpen || !employee) return null;

    const isUpdate = type === 'update';

    const handlePrint = () => {
        const printWindow = window.open("", "_blank", "width=800,height=900");
        const content = `
          <html>
            <head>
              <title>Loan Voucher #${employee.id}</title>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
                body { font-family: 'Inter', sans-serif; padding: 40px; color: #111827; }
                .header { display: flex; justify-content: space-between; align-items: start; border-bottom: 4px solid #111827; padding-bottom: 20px; margin-bottom: 30px; }
                .company-info h1 { margin: 0; font-size: 24px; font-weight: 900; text-transform: uppercase; }
                .voucher-title { text-align: right; }
                .voucher-title h2 { margin: 0; font-size: 32px; font-weight: 900; text-transform: uppercase; color: #10b981; }
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
                <div class="company-info"><h1>MY SHOP POS</h1><p>Disbursement Voucher</p></div>
                <div class="voucher-title"><h2>Loan</h2><p>#${employee.id}</p></div>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
                <div class="info-section"><h3>Employee</h3><p>${employee.user_name}</p></div>
                <div class="info-section" style="text-align: right;"><h3>Date</h3><p>${new Date(employee.loan_date).toLocaleDateString()}</p></div>
              </div>
              <table class="table">
                <thead><tr><th>Description</th><th>Method</th><th style="text-align: right;">Amount</th></tr></thead>
                <tbody>
                  ${Number(employee.paid_cash) > 0 ? `<tr><td>Cash Payout</td><td>CASH</td><td style="text-align: right;">৳${parseFloat(employee.paid_cash).toLocaleString()}</td></tr>` : ''}
                  ${Number(employee.paid_mobile) > 0 ? `<tr><td>Mobile (${employee.mobile_operator})</td><td>MOBILE</td><td style="text-align: right;">৳${parseFloat(employee.paid_mobile).toLocaleString()}</td></tr>` : ''}
                  ${Number(employee.paid_bank) > 0 ? `<tr><td>Bank (${employee.bank_name})</td><td>BANK</td><td style="text-align: right;">৳${parseFloat(employee.paid_bank).toLocaleString()}</td></tr>` : ''}
                </tbody>
              </table>
              <div class="total-box"><div style="font-size: 10px; text-transform: uppercase; color: #9ca3af;">Total Principal</div><div class="total-amount">৳${parseFloat(employee.amount).toLocaleString()}</div></div>
              <div class="footer"><div class="signature">Employee Signature</div><div class="signature">Authorized By</div></div>
              <script>window.onload = function() { window.print(); window.close(); }</script>
            </body>
          </html>
        `;
        printWindow.document.write(content);
        printWindow.document.close();
    };

    return (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/20">
                
                <div className={`${isUpdate ? 'bg-blue-600' : 'bg-emerald-600'} p-10 text-center text-white relative overflow-hidden transition-colors duration-500`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="w-24 h-24 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl backdrop-blur-sm">
                        <FaCheckCircle className="text-4xl text-white" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">
                        {isUpdate ? 'Loan Updated' : 'Loan Disbursed'}
                    </h2>
                    <p className="text-white/80 mt-2 font-bold uppercase text-[10px] tracking-widest">Transaction Successful</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="bg-gray-50 p-6 rounded-[2rem] space-y-4 text-sm border border-gray-100">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Employee</span>
                            <span className="font-black text-gray-900">{employee.user_name}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-4">
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Principal Amount</span>
                            <span className={`font-black text-2xl ${isUpdate ? 'text-blue-600' : 'text-emerald-600'} font-mono`}>৳{Number(employee.amount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-4">
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Repayment</span>
                            <span className="font-black text-sm text-gray-900">৳{Number(employee.monthly_repayment_amount).toLocaleString()} / Month</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={handlePrint} className="py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg">
                            <FaPrint /> Print Voucher
                        </button>
                        <button onClick={onClose} className="py-4 border-2 border-gray-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition">
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
