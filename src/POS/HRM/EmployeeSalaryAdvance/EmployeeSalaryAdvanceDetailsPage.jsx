import React, {useState, useEffect, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    FaMoneyBillWave, FaMobileAlt, FaUniversity,
    FaStickyNote, FaRegCalendarAlt, FaCheckCircle,
    FaUserTie, FaCalendarCheck, FaClock, FaFilePdf
} from "react-icons/fa";
import api from '../../../context_or_provider/pos/posApi';

import UpdateSalaryAdvanceModal from "./UpdateSalaryAdvanceModal";
import {getBrandedVoucher} from "../../utils/printTemplates";
import {getAdvancePrintLayout} from "./AdvancePrintLayout";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import StatusBadge from "../../components/StatusBadge";
import {FaDeleteLeft} from "react-icons/fa6";
import {salaryAdvanceAPI} from "../../../context_or_provider/pos/EmployeeSalaryAdvance/salary_advanceAPI";
import {downloadSalaryAdvancePDF} from "./useSalaryAdvancePDF";
import {AiFillDelete} from "react-icons/ai";
import SuccessModal from "../../components/SuccessModal";

const EmployeeSalaryAdvanceDetailsPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [advance, setAdvance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState('update');

    const fetchAdvance = useCallback(async () => {
        try {
            const res = await api.get(`/api/users/salary-advances/${id}/`);
            setAdvance(res.data);
        } catch (err) {
            console.error("Error fetching advance details:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchAdvance();
    }, [fetchAdvance]);

    const handleEditSuccess = (updatedData) => {
        setAdvance(updatedData);
        setEditOpen(false);
        setSuccessType('update');
        setSuccessData(updatedData);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete this advance for ${advance?.user_name}?`)) return;
        try {
            await salaryAdvanceAPI.delete(id);
            alert("Advance deleted successfully!");
            navigate(-1); // Go back to the list
        } catch (error) {
            console.error("Failed to delete:", error);
            alert("Failed to delete the advance.");
        }
    };

    const handlePrint = () => {
        if (!advance) return;
        const tableContent = getAdvancePrintLayout(advance);
        const fullHTML = getBrandedVoucher("Salary Advance", tableContent, advance.id, "#10b981");
        const printWindow = window.open("", "_blank", "width=850,height=900");
        printWindow.document.write(fullHTML);
        printWindow.document.close();
    };

    return (
        <GenericModuleDetails
            title="Salary Advance"
            subtitle={advance?.is_approved ? "Approved Request" : "Pending Verification"}
            image={advance?.user_image
                // ? `${BASE_URL_of_POS}${advance?.user_image}`
                ? `${advance?.user_image}`
                : null}
            imageAlt={advance?.user_name}
            imageFallback="https://ui-avatars.com/api/?name=John"
            recordId={advance?.id}
            amount={parseFloat(advance?.amount || 0).toLocaleString()}
            amountLabel="Advance Amount"
            isLoading={loading}
            onPrint={handlePrint}
            onEdit={() => setEditOpen(true)}
            printText="Print Voucher"
            editText="Edit Advance"
            accentColor="emerald"
            statusBadge={
                <StatusBadge
                    type={advance?.is_approved ? "approved" : "pending"}
                    label={advance?.is_approved ? "Approved" : "Pending Approval"}
                />
            }
            infoItems={[
                {
                    icon: <FaRegCalendarAlt/>,
                    label: "Request Date",
                    value: new Date(advance?.request_date).toLocaleDateString()
                },
                {icon: <FaUserTie/>, label: "Employee", value: advance?.user_name}
            ]}
            actions={[
                {
                    icon: <FaFilePdf size={16}/>,
                    label: "Download PDF",
                    // onClick: handlePDFDownload,
                    onClick: () => downloadSalaryAdvancePDF(advance), // আমাদের তৈরি করা নিখুঁত ইঞ্জিনটি কল হবে
                    hoverColor: "hover:bg-orange-600 hover:text-white"

                },
                {
                    icon: <AiFillDelete size={16}/>,
                    label: "delete",
                    // onClick: handlePDFDownload,
                    onClick: handleDelete,
                    hoverColor: "hover:bg-red-600 hover:text-white"

                }
            ]}

        >
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <DetailsInfoCard icon={<FaUserTie/>} title="Employee" value={advance?.user_name}
                                         subValue={advance?.user_designation || "No Designation"} color="blue"/>
                        <DetailsInfoCard icon={<FaMoneyBillWave/>} title="Payment Method"
                                         value={advance?.payment_method?.replace('_', ' ')} color="emerald"
                                         subValue="Disbursement Medium"/>
                    </div>

                    <div
                        className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                        <div
                            className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-10">
                            <div className="w-2 h-10 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20"></div>
                            Disbursement Breakdown
                        </h2>

                        <div className="grid gap-4">
                            {Number(advance?.paid_cash) > 0 && (
                                <DetailsInfoCard icon={<FaMoneyBillWave/>} title="Cash Payout"
                                                 value={`৳${parseFloat(advance?.paid_cash).toLocaleString()}`}
                                                 subValue="In-hand currency" color="emerald"/>
                            )}
                            {Number(advance?.paid_mobile) > 0 && (
                                <DetailsInfoCard
                                    icon={<FaMobileAlt/>}
                                    title="Mobile Banking"
                                    value={`৳${parseFloat(advance?.paid_mobile).toLocaleString()}`}
                                    subValue={`Operator: ${advance?.mobile_operator || 'N/A'} ${advance?.transaction_id ? `| TxID: ${advance?.transaction_id}` : ''}`}
                                    color="purple"
                                />
                            )}
                            {Number(advance?.paid_bank) > 0 && (
                                <DetailsInfoCard icon={<FaUniversity/>} title="Bank Transfer"
                                                 value={`৳${parseFloat(advance?.paid_bank).toLocaleString()}`}
                                                 subValue={`A/C: ${advance?.bank_name || 'Direct Deposit'}`}
                                                 color="blue"/>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
                            <FaStickyNote className="text-amber-400 text-lg"/> Advance Reason
                        </h2>
                        <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-50/50 shadow-inner">
                            <p className="text-sm font-bold text-gray-600 italic leading-relaxed">
                                {advance?.reason || "No specific reason provided for this advance."}
                            </p>
                        </div>
                    </div>

                    <div
                        className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl text-white overflow-hidden relative group">
                        <div
                            className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                        <h2 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500 mb-8">Audit
                            Trail</h2>
                        <div className="space-y-8">
                            <div className="flex gap-5">
                                <div
                                    className="w-1.5 h-14 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Created
                                        At</p>
                                    <p className="text-base font-black">{new Date(advance?.request_date).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Status
                                        Verified</p>
                                    <p className="text-base font-black uppercase tracking-widest">
                                        {advance?.is_approved ? "Approved" : "Pending"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {advance?.approved_date && (
                            <div
                                className="mt-10 flex items-center gap-3 text-[10px] font-black text-green-400 uppercase tracking-[0.2em] border-2 border-green-400/20 bg-green-400/5 p-5 rounded-2xl justify-center">
                                <FaCheckCircle className="animate-pulse"/>
                                Approved on {new Date(advance?.approved_date).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {editOpen && (
                <UpdateSalaryAdvanceModal
                    isOpen={editOpen}
                    onClose={() => setEditOpen(false)}
                    onSuccess={handleEditSuccess}
                    advanceData={advance}
                />
            )}


            <SuccessModal
                isOpen={!!successData}
                onClose={() => setSuccessData(null)}
                title={successType === 'update' ? 'Advance Updated' : 'Advance Recorded'}
                subtitle="Transaction Completed Successfully"
                details={[
                    {label: "Employee", value: successData?.user_name},
                    {label: "Amount", value: `৳${Number(successData?.amount).toLocaleString()}`},
                    {
                        label: "Date",
                        value: new Date(successData?.request_date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })
                    }
                ]}
                onPrint={() => handlePrint(successData)}
                printText="Print Voucher"
            />
        </GenericModuleDetails>
    );
};

export default EmployeeSalaryAdvanceDetailsPage;
