import React, { useState, useMemo, useEffect } from "react";
import { posSaleReturnAPI } from "../../../context_or_provider/pos/Sale/saleReturnProduct/PosSaleReturnAPI";
import BaseModal from "../../components/BaseModal";
import { Undo2, Package, Banknote, CreditCard, Wallet, Info, AlertTriangle, Trash2 } from 'lucide-react';
import api from '../../../context_or_provider/pos/posApi';


/**
 * SaleReturnModal - Refactored to use BaseModal and standardized backbone layout.
 * Used for processing returns directly from a sale record.
 */
const SaleReturnModal = ({ isOpen, onClose, onSuccess, purchase }) => {
  const [returnItems, setReturnItems] = useState({});
  const [itemPenalties, setItemPenalties] = useState({});
  const [globalPenalty, setGlobalPenalty] = useState(0);

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

  useEffect(() => {
    const counts = [paidCash > 0, paidMobile > 0, paidBank > 0].filter(Boolean).length;
    if (counts > 1) setPaymentMethod("hybrid");
    else if (paidMobile > 0) setPaymentMethod("mobile_banking");
    else if (paidBank > 0) setPaymentMethod("bank");
    else setPaymentMethod("hand cash");
  }, [paidCash, paidMobile, paidBank]);

  useEffect(() => {
    if (isOpen && purchase) {
      const fetchExistingReturns = async () => {
        setLoading(true);
        try {
          const returnRes = await posSaleReturnAPI.getAll();
          const relatedReturns = returnRes.data.filter(r => r.sale === purchase.id);

          if (relatedReturns.length > 0) {
            const latestReturn = relatedReturns[0];
            setExistingReturnId(latestReturn.id);
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
              r.items.forEach(i => { newReturnedMap[i.sale_item] = (newReturnedMap[i.sale_item] || 0) + i.sale_return_quantity; });
            });
            setReturnedQuantitiesMap(newReturnedMap);
          } else {
            setExistingReturnId(null); setReturnedQuantitiesMap({}); setNote(""); setReturnReason(""); setPaidCash(0); setPaidMobile(0); setPaidBank(0); setGlobalPenalty(0); setMobileOperator(""); setTransactionId(""); setBankAccountNo("");
          }
        } catch (error) { console.error(error); } finally { setLoading(false); }
      };
      fetchExistingReturns(); setReturnItems({}); setItemPenalties({});
    }
  }, [isOpen, purchase]);

  const totalReturnAmount = useMemo(() => {
    if (!purchase) return 0;
    return purchase.items.reduce((sum, item) => {
      const qty = Number(returnItems[item.id] || 0);
      return sum + qty * Number(item.unit_price);
    }, 0);
  }, [returnItems, purchase]);

  const totalItemPenalty = useMemo(() => Object.values(itemPenalties).reduce((sum, p) => sum + Number(p || 0), 0), [itemPenalties]);
  const netReturnAmount = totalReturnAmount - totalItemPenalty - Number(globalPenalty || 0);
  const totalPaid = Number(paidCash) + Number(paidMobile) + Number(paidBank);
  const dueAmount = netReturnAmount - totalPaid;

  const handleQtyChange = (item, quantity) => {
    const qty = Number(quantity);
    const available = item.quantity - (returnedQuantitiesMap[item.id] || 0);
    if (qty > available) { alert("Exceeds available quantity"); return; }
    setReturnItems({ ...returnItems, [item.id]: qty });
    if (qty === 0) { const newPenalties = { ...itemPenalties }; delete newPenalties[item.id]; setItemPenalties(newPenalties); }
  };

  const handleSubmit = async () => {
    const items = purchase.items.filter(i => Number(returnItems[i.id]) > 0).map(i => ({
      sale_item: i.id, sale_return_quantity: Number(returnItems[i.id]), unit_price: i.unit_price,
      penalty_amount: Number(itemPenalties[i.id] || 0), reason: returnReason || "Returned",
    }));
    if (!items.length) { alert("Select at least one item"); return; }

    const payload = {
      sale: purchase.id, customer: purchase.customer?.id || purchase.customer, total_return_amount: totalReturnAmount,
      total_item_penalty: totalItemPenalty, global_penalty: Number(globalPenalty), net_return_amount: netReturnAmount,
      paid_cash: paidCash, paid_mobile: paidMobile, paid_bank: paidBank, mobile_operator: paidMobile > 0 ? mobileOperator : "",
      transaction_id: paidMobile > 0 ? transactionId : "", bank_account_no: paidBank > 0 ? bankAccountNo : "",
      payment_method: paymentMethod, note: note, return_reason: returnReason, items,
    };

    setLoading(true);
    try {
      let response;
      if (existingReturnId) response = await posSaleReturnAPI.update(existingReturnId, payload);
      else response = await posSaleReturnAPI.create(payload);
      onSuccess?.(response.data);
      onClose();
    } catch (err) { alert("Return failed."); } finally { setLoading(false); }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Process Sale Return (Invoice #${purchase?.invoice_no})`}
      size="xl"
      icon={<Undo2 className="text-white" />}
      showFooter={true}
      onSubmit={handleSubmit}
      submitText={existingReturnId ? "Update Return Record" : "Confirm Return"}
      isLoading={loading}
    >
      <div className="space-y-6">
        <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-[10px] uppercase font-black text-rose-400 tracking-widest">Customer</p>
            <p className="text-lg font-black text-gray-800">{purchase?.customer_name || 'Walk-in'}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Original Total</p>
            <p className="font-bold text-gray-700">৳{purchase?.net_total}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Return Reason</label>
                <input className="w-full border border-gray-200 p-2.5 rounded-xl text-xs font-bold focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all" value={returnReason} onChange={e => setReturnReason(e.target.value)} placeholder="Defective, size mismatch, etc..." />
            </div>
            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Internal Note</label>
                <input className="w-full border border-gray-200 p-2.5 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" value={note} onChange={e => setNote(e.target.value)} placeholder="Optional internal remarks..." />
            </div>
        </div>

        <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">Product</th>
                <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Avail.</th>
                <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center w-24">Return</th>
                <th className="px-5 py-3 text-[10px] font-black text-rose-500 uppercase tracking-widest text-right">Penalty</th>
                <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right w-28">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {purchase?.items.map(item => {
                const alreadyReturned = returnedQuantitiesMap[item.id] || 0;
                const avail = item.quantity - alreadyReturned;
                const qty = Number(returnItems[item.id] || 0);
                const penalty = Number(itemPenalties[item.id] || 0);
                const total = (qty * Number(item.unit_price)) - penalty;

                return (
                  <tr key={item.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900 text-sm">{item.product_name}</p>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Original qty: {item.quantity}</p>
                    </td>
                    <td className="px-5 py-4 text-center font-black text-gray-400 text-xs">{avail}</td>
                    <td className="px-5 py-4">
                      <input type="number" min="0" max={avail} className="w-full border border-gray-200 p-2 rounded-lg text-center font-black text-sm focus:border-rose-400 outline-none" value={returnItems[item.id] || ""} onChange={e => handleQtyChange(item, e.target.value)} />
                    </td>
                    <td className="px-5 py-4">
                      <input type="number" min="0" className="w-full border border-rose-100 p-2 rounded-lg text-right font-black text-sm text-rose-600 outline-none bg-rose-50/30" value={itemPenalties[item.id] || ""} onChange={e => setItemPenalties({ ...itemPenalties, [item.id]: Number(e.target.value) })} disabled={qty === 0} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-black text-blue-700 text-sm">৳{total.toLocaleString()}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
            <div className="space-y-6">
                <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6 shadow-sm">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Wallet size={14} className="text-brand-primary" /> Refund Collection
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Cash</label>
                            <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-emerald-600 text-sm outline-none bg-white shadow-inner" value={paidCash} onChange={(e) => setPaidCash(Number(e.target.value))} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile</label>
                            <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-purple-600 text-sm outline-none bg-white shadow-inner" value={paidMobile} onChange={(e) => setPaidMobile(Number(e.target.value))} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank</label>
                            <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-blue-600 text-sm outline-none bg-white shadow-inner" value={paidBank} onChange={(e) => setPaidBank(Number(e.target.value))} />
                        </div>
                    </div>
                    {(paidMobile > 0 || paidBank > 0) && (
                        <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-3 animate-in slide-in-from-top-2">
                            {paidMobile > 0 && (
                                <div className="grid grid-cols-2 gap-3">
                                    <select className="border border-gray-100 p-2 rounded-lg text-xs font-bold outline-none bg-gray-50" value={mobileOperator} onChange={(e) => setMobileOperator(e.target.value)}>
                                        <option value="">Operator</option><option value="bkash">bKash</option><option value="nagad">Nagad</option>
                                    </select>
                                    <input className="border border-gray-100 p-2 rounded-lg text-xs font-bold outline-none bg-gray-50" placeholder="TxID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
                                </div>
                            )}
                            {paidBank > 0 && (
                                <input className="w-full border border-gray-100 p-2 rounded-lg text-xs font-bold outline-none bg-gray-50" placeholder="Bank Reference / A/C" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} />
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gray-900 text-white p-8 rounded-[3rem] space-y-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-800 pb-4">
                        <span>Gross Return</span> <span className="font-mono text-base">৳{totalReturnAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                        <span className="text-rose-400 text-[10px] font-black uppercase tracking-[0.2em]">Global Penalty</span>
                        <input type="number" className="w-20 bg-gray-800 border-none rounded-lg text-right p-1.5 font-black text-xs text-rose-400 outline-none focus:ring-1 focus:ring-rose-500" value={globalPenalty} onChange={(e) => setGlobalPenalty(Number(e.target.value))} />
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-400 font-black uppercase tracking-[0.3em]">Net Refund</span>
                        <span className="font-mono font-black text-4xl text-green-400">৳{netReturnAmount.toLocaleString()}</span>
                    </div>
                </div>

                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4 relative z-10">
                    <div className="flex justify-between items-center text-blue-400 font-black uppercase text-[10px] tracking-widest">
                        <span>Total Paid Back</span> <span className="font-mono text-2xl text-white">৳{totalPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <div className="space-y-1">
                            <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em]">Pending Refund</p>
                            <p className="text-xl font-black text-rose-500 font-mono">৳{dueAmount.toLocaleString()}</p>
                        </div>
                        {dueAmount > 0 && <AlertTriangle size={24} className="text-rose-500 opacity-50 animate-pulse" />}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default SaleReturnModal;