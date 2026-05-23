import React, {useState} from 'react';
import PurchaseList from './PurchaseList';
import AddPurchase from './AddPurchase';
import Suppliers from './Suppliers';
import EmployeeGrid from "./EmployeeList/EmployeeGrid";
import EmployeeSalaryAdvanceGrid from "./EmployeeSalaryAdvance/EmployeeSalaryAdvanceGrid";
import EmployeeLoanGrid from "./EmployeeLoan/EmployeeLoanGrid";
import EmployeeLeaveApplicationGrid from "./EmployeeLeaveApplication/EmployeeLeaveApplicationGrid";
import EmployeeSalaryPayslipGrid from "./EmployeeSalaryPayslip/EmployeeSalaryPayslipGrid";
import EmployeeAttendanceGrid from "./EmployeeAttendance/EmployeeAttendanceGrid";
import {ChevronDown, FileSpreadsheet, FileText, LayoutGrid, List, Plus, RefreshCw} from "lucide-react";

const HRM = () => {
    // const [activeSection, setActiveSection] = useState('employee_list');
    const [activeTab, setActiveTab] = useState('employee_list');
    const [viewType, setViewType] = useState('grid');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isActionOpen, setIsActionOpen] = useState(false);
    // const menuItems = [
    const tabs = [
        {id: 'employee_list', name: 'Employee List', icon: '📋'},
        {id: 'attendance', name: 'Attendances', icon: '📋', addLabel: 'Add attendance'},
        {id: 'holydays', name: 'Holydays/Off Day', icon: '📋'},
        {id: 'salary_payslip', name: 'Payslip/salary', icon: '➕'},
        {id: 'salary_advance', name: 'Salary Advance', icon: '➕'},
        {id: 'employee_loan', name: 'Employee Loan', icon: '➕'},
        {id: 'leave_applications', name: 'Leave Application', icon: '➕'},
    ];

    const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];


    // const renderContent = () => {
    const renderTabContent = () => {

        const commonProps = {
            viewType,
            isAddOpen,
            setIsAddOpen,
        };
        // switch (activeSection) {
        switch (activeTab) {
            case 'employee_list':
                // return <Suppliers />;
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
                return <Suppliers/>;
            case 'attendance':
                return <EmployeeAttendanceGrid {...commonProps} />;
            case 'leave_applications':
                return <EmployeeLeaveApplicationGrid {...commonProps} />;
            default:
                return <EmployeeGrid {...commonProps} />;
        }
    };


    // return (
    //     <div className="h-full flex flex-col bg-gray-50">
    //
    //         {/* 🔥 Top Tabs */}
    //         <div className="bg-white border-b px-3 py-2">
    //             <div className="flex gap-2 overflow-x-auto">
    //
    //                 {tabs.map((tab) => (
    //                     <button
    //                         key={tab.id}
    //                         onClick={() => setActiveTab(tab.id)}
    //                         className={`px-4 py-1.5 text-sm rounded-md whitespace-nowrap transition
    //
    //           ${
    //                             activeTab === tab.id
    //                                 ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
    //                                 : "text-gray-600 hover:bg-gray-100"
    //                         }`}
    //                     >
    //                         {tab.name}
    //                     </button>
    //                 ))}
    //
    //             </div>
    //         </div>
    //
    //         {/* 🔥 Content */}
    //         <div className="flex-1 p-2 overflow-auto">
    //             <div className="bg-white rounded-md shadow-sm p-2">
    //                 {renderTabContent()}
    //             </div>
    //         </div>
    //
    //     </div>
    // );


    return (
        <div className="h-full flex flex-col bg-gray-50">

            {/* 🔥 Top Navigation Bar (ট্যাব বেশি হলে ভেঙে নিচে নামবে, বাটন পজিশন ঠিক থাকবে) */}
            <div
                className="bg-white border-b px-4 py-3 flex flex-col md:flex-row md:items-start md:justify-between sticky top-0 z-30 shadow-sm gap-4">

                {/* Left: Tabs Loop Container (`flex-wrap` ব্যবহারের কারণে স্ক্রলবার লাগবে না, অটো নিচে নামবে) */}
                <div className="flex flex-wrap gap-2 flex-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setIsAddOpen(false);
                            }}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2
                                ${activeTab === tab.id
                                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100 bg-gray-50"
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </div>

                {/* Right: Dynamic Actions Group (কখনোই ভাঙবে না বা সাইজ ছোট হবে name) */}
                <div className="flex items-center gap-3 flex-shrink-0 self-end md:self-start">
                    {/* Primary Add Button */}
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
                    >
                        <Plus size={18}/>
                        {currentTab.addLabel}
                    </button>

                    {/* Actions Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsActionOpen(!isActionOpen)}
                            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm"
                        >
                            <ChevronDown size={16}
                                         className={`transition-transform duration-200 ${isActionOpen ? 'rotate-180' : ''}`}/>
                        </button>

                        {isActionOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsActionOpen(false)}></div>
                                <div
                                    className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in duration-200">
                                    {/* Mobile only Add button */}
                                    <button
                                        onClick={() => {
                                            setIsAddOpen(true);
                                            setIsActionOpen(false);
                                        }}
                                        className="sm:hidden flex items-center gap-3 w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 font-semibold border-b"
                                    >
                                        <Plus size={18}/>
                                        {currentTab.addLabel}
                                    </button>

                                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        View Mode
                                    </div>
                                    <button
                                        onClick={() => {
                                            setViewType('grid');
                                            setIsActionOpen(false);
                                        }}
                                        className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${viewType === 'grid' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <LayoutGrid size={18}/>
                                        Grid View
                                    </button>
                                    <button
                                        onClick={() => {
                                            setViewType('list');
                                            setIsActionOpen(false);
                                        }}
                                        className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${viewType === 'list' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <List size={18}/>
                                        List View
                                    </button>

                                    <div className="my-1 border-t border-gray-100"></div>
                                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Export Data
                                    </div>
                                    <button
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                        <FileText size={18} className="text-red-500"/>
                                        Export as PDF
                                    </button>
                                    <button
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                        <FileSpreadsheet size={18} className="text-green-600"/>
                                        Export as Excel
                                    </button>

                                    <div className="my-1 border-t border-gray-100"></div>
                                    <button
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                        <RefreshCw size={18} className="text-blue-500"/>
                                        Refresh List
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 🔥 Content */}
            <div className="flex-1 p-2 overflow-auto">
                <div className="bg-white rounded-md shadow-sm p-2">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );

};

export default HRM;