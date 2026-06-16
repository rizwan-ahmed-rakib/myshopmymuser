/**
 * getDuePaymentPrintLayout - Generates the specific table for Supplier Due Payment.
 * Using unified classes from printTemplates.js
 * 
 * @param {Object} payment - The payment data object
 * @returns {string} - HTML string of the payment table content
 */
export const getDuePaymentPrintLayout = (payment) => {
    return `
        <div class="info-grid">
            <div class="info-section">
                <h3>Supplier Details</h3>
                <p>${payment.supplier_name || 'N/A'}</p>
                ${payment.purchase_invoice_no ? `<div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">Original Purchase: #${payment.purchase_invoice_no}</div>` : ''}
            </div>
            <div class="info-section" style="text-align: right;">
                <h3>Payment Info</h3>
                <p>#${payment.invoice_no}</p>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">Date: ${new Date(payment.created_at).toLocaleString()}</div>
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="text-align: center;">Method</th>
                    <th style="text-align: right;">Amount (৳)</th>
                </tr>
            </thead>
            <tbody>
                ${Number(payment.paid_cash) > 0 ? `
                    <tr>
                        <td>Cash Payout</td>
                        <td style="text-align: center;">CASH</td>
                        <td style="text-align: right; font-weight: 600;">৳${parseFloat(payment.paid_cash).toLocaleString()}</td>
                    </tr>
                ` : ''}
                ${Number(payment.paid_mobile) > 0 ? `
                    <tr>
                        <td>Mobile Banking (${payment.mobile_operator})</td>
                        <td style="text-align: center;">MOBILE</td>
                        <td style="text-align: right; font-weight: 600;">৳${parseFloat(payment.paid_mobile).toLocaleString()}</td>
                    </tr>
                ` : ''}
                ${Number(payment.paid_bank) > 0 ? `
                    <tr>
                        <td>Bank Transfer (${payment.bank_name})</td>
                        <td style="text-align: center;">BANK</td>
                        <td style="text-align: right; font-weight: 600;">৳${parseFloat(payment.paid_bank).toLocaleString()}</td>
                    </tr>
                ` : ''}
            </tbody>
        </table>

        <div class="total-container">
            <div class="total-box">
                <div class="total-label">Total Amount Settled</div>
                <div class="total-amount">৳${parseFloat(payment.amount).toLocaleString()}</div>
            </div>
        </div>

        ${payment.note ? `
            <div style="margin-top: 30px; font-size: 11px; color: #6b7280; font-style: italic;">
                Note: ${payment.note}
            </div>
        ` : ''}
    `;
};
