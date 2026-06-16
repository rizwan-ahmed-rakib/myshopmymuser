import { downloadBrandedPDF } from "../../utils/useBrandedPDF";

/**
 * downloadSalaryAdvancePDF - Generates a branded PDF for Salary Advance requests.
 * Matches the breakdown logic and styling of the print layout.
 *
 * @param {Object} advance - The advance data object from database
 */
export const downloadSalaryAdvancePDF = (advance) => {
  if (!advance) return;

  // ১. মেটা ডিটেইলসের জন্য ডেট ফরম্যাট করা (যেমন: 02 June 2026)
  const requestDate = advance.request_date
    ? new Date(advance.request_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'N/A';

  // ২. টেবিলের বেস ডাটা রো তৈরি করা (মেইন পারপাস ও মেথড)
  const bodyData = [
    [
      advance.reason || 'Salary Advance Payment',
      advance.payment_method ? advance.payment_method.toUpperCase().replace('_', ' ') : 'N/A',
      `৳ ${parseFloat(advance.amount || 0).toLocaleString()}`
    ]
  ];

  // ৩. প্রিন্ট লেআউটের কন্ডিশনাল "Disbursement Breakdown" লজিক
  // অ্যামাউন্ট ০ থেকে বড় হলেই কেবল সাব-রো হিসেবে টেবিলে পুশ হবে
  if (Number(advance.paid_cash) > 0) {
    bodyData.push([
      "   └  Cash Payout Breakdown",
      "CASH",
      `৳ ${parseFloat(advance.paid_cash).toLocaleString()}`
    ]);
  }
  if (Number(advance.paid_mobile) > 0) {
    bodyData.push([
      `   └  Mobile Payout Breakdown (${advance.mobile_operator || 'Mobile'})`,
      "MOBILE",
      `৳ ${parseFloat(advance.paid_mobile).toLocaleString()}`
    ]);
  }
  if (Number(advance.paid_bank) > 0) {
    bodyData.push([
      `   └  Bank Payout Breakdown (${advance.bank_name || 'Bank'})`,
      "BANK",
      `৳ ${parseFloat(advance.paid_bank).toLocaleString()}`
    ]);
  }

  // ৪. মাস্টার ব্যাকবোন ইঞ্জিনকে ডাইনামিক ডাটা অবজেক্ট পাঠানো
  downloadBrandedPDF({
    title: "Salary Advance",
    docNumber: advance.id,

    metaDetails: {
      leftTitle: "Employee Details:",
      leftItems: [
        `Name: ${advance.user_name || "N/A"}`,
        `Designation: ${advance.user_designation || advance.user_drsignation || "Staff Member"}` // ডাটাবেজের স্পেলিং মিসটেক হ্যান্ডলিং সহ
      ],
      rightTitle: "Payment Timeline:",
      rightItems: [
        `Request Date: ${requestDate}`,
        `Status: ${advance.is_approved ? 'Approved' : 'Pending'}`
      ]
    },

    // টেবিল কনফিগারেশন
    tableHeaders: ["Description / Purpose", "Method", "Amount"],
    tableBody: bodyData,

    // সামারি সেকশন (আপনার প্রিন্ট লেআউটের গ্রিন থিম কালার কোড #10b981 ব্যবহার করা হয়েছে)
    summaryDetails: [
      {
        label: "TOTAL ADVANCE DISBURSED:",
        value: `৳ ${parseFloat(advance.amount || 0).toLocaleString()}`,
        isBold: true,
        color: [16, 185, 129], // Green-500 RGB কালার কোড
        drawTopLine: true
      }
    ]
  });
};