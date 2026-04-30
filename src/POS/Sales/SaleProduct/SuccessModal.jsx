import React, { useRef } from "react";

const SuccessModal = ({ isOpen, onClose, invoice, previousDue = 0 }) => {
  if (!isOpen || !invoice) return null;

  const subtotal = invoice.subtotal || 0;
  const globalDiscount = invoice.global_discount || invoice.globalDiscount || 0;
  const netTotal = invoice.net_total || invoice.netTotal || invoice.total_amount || 0;
  const paidAmount = invoice.paid_amount || 0;
  const currentInvoiceDue = invoice.due_amount || 0;
  const totalCustomerDue = Number(previousDue) + Number(currentInvoiceDue);

  /* =========================
     Print handler
     ========================= */
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <html>
            <head>
                <title>Sale Invoice - ${invoice.invoice_no}</title>
                <style>
                    body { font-family: sans-serif; padding: 20px; color: #333; line-height: 1.4; }
                    .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { border-bottom: 1px solid #eee; padding: 8px; text-align: left; font-size: 12px; }
                    th { background-color: #f9f9f9; }
                    .summary { float: right; width: 250px; margin-top: 10px; }
                    .summary-row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 13px; }
                    .total-row { font-weight: bold; border-top: 1px solid #333; margin-top: 5px; padding-top: 5px; font-size: 14px; }
                    .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #888; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2 style="margin:0;">SALE INVOICE</h2>
                    <p style="margin:5px 0;">Invoice No: ${invoice.invoice_no}</p>
                    <p style="margin:2px 0;">Customer: ${invoice.customer_name || 'Walking Customer'}</p>
                    <p style="margin:2px 0;">Date: ${new Date(invoice.created_at).toLocaleDateString()}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Disc</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.items ? invoice.items.map(i => `
                            <tr>
                                <td>${i.product_name}</td>
                                <td>${i.quantity}</td>
                                <td>৳${Number(i.unit_price).toFixed(2)}</td>
                                <td>৳${Number(i.discount_amount || 0).toFixed(2)}</td>
                                <td>৳${Number(i.net_total || i.total_price || 0).toFixed(2)}</td>
                            </tr>
                        `).join('') : ''}
                    </tbody>
                </table>
                <div class="summary">
                    <div class="summary-row"><span>Subtotal:</span> <span>৳${Number(subtotal).toFixed(2)}</span></div>
                    <div class="summary-row"><span>Discount:</span> <span>- ৳${Number(globalDiscount).toFixed(2)}</span></div>
                    <div class="summary-row" style="font-weight:bold;"><span>Net Total:</span> <span>৳${Number(netTotal).toFixed(2)}</span></div>
                    <div class="summary-row" style="color:blue;"><span>Received Amount:</span> <span>৳${Number(paidAmount).toFixed(2)}</span></div>
                    <div class="summary-row" style="color:red;"><span>Invoice Due:</span> <span>৳${Number(currentInvoiceDue).toFixed(2)}</span></div>
                    <div class="summary-row"><span>Previous Due:</span> <span>৳${Number(previousDue).toFixed(2)}</span></div>
                    <div class="total-row"><span>Total Combined Due:</span> <span>৳${Number(totalCustomerDue).toFixed(2)}</span></div>
                </div>
                <div class="footer">
                    <p>Thank you for shopping with us!</p>
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
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold">Sale Successful!</h2>
                <p className="text-sm opacity-90 mt-1 font-medium tracking-wide">Invoice #{invoice.invoice_no}</p>
            </div>

            <div className="p-6 space-y-4 bg-white">
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">Net Total</span>
                        <span className="font-bold text-gray-800">৳{Number(netTotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-600 font-medium">
                        <span>Received Amount</span>
                        <span>৳{Number(paidAmount).toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Invoice Due</span>
                            <span className="font-bold text-red-500">৳{Number(currentInvoiceDue).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mt-2 pt-2 border-t border-dashed border-gray-300">
                            <span className="text-gray-600 font-semibold">Total Customer Due</span>
                            <span className="font-black text-red-700 text-lg">৳{Number(totalCustomerDue).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                    <button
                        onClick={handlePrint}
                        className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Detailed Invoice
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
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