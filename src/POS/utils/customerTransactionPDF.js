// src/utils/customerTransactionPDF.js

import { downloadBrandedPDF } from "./useBrandedPDF";

/**
 * downloadCustomerTransactionPDF - Generates a professional PDF for Customer Transaction History.
 * Uses the standardized Backbone PDF engine.
 *
 * @param {Object} customer - Customer data (name, phone, email, due_amount, id)
 * @param {Array} transactions - List of transaction objects
 * @param {Object} filters - Applied filters (start_date, end_date, transaction_type)
 * @param {Number} totalCount - Total number of transactions
 */
export const downloadCustomerTransactionPDF = (customer, transactions, filters = {}, totalCount = 0) => {
  if (!customer || !transactions || transactions.length === 0) return;

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '0';
    return parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'sale': return 'Sale';
      case 'sale_return': return 'Return';
      case 'due_collection': return 'Collection';
      default: return type.replace('_', ' ').toUpperCase();
    }
  };

  // Build table body
  const tableBody = transactions.map(txn => [
    txn.invoice_no || 'N/A',
    getTypeLabel(txn.transaction_type),
    formatDate(txn.date),
    `TK ${formatCurrency(txn.total)}`,
    `TK ${formatCurrency(txn.paid)}`,
    txn.due > 0 ? `TK ${formatCurrency(txn.due)}` : (txn.due < 0 ? `Adv. ${formatCurrency(Math.abs(txn.due))}` : '—'),
    txn.payment_method?.toUpperCase().replace('_', ' ') || 'N/A'
  ]);

  // Calculate summary totals
  const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.total || 0), 0);
  const totalDue = transactions.reduce((sum, t) => sum + parseFloat(t.due || 0), 0);
  const totalPaid = transactions.reduce((sum, t) => sum + parseFloat(t.paid || 0), 0);

  // Build filter info string
  let filterInfo = '';
  if (filters.start_date) filterInfo += `From: ${filters.start_date} `;
  if (filters.end_date) filterInfo += `To: ${filters.end_date} `;
  if (filters.transaction_type) filterInfo += `Type: ${filters.transaction_type.replace('_', ' ').toUpperCase()} `;
  if (filters.search) filterInfo += `Search: "${filters.search}" `;
  filterInfo = filterInfo.trim() || 'All transactions';

  downloadBrandedPDF({
    title: "Customer Transaction History",
    docNumber: `CUST-${customer.id}`,
    metaDetails: {
      leftTitle: "Customer Details:",
      leftItems: [
        `Name: ${customer.name || 'N/A'}`,
        `Phone: ${customer.phone || 'N/A'}`,
        `Email: ${customer.email || 'N/A'}`
      ],
      rightTitle: "Account Summary:",
      rightItems: [
        `Total Transactions: ${totalCount}`,
        `Total Amount: TK ${formatCurrency(totalAmount)}`,
        `Total Paid: TK ${formatCurrency(totalPaid)}`,
        `Net Due: TK ${formatCurrency(totalDue)}`
      ]
    },
    tableHeaders: ["Invoice", "Type", "Date", "Total", "Paid", "Due / Advance", "Method"],
    tableBody: tableBody,
    summaryDetails: [
      {
        label: "FILTER APPLIED:",
        value: filterInfo,
        color: [100, 116, 139],
        isBold: false,
        drawTopLine: true
      },
      {
        label: "TOTAL TRANSACTIONS:",
        value: totalCount.toString(),
        isBold: true,
        color: [29, 78, 216]
      },
      {
        label: "TOTAL AMOUNT:",
        value: `TK ${formatCurrency(totalAmount)}`,
        isBold: true,
        color: [0, 0, 0]
      },
      {
        label: "TOTAL PAID:",
        value: `TK ${formatCurrency(totalPaid)}`,
        isBold: true,
        color: [5, 122, 85]
      },
      {
        label: "NET DUE:",
        value: `TK ${formatCurrency(totalDue)}`,
        isBold: true,
        color: totalDue > 0 ? [220, 38, 38] : (totalDue < 0 ? [5, 122, 85] : [0, 0, 0]),
        drawTopLine: true
      }
    ]
  });
};