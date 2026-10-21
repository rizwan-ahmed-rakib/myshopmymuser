// /**
//  * getDueCollectionPrintLayout - Generates the specific table for Customer Due Collection.
//  * Using unified classes from printTemplates.js
//  *
//  * @param {Object} collection - The collection data object
//  * @returns {string} - HTML string of the collection table content
//  */
// export const getDueCollectionPrintLayout = (collection) => {
//     return `
//         <div class="info-grid">
//             <div class="info-section">
//                 <h3>Customer Details</h3>
//                 <p>${collection.customer_name || 'Walk-in Customer'}</p>
//                 ${collection.sale_invoice_no ? `<div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">Original Sale: #${collection.sale_invoice_no}</div>` : ''}
//             </div>
//             <div class="info-section" style="text-align: right;">
//                 <h3>Collection Info</h3>
//                 <p>#${collection.invoice_no}</p>
//                 <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">Date: ${new Date(collection.created_at).toLocaleString()}</div>
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
//                 ${Number(collection.paid_cash) > 0 ? `
//                     <tr>
//                         <td>Cash Collection</td>
//                         <td style="text-align: center;">CASH</td>
//                         <td style="text-align: right; font-weight: 600;">৳${parseFloat(collection.paid_cash).toLocaleString()}</td>
//                     </tr>
//                 ` : ''}
//                 ${Number(collection.paid_mobile) > 0 ? `
//                     <tr>
//                         <td>Mobile Banking (${collection.mobile_operator})</td>
//                         <td style="text-align: center;">MOBILE</td>
//                         <td style="text-align: right; font-weight: 600;">৳${parseFloat(collection.paid_mobile).toLocaleString()}</td>
//                     </tr>
//                 ` : ''}
//                 ${Number(collection.paid_bank) > 0 ? `
//                     <tr>
//                         <td>Bank Transfer (${collection.bank_name})</td>
//                         <td style="text-align: center;">BANK</td>
//                         <td style="text-align: right; font-weight: 600;">৳${parseFloat(collection.paid_bank).toLocaleString()}</td>
//                     </tr>
//                 ` : ''}
//             </tbody>
//         </table>
//
//         <div class="total-container">
//             <div class="total-box">
//                 <div class="total-label">Total Amount Received</div>
//                 <div class="total-amount">৳${parseFloat(collection.amount).toLocaleString()}</div>
//             </div>
//         </div>
//
//         ${collection.note ? `
//             <div style="margin-top: 30px; font-size: 11px; color: #6b7280; font-style: italic;">
//                 Note: ${collection.note}
//             </div>
//         ` : ''}
//     `;
// };



export const getDueCollectionPrintLayout = (collection) => {
    const isRefund = collection.transaction_type === 'refund';
    const themeColor = isRefund ? '#3b82f6' : '#10b981';
    const headerLabel = isRefund ? 'Refund To' : 'Customer Details';

    return `
        <div class="info-grid">
            <div class="info-section">
                <h3>${headerLabel}</h3>
                <p>${collection.customer_name || 'Walk-in Customer'}</p>
                ${!isRefund && collection.sale_invoice_no
                    ? `<div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">Original Sale: #${collection.sale_invoice_no}</div>`
                    : ''}
                ${isRefund
                    ? `<div style="font-size: 12px; color: #3b82f6; font-weight: 600; margin-top: 2px;">↩️ Advance Refund Settlement</div>`
                    : ''}
            </div>
            <div class="info-section" style="text-align: right;">
                <h3>${isRefund ? 'Refund Info' : 'Collection Info'}</h3>
                <p>#${collection.invoice_no}</p>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">
                    Date: ${new Date(collection.created_at).toLocaleString()}
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
                    ${isRefund ? 'REFUND' : 'COLLECTION'}
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
                ${Number(collection.paid_cash) > 0 ? `
                    <tr>
                        <td>${isRefund ? 'Cash Refunded' : 'Cash Collection'}</td>
                        <td style="text-align: center;">CASH</td>
                        <td style="text-align: right; font-weight: 600;">৳${parseFloat(collection.paid_cash).toLocaleString()}</td>
                    </tr>
                ` : ''}
                ${Number(collection.paid_mobile) > 0 ? `
                    <tr>
                        <td>Mobile Banking (${collection.mobile_operator || 'N/A'})</td>
                        <td style="text-align: center;">MOBILE</td>
                        <td style="text-align: right; font-weight: 600;">৳${parseFloat(collection.paid_mobile).toLocaleString()}</td>
                    </tr>
                ` : ''}
                ${Number(collection.paid_bank) > 0 ? `
                    <tr>
                        <td>Bank Transfer (${collection.bank_name || 'N/A'})</td>
                        <td style="text-align: center;">BANK</td>
                        <td style="text-align: right; font-weight: 600;">৳${parseFloat(collection.paid_bank).toLocaleString()}</td>
                    </tr>
                ` : ''}
            </tbody>
        </table>

        <div class="total-container">
            <div class="total-box" style="border-left-color: ${themeColor};">
                <div class="total-label">${isRefund ? 'Total Refund Given' : 'Total Amount Received'}</div>
                <div class="total-amount" style="color: ${themeColor};">৳${parseFloat(collection.amount).toLocaleString()}</div>
            </div>
        </div>

        ${collection.note ? `
            <div style="margin-top: 30px; font-size: 11px; color: #6b7280; font-style: italic;">
                Note: ${collection.note}
            </div>
        ` : ''}
    `;
};