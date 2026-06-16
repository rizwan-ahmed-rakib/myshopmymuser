import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ModuleShell from '../components/ModuleShell';
import DamageStockGrid from "./DamageProductList/DamageStockGrid";
import BarcodeQRList from './BarcodeQRList';
import ProducLowstocktGrid from "./LowStock/ProducLowstocktGrid";
import ExpiredProducts from "./Expeired products/ExpiredProducts";

/**
 * Stock Module - Parent container for Stock, Damages, Low Stock, Barcodes, and Expired products.
 * Refactored to use ModuleShell for consistent navigation and unified backbone logic.
 */
const Stock = () => {
    const [activeTab, setActiveTab] = useState('Damage');
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
    const isRootPath = location.pathname === '/stock' || location.pathname === '/stock/';

    const tabs = [
        { id: 'Damage', name: 'Damages', icon: '⚠️', addLabel: 'Record Damage' },
        { id: 'Low_stocks', name: 'Low Stocks', icon: '📉', addLabel: 'Restock' },
        { id: 'Print_Barcode', name: 'Barcodes', icon: '🏷️', addLabel: 'Generate' },
        { id: 'Print_QRrcode', name: 'QR Codes', icon: '📱', addLabel: 'Generate' },
        { id: 'Expired_products', name: 'Expired', icon: '⌛', addLabel: 'Manage' },
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
            case 'Damage':
                return <DamageStockGrid {...commonProps} />;
            case 'Low_stocks':
                return <ProducLowstocktGrid {...commonProps} />;
            case 'Print_Barcode':
                return <BarcodeQRList type="barcode" {...commonProps} />;
            case 'Print_QRrcode':
                return <BarcodeQRList type="qr" {...commonProps} />;
            case 'Expired_products':
                return <ExpiredProducts type="expire" {...commonProps} />;
            default:
                return <DamageStockGrid {...commonProps} />;
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
            basePath="/stock"
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

export default Stock;