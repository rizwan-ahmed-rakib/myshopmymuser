import React, { useRef } from "react";

const SuccessModal = ({ isOpen, onClose, invoice, previousDue = 0 }) => {
  if (!isOpen || !invoice) return null;

  const totalItemDiscount = invoice.itemwise_total_discount || 0;
  const globalDiscount = invoice.global_discount || invoice.globalDiscount || 0;
  const totalDiscount = invoice.total_discount || invoice.totalDiscount || 0;
  const subtotal = invoice.subtotal || 0;
  const totalAmount = invoice.total_amount || 0;
  const netTotal = invoice.net_total || invoice.netTotal || invoice.total_amount || 0;
  
  // Hybrid Payments
  const paidCash = invoice.paid_cash || 0;
  const paidMobile = invoice.paid_mobile || 0;
  const paidBank = invoice.paid_bank || 0;
  const paidAmount = invoice.paid_amount || (Number(paidCash) + Number(paidMobile) + Number(paidBank));
  
  const currentInvoiceDue = invoice.due_amount || 0;
  const totalSupplierDue = Number(previousDue) + Number(currentInvoiceDue);

  /* =========================
     Print handler
     ========================= */
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <html>
            <head>
                <title>Purchase Invoice - ${invoice.invoice_no}</title>
                <style>
                    body { font-family: sans-serif; padding: 20px; color: #333; line-height: 1.4; }
                    .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { border-bottom: 1px solid #eee; padding: 8px; text-align: left; font-size: 11px; }
                    th { background-color: #f9f9f9; text-transform: uppercase; }
                    .summary { float: right; width: 260px; margin-top: 10px; }
                    .summary-row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 12px; }
                    .total-row { font-weight: bold; border-top: 1px solid #333; margin-top: 5px; padding-top: 5px; font-size: 13px; }
                    .payment-method { border-left: 3px solid #eee; padding-left: 10px; margin-left: 5px; color: #666; font-size: 11px; }
                    .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #888; clear: both; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2 style="margin:0;">PURCHASE INVOICE</h2>
                    <p style="margin:5px 0;">Invoice No: ${invoice.invoice_no}</p>
                    <p style="margin:2px 0;">Supplier: ${invoice.supplier_name || 'N/A'}</p>
                    <p style="margin:2px 0;">Date: ${new Date(invoice.created_at).toLocaleDateString()}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Disc</th>
                            <th>Net Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.items ? invoice.items.map(i => `
                            <tr>
                                <td>${i.product_name}</td>
                                <td>${i.quantity}</td>
                                <td>৳${Number(i.unit_price).toFixed(2)}</td>
                                <td>৳${Number(i.total_price || (i.quantity * i.unit_price)).toFixed(2)}</td>
                                <td>৳${Number(i.discount_amount || 0).toFixed(2)}</td>
                                <td>৳${Number(i.net_total || 0).toFixed(2)}</td>
                            </tr>
                        `).join('') : ''}
                    </tbody>
                </table>
                <div class="summary">
                    <div class="summary-row"><span>Items Total:</span> <span>৳${Number(totalAmount).toFixed(2)}</span></div>
                    <div class="summary-row"><span>Itemwise Disc:</span> <span>- ৳${Number(totalItemDiscount).toFixed(2)}</span></div>
                    <div class="summary-row" style="border-top: 1px solid #eee; margin-top: 2px;"><span>Sub Total:</span> <span>৳${Number(subtotal).toFixed(2)}</span></div>
                    <div class="summary-row"><span>Global Discount:</span> <span>- ৳${Number(globalDiscount).toFixed(2)}</span></div>
                    <div class="summary-row" style="font-weight:bold; font-size: 14px; color: #000; border-top: 1px solid #ddd; padding-top: 5px;">
                        <span>Net Total:</span> <span>৳${Number(netTotal).toFixed(2)}</span>
                    </div>
                    
                    <div style="margin-top: 10px; padding-top: 5px; border-top: 2px dashed #eee;">
                        <div class="summary-row" style="font-weight:bold;"><span>Total Paid:</span> <span>৳${Number(paidAmount).toFixed(2)}</span></div>
                        ${paidCash > 0 ? `<div class="summary-row payment-method"><span>- Cash:</span> <span>৳${Number(paidCash).toFixed(2)}</span></div>` : ''}
                        ${paidMobile > 0 ? `<div class="summary-row payment-method"><span>- Mobile:</span> <span>৳${Number(paidMobile).toFixed(2)}</span></div>` : ''}
                        ${paidBank > 0 ? `<div class="summary-row payment-method"><span>- Bank:</span> <span>৳${Number(paidBank).toFixed(2)}</span></div>` : ''}
                    </div>

                    <div class="summary-row" style="color:red; margin-top: 5px;"><span>Invoice Due:</span> <span>৳${Number(currentInvoiceDue).toFixed(2)}</span></div>
                    <div class="summary-row"><span>Previous Due:</span> <span>৳${Number(previousDue).toFixed(2)}</span></div>
                    <div class="total-row"><span>Total Supplier Due:</span> <span>৳${Number(totalSupplierDue).toFixed(2)}</span></div>
                </div>
                <div class="footer">
                    <p>Computer Generated Invoice - Powered by POS System</p>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-700 p-6 text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold uppercase tracking-tight">Purchase Success!</h2>
                <p className="text-xs opacity-90 font-medium">INV #{invoice.invoice_no}</p>
            </div>

            <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                    <div className="flex justify-between text-sm border-b pb-2">
                        <span className="text-gray-500 font-medium">Net Total</span>
                        <span className="font-bold text-gray-800">৳{Number(netTotal).toFixed(2)}</span>
                    </div>
                    
                    {/* Hybrid Breakdown in Modal */}
                    <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-sm font-bold text-blue-700">
                            <span>Total Paid</span>
                            <span>৳{Number(paidAmount).toFixed(2)}</span>
                        </div>
                        {paidCash > 0 && <div className="flex justify-between text-[11px] text-gray-500 pl-4 italic"><span>- Cash</span><span>৳${Number(paidCash).toFixed(2)}</span></div>}
                        {paidMobile > 0 && <div className="flex justify-between text-[11px] text-gray-500 pl-4 italic"><span>- Mobile</span><span>৳${Number(paidMobile).toFixed(2)}</span></div>}
                        {paidBank > 0 && <div className="flex justify-between text-[11px] text-gray-500 pl-4 italic"><span>- Bank</span><span>৳${Number(paidBank).toFixed(2)}</span></div>}
                    </div>

                    <div className="pt-2 border-t border-gray-200 mt-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Invoice Due</span>
                            <span className="font-bold text-red-500">৳{Number(currentInvoiceDue).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mt-2 pt-2 border-t border-dashed border-gray-300">
                            <span className="text-gray-600 font-bold">Combined Due</span>
                            <span className="font-black text-red-700 text-lg">৳{Number(totalSupplierDue).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    <button
                        onClick={handlePrint}
                        className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Purchase Slip
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SuccessModal;
