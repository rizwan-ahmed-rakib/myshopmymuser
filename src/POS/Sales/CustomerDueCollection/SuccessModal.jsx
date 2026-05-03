import React, { useRef } from "react";

const SuccessModal = ({ isOpen, onClose, data, title, isCollection = true }) => {
  const printRef = useRef();

  if (!isOpen || !data) return null;

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "", "width=400,height=600");
    win.document.write(`<html><head><title>Receipt</title><style>body{font-family:monospace;padding:20px;max-width:300px;margin:0 auto;border:1px solid #000;}.header{text-align:center;border-bottom:1px dashed #000;padding-bottom:10px;}.row{display:flex;justify-content:space-between;margin:5px 0;font-size:12px;}.bold{font-weight:bold;}.footer{text-align:center;margin-top:15px;font-size:10px;border-top:1px dashed #000;padding-top:5px;}</style></head><body>${content}<script>window.print();</script></body></html>`);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className={`${isCollection ? 'bg-blue-600' : 'bg-green-600'} p-8 text-center text-white`}>
            <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-4"><svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>
            <h2 className="text-xl font-black uppercase tracking-tight">{title}</h2>
        </div>
        <div className="p-6">
            <div ref={printRef} className="bg-gray-50 p-4 rounded-2xl text-sm">
                <div className="text-center border-b border-dashed border-gray-300 pb-2 mb-2">
                    <h3 className="font-bold">{isCollection ? 'DUE COLLECTION' : 'DUE PAYMENT'}</h3>
                    <p className="text-[10px]">#{data.invoice_no}</p>
                </div>
                <div className="flex justify-between py-1"><span>Date:</span><span>{new Date(data.created_at).toLocaleDateString()}</span></div>
                <div className="flex justify-between py-1"><span>{isCollection ? 'Customer' : 'Supplier'}:</span><span>{isCollection ? data.customer_name : data.supplier_name}</span></div>
                <div className="flex justify-between py-1 font-bold border-t mt-2 pt-2"><span>Amount:</span><span>৳{parseFloat(data.amount).toLocaleString()}</span></div>
                <div className="mt-2 pt-2 border-t border-dashed border-gray-300">
                    <p className="text-[9px] font-bold uppercase">Payment Details:</p>
                    {Number(data.paid_cash) > 0 && <div className="flex justify-between text-[11px]"><span>Cash:</span><span>৳{data.paid_cash}</span></div>}
                    {Number(data.paid_mobile) > 0 && <div className="flex justify-between text-[11px]"><span>Mobile ({data.mobile_operator}):</span><span>৳{data.paid_mobile}</span></div>}
                    {Number(data.paid_bank) > 0 && <div className="flex justify-between text-[11px]"><span>Bank:</span><span>৳{data.paid_bank}</span></div>}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
                <button onClick={handlePrint} className="py-3 bg-gray-900 text-white rounded-xl font-bold text-sm">Print</button>
                <button onClick={onClose} className="py-3 border-2 rounded-xl font-bold text-sm">Done</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
