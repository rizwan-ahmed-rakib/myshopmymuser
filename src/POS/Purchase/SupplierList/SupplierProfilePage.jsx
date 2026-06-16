import React, {useState, useEffect, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import { 
    FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
    FaCalendarAlt, FaIdCard, FaWallet, FaInfoCircle,
    FaEdit, FaTrash, FaUndo
} from "react-icons/fa";
import api from '../../../context_or_provider/pos/posApi';

import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import UpdateEmployeeProfileModal from "./UpdateProfileModal";
import UpdateProfileSuccessPopup from "./UpdateProfileSuccessPopup";
import { posSupplierAPI } from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";

/**
 * SupplierProfilePage - Refactored to use GenericModuleDetails and DetailsInfoCard.
 * Standardized profile view for Suppliers.
 */
const SupplierProfilePage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const fetchEmployeeProfile = useCallback(async () => {
        try {
            const response = await api.get(`/api/purchase/suppliers/${id}/`);
            setEmployee(response.data);
        } catch (error) {
            console.error("Error fetching supplier profile:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchEmployeeProfile();
    }, [fetchEmployeeProfile]);

    const handleUpdateSuccess = (updatedData) => {
        setEmployee(prev => ({...prev, ...updatedData}));
        setShowEditModal(false);
        setSuccessMessage("Supplier profile has been updated successfully!");
        setShowSuccessPopup(true);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${employee?.name}?`)) return;
        try {
            await posSupplierAPI.delete(id);
            alert("Supplier deleted successfully!");
            navigate("/purchase");
        } catch (error) {
            console.error(error);
            alert("Failed to delete the supplier.");
        }
    };

    const due = parseFloat(employee?.due_amount || 0);

    return (
        <GenericModuleDetails
            title="Supplier Profile"
            subtitle={employee?.name}
            image={employee?.image}
            imageAlt={employee?.name}
            imageFallback="https://via.placeholder.com/150"
            recordId={employee?.id}
            amount={Math.abs(due).toLocaleString()}
            amountLabel={due >= 0 ? "Total Payable Balance" : "Total Receivable Balance"}
            isLoading={loading}
            onEdit={() => setShowEditModal(true)}
            editText="Edit Profile"
            accentColor="purple"
            infoItems={[
                {
                    icon: <FaCalendarAlt />,
                    label: "Joined Since",
                    value: new Date(employee?.created_at).toLocaleDateString()
                },
                { icon: <FaIdCard />, label: "Supplier ID", value: `#${employee?.id}` }
            ]}
            actions={[
                {
                    icon: <FaTrash size={16} />,
                    label: "Delete Supplier",
                    onClick: handleDelete,
                    hoverColor: "hover:bg-red-600 hover:text-white"
                }
            ]}
        >
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info Cards */}
                    <div className="grid sm:grid-cols-3 gap-6">
                        <DetailsInfoCard variant="simple" title="Account Status"
                                         value={employee?.user?.is_active !== false ? "Active" : "Inactive"}
                                         icon={<FaInfoCircle />} color={employee?.user?.is_active !== false ? "emerald" : "rose"}/>
                        <DetailsInfoCard variant="simple" title="Primary Phone"
                                         value={employee?.phone || "N/A"}
                                         icon={<FaPhone />} color="blue"/>
                        <DetailsInfoCard variant="simple" title="Department"
                                         value={employee?.department || "N/A"}
                                         icon={<FaInfoCircle />} color="indigo"/>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-10">
                            <div className="w-2 h-10 bg-purple-600 rounded-full shadow-lg shadow-purple-500/20"></div>
                            Contact & Identity
                        </h2>

                        <div className="grid gap-4">
                            <DetailsInfoCard 
                                icon={<FaEnvelope />} 
                                title="Email Address"
                                value={employee?.email || "No email provided"}
                                color="blue"
                            />
                            <DetailsInfoCard 
                                icon={<FaMapMarkerAlt />} 
                                title="Office Address"
                                value={employee?.address || "No address provided"}
                                color="rose"
                            />
                            <DetailsInfoCard 
                                icon={<FaPhone />} 
                                title="Secondary Contact"
                                value={employee?.user?.phone || "N/A"}
                                subValue="User account phone"
                                color="indigo"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Financial Summary */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
                            <FaWallet className="text-amber-400 text-lg"/> Account Balance
                        </h2>
                        <div className={`p-8 rounded-[2rem] border shadow-inner ${due >= 0 ? 'bg-emerald-50/50 border-emerald-50/50' : 'bg-rose-50/50 border-rose-50/50'}`}>
                            <p className={`text-2xl font-black ${due >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                ৳{Math.abs(due).toLocaleString()}
                            </p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase mt-2">
                                {due >= 0 ? "Outstanding balance payable to supplier" : "Advance amount paid to supplier"}
                            </p>
                        </div>
                    </div>

                    {/* Meta Card */}
                    <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">Supplier Meta</h2>
                        <div className="space-y-8">
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Area Code</p>
                                    <p className="text-base font-black uppercase tracking-widest">{employee?.areacode || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-purple-400 tracking-widest mb-1">Category</p>
                                    <p className="text-base font-black uppercase tracking-widest">{employee?.role || "Supplier"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showEditModal && (
                <UpdateEmployeeProfileModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleUpdateSuccess}
                    employeeData={employee}
                />
            )}

            {showSuccessPopup && (
                <UpdateProfileSuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccessPopup(false)}
                />
            )}
        </GenericModuleDetails>
    );
};

export default SupplierProfilePage;