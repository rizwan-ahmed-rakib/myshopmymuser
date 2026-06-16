import React, {useState, useEffect, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    FaMoneyBillWave, FaMobileAlt, FaUniversity,
    FaStickyNote, FaRegCalendarAlt, FaCheckCircle,
    FaUserTie, FaCalendarCheck, FaCoins, FaFilePdf
} from "react-icons/fa";
import {employeeLoanAPI} from "../../../context_or_provider/pos/EmployeeLoan/employee_loanAPI";
import UpdateEmployeeLoanModal from "./UpdateEmployeeLoanModal";

// সেন্ট্রাল আর্কিটেকচার ইমপোর্ট
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import {getBrandedVoucher} from "../../utils/printTemplates";
import {getLoanPrintLayout} from "./LoanPrintLayout";
import {downloadEmployeeLoanPDF} from "./useEmployeeLoanPDF";
import {downloadPayslipPDF} from "../EmployeeSalaryPayslip/usePayslipPDF";
import {AiFillDelete} from "react-icons/ai";

const EmployeeLoanDetailsPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [loan, setLoan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);

    const fetchLoan = useCallback(async () => {
        try {
            const res = await employeeLoanAPI.getById(id);
            setLoan(res.data);
        } catch (err) {
            console.error("Error fetching loan details:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchLoan();
    }, [fetchLoan]);

    const handleEditSuccess = (updatedData) => {
        setLoan(updatedData);
        setEditOpen(false);
    };

    // ব্রাউজার প্রিন্ট লজিক
    const handlePrint = () => {
        if (!loan) return;
        const printLayoutContent = getLoanPrintLayout(loan);
        const fullHTML = getBrandedVoucher("Loan Disbursement Voucher", printLayoutContent, loan.id, "#2563eb");
        const printWindow = window.open("", "_blank");
        printWindow.document.write(fullHTML);
        printWindow.document.close();
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete this loan for ${loan?.user_name}?`)) return;
        try {
            await employeeLoanAPI.delete(id);
            alert("loan deleted successfully!");
            navigate(-1); // Go back to the list
        } catch (error) {
            console.error("Failed to delete:", error);
            alert("Failed to delete the loan.");
        }
    };

    return (
        <GenericModuleDetails
            title="Loan Disbursement"
            subtitle="Employee Loan Management"
            image={loan?.user_image
                // ? `${BASE_URL_of_POS}${payslip?.user_image}`
                ? `${loan?.user_image}`
                : null}
            imageAlt={loan?.user_name}
            imageFallback="https://ui-avatars.com/api/?name=John"
            recordId={loan?.id}
            amount={parseFloat(loan?.amount || 0).toLocaleString()}
            amountLabel="Principal Amount Issued"
            isLoading={loading}
            printText="Print Voucher"
            onPrint={handlePrint}
            onEdit={() => setEditOpen(true)}
            headerColor="bg-slate-900"
            accentColor="blue"
            statusBadge={
                <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${loan?.is_fully_paid ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
          {loan?.is_fully_paid ? "Fully Repaid" : "Active Loan"}
        </span>
            }
            // actionButtons={[
            //   {
            //     title: "Download PDF",
            //     icon: <FaFilePdf size={16} />,
            //     onClick: () => downloadEmployeeLoanPDF(loan),
            //     hoverClass: "hover:bg-red-50 hover:text-red-600 border-red-100"
            //   }
            // ]}


            actions={[
                {
                    icon: <FaFilePdf size={16}/>,
                    label: "Download PDF",
                    // onClick: handlePDFDownloadAction,
                    onClick: () => downloadEmployeeLoanPDF(loan), // আমাদের তৈরি করা নিখুঁত ইঞ্জিনটি কল হবে
                    // onClick: handleDownloadPDF, // এখানে বাটন ক্লিক ট্রিগার হচ্ছে
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
            <div className="grid lg:grid-cols-3 gap-8 mt-8">
                {/* বাম দিকের কন্টেন্ট গ্রিড */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <DetailsInfoCard
                            icon={<FaUserTie/>}
                            title="Employee Name"
                            value={loan?.user_name || "N/A"}
                            subValue={loan?.user_designation || "Staff Member"}
                            color="blue"
                        />
                        <DetailsInfoCard
                            icon={<FaCoins/>}
                            title="Monthly Deduction"
                            value={`৳${parseFloat(loan?.monthly_repayment_amount || 0).toLocaleString()}`}
                            subValue="Automated Salary Adjustment"
                            color="amber"
                        />
                    </div>

                    {/* Disbursement Breakdown সেকশন */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/80">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-black text-xl uppercase tracking-tighter flex items-center gap-3">
                                <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                                Disbursement Breakdown
                            </h2>
                            <span
                                className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600">
                {loan?.payment_method?.replace('_', ' ')}
              </span>
                        </div>

                        <div className="grid gap-4">
                            {Number(loan?.paid_cash) > 0 && (
                                <div
                                    className="flex items-center justify-between p-5 bg-emerald-50/30 rounded-2xl border border-emerald-100">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                                            <FaMoneyBillWave/></div>
                                        <div>
                                            <p className="font-black text-sm text-slate-900">Cash Payout</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hand-to-hand
                                                currency</p>
                                        </div>
                                    </div>
                                    <span
                                        className="font-black text-lg text-emerald-700 font-mono">৳{parseFloat(loan.paid_cash).toLocaleString()}</span>
                                </div>
                            )}

                            {Number(loan?.paid_mobile) > 0 && (
                                <div
                                    className="flex items-center justify-between p-5 bg-purple-50/30 rounded-2xl border border-purple-100">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                                            <FaMobileAlt/></div>
                                        <div>
                                            <p className="font-black text-sm text-slate-900">Mobile Transfer</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operator: {loan.mobile_operator || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className="font-black text-lg text-purple-700 font-mono block">৳{parseFloat(loan.paid_mobile).toLocaleString()}</span>
                                        {loan.transaction_id && <span
                                            className="text-[9px] font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded uppercase tracking-tighter">TxID: {loan.transaction_id}</span>}
                                    </div>
                                </div>
                            )}

                            {Number(loan?.paid_bank) > 0 && (
                                <div
                                    className="flex items-center justify-between p-5 bg-blue-50/30 rounded-2xl border border-blue-100">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                            <FaUniversity/></div>
                                        <div>
                                            <p className="font-black text-sm text-slate-900">Bank Settlement</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">A/C: {loan.bank_name || 'Direct Deposit'}</p>
                                        </div>
                                    </div>
                                    <span
                                        className="font-black text-lg text-blue-700 font-mono">৳{parseFloat(loan.paid_bank).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ডানদিকের সাইডবার কন্টেন্ট */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/80">
                        <h2 className="font-black text-sm uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                            <FaStickyNote className="text-amber-500"/> Loan Purpose
                        </h2>
                        <div className="bg-amber-50/40 p-6 rounded-2xl border border-amber-100">
                            <p className="text-sm font-medium text-slate-700 italic leading-relaxed">
                                {loan?.reason || "No specific purpose provided for this loan."}
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500 mb-6">Record
                            Audit</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-1 h-12 bg-blue-500 rounded-full"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-blue-400">Created At</p>
                                    <p className="text-sm font-bold">{loan ? new Date(loan.loan_date).toLocaleString() : "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1 h-12 bg-green-500 rounded-full"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-green-400">Timeline Dates</p>
                                    <p className="text-sm font-bold flex flex-col gap-0.5">
                                        <span>Issue: {loan ? new Date(loan.loan_date).toLocaleDateString() : "N/A"}</span>
                                        <span>Start: {loan ? new Date(loan.repayment_start_date).toLocaleDateString() : "N/A"}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {editOpen && (
                <UpdateEmployeeLoanModal
                    isOpen={editOpen}
                    onClose={() => setEditOpen(false)}
                    onSuccess={handleEditSuccess}
                    advanceData={loan}
                />
            )}
        </GenericModuleDetails>
    );
};

export default EmployeeLoanDetailsPage;