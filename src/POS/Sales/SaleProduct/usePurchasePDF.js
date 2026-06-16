import { downloadBrandedPDF } from "../../utils/useBrandedPDF";

/**
 * downloadSalePDF - Generates a professional PDF for Sale Invoices.
 * Uses the standardized Backbone PDF engine.
 * 
 * @param {Object} sale - The sale record data
 */
export const downloadSalePDF = (sale) => {
  if (!sale) return;

  downloadBrandedPDF({
    title: "Sale Invoice",
    docNumber: sale.invoice_no,
    metaDetails: {
      leftTitle: "Customer Details:",
      leftItems: [
        `Name: ${sale.customer_name || "Walk-in Customer"}`,
        `Method: ${sale.payment_method?.toUpperCase().replace('_', ' ') || "N/A"}`
      ],
      rightTitle: "Invoice Info:",
      rightItems: [
        `Date: ${new Date(sale.created_at).toLocaleDateString()}`,
        `Status: ${sale.payment_status?.toUpperCase() || "N/A"}`
      ]
    },
    tableHeaders: ["Product Description", "Qty", "Price", "Discount", "Total"],
    tableBody: sale.items.map(item => [
      item.product_name,
      item.quantity.toString(),
      `TK ${parseFloat(item.unit_price).toLocaleString()}`,
      `TK ${parseFloat(item.discount_amount || 0).toLocaleString()}`,
      `TK ${parseFloat(item.net_total).toLocaleString()}`
    ]),
    summaryDetails: [
      {
        label: "GROSS TOTAL:",
        value: `TK ${parseFloat(sale.total_amount).toLocaleString()}`,
      },
      {
        label: "ITEM DISCOUNT:",
        value: `- TK ${parseFloat(sale.itemwise_total_discount || 0).toLocaleString()}`,
        color: [5, 122, 85]
      },
      {
        label: "SUBTOTAL:",
        value: `TK ${parseFloat(sale.subtotal).toLocaleString()}`,
        drawTopLine: true
      },
      {
        label: "GLOBAL DISCOUNT:",
        value: `- TK ${parseFloat(sale.global_discount || sale.globalDiscount || 0).toLocaleString()}`,
        color: [5, 122, 85]
      },
      {
        label: "NET PAYABLE:",
        value: `TK ${parseFloat(sale.net_total || sale.netTotal).toLocaleString()}`,
        isBold: true,
        color: [29, 78, 216],
        drawTopLine: true
      },
      {
        label: "TOTAL RECEIVED:",
        value: `TK ${parseFloat(sale.paid_amount).toLocaleString()}`,
        isBold: true,
        color: [5, 122, 85]
      },
      {
        label: "DUE AMOUNT:",
        value: `TK ${parseFloat(sale.due_amount).toLocaleString()}`,
        isBold: true,
        color: [220, 38, 38],
        drawTopLine: true
      }
    ]
  });
};

export const downloadPurchasePDF = downloadSalePDF;