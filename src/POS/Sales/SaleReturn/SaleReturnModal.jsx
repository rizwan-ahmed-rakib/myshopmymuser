



import React, { useState, useMemo } from "react";
import {posSaleReturnAPI} from "../../../context_or_provider/pos/Sale/saleReturnProduct/PosSaleReturnAPI";

const SaleReturnModal = ({ open, onClose, purchase, onSuccess }) => {
  const [returnItems, setReturnItems] = useState({});
  const [paidAmount, setPaidAmount] = useState(0);
  const [note, setNote] = useState("");

  // ✅ Hook ALWAYS on top
  const totalReturnAmount = useMemo(() => {
    if (!purchase) return 0;

    return purchase.items.reduce((sum, item) => {
      const qty = Number(returnItems[item.id] || 0);
      return sum + qty * Number(item.unit_price);
    }, 0);
  }, [returnItems, purchase]);

  const dueAmount = totalReturnAmount - paidAmount;

  // ✅ Early return AFTER hooks
  if (!open || !purchase) return null;

  const handleSubmit = async () => {
    const items = purchase.items
      .filter(item => Number(returnItems[item.id]) > 0)
      .map(item => ({
        purchase_item: item.id,
        quantity: Number(returnItems[item.id]),
        unit_price: item.unit_price,
        reason: "Returned by user",
      }));

    if (!items.length) {
      alert("কমপক্ষে একটি item return করুন");
      return;
    }

    try {
      await posSaleReturnAPI.create({
        purchase: purchase.id,
        supplier: purchase.supplier,
        paid_amount: paidAmount,
        payment_method: "cash",
        note,
        items,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Purchase return failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4">
          Purchase Return (Invoice #{purchase.invoice_no})
        </h2>

        {/* Items */}
        <div className="space-y-3">
          {purchase.items.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.product_name}</p>
                <p className="text-xs text-gray-500">
                  Purchased: {item.quantity}
                </p>
              </div>

              <input
                type="number"
                min="0"
                max={item.quantity}
                className="input w-24"
                placeholder="Qty"
                onChange={e =>
                  setReturnItems({
                    ...returnItems,
                    [item.id]: e.target.value,
                  })
                }
              />
            </div>
          ))}
        </div>

        {/* Payment */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span>Total Return</span>
            <span className="font-bold">
              ৳ {totalReturnAmount.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <label>Paid</label>
            <input
              type="number"
              className="input w-32 text-right"
              value={paidAmount}
              onChange={e => setPaidAmount(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-between font-semibold text-red-600">
            <span>Due</span>
            <span>৳ {dueAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn-gray">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-danger">
            Confirm Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleReturnModal;

