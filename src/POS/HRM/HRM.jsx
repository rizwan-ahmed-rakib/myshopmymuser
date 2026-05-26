import React, { useState } from 'react';
import ModuleShell from '../components/ModuleShell';
import PurchaseList from './PurchaseList';
import AddPurchase from './AddPurchase';
import Suppliers from './Suppliers';
import EmployeeGrid from "./EmployeeList/EmployeeGrid";
import EmployeeSalaryAdvanceGrid from "./EmployeeSalaryAdvance/EmployeeSalaryAdvanceGrid";
import EmployeeLoanGrid from "./EmployeeLoan/EmployeeLoanGrid";
import EmployeeLeaveApplicationGrid from "./EmployeeLeaveApplication/EmployeeLeaveApplicationGrid";
import EmployeeSalaryPayslipGrid from "./EmployeeSalaryPayslip/EmployeeSalaryPayslipGrid";
import EmployeeAttendanceGrid from "./EmployeeAttendance/EmployeeAttendanceGrid";

/**
 * HRM Module - Acts as the parent container for all Human Resource management features.
 * Uses ModuleShell as a backbone for layout, navigation, stats, and universal filtering.
 */
const HRM = () => {
    const [activeTab, setActiveTab] = useState('employee_list');
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

    // Keep all menu items / tabs as originally defined, keeping their icons and addLabels intact
    const tabs = [
        { id: 'employee_list', name: 'Employee List', icon: '📋', addLabel: 'Add Employee' },
        { id: 'attendance', name: 'Attendances', icon: '📋', addLabel: 'Add attendance' },
        { id: 'salary_payslip', name: 'Payslip/salary', icon: '➕', addLabel: 'Add Payslip/salary' },
        { id: 'salary_advance', name: 'Salary Advance', icon: '➕', addLabel: 'Add Salary Advance' },
        { id: 'employee_loan', name: 'Employee Loan', icon: '➕', addLabel: 'Add Employee Loan' },
        { id: 'leave_applications', name: 'Leave Application', icon: '➕', addLabel: 'Add Leave Application' },
    ];

    // Maintain identical switch-case rendering to ensure zero functional regressions
    const renderTabContent = () => {
        const commonProps = {
            viewType,
            isAddOpen,
            setIsAddOpen,
            onStatsLoaded: setStats,
            // Pass search/filter state down
            searchQuery,
            filters,
            setFilterConfig, // Let sub-modules provide their config
        };

        switch (activeTab) {
            case 'employee_list':
                return <EmployeeGrid {...commonProps} />;
            case 'purchase-list':
                return <PurchaseList {...commonProps} />;
            case 'add-purchase':
                return <AddPurchase {...commonProps} />;
            case 'salary_payslip':
                return <EmployeeSalaryPayslipGrid {...commonProps} />;
            case 'salary_advance':
                return <EmployeeSalaryAdvanceGrid {...commonProps} />;
            case 'employee_loan':
                return <EmployeeLoanGrid {...commonProps} />;
            case 'suppliers':
                return <Suppliers />;
            case 'attendance':
                return <EmployeeAttendanceGrid {...commonProps} />;
            case 'leave_applications':
                return <EmployeeLeaveApplicationGrid {...commonProps} />;
            default:
                return <EmployeeGrid {...commonProps} />;
        }
    };

    return (
        <ModuleShell
            // title="HRM Module"
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={(tabId) => {
                setActiveTab(tabId);
                // Reset search/filter when changing tabs for fresh state
                setSearchQuery("");
                setFilters({});
                setStats([]); // Clear stats to prevent flicker from old tab
            }}
            basePath="/hrm"
            onAdd={() => setIsAddOpen(true)}
            viewType={viewType}
            setViewType={setViewType}
            stats={stats}
            // Search & Filter Integration
            onSearch={setSearchQuery}
            onFilter={setFilters}
            searchPlaceholder={filterConfig.searchPlaceholder}
            filtersConfig={filterConfig.filtersConfig}
            advancedConfig={filterConfig.advancedConfig}
        >
            {renderTabContent()}
        </ModuleShell>
    );
};

export default HRM;
