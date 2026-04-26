



import React, { useState, useRef } from "react";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";

const AddSupplierDuePaymentModal = ({ isOpen, onClose, onSuccess, suppliers = [] }) => {
  const [form, setForm] = useState({
    supplier: "",
    amount: "",
    payment_method: "cash",
    mobile_operator: "",
    transaction_id: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  if (!isOpen) return null;

  // 🔹 Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // পেমেন্ট মেথড পরিবর্তন হলে অপারেটর রিসেট হবে
    if (name === "payment_method" && value !== "mobile_banking") {
      setForm((prev) => ({ ...prev, mobile_operator: "" }));
    }
  };

  // 🔹 সিলেক্টেড কাস্টমারের ডাটা
  const selectedSupplier = suppliers.find((c) => c.id === Number(form.supplier));

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // if (!form.customer || !form.amount || Number(form.amount) <= 0) {
    //   setErrors({ message: "Select a customer and enter a valid amount." });
    //   setLoading(false);
    //   return;
    // }
    if (!form.supplier || !form.amount ) {
      setErrors({ message: "Select a customer and enter a valid amount." });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL_of_POS}/api/purchase/due-payments/`,
        form
      );

      setInvoiceData(res.data);
      setShowSuccess(true); // সাবমিট সফল হলে সাকসেস পপআপ দেখাবে
      onSuccess?.(res.data); // প্যারেন্ট কম্পোনেন্টকে আপডেট করতে বলবে
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        alert("Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Print Invoice Logic (নতুন উইন্ডোতে সুন্দর প্রিন্ট)
  const handlePrint = () => {
    if (!invoiceData || !selectedSupplier) return;

    const prevDue = Number(selectedSupplier.due_amount || 0);
    const amountPaid = Number(invoiceData.amount || 0);
    const currDue = prevDue - amountPaid;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Due Payment Invoice - ${invoiceData.invoice_no}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
          .container { max-width: 400px; margin: 0 auto; border: 1px dashed #ccc; padding: 30px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 24px; color: #111; }
          .header p { margin: 5px 0 0; color: #555; font-size: 14px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; }
          .label { color: #666; }
          .value { font-weight: 600; }
          .amount-box { margin-top: 20px; background: #f9fafb; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb;}
          .amount-box h2 { margin: 0; color: #16a34a; font-size: 28px; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #888; border-top: 1px dashed #ccc; padding-top: 15px; }
          .breakdown { margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>PAYMENT RECEIPT</h1>
            <p>Supplier Due Payment Invoice</p>
          </div>
          
          <div class="row">
            <span class="label">Invoice No:</span>
            <span class="value">${invoiceData.invoice_no}</span>
          </div>
          <div class="row">
            <span class="label">Date:</span>
            <span class="value">${new Date(invoiceData.created_at).toLocaleDateString()}</span>
          </div>
          <div class="row">
            <span class="label">Supplier:</span>
            <span class="value">${invoiceData.supplier_name}</span>
          </div>
          
          <div class="breakdown">
            <div class="row">
              <span class="label">Previous Due:</span>
              <span class="value">$${prevDue.toFixed(2)}</span>
            </div>
            <div class="row">
              <span class="label">Amount Paid:</span>
              <span class="value">$${amountPaid.toFixed(2)}</span>
            </div>
            <div class="row" style="border-top: 1px solid #eee; padding-top: 5px; margin-top: 5px;">
              <span class="label">Current Due:</span>
              <span class="value" style="color: #dc2626;">$${currDue.toFixed(2)}</span>
            </div>
          </div>

          <div class="amount-box">
            <p style="margin:0 0 5px; font-size: 14px; color:#666;">Total Paid Amount</p>
            <h2>$${amountPaid.toFixed(2)}</h2>
          </div>

          <div class="footer">
            <p>This is a computer generated receipt.</p>
            <p>Thank you for your payment!</p>
          </div>
        </div>
        <div class="no-print" style="text-align:center; margin-top:20px;">
          <button onclick="window.print()" style="padding:10px 30px; background:#000; color:#fff; border:none; border-radius:5px; cursor:pointer; font-size:16px;">
            Print Receipt
          </button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleClose = () => {
    setForm({ supplier: "", amount: "", payment_method: "cash", mobile_operator: "", transaction_id: "", note: "" });
    setShowSuccess(false);
    setInvoiceData(null);
    setErrors({});
    onClose();
  };

  // ================= SUCCESS POPUP VIEW =================
  if (showSuccess && invoiceData) {
    // পেমেন্ট করার আগের ডিউ
    const prevDue = Number(selectedSupplier?.due_amount || 0);
    // পেমেন্ট করার পরের অবশিষ্ট ডিউ
    const currDue = prevDue - Number(invoiceData.amount);

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-[fadeIn_0.3s_ease-out]">
          {/* Green Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Payment Successful!</h2>
          </div>

          {/* Invoice Info */}
          <div className="p-6 space-y-3">
            <div className="flex justify-between text-sm border-b pb-2">
              <span className="text-gray-500">Invoice</span>
              <span className="font-bold text-gray-800">{invoiceData.invoice_no}</span>
            </div>
            <div className="flex justify-between text-sm border-b pb-2">
              <span className="text-gray-500">Supplier</span>
              <span className="font-semibold text-gray-800">{invoiceData.supplier_name}</span>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg space-y-2 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Previous Due</span>
                <span className="font-semibold text-gray-800">${prevDue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Amount Paid</span>
                <span className="font-bold">- ${Number(invoiceData.amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                <span className="text-gray-700 font-medium">Remaining Due</span>
                <span className="font-bold text-red-600">${currDue.toFixed(2)}</span>
              </div>
            </div>

            {errors.message && <p className="text-red-500 text-xs text-center pt-2">{errors.message}</p>}

            {/* Buttons */}
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={handlePrint}
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Invoice
              </button>
              <button
                onClick={handleClose}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= FORM VIEW =================
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Supplier Due Payment</h2>
            <p className="text-xs text-gray-500 mt-0.5">Record a supplier's due payment</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Customer Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Supplier *</label>
            <select
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              required
            >
              <option value="">-- Choose Supplier --</option>
              {suppliers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.phone ? `(${c.phone})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Customer Due Info */}
          {selectedSupplier && (
            <div className="space-y-2">
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg text-sm flex justify-between">
                <span>Current Outstanding Due:</span>
                <span className="font-bold">${Number(selectedSupplier.due_amount).toFixed(2)}</span>
              </div>
              {form.amount > 0 && (
                <div className="bg-gray-50 border border-gray-200 text-gray-700 p-3 rounded-lg text-sm flex justify-between">
                  <span>Remaining Balance:</span>
                  <span className="font-bold text-red-600">
                    ${(Number(selectedSupplier.due_amount) - Number(form.amount)).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount *</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
            <select
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="cash">Cash</option>
              <option value="mobile_banking">Mobile Banking</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          {/* Conditional: Mobile Operator */}
          {form.payment_method === "mobile_banking" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Operator</label>
              <select
                name="mobile_operator"
                value={form.mobile_operator}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                required
              >
                <option value="">-- Select Operator --</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="rocket">Rocket</option>
                <option value="upay">Upay</option>
              </select>
            </div>
          )}

          {/* Conditional: Transaction ID (for mobile or bank) */}
          {(form.payment_method === "mobile_banking" || form.payment_method === "bank") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID *</label>
              <input
                type="text"
                name="transaction_id"
                value={form.transaction_id}
                onChange={handleChange}
                placeholder="Enter TxID"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          )}

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Any extra details..."
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="2"
            />
          </div>

          {errors.message && (
            <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{errors.message}</p>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Collect Payment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierDuePaymentModal;
