import React, { useState, useMemo, useEffect } from "react";
import { posPurchaseReturnAPI } from "../../../context_or_provider/pos/Purchase/purchaseReturnProduct/purchaseReturnAPI";

const PurchaseReturnModal = ({ isOpen, onClose, onSuccess, purchase }) => {
  const [returnItems, setReturnItems] = useState({});
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("hand cash");
  const [loading, setLoading] = useState(false);
  const [returnedQuantitiesMap, setReturnedQuantitiesMap] = useState({});
  const [existingReturnId, setExistingReturnId] = useState(null);

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
            setExistingReturnId(relatedReturns[0].id);
            const newReturnedMap = {};
            relatedReturns.forEach(r => {
              r.items.forEach(i => {
                newReturnedMap[i.purchase_item] =
                  (newReturnedMap[i.purchase_item] || 0) + i.quantity;
              });
            });
            setReturnedQuantitiesMap(newReturnedMap);
          } else {
            setExistingReturnId(null);
            setReturnedQuantitiesMap({});
          }
        } catch (error) {
          console.error("Error fetching purchase returns:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchExistingReturns();
      setReturnItems({});
      setPaidAmount(0);
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
      alert("Return quantity cannot exceed available quantity");
      return;
    }
    setReturnItems({
      ...returnItems,
      [item.id]: qty,
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
        quantity: Number(returnItems[i.id]),
        unit_price: i.unit_price,
        reason: "Returned",
      }));

    if (!items.length) {
      alert("Please return at least one item.");
      return;
    }

    const payload = {
      purchase: purchase.id,
      supplier: purchase.supplier,
      paid_amount: paidAmount,
      payment_method: paymentMethod,
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
      alert("Purchase return failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Purchase Return (Invoice #{purchase?.invoice_no})</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${existingReturnId ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
            {existingReturnId ? 'Update Return' : 'New Return'}
          </span>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Items */}
            <div className="mt-4 space-y-3">
              {purchase?.items.map(item => {
                const alreadyReturned = returnedQuantitiesMap[item.id] || 0;
                const availableQuantity = item.quantity - alreadyReturned;
                return (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-xs text-gray-500">
                        Purchased: {item.quantity} | Available: {availableQuantity}
                      </p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max={availableQuantity}
                      className="input w-24"
                      placeholder="Qty"
                      value={returnItems[item.id] || ""}
                      onChange={e => handleQtyChange(item, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Payment */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <span>Total Return</span>
                <strong>৳ {totalReturnAmount.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span>Paid</span>
                <input
                  type="number"
                  className="input w-32 text-right"
                  value={paidAmount}
                  onChange={e => setPaidAmount(Number(e.target.value))}
                />
              </div>
              <div className="flex justify-between text-red-600 font-semibold">
                <span>Due</span>
                <span>৳ {dueAmount.toFixed(2)}</span>
              </div>
              <select
                className="input w-full"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
              >
                <option value="hand cash">Hand Cash</option>
                <option value="bkash">bKash</option>
                <option value="bank">Bank</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={onClose} className="btn-gray">Cancel</button>
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="btn-danger"
              >
                {loading ? "Saving..." : "Confirm Return"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PurchaseReturnModal;