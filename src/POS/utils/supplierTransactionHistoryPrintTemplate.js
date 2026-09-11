// src/utils/supplierTransactionHistoryPrintTemplate.js

export const getSupplierTransactionHistoryPrintHTML = (supplier, transactions, filters, totalCount) => {
    const formatCurrency = (value) => {
        if (value === undefined || value === null) return '0';
        return parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTypeLabel = (type) => {
        switch(type) {
            case 'purchase': return 'Purchase';
            case 'purchase_return': return 'Return';
            case 'due_payment': return 'Payment';
            default: return type.replace('_', ' ').toUpperCase();
        }
    };

    const getTypeColor = (type) => {
        switch(type) {
            case 'purchase': return '#3b82f6';
            case 'purchase_return': return '#f59e0b';
            case 'due_payment': return '#10b981';
            default: return '#6b7280';
        }
    };

    // Build table rows
    const tableRows = transactions.map(txn => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 12px; font-weight: 600;">${txn.invoice_no || 'N/A'}</td>
            <td style="padding: 8px 12px;">
                <span style="background: ${getTypeColor(txn.transaction_type)}20; color: ${getTypeColor(txn.transaction_type)}; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase;">
                    ${getTypeLabel(txn.transaction_type)}
                </span>
            </td>
            <td style="padding: 8px 12px; color: #6b7280; font-size: 12px;">${formatDate(txn.date)}</td>
            <td style="padding: 8px 12px; text-align: right; font-weight: 600;">TK ${formatCurrency(txn.total)}</td>
            <td style="padding: 8px 12px; text-align: right; color: #10b981; font-weight: 600;">TK ${formatCurrency(txn.paid)}</td>
            <td style="padding: 8px 12px; text-align: right; ${txn.due > 0 ? 'color: #ef4444;' : txn.due < 0 ? 'color: #3b82f6;' : 'color: #9ca3af;'} font-weight: 600;">
                ${txn.due > 0 ? `TK ${formatCurrency(txn.due)}` : txn.due < 0 ? `Adv. ${formatCurrency(Math.abs(txn.due))}` : '—'}
            </td>
            <td style="padding: 8px 12px; text-align: center; text-transform: capitalize; font-size: 12px;">${txn.payment_method || 'N/A'}</td>
        </tr>
    `).join('');

    // Calculate totals
    const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.total || 0), 0);
    const totalPaid = transactions.reduce((sum, t) => sum + parseFloat(t.paid || 0), 0);
    const totalDue = transactions.reduce((sum, t) => sum + parseFloat(t.due || 0), 0);

    // Filter info
    let filterInfo = '';
    if (filters.start_date) filterInfo += `From: ${filters.start_date} `;
    if (filters.end_date) filterInfo += `To: ${filters.end_date} `;
    if (filters.transaction_type) filterInfo += `Type: ${filters.transaction_type.replace('_', ' ').toUpperCase()} `;
    if (filters.search) filterInfo += `Search: "${filters.search}" `;
    filterInfo = filterInfo.trim() || 'All transactions';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Supplier Transaction History</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    background: #f9fafb;
                    padding: 40px 20px;
                    color: #111827;
                }
                .print-container {
                    max-width: 1100px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
                    padding: 40px;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 20px;
                    margin-bottom: 24px;
                }
                .header-left h1 {
                    font-size: 24px;
                    font-weight: 800;
                    color: #1e293b;
                    letter-spacing: -0.5px;
                }
                .header-left p {
                    color: #6b7280;
                    font-size: 14px;
                    margin-top: 4px;
                }
                .header-right {
                    text-align: right;
                }
                .header-right .badge {
                    background: #7c3aed;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 700;
                }
                .supplier-info {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    background: #f8fafc;
                    border-radius: 12px;
                    padding: 16px 20px;
                    margin-bottom: 24px;
                }
                .supplier-info .label {
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: #94a3b8;
                    letter-spacing: 0.5px;
                }
                .supplier-info .value {
                    font-size: 14px;
                    font-weight: 600;
                    color: #1e293b;
                }
                .filter-info {
                    font-size: 12px;
                    color: #6b7280;
                    margin-bottom: 16px;
                    padding: 8px 12px;
                    background: #f1f5f9;
                    border-radius: 8px;
                    display: inline-block;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 13px;
                }
                thead {
                    background: #f1f5f9;
                }
                th {
                    padding: 10px 12px;
                    text-align: left;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 10px;
                    letter-spacing: 0.5px;
                    color: #475569;
                    border-bottom: 2px solid #e2e8f0;
                }
                th:last-child, td:last-child {
                    text-align: center;
                }
                .summary {
                    margin-top: 24px;
                    border-top: 2px solid #e5e7eb;
                    padding-top: 20px;
                    display: flex;
                    justify-content: flex-end;
                    gap: 40px;
                }
                .summary-item {
                    text-align: right;
                }
                .summary-item .label {
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: #94a3b8;
                    letter-spacing: 0.5px;
                }
                .summary-item .value {
                    font-size: 18px;
                    font-weight: 800;
                }
                .footer {
                    margin-top: 32px;
                    border-top: 1px solid #e5e7eb;
                    padding-top: 16px;
                    text-align: center;
                    font-size: 11px;
                    color: #94a3b8;
                }
                @media print {
                    body { background: white; padding: 20px; }
                    .print-container { box-shadow: none; border: 1px solid #e5e7eb; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
                <!-- Header -->
                <div class="header">
                    <div class="header-left">
                        <h1>Supplier Transaction History</h1>
                        <p>Complete ledger of all transactions for this supplier</p>
                    </div>
                    <div class="header-right">
                        <span class="badge">#${supplier.id}</span>
                        <p style="margin-top: 4px; font-size: 12px; color: #6b7280;">${new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <!-- Supplier Info -->
                <div class="supplier-info">
                    <div>
                        <div class="label">Supplier Name</div>
                        <div class="value">${supplier.name || 'N/A'}</div>
                    </div>
                    <div>
                        <div class="label">Phone / Email</div>
                        <div class="value">${supplier.phone || 'N/A'} ${supplier.email ? '| ' + supplier.email : ''}</div>
                    </div>
                    <div>
                        <div class="label">Total Transactions</div>
                        <div class="value">${totalCount}</div>
                    </div>
                    <div>
                        <div class="label">Current Due Balance</div>
                        <div class="value" style="color: ${parseFloat(supplier.due_amount || 0) > 0 ? '#ef4444' : parseFloat(supplier.due_amount || 0) < 0 ? '#3b82f6' : '#111827'}">
                            ৳${formatCurrency(Math.abs(parseFloat(supplier.due_amount || 0)))}
                            ${parseFloat(supplier.due_amount || 0) > 0 ? '(Payable)' : parseFloat(supplier.due_amount || 0) < 0 ? '(Receivable)' : '(Settled)'}
                        </div>
                    </div>
                </div>

                <!-- Filter Info -->
                <div class="filter-info">📋 ${filterInfo}</div>

                <!-- Table -->
                <table>
                    <thead>
                        <tr>
                            <th>Invoice</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th style="text-align: right;">Total</th>
                            <th style="text-align: right;">Paid</th>
                            <th style="text-align: right;">Due / Advance</th>
                            <th>Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>

                <!-- Summary -->
                <div class="summary">
                    <div class="summary-item">
                        <div class="label">Total Amount</div>
                        <div class="value">TK ${formatCurrency(totalAmount)}</div>
                    </div>
                    <div class="summary-item">
                        <div class="label">Total Paid</div>
                        <div class="value" style="color: #10b981;">TK ${formatCurrency(totalPaid)}</div>
                    </div>
                    <div class="summary-item">
                        <div class="label">Net Due</div>
                        <div class="value" style="color: ${totalDue > 0 ? '#ef4444' : totalDue < 0 ? '#3b82f6' : '#111827'};">
                            TK ${formatCurrency(totalDue)}
                            ${totalDue > 0 ? '(Due)' : totalDue < 0 ? '(Advance)' : '(Settled)'}
                        </div>
                    </div>
                </div>

                <div class="footer">
                    Generated on ${new Date().toLocaleString()} &bull; Supplier ID: #${supplier.id}
                </div>
            </div>
        </body>
        </html>
    `;
};