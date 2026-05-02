import React, { useRef } from "react";

const SaleReturnSuccessModal = ({ isOpen, onClose, purchase, title, successMessage }) => {
  const printRef = useRef();

  if (!isOpen || !purchase) return null;

  /* =========================
     Print handler
     ========================= */
  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "", "width=400,height=600");

    win.document.write(`
      <html>
        <head>
          <title>Sale Return Receipt</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px; }
            h2 { margin: 0; font-size: 18px; text-transform: uppercase; }
            .info-table { width: 100%; margin-bottom: 15px; font-size: 12px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            .items-table th { border-bottom: 1px solid #333; text-align: left; font-size: 12px; padding: 5px 0; }
            .items-table td { font-size: 11px; padding: 4px 0; }
            .totals { border-top: 1px solid #333; padding-top: 10px; }
            .total-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 3px; }
            .grand-total { font-weight: bold; font-size: 14px; border-top: 1px dashed #333; margin-top: 5px; padding-top: 5px; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; border-top: 1px solid #eee; padding-top: 10px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn">
        
        <div className="bg-blue-600 p-8 text-center text-white">
            <div className="mx-auto bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-4 shadow-inner">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight">
                {title || "Return Success!"}
            </h2>
            <p className="opacity-80 font-medium">Invoice #{purchase.sale_invoice_no || purchase.invoice_no}</p>
        </div>

        <div className="p-6">
            {/* Printable Area */}
            <div ref={printRef} className="bg-gray-50 rounded-2xl p-5 border-2 border-dashed border-gray-200">
                <div className="header">
                    <h2>Sale Return Receipt</h2>
                    <p style={{fontSize: '10px', margin: '5px 0'}}>Original Invoice: #{purchase.sale_invoice_no || purchase.invoice_no}</p>
                </div>

                <table className="info-table">
                    <tbody>
                        <tr><td><strong>Date:</strong></td><td align="right">{new Date(purchase.created_at).toLocaleString()}</td></tr>
                        <tr><td><strong>Customer:</strong></td><td align="right">{purchase.customer_name || "Walk-in"}</td></tr>
                        <tr><td><strong>Method:</strong></td><td align="right">{purchase.payment_method?.toUpperCase()}</td></tr>
                    </tbody>
                </table>

                <table className="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th align="center">Qty</th>
                            <th align="right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchase.items?.map((item) => (
                            <tr key={item.id}>
                                <td>{item.product_name}</td>
                                <td align="center">{item.sale_return_quantity || item.quantity}</td>
                                <td align="right">৳{item.total_price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="totals">
                    <div className="total-row"><span>Gross Total</span><span>৳{purchase.total_return_amount || purchase.total_amount}</span></div>
                    {(Number(purchase.total_item_penalty) > 0 || Number(purchase.global_penalty) > 0) && (
                        <div className="total-row" style={{color: 'red'}}>
                            <span>Total Penalty</span>
                            <span>- ৳{(Number(purchase.total_item_penalty || 0) + Number(purchase.global_penalty || 0)).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="total-row grand-total"><span>Net Return</span><span>৳{purchase.net_return_amount || purchase.total_amount}</span></div>
                    
                    <div className="mt-2 pt-2 border-t border-gray-200">
                        <p style={{fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#666', marginBottom: '5px'}}>Refund Breakdown</p>
                        {Number(purchase.paid_cash) > 0 && <div className="total-row"><span>Cash Paid</span><span>৳{purchase.paid_cash}</span></div>}
                        {Number(purchase.paid_mobile) > 0 && <div className="total-row"><span>Mobile ({purchase.mobile_operator})</span><span>৳{purchase.paid_mobile}</span></div>}
                        {Number(purchase.paid_bank) > 0 && <div className="total-row"><span>Bank Transfer</span><span>৳{purchase.paid_bank}</span></div>}
                    </div>

                    <div className="total-row mt-2" style={{fontWeight: 'bold', color: purchase.due_amount > 0 ? 'red' : 'green'}}>
                        <span>Remaining Due</span>
                        <span>৳{purchase.due_amount}</span>
                    </div>
                </div>

                <div className="footer">
                    <p>Thank you for shopping with us!</p>
                    <p>{successMessage || "Stock & Accounts Updated"}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                    onClick={handlePrint}
                    className="px-4 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                    Print Slip
                </button>

                <button
                    onClick={onClose}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-200 transition-all border border-gray-200 active:scale-95"
                >
                    Close
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SaleReturnSuccessModal;