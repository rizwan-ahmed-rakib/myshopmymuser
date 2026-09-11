//
// // src/pages/sale/customer/CustomerTransactionHistory.jsx
//
// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import { FaUser, FaPhone, FaEnvelope, FaPrint, FaFilePdf } from 'react-icons/fa';
// import api from '../../../context_or_provider/pos/posApi';
// import LoadingSpinner from '../../components/LoadingSpinner';
// import SaleTransactionList from './SaleTransactionList';
// import SaleTransactionFilters from './SaleTransactionFilters';
// import {getTransactionHistoryPrintHTML} from "../../utils/transactionHistoryPrintTemplate";
// import {downloadCustomerTransactionPDF} from "../../utils/customerTransactionPDF";
//
//
// const CustomerTransactionHistory = () => {
//     const { id } = useParams();
//     const [loading, setLoading] = useState(true);
//     const [transactions, setTransactions] = useState([]);
//     const [totalCount, setTotalCount] = useState(0);
//     const [customer, setCustomer] = useState(null);
//     const [filters, setFilters] = useState({
//         start_date: '',
//         end_date: '',
//         transaction_type: '',
//         search: '',
//         limit: 50,
//         offset: 0,
//         order_by: 'date_desc'
//     });
//
//     const fetchCustomerInfo = useCallback(async () => {
//         try {
//             const response = await api.get(`/api/sale/customers/${id}/`);
//             setCustomer(response.data);
//         } catch (error) {
//             console.error('Error fetching customer:', error);
//         }
//     }, [id]);
//
//     const fetchTransactions = useCallback(async () => {
//         setLoading(true);
//         try {
//             const params = new URLSearchParams();
//             Object.keys(filters).forEach(key => {
//                 if (filters[key]) {
//                     params.append(key, filters[key]);
//                 }
//             });
//             const response = await api.get(`/api/sale/customer-transactions/${id}/transactions/?${params.toString()}`);
//             setTransactions(response.data.transactions);
//             setTotalCount(response.data.total_count);
//         } catch (error) {
//             console.error('Error fetching transactions:', error);
//         } finally {
//             setLoading(false);
//         }
//     }, [id, filters]);
//
//     useEffect(() => {
//         fetchCustomerInfo();
//         fetchTransactions();
//     }, [fetchCustomerInfo, fetchTransactions]);
//
//     const handleFilterChange = (newFilters) => {
//         setFilters(prev => ({ ...prev, ...newFilters, offset: 0 }));
//     };
//
//     const handlePageChange = (newOffset) => {
//         setFilters(prev => ({ ...prev, offset: newOffset }));
//     };
//
//     const handlePrintStyled = () => {
//         if (transactions.length === 0) {
//             alert('No transactions to print.');
//             return;
//         }
//         const htmlContent = getTransactionHistoryPrintHTML(customer, transactions, filters, totalCount);
//         const printWindow = window.open('', '_blank', 'width=1100,height=900');
//         if (printWindow) {
//             printWindow.document.write(htmlContent);
//             printWindow.document.close();
//             printWindow.onload = function () {
//                 printWindow.print();
//             };
//         }
//     };
//
//     const handlePDFDownload = () => {
//         if (transactions.length === 0) {
//             alert('No transactions to export.');
//             return;
//         }
//         downloadCustomerTransactionPDF(customer, transactions, filters, totalCount);
//     };
//
//     if (loading && transactions.length === 0) {
//         return (
//             <div className="flex items-center justify-center py-20">
//                 <LoadingSpinner size="lg" />
//             </div>
//         );
//     }
//
//     const dueAmount = parseFloat(customer?.due_amount || 0);
//
//     return (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             {/* ✅ Header with Customer Identity (Supplier style) */}
//             <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
//                 <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-blue-200">
//                         {customer?.image ? (
//                             <img src={customer.image} alt={customer.name} className="w-full h-full object-cover" />
//                         ) : (
//                             <FaUser className="text-blue-600 text-xl" />
//                         )}
//                     </div>
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900">
//                             {customer?.name || 'Customer'}
//                             <span className="ml-3 text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
//                                 ID: #{customer?.id}
//                             </span>
//                         </h1>
//                         <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-0.5">
//                             <span className="flex items-center gap-1">
//                                 <FaPhone className="text-gray-400" size={12} />
//                                 {customer?.phone || 'N/A'}
//                             </span>
//                             <span className="flex items-center gap-1">
//                                 <FaEnvelope className="text-gray-400" size={12} />
//                                 {customer?.email || 'N/A'}
//                             </span>
//                             <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
//                                 dueAmount > 0 ? 'bg-red-100 text-red-700' :
//                                 dueAmount < 0 ? 'bg-green-100 text-green-700' :
//                                 'bg-gray-100 text-gray-500'
//                             }`}>
//                                 {dueAmount > 0 ? `Receivable: ৳${dueAmount.toLocaleString()}` :
//                                  dueAmount < 0 ? `Advance: ৳${Math.abs(dueAmount).toLocaleString()}` :
//                                  'Settled'}
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                     <button
//                         onClick={handlePrintStyled}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
//                     >
//                         <FaPrint size={14} /> Print
//                     </button>
//                     <button
//                         onClick={handlePDFDownload}
//                         className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium"
//                     >
//                         <FaFilePdf size={14} /> PDF
//                     </button>
//                 </div>
//             </div>
//
//             {/* ✅ Customer Info Card – Detailed (Supplier style) */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 print:border print:shadow-none">
//                 <div className="flex flex-wrap items-start justify-between gap-4">
//                     <div className="flex items-center gap-4">
//                         <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
//                             {customer?.image ? (
//                                 <img src={customer.image} alt={customer.name} className="w-full h-full object-cover" />
//                             ) : (
//                                 <FaUser className="text-gray-400 text-3xl" />
//                             )}
//                         </div>
//                         <div>
//                             <h2 className="text-xl font-bold text-gray-900">{customer?.name}</h2>
//                             <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
//                                 <span className="flex items-center gap-1">
//                                     <FaPhone className="text-gray-400" size={12} />
//                                     {customer?.phone || 'N/A'}
//                                 </span>
//                                 <span className="flex items-center gap-1">
//                                     <FaEnvelope className="text-gray-400" size={12} />
//                                     {customer?.email || 'N/A'}
//                                 </span>
//                                 <span className="text-xs text-gray-400">| ID: #{customer?.id}</span>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="text-right">
//                         <span className="text-xs text-gray-400 uppercase font-bold block">Due Balance</span>
//                         <p className={`text-lg font-bold ${
//                             dueAmount > 0 ? 'text-red-600' :
//                             dueAmount < 0 ? 'text-green-600' :
//                             'text-gray-600'
//                         }`}>
//                             ৳{Math.abs(dueAmount).toLocaleString()}
//                             {dueAmount > 0 ? ' (Receivable)' :
//                              dueAmount < 0 ? ' (Advance/Payable)' :
//                              ' (Settled)'}
//                         </p>
//                     </div>
//                 </div>
//                 <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-8">
//                     <div>
//                         <span className="text-xs text-gray-400 uppercase font-bold block">Total Transactions</span>
//                         <p className="text-lg font-bold text-gray-800">{totalCount}</p>
//                     </div>
//                     <div>
//                         <span className="text-xs text-gray-400 uppercase font-bold block">Transaction Filter</span>
//                         <p className="text-sm text-gray-600">
//                             {filters.start_date || filters.end_date ?
//                                 `${filters.start_date || '...'} → ${filters.end_date || '...'}` :
//                                 'All time'}
//                         </p>
//                     </div>
//                     <div>
//                         <span className="text-xs text-gray-400 uppercase font-bold block">Transaction Type</span>
//                         <p className="text-sm text-gray-600 capitalize">
//                             {filters.transaction_type ? filters.transaction_type.replace('_', ' ') : 'All'}
//                         </p>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Filters */}
//             <div className="print:hidden">
//                 <SaleTransactionFilters
//                     filters={filters}
//                     onFilterChange={handleFilterChange}
//                     totalCount={totalCount}
//                 />
//             </div>
//
//             {/* ✅ Transaction List with Customer Name header */}
//             <div className="flex items-center justify-between mb-3">
//                 <h3 className="text-sm font-semibold text-gray-700">
//                     📋 Transaction History for{' '}
//                     <span className="text-blue-600 underline decoration-blue-200 underline-offset-2">
//                         {customer?.name || 'Customer'}
//                     </span>
//                     <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
//                         ID: #{customer?.id}
//                     </span>
//                 </h3>
//                 <span className="text-xs text-gray-400">
//                     {totalCount} records found
//                 </span>
//             </div>
//
//             <SaleTransactionList
//                 transactions={transactions}
//                 totalCount={totalCount}
//                 limit={filters.limit}
//                 offset={filters.offset}
//                 onPageChange={handlePageChange}
//                 loading={loading}
//             />
//
//             {/* Print-only footer */}
//             <div className="hidden print:block text-center text-xs text-gray-400 mt-8 border-t border-gray-200 pt-4">
//                 Printed on {new Date().toLocaleString()} | Customer: {customer?.name} (ID: #{customer?.id})
//             </div>
//         </div>
//     );
// };
//
// export default CustomerTransactionHistory;



// src/pages/sale/customer/CustomerTransactionHistory.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FaUser, FaPhone, FaEnvelope, FaPrint, FaFilePdf } from 'react-icons/fa';
import api from '../../../context_or_provider/pos/posApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import SaleTransactionList from './SaleTransactionList';
import SaleTransactionFilters from './SaleTransactionFilters';
import { getTransactionHistoryPrintHTML } from "../../utils/transactionHistoryPrintTemplate";
import { downloadCustomerTransactionPDF } from "../../utils/customerTransactionPDF";

const CustomerTransactionHistory = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [customer, setCustomer] = useState(null);
    const [filters, setFilters] = useState({
        start_date: '',
        end_date: '',
        transaction_type: '',
        search: '',
        limit: 50,
        offset: 0,
        order_by: 'date_desc'
    });

    const fetchCustomerInfo = useCallback(async () => {
        try {
            const response = await api.get(`/api/sale/customers/${id}/`);
            setCustomer(response.data);
        } catch (error) {
            console.error('Error fetching customer:', error);
        }
    }, [id]);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    params.append(key, filters[key]);
                }
            });
            const response = await api.get(`/api/sale/customer-transactions/${id}/transactions/?${params.toString()}`);
            setTransactions(response.data.transactions);
            setTotalCount(response.data.total_count);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    }, [id, filters]);

    useEffect(() => {
        fetchCustomerInfo();
        fetchTransactions();
    }, [fetchCustomerInfo, fetchTransactions]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters, offset: 0 }));
    };

    const handlePageChange = (newOffset) => {
        setFilters(prev => ({ ...prev, offset: newOffset }));
    };

    const handlePrintStyled = () => {
        if (transactions.length === 0) {
            alert('No transactions to print.');
            return;
        }
        const htmlContent = getTransactionHistoryPrintHTML(customer, transactions, filters, totalCount);
        const printWindow = window.open('', '_blank', 'width=1100,height=900');
        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.onload = function () {
                printWindow.print();
            };
        }
    };

    const handlePDFDownload = () => {
        if (transactions.length === 0) {
            alert('No transactions to export.');
            return;
        }
        downloadCustomerTransactionPDF(customer, transactions, filters, totalCount);
    };

    if (loading && transactions.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    const dueAmount = parseFloat(customer?.due_amount || 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* ✅ Customer Header — Single Row, Responsive (matching Supplier design) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 print:border-0 print:shadow-none">
                <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
                    {/* Left Block: Avatar + Name + Contact + Stats — সব এক সারিতে */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 shrink-0">
                            {customer?.image ? (
                                <img src={customer.image} alt={customer.name} className="w-full h-full object-cover" />
                            ) : (
                                <FaUser className="text-gray-400 text-sm sm:text-xl md:text-2xl" />
                            )}
                        </div>

                        {/* Name */}
                        <span className="font-bold text-gray-900 text-sm sm:text-base md:text-2xl truncate max-w-[80px] sm:max-w-[150px] md:max-w-none">
                            {customer?.name || 'Customer'}
                        </span>

                        {/* Phone */}
                        <span className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm text-gray-500 whitespace-nowrap">
                            <FaPhone className="text-gray-400" size={12} />
                            {customer?.phone || 'N/A'}
                        </span>

                        {/* Email (মোবাইলে লুকানো) */}
                        <span className="hidden sm:flex items-center gap-1 text-xs md:text-sm text-gray-500 whitespace-nowrap">
                            <FaEnvelope className="text-gray-400" size={12} />
                            {customer?.email || 'N/A'}
                        </span>

                        {/* ID Badge */}
                        <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[8px] sm:text-[10px] md:text-xs font-bold bg-blue-50 text-blue-600 whitespace-nowrap">
                            ID: #{customer?.id}
                        </span>

                        {/* Total Transactions (মোবাইলে ছোট) */}
                        <span className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm text-gray-600 whitespace-nowrap">
                            <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase font-bold">Tx:</span>
                            <span className="font-bold">{totalCount}</span>
                        </span>

                        {/* Due Balance (মোবাইলে ছোট) — customer logic: positive = receivable, negative = advance */}
                        <span className={`flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-bold whitespace-nowrap ${
                            dueAmount > 0 ? 'text-red-600' :
                            dueAmount < 0 ? 'text-green-600' :
                            'text-gray-600'
                        }`}>
                            <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase font-bold">Due:</span>
                            ৳{Math.abs(dueAmount).toLocaleString()}
                            <span className="hidden md:inline text-[8px] sm:text-[10px] font-normal text-gray-400">
                                {dueAmount > 0 ? '(Receivable)' :
                                 dueAmount < 0 ? '(Advance/Payable)' :
                                 '(Settled)'}
                            </span>
                        </span>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-1 sm:gap-2 print:hidden shrink-0">
                        <button
                            onClick={handlePrintStyled}
                            className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-medium"
                        >
                            <FaPrint size={14} />
                            {/*<span className="hidden xs:inline">Print</span>*/}
                            <span >Print</span>
                        </button>
                        <button
                            onClick={handlePDFDownload}
                            className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-medium"
                        >
                            <FaFilePdf size={14} />
                            {/*<span className="hidden xs:inline">PDF</span>*/}
                            <span >PDF</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="print:hidden">
                <SaleTransactionFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    totalCount={totalCount}
                />
            </div>

            {/* Transaction List */}
            <SaleTransactionList
                transactions={transactions}
                totalCount={totalCount}
                limit={filters.limit}
                offset={filters.offset}
                onPageChange={handlePageChange}
                loading={loading}
            />

            {/* Print-only footer */}
            <div className="hidden print:block text-center text-xs text-gray-400 mt-8 border-t border-gray-200 pt-4">
                Printed on {new Date().toLocaleString()} | Customer: {customer?.name} (ID: #{customer?.id})
            </div>
        </div>
    );
};

export default CustomerTransactionHistory;