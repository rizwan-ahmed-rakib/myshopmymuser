/**
 * getSaleReturnPrintLayout - Generates the specific table for Sale Return.
 * Using unified classes from printTemplates.js
 * 
 * @param {Object} saleReturn - The sale return data object
 * @returns {string} - HTML string of the sale return content
 */
export const getSaleReturnPrintLayout = (saleReturn) => {
    return `
        <div class="info-grid">
            <div class="info-section">
                <h3>Customer Details</h3>
                <p>${saleReturn.customer_name || 'Walk-in Customer'}</p>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">Original Invoice: #${saleReturn.sale_invoice_no}</div>
            </div>
            <div class="info-section" style="text-align: right;">
                <h3>Return Details</h3>
                <p>#${saleReturn.id}</p>
                <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 2px;">Date: ${new Date(saleReturn.created_at).toLocaleDateString()}</div>
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
                ${saleReturn.items.map(item => `
                    <tr>
                        <td>
                            <div style="font-weight: 600;">${item.product_name}</div>
                            ${item.reason ? `<div style="font-size: 10px; color: #6b7280;">Reason: ${item.reason}</div>` : ''}
                        </td>
                        <td style="text-align: center;">${item.sale_return_quantity}</td>
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
                    <span style="font-weight: 600;">৳${parseFloat(saleReturn.total_return_amount).toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; color: #dc2626;">
                    <span>Total Penalties:</span>
                    <span>- ৳${(parseFloat(saleReturn.total_item_penalty || 0) + parseFloat(saleReturn.global_penalty || 0)).toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 14px; padding: 10px 0; border-top: 2px solid #dc2626; margin-top: 4px;">
                    <span style="font-weight: 800; text-transform: uppercase; color: #dc2626;">Net Refund:</span>
                    <span style="font-weight: 800; font-size: 18px; color: #dc2626;">৳${parseFloat(saleReturn.net_return_amount).toLocaleString()}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; color: #059669; font-weight: 700;">
                    <span>Total Paid Back:</span>
                    <span>৳${parseFloat(saleReturn.paid_amount).toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; color: #f59e0b; font-weight: 700; border-top: 1px dashed #e5e7eb;">
                    <span>Pending Refund:</span>
                    <span>৳${parseFloat(saleReturn.due_amount).toLocaleString()}</span>
                </div>
            </div>
        </div>

        <div style="margin-top: 30px; font-size: 12px; background: #fffaf0; border: 1px solid #feebc8; padding: 12px; border-radius: 8px;">
            <div style="font-weight: 700; color: #c05621; margin-bottom: 4px; text-transform: uppercase; font-size: 10px;">Return Reason</div>
            <div style="color: #744210; font-style: italic;">${saleReturn.return_reason || saleReturn.note || "Standard customer return."}</div>
        </div>
    `;
};
