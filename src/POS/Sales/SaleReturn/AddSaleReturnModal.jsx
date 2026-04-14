// import React, { useState, useMemo } from "react";
// import AsyncSelect from "react-select/async";
// import {posSaleProductAPI} from "../../../context_or_provider/pos/Sale/saleProduct/productSaleAPI";
// import {posSaleReturnAPI} from "../../../context_or_provider/pos/Sale/saleReturnProduct/PosSaleReturnAPI";
//
// const AddSaleReturnModal = ({ isOpen, onClose, onSuccess }) => {
//   const [purchase, setPurchase] = useState(null);
//   const [returnItems, setReturnItems] = useState({});
//   const [paidAmount, setPaidAmount] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState("hand cash");
//   const [loading, setLoading] = useState(false);
//   const [returnedQuantitiesMap, setReturnedQuantitiesMap] = useState({}); // New state for returned quantities
//   const [existingReturnId, setExistingReturnId] = useState(null); // New state for existing return ID
//
//
//     /* ================= CALCULATIONS ================= */
//   const totalReturnAmount = useMemo(() => {
//     if (!purchase) return 0;
//
//     return purchase.items.reduce((sum, item) => {
//       const qty = Number(returnItems[item.id] || 0);
//       return sum + qty * Number(item.unit_price);
//     }, 0);
//   }, [returnItems, purchase]);
//
//   const dueAmount = totalReturnAmount - paidAmount;
//
//   if (!isOpen) return null;
//
//   /* ================= LOAD PURCHASE ================= */
//   const loadPurchaseOptions = async (input) => {
//     const res = await posSaleProductAPI.search(input || "");
//     return res.data.map(p => ({
//       value: p.id,
//       label: `Invoice #${p.invoice_no}`,
//     }));
//   };
//
//   /* ================= PURCHASE SELECT ================= */
//   const handlePurchaseSelect = async (option) => {
//     // Purchase details
//     const purchaseRes = await posSaleProductAPI.getById(option.value);
//     const purchaseData = purchaseRes.data;
//
//     // All purchase returns
//     const returnRes = await posSaleReturnAPI.getAll();
//
//     // Filter returns of this purchase
//     const relatedReturns = returnRes.data.filter(
//         r => r.purchase === option.value
//     );
//
//     // If a return already exists, store its ID for potential update
//     if (relatedReturns.length > 0) {
//       setExistingReturnId(relatedReturns[0].id); // Using the first one found
//     } else {
//       setExistingReturnId(null);
//     }
//
//     // Calculate already returned quantity per purchase_item
//     const newReturnedMap = {};
//     relatedReturns.forEach(r => {
//         r.items.forEach(i => {
//             newReturnedMap[i.purchase_item] =
//                 (newReturnedMap[i.purchase_item] || 0) + i.quantity;
//         });
//     });
//     setReturnedQuantitiesMap(newReturnedMap); // Store the map in state
//
//     setPurchase(purchaseData); // Set purchase without modifying its items directly
//     setReturnItems({});
//     setPaidAmount(0);
//   };
//
//   /* ================= Handle Quantity Change ================= */
//   const handleQtyChange = (item, quantity) => {
//     const qty = Number(quantity);
//     const alreadyReturned = returnedQuantitiesMap[item.id] || 0;
//     const availableQuantity = item.quantity - alreadyReturned;
//
//     if (qty > availableQuantity) {
//         alert("Return quantity cannot exceed available quantity");
//         return;
//     }
//     setReturnItems({
//         ...returnItems,
//         [item.id]: qty,
//     });
//   };
//
//   /* ================= SUBMIT ================= */
//   const handleSubmit = async () => {
//     if (!purchase) {
//       alert("Purchase select করুন");
//       return;
//     }
//
//     const items = purchase.items
//       .filter(i => Number(returnItems[i.id]) > 0)
//       .map(i => ({
//         purchase_item: i.id,
//         quantity: Number(returnItems[i.id]),
//         unit_price: i.unit_price,
//         reason: "Returned",
//       }));
//
//     if (!items.length) {
//       alert("কমপক্ষে একটি item return করুন");
//       return;
//     }
//
//     const payload = {
//       purchase: purchase.id,
//       supplier: purchase.supplier,
//       paid_amount: paidAmount,
//       payment_method: paymentMethod,
//       items,
//     };
//
//     try {
//       setLoading(true);
//       let response;
//       if (existingReturnId) {
//         // Update existing return
//        response= await posSaleReturnAPI.update(existingReturnId, payload);
//       } else {
//         // Create new return
//         response=await posSaleReturnAPI.create(payload);
//       }
//
//       onSuccess?.(response.data);
//       //  onSuccess?.({ data: response.data, title: "Purchase Return Added!", message: "The purchase return has been successfully recorded." });
//
//     } catch (err) {
//       console.error(err);
//       alert("Purchase return failed");
//     } finally {
//       setLoading(false);
//     }
//   };
//   /* ================= UI ================= */
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-xl w-full max-w-3xl">
//
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-bold">Purchase Return</h2>
//           {purchase && (
//             <span className={`px-3 py-1 rounded-full text-sm font-semibold ${existingReturnId ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
//               {existingReturnId ? 'Update Return' : 'New Return'}
//             </span>
//           )}
//         </div>
//
//         {/* Purchase select */}
//         <AsyncSelect
//           loadOptions={loadPurchaseOptions}
//           onChange={handlePurchaseSelect}
//           placeholder="Search purchase invoice..."
//         />
//
//         {/* Items */}
//         {purchase && (
//           <div className="mt-4 space-y-3">
//             {purchase.items.map(item => {
//               const currentAvailableQuantity = item.quantity - (returnedQuantitiesMap[item.id] || 0);
//               return (
//                 <div key={item.id} className="flex justify-between items-center">
//                   <div>
//                     <p className="font-medium">{item.product_name}</p>
//                     <p className="text-xs text-gray-500">
//                       Purchased: {item.quantity} | Available: {currentAvailableQuantity}
//                     </p>
//                   </div>
//
//                   <input
//                     type="number"
//                     min="0"
//                     max={currentAvailableQuantity}
//                     className="input w-24"
//                     placeholder="Qty"
//                     value={returnItems[item.id] || ""}
//                     onChange={e => handleQtyChange(item, e.target.value)}
//                   />
//                 </div>
//               );
//             })}
//           </div>
//         )}
//
//         {/* Payment */}
//         {purchase && (
//           <div className="mt-6 space-y-2">
//             <div className="flex justify-between">
//               <span>Total Return</span>
//               <strong>৳ {totalReturnAmount.toFixed(2)}</strong>
//             </div>
//
//             <div className="flex justify-between items-center">
//               <span>Paid</span>
//               <input
//                 type="number"
//                 className="input w-32 text-right"
//                 value={paidAmount}
//                 onChange={e => setPaidAmount(Number(e.target.value))}
//               />
//             </div>
//
//             <div className="flex justify-between text-red-600 font-semibold">
//               <span>Due</span>
//               <span>৳ {dueAmount.toFixed(2)}</span>
//             </div>
//
//             <select
//               className="input w-full"
//               value={paymentMethod}
//               onChange={e => setPaymentMethod(e.target.value)}
//             >
//               <option value="hand cash">Hand Cash</option>
//               <option value="bkash">bKash</option>
//               <option value="bank">Bank</option>
//             </select>
//           </div>
//         )}
//
//         {/* Actions */}
//         <div className="flex justify-end gap-3 mt-6">
//           <button onClick={onClose} className="btn-gray">Cancel</button>
//           <button
//             disabled={loading}
//             onClick={handleSubmit}
//             className="btn-danger"
//           >
//             {loading ? "Saving..." : "Confirm Return"}
//           </button>
//         </div>
//
//       </div>
//
//     </div>
//   );
// };
//
// export default AddSaleReturnModal;


///////////////////////////////////////////////////////////////

import React, { useState, useMemo } from "react";
import AsyncSelect from "react-select/async";
import { posSaleProductAPI } from "../../../context_or_provider/pos/Sale/saleProduct/productSaleAPI";
import { posSaleReturnAPI } from "../../../context_or_provider/pos/Sale/saleReturnProduct/PosSaleReturnAPI";

const AddSaleReturnModal = ({ isOpen, onClose, onSuccess }) => {
  const [sale, setSale] = useState(null);
  const [returnItems, setReturnItems] = useState({});
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("hand cash");
  const [loading, setLoading] = useState(false);
  const [returnedQuantitiesMap, setReturnedQuantitiesMap] = useState({});
  const [existingReturnId, setExistingReturnId] = useState(null);
  const [note, setNote] = useState("");
  const [returnReason, setReturnReason] = useState("");

  /* ================= CALCULATIONS ================= */
  const totalReturnAmount = useMemo(() => {
    if (!sale) return 0;

    return sale.items.reduce((sum, item) => {
      const qty = Number(returnItems[item.id] || 0);
      return sum + qty * Number(item.unit_price);
    }, 0);
  }, [returnItems, sale]);

  const dueAmount = totalReturnAmount - paidAmount;

  if (!isOpen) return null;

  /* ================= LOAD SALES ================= */
  const loadSaleOptions = async (input) => {
    const res = await posSaleProductAPI.search(input || "");
    return res.data.map(s => ({
      value: s.id,
      label: `Invoice #${s.invoice_no} - ${s.customer_name || 'Walk-in'}`,
    }));
  };

  /* ================= SALE SELECT ================= */
  const handleSaleSelect = async (option) => {
    // Sale details
    const saleRes = await posSaleProductAPI.getById(option.value);
    const saleData = saleRes.data;

    // All sale returns
    const returnRes = await posSaleReturnAPI.getAll();

    // Filter returns of this sale
    const relatedReturns = returnRes.data.filter(
      r => r.sale === option.value
    );

    // If a return already exists, store its ID for potential update
    if (relatedReturns.length > 0) {
      const latestReturn = relatedReturns[0];
      setExistingReturnId(latestReturn.id);

      // Set existing values
      setNote(latestReturn.note || "");
      setReturnReason(latestReturn.return_reason || "");
      setPaidAmount(parseFloat(latestReturn.paid_amount) || 0);
      setPaymentMethod(latestReturn.payment_method || "hand cash");
    } else {
      setExistingReturnId(null);
      setNote("");
      setReturnReason("");
      setPaidAmount(0);
      setPaymentMethod("hand cash");
    }

    // Calculate already returned quantity per sale_item
    const newReturnedMap = {};
    relatedReturns.forEach(r => {
      r.items.forEach(i => {
        // ✅ sale_item ব্যবহার করুন, purchase_item নয়
        newReturnedMap[i.sale_item] =
          (newReturnedMap[i.sale_item] || 0) + i.sale_return_quantity; // ✅ sale_return_quantity
      });
    });
    setReturnedQuantitiesMap(newReturnedMap);

    setSale(saleData);
    setReturnItems({});
  };

  /* ================= Handle Quantity Change ================= */
  const handleQtyChange = (item, quantity) => {
    const qty = Number(quantity);
    const alreadyReturned = returnedQuantitiesMap[item.id] || 0;
    const availableQuantity = item.quantity - alreadyReturned;

    if (qty > availableQuantity) {
      alert(`Return quantity cannot exceed available quantity (Available: ${availableQuantity})`);
      return;
    }
    setReturnItems({
      ...returnItems,
      [item.id]: qty,
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!sale) {
      alert("Sale select করুন");
      return;
    }

    const items = sale.items
      .filter(i => Number(returnItems[i.id]) > 0)
      .map(i => ({
        sale_item: i.id, // ✅ sale_item (not purchase_item)
        sale_return_quantity: Number(returnItems[i.id]), // ✅ sale_return_quantity (not quantity)
        unit_price: i.unit_price,
        reason: returnReason || "Customer Return",
      }));

    if (!items.length) {
      alert("কমপক্ষে একটি item return করুন");
      return;
    }

    const payload = {
      sale: sale.id, // ✅ sale (not purchase)
      customer: sale.customer?.id || sale.customer, // customer ID
      paid_amount: paidAmount,
      payment_method: paymentMethod,
      note: note,
      return_reason: returnReason,
      items,
    };

    try {
      setLoading(true);
      console.log("Sale Return Payload:", payload);

      let response;
      if (existingReturnId) {
        // Update existing return
        response = await posSaleReturnAPI.update(existingReturnId, payload);
      } else {
        // Create new return
        response = await posSaleReturnAPI.create(payload);
      }

      onSuccess?.(response.data);
    } catch (err) {
      console.error("Sale return error:", err);
      console.error("Error response:", err.response?.data);
      alert(`Sale return failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setSale(null);
    setReturnItems({});
    setPaidAmount(0);
    setPaymentMethod("hand cash");
    setReturnedQuantitiesMap({});
    setExistingReturnId(null);
    setNote("");
    setReturnReason("");
    onClose();
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Sale Return</h2>
          {sale && (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${existingReturnId ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
              {existingReturnId ? 'Update Return' : 'New Return'}
            </span>
          )}
        </div>

        {/* Sale select */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Sale Invoice</label>
          <AsyncSelect
            loadOptions={loadSaleOptions}
            onChange={handleSaleSelect}
            placeholder="Search sale invoice by number or customer..."
            isClearable
          />
        </div>

        {sale && (
          <>
            {/* Customer Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold">Customer: {sale.customer_name || 'Walk-in Customer'}</p>
              <p className="text-sm text-gray-600">Original Sale: #{sale.invoice_no}</p>
              <p className="text-sm text-gray-600">Date: {new Date(sale.created_at).toLocaleDateString()}</p>
            </div>

            {/* Return Notes */}
            <div className="mb-4 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Return Reason</label>
                <textarea
                  className="input w-full"
                  rows="2"
                  placeholder="Why are items being returned?"
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Additional Note</label>
                <textarea
                  className="input w-full"
                  rows="2"
                  placeholder="Any additional notes..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-4">
              <h3 className="font-semibold mb-3">Return Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sold</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Return Qty</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sale.items.map(item => {
                      const alreadyReturned = returnedQuantitiesMap[item.id] || 0;
                      const availableQuantity = item.quantity - alreadyReturned;
                      const currentReturnQty = Number(returnItems[item.id] || 0);
                      const itemTotal = currentReturnQty * Number(item.unit_price);

                      return (
                        <tr key={item.id}>
                          <td className="px-4 py-2">
                            <div>
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-xs text-gray-500">Already returned: {alreadyReturned}</p>
                            </div>
                          </td>
                          <td className="px-4 py-2">{item.quantity}</td>
                          <td className="px-4 py-2">{availableQuantity}</td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min="0"
                              max={availableQuantity}
                              className="input w-24 text-center"
                              value={currentReturnQty || ""}
                              onChange={e => handleQtyChange(item, e.target.value)}
                            />
                          </td>
                          {/*<td className="px-4 py-2">৳{item.unit_price.toFixed(2)}</td>*/}
                          <td className="px-4 py-2">৳{item.unit_price}</td>
                          {/*<td className="px-4 py-2 font-medium">৳{itemTotal.toFixed(2)}</td>*/}
                          <td className="px-4 py-2 font-medium">৳{itemTotal}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment */}
            <div className="mt-6 p-4 border-t">
              <h3 className="font-semibold mb-3">Payment Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Total Return Amount</span>
                  <strong className="text-lg">৳ {totalReturnAmount.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>Paid Amount</span>
                  <input
                    type="number"
                    className="input w-40 text-right"
                    min="0"
                    max={totalReturnAmount}
                    step="0.01"
                    value={paidAmount}
                    onChange={e => setPaidAmount(Number(e.target.value))}
                  />
                </div>
                <div className="flex justify-between text-red-600 font-semibold text-lg">
                  <span>Due Amount</span>
                  <span>৳ {dueAmount.toFixed(2)}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Method</label>
                  <select
                    className="input w-full"
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                  >
                    <option value="hand cash">Hand Cash</option>
                    <option value="bkash">bKash</option>
                    <option value="bank">Bank</option>
                    <option value="card">Card</option>
                    <option value="due">Due</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={resetForm}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            disabled={loading || !sale || totalReturnAmount === 0}
            onClick={handleSubmit}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
          >
            {loading ? "Processing..." : existingReturnId ? "Update Return" : "Confirm Return"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSaleReturnModal;