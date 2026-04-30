import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadPurchasePDF = (purchase) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const netTotal = purchase.net_total || purchase.netTotal || 0;
  const globalDiscount = purchase.global_discount || purchase.globalDiscount || 0;
  const totalDiscount = purchase.total_discount || purchase.totalDiscount || 0;
  
  const paidCash = purchase.paid_cash || 0;
  const paidMobile = purchase.paid_mobile || 0;
  const paidBank = purchase.paid_bank || 0;

  // Header Background
  doc.setFillColor(31, 41, 55); // Dark Gray (Gray-800)
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Company Logo / Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("MY SHOP POS", 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Premium Inventory & Sales System", 14, 28);

  // Invoice Label
  doc.setFontSize(18);
  doc.text("PURCHASE INVOICE", pageWidth - 14, 20, { align: "right" });
  doc.setFontSize(10);
  doc.text(`Invoice #: ${purchase.invoice_no}`, pageWidth - 14, 28, { align: "right" });

  // Supplier & Date Info
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Supplier Details:", 14, 55);
  doc.setFont("helvetica", "normal");
  doc.text(purchase.supplier_name || "N/A", 14, 62);

  doc.setFont("helvetica", "bold");
  doc.text("Date:", pageWidth - 14, 55, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.text(new Date(purchase.created_at).toLocaleDateString(), pageWidth - 14, 62, { align: "right" });

  // Items Table
  autoTable(doc, {
    startY: 75,
    head: [["Product Description", "Qty", "Unit Price", "Discount", "Total"]],
    body: purchase.items.map((i) => [
      i.product_name,
      i.quantity,
      `${Number(i.unit_price).toFixed(2)}`,
      `${Number(i.discount_amount || 0).toFixed(2)}`,
      `${Number(i.net_total).toFixed(2)}`,
    ]),
    headStyles: { fillColor: [31, 41, 55], textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    styles: { fontSize: 9, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' }
    }
  });

  // Totals Section
  let finalY = doc.lastAutoTable.finalY + 12;
  const leftCol = pageWidth - 110;
  const rightCol = pageWidth - 14;

  const drawRow = (label, value, y, isBold = false, color = [31, 41, 55], prefix = "৳") => {
    doc.setFontSize(10);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setTextColor(...color);
    doc.text(label, leftCol, y);
    doc.text(`${prefix} ${Number(value).toFixed(2)}`, rightCol, y, { align: "right" });
    return y + 7;
  };

  finalY = drawRow("Gross Total:", purchase.total_amount, finalY);
  finalY = drawRow("Itemwise Discount:", purchase.itemwise_total_discount, finalY, false, [22, 163, 74]);
  finalY = drawRow("Subtotal:", purchase.subtotal, finalY);
  finalY = drawRow("Global Discount:", globalDiscount, finalY, false, [22, 163, 74]);

  doc.setLineWidth(0.5);
  doc.setDrawColor(209, 213, 219);
  doc.line(leftCol, finalY - 2, rightCol, finalY - 2);

  finalY += 2;
  finalY = drawRow("NET PAYABLE:", netTotal, finalY, true, [29, 78, 216]);
  
  // Paid Breakdown
  finalY = drawRow("Total Paid Amount:", purchase.paid_amount, finalY, true, [5, 122, 85]);
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  if (paidCash > 0) finalY = drawRow("  - Paid by Cash:", paidCash, finalY, false, [100, 100, 100], "");
  if (paidMobile > 0) finalY = drawRow("  - Paid by Mobile:", paidMobile, finalY, false, [100, 100, 100], "");
  if (paidBank > 0) finalY = drawRow("  - Paid by Bank:", paidBank, finalY, false, [100, 100, 100], "");

  doc.setDrawColor(220, 38, 38);
  doc.line(leftCol, finalY - 2, rightCol, finalY - 2);
  finalY += 2;
  drawRow("Due Amount:", purchase.due_amount, finalY, true, [220, 38, 38]);

  // Footer
  const footerY = 280;
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.text("Thank you for your business!", pageWidth / 2, footerY, { align: "center" });
  doc.text("Computer Generated Invoice - Powered by MY SHOP POS", pageWidth / 2, footerY + 5, { align: "center" });

  doc.save(`Invoice-${purchase.invoice_no}.pdf`);
};
