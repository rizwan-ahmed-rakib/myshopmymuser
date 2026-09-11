// // src/pages/purchase/supplier/TransactionList.jsx
//
// import React, { useState } from 'react';
// import { FaChevronDown, FaChevronUp, FaFileInvoice, FaUndo, FaMoneyBillWave } from 'react-icons/fa';
// import TransactionDetails from './TransactionDetails';
//
// const TransactionList = ({ transactions, totalCount, limit, offset, onPageChange, loading }) => {
//     const [expandedId, setExpandedId] = useState(null);
//
//     const toggleExpand = (id) => {
//         setExpandedId(expandedId === id ? null : id);
//     };
//
//     const getTypeIcon = (type) => {
//         switch(type) {
//             case 'purchase': return <FaFileInvoice className="text-blue-500" />;
//             case 'purchase_return': return <FaUndo className="text-amber-500" />;
//             case 'due_payment': return <FaMoneyBillWave className="text-green-500" />;
//             default: return null;
//         }
//     };
//
//     const getTypeColor = (type) => {
//         switch(type) {
//             case 'purchase': return 'border-l-4 border-blue-500';
//             case 'purchase_return': return 'border-l-4 border-amber-500';
//             case 'due_payment': return 'border-l-4 border-green-500';
//             default: return '';
//         }
//     };
//
//     const formatDate = (dateStr) => {
//         return new Date(dateStr).toLocaleString('en-GB', {
//             day: '2-digit',
//             month: 'short',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };
//
//     // Pagination
//     const totalPages = Math.ceil(totalCount / limit);
//     const currentPage = Math.floor(offset / limit) + 1;
//
//     const handleNext = () => {
//         if (offset + limit < totalCount) {
//             onPageChange(offset + limit);
//         }
//     };
//
//     const handlePrev = () => {
//         if (offset - limit >= 0) {
//             onPageChange(offset - limit);
//         }
//     };
//
//     if (loading) {
//         return (
//             <div className="flex justify-center py-12">
//                 <div className="animate-pulse text-gray-400">Loading transactions...</div>
//             </div>
//         );
//     }
//
//     if (transactions.length === 0) {
//         return (
//             <div className="text-center py-16 bg-gray-50 rounded-2xl">
//                 <p className="text-gray-400">No transactions found for this supplier.</p>
//             </div>
//         );
//     }
//
//     return (
//         <div className="space-y-4">
//             {transactions.map((txn) => (
//                 <div
//                     key={`${txn.transaction_type}-${txn.id}`}
//                     className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 ${getTypeColor(txn.transaction_type)}`}
//                 >
//                     {/* Main Row */}
//                     <div
//                         className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
//                         onClick={() => toggleExpand(`${txn.transaction_type}-${txn.id}`)}
//                     >
//                         <div className="flex flex-wrap items-center gap-4">
//                             <div className="flex items-center gap-3 flex-1 min-w-0">
//                                 <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
//                                     {getTypeIcon(txn.transaction_type)}
//                                 </div>
//                                 <div className="min-w-0 flex-1">
//                                     <div className="flex flex-wrap items-center gap-2">
//                                         <span className="font-bold text-gray-900 text-sm truncate">
//                                             {txn.invoice_no}
//                                         </span>
//                                         <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium whitespace-nowrap">
//                                             {txn.transaction_type.replace('_', ' ').toUpperCase()}
//                                         </span>
//                                     </div>
//                                     <p className="text-xs text-gray-400 truncate">{txn.description}</p>
//                                 </div>
//                             </div>
//
//                             <div className="flex items-center gap-6 ml-auto shrink-0">
//                                 <div className="text-right hidden sm:block">
//                                     <span className="text-[10px] font-bold text-gray-400 uppercase block">Date</span>
//                                     <span className="text-xs font-medium text-gray-700">{formatDate(txn.date)}</span>
//                                 </div>
//                                 <div className="text-right">
//                                     <span className="text-[10px] font-bold text-gray-400 uppercase block">Total</span>
//                                     <span className={`text-sm font-bold ${txn.debit > 0 ? 'text-red-600' : 'text-green-600'}`}>
//                                         ৳{(txn.debit || txn.credit).toLocaleString()}
//                                     </span>
//                                 </div>
//
//                                 {/*<div className="text-right">*/}
//                                 {/*    <span className="text-[10px] font-bold text-gray-400 uppercase block">Paid</span>*/}
//                                 {/*    <span className={`text-sm font-bold ${txn.details.paid > 0 ? 'text-green-600' :  'text-red-600'}`}>*/}
//                                 {/*        /!*৳{(txn.paid || txn.credit).toLocaleString()}*!/*/}
//                                 {/*        ৳{(txn.details.paid).toLocaleString()}*/}
//                                 {/*    </span>*/}
//                                 {/*</div>*/}
//
//                                 {/*<div className="text-right">*/}
//                                 {/*    <span className="text-[10px] font-bold text-gray-400 uppercase block">Due</span>*/}
//                                 {/*    <span className={`text-sm font-bold ${txn.details.due > 0 ? 'text-red-600' : 'text-green-600'}`}>*/}
//                                 {/*        /!*৳{(txn.debit || txn.credit).toLocaleString()}*!/*/}
//                                 {/*        ৳{(txn.details.due).toLocaleString()}*/}
//                                 {/*    </span>*/}
//                                 {/*</div>*/}
//
//                                 {/*<div className="text-right">*/}
//                                 {/*    <span className="text-[10px] font-bold text-gray-400 uppercase block">Method</span>*/}
//                                 {/*    <span className={`text-sm font-bold ${txn.details.payment_method > 0 ? 'text-red-600' : 'text-green-600'}`}>*/}
//                                 {/*        /!*৳{(txn.debit || txn.credit).toLocaleString()}*!/*/}
//                                 {/*        ৳{(txn.details.payment_method)}*/}
//                                 {/*    </span>*/}
//                                 {/*</div>*/}
//
//                                 <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
//                                     {expandedId === `${txn.transaction_type}-${txn.id}` ? (
//                                         <FaChevronUp className="text-gray-400" />
//                                     ) : (
//                                         <FaChevronDown className="text-gray-400" />
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Expanded Details */}
//                     {expandedId === `${txn.transaction_type}-${txn.id}` && (
//                         <div className="border-t border-gray-100 bg-gray-50 p-4">
//                             <TransactionDetails transaction={txn} />
//                         </div>
//                     )}
//                 </div>
//             ))}
//
//             {/* Pagination */}
//             {totalPages > 1 && (
//                 <div className="flex justify-between items-center pt-4">
//                     <span className="text-sm text-gray-500">
//                         Showing {offset + 1} - {Math.min(offset + limit, totalCount)} of {totalCount}
//                     </span>
//                     <div className="flex gap-2">
//                         <button
//                             onClick={handlePrev}
//                             disabled={offset === 0}
//                             className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                         >
//                             Previous
//                         </button>
//                         <span className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg">
//                             {currentPage} / {totalPages}
//                         </span>
//                         <button
//                             onClick={handleNext}
//                             disabled={offset + limit >= totalCount}
//                             className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                         >
//                             Next
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default TransactionList;


// src/pages/purchase/supplier/TransactionList.jsx

import React, {useState} from 'react';
import {
    FaChevronDown, FaChevronUp, FaFileInvoice, FaUndo, FaMoneyBillWave,
    FaClock, FaHashtag
} from 'react-icons/fa';
import TransactionDetails from './TransactionDetails';

const TransactionList = ({transactions, totalCount, limit, offset, onPageChange, loading}) => {
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'purchase':
                return <FaFileInvoice className="text-blue-500"/>;
            case 'purchase_return':
                return <FaUndo className="text-amber-500"/>;
            case 'due_payment':
                return <FaMoneyBillWave className="text-green-500"/>;
            default:
                return null;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'purchase':
                return 'border-l-4 border-blue-500';
            case 'purchase_return':
                return 'border-l-4 border-amber-500';
            case 'due_payment':
                return 'border-l-4 border-green-500';
            default:
                return '';
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'purchase':
                return 'PURCHASE';
            case 'purchase_return':
                return 'RETURN';
            case 'due_payment':
                return 'PAYMENT';
            default:
                return type.toUpperCase();
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (value) => {
        if (value === undefined || value === null) return '0';
        return Number(value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Pagination
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    const handleNext = () => {
        if (offset + limit < totalCount) {
            onPageChange(offset + limit);
        }
    };

    const handlePrev = () => {
        if (offset - limit >= 0) {
            onPageChange(offset - limit);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-pulse text-gray-400">Loading transactions...</div>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <p className="text-gray-400">No transactions found for this supplier.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {transactions.map((txn) => {
                const txnId = `${txn.transaction_type}-${txn.id}`;
                const isExpanded = expandedId === txnId;

                return (
                    <div
                        key={txnId}
                        className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 ${getTypeColor(txn.transaction_type)}`}
                    >
                        {/*/!* Main Row *!/*/}
                        {/*<div className="p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleExpand(txnId)}>*/}
                        {/*    <div className="flex flex-wrap items-center gap-2 sm:gap-4">*/}
                        {/*        /!* Left: Icon + Invoice No *!/*/}
                        {/*        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">*/}
                        {/*            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">*/}
                        {/*                {getTypeIcon(txn.transaction_type)}*/}
                        {/*            </div>*/}
                        {/*            <div className="min-w-0 flex-1">*/}
                        {/*                <div className="flex flex-wrap items-center gap-1 sm:gap-2">*/}
                        {/*                    <span className="font-bold text-gray-900 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">*/}
                        {/*                        {txn.invoice_no}*/}
                        {/*                    </span>*/}
                        {/*                    <span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium whitespace-nowrap">*/}
                        {/*                        {getTypeLabel(txn.transaction_type)}*/}
                        {/*                    </span>*/}
                        {/*                    {txn.payment_status && (*/}
                        {/*                        <span className={`text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold uppercase ${*/}
                        {/*                            txn.payment_status === 'paid' ? 'bg-green-100 text-green-700' :*/}
                        {/*                            txn.payment_status === 'partial' ? 'bg-amber-100 text-amber-700' :*/}
                        {/*                            'bg-red-100 text-red-700'*/}
                        {/*                        }`}>*/}
                        {/*                            {txn.payment_status}*/}
                        {/*                        </span>*/}
                        {/*                    )}*/}
                        {/*                </div>*/}
                        {/*                <p className="text-[10px] sm:text-xs text-gray-400 truncate">*/}
                        {/*                    {formatDate(txn.date)}*/}
                        {/*                </p>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}

                        {/*        /!* Right: Amounts *!/*/}
                        {/*        <div className="flex items-center gap-3 sm:gap-6 ml-auto shrink-0 flex-wrap justify-end">*/}
                        {/*            /!* Total *!/*/}
                        {/*            <div className="text-right min-w-[60px] sm:min-w-[80px]">*/}
                        {/*                <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase block">Total</span>*/}
                        {/*                <span className={`text-xs sm:text-sm font-bold ${*/}
                        {/*                    txn.transaction_type === 'purchase' ? 'text-red-600' :*/}
                        {/*                    txn.transaction_type === 'purchase_return' ? 'text-green-600' :*/}
                        {/*                    'text-gray-800'*/}
                        {/*                }`}>*/}
                        {/*                    ৳{formatCurrency(txn.total)}*/}
                        {/*                </span>*/}
                        {/*            </div>*/}

                        {/*            /!* Paid (Purchase & Return) or Distributed (Due Payment) *!/*/}
                        {/*            <div className="text-right min-w-[60px] sm:min-w-[80px]">*/}
                        {/*                <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase block">*/}
                        {/*                    {txn.transaction_type === 'due_payment' ? 'Distributed' : 'Paid'}*/}
                        {/*                </span>*/}
                        {/*                <span className="text-xs sm:text-sm font-bold text-green-600">*/}
                        {/*                    ৳{formatCurrency(txn.transaction_type === 'due_payment' ? txn.distributed : txn.paid)}*/}
                        {/*                </span>*/}
                        {/*            </div>*/}

                        {/*            /!* Due or Advance *!/*/}
                        {/*            <div className="text-right min-w-[60px] sm:min-w-[80px]">*/}
                        {/*                <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase block">*/}
                        {/*                    {txn.due_label || 'Due'}*/}
                        {/*                </span>*/}
                        {/*                <span className={`text-xs sm:text-sm font-bold ${*/}
                        {/*                    txn.due > 0 ? 'text-red-600' :*/}
                        {/*                    txn.due < 0 ? 'text-blue-600' :*/}
                        {/*                    'text-gray-400'*/}
                        {/*                }`}>*/}
                        {/*                    {txn.due > 0 ? `৳${formatCurrency(txn.due)}` :*/}
                        {/*                     txn.due < 0 ? `Advance ৳${formatCurrency(Math.abs(txn.due))}` :*/}
                        {/*                     '—'}*/}
                        {/*                </span>*/}
                        {/*            </div>*/}

                        {/*            /!* Payment Method *!/*/}
                        {/*            <div className="text-right hidden sm:block min-w-[60px]">*/}
                        {/*                <span className="text-[10px] font-bold text-gray-400 uppercase block">Method</span>*/}
                        {/*                <span className="text-xs font-medium text-gray-700 capitalize">*/}
                        {/*                    {txn.payment_method || 'N/A'}*/}
                        {/*                </span>*/}
                        {/*            </div>*/}

                        {/*            /!* Expand Toggle *!/*/}
                        {/*            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">*/}
                        {/*                {isExpanded ? (*/}
                        {/*                    <FaChevronUp className="text-gray-400 text-xs sm:text-sm" />*/}
                        {/*                ) : (*/}
                        {/*                    <FaChevronDown className="text-gray-400 text-xs sm:text-sm" />*/}
                        {/*                )}*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}


                        {/*// Main Row - শুধু এই অংশটি পরিবর্তন করুন*/}

                        <div
                            className="p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleExpand(txnId)}
                        >
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                {/* Left: Icon + Invoice No */}
                                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                    <div
                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        {getTypeIcon(txn.transaction_type)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <span className="font-bold text-gray-900 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                        {txn.invoice_no}
                    </span>
                                            <span
                                                className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium whitespace-nowrap">
                        {getTypeLabel(txn.transaction_type)}
                    </span>
                                            {txn.payment_status && (
                                                <span
                                                    className={`text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold uppercase ${
                                                        txn.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                                                            txn.payment_status === 'partial' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-red-100 text-red-700'
                                                    }`}>
                            {txn.payment_status}
                        </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                                            {formatDate(txn.date)}
                                        </p>
                                    </div>
                                </div>

                                {/* Right: Amounts - Transaction Type Specific */}
                                <div
                                    className="flex items-center gap-3 sm:gap-6 ml-auto shrink-0 flex-wrap justify-end">

                                    {/* Purchase: Total | Paid | Due */}
                                    {txn.transaction_type === 'purchase' && (
                                        <>
                                            <div className="text-right min-w-[60px] sm:min-w-[80px]">
                                                <span
                                                    className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase block">Total</span>
                                                <span
                                                    className="text-xs sm:text-sm font-bold text-red-600">৳{formatCurrency(txn.total)}</span>
                                            </div>
                                            <div className="text-right min-w-[60px] sm:min-w-[80px]">
                                                <span
                                                    className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase block">Paid</span>
                                                <span
                                                    className="text-xs sm:text-sm font-bold text-green-600">৳{formatCurrency(txn.paid)}</span>
                                            </div>
                                            <div className="text-right min-w-[60px] sm:min-w-[80px]">
                                                <span
                                                    className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase block">Due</span>
                                                <span
                                                    className={`text-xs sm:text-sm font-bold ${txn.due > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                            {txn.due > 0 ? `৳${formatCurrency(txn.due)}` : '—'}
                        </span>
                                            </div>
                                        </>
                                    )}

                                    {/* Purchase Return: Return Amount | Penalty | Received | Receivable */}
                                    {txn.transaction_type === 'purchase_return' && (
                                        <>
                                            <div className="text-right min-w-[60px] sm:min-w-[80px]">
                                                <span
                                                    className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase block">Return</span>
                                                <span
                                                    className="text-xs sm:text-sm font-bold text-amber-600">৳{formatCurrency(txn.details.total_return_amount)}</span>
                                            </div>
                                            <div className="text-right min-w-[50px] sm:min-w-[60px]">
                                                <span
                                                    className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase block">Penalty</span>
                                                <span
                                                    className="text-xs sm:text-sm font-bold text-red-600">৳{formatCurrency(txn.details.penalty)}</span>
                                            </div>

                                            <div className="text-right min-w-[60px] sm:min-w-[80px]">
                                                <span
                                                    className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase block">Total</span>
                                                <span
                                                    className="text-xs sm:text-sm font-bold text-red-600">৳{formatCurrency(txn.details.net_return)}</span>
                                            </div>

                                            <div className="text-right min-w-[60px] sm:min-w-[80px]">
                                                <span
                                                    className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase block">Received</span>
                                                <span
                                                    className="text-xs sm:text-sm font-bold text-green-600">৳{formatCurrency(txn.details.paid)}</span>
                                            </div>
                                            <div className="text-right min-w-[60px] sm:min-w-[80px]">
                                                <span
                                                    className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase block">Receivable</span>
                                                <span
                                                    className={`text-xs sm:text-sm font-bold ${txn.details.due > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                            {txn.due > 0 ? `৳${formatCurrency(txn.due)}` : '—'}
                        </span>
                                            </div>
                                        </>
                                    )}

                                    {/* Due Payment: Total | Distributed | Advance */}
                                    {txn.transaction_type === 'due_payment' && (
                                        <>
                                            <div className="text-right min-w-[60px] sm:min-w-[80px]">
                                                <span
                                                    className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase block">Total</span>
                                                <span
                                                    className="text-xs sm:text-sm font-bold text-gray-800">৳{formatCurrency(txn.total)}</span>
                                            </div>
                                            <div className="text-right min-w-[60px] sm:min-w-[80px]">
                                                <span
                                                    className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase block">Distributed</span>
                                                <span
                                                    className="text-xs sm:text-sm font-bold text-green-600">৳{formatCurrency(txn.distributed)}</span>
                                            </div>
                                            <div className="text-right min-w-[60px] sm:min-w-[80px]">
                                                <span
                                                    className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase block">Advance</span>
                                                <span
                                                    className={`text-xs sm:text-sm font-bold ${txn.advance > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                            {txn.advance > 0 ? `৳${formatCurrency(txn.advance)}` : '—'}
                        </span>
                                            </div>
                                        </>
                                    )}

                                    {/* Payment Method */}
                                    <div className="text-right hidden sm:block min-w-[60px]">
                                        <span
                                            className="text-[10px] font-bold text-gray-400 uppercase block">Method</span>
                                        <span className="text-xs font-medium text-gray-700 capitalize">
                    {txn.payment_method || 'N/A'}
                </span>
                                    </div>

                                    {/* Expand Toggle */}
                                    <div
                                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        {isExpanded ? (
                                            <FaChevronUp className="text-gray-400 text-xs sm:text-sm"/>
                                        ) : (
                                            <FaChevronDown className="text-gray-400 text-xs sm:text-sm"/>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                            <div className="border-t border-gray-100 bg-gray-50 p-3 sm:p-4">
                                <TransactionDetails transaction={txn}/>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-wrap justify-between items-center gap-3 pt-4">
                    <span className="text-xs sm:text-sm text-gray-500">
                        Showing {offset + 1} - {Math.min(offset + limit, totalCount)} of {totalCount}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={offset === 0}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <span
                            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={handleNext}
                            disabled={offset + limit >= totalCount}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionList;