/**
 * getPayslipPrintLayout - Generates the specific table for Salary Payslip.
 * Using unified classes from printTemplates.js
 * 
 * @param {Object} employee - The employee/payslip data object
 * @returns {string} - HTML string of the payslip table content
 */
export const getPayslipPrintLayout = (employee) => {
    return `
        <div class="info-grid">
            <div class="info-section">
                <h3>Employee Details</h3>
                <p>${employee.user_name}</p>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">${employee.user_designation || 'Staff Member'}</div>
            </div>
            <div class="info-section" style="text-align: right;">
                <h3>Salary Period</h3>
                <p>${new Date(0, (employee.month || 1) - 1).toLocaleString('default', { month: 'long' })} ${employee.year}</p>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">Payment Date: ${new Date(employee.payment_date || new Date()).toLocaleDateString()}</div>
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Earnings & Deductions</th>
                    <th style="text-align: right;">Amount (৳)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Basic Salary</td>
                    <td style="text-align: right;">৳${parseFloat(employee.basic_salary || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td style="color: #059669;">Total Allowances (+)</td>
                    <td style="text-align: right; color: #059669;">৳${parseFloat(employee.allowances || 0).toLocaleString()}</td>
                </tr>
                <tr>
                    <td style="color: #dc2626;">Total Deductions (-)</td>
                    <td style="text-align: right; color: #dc2626;">৳${parseFloat(employee.deductions || 0).toLocaleString()}</td>
                </tr>
            </tbody>
        </table>

        <div style="margin-top: 40px; border-top: 2px solid #111827; padding-top: 20px;">
            <h3 style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #6b7280; margin-bottom: 15px;">Payment Breakdown</h3>
            <table class="table" style="margin-bottom: 0;">
                <thead>
                    <tr>
                        <th>Method</th>
                        <th style="text-align: right;">Disbursed Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${Number(employee.paid_cash) > 0 ? `<tr><td>Cash Payment</td><td style="text-align: right;">৳${parseFloat(employee.paid_cash).toLocaleString()}</td></tr>` : ''}
                    ${Number(employee.paid_mobile) > 0 ? `<tr><td>Mobile Banking (${employee.mobile_operator})</td><td style="text-align: right;">৳${parseFloat(employee.paid_mobile).toLocaleString()}</td></tr>` : ''}
                    ${Number(employee.paid_bank) > 0 ? `<tr><td>Bank Transfer (${employee.bank_name})</td><td style="text-align: right;">৳${parseFloat(employee.paid_bank).toLocaleString()}</td></tr>` : ''}
                </tbody>
            </table>
        </div>

        <div class="total-container">
            <div class="total-box">
                <div class="total-label">Net Salary Disbursed</div>
                <div class="total-amount">৳${parseFloat(employee.net_salary || 0).toLocaleString()}</div>
            </div>
        </div>
    `;
};
