/**
 * getLoanPrintLayout - Generates the specific table and breakdown for Employee Loan.
 * Using unified classes from printTemplates.js
 * * @param {Object} loan - The loan data object
 * @returns {string} - HTML string of the loan table content
 */
export const getLoanPrintLayout = (loan) => {
    // লোন এবং রিপেমেন্ট শুরুর ডেট ফরম্যাট করা
    const loanDate = loan.loan_date
        ? new Date(loan.loan_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'N/A';

    const repaymentDate = loan.repayment_start_date
        ? new Date(loan.repayment_start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'N/A';

    return `
        <div class="info-grid">
            <div class="info-section">
                <h3>Employee Details</h3>
                <p>${loan.user_name || 'N/A'}</p>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">
                    ${loan.user_designation || 'Staff Member'}
                </div>
            </div>
            <div class="info-section" style="text-align: right;">
                <h3>Loan Timeline</h3>
                <p>Issue Date: ${loanDate}</p>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">
                    Repayment Starts: ${repaymentDate}
                </div>
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Description / Purpose</th>
                    <th>Payment Method</th>
                    <th style="text-align: right;">Principal Amount (৳)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="font-weight: 700;">${loan.reason || 'Employee Loan Disbursement'}</td>
                    <td>
                        <span style="font-size: 10px; font-weight: 900; color: #6b7280; text-transform: uppercase;">
                            ${loan.payment_method ? loan.payment_method.replace('_', ' ') : 'N/A'}
                        </span>
                    </td>
                    <td style="text-align: right; font-weight: 800;">
                        ৳${parseFloat(loan.amount || 0).toLocaleString()}
                    </td>
                </tr>
            </tbody>
        </table>

        <div style="margin-top: 40px; border-top: 2px solid #111827; padding-top: 20px;">
            <h3 style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #6b7280; margin-bottom: 15px;">
                Disbursement Breakdown
            </h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                ${Number(loan.paid_cash) > 0 ? `
                    <div style="background: #f9fafb; padding: 15px; border-radius: 12px; border: 1px solid #e5e7eb;">
                        <span style="display: block; font-size: 8px; font-weight: 900; color: #6b7280; text-transform: uppercase;">Cash Payout</span>
                        <span style="font-weight: 800; font-size: 16px;">৳${parseFloat(loan.paid_cash).toLocaleString()}</span>
                    </div>
                ` : ''}
                
                ${Number(loan.paid_mobile) > 0 ? `
                    <div style="background: #f9fafb; padding: 15px; border-radius: 12px; border: 1px solid #e5e7eb;">
                        <span style="display: block; font-size: 8px; font-weight: 900; color: #6b7280; text-transform: uppercase;">Mobile (${loan.mobile_operator || 'N/A'})</span>
                        <span style="font-weight: 800; font-size: 16px;">৳${parseFloat(loan.paid_mobile).toLocaleString()}</span>
                        ${loan.transaction_id ? `<span style="display: block; font-size: 8px; font-weight: bold; color: #3b82f6; margin-top: 4px;">TxID: ${loan.transaction_id}</span>` : ''}
                    </div>
                ` : ''}
                
                ${Number(loan.paid_bank) > 0 ? `
                    <div style="background: #f9fafb; padding: 15px; border-radius: 12px; border: 1px solid #e5e7eb;">
                        <span style="display: block; font-size: 8px; font-weight: 900; color: #6b7280; text-transform: uppercase;">Bank (${loan.bank_name || 'N/A'})</span>
                        <span style="font-weight: 800; font-size: 16px;">৳${parseFloat(loan.paid_bank).toLocaleString()}</span>
                    </div>
                ` : ''}
            </div>
        </div>

        <div class="total-container">
            <div style="text-align: right; margin-bottom: 10px; font-size: 13px; font-weight: 700; color: #374151;">
                Monthly Installment Deduction: <span style="font-weight: 800; color: #ef4444;">৳${parseFloat(loan.monthly_repayment_amount || 0).toLocaleString()}</span>
            </div>
            <div class="total-box" style="background: #2563eb;">
                <div class="total-label" style="color: #dbeafe;">Total Loan Principal Disbursed</div>
                <div class="total-amount">৳${parseFloat(loan.amount || 0).toLocaleString()}</div>
            </div>
        </div>
    `;
};