import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadPurchasePDF = (purchase) => {
  const doc = new jsPDF();

  doc.text(`Purchase Invoice #${purchase.invoice_no}`, 14, 15);

  autoTable(doc, {
    startY: 25,
    head: [["Product", "Qty", "Unit", "Total"]],
    body: purchase.items.map((i) => [
      i.product_name,
      i.quantity,
      i.unit_price,
      i.total_price,
    ]),
  });

  const y = doc.lastAutoTable.finalY + 10;
  doc.text(`Total: ${purchase.total_amount}`, 14, y);
  doc.text(`Paid: ${purchase.paid_amount}`, 14, y + 6);
  doc.text(`Due: ${purchase.due_amount}`, 14, y + 12);

  doc.save(`purchase-${purchase.invoice_no}.pdf`);
};
