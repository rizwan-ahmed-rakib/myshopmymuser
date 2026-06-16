import { downloadBrandedPDF } from "../../utils/useBrandedPDF";

/**
 * downloadEmployeeLoanPDF - Generates a branded PDF for Employee Loan Vouchers.
 *
 * @param {Object} loan - The loan data object from database
 */
export const downloadEmployeeLoanPDF = (loan) => {
  if (!loan) return;

  // ১. টেবিলের বডি তৈরি করা (কন্ডিশনাল ব্রেকডাউন লজিক)
  const bodyData = [];

  if (Number(loan.paid_cash) > 0) {
    bodyData.push([
      "Cash Disbursement (Hand-to-hand currency)",
      "CASH",
      `৳ ${parseFloat(loan.paid_cash).toLocaleString()}`
    ]);
  }
  if (Number(loan.paid_mobile) > 0) {
    const txInfo = loan.transaction_id ? ` (TxID: ${loan.transaction_id})` : '';
    bodyData.push([
      `Mobile Transfer - Operator: ${loan.mobile_operator || 'N/A'}${txInfo}`,
      "MOBILE",
      `৳ ${parseFloat(loan.paid_mobile).toLocaleString()}`
    ]);
  }
  if (Number(loan.paid_bank) > 0) {
    bodyData.push([
      `Bank Settlement - A/C: ${loan.bank_name || 'Direct Deposit'}`,
      "BANK",
      `৳ ${parseFloat(loan.paid_bank).toLocaleString()}`
    ]);
  }

  // যদি কোনো ব্রেকডাউন না থাকে তবে ডিফল্ট রো
  if (bodyData.length === 0) {
    bodyData.push([
      loan.reason || "Employee Loan Disbursement",
      loan.payment_method ? loan.payment_method.toUpperCase().replace('_', ' ') : "N/A",
      `৳ ${parseFloat(loan.amount || 0).toLocaleString()}`
    ]);
  }

  // ২. মাস্টার ব্যাকবোন ইঞ্জিনে ডাটা অবজেক্ট পাঠানো
  downloadBrandedPDF({
    title: "Loan Disbursement Voucher",
    docNumber: loan.id,

    metaDetails: {
      leftTitle: "Employee Details:",
      leftItems: [
        `Name: ${loan.user_name || "N/A"}`,
        `Designation: ${loan.user_designation || "Staff Member"}`
      ],
      rightTitle: "Loan Timeline:",
      rightItems: [
        `Loan Date: ${new Date(loan.loan_date).toLocaleDateString('en-GB')}`,
        `Repayment Starts: ${new Date(loan.repayment_start_date).toLocaleDateString('en-GB')}`,
        `Status: ${loan.is_fully_paid ? "Fully Repaid" : "Active Loan"}`
      ]
    },

    tableHeaders: ["Description", "Method", "Amount"],
    tableBody: bodyData,

    // ৩. রিপেমেন্ট টার্মস ও টোটাল সামারি সেকশন (লোন ভাউচারের স্পেশাল থিম কালার ব্লু [37, 99, 235] ব্যবহার করা হয়েছে)
    summaryDetails: [
      {
        label: "Monthly Installment:",
        value: `৳ ${parseFloat(loan.monthly_repayment_amount || 0).toLocaleString()}`,
        isBold: false
      },
      {
        label: "TOTAL LOAN DISBURSED:",
        value: `৳ ${parseFloat(loan.amount || 0).toLocaleString()}`,
        isBold: true,
        color: [37, 99, 235], // Blue-600 RGB কালার কোড
        drawTopLine: true
      }
    ]
  });
};