import React, {useState, useEffect} from "react";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";
import {FaTrash} from "react-icons/fa";
import SuccessModal from "./SuccessModal";


const EditPurchaseModal = ({open, onClose, purchase, onUpdated}) => {
    const [editablePurchase, setEditablePurchase] = useState(null);
    const [instances, setInstances] = useState({}); // {productId: [instances]}
    const [removedSerials, setRemovedSerials] = useState({}); // {productId: [serialNumbers]}
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);
    const [paymentProof, setPaymentProof] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeSerialTab, setActiveSerialTab] = useState(null); // To track which product's serials we are managing

    // Deep copy purchase data into local state when modal opens
    useEffect(() => {
        if (purchase) {
            // Map backend fields to local state safely
            const mappedPurchase = {
                ...purchase,
                paid_cash: purchase.paid_cash || 0,
                paid_mobile: purchase.paid_mobile || 0,
                paid_bank: purchase.paid_bank || 0,
                global_discount: purchase.global_discount || purchase.globalDiscount || 0,
                mobile_operator: purchase.mobile_operator || "",
                transaction_id: purchase.transaction_id || "",
                bank_account_no: purchase.bank_account_no || "",
            };
            setEditablePurchase(JSON.parse(JSON.stringify(mappedPurchase)));
            fetchInstances(purchase.invoice_no);
        }
    }, [purchase]);

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

    if (!open || !editablePurchase) return null;

    const calculateUpdatedTotals = (currentPurchase) => {
        let total_amount = 0;
        let itemwise_total_discount = 0;

        const updatedItems = currentPurchase.items.map(item => {
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

        const global_discount = parseFloat(currentPurchase.global_discount) || 0;
        const total_discount = itemwise_total_discount + global_discount;
        const net_total = total_amount - total_discount;
        const subtotal = total_amount - itemwise_total_discount;
        
        const paid_cash = parseFloat(currentPurchase.paid_cash) || 0;
        const paid_mobile = parseFloat(currentPurchase.paid_mobile) || 0;
        const paid_bank = parseFloat(currentPurchase.paid_bank) || 0;
        const totalPaid = paid_cash + paid_mobile + paid_bank;
        
        const due_amount = net_total - totalPaid;

        // Auto determine payment method
        let payment_method = "cash";
        const counts = [paid_cash > 0, paid_mobile > 0, paid_bank > 0].filter(Boolean).length;
        if (counts > 1) payment_method = "hybrid";
        else if (paid_mobile > 0) payment_method = "mobile_banking";
        else if (paid_bank > 0) payment_method = "bank";

        return {
            ...currentPurchase,
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
        const updatedItems = [...editablePurchase.items];
        updatedItems[index] = {...updatedItems[index], [field]: value};
        const updatedPurchase = calculateUpdatedTotals({...editablePurchase, items: updatedItems});
        setEditablePurchase(updatedPurchase);
    };

    const handleRemoveItem = (index) => {
        const updatedItems = editablePurchase.items.filter((_, i) => i !== index);
        const updatedPurchase = calculateUpdatedTotals({...editablePurchase, items: updatedItems});
        setEditablePurchase(updatedPurchase);
    };

    const toggleSerialRemoval = (productId, serial) => {
        setRemovedSerials(prev => {
            const current = prev[productId] || [];
            if (current.includes(serial)) {
                return {...prev, [productId]: current.filter(s => s !== serial)};
            } else {
                return {...prev, [productId]: [...current, serial]};
            }
        });
    };

    const handleTopLevelChange = (field, value) => {
        const updatedPurchase = calculateUpdatedTotals({...editablePurchase, [field]: value});
        setEditablePurchase(updatedPurchase);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const formData = new FormData();
            formData.append("supplier", editablePurchase.supplier);
            formData.append("paid_cash", editablePurchase.paid_cash);
            formData.append("paid_mobile", editablePurchase.paid_mobile);
            formData.append("paid_bank", editablePurchase.paid_bank);
            formData.append("payment_method", editablePurchase.payment_method);
            formData.append("global_discount", editablePurchase.global_discount);
            formData.append("mobile_operator", editablePurchase.mobile_operator || "");
            formData.append("transaction_id", editablePurchase.transaction_id || "");
            formData.append("bank_account_no", editablePurchase.bank_account_no || "");
            
            if (paymentProof) {
                formData.append("payment_proof", paymentProof);
            }

            const itemsPayload = editablePurchase.items.map(item => ({
                product: item.product,
                quantity: parseInt(item.quantity, 10) || 0,
                unit_price: parseFloat(item.unit_price) || 0,
                discount_amount: parseFloat(item.discount_amount) || 0,
                net_total: parseFloat(item.net_total) || 0,
                manufacturing_date: item.manufacturing_date || null,
                shelf_life_days: item.shelf_life_days || 0,
                batch_no: item.batch_no || "",
                removed_serials: removedSerials[item.product] || [],
            }));

            formData.append("items", JSON.stringify(itemsPayload));

            const response = await axios.patch(
                `${BASE_URL_of_POS}/api/purchase/purchases/${purchase.id}/`,
                formData,
                { headers: headers }
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


    const netTotal = parseFloat(editablePurchase.net_total) || 0;
    const totalPaid = parseFloat(editablePurchase.paid_amount) || 0;
    const currentInvoiceDue = netTotal - totalPaid;

    // The supplier_due_amount from the backend includes the current due of this specific purchase.
    // To get the "Other Invoices Due" (Previous Due), we subtract the original invoice due from the supplier's total due.
    const originalInvoiceDue = parseFloat(purchase?.due_amount) || 0;
    const otherInvoicesDue = (parseFloat(purchase?.supplier_due_amount) || 0) - originalInvoiceDue;
    
    const totalSupplierDue = otherInvoicesDue + currentInvoiceDue;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[95vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Purchase (Invoice #{editablePurchase.invoice_no})</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>

                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-blue-400 mb-1">Supplier</p>
                            <p className="text-lg font-black text-gray-800">{editablePurchase.supplier_name}</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm text-right">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Previous Due</p>
                            <p className="text-xl font-black text-red-600">৳{otherInvoicesDue.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Purchase Items</h3>
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
                            {editablePurchase.items.map((item, index) => (
                                <React.Fragment key={item.id || index}>
                                    <tr className="border-b">
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
                                        <td className="px-4 py-2 text-center space-x-2">
                                            <button 
                                                onClick={() => setActiveSerialTab(activeSerialTab === item.product ? null : item.product)}
                                                className={`p-1 px-2 rounded text-[10px] font-bold ${activeSerialTab === item.product ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                                title="Manage Serials"
                                            >
                                                SERIALS
                                            </button>
                                            <button onClick={() => handleRemoveItem(index)}
                                                    className="text-red-500 hover:text-red-700 p-2">
                                                <FaTrash/>
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Serial Management Section */}
                                    {activeSerialTab === item.product && (
                                        <tr className="bg-gray-50 border-b">
                                            <td colSpan="6" className="px-4 py-4">
                                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-inner">
                                                    {(() => {
                                                        const currentCount = instances[item.product]?.length || 0;
                                                        const targetQty = parseInt(item.quantity) || 0;
                                                        const maxToRemove = Math.max(0, currentCount - targetQty);
                                                        const currentlySelected = (removedSerials[item.product] || []).length;

                                                        return (
                                                            <>
                                                                <div className="flex justify-between items-center mb-3">
                                                                    <h4 className="text-sm font-bold text-gray-700 uppercase">Manage Serials for {item.product_name}</h4>
                                                                    <div className="flex gap-2">
                                                                        <div className="text-[10px] font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                                                            In Stock: {currentCount}
                                                                        </div>
                                                                        <div className={`text-[10px] font-bold px-2 py-1 rounded ${currentlySelected === maxToRemove ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                            Selected to Remove: {currentlySelected} / {maxToRemove}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="mb-4">
                                                                    <input 
                                                                        type="text"
                                                                        placeholder={maxToRemove > 0 ? "Scan Serial to Remove..." : "Quantity not reduced - removal disabled"}
                                                                        disabled={maxToRemove === 0}
                                                                        className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                const serial = e.target.value.trim();
                                                                                if (serial && instances[item.product]?.some(inst => inst.unique_serial === serial)) {
                                                                                    toggleSerialRemoval(item.product, serial, maxToRemove);
                                                                                    e.target.value = '';
                                                                                }
                                                                            }
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1">
                                                                    {(instances[item.product] || []).map(inst => {
                                                                        const isRemoved = (removedSerials[item.product] || []).includes(inst.unique_serial);
                                                                        const isSold = inst.status !== 'in_stock';
                                                                        return (
                                                                            <div 
                                                                                key={inst.id}
                                                                                onClick={() => !isSold && (isRemoved || currentlySelected < maxToRemove || alert(`Limit of ${maxToRemove} reached`)) && toggleSerialRemoval(item.product, inst.unique_serial, maxToRemove)}
                                                                                className={`p-2 border rounded text-[9px] cursor-pointer transition-all flex flex-col items-center text-center ${
                                                                                    isRemoved ? 'bg-red-50 border-red-300 text-red-600 shadow-sm' : 
                                                                                    isSold ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60' : 
                                                                                    'bg-white border-gray-200 hover:border-blue-400'
                                                                                }`}
                                                                            >
                                                                                <span className="font-bold truncate w-full">{inst.unique_serial.split('-').pop()}</span>
                                                                                <span className={`mt-1 px-1 rounded-full text-[7px] font-black uppercase ${isRemoved ? 'bg-red-500 text-white' : isSold ? 'bg-gray-400 text-white' : 'bg-green-500 text-white'}`}>
                                                                                    {isRemoved ? 'REMOVING' : isSold ? 'SOLD' : 'KEEP'}
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
                                    {/* Expiry Details Row */}
                                    {(item.has_expiry || purchase.items.find(pi => pi.product === item.product)?.has_expiry) && (
                                        <tr className="bg-blue-50/50 border-b">
                                            <td colSpan="6" className="px-4 py-3">
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">Manufacturing Date</label>
                                                        <input
                                                            type="date"
                                                            className="w-full border border-blue-200 p-2 rounded-lg text-sm"
                                                            value={item.manufacturing_date || ""}
                                                            onChange={(e) => handleItemChange(index, "manufacturing_date", e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">Shelf Life (Days)</label>
                                                        <input
                                                            type="number"
                                                            className="w-full border border-blue-200 p-2 rounded-lg text-sm"
                                                            value={item.shelf_life_days || 0}
                                                            onChange={(e) => handleItemChange(index, "shelf_life_days", e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">Batch Number</label>
                                                        <input
                                                            className="w-full border border-blue-200 p-2 rounded-lg text-sm"
                                                            value={item.batch_no || ""}
                                                            onChange={(e) => handleItemChange(index, "batch_no", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
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
                                        value={editablePurchase.paid_cash}
                                        onChange={(e) => handleTopLevelChange("paid_cash", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500">Mobile</label>
                                    <input
                                        type="number"
                                        className="w-full border p-2 rounded-lg font-bold"
                                        value={editablePurchase.paid_mobile}
                                        onChange={(e) => handleTopLevelChange("paid_mobile", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500">Bank</label>
                                    <input
                                        type="number"
                                        className="w-full border p-2 rounded-lg font-bold"
                                        value={editablePurchase.paid_bank}
                                        onChange={(e) => handleTopLevelChange("paid_bank", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Dynamic Detail Fields */}
                            {parseFloat(editablePurchase.paid_mobile) > 0 && (
                                <div className="grid grid-cols-2 gap-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-orange-700">Mobile Operator</label>
                                        <select
                                            className="w-full border p-2 rounded-lg bg-white"
                                            value={editablePurchase.mobile_operator}
                                            onChange={(e) => handleTopLevelChange("mobile_operator", e.target.value)}
                                        >
                                            <option value="">Select Operator</option>
                                            <option value="bkash">bKash</option>
                                            <option value="nagad">Nagad</option>
                                            <option value="rocket">Rocket</option>
                                            <option value="upay">Upay</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-orange-700">Transaction ID</label>
                                        <input
                                            className="w-full border p-2 rounded-lg"
                                            placeholder="TXN123..."
                                            value={editablePurchase.transaction_id}
                                            onChange={(e) => handleTopLevelChange("transaction_id", e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {parseFloat(editablePurchase.paid_bank) > 0 && (
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <label className="text-[10px] uppercase font-bold text-blue-700">Bank Account Number</label>
                                    <input
                                        className="w-full border p-2 rounded-lg"
                                        placeholder="A/C No..."
                                        value={editablePurchase.bank_account_no}
                                        onChange={(e) => handleTopLevelChange("bank_account_no", e.target.value)}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Payment Proof (New Image)</label>
                                <input
                                    type="file"
                                    className="w-full text-xs"
                                    onChange={(e) => setPaymentProof(e.target.files[0])}
                                />
                                {editablePurchase.payment_proof && !paymentProof && (
                                    <p className="text-[10px] text-green-600 mt-1 italic">* Current proof image exists</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                            <label className="block text-sm font-bold text-green-900 mb-2 uppercase tracking-tight">Invoice Discount</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full border p-3 rounded-lg bg-white font-bold focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="0.00"
                                value={editablePurchase.global_discount}
                                onChange={(e) => handleTopLevelChange("global_discount", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-gray-900 text-white p-6 rounded-2xl space-y-4 shadow-xl">
                        <div className="space-y-2 text-sm border-b border-gray-800 pb-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Gross Total</span>
                                <span className="font-mono font-bold">৳{editablePurchase.total_amount}</span>
                            </div>
                            <div className="flex justify-between text-green-400">
                                <span>Total Discount</span>
                                <span className="font-mono font-bold">- ৳{editablePurchase.total_discount}</span>
                            </div>
                            <div className="flex justify-between text-lg pt-2 border-t border-gray-800 font-bold">
                                <span className="text-gray-400">Net Total</span>
                                <span className="font-mono text-2xl text-white">৳{editablePurchase.net_total}</span>
                            </div>
                        </div>

                        <div className="space-y-2 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-inner">
                            <div className="flex justify-between items-center text-blue-400 font-bold uppercase text-xs">
                                <span>Total Paid</span>
                                <span className="font-mono text-xl text-white">৳{editablePurchase.paid_amount}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-xl text-center">
                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-1">Invoice Due</p>
                                <p className="text-2xl font-black text-red-500">৳{currentInvoiceDue.toFixed(2)}</p>
                            </div>
                            <div className="p-3 bg-blue-900/20 border border-blue-900/30 rounded-xl text-center">
                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Total Supplier Due</p>
                                <p className="text-xl font-black text-blue-400">৳{totalSupplierDue.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                    <button 
                        disabled={loading}
                        onClick={onClose} 
                        className="px-8 py-3 border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        disabled={loading}
                        onClick={handleSubmitButtonClick} 
                        className="px-12 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg hover:bg-blue-700 disabled:bg-blue-400 transition-all uppercase tracking-widest"
                    >
                        {loading ? "Updating..." : "Update Purchase"}
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

export default EditPurchaseModal;
