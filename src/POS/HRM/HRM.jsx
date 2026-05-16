import React, {useState, useEffect} from 'react';
import PurchaseList from './PurchaseList';
import AddPurchase from './AddPurchase';
import Suppliers from './Suppliers';
import EmployeeGrid from "./EmployeeList/EmployeeGrid";
import EmployeeSalaryAdvanceGrid from "./EmployeeSalaryAdvance/EmployeeSalaryAdvanceGrid";
import EmployeeLoanGrid from "./EmployeeLoan/EmployeeLoanGrid";
import EmployeeLeaveApplicationGrid from "./EmployeeLeaveApplication/EmployeeLeaveApplicationGrid";
import EmployeeSalaryPayslipGrid from "./EmployeeSalaryPayslip/EmployeeSalaryPayslipGrid";
import EmployeeAttendanceGrid from "./EmployeeAttendance/EmployeeAttendanceGrid";
import { useNavbar } from '../../context_or_provider/pos/NavbarContext';

const HRM = () => {
    const [activeTab, setActiveTab] = useState('employee_list');
    const { updateNavbar, resetNavbar } = useNavbar();

    const tabs = [
        {id: 'employee_list', name: 'Employees', icon: '👥'},
        {id: 'attendance', name: 'Attendance', icon: '📅'},
        {id: 'salary_payslip', name: 'Payslip', icon: '💰'},
        {id: 'salary_advance', name: 'Advance', icon: '💸'},
        {id: 'employee_loan', name: 'Loans', icon: '🏦'},
        {id: 'leave_applications', name: 'Leaves', icon: '📝'},
    ];

    useEffect(() => {
        updateNavbar({
            title: 'HRM MANAGEMENT',
            subtitle: 'Employee records, attendance and payroll',
            extraActions: (
                <div className="flex flex-wrap items-center gap-1.5 bg-gray-50 p-1 rounded-xl shadow-sm border border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`flex items-center px-3 py-1.5 text-[9px] font-bold rounded-lg transition-all duration-200 whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="mr-1">{tab.icon}</span>
                            {tab.name.toUpperCase()}
                        </button>
                    ))}
                </div>
            )
        });
        return () => resetNavbar();
    }, [activeTab]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'employee_list': return <EmployeeGrid/>;
            case 'salary_payslip': return <EmployeeSalaryPayslipGrid/>;
            case 'salary_advance': return <EmployeeSalaryAdvanceGrid/>;
            case 'employee_loan': return <EmployeeLoanGrid/>;
            case 'attendance': return <EmployeeAttendanceGrid/>;
            case 'leave_applications': return <EmployeeLeaveApplicationGrid/>;
            default: return <EmployeeGrid/>;
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Content Area */}
            <div className="p-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default HRM;

