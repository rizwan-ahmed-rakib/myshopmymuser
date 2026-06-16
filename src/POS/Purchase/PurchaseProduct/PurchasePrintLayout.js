/**
 * getPurchasePrintLayout - Generates the specific table for Purchase Invoice.
 * Using unified classes from printTemplates.js
 * 
 * @param {Object} purchase - The purchase data object
 * @returns {string} - HTML string of the purchase table content
 */
export const getPurchasePrintLayout = (purchase) => {
    return `
        <div class="info-grid">
            <div class="info-section">
                <h3>Supplier Details</h3>
                <p>${purchase.supplier_name || 'N/A'}</p>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">Method: ${purchase.payment_method?.toUpperCase().replace('_', ' ') || 'N/A'}</div>
            </div>
            <div class="info-section" style="text-align: right;">
                <h3>Invoice Details</h3>
                <p>#${purchase.invoice_no}</p>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">Date: ${new Date(purchase.created_at).toLocaleDateString()}</div>
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Product Description</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price (৳)</th>
                    <th style="text-align: right;">Discount (৳)</th>
                    <th style="text-align: right;">Total (৳)</th>
                </tr>
            </thead>
            <tbody>
                ${purchase.items.map(item => `
                    <tr>
                        <td>
                            <div style="font-weight: 600;">${item.product_name}</div>
                            ${item.batch_no ? `<div style="font-size: 10px; color: #6b7280;">Batch: ${item.batch_no}</div>` : ''}
                        </td>
                        <td style="text-align: center;">${item.quantity}</td>
                        <td style="text-align: right;">৳${parseFloat(item.unit_price).toLocaleString()}</td>
                        <td style="text-align: right; color: #059669;">৳${parseFloat(item.discount_amount || 0).toLocaleString()}</td>
                        <td style="text-align: right; font-weight: 700;">৳${parseFloat(item.net_total).toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div style="display: flex; justify-content: flex-end;">
            <div style="width: 250px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0;">
                    <span style="color: #6b7280;">Gross Total:</span>
                    <span style="font-weight: 600;">৳${parseFloat(purchase.total_amount).toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; color: #059669;">
                    <span>Item Discount:</span>
                    <span>- ৳${parseFloat(purchase.itemwise_total_discount || 0).toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; border-top: 1px solid #f3f4f6;">
                    <span style="color: #6b7280;">Subtotal:</span>
                    <span style="font-weight: 600;">৳${parseFloat(purchase.subtotal).toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; color: #059669;">
                    <span>Global Discount:</span>
                    <span>- ৳${parseFloat(purchase.global_discount || 0).toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 8px 0; border-top: 2px solid #111827; margin-top: 4px;">
                    <span style="font-weight: 800; text-transform: uppercase;">Net Payable:</span>
                    <span style="font-weight: 800; font-size: 16px;">৳${parseFloat(purchase.net_total).toLocaleString()}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; color: #059669; font-weight: 700;">
                    <span>Total Paid:</span>
                    <span>৳${parseFloat(purchase.paid_amount).toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; color: #dc2626; font-weight: 700; border-top: 1px dashed #e5e7eb;">
                    <span>Due Amount:</span>
                    <span>৳${parseFloat(purchase.due_amount).toLocaleString()}</span>
                </div>
            </div>
        </div>

        <div style="margin-top: 30px; font-size: 11px; color: #6b7280; font-style: italic;">
            Note: ${purchase.note || "No additional remarks."}
        </div>
    `;
};
