// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import BASE_URL_of_POS from "../../../posConfig";
// import SuccessPopup from "./SuccessPopup";
// import UpdateDamageStockModal from "./UpdateDamageStockModal";
// import { FaBoxOpen, FaDollarSign, FaWarehouse, FaTag, FaInfoCircle, FaCalendarAlt, FaExclamationTriangle, FaUser, FaBuilding, FaClipboardList } from 'react-icons/fa';
//
// const DamageStockDetailsPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [record, setRecord] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//     const [successMessage, setSuccessMessage] = useState("");
//
//     const fetchDamageDetails = useCallback(async () => {
//         try {
//             const response = await axios.get(`${BASE_URL_of_POS}/api/products/damage-stock/${id}/`);
//             setRecord(response.data);
//         } catch (error) {
//             console.error("Error fetching damage record details:", error);
//         } finally {
//             setLoading(false);
//         }
//     }, [id]);
//
//     useEffect(() => {
//         fetchDamageDetails();
//     }, [fetchDamageDetails]);
//
//     const handleUpdateSuccess = (updatedData) => {
//         setRecord(prev => ({ ...prev, ...updatedData }));
//         setShowEditModal(false);
//         setSuccessMessage("Damage record has been updated successfully!");
//         setShowSuccessPopup(true);
//     };
//
//     const formatCurrency = (amount) => {
//         return new Intl.NumberFormat('en-US', {
//             style: 'currency',
//             currency: 'BDT',
//         }).format(amount || 0).replace('BDT', '৳');
//     };
//
//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                     <p className="mt-4 text-gray-700">Loading damage record details...</p>
//                 </div>
//             </div>
//         );
//     }
//
//     if (!record) {
//         return (
//             <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//                 <div className="text-center p-8 bg-white rounded-lg shadow-md">
//                     <h2 className="text-2xl font-bold text-gray-800 mb-4">Record Not Found</h2>
//                     <button
//                         onClick={() => navigate("/stock")}
//                         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                         Back to List
//                     </button>
//                 </div>
//             </div>
//         );
//     }
//
//     const InfoCard = ({ icon, title, value, className = "" }) => (
//         <div className={`bg-white rounded-lg p-4 shadow-sm flex items-center ${className}`}>
//             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
//                 {icon}
//             </div>
//             <div>
//                 <p className="text-sm text-gray-600">{title}</p>
//                 <p className="font-semibold text-lg text-gray-900">{value}</p>
//             </div>
//         </div>
//     );
//
//     return (
//         <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-7xl mx-auto">
//                 <div className="mb-6 flex justify-between items-center">
//                     <button
//                         onClick={() => navigate("/stock")}
//                         className="flex items-center text-gray-600 hover:text-blue-700 font-medium"
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
//                         </svg>
//                         Back to List
//                     </button>
//                     <button
//                         onClick={() => setShowEditModal(true)}
//                         className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                             <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//                         </svg>
//                         Edit
//                     </button>
//                 </div>
//
//                 <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//                     <div className="p-8">
//                         <h1 className="text-3xl font-bold text-gray-900 mb-6">Detailed Damage Information</h1>
//
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                             {/* Inventory Information */}
//                             <div className="space-y-6">
//                                 <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
//                                     <FaWarehouse className="text-blue-500" /> Inventory Information
//                                 </h2>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                     <InfoCard icon={<FaTag className="text-indigo-500" />} title="Damage Record ID" value={record.id} />
//                                     <InfoCard icon={<FaBoxOpen className="text-blue-500" />} title="Type" value={record.damage_type === 'returnable' ? 'Returnable' : 'Non-Returnable'} />
//                                     <InfoCard icon={<FaClipboardList className="text-yellow-500" />} title="Quantity" value={`${record.quantity} pcs`} />
//                                     <InfoCard icon={<FaCalendarAlt className="text-purple-500" />} title="Date" value={new Date(record.created_at).toLocaleDateString('en-US')} />
//                                 </div>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                     <InfoCard icon={<FaDollarSign className="text-green-500" />} title="Unit Cost" value={formatCurrency(record.unit_cost)} />
//                                     <InfoCard icon={<FaExclamationTriangle className="text-red-500" />} title="Total Financial Loss" value={formatCurrency(record.total_loss)} />
//                                 </div>
//                             </div>
//
//                             {/* Entity Information */}
//                             <div className="space-y-6">
//                                 <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
//                                     <FaUser className="text-blue-500" /> Customer & Supplier Information
//                                 </h2>
//                                 <div className="space-y-4">
//                                     <div className="p-4 bg-gray-50 rounded-lg">
//                                         <p className="text-sm text-gray-600 mb-1 font-bold">Customer Information</p>
//                                         <p className="text-gray-900 font-medium">{record.customer_name || 'N/A'}</p>
//                                     </div>
//                                     <div className="p-4 bg-gray-50 rounded-lg">
//                                         <p className="text-sm text-gray-600 mb-1 font-bold">Supplier Information</p>
//                                         <p className="text-gray-900 font-medium">{record.supplier_name || 'N/A'}</p>
//                                     </div>
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         <div className="p-4 bg-gray-50 rounded-lg">
//                                             <p className="text-sm text-gray-600 mb-1 font-bold">Compensated</p>
//                                             <p className={`font-bold ${record.is_compensated ? 'text-green-600' : 'text-red-600'}`}>
//                                                 {record.is_compensated ? formatCurrency(record.compensated_amount) : '0.00'}
//                                             </p>
//                                         </div>
//                                         <div className="p-4 bg-gray-50 rounded-lg">
//                                             <p className="text-sm text-gray-600 mb-1 font-bold">Pending Compensation</p>
//                                             <p className="text-red-600 font-bold">
//                                                 {formatCurrency(record.total_loss - (record.compensated_amount || 0))}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//
//                         {/* Additional Notes & Reason */}
//                         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
//                             <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
//                                 <h3 className="text-lg font-bold text-gray-800 mb-3">Reason</h3>
//                                 <p className="text-gray-700 whitespace-pre-wrap">{record.reason || 'No reason provided'}</p>
//                             </div>
//                             <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
//                                 <h3 className="text-lg font-bold text-gray-800 mb-3">Notes</h3>
//                                 <p className="text-gray-700 whitespace-pre-wrap">{record.notes || 'No notes'}</p>
//                                 <div className="mt-4 pt-4 border-t border-gray-200">
//                                     <p className="text-sm text-gray-600 font-bold">Reference No: <span className="text-gray-900 font-normal">{record.reference_no || 'N/A'}</span></p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             {showEditModal && (
//                 <UpdateDamageStockModal
//                     isOpen={showEditModal}
//                     onClose={() => setShowEditModal(false)}
//                     onSuccess={handleUpdateSuccess}
//                     recordData={record}
//                 />
//             )}
//
//             {showSuccessPopup && (
//                 <SuccessPopup
//                     message={successMessage}
//                     onClose={() => setShowSuccessPopup(false)}
//                 />
//             )}
//         </div>
//     );
// };
//
// export default DamageStockDetailsPage;



import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";
import SuccessPopup from "./SuccessPopup";
import UpdateDamageStockModal from "./UpdateDamageStockModal";
import { FaBoxOpen, FaDollarSign, FaWarehouse, FaTag, FaInfoCircle, FaCalendarAlt, FaExclamationTriangle, FaUser, FaBuilding, FaClipboardList, FaArrowLeft, FaEdit } from 'react-icons/fa';

const DamageStockDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const fetchDamageDetails = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL_of_POS}/api/products/damage-stock/${id}/`);
            setRecord(response.data);
        } catch (error) {
            console.error("Error fetching damage record details:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDamageDetails();
    }, [fetchDamageDetails]);

    const handleUpdateSuccess = (updatedData) => {
        setRecord(prev => ({ ...prev, ...updatedData }));
        setShowEditModal(false);
        setSuccessMessage("Damage record has been updated successfully!");
        setShowSuccessPopup(true);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
        }).format(amount || 0).replace('BDT', '৳');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading damage record details...</p>
            </div>
        );
    }

    if (!record) {
        return (
            <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <FaExclamationTriangle className="mx-auto text-yellow-400 text-5xl mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Record Not Found</h2>
                <button
                    onClick={() => navigate("/stock")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                >
                    <FaArrowLeft /> Back to List
                </button>
            </div>
        );
    }

    const InfoCard = ({ icon, title, value, className = "" }) => (
        <div className={`bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center ${className}`}>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm text-gray-600">
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{title}</p>
                <p className="font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Actions */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <button
                    onClick={() => navigate("/stock")}
                    className="flex items-center text-gray-500 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-colors"
                >
                    <FaArrowLeft className="mr-2"/> Back to Damages
                </button>
                <button
                    onClick={() => setShowEditModal(true)}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white flex items-center gap-2 font-bold text-sm transition-all border border-blue-100"
                >
                    <FaEdit /> Edit Record
                </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Product Hero Section */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest mb-2">
                                <FaTag /> Product Detail
                            </div>
                            <h1 className="text-3xl font-black">{record.product_name || "Unknown Product"}</h1>
                            <p className="text-gray-400 font-medium mt-1 italic">SKU/Code: {record.product_code || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-tighter shadow-lg ${record.damage_type === 'returnable' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                {record.damage_type === 'returnable' ? 'Returnable' : 'Non-Returnable'}
                            </span>
                            <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-tighter shadow-lg ${record.is_compensated ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-gray-900'}`}>
                                {record.is_compensated ? 'Compensated' : 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Damage Info Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2 border-b pb-2">
                                <FaExclamationTriangle className="text-red-500" /> Damage & Loss Details
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InfoCard icon={<FaClipboardList className="text-indigo-500" />} title="Quantity" value={`${record.quantity} pcs`} />
                                <InfoCard icon={<FaCalendarAlt className="text-purple-500" />} title="Damage Date" value={new Date(record.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })} />
                                <InfoCard icon={<FaDollarSign className="text-green-500" />} title="Unit Cost" value={formatCurrency(record.unit_cost)} />
                                <InfoCard icon={<FaWarehouse className="text-orange-500" />} title="Total Loss" value={formatCurrency(record.total_loss)} className="bg-red-50 border-red-100" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <FaInfoCircle /> Primary Reason
                                    </h3>
                                    <p className="text-gray-700 font-medium leading-relaxed">{record.reason || 'No specific reason provided.'}</p>
                                </div>
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <FaInfoCircle /> Additional Notes
                                    </h3>
                                    <p className="text-gray-700 font-medium leading-relaxed">{record.notes || 'No extra notes.'}</p>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Reference Number: <span className="text-gray-900">{record.reference_no || 'MANUAL-ENTRY'}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stakeholder Column */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2 border-b pb-2">
                                <FaUser className="text-blue-500" /> Stakeholders
                            </h2>

                            <div className="space-y-4">
                                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer</p>
                                    <p className="text-gray-900 font-bold flex items-center gap-2">
                                        <FaUser className="text-gray-400 text-xs" /> {record.customer_name || 'Walk-in Customer'}
                                    </p>
                                </div>

                                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-green-200 transition-colors">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Supplier</p>
                                    <p className="text-gray-900 font-bold flex items-center gap-2">
                                        <FaBuilding className="text-gray-400 text-xs" /> {record.supplier_name || 'Internal / Unknown'}
                                    </p>
                                </div>

                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-3">Financial Status</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Compensated:</span>
                                            <span className={`font-bold ${record.is_compensated ? 'text-green-600' : 'text-gray-400'}`}>
                                                {formatCurrency(record.compensated_amount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Net Loss:</span>
                                            <span className="font-black text-red-600">
                                                {formatCurrency(record.total_loss - (record.compensated_amount || 0))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showEditModal && (
                <UpdateDamageStockModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleUpdateSuccess}
                    recordData={record}
                />
            )}

            {showSuccessPopup && (
                <SuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccessPopup(false)}
                />
            )}
        </div>
    );
};

export default DamageStockDetailsPage;
