/**
 * posReceiptTemplate.js
 * POS Thermal / Slim Receipt Template (80mm width friendly)
 * ব্রাউজার উইন্ডো print ডায়ালগ ব্যবহার করে — আলাদা ড্রাইভার লাগবে না।
 * OS-এর print settings থেকে "POS Printer" বা যেকোনো thermal printer বেছে নেওয়া যাবে।
 */

const getCompanySettings = () => {
    const settingsRaw = localStorage.getItem('pos_settings');
    return settingsRaw ? JSON.parse(settingsRaw) : {
        company_name: "MY SHOP POS",
        company_address: "Address not provided",
        company_phone: "N/A",
        company_email: "N/A",
        company_logo: null
    };
};

/**
 * POS Thermal Receipt HTML তৈরি করা
 * @param {Object} sale - Sale data object (invoice_no, customer_name, items, net_total, etc.)
 * @returns {string} - Full HTML page string
 */
export const getPOSReceiptHTML = (sale) => {
    const settings = getCompanySettings();
    const date = new Date(sale.created_at).toLocaleString('en-BD', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    const logoHtml = settings.company_logo
        ? `<img src="${settings.company_logo}" class="receipt-logo" alt="Logo" />`
        : '';

    const itemsHTML = (sale.items || []).map(item => `
        <tr>
            <td class="item-name">${item.product_name}</td>
            <td class="item-qty">${item.quantity}</td>
            <td class="item-price">৳${parseFloat(item.unit_price).toLocaleString()}</td>
            <td class="item-total">৳${parseFloat(item.net_total).toLocaleString()}</td>
        </tr>
    `).join('');

    const totalDiscount = parseFloat(sale.total_discount || 0);
    const netTotal = parseFloat(sale.net_total || sale.netTotal || 0);
    const paidAmount = parseFloat(sale.paid_amount || 0);
    const dueAmount = parseFloat(sale.due_amount || 0);
    const paymentMethod = (sale.payment_method || 'cash').toUpperCase().replace('_', ' ');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt #${sale.invoice_no}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Source Code Pro', 'Courier New', monospace;
      font-size: 12px;
      color: #000;
      background: #fff;
      width: 80mm;
      max-width: 80mm;
      margin: 0 auto;   /* screen এ center করা */
      padding: 6mm 4mm;
    }

    /* ── HEADER ── */
    .receipt-header {
      text-align: center;
      border-bottom: 1px dashed #000;
      padding-bottom: 6px;
      margin-bottom: 6px;
    }
    .receipt-logo {
      max-height: 40px;
      max-width: 120px;
      object-fit: contain;
      margin-bottom: 4px;
    }
    .shop-name {
      font-size: 15px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .shop-sub {
      font-size: 9px;
      color: #444;
      margin-top: 2px;
    }

    /* ── INVOICE META ── */
    .meta-block {
      font-size: 10px;
      margin: 6px 0;
      border-bottom: 1px dashed #000;
      padding-bottom: 5px;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;
    }
    .meta-label { color: #555; }
    .meta-value { font-weight: 700; }

    /* ── DIVIDER ── */
    .divider {
      border: none;
      border-top: 1px dashed #000;
      margin: 5px 0;
    }
    .solid-divider {
      border: none;
      border-top: 2px solid #000;
      margin: 5px 0;
    }

    /* ── ITEMS TABLE ── */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 4px 0;
      font-size: 10px;
    }
    .items-table thead tr {
      border-bottom: 1px solid #000;
    }
    .items-table th {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 1px;
    }
    .items-table td {
      padding: 3px 1px;
      vertical-align: top;
    }
    .item-name { width: 45%; word-break: break-word; }
    .item-qty  { width: 10%; text-align: center; }
    .item-price { width: 20%; text-align: right; }
    .item-total { width: 25%; text-align: right; font-weight: 600; }

    /* ── TOTALS ── */
    .totals-block {
      font-size: 11px;
      margin-top: 4px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 1.5px 0;
    }
    .total-row.discount { color: #059669; }
    .total-row.due      { color: #dc2626; font-weight: 700; }
    .total-row.paid     { color: #2563eb; font-weight: 700; }

    .net-total-block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 2px solid #000;
      border-bottom: 2px solid #000;
      padding: 4px 0;
      margin: 4px 0;
    }
    .net-total-label {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .net-total-amount {
      font-size: 15px;
      font-weight: 700;
    }

    /* ── PAYMENT BADGE ── */
    .payment-badge {
      text-align: center;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      border: 1px solid #000;
      display: inline-block;
      padding: 1px 6px;
      border-radius: 2px;
      margin: 3px 0;
    }

    /* ── FOOTER ── */
    .receipt-footer {
      text-align: center;
      margin-top: 8px;
      border-top: 1px dashed #000;
      padding-top: 6px;
      font-size: 9px;
      color: #555;
      line-height: 1.7;
    }
    .thank-you {
      font-size: 11px;
      font-weight: 700;
      color: #000;
      margin-bottom: 3px;
    }

    /* ── PRINT MEDIA ── */
    @media print {
      html, body {
        width: 80mm;
        max-width: 80mm;
        margin: 0;
        padding: 3mm 3mm;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      @page {
        size: 80mm auto;   /* thermal printer এর page size */
        margin: 0;         /* কোনো margin নেই, পুরো 80mm ব্যবহার হবে */
      }
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="receipt-header">
    ${logoHtml}
    <div class="shop-name">${settings.company_name}</div>
    <div class="shop-sub">${settings.company_address}</div>
    <div class="shop-sub">Phone: ${settings.company_phone}</div>
  </div>

  <!-- INVOICE META -->
  <div class="meta-block">
    <div class="meta-row">
      <span class="meta-label">Invoice No</span>
      <span class="meta-value">#${sale.invoice_no}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Date</span>
      <span class="meta-value">${date}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Customer</span>
      <span class="meta-value">${sale.customer_name || 'Walk-in Customer'}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Payment</span>
      <span class="meta-value">${paymentMethod}</span>
    </div>
  </div>

  <!-- ITEMS TABLE -->
  <table class="items-table">
    <thead>
      <tr>
        <th class="item-name">Item</th>
        <th class="item-qty">Qty</th>
        <th class="item-price">Price</th>
        <th class="item-total">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHTML}
    </tbody>
  </table>

  <hr class="divider" />

  <!-- TOTALS -->
  <div class="totals-block">
    <div class="total-row">
      <span>Subtotal</span>
      <span>৳${parseFloat(sale.subtotal || 0).toLocaleString()}</span>
    </div>
    ${totalDiscount > 0 ? `
    <div class="total-row discount">
      <span>Total Discount</span>
      <span>- ৳${totalDiscount.toLocaleString()}</span>
    </div>` : ''}
  </div>

  <!-- NET TOTAL -->
  <div class="net-total-block">
    <span class="net-total-label">NET TOTAL</span>
    <span class="net-total-amount">৳${netTotal.toLocaleString()}</span>
  </div>

  <!-- RECEIVED / DUE -->
  <div class="totals-block">
    <div class="total-row paid">
      <span>Received</span>
      <span>৳${paidAmount.toLocaleString()}</span>
    </div>
    <div class="total-row ${dueAmount > 0 ? 'due' : ''}">
      <span>Due Amount</span>
      <span>৳${dueAmount.toLocaleString()}</span>
    </div>
  </div>

  <!-- NOTE -->
  ${sale.note ? `<hr class="divider" /><div style="font-size:9px;color:#555;text-align:center;padding:2px 0;">${sale.note}</div>` : ''}

  <!-- FOOTER -->
  <div class="receipt-footer">
    <div class="thank-you">*** Thank You! ***</div>
    <div>Come again for your next purchase</div>
    <div style="margin-top:4px;">${settings.company_email !== 'N/A' ? settings.company_email : ''}</div>
    <div style="margin-top:6px;font-size:8px;">Powered by MY SHOP POS</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(() => {
        window.print();
        setTimeout(() => window.close(), 500);
      }, 400);
    };
  </script>
</body>
</html>`;
};
