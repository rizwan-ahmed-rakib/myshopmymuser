// src/pages/purchase/supplier/TransactionDetails.jsx

import React from 'react';
import { FaInfoCircle, FaList, FaReceipt } from 'react-icons/fa';

const TransactionDetails = ({ transaction }) => {
    const details = transaction.details || {};

    const renderPurchaseDetails = () => (
        <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div><span className="font-bold text-gray-500">Total:</span> ৳{details.total_amount}</div>
                <div><span className="font-bold text-gray-500">Discount:</span> ৳{details.discount}</div>
                <div><span className="font-bold text-gray-500">Net Total:</span> ৳{details.net_total}</div>
                <div><span className="font-bold text-gray-500">Paid:</span> ৳{details.paid}[(cash{details.cash_payment}),(Mobile{details.mobile_payment} via {details.mobile_operator}),(Bank{details.bank_payment}),]</div>
            </div>
            {details.items && details.items.length > 0 && (
                <div className="mt-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FaList /> Items
                    </h4>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-gray-500">Product</th>
                                    <th className="px-3 py-2 text-right text-xs font-bold text-gray-500">Qty</th>
                                    <th className="px-3 py-2 text-right text-xs font-bold text-gray-500">Unit Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.items.map((item, idx) => (
                                    <tr key={idx} className="border-t border-gray-100">
                                        <td className="px-3 py-2 text-gray-700">{item.product}</td>
                                        <td className="px-3 py-2 text-right text-gray-700">{item.quantity}</td>
                                        <td className="px-3 py-2 text-right text-gray-700">৳{item.unit_price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {details.notes && (
                <div className="mt-2 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
                    <strong>Notes:</strong> {details.notes}
                </div>
            )}
        </div>
    );

    const renderReturnDetails = () => (
        <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div><span className="font-bold text-gray-500">Return Amount:</span> ৳{details.total_return_amount}</div>
                <div><span className="font-bold text-gray-500">Penalty:</span> ৳{details.penalty}</div>
                <div><span className="font-bold text-gray-500">Net Return:</span> ৳{details.net_return}</div>
                <div><span className="font-bold text-gray-500">Paid:</span> ৳{details.paid}</div>
            </div>
            {details.return_reason && (
                <div className="p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
                    <strong>Reason:</strong> {details.return_reason}
                </div>
            )}
            {details.items && details.items.length > 0 && (
                <div className="mt-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FaList /> Returned Items
                    </h4>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-gray-500">Product</th>
                                    <th className="px-3 py-2 text-right text-xs font-bold text-gray-500">Qty</th>
                                    <th className="px-3 py-2 text-right text-xs font-bold text-gray-500">Unit Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.items.map((item, idx) => (
                                    <tr key={idx} className="border-t border-gray-100">
                                        <td className="px-3 py-2 text-gray-700">{item.product}</td>
                                        <td className="px-3 py-2 text-right text-gray-700">{item.quantity}</td>
                                        <td className="px-3 py-2 text-right text-gray-700">৳{item.unit_price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {details.notes && (
                <div className="mt-2 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
                    <strong>Notes:</strong> {details.notes}
                </div>
            )}
        </div>
    );

    const renderDuePaymentDetails = () => (
        <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div><span className="font-bold text-gray-500">Amount:</span> ৳{details.paid}</div>
                <div><span className="font-bold text-gray-500">Method:</span> {details.payment_method}</div>
                <div><span className="font-bold text-gray-500">Cash:</span> ৳{details.cash_payment}</div>
                <div><span className="font-bold text-gray-500">Mobile:</span> ৳{details.mobile_payment}</div>
                <div><span className="font-bold text-gray-500">Bank:</span> ৳{details.bank_payment}</div>
            </div>
            {details.allocations && details.allocations.length > 0 && (
                <div className="mt-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FaReceipt /> Allocations
                    </h4>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-gray-500">Invoice</th>
                                    <th className="px-3 py-2 text-right text-xs font-bold text-gray-500">Amount</th>
                                    <th className="px-3 py-2 text-right text-xs font-bold text-gray-500">Cash</th>
                                    <th className="px-3 py-2 text-right text-xs font-bold text-gray-500">Mobile</th>
                                    <th className="px-3 py-2 text-right text-xs font-bold text-gray-500">Bank</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.allocations.map((alloc, idx) => (
                                    <tr key={idx} className="border-t border-gray-100">
                                        <td className="px-3 py-2 text-gray-700">{alloc.invoice}</td>
                                        <td className="px-3 py-2 text-right text-gray-700">৳{alloc.amount}</td>
                                        <td className="px-3 py-2 text-right text-gray-700">৳{alloc.cash}</td>
                                        <td className="px-3 py-2 text-right text-gray-700">৳{alloc.mobile}</td>
                                        <td className="px-3 py-2 text-right text-gray-700">৳{alloc.bank}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {details.notes && (
                <div className="mt-2 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
                    <strong>Notes:</strong> {details.notes}
                </div>
            )}
        </div>
    );

    return (
        <div>
            {transaction.transaction_type === 'purchase' && renderPurchaseDetails()}
            {transaction.transaction_type === 'purchase_return' && renderReturnDetails()}
            {transaction.transaction_type === 'due_payment' && renderDuePaymentDetails()}
        </div>
    );
};

export default TransactionDetails;