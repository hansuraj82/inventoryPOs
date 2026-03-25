import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function BarcodeScanner({ onScan, onClose, onProductNotFound }) {
  const [error, setError] = useState(null);
  const [scannedCode, setScannedCode] = useState('');

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
        setError('Failed to load barcode scanner. You can enter barcode manually below.');
      }
    };

    loadBarcodeScanner();
  }, [onScan]);

  const handleManualEntry = (e) => {
    e.preventDefault();
    if (scannedCode.trim()) {
      onScan(scannedCode);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Scan or Enter Barcode</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div id="barcode-scanner" className="mb-6 bg-gray-100 rounded p-4 h-64" />

        <form onSubmit={handleManualEntry} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or Enter Barcode Manually
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              placeholder="Enter barcode..."
              className="input-field flex-1"
              autoFocus
            />
            <button
              type="submit"
              className="btn-primary"
            >
              Enter
            </button>
          </div>
        </form>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="w-full btn-secondary"
          >
            Close
          </button>
          {onProductNotFound && (
            <button
              onClick={() => {
                if (scannedCode.trim()) {
                  onProductNotFound(scannedCode);
                } else {
                  toast.error('Please enter or scan a barcode first');
                }
              }}
              className="w-full btn-primary"
            >
              Add New Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
