/**
 * getAdvancePrintLayout - Generates the specific table for Salary Advance.
 * Using unified classes from printTemplates.js
 * 
 * @param {Object} employee - The advance data object
 * @returns {string} - HTML string of the advance table content
 */
export const getAdvancePrintLayout = (employee) => {
    return `
        <div class="info-grid">
            <div class="info-section">
                <h3>Employee Details</h3>
                <p>${employee.user_name}</p>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">${employee.user_designation || employee.user_drsignation || 'Staff Member'}</div>
            </div>
            <div class="info-section" style="text-align: right;">
                <h3>Payment Timeline</h3>
                <p>${new Date(employee.request_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">Status: ${employee.is_approved ? 'Approved' : 'Pending'}</div>
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Description / Purpose</th>
                    <th>Method</th>
                    <th style="text-align: right;">Amount (৳)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="font-weight: 700;">${employee.reason || 'Salary Advance Payment'}</td>
                    <td><span style="font-size: 10px; font-weight: 900; color: #6b7280; text-transform: uppercase;">${employee.payment_method}</span></td>
                    <td style="text-align: right; font-weight: 800;">৳${parseFloat(employee.amount || 0).toLocaleString()}</td>
                </tr>
            </tbody>
        </table>

        <div style="margin-top: 40px; border-top: 2px solid #111827; padding-top: 20px;">
            <h3 style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #6b7280; margin-bottom: 15px;">Disbursement Breakdown</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                ${Number(employee.paid_cash) > 0 ? `<div style="background: #f9fafb; padding: 15px; border-radius: 12px; border: 1px solid #e5e7eb;"><span style="display: block; font-size: 8px; font-weight: 900; color: #6b7280; text-transform: uppercase;">Cash Payout</span><span style="font-weight: 800; font-size: 16px;">৳${parseFloat(employee.paid_cash).toLocaleString()}</span></div>` : ''}
                ${Number(employee.paid_mobile) > 0 ? `<div style="background: #f9fafb; padding: 15px; border-radius: 12px; border: 1px solid #e5e7eb;"><span style="display: block; font-size: 8px; font-weight: 900; color: #6b7280; text-transform: uppercase;">Mobile (${employee.mobile_operator})</span><span style="font-weight: 800; font-size: 16px;">৳${parseFloat(employee.paid_mobile).toLocaleString()}</span></div>` : ''}
                ${Number(employee.paid_bank) > 0 ? `<div style="background: #f9fafb; padding: 15px; border-radius: 12px; border: 1px solid #e5e7eb;"><span style="display: block; font-size: 8px; font-weight: 900; color: #6b7280; text-transform: uppercase;">Bank (${employee.bank_name})</span><span style="font-weight: 800; font-size: 16px;">৳${parseFloat(employee.paid_bank).toLocaleString()}</span></div>` : ''}
            </div>
        </div>

        <div class="total-container">
            <div class="total-box" style="background: #10b981;">
                <div class="total-label" style="color: #d1fae5;">Total Advance Disbursed</div>
                <div class="total-amount">৳${parseFloat(employee.amount || 0).toLocaleString()}</div>
            </div>
        </div>
    `;
};
