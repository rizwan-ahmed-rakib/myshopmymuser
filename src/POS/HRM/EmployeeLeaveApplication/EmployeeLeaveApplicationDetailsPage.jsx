import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Edit, Calendar, CheckCircle, Clock, 
  XCircle, User, FileText, Info, ExternalLink, 
  Trash2, Printer, RefreshCw, AlertCircle, ShieldCheck
} from "lucide-react";
import { leaveApplicationAPI } from "../../../context_or_provider/pos/EmployeeLeaveApplicaations/leave_applicationAPI";
import UpdateEmployeeLeaveApplicationModal from "./UpdateEmployeeLeaveApplicationModal";
import UpdateEmployeeLeaveApplicationSuccessPopup from "./UpdateEmployeeLeaveApplicationSuccessPopup";
import LoadingSpinner from "./LoadingSpinner";

/**
 * EmployeeLeaveApplicationDetailsPage - A professional view for leave requests.
 * Displays application timeline, status, reasons, and employee context.
 */
const EmployeeLeaveApplicationDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [leave, setLeave] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const fetchLeaveDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await leaveApplicationAPI.getById(id);
            setLeave(response.data);
        } catch (error) {
            console.error("Error fetching leave details:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchLeaveDetails();
    }, [fetchLeaveDetails]);

    const handleUpdateSuccess = (updatedData) => {
        setLeave(updatedData);
        setShowEditModal(false);
        setSuccessMessage("Leave application has been updated successfully!");
        setShowSuccess(true);
    };

    const handleApprove = async () => {
        if (!window.confirm("Are you sure you want to approve this leave request?")) return;
        try {
            await leaveApplicationAPI.approve(id);
            fetchLeaveDetails();
        } catch (error) {
            console.error("Approve error:", error);
            alert("Failed to approve leave.");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this application?")) return;
        try {
            await leaveApplicationAPI.delete(id);
            navigate(-1);
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete record.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    if (loading) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500 font-medium">Fetching leave application...</p>
        </div>
    );

    if (!leave) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 text-4xl">!</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h2>
            <button onClick={() => navigate(-1)} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition">
                <ArrowLeft size={18} /> Go Back
            </button>
        </div>
    );

    const isApproved = leave.status === "approved" || leave.is_approved;
    const isRejected = leave.status === "rejected";
    const isPending = !isApproved && !isRejected;

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Navigation & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm transition-colors group"
                >
                    <div className="p-2 bg-white rounded-lg shadow-sm border group-hover:bg-gray-50 transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    Back to List
                </button>
                
                <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => window.print()} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm">
                        <Printer size={16} /> Print
                    </button>
                    {isPending && (
                        <button onClick={handleApprove} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20">
                            <CheckCircle size={16} /> Approve
                        </button>
                    )}
                    <button onClick={() => setShowEditModal(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-primary px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-brand-primaryHover transition shadow-lg shadow-blue-500/20">
                        <Edit size={16} /> Edit
                    </button>
                    <button onClick={handleDelete} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition border border-rose-100 bg-white">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Hero Card */}
            <div className={`relative overflow-hidden rounded-[2rem] p-8 md:p-10 text-white shadow-2xl ${
                isApproved ? 'bg-emerald-600' : isRejected ? 'bg-rose-600' : 'bg-amber-500'
            }`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-3xl bg-white/20 border border-white/30 p-1 backdrop-blur-md shadow-inner overflow-hidden">
                            <img 
                                src={leave.user_image || "https://via.placeholder.com/150?text=User"} 
                                alt={leave.user_name}
                                className="w-full h-full object-cover rounded-2xl bg-white"
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-sm">
                                    {leave.user_designation || 'Employee'}
                                </span>
                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
                                    isApproved ? 'bg-emerald-400/20 border-emerald-400/30' : 
                                    isRejected ? 'bg-rose-400/20 border-rose-400/30' : 
                                    'bg-amber-400/20 border-amber-400/30'
                                }`}>
                                    {isApproved ? <CheckCircle size={10}/> : isRejected ? <XCircle size={10}/> : <Clock size={10}/>}
                                    {leave.status || (isApproved ? 'Approved' : 'Pending')}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black mb-1">{leave.user_name}</h1>
                            <p className="text-white/70 font-medium text-sm flex items-center gap-2">
                                <FileText size={14} className="text-white/50" /> {leave.leave_type} Request
                            </p>
                        </div>
                    </div>

                    <div className="bg-black/20 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] text-center min-w-[220px]">
                        <p className="text-[10px] font-black uppercase text-white/50 tracking-[0.2em] mb-1">Leave Period</p>
                        <div className="flex flex-col gap-1">
                            <p className="text-xl font-black text-white">{formatDate(leave.start_date)}</p>
                            <p className="text-[10px] font-bold text-white/40 uppercase">to</p>
                            <p className="text-xl font-black text-white">{formatDate(leave.end_date)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Application Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 mb-8 text-gray-800">
                            <div className="w-2 h-8 bg-brand-primary rounded-full"></div>
                            Application Reason
                        </h2>
                        <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 italic text-gray-700 leading-relaxed relative">
                            <div className="absolute top-4 left-4 text-4xl text-gray-200 font-serif">“</div>
                            {leave.reason || "No specific reason provided for this leave application."}
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Applied On</p>
                                <p className="text-lg font-black text-gray-900">{formatDate(leave.applied_on)}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                isApproved ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Approved By</p>
                                <p className="text-lg font-black text-gray-900">{leave.approved_by_name || "Waiting for Review"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-gray-900 p-8 rounded-[2rem] shadow-xl text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">Quick Links</h2>
                        <div className="space-y-4">
                            <button 
                                onClick={() => navigate(`/hrm/employee/profile/${leave.user}`)}
                                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <User size={18} className="text-blue-400" />
                                    <span className="text-sm font-bold">View Profile</span>
                                </div>
                                <ExternalLink size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                            </button>
                            <button 
                                onClick={fetchLeaveDetails}
                                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <RefreshCw size={18} className="text-emerald-400" />
                                    <span className="text-sm font-bold">Reload Request</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle size={16} className="text-amber-500" />
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Policy Guidelines</p>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            This application is subject to the company leave policy. Total leave balance will be updated automatically upon approval.
                        </p>
                    </div>

                    <div className="text-center p-4 border-t border-gray-100 mt-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reference ID: #LVE-{leave.id}</p>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && leave && (
                <UpdateEmployeeLeaveApplicationModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleUpdateSuccess}
                    advanceData={leave}
                />
            )}

            {/* Success Popup */}
            {showSuccess && (
                <UpdateEmployeeLeaveApplicationSuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </div>
    );
};

export default EmployeeLeaveApplicationDetailsPage;
