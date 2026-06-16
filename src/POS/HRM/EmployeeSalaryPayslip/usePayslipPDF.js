import {downloadBrandedPDF} from "../../utils/useBrandedPDF";

export const downloadPayslipPDF = (payslip) => {
  if (!payslip) return;

  const monthName = new Date(0, payslip.month - 1).toLocaleString('default', { month: 'long' });

  // ব্যাকবোন ইঞ্জিনের রিকোয়ারমেন্ট অনুযায়ী ডাটা ম্যাপিং
  downloadBrandedPDF({
    title: "Salary Payslip",
    docNumber: payslip.id,
    metaDetails: {
      leftTitle: "Employee Details:",
      leftItems: [
        `Name: ${payslip.user_name || "N/A"}`,
        `Designation: ${payslip.user_designation || "Staff"}`
      ],
      rightTitle: "Salary Info:",
      rightItems: [
        `Salary Period: ${monthName} ${payslip.year}`,
        `Payment Date: ${payslip.payment_date ? new Date(payslip.payment_date).toLocaleDateString() : "N/A"}`
      ]
    },
    tableHeaders: ["Salary Component Breakdown", "Amount (BDT)"],
    tableBody: [
      ["Basic Salary Balance", `TK ${parseFloat(payslip.basic_salary || 0).toLocaleString()}`],
      ["Total Allowances (+)", `TK ${parseFloat(payslip.allowances || 0).toLocaleString()}`],
      ["Total Deductions (-)", `TK ${parseFloat(payslip.deductions || 0).toLocaleString()}`]
    ],
    summaryDetails: [
      {
        label: "NET PAID AMOUNT:",
        value: `TK ${parseFloat(payslip.net_salary || 0).toLocaleString()}`,
        isBold: true,
        color: [29, 78, 216], // প্রিমিয়াম ব্লু হাইলাইট
        drawTopLine: true
      },
      {
        label: "Payment Method:",
        value: payslip.payment_method ? payslip.payment_method.toUpperCase().replace('_', ' ') : "N/A",
        isBold: false
      }
    ]
  });
};