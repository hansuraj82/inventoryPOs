import React, { useState } from 'react';
import Barcode from 'react-barcode';
import {
    Printer,
    Plus,
    Zap,
    Sliders,
    Copy,
    Trash2,
    Barcode as BarcodeIcon,
    Trash,
    Check,
    Layers,
} from 'lucide-react';
import Layout from '../components/Layout';

export default function InteractiveBarcodeStudio() {
    // --- Master Items Queue ---
    const [items, setItems] = useState([
        {
            id: 1,
            code: 'SN-2026-001',
            name: 'PREMIUM HEADPHONES',
            price: '₹1,499.00',
            quantity: 6,
            showPrice: true,
            showName: true,
            showSerial: false,
        },
        {
            id: 2,
            code: 'DUKAN-882',
            name: 'SMART WATCH V2',
            price: '₹2,299.00',
            quantity: 3,
            showPrice: true,
            showName: true,
            showSerial: false,
        },
    ]);

    // --- Layout & Styling Controls ---
    const [columns, setColumns] = useState(3);
    const [barcodeHeight, setBarcodeHeight] = useState(34);
    const [barcodeScale, setBarcodeScale] = useState(1.2);
    const [fontSize, setFontSize] = useState(10);
    const [borderStyle, setBorderStyle] = useState('dashed');

    // --- Form States (Single Custom Item) ---
    const [newCode, setNewCode] = useState('');
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newQty, setNewQty] = useState(1);
    const [showPrice, setShowPrice] = useState(true);
    const [showName, setShowName] = useState(true);

    // --- Form States (Serial Generator) ---
    const [prefix, setPrefix] = useState('SN-2026-');
    const [startNum, setStartNum] = useState(1);
    const [serialCount, setSerialCount] = useState(12);
    const [batchName, setBatchName] = useState('INVENTORY ITEM');

    // --- Tab Control ---
    const [activeTab, setActiveTab] = useState('single');

    // --- Handlers ---
    const handleAddSingle = (e) => {
        e.preventDefault();
        if (!newCode.trim()) return;

        setItems((prev) => [
            ...prev,
            {
                id: Date.now(),
                code: newCode.trim(),
                name: newName.trim(),
                price: newPrice ? `₹${newPrice}` : '',
                quantity: Math.max(1, parseInt(newQty, 10) || 1),
                showPrice: showPrice && Boolean(newPrice),
                showName: showName && Boolean(newName),
                showSerial: false,
            },
        ]);

        setNewCode('');
        setNewName('');
        setNewPrice('');
        setNewQty(1);
    };

    const handleAddSerialBatch = (e) => {
        e.preventDefault();
        const batchItems = [];
        const count = parseInt(serialCount, 10) || 1;
        const start = parseInt(startNum, 10) || 1;

        for (let i = 0; i < count; i++) {
            const currentNum = start + i;
            const paddedNum = String(currentNum).padStart(3, '0');
            const serialCode = `${prefix}${paddedNum}`;

            batchItems.push({
                id: Date.now() + i,
                code: serialCode,
                name: batchName,
                price: '',
                quantity: 1,
                showPrice: false,
                showName: Boolean(batchName),
                showSerial: false,
                serialIndex: i + 1,
            });
        }

        setItems((prev) => [...prev, ...batchItems]);
    };

    const updateItemField = (id, field, value) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    const duplicateItem = (id) => {
        const itemToCopy = items.find((item) => item.id === id);
        if (itemToCopy) {
            setItems((prev) => [...prev, { ...itemToCopy, id: Date.now() }]);
        }
    };

    const removeItem = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearAll = () => {
            setItems([]);
    };

    const printableList = items.flatMap((item) =>
        Array.from({ length: item.quantity }, (_, idx) => ({
            uniqueId: `${item.id}-${idx}`,
            code: item.code,
            name: item.name,
            price: item.price,
            showPrice: item.showPrice,
            showName: item.showName,
            showSerial: item.showSerial,
            serialIndex: item.serialIndex || idx + 1,
        }))
    );

    return (
        <Layout>
            <div className="studio-container">
                {/* --- Control Panel --- */}
                <div className="no-print controls-panel">
                    <header className="studio-header">
                        <div>
                            <h2>Barcode Studio Pro</h2>
                            <p>Customize label layouts, manage queue items, and print A4 barcode sheets.</p>
                        </div>
                        <button
                            onClick={() => window.print()}
                            className="btn-print-primary"
                            disabled={printableList.length === 0}
                        >
                            <Printer size={18} />
                            <span>Print Sheet ({printableList.length} Stickers)</span>
                        </button>
                    </header>

                    {/* --- Tabs Nav --- */}
                    <div className="tabs-nav">
                        <button
                            className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
                            onClick={() => setActiveTab('single')}
                        >
                            <Plus size={16} />
                            <span>Custom Entry</span>
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'serial' ? 'active' : ''}`}
                            onClick={() => setActiveTab('serial')}
                        >
                            <Zap size={16} />
                            <span>Serial Generator</span>
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'layout' ? 'active' : ''}`}
                            onClick={() => setActiveTab('layout')}
                        >
                            <Sliders size={16} />
                            <span>Layout & Design</span>
                        </button>
                    </div>

                    {/* --- Tab 1: Single Item Form --- */}
                    {activeTab === 'single' && (
                        <form onSubmit={handleAddSingle} className="tab-card form-grid">
                            <div className="field-group">
                                <label>Barcode Value / SKU *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. ITEM-9081"
                                    value={newCode}
                                    onChange={(e) => setNewCode(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="field-group">
                                <label>Product Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Wireless Mouse"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </div>
                            <div className="field-group">
                                <label>Price Tag</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 499"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                />
                            </div>
                            <div className="field-group">
                                <label>Copies</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={newQty}
                                    onChange={(e) => setNewQty(e.target.value)}
                                />
                            </div>
                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={showName}
                                        onChange={(e) => setShowName(e.target.checked)}
                                    /> Show Name
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={showPrice}
                                        onChange={(e) => setShowPrice(e.target.checked)}
                                    /> Show Price
                                </label>
                            </div>
                            <div className="form-action-cell">
                                <button type="submit" className="btn-action primary">
                                    <Plus size={16} /> Add to Queue
                                </button>
                            </div>
                        </form>
                    )}

                    {/* --- Tab 2: Serial Generator --- */}
                    {activeTab === 'serial' && (
                        <form onSubmit={handleAddSerialBatch} className="tab-card form-grid">
                            <div className="field-group">
                                <label>Prefix Format</label>
                                <input
                                    type="text"
                                    value={prefix}
                                    onChange={(e) => setPrefix(e.target.value)}
                                />
                            </div>
                            <div className="field-group">
                                <label>Start Number</label>
                                <input
                                    type="number"
                                    value={startNum}
                                    onChange={(e) => setStartNum(e.target.value)}
                                />
                            </div>
                            <div className="field-group">
                                <label>Total Count</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={serialCount}
                                    onChange={(e) => setSerialCount(e.target.value)}
                                />
                            </div>
                            <div className="field-group">
                                <label>Label Title</label>
                                <input
                                    type="text"
                                    value={batchName}
                                    onChange={(e) => setBatchName(e.target.value)}
                                />
                            </div>
                            <div className="form-action-cell span-full">
                                <p className="preview-note">
                                    Preview: <code>{prefix}{String(startNum).padStart(3, '0')}</code> to{' '}
                                    <code>{prefix}{String(Number(startNum) + Number(serialCount) - 1).padStart(3, '0')}</code>
                                </p>
                                <button type="submit" className="btn-action success">
                                    <Zap size={16} /> Generate Serial Batch
                                </button>
                            </div>
                        </form>
                    )}

                    {/* --- Tab 3: Layout Customizer --- */}
                    {activeTab === 'layout' && (
                        <div className="tab-card form-grid">
                            <div className="field-group">
                                <label>Columns per A4 Page ({columns} Columns)</label>
                                <select value={columns} onChange={(e) => setColumns(Number(e.target.value))}>
                                    <option value={2}>2 Columns (Large Labels)</option>
                                    <option value={3}>3 Columns (Standard 24-Up)</option>
                                    <option value={4}>4 Columns (Compact 40-Up)</option>
                                    <option value={5}>5 Columns (Mini Labels)</option>
                                </select>
                            </div>
                            <div className="field-group">
                                <label>Barcode Height ({barcodeHeight}px)</label>
                                <input
                                    type="range"
                                    min="20"
                                    max="60"
                                    value={barcodeHeight}
                                    onChange={(e) => setBarcodeHeight(Number(e.target.value))}
                                />
                            </div>
                            <div className="field-group">
                                <label>Barcode Scale ({barcodeScale})</label>
                                <input
                                    type="range"
                                    min="0.8"
                                    max="2.0"
                                    step="0.1"
                                    value={barcodeScale}
                                    onChange={(e) => setBarcodeScale(Number(e.target.value))}
                                />
                            </div>
                            <div className="field-group">
                                <label>Font Size ({fontSize}px)</label>
                                <input
                                    type="range"
                                    min="8"
                                    max="14"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                />
                            </div>
                            <div className="field-group">
                                <label>Border Guide Style</label>
                                <select value={borderStyle} onChange={(e) => setBorderStyle(e.target.value)}>
                                    <option value="dashed">Dashed Line</option>
                                    <option value="dotted">Dotted Line</option>
                                    <option value="solid">Solid Line</option>
                                    <option value="none">No Border (Blank Paper)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* --- Interactive Queue Table --- */}
                    <div className="queue-container">
                        <div className="queue-header">
                            <div className="queue-title">
                                <Layers size={18} />
                                <h3>Print Queue ({printableList.length} Total Stickers)</h3>
                            </div>
                            {items.length > 0 && (
                                <button onClick={clearAll} className="btn-danger-link">
                                    <Trash size={14} /> Clear All
                                </button>
                            )}
                        </div>

                        {items.length === 0 ? (
                            <div className="empty-box">
                                <BarcodeIcon size={32} className="empty-icon" />
                                <p>No barcodes in queue. Use the tabs above to add entries.</p>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="interactive-table">
                                    <thead>
                                        <tr>
                                            <th>Barcode Value</th>
                                            <th>Name / Title</th>
                                            <th>Price</th>
                                            <th>Qty</th>
                                            <th>Display Options</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item) => (
                                            <tr key={item.id}>
                                                <td data-label="Barcode Value">
                                                    <input
                                                        type="text"
                                                        className="table-input code-font"
                                                        value={item.code}
                                                        onChange={(e) => updateItemField(item.id, 'code', e.target.value)}
                                                    />
                                                </td>
                                                <td data-label="Name / Title">
                                                    <input
                                                        type="text"
                                                        className="table-input"
                                                        value={item.name}
                                                        placeholder="No Name"
                                                        onChange={(e) => updateItemField(item.id, 'name', e.target.value)}
                                                    />
                                                </td>
                                                <td data-label="Price">
                                                    <input
                                                        type="text"
                                                        className="table-input price-input"
                                                        value={item.price}
                                                        placeholder="No Price"
                                                        onChange={(e) => updateItemField(item.id, 'price', e.target.value)}
                                                    />
                                                </td>
                                                <td data-label="Qty">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        className="table-input qty-input"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateItemField(item.id, 'quantity', parseInt(e.target.value, 10) || 1)
                                                        }
                                                    />
                                                </td>
                                                <td data-label="Display Options">
                                                    <div className="toggle-pills">
                                                        <button
                                                            type="button"
                                                            className={`pill ${item.showName ? 'active' : ''}`}
                                                            onClick={() => updateItemField(item.id, 'showName', !item.showName)}
                                                        >
                                                            Name
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`pill ${item.showPrice ? 'active' : ''}`}
                                                            onClick={() => updateItemField(item.id, 'showPrice', !item.showPrice)}
                                                        >
                                                            Price
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`pill ${item.showSerial ? 'active-green' : ''}`}
                                                            onClick={() => updateItemField(item.id, 'showSerial', !item.showSerial)}
                                                        >
                                                            Serial #
                                                        </button>
                                                    </div>
                                                </td>
                                                <td data-label="Actions" className="text-right">
                                                    <div className="action-buttons">
                                                        <button
                                                            title="Duplicate"
                                                            onClick={() => duplicateItem(item.id)}
                                                            className="btn-icon"
                                                        >
                                                            <Copy size={15} />
                                                        </button>
                                                        <button
                                                            title="Delete"
                                                            onClick={() => removeItem(item.id)}
                                                            className="btn-icon delete"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- A4 Printable Sheet Preview --- */}
                <div className="a4-sheet-wrapper">
                    <div className={`a4-sheet grid-cols-${columns}`}>
                        {printableList.map((label) => (
                            <div key={label.uniqueId} className={`sticker-card border-${borderStyle}`}>
                                {label.showName && label.name && (
                                    <span className="sticker-name" style={{ fontSize: `${fontSize}px` }}>
                                        {label.name}
                                    </span>
                                )}
                                <Barcode
                                    value={label.code || '000000'}
                                    width={barcodeScale}
                                    height={barcodeHeight}
                                    fontSize={fontSize}
                                    margin={2}
                                />
                                {label.showPrice && label.price && (
                                    <span className="sticker-price" style={{ fontSize: `${fontSize}px` }}>
                                        {label.price}
                                    </span>
                                )}
                                {label.showSerial && (
                                    <span className="sticker-serial" style={{ fontSize: `${Math.max(8, fontSize - 1)}px` }}>
                                        S/N: {label.serialIndex}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <style>{`
          .studio-container {
            font-family: system-ui, -apple-system, sans-serif;
            background-color: #f8fafc;
            min-height: 100vh;
            padding: 16px;
            color: #0f172a;
          }

          @media (min-width: 768px) {
            .studio-container {
              padding: 24px;
            }
          }

          .controls-panel {
            max-width: 1020px;
            margin: 0 auto 32px auto;
          }

          .studio-header {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 20px;
          }

          @media (min-width: 640px) {
            .studio-header {
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            }
          }

          .studio-header h2 {
            margin: 0 0 4px 0;
            font-size: 22px;
            font-weight: 700;
          }

          .studio-header p {
            margin: 0;
            color: #64748b;
            font-size: 14px;
          }

          .btn-print-primary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: #2563eb;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(37,99,235,0.2);
            transition: background-color 0.2s;
            width: 100%;
          }

          @media (min-width: 640px) {
            .btn-print-primary {
              width: auto;
            }
          }

          .btn-print-primary:hover:not(:disabled) {
            background-color: #1d4ed8;
          }

          .btn-print-primary:disabled {
            background-color: #cbd5e1;
            cursor: not-allowed;
            box-shadow: none;
          }

          .tabs-nav {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
            overflow-x: auto;
            padding-bottom: 4px;
          }

          .tab-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            background: #e2e8f0;
            border: none;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            color: #475569;
            white-space: nowrap;
          }

          .tab-btn.active {
            background: #0f172a;
            color: white;
          }

          .tab-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            margin-bottom: 24px;
            border: 1px solid #e2e8f0;
          }

          .form-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
          }

          @media (min-width: 640px) {
            .form-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (min-width: 1024px) {
            .form-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }

          .field-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .field-group label {
            font-size: 12px;
            font-weight: 600;
            color: #475569;
          }

          .field-group input[type="text"],
          .field-group input[type="number"],
          .field-group select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 14px;
          }

          .checkbox-group {
            display: flex;
            gap: 16px;
            align-items: center;
            padding-top: 22px;
          }

          .checkbox-label {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
          }

          .form-action-cell {
            display: flex;
            align-items: flex-end;
          }

          .span-full {
            grid-column: 1 / -1;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .preview-note {
            font-size: 12px;
            color: #64748b;
            margin: 0;
          }

          .btn-action {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 10px 16px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
          }

          .btn-action.primary { background: #2563eb; color: white; }
          .btn-action.success { background: #10b981; color: white; }

          .queue-container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
          }

          .queue-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }

          .queue-title {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .queue-title h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 700;
          }

          .btn-danger-link {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: none;
            border: none;
            color: #ef4444;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
          }

          .empty-box {
            text-align: center;
            padding: 40px 20px;
            color: #94a3b8;
          }

          .empty-icon {
            margin-bottom: 8px;
          }

          .table-wrapper {
            overflow-x: auto;
          }

          .interactive-table {
            width: 100%;
            border-collapse: collapse;
          }

          .interactive-table th, .interactive-table td {
            padding: 10px;
            border-bottom: 1px solid #f1f5f9;
            text-align: left;
            font-size: 13px;
          }

          .interactive-table th {
            color: #64748b;
            background: #f8fafc;
            font-weight: 600;
          }

          .text-right { text-align: right !important; }

          .table-input {
            padding: 6px 8px;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            width: 100%;
            box-sizing: border-box;
            font-size: 13px;
          }

          .code-font { font-family: monospace; font-weight: bold; }
          .price-input { width: 90px; }
          .qty-input { width: 60px; }

          .toggle-pills { display: flex; gap: 4px; }
          .pill {
            border: 1px solid #cbd5e1;
            background: #f1f5f9;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 11px;
            cursor: pointer;
            color: #64748b;
          }

          .pill.active { background: #2563eb; color: white; border-color: #2563eb; }
          .pill.active-green { background: #10b981; color: white; border-color: #10b981; }

          .action-buttons {
            display: flex;
            gap: 6px;
            justify-content: flex-end;
          }

          .btn-icon {
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            padding: 6px;
            border-radius: 4px;
            cursor: pointer;
            color: #475569;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .btn-icon.delete {
            background: #fef2f2;
            color: #ef4444;
            border-color: #fecaca;
          }

          /* --- Responsive Card Layout for Small Displays --- */
          @media (max-width: 639px) {
            .interactive-table,
            .interactive-table thead,
            .interactive-table tbody,
            .interactive-table th,
            .interactive-table td,
            .interactive-table tr {
              display: block;
            }

            .interactive-table thead {
              display: none;
            }

            .interactive-table tr {
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 12px;
              margin-bottom: 12px;
              background: #ffffff;
            }

            .interactive-table td {
              border: none;
              padding: 6px 0;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .interactive-table td::before {
              content: attr(data-label);
              font-weight: 600;
              font-size: 12px;
              color: #64748b;
              margin-right: 12px;
            }

            .table-input {
              width: 65%;
            }

            .action-buttons {
              justify-content: flex-start;
            }
          }

          /* --- A4 Preview Container --- */
          .a4-sheet-wrapper {
            overflow-x: auto;
            display: flex;
            justify-content: center;
            padding: 10px 0;
          }

          .a4-sheet {
            width: 210mm;
            min-height: 297mm;
            padding: 8mm;
            background: white;
            box-shadow: 0 0 12px rgba(0,0,0,0.08);
            display: grid;
            gap: 2mm;
            box-sizing: border-box;
            align-content: start;
            max-width: 100%;
          }

          .grid-cols-2 { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 48mm; }
          .grid-cols-3 { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 33.9mm; }
          .grid-cols-4 { grid-template-columns: repeat(4, 1fr); grid-auto-rows: 25.4mm; }
          .grid-cols-5 { grid-template-columns: repeat(5, 1fr); grid-auto-rows: 20mm; }

          .sticker-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2px;
            box-sizing: border-box;
            page-break-inside: avoid;
            overflow: hidden;
          }

          .border-dashed { border: 1px dashed #cbd5e1; }
          .border-dotted { border: 1px dotted #94a3b8; }
          .border-solid { border: 1px solid #e2e8f0; }
          .border-none { border: none; }

          .sticker-name {
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 90%;
          }

          .sticker-price { font-weight: bold; }
          .sticker-serial { color: #64748b; }

          /* --- Print Styles --- */
          @media print {
            body { background: white; margin: 0; padding: 0; }
            header,
            nav,
            footer,
            aside,
            .navbar,
            .sidebar,
            .no-print { display: none !important; }
            .a4-sheet-wrapper { padding: 0; }
            .a4-sheet { width: 210mm; padding: 8mm; margin: 0; box-shadow: none; }
            @page { size: A4 portrait; margin: 0; }
          }
        `}</style>
            </div>
        </Layout>
    );
}