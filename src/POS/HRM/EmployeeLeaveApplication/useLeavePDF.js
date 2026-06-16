import { downloadBrandedPDF } from "../../utils/useBrandedPDF";

/**
 * downloadLeavePDF - Generates a branded PDF for Leave Applications.
 * Matches the backbone architecture's premium document style.
 *
 * @param {Object} leave - The leave application data object
 */
export const downloadLeavePDF = (leave) => {
  if (!leave) return;

  // Formatting applied date
  const appliedDate = (leave.applied_on || leave.request_date)
    ? new Date(leave.applied_on || leave.request_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'N/A';

  // Preparing table data
  const bodyData = [
    ["Leave Category", leave.leave_type || "N/A"],
    ["Start Date", new Date(leave.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })],
    ["End Date", new Date(leave.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })],
    ["Duration", `${Math.ceil((new Date(leave.end_date) - new Date(leave.start_date)) / (1000 * 60 * 60 * 24)) + 1} Days`],
    ["Reason", leave.reason || "No specific reason provided."]
  ];

  // Using the Master Backbone PDF Engine
  downloadBrandedPDF({
    title: "Leave Application",
    docNumber: leave.id,

    metaDetails: {
      leftTitle: "Employee Information:",
      leftItems: [
        `Name: ${leave.user_name || "N/A"}`,
        `Designation: ${leave.user_designation || "Staff Member"}`
      ],
      rightTitle: "Application Timeline:",
      rightItems: [
        `Applied On: ${appliedDate}`,
        `Status: ${(leave.status || (leave.is_approved ? 'Approved' : 'Pending')).toUpperCase()}`,
        `Approved By: ${leave.approved_by_name || "Pending Review"}`
      ]
    },

    // Table Configuration
    tableHeaders: ["Detail Field", "Information"],
    tableBody: bodyData,

    // Summary/Footer details (Using Amber theme color for Leave: #f59e0b)
    summaryDetails: [
      {
        label: "TOTAL DAYS REQUESTED:",
        value: `${Math.ceil((new Date(leave.end_date) - new Date(leave.start_date)) / (1000 * 60 * 60 * 24)) + 1} Days`,
        isBold: true,
        color: [245, 158, 11], // Amber-500 RGB
        drawTopLine: true
      }
    ]
  });
};
