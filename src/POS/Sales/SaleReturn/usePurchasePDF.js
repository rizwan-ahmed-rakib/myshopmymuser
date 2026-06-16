import { downloadBrandedPDF } from "../../utils/useBrandedPDF";

/**
 * downloadSaleReturnPDF - Generates a professional PDF for Sale Returns.
 * Uses the standardized Backbone PDF engine.
 * 
 * @param {Object} saleReturn - The sale return record data
 */
export const downloadSaleReturnPDF = (saleReturn) => {
  if (!saleReturn) return;

  downloadBrandedPDF({
    title: "Sale Return",
    docNumber: saleReturn.id.toString(),
    metaDetails: {
      leftTitle: "Customer Details:",
      leftItems: [
        `Name: ${saleReturn.customer_name || "Walk-in Customer"}`,
        `Original Inv: #${saleReturn.sale_invoice_no || "N/A"}`
      ],
      rightTitle: "Return Info:",
      rightItems: [
        `Date: ${new Date(saleReturn.created_at).toLocaleDateString()}`,
        `Status: ${saleReturn.payment_status?.toUpperCase() || "N/A"}`
      ]
    },
    tableHeaders: ["Product Description", "Qty", "Price", "Penalty", "Total"],
    tableBody: saleReturn.items.map(item => [
      item.product_name,
      item.sale_return_quantity.toString(),
      `TK ${parseFloat(item.unit_price).toLocaleString()}`,
      `TK ${parseFloat(item.penalty_amount || 0).toLocaleString()}`,
      `TK ${parseFloat(item.total_price).toLocaleString()}`
    ]),
    summaryDetails: [
      {
        label: "GROSS RETURN:",
        value: `TK ${parseFloat(saleReturn.total_return_amount).toLocaleString()}`,
      },
      {
        label: "TOTAL PENALTIES:",
        value: `- TK ${(parseFloat(saleReturn.total_item_penalty || 0) + parseFloat(saleReturn.global_penalty || 0)).toLocaleString()}`,
        color: [220, 38, 38]
      },
      {
        label: "NET REFUND:",
        value: `TK ${parseFloat(saleReturn.net_return_amount).toLocaleString()}`,
        isBold: true,
        color: [220, 38, 38],
        drawTopLine: true
      },
      {
        label: "PAID BACK:",
        value: `TK ${parseFloat(saleReturn.paid_amount).toLocaleString()}`,
        isBold: true,
        color: [5, 122, 85]
      },
      {
        label: "PENDING REFUND:",
        value: `TK ${parseFloat(saleReturn.due_amount).toLocaleString()}`,
        isBold: true,
        color: [245, 158, 11],
        drawTopLine: true
      }
    ]
  });
};

export const downloadPurchasePDF = downloadSaleReturnPDF;