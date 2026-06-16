import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import UpdateEmployeeLeaveApplicationModal from "./UpdateEmployeeLeaveApplicationModal";
import {leaveApplicationAPI} from "../../../context_or_provider/pos/EmployeeLeaveApplicaations/leave_applicationAPI";
import SuccessPopup from "../../components/SuccessPopup";
import { MoreVertical, Edit3, Trash2, CheckCircle, User, Calendar, FileText, Eye } from 'lucide-react';

const EmployeeLeaveApplicationCard = ({advance, onEdit, onDelete}) => {
    const navigate = useNavigate();
    const [selectedAdvance, setSelectedAdvance] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [loadingId, setLoadingId] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleUserClick = () => {
        navigate(`/hrm/leave-application/details/${advance.id}`);
    };

    const handleEdit = () => {
        setSelectedAdvance(advance);
        setShowEditModal(true);
        setShowDropdown(false);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete leave request of ${advance.user_name}?`)) return;

        setLoadingId(advance.id);
        try {
            await leaveApplicationAPI.delete(advance.id);
            setSuccessMessage("Application deleted successfully");
            setShowSuccess(true);
            if (onDelete) onDelete();
        } catch (error) {
            console.error(error);
            alert("Delete failed");
        } finally {
            setLoadingId(null);
        }
    };

    const handleApprove = async () => {
        if (!window.confirm(`Approve leave of ${advance.user_name}?`)) return;

        setLoadingId(advance.id);
        try {
            await leaveApplicationAPI.approve(advance.id);
            setSuccessMessage("Application approved successfully");
            setShowSuccess(true);
            if (onEdit) onEdit();
        } catch (error) {
            console.error(error);
            alert("Approve failed");
        } finally {
            setLoadingId(null);
        }
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const isApproved = advance.status === "approved" || advance.is_approved;
    const isRejected = advance.status === "rejected";

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group">
                <div className="p-5">
                    <div className="flex justify-between items-start mb-5">
                        <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            isApproved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                            isRejected ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                            'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                            {advance.status || (isApproved ? 'Approved' : 'Pending')}
                        </div>

                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <MoreVertical size={18} />
                            </button>
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                                    <button onClick={handleUserClick} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Eye size={16} className="mr-3" /> View Details</button>
                                    <button onClick={handleEdit} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"><Edit3 size={16} className="mr-3" /> Edit Request</button>
                                    {!isApproved && !isRejected && (
                                        <button onClick={handleApprove} className="flex items-center w-full px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"><CheckCircle size={16} className="mr-3" /> Approve</button>
                                    )}
                                    <button onClick={handleDelete} className="flex items-center w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"><Trash2 size={16} className="mr-3" /> Delete</button>
                                    <div className="border-t border-gray-50 my-2"></div>
                                    <button onClick={() => navigate(`/hrm/employee/profile/${advance.user}`)} className="flex items-center w-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors"><User size={16} className="mr-3" /> Employee Profile</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                            <img 
                                src={advance.user_image || `https://ui-avatars.com/api/?name=${advance.user_name}&background=random`} 
                                alt="" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="min-w-0">
                            <h3 onClick={handleUserClick} className="font-bold text-gray-900 truncate hover:text-brand-primary cursor-pointer transition-colors leading-tight mb-1">{advance.user_name}</h3>
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">{advance.user_designation || 'Employee'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Leave Type</p>
                            <p className="text-xs font-bold text-gray-700 truncate">{advance.leave_type}</p>
                        </div>
                        <div className="bg-blue-50/50 rounded-xl p-3">
                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Duration</p>
                            <p className="text-xs font-bold text-blue-700">
                                {Math.ceil((new Date(advance.end_date) - new Date(advance.start_date)) / (1000 * 60 * 60 * 24)) + 1} Days
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-500">
                            <Calendar size={14} className="shrink-0" />
                            <span className="text-xs font-medium">{formatDate(advance.start_date)} - {formatDate(advance.end_date)}</span>
                        </div>
                        <div className="flex items-start gap-3 text-gray-500">
                            <FileText size={14} className="mt-0.5 shrink-0" />
                            <p className="text-xs font-medium line-clamp-2 leading-relaxed italic">{advance.reason || "No reason provided"}</p>
                        </div>
                    </div>
                </div>
                
                <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Ref: #LVE-{advance.id}</span>
                    <button onClick={handleUserClick} className="text-[10px] font-black text-brand-primary uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                        Details <Eye size={12} />
                    </button>
                </div>
            </div>

            {showEditModal && selectedAdvance && (
                <UpdateEmployeeLeaveApplicationModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    advanceData={selectedAdvance}
                    onSuccess={(data) => {
                        setShowEditModal(false);
                        setSuccessMessage("Application updated successfully");
                        setShowSuccess(true);
                        if (onEdit) onEdit(data);
                    }}
                />
            )}

            {showSuccess && (
                <SuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </>
    );
};

export default EmployeeLeaveApplicationCard;