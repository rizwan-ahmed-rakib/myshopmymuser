import React, {useState, useEffect} from "react";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";
import {FaTrash} from "react-icons/fa";
import SuccessModal from "./SuccessModal";


const EditSaleModal = ({open, onClose, purchase: sale, onUpdated}) => {
    const [editableSale, setEditableSale] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Deep copy sale data into local state when modal opens
    useEffect(() => {
        if (sale) {
            const mappedSale = {
                ...sale,
                paid_cash: sale.paid_cash || 0,
                paid_mobile: sale.paid_mobile || 0,
                paid_bank: sale.paid_bank || 0,
                global_discount: sale.global_discount || sale.globalDiscount || 0,
                mobile_operator: sale.mobile_operator || "",
                transaction_id: sale.transaction_id || "",
                bank_account_no: sale.bank_account_no || "",
            };
            setEditableSale(JSON.parse(JSON.stringify(mappedSale)));
        }
    }, [sale]);

    if (!open || !editableSale) return null;

    const calculateUpdatedTotals = (currentSale) => {
        let total_amount = 0;
        let itemwise_total_discount = 0;

        const updatedItems = currentSale.items.map(item => {
            const quantity = parseFloat(item.quantity) || 0;
            const unitPrice = parseFloat(item.unit_price) || 0;
            const discount_amount = parseFloat(item.discount_amount) || 0;
            const total_price = quantity * unitPrice;
            const net_total = total_price - discount_amount;

            total_amount += total_price;
            itemwise_total_discount += discount_amount;

            return {
                ...item,
                total_price: total_price.toFixed(2),
                net_total: net_total.toFixed(2)
            };
        });

        const global_discount = parseFloat(currentSale.global_discount) || 0;
        const total_discount = itemwise_total_discount + global_discount;
        const net_total = total_amount - total_discount;
        const subtotal = total_amount - itemwise_total_discount;
        
        const paid_cash = parseFloat(currentSale.paid_cash) || 0;
        const paid_mobile = parseFloat(currentSale.paid_mobile) || 0;
        const paid_bank = parseFloat(currentSale.paid_bank) || 0;
        const totalPaid = paid_cash + paid_mobile + paid_bank;
        
        const due_amount = net_total - totalPaid;

        // Auto determine payment method
        let payment_method = "cash";
        const counts = [paid_cash > 0, paid_mobile > 0, paid_bank > 0].filter(Boolean).length;
        if (counts > 1) payment_method = "hybrid";
        else if (paid_mobile > 0) payment_method = "mobile_banking";
        else if (paid_bank > 0) payment_method = "bank";

        return {
            ...currentSale,
            items: updatedItems,
            total_amount: total_amount.toFixed(2),
            itemwise_total_discount: itemwise_total_discount.toFixed(2),
            subtotal: subtotal.toFixed(2),
            global_discount: global_discount.toFixed(2),
            total_discount: total_discount.toFixed(2),
            net_total: net_total.toFixed(2),
            paid_cash: paid_cash,
            paid_mobile: paid_mobile,
            paid_bank: paid_bank,
            paid_amount: totalPaid,
            due_amount: due_amount.toFixed(2),
            payment_method: payment_method
        };
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...editableSale.items];
        updatedItems[index] = {...updatedItems[index], [field]: value};
        const updatedSale = calculateUpdatedTotals({...editableSale, items: updatedItems});
        setEditableSale(updatedSale);
    };

    const handleRemoveItem = (index) => {
        const updatedItems = editableSale.items.filter((_, i) => i !== index);
        const updatedSale = calculateUpdatedTotals({...editableSale, items: updatedItems});
        setEditableSale(updatedSale);
    };

    const handleTopLevelChange = (field, value) => {
        const updatedSale = calculateUpdatedTotals({...editableSale, [field]: value});
        setEditableSale(updatedSale);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const payload = {
                customer: editableSale.customer,
                paid_cash: editableSale.paid_cash,
                paid_mobile: editableSale.paid_mobile,
                paid_bank: editableSale.paid_bank,
                payment_method: editableSale.payment_method,
                global_discount: editableSale.global_discount,
                mobile_operator: editableSale.mobile_operator || "",
                transaction_id: editableSale.transaction_id || "",
                bank_account_no: editableSale.bank_account_no || "",
                items: editableSale.items.map(item => ({
                    product: item.product,
                    quantity: parseInt(item.quantity, 10) || 0,
                    unit_price: parseFloat(item.unit_price) || 0,
                    discount_amount: parseFloat(item.discount_amount) || 0,
                    net_total: parseFloat(item.net_total) || 0,
                }))
            };

            const response = await axios.patch(
                `${BASE_URL_of_POS}/api/sale/sales/${sale.id}/`,
                payload,
                { headers }
            );

            setInvoiceData(response.data);
            setLoading(false);
            return true;
        } catch (err) {
            console.error("Update failed:", err.response ? err.response.data : err);
            alert("Update failed. Check console for details.");
            setLoading(false);
            return false;
        }
    };

    const handleSubmitButtonClick = async () => {
        const success = await handleSubmit();
        if (success) {
            setShowSuccessModal(true);
        }
    };

    const netTotal = parseFloat(editableSale.net_total) || 0;
    const totalPaid = parseFloat(editableSale.paid_amount) || 0;
    const currentInvoiceDue = netTotal - totalPaid;

    const originalInvoiceDue = parseFloat(sale?.due_amount) || 0;
    const otherInvoicesDue = (parseFloat(sale?.customer_due_amount) || 0) - originalInvoiceDue;
    const totalCustomerDue = otherInvoicesDue + currentInvoiceDue;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[95vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Sale (Invoice #{editableSale.invoice_no})</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>

                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-blue-400 mb-1">Customer</p>
                            <p className="text-lg font-black text-gray-800">{editableSale.customer_name}</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm text-right">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Previous Due</p>
                            <p className="text-xl font-black text-red-600">৳{otherInvoicesDue.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Sale Items</h3>
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full table-auto border-collapse">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-bold uppercase text-gray-600">Product</th>
                                <th className="px-4 py-2 text-center text-xs font-bold uppercase text-gray-600">Quantity</th>
                                <th className="px-4 py-2 text-right text-xs font-bold uppercase text-gray-600">Unit Price</th>
                                <th className="px-4 py-2 text-right text-xs font-bold uppercase text-gray-600">Discount</th>
                                <th className="px-4 py-2 text-right text-xs font-bold uppercase text-gray-600">Net Total</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {editableSale.items.map((item, index) => (
                                <tr key={item.id || index} className="border-b">
                                    <td className="px-4 py-2">
                                        <p className="font-bold text-gray-800">{item.product_name}</p>
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            className="w-full border p-2 rounded text-center font-bold"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full border p-2 rounded text-right font-bold"
                                            value={item.unit_price}
                                            onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full border p-2 rounded text-right"
                                            value={item.discount_amount}
                                            onChange={(e) => handleItemChange(index, "discount_amount", e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-right font-black text-blue-700">৳{item.net_total}</td>
                                    <td className="px-4 py-2 text-center">
                                        <button onClick={() => handleRemoveItem(index)}
                                                className="text-red-500 hover:text-red-700 p-2">
                                            <FaTrash/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-xl border space-y-4 shadow-sm">
                            <label className="block text-sm font-bold text-gray-700 border-b pb-2 uppercase tracking-tight">Payment Breakdown</label>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500">Cash</label>
                                    <input
                                        type="number"
                                        className="w-full border p-2 rounded-lg font-bold"
                                        value={editableSale.paid_cash}
                                        onChange={(e) => handleTopLevelChange("paid_cash", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500">Mobile</label>
                                    <input
                                        type="number"
                                        className="w-full border p-2 rounded-lg font-bold"
                                        value={editableSale.paid_mobile}
                                        onChange={(e) => handleTopLevelChange("paid_mobile", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500">Bank</label>
                                    <input
                                        type="number"
                                        className="w-full border p-2 rounded-lg font-bold"
                                        value={editableSale.paid_bank}
                                        onChange={(e) => handleTopLevelChange("paid_bank", e.target.value)}
                                    />
                                </div>
                            </div>

                            {parseFloat(editableSale.paid_mobile) > 0 && (
                                <div className="grid grid-cols-2 gap-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-orange-700">Mobile Operator</label>
                                        <select
                                            className="w-full border p-2 rounded-lg bg-white"
                                            value={editableSale.mobile_operator}
                                            onChange={(e) => handleTopLevelChange("mobile_operator", e.target.value)}
                                        >
                                            <option value="">Select Operator</option>
                                            <option value="bkash">bKash</option>
                                            <option value="nagad">Nagad</option>
                                            <option value="rocket">Rocket</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-orange-700">Transaction ID</label>
                                        <input
                                            className="w-full border p-2 rounded-lg"
                                            placeholder="TXN123..."
                                            value={editableSale.transaction_id}
                                            onChange={(e) => handleTopLevelChange("transaction_id", e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {parseFloat(editableSale.paid_bank) > 0 && (
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <label className="text-[10px] uppercase font-bold text-blue-700">Bank Account Number</label>
                                    <input
                                        className="w-full border p-2 rounded-lg"
                                        placeholder="A/C No..."
                                        value={editableSale.bank_account_no}
                                        onChange={(e) => handleTopLevelChange("bank_account_no", e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                            <label className="block text-sm font-bold text-green-900 mb-2 uppercase tracking-tight">Invoice Discount</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full border p-3 rounded-lg bg-white font-bold focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="0.00"
                                value={editableSale.global_discount}
                                onChange={(e) => handleTopLevelChange("global_discount", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-gray-900 text-white p-6 rounded-2xl space-y-4 shadow-xl">
                        <div className="space-y-2 text-sm border-b border-gray-800 pb-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Gross Total</span>
                                <span className="font-mono font-bold">৳{editableSale.total_amount}</span>
                            </div>
                            <div className="flex justify-between text-green-400">
                                <span>Total Discount</span>
                                <span className="font-mono font-bold">- ৳{editableSale.total_discount}</span>
                            </div>
                            <div className="flex justify-between text-lg pt-2 border-t border-gray-800 font-bold">
                                <span className="text-gray-400">Net Total</span>
                                <span className="font-mono text-2xl text-white">৳{editableSale.net_total}</span>
                            </div>
                        </div>

                        <div className="space-y-2 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-inner">
                            <div className="flex justify-between items-center text-blue-400 font-bold uppercase text-xs">
                                <span>Total Received</span>
                                <span className="font-mono text-xl text-white">৳{editableSale.paid_amount}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-xl text-center">
                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-1">Invoice Due</p>
                                <p className="text-2xl font-black text-red-500">৳{currentInvoiceDue.toFixed(2)}</p>
                            </div>
                            <div className="p-3 bg-blue-900/20 border border-blue-900/30 rounded-xl text-center">
                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Total Customer Due</p>
                                <p className="text-xl font-black text-blue-400">৳{totalCustomerDue.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                    <button disabled={loading} onClick={onClose} className="px-8 py-3 border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                    <button 
                        disabled={loading}
                        onClick={handleSubmitButtonClick} 
                        className="px-12 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg hover:bg-blue-700 disabled:bg-blue-400 transition-all uppercase tracking-widest"
                    >
                        {loading ? "Updating..." : "Update Sale"}
                    </button>
                </div>
            </div>

            {showSuccessModal && (
                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => {
                        setShowSuccessModal(false);
                        onUpdated(invoiceData);
                        onClose();
                    }}
                    invoice={invoiceData}
                    previousDue={otherInvoicesDue}
                />
            )}
        </div>
    );
};

export default EditSaleModal;