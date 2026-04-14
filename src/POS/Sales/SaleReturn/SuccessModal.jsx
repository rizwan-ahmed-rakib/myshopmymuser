import React, { useRef } from "react";

const SuccessModal = ({ isOpen, onClose, purchase, title, successMessage }) => {
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
          <title>Sale Receipt</title>
          <style>
            body { font-family: monospace; padding: 10px; }
            h2,h3 { text-align: center; margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; }
            th,td { padding: 4px 0; font-size: 12px; }
            th { border-bottom: 1px dashed #000; }
            .total { border-top: 1px dashed #000; margin-top: 8px; padding-top: 6px; }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">

        {/* Success Icon */}
        <div className="mx-auto bg-green-100 rounded-full w-20 h-20 flex items-center justify-center">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mt-4 text-center">
          {title || "Purchase Completed!"}
        </h2>

        <p className="text-gray-600 mb-4 text-center">
          Invoice #{purchase.invoice_no}
        </p>

        {/* =========================
           Printable Receipt
           ========================= */}
        <div ref={printRef} className="bg-gray-50 rounded-lg p-4 my-4 text-sm">

          <h3 className="font-bold text-center text-base">SAlE RETURN RECEIPT</h3>

          <div className="mt-2 space-y-1 text-xs">
            <p><strong>Date:</strong> {new Date(purchase.created_at).toLocaleString()}</p>
            <p><strong>Customer:</strong> {purchase.customer_name ?? "N/A"}</p>
            <p><strong>Payment:</strong> {purchase.payment_method}</p>
            <p><strong>Status:</strong> {purchase.payment_status}</p>
          </div>

          {/* Items */}
          <table className="w-full mt-3 text-xs">
            <thead>
              <tr>
                <th align="left">Item</th>
                <th align="center">Qty</th>
                <th align="right">Price</th>
              </tr>
            </thead>
            <tbody>
              {purchase.items && purchase.items.length > 0 ? (
                purchase.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product_name}</td>
                    <td align="center">{item.sale_return_quantity}</td>
                    <td align="right">{item.total_price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-400">
                    No items
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-3 text-xs total">
            <p className="flex justify-between">
              <span>Total</span>
              <span>{purchase.total_amount}</span>
            </p>
            <p className="flex justify-between">
              <span>Paid</span>
              <span>{purchase.paid_amount}</span>
            </p>
            <p className="flex justify-between font-semibold">
              <span>Due</span>
              <span>{purchase.due_amount}</span>
            </p>
          </div>

          <p className="text-center mt-3 text-xs">
            {successMessage || "Stock updated successfully"}
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={handlePrint}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Print Slip
          </button>

          <button
            onClick={onClose}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default SuccessModal;