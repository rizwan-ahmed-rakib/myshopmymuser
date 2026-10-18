// // src/pages/sale/customer/CustomerTransactionHistory.jsx
//
// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import { FaUser, FaPhone, FaEnvelope, FaPrint, FaFilePdf } from 'react-icons/fa';
// import api from '../../../context_or_provider/pos/posApi';
// import LoadingSpinner from '../../components/LoadingSpinner';
// import SaleTransactionList from './SaleTransactionList';
// import SaleTransactionFilters from './SaleTransactionFilters';
// import { getTransactionHistoryPrintHTML } from "../../utils/transactionHistoryPrintTemplate";
// import { downloadCustomerTransactionPDF } from "../../utils/customerTransactionPDF";
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
//
//             {/* ✅ Customer Header — Single Row, Responsive (matching Supplier design) */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 print:border-0 print:shadow-none">
//                 <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
//                     {/* Left Block: Avatar + Name + Contact + Stats — সব এক সারিতে */}
//                     <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
//                         {/* Avatar */}
//                         <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 shrink-0">
//                             {customer?.image ? (
//                                 <img src={customer.image} alt={customer.name} className="w-full h-full object-cover" />
//                             ) : (
//                                 <FaUser className="text-gray-400 text-sm sm:text-xl md:text-2xl" />
//                             )}
//                         </div>
//
//                         {/* Name */}
//                         <span className="font-bold text-gray-900 text-sm sm:text-base md:text-2xl truncate max-w-[80px] sm:max-w-[150px] md:max-w-none">
//                             {customer?.name || 'Customer'}
//                         </span>
//
//                         {/* Phone */}
//                         <span className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm text-gray-500 whitespace-nowrap">
//                             <FaPhone className="text-gray-400" size={12} />
//                             {customer?.phone || 'N/A'}
//                         </span>
//
//                         {/* Email (মোবাইলে লুকানো) */}
//                         <span className="hidden sm:flex items-center gap-1 text-xs md:text-sm text-gray-500 whitespace-nowrap">
//                             <FaEnvelope className="text-gray-400" size={12} />
//                             {customer?.email || 'N/A'}
//                         </span>
//
//                         {/* ID Badge */}
//                         <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[8px] sm:text-[10px] md:text-xs font-bold bg-blue-50 text-blue-600 whitespace-nowrap">
//                             ID: #{customer?.id}
//                         </span>
//
//                         {/* Total Transactions (মোবাইলে ছোট) */}
//                         <span className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm text-gray-600 whitespace-nowrap">
//                             <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase font-bold">Tx:</span>
//                             <span className="font-bold">{totalCount}</span>
//                         </span>
//
//                         {/* Due Balance (মোবাইলে ছোট) — customer logic: positive = receivable, negative = advance */}
//                         <span className={`flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-bold whitespace-nowrap ${
//                             dueAmount > 0 ? 'text-red-600' :
//                             dueAmount < 0 ? 'text-green-600' :
//                             'text-gray-600'
//                         }`}>
//                             <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase font-bold">Due:</span>
//                             ৳{Math.abs(dueAmount).toLocaleString()}
//                             <span className="hidden md:inline text-[8px] sm:text-[10px] font-normal text-gray-400">
//                                 {dueAmount > 0 ? '(Receivable)' :
//                                  dueAmount < 0 ? '(Advance/Payable)' :
//                                  '(Settled)'}
//                             </span>
//                         </span>
//                     </div>
//
//                     {/* Right: Action Buttons */}
//                     <div className="flex items-center gap-1 sm:gap-2 print:hidden shrink-0">
//                         <button
//                             onClick={handlePrintStyled}
//                             className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-medium"
//                         >
//                             <FaPrint size={14} />
//                             {/*<span className="hidden xs:inline">Print</span>*/}
//                             <span >Print</span>
//                         </button>
//                         <button
//                             onClick={handlePDFDownload}
//                             className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-medium"
//                         >
//                             <FaFilePdf size={14} />
//                             {/*<span className="hidden xs:inline">PDF</span>*/}
//                             <span >PDF</span>
//                         </button>
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
//             {/* Transaction List */}
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
import { FaUser, FaPhone, FaEnvelope, FaPrint, FaFilePdf, FaListAlt, FaChartBar, FaStar, FaExclamationTriangle } from 'react-icons/fa';
import api from '../../../context_or_provider/pos/posApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import SaleTransactionList from './SaleTransactionList';
import SaleTransactionFilters from './SaleTransactionFilters';
import TopProductsSection from './TopProductsSection';
import StarProductsSection from './StarProductsSection';
import RiskProductsSection from './RiskProductsSection';
import { getTransactionHistoryPrintHTML } from "../../utils/transactionHistoryPrintTemplate";
import { downloadCustomerTransactionPDF } from "../../utils/customerTransactionPDF";

const TABS = [
    { key: 'transactions', label: 'Transactions', icon: FaListAlt },
    { key: 'top',          label: 'Top Products', icon: FaChartBar },
    { key: 'star',         label: 'Star Products', icon: FaStar },
    { key: 'risk',         label: 'Risk Products', icon: FaExclamationTriangle },
];

const CustomerTransactionHistory = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('transactions');
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [customer, setCustomer] = useState(null);
    const [filters, setFilters] = useState({
        start_date: '', end_date: '', transaction_type: '',
        search: '', limit: 50, offset: 0, order_by: 'date_desc',
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
                if (filters[key]) params.append(key, filters[key]);
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
    }, [fetchCustomerInfo]);

    useEffect(() => {
        if (activeTab === 'transactions') fetchTransactions();
    }, [fetchTransactions, activeTab]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters, offset: 0 }));
    };

    const handlePageChange = (newOffset) => {
        setFilters(prev => ({ ...prev, offset: newOffset }));
    };

    const handlePrintStyled = () => {
        if (transactions.length === 0) { alert('No transactions to print.'); return; }
        const htmlContent = getTransactionHistoryPrintHTML(customer, transactions, filters, totalCount);
        const printWindow = window.open('', '_blank', 'width=1100,height=900');
        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.onload = function () { printWindow.print(); };
        }
    };

    const handlePDFDownload = () => {
        if (transactions.length === 0) { alert('No transactions to export.'); return; }
        downloadCustomerTransactionPDF(customer, transactions, filters, totalCount);
    };

    if (loading && transactions.length === 0 && activeTab === 'transactions') {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    const dueAmount = parseFloat(customer?.due_amount || 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

            {/* ✅ Customer Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 print:border-0 print:shadow-none">
                <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 shrink-0">
                            {customer?.image ? (
                                <img src={customer.image} alt={customer.name} className="w-full h-full object-cover" />
                            ) : (
                                <FaUser className="text-gray-400 text-sm sm:text-xl md:text-2xl" />
                            )}
                        </div>
                        <span className="font-bold text-gray-900 text-sm sm:text-base md:text-2xl truncate max-w-[80px] sm:max-w-[150px] md:max-w-none">
                            {customer?.name || 'Customer'}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm text-gray-500 whitespace-nowrap">
                            <FaPhone className="text-gray-400" size={12} />
                            {customer?.phone || 'N/A'}
                        </span>
                        <span className="hidden sm:flex items-center gap-1 text-xs md:text-sm text-gray-500 whitespace-nowrap">
                            <FaEnvelope className="text-gray-400" size={12} />
                            {customer?.email || 'N/A'}
                        </span>
                        <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[8px] sm:text-[10px] md:text-xs font-bold bg-blue-50 text-blue-600 whitespace-nowrap">
                            ID: #{customer?.id}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm text-gray-600 whitespace-nowrap">
                            <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase font-bold">Tx:</span>
                            <span className="font-bold">{totalCount}</span>
                        </span>
                        <span className={`flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-bold whitespace-nowrap ${
                            dueAmount > 0 ? 'text-red-600' :
                            dueAmount < 0 ? 'text-green-600' : 'text-gray-600'
                        }`}>
                            <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase font-bold">Due:</span>
                            ৳{Math.abs(dueAmount).toLocaleString()}
                            <span className="hidden md:inline text-[8px] sm:text-[10px] font-normal text-gray-400">
                                {dueAmount > 0 ? '(Receivable)' : dueAmount < 0 ? '(Advance/Payable)' : '(Settled)'}
                            </span>
                        </span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 print:hidden shrink-0">
                        <button onClick={handlePrintStyled}
                                className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-medium">
                            <FaPrint size={14} /><span>Print</span>
                        </button>
                        <button onClick={handlePDFDownload}
                                className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-medium">
                            <FaFilePdf size={14} /><span>PDF</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ✅ Tabs */}
            <div className="print:hidden mb-4 sm:mb-6">
                <div className="flex gap-1 bg-white p-1 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex-1 justify-center
                                    ${active
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon size={12} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ✅ Tab Content */}
            {activeTab === 'transactions' && (
                <>
                    <div className="print:hidden">
                        <SaleTransactionFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            totalCount={totalCount}
                            showTypeFilter={true}
                        />
                    </div>
                    <SaleTransactionList
                        transactions={transactions}
                        totalCount={totalCount}
                        limit={filters.limit}
                        offset={filters.offset}
                        onPageChange={handlePageChange}
                        loading={loading}
                    />
                </>
            )}

            {activeTab === 'top' && (
                <>
                    <div className="print:hidden">
                        <SaleTransactionFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            totalCount={0}
                            showTypeFilter={false}
                        />
                    </div>
                    <TopProductsSection
                        customerId={id}
                        startDate={filters.start_date}
                        endDate={filters.end_date}
                    />
                </>
            )}

            {activeTab === 'star' && (
                <>
                    <div className="print:hidden">
                        <SaleTransactionFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            totalCount={0}
                            showTypeFilter={false}
                        />
                    </div>
                    <StarProductsSection
                        customerId={id}
                        startDate={filters.start_date}
                        endDate={filters.end_date}
                    />
                </>
            )}

            {activeTab === 'risk' && (
                <>
                    <div className="print:hidden">
                        <SaleTransactionFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            totalCount={0}
                            showTypeFilter={false}
                        />
                    </div>
                    <RiskProductsSection
                        customerId={id}
                        startDate={filters.start_date}
                        endDate={filters.end_date}
                    />
                </>
            )}

            {/* Print-only footer */}
            <div className="hidden print:block text-center text-xs text-gray-400 mt-8 border-t border-gray-200 pt-4">
                Printed on {new Date().toLocaleString()} | Customer: {customer?.name} (ID: #{customer?.id})
            </div>
        </div>
    );
};

export default CustomerTransactionHistory;