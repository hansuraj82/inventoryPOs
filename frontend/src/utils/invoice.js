import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


export const generateInvoicePDF = async (saleData, shopName) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  const LEFT = 15;
  const RIGHT = pageWidth - 15;

  let y = 20;

  // COLORS
  const C_MAIN = [15, 23, 42];
  const C_ACCENT = [79, 70, 229];
  const C_MUTED = [100, 116, 139];
  const C_BG = [248, 250, 252];

  // TOP BAR
  doc.setFillColor(...C_ACCENT);
  doc.rect(0, 0, pageWidth, 2, 'F');

  // HEADER
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...C_MAIN);
  doc.text(shopName.toUpperCase(), LEFT, y);

  // BADGE
  const isPaid = !(saleData.isCredit && saleData.creditAmount > 0);
  const badgeX = RIGHT - 35;

  doc.setFillColor(isPaid ? 240 : 254, isPaid ? 253 : 242, isPaid ? 244 : 242);
  doc.roundedRect(badgeX, y - 6, 35, 8, 1, 1, 'F');

  doc.setFontSize(8);
  doc.setTextColor(isPaid ? 21 : 153, isPaid ? 128 : 27, isPaid ? 61 : 27);
  doc.text(isPaid ? "PAID IN FULL" : "PAYMENT DUE", badgeX + 17.5, y - 0.5, { align: 'center' });

  y += 10;

  // INFO BOX
  doc.setFillColor(...C_BG);
  doc.roundedRect(LEFT, y, pageWidth - 25, 25, 1, 1, 'F');

  doc.setFontSize(7);
  doc.setTextColor(...C_MUTED);
  doc.text("BILLED TO", LEFT + 5, y + 7);
  doc.text("INVOICE NO", RIGHT - 40, y + 7);
  doc.text("DATE", RIGHT - 40, y + 17);

  const invoiceId = saleData?._id
    ? `${shopName.substring(0, 4).replaceAll(" ", "").toUpperCase()}${saleData._id.substring(0, 4).toUpperCase()}`
    : "N/A";

  const date = saleData.createdAt
    ? new Date(saleData.createdAt).toLocaleDateString('en-IN')
    : "N/A";

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C_MAIN);

  doc.text(saleData.customer?.name || "Customer", LEFT + 5, y + 13);
  doc.text(invoiceId, RIGHT, y + 7, { align: 'right' });
  doc.text(date, RIGHT, y + 17, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Mob: ${saleData.customer?.mobile || 'N/A'}`, LEFT + 5, y + 18);

  y += 35;

  // =========================
  // 🔥 MANUAL TABLE START
  // =========================

  const colX = {
    sno: LEFT,
    desc: LEFT + 15,
    qty: RIGHT - 75,
    price: RIGHT - 50,
    subtotal: RIGHT
  };

  const rowHeight = 8;

  // HEADER ROW
  doc.setFillColor(...C_BG);
  doc.rect(LEFT, y, pageWidth - 30, rowHeight, 'F');

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C_ACCENT);

  doc.text("#", colX.sno, y + 5);
  doc.text("DESCRIPTION", colX.desc, y + 5);
  doc.text("QTY", colX.qty, y + 5, { align: 'center' });
  doc.text("UNIT PRICE", colX.price, y + 5, { align: 'right' });
  doc.text("SUBTOTAL", colX.subtotal, y + 5, { align: 'right' });

  y += rowHeight;

  // LINE UNDER HEADER
  doc.setDrawColor(...C_ACCENT);
  doc.line(LEFT, y, RIGHT, y);

  // ITEMS
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C_MAIN);

  (saleData.items || []).forEach((item, i) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    const subtotal = price * qty;

    // WRAP TEXT (important)
    const descLines = doc.splitTextToSize(item.productName, colX.qty - colX.desc - 5);
    const dynamicHeight = Math.max(rowHeight, descLines.length * 5);

    doc.text((i + 1).toString().padStart(2, '0'), colX.sno, y + 5);
    doc.text(descLines, colX.desc, y + 5);
    doc.text(qty.toString(), colX.qty, y + 5, { align: 'center' });
    doc.text(`Rs. ${price.toFixed(2)}`, colX.price, y + 5, { align: 'right' });
    doc.text(`Rs. ${subtotal.toFixed(2)}`, colX.subtotal, y + 5, { align: 'right' });

    y += dynamicHeight;

    // ROW DIVIDER
    doc.setDrawColor(230);
    doc.line(LEFT, y, RIGHT, y);
  });

  // =========================
  // 🔥 SUMMARY
  // =========================

  y += 10;

  const total = Number(saleData.totalAmount || 0).toFixed(2);
  const summaryLeft = RIGHT - 70;

  doc.setFontSize(9);
  doc.setTextColor(...C_MUTED);
  doc.text("Subtotal:", summaryLeft, y);
  doc.text(`Rs. ${total}`, RIGHT, y, { align: 'right' });

  y += 8;

  doc.setDrawColor(...C_ACCENT);
  doc.line(summaryLeft, y - 4, RIGHT, y - 4);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C_ACCENT);
  doc.text("TOTAL AMOUNT:", summaryLeft, y + 2);

  doc.setTextColor(...C_MAIN);
  doc.text(`Rs. ${total}`, RIGHT, y + 2, { align: 'right' });

  // PAYMENT BOX
  y += 20;

  doc.setFillColor(...C_BG);
  doc.roundedRect(LEFT, y, 60, 15, 1, 1, 'F');

  doc.setFontSize(7);
  doc.setTextColor(...C_MUTED);
  doc.text("PAYMENT METHOD", LEFT + 5, y + 6);

  doc.setFontSize(9);
  doc.setTextColor(...C_MAIN);
  doc.setFont("helvetica", "bold");
  doc.text((saleData.paymentMethod || "CASH").toUpperCase(), LEFT + 5, y + 11);

  return doc;
};

export const printInvoice = async (saleData, shopName) => {
  const doc = await generateInvoicePDF(saleData, shopName);

  // Create a blob and open in new window for better printing
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const printWindow = window.open(pdfUrl, '_blank');

  // Wait for window to load then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
};

export const downloadInvoice = async (saleData, shopName) => {
  const doc = await generateInvoicePDF(saleData, shopName);
  const date = new Date(saleData.createdAt).toLocaleDateString('en-IN');
  const fileName = `Invoice_${date}_${saleData._id.substring(0, 8)}.pdf`;
  doc.save(fileName);
};
