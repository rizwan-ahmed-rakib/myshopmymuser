/**
 * getLeavePrintLayout - Generates the specific table for Leave Application.
 * Using unified classes from printTemplates.js
 * 
 * @param {Object} leave - The leave application data object
 * @returns {string} - HTML string of the leave details content
 */
export const getLeavePrintLayout = (leave) => {
    const isApproved = leave.status === "approved" || leave.is_approved;
    
    return `
        <div class="info-grid">
            <div class="info-section">
                <h3>Employee Details</h3>
                <p>${leave.user_name}</p>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">${leave.user_designation || 'Staff Member'}</div>
            </div>
            <div class="info-section" style="text-align: right;">
                <h3>Application Status</h3>
                <p style="color: ${isApproved ? '#059669' : '#d97706'};">${leave.status?.toUpperCase() || (isApproved ? 'APPROVED' : 'PENDING')}</p>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">Applied On: ${new Date(leave.applied_on || leave.request_date).toLocaleDateString()}</div>
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Leave Information</th>
                    <th style="text-align: right;">Details</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Leave Type</td>
                    <td style="text-align: right; font-weight: 700;">${leave.leave_type}</td>
                </tr>
                <tr>
                    <td>Start Date</td>
                    <td style="text-align: right;">${new Date(leave.start_date).toLocaleDateString()}</td>
                </tr>
                <tr>
                    <td>End Date</td>
                    <td style="text-align: right;">${new Date(leave.end_date).toLocaleDateString()}</td>
                </tr>
                <tr>
                    <td>Duration</td>
                    <td style="text-align: right; font-weight: 700;">
                        ${Math.ceil((new Date(leave.end_date) - new Date(leave.start_date)) / (1000 * 60 * 60 * 24)) + 1} Days
                    </td>
                </tr>
            </tbody>
        </table>

        <div style="margin-top: 40px; border-top: 2px solid #111827; padding-top: 20px;">
            <h3 style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #6b7280; margin-bottom: 10px;">Reason for Leave</h3>
            <div style="font-size: 14px; line-height: 1.6; color: #374151; background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #d1d5db;">
                ${leave.reason || 'No specific reason provided.'}
            </div>
        </div>

        ${leave.approved_by_name ? `
        <div style="margin-top: 20px; text-align: right;">
            <p style="font-size: 11px; color: #6b7280; margin: 0;">Approved By:</p>
            <p style="font-size: 14px; font-weight: 800; color: #111827; margin: 0;">${leave.approved_by_name}</p>
        </div>
        ` : ''}
    `;
};
