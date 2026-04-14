//////////////////nav bar code ////////////////////////

// // myshopPages/Inventory.jsx
// import React, {useState} from 'react';
// import PurchaseList from './PurchaseList';
// import AddPurchase from './AddPurchase';
// import Suppliers from './Suppliers';
// import EmployeeGrid from "./EmployeeList/EmployeeGrid";
// import EmployeeSalaryAdvanceGrid from "./EmployeeSalaryAdvance/EmployeeSalaryAdvanceGrid";
//
// const HRM = () => {
//     // const [activeSection, setActiveSection] = useState('employee_list');
//     const [activeTab, setActiveTab] = useState('sales');
//
//     // const menuItems = [
//     const tabs = [
//         {id: 'employee_list', name: 'Employee List', icon: '📋'},
//         {id: 'attendance', name: 'Attendances', icon: '📋'},
//         {id: 'holydays', name: 'Holydays/Off Day', icon: '📋'},
//         {id: 'salary_payslip', name: 'Payslip/salary', icon: '➕'},
//         {id: 'salary_advance', name: 'Salary Advance', icon: '➕'},
//         {id: 'employee_loan', name: 'Employee Loan', icon: '➕'},
//         {id: 'leave_applications', name: 'Leave Application', icon: '➕'},
//     ];
//
//     // const renderContent = () => {
//     const renderTabContent = () => {
//         // switch (activeSection) {
//             switch (activeTab) {
//             case 'employee_list':
//                 // return <Suppliers />;
//                 return <EmployeeGrid/>;
//             case 'purchase-list':
//                 return <PurchaseList/>;
//             case 'add-purchase':
//                 return <AddPurchase/>;
//             case 'salary_payslip':
//                 return <Suppliers/>;
//             case 'salary_advance':
//                 return <EmployeeSalaryAdvanceGrid/>;
//             case 'employee_loan':
//                 return <Suppliers/>;
//             case 'suppliers':
//                 return <Suppliers/>;
//             case 'attendance':
//                 return <Suppliers/>;
//             default:
//                 return <EmployeeGrid/>;
//         }
//     };
//
//
//     // for side bar code ///////////////
//
//     // return (
//     //     <div className="flex h-full bg-gray-50">
//     //         {/* Side Menu */}
//     //         <div className="w-64 bg-white shadow-lg">
//     //             <div className="p-4 border-b">
//     //                 <h2 className="text-lg font-bold text-gray-800">Purchase Management</h2>
//     //             </div>
//     //             <nav className="p-4">
//     //                 <ul className="space-y-2">
//     //                     {menuItems.map((item) => (
//     //                         <li key={item.id}>
//     //                             <button
//     //                                 onClick={() => setActiveSection(item.id)}
//     //                                 className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
//     //                                     activeSection === item.id
//     //                                         ? 'bg-blue-500 text-white'
//     //                                         : 'text-gray-700 hover:bg-gray-100'
//     //                                 }`}
//     //                             >
//     //                                 <span className="mr-3 text-lg">{item.icon}</span>
//     //                                 <span className="font-medium">{item.name}</span>
//     //                             </button>
//     //                         </li>
//     //                     ))}
//     //                 </ul>
//     //             </nav>
//     //         </div>
//     //
//     //         {/* Main Content */}
//     //         <div className="flex-1 p-6 overflow-auto">
//     //             <div className="bg-white rounded-lg shadow-md">
//     //                 {renderContent()}
//     //             </div>
//     //         </div>
//     //     </div>
//     // );
//
//
//     ////////// for nav bar code ////////////////
//
//      return (
//       <div className="p-6">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">Sales Management</h1>
//           <p className="text-gray-600">Manage all sales activities</p>
//         </div>
//
//         {/* Tabs */}
//         <div className="bg-white rounded-lg shadow-md mb-6">
//           <div className="flex border-b">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 className={`flex items-center px-6 py-4 font-medium border-b-2 transition-colors ${
//                   activeTab === tab.id
//                     ? 'border-blue-500 text-blue-600 bg-blue-50'
//                     : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//                 onClick={() => setActiveTab(tab.id)}
//               >
//                 <span className="mr-2 text-lg">{tab.icon}</span>
//                 {tab.name}
//               </button>
//             ))}
//           </div>
//         </div>
//
//         {/* Tab Content */}
//         <div className="bg-white rounded-lg shadow-md">
//           {renderTabContent()}
//         </div>
//       </div>
//     );
//
// };
//
// export default HRM;




/////////////////////////// sidebar code ////////////

// myshopPages/Inventory.jsx
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

const HRM = () => {
    const [activeSection, setActiveSection] = useState('employee_list');
    // const [activeTab, setActiveTab] = useState('sales');

    const menuItems = [
    // const tabs = [
        {id: 'employee_list', name: 'Employee List', icon: '📋'},
        {id: 'attendance', name: 'Attendances', icon: '📋'},
        {id: 'holydays', name: 'Holydays/Off Day', icon: '📋'},
        {id: 'salary_payslip', name: 'Payslip/salary', icon: '➕'},
        {id: 'salary_advance', name: 'Salary Advance', icon: '➕'},
        {id: 'employee_loan', name: 'Employee Loan', icon: '➕'},
        {id: 'leave_applications', name: 'Leave Application', icon: '➕'},
    ];

    const renderContent = () => {
    // const renderTabContent = () => {
        switch (activeSection) {
        //     switch (activeTab) {
            case 'employee_list':
                // return <Suppliers />;
                return <EmployeeGrid/>;
            case 'purchase-list':
                return <PurchaseList/>;
            case 'add-purchase':
                return <AddPurchase/>;
            case 'salary_payslip':
                return <EmployeeSalaryPayslipGrid/>;
            case 'salary_advance':
                return <EmployeeSalaryAdvanceGrid/>;
            case 'employee_loan':
                return <EmployeeLoanGrid/>;
            case 'suppliers':
                return <Suppliers/>;
            case 'attendance':
                return <EmployeeAttendanceGrid/>;
            case 'leave_applications':
                return <EmployeeLeaveApplicationGrid/>;
            default:
                return <EmployeeGrid/>;
        }
    };


    // for side bar code ///////////////

    return (
        <div className="flex h-full bg-gray-50">
            {/* Side Menu */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">Purchase Management</h2>
                </div>
                <nav className="p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                                        activeSection === item.id
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    <span className="font-medium">{item.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
                <div className="bg-white rounded-lg shadow-md">
                    {renderContent()}
                </div>
            </div>
        </div>
    );


    ////////// for nav bar code ////////////////

    //  return (
    //   <div className="p-6">
    //     {/* Header */}
    //     <div className="mb-6">
    //       <h1 className="text-3xl font-bold text-gray-800">Sales Management</h1>
    //       <p className="text-gray-600">Manage all sales activities</p>
    //     </div>
    //
    //     {/* Tabs */}
    //     <div className="bg-white rounded-lg shadow-md mb-6">
    //       <div className="flex border-b">
    //         {tabs.map((tab) => (
    //           <button
    //             key={tab.id}
    //             className={`flex items-center px-6 py-4 font-medium border-b-2 transition-colors ${
    //               activeTab === tab.id
    //                 ? 'border-blue-500 text-blue-600 bg-blue-50'
    //                 : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    //             }`}
    //             onClick={() => setActiveTab(tab.id)}
    //           >
    //             <span className="mr-2 text-lg">{tab.icon}</span>
    //             {tab.name}
    //           </button>
    //         ))}
    //       </div>
    //     </div>
    //
    //     {/* Tab Content */}
    //     <div className="bg-white rounded-lg shadow-md">
    //       {renderTabContent()}
    //     </div>
    //   </div>
    // );

};

export default HRM;