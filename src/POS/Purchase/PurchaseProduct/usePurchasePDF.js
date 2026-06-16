import { downloadBrandedPDF } from "../../utils/useBrandedPDF";

/**
 * downloadPurchasePDF - Generates a professional PDF for Purchase Invoices.
 * Uses the standardized Backbone PDF engine.
 * 
 * @param {Object} purchase - The purchase record data
 */
export const downloadPurchasePDF = (purchase) => {
  if (!purchase) return;

  downloadBrandedPDF({
    title: "Purchase Invoice",
    docNumber: purchase.invoice_no,
    metaDetails: {
      leftTitle: "Supplier Details:",
      leftItems: [
        `Name: ${purchase.supplier_name || "N/A"}`,
        `Method: ${purchase.payment_method?.toUpperCase().replace('_', ' ') || "N/A"}`
      ],
      rightTitle: "Invoice Info:",
      rightItems: [
        `Date: ${new Date(purchase.created_at).toLocaleDateString()}`,
        `Status: ${purchase.payment_status?.toUpperCase() || "N/A"}`
      ]
    },
    tableHeaders: ["Product Description", "Qty", "Price", "Discount", "Total"],
    tableBody: purchase.items.map(item => [
      item.product_name,
      item.quantity.toString(),
      `TK ${parseFloat(item.unit_price).toLocaleString()}`,
      `TK ${parseFloat(item.discount_amount || 0).toLocaleString()}`,
      `TK ${parseFloat(item.net_total).toLocaleString()}`
    ]),
    summaryDetails: [
      {
        label: "GROSS TOTAL:",
        value: `TK ${parseFloat(purchase.total_amount).toLocaleString()}`,
      },
      {
        label: "ITEM DISCOUNT:",
        value: `- TK ${parseFloat(purchase.itemwise_total_discount || 0).toLocaleString()}`,
        color: [5, 122, 85]
      },
      {
        label: "SUBTOTAL:",
        value: `TK ${parseFloat(purchase.subtotal).toLocaleString()}`,
        drawTopLine: true
      },
      {
        label: "GLOBAL DISCOUNT:",
        value: `- TK ${parseFloat(purchase.global_discount || 0).toLocaleString()}`,
        color: [5, 122, 85]
      },
      {
        label: "NET PAYABLE:",
        value: `TK ${parseFloat(purchase.net_total).toLocaleString()}`,
        isBold: true,
        color: [29, 78, 216],
        drawTopLine: true
      },
      {
        label: "TOTAL PAID:",
        value: `TK ${parseFloat(purchase.paid_amount).toLocaleString()}`,
        isBold: true,
        color: [5, 122, 85]
      },
      {
        label: "DUE AMOUNT:",
        value: `TK ${parseFloat(purchase.due_amount).toLocaleString()}`,
        isBold: true,
        color: [220, 38, 38],
        drawTopLine: true
      }
    ]
  });
};