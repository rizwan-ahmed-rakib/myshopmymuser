import React, { useState, useMemo, useEffect } from "react";
import { posSaleReturnAPI } from "../../../context_or_provider/pos/Sale/saleReturnProduct/PosSaleReturnAPI";

const SaleReturnModal = ({ isOpen, onClose, onSuccess, purchase }) => {
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
            const latestReturn = relatedReturns[0];
            setExistingReturnId(latestReturn.id);
            
            // Set existing values
            setNote(latestReturn.note || "");
            setReturnReason(latestReturn.return_reason || "");
            setPaidCash(parseFloat(latestReturn.paid_cash) || 0);
            setPaidMobile(parseFloat(latestReturn.paid_mobile) || 0);
            setPaidBank(parseFloat(latestReturn.paid_bank) || 0);
            setGlobalPenalty(parseFloat(latestReturn.global_penalty) || 0);
            setMobileOperator(latestReturn.mobile_operator || "");
            setTransactionId(latestReturn.transaction_id || "");
            setBankAccountNo(latestReturn.bank_account_no || "");

            const newReturnedMap = {};
            relatedReturns.forEach(r => {
              r.items.forEach(i => {
                newReturnedMap[i.sale_item] =
                  (newReturnedMap[i.sale_item] || 0) + i.sale_return_quantity;
              });
            });
            setReturnedQuantitiesMap(newReturnedMap);
          } else {
            setExistingReturnId(null);
            setReturnedQuantitiesMap({});
            setNote("");
            setReturnReason("");
            setPaidCash(0);
            setPaidMobile(0);
            setPaidBank(0);
            setGlobalPenalty(0);
            setMobileOperator("");
            setTransactionId("");
            setBankAccountNo("");
          }
        } catch (error) {
          console.error("Error fetching sale returns:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchExistingReturns();
      setReturnItems({});
      setItemPenalties({});
    }
  }, [isOpen, purchase]);

  const totalReturnAmount = useMemo(() => {
    if (!purchase) return 0;
    return purchase.items.reduce((sum, item) => {
      const qty = Number(returnItems[item.id] || 0);
      return sum + qty * Number(item.unit_price);
    }, 0);
  }, [returnItems, purchase]);

  const totalItemPenalty = useMemo(() => {
    return Object.values(itemPenalties).reduce((sum, p) => sum + Number(p || 0), 0);
  }, [itemPenalties]);

  const netReturnAmount = totalReturnAmount - totalItemPenalty - Number(globalPenalty || 0);
  const totalPaid = Number(paidCash) + Number(paidMobile) + Number(paidBank);
  const dueAmount = netReturnAmount - totalPaid;

  if (!isOpen) return null;

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

  const handleSubmit = async () => {
    if (!purchase) {
      alert("Sale not provided");
      return;
    }

    const items = purchase.items
      .filter(i => Number(returnItems[i.id]) > 0)
      .map(i => ({
        sale_item: i.id,
        sale_return_quantity: Number(returnItems[i.id]),
        unit_price: i.unit_price,
        penalty_amount: Number(itemPenalties[i.id] || 0),
        reason: returnReason || "Returned",
      }));

    if (!items.length) {
      alert("Please return at least one item.");
      return;
    }

    const payload = {
      sale: purchase.id,
      customer: purchase.customer?.id || purchase.customer,
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

    setLoading(true);
    try {
      let response;
      if (existingReturnId) {
        response = await posSaleReturnAPI.update(existingReturnId, payload);
      } else {
        response = await posSaleReturnAPI.create(payload);
      }
      onSuccess?.(response.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert(`Sale return failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 text-gray-800">
          <h2 className="text-xl font-bold">Sale Return (Invoice #{purchase?.invoice_no})</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${existingReturnId ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
            {existingReturnId ? 'Update Return' : 'New Return'}
          </span>
        </div>

        {loading && !purchase ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg flex justify-between items-center border border-gray-100">
              <div>
                <p className="font-bold text-gray-700">Customer: {purchase?.customer_name || 'Walk-in'}</p>
                <p className="text-xs text-gray-500 tracking-tight">Original Sale: #{purchase?.invoice_no}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-600">Original Net: ৳{purchase?.net_total}</p>
                <p className="text-sm font-bold text-red-600">Original Due: ৳{purchase?.due_amount}</p>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Return Reason</label>
                <textarea className="input w-full p-2 border rounded focus:ring-2 focus:ring-red-100 outline-none" rows="1" value={returnReason} onChange={e => setReturnReason(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Internal Note</label>
                <textarea className="input w-full p-2 border rounded focus:ring-2 focus:ring-gray-100 outline-none" rows="1" value={note} onChange={e => setNote(e.target.value)} />
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto rounded-lg border shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest">Product</th>
                    <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-widest">Sold</th>
                    <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-widest">Avail.</th>
                    <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-widest">Return Qty</th>
                    <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-widest">Unit Price</th>
                    <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-widest text-red-600">Penalty</th>
                    <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-widest">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {purchase?.items.map(item => {
                    const alreadyReturned = returnedQuantitiesMap[item.id] || 0;
                    const availableQuantity = item.quantity - alreadyReturned;
                    const qty = Number(returnItems[item.id] || 0);
                    const penalty = Number(itemPenalties[item.id] || 0);
                    const total = (qty * Number(item.unit_price)) - penalty;

                    return (
                      <tr key={item.id} className="hover:bg-red-50/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{item.product_name}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-500 font-mono">{item.quantity}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-500 font-mono">{availableQuantity}</td>
                        <td className="px-4 py-3">
                          <input type="number" min="0" max={availableQuantity} className="w-20 text-center mx-auto block border rounded p-1 font-bold focus:ring-2 focus:ring-red-500 outline-none" value={returnItems[item.id] || ""} onChange={e => handleQtyChange(item, e.target.value)} />
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-600 font-mono">৳{item.unit_price}</td>
                        <td className="px-4 py-3">
                          <input type="number" min="0" className="w-24 text-right mx-auto block text-red-600 border border-red-100 rounded p-1 font-black focus:ring-2 focus:ring-red-500 outline-none" value={itemPenalties[item.id] || ""} onChange={e => handlePenaltyChange(item.id, e.target.value)} disabled={qty === 0} />
                        </td>
                        <td className="px-4 py-3 text-right font-black text-sm text-gray-900 font-mono">৳{total.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Inputs */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-5 shadow-inner">
                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Refund to Customer (Hybrid)</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-black text-gray-400 mb-1 block">Cash</label>
                    <input type="number" className="w-full border p-2 rounded-xl font-black text-center text-green-700 focus:ring-2 focus:ring-green-500 outline-none" value={paidCash} onChange={(e) => setPaidCash(Number(e.target.value))}/>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black text-gray-400 mb-1 block">Mobile</label>
                    <input type="number" className="w-full border p-2 rounded-xl font-black text-center text-orange-700 focus:ring-2 focus:ring-orange-500 outline-none" value={paidMobile} onChange={(e) => setPaidMobile(Number(e.target.value))}/>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black text-gray-400 mb-1 block">Bank</label>
                    <input type="number" className="w-full border p-2 rounded-xl font-black text-center text-blue-700 focus:ring-2 focus:ring-blue-500 outline-none" value={paidBank} onChange={(e) => setPaidBank(Number(e.target.value))}/>
                  </div>
                </div>

                {paidMobile > 0 && (
                  <div className="grid grid-cols-2 gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100 animate-slideDown">
                    <div>
                        <label className="text-[10px] uppercase font-black text-orange-600">Mobile Operator</label>
                        <select className="w-full border p-2 rounded-lg bg-white font-bold" value={mobileOperator} onChange={(e) => setMobileOperator(e.target.value)}>
                            <option value="">Select</option>
                            <option value="bkash">bKash</option>
                            <option value="nagad">Nagad</option>
                            <option value="rocket">Rocket</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-black text-orange-600">Transaction ID</label>
                        <input className="w-full border p-2 rounded-lg font-mono text-sm" placeholder="Optional" value={transactionId} onChange={(e) => setTransactionId(e.target.value)}/>
                    </div>
                  </div>
                )}
                {paidBank > 0 && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 animate-slideDown">
                    <label className="text-[10px] uppercase font-black text-blue-600 block mb-1">Bank Reference / Account</label>
                    <input className="w-full border p-2 rounded-lg font-mono text-sm" placeholder="A/C No or Ref" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)}/>
                  </div>
                )}
              </div>

              {/* Totals Section */}
              <div className="bg-gray-900 text-white p-6 rounded-2xl space-y-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest"><span>Gross Return</span><span className="font-mono text-gray-300">৳{totalReturnAmount.toFixed(2)}</span></div>
                <div className="flex justify-between text-xs font-bold text-red-400 uppercase tracking-widest"><span>Item Penalty</span><span className="font-mono">- ৳{totalItemPenalty.toFixed(2)}</span></div>
                
                <div className="flex justify-between items-center text-xs font-bold text-red-500 uppercase tracking-widest">
                  <span>Global Penalty</span>
                  <input type="number" className="w-24 bg-gray-800 border-gray-700 rounded-lg text-right p-2 font-mono text-white focus:border-red-500 outline-none shadow-inner" value={globalPenalty} onChange={e => setGlobalPenalty(Number(e.target.value))} />
                </div>
                
                <div className="flex justify-between text-xl pt-4 border-t border-gray-800 font-black"><span className="text-gray-400 uppercase text-xs self-center tracking-widest">Net Refund</span><span className="font-mono text-3xl text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]">৳{netReturnAmount.toFixed(2)}</span></div>
                
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest pt-4 border-t border-gray-800"><span>Paid back now</span><span className="font-mono text-gray-300">৳{totalPaid.toFixed(2)}</span></div>
                
                <div className="flex justify-between text-xl text-red-500 font-black pt-2 border-t-2 border-dashed border-gray-800">
                  <span className="text-xs self-center uppercase tracking-widest">Remaining Due</span>
                  <span className="font-mono">৳{dueAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Final Actions */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
              <button onClick={onClose} className="px-6 py-2 border-2 border-gray-100 rounded-xl font-black text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all uppercase text-xs tracking-widest">Discard</button>
              <button
                disabled={loading || totalReturnAmount === 0}
                onClick={handleSubmit}
                className="px-10 py-3 bg-red-600 text-white rounded-xl font-black hover:bg-red-700 disabled:bg-gray-300 transition-all shadow-xl active:scale-95 uppercase text-xs tracking-widest flex items-center gap-2"
              >
                {loading ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
                ) : null}
                {existingReturnId ? "Update Return" : "Process Return"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SaleReturnModal;