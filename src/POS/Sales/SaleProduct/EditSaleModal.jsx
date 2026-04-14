import React, {useState, useEffect, useCallback} from "react";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";
import {FaTrash} from "react-icons/fa";
import SuccessModal from "./SuccessModal";


const EditSaleModal = ({open, onClose, purchase, onUpdated}) => {
    const [editablePurchase, setEditablePurchase] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);


    // Deep copy purchase data into local state when modal opens
    useEffect(() => {
        if (purchase) {
            setEditablePurchase(JSON.parse(JSON.stringify(purchase)));
        }
    }, [purchase]);

    // Recalculate totals whenever items or paid amount change
    const recalculateTotals = useCallback(() => {
        if (!editablePurchase) return;

        const newTotalAmount = editablePurchase.items.reduce((acc, item) => {
            const quantity = parseFloat(item.quantity) || 0;
            const unitPrice = parseFloat(item.unit_price) || 0;
            const itemTotal = quantity * unitPrice;
            item.total_price = itemTotal.toFixed(2);
            return acc + itemTotal;
        }, 0);

        const paidAmount = parseFloat(editablePurchase.paid_amount) || 0;
        const newDueAmount = newTotalAmount - paidAmount;

        setEditablePurchase(prev => ({
            ...prev,
            total_amount: newTotalAmount.toFixed(2),
            due_amount: newDueAmount.toFixed(2),
        }));
    }, [editablePurchase]);

    // Effect to run recalculation
    useEffect(() => {
        recalculateTotals();
    }, [editablePurchase?.items, editablePurchase?.paid_amount, recalculateTotals]);


    if (!open || !editablePurchase) return null;

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...editablePurchase.items];
        updatedItems[index] = {...updatedItems[index], [field]: value};
        setEditablePurchase(prev => ({...prev, items: updatedItems}));
    };

    const handleRemoveItem = (index) => {
        const updatedItems = editablePurchase.items.filter((_, i) => i !== index);
        setEditablePurchase(prev => ({...prev, items: updatedItems}));
    };

    const handleTopLevelChange = (field, value) => {
        setEditablePurchase(prev => ({...prev, [field]: value}));
    };

    const handleSubmit = async () => {
        try {
            // Construct the payload as expected by the API
            const payload = {
                ...editablePurchase,
                // Ensure numeric fields are sent as numbers if required by API
                paid_amount: parseFloat(editablePurchase.paid_amount) || 0,
                items: editablePurchase.items.map(item => ({
                    ...item,
                    quantity: parseInt(item.quantity, 10) || 0,
                    unit_price: parseFloat(item.unit_price) || 0,
                }))
            };

            const response = await axios.patch(
                `${BASE_URL_of_POS}/api/sale/sales/${purchase.id}/`,
                payload
            );

            onUpdated(response.data); // Pass the updated data back to the parent
            onClose();
        } catch (err) {
            console.error("Update failed:", err.response ? err.response.data : err);
            alert("Update failed. Check console for details.");
        }
    };

    const handleSubmitButtonClick = async () => {
        const success = await handleSubmit();
        if (success) {
            setShowSuccessModal(true);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Purchase (Invoice
                        #{editablePurchase.invoice_no})</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>

                {/* Purchase Items Table */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Purchase Items</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border border-gray-200">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Product</th>
                                <th className="px-4 py-2">Quantity</th>
                                <th className="px-4 py-2">Unit Price</th>
                                <th className="px-4 py-2 text-right">Total</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {editablePurchase.items.map((item, index) => (
                                <tr key={item.id || index} className="border-b">
                                    <td className="px-4 py-2">{item.product_name}</td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            className="input w-24 text-center"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="input w-32 text-right"
                                            value={item.unit_price}
                                            onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-right font-medium">৳{item.total_price}</td>
                                    <td className="px-4 py-2 text-center">
                                        <button onClick={() => handleRemoveItem(index)}
                                                className="text-red-500 hover:text-red-700">
                                            <FaTrash/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payment and Totals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">Payment Method</label>
                        <select
                            className="input"
                            value={editablePurchase.payment_method}
                            onChange={(e) => handleTopLevelChange("payment_method", e.target.value)}
                        >
                            <option value="cash">Cash</option>
                            <option value="bkash">Bkash</option>
                            <option value="bank">Bank</option>
                        </select>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700">Subtotal:</span>
                            <span className="font-bold text-lg text-gray-800">৳{editablePurchase.total_amount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="paid_amount" className="font-semibold text-gray-700">Paid Amount:</label>
                            <input
                                id="paid_amount"
                                type="number"
                                step="0.01"
                                className="input w-32 text-right"
                                value={editablePurchase.paid_amount}
                                onChange={(e) => handleTopLevelChange("paid_amount", e.target.value)}
                            />
                        </div>
                        <div className="flex justify-between items-center border-t pt-4">
                            <span className="font-semibold text-xl text-gray-800">Due Amount:</span>
                            <span className="font-bold text-xl text-red-600">৳{editablePurchase.due_amount}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                    <button onClick={onClose} className="btn-gray">Cancel</button>
                    {/*<button onClick={handleSubmit} className="btn-primary">*/}
                    <button onClick={handleSubmitButtonClick} className="btn-primary">
                        Save Changes
                    </button>
                </div>
            </div>

            {showSuccessModal && (
                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    // purchaseData={purchase}
                    purchase={purchase}
                />
            )}


        </div>
    );
};

export default EditSaleModal;