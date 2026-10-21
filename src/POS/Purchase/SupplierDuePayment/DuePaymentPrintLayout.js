// /**
//  * getDuePaymentPrintLayout - Generates the specific table for Supplier Due Payment.
//  * Using unified classes from printTemplates.js
//  *
//  * @param {Object} payment - The payment data object
//  * @returns {string} - HTML string of the payment table content
//  */
// export const getDuePaymentPrintLayout = (payment) => {
//     return `
//         <div class="info-grid">
//             <div class="info-section">
//                 <h3>Supplier Details</h3>
//                 <p>${payment.supplier_name || 'N/A'}</p>
//                 ${payment.purchase_invoice_no ? `<div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">Original Purchase: #${payment.purchase_invoice_no}</div>` : ''}
//             </div>
//             <div class="info-section" style="text-align: right;">
//                 <h3>Payment Info</h3>
//                 <p>#${payment.invoice_no}</p>
//                 <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">Date: ${new Date(payment.created_at).toLocaleString()}</div>
//             </div>
//         </div>
//
//         <table class="table">
//             <thead>
//                 <tr>
//                     <th>Description</th>
//                     <th style="text-align: center;">Method</th>
//                     <th style="text-align: right;">Amount (৳)</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 ${Number(payment.paid_cash) > 0 ? `
//                     <tr>
//                         <td>Cash Payout</td>
//                         <td style="text-align: center;">CASH</td>
//                         <td style="text-align: right; font-weight: 600;">৳${parseFloat(payment.paid_cash).toLocaleString()}</td>
//                     </tr>
//                 ` : ''}
//                 ${Number(payment.paid_mobile) > 0 ? `
//                     <tr>
//                         <td>Mobile Banking (${payment.mobile_operator})</td>
//                         <td style="text-align: center;">MOBILE</td>
//                         <td style="text-align: right; font-weight: 600;">৳${parseFloat(payment.paid_mobile).toLocaleString()}</td>
//                     </tr>
//                 ` : ''}
//                 ${Number(payment.paid_bank) > 0 ? `
//                     <tr>
//                         <td>Bank Transfer (${payment.bank_name})</td>
//                         <td style="text-align: center;">BANK</td>
//                         <td style="text-align: right; font-weight: 600;">৳${parseFloat(payment.paid_bank).toLocaleString()}</td>
//                     </tr>
//                 ` : ''}
//             </tbody>
//         </table>
//
//         <div class="total-container">
//             <div class="total-box">
//                 <div class="total-label">Total Amount Settled</div>
//                 <div class="total-amount">৳${parseFloat(payment.amount).toLocaleString()}</div>
//             </div>
//         </div>
//
//         ${payment.note ? `
//             <div style="margin-top: 30px; font-size: 11px; color: #6b7280; font-style: italic;">
//                 Note: ${payment.note}
//             </div>
//         ` : ''}
//     `;
// };


export const getDuePaymentPrintLayout = (payment) => {
    const isRefund = payment.transaction_type === 'refund';
    const themeColor = isRefund ? '#3b82f6' : '#10b981';
    const headerLabel = isRefund ? 'Refund From' : 'Supplier Details';

    return `
        <div class="info-grid">
            <div class="info-section">
                <h3>${headerLabel}</h3>
                <p>${payment.supplier_name || 'N/A'}</p>
                ${!isRefund && payment.purchase_invoice_no
        ? `<div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">Original Purchase: #${payment.purchase_invoice_no}</div>`
        : ''}
                ${isRefund
        ? `<div style="font-size: 12px; color: #3b82f6; font-weight: 600; margin-top: 2px;">↩️ Advance Settlement Refund</div>`
        : ''}
            </div>
            <div class="info-section" style="text-align: right;">
                <h3>${isRefund ? 'Refund Info' : 'Payment Info'}</h3>
                <p>#${payment.invoice_no}</p>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">
                    Date: ${new Date(payment.created_at).toLocaleString()}
                </div>
                <div style="
                    display: inline-block;
                    margin-top: 6px;
                    padding: 3px 10px;
                    background: ${themeColor}15;
                    color: ${themeColor};
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    border-radius: 6px;
                    border: 1px solid ${themeColor}30;
                ">
                    ${isRefund ? 'REFUND' : 'PAYMENT'}
                </div>
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
                        <td>${isRefund ? 'Cash Received' : 'Cash Payout'}</td>
                        <td style="text-align: center;">CASH</td>
                        <td style="text-align: right; font-weight: 600;">৳${parseFloat(payment.paid_cash).toLocaleString()}</td>
                    </tr>
                ` : ''}
                ${Number(payment.paid_mobile) > 0 ? `
                    <tr>
                        <td>Mobile Banking (${payment.mobile_operator || 'N/A'})</td>
                        <td style="text-align: center;">MOBILE</td>
                        <td style="text-align: right; font-weight: 600;">৳${parseFloat(payment.paid_mobile).toLocaleString()}</td>
                    </tr>
                ` : ''}
                ${Number(payment.paid_bank) > 0 ? `
                    <tr>
                        <td>Bank Transfer (${payment.bank_name || 'N/A'})</td>
                        <td style="text-align: center;">BANK</td>
                        <td style="text-align: right; font-weight: 600;">৳${parseFloat(payment.paid_bank).toLocaleString()}</td>
                    </tr>
                ` : ''}
            </tbody>
        </table>

        <div class="total-container">
            <div class="total-box" style="border-left-color: ${themeColor};">
                <div class="total-label">${isRefund ? 'Total Refund Received' : 'Total Amount Settled'}</div>
                <div class="total-amount" style="color: ${themeColor};">৳${parseFloat(payment.amount).toLocaleString()}</div>
            </div>
        </div>

        ${payment.note ? `
            <div style="margin-top: 30px; font-size: 11px; color: #6b7280; font-style: italic;">
                Note: ${payment.note}
            </div>
        ` : ''}
    `;
};