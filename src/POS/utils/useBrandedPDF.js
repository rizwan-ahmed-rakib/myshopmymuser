// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
//
// /**
//  * @param {string} title - ডকুমেন্টের নাম (যেমন: 'SALARY PAYSLIP', 'PURCHASE INVOICE')
//  * @param {string} docNumber - ভাউচার বা ইনভয়েস নাম্বার (#১০১)
//  * @param {object} metaDetails - কাস্টমার/সাপ্লায়ার/এমপ্লয়ি ডিটেইলস
//  * @param {array} tableHeaders - টেবিলের হেডার কলামের নাম
//  * @param {array} tableBody - টেবিলের ভেতরের ডেটা/রো
//  * @param {object} summaryDetails - সাবটোটাল, ডিসকাউন্ট বা নেট পেয়াবেল হিসেব
//  */
// export const downloadBrandedPDF = ({
//   title,
//   docNumber,
//   metaDetails,
//   tableHeaders,
//   tableBody,
//   summaryDetails
// }) => {
//   const doc = new jsPDF({
//     orientation: "portrait",
//     unit: "mm",
//     format: "a4"
//   });
//
//   const pageWidth = doc.internal.pageSize.getWidth(); // A4 size: ~210mm
//
//   // ----------------------------------------------------
//   // ১. প্রিমিয়াম ব্র্যান্ড হেডার (Dark Gray/Slate Theme)
//   // ----------------------------------------------------
//   doc.setFillColor(31, 41, 55); // Gray-800 (#1f2937)
//   doc.rect(0, 0, pageWidth, 40, 'F'); // ৪০ মিলিমিটার চওড়া হেডার ব্যান্ড
//
//   // কোম্পানির নাম ও স্লোগান
//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(22);
//   doc.setFont("helvetica", "bold");
//   doc.text("MY SHOP POS", 14, 18); // [source: 16]
//
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text("Premium Inventory & Sales System", 14, 26); // [source: 16]
//
//   // ডানদিকের ডকুমেন্ট টাইটেল ও আইডি
//   doc.setFontSize(16);
//   doc.setFont("helvetica", "bold");
//   doc.text(title.toUpperCase(), pageWidth - 14, 18, { align: "right" }); // [source: 16]
//
//   doc.setFontSize(11);
//   doc.setFont("helvetica", "normal");
//   doc.text(`ID #: ${docNumber}`, pageWidth - 14, 26, { align: "right" });
//
//   // ----------------------------------------------------
//   // ২. মেটা ডিটেইলস গ্রিড (বাম পাশে প্রাইমারি এবং ডান পাশে সেকেন্ডারি ইনফো)
//   // ----------------------------------------------------
//   doc.setTextColor(55, 65, 81); // Gray-700
//   let currentY = 52;
//
//   // বাম পাশের ইনফো (যেমন: Employee/Supplier Details)
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "bold");
//   doc.text(metaDetails.leftTitle || "Details:", 14, currentY); // [source: 16]
//   doc.setFont("helvetica", "normal");
//
//   let leftLineY = currentY + 6;
//   metaDetails.leftItems.forEach(item => {
//     doc.text(item, 14, leftLineY);
//     leftLineY += 5;
//   });
//
//   // ডান পাশের ইনফো (যেমন: Date, Period)
//   doc.setFont("helvetica", "bold");
//   doc.text(metaDetails.rightTitle || "Info:", pageWidth - 14, currentY, { align: "right" }); // [source: 16]
//   doc.setFont("helvetica", "normal");
//
//   let rightLineY = currentY + 6;
//   metaDetails.rightItems.forEach(item => {
//     doc.text(item, pageWidth - 14, rightLineY, { align: "right" }); // [source: 16]
//     rightLineY += 5;
//   });
//
//   // পরবর্তী সেকশনের জন্য Y অক্ষের পজিশন আপডেট
//   currentY = Math.max(leftLineY, rightLineY) + 5;
//
//   // ----------------------------------------------------
//   // ৩. কোর ডেটা টেবিল (jspdf-autotable)
//   // ----------------------------------------------------
//   autoTable(doc, {
//     startY: currentY,
//     head: [tableHeaders], // যেমন: ['Description', 'Qty', 'Amount']
//     body: tableBody,      // আপনার পাঠানো ডাইনামিক ডেটা অ্যারে [source: 16]
//     headStyles: {
//       fillColor: [31, 41, 55], // হেডারের ব্যাকগ্রাউন্ড ব্র্যান্ড কালারের সাথে মিলবে
//       textColor: [255, 255, 255],
//       fontStyle: "bold"
//     }, // [source: 16]
//     alternateRowStyles: { fillColor: [249, 250, 251] }, // হালকা জেব্রা ক্রসিং ইফেক্ট [source: 16]
//     styles: { fontSize: 9, cellPadding: 4 }, // [source: 16]
//     margin: { left: 14, right: 14 }
//   });
//
//   // ----------------------------------------------------
//   // ৪. টোটাল/সামারি সেকশন (ডান পাশে সুন্দর এলাইনমেন্ট)
//   // ----------------------------------------------------
//   let finalY = doc.lastAutoTable.finalY + 10; // টেবিল যেখানে শেষ হয়েছে তার ঠিক নিচ থেকে শুরু [source: 16]
//   const summaryLeftCol = pageWidth - 100;
//   const summaryRightCol = pageWidth - 14;
//
//   if (summaryDetails && summaryDetails.length > 0) {
//     summaryDetails.forEach(row => {
//       doc.setFontSize(10);
//       doc.setFont("helvetica", row.isBold ? "bold" : "normal");
//
//       // কাস্টম কালার থাকলে সেট হবে, নাহলে ডিফল্ট ডার্ক গ্রে
//       if (row.color) {
//         doc.setTextColor(...row.color);
//       } else {
//         doc.setTextColor(31, 41, 55);
//       }
//
//       doc.text(row.label, summaryLeftCol, finalY);
//       doc.text(row.value, summaryRightCol, finalY, { align: "right" });
//
//       // যদি নিচের লাইনে বর্ডার দিতে বলা হয়
//       if (row.drawTopLine) {
//         doc.setLineWidth(0.3);
//         doc.setDrawColor(209, 213, 219); // Gray-300
//         doc.line(summaryLeftCol, finalY - 4, summaryRightCol, finalY - 4);
//       }
//
//       finalY += 6;
//     });
//   }
//
//   // ----------------------------------------------------
//   // ৫. প্রাতিষ্ঠানিক ফুটার এবং সিগনেচার এরিয়া
//   // ----------------------------------------------------
//   const pageHeight = doc.internal.pageSize.getHeight(); // A4 Height: ~297mm
//   const footerY = pageHeight - 25; // পেজের একদম নিচে থেকে ২৫ মিমি ওপরে
//
//   // ডাবল সিগনেচার লাইন
//   doc.setLineWidth(0.3);
//   doc.setDrawColor(156, 163, 175); // Gray-400
//   doc.line(14, footerY, 64, footerY); // বাম পাশের সিগনেচার লাইন
//   doc.line(pageWidth - 64, footerY, pageWidth - 14, footerY); // ডান পাশের সিগনেচার লাইন
//
//   doc.setFontSize(9);
//   doc.setTextColor(107, 114, 128); // Gray-500
//   doc.setFont("helvetica", "bold");
//   doc.text("Recipient Signature", 14, footerY + 5);
//   doc.text("Authorized Authority", pageWidth - 14, footerY + 5, { align: "right" });
//
//   // কপিরাইট বা সিস্টেম ফুটার টেক্সট
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(8);
//   doc.setTextColor(156, 163, 175); // Gray-400
//   doc.text("Computer Generated Document - Powered by MY SHOP POS", pageWidth / 2, pageHeight - 10, { align: "center" }); // [source: 16]
//
//   // পিডিএফ ফাইলটি ডাউনলোড করুন
//   doc.save(`${title.replace(/\s+/g, '_')}_#${docNumber}.pdf`);
// };



import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * @param {object} companySettings - কোম্পানির সেটিংস (নাম, ঠিকানা, লোগো ইত্যাদি)
 * @param {string} title - ডকুমেন্টের নাম
 * @param {string} docNumber - ইনভয়েস নাম্বার
 * @param {object} metaDetails - কাস্টমার/সাপ্লায়ার/এমপ্লয়ি ডিটেইলস
 * @param {array} tableHeaders - টেবিলের হেডার
 * @param {array} tableBody - টেবিলের ডেটা
 * @param {object} summaryDetails - সামারি
 */

export const downloadBrandedPDF = ({
  title,
  docNumber,
  metaDetails,
  tableHeaders,
  tableBody,
  summaryDetails
}) => {
  // লোকাল স্টোরেজ থেকে ডাইনামিক সেটিংস নেওয়া
  const settingsRaw = localStorage.getItem('pos_settings');
  const companySettings = settingsRaw ? JSON.parse(settingsRaw) : {};

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // ওয়াটারমার্ক সেটআপ (হালকা স্বচ্ছতায় মাঝখানে লোগো)
  if (companySettings.company_logo) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setGState(new doc.GState({ opacity: 0.05 })); // ওয়াটারমার্কের স্বচ্ছতা বাড়ানো
    doc.addImage(companySettings.company_logo, 'PNG', pageWidth / 6, pageHeight / 3, pageWidth / 1.5, pageWidth / 1.5);
    doc.setGState(new doc.GState({ opacity: 1.0 })); // স্বচ্ছতা স্বাভাবিক করা
  }

  const pageWidth = doc.internal.pageSize.getWidth();

  // ১. হেডার ব্যান্ড
  doc.setFillColor(31, 41, 55);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // হেডারে পরিষ্কার লোগো বসানো (উপরে বামে)
  if (companySettings.company_logo) {
    doc.addImage(companySettings.company_logo, 'PNG', 14, 5, 30, 30); // লোগোর অবস্থান ও সাইজ
  }

  // কোম্পানির তথ্য (লোগোর ডানপাশে)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  // যদি লোগো থাকে, টেক্সট একটু ডানে সরানো হলো
  const textX = companySettings.company_logo ? 50 : 14; 
  doc.text(companySettings.company_name || "MY SHOP POS", textX, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Premium Inventory & Sales System", textX, 26);

  // ডানদিকের ডকুমেন্ট টাইটেল ও আইডি
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(title.toUpperCase(), pageWidth - 14, 18, { align: "right" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`ID #: ${docNumber}`, pageWidth - 14, 26, { align: "right" });

  // ----------------------------------------------------
  // কোম্পানির কন্টাক্ট ও অ্যাড্রেস বার
  // ----------------------------------------------------
  doc.setFillColor(243, 244, 246);
  doc.rect(0, 40, pageWidth, 12, 'F');

  doc.setTextColor(75, 85, 99);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");

  const companyAddress = companySettings?.company_address || "Address not provided";
  const companyContact = `Phone: ${companySettings?.company_phone || "N/A"}   |   Email: ${companySettings?.company_email || "N/A"}`;

  doc.text(companyAddress, 14, 47.5);
  doc.text(companyContact, pageWidth - 14, 47.5, { align: "right" });

  // ----------------------------------------------------
  // ২. মেটা ডিটেইলস গ্রিড (Y পজিশন এখন শুরু হবে ৬০ থেকে)
  // ----------------------------------------------------
  doc.setTextColor(55, 65, 81);
  let currentY = 60;

  // বাম পাশের ইনফো
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(metaDetails.leftTitle || "Details:", 14, currentY);
  doc.setFont("helvetica", "normal");

  let leftLineY = currentY + 6;
  metaDetails.leftItems.forEach(item => {
    doc.text(item, 14, leftLineY);
    leftLineY += 5;
  });

  // ডান পাশের ইনফো
  doc.setFont("helvetica", "bold");
  doc.text(metaDetails.rightTitle || "Info:", pageWidth - 14, currentY, { align: "right" });
  doc.setFont("helvetica", "normal");

  let rightLineY = currentY + 6;
  metaDetails.rightItems.forEach(item => {
    doc.text(item, pageWidth - 14, rightLineY, { align: "right" });
    rightLineY += 5;
  });

  currentY = Math.max(leftLineY, rightLineY) + 5;

  // ----------------------------------------------------
  // ৩. কোর ডেটা টেবিল
  // ----------------------------------------------------
  autoTable(doc, {
    startY: currentY,
    head: [tableHeaders],
    body: tableBody,
    headStyles: {
      fillColor: [31, 41, 55],
      textColor: [255, 255, 255],
      fontStyle: "bold"
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    styles: { fontSize: 9, cellPadding: 4 },
    margin: { left: 14, right: 14 }
  });

  // ----------------------------------------------------
  // ৪. টোটাল/সামারি সেকশন
  // ----------------------------------------------------
  let finalY = doc.lastAutoTable.finalY + 10;
  const summaryLeftCol = pageWidth - 100;
  const summaryRightCol = pageWidth - 14;

  if (summaryDetails && summaryDetails.length > 0) {
    summaryDetails.forEach(row => {
      doc.setFontSize(10);
      doc.setFont("helvetica", row.isBold ? "bold" : "normal");

      if (row.color) {
        doc.setTextColor(...row.color);
      } else {
        doc.setTextColor(31, 41, 55);
      }

      doc.text(row.label, summaryLeftCol, finalY);
      doc.text(row.value, summaryRightCol, finalY, { align: "right" });

      if (row.drawTopLine) {
        doc.setLineWidth(0.3);
        doc.setDrawColor(209, 213, 219);
        doc.line(summaryLeftCol, finalY - 4, summaryRightCol, finalY - 4);
      }

      finalY += 6;
    });
  }

  // ----------------------------------------------------
  // ৫. ফুটার এবং সিগনেচার এরিয়া
  // ----------------------------------------------------
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerY = pageHeight - 25;

  doc.setLineWidth(0.3);
  doc.setDrawColor(156, 163, 175);
  doc.line(14, footerY, 64, footerY);
  doc.line(pageWidth - 64, footerY, pageWidth - 14, footerY);

  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "bold");
  doc.text("Recipient Signature", 14, footerY + 5);
  doc.text("Authorized Authority", pageWidth - 14, footerY + 5, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text("Computer Generated Document - Powered by MY SHOP POS", pageWidth / 2, pageHeight - 10, { align: "center" });

  doc.save(`${title.replace(/\s+/g, '_')}_#${docNumber}.pdf`);
};