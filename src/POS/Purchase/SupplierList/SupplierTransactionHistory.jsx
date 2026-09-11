// src/pages/purchase/supplier/SupplierTransactionHistory.jsx

import React, {useState, useEffect, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import {FaUser, FaPhone, FaEnvelope, FaPrint, FaFilePdf} from 'react-icons/fa';
import api from '../../../context_or_provider/pos/posApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import TransactionFilters from './TransactionFilters';
import TransactionList from './TransactionList';
import {getSupplierTransactionHistoryPrintHTML} from "../../utils/supplierTransactionHistoryPrintTemplate";

const SupplierTransactionHistory = () => {
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [supplier, setSupplier] = useState(null);
    const [filters, setFilters] = useState({
        start_date: '',
        end_date: '',
        transaction_type: '',
        search: '',
        limit: 50,
        offset: 0,
        order_by: 'date_desc'
    });

    // Supplier Info Fetch
    const fetchSupplierInfo = useCallback(async () => {
        try {
            const response = await api.get(`/api/purchase/suppliers/${id}/`);
            setSupplier(response.data);
        } catch (error) {
            console.error('Error fetching supplier:', error);
        }
    }, [id]);

    // Transactions Fetch
    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    params.append(key, filters[key]);
                }
            });
            const response = await api.get(`/api/purchase/supplier-transactions/${id}/transactions/?${params.toString()}`);
            setTransactions(response.data.transactions);
            setTotalCount(response.data.total_count);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    }, [id, filters]);

    useEffect(() => {
        fetchSupplierInfo();
        fetchTransactions();
    }, [fetchSupplierInfo, fetchTransactions]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({...prev, ...newFilters, offset: 0}));
    };

    const handlePageChange = (newOffset) => {
        setFilters(prev => ({...prev, offset: newOffset}));
    };

    // ✅ Print using new window with styled content
    const handlePrintStyled = () => {
        if (transactions.length === 0) {
            alert('No transactions to print.');
            return;
        }
        const htmlContent = getSupplierTransactionHistoryPrintHTML(supplier, transactions, filters, totalCount);
        const printWindow = window.open("", "_blank", "width=1100,height=900");
        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.onload = function () {
                printWindow.print();
            };
        }
    };

    // ✅ PDF Download (if you have it)
    const handlePDFDownload = () => {
        if (transactions.length === 0) {
            alert('No transactions to export.');
            return;
        }
        // TODO: downloadSupplierTransactionPDF(supplier, transactions, filters, totalCount);
        alert('PDF download functionality coming soon!');
    };

    // ✅ Stats for StatCards (split layout)

    if (loading && transactions.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg"/>
            </div>
        );
    }

    // Helper to display filter info
    const getFilterDisplay = () => {
        if (filters.start_date || filters.end_date) {
            return `${filters.start_date || '...'} → ${filters.end_date || '...'}`;
        }
        return 'All time';
    };

    const getTypeDisplay = () => {
        if (filters.transaction_type) {
            return filters.transaction_type.replace('_', ' ').toUpperCase();
        }
        return 'All types';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">



            {/* ✅ Supplier Header — Large Screen Layout, Mobile Optimized */}
            {/* ✅ Supplier Header — Single Row, Responsive */}
            <div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 print:border-0 print:shadow-none">
                <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
                    {/* Left Block: Avatar + Name + Contact + Stats — সব এক সারিতে */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                        {/* Avatar */}
                        <div
                            className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 shrink-0">
                            {supplier?.image ? (
                                <img src={supplier.image} alt={supplier.name} className="w-full h-full object-cover"/>
                            ) : (
                                <FaUser className="text-gray-400 text-sm sm:text-xl md:text-2xl"/>
                            )}
                        </div>

                        {/* Name */}
                        <span
                            className="font-bold text-gray-900 text-sm sm:text-base md:text-2xl truncate max-w-[80px] sm:max-w-[150px] md:max-w-none">
                {supplier?.name || 'Supplier'}
            </span>

                        {/* Phone */}
                        <span
                            className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm text-gray-500 whitespace-nowrap">
                <FaPhone className="text-gray-400" size={12}/>
                            {supplier?.phone || 'N/A'}
            </span>

                        {/* Email (মোবাইলে লুকানো) */}
                        <span
                            className="hidden sm:flex items-center gap-1 text-xs md:text-sm text-gray-500 whitespace-nowrap">
                <FaEnvelope className="text-gray-400" size={12}/>
                            {supplier?.email || 'N/A'}
            </span>

                        {/* ID Badge */}
                        <span
                            className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[8px] sm:text-[10px] md:text-xs font-bold bg-blue-50 text-blue-600 whitespace-nowrap">
                ID: #{supplier?.id}
            </span>

                        {/* Total Transactions (মোবাইলে ছোট) */}
                        <span
                            className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm text-gray-600 whitespace-nowrap">
                <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase font-bold">Tx:</span>
                <span className="font-bold">{totalCount}</span>
            </span>

                        {/* Due Balance (মোবাইলে ছোট) */}
                        <span
                            className={`flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-bold whitespace-nowrap ${
                                parseFloat(supplier?.due_amount || 0) > 0 ? 'text-red-600' :
                                    parseFloat(supplier?.due_amount || 0) < 0 ? 'text-green-600' :
                                        'text-gray-600'
                            }`}>
                <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase font-bold">Due:</span>
                ৳{Math.abs(parseFloat(supplier?.due_amount || 0)).toLocaleString()}
                            <span className="hidden md:inline text-[8px] sm:text-[10px] font-normal text-gray-400">
                    {parseFloat(supplier?.due_amount || 0) > 0 ? '(Payable)' :
                        parseFloat(supplier?.due_amount || 0) < 0 ? '(Receivable)' :
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
                            <FaPrint size={14}/>
                            {/*<span className="hidden xs:inline">Print</span>*/}
                            <span>Print</span>
                        </button>
                        <button
                            onClick={handlePDFDownload}
                            className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-medium"
                        >
                            <FaFilePdf size={14}/>
                            {/*<span className="hidden xs:inline">PDF</span>*/}
                            <span >PDF</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* ✅ Stats Cards */}

            {/* Filters */}
            <div className="print:hidden">
                <TransactionFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    totalCount={totalCount}
                />
            </div>

            {/* Transaction List */}
            <TransactionList
                transactions={transactions}
                totalCount={totalCount}
                limit={filters.limit}
                offset={filters.offset}
                onPageChange={handlePageChange}
                loading={loading}
            />

            {/* Print-only footer */}
            <div className="hidden print:block text-center text-xs text-gray-400 mt-8 border-t border-gray-200 pt-4">
                Printed on {new Date().toLocaleString()} | Supplier: {supplier?.name} (ID: #{supplier?.id})
            </div>
        </div>
    );
};

export default SupplierTransactionHistory;