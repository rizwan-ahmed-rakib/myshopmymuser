/**
 * getPurchaseReturnPrintLayout - Generates the specific table for Purchase Return.
 * Using unified classes from printTemplates.js
 * 
 * @param {Object} purchaseReturn - The purchase return data object
 * @returns {string} - HTML string of the purchase return content
 */
export const getPurchaseReturnPrintLayout = (purchaseReturn) => {
    return `
        <div class="info-grid">
            <div class="info-section">
                <h3>Supplier Details</h3>
                <p>${purchaseReturn.supplier_name || 'N/A'}</p>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">Original Invoice: #${purchaseReturn.purchase_invoice_no}</div>
            </div>
            <div class="info-section" style="text-align: right;">
                <h3>Return Details</h3>
                <p>#${purchaseReturn.id}</p>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">Date: ${new Date(purchaseReturn.created_at).toLocaleDateString()}</div>
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Product Description</th>
                    <th style="text-align: center;">Return Qty</th>
                    <th style="text-align: right;">Unit Price (৳)</th>
                    <th style="text-align: right;">Penalty (৳)</th>
                    <th style="text-align: right;">Total (৳)</th>
                </tr>
            </thead>
            <tbody>
                ${purchaseReturn.items.map(item => `
                    <tr>
                        <td>
                            <div style="font-weight: 600;">${item.product_name}</div>
                            ${item.reason ? `<div style="font-size: 10px; color: #6b7280;">Reason: ${item.reason}</div>` : ''}
                        </td>
                        <td style="text-align: center;">${item.purchase_return_quantity}</td>
                        <td style="text-align: right;">৳${parseFloat(item.unit_price).toLocaleString()}</td>
                        <td style="text-align: right; color: #dc2626;">৳${parseFloat(item.penalty_amount || 0).toLocaleString()}</td>
                        <td style="text-align: right; font-weight: 700;">৳${parseFloat(item.total_price).toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div style="display: flex; justify-content: flex-end;">
            <div style="width: 280px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0;">
                    <span style="color: #6b7280;">Gross Return:</span>
                    <span style="font-weight: 600;">৳${parseFloat(purchaseReturn.total_return_amount).toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; color: #dc2626;">
                    <span>Total Penalties:</span>
                    <span>- ৳${(parseFloat(purchaseReturn.total_item_penalty || 0) + parseFloat(purchaseReturn.global_penalty || 0)).toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 14px; padding: 10px 0; border-top: 2px solid #dc2626; margin-top: 4px;">
                    <span style="font-weight: 800; text-transform: uppercase; color: #dc2626;">Net Refund:</span>
                    <span style="font-weight: 800; font-size: 18px; color: #dc2626;">৳${parseFloat(purchaseReturn.net_return_amount).toLocaleString()}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; color: #059669; font-weight: 700;">
                    <span>Total Received Back:</span>
                    <span>৳${parseFloat(purchaseReturn.paid_amount).toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; color: #f59e0b; font-weight: 700; border-top: 1px dashed #e5e7eb;">
                    <span>Pending Refund:</span>
                    <span>৳${parseFloat(purchaseReturn.due_amount).toLocaleString()}</span>
                </div>
            </div>
        </div>

        <div style="margin-top: 30px; font-size: 12px; background: #fffaf0; border: 1px solid #feebc8; padding: 12px; border-radius: 8px;">
            <div style="font-weight: 700; color: #c05621; margin-bottom: 4px; text-transform: uppercase; font-size: 10px;">Return Note</div>
            <div style="color: #744210; font-style: italic;">${purchaseReturn.return_reason || purchaseReturn.note || "Standard purchase return."}</div>
        </div>
    `;
};
