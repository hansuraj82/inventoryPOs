import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// =================== HELPER FUNCTIONS ===================

/**
 * Converts numbers to words format in Indian rupees
 * Example: 68400 -> "Sixty-Eight Thousand Four Hundred"
 */
const convertNumberToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 
                 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Lakh', 'Crore'];

  if (num === 0) return 'Zero';

  const convertTwoDigits = (n) => {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
  };

  const convertThreeDigits = (n) => {
    if (n === 0) return '';
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    let result = hundred > 0 ? ones[hundred] + ' Hundred' : '';
    if (remainder > 0) {
      result += (result ? ' ' : '') + convertTwoDigits(remainder);
    }
    return result;
  };

  let numStr = Math.floor(num).toString().padStart(9, '0');
  let crore = parseInt(numStr.substring(0, 2));
  let lakh = parseInt(numStr.substring(2, 4));
  let thousand = parseInt(numStr.substring(4, 7));
  let hundred = parseInt(numStr.substring(7, 9));
  
  let result = '';
  
  if (crore > 0) {
    result += convertTwoDigits(crore) + ' Crore';
  }
  if (lakh > 0) {
    result += (result ? ' ' : '') + convertTwoDigits(lakh) + ' Lakh';
  }
  if (thousand > 0) {
    result += (result ? ' ' : '') + convertThreeDigits(thousand);
  }
  if (hundred > 0) {
    result += (result ? ' ' : '') + convertTwoDigits(hundred);
  }

  return result.trim();
};

/**
 * Format currency with rupees
 */
const formatCurrency = (value) => {
  return `Rs ${Number(value).toFixed(2)}`;
};

/**
 * Calculate GST breakdown
 */
const calculateGSTBreakdown = (items) => {
  let totalTaxable = 0;
  let totalTax = 0;
  const taxByRate = {};

  (items || []).forEach(item => {
    const taxableValue = Number(item.price) * Number(item.quantity);
    const gstRate = Number(item.gstRate) || 0;
    const taxAmount = (taxableValue * gstRate) / 100;

    totalTaxable += taxableValue;
    totalTax += taxAmount;

    // Group tax by rate
    if (!taxByRate[gstRate]) {
      taxByRate[gstRate] = { taxable: 0, tax: 0 };
    }
    taxByRate[gstRate].taxable += taxableValue;
    taxByRate[gstRate].tax += taxAmount;
  });

  return { totalTaxable, totalTax, grandTotal: totalTaxable + totalTax, taxByRate };
};

// =================== MAIN INVOICE GENERATION ===================

export const generateInvoicePDF = async (saleData, shopName, businessDetails = {}) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const MARGIN_LEFT = 12;
  const MARGIN_RIGHT = 12;
  const RIGHT = pageWidth - MARGIN_RIGHT;
  const CONTENT_WIDTH = pageWidth - (MARGIN_LEFT + MARGIN_RIGHT);

  // DESIGN COLORS
  const COLORS = {
    primary: [15, 23, 42],      // Dark blue-gray
    accent: [79, 70, 229],      // Indigo
    success: [34, 197, 94],     // Green
    danger: [239, 68, 68],      // Red
    muted: [100, 116, 139],     // Gray
    lightBg: [248, 250, 252],   // Light gray
    border: [226, 232, 240]     // Light border
  };

  let currentY = 15;
  const pageMargin = 12;
  const footerHeight = 30;

  const checkPageBreak = (requiredSpace) => {
    if (currentY + requiredSpace > pageHeight - footerHeight) {
      doc.addPage();
      currentY = MARGIN_LEFT;
      return true;
    }
    return false;
  };

  // =================== HEADER SECTION ===================
  // Top accent bar
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 0, pageWidth, 2.5, 'F');

  // Shop name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...COLORS.primary);
  doc.text(shopName.toUpperCase(), MARGIN_LEFT, currentY + 5);

  // Invoice status badge
  const isPaid = !(saleData.isCredit && saleData.creditAmount > 0);
  const badgeX = RIGHT - 38;
  const badgeY = currentY;
  
  doc.setFillColor(isPaid ? 220 : 254, isPaid ? 253 : 242, isPaid ? 244 : 242);
  doc.roundedRect(badgeX, badgeY - 1, 38, 7, 1, 1, 'F');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isPaid ? 21 : 153, isPaid ? 128 : 27, isPaid ? 61 : 27);
  doc.text(isPaid ? "PAID IN FULL" : "PAYMENT DUE", badgeX + 19, badgeY + 3.5, { align: 'center' });

  currentY += 14;

  // Business details section
  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, 18, 1, 1, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);

  let detailY = currentY + 5;
  const detailLineHeight = 3.7;

  if (businessDetails.gstin) {
    doc.text(`GSTIN: ${businessDetails.gstin}`, MARGIN_LEFT + 3, detailY);
    detailY += detailLineHeight;
  }
  if (businessDetails.pan) {
    doc.text(`PAN: ${businessDetails.pan}`, MARGIN_LEFT + 3, detailY);
    detailY += detailLineHeight;
  }
  if (businessDetails.address) {
    doc.text(`Address: ${businessDetails.address}`, MARGIN_LEFT + 3, detailY);
    detailY += detailLineHeight;
  }
  if (businessDetails.phone) {
    doc.text(`Phone: ${businessDetails.phone}`, MARGIN_LEFT + 3, detailY);
    detailY += detailLineHeight;
  }

  currentY += 20;

  // =================== INVOICE & CUSTOMER INFO ===================
  checkPageBreak(12);

  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH / 2 - 2, 12, 1, 1, 'F');
  doc.roundedRect(MARGIN_LEFT + CONTENT_WIDTH / 2 + 2, currentY, CONTENT_WIDTH / 2 - 2, 12, 1, 1, 'F');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.muted);

  const leftBoxX = MARGIN_LEFT + 3;
  const rightBoxX = MARGIN_LEFT + CONTENT_WIDTH / 2 + 5;

  doc.text('BILLED TO', leftBoxX, currentY + 3);
  doc.text('INVOICE DETAILS', rightBoxX, currentY + 3);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);

  doc.text(saleData.customer?.name || 'Customer', leftBoxX, currentY + 7);
  doc.text(saleData.invoiceNumber || 'N/A', rightBoxX, currentY + 7);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);

  doc.text(`Phone: ${saleData.customer?.mobile || 'N/A'}`, leftBoxX, currentY + 10);

  const date = saleData.createdAt
    ? new Date(saleData.createdAt).toLocaleDateString('en-IN')
    : 'N/A';
  doc.text(`Date: ${date}`, rightBoxX, currentY + 10);

  if (saleData.customer?.address) {
    doc.text(`Address: ${saleData.customer.address}`, leftBoxX, currentY + 13);
  }

  currentY += 15;

  // =================== ITEMS TABLE ===================
  checkPageBreak(25);

  const tableStartY = currentY;
  const colWidths = {
    sno: 8,
    item: 50,
    hsn: 18,
    qty: 14,
    rate: 24,
    taxable: 24,
    gst: 18,
    amount: 24
  };

  // Table header
  doc.setFillColor(...COLORS.accent);
  doc.rect(MARGIN_LEFT, currentY, CONTENT_WIDTH, 6, 'F');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);

  let colX = MARGIN_LEFT;
  doc.text('#', colX + colWidths.sno / 2, currentY + 4, { align: 'center' });
  colX += colWidths.sno;

  doc.text('ITEM DESCRIPTION', colX + 2, currentY + 4);
  colX += colWidths.item;

  doc.text('HSN/SAC', colX + 2, currentY + 4);
  colX += colWidths.hsn;

  doc.text('QTY', colX + colWidths.qty / 2, currentY + 4, { align: 'center' });
  colX += colWidths.qty;

  doc.text('RATE', colX + colWidths.rate / 2, currentY + 4, { align: 'center' });
  colX += colWidths.rate;

  doc.text('TAXABLE', colX + colWidths.taxable / 2, currentY + 4, { align: 'center' });
  colX += colWidths.taxable;

  doc.text('GST%', colX + colWidths.gst / 2, currentY + 4, { align: 'center' });
  colX += colWidths.gst;

  doc.text('AMOUNT', colX + colWidths.amount / 2, currentY + 4, { align: 'center' });

  currentY += 7;

  // Table items
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.primary);

  const rowHeight = 7;

  (saleData.items || []).forEach((item, index) => {
    checkPageBreak(rowHeight + 2);

    const itemPrice = Number(item.price) || 0;
    const itemQty = Number(item.quantity) || 0;
    const taxableValue = itemPrice * itemQty;
    const gstRate = Number(item.gstRate) || 0;
    const taxAmount = (taxableValue * gstRate) / 100;
    const itemTotal = taxableValue + taxAmount;

    colX = MARGIN_LEFT;

    // Serial number
    doc.setTextColor(...COLORS.muted);
    doc.text((index + 1).toString().padStart(2, '0'), colX + colWidths.sno / 2, currentY + 4, { align: 'center' });
    colX += colWidths.sno;

    // Item name with text wrapping
    doc.setTextColor(...COLORS.primary);
    const itemLines = doc.splitTextToSize(item.productName || 'N/A', colWidths.item - 3);
    const itemHeight = itemLines.length * 3;
    doc.text(itemLines, colX + 2, currentY + 4, { lineHeightFactor: 1.2, align: 'left' });
    colX += colWidths.item;

    // HSN Code
    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(7);
    const hsnDisplay = item.hsnCode && item.hsnCode.trim() ? item.hsnCode : 'No HSN';
    doc.text(hsnDisplay, colX + 2, currentY + 4);
    doc.setFontSize(8);
    colX += colWidths.hsn;

    // Quantity
    doc.setTextColor(...COLORS.primary);
    doc.text(itemQty.toString(), colX + colWidths.qty / 2, currentY + 4, { align: 'center' });
    colX += colWidths.qty;

    // Rate
    doc.text(`Rs ${itemPrice.toFixed(2)}`, colX + colWidths.rate / 2, currentY + 4, { align: 'center' });
    colX += colWidths.rate;

    // Taxable Value
    doc.text(`Rs ${taxableValue.toFixed(2)}`, colX + colWidths.taxable / 2, currentY + 4, { align: 'center' });
    colX += colWidths.taxable;

    // GST Rate
    doc.setTextColor(79, 70, 229);
    doc.setFont('helvetica', 'bold');
    doc.text(`${gstRate.toFixed(0)}%`, colX + colWidths.gst / 2, currentY + 4, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    colX += colWidths.gst;

    // Final Amount
    doc.setTextColor(...COLORS.primary);
    doc.text(`Rs ${itemTotal.toFixed(2)}`, colX + colWidths.amount / 2, currentY + 4, { align: 'center' });

    currentY += rowHeight;

    // Separator line
    doc.setDrawColor(...COLORS.border);
    doc.line(MARGIN_LEFT, currentY, RIGHT, currentY);
  });

  currentY += 2;

  // =================== TAX SUMMARY & AMOUNT SECTION ===================
  checkPageBreak(40);

  const { totalTaxable, totalTax, grandTotal, taxByRate } = calculateGSTBreakdown(saleData.items);

  // Left section - Tax breakdown table
  const taxSummaryLeftX = MARGIN_LEFT;
  const taxSummaryLeftWidth = CONTENT_WIDTH * 0.5 - 1;
  
  // Right section - Amount summary
  const taxSummaryRightX = MARGIN_LEFT + CONTENT_WIDTH * 0.5 + 1;
  const taxSummaryRightWidth = CONTENT_WIDTH * 0.5 - 2;

  // ===== LEFT: TAX BREAKDOWN TABLE =====
  const taxRatesCount = Object.keys(taxByRate).length;
  const taxBoxHeight = 28 + (taxRatesCount > 0 ? Math.max(taxRatesCount * 5, 12) : 12);
  
  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(taxSummaryLeftX, currentY, taxSummaryLeftWidth, taxBoxHeight, 1, 1, 'F');

  // Tax table header
  doc.setFillColor(79, 70, 229);
  doc.rect(taxSummaryLeftX + 1, currentY + 1, taxSummaryLeftWidth - 2, 5, 'F');
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('HSN/SAC', taxSummaryLeftX + 3, currentY + 4);
  doc.text('TAXABLE', taxSummaryLeftX + 38, currentY + 4, { align: 'left' });
  doc.text('GST%', taxSummaryLeftX + 60, currentY + 4, { align: 'center' });
  doc.text('TAX AMT', taxSummaryLeftX + taxSummaryLeftWidth - 10, currentY + 4, { align: 'center' });

  let tableY = currentY + 10;
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'normal');

  // Group items by HSN
  const itemsByHsn = {};
  (saleData.items || []).forEach(item => {
    const hsn = (item.hsnCode && item.hsnCode.trim()) ? item.hsnCode : 'No HSN';
    if (!itemsByHsn[hsn]) {
      itemsByHsn[hsn] = [];
    }
    itemsByHsn[hsn].push(item);
  });

  // Display HSN wise breakdown
  Object.keys(itemsByHsn).forEach(hsn => {
    const items = itemsByHsn[hsn];
    let hsnTaxable = 0;
    let hsnTax = 0;
    const rates = new Set();

    items.forEach(item => {
      const taxableValue = Number(item.price) * Number(item.quantity);
      const gstRate = Number(item.gstRate) || 0;
      const taxAmount = (taxableValue * gstRate) / 100;
      hsnTaxable += taxableValue;
      hsnTax += taxAmount;
      rates.add(gstRate);
    });

    const rateStr = Array.from(rates).join(',');
    doc.setFontSize(7);
    doc.text(hsn.substring(0, 8), taxSummaryLeftX + 3, tableY);
    doc.text(`Rs ${hsnTaxable.toFixed(0)}`, taxSummaryLeftX + 38, tableY, { align: 'left' });
    doc.text(rateStr, taxSummaryLeftX + 60, tableY, { align: 'center' });
    doc.text(`Rs ${hsnTax.toFixed(0)}`, taxSummaryLeftX + taxSummaryLeftWidth - 10, tableY, { align: 'center' });
    
    tableY += 5;
  });

  // ===== RIGHT: AMOUNT SUMMARY =====
  doc.setFillColor(...COLORS.accent);
  doc.roundedRect(taxSummaryRightX, currentY, taxSummaryRightWidth, 6, 1, 1, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('SUMMARY', taxSummaryRightX + 3, currentY + 4);

  let summaryY = currentY + 10;
  const taxSumLabelX = taxSummaryRightX + 3;
  const taxSumValueX = taxSummaryRightX + taxSummaryRightWidth - 3;

  // Subtotal
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text('Subtotal:', taxSumLabelX, summaryY);
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs ${totalTaxable.toFixed(2)}`, taxSumValueX, summaryY, { align: 'right' });

  summaryY += 5;
  
  // Total Tax
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text('Total Tax:', taxSumLabelX, summaryY);
  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs ${totalTax.toFixed(2)}`, taxSumValueX, summaryY, { align: 'right' });

  summaryY += 7;
  
  // Divider
  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(0.5);
  doc.line(taxSumLabelX, summaryY - 2, taxSumValueX, summaryY - 2);

  summaryY += 3;
  
  // Grand Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.accent);
  doc.text('GRAND TOTAL:', taxSumLabelX, summaryY);
  doc.text(`Rs ${grandTotal.toFixed(2)}`, taxSumValueX, summaryY, { align: 'right' });

  currentY += Math.max(taxBoxHeight, 28) + 3;

  // =================== AMOUNT IN WORDS ===================
  checkPageBreak(8);

  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, 7, 1, 1, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text('Amount in Words:', MARGIN_LEFT + 3, currentY + 3);

  const amountWords = convertNumberToWords(Math.floor(grandTotal));
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text(
    `Rs ${amountWords} Only`,
    MARGIN_LEFT + 3,
    currentY + 5.5
  );

  currentY += 10;

  // =================== PAYMENT DETAILS SECTION ===================
  checkPageBreak(16);

  // Payment box
  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH / 2 - 2, 14, 1, 1, 'F');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.accent);
  doc.text('PAYMENT METHOD', MARGIN_LEFT + 3, currentY + 3);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text((saleData.paymentMethod || 'CASH').toUpperCase(), MARGIN_LEFT + 3, currentY + 7);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text(`Amount Paid: ${formatCurrency(saleData.paidAmount || 0)}`, MARGIN_LEFT + 3, currentY + 11);

  // Summary box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(MARGIN_LEFT + CONTENT_WIDTH / 2 + 2, currentY, CONTENT_WIDTH / 2 - 2, 14, 1, 1, 'F');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.accent);
  doc.text('PAYMENT SUMMARY', MARGIN_LEFT + CONTENT_WIDTH / 2 + 5, currentY + 3);

  const rightPaymentX = MARGIN_LEFT + CONTENT_WIDTH / 2 + 5;
  const rightPaymentValueX = RIGHT - 3;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text('Grand Total:', rightPaymentX, currentY + 7);
  doc.text('Amount Paid:', rightPaymentX, currentY + 10);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.accent);
  doc.text(formatCurrency(grandTotal), rightPaymentValueX, currentY + 7, { align: 'right' });
  doc.text(formatCurrency(saleData.paidAmount || 0), rightPaymentValueX, currentY + 10, { align: 'right' });

  currentY += 16;

  // Remaining due
  if (saleData.isCredit && saleData.creditAmount > 0) {
    checkPageBreak(7);
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, 6, 1, 1, 'F');
    
    doc.setDrawColor(239, 68, 68);
    doc.setLineWidth(0.5);
    doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, 6, 1, 1);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(153, 27, 27);
    doc.text('REMAINING DUE:', MARGIN_LEFT + 3, currentY + 3.8);
    doc.text(formatCurrency(saleData.creditAmount), RIGHT - 3, currentY + 3.5, { align: 'right' });

    currentY += 8;
  }

  // =================== NOTES SECTION ===================
  if (saleData.notes) {
    checkPageBreak(10);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, 1, 0, 0, 'F');
    
    currentY += 2;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.accent);
    doc.text('NOTES:', MARGIN_LEFT, currentY);

    currentY += 2;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.primary);
    const notesLines = doc.splitTextToSize(saleData.notes, CONTENT_WIDTH - 4);
    doc.text(notesLines, MARGIN_LEFT + 2, currentY + 1, { lineHeightFactor: 1.2 });

    currentY += notesLines.length * 2.5 + 4;
  }

  // =================== FOOTER / SIGNATURE SECTION ===================
  const footerY = pageHeight - footerHeight + 5;

  // Top border
  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(1);
  doc.line(MARGIN_LEFT, footerY - 4, RIGHT, footerY - 4);

  // Signature section
  const signatureBoxWidth = CONTENT_WIDTH / 3;
  
  // For Bank details
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.accent);
  doc.text('BANK DETAILS', MARGIN_LEFT, footerY);
  
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.primary);
  if (businessDetails.bankDetails) {
    doc.text(businessDetails.bankDetails, MARGIN_LEFT, footerY + 3);
  } else {
    doc.text('Contact for bank details', MARGIN_LEFT, footerY + 3);
  }

  // Authorized signature
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.accent);
  doc.text('AUTHORIZED SIGNATORY', RIGHT - 40, footerY);
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(...COLORS.muted);
  doc.line(RIGHT - 40, footerY + 8, RIGHT, footerY + 8);

  // Footer info
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  const generatedDate = new Date(saleData.createdAt).toLocaleString('en-IN');
  const footerText = `Generated on ${generatedDate} | Invoice ID: ${saleData._id?.substring(0, 8) || 'N/A'}`;
  doc.text(footerText, MARGIN_LEFT, pageHeight - 3);

  // Page number
  const pageCount = doc.internal.getNumberOfPages();
  if (pageCount > 1) {
    doc.setFontSize(6);
    doc.setTextColor(...COLORS.muted);
    doc.text(`Page ${doc.internal.getCurrentPageNumber()} of ${pageCount}`, RIGHT, pageHeight - 3, { align: 'right' });
  }

  return doc;
};

export const printInvoice = async (saleData, shopName, businessDetails = {}) => {
  const doc = await generateInvoicePDF(saleData, shopName, businessDetails);

  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const printWindow = window.open(pdfUrl, '_blank');

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
};

export const downloadInvoice = async (saleData, shopName, businessDetails = {}) => {
  const doc = await generateInvoicePDF(saleData, shopName, businessDetails);
  const date = new Date(saleData.createdAt).toLocaleDateString('en-IN');
  const fileName = `GST_Invoice_${saleData.invoiceNumber || date}_${saleData._id.substring(0, 8)}.pdf`;
  doc.save(fileName);
};

