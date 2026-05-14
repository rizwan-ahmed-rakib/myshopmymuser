import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";
import { posPurchaseReturnAPI } from "../../../context_or_provider/pos/Purchase/purchaseReturnProduct/purchaseReturnAPI";

const PurchaseReturnModal = ({ isOpen, onClose, onSuccess, purchase }) => {
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

  const [instances, setInstances] = useState({}); // {productId: [instances]}
  const [returnedSerials, setReturnedSerials] = useState({}); // {itemId: [serialNumbers]}
  const [activeSerialTab, setActiveSerialTab] = useState(null);

  const fetchInstances = async (invoiceNo) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL_of_POS}/api/bar-qr/instances/?purchase_invoice_no=${invoiceNo}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        // Group by product ID
        const grouped = response.data.reduce((acc, curr) => {
            const pid = curr.product;
            if (!acc[pid]) acc[pid] = [];
            acc[pid].push(curr);
            return acc;
        }, {});
        setInstances(grouped);
    } catch (err) {
        console.error("Failed to fetch instances:", err);
    }
  };

  const toggleSerialReturn = (itemId, productId, serial, maxToReturn) => {
    setReturnedSerials(prev => {
        const current = prev[itemId] || [];
        if (current.includes(serial)) {
            return {...prev, [itemId]: current.filter(s => s !== serial)};
        } else {
            if (current.length >= maxToReturn) {
                alert(`Limit reached! You can only return up to ${maxToReturn} serial(s) for this item.`);
                return prev;
            }
            return {...prev, [itemId]: [...current, serial]};
        }
    });
  };

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
          const returnRes = await posPurchaseReturnAPI.getAll();
          const relatedReturns = returnRes.data.filter(
            r => r.purchase === purchase.id
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
                newReturnedMap[i.purchase_item] =
                  (newReturnedMap[i.purchase_item] || 0) + i.purchase_return_quantity;
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
          console.error("Error fetching purchase returns:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchExistingReturns();
      setReturnItems({});
      setItemPenalties({});
      if (purchase?.invoice_no) fetchInstances(purchase.invoice_no);
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
      alert("Return quantity cannot exceed available quantity");
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
      alert("Purchase not provided");
      return;
    }

    const items = purchase.items
      .filter(i => Number(returnItems[i.id]) > 0)
      .map(i => ({
        purchase_item: i.id,
        purchase_return_quantity: Number(returnItems[i.id]),
        unit_price: i.unit_price,
        penalty_amount: Number(itemPenalties[i.id] || 0),
        reason: returnReason || "Returned",
        returned_serials: returnedSerials[i.id] || [],
      }));

    if (!items.length) {
      alert("Please return at least one item.");
      return;
    }

    const payload = {
      purchase: purchase.id,
      supplier: purchase.supplier,
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
        response = await posPurchaseReturnAPI.update(existingReturnId, payload);
      } else {
        response = await posPurchaseReturnAPI.create(payload);
      }
      onSuccess?.(response.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert(`Purchase return failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 text-gray-800">
          <h2 className="text-xl font-bold">Purchase Return (Invoice #{purchase?.invoice_no})</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${existingReturnId ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
            {existingReturnId ? 'Update Return' : 'New Return'}
          </span>
        </div>

        {loading && !purchase ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Return Reason</label>
                <textarea className="input w-full p-2 border rounded" rows="1" value={returnReason} onChange={e => setReturnReason(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Internal Note</label>
                <textarea className="input w-full p-2 border rounded" rows="1" value={note} onChange={e => setNote(e.target.value)} />
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-bold uppercase text-gray-600 tracking-wider">Product</th>
                    <th className="px-4 py-2 text-center text-xs font-bold uppercase text-gray-600 tracking-wider">Bought</th>
                    <th className="px-4 py-2 text-center text-xs font-bold uppercase text-gray-600 tracking-wider">Avail.</th>
                    <th className="px-4 py-2 text-center text-xs font-bold uppercase text-gray-600 tracking-wider">Return Qty</th>
                    <th className="px-4 py-2 text-right text-xs font-bold uppercase text-gray-600 tracking-wider">Unit Price</th>
                    <th className="px-4 py-2 text-right text-xs font-bold uppercase text-red-600 tracking-wider">Penalty</th>
                    <th className="px-4 py-2 text-right text-xs font-bold uppercase text-gray-600 tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchase?.items.map(item => {
                    const alreadyReturned = returnedQuantitiesMap[item.id] || 0;
                    const availableQuantity = item.quantity - alreadyReturned;
                    const qty = Number(returnItems[item.id] || 0);
                    const penalty = Number(itemPenalties[item.id] || 0);
                    const total = (qty * Number(item.unit_price)) - penalty;

                    return (
                      <React.Fragment key={item.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.product_name}</td>
                        <td className="px-4 py-2 text-center text-sm text-gray-600">{item.quantity}</td>
                        <td className="px-4 py-2 text-center text-sm text-gray-600">{availableQuantity}</td>
                        <td className="px-4 py-2">
                          <input type="number" min="0" max={availableQuantity} className="w-20 text-center mx-auto block border rounded p-1 focus:ring-2 focus:ring-blue-500 outline-none" value={returnItems[item.id] || ""} onChange={e => handleQtyChange(item, e.target.value)} />
                        </td>
                        <td className="px-4 py-2 text-right text-sm text-gray-600">৳{item.unit_price}</td>
                        <td className="px-4 py-2">
                          <input type="number" min="0" className="w-24 text-right mx-auto block text-red-600 border rounded p-1 focus:ring-2 focus:ring-red-500 outline-none font-bold" value={itemPenalties[item.id] || ""} onChange={e => handlePenaltyChange(item.id, e.target.value)} disabled={qty === 0} />
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-sm text-gray-900">৳{total.toFixed(2)}</td>
                        <td className="px-4 py-2 text-center">
                          <button 
                            onClick={() => setActiveSerialTab(activeSerialTab === item.id ? null : item.id)}
                            className={`p-1 px-2 rounded text-[10px] font-bold ${activeSerialTab === item.id ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                            title="Select Serials to Return"
                          >
                            SERIALS
                          </button>
                        </td>
                      </tr>
                      {activeSerialTab === item.id && (
                        <tr className="bg-gray-50 border-b">
                          <td colSpan="8" className="px-4 py-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-inner">
                              {(() => {
                                const currentInstances = instances[item.product] || [];
                                const maxToReturn = qty;
                                const currentlySelected = (returnedSerials[item.id] || []).length;

                                return (
                                  <>
                                    <div className="flex justify-between items-center mb-3">
                                      <h4 className="text-sm font-bold text-gray-700 uppercase">Return Serials for {item.product_name}</h4>
                                      <div className="flex gap-2">
                                        <div className={`text-[10px] font-bold px-2 py-1 rounded ${currentlySelected === maxToReturn ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                          Selected: {currentlySelected} / {maxToReturn}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                      <input 
                                        type="text"
                                        placeholder={maxToReturn > 0 ? "Scan Serial to Return..." : "Quantity is 0 - return disabled"}
                                        disabled={maxToReturn === 0}
                                        className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            const serial = e.target.value.trim();
                                            if (serial && currentInstances.some(inst => inst.unique_serial === serial)) {
                                              toggleSerialReturn(item.id, item.product, serial, maxToReturn);
                                              e.target.value = '';
                                            }
                                          }
                                        }}
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1">
                                      {currentInstances.map(inst => {
                                        const isReturning = (returnedSerials[item.id] || []).includes(inst.unique_serial);
                                        const isSold = inst.status !== 'in_stock';
                                        return (
                                          <div 
                                            key={inst.id}
                                            onClick={() => !isSold && (isReturning || currentlySelected < maxToReturn || alert(`Limit of ${maxToReturn} reached`)) && toggleSerialReturn(item.id, item.product, inst.unique_serial, maxToReturn)}
                                            className={`p-2 border rounded text-[9px] cursor-pointer transition-all flex flex-col items-center text-center ${
                                              isReturning ? 'bg-red-50 border-red-300 text-red-600 shadow-sm' : 
                                              isSold ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60' : 
                                              'bg-white border-gray-200 hover:border-blue-400'
                                            }`}
                                          >
                                            <span className="font-bold truncate w-full">{inst.unique_serial.split('-').pop()}</span>
                                            <span className={`mt-1 px-1 rounded-full text-[7px] font-black uppercase ${isReturning ? 'bg-red-500 text-white' : isSold ? 'bg-gray-400 text-white' : 'bg-green-500 text-white'}`}>
                                              {isReturning ? 'RETURNING' : isSold ? 'SOLD' : 'AVAILABLE'}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Inputs */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4 shadow-sm">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Receive from Supplier (Hybrid)</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block tracking-tighter">Cash</label>
                    <input type="number" className="w-full border p-2 rounded-lg font-bold focus:ring-2 focus:ring-green-500 outline-none shadow-inner" value={paidCash} onChange={(e) => setPaidCash(Number(e.target.value))}/>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block tracking-tighter">Mobile</label>
                    <input type="number" className="w-full border p-2 rounded-lg font-bold focus:ring-2 focus:ring-orange-500 outline-none shadow-inner" value={paidMobile} onChange={(e) => setPaidMobile(Number(e.target.value))}/>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block tracking-tighter">Bank</label>
                    <input type="number" className="w-full border p-2 rounded-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" value={paidBank} onChange={(e) => setPaidBank(Number(e.target.value))}/>
                  </div>
                </div>

                {paidMobile > 0 && (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100 animate-fadeIn">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-orange-700">Operator</label>
                        <select className="w-full border p-2 rounded-lg bg-white" value={mobileOperator} onChange={(e) => setMobileOperator(e.target.value)}>
                            <option value="">Select</option>
                            <option value="bkash">bKash</option>
                            <option value="nagad">Nagad</option>
                            <option value="rocket">Rocket</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-orange-700">Transaction ID</label>
                        <input className="w-full border p-2 rounded-lg" value={transactionId} onChange={(e) => setTransactionId(e.target.value)}/>
                    </div>
                  </div>
                )}
                {paidBank > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 animate-fadeIn">
                    <label className="text-[10px] uppercase font-bold text-blue-700 block mb-1">Bank Account / Reference</label>
                    <input className="w-full border p-2 rounded-lg" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)}/>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="bg-gray-900 text-white p-6 rounded-xl space-y-3 shadow-lg">
                <div className="flex justify-between text-sm opacity-80"><span>Gross Return Amount</span><span className="font-mono">৳{totalReturnAmount.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm text-red-400"><span>Total Item Penalty</span><span className="font-mono">- ৳{totalItemPenalty.toFixed(2)}</span></div>
                <div className="flex justify-between items-center text-sm text-red-400">
                  <span>Global Penalty</span>
                  <input type="number" className="w-24 bg-gray-800 border-gray-700 rounded text-right p-1 font-mono text-white focus:border-red-500 outline-none" value={globalPenalty} onChange={e => setGlobalPenalty(Number(e.target.value))} />
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-gray-700 font-bold uppercase tracking-wider"><span className="text-gray-400">Net Return</span><span className="font-mono font-black text-2xl text-green-400">৳{netReturnAmount.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-700 opacity-80"><span>Received back from Supplier</span><span className="font-mono">৳{totalPaid.toFixed(2)}</span></div>
                <div className="flex justify-between text-lg text-red-500 font-black pt-1 border-t-2 border-dashed border-gray-700"><span>Balance Due</span><span className="font-mono">৳{dueAmount.toFixed(2)}</span></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button onClick={onClose} className="px-6 py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button
                disabled={loading || totalReturnAmount === 0}
                onClick={handleSubmit}
                className="px-8 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400 transition-all shadow-md active:scale-95"
              >
                {loading ? "Saving..." : existingReturnId ? "Update Return" : "Confirm Return"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PurchaseReturnModal;