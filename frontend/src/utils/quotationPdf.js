import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Logo } from './Logo';

// Keep the same visual system as invoice.js. Only the labels and document
// meaning are changed for quotations: no payment status, paid amount, or sale.
const COLORS = {
    primary: [15, 23, 42],
    accent: [79, 70, 229],
    success: [34, 197, 94],
    danger: [239, 68, 68],
    muted: [100, 116, 139],
    lightBg: [248, 250, 252],
    border: [226, 232, 240],
    jk: [19, 78, 74],
};

const MARGIN_LEFT = 12;
const MARGIN_RIGHT = 12;
const FOOTER_HEIGHT = 25;

const money = (value) => `Rs ${Number(value || 0).toFixed(2)}`;

const safeDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
    const date = safeDate(value);
    return date
        ? date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'N/A';
};

const cleanFileName = (value) =>
    String(value || 'quotation')
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
        .replace(/\s+/g, '_')
        .slice(0, 90);

const getCoreShopName = (shopName) => {
    if (!shopName) return '';
    const stopWords = new Set([
        'new', 'old', 'the', 'shree', 'sri', 'shri', 'm/s', 'ms',
        'mobile', 'mobiles', 'computer', 'computers', 'shop', 'store',
        'stores', 'electronics', 'communication', 'communications',
        'agency', 'agencies', 'enterprise', 'enterprises', 'bazar', 'mart',
    ]);
    const words = String(shopName).trim().replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    const filtered = words.filter((word) => !stopWords.has(word.toLowerCase()));
    let finalName = '';
    if (!filtered.length) finalName = words[0] || String(shopName);
    else if (filtered[0].length === 1 && words.length > 1) {
        const index = words.findIndex((word) => word.toLowerCase() === filtered[0].toLowerCase());
        finalName = index !== -1 && words[index + 1] ? `${words[index]} ${words[index + 1]}` : filtered[0];
    } else finalName = filtered[0];
    return finalName.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

const numberToWords = (input) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const twoDigits = (n) => n < 10 ? ones[n] : n < 20 ? teens[n - 10] : `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : ''}`;
    const threeDigits = (n) => {
        let result = '';
        if (n >= 100) {
            result += `${ones[Math.floor(n / 100)]} Hundred`;
            n %= 100;
            if (n) result += ' ';
        }
        if (n) result += twoDigits(n);
        return result;
    };
    const integerToWords = (n) => {
        if (n === 0) return 'Zero';
        if (n > 999999999) return String(n);
        const parts = [];
        const crore = Math.floor(n / 10000000); n %= 10000000;
        const lakh = Math.floor(n / 100000); n %= 100000;
        const thousand = Math.floor(n / 1000); n %= 1000;
        if (crore) parts.push(`${threeDigits(crore)} Crore`);
        if (lakh) parts.push(`${threeDigits(lakh)} Lakh`);
        if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
        if (n) parts.push(threeDigits(n));
        return parts.join(' ');
    };

    const amount = Math.max(0, Number(input) || 0);
    const rupees = Math.floor(amount + 0.000001);
    const paise = Math.round((amount - rupees) * 100);
    let words = `${integerToWords(rupees)} Rupees`;
    if (paise) words += ` and ${integerToWords(paise)} Paise`;
    return `${words} Only`;
};

const calculateItem = (item = {}) => {
    const quantity = Math.max(0, Number(item.quantity) || 0);
    const price = Math.max(0, Number(item.price ?? item.unitPrice) || 0);
    const base = quantity * price;
    const discountValue = Math.max(0, Number(item.discount?.value) || 0);
    const discount = item.discount?.type === 'percentage'
        ? base * Math.min(discountValue, 100) / 100
        : Math.min(discountValue, base);
    const taxable = Math.max(0, base - discount);
    const gstRate = Math.max(0, Number(item.gstRate) || 0);
    const tax = taxable * gstRate / 100;
    return { quantity, price, base, discount, taxable, gstRate, tax, total: taxable + tax };
};

const calculateQuotation = (data = {}) => {
    const items = (Array.isArray(data.items) ? data.items : []).map((item) => ({
        source: item,
        ...calculateItem(item),
    }));
    const baseAmount = items.reduce((sum, item) => sum + item.base, 0);
    const itemDiscount = items.reduce((sum, item) => sum + item.discount, 0);
    const taxableSubtotal = items.reduce((sum, item) => sum + item.taxable, 0);
    const taxTotal = items.reduce((sum, item) => sum + item.tax, 0);
    const saleDiscountValue = Math.max(
        0,
        Number(data.saleDiscount?.amount) ||
        (data.saleDiscount?.type === 'percentage'
            ? taxableSubtotal * Math.max(0, Number(data.saleDiscount?.value) || 0) / 100
            : Number(data.saleDiscount?.value) || 0),
    );
    const discountTotal = Math.min(
        taxableSubtotal,
        saleDiscountValue || Math.max(0, (Number(data.totalDiscountAmount) || 0) - itemDiscount),
    );
    const calculatedTotal = Math.max(0, taxableSubtotal - discountTotal + taxTotal);
    const providedTotal = Number(data.totalAmount ?? data.grandTotal);
    const grandTotal = Number.isFinite(providedTotal) && data.totalAmount !== '' && (data.totalAmount != null || data.grandTotal != null)
        ? Math.max(0, providedTotal)
        : calculatedTotal;
    return { items, baseAmount, itemDiscount, taxableSubtotal, taxTotal, saleDiscount: discountTotal, grandTotal };
};

const safeText = (value) => String(value ?? '').trim();

export const generateQuotationPDF = async (
    quotationData = {},
    shopName = '',
    businessDetails = {},
) => {
    const data = quotationData || {};
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const RIGHT = pageWidth - MARGIN_RIGHT;
    const CONTENT_WIDTH = pageWidth - MARGIN_LEFT - MARGIN_RIGHT;
    const totals = calculateQuotation(data);
    const quoteNumber = data.quotationNumber || data.quoteNumber || `QUO-${Date.now().toString().slice(-8)}`;
    const customer = data.customer || {};
    const issueDate = formatDate(data.createdAt || data.quotationDate || data.date || new Date());
    const validUntil = data.validUntil || data.validityDate ? formatDate(data.validUntil || data.validityDate) : 'As agreed';
    let currentY = 15;

    const drawHeader = () => {
        if (Logo) {
            doc.addImage(`data:image/png;base64,${Logo}`, 'PNG', -10, -15, 260, 78);
        }
        doc.setFont('helvetica', 'bolditalic');
        doc.setFontSize(20);
        doc.setTextColor(...COLORS.jk);
        doc.text(getCoreShopName(shopName), MARGIN_LEFT, 20);

        const badgeX = RIGHT - 38;
        const badgeY = 15;
        doc.setFontSize(7);
        doc.setFillColor(255, 255, 255);
        doc.setFont('helvetica', 'bolditalic');
        doc.text('NOT A TAX INVOICE', badgeX + 32, badgeY - 11, { align: 'center' });
        doc.setFillColor(224, 231, 255);
        doc.roundedRect(badgeX, badgeY - 1, 38, 7, 1, 1, 'F');

        doc.setTextColor(...COLORS.accent);
        doc.text('QUOTATION', badgeX + 19, badgeY + 3.5, { align: 'center' });
    };

    // =================== HEADER & BUSINESS DETAILS ===================
    drawHeader();
    currentY += 14;
    const businessLines = [shopName];
    if (businessDetails.gstin) businessLines.push(`GSTIN: ${businessDetails.gstin}`);
    if (businessDetails.pan) businessLines.push(`PAN: ${businessDetails.pan}`);
    if (businessDetails.address) businessLines.push(`Address: ${businessDetails.address}`);
    if (businessDetails.phone) businessLines.push(`Phone: ${businessDetails.phone}`);
    if (businessDetails.email) businessLines.push(`Email: ${businessDetails.email}`);

    const businessText = businessLines.flatMap((line) => doc.splitTextToSize(String(line), CONTENT_WIDTH - 6));
    const businessBoxHeight = Math.max(20, 6 + businessText.length * 3.7);
    doc.setFillColor(...COLORS.lightBg);
    doc.roundedRect(MARGIN_LEFT, currentY - 2, CONTENT_WIDTH, businessBoxHeight, 1, 1, 'F');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    businessText.forEach((line, index) => doc.text(line, MARGIN_LEFT + 3, currentY + 2 + index * 3.7));
    currentY += businessBoxHeight;

    // =================== QUOTATION & CUSTOMER INFO ===================
    const halfWidth = CONTENT_WIDTH / 2 - 2;
    const leftBoxX = MARGIN_LEFT + 3;
    const rightBoxX = MARGIN_LEFT + CONTENT_WIDTH / 2 + 5;
    const customerLines = [
        safeText(customer.name || data.customerName || 'Customer'),
        customer.mobile || data.customerMobile ? `Phone: ${customer.mobile || data.customerMobile}` : '',
        customer.email || data.customerEmail ? `Email: ${customer.email || data.customerEmail}` : '',
        customer.address || data.customerAddress ? `Address: ${customer.address || data.customerAddress}` : '',
    ].filter(Boolean);
    const customerLineCount = customerLines.reduce((count, line) => count + doc.splitTextToSize(String(line), halfWidth - 6).length, 0);
    const infoHeight = Math.max(18, 13 + customerLineCount * 3.2);
    doc.setFillColor(...COLORS.lightBg);
    doc.roundedRect(MARGIN_LEFT, currentY, halfWidth, infoHeight, 1, 1, 'F');
    doc.roundedRect(MARGIN_LEFT + CONTENT_WIDTH / 2 + 2, currentY, halfWidth, infoHeight, 1, 1, 'F');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bolditalic');
    doc.setTextColor(...COLORS.muted);
    doc.text('QUOTATION FOR', leftBoxX, currentY + 3);
    doc.text('QUOTATION DETAILS', rightBoxX, currentY + 3);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bolditalic');
    doc.setTextColor(...COLORS.primary);
    let customerY = currentY + 7;
    customerLines.forEach((line) => {
        const wrapped = doc.splitTextToSize(String(line), halfWidth - 6);
        doc.text(wrapped, leftBoxX, customerY);
        customerY += wrapped.length * 3.2;
    });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bolditalic');
    doc.text(`Quotation No: ${quoteNumber}`, rightBoxX, currentY + 7);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.muted);
    doc.text(`Issue Date: ${issueDate}`, rightBoxX, currentY + 11);
    doc.text(`Valid Until: ${validUntil}`, rightBoxX, currentY + 14);
    //if (data.status) doc.text(`Status: ${String(data.status).toUpperCase()}`, rightBoxX, currentY + 17);
    currentY += infoHeight + 3;

    // =================== ITEMS TABLE (same style/columns as invoice) ===================
    const rows = totals.items.map((entry, index) => {
        const item = entry.source || {};
        const descriptionParts = [String(item.productName || item.name || item.product?.name || 'N/A').toUpperCase()];
        //if (item.product?.barcode || item.barcode) descriptionParts.push(`Barcode: ${item.product?.barcode || item.barcode}`);
        if (entry.discount > 0) {
            descriptionParts.push(item.discount?.type === 'percentage'
                ? `Discount: ${item.discount.value}% (- ${money(entry.discount)})`
                : `Discount: - ${money(entry.discount)}`);
        }
        return [
            String(index + 1).padStart(2, '0'),
            descriptionParts.join('\n'),
            item.hsnCode && String(item.hsnCode).trim() ? item.hsnCode : (item.hsn || '-'),
            String(entry.quantity),
            entry.price.toFixed(2),
            entry.taxable.toFixed(2),
            `${entry.gstRate}%`,
            entry.total.toFixed(2),
        ];
    });

    autoTable(doc, {
        startY: currentY,
        head: [['#', 'ITEM DESCRIPTION', 'HSN/SAC', 'QTY', 'RATE / ITEM', 'TAXABLE VALUE', 'GST%', 'AMOUNT']],
        body: rows.length ? rows : [['-', 'No items added', '-', '-', '-', '-', '-', '0.00']],
        theme: 'grid',
        margin: { top: 5, left: MARGIN_LEFT, right: MARGIN_RIGHT, bottom: FOOTER_HEIGHT - 10 },
        showHead: 'everyPage',
        pageBreak: 'auto',
        rowPageBreak: 'avoid',
        headStyles: {
            fillColor: COLORS.accent,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 7,
            halign: 'center',
            valign: 'middle',
        },
        bodyStyles: {
            fontSize: 8,
            textColor: COLORS.primary,
            cellPadding: 3,
            valign: 'middle',
            lineColor: COLORS.border,
            lineWidth: 0.15,
        },
        alternateRowStyles: { fillColor: [252, 252, 255] },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 59 },
            2: { cellWidth: 22, halign: 'center' },
            3: { cellWidth: 12, halign: 'center' },
            4: { cellWidth: 22, halign: 'right' },
            5: { cellWidth: 24, halign: 'right' },
            6: { cellWidth: 16, halign: 'center' },
            7: { cellWidth: 22, halign: 'right' },
        },

        didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 1) {
                const rawText = data.cell.raw ?? '';
                const originalLines = String(rawText).split('\n');

                // Determine usable description width, excluding horizontal padding.
                const cellWidth = data.cell.width || 59;
                const availableWidth = cellWidth - 4;

                // Wrap every original line to fit inside the description cell.
                const wrappedLines = [];

                originalLines.forEach((line) => {
                    const isDiscount = line.startsWith('Discount:');

                    doc.setFont(
                        'helvetica',
                        isDiscount ? 'italic' : 'bolditalic'
                    );
                    doc.setFontSize(isDiscount ? 7 : 8);

                    const parts = doc.splitTextToSize(
                        String(line),
                        availableWidth
                    );

                    wrappedLines.push(
                        ...parts.map((text) => ({
                            text,
                            isDiscount
                        }))
                    );
                });

                // Store wrapped lines for the drawing callback.
                data.cell._wrappedDescriptionLines = wrappedLines;

                // Remove AutoTable's default description rendering.
                data.cell.text = [];

                // Reserve enough vertical space for every wrapped line.
                const lineHeight = 4;
                const topPadding = 4.5;
                const bottomPadding = 2;

                data.cell.styles.minCellHeight =
                    topPadding +
                    wrappedLines.length * lineHeight +
                    bottomPadding;
            }
        },

        didDrawCell: (data) => {
            if (data.section !== 'body' || data.column.index !== 1) {
                return;
            }

            const lines = data.cell._wrappedDescriptionLines || [];
            if (!lines.length) return;

            const leftPadding = 2;
            const topPadding = 4.5;
            const lineHeight = 4;

            let textY = data.cell.y + topPadding;
            const maxY = data.cell.y + data.cell.height - 1;

            lines.forEach((line) => {
                // Avoid drawing beyond the allocated cell height.
                if (textY > maxY) return;

                if (line.isDiscount) {
                    doc.setTextColor(239, 68, 68);
                    doc.setFont('helvetica', 'italic');
                    doc.setFontSize(7);
                } else {
                    doc.setTextColor(...COLORS.primary);
                    doc.setFont('helvetica', 'bolditalic');
                    doc.setFontSize(8);
                }

                doc.text(
                    line.text,
                    data.cell.x + leftPadding,
                    textY,
                    { baseline: 'top' }
                );

                textY += lineHeight;
            });

            // Restore defaults so custom text styles don't leak into other cells.
            doc.setTextColor(...COLORS.primary);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
        },


        // didDrawPage: (hook) => {
        //     if (hook.pageNumber > 1) drawHeader(hook.pageNumber);
        // },
    });
    currentY = (doc.lastAutoTable?.finalY || currentY) + 3;
    //       if (currentY + 50 > pageHeight - FOOTER_HEIGHT - 10) {
    //     doc.addPage();
    //     currentY = 5;
    //   }

    // =================== TAX SUMMARY & QUOTATION TOTAL ===================
    const itemsByHsn = {};
    totals.items.forEach((entry) => {
        const hsn = entry.source?.hsnCode && String(entry.source.hsnCode).trim()
            ? entry.source.hsnCode
            : (entry.source?.hsn || '-');
        const key = `${hsn}|${entry.gstRate}`;
        if (!itemsByHsn[key]) itemsByHsn[key] = { hsn, rate: entry.gstRate, taxable: 0, tax: 0 };
        itemsByHsn[key].taxable += entry.taxable;
        itemsByHsn[key].tax += entry.tax;
    });
    const taxRows = Object.values(itemsByHsn);
    const leftHeight = Math.max(20, 10 + taxRows.length * 5);
    const summaryRowCount = 3 + (totals.itemDiscount > 0 ? 1 : 0) + (totals.saleDiscount > 0 ? 1 : 0);
    const rightHeight = 10 + summaryRowCount * 5 + 4;
    const boxHeight = Math.max(leftHeight, rightHeight, 22);

    if (currentY + boxHeight + 35 > pageHeight - FOOTER_HEIGHT) {
        doc.addPage();
        currentY = 5;
    }
    const leftWidth = CONTENT_WIDTH / 2 - 1;
    const rightX = MARGIN_LEFT + CONTENT_WIDTH / 2 + 1;
    const rightWidth = CONTENT_WIDTH / 2 - 2;
    doc.setFillColor(...COLORS.lightBg);
    doc.roundedRect(MARGIN_LEFT, currentY, leftWidth, boxHeight, 1, 1, 'F');
    doc.roundedRect(rightX, currentY, rightWidth, boxHeight, 1, 1, 'F');

    doc.setFillColor(...COLORS.accent);
    doc.rect(MARGIN_LEFT + 1, currentY + 1, leftWidth - 2, 5, 'F');
    doc.rect(rightX + 1, currentY + 1, rightWidth - 2, 5, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bolditalic');
    doc.setTextColor(255, 255, 255);
    doc.text('HSN/SAC', MARGIN_LEFT + 3, currentY + 4.5);
    doc.text('TAXABLE VAL', MARGIN_LEFT + 45, currentY + 4.5, { align: 'right' });
    doc.text('GST%', MARGIN_LEFT + 60, currentY + 4.5, { align: 'center' });
    doc.text('TAX AMT', MARGIN_LEFT + leftWidth - 3, currentY + 4.5, { align: 'right' });
    doc.text('QUOTATION SUMMARY', rightX + 3, currentY + 4.5);

    let taxY = currentY + 10;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.primary);
    taxRows.forEach((group) => {
        doc.text(String(group.hsn), MARGIN_LEFT + 3, taxY);
        doc.text(group.taxable.toFixed(2), MARGIN_LEFT + 45, taxY, { align: 'right' });
        doc.text(`${group.rate}%`, MARGIN_LEFT + 60, taxY, { align: 'center' });
        doc.text(group.tax.toFixed(2), MARGIN_LEFT + leftWidth - 3, taxY, { align: 'right' });
        taxY += 5;
    });
    if (!taxRows.length) doc.text('No tax details', MARGIN_LEFT + 3, taxY);

    const labelX = rightX + 3;
    const valueX = rightX + rightWidth - 3;
    let summaryY = currentY + 10;
    const summaryLine = (label, value, options = {}) => {
        doc.setFont('helvetica', options.bold ? 'bolditalic' : 'italic');
        doc.setFontSize(options.size || 7);
        doc.setTextColor(...(options.color || COLORS.primary));
        doc.text(label, labelX, summaryY);
        doc.text(money(value), valueX, summaryY, { align: 'right' });
        summaryY += options.gap || 4.5;
    };
    summaryLine('Base Amount:', totals.baseAmount);
    if (totals.itemDiscount > 0) summaryLine('Item Discounts:', -totals.itemDiscount, { color: COLORS.danger });
    summaryLine('Taxable Subtotal:', totals.taxableSubtotal);
    summaryLine('Total GST:', totals.taxTotal, { color: COLORS.accent });
    if (totals.saleDiscount > 0) summaryLine('Additional Discount:', -totals.saleDiscount, { color: COLORS.danger });
    doc.setDrawColor(...COLORS.accent);
    doc.setLineWidth(0.5);
    doc.line(labelX, summaryY - 1.5, valueX, summaryY - 1.5);
    summaryY += 2;
    summaryLine('ESTIMATED TOTAL:', totals.grandTotal, { bold: true, size: 9, color: COLORS.accent, gap: 5 });

    currentY += boxHeight + 4;

    // =================== ESTIMATED AMOUNT IN WORDS ===================
    if (currentY + 14 > pageHeight - FOOTER_HEIGHT) {
        doc.addPage();
        currentY = 5;
    }
    doc.setFillColor(...COLORS.lightBg);
    doc.roundedRect(MARGIN_LEFT, currentY, CONTENT_WIDTH, 8, 1, 1, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...COLORS.muted);
    doc.text('Estimated Amount in Words:', MARGIN_LEFT + 3, currentY + 3);
    doc.setFont('helvetica', 'bolditalic');
    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(7.5);
    const words = doc.splitTextToSize(numberToWords(totals.grandTotal), CONTENT_WIDTH - 6);
    doc.text(words.slice(0, 2), MARGIN_LEFT + 3, currentY + 6.5);
    currentY += 11;

    // =================== NOTES & TERMS ===================
    const sections = [
        { title: 'NOTES:', value: data.notes },
        { title: 'TERMS & CONDITIONS:', value: data.terms || data.termsAndConditions },
    ].filter((section) => safeText(section.value));
    for (const section of sections) {
        const wrapped = doc.splitTextToSize(String(section.value), CONTENT_WIDTH + 20);
        const height = 5 + wrapped.length * 3.2;
        if (currentY + height - 10 > pageHeight - FOOTER_HEIGHT) {
            doc.addPage();
            currentY = 5;
        }
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bolditalic');
        doc.setTextColor(...COLORS.accent);
        doc.text(section.title, MARGIN_LEFT, currentY + 3);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.primary);
        doc.text(wrapped, MARGIN_LEFT + 2, currentY + 7, { lineHeightFactor: 1.2 });
        currentY += height;
    }


    // =================== WATERMARK & FOOTER ON EVERY PAGE ===================
    const totalPages = doc.internal.getNumberOfPages();
    const watermark = getCoreShopName(shopName).toUpperCase();
    for (let page = 1; page <= totalPages; page += 1) {
        doc.setPage(page);
        try {
            doc.saveGraphicsState();
            doc.setGState(new doc.GState({ opacity: 0.08 }));
            doc.setTextColor(...COLORS.accent);
            doc.setFont('helvetica', 'bolditalic');
            doc.setFontSize(100);
            doc.text(watermark, pageWidth / 2 + 20, pageHeight / 2 + 20, { align: 'center', angle: 40 });
            doc.restoreGraphicsState();

            const footerY = pageHeight - FOOTER_HEIGHT + 5;

            if (page === totalPages) {
                doc.setDrawColor(...COLORS.accent);
                doc.setLineWidth(0.7);
                doc.line(MARGIN_LEFT, footerY - 4, RIGHT, footerY - 4);

                // =================== BANK DETAILS & SIGNATURE ===================
                const hasBankDetails = businessDetails.bankDetails || businessDetails.accountNumber || businessDetails.bankName || businessDetails.ifscCode;
                const bankLines = [];
                if (businessDetails.bankName) bankLines.push(`Bank: ${businessDetails.bankName}`);
                if (businessDetails.holderName || shopName) bankLines.push(`A/c Holder: ${businessDetails.holderName || shopName}`);
                if (businessDetails.accountNumber) bankLines.push(`A/c No: ${businessDetails.accountNumber}`);
                if (businessDetails.ifscCode) bankLines.push(`IFSC: ${businessDetails.ifscCode}`);
                if (!bankLines.length && businessDetails.bankDetails) bankLines.push(String(businessDetails.bankDetails));
                if (hasBankDetails) {
                    doc.setFontSize(7);
                    doc.setFont('helvetica', 'bolditalic');
                    doc.setTextColor(...COLORS.accent);
                    doc.text('BANK DETAILS', MARGIN_LEFT, footerY);
                    doc.setFont('helvetica', 'italic');
                    doc.setFontSize(6.5);
                    doc.setTextColor(...COLORS.primary);
                    doc.text(doc.splitTextToSize(bankLines.join(' | '), CONTENT_WIDTH * 0.58), MARGIN_LEFT, footerY + 3);
                }
                doc.setFontSize(7);
                doc.setFont('helvetica', 'bolditalic');
                doc.setTextColor(...COLORS.accent);
                doc.text(`FOR ${String(shopName || 'OWNER').toUpperCase()}`, RIGHT, footerY, { align: 'right' });
                doc.setDrawColor(...COLORS.muted);
                doc.setLineWidth(0.5);
                doc.line(RIGHT - 40, footerY + 10, RIGHT, footerY + 10);
                doc.setFontSize(6.5);
                doc.setTextColor(...COLORS.muted);
                doc.text('AUTHORIZED SIGNATORY', RIGHT, footerY + 13, { align: 'right' });
            }

        } catch (error) {
            // Watermark is decorative; skip it if unsupported by the jsPDF runtime.
        }




        doc.setFontSize(6);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(...COLORS.muted);
        doc.text(`Generated on ${formatDate(new Date())} | Quotation No: ${quoteNumber} | Not a tax invoice`, MARGIN_LEFT, pageHeight - 3);
        doc.text(`Page ${page} of ${totalPages}`, RIGHT, pageHeight - 3, { align: 'right' });
    }

    return doc;
};

export const downloadQuotation = async (quotationData, shopName, businessDetails = {}) => {
    const doc = await generateQuotationPDF(quotationData, shopName, businessDetails);
    const data = quotationData || {};
    const number = data.quotationNumber || data.quoteNumber || 'quotation';
    const customer = data.customer?.name || data.customerName || 'customer';
    doc.save(`${cleanFileName(number)}_${cleanFileName(customer)}.pdf`);
};

export const printQuotation = async (quotationData, shopName, businessDetails = {}) => {
    const doc = await generateQuotationPDF(quotationData, shopName, businessDetails);
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(pdfUrl, '_blank');

    if (!printWindow) {
        URL.revokeObjectURL(pdfUrl);
        throw new Error('The print window was blocked. Please allow pop-ups and try again.');
    }

    const number = quotationData?.quotationNumber || quotationData?.quoteNumber || 'quotation';
    printWindow.document.title = cleanFileName(number);
    printWindow.addEventListener('load', () => {
        printWindow.focus();
        printWindow.print();
    }, { once: true });
    window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 500);
};