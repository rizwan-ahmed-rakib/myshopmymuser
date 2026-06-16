import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    User, Mail, Phone, MapPin, Briefcase, 
    DollarSign, Target, Calendar, Shield, 
    Trash2, MessageSquare, Info, Activity,
    Clock, CheckCircle, XCircle
} from 'lucide-react';
import api from '../../../context_or_provider/pos/posApi';

import UpdateEmployeeProfileModal from "./UpdateProfileModal";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import { employeeAPI } from "../../../context_or_provider/pos/profile/profileupdate";
import SuccessModal from "../../components/SuccessModal";

/**
 * EmployeeProfilePage - Refactored to use GenericModuleDetails and Backbone branding.
 */
const EmployeeProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [successData, setSuccessData] = useState(null);

    const fetchEmployeeProfile = useCallback(async () => {
        try {
            const response = await api.get(`/api/users/create-new-user-with-profile/${id}/`);
            setEmployee(response.data);
        } catch (error) {
            console.error("Error fetching employee profile:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchEmployeeProfile();
    }, [fetchEmployeeProfile]);

    const handleUpdateSuccess = (updatedData) => {
        setEmployee(prev => ({ ...prev, ...updatedData }));
        setEditOpen(false);
        setSuccessData(updatedData);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${employee?.name}'s account? This action cannot be undone.`)) return;
        try {
            await employeeAPI.delete(id);
            navigate("/hrm");
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete employee account.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    return (
        <GenericModuleDetails
            title="Employee Profile"
            subtitle={employee?.role}
            image={employee?.profile_picture}
            imageAlt={employee?.name}
            recordId={employee?.id}
            isLoading={loading}
            onEdit={() => setEditOpen(true)}
            editText="Update Profile"
            accentColor="blue"
            heroIcon={<User />}
            statusBadge={
                <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        employee?.user?.is_active 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                        {employee?.user?.is_active ? 'Active Account' : 'Inactive'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        employee?.user?.is_present 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}>
                        {employee?.user?.is_present ? 'Present Now' : 'Absent'}
                    </span>
                </div>
            }
            infoItems={[
                { icon: <Calendar size={14} />, label: "Joined", value: formatDate(employee?.date_joined) },
                { icon: <Mail size={14} />, label: "Email", value: employee?.email },
                { icon: <Phone size={14} />, label: "Phone", value: employee?.user?.phone_number || "N/A" }
            ]}
            actions={[
                {
                    icon: <MessageSquare size={16} />,
                    label: "Message",
                    onClick: () => alert("Messaging feature coming soon!"),
                    hoverColor: "hover:bg-indigo-600 hover:text-white"
                },
                {
                    icon: <Trash2 size={16} />,
                    label: "Delete",
                    onClick: handleDelete,
                    hoverColor: "hover:bg-rose-600 hover:text-white"
                }
            ]}
        >
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Financials & Bio */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Employment Stats Cards */}
                    <div className="grid sm:grid-cols-3 gap-6">
                        <DetailsInfoCard 
                            variant="simple" 
                            title="Monthly Salary" 
                            value={`৳${parseFloat(employee?.salary || 0).toLocaleString()}`} 
                            icon={<DollarSign />} 
                            color="emerald" 
                        />
                        <DetailsInfoCard 
                            variant="simple" 
                            title="Sales Target" 
                            value={`৳${parseFloat(employee?.target || 0).toLocaleString()}`} 
                            icon={<Target />} 
                            color="indigo" 
                        />
                        <DetailsInfoCard 
                            variant="simple" 
                            title="Area Code" 
                            value={employee?.areacode || "N/A"} 
                            icon={<MapPin />} 
                            color="blue" 
                        />
                    </div>

                    {/* Personal Information Sections */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-10 text-gray-800">
                            <div className="w-2 h-10 bg-blue-500 rounded-full shadow-lg shadow-blue-500/20"></div>
                            Information Details
                        </h2>

                        <div className="grid gap-4">
                            <DetailsInfoCard 
                                icon={<User />} 
                                title="Full Name" 
                                value={employee?.name} 
                                subValue={`Login Username: ${employee?.user?.phone_number}`}
                                color="blue" 
                            />
                            <DetailsInfoCard 
                                icon={<Mail />} 
                                title="Email Address" 
                                value={employee?.email} 
                                subValue="Official communication channel"
                                color="indigo" 
                            />
                            <DetailsInfoCard 
                                icon={<MapPin />} 
                                title="Residential Address" 
                                value={employee?.address || "No address provided"} 
                                color="rose" 
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Metadata & Account Status */}
                <div className="space-y-8">
                    {/* Metadata Card */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
                            <Info className="text-blue-400 text-lg"/> Account Meta
                        </h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-gray-400" />
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Last Attendance</span>
                                </div>
                                <span className="text-xs font-bold text-gray-700">
                                    {employee?.user?.last_attendance ? formatDate(employee.user.last_attendance) : 'Never'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Activity size={16} className="text-gray-400" />
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Account Status</span>
                                </div>
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${employee?.user?.is_active ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                                    {employee?.user?.is_active ? 'Active' : 'Locked'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Info Card */}
                    <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                        <h2 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500 mb-8">Identification</h2>
                        <div className="space-y-8">
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Employee ID</p>
                                    <p className="text-2xl font-black">#EMP-{employee?.id}</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Fingerprint ID</p>
                                    <p className="text-base font-black uppercase tracking-widest">{employee?.user?.fingerprint_id || 'Not Assigned'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 flex items-center gap-3 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] border-2 border-emerald-400/20 bg-emerald-400/5 p-5 rounded-2xl justify-center">
                            <Shield size={14} /> Official Verified Profile
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editOpen && (
                <UpdateEmployeeProfileModal
                    isOpen={editOpen}
                    onClose={() => setEditOpen(false)}
                    onSuccess={handleUpdateSuccess}
                    employeeData={employee}
                />
            )}

            {/* Success Popup */}
            <SuccessModal 
                isOpen={!!successData} 
                onClose={() => setSuccessData(null)} 
                title="Profile Updated"
                subtitle="Employee information synchronized"
                details={[
                    { label: "Full Name", value: successData?.name },
                    { label: "Designation", value: successData?.role },
                    { label: "Update Time", value: new Date().toLocaleTimeString() }
                ]}
            />
        </GenericModuleDetails>
    );
};

export default EmployeeProfilePage;
