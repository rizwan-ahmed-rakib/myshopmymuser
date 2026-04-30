import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadPurchasePDF = (purchase) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Background
  doc.setFillColor(5, 122, 85); // Emerald Green
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
  doc.text("SALE INVOICE", pageWidth - 14, 20, { align: "right" });
  doc.setFontSize(10);
  doc.text(`Invoice #: ${purchase.invoice_no}`, pageWidth - 14, 28, { align: "right" });

  // Customer & Date Info
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Customer Details:", 14, 55);
  doc.setFont("helvetica", "normal");
  doc.text(purchase.customer_name || "Walking Customer", 14, 62);
  
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
      `BTD ${Number(i.unit_price).toFixed(2)}`,
      `BTD ${Number(i.discount_amount || 0).toFixed(2)}`,
      `BTD ${Number(i.net_total).toFixed(2)}`,
    ]),
    headStyles: { fillColor: [5, 122, 85], textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' }
    }
  });

  // Totals Section
  const finalY = doc.lastAutoTable.finalY + 15;
  const leftCol = pageWidth - 100;
  const rightCol = pageWidth - 14;

  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  
  const drawRow = (label, value, y, isBold = false, color = [31, 41, 55]) => {
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setTextColor(...color);
    doc.text(label, leftCol, y);
    doc.text(`BTD ${Number(value).toFixed(2)}`, rightCol, y, { align: "right" });
  };

  drawRow("Gross Total:", purchase.total_amount, finalY);
  drawRow("Itemwise Discount:", purchase.itemwise_total_discount, finalY + 7, false, [22, 163, 74]);
  drawRow("Subtotal:", purchase.subtotal, finalY + 14);
  drawRow("Global Discount:", purchase.globalDiscount, finalY + 21, false, [22, 163, 74]);
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(209, 213, 219);
  doc.line(leftCol, finalY + 25, rightCol, finalY + 25);

  drawRow("NET TOTAL:", purchase.netTotal, finalY + 33, true, [5, 122, 85]);
  drawRow("Paid Amount:", purchase.paid_amount, finalY + 40, true, [5, 122, 85]);
  drawRow("Due Amount:", purchase.due_amount, finalY + 47, true, [200, 30, 30]);

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.text("Thank you for your business!", pageWidth / 2, 280, { align: "center" });
  doc.text("This is a computer-generated invoice.", pageWidth / 2, 285, { align: "center" });

  doc.save(`SaleInvoice-${purchase.invoice_no}.pdf`);
};
