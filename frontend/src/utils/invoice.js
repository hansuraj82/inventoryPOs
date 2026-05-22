import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Logo } from './Logo';

// =================== HELPER FUNCTIONS ===================

/**
 * Converts numbers to words format in Indian rupees
 * Example: 68400 -> "Sixty-Eight Thousand Four Hundred"
 */
const convertNumberToWords = (num) => {
  const ones = [
    '', 'One', 'Two', 'Three', 'Four',
    'Five', 'Six', 'Seven', 'Eight', 'Nine'
  ];

  const teens = [
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen',
    'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty',
    'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  if (num === 0) {
    return 'Zero Rupees';
  }

  const convertTwoDigits = (n) => {
    if (n < 10) return ones[n];

    if (n < 20) {
      return teens[n - 10];
    }

    return (
      tens[Math.floor(n / 10)] +
      (n % 10 ? ` ${ones[n % 10]}` : '')
    );
  };

  const convertThreeDigits = (n) => {
    let result = '';

    if (n >= 100) {
      result += `${ones[Math.floor(n / 100)]} Hundred`;
      n %= 100;

      if (n) result += ' ';
    }

    if (n > 0) {
      result += convertTwoDigits(n);
    }

    return result;
  };

  const convertNumber = (n) => {
    if (n === 0) return 'Zero';

    let result = '';

    const crore = Math.floor(n / 10000000);
    n %= 10000000;

    const lakh = Math.floor(n / 100000);
    n %= 100000;

    const thousand = Math.floor(n / 1000);
    n %= 1000;

    const hundred = n;

    if (crore) {
      result += `${convertTwoDigits(crore)} Crore `;
    }

    if (lakh) {
      result += `${convertTwoDigits(lakh)} Lakh `;
    }

    if (thousand) {
      result += `${convertTwoDigits(thousand)} Thousand `;
    }

    if (hundred) {
      result += `${convertThreeDigits(hundred)} `;
    }

    return result.trim();
  };

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);

  let words = `${convertNumber(rupees)} Rupees`;

  if (paise > 0) {
    words += ` and ${convertNumber(paise)} Paise`;
  }

  return words.trim();
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
    border: [226, 232, 240],  // Light border
    jk: [19, 78, 74]
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


  doc.addImage(`data:image/png;base64,${Logo}`, "PNG", -10, -15, 260, 78);
  // Shop name
  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(20);
  doc.setTextColor(...COLORS.jk);


  const getCoreShopName = (shopName) => {
    if (!shopName) return "";

    const stopWords = new Set([
      "new", "old", "the", "shree", "sri", "shri", "m/s", "ms",
      "mobile", "mobiles", "computer", "computers", "shop", "store",
      "stores", "electronics", "communication", "communications",
      "agency", "agencies", "enterprise", "enterprises", "bazar", "mart"
    ]);

    // Clean the string and split into individual words
    const words = shopName
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove symbols
      .split(/\s+/)
      .filter(Boolean); // Remove empty spaces

    // Filter out the generic stop words
    const filteredWords = words.filter(word => !stopWords.has(word.toLowerCase()));

    let finalName = "";

    // CASE 1: If filtering left us with nothing (e.g., "The Mobile Shop")
    if (filteredWords.length === 0) {
      finalName = words[0];
    }
    // CASE 2: If the core name is just a single letter (e.g., "V Mart", "D Mart")
    else if (filteredWords[0].length === 1 && words.length > 1) {
      // Find where that single letter is in the original name, and grab it + the next word
      const singleLetterIdx = words.findIndex(w => w.toLowerCase() === filteredWords[0].toLowerCase());
      if (singleLetterIdx !== -1 && words[singleLetterIdx + 1]) {
        finalName = `${words[singleLetterIdx]} ${words[singleLetterIdx + 1]}`;
      } else {
        finalName = filteredWords[0];
      }
    }
    // CASE 3: Normal operation (e.g., "NEW ADI MOBILE" -> "Adi")
    else {
      finalName = filteredWords[0];
    }

    // Capitalize nicely (handles both single words and two-word pairs like "V Mart")
    return finalName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };


  doc.text(getCoreShopName(shopName), MARGIN_LEFT, currentY + 5);

  // Invoice status badge
  const isPaid = !(saleData.isCredit && saleData.creditAmount > 0);
  const badgeX = RIGHT - 38;
  const badgeY = currentY;

  doc.setFillColor(isPaid ? 220 : 254, isPaid ? 253 : 242, isPaid ? 244 : 242);
  doc.roundedRect(badgeX, badgeY - 1, 38, 7, 1, 1, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(isPaid ? 21 : 153, isPaid ? 128 : 27, isPaid ? 61 : 27);
  doc.text(isPaid ? "PAID IN FULL" : "PAYMENT DUE", badgeX + 19, badgeY + 3.5, { align: 'center' });

  currentY += 14;

  // Business details section
  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(MARGIN_LEFT, currentY - 2, CONTENT_WIDTH, 20, 1, 1, 'F');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);

  let detailY = currentY + 2;
  const detailLineHeight = 3.7;
  doc.text(`${shopName}`, MARGIN_LEFT + 3, detailY);
  detailY += detailLineHeight;
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
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(...COLORS.muted);

  const leftBoxX = MARGIN_LEFT + 3;
  const rightBoxX = MARGIN_LEFT + CONTENT_WIDTH / 2 + 5;

  doc.text('BILLED TO', leftBoxX, currentY + 3);
  doc.text('INVOICE DETAILS', rightBoxX, currentY + 3);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(...COLORS.primary);

  doc.text(saleData.customer?.name || 'Customer', leftBoxX, currentY + 7);
  doc.text(saleData.invoiceNumber || 'N/A', rightBoxX, currentY + 7);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
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
  doc.setFont('helvetica', 'bolditalic');
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

  doc.text('RATE / ITEM', colX + colWidths.rate / 2 + 8, currentY + 4, { align: 'right' });
  colX += colWidths.rate;

  doc.text('TAXABLE VALUE', colX + colWidths.taxable / 2 + 10, currentY + 4, { align: 'right' });
  colX += colWidths.taxable;

  doc.text('GST%', colX + colWidths.gst / 2, currentY + 4, { align: 'center' });
  colX += colWidths.gst;

  doc.text('AMOUNT', colX + colWidths.amount / 2 + 12, currentY + 4, { align: 'right' });

  currentY += 7;

  // Table items
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
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
    doc.setFont('helvetica', 'bold');
    const itemLines = doc.splitTextToSize((item.productName || 'N/A').toUpperCase(), colWidths.item - 3);
    const itemHeight = itemLines.length * 3;
    doc.text(itemLines, colX + 2, currentY + 4,);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'italic');
    colX += colWidths.item;

    // HSN Code
    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(7);
    const hsnDisplay = item.hsnCode && item.hsnCode.trim() ? item.hsnCode : ' - ';
    doc.text(hsnDisplay, colX + 2, currentY + 4);
    doc.setFontSize(8);
    colX += colWidths.hsn;

    // Quantity
    doc.setTextColor(...COLORS.primary);
    doc.text(itemQty.toString(), colX + colWidths.qty / 2 + 1, currentY + 4, { align: 'right' });
    colX += colWidths.qty;

    // Rate
    doc.text(`${itemPrice.toFixed(2)}`, colX + colWidths.rate / 2 + 7, currentY + 4, { align: 'right' });
    colX += colWidths.rate;

    // Taxable Value
    doc.text(`${taxableValue.toFixed(2)}`, colX + colWidths.taxable / 2 + 9, currentY + 4, { align: 'right' });
    colX += colWidths.taxable;

    // GST Rate
    doc.setTextColor(79, 70, 229);
    doc.setFont('helvetica', 'bolditalic');
    doc.text(`${gstRate.toFixed(0)}%`, colX + colWidths.gst / 2, currentY + 4, { align: 'center' });
    doc.setFont('helvetica', 'italic');
    colX += colWidths.gst;

    // Final Amount
    doc.setTextColor(...COLORS.primary);
    doc.text(`${itemTotal.toFixed(2)}`, colX + colWidths.amount / 2 + 11, currentY + 4, { align: 'right' });

    currentY += rowHeight;

    // Separator line
    doc.setDrawColor(...COLORS.border);
    doc.line(MARGIN_LEFT, currentY, RIGHT, currentY);
  });

  currentY += 2;

  // =================== TAX SUMMARY & AMOUNT SECTION ===================
  checkPageBreak(60);

  const { totalTaxable, totalTax, grandTotal, taxByRate } = calculateGSTBreakdown(saleData.items);

  // Left section - Tax breakdown table
  const taxSummaryLeftX = MARGIN_LEFT;
  const taxSummaryLeftWidth = CONTENT_WIDTH * 0.5 - 1;

  // Right section - Amount summary
  const taxSummaryRightX = MARGIN_LEFT + CONTENT_WIDTH * 0.5 + 1;
  const taxSummaryRightWidth = CONTENT_WIDTH * 0.5 - 2;

  // ===== LEFT: TAX BREAKDOWN TABLE =====
  const taxRatesCount = Object.keys(saleData.items).length;

  const taxBoxHeight = 12 + (taxRatesCount > 0 ? Math.max(taxRatesCount * 5, 20) : 12);

  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(taxSummaryLeftX, currentY, taxSummaryLeftWidth, taxBoxHeight, 1, 1, 'F');

  // Tax table header
  doc.setFillColor(79, 70, 229);
  doc.rect(taxSummaryLeftX + 1, currentY + 1, taxSummaryLeftWidth - 2, 5, 'F');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(255, 255, 255);
  doc.text('HSN/SAC', taxSummaryLeftX + 3, currentY + 4.5);
  doc.text('TAXABLE VAL', taxSummaryLeftX + 45, currentY + 4.5, { align: 'right' });
  doc.text('GST%', taxSummaryLeftX + 60, currentY + 4.5, { align: 'center' });
  doc.text('TAX AMT', taxSummaryLeftX + taxSummaryLeftWidth - 8, currentY + 4.5, { align: 'right' });

  let tableY = currentY + 10;
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'italic');

  // Group items by HSN
  const itemsByHsn = {};
  (saleData.items || []).forEach(item => {
    const hsn = (item.hsnCode && item.hsnCode.trim()) ? item.hsnCode : ' - ';
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
    doc.text(`${hsnTaxable.toFixed(2)}`, taxSummaryLeftX + 42, tableY, { align: 'right' });
    doc.text(rateStr, taxSummaryLeftX + 60, tableY, { align: 'center' });
    doc.text(`${hsnTax.toFixed(2)}`, taxSummaryLeftX + taxSummaryLeftWidth - 10, tableY, { align: 'right' });

    tableY += 5;
  });

  // ===== RIGHT: AMOUNT SUMMARY =====
  doc.setFillColor(...COLORS.accent);
  doc.roundedRect(taxSummaryRightX, currentY, taxSummaryRightWidth, 6, 1, 1, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(255, 255, 255);
  doc.text('SUMMARY', taxSummaryRightX + 3, currentY + 4);

  let summaryY = currentY + 10;
  const taxSumLabelX = taxSummaryRightX + 3;
  const taxSumValueX = taxSummaryRightX + taxSummaryRightWidth - 3;

  // Subtotal
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...COLORS.muted);
  doc.text('Subtotal:', taxSumLabelX, summaryY);
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'bolditalic');
  doc.text(`Rs ${totalTaxable.toFixed(2)}`, taxSumValueX, summaryY, { align: 'right' });

  summaryY += 5;

  // Total Tax
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...COLORS.muted);
  doc.text('Total Tax:', taxSumLabelX, summaryY);
  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bolditalic');
  doc.text(`Rs ${totalTax.toFixed(2)}`, taxSumValueX, summaryY, { align: 'right' });

  summaryY += 7;

  // Divider
  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(0.5);
  doc.line(taxSumLabelX, summaryY - 2, taxSumValueX, summaryY - 2);

  summaryY += 3;

  // Grand Total
  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.accent);
  doc.text('GRAND TOTAL:', taxSumLabelX, summaryY);
  doc.text(`Rs ${grandTotal.toFixed(2)}`, taxSumValueX, summaryY, { align: 'right' });

  currentY += Math.max(taxBoxHeight, 20) + 3;

  // =================== AMOUNT IN WORDS ===================
  checkPageBreak(40);

  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, 7, 1, 1, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...COLORS.muted);
  doc.text('Amount in Words:', MARGIN_LEFT + 3, currentY + 2.6);

  const amountWords = convertNumberToWords(Number(grandTotal));
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(...COLORS.primary);
  doc.text(
    `${amountWords} Only`,
    MARGIN_LEFT + 3,
    currentY + 6
  );

  currentY += 10;

  // =================== PAYMENT DETAILS SECTION ===================
  checkPageBreak(16);

  // Payment box
  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH / 2 - 2, 14, 1, 1, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(...COLORS.accent);
  doc.text('PAYMENT METHOD', MARGIN_LEFT + 3, currentY + 3);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(...COLORS.primary);
  doc.text((saleData.paymentMethod || 'CASH').toUpperCase(), MARGIN_LEFT + 3, currentY + 7);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...COLORS.muted);
  doc.text(`Amount Paid: ${formatCurrency(saleData.paidAmount || 0)}`, MARGIN_LEFT + 3, currentY + 11);

  // Summary box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(MARGIN_LEFT + CONTENT_WIDTH / 2 + 2, currentY, CONTENT_WIDTH / 2 - 2, 14, 1, 1, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(...COLORS.accent);
  doc.text('PAYMENT SUMMARY', MARGIN_LEFT + CONTENT_WIDTH / 2 + 5, currentY + 3);

  const rightPaymentX = MARGIN_LEFT + CONTENT_WIDTH / 2 + 5;
  const rightPaymentValueX = RIGHT - 3;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...COLORS.muted);
  doc.text('Grand Total:', rightPaymentX, currentY + 7);
  doc.text('Amount Paid:', rightPaymentX, currentY + 10);

  doc.setFont('helvetica', 'bolditalic');
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
    doc.setFont('helvetica', 'bolditalic');
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
    doc.setFont('helvetica', 'bolditalic');
    doc.setTextColor(...COLORS.accent);
    doc.text('NOTES:', MARGIN_LEFT, currentY);

    currentY += 2;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
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
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(...COLORS.accent);
  doc.text('BANK DETAILS', MARGIN_LEFT, footerY);

  doc.setFontSize(6);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...COLORS.primary);
  if (businessDetails.bankDetails) {
    doc.text(businessDetails.bankDetails, MARGIN_LEFT, footerY + 3);
  } else {
    doc.text('Contact for bank details', MARGIN_LEFT, footerY + 3);
  }

  // Authorized signature
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(...COLORS.accent);
  doc.text('AUTHORIZED SIGNATORY', RIGHT - 40, footerY);

  doc.setLineWidth(0.5);
  doc.setDrawColor(...COLORS.muted);
  doc.line(RIGHT - 40, footerY + 8, RIGHT, footerY + 8);

  // Footer info
  doc.setFontSize(6);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...COLORS.muted);
  const generatedDate = new Date(saleData.createdAt).toLocaleString('en-IN');
  const footerText = `Generated on ${generatedDate} | Invoice ID: ${saleData._id?.substring(0, 8) || 'N/A'}`;
  doc.text(footerText, MARGIN_LEFT, pageHeight - 3);

  // Page number
  const pageCount = doc.internal.getNumberOfPages();
  if (pageCount > 1) {
    doc.setFontSize(6);
    doc.setTextColor(...COLORS.muted);
    doc.text(`Page ${doc.internal.pages.length - 1} of ${pageCount}`, RIGHT, pageHeight - 3, { align: 'right' });
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
  const fileName = `${saleData.invoiceNumber || date}_${saleData.customer?.name}.pdf`;
  doc.save(fileName);
};

