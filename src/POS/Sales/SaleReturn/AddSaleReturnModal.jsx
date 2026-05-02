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

import React, {useState, useMemo, useEffect} from "react";
import AsyncSelect from "react-select/async";
import { posSaleProductAPI } from "../../../context_or_provider/pos/Sale/saleProduct/productSaleAPI";
import { posSaleReturnAPI } from "../../../context_or_provider/pos/Sale/saleReturnProduct/PosSaleReturnAPI";

const AddSaleReturnModal = ({ isOpen, onClose, onSuccess }) => {
  const [sale, setSale] = useState(null);
  const [returnItems, setReturnItems] = useState({});
  const [itemPenalties, setItemPenalties] = useState({});
  const [globalPenalty, setGlobalPenalty] = useState(0);

  // Hybrid Payment States
  const [paidCash, setPaidCash] = useState(0);
  const [paidMobile, setPaidMobile] = useState(0);
  const [paidBank, setPaidBank] = useState(0);
  const [mobileOperator, setMobileOperator] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("hand cash");
  const [loading, setLoading] = useState(false);
  const [returnedQuantitiesMap, setReturnedQuantitiesMap] = useState({});
  const [existingReturnId, setExistingReturnId] = useState(null);
  const [note, setNote] = useState("");
  const [returnReason, setReturnReason] = useState("");

  // Auto update payment method based on inputs
  useEffect(() => {
    const counts = [paidCash > 0, paidMobile > 0, paidBank > 0].filter(Boolean).length;
    if (counts > 1) {
      setPaymentMethod("hybrid");
    } else if (paidMobile > 0) {
      setPaymentMethod("mobile_banking");
    } else if (paidBank > 0) {
      setPaymentMethod("bank");
    } else {
      setPaymentMethod("hand cash");
    }
  }, [paidCash, paidMobile, paidBank]);

  /* ================= CALCULATIONS ================= */
  const totalReturnAmount = useMemo(() => {
    if (!sale) return 0;
    return sale.items.reduce((sum, item) => {
      const qty = Number(returnItems[item.id] || 0);
      return sum + qty * Number(item.unit_price);
    }, 0);
  }, [returnItems, sale]);

  const totalItemPenalty = useMemo(() => {
    return Object.values(itemPenalties).reduce((sum, p) => sum + Number(p || 0), 0);
  }, [itemPenalties]);

  const netReturnAmount = totalReturnAmount - totalItemPenalty - Number(globalPenalty || 0);
  const totalPaid = Number(paidCash) + Number(paidMobile) + Number(paidBank);
  const dueAmount = netReturnAmount - totalPaid;

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
    if (!option) {
      setSale(null);
      return;
    }
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
      setPaidCash(parseFloat(latestReturn.paid_cash) || 0);
      setPaidMobile(parseFloat(latestReturn.paid_mobile) || 0);
      setPaidBank(parseFloat(latestReturn.paid_bank) || 0);
      setGlobalPenalty(parseFloat(latestReturn.global_penalty) || 0);
    } else {
      setExistingReturnId(null);
      setNote("");
      setReturnReason("");
      setPaidCash(0);
      setPaidMobile(0);
      setPaidBank(0);
      setGlobalPenalty(0);
    }

    // Calculate already returned quantity per sale_item
    const newReturnedMap = {};
    relatedReturns.forEach(r => {
      r.items.forEach(i => {
        newReturnedMap[i.sale_item] =
          (newReturnedMap[i.sale_item] || 0) + i.sale_return_quantity;
      });
    });
    setReturnedQuantitiesMap(newReturnedMap);

    setSale(saleData);
    setReturnItems({});
    setItemPenalties({});
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
    
    // Reset penalty if qty becomes 0
    if (qty === 0) {
      const newPenalties = { ...itemPenalties };
      delete newPenalties[item.id];
      setItemPenalties(newPenalties);
    }
  };

  const handlePenaltyChange = (itemId, penalty) => {
    setItemPenalties({
      ...itemPenalties,
      [itemId]: Number(penalty),
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
        sale_item: i.id,
        sale_return_quantity: Number(returnItems[i.id]),
        unit_price: i.unit_price,
        penalty_amount: Number(itemPenalties[i.id] || 0),
        reason: returnReason || "Customer Return",
      }));

    if (!items.length) {
      alert("কমপক্ষে একটি item return করুন");
      return;
    }

    const payload = {
      sale: sale.id,
      customer: sale.customer?.id || sale.customer,
      total_return_amount: totalReturnAmount,
      total_item_penalty: totalItemPenalty,
      global_penalty: Number(globalPenalty),
      net_return_amount: netReturnAmount,
      paid_cash: paidCash,
      paid_mobile: paidMobile,
      paid_bank: paidBank,
      mobile_operator: paidMobile > 0 ? mobileOperator : "",
      transaction_id: paidMobile > 0 ? transactionId : "",
      bank_account_no: paidBank > 0 ? bankAccountNo : "",
      payment_method: paymentMethod,
      note: note,
      return_reason: returnReason,
      items,
    };

    try {
      setLoading(true);
      let response;
      if (existingReturnId) {
        response = await posSaleReturnAPI.update(existingReturnId, payload);
      } else {
        response = await posSaleReturnAPI.create(payload);
      }
      onSuccess?.(response.data);
    } catch (err) {
      console.error("Sale return error:", err);
      alert(`Sale return failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setSale(null);
    setReturnItems({});
    setItemPenalties({});
    setGlobalPenalty(0);
    setPaidCash(0);
    setPaidMobile(0);
    setPaidBank(0);
    setReturnedQuantitiesMap({});
    setExistingReturnId(null);
    setNote("");
    setReturnReason("");
    onClose();
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Sale Return</h2>
          {sale && (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${existingReturnId ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
              {existingReturnId ? 'Update Return' : 'New Return'}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Sale Invoice</label>
          <AsyncSelect
            loadOptions={loadSaleOptions}
            onChange={handleSaleSelect}
            placeholder="Search sale invoice..."
            isClearable
          />
        </div>

        {sale && (
          <>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg flex justify-between">
              <div>
                <p className="font-semibold">Customer: {sale.customer_name || 'Walk-in'}</p>
                <p className="text-sm text-gray-600">Original Sale: #{sale.invoice_no}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Original Net Total: ৳{sale.net_total}</p>
                <p className="text-sm text-red-600">Original Due: ৳{sale.due_amount}</p>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Return Reason</label>
                <textarea className="input w-full" rows="1" value={returnReason} onChange={e => setReturnReason(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Note</label>
                <textarea className="input w-full" rows="1" value={note} onChange={e => setNote(e.target.value)} />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-bold uppercase">Product</th>
                    <th className="px-4 py-2 text-center text-xs font-bold uppercase">Sold</th>
                    <th className="px-4 py-2 text-center text-xs font-bold uppercase">Avail.</th>
                    <th className="px-4 py-2 text-center text-xs font-bold uppercase">Return Qty</th>
                    <th className="px-4 py-2 text-right text-xs font-bold uppercase">Unit Price</th>
                    <th className="px-4 py-2 text-right text-xs font-bold uppercase text-red-600">Penalty</th>
                    <th className="px-4 py-2 text-right text-xs font-bold uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sale.items.map(item => {
                    const alreadyReturned = returnedQuantitiesMap[item.id] || 0;
                    const availableQuantity = item.quantity - alreadyReturned;
                    const qty = Number(returnItems[item.id] || 0);
                    const penalty = Number(itemPenalties[item.id] || 0);
                    const total = (qty * Number(item.unit_price)) - penalty;

                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm font-medium">{item.product_name}</td>
                        <td className="px-4 py-2 text-center text-sm">{item.quantity}</td>
                        <td className="px-4 py-2 text-center text-sm">{availableQuantity}</td>
                        <td className="px-4 py-2">
                          <input type="number" min="0" max={availableQuantity} className="input w-20 text-center mx-auto block" value={returnItems[item.id] || ""} onChange={e => handleQtyChange(item, e.target.value)} />
                        </td>
                        <td className="px-4 py-2 text-right text-sm">৳{item.unit_price}</td>
                        <td className="px-4 py-2">
                          <input type="number" min="0" className="input w-24 text-right mx-auto block text-red-600" value={itemPenalties[item.id] || ""} onChange={e => handlePenaltyChange(item.id, e.target.value)} disabled={qty === 0} />
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-sm">৳{total.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl border space-y-4">
                <label className="block text-sm font-bold text-gray-700">Payment to Customer</label>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="text-[10px] uppercase font-bold text-gray-500">Cash</label><input type="number" className="w-full border p-2 rounded-lg font-bold" value={paidCash} onChange={(e) => setPaidCash(Number(e.target.value))}/></div>
                  <div><label className="text-[10px] uppercase font-bold text-gray-500">Mobile</label><input type="number" className="w-full border p-2 rounded-lg font-bold" value={paidMobile} onChange={(e) => setPaidMobile(Number(e.target.value))}/></div>
                  <div><label className="text-[10px] uppercase font-bold text-gray-500">Bank</label><input type="number" className="w-full border p-2 rounded-lg font-bold" value={paidBank} onChange={(e) => setPaidBank(Number(e.target.value))}/></div>
                </div>

                {paidMobile > 0 && (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-orange-50 rounded-lg border">
                    <div><label className="text-[10px] uppercase font-bold">Operator</label><select className="w-full border p-2 rounded-lg bg-white" value={mobileOperator} onChange={(e) => setMobileOperator(e.target.value)}><option value="">Select</option><option value="bkash">bKash</option><option value="nagad">Nagad</option></select></div>
                    <div><label className="text-[10px] uppercase font-bold">Trx ID</label><input className="w-full border p-2 rounded-lg" value={transactionId} onChange={(e) => setTransactionId(e.target.value)}/></div>
                  </div>
                )}
                {paidBank > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg border"><label className="text-[10px] uppercase font-bold">Bank A/C</label><input className="w-full border p-2 rounded-lg" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)}/></div>
                )}
              </div>

              <div className="bg-gray-900 text-white p-6 rounded-xl space-y-3">
                <div className="flex justify-between text-sm"><span>Gross Return Amount</span><span className="font-mono">৳{totalReturnAmount.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm text-red-400"><span>Total Item Penalty</span><span className="font-mono">- ৳{totalItemPenalty.toFixed(2)}</span></div>
                <div className="flex justify-between items-center text-sm text-red-400">
                  <span>Global Penalty</span>
                  <input type="number" className="w-24 bg-gray-800 border-gray-700 rounded text-right p-1 font-mono text-white" value={globalPenalty} onChange={e => setGlobalPenalty(Number(e.target.value))} />
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-gray-700"><span className="font-bold">Net Return</span><span className="font-mono font-black text-2xl text-green-400">৳{netReturnAmount.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-700"><span>Paid back to Customer</span><span className="font-mono">৳{totalPaid.toFixed(2)}</span></div>
                <div className="flex justify-between text-lg text-red-500 font-bold"><span>Balance Due</span><span className="font-mono">৳{dueAmount.toFixed(2)}</span></div>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button onClick={resetForm} className="btn-gray">Cancel</button>
          <button disabled={loading || !sale || totalReturnAmount === 0} onClick={handleSubmit} className="px-8 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400">
            {loading ? "Processing..." : existingReturnId ? "Update Return" : "Confirm Return"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSaleReturnModal;