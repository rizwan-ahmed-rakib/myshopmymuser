import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Edit, MapPin, Clock, Calendar, 
  CheckCircle, XCircle, User, Fingerprint, Info,
  ExternalLink, Trash2, Printer, RefreshCw
} from "lucide-react";
import { employeeAttendanceAPI } from "../../../context_or_provider/pos/EmployeeAttendance/employeeAttendanceAPI";
import UpdateEmployeeAttendanceModal from "./UpdateEmployeeAttendanceModal";
import UpdateEmployeeAttendanceSuccessPopup from "./UpdateEmployeeAttendanceSuccessPopup";
import LoadingSpinner from "./LoadingSpinner";

/**
 * EmployeeAttendanceDetailsPage - A professional detail view for attendance records.
 * Provides deep insights into timing, location, and employee info.
 */
const EmployeeAttendanceDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const fetchAttendanceDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await employeeAttendanceAPI.getById(id);
            setAttendance(response.data);
        } catch (error) {
            console.error("Error fetching attendance details:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchAttendanceDetails();
    }, [fetchAttendanceDetails]);

    const handleUpdateSuccess = (updatedData) => {
        setAttendance(updatedData);
        setShowEditModal(false);
        setSuccessMessage("Attendance record has been updated successfully!");
        setShowSuccess(true);
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this attendance record?")) return;
        try {
            await employeeAttendanceAPI.delete(id);
            navigate(-1);
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete record.");
        }
    };

    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return "Not Recorded";
        return new Date(dateTimeString).toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const formatWorkTime = (minutes) => {
        if (!minutes) return "0h 0m";
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    if (loading) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500 font-medium">Fetching attendance details...</p>
        </div>
    );

    if (!attendance) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 text-4xl">!</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Record Not Found</h2>
            <p className="text-gray-500 mb-8 max-w-md">The attendance record you're looking for doesn't exist or has been removed.</p>
            <button onClick={() => navigate(-1)} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition shadow-lg">
                <ArrowLeft size={18} /> Go Back
            </button>
        </div>
    );

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header / Navigation */}
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
                    <button onClick={() => setShowEditModal(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-primary px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-brand-primaryHover transition shadow-lg shadow-blue-500/20">
                        <Edit size={16} /> Edit Record
                    </button>
                    <button onClick={handleDelete} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition border border-rose-100 bg-white">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Main Status Hero Card */}
            <div className={`relative overflow-hidden rounded-[2rem] p-8 md:p-10 text-white shadow-2xl ${
                attendance.is_present ? 'bg-emerald-600' : 'bg-rose-600'
            }`}>
                {/* Decoration blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-3xl bg-white/20 border border-white/30 p-1 backdrop-blur-md shadow-inner overflow-hidden">
                            <img 
                                src={attendance.profile_picture || "https://via.placeholder.com/150?text=User"} 
                                alt={attendance.name}
                                className="w-full h-full object-cover rounded-2xl bg-white"
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-sm">
                                    {attendance.user_designation || 'Staff'}
                                </span>
                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
                                    attendance.is_present ? 'bg-emerald-400/20 border-emerald-400/30' : 'bg-rose-400/20 border-rose-400/30'
                                }`}>
                                    {attendance.is_present ? <CheckCircle size={10}/> : <XCircle size={10}/>}
                                    {attendance.is_present ? 'Present' : 'Absent'}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black mb-1">{attendance.name}</h1>
                            <p className="text-white/70 font-medium text-sm flex items-center gap-2">
                                <Calendar size={14} className="text-white/50" /> {formatDate(attendance.date)}
                            </p>
                        </div>
                    </div>

                    <div className="bg-black/20 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] text-center min-w-[180px]">
                        <p className="text-[10px] font-black uppercase text-white/50 tracking-[0.2em] mb-1">Work Duration</p>
                        <p className="text-4xl font-black text-white leading-none">
                            {formatWorkTime(attendance.daily_work_time)}
                        </p>
                        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-bold">
                            <div className={`w-2 h-2 rounded-full ${attendance.daily_work_time >= 480 ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                            {attendance.daily_work_time >= 480 ? 'Standard Shift Completed' : 'Partial Shift'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Timing & Location Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Timing Cards */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Check In */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Check In Time</p>
                                    <p className="text-lg font-black text-gray-900">{formatTime(attendance.check_in_time)}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Check In Location</p>
                                        <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                                            {attendance.check_in_time_location || "No GPS location data recorded."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Check Out */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Check Out Time</p>
                                    <p className="text-lg font-black text-gray-900">{formatTime(attendance.check_out_time)}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Check Out Location</p>
                                        <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                                            {attendance.check_out_time_location || "No GPS location data recorded."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Extended Details Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 mb-8 text-gray-800">
                            <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                            Administrative Details
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                        <Fingerprint size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Marketing Officer ID</p>
                                        <p className="font-black text-gray-800">{attendance.marketing_officer}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                                        <Info size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Record Identifier</p>
                                        <p className="font-black text-gray-800">#ATT-{attendance.id}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 flex flex-col justify-center text-center">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-3">Verification Status</p>
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border-4 border-emerald-100">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-black text-gray-900 uppercase tracking-tighter leading-none mb-1">Digitally Verified</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Via Mobile Application</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions & Meta */}
                <div className="space-y-6">
                    {/* Leave Type Card (If applicable) */}
                    {attendance.leave_type && (
                        <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-8 rounded-[2rem] text-white shadow-xl">
                            <h3 className="text-[10px] font-black uppercase text-purple-200 tracking-[0.2em] mb-4">Leave Association</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <Calendar className="text-white" />
                                </div>
                                <div>
                                    <p className="text-lg font-black capitalize leading-none">{attendance.leave_type} Leave</p>
                                    <p className="text-[10px] font-bold text-purple-200 uppercase tracking-widest mt-1">Official Absence Recorded</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-900 p-8 rounded-[2rem] shadow-xl text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">Quick Actions</h2>
                        <div className="space-y-4">
                            <button 
                                onClick={() => navigate(`/hrm/employee/profile/${attendance.marketing_officer}`)}
                                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <User size={18} className="text-blue-400" />
                                    <span className="text-sm font-bold">View Profile</span>
                                </div>
                                <ExternalLink size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                            </button>
                            <button 
                                onClick={fetchAttendanceDetails}
                                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <RefreshCw size={18} className="text-emerald-400" />
                                    <span className="text-sm font-bold">Refresh Data</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm text-center">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4">Record Metadata</p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-bold px-4 py-2 bg-gray-50 rounded-lg">
                                <span className="text-gray-400 uppercase">Created</span>
                                <span className="text-gray-900">{formatTime(attendance.check_in_time)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold px-4 py-2 bg-gray-50 rounded-lg">
                                <span className="text-gray-400 uppercase">Method</span>
                                <span className="text-gray-900 uppercase tracking-tighter">Biometric / App</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && attendance && (
                <UpdateEmployeeAttendanceModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleUpdateSuccess}
                    advanceData={attendance}
                />
            )}

            {/* Success Popup */}
            {showSuccess && (
                <UpdateEmployeeAttendanceSuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </div>
    );
};

export default EmployeeAttendanceDetailsPage;
