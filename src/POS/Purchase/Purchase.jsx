import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ModuleShell from '../components/ModuleShell';
import PurchaseGrid from "./PurchaseProduct/PurchaseGrid";
import SupplierGrid from "./SupplierList/SupplierGrid";
import PurchaseReturnGrid from "./PurchaseReturn/PurchaseReturnGrid";
import SupplierDuePaymentGrid from "./SupplierDuePayment/SupplierDuePaymentGrid";

/**
 * Purchase Module - Acts as the parent container for all Purchase-related features.
 * Refactored to use ModuleShell as a backbone for layout, navigation, stats, and universal filtering.
 */
const Purchase = () => {
    const [activeTab, setActiveTab] = useState('posPurchase-list');
    const [viewType, setViewType] = useState('grid');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [stats, setStats] = useState([]);
    
    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({});
    const [filterConfig, setFilterConfig] = useState({
        searchPlaceholder: "Search...",
        filtersConfig: [],
        advancedConfig: []
    });

    const location = useLocation();
    const isRootPath = location.pathname === '/purchase' || location.pathname === '/purchase/';

    const tabs = [
        { id: 'posPurchase-list', name: 'Purchase', icon: '📋', addLabel: 'Add Purchase' },
        { id: 'purchase-return-list', name: 'Purchase Return', icon: '↩️', addLabel: 'Add Return' },
        { id: 'Supplier-list', name: 'Supplier', icon: '👥', addLabel: 'Add Supplier' },
        { id: 'Supplier-due-payment-list', name: 'Supplier Due Payment', icon: '📋', addLabel: 'Payment Due' },
    ];

    const renderTabContent = () => {
        const commonProps = {
            viewType,
            isAddOpen,
            setIsAddOpen,
            onStatsLoaded: setStats,
            searchQuery,
            filters,
            setFilterConfig,
        };

        switch (activeTab) {
            case 'posPurchase-list':
                return <PurchaseGrid {...commonProps} />;
            case 'Supplier-list':
                return <SupplierGrid {...commonProps} />;
            case 'purchase-return-list':
                return <PurchaseReturnGrid {...commonProps} />;
            case 'Supplier-due-payment-list':
                return <SupplierDuePaymentGrid {...commonProps} />;
            default:
                return <PurchaseGrid {...commonProps} />;
        }
    };

    return (
        <ModuleShell
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={(tabId) => {
                setActiveTab(tabId);
                setSearchQuery("");
                setFilters({});
                setStats([]);
            }}
            basePath="/purchase"
            onAdd={() => setIsAddOpen(true)}
            viewType={viewType}
            setViewType={setViewType}
            stats={stats}
            onSearch={setSearchQuery}
            onFilter={setFilters}
            searchPlaceholder={filterConfig.searchPlaceholder}
            filtersConfig={filterConfig.filtersConfig}
            advancedConfig={filterConfig.advancedConfig}
        >
            {isRootPath ? renderTabContent() : <Outlet />}
        </ModuleShell>
    );
};

export default Purchase;