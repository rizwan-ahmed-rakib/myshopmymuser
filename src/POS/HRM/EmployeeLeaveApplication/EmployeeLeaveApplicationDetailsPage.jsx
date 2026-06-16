import React, {useState, useEffect, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    FaCalendarAlt, FaFileAlt, FaUserTie, FaCheckCircle, 
    FaClock, FaTimesCircle, FaShieldAlt, FaExternalLinkAlt, FaFilePdf
} from "react-icons/fa";
import { leaveApplicationAPI } from "../../../context_or_provider/pos/EmployeeLeaveApplicaations/leave_applicationAPI";
import UpdateEmployeeLeaveApplicationModal from "./UpdateEmployeeLeaveApplicationModal";
import { getBrandedVoucher } from "../../utils/printTemplates";
import { getLeavePrintLayout } from "./LeavePrintLayout";
import { downloadLeavePDF } from "./useLeavePDF";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import SuccessPopup from "../../components/SuccessPopup";

const EmployeeLeaveApplicationDetailsPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [leave, setLeave] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const fetchLeaveDetails = useCallback(async () => {
        try {
            const res = await leaveApplicationAPI.getById(id);
            setLeave(res.data);
        } catch (err) {
            console.error("Error fetching leave details:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchLeaveDetails();
    }, [fetchLeaveDetails]);

    const handleEditSuccess = (updatedData) => {
        setLeave(updatedData);
        setEditOpen(false);
        setSuccessMessage("Leave application updated successfully!");
        setShowSuccess(true);
    };

    const handleApprove = async () => {
        if (!window.confirm("Approve this leave request?")) return;
        try {
            await leaveApplicationAPI.approve(id);
            fetchLeaveDetails();
            setSuccessMessage("Application approved successfully!");
            setShowSuccess(true);
        } catch (error) {
            console.error(error);
            alert("Failed to approve.");
        }
    };

    const handlePrint = () => {
        if (!leave) return;
        const tableContent = getLeavePrintLayout(leave);
        const fullHTML = getBrandedVoucher("Leave Application", tableContent, leave.id, "#f59e0b");
        const printWindow = window.open("", "_blank", "width=850,height=900");
        printWindow.document.write(fullHTML);
        printWindow.document.close();
    };

    const handleDownload = () => {
        if (!leave) return;
        downloadLeavePDF(leave);
    };

    const isApproved = leave?.status === "approved" || leave?.is_approved;
    const isRejected = leave?.status === "rejected";

    return (
        <GenericModuleDetails
            title="Leave Application"
            subtitle={leave?.leave_type}
            image={leave?.user_image}
            imageAlt={leave?.user_name}
            recordId={leave?.id}
            amount={Math.ceil((new Date(leave?.end_date) - new Date(leave?.start_date)) / (1000 * 60 * 60 * 24)) + 1 || 0}
            amountLabel="Total Days"
            isLoading={loading}
            onPrint={handlePrint}
            onEdit={() => setEditOpen(true)}
            accentColor="amber"
            infoItems={[
                {
                    icon: <FaCalendarAlt/>,
                    label: "Period",
                    value: leave ? `${new Date(leave.start_date).toLocaleDateString()} - ${new Date(leave.end_date).toLocaleDateString()}` : "N/A"
                },
                {icon: <FaUserTie/>, label: "Employee", value: leave?.user_name}
            ]}
            actions={[
                {
                    icon: <FaFilePdf size={16}/>,
                    label: "Download PDF",
                    onClick: handleDownload,
                    hoverColor: "hover:bg-red-600 hover:text-white"
                },
                (!isApproved && !isRejected) && {
                    icon: <FaCheckCircle size={16}/>,
                    label: "Approve",
                    onClick: handleApprove,
                    hoverColor: "hover:bg-emerald-600 hover:text-white"
                }
            ].filter(Boolean)}
        >
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Status & Key Dates */}
                    <div className="grid sm:grid-cols-3 gap-6">
                        <DetailsInfoCard variant="simple" title="Status"
                                         value={leave?.status || (isApproved ? 'Approved' : 'Pending')}
                                         icon={isApproved ? <FaCheckCircle/> : isRejected ? <FaTimesCircle/> : <FaClock/>} 
                                         color={isApproved ? "emerald" : isRejected ? "rose" : "amber"}/>
                        <DetailsInfoCard variant="simple" title="Applied On"
                                         value={new Date(leave?.applied_on || leave?.request_date).toLocaleDateString()}
                                         icon={<FaCalendarAlt/>} color="blue"/>
                        <DetailsInfoCard variant="simple" title="Leave Type"
                                         value={leave?.leave_type}
                                         icon={<FaFileAlt/>} color="purple"/>
                    </div>

                    {/* Reason Section */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-10 text-gray-800">
                            <div className="w-2 h-10 bg-amber-500 rounded-full shadow-lg shadow-amber-500/20"></div>
                            Application Reason
                        </h2>

                        <div className="bg-amber-50/50 p-8 rounded-[2.5rem] border border-amber-100 italic text-gray-700 leading-relaxed text-lg">
                            "{leave?.reason || "No specific reason provided for this leave application."}"
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">Approval Info</h2>
                        <div className="space-y-8">
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Approved By</p>
                                    <p className="text-base font-black">{leave?.approved_by_name || "Waiting for Review"}</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-purple-400 tracking-widest mb-1">Employee Profile</p>
                                    <button 
                                        onClick={() => navigate(`/hrm/employee/profile/${leave?.user}`)}
                                        className="text-sm font-black flex items-center gap-2 hover:text-purple-400 transition-colors"
                                    >
                                        View Full Profile <FaExternalLinkAlt size={10}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
                            <FaShieldAlt className="text-amber-400 text-lg"/> Policy Note
                        </h2>
                        <p className="text-xs font-bold text-gray-500 leading-relaxed">
                            Leaves are subject to HR policy. Total balance will be deducted once the application is officially marked as approved.
                        </p>
                    </div>
                </div>
            </div>

            {editOpen && (
                <UpdateEmployeeLeaveApplicationModal
                    isOpen={editOpen}
                    onClose={() => setEditOpen(false)}
                    onSuccess={handleEditSuccess}
                    advanceData={leave}
                />
            )}

            {showSuccess && (
                <SuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </GenericModuleDetails>
    );
};

export default EmployeeLeaveApplicationDetailsPage;
