import React, {useState, useEffect, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    FaMoneyBillWave, FaMobileAlt, FaUniversity,
    FaCalendarAlt, FaStickyNote, FaRegCalendarAlt,
    FaUserTie, FaPlusCircle, FaMinusCircle, FaWallet, FaFilePdf
} from "react-icons/fa";
import api from '../../../context_or_provider/pos/posApi';

import UpdateEmployeeSalaryPayslipModal from "./UpdateEmployeeSalaryPayslipModal";
import {getBrandedVoucher} from "../../utils/printTemplates";
import {getPayslipPrintLayout} from "./PayslipPrintLayout";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import SuccessModal from "../../components/SuccessModal";
import {FaDeleteLeft} from "react-icons/fa6";
import {downloadPayslipPDF} from "./usePayslipPDF";
import {salaryPayslipAPI} from "../../../context_or_provider/pos/EmployeeSalaryPayslip/salary_payslipAPI";
import {DeleteIcon} from "lucide-react";
import {AiFillDelete, AiOutlineDelete} from "react-icons/ai";


const EmployeeSalaryPayslipDetailsPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [payslip, setPayslip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState('update');

    const fetchPayslip = useCallback(async () => {
        try {
            const res = await api.get(`/api/users/payslips/${id}/`);
            setPayslip(res.data);
        } catch (err) {
            console.error("Error fetching payslip details:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPayslip();
    }, [fetchPayslip]);

    const handleEditSuccess = async () => {
        setEditOpen(false);
        try {
            const res = await api.get(`/api/users/payslips/${id}/`);
            setPayslip(res.data);
            setSuccessType('update');
            setSuccessData(res.data);
        } catch (error) {
            console.error("Error fetching updated data:", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete this payslip for ${payslip?.user_name}?`)) return;
        try {
            await salaryPayslipAPI.delete(id);
            alert("Payslip deleted successfully!");
            navigate(-1); // Go back to the list
        } catch (error) {
            console.error("Failed to delete:", error);
            alert("Failed to delete the payslip.");
        }
    };


    const handlePrint = (printData = payslip) => {
        if (!printData) return;
        const tableContent = getPayslipPrintLayout(printData);
        const fullHTML = getBrandedVoucher("Salary Payslip", tableContent, printData.id, "#2563eb");
        const printWindow = window.open("", "_blank", "width=850,height=900");
        printWindow.document.write(fullHTML);
        printWindow.document.close();
    };


    return (
        <GenericModuleDetails
            title="Salary Payslip"
            subtitle={`${new Date(0, (payslip?.month || 1) - 1).toLocaleString('default', {month: 'long'})} ${payslip?.year}`}
            image={payslip?.user_image
                // ? `${BASE_URL_of_POS}${payslip?.user_image}`
                ? `${payslip?.user_image}`
                : null}
            imageAlt={payslip?.user_name}
            imageFallback="https://ui-avatars.com/api/?name=John"
            recordId={payslip?.id}
            amount={parseFloat(payslip?.net_salary || 0).toLocaleString()}
            amountLabel="Net Salary Paid"
            isLoading={loading}
            onPrint={handlePrint}
            onEdit={() => setEditOpen(true)}
            printText="Print Payslip"
            editText="Edit Payslip"
            accentColor="blue"
            infoItems={[
                {
                    icon: <FaRegCalendarAlt/>,
                    label: "Paid On",
                    value: new Date(payslip?.payment_date).toLocaleDateString()
                },
                {icon: <FaUserTie/>, label: "Employee", value: payslip?.user_name}
            ]}
            actions={[
                {
                    icon: <FaFilePdf size={16}/>,
                    label: "Download PDF",
                    // onClick: handlePDFDownloadAction,
                    onClick: () => downloadPayslipPDF(payslip), // আমাদের তৈরি করা নিখুঁত ইঞ্জিনটি কল হবে
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
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Earnings & Deductions */}
                    <div className="grid sm:grid-cols-3 gap-6">
                        <DetailsInfoCard variant="simple" title="Basic Salary"
                                         value={`৳${parseFloat(payslip?.basic_salary || 0).toLocaleString()}`}
                                         icon={<FaWallet/>} color="gray"/>
                        <DetailsInfoCard variant="simple" title="Allowances (+)"
                                         value={`৳${parseFloat(payslip?.allowances || 0).toLocaleString()}`}
                                         icon={<FaPlusCircle/>} color="emerald"/>
                        <DetailsInfoCard variant="simple" title="Deductions (-)"
                                         value={`৳${parseFloat(payslip?.deductions || 0).toLocaleString()}`}
                                         icon={<FaMinusCircle/>} color="rose"/>
                    </div>

                    <div
                        className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                        <div
                            className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-10">
                            <div className="w-2 h-10 bg-purple-500 rounded-full shadow-lg shadow-purple-500/20"></div>
                            Payout Breakdown
                        </h2>

                        <div className="grid gap-4">
                            {Number(payslip?.paid_cash) > 0 && (
                                <DetailsInfoCard icon={<FaMoneyBillWave/>} title="Cash Payment"
                                                 value={`৳${parseFloat(payslip?.paid_cash).toLocaleString()}`}
                                                 subValue="Hand-to-hand payout" color="emerald"/>
                            )}
                            {Number(payslip?.paid_mobile) > 0 && (
                                <DetailsInfoCard
                                    icon={<FaMobileAlt/>}
                                    title="Mobile Transfer"
                                    value={`৳${parseFloat(payslip?.paid_mobile).toLocaleString()}`}
                                    subValue={`Operator: ${payslip?.mobile_operator || 'N/A'} ${payslip?.transaction_id ? `| TxID: ${payslip?.transaction_id}` : ''}`}
                                    color="purple"
                                />
                            )}
                            {Number(payslip?.paid_bank) > 0 && (
                                <DetailsInfoCard icon={<FaUniversity/>} title="Bank Transfer"
                                                 value={`৳${parseFloat(payslip?.paid_bank).toLocaleString()}`}
                                                 subValue={`A/C: ${payslip?.bank_name || 'Direct Deposit'}`}
                                                 color="blue"/>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
                            <FaStickyNote className="text-amber-400 text-lg"/> Salary Note
                        </h2>
                        <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-50/50 shadow-inner">
                            <p className="text-sm font-bold text-gray-600 italic leading-relaxed">
                                {payslip?.note || "No additional remarks provided for this payslip."}
                            </p>
                        </div>
                    </div>

                    <div
                        className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl text-white overflow-hidden relative group">
                        <div
                            className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">Disbursement
                            Info</h2>
                        <div className="space-y-8">
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Processed
                                        On</p>
                                    <p className="text-base font-black">{new Date(payslip?.payment_date).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div
                                    className="w-1.5 h-14 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Salary
                                        Method</p>
                                    <p className="text-base font-black uppercase tracking-widest">{payslip?.payment_method?.replace('_', ' ')}</p>
                                </div>
                            </div>
                        </div>
                        <div
                            className="mt-10 flex items-center gap-3 text-[10px] font-black text-green-400 uppercase tracking-[0.2em] border-2 border-green-400/20 bg-green-400/5 p-5 rounded-2xl justify-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                            Official Disbursement
                        </div>
                    </div>
                </div>
            </div>

            {editOpen && (
                <UpdateEmployeeSalaryPayslipModal
                    isOpen={editOpen}
                    onClose={() => setEditOpen(false)}
                    onSuccess={handleEditSuccess}
                    advanceData={payslip}
                />
            )}

            <SuccessModal
                isOpen={!!successData}
                onClose={() => setSuccessData(null)}
                title={successType === 'update' ? 'Payslip Updated' : 'Salary Disbursed'}
                subtitle="Transaction Completed Successfully"
                details={[
                    {label: "Employee", value: successData?.user_name},
                    {label: "Net Salary", value: `৳${Number(successData?.net_salary).toLocaleString()}`},
                    {
                        label: "Period",
                        value: successData ? `${new Date(0, (successData?.month || 1) - 1).toLocaleString('default', {month: 'long'})} ${successData?.year}` : ""
                    }
                ]}
                onPrint={() => handlePrint(successData)}
                printText="Print Payslip"
            />
        </GenericModuleDetails>
    );
};

export default EmployeeSalaryPayslipDetailsPage;
