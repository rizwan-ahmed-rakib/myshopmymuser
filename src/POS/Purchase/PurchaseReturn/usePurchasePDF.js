import { downloadBrandedPDF } from "../../utils/useBrandedPDF";

/**
 * downloadPurchaseReturnPDF - Generates a professional PDF for Purchase Returns.
 * Uses the standardized Backbone PDF engine.
 * 
 * @param {Object} purchaseReturn - The purchase return record data
 */
export const downloadPurchaseReturnPDF = (purchaseReturn) => {
  if (!purchaseReturn) return;

  downloadBrandedPDF({
    title: "Purchase Return",
    docNumber: purchaseReturn.id.toString(),
    metaDetails: {
      leftTitle: "Supplier Details:",
      leftItems: [
        `Name: ${purchaseReturn.supplier_name || "N/A"}`,
        `Original Inv: #${purchaseReturn.purchase_invoice_no || "N/A"}`
      ],
      rightTitle: "Return Info:",
      rightItems: [
        `Date: ${new Date(purchaseReturn.created_at).toLocaleDateString()}`,
        `Status: ${purchaseReturn.payment_status?.toUpperCase() || "N/A"}`
      ]
    },
    tableHeaders: ["Product Description", "Qty", "Price", "Penalty", "Total"],
    tableBody: purchaseReturn.items.map(item => [
      item.product_name,
      item.purchase_return_quantity.toString(),
      `TK ${parseFloat(item.unit_price).toLocaleString()}`,
      `TK ${parseFloat(item.penalty_amount || 0).toLocaleString()}`,
      `TK ${parseFloat(item.total_price).toLocaleString()}`
    ]),
    summaryDetails: [
      {
        label: "GROSS RETURN:",
        value: `TK ${parseFloat(purchaseReturn.total_return_amount).toLocaleString()}`,
      },
      {
        label: "TOTAL PENALTIES:",
        value: `- TK ${(parseFloat(purchaseReturn.total_item_penalty || 0) + parseFloat(purchaseReturn.global_penalty || 0)).toLocaleString()}`,
        color: [220, 38, 38]
      },
      {
        label: "NET REFUND:",
        value: `TK ${parseFloat(purchaseReturn.net_return_amount).toLocaleString()}`,
        isBold: true,
        color: [220, 38, 38],
        drawTopLine: true
      },
      {
        label: "RECEIVED BACK:",
        value: `TK ${parseFloat(purchaseReturn.paid_amount).toLocaleString()}`,
        isBold: true,
        color: [5, 122, 85]
      },
      {
        label: "PENDING REFUND:",
        value: `TK ${parseFloat(purchaseReturn.due_amount).toLocaleString()}`,
        isBold: true,
        color: [245, 158, 11],
        drawTopLine: true
      }
    ]
  });
};

// Also keep the old name if needed for compatibility, but the details page should use the new one.
export const downloadPurchasePDF = downloadPurchaseReturnPDF;