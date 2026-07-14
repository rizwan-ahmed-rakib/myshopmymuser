import React, {useState, useEffect, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import { 
    FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
    FaCalendarAlt, FaIdCard, FaWallet, FaInfoCircle,
    FaEdit, FaTrash, FaUndo, FaUserTag
} from "react-icons/fa";
import api from '../../../context_or_provider/pos/posApi';

import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import UpdateEmployeeProfileModal from "./UpdateProfileModal";
import SuccessModal from "../../components/SuccessModal";
import { posCustomerAPI } from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";

/**
 * CustomerProfilePage - Refactored to use GenericModuleDetails and DetailsInfoCard.
 * Standardized profile view for Customers.
 */
const CustomerProfilePage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const fetchEmployeeProfile = useCallback(async () => {
        try {
            const response = await api.get(`/api/sale/customers/${id}/`);
            setEmployee(response.data);
        } catch (error) {
            console.error("Error fetching customer profile:", error);
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
        setShowSuccessPopup(true);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${employee?.name}?`)) return;
        try {
            await posCustomerAPI.delete(id);
            alert("Customer deleted successfully!");
            navigate("/sales");
        } catch (error) {
            console.error(error);
            alert("Failed to delete the customer.");
        }
    };

    const due = parseFloat(employee?.due_amount || 0);

    return (
        <GenericModuleDetails
            title="Customer Profile"
            subtitle={employee?.name}
            image={employee?.image}
            imageAlt={employee?.name}
            imageFallback="https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80"
            recordId={employee?.id}
            amount={Math.abs(due).toLocaleString()}
            amountLabel={due >= 0 ? "Outstanding Receivable" : "Customer Advance Balance"}
            isLoading={loading}
            onEdit={() => setShowEditModal(true)}
            editText="Edit Profile"
            accentColor="emerald"
            infoItems={[
                {
                    icon: <FaCalendarAlt />,
                    label: "Customer Since",
                    value: new Date(employee?.created_at).toLocaleDateString()
                },
                { icon: <FaIdCard />, label: "Customer ID", value: `#${employee?.id}` }
            ]}
            actions={[
                {
                    icon: <FaTrash size={16} />,
                    label: "Delete Customer",
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
                        <DetailsInfoCard variant="simple" title="Type"
                                         value={employee?.role || "Regular"}
                                         icon={<FaUserTag />} color="indigo"/>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-10">
                            <div className="w-2 h-10 bg-emerald-600 rounded-full shadow-lg shadow-emerald-500/20"></div>
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
                                title="Billing Address"
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
                        <div className={`p-8 rounded-[2rem] border shadow-inner ${due >= 0 ? 'bg-rose-50/50 border-rose-50/50' : 'bg-emerald-50/50 border-emerald-50/50'}`}>
                            <p className={`text-2xl font-black ${due >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                ৳{Math.abs(due).toLocaleString()}
                            </p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase mt-2">
                                {due >= 0 ? "Outstanding amount due from customer" : "Advance amount credit in account"}
                            </p>
                        </div>
                    </div>

                    {/* Meta Card */}
                    <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">Customer Meta</h2>
                        <div className="space-y-8">
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Loyalty Points</p>
                                    <p className="text-base font-black uppercase tracking-widest">{employee?.points || "0"}</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Account Class</p>
                                    <p className="text-base font-black uppercase tracking-widest">{employee?.role || "Regular"}</p>
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

            <SuccessModal
                isOpen={showSuccessPopup}
                onClose={() => setShowSuccessPopup(false)}
                title="Customer Profile Updated"
                subtitle="Customer Account Updated"
                details={[
                    { label: "Customer Name", value: employee?.name },
                    { label: "Customer ID", value: `#${employee?.id}` },
                    { label: "Contact Info", value: employee?.phone || employee?.user?.phone || "N/A" }
                ]}
            />
        </GenericModuleDetails>
    );
};

export default CustomerProfilePage;