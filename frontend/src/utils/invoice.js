import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateInvoicePDF = async (saleData, shopName) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;

  // ============== HEADER SECTION ==============
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text(shopName, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;

  doc.setFontSize(11);
  doc.text('RECEIPT / INVOICE', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 12;

  // Header line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(10, yPosition, pageWidth - 10, yPosition);
  yPosition += 6;

  // Invoice details
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  
  const invoiceDate = new Date(saleData.createdAt);
  const dateStr = invoiceDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const timeStr = invoiceDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  doc.text(`Invoice #: ${saleData._id.substring(0, 8).toUpperCase()}`, 12, yPosition);
  doc.text(`Date: ${dateStr}`, 110, yPosition);
  yPosition += 6;
  doc.text(`Time: ${timeStr}`, 110, yPosition);
  yPosition += 10;

  // ============== CUSTOMER INFORMATION ==============
  doc.setFont(undefined, 'bold');
  doc.text('CUSTOMER DETAILS', 12, yPosition);
  yPosition += 6;

  doc.setFont(undefined, 'normal');
  doc.text(`Name: ${saleData.customer.name}`, 12, yPosition);
  yPosition += 5;
  doc.text(`Mobile: ${saleData.customer.mobile}`, 12, yPosition);
  yPosition += 5;

  if (saleData.customer.address) {
    doc.text(`Address: ${saleData.customer.address.substring(0, 40)}`, 12, yPosition);
    yPosition += 5;
  }

  if (saleData.customer.email) {
    doc.text(`Email: ${saleData.customer.email}`, 12, yPosition);
    yPosition += 5;
  }

  yPosition += 3;
  doc.line(10, yPosition, pageWidth - 10, yPosition);
  yPosition += 6;

  // ============== ITEMS TABLE ==============
  doc.setFont(undefined, 'bold');
  doc.setFontSize(9);
  
  // Table headers
  const tableTop = yPosition;
  doc.text('Item Description', 12, yPosition);
  doc.text('Qty', 110, yPosition);
  doc.text('Unit Price', 135, yPosition);
  doc.text('Amount', 170, yPosition, { align: 'right' });
  yPosition += 5;

  doc.setLineWidth(0.3);
  doc.line(10, yPosition, pageWidth - 10, yPosition);
  yPosition += 3;

  // Table items
  doc.setFont(undefined, 'normal');
  doc.setFontSize(8);

  saleData.items.forEach((item, idx) => {
    const itemName = item.productName.substring(0, 35);
    const itemTotal = (item.price * item.quantity).toFixed(2);

    doc.text(itemName, 12, yPosition);
    doc.text(item.quantity.toString(), 110, yPosition);
    doc.text(`₹${parseFloat(item.price).toFixed(2)}`, 135, yPosition);
    doc.text(`₹${itemTotal}`, 170, yPosition, { align: 'right' });

    yPosition += 5;

    // Page break if needed
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }
  });

  yPosition += 2;
  doc.setLineWidth(0.5);
  doc.line(10, yPosition, pageWidth - 10, yPosition);
  yPosition += 6;

  // ============== AMOUNT SUMMARY ==============
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);

  // Subtotal
  doc.text('Subtotal:', 110, yPosition);
  doc.text(`₹${parseFloat(saleData.totalAmount).toFixed(2)}`, 170, yPosition, { align: 'right' });
  yPosition += 5;

  // Total
  doc.setFont(undefined, 'bold');
  doc.setFontSize(11);
  doc.text('TOTAL AMOUNT:', 110, yPosition);
  doc.text(`₹${parseFloat(saleData.totalAmount).toFixed(2)}`, 170, yPosition, { align: 'right' });
  yPosition += 8;

  // ============== PAYMENT DETAILS ==============
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.setLineWidth(0.3);
  doc.line(10, yPosition, pageWidth - 10, yPosition);
  yPosition += 5;

  doc.text(`Payment Method: ${saleData.paymentMethod.toUpperCase()}`, 12, yPosition);
  yPosition += 5;

  doc.text('Amount Received:', 12, yPosition);
  doc.text(`₹${parseFloat(saleData.paidAmount).toFixed(2)}`, 170, yPosition, { align: 'right' });
  yPosition += 6;

  // Credit or Change
  doc.setFont(undefined, 'bold');
  if (saleData.isCredit && saleData.creditAmount > 0) {
    doc.text('CUSTOMER CREDIT/DUE:', 12, yPosition);
    doc.setTextColor(220, 53, 69); // Red color for credit
    doc.text(`₹${parseFloat(saleData.creditAmount).toFixed(2)}`, 170, yPosition, { align: 'right' });
    doc.setTextColor(0, 0, 0); // Reset to black
  } else {
    doc.text('CHANGE RETURNED:', 12, yPosition);
    doc.setTextColor(40, 167, 69); // Green color for change
    const change = (saleData.paidAmount - saleData.totalAmount).toFixed(2);
    doc.text(`₹${change}`, 170, yPosition, { align: 'right' });
    doc.setTextColor(0, 0, 0); // Reset to black
  }
  yPosition += 8;

  // ============== FOOTER ==============
  yPosition = pageHeight - 15;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.text('Thank you for your purchase!', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;
  doc.setFontSize(8);
  doc.text('Please visit again', pageWidth / 2, yPosition, { align: 'center' });

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
