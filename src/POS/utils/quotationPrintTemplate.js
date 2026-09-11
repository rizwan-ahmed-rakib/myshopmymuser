import { getBrandedVoucher } from './printTemplates';

export const printQuotation = (quotation) => {
    if (!quotation) return;

    const isSale = quotation.transaction_type === 'sale';
    const title = isSale ? "Sales Quotation" : "Purchase Quotation";
    const partyLabel = isSale ? "Customer" : "Supplier";
    const partyName = isSale ? quotation.customer_name : quotation.supplier_name;
    const partyPhone = isSale ? quotation.customer_phone : quotation.supplier_phone;
    const partyAddress = isSale ? quotation.customer_address : quotation.supplier_address;

    const formattedDate = quotation.created_at
        ? new Date(quotation.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })
        : new Date().toLocaleDateString();

    const formattedExpiry = quotation.expires_at
        ? new Date(quotation.expires_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })
        : "N/A";

    const itemsRows = (quotation.items || []).map((item, idx) => `
        <tr>
            <td style="text-align: center;">${idx + 1}</td>
            <td>
                <strong>${item.product_name || 'Item'}</strong>
                ${item.product_code ? `<br/><small style="color: #6b7280;">Code: ${item.product_code}</small>` : ''}
            </td>
            <td style="text-align: right;">৳${Number(item.unit_price || 0).toFixed(2)}</td>
            <td style="text-align: center;">${item.quantity || 1}</td>
            <td style="text-align: right;">৳${Number(item.discount_amount || 0).toFixed(2)}</td>
            <td style="text-align: right; font-weight: 700;">৳${Number(item.total_price || 0).toFixed(2)}</td>
        </tr>
    `).join('');

    const specificContent = `
        <div class="info-grid">
            <div class="info-section">
                <h3>${partyLabel} Details</h3>
                <p>${partyName || 'N/A'}</p>
                ${partyPhone ? `<div style="font-size: 11px; color: #4b5563;">Phone: ${partyPhone}</div>` : ''}
                ${partyAddress ? `<div style="font-size: 11px; color: #4b5563;">Address: ${partyAddress}</div>` : ''}
            </div>
            <div class="info-section">
                <h3>Quotation Date</h3>
                <p>${formattedDate}</p>
            </div>
            <div class="info-section">
                <h3>Valid Until</h3>
                <p>${formattedExpiry}</p>
            </div>
            ${quotation.title ? `
            <div class="info-section">
                <h3>Ref Title</h3>
                <p>${quotation.title}</p>
            </div>
            ` : ''}
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th style="width: 5%; text-align: center;">#</th>
                    <th style="width: 45%;">Item Description</th>
                    <th style="width: 15%; text-align: right;">Unit Price</th>
                    <th style="width: 10%; text-align: center;">Qty</th>
                    <th style="width: 12%; text-align: right;">Discount</th>
                    <th style="width: 13%; text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsRows}
            </tbody>
        </table>

        <div class="total-container">
            <div style="width: 250px;">
                <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px;">
                    <span style="color: #6b7280;">Subtotal:</span>
                    <span style="font-weight: 600;">৳${Number(quotation.subtotal || 0).toFixed(2)}</span>
                </div>
                ${Number(quotation.discount_amount) > 0 ? `
                <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: #059669;">
                    <span>Total Discount:</span>
                    <span style="font-weight: 600;">- ৳${Number(quotation.discount_amount).toFixed(2)}</span>
                </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-top: 2px solid #111827; margin-top: 4px; font-size: 16px; font-weight: 800; color: #111827;">
                    <span>Grand Total:</span>
                    <span>৳${Number(quotation.net_total || 0).toFixed(2)}</span>
                </div>
            </div>
        </div>

        ${quotation.notes ? `
        <div style="margin-top: 24px; padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px;">
            <strong style="font-size: 11px; text-transform: uppercase; color: #6b7280; display: block; margin-bottom: 4px;">Terms / Notes:</strong>
            <p style="margin: 0; font-size: 12px; color: #374151;">${quotation.notes}</p>
        </div>
        ` : ''}
    `;

    const fullHTML = getBrandedVoucher(title, specificContent, quotation.id, isSale ? "#2563eb" : "#0d9488");
    const printWindow = window.open("", "_blank", "width=850,height=900");
    if (printWindow) {
        printWindow.document.write(fullHTML);
        printWindow.document.close();
    }
};
