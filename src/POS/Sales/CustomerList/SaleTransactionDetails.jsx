// src/pages/sale/customer/SaleTransactionDetails.jsx

import React from 'react';

const SaleTransactionDetails = ({ transaction }) => {
    const { details, transaction_type } = transaction;

    const formatCurrency = (value) => {
        if (value === undefined || value === null) return '0';
        return Number(value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Sale Details
    if (transaction_type === 'sale') {
        return (
            <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Net Total</span>
                        <span className="text-sm font-bold text-gray-800">৳{formatCurrency(details.net_total)}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Discount</span>
                        <span className="text-sm font-bold text-gray-800">৳{formatCurrency(details.discount)}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Paid</span>
                        <span className="text-sm font-bold text-green-600">৳{formatCurrency(details.paid)}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Due</span>
                        <span className="text-sm font-bold text-red-600">৳{formatCurrency(details.due)}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div><span className="text-gray-400">Payment Method:</span> <span className="font-medium capitalize">{details.payment_method}</span></div>
                    <div><span className="text-gray-400">Cash:</span> <span className="font-medium">৳{formatCurrency(details.cash_payment)}</span></div>
                    <div><span className="text-gray-400">Mobile:</span> <span className="font-medium">৳{formatCurrency(details.mobile_payment)}</span></div>
                    <div><span className="text-gray-400">Bank:</span> <span className="font-medium">৳{formatCurrency(details.bank_payment)}</span></div>
                    <div><span className="text-gray-400">Mobile Operator:</span> <span className="font-medium">{details.mobile_operator || 'N/A'}</span></div>
                </div>
                {details.items && details.items.length > 0 && (
                    <div className="mt-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Items</p>
                        <div className="bg-white rounded-lg p-2 space-y-1 max-h-40 overflow-y-auto">
                            {details.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-xs border-b border-gray-50 py-1">
                                    <span className="font-medium">{item.product}</span>
                                    <span>{item.quantity} × ৳{formatCurrency(item.unit_price)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {details.notes && (
                    <div className="mt-2 p-2 bg-gray-100 rounded-lg text-xs text-gray-600 max-h-20 overflow-y-auto whitespace-pre-wrap">
                        {details.notes}
                    </div>
                )}
            </div>
        );
    }

    // Sale Return Details
    if (transaction_type === 'sale_return') {
        return (
            <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Return Amount</span>
                        <span className="text-sm font-bold text-gray-800">৳{formatCurrency(details.total_return_amount)}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Penalty</span>
                        <span className="text-sm font-bold text-red-600">৳{formatCurrency(details.penalty)}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Net Return</span>
                        <span className="text-sm font-bold text-gray-800">৳{formatCurrency(details.net_return)}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Paid</span>
                        <span className="text-sm font-bold text-green-600">৳{formatCurrency(details.paid)}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div><span className="text-gray-400">Payment Method:</span> <span className="font-medium capitalize">{details.payment_method}</span></div>
                    <div><span className="text-gray-400">Cash:</span> <span className="font-medium">৳{formatCurrency(details.cash_payment)}</span></div>
                    <div><span className="text-gray-400">Mobile:</span> <span className="font-medium">৳{formatCurrency(details.mobile_payment)}</span></div>
                    <div><span className="text-gray-400">Bank:</span> <span className="font-medium">৳{formatCurrency(details.bank_payment)}</span></div>
                    <div><span className="text-gray-400">Due:</span> <span className="font-medium">৳{formatCurrency(details.due)}</span></div>
                </div>
                {details.return_reason && (
                    <div className="p-2 bg-amber-50 rounded-lg text-xs text-amber-700">
                        Reason: {details.return_reason}
                    </div>
                )}
                {details.items && details.items.length > 0 && (
                    <div className="mt-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Returned Items</p>
                        <div className="bg-white rounded-lg p-2 space-y-1 max-h-40 overflow-y-auto">
                            {details.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-xs border-b border-gray-50 py-1">
                                    <span className="font-medium">{item.product}</span>
                                    <span>{item.quantity} × ৳{formatCurrency(item.unit_price)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {details.notes && (
                    <div className="mt-2 p-2 bg-gray-100 rounded-lg text-xs text-gray-600 max-h-20 overflow-y-auto whitespace-pre-wrap">
                        {details.notes}
                    </div>
                )}
            </div>
        );
    }

    // Due Collection Details
    if (transaction_type === 'due_collection') {
        return (
            <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Total</span>
                        <span className="text-sm font-bold text-gray-800">৳{formatCurrency(details.total)}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Distributed</span>
                        <span className="text-sm font-bold text-green-600">৳{formatCurrency(details.distributed)}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Advance</span>
                        <span className="text-sm font-bold text-blue-600">৳{formatCurrency(details.advance)}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Method</span>
                        <span className="text-sm font-medium capitalize">{details.payment_method}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div><span className="text-gray-400">Cash:</span> <span className="font-medium">৳{formatCurrency(details.cash_payment)}</span></div>
                    <div><span className="text-gray-400">Mobile:</span> <span className="font-medium">৳{formatCurrency(details.mobile_payment)}</span></div>
                    <div><span className="text-gray-400">Bank:</span> <span className="font-medium">৳{formatCurrency(details.bank_payment)}</span></div>
                    {details.mobile_operator && <div><span className="text-gray-400">Operator:</span> <span className="font-medium">{details.mobile_operator}</span></div>}
                </div>
                {details.allocations && details.allocations.length > 0 && (
                    <div className="mt-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Allocations</p>
                        <div className="bg-white rounded-lg p-2 space-y-1 max-h-40 overflow-y-auto">
                            {details.allocations.map((alloc, idx) => (
                                <div key={idx} className="flex flex-wrap justify-between text-xs border-b border-gray-50 py-1">
                                    <span className="font-medium">{alloc.invoice}</span>
                                    <span>৳{formatCurrency(alloc.amount)}</span>
                                    <span className="text-gray-400">(C:৳{formatCurrency(alloc.cash)} M:৳{formatCurrency(alloc.mobile)} B:৳{formatCurrency(alloc.bank)})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {details.notes && (
                    <div className="mt-2 p-2 bg-gray-100 rounded-lg text-xs text-gray-600 max-h-20 overflow-y-auto whitespace-pre-wrap">
                        {details.notes}
                    </div>
                )}
            </div>
        );
    }

    return <div className="text-gray-400 text-sm">No details available</div>;
};

export default SaleTransactionDetails;