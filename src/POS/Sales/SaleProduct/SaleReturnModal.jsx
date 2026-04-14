// import React, { useState, useMemo, useEffect } from "react";
// import {posSaleReturnAPI} from "../../../context_or_provider/pos/Sale/saleReturnProduct/PosSaleReturnAPI";
//
// const SaleReturnModal = ({ isOpen, onClose, onSuccess, purchase }) => {
//   const [returnItems, setReturnItems] = useState({});
//   const [paidAmount, setPaidAmount] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState("hand cash");
//   const [loading, setLoading] = useState(false);
//   const [returnedQuantitiesMap, setReturnedQuantitiesMap] = useState({});
//   const [existingReturnId, setExistingReturnId] = useState(null);
//
//   useEffect(() => {
//     if (isOpen && purchase) {
//       const fetchExistingReturns = async () => {
//         setLoading(true);
//         try {
//           const returnRes = await posSaleReturnAPI.getAll();
//           const relatedReturns = returnRes.data.filter(
//             r => r.purchase === purchase.id
//           );
//
//           if (relatedReturns.length > 0) {
//             setExistingReturnId(relatedReturns[0].id);
//             const newReturnedMap = {};
//             relatedReturns.forEach(r => {
//               r.items.forEach(i => {
//                 newReturnedMap[i.sale_item] =
//                   (newReturnedMap[i.sale_item] || 0) + i.sale_return_quantity;
//               });
//             });
//             setReturnedQuantitiesMap(newReturnedMap);
//           } else {
//             setExistingReturnId(null);
//             setReturnedQuantitiesMap({});
//           }
//         } catch (error) {
//           console.error("Error fetching purchase returns:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
//
//       fetchExistingReturns();
//       setReturnItems({});
//       setPaidAmount(0);
//     }
//   }, [isOpen, purchase]);
//
//   const totalReturnAmount = useMemo(() => {
//     if (!purchase) return 0;
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
//   const handleQtyChange = (item, quantity) => {
//     const qty = Number(quantity);
//     const alreadyReturned = returnedQuantitiesMap[item.id] || 0;
//     const availableQuantity = item.quantity - alreadyReturned;
//
//     if (qty > availableQuantity) {
//       alert("Return quantity cannot exceed available quantity");
//       return;
//     }
//     setReturnItems({
//       ...returnItems,
//       [item.id]: qty,
//     });
//   };
//
//   const handleSubmit = async () => {
//     if (!purchase) {
//       alert("Purchase not provided");
//       return;
//     }
//
//     const items = purchase.items
//       .filter(i => Number(returnItems[i.id]) > 0)
//       .map(i => ({
//         sale_item: i.id,
//         sale_return_quantity: Number(returnItems[i.id]),
//         unit_price: i.unit_price,
//         reason: "Returned",
//       }));
//
//     if (!items.length) {
//       alert("Please return at least one item.");
//       return;
//     }
//
//     const payload = {
//       sale: purchase.id,
//       customer: purchase.customer,
//       paid_amount: paidAmount,
//       payment_method: paymentMethod,
//       items,
//     };
//
//     setLoading(true);
//     try {
//       console.log(
//         "PURCHASE return PAYLOAD 👉",
//         payload // সরাসরি payload দেখুন
//       );
//
//       console.log(
//         "Serialized PAYLOAD 👉",
//         JSON.stringify(payload, null, 2) // formatted JSON দেখুন
//       );
//
//       let response;
//       if (existingReturnId) {
//         response = await posSaleReturnAPI.update(existingReturnId, payload);
//       } else {
//         response = await posSaleReturnAPI.create(payload);
//       }
//       onSuccess?.(response.data);
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert("Purchase return failed");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-xl w-full max-w-3xl">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-bold">Purchase Return (Invoice #{purchase?.invoice_no})</h2>
//           <span className={`px-3 py-1 rounded-full text-sm font-semibold ${existingReturnId ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
//             {existingReturnId ? 'Update Return' : 'New Return'}
//           </span>
//         </div>
//
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <>
//             {/* Items */}
//             <div className="mt-4 space-y-3">
//               {purchase?.items.map(item => {
//                 const alreadyReturned = returnedQuantitiesMap[item.id] || 0;
//                 const availableQuantity = item.quantity - alreadyReturned;
//                 return (
//                   <div key={item.id} className="flex justify-between items-center">
//                     <div>
//                       <p className="font-medium">{item.product_name}</p>
//                       <p className="text-xs text-gray-500">
//                         Purchased: {item.quantity} | Available: {availableQuantity}
//                       </p>
//                     </div>
//                     <input
//                       type="number"
//                       min="0"
//                       max={availableQuantity}
//                       className="input w-24"
//                       placeholder="Qty"
//                       value={returnItems[item.id] || ""}
//                       onChange={e => handleQtyChange(item, e.target.value)}
//                     />
//                   </div>
//                 );
//               })}
//             </div>
//
//             {/* Payment */}
//             <div className="mt-6 space-y-2">
//               <div className="flex justify-between">
//                 <span>Total Return</span>
//                 <strong>৳ {totalReturnAmount.toFixed(2)}</strong>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span>Paid</span>
//                 <input
//                   type="number"
//                   className="input w-32 text-right"
//                   value={paidAmount}
//                   onChange={e => setPaidAmount(Number(e.target.value))}
//                 />
//               </div>
//               <div className="flex justify-between text-red-600 font-semibold">
//                 <span>Due</span>
//                 <span>৳ {dueAmount.toFixed(2)}</span>
//               </div>
//               <select
//                 className="input w-full"
//                 value={paymentMethod}
//                 onChange={e => setPaymentMethod(e.target.value)}
//               >
//                 <option value="hand cash">Hand Cash</option>
//                 <option value="bkash">bKash</option>
//                 <option value="bank">Bank</option>
//               </select>
//             </div>
//
//             {/* Actions */}
//             <div className="flex justify-end gap-3 mt-6">
//               <button onClick={onClose} className="btn-gray">Cancel</button>
//               <button
//                 disabled={loading}
//                 onClick={handleSubmit}
//                 className="btn-danger"
//               >
//                 {loading ? "Saving..." : "Confirm Return"}
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };
//
// export default SaleReturnModal;




// import React, { useState, useMemo, useEffect } from "react";
// import { posSaleReturnAPI } from "../../../context_or_provider/pos/Sale/saleReturnProduct/PosSaleReturnAPI";
//
// const SaleReturnModal = ({ isOpen, onClose, onSuccess, sale }) => {
//   const [returnItems, setReturnItems] = useState({});
//   const [paidAmount, setPaidAmount] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState("hand cash");
//   const [loading, setLoading] = useState(false);
//   const [returnedQuantitiesMap, setReturnedQuantitiesMap] = useState({});
//   const [existingReturnId, setExistingReturnId] = useState(null);
//   const [note, setNote] = useState("");
//   const [returnReason, setReturnReason] = useState("");
//
//   useEffect(() => {
//     if (isOpen && sale) {
//       const fetchExistingReturns = async () => {
//         setLoading(true);
//         try {
//           const returnRes = await posSaleReturnAPI.getAll();
//           const relatedReturns = returnRes.data.filter(
//             r => r.sale === sale.id
//           );
//
//           if (relatedReturns.length > 0) {
//             setExistingReturnId(relatedReturns[0].id);
//             const newReturnedMap = {};
//             const latestReturn = relatedReturns[0]; // সর্বশেষ return নিন
//
//             // Note এবং reason সেট করুন
//             setNote(latestReturn.note || "");
//             setReturnReason(latestReturn.return_reason || "");
//
//             // Returned quantities ম্যাপ তৈরি করুন
//             latestReturn.items.forEach(i => {
//               newReturnedMap[i.sale_item] =
//                 (newReturnedMap[i.sale_item] || 0) + i.sale_return_quantity;
//             });
//             setReturnedQuantitiesMap(newReturnedMap);
//
//             // Paid amount সেট করুন
//             setPaidAmount(parseFloat(latestReturn.paid_amount) || 0);
//             setPaymentMethod(latestReturn.payment_method || "hand cash");
//           } else {
//             setExistingReturnId(null);
//             setReturnedQuantitiesMap({});
//             setNote("");
//             setReturnReason("");
//             setPaidAmount(0);
//             setPaymentMethod("hand cash");
//           }
//         } catch (error) {
//           console.error("Error fetching sale returns:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
//
//       fetchExistingReturns();
//       setReturnItems({});
//     }
//   }, [isOpen, sale]);
//
//   const totalReturnAmount = useMemo(() => {
//     if (!sale) return 0;
//     return sale.items.reduce((sum, item) => {
//       const qty = Number(returnItems[item.id] || 0);
//       return sum + qty * Number(item.unit_price);
//     }, 0);
//   }, [returnItems, sale]);
//
//   const dueAmount = totalReturnAmount - paidAmount;
//
//   if (!isOpen) return null;
//
//   const handleQtyChange = (item, quantity) => {
//     const qty = Number(quantity);
//     const alreadyReturned = returnedQuantitiesMap[item.id] || 0;
//     const availableQuantity = item.quantity - alreadyReturned;
//
//     if (qty > availableQuantity) {
//       alert(`Return quantity cannot exceed available quantity. Available: ${availableQuantity}`);
//       return;
//     }
//     setReturnItems({
//       ...returnItems,
//       [item.id]: qty,
//     });
//   };
//
//   const handleSubmit = async () => {
//     if (!sale) {
//       alert("Sale not provided");
//       return;
//     }
//
//     const items = sale.items
//       .filter(i => Number(returnItems[i.id]) > 0)
//       .map(i => ({
//         sale_item: i.id,  // ✅ sale_item (not purchase_item)
//         sale_return_quantity: Number(returnItems[i.id]),  // ✅ sale_return_quantity (not quantity)
//         unit_price: i.unit_price,
//         reason: returnReason || "Returned",
//       }));
//
//     if (!items.length) {
//       alert("Please return at least one item.");
//       return;
//     }
//
//     const payload = {
//       sale: sale.id,  // ✅ sale (not purchase)
//       customer: sale.customer?.id || sale.customer,  // customer ID
//       paid_amount: paidAmount,
//       payment_method: paymentMethod,
//       note: note,
//       return_reason: returnReason,
//       items,
//     };
//
//     setLoading(true);
//     try {
//       console.log("SALE RETURN PAYLOAD 👉", payload);
//       console.log("Serialized PAYLOAD 👉", JSON.stringify(payload, null, 2));
//
//       let response;
//       if (existingReturnId) {
//         response = await posSaleReturnAPI.update(existingReturnId, payload);
//       } else {
//         response = await posSaleReturnAPI.create(payload);
//       }
//       onSuccess?.(response.data);
//       onClose();
//     } catch (err) {
//       console.error("Sale return error:", err);
//       console.error("Error response:", err.response?.data);
//       alert("Sale return failed: " + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-bold">Sale Return (Invoice #{sale?.invoice_no})</h2>
//           <span className={`px-3 py-1 rounded-full text-sm font-semibold ${existingReturnId ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
//             {existingReturnId ? 'Update Return' : 'New Return'}
//           </span>
//         </div>
//
//         {loading ? (
//           <div className="flex justify-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           </div>
//         ) : (
//           <>
//             {/* Customer Info */}
//             <div className="mb-4 p-3 bg-gray-50 rounded-lg">
//               <p className="font-semibold">Customer: {sale?.customer_name}</p>
//               <p className="text-sm text-gray-600">Original Sale: {sale?.invoice_no}</p>
//             </div>
//
//             {/* Return Notes */}
//             <div className="mb-4 space-y-3">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Return Reason</label>
//                 <textarea
//                   className="input w-full"
//                   rows="2"
//                   placeholder="Why are items being returned?"
//                   value={returnReason}
//                   onChange={e => setReturnReason(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Additional Note</label>
//                 <textarea
//                   className="input w-full"
//                   rows="2"
//                   placeholder="Any additional notes..."
//                   value={note}
//                   onChange={e => setNote(e.target.value)}
//                 />
//               </div>
//             </div>
//
//             {/* Items */}
//             <div className="mt-4">
//               <h3 className="font-semibold mb-3">Return Items</h3>
//               <div className="space-y-3">
//                 {sale?.items.map(item => {
//                   const alreadyReturned = returnedQuantitiesMap[item.id] || 0;
//                   const availableQuantity = item.quantity - alreadyReturned;
//                   const currentReturnQty = Number(returnItems[item.id] || 0);
//                   const itemTotal = currentReturnQty * Number(item.unit_price);
//
//                   return (
//                     <div key={item.id} className="border rounded-lg p-3">
//                       <div className="flex justify-between items-start mb-2">
//                         <div className="flex-1">
//                           <p className="font-medium">{item.product_name}</p>
//                           <p className="text-sm text-gray-500">
//                             Unit Price: ৳{item.unit_price.toFixed(2)}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-sm text-gray-500">
//                             Sold: {item.quantity} | Available: {availableQuantity}
//                           </p>
//                           <p className="text-sm text-red-500">
//                             Already Returned: {alreadyReturned}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3">
//                           <button
//                             type="button"
//                             className="px-3 py-1 border rounded"
//                             onClick={() => handleQtyChange(item, Math.max(0, currentReturnQty - 1))}
//                             disabled={currentReturnQty <= 0}
//                           >
//                             -
//                           </button>
//                           <input
//                             type="number"
//                             min="0"
//                             max={availableQuantity}
//                             className="input w-20 text-center"
//                             value={currentReturnQty || ""}
//                             onChange={e => handleQtyChange(item, e.target.value)}
//                           />
//                           <button
//                             type="button"
//                             className="px-3 py-1 border rounded"
//                             onClick={() => handleQtyChange(item, currentReturnQty + 1)}
//                             disabled={currentReturnQty >= availableQuantity}
//                           >
//                             +
//                           </button>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-medium">৳{itemTotal.toFixed(2)}</p>
//                           <p className="text-xs text-gray-500">
//                             {currentReturnQty} × ৳{item.unit_price.toFixed(2)}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//
//             {/* Payment */}
//             <div className="mt-6 p-4 border-t">
//               <h3 className="font-semibold mb-3">Payment Information</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span>Total Return Amount</span>
//                   <strong className="text-lg">৳ {totalReturnAmount.toFixed(2)}</strong>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span>Paid Amount</span>
//                   <input
//                     type="number"
//                     className="input w-40 text-right"
//                     min="0"
//                     max={totalReturnAmount}
//                     step="0.01"
//                     value={paidAmount}
//                     onChange={e => setPaidAmount(Number(e.target.value))}
//                   />
//                 </div>
//                 <div className="flex justify-between text-red-600 font-semibold text-lg">
//                   <span>Due Amount</span>
//                   <span>৳ {dueAmount.toFixed(2)}</span>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Payment Method</label>
//                   <select
//                     className="input w-full"
//                     value={paymentMethod}
//                     onChange={e => setPaymentMethod(e.target.value)}
//                   >
//                     <option value="hand cash">Hand Cash</option>
//                     <option value="bkash">bKash</option>
//                     <option value="bank">Bank</option>
//                     <option value="card">Card</option>
//                     <option value="due">Due</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//
//             {/* Actions */}
//             <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
//               <button
//                 onClick={onClose}
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 disabled={loading || totalReturnAmount === 0}
//                 onClick={handleSubmit}
//                 className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
//               >
//                 {loading ? "Processing..." : existingReturnId ? "Update Return" : "Confirm Return"}
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };
//
// export default SaleReturnModal;


import React, { useState, useMemo, useEffect } from "react";
import { posSaleReturnAPI } from "../../../context_or_provider/pos/Sale/saleReturnProduct/PosSaleReturnAPI";

const SaleReturnModal = ({ isOpen, onClose, onSuccess, purchase }) => {
  const [returnItems, setReturnItems] = useState({});
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("hand cash");
  const [loading, setLoading] = useState(false);
  const [returnedQuantitiesMap, setReturnedQuantitiesMap] = useState({});
  const [existingReturnId, setExistingReturnId] = useState(null);
  const [note, setNote] = useState("");
  const [returnReason, setReturnReason] = useState("");

  useEffect(() => {
    if (isOpen && purchase) {
      const fetchExistingReturns = async () => {
        setLoading(true);
        try {
          const returnRes = await posSaleReturnAPI.getAll();
          const relatedReturns = returnRes.data.filter(
            r => r.sale === purchase.id
          );

          if (relatedReturns.length > 0) {
            setExistingReturnId(relatedReturns[0].id);
            const newReturnedMap = {};
            const latestReturn = relatedReturns[0]; // সর্বশেষ return নিন

            // Note এবং reason সেট করুন
            setNote(latestReturn.note || "");
            setReturnReason(latestReturn.return_reason || "");

            // Returned quantities ম্যাপ তৈরি করুন
            latestReturn.items.forEach(i => {
              newReturnedMap[i.sale_item] =
                (newReturnedMap[i.sale_item] || 0) + i.sale_return_quantity;
            });
            setReturnedQuantitiesMap(newReturnedMap);

            // Paid amount সেট করুন
            setPaidAmount(parseFloat(latestReturn.paid_amount) || 0);
            setPaymentMethod(latestReturn.payment_method || "hand cash");
          } else {
            setExistingReturnId(null);
            setReturnedQuantitiesMap({});
            setNote("");
            setReturnReason("");
            setPaidAmount(0);
            setPaymentMethod("hand cash");
          }
        } catch (error) {
          console.error("Error fetching sale returns:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchExistingReturns();
      setReturnItems({});
    }
  }, [isOpen, purchase]);

  const totalReturnAmount = useMemo(() => {
    if (!purchase) return 0;
    return purchase.items.reduce((sum, item) => {
      const qty = Number(returnItems[item.id] || 0);
      return sum + qty * Number(item.unit_price);
    }, 0);
  }, [returnItems, purchase]);

  const dueAmount = totalReturnAmount - paidAmount;

  if (!isOpen) return null;

  const handleQtyChange = (item, quantity) => {
    const qty = Number(quantity);
    const alreadyReturned = returnedQuantitiesMap[item.id] || 0;
    const availableQuantity = item.quantity - alreadyReturned;

    if (qty > availableQuantity) {
      alert(`Return quantity cannot exceed available quantity. Available: ${availableQuantity}`);
      return;
    }
    setReturnItems({
      ...returnItems,
      [item.id]: qty,
    });
  };

  const handleSubmit = async () => {
    if (!purchase) {
      alert("Sale not provided");
      return;
    }

    const items = purchase.items
      .filter(i => Number(returnItems[i.id]) > 0)
      .map(i => ({
        sale_item: i.id,  // ✅ sale_item (not purchase_item)
        sale_return_quantity: Number(returnItems[i.id]),  // ✅ sale_return_quantity (not quantity)
        unit_price: i.unit_price,
        reason: returnReason || "Returned",
      }));

    if (!items.length) {
      alert("Please return at least one item.");
      return;
    }

    const payload = {
      sale: purchase.id,  // ✅ sale (not purchase)
      customer: purchase.customer?.id || purchase.customer,  // customer ID
      paid_amount: paidAmount,
      payment_method: paymentMethod,
      note: note,
      return_reason: returnReason,
      items,
    };

    setLoading(true);
    try {
      console.log("SALE RETURN PAYLOAD 👉", payload);
      console.log("Serialized PAYLOAD 👉", JSON.stringify(payload, null, 2));

      let response;
      if (existingReturnId) {
        response = await posSaleReturnAPI.update(existingReturnId, payload);
      } else {
        response = await posSaleReturnAPI.create(payload);
      }
      onSuccess?.(response.data);
      onClose();
    } catch (err) {
      console.error("Sale return error:", err);
      console.error("Error response:", err.response?.data);
      alert("Sale return failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Sale Return (Invoice #{purchase?.invoice_no})</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${existingReturnId ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
            {existingReturnId ? 'Update Return' : 'New Return'}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Customer Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold">Customer: {purchase?.customer_name}</p>
              <p className="text-sm text-gray-600">Original Sale: {purchase?.invoice_no}</p>
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

            {/* Items */}
            <div className="mt-4">
              <h3 className="font-semibold mb-3">Return Items</h3>
              <div className="space-y-3">
                {purchase?.items.map(item => {
                  const alreadyReturned = returnedQuantitiesMap[item.id] || 0;
                  const availableQuantity = item.quantity - alreadyReturned;
                  const currentReturnQty = Number(returnItems[item.id] || 0);
                  const itemTotal = currentReturnQty * Number(item.unit_price);

                  return (
                    <div key={item.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-500">
                            {/*Unit Price: ৳{item.unit_price.toFixed(2)}*/}
                            Unit Price: ৳{item.unit_price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Sold: {item.quantity} | Available: {availableQuantity}
                          </p>
                          <p className="text-sm text-red-500">
                            Already Returned: {alreadyReturned}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            className="px-3 py-1 border rounded"
                            onClick={() => handleQtyChange(item, Math.max(0, currentReturnQty - 1))}
                            disabled={currentReturnQty <= 0}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            max={availableQuantity}
                            className="input w-20 text-center"
                            value={currentReturnQty || ""}
                            onChange={e => handleQtyChange(item, e.target.value)}
                          />
                          <button
                            type="button"
                            className="px-3 py-1 border rounded"
                            onClick={() => handleQtyChange(item, currentReturnQty + 1)}
                            disabled={currentReturnQty >= availableQuantity}
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          {/*<p className="font-medium">৳{itemTotal.toFixed(2)}</p>*/}
                          <p className="font-medium">৳{itemTotal}</p>
                          <p className="text-xs text-gray-500">
                            {/*{currentReturnQty} × ৳{item.unit_price.toFixed(2)}*/}
                            {currentReturnQty} × ৳{item.unit_price}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment */}
            <div className="mt-6 p-4 border-t">
              <h3 className="font-semibold mb-3">Payment Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Total Return Amount</span>
                  {/*<strong className="text-lg">৳ {totalReturnAmount.toFixed(2)}</strong>*/}
                  <strong className="text-lg">৳ {totalReturnAmount}</strong>
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
                  {/*<span>৳ {dueAmount.toFixed(2)}</span>*/}
                  <span>৳ {dueAmount}</span>
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

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                disabled={loading || totalReturnAmount === 0}
                onClick={handleSubmit}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
              >
                {loading ? "Processing..." : existingReturnId ? "Update Return" : "Confirm Return"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SaleReturnModal;