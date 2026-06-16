import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ModuleShell from '../components/ModuleShell';
import SaleGrid from "./SaleProduct/SaleGrid";
import CustomerGrid from "./CustomerList/CustomerGrid";
import SaleReturnGrid from "./SaleReturn/SaleReturnGrid";
import CustomerDueCollectionGrid from "./CustomerDueCollection/CustomerDueCollectionGrid";

/**
 * Sales Module - Acts as the parent container for all Sales-related features.
 * Refactored to use ModuleShell as a backbone for layout, navigation, stats, and universal filtering.
 */
const Sales = () => {
    const [activeTab, setActiveTab] = useState('sales');
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
    const isRootPath = location.pathname === '/sales' || location.pathname === '/sales/';

    const tabs = [
        { id: 'sales', name: 'Sales', icon: '💰', addLabel: 'New Sale' },
        { id: 'sales-return', name: 'Sale Return', icon: '↩️', addLabel: 'Add Return' },
        { id: 'customers', name: 'Customer', icon: '👥', addLabel: 'Add Customer' },
        { id: 'customers-due-collection', name: 'Due Collection', icon: '📥', addLabel: 'Collect Due' },
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
            case 'sales':
                return <SaleGrid {...commonProps} />;
            case 'customers':
                return <CustomerGrid {...commonProps} />;
            case 'sales-return':
                return <SaleReturnGrid {...commonProps} />;
            case 'customers-due-collection':
                return <CustomerDueCollectionGrid {...commonProps} />;
            default:
                return <SaleGrid {...commonProps} />;
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
            basePath="/sales"
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

export default Sales;