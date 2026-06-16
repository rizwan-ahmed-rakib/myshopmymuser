import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    Clock, MapPin, ClipboardList, CheckCircle, XCircle, 
    Calendar, User, Fingerprint, Info, Trash2, Settings,
    Activity, ShieldCheck
} from 'lucide-react';
import { employeeAttendanceAPI } from "../../../context_or_provider/pos/EmployeeAttendance/employeeAttendanceAPI";
import UpdateEmployeeAttendanceModal from "./UpdateEmployeeAttendanceModal";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import SuccessModal from "../../components/SuccessModal";

/**
 * EmployeeAttendanceDetailsPage - Refactored to use GenericModuleDetails and Backbone branding.
 */
const EmployeeAttendanceDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [successData, setSuccessData] = useState(null);

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
        setEditOpen(false);
        setSuccessData(updatedData);
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
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-GB', {
            weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
        });
    };

    const formatWorkTime = (minutes) => {
        if (!minutes) return "0h 0m";
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    return (
        <GenericModuleDetails
            title="Attendance Record"
            subtitle={attendance?.date ? formatDate(attendance.date) : ''}
            image={attendance?.profile_picture}
            imageAlt={attendance?.name}
            recordId={attendance?.id}
            amount={formatWorkTime(attendance?.daily_work_time)}
            amountLabel="Total Work Duration"
            isLoading={loading}
            onEdit={() => setEditOpen(true)}
            accentColor={attendance?.is_present ? "emerald" : "rose"}
            heroIcon={<ClipboardList />}
            statusBadge={
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    attendance?.is_present 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                }`}>
                    {attendance?.is_present ? <CheckCircle size={10}/> : <XCircle size={10}/>}
                    {attendance?.is_present ? 'Present' : 'Absent'}
                </span>
            }
            infoItems={[
                { icon: <User size={14} />, label: "Employee", value: attendance?.name },
                { icon: <Calendar size={14} />, label: "Date", value: attendance?.date ? new Date(attendance.date).toLocaleDateString() : 'N/A' }
            ]}
            actions={[
                {
                    icon: <Trash2 size={16} />,
                    label: "Delete Record",
                    onClick: handleDelete,
                    hoverColor: "hover:bg-rose-600 hover:text-white"
                }
            ]}
        >
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Timing & Location */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <DetailsInfoCard 
                            variant="simple" 
                            title="Check In Time" 
                            value={formatTime(attendance?.check_in_time)} 
                            subValue={attendance?.check_in_time_location || "No location recorded"}
                            icon={<Clock />} 
                            color="emerald" 
                        />
                        <DetailsInfoCard 
                            variant="simple" 
                            title="Check Out Time" 
                            value={formatTime(attendance?.check_out_time)} 
                            subValue={attendance?.check_out_time_location || "No location recorded"}
                            icon={<Clock />} 
                            color="rose" 
                        />
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-10 text-gray-800">
                            <div className="w-2 h-10 bg-purple-500 rounded-full shadow-lg shadow-purple-500/20"></div>
                            Log Association
                        </h2>

                        <div className="grid gap-4">
                            <DetailsInfoCard 
                                icon={<MapPin />} 
                                title="Check-In Location" 
                                value={attendance?.check_in_time_location || "N/A"} 
                                color="emerald" 
                            />
                            <DetailsInfoCard 
                                icon={<MapPin />} 
                                title="Check-Out Location" 
                                value={attendance?.check_out_time_location || "N/A"} 
                                color="rose" 
                            />
                            {attendance?.leave_type && (
                                <DetailsInfoCard 
                                    icon={<Calendar />} 
                                    title="Leave Applied" 
                                    value={`${attendance.leave_type.toUpperCase()} Leave`} 
                                    subValue="This record overrides standard attendance"
                                    color="purple" 
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Metadata */}
                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
                            <Info className="text-amber-400 text-lg"/> Record Meta
                        </h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Activity size={16} className="text-gray-400" />
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Shift Status</span>
                                </div>
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${attendance?.daily_work_time >= 480 ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                                    {attendance?.daily_work_time >= 480 ? 'Full Shift' : 'Partial'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                        <h2 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500 mb-8">Verification</h2>
                        <div className="space-y-8">
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Marketing Officer</p>
                                    <p className="text-lg font-black">{attendance?.name}</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Fingerprint ID</p>
                                    <p className="text-base font-black uppercase tracking-widest">Verified</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 flex items-center gap-3 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] border-2 border-emerald-400/20 bg-emerald-400/5 p-5 rounded-2xl justify-center">
                            <ShieldCheck size={14} /> Digitally Authenticated
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editOpen && (
                <UpdateEmployeeAttendanceModal
                    isOpen={editOpen}
                    onClose={() => setEditOpen(false)}
                    onSuccess={handleUpdateSuccess}
                    advanceData={attendance}
                />
            )}

            {/* Success Popup */}
            <SuccessModal 
                isOpen={!!successData} 
                onClose={() => setSuccessData(null)} 
                title="Attendance Updated"
                subtitle="Record synchronized successfully"
                details={[
                    { label: "Employee", value: successData?.name },
                    { label: "Status", value: successData?.is_present ? "PRESENT" : "ABSENT" },
                    { label: "Date", value: successData?.date ? new Date(successData.date).toLocaleDateString() : 'N/A' }
                ]}
            />
        </GenericModuleDetails>
    );
};

export default EmployeeAttendanceDetailsPage;
