import React, { useState, useMemo } from "react";
import AsyncSelect from "react-select/async";
import { posPurchaseProductAPI } from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
import { posPurchaseReturnAPI } from "../../../context_or_provider/pos/Purchase/purchaseReturnProduct/purchaseReturnAPI";

const AddPurchaseReturnModal = ({ isOpen, onClose, onSuccess }) => {
  const [purchase, setPurchase] = useState(null);
  const [returnItems, setReturnItems] = useState({});
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("hand cash");
  const [loading, setLoading] = useState(false);
  const [returnedQuantitiesMap, setReturnedQuantitiesMap] = useState({}); // New state for returned quantities
  const [existingReturnId, setExistingReturnId] = useState(null); // New state for existing return ID


    /* ================= CALCULATIONS ================= */
  const totalReturnAmount = useMemo(() => {
    if (!purchase) return 0;

    return purchase.items.reduce((sum, item) => {
      const qty = Number(returnItems[item.id] || 0);
      return sum + qty * Number(item.unit_price);
    }, 0);
  }, [returnItems, purchase]);

  const dueAmount = totalReturnAmount - paidAmount;

  if (!isOpen) return null;

  /* ================= LOAD PURCHASE ================= */
  const loadPurchaseOptions = async (input) => {
    const res = await posPurchaseProductAPI.search(input || "");
    return res.data.map(p => ({
      value: p.id,
      label: `Invoice #${p.invoice_no}`,
    }));
  };

  /* ================= PURCHASE SELECT ================= */
  const handlePurchaseSelect = async (option) => {
    // Purchase details
    const purchaseRes = await posPurchaseProductAPI.getById(option.value);
    const purchaseData = purchaseRes.data;

    // All purchase returns
    const returnRes = await posPurchaseReturnAPI.getAll();

    // Filter returns of this purchase
    const relatedReturns = returnRes.data.filter(
        r => r.purchase === option.value
    );

    // If a return already exists, store its ID for potential update
    if (relatedReturns.length > 0) {
      setExistingReturnId(relatedReturns[0].id); // Using the first one found
    } else {
      setExistingReturnId(null);
    }

    // Calculate already returned quantity per purchase_item
    const newReturnedMap = {};
    relatedReturns.forEach(r => {
        r.items.forEach(i => {
            newReturnedMap[i.purchase_item] =
                (newReturnedMap[i.purchase_item] || 0) + i.quantity;
        });
    });
    setReturnedQuantitiesMap(newReturnedMap); // Store the map in state

    setPurchase(purchaseData); // Set purchase without modifying its items directly
    setReturnItems({});
    setPaidAmount(0);
  };

  /* ================= Handle Quantity Change ================= */
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

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!purchase) {
      alert("Purchase select করুন");
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
      alert("কমপক্ষে একটি item return করুন");
      return;
    }

    const payload = {
      purchase: purchase.id,
      supplier: purchase.supplier,
      paid_amount: paidAmount,
      payment_method: paymentMethod,
      items,
    };

    try {
      setLoading(true);
      let response;
      if (existingReturnId) {
        // Update existing return
       response= await posPurchaseReturnAPI.update(existingReturnId, payload);
      } else {
        // Create new return
        response=await posPurchaseReturnAPI.create(payload);
      }

      onSuccess?.(response.data);
      //  onSuccess?.({ data: response.data, title: "Purchase Return Added!", message: "The purchase return has been successfully recorded." });

    } catch (err) {
      console.error(err);
      alert("Purchase return failed");
    } finally {
      setLoading(false);
    }
  };
  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-3xl">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Purchase Return</h2>
          {purchase && (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${existingReturnId ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
              {existingReturnId ? 'Update Return' : 'New Return'}
            </span>
          )}
        </div>

        {/* Purchase select */}
        <AsyncSelect
          loadOptions={loadPurchaseOptions}
          onChange={handlePurchaseSelect}
          placeholder="Search purchase invoice..."
        />

        {/* Items */}
        {purchase && (
          <div className="mt-4 space-y-3">
            {purchase.items.map(item => {
              const currentAvailableQuantity = item.quantity - (returnedQuantitiesMap[item.id] || 0);
              return (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-xs text-gray-500">
                      Purchased: {item.quantity} | Available: {currentAvailableQuantity}
                    </p>
                  </div>

                  <input
                    type="number"
                    min="0"
                    max={currentAvailableQuantity}
                    className="input w-24"
                    placeholder="Qty"
                    value={returnItems[item.id] || ""}
                    onChange={e => handleQtyChange(item, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Payment */}
        {purchase && (
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
        )}

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

      </div>

    </div>
  );
};

export default AddPurchaseReturnModal;