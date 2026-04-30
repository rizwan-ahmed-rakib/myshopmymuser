import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadPurchasePDF = (purchase) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Background
  doc.setFillColor(185, 28, 28); // Red-700
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Company Logo / Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("MY SHOP POS", 14, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Premium Inventory & Sales System", 14, 28);

  // Invoice Label
  doc.setFontSize(18);
  doc.text("SALE RETURN", pageWidth - 14, 20, { align: "right" });
  doc.setFontSize(10);
  doc.text(`Return #: ${purchase.invoice_no || purchase.id}`, pageWidth - 14, 28, { align: "right" });

  // Customer & Date Info
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Customer Details:", 14, 55);
  doc.setFont("helvetica", "normal");
  doc.text(purchase.customer_name || "N/A", 14, 62);
  
  doc.setFont("helvetica", "bold");
  doc.text("Date:", pageWidth - 14, 55, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.text(new Date(purchase.created_at).toLocaleDateString(), pageWidth - 14, 62, { align: "right" });

  // Items Table
  autoTable(doc, {
    startY: 75,
    head: [["Product Description", "Return Qty", "Unit Price", "Total"]],
    body: purchase.items.map((i) => [
      i.product_name || i.sale_item_name || "N/A",
      i.quantity || i.sale_return_quantity,
      `BTD ${Number(i.unit_price).toFixed(2)}`,
      `BTD ${Number(i.total_price).toFixed(2)}`,
    ]),
    headStyles: { fillColor: [185, 28, 28], textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' }
    }
  });

  // Totals Section
  const finalY = doc.lastAutoTable.finalY + 15;
  const leftCol = pageWidth - 100;
  const rightCol = pageWidth - 14;

  const drawRow = (label, value, y, isBold = false, color = [31, 41, 55]) => {
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setTextColor(...color);
    doc.text(label, leftCol, y);
    doc.text(`BTD ${Number(value).toFixed(2)}`, rightCol, y, { align: "right" });
  };

  drawRow("Total Return Amount:", purchase.total_amount || purchase.total_return_amount, finalY, true, [185, 28, 28]);
  drawRow("Paid (Refunded):", purchase.paid_amount, finalY + 7);
  drawRow("Balance Due:", purchase.due_amount, finalY + 14, true);

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.text("Sale Return Document", pageWidth / 2, 280, { align: "center" });
  doc.text("This is a computer-generated document.", pageWidth / 2, 285, { align: "center" });

  doc.save(`SaleReturn-${purchase.invoice_no || purchase.id}.pdf`);
};
