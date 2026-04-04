import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function BarcodeScanner({ onScan, onClose, onProductNotFound }) {
  const [error, setError] = useState(null);
  const [scannedCode, setScannedCode] = useState('');
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const loadBarcodeScanner = async () => {
      try {
        const { Html5QrcodeScanner } = await import('html5-qrcode');

        const scanner = new Html5QrcodeScanner(
          'barcode-scanner',
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );

        scanner.render(
          (decodedText) => {
            setScannedCode(decodedText);
            onScan(decodedText);
            scanner.clear();
          },
          (error) => {
            console.log('Scanner error:', error);
          }
        );

        return () => {
          try {
            scanner.clear();
          } catch (e) {
            console.log('Scanner cleanup error:', e);
          }
        };
      } catch (err) {
        setError('Failed to load barcode scanner. Please enter barcode manually.');
        setIsScanning(false);
      }
    };

    loadBarcodeScanner();
  }, [onScan]);

  const handleManualEntry = (e) => {
    e.preventDefault();
    if (scannedCode.trim()) {
      onScan(scannedCode);
    } else {
      toast.error('Please enter a barcode');
    }
  };

  const handleClear = () => {
    setScannedCode('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Barcode Scanner</h2>
            <p className="text-indigo-100 text-sm mt-1">Scan or manually enter barcode</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-indigo-600 rounded-full p-2 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-semibold text-amber-900 text-sm">{error}</p>
                  <p className="text-amber-800 text-xs mt-1">Use manual entry below to continue</p>
                </div>
              </div>
            </div>
          )}

          {/* Scanner Section */}
          {isScanning && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📱</span>
                <p className="text-sm font-semibold text-gray-700">Position barcode in frame</p>
              </div>
              <div 
                id="barcode-scanner" 
                className="bg-gray-900 rounded-lg overflow-hidden border-2 border-indigo-300 h-72 shadow-md"
              />
              <p className="text-xs text-gray-500 text-center">
                Scanner will automatically detect barcodes
              </p>
            </div>
          )}

          {/* Divider */}
          {isScanning && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-400 text-xs font-semibold">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
          )}

          {/* Manual Entry Section */}
          <form onSubmit={handleManualEntry} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <span className="flex items-center gap-2">
                  <span>⌨️</span>
                  Manual Barcode Entry
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  placeholder="Enter or paste barcode here..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition font-mono text-center text-lg"
                  autoFocus
                />
                {scannedCode && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                type="submit"
                disabled={!scannedCode.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                <span>✓</span>
                <span>Confirm Barcode</span>
              </button>

              {onProductNotFound && (
                <button
                  type="button"
                  onClick={() => {
                    if (scannedCode.trim()) {
                      onProductNotFound(scannedCode);
                    } else {
                      toast.error('Please enter a barcode first');
                    }
                  }}
                  disabled={!scannedCode.trim()}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                  <span>➕</span>
                  <span>Add New Product</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            💡 Tip: Make sure barcode is in good lighting and not damaged
          </p>
        </div>
      </div>
    </div>
  );
}
