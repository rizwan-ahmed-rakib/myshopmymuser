// src/pages/purchase/SupplierTransactionTab/SupplierTransactionTab.jsx

import React, {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {FaUser, FaEye, FaPhone, FaEnvelope} from 'react-icons/fa';
import useModuleData from "../hooks/useModuleData";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import BackboneTable from "../components/BackboneTable";
import EmptyState from "../components/EmptyState";
import {posSupplierAPI} from "../../context_or_provider/pos/Purchase/suppliers/supplierAPI";


const SupplierTransactionTab = ({searchQuery, filters, onStatsLoaded, setFilterConfig}) => {
    const navigate = useNavigate();
    const [selectedSupplierId, setSelectedSupplierId] = useState(null);
    const [supplierTransactions, setSupplierTransactions] = useState([]);
    const [transactionLoading, setTransactionLoading] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    // 1. Filter Config
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search suppliers by name, email or phone...",
                filtersConfig: [
                    {
                        key: "sortBy",
                        label: "Sort By",
                        icon: <FaUser className="w-3.5 h-3.5"/>,
                        options: [
                            {value: "name_asc", label: "Name (A-Z)"},
                            {value: "name_desc", label: "Name (Z-A)"},
                            {value: "due_desc", label: "Highest Due"},
                        ]
                    }
                ],
                advancedConfig: []
            });
        }
    }, [setFilterConfig]);

    // 2. Stats
    // const calculateStats = useCallback((data) => {
    //     const total = data.length;
    //     const withDue = data.filter(s => parseFloat(s.due_amount || 0) !== 0).length;
    //     const totalDue = data.reduce((acc, curr) => acc + Math.abs(parseFloat(curr.due_amount || 0)), 0);
    //
    //     return [
    //         { title: 'Total Suppliers', count: total.toString(), bgColor: 'bg-purple-600', icon: <FaUser size={24} /> },
    //         { title: 'With Due', count: withDue.toString(), bgColor: 'bg-amber-500', icon: <FaUser size={24} /> },
    //         { title: 'Total Due', count: `৳${totalDue.toLocaleString()}`, bgColor: 'bg-blue-600', icon: <FaUser size={24} /> },
    //     ];
    // }, []);

    // const calculateStats = useCallback((data) => {
    //     const total = data.length;
    //     const withDue = data.filter(s => parseFloat(s.due_amount || 0) > 0).length;
    //     const withAdvance = data.filter(s => parseFloat(s.due_amount || 0) < 0).length;
    //     const totalPayable = data.reduce((acc, curr) => acc + Math.max(0, parseFloat(curr.due_amount || 0)), 0);
    //     const totalReceivable = data.reduce((acc, curr) => acc + Math.max(0, -parseFloat(curr.due_amount || 0)), 0);
    //
    //     return [
    //         {
    //             title: 'Total Suppliers',
    //             count: total.toString(),
    //             bgColor: 'bg-purple-600',
    //             icon: <FaUser size={24}/>
    //         },
    //         {
    //             title: 'With Due',
    //             count: withDue.toString(),
    //             bgColor: 'bg-amber-500',
    //             icon: <FaUser size={24}/>
    //         },
    //         {
    //             title: 'With Advance',
    //             count: withAdvance.toString(),
    //             bgColor: 'bg-blue-500',
    //             icon: <FaUser size={24}/>
    //         },
    //         {
    //             title: 'Total Payable',
    //             count: `৳${totalPayable.toLocaleString()}`,
    //             bgColor: 'bg-red-600',
    //             icon: <FaUser size={24}/>
    //         },
    //         {
    //             title: 'Total Receivable',
    //             count: `৳${totalReceivable.toLocaleString()}`,
    //             bgColor: 'bg-green-600',
    //             icon: <FaUser size={24}/>
    //         },
    //     ];
    // }, []);


    const calculateStats = useCallback((data) => {
        const total = data.length;
        const withDue = data.filter(s => parseFloat(s.due_amount || 0) > 0).length;
        const withAdvance = data.filter(s => parseFloat(s.due_amount || 0) < 0).length;
        const totalPayable = data.reduce((acc, curr) => acc + Math.max(0, parseFloat(curr.due_amount || 0)), 0);
        const totalReceivable = data.reduce((acc, curr) => acc + Math.max(0, -parseFloat(curr.due_amount || 0)), 0);

        return [
            {
                title: 'Total Suppliers',
                count: total.toString(),
                bgColor: 'bg-purple-600',
                icon: <FaUser size={24}/>,
            },
            {
                title: 'With Due / Total Payable',
                // count: 'gg${withDue.toString()}',
                count:  `${withDue.toLocaleString()} / ৳ ${totalPayable.toLocaleString()}`,
                // subInfo: `Total Payable: ৳${totalPayable.toLocaleString()}`,
                bgColor: 'bg-amber-500',
                icon: <FaUser size={24}/>,
            },
            {
                title: 'With Advance / Total Receivable',
                // count: withAdvance.toString(),
                count: `${withAdvance.toLocaleString()} / ৳ ${totalReceivable.toLocaleString()}`,
                // subInfo: `Total Receivable: ৳${totalReceivable.toLocaleString()}`,
                bgColor: 'bg-blue-500',
                icon: <FaUser size={24}/>,
            },
        ];
    }, []);


    ///////////////////////////////////////////////////////////

//     const calculateStats = useCallback((data) => {
//     const total = data.length;
//     const withDue = data.filter(s => parseFloat(s.due_amount || 0) > 0).length;
//     const withAdvance = data.filter(s => parseFloat(s.due_amount || 0) < 0).length;
//     const totalPayable = data.reduce((acc, curr) => acc + Math.max(0, parseFloat(curr.due_amount || 0)), 0);
//     const totalReceivable = data.reduce((acc, curr) => acc + Math.max(0, -parseFloat(curr.due_amount || 0)), 0);
//
//     return [
//         {
//             title: 'Total Suppliers',
//             count: total.toString(),
//             bgColor: 'bg-purple-600',
//             icon: <FaUser size={24} />,
//         },
//         {
//             // ✅ Split Card — NO ICON (columns handle everything)
//             bgColor: 'bg-amber-500',
//             icon: <FaUser size={24} />,
//             columns: [
//                 { label: 'With Due', value: withDue.toString() },
//                 { label: 'Payable', value: `৳${totalPayable.toLocaleString()}` },
//             ],
//             // help: 'Suppliers with outstanding balance',
//         },
//         {
//             // ✅ Split Card — NO ICON
//             bgColor: 'bg-blue-500',
//             icon: <FaUser size={24} />,
//             columns: [
//                 { label: 'With Advance', value: withAdvance.toString() },
//                 { label: 'Receivable', value: `৳${totalReceivable.toLocaleString()}` },
//             ],
//             // help: 'Suppliers with advance payment',
//         },
//     ];
// }, []);

    // 3. Supplier List via useModuleData
    const {
        filteredData: suppliers,
        rawData: allSuppliers,
        loading: supplierLoading,
        refresh: refreshSuppliers
    } = useModuleData({
        apiFetch: posSupplierAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['name', 'email', 'phone'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            let result = [...data];
            if (f.sortBy) {
                result.sort((a, b) => {
                    if (f.sortBy === "name_asc") return a.name.localeCompare(b.name);
                    if (f.sortBy === "name_desc") return b.name.localeCompare(a.name);
                    if (f.sortBy === "due_desc") return Math.abs(parseFloat(b.due_amount || 0)) - Math.abs(parseFloat(a.due_amount || 0));
                    return 0;
                });
            }
            return result;
        }
    });

    // 4. Fetch Supplier Transactions
    const fetchSupplierTransactions = useCallback(async (supplierId) => {
        if (!supplierId) return;
        setTransactionLoading(true);
        try {
            const response = await posSupplierAPI.getTransactions(supplierId, {
                limit: 5,
                offset: 0,
                order_by: 'date_desc'
            });
            setSupplierTransactions(response.data.transactions || []);
            setSelectedSupplier(allSuppliers?.find(s => s.id === supplierId) || null);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setTransactionLoading(false);
        }
    }, [allSuppliers]);

    // 5. Handle Supplier Select
    const handleSupplierSelect = (supplier) => {
        const newId = supplier.id;
        if (selectedSupplierId === newId) {
            setSelectedSupplierId(null);
            setSupplierTransactions([]);
            setSelectedSupplier(null);
        } else {
            setSelectedSupplierId(newId);
            fetchSupplierTransactions(newId);
        }
    };

    // 6. View Full History
    const handleViewFullHistory = (supplier) => {
        navigate(`/purchase/supplier/${supplier.id}/transactions`);
    };

    // 7. Supplier Table Columns
    const supplierColumns = [
        {
            header: "Supplier",
            accessor: "name",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                        {item.image ? (
                            <img src={item.image} className="w-full h-full object-cover" alt=""/>
                        ) : (
                            <FaUser className="text-gray-400"/>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-900 truncate">{item.name}</span>
                        <span className="text-[10px] text-gray-400 truncate">{item.email || "No Email"}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Contact",
            accessor: "phone",
            render: (item) => (
                <span className="text-sm text-gray-600">{item.phone || "N/A"}</span>
            )
        },
        {
            header: "Due Balance",
            accessor: "due_amount",
            render: (item) => {
                const due = parseFloat(item.due_amount || 0);
                if (due > 0) {
                    return <StatusBadge type="success" label={`Payable ৳${due.toLocaleString()}`}/>;
                } else if (due < 0) {
                    return <StatusBadge type="danger" label={`Receivable ৳${Math.abs(due).toLocaleString()}`}/>;
                }
                return <StatusBadge type="default" label="Clear"/>;
            }
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right",
            render: (item) => {
                const isSelected = selectedSupplierId === item.id;
                return (
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => handleSupplierSelect(item)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                                isSelected
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                        >
                            {isSelected ? 'Hide Transactions' : 'Show Transactions'}
                        </button>
                        <button
                            onClick={() => handleViewFullHistory(item)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Full History"
                        >
                            <FaEye size={16}/>
                        </button>
                    </div>
                );
            }
        }
    ];

    // 8. Render Loading
    if (supplierLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-500 text-sm">Loading suppliers...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Supplier List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight mb-4 flex items-center gap-2">
                    <FaUser className="text-brand-primary"/>
                    Select a Supplier to View Transactions
                    <span className="ml-auto text-[11px] font-medium text-gray-400">
                        {suppliers.length} suppliers found
                    </span>
                </h2>

                <BackboneTable
                    columns={supplierColumns}
                    data={suppliers}
                    emptyState={
                        <EmptyState
                            icon={<FaUser size={32}/>}
                            title="No suppliers found"
                            description="Try adjusting your search or filters."
                        />
                    }
                />
            </div>

            {/* Transactions Display */}
            {selectedSupplierId && (
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">
                            Transactions for <span className="text-blue-600">{selectedSupplier?.name}</span>
                        </h3>
                        <button
                            onClick={() => handleViewFullHistory(selectedSupplier)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                            View Full History <FaEye size={12}/>
                        </button>
                    </div>

                    {transactionLoading ? (
                        <div className="flex justify-center py-8">
                            <LoadingSpinner size="md"/>
                        </div>
                    ) : supplierTransactions.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            No transactions found for this supplier.
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {supplierTransactions.slice(0, 5).map((txn, idx) => (
                                <div key={idx}
                                     className="bg-white rounded-lg p-3 border border-gray-100 flex flex-wrap justify-between items-center text-sm">
                                    <div>
                                        <span className="font-medium text-gray-800">{txn.invoice_no}</span>
                                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                            txn.transaction_type === 'purchase' ? 'bg-blue-100 text-blue-700' :
                                                txn.transaction_type === 'purchase_return' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-green-100 text-green-700'
                                        }`}>
                                            {txn.transaction_type.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs">
                                        <span className="text-gray-400">{new Date(txn.date).toLocaleDateString()}</span>
                                        <span
                                            className={`font-bold ${txn.transaction_type === 'purchase' ? 'text-red-600' : 'text-green-600'}`}>
                                            ৳{(txn.total || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {supplierTransactions.length > 5 && (
                                <div className="text-center text-xs text-gray-400 pt-2">
                                    + {supplierTransactions.length - 5} more transactions
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SupplierTransactionTab;