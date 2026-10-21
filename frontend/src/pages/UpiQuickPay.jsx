import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const UpiQuickPay = () => {
  // 1. State for UPI configuration
  const [upiId, setUpiId] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [isEditingConfig, setIsEditingConfig] = useState(false);

  // 2. State for interactive payment amount & generated QR
  const [amount, setAmount] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Load saved UPI details from localStorage on mount
  useEffect(() => {
    const savedUpiId = localStorage.getItem('dukanbill_upi_id');
    const savedMerchant = localStorage.getItem('dukanbill_merchant_name');

    if (savedUpiId) setUpiId(savedUpiId);
    if (savedMerchant) setMerchantName(savedMerchant);

    // If no UPI ID is saved yet, open settings by default
    if (!savedUpiId) setIsEditingConfig(true);
  }, []);

  // Save UPI config to localStorage
  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (!upiId.trim()) return alert('Please enter a valid UPI ID');

    localStorage.setItem('dukanbill_upi_id', upiId.trim());
    localStorage.setItem('dukanbill_merchant_name', merchantName.trim() || 'Store');
    setIsEditingConfig(false);
  };

  // Generate QR code whenever amount or UPI ID changes
  useEffect(() => {
    if (upiId && amount && Number(amount) > 0) {
      const numericAmount = Number(amount).toFixed(2);
      const upiPayload = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName || 'Store')}&am=${numericAmount}&cu=INR`;
      
      QRCode.toDataURL(upiPayload, { width: 250, margin: 2 })
        .then(setQrCodeUrl)
        .catch(err => console.error('QR Generation Error:', err));
    } else {
      setQrCodeUrl('');
    }
  }, [upiId, merchantName, amount]);

  // Handle Printing QR Code
  const handlePrintQr = () => {
    if (!qrCodeUrl || !amount) return;
    
    const printWindow = window.open('', '_blank',);
    if (!printWindow) {
      alert('Popup blocked! Please allow popups for printing.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Print UPI QR - ${merchantName || 'Store'}</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              text-align: center;
              padding: 20px;
              color: #1e293b;
              margin: 0;
            }
            .ticket {
              max-width: 300px;
              margin: 0 auto;
              border: 1px dashed #cbd5e1;
              padding: 20px;
              border-radius: 12px;
            }
            h2 { font-size: 16px; margin: 0 0 5px 0; font-weight: 800; text-transform: uppercase; }
            .store { font-size: 13px; color: #64748b; margin-bottom: 15px; }
            .amount-box {
              font-size: 22px;
              font-weight: 900;
              background: #f1f5f9;
              padding: 10px;
              border-radius: 8px;
              margin-bottom: 15px;
            }
            img { width: 200px; height: 200px; object-fit: contain; margin-bottom: 10px; }
            .upi-id { font-size: 12px; font-family: monospace; color: #475569; margin-top: 5px; }
            .footer { font-size: 10px; color: #94a3b8; margin-top: 15px; border-top: 1px solid #e2e8f0; pt-2; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <h2>Scan & Pay</h2>
            <div class="store">${merchantName || 'Dukanbill Store'}</div>
            <div class="amount-box">₹${Number(amount).toFixed(2)}</div>
            <img src="${qrCodeUrl}" alt="UPI QR" />
            <div class="upi-id">VPA: ${upiId}</div>
            <div class="footer">Powered by Dukanbill POS</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-slate-200 p-6 my-6 font-sans">
      
      {/* HEADER & SETTINGS TOGGLE */}
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-800">⚡ Quick UPI Payment</h2>
          <p className="text-xs text-slate-500">Generate instant QR codes for custom amounts</p>
        </div>
        <button
          onClick={() => setIsEditingConfig(!isEditingConfig)}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-1.5 px-3 rounded-lg transition"
        >
          {isEditingConfig ? 'Close Settings' : '⚙️ UPI Settings'}
        </button>
      </div>

      {/* --- VIEW 1: UPI SETTINGS / DATA ENTRY FORM --- */}
      {isEditingConfig ? (
        <form onSubmit={handleSaveConfig} className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-700">Merchant UPI Configuration</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">UPI ID (VPA) *</label>
            <input
              type="text"
              placeholder="e.g. merchant@paytm"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-blue-900 font-bold"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Store / Merchant Name</label>
            <input
              type="text"
              placeholder="e.g. Dukanbill Store"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-blue-900 font-bold"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg text-sm transition shadow-sm"
          >
            Save Configuration
          </button>
        </form>
      ) : null}

      {/* --- VIEW 2: INTERACTIVE AMOUNT & QR GENERATOR --- */}
      {!isEditingConfig && upiId && (
        <div className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Enter Amount (₹)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-lg font-bold text-slate-400">₹</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="w-full text-2xl font-bold pl-8 pr-4 py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-800 bg-slate-50 transition"
              />
            </div>
          </div>

          {/* Quick Preset Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[50, 100, 500, 1000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                className="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-bold py-2 rounded-lg border border-slate-200 transition"
              >
                +₹{preset}
              </button>
            ))}
          </div>

          {/* QR Code Display Card */}
          <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center mt-4">
            {qrCodeUrl ? (
              <>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 mb-3">
                  <img src={qrCodeUrl} alt="UPI Dynamic QR Code" className="w-48 h-48 object-contain" />
                </div>
                <div className="text-sm font-bold text-blue-800">Scan & Pay ₹{Number(amount).toFixed(2)}</div>
                <div className="text-xs text-slate-500 mt-1">To: <span className="font-semibold text-slate-700">{merchantName || 'Store'}</span> ({upiId})</div>
                
                {/* Print Button */}
                <button
                  type="button"
                  onClick={handlePrintQr}
                  className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm"
                >
                Print QR 
                </button>
              </>
            ) : (
              <div className="py-10 text-slate-400 text-sm">
                Enter an amount above to generate live QR code
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fallback if no UPI ID configured */}
      {!isEditingConfig && !upiId && (
        <div className="text-center py-8">
          <p className="text-sm text-slate-500 mb-3">No UPI configuration found.</p>
          <button
            onClick={() => setIsEditingConfig(true)}
            className="bg-indigo-600 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition"
          >
            Setup UPI ID Now
          </button>
        </div>
      )}

    </div>
  );
};

export default UpiQuickPay;