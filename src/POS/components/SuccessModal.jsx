// import React, { useRef } from 'react';
//
// const SuccessModal = ({ isOpen, onClose, title, message, data, modalKey }) => {
//     const printRef = useRef();
//
//     if (!isOpen) return null;
//
//     const handlePrint = () => {
//         const content = printRef.current.innerHTML;
//         const win = window.open("", "", "width=400,height=600");
//
//         win.document.write(`
//           <html>
//             <head>
//               <title>Receipt</title>
//               <style>
//                 body { font-family: monospace; padding: 10px; }
//                 h2,h3 { text-align: center; margin: 5px 0; }
//                 table { width: 100%; border-collapse: collapse; }
//                 th,td { padding: 4px 0; font-size: 12px; }
//                 th { border-bottom: 1px dashed #000; }
//                 .total { border-top: 1px dashed #000; margin-top: 8px; padding-top: 6px; }
//               </style>
//             </head>
//             <body>${content}</body>
//           </html>
//         `);
//
//         win.document.close();
//         win.focus();
//         win.print();
//         win.close();
//     };
//
//     const getTitle = () => {
//         switch (modalKey) {
//             case 'sale':
//                 return 'SALE RECEIPT';
//             case 'purchase':
//                 return 'PURCHASE RECEIPT';
//             case 'saleReturn':
//                 return 'SALE RETURN RECEIPT';
//             case 'purchaseReturn':
//                 return 'PURCHASE RETURN RECEIPT';
//             default:
//                 return 'RECEIPT';
//         }
//     }
//
//     const renderInvoice = () => (
//         <>
//              <div className="mx-auto bg-green-100 rounded-full w-20 h-20 flex items-center justify-center">
//                 <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                 </svg>
//             </div>
//
//             <h2 className="text-2xl font-bold text-gray-800 mt-4 text-center">
//                 {title || "Success!"}
//             </h2>
//
//             <p className="text-gray-600 mb-4 text-center">
//                 Invoice #{data?.invoice_no}
//             </p>
//             <div ref={printRef} className="bg-gray-50 rounded-lg p-4 my-4 text-sm">
//                 <h3 className="font-bold text-center text-base">{getTitle()}</h3>
//                 <div className="mt-2 space-y-1 text-xs">
//                     <p><strong>Date:</strong> {new Date(data?.created_at).toLocaleString()}</p>
//                     <p><strong>{modalKey?.includes('sale') ? 'Customer' : 'Supplier'}:</strong> {data?.customer_name || data?.supplier_name || "N/A"}</p>
//                     <p><strong>Payment:</strong> {data?.payment_method}</p>
//                     <p><strong>Status:</strong> {data?.payment_status}</p>
//                 </div>
//                 <table className="w-full mt-3 text-xs">
//                     <thead>
//                         <tr>
//                             <th align="left">Item</th>
//                             <th align="center">Qty</th>
//                             <th align="right">Price</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {data?.items?.map((item, index) => (
//                             <tr key={index}>
//                                 <td>{item.product_name}</td>
//                                 <td align="center">{item.quantity}</td>
//                                 <td align="right">{item.total_price}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//                 <div className="mt-3 text-xs total">
//                     <p className="flex justify-between">
//                         <span>Total</span>
//                         <span>{data?.total_amount}</span>
//                     </p>
//                     <p className="flex justify-between">
//                         <span>Paid</span>
//                         <span>{data?.paid_amount}</span>
//                     </p>
//                     <p className="flex justify-between font-semibold">
//                         <span>Due</span>
//                         <span>{data?.due_amount}</span>
//                     </p>
//                 </div>
//                 <p className="text-center mt-3 text-xs">
//                     {message || "Operation completed successfully"}
//                 </p>
//             </div>
//              <div className="space-y-2">
//                 <button
//                     onClick={handlePrint}
//                     className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
//                 >
//                     Print Slip
//                 </button>
//                 <button
//                     onClick={onClose}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg font-semibold"
//                 >
//                     Close
//                 </button>
//             </div>
//         </>
//     );
//
//     const renderDefault = () => (
//         <>
//             <div className="mx-auto bg-green-100 rounded-full w-20 h-20 flex items-center justify-center">
//                 <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                 </svg>
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800 mt-4">
//                 {title || 'Success!'}
//             </h2>
//             <p className="text-gray-600 mb-4">
//                 {message || 'The operation was completed successfully.'}
//             </p>
//             {data && <p className="text-gray-800 font-bold">{data.name || data.title}</p>}
//             <button
//                 className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//                 onClick={onClose}
//             >
//                 Great, thanks!
//             </button>
//         </>
//     );
//
//     const isInvoice = ["sale", "purchase", "saleReturn", "purchaseReturn"].includes(modalKey);
//
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm text-center p-6">
//                 {isInvoice ? renderInvoice() : renderDefault()}
//             </div>
//         </div>
//     );
// };
// export default SuccessModal;
//
//


/////////////////////////////////////////////////


import React, { useRef } from 'react';

const SuccessModal = ({ isOpen, onClose, title, message, data, modalKey }) => {
    const printRef = useRef();

    if (!isOpen) return null;

    // Debug log
    console.log("SuccessModal Props:", {
        isOpen,
        title,
        message,
        data,
        modalKey
    });

    const handlePrint = () => {
        const content = printRef.current.innerHTML;
        const win = window.open("", "", "width=400,height=600");

        win.document.write(`
          <html>
            <head>
              <title>Receipt</title>
              <style>
                body { font-family: monospace; padding: 10px; }
                h2,h3 { text-align: center; margin: 5px 0; }
                table { width: 100%; border-collapse: collapse; }
                th,td { padding: 4px 0; font-size: 12px; }
                th { border-bottom: 1px dashed #000; }
                .total { border-top: 1px dashed #000; margin-top: 8px; padding-top: 6px; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .font-bold { font-weight: bold; }
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

    const getTitle = () => {
        if (!modalKey) return 'RECEIPT';

        switch (modalKey) {
            case 'sale':
                return 'SALE RECEIPT';
            case 'purchase':
                return 'PURCHASE RECEIPT';
            case 'saleReturn':
                return 'SALE RETURN RECEIPT';
            case 'purchaseReturn':
                return 'PURCHASE RETURN RECEIPT';
            default:
                return 'RECEIPT';
        }
    };

    const getInvoiceNo = () => {
        if (!data) return 'N/A';

        if (modalKey === 'sale' || modalKey === 'saleReturn') {
            return data.invoice_no || data.sale_invoice_no || 'N/A';
        } else if (modalKey === 'purchase' || modalKey === 'purchaseReturn') {
            return data.invoice_no || data.purchase_invoice_no || 'N/A';
        }
        return 'N/A';
    };

    const getPersonName = () => {
        if (!data) return 'N/A';

        if (modalKey === 'sale' || modalKey === 'saleReturn') {
            return data.customer_name || data.customer?.name || 'Walk-in Customer';
        } else if (modalKey === 'purchase' || modalKey === 'purchaseReturn') {
            return data.supplier_name || data.supplier?.name || 'N/A';
        }
        return 'N/A';
    };

    const getTotalAmount = () => {
        if (!data) return 0;

        return data.total_amount || data.total_return_amount || 0;
    };

    const getPaidAmount = () => {
        if (!data) return 0;

        return data.paid_amount || 0;
    };

    const getDueAmount = () => {
        if (!data) return 0;

        return data.due_amount || 0;
    };

    const getPaymentStatus = () => {
        if (!data) return 'N/A';

        return data.payment_status || 'N/A';
    };

    const getPaymentMethod = () => {
        if (!data) return 'N/A';

        return data.payment_method || 'N/A';
    };

    const getItems = () => {
        if (!data) return [];

        return data.items || [];
    };

    const renderInvoice = () => {
        if (!data) {
            return (
                <div className="text-center p-4">
                    <p className="text-red-500">No data available for receipt</p>
                </div>
            );
        }

        return (
            <>
                <div className="mx-auto bg-green-100 rounded-full w-20 h-20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-4 text-center">
                    {title || "Success!"}
                </h2>

                <p className="text-gray-600 mb-4 text-center">
                    Invoice #{getInvoiceNo()}
                </p>

                <div ref={printRef} className="bg-gray-50 rounded-lg p-4 my-4 text-sm">
                    <h3 className="font-bold text-center text-base">{getTitle()}</h3>
                    <div className="mt-2 space-y-1 text-xs">
                        <p><strong>Date:</strong> {new Date(data.created_at || new Date()).toLocaleString()}</p>
                        <p><strong>{modalKey?.includes('sale') ? 'Customer' : 'Supplier'}:</strong> {getPersonName()}</p>
                        <p><strong>Payment Method:</strong> {getPaymentMethod()}</p>
                        <p><strong>Payment Status:</strong> {getPaymentStatus()}</p>
                    </div>

                    {getItems().length > 0 && (
                        <table className="w-full mt-3 text-xs">
                            <thead>
                                <tr>
                                    <th className="text-left">Item</th>
                                    <th className="text-center">Qty</th>
                                    <th className="text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getItems().map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.product_name || item.name || `Item ${index + 1}`}</td>
                                        <td className="text-center">
                                            {item.quantity || item.sale_return_quantity || item.sale_return_quantity || 0}
                                        </td>
                                        <td className="text-right">
                                            ৳{item.total_price || item.total_price || 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div className="mt-3 text-xs border-t pt-3">
                        <div className="flex justify-between mb-1">
                            <span>Total Amount:</span>
                            <span className="font-bold">৳{getTotalAmount()}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span>Paid Amount:</span>
                            <span>৳{getPaidAmount()}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span>Due Amount:</span>
                            <span className={`font-bold ${getDueAmount() > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ৳{getDueAmount()}
                            </span>
                        </div>
                    </div>

                    <p className="text-center mt-3 text-xs text-gray-600">
                        {message || "Operation completed successfully"}
                    </p>
                    <p className="text-center mt-1 text-xs text-gray-500">
                        Thank you for your business!
                    </p>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={handlePrint}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Print Receipt
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </>
        );
    };

    const renderDefault = () => (
        <>
            <div className="mx-auto bg-green-100 rounded-full w-20 h-20 flex items-center justify-center">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">
                {title || 'Success!'}
            </h2>
            <p className="text-gray-600 mb-4">
                {message || 'The operation was completed successfully.'}
            </p>
            {data && (data.name || data.title) && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-gray-800 font-bold">{data.name || data.title}</p>
                    {data.id && <p className="text-sm text-gray-500">ID: {data.id}</p>}
                </div>
            )}
            <button
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                onClick={onClose}
            >
                Great, thanks!
            </button>
        </>
    );

    const isInvoice = ["sale", "purchase", "saleReturn", "purchaseReturn"].includes(modalKey);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm text-center p-6">
                {isInvoice ? renderInvoice() : renderDefault()}
            </div>
        </div>
    );
};

export default SuccessModal;