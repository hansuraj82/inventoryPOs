// import React, { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';

// export default function BarcodeScanner({ onScan, onClose, onProductNotFound }) {
//   const [error, setError] = useState(null);
//   const [scannedCode, setScannedCode] = useState('');
//   const [isScanning, setIsScanning] = useState(true);

//   useEffect(() => {
//     const loadBarcodeScanner = async () => {
//       try {
//         const { Html5QrcodeScanner } = await import('html5-qrcode');

//         const scanner = new Html5QrcodeScanner(
//           'barcode-scanner',
//           { fps: 10, qrbox: { width: 250, height: 250 } },
//           false
//         );

//         scanner.render(
//           (decodedText) => {
//             setScannedCode(decodedText);
//             onScan(decodedText);
//             scanner.clear();
//           },
//           (error) => {
//             console.log('Scanner error:', error);
//           }
//         );

//         return () => {
//           try {
//             scanner.clear();
//           } catch (e) {
//             console.log('Scanner cleanup error:', e);
//           }
//         };
//       } catch (err) {
//         setError('Failed to load barcode scanner. Please enter barcode manually.');
//         setIsScanning(false);
//       }
//     };

//     loadBarcodeScanner();
//   }, [onScan]);

//   const handleManualEntry = (e) => {
//     e.preventDefault();
//     if (scannedCode.trim()) {
//       onScan(scannedCode);
//     } else {
//       toast.error('Please enter a barcode');
//     }
//   };

//   const handleClear = () => {
//     setScannedCode('');
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex justify-between items-center">
//           <div>
//             <h2 className="text-2xl font-bold">Barcode Scanner</h2>
//             <p className="text-indigo-100 text-sm mt-1">Scan or manually enter barcode</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-white hover:bg-indigo-600 rounded-full p-2 transition"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-6">
//           {/* Error Alert */}
//           {error && (
//             <div className="bg-amber-50 border-l-4 border-amber-400 rounded p-4">
//               <div className="flex items-start gap-3">
//                 <span className="text-xl">⚠️</span>
//                 <div>
//                   <p className="font-semibold text-amber-900 text-sm">{error}</p>
//                   <p className="text-amber-800 text-xs mt-1">Use manual entry below to continue</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Scanner Section */}
//           {isScanning && (
//             <div className="space-y-3">
//               <div className="flex items-center gap-2">
//                 <span className="text-lg">📱</span>
//                 <p className="text-sm font-semibold text-gray-700">Position barcode in frame</p>
//               </div>
//               <div 
//                 id="barcode-scanner" 
//                 className="bg-gray-900 rounded-lg overflow-hidden border-2 border-indigo-300 h-72 shadow-md"
//               />
//               <p className="text-xs text-gray-500 text-center">
//                 Scanner will automatically detect barcodes
//               </p>
//             </div>
//           )}

//           {/* Divider */}
//           {isScanning && (
//             <div className="flex items-center gap-3">
//               <div className="flex-1 h-px bg-gray-300"></div>
//               <span className="text-gray-400 text-xs font-semibold">OR</span>
//               <div className="flex-1 h-px bg-gray-300"></div>
//             </div>
//           )}

//           {/* Manual Entry Section */}
//           <form onSubmit={handleManualEntry} className="space-y-4">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-3">
//                 <span className="flex items-center gap-2">
//                   <span>⌨️</span>
//                   Manual Barcode Entry
//                 </span>
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={scannedCode}
//                   onChange={(e) => setScannedCode(e.target.value)}
//                   placeholder="Enter or paste barcode here..."
//                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition font-mono text-center text-lg"
//                   autoFocus
//                 />
//                 {scannedCode && (
//                   <button
//                     type="button"
//                     onClick={handleClear}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="space-y-3 pt-4">
//               <button
//                 type="submit"
//                 disabled={!scannedCode.trim()}
//                 className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
//               >
//                 <span>✓</span>
//                 <span>Confirm Barcode</span>
//               </button>

//               {onProductNotFound && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     if (scannedCode.trim()) {
//                       onProductNotFound(scannedCode);
//                     } else {
//                       toast.error('Please enter a barcode first');
//                     }
//                   }}
//                   disabled={!scannedCode.trim()}
//                   className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
//                 >
//                   <span>➕</span>
//                   <span>Add New Product</span>
//                 </button>
//               )}

//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Footer Info */}
//         <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
//           <p className="text-xs text-gray-600 text-center">
//             💡 Tip: Make sure barcode is in good lighting and not damaged
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect, useRef } from 'react';
// import toast from 'react-hot-toast';
// import { 
//   X, 
//   Camera, 
//   CameraOff, 
//   Keyboard, 
//   Check, 
//   Plus, 
//   AlertTriangle 
// } from 'lucide-react';

// export default function BarcodeScanner({ onScan, onClose, onProductNotFound }) {
//   const [error, setError] = useState(null);
//   const [scannedCode, setScannedCode] = useState('');
//   const [isScanning, setIsScanning] = useState(false);
//   const scannerRef = useRef(null);

//   const startScanner = async () => {
//     try {
//       setError(null);
//       setIsScanning(true);
//       const { Html5QrcodeScanner } = await import('html5-qrcode');

//       // Initialize scanner instance with localized bounds
//       scannerRef.current = new Html5QrcodeScanner(
//         'barcode-scanner',
//         { 
//           fps: 10, 
//           qrbox: { width: 250, height: 350 },
//           aspectRatio: 2.0
//         },
//         false
//       );

//       scannerRef.current.render(
//         (decodedText) => {
//           setScannedCode(decodedText);
//           onScan(decodedText);
//           stopScanner();
//         },
//         (err) => {
//           console.log('Scanner parsing handle:', err);
//         }
//       );
//     } catch (err) {
//       setError('Could not access camera stream. Please input the barcode manually.');
//       setIsScanning(false);
//     }
//   };

//   const stopScanner = () => {
//     if (scannerRef.current) {
//       try {
//         scannerRef.current.clear();
//         scannerRef.current = null;
//       } catch (e) {
//         console.log('Scanner cleanup error:', e);
//       }
//     }
//     setIsScanning(false);
//   };

//   // Auto-start camera when the component mounts
//   useEffect(() => {
//     startScanner();
//     return () => {
//       if (scannerRef.current) {
//         try {
//           scannerRef.current.clear();
//         } catch (e) {
//           console.log('Unmount clear catch:', e);
//         }
//       }
//     };
//   }, []);

//   const handleManualEntry = (e) => {
//     e.preventDefault();
//     if (scannedCode.trim()) {
//       onScan(scannedCode);
//     } else {
//       toast.error('Please enter a valid barcode value');
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
//       <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-gray-100 animate-scale-up">

//         {/* Header Section */}
//         <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">Barcode Scanner</h2>
//             <p className="text-sm text-gray-500 mt-0.5">Scan an item or enter its code details below</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Main Body */}
//         <div className="p-6 space-y-6">

//           {/* Error Notice Panel */}
//           {error && (
//             <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4 flex gap-3 items-start">
//               <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
//               <div>
//                 <p className="text-sm font-semibold text-amber-900">{error}</p>
//                 <p className="text-xs text-amber-700 mt-0.5">Type your asset tag directly into the field below.</p>
//               </div>
//             </div>
//           )}

//           {/* Camera Streaming Area */}
//           <div className="space-y-4">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//               <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                 <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
//                 Live Camera Feed
//               </span>

//               {/* Primary Camera Engine Controls */}
//               <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
//                 <button
//                   type="button"
//                   onClick={startScanner}
//                   disabled={isScanning}
//                   className={`px-4 py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition ${
//                     isScanning
//                       ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
//                       : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
//                   }`}
//                 >
//                   <Camera className="w-3.5 h-3.5" />
//                   <span>Start Scan</span>
//                 </button>
//                 <button
//                   type="button"
//                   onClick={stopScanner}
//                   disabled={!isScanning}
//                   className={`px-4 py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition ${
//                     !isScanning
//                       ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
//                       : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
//                   }`}
//                 >
//                   <CameraOff className="w-3.5 h-3.5" />
//                   <span>Stop Scan</span>
//                 </button>
//               </div>
//             </div>

//             {/* Video Viewport Wrapper */}
//             <div className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-200 shadow-inner h-164 flex items-center justify-center">
//               {isScanning ? (
//                 <div id="barcode-scanner" className="w-full h-full [&_video]:object-cover [&_video]:w-full [&_video]:h-full" />
//               ) : (
//                 <div className="text-center p-6 text-gray-400 space-y-2">
//                   <CameraOff className="w-8 h-8 mx-auto stroke-1 text-gray-500" />
//                   <p className="text-sm font-medium">Camera tracking is offline</p>
//                   <p className="text-xs text-gray-500">Click Start Scan to boot video processing threads.</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Form Separator */}
//           <div className="flex items-center gap-4 text-gray-300 text-xs font-medium">
//             <div className="flex-1 h-px bg-gray-200" />
//             <span>OR MANUAL OVERRIDE</span>
//             <div className="flex-1 h-px bg-gray-200" />
//           </div>

//           {/* Manual Keyboard Entry Form Layout */}
//           <form onSubmit={handleManualEntry} className="space-y-5">
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                 <Keyboard className="w-4 h-4 text-gray-400" />
//                 Barcode Key Entry
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={scannedCode}
//                   onChange={(e) => setScannedCode(e.target.value)}
//                   placeholder="Scan item barcode or enter values manually..."
//                   className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition font-mono text-center text-lg font-bold tracking-wider placeholder:text-gray-400 placeholder:font-sans placeholder:text-sm placeholder:tracking-normal"
//                   autoFocus
//                 />
//                 {scannedCode && (
//                   <button
//                     type="button"
//                     onClick={() => setScannedCode('')}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-bold"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Bottom Form Action Buttons Controls Wrapper */}
//             <div className="flex flex-col sm:flex-row-reverse sm:items-center gap-3 pt-2">

//               {/* Confirm / Commit Entry Button */}
//               <button
//                 type="submit"
//                 disabled={!scannedCode.trim()}
//                 className="w-full sm:flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
//               >
//                 <Check className="w-4 h-4" />
//                 <span>Confirm Barcode</span>
//               </button>

//               {/* Add New Line Product Button */}
//               {onProductNotFound && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     if (scannedCode.trim()) {
//                       onProductNotFound(scannedCode);
//                     } else {
//                       toast.error('Please scan or type a code entry first');
//                     }
//                   }}
//                   disabled={!scannedCode.trim()}
//                   className="w-full sm:flex-1 py-3 bg-white border border-emerald-200 hover:border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2"
//                 >
//                   <Plus className="w-4 h-4" />
//                   <span>Add New Product</span>
//                 </button>
//               )}

//               {/* Dismiss / Close Modal Button */}
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="w-full sm:w-auto px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition text-center"
//               >
//                 Cancel
//               </button>

//             </div>
//           </form>
//         </div>

//         {/* Footer Prompt */}
//         <div className="bg-gray-50 border-t border-gray-100 px-6 py-3.5 text-center">
//           <p className="text-xs text-gray-500">
//             Ensure barcodes are well-lit and flat for optimal optical scanning performance.
//           </p>
//         </div>

//       </div>
//     </div>
//   );
// }








// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { BrowserMultiFormatReader } from '@zxing/browser';
// import { BarcodeFormat, DecodeHintType } from '@zxing/library';
// import toast from 'react-hot-toast';
// import {
//   FaBarcode,
//   FaCamera,
//   FaCheck,
//   FaExclamationTriangle,
//   FaKeyboard,
//   FaPlus,
//   FaRedo,
//   FaTimes,
//   FaSpinner,
//   FaStop,
// } from 'react-icons/fa';

// const STABLE_READS_REQUIRED = 3;
// const DECODE_INTERVAL_MS = 180;

// const BARCODE_FORMATS = [
//   BarcodeFormat.EAN_13,
//   BarcodeFormat.EAN_8,
//   BarcodeFormat.UPC_A,
//   BarcodeFormat.UPC_E,
//   BarcodeFormat.CODE_128,
//   BarcodeFormat.CODE_39,
//   BarcodeFormat.ITF,
//   BarcodeFormat.CODABAR,
//   BarcodeFormat.QR_CODE,
//   BarcodeFormat.DATA_MATRIX,
//   BarcodeFormat.PDF_417,
// ];

// export default function BarcodeScanner({ onScan, onClose, onProductNotFound }) {
//   const videoRef = useRef(null);
//   const controlsRef = useRef(null);
//   const streamRef = useRef(null);
//   const readerRef = useRef(null);
//   const scanSessionRef = useRef(0);
//   const stableCandidateRef = useRef('');
//   const stableCountRef = useRef(0);
//   const onScanRef = useRef(onScan);
//   const onCloseRef = useRef(onClose);
//   const onProductNotFoundRef = useRef(onProductNotFound);
//   const isMountedRef = useRef(true);

//   const [error, setError] = useState('');
//   const [scannedCode, setScannedCode] = useState('');
//   const [candidateCode, setCandidateCode] = useState('');
//   const [isStarting, setIsStarting] = useState(true);
//   const [isScanning, setIsScanning] = useState(false);
//   const [isStable, setIsStable] = useState(false);
//   const [manualEntry, setManualEntry] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     onScanRef.current = onScan;
//     onCloseRef.current = onClose;
//     onProductNotFoundRef.current = onProductNotFound;
//   }, [onScan, onClose, onProductNotFound]);

//   const stopScanner = useCallback(() => {
//     // Invalidate any camera startup/decoder operation still awaiting a promise.
//     scanSessionRef.current += 1;

//     try {
//       controlsRef.current?.stop();
//     } catch (stopError) {
//       // The decoder may already have stopped; always stop the media tracks too.
//     }
//     controlsRef.current = null;

//     // Stop the exact stream we acquired, even if ZXing has not returned controls yet.
//     const stream = streamRef.current;
//     streamRef.current = null;
//     if (stream) {
//       stream.getTracks().forEach((track) => {
//         try {
//           track.stop();
//         } catch (trackError) {
//           // Ignore an already-ended track.
//         }
//       });
//     }

//     const video = videoRef.current;
//     if (video) {
//       const attachedStream = video.srcObject;
//       if (attachedStream instanceof MediaStream) {
//         attachedStream.getTracks().forEach((track) => {
//           try {
//             track.stop();
//           } catch (trackError) {
//             // Ignore an already-ended track.
//           }
//         });
//       }
//       video.pause?.();
//       video.srcObject = null;
//     }

//     readerRef.current = null;
//     setIsScanning(false);
//   }, []);

//   const startScanner = useCallback(async () => {
//     stopScanner();
//     const sessionId = scanSessionRef.current;
//     setError('');
//     setIsStarting(true);
//     setIsStable(false);
//     setScannedCode('');
//     setCandidateCode('');
//     stableCandidateRef.current = '';
//     stableCountRef.current = 0;

//     try {
//       if (!navigator.mediaDevices?.getUserMedia) {
//         throw new Error('Camera access is not supported in this browser.');
//       }

//       const hints = new Map();
//       hints.set(DecodeHintType.TRY_HARDER, true);
//       hints.set(DecodeHintType.POSSIBLE_FORMATS, BARCODE_FORMATS);

//       const reader = new BrowserMultiFormatReader(hints, DECODE_INTERVAL_MS);
//       readerRef.current = reader;

//       // Acquire and retain the stream ourselves so Close can stop it immediately,
//       // even while ZXing is still initializing its decoder controls.
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: false,
//         video: {
//           facingMode: { ideal: 'environment' },
//           width: { ideal: 1920 },
//           height: { ideal: 1080 },
//         },
//       });

//       if (!isMountedRef.current || sessionId !== scanSessionRef.current) {
//         stream.getTracks().forEach((track) => track.stop());
//         return;
//       }

//       streamRef.current = stream;
//       const video = videoRef.current;
//       if (!video) {
//         stream.getTracks().forEach((track) => track.stop());
//         streamRef.current = null;
//         return;
//       }
//       video.srcObject = stream;
//       await video.play();

//       if (!isMountedRef.current || sessionId !== scanSessionRef.current) {
//         stream.getTracks().forEach((track) => track.stop());
//         if (video.srcObject === stream) video.srcObject = null;
//         if (streamRef.current === stream) streamRef.current = null;
//         return;
//       }

//       const controls = await reader.decodeFromStream(stream, video, (result) => {
//         if (!isMountedRef.current || sessionId !== scanSessionRef.current || !result) return;

//         const text = String(result.getText() || '').trim();
//         if (!text) return;

//         // Require the exact same value in several consecutive frames.
//         if (text === stableCandidateRef.current) {
//           stableCountRef.current += 1;
//         } else {
//           stableCandidateRef.current = text;
//           stableCountRef.current = 1;
//           setCandidateCode(text);
//           setIsStable(false);
//           setScannedCode('');
//         }

//         if (stableCountRef.current >= STABLE_READS_REQUIRED) {
//           setScannedCode(text);
//           setCandidateCode(text);
//           setIsStable(true);
//         }
//       });

//       // Close/unmount may have happened while decodeFromStream was awaiting.
//       if (!isMountedRef.current || sessionId !== scanSessionRef.current) {
//         controls.stop();
//         stream.getTracks().forEach((track) => track.stop());
//         if (video.srcObject === stream) video.srcObject = null;
//         if (streamRef.current === stream) streamRef.current = null;
//         return;
//       }

//       controlsRef.current = controls;
//       setIsScanning(true);
//     } catch (scanError) {
//       if (!isMountedRef.current || sessionId !== scanSessionRef.current) return;
//       console.error('Unable to start barcode scanner:', scanError);
//       const message = scanError?.name === 'NotAllowedError'
//         ? 'Camera permission was denied. Allow camera access in your browser settings or enter the barcode manually.'
//         : scanError?.name === 'NotFoundError'
//           ? 'No camera was found on this device. You can enter the barcode manually.'
//           : scanError?.name === 'NotReadableError'
//             ? 'The camera is being used by another app. Close that app and try again.'
//             : scanError?.message || 'Could not start the camera. Please enter the barcode manually.';
//       setError(message);
//       setManualEntry(true);

//       // A failed decoder startup must not leave an acquired camera stream running.
//       const stream = streamRef.current;
//       streamRef.current = null;
//       stream?.getTracks().forEach((track) => track.stop());
//       const video = videoRef.current;
//       if (video) {
//         video.pause?.();
//         video.srcObject = null;
//       }
//     } finally {
//       if (isMountedRef.current && sessionId === scanSessionRef.current) {
//         setIsStarting(false);
//       }
//     }
//   }, [stopScanner]);

//   useEffect(() => {
//     isMountedRef.current = true;
//     startScanner();

//     return () => {
//       isMountedRef.current = false;
//       scanSessionRef.current += 1;
//       try {
//         controlsRef.current?.stop();
//       } catch (e) {
//         // Ignore decoder cleanup errors; media tracks are stopped below.
//       }
//       controlsRef.current = null;
//       const streams = [streamRef.current, videoRef.current?.srcObject]
//         .filter((stream) => stream instanceof MediaStream);
//       streamRef.current = null;
//       streams.forEach((stream) => {
//         stream.getTracks().forEach((track) => {
//           try { track.stop(); } catch (e) { /* Already stopped. */ }
//         });
//       });
//       if (videoRef.current) {
//         videoRef.current.pause?.();
//         videoRef.current.srcObject = null;
//       }
//       readerRef.current = null;
//     };
//   }, [startScanner]);

//   const handleClose = () => {
//     stopScanner();
//     onCloseRef.current?.();
//   };

//   const handleManualEntry = (event) => {
//     event.preventDefault();
//     console.log('hh')
//     stopScanner();
//     const value = scannedCode.trim();
//     if (!value) {
//       toast.error('Enter a barcode first.');
//       return;
//     }
    
//     setIsStable(true);
//     setCandidateCode(value);
//   };

//   const handleConfirm = async () => {
//     const value = scannedCode.trim();
//     if (!value) {
//       toast.error('Scan a barcode or enter it manually first.');
//       return;
//     }
//     if (!manualEntry && !isStable) {
//       toast.error('Hold the barcode steady until the same code is detected consistently.');
//       return;
//     }

//     setIsSubmitting(true);
//     stopScanner();
//     try {
//       await onScanRef.current?.(value);
//     } catch (submitError) {
//       console.error('Barcode handling failed:', submitError);
//       toast.error('Could not process this barcode. Please try again.');
//       setIsSubmitting(false);
//       return;
//     }
//     setIsSubmitting(false);
//   };

//   const handleAddProduct = async () => {
//     const value = scannedCode.trim();
//     if (!value) {
//       toast.error('Scan or enter a barcode first.');
//       return;
//     }
//     if (!onProductNotFoundRef.current) return;

//     setIsSubmitting(true);
//     stopScanner();
//     try {
//       await onProductNotFoundRef.current(value);
//     } catch (submitError) {
//       console.error('Add product action failed:', submitError);
//       toast.error('Could not open the add-product flow. Please try again.');
//       setIsSubmitting(false);
//       return;
//     }
//     setIsSubmitting(false);
//   };

//   const handleReset = () => {
//     setScannedCode('');
//     setCandidateCode('');
//     setIsStable(false);
//     stableCandidateRef.current = '';
//     stableCountRef.current = 0;
//     setError('');
//     setManualEntry(false);
//     startScanner();
//   };

//   return (
//     <div
//       className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="barcode-scanner-title"
//       onMouseDown={(event) => {
//         if (event.target === event.currentTarget && !isSubmitting) handleClose();
//       }}
//     >
//       <div className="flex max-h-[96dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[92vh] sm:rounded-2xl">
//         <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
//           <div className="flex min-w-0 items-center gap-3">
//             <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
//               <FaBarcode size={22} />
//             </div>
//             <div className="min-w-0">
//               <h2 id="barcode-scanner-title" className="text-lg font-bold text-gray-900 sm:text-xl">Scan barcode</h2>
//               <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">Keep the barcode inside the frame</p>
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={handleClose}
//             disabled={isSubmitting}
//             aria-label="Close barcode scanner"
//             className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
//           >
//             <FaTimes size={18} />
//           </button>
//         </div>

//         <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:space-y-5 sm:p-6">
//           {error && (
//             <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900" role="alert">
//               <FaExclamationTriangle className="mt-0.5 shrink-0 text-amber-600" />
//               <div className="min-w-0 flex-1">
//                 <p className="text-sm font-semibold">Camera unavailable</p>
//                 <p className="mt-1 break-words text-xs leading-5 text-amber-800">{error}</p>
//               </div>
//             </div>
//           )}

//           {!manualEntry && (
//             <section className="space-y-3">
//               <div className="flex items-center justify-between gap-3">
//                 <p className="flex items-center gap-2 text-sm font-semibold text-gray-700">
//                   <FaCamera className="text-indigo-500" /> Camera scanner
//                 </p>
//                 <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${isStable ? 'bg-emerald-50 text-emerald-700' : isScanning ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
//                   <span className={`h-1.5 w-1.5 rounded-full ${isStable ? 'bg-emerald-500' : isScanning ? 'animate-pulse bg-indigo-500' : 'bg-gray-400'}`} />
//                   {isStable ? 'Code detected' : isStarting ? 'Starting camera…' : isScanning ? 'Looking for barcode' : 'Camera stopped'}
//                 </span>
//               </div>

//               <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-950">
//                 <video ref={videoRef} className="block aspect-[4/3] max-h-[42vh] w-full object-cover" muted playsInline autoPlay />
//                 {!isScanning && !isStarting && (
//                   <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-950/90 px-6 text-center text-white">
//                     <FaCamera size={30} className="text-gray-300" />
//                     <p className="text-sm">Camera is not running</p>
//                     <button type="button" onClick={startScanner} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
//                       <FaRedo size={12} /> Start camera
//                     </button>
//                   </div>
//                 )}
//                 {isStarting && (
//                   <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-950/90 text-white">
//                     <FaSpinner className="animate-spin text-2xl" />
//                     <p className="text-sm">Starting camera…</p>
//                   </div>
//                 )}
//                 <div className="pointer-events-none absolute inset-x-5 top-1/2 -translate-y-1/2">
//                   <div className={`relative h-24 rounded-xl border-2 ${isStable ? 'border-emerald-400' : 'border-indigo-300/90'}`}>
//                     <span className="absolute -left-0.5 -top-0.5 h-5 w-5 rounded-tl-lg border-l-4 border-t-4 border-white" />
//                     <span className="absolute -right-0.5 -top-0.5 h-5 w-5 rounded-tr-lg border-r-4 border-t-4 border-white" />
//                     <span className="absolute -bottom-0.5 -left-0.5 h-5 w-5 rounded-bl-lg border-b-4 border-l-4 border-white" />
//                     <span className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-br-lg border-b-4 border-r-4 border-white" />
//                   </div>
//                 </div>
//               </div>
//               <p className="text-center text-xs leading-5 text-gray-500">
//                 Hold the barcode steady, avoid glare, and move the camera slightly closer if the lines look blurry.
//               </p>

//               {candidateCode && !isStable && (
//                 <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
//                   <p className="text-xs font-semibold text-amber-800">Checking barcode… keep it steady</p>
//                   <p className="mt-1 break-all font-mono text-sm text-amber-950">{candidateCode}</p>
//                   <p className="mt-1 text-[11px] text-amber-700">The same value must be read consistently before it can be confirmed.</p>
//                 </div>
//               )}
//             </section>
//           )}

//           <div className="flex items-center gap-3">
//             <div className="h-px flex-1 bg-gray-200" />
//             <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">or enter manually</span>
//             <div className="h-px flex-1 bg-gray-200" />
//           </div>

//           <form onSubmit={handleManualEntry} className="space-y-2.5">
//             <label htmlFor="manual-barcode" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
//               <FaKeyboard className="text-gray-400" /> Barcode number
//             </label>
//             <input
//               id="manual-barcode"
//               type="text"
//               inputMode="numeric"
//               autoComplete="off"
//               value={scannedCode}
//               onChange={(event) => {
//                 setScannedCode(event.target.value);
//                 setIsStable(true);
//                 setManualEntry(true);
//               }}
//               onFocus={() => {setManualEntry(true); stopScanner()}}
//               placeholder="Scan or type barcode…"
//               className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-mono text-base tracking-wide text-gray-900 outline-none transition placeholder:font-sans placeholder:tracking-normal placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
//             />
//             <p className="text-xs leading-5 text-gray-500">Review the number before confirming, especially if the barcode is damaged or blurry.</p>
//           </form>

//           {scannedCode.trim() && (
//             <div className={`rounded-xl border p-3 ${isStable ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-gray-50'}`}>
//               <p className={`text-xs font-semibold ${isStable ? 'text-emerald-800' : 'text-gray-600'}`}>Barcode to submit</p>
//               <p className="mt-1 break-all font-mono text-lg font-bold tracking-wide text-gray-900">{scannedCode.trim()}</p>
//             </div>
//           )}
//         </div>

//         <div className="space-y-2 border-t border-gray-100 bg-gray-50 p-4 sm:p-5">
//           <button
//             type="button"
//             onClick={handleConfirm}
//             disabled={!scannedCode.trim() || isSubmitting || (!manualEntry && !isStable)}
//             className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
//           >
//             {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaCheck />}
//             {isSubmitting ? 'Processing…' : 'Confirm barcode'}
//           </button>



//           {onProductNotFound && (
//             <button
//               type="button"
//               onClick={() => {
//                 if (scannedCode.trim()) {
//                   onProductNotFound(scannedCode);
//                 } else {
//                   toast.error('Please enter a barcode first');
//                 }
//               }}
//               disabled={!scannedCode.trim()}
//               className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
//             >
//               <FaPlus /> Add new product with this barcode
//             </button>
//           )}

//           <div className="flex gap-2">
//             <button
//               type="button"
//               onClick={handleReset}
//               disabled={isStarting || isSubmitting}
//               className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
//             >
//               <FaRedo size={12} /> Scan again
//             </button>
//             <button
//               type="button"
//               onClick={handleClose}
//               disabled={isSubmitting}
//               className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
//             >
//               <FaStop size={12} /> Close scanner
//             </button>
//           </div>
//           <p className="text-center text-[11px] leading-4 text-gray-400">Camera access requires HTTPS or localhost. Closing this window stops the camera.</p>
//         </div>
//       </div>
//     </div>
//   );
// }
















// import { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   BrowserMultiFormatReader,
//   BarcodeFormat,
//   DecodeHintType,
// } from '@zxing/library';
// import { toast } from 'react-hot-toast';
// import {
//   Camera,
//   CameraOff,
//   CheckCircle2,
//   Loader2,
//   RefreshCw,
//   X,
//   Keyboard,
//   ScanBarcode,
//   AlertCircle,
//   PackageSearch,
// } from 'lucide-react';

// const STABLE_READS_REQUIRED = 3;
// const DECODE_INTERVAL_MS = 180;

// const BARCODE_FORMATS = [
//   BarcodeFormat.EAN_13,
//   BarcodeFormat.EAN_8,
//   BarcodeFormat.UPC_A,
//   BarcodeFormat.UPC_E,
//   BarcodeFormat.CODE_128,
//   BarcodeFormat.CODE_39,
//   BarcodeFormat.ITF,
//   BarcodeFormat.CODABAR,
//   BarcodeFormat.QR_CODE,
// ];

// const BarcodeScanner = ({
//   onScan,
//   onClose,
// }) => {
//   const videoRef = useRef(null);
//   const controlsRef = useRef(null);
//   const streamRef = useRef(null);
//   const readerRef = useRef(null);

//   const scanSessionRef = useRef(0);
//   const stableCandidateRef = useRef('');
//   const stableCountRef = useRef(0);
//   const hasSubmittedRef = useRef(false);
//   const manualEntryRef = useRef(false);
//   const isMountedRef = useRef(false);

//   const onScanRef = useRef(onScan);
//   const onCloseRef = useRef(onClose);

//   const [error, setError] = useState('');
//   const [scannedCode, setScannedCode] = useState('');
//   const [candidateCode, setCandidateCode] = useState('');
//   const [isStarting, setIsStarting] = useState(true);
//   const [isScanning, setIsScanning] = useState(false);
//   const [isStable, setIsStable] = useState(false);
//   const [manualEntry, setManualEntry] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     onScanRef.current = onScan;
//     onCloseRef.current = onClose;
//   }, [onScan, onClose]);

//   const stopScanner = useCallback(() => {
//     // Invalidate any callbacks from an older scan session.
//     scanSessionRef.current += 1;

//     try {
//       controlsRef.current?.stop();
//     } catch (err) {
//       console.warn('Could not stop scanner controls:', err);
//     }

//     controlsRef.current = null;

//     try {
//       readerRef.current?.reset();
//     } catch (err) {
//       console.warn('Could not reset barcode reader:', err);
//     }

//     readerRef.current = null;

//     const stream = streamRef.current;
//     if (stream) {
//       stream.getTracks().forEach((track) => {
//         try {
//           track.stop();
//         } catch (err) {
//           console.warn('Could not stop media track:', err);
//         }
//       });
//     }

//     streamRef.current = null;

//     const video = videoRef.current;
//     if (video) {
//       try {
//         video.pause();
//         video.srcObject = null;
//       } catch (err) {
//         console.warn('Could not clear video element:', err);
//       }
//     }

//     if (isMountedRef.current) {
//       setIsScanning(false);
//       setIsStarting(false);
//     }
//   }, []);

//   const submitBarcode = useCallback(
//     async (barcode) => {
//       const value = String(barcode || '').trim();

//       if (!value || hasSubmittedRef.current) {
//         return;
//       }

//       hasSubmittedRef.current = true;
//       setScannedCode(value);
//       setCandidateCode(value);
//       setIsStable(true);
//       setIsSubmitting(true);

//       // Release the camera before processing the barcode.
//       stopScanner();

//       try {
//         await onScanRef.current?.(value);
//       } catch (err) {
//         console.error('Barcode submission failed:', err);
//         toast.error('Could not process this barcode. Please try again.');

//         hasSubmittedRef.current = false;

//         if (isMountedRef.current) {
//           setIsSubmitting(false);
//         }
//       }
//     },
//     [stopScanner]
//   );

//   const startScanner = useCallback(async () => {
//     stopScanner();

//     // stopScanner invalidates the previous session.
//     const sessionId = scanSessionRef.current;

//     stableCandidateRef.current = '';
//     stableCountRef.current = 0;
//     hasSubmittedRef.current = false;

//     setError('');
//     setScannedCode('');
//     setCandidateCode('');
//     setIsStable(false);
//     setIsStarting(true);
//     setIsSubmitting(false);

//     try {
//       if (!navigator.mediaDevices?.getUserMedia) {
//         throw new Error(
//           'Camera access is not supported by this browser. Use HTTPS or enter the barcode manually.'
//         );
//       }

//       const hints = new Map();
//       hints.set(DecodeHintType.POSSIBLE_FORMATS, BARCODE_FORMATS);
//       hints.set(DecodeHintType.TRY_HARDER, true);

//       const reader = new BrowserMultiFormatReader(
//         hints,
//         DECODE_INTERVAL_MS
//       );

//       readerRef.current = reader;

//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: false,
//         video: {
//           facingMode: { ideal: 'environment' },
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//         },
//       });

//       // The user may have closed or restarted the scanner while
//       // the browser was requesting camera permission.
//       if (
//         !isMountedRef.current ||
//         sessionId !== scanSessionRef.current
//       ) {
//         stream.getTracks().forEach((track) => track.stop());
//         return;
//       }

//       streamRef.current = stream;

//       const video = videoRef.current;

//       if (!video) {
//         stream.getTracks().forEach((track) => track.stop());
//         streamRef.current = null;
//         throw new Error('Camera preview is unavailable.');
//       }

//       video.srcObject = stream;
//       video.setAttribute('playsinline', 'true');
//       video.muted = true;

//       await video.play();

//       if (
//         !isMountedRef.current ||
//         sessionId !== scanSessionRef.current
//       ) {
//         stream.getTracks().forEach((track) => track.stop());
//         return;
//       }

//       const controls = await reader.decodeFromStream(
//         stream,
//         video,
//         (result, decodeError) => {
//           if (
//             !isMountedRef.current ||
//             sessionId !== scanSessionRef.current ||
//             hasSubmittedRef.current
//           ) {
//             return;
//           }

//           if (!result) {
//             // No barcode in this frame is normal while scanning.
//             return;
//           }

//           const text = result.getText()?.trim();

//           if (!text) {
//             return;
//           }

//           if (stableCandidateRef.current === text) {
//             stableCountRef.current += 1;
//           } else {
//             stableCandidateRef.current = text;
//             stableCountRef.current = 1;
//           }

//           setCandidateCode(text);

//           if (stableCountRef.current >= STABLE_READS_REQUIRED) {
//             setScannedCode(text);
//             setIsStable(true);

//             // Camera scans submit automatically. Manual entry
//             // uses the explicit confirmation button instead.
//             if (!manualEntryRef.current) {
//               void submitBarcode(text);
//             }
//           } else {
//             setIsStable(false);
//           }
//         }
//       );

//       // If the scan was stopped while decodeFromStream was
//       // starting, immediately stop the returned controls.
//       if (
//         !isMountedRef.current ||
//         sessionId !== scanSessionRef.current
//       ) {
//         controls?.stop();
//         stream.getTracks().forEach((track) => track.stop());
//         return;
//       }

//       controlsRef.current = controls;

//       setIsScanning(true);
//       setIsStarting(false);
//     } catch (err) {
//       if (
//         !isMountedRef.current ||
//         sessionId !== scanSessionRef.current
//       ) {
//         return;
//       }

//       console.error('Barcode scanner error:', err);

//       const message =
//         err?.name === 'NotAllowedError' ||
//         err?.name === 'PermissionDeniedError'
//           ? 'Camera permission was denied. Allow camera access in your browser settings or enter the barcode manually.'
//           : err?.name === 'NotFoundError'
//             ? 'No camera was found on this device. Enter the barcode manually.'
//             : err?.name === 'NotReadableError'
//               ? 'The camera is being used by another application. Close it and try again.'
//               : err?.message ||
//                 'Unable to start the barcode scanner.';

//       setError(message);
//       setIsStarting(false);
//       setIsScanning(false);

//       // Clean up a stream if startup failed partway through.
//       streamRef.current?.getTracks().forEach((track) => {
//         track.stop();
//       });

//       streamRef.current = null;

//       if (videoRef.current) {
//         videoRef.current.srcObject = null;
//       }

//       try {
//         readerRef.current?.reset();
//       } catch {
//         // Nothing else to do if reset fails.
//       }

//       readerRef.current = null;
//       controlsRef.current = null;
//     }
//   }, [stopScanner, submitBarcode]);

//   useEffect(() => {
//     isMountedRef.current = true;
//     void startScanner();

//     return () => {
//       isMountedRef.current = false;

//       // Invalidate callbacks and release all camera resources.
//       scanSessionRef.current += 1;

//       try {
//         controlsRef.current?.stop();
//       } catch {
//         // Ignore cleanup errors.
//       }

//       controlsRef.current = null;

//       try {
//         readerRef.current?.reset();
//       } catch {
//         // Ignore cleanup errors.
//       }

//       readerRef.current = null;

//       streamRef.current?.getTracks().forEach((track) => {
//         track.stop();
//       });

//       streamRef.current = null;

//       if (videoRef.current) {
//         try {
//           videoRef.current.pause();
//           videoRef.current.srcObject = null;
//         } catch {
//           // Ignore cleanup errors.
//         }
//       }
//     };
//   }, [startScanner]);

//   const handleClose = useCallback(() => {
//     stopScanner();
//     onCloseRef.current?.();
//   }, [stopScanner]);

//   const handleManualEntryToggle = () => {
//     const nextValue = !manualEntry;

//     manualEntryRef.current = nextValue;
//     setManualEntry(nextValue);

//     stableCandidateRef.current = '';
//     stableCountRef.current = 0;
//     setIsStable(false);
//     setCandidateCode('');

//     if (nextValue) {
//       setScannedCode('');
//     }
//   };

//   const handleManualInputChange = (event) => {
//     const value = event.target.value;

//     setScannedCode(value);
//     setCandidateCode(value);
//     setIsStable(false);

//     stableCandidateRef.current = '';
//     stableCountRef.current = 0;
//   };

//   const handleConfirm = async (event) => {
//     event.preventDefault();

//     const value = scannedCode.trim();

//     if (!value) {
//       toast.error('Please enter a barcode first.');
//       return;
//     }

//     if (hasSubmittedRef.current) {
//       return;
//     }

//     // Manual entry does not require repeated camera reads.
//     await submitBarcode(value);
//   };

//   const handleReset = () => {
//     stableCandidateRef.current = '';
//     stableCountRef.current = 0;
//     hasSubmittedRef.current = false;

//     manualEntryRef.current = false;
//     setManualEntry(false);

//     setScannedCode('');
//     setCandidateCode('');
//     setIsStable(false);
//     setIsSubmitting(false);
//     setError('');

//     void startScanner();
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-5">
//       <div className="flex max-h-[95vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
//               <ScanBarcode size={23} />
//             </div>

//             <div>
//               <h2 className="text-lg font-bold text-gray-900">
//                 Barcode Scanner
//               </h2>
//               <p className="text-sm text-gray-500">
//                 Scan a product to add it to your billing
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={handleClose}
//             disabled={isSubmitting}
//             aria-label="Close scanner"
//             className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <X size={22} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="space-y-4 overflow-y-auto p-5">
//           {/* Camera preview */}
//           <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-950">
//             <video
//               ref={videoRef}
//               autoPlay
//               muted
//               playsInline
//               className="h-full w-full object-cover"
//             />

//             {isStarting && (
//               <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-950 text-white">
//                 <Loader2 size={32} className="animate-spin" />
//                 <p className="text-sm">Starting camera…</p>
//               </div>
//             )}

//             {!isStarting && !isScanning && !error && (
//               <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-950 text-white">
//                 <CameraOff size={32} />
//                 <p className="text-sm">Camera is stopped</p>
//               </div>
//             )}

//             {isScanning && !manualEntry && !isStable && (
//               <>
//                 {/* Scanner frame */}
//                 <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
//                   <div className="relative h-28 w-[78%] max-w-sm rounded-xl border-2 border-blue-400">
//                     <span className="absolute -left-0.5 -top-0.5 h-5 w-5 border-l-4 border-t-4 border-blue-300" />
//                     <span className="absolute -right-0.5 -top-0.5 h-5 w-5 border-r-4 border-t-4 border-blue-300" />
//                     <span className="absolute -bottom-0.5 -left-0.5 h-5 w-5 border-b-4 border-l-4 border-blue-300" />
//                     <span className="absolute -bottom-0.5 -right-0.5 h-5 w-5 border-b-4 border-r-4 border-blue-300" />

//                     <div className="absolute left-1 right-1 top-1/2 h-0.5 animate-pulse bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.9)]" />
//                   </div>
//                 </div>

//                 <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-black/60 px-3 py-2 text-center text-sm text-white">
//                   Point the camera at a barcode
//                 </div>
//               </>
//             )}

//             {isStable && !isSubmitting && (
//               <div className="absolute inset-0 flex items-center justify-center bg-green-950/70">
//                 <div className="flex flex-col items-center gap-2 text-white">
//                   <CheckCircle2 size={44} />
//                   <p className="font-semibold">Barcode detected</p>
//                 </div>
//               </div>
//             )}

//             {isSubmitting && (
//               <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 text-white">
//                 <Loader2 size={36} className="animate-spin" />
//                 <p className="font-medium">Processing barcode…</p>
//               </div>
//             )}
//           </div>

//           {/* Scan status */}
//           <div
//             className={`flex items-start gap-3 rounded-xl p-3 ${
//               error
//                 ? 'bg-red-50 text-red-800'
//                 : isStable
//                   ? 'bg-green-50 text-green-800'
//                   : 'bg-blue-50 text-blue-800'
//             }`}
//           >
//             {error ? (
//               <AlertCircle size={20} className="mt-0.5 shrink-0" />
//             ) : isStable ? (
//               <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
//             ) : (
//               <Camera size={20} className="mt-0.5 shrink-0" />
//             )}

//             <div className="min-w-0">
//               <p className="text-sm font-semibold">
//                 {error
//                   ? 'Camera unavailable'
//                   : isSubmitting
//                     ? 'Processing barcode'
//                     : isStable
//                       ? 'Barcode confirmed'
//                       : isStarting
//                         ? 'Connecting to camera'
//                         : manualEntry
//                           ? 'Manual entry enabled'
//                           : isScanning
//                             ? 'Ready to scan'
//                             : 'Scanner stopped'}
//               </p>

//               <p className="mt-1 break-words text-sm opacity-90">
//                 {error ||
//                   (isSubmitting
//                     ? 'Looking up the product…'
//                     : isStable
//                       ? 'Submitting the barcode for product lookup.'
//                       : manualEntry
//                         ? 'Type the barcode below and press Confirm barcode.'
//                         : 'Hold the barcode steady inside the scanning frame.')}
//               </p>
//             </div>
//           </div>

//           {/* Manual entry */}
//           <div className="rounded-xl border border-gray-200 p-4">
//             <button
//               type="button"
//               onClick={handleManualEntryToggle}
//               disabled={isSubmitting}
//               className="flex w-full items-center justify-between gap-3 text-left"
//             >
//               <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
//                 <Keyboard size={18} />
//                 Enter barcode manually
//               </span>

//               <span className="text-sm font-medium text-blue-700">
//                 {manualEntry ? 'Hide' : 'Open'}
//               </span>
//             </button>

//             {manualEntry && (
//               <form onSubmit={handleConfirm} className="mt-3 space-y-3">
//                 <input
//                   type="text"
//                   value={scannedCode}
//                   onChange={handleManualInputChange}
//                   placeholder="Enter or scan barcode number"
//                   autoFocus
//                   autoComplete="off"
//                   disabled={isSubmitting}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
//                 />

//                 <button
//                   type="submit"
//                   disabled={!scannedCode.trim() || isSubmitting}
//                   className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 size={18} className="animate-spin" />
//                       Processing…
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle2 size={18} />
//                       Confirm barcode
//                     </>
//                   )}
//                 </button>
//               </form>
//             )}
//           </div>

//           {/* Detected barcode */}
//           {candidateCode && (
//             <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
//               <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
//                 {isStable ? 'Detected barcode' : 'Reading barcode'}
//               </p>

//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm">
//                   <PackageSearch size={21} />
//                 </div>

//                 <p className="break-all font-mono text-lg font-semibold text-gray-900">
//                   {candidateCode}
//                 </p>
//               </div>

//               {!isStable && !manualEntry && (
//                 <p className="mt-2 text-xs text-gray-500">
//                   Verifying barcode… keep the camera steady.
//                 </p>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 p-4 sm:flex-row sm:justify-between">
//           <button
//             type="button"
//             onClick={handleClose}
//             disabled={isSubmitting}
//             className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <X size={18} />
//             Close scanner
//           </button>

//           <button
//             type="button"
//             onClick={handleReset}
//             disabled={isStarting || isSubmitting}
//             className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
//           >
//             {isStarting ? (
//               <>
//                 <Loader2 size={18} className="animate-spin" />
//                 Starting…
//               </>
//             ) : (
//               <>
//                 <RefreshCw size={18} />
//                 Scan again
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BarcodeScanner;















// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { Html5Qrcode } from 'html5-qrcode';
// import { toast } from 'react-hot-toast';
// import {
//   X,
//   Keyboard,
//   ScanBarcode,
//   AlertCircle,
//   CheckCircle2,
//   Loader2,
//   RefreshCw,
//   Zap,
//   ZapOff
// } from 'lucide-react';

// const SCANNER_REGION_ID = 'interactive-barcode-scanner-viewport';

// const BarcodeScanner = ({ onScan, onClose }) => {
//   const [error, setError] = useState('');
//   const [isStarting, setIsStarting] = useState(true);
//   const [manualEntry, setManualEntry] = useState(false);
//   const [manualCode, setManualCode] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [torchOn, setTorchOn] = useState(false);
//   const [hasTorch, setHasTorch] = useState(false);
//   const [lastScanned, setLastScanned] = useState('');

//   const scannerRef = useRef(null);
//   const isScanningRef = useRef(false);
//   const onScanRef = useRef(onScan);
//   const onCloseRef = useRef(onClose);

//   useEffect(() => {
//     onScanRef.current = onScan;
//     onCloseRef.current = onClose;
//   }, [onScan, onClose]);

//   // Handle successful scan with instant debounce to prevent double-triggering
//   const handleSuccessfulScan = useCallback(async (decodedText) => {
//     const cleanText = String(decodedText || '').trim();
//     if (!cleanText || isSubmitting) return;

//     // Prevent duplicate rapid scans of the exact same item within 1.5 seconds
//     if (cleanText === lastScanned) return;

//     setLastScanned(cleanText);
//     setIsSubmitting(true);

//     // Subtle success notification chime/vibrate if supported
//     if (navigator.vibrate) {
//       navigator.vibrate(50);
//     }

//     try {
//       await onScanRef.current?.(cleanText);
//       toast.success(`Scanned: ${cleanText}`, { duration: 1500, position: 'top-center' });
      
//       // Reset last scanned cache after 1.5s to allow scanning the same item again if needed
//       setTimeout(() => setLastScanned(''), 1500);
//     } catch (err) {
//       console.error('Scan handling failed:', err);
//       toast.error('Failed to process product');
//     } finally {
//       setIsSubmitting(false);
//     }
//   }, [isSubmitting, lastScanned]);

//   // Initialize High-Speed Html5Qrcode Scanner
//   useEffect(() => {
//     let html5QrCode = null;
//     let isMounted = true;

//     const startCamera = async () => {
//       try {
//         setIsStarting(true);
//         setError('');

//         html5QrCode = new Html5Qrcode(SCANNER_REGION_ID, { verbose: false });
//         scannerRef.current = html5QrCode;

//         // Configurations optimized for rapid scanning
//         const config = {
//           fps: 20, // High frame rate for instant recognition
//           qrbox: { width: 260, height: 140 }, // Wide bounding box for standard linear barcodes
//           aspectRatio: 16 / 9,
//         };

//         await html5QrCode.start(
//           { facingMode: 'environment' }, // Uses back camera by default
//           config,
//           (decodedText) => {
//             if (isMounted) {
//               handleSuccessfulScan(decodedText);
//             }
//           },
//           () => {
//             // Frame parse miss (normal during continuous scanning loop, ignore)
//           }
//         );

//         if (isMounted) {
//           isScanningRef.current = true;
//           setIsStarting(false);

//           // Check if camera supports flashlight/torch
//           try {
//             const mediaTracks = html5QrCode.getRunningTrack();
//             const capabilities = mediaTracks?.getCapabilities?.();
//             if (capabilities?.torch) {
//               setHasTorch(true);
//             }
//           } catch {
//             // Torch unsupported on this browser/device
//           }
//         }
//       } catch (err) {
//         if (!isMounted) return;
//         console.error('Camera start error:', err);
//         setError(
//           err?.message?.includes('Permission') || err?.name === 'NotAllowedError'
//             ? 'Camera permission was denied. Please check browser settings.'
//             : 'Unable to access back camera. Try manual entry below.'
//         );
//         setIsStarting(false);
//       }
//     };

//     startCamera();

//     return () => {
//       isMounted = false;
//       if (scannerRef.current && isScanningRef.current) {
//         scannerRef.current
//           .stop()
//           .catch((err) => console.warn('Error stopping scanner cleanup:', err));
//         isScanningRef.current = false;
//       }
//     };
//   }, [handleSuccessfulScan]);

//   const toggleTorch = async () => {
//     if (!scannerRef.current || !hasTorch) return;
//     try {
//       const newTorchState = !torchOn;
//       await scannerRef.current.applyVideoConstraints({
//         advanced: [{ torch: newTorchState }],
//       });
//       setTorchOn(newTorchState);
//     } catch (err) {
//       console.warn('Torch control failed:', err);
//     }
//   };

//   const handleManualSubmit = async (e) => {
//     e.preventDefault();
//     const code = manualCode.trim();
//     if (!code) return;

//     setIsSubmitting(true);
//     try {
//       await onScanRef.current?.(code);
//       setManualCode('');
//       toast.success(`Added: ${code}`);
//     } catch (err) {
//       toast.error('Failed to add barcode');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCloseModal = () => {
//     if (scannerRef.current && isScanningRef.current) {
//       scannerRef.current
//         .stop()
//         .then(() => {
//           isScanningRef.current = false;
//           onCloseRef.current?.();
//         })
//         .catch(() => onCloseRef.current?.());
//     } else {
//       onCloseRef.current?.();
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-5">
//       <div className="flex max-h-[96vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
//               <ScanBarcode size={22} />
//             </div>
//             <div>
//               <h2 className="text-base font-black text-slate-900">Fast POS Scanner</h2>
//               <p className="text-xs text-slate-500">Continuous scanning mode enabled</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {hasTorch && !error && (
//               <button
//                 type="button"
//                 onClick={toggleTorch}
//                 className={`rounded-xl p-2.5 transition ${
//                   torchOn ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
//                 }`}
//                 title="Toggle Flashlight"
//               >
//                 {torchOn ? <Zap size={18} /> : <ZapOff size={18} />}
//               </button>
//             )}
//             <button
//               type="button"
//               onClick={handleCloseModal}
//               className="rounded-xl bg-slate-100 p-2.5 text-slate-600 hover:bg-slate-200 transition"
//               aria-label="Close scanner"
//             >
//               <X size={18} />
//             </button>
//           </div>
//         </div>

//         {/* Body */}
//         <div className="space-y-4 overflow-y-auto p-5">
          
//           {/* Camera Viewport Container */}
//           <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-950 shadow-inner">
//             <div id={SCANNER_REGION_ID} className="h-full w-full object-cover" />

//             {isStarting && (
//               <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-950 text-white">
//                 <Loader2 size={32} className="animate-spin text-indigo-500" />
//                 <p className="text-xs font-bold tracking-wide">Starting high-speed camera…</p>
//               </div>
//             )}

//             {error && (
//               <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-950 p-6 text-center text-white">
//                 <AlertCircle size={36} className="text-rose-500" />
//                 <p className="text-xs text-slate-300">{error}</p>
//               </div>
//             )}

//             {isSubmitting && !error && (
//               <div className="absolute inset-0 z-20 flex items-center justify-center bg-indigo-950/80 backdrop-blur-xs">
//                 <div className="flex items-center gap-2.5 rounded-2xl bg-white px-5 py-3 shadow-xl text-slate-900 font-bold text-xs">
//                   <Loader2 size={16} className="animate-spin text-indigo-600" /> Adding item to bill...
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Helper notice */}
//           <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3 flex items-center gap-3">
//             <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />
//             <p className="text-xs font-semibold text-indigo-900">
//               Align barcodes inside the box. Items will auto-add consecutively without closing.
//             </p>
//           </div>

//           {/* Manual Input Dropdown / Toggle */}
//           <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50">
//             <button
//               type="button"
//               onClick={() => setManualEntry(!manualEntry)}
//               className="flex w-full items-center justify-between text-left"
//             >
//               <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                 <Keyboard size={16} className="text-slate-500" /> Type Barcode Manually
//               </span>
//               <span className="text-xs font-bold text-indigo-600">
//                 {manualEntry ? 'Hide' : 'Open'}
//               </span>
//             </button>

//             {manualEntry && (
//               <form onSubmit={handleManualSubmit} className="mt-3 space-y-2.5">
//                 <input
//                   type="text"
//                   value={manualCode}
//                   onChange={(e) => setManualCode(e.target.value)}
//                   placeholder="Type SKU or barcode number..."
//                   autoFocus
//                   autoComplete="off"
//                   className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
//                 />
//                 <button
//                   type="submit"
//                   disabled={!manualCode.trim() || isSubmitting}
//                   className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-2.5 text-xs transition shadow-md shadow-indigo-600/20"
//                 >
//                   Add to Bill
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3.5">
//           <button
//             type="button"
//             onClick={handleCloseModal}
//             className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 transition shadow-md"
//           >
//             Done Scanning
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default BarcodeScanner;













// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { Html5Qrcode } from 'html5-qrcode';
// import { toast } from 'react-hot-toast';
// import {
//   X,
//   Keyboard,
//   ScanBarcode,
//   AlertCircle,
//   CheckCircle2,
//   Loader2,
//   RefreshCw,
//   Zap,
//   ZapOff
// } from 'lucide-react';

// const SCANNER_REGION_ID = 'interactive-barcode-scanner-viewport';

// const BarcodeScanner = ({ onScan, onClose }) => {
//   const [error, setError] = useState('');
//   const [isStarting, setIsStarting] = useState(true);
//   const [manualEntry, setManualEntry] = useState(false);
//   const [manualCode, setManualCode] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [torchOn, setTorchOn] = useState(false);
//   const [hasTorch, setHasTorch] = useState(false);
//   const [lastScanned, setLastScanned] = useState('');

//   const scannerRef = useRef(null);
//   const isScanningRef = useRef(false);
//   const onScanRef = useRef(onScan);
//   const onCloseRef = useRef(onClose);

//   useEffect(() => {
//     onScanRef.current = onScan;
//     onCloseRef.current = onClose;
//   }, [onScan, onClose]);

//   // Handle successful scan with instant debounce to prevent double-triggering
//   const handleSuccessfulScan = useCallback(async (decodedText) => {
//     const cleanText = String(decodedText || '').trim();
//     if (!cleanText || isSubmitting) return;

//     // Prevent duplicate rapid scans of the exact same item within 1.5 seconds
//     if (cleanText === lastScanned) return;

//     setLastScanned(cleanText);
//     setIsSubmitting(true);

//     // Subtle success notification chime/vibrate if supported
//     if (navigator.vibrate) {
//       navigator.vibrate(50);
//     }

//     try {
//       await onScanRef.current?.(cleanText);
//       toast.success(`Scanned: ${cleanText}`, { duration: 1500, position: 'top-center' });
      
//       // Reset last scanned cache after 1.5s to allow scanning the same item again if needed
//       setTimeout(() => setLastScanned(''), 1500);
//     } catch (err) {
//       console.error('Scan handling failed:', err);
//       toast.error('Failed to process product');
//     } finally {
//       setIsSubmitting(false);
//     }
//   }, [isSubmitting, lastScanned]);

//   // Initialize High-Speed Html5Qrcode Scanner
//   useEffect(() => {
//     let html5QrCode = null;
//     let isMounted = true;

//     const startCamera = async () => {
//       try {
//         setIsStarting(true);
//         setError('');

//         html5QrCode = new Html5Qrcode(SCANNER_REGION_ID, { verbose: false });
//         scannerRef.current = html5QrCode;

//         // Configurations optimized for rapid scanning
//         const config = {
//           fps: 20, // High frame rate for instant recognition
//           qrbox: { width: 260, height: 140 }, // Wide bounding box for standard linear barcodes
//           aspectRatio: 16 / 9,
//         };

//         await html5QrCode.start(
//           { facingMode: 'environment' }, // Uses back camera by default
//           config,
//           (decodedText) => {
//             if (isMounted) {
//               handleSuccessfulScan(decodedText);
//             }
//           },
//           () => {
//             // Frame parse miss (normal during continuous scanning loop, ignore)
//           }
//         );

//         if (isMounted) {
//           isScanningRef.current = true;
//           setIsStarting(false);

//           // Check if camera supports flashlight/torch
//           try {
//             const mediaTracks = html5QrCode.getRunningTrack();
//             const capabilities = mediaTracks?.getCapabilities?.();
//             if (capabilities?.torch) {
//               setHasTorch(true);
//             }
//           } catch {
//             // Torch unsupported on this browser/device
//           }
//         }
//       } catch (err) {
//         if (!isMounted) return;
//         console.error('Camera start error:', err);
//         setError(
//           err?.message?.includes('Permission') || err?.name === 'NotAllowedError'
//             ? 'Camera permission was denied. Please check browser settings.'
//             : 'Unable to access back camera. Try manual entry below.'
//         );
//         setIsStarting(false);
//       }
//     };

//     startCamera();

//     return () => {
//       isMounted = false;
//       if (scannerRef.current && isScanningRef.current) {
//         scannerRef.current
//           .stop()
//           .catch((err) => console.warn('Error stopping scanner cleanup:', err));
//         isScanningRef.current = false;
//       }
//     };
//   }, [handleSuccessfulScan]);

//   const toggleTorch = async () => {
//     if (!scannerRef.current || !hasTorch) return;
//     try {
//       const newTorchState = !torchOn;
//       await scannerRef.current.applyVideoConstraints({
//         advanced: [{ torch: newTorchState }],
//       });
//       setTorchOn(newTorchState);
//     } catch (err) {
//       console.warn('Torch control failed:', err);
//     }
//   };

//   const handleManualSubmit = async (e) => {
//     e.preventDefault();
//     const code = manualCode.trim();
//     if (!code) return;

//     setIsSubmitting(true);
//     try {
//       await onScanRef.current?.(code);
//       setManualCode('');
//       toast.success(`Added: ${code}`);
//     } catch (err) {
//       toast.error('Failed to add barcode');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCloseModal = () => {
//     if (scannerRef.current && isScanningRef.current) {
//       scannerRef.current
//         .stop()
//         .then(() => {
//           isScanningRef.current = false;
//           onCloseRef.current?.();
//         })
//         .catch(() => onCloseRef.current?.());
//     } else {
//       onCloseRef.current?.();
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-5">
//       <div className="flex max-h-[96vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
//               <ScanBarcode size={22} />
//             </div>
//             <div>
//               <h2 className="text-base font-black text-slate-900">Fast POS Scanner</h2>
//               <p className="text-xs text-slate-500">Continuous scanning mode enabled</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {hasTorch && !error && (
//               <button
//                 type="button"
//                 onClick={toggleTorch}
//                 className={`rounded-xl p-2.5 transition ${
//                   torchOn ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
//                 }`}
//                 title="Toggle Flashlight"
//               >
//                 {torchOn ? <Zap size={18} /> : <ZapOff size={18} />}
//               </button>
//             )}
//             <button
//               type="button"
//               onClick={handleCloseModal}
//               className="rounded-xl bg-slate-100 p-2.5 text-slate-600 hover:bg-slate-200 transition"
//               aria-label="Close scanner"
//             >
//               <X size={18} />
//             </button>
//           </div>
//         </div>

//         {/* Body */}
//         <div className="space-y-4 overflow-y-auto p-5">
          
//           {/* Camera Viewport Container */}
//           <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-950 shadow-inner">
//             <div id={SCANNER_REGION_ID} className="h-full w-full object-cover" />

//             {isStarting && (
//               <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-950 text-white">
//                 <Loader2 size={32} className="animate-spin text-indigo-500" />
//                 <p className="text-xs font-bold tracking-wide">Starting high-speed camera…</p>
//               </div>
//             )}

//             {error && (
//               <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-950 p-6 text-center text-white">
//                 <AlertCircle size={36} className="text-rose-500" />
//                 <p className="text-xs text-slate-300">{error}</p>
//               </div>
//             )}

//             {isSubmitting && !error && (
//               <div className="absolute inset-0 z-20 flex items-center justify-center bg-indigo-950/80 backdrop-blur-xs">
//                 <div className="flex items-center gap-2.5 rounded-2xl bg-white px-5 py-3 shadow-xl text-slate-900 font-bold text-xs">
//                   <Loader2 size={16} className="animate-spin text-indigo-600" /> Adding item to bill...
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Helper notice */}
//           <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3 flex items-center gap-3">
//             <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />
//             <p className="text-xs font-semibold text-indigo-900">
//               Align barcodes inside the box. Items will auto-add consecutively without closing.
//             </p>
//           </div>

//           {/* Manual Input Dropdown / Toggle */}
//           <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50">
//             <button
//               type="button"
//               onClick={() => setManualEntry(!manualEntry)}
//               className="flex w-full items-center justify-between text-left"
//             >
//               <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                 <Keyboard size={16} className="text-slate-500" /> Type Barcode Manually
//               </span>
//               <span className="text-xs font-bold text-indigo-600">
//                 {manualEntry ? 'Hide' : 'Open'}
//               </span>
//             </button>

//             {manualEntry && (
//               <form onSubmit={handleManualSubmit} className="mt-3 space-y-2.5">
//                 <input
//                   type="text"
//                   value={manualCode}
//                   onChange={(e) => setManualCode(e.target.value)}
//                   placeholder="Type SKU or barcode number..."
//                   autoFocus
//                   autoComplete="off"
//                   className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
//                 />
//                 <button
//                   type="submit"
//                   disabled={!manualCode.trim() || isSubmitting}
//                   className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-2.5 text-xs transition shadow-md shadow-indigo-600/20"
//                 >
//                   Add to Bill
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3.5">
//           <button
//             type="button"
//             onClick={handleCloseModal}
//             className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 transition shadow-md"
//           >
//             Done Scanning
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default BarcodeScanner;













// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { Html5Qrcode } from 'html5-qrcode';
// import { toast } from 'react-hot-toast';
// import {
//   X,
//   Keyboard,
//   ScanBarcode,
//   AlertCircle,
//   CheckCircle2,
//   Loader2,
//   Zap,
//   ZapOff,
// } from 'lucide-react';

// const SCANNER_REGION_ID = 'interactive-barcode-scanner-viewport';
// const DUPLICATE_SCAN_LOCK_MS = 900;

// const BarcodeScanner = ({ onScan, onClose }) => {
//   const [error, setError] = useState('');
//   const [isStarting, setIsStarting] = useState(true);
//   const [manualEntry, setManualEntry] = useState(false);
//   const [manualCode, setManualCode] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [torchOn, setTorchOn] = useState(false);
//   const [hasTorch, setHasTorch] = useState(false);

//   const scannerRef = useRef(null);
//   const isScanningRef = useRef(false);
//   const isMountedRef = useRef(false);
//   const isSubmittingRef = useRef(false);
//   const closeRequestedRef = useRef(false);
//   const lastScannedRef = useRef('');
//   const lastScannedAtRef = useRef(0);
//   const duplicateTimerRef = useRef(null);
//   const startPromiseRef = useRef(null);
//   const stopPromiseRef = useRef(null);
//   const onScanRef = useRef(onScan);
//   const onCloseRef = useRef(onClose);

//   useEffect(() => {
//     onScanRef.current = onScan;
//     onCloseRef.current = onClose;
//   }, [onScan, onClose]);

//   const stopCamera = useCallback(async (scannerOverride = null) => {
//     const scanner = scannerOverride || scannerRef.current;
//     if (!scanner) return;

//     // Avoid overlapping stop calls against html5-qrcode.
//     if (stopPromiseRef.current) {
//       await stopPromiseRef.current;
//       return;
//     }

//     if (!isScanningRef.current) {
//       // If start() is still pending, its continuation will see closeRequested
//       // and stop the camera immediately after start resolves.
//       return;
//     }

//     stopPromiseRef.current = (async () => {
//       try {
//         await scanner.stop();
//       } catch (err) {
//         // A concurrent stop/unmount can make stop() reject. Still try to
//         // release the underlying video tracks below.
//         console.warn('Barcode scanner stop warning:', err);
//       } finally {
//         isScanningRef.current = false;

//         try {
//           const video = document.querySelector(`#${SCANNER_REGION_ID} video`);
//           const stream = video?.srcObject;
//           stream?.getTracks?.().forEach((track) => track.stop());
//           if (video) {
//             video.pause();
//             video.srcObject = null;
//           }
//         } catch (err) {
//           console.warn('Could not release scanner video tracks:', err);
//         }

//         if (scannerRef.current === scanner) {
//           scannerRef.current = null;
//         }
//       }
//     })();

//     try {
//       await stopPromiseRef.current;
//     } finally {
//       stopPromiseRef.current = null;
//     }
//   }, []);

//   const closeScanner = useCallback(async () => {
//     if (closeRequestedRef.current) return;
//     closeRequestedRef.current = true;

//     if (duplicateTimerRef.current) {
//       clearTimeout(duplicateTimerRef.current);
//       duplicateTimerRef.current = null;
//     }

//     const scanner = scannerRef.current;
//     await stopCamera(scanner);

//     if (isMountedRef.current) {
//       onCloseRef.current?.();
//     }
//   }, [stopCamera]);

//   const handleSuccessfulScan = useCallback(async (decodedText) => {
//     const cleanText = String(decodedText || '').trim();

//     if (
//       !cleanText ||
//       !isMountedRef.current ||
//       closeRequestedRef.current ||
//       isSubmittingRef.current
//     ) {
//       return;
//     }

//     const now = Date.now();
//     if (
//       cleanText === lastScannedRef.current &&
//       now - lastScannedAtRef.current < DUPLICATE_SCAN_LOCK_MS
//     ) {
//       return;
//     }

//     lastScannedRef.current = cleanText;
//     lastScannedAtRef.current = now;
//     isSubmittingRef.current = true;
//     setIsSubmitting(true);

//     if (typeof navigator !== 'undefined' && navigator.vibrate) {
//       navigator.vibrate(35);
//     }

//     try {
//       await onScanRef.current?.(cleanText);

//       if (isMountedRef.current && !closeRequestedRef.current) {
//         toast.success(`Scanned: ${cleanText}`, {
//           duration: 1000,
//           position: 'top-center',
//         });
//       }
//     } catch (err) {
//       console.error('Scan handling failed:', err);
//       if (isMountedRef.current) {
//         toast.error('Failed to process product. Please try again.');
//       }
//     } finally {
//       isSubmittingRef.current = false;
//       if (isMountedRef.current) {
//         setIsSubmitting(false);
//       }

//       // Do not restart the camera. Just allow the next scan after a short
//       // lockout to avoid repeatedly reading the same barcode in the frame.
//       if (duplicateTimerRef.current) {
//         clearTimeout(duplicateTimerRef.current);
//       }
//       duplicateTimerRef.current = setTimeout(() => {
//         if (lastScannedRef.current === cleanText) {
//           lastScannedRef.current = '';
//           lastScannedAtRef.current = 0;
//         }
//         duplicateTimerRef.current = null;
//       }, DUPLICATE_SCAN_LOCK_MS);
//     }
//   }, []);

//   useEffect(() => {
//     isMountedRef.current = true;
//     closeRequestedRef.current = false;

//     let cancelled = false;
//     let scannerInstance = null;

//     const startCamera = async () => {
//       try {
//         setIsStarting(true);
//         setError('');

//         const element = document.getElementById(SCANNER_REGION_ID);
//         if (!element) {
//           throw new Error('Scanner viewport is not available.');
//         }

//         scannerInstance = new Html5Qrcode(SCANNER_REGION_ID, {
//           verbose: false,
//         });
//         scannerRef.current = scannerInstance;

//         const config = {
//           fps: 20,
//           qrbox: { width: 260, height: 140 },
//           aspectRatio: 16 / 9,
//           disableFlip: false,
//         };

//         const startPromise = scannerInstance.start(
//           { facingMode: 'environment' },
//           config,
//           (decodedText) => {
//             if (!cancelled && isMountedRef.current) {
//               void handleSuccessfulScan(decodedText);
//             }
//           },
//           () => {
//             // Frame parse misses are expected during continuous scanning.
//           }
//         );

//         startPromiseRef.current = startPromise;
//         await startPromise;

//         isScanningRef.current = true;
//         startPromiseRef.current = null;

//         if (cancelled || closeRequestedRef.current || !isMountedRef.current) {
//           await stopCamera(scannerInstance);
//           return;
//         }

//         setIsStarting(false);

//         try {
//           const track = scannerInstance.getRunningTrack?.();
//           const capabilities = track?.getCapabilities?.();
//           setHasTorch(Boolean(capabilities?.torch));
//         } catch {
//           setHasTorch(false);
//         }
//       } catch (err) {
//         startPromiseRef.current = null;
//         if (cancelled || !isMountedRef.current) return;

//         console.error('Camera start error:', err);
//         setError(
//           err?.name === 'NotAllowedError' ||
//             err?.name === 'PermissionDeniedError' ||
//             err?.message?.toLowerCase?.().includes('permission')
//             ? 'Camera permission was denied. Allow camera access in browser settings or use manual entry.'
//             : err?.name === 'NotFoundError'
//               ? 'No camera was found. Use manual entry instead.'
//               : 'Unable to access the camera. Try manual entry below.'
//         );
//         setIsStarting(false);
//         isScanningRef.current = false;

//         try {
//           const video = document.querySelector(`#${SCANNER_REGION_ID} video`);
//           video?.srcObject?.getTracks?.().forEach((track) => track.stop());
//           if (video) {
//             video.pause();
//             video.srcObject = null;
//           }
//         } catch {
//           // Ignore best-effort cleanup failures.
//         }

//         if (scannerRef.current === scannerInstance) {
//           scannerRef.current = null;
//         }
//       }
//     };

//     void startCamera();

//     return () => {
//       cancelled = true;
//       isMountedRef.current = false;
//       closeRequestedRef.current = true;

//       if (duplicateTimerRef.current) {
//         clearTimeout(duplicateTimerRef.current);
//         duplicateTimerRef.current = null;
//       }

//       const scanner = scannerRef.current || scannerInstance;

//       // If the camera has started, stop it now. If start is still pending,
//       // startCamera() checks cancelled after the promise resolves and stops it.
//       if (scanner && isScanningRef.current) {
//         void stopCamera(scanner);
//       } else if (scanner) {
//         try {
//           const video = document.querySelector(`#${SCANNER_REGION_ID} video`);
//           video?.srcObject?.getTracks?.().forEach((track) => track.stop());
//           if (video) {
//             video.pause();
//             video.srcObject = null;
//           }
//         } catch {
//           // Ignore best-effort cleanup failures.
//         }
//       }
//     };
//   }, [handleSuccessfulScan, stopCamera]);

//   const toggleTorch = async () => {
//     const scanner = scannerRef.current;
//     if (!scanner || !hasTorch || !isScanningRef.current) return;

//     try {
//       const nextTorchState = !torchOn;
//       await scanner.applyVideoConstraints({
//         advanced: [{ torch: nextTorchState }],
//       });
//       setTorchOn(nextTorchState);
//     } catch (err) {
//       console.warn('Torch control failed:', err);
//       toast.error('Could not change the flashlight setting.');
//     }
//   };

//   const handleManualSubmit = async (event) => {
//     event.preventDefault();

//     const code = manualCode.trim();
//     if (!code || isSubmittingRef.current || closeRequestedRef.current) return;

//     isSubmittingRef.current = true;
//     setIsSubmitting(true);

//     try {
//       await onScanRef.current?.(code);
//       if (isMountedRef.current) {
//         setManualCode('');
//       }
//     } catch (err) {
//       console.error('Manual barcode handling failed:', err);
//       if (isMountedRef.current) toast.error('Failed to process barcode.');
//     } finally {
//       isSubmittingRef.current = false;
//       if (isMountedRef.current) setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-5">
//       <div className="flex max-h-[96vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
//         <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
//               <ScanBarcode size={22} />
//             </div>
//             <div>
//               <h2 className="text-base font-black text-slate-900">DukanBill POS Scanner</h2>
              
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {hasTorch && !error && (
//               <button
//                 type="button"
//                 onClick={toggleTorch}
//                 disabled={isSubmitting}
//                 className={`rounded-xl p-2.5 transition ${
//                   torchOn
//                     ? 'bg-amber-100 text-amber-700'
//                     : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
//                 }`}
//                 title="Toggle flashlight"
//                 aria-label="Toggle flashlight"
//               >
//                 {torchOn ? <Zap size={18} /> : <ZapOff size={18} />}
//               </button>
//             )}
//             <button
//               type="button"
//               onClick={() => void closeScanner()}
//               className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition hover:bg-slate-200"
//               aria-label="Close scanner"
//             >
//               <X size={18} />
//             </button>
//           </div>
//         </div>

//         <div className="space-y-4 overflow-y-auto p-5">
//           <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-950 shadow-inner">
//             <div id={SCANNER_REGION_ID} className="h-full w-full" />

//             {isStarting && (
//               <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-950 text-white">
//                 <Loader2 size={32} className="animate-spin text-indigo-500" />
//                 <p className="text-xs font-bold tracking-wide">Starting camera…</p>
//               </div>
//             )}

//             {error && (
//               <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-950 p-6 text-center text-white">
//                 <AlertCircle size={36} className="text-rose-500" />
//                 <p className="text-xs text-slate-300">{error}</p>
//               </div>
//             )}

//             {isSubmitting && !error && (
//               <div className="absolute inset-0 z-20 flex items-center justify-center bg-indigo-950/70">
//                 <div className="flex items-center gap-2.5 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-slate-900 shadow-xl">
//                   <Loader2 size={16} className="animate-spin text-indigo-600" />
//                   Adding item to bill…
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3">
//             <CheckCircle2 size={18} className="shrink-0 text-indigo-600" />
//             <p className="text-xs font-semibold text-indigo-900">
//               Scan each product in sequence. The camera stays on until you close the scanner or finish scanning.
//             </p>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
//             <button
//               type="button"
//               onClick={() => setManualEntry((current) => !current)}
//               className="flex w-full items-center justify-between text-left"
//               aria-expanded={manualEntry}
//             >
//               <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
//                 <Keyboard size={16} className="text-slate-500" />
//                 Type barcode manually
//               </span>
//               <span className="text-xs font-bold text-indigo-600">
//                 {manualEntry ? 'Hide' : 'Open'}
//               </span>
//             </button>

//             {manualEntry && (
//               <form onSubmit={handleManualSubmit} className="mt-3 space-y-2.5">
//                 <input
//                   type="text"
//                   value={manualCode}
//                   onChange={(event) => setManualCode(event.target.value)}
//                   placeholder="Type SKU or barcode number…"
//                   autoFocus
//                   autoComplete="off"
//                   disabled={isSubmitting}
//                   className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
//                 />
//                 <button
//                   type="submit"
//                   disabled={!manualCode.trim() || isSubmitting}
//                   className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:opacity-50"
//                 >
//                   {isSubmitting ? 'Adding…' : 'Add to bill'}
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>

//         <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3.5">
//           <button
//             type="button"
//             onClick={() => void closeScanner()}
//             className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md transition hover:bg-slate-800"
//           >
//             Done Scanning
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BarcodeScanner














import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'react-hot-toast';
import {
  X,
  Keyboard,
  ScanBarcode,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Zap,
  ZapOff,
} from 'lucide-react';

const SCANNER_REGION_ID = 'interactive-barcode-scanner-viewport';
const DUPLICATE_SCAN_LOCK_MS = 900;

const BarcodeScanner = ({ onScan, onClose }) => {
  const [error, setError] = useState('');
  const [isStarting, setIsStarting] = useState(true);
  const [manualEntry, setManualEntry] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);

  const scannerRef = useRef(null);
  const isScanningRef = useRef(false);
  const isMountedRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const closeRequestedRef = useRef(false);
  const lastScannedRef = useRef('');
  const lastScannedAtRef = useRef(0);
  const duplicateTimerRef = useRef(null);
  const startPromiseRef = useRef(null);
  const stopPromiseRef = useRef(null);
  const onScanRef = useRef(onScan);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onScanRef.current = onScan;
    onCloseRef.current = onClose;
  }, [onScan, onClose]);

  const stopCamera = useCallback(async (scannerOverride = null) => {
    const scanner = scannerOverride || scannerRef.current;
    if (!scanner) return;

    if (stopPromiseRef.current) {
      await stopPromiseRef.current;
      return;
    }

    if (!isScanningRef.current) return;

    stopPromiseRef.current = (async () => {
      try {
        await scanner.stop();
      } catch (err) {
        console.warn('Barcode scanner stop warning:', err);
      } finally {
        isScanningRef.current = false;

        try {
          const video = document.querySelector(`#${SCANNER_REGION_ID} video`);
          const stream = video?.srcObject;
          stream?.getTracks?.().forEach((track) => track.stop());
          if (video) {
            video.pause();
            video.srcObject = null;
          }
        } catch (err) {
          console.warn('Could not release scanner video tracks:', err);
        }

        if (scannerRef.current === scanner) {
          scannerRef.current = null;
        }
      }
    })();

    try {
      await stopPromiseRef.current;
    } finally {
      stopPromiseRef.current = null;
    }
  }, []);

  const closeScanner = useCallback(async () => {
    if (closeRequestedRef.current) return;
    closeRequestedRef.current = true;

    if (duplicateTimerRef.current) {
      clearTimeout(duplicateTimerRef.current);
      duplicateTimerRef.current = null;
    }

    const scanner = scannerRef.current;
    await stopCamera(scanner);

    if (isMountedRef.current) {
      onCloseRef.current?.();
    }
  }, [stopCamera]);

  const handleSuccessfulScan = useCallback(async (decodedText) => {
    const cleanText = String(decodedText || '').trim();

    if (
      !cleanText ||
      !isMountedRef.current ||
      closeRequestedRef.current ||
      isSubmittingRef.current
    ) {
      return;
    }

    const now = Date.now();
    if (
      cleanText === lastScannedRef.current &&
      now - lastScannedAtRef.current < DUPLICATE_SCAN_LOCK_MS
    ) {
      return;
    }

    lastScannedRef.current = cleanText;
    lastScannedAtRef.current = now;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(35);
    }

    try {
      await onScanRef.current?.(cleanText);

      if (isMountedRef.current && !closeRequestedRef.current) {
        toast.success(`Scanned: ${cleanText}`, {
          duration: 1000,
          position: 'top-center',
        });
      }
    } catch (err) {
      console.error('Scan handling failed:', err);
      if (isMountedRef.current) {
        toast.error('Failed to process product. Please try again.');
      }
    } finally {
      isSubmittingRef.current = false;
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }

      if (duplicateTimerRef.current) {
        clearTimeout(duplicateTimerRef.current);
      }
      duplicateTimerRef.current = setTimeout(() => {
        if (lastScannedRef.current === cleanText) {
          lastScannedRef.current = '';
          lastScannedAtRef.current = 0;
        }
        duplicateTimerRef.current = null;
      }, DUPLICATE_SCAN_LOCK_MS);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    closeRequestedRef.current = false;

    let cancelled = false;
    let scannerInstance = null;

    const startCamera = async () => {
      try {
        setIsStarting(true);
        setError('');

        const element = document.getElementById(SCANNER_REGION_ID);
        if (!element) {
          throw new Error('Scanner viewport is not available.');
        }

        scannerInstance = new Html5Qrcode(SCANNER_REGION_ID, {
          verbose: false,
        });
        scannerRef.current = scannerInstance;

        // Optimized proportions for effortless retail barcode scanning
        const config = {
          fps: 25,
          qrbox: { width: 300, height: 60 }, // Wider box fits linear retail barcodes perfectly
          aspectRatio: 16 / 9,
          disableFlip: false,
        };

        const startPromise = scannerInstance.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            if (!cancelled && isMountedRef.current) {
              void handleSuccessfulScan(decodedText);
            }
          },
          () => {}
        );

        startPromiseRef.current = startPromise;
        await startPromise;

        isScanningRef.current = true;
        startPromiseRef.current = null;

        if (cancelled || closeRequestedRef.current || !isMountedRef.current) {
          await stopCamera(scannerInstance);
          return;
        }

        setIsStarting(false);

        try {
          const track = scannerInstance.getRunningTrack?.();
          const capabilities = track?.getCapabilities?.();
          if (capabilities?.torch) {
            setHasTorch(true);
          } else {
            // Fallback check on mobile tracks
            setHasTorch(true); // Force-show torch button on mobile environments to let users test hardware toggle
          }
        } catch {
          setHasTorch(false);
        }
      } catch (err) {
        startPromiseRef.current = null;
        if (cancelled || !isMountedRef.current) return;

        console.error('Camera start error:', err);
        setError(
          err?.name === 'NotAllowedError' ||
            err?.name === 'PermissionDeniedError' ||
            err?.message?.toLowerCase?.().includes('permission')
            ? 'Camera permission was denied. Allow camera access in browser settings.'
            : 'Unable to access the camera. Try manual entry below.'
        );
        setIsStarting(false);
        isScanningRef.current = false;

        try {
          const video = document.querySelector(`#${SCANNER_REGION_ID} video`);
          video?.srcObject?.getTracks?.().forEach((track) => track.stop());
          if (video) {
            video.pause();
            video.srcObject = null;
          }
        } catch {}

        if (scannerRef.current === scannerInstance) {
          scannerRef.current = null;
        }
      }
    };

    void startCamera();

    return () => {
      cancelled = true;
      isMountedRef.current = false;
      closeRequestedRef.current = true;

      if (duplicateTimerRef.current) {
        clearTimeout(duplicateTimerRef.current);
        duplicateTimerRef.current = null;
      }

      const scanner = scannerRef.current || scannerInstance;
      if (scanner && isScanningRef.current) {
        void stopCamera(scanner);
      } else if (scanner) {
        try {
          const video = document.querySelector(`#${SCANNER_REGION_ID} video`);
          video?.srcObject?.getTracks?.().forEach((track) => track.stop());
          if (video) {
            video.pause();
            video.srcObject = null;
          }
        } catch {}
      }
    };
  }, [handleSuccessfulScan, stopCamera]);

  const toggleTorch = async () => {
    const scanner = scannerRef.current;
    if (!scanner || !hasTorch || !isScanningRef.current) return;

    try {
      const nextTorchState = !torchOn;
      await scanner.applyVideoConstraints({
        advanced: [{ torch: nextTorchState }],
      });
      setTorchOn(nextTorchState);
    } catch (err) {
      console.warn('Torch control failed:', err);
      toast.error('Could not change the flashlight setting.');
    }
  };

  const handleManualSubmit = async (event) => {
    event.preventDefault();

    const code = manualCode.trim();
    if (!code || isSubmittingRef.current || closeRequestedRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      await onScanRef.current?.(code);
      if (isMountedRef.current) {
        setManualCode('');
      }
    } catch (err) {
      console.error('Manual barcode handling failed:', err);
      if (isMountedRef.current) toast.error('Failed to process barcode.');
    } finally {
      isSubmittingRef.current = false;
      if (isMountedRef.current) setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-5">
      <div className="flex max-h-[96vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <ScanBarcode size={22} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">DukanBill POS Scanner</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasTorch && !error && (
              <button
                type="button"
                onClick={toggleTorch}
                disabled={isSubmitting}
                className={`rounded-xl p-2.5 transition ${
                  torchOn
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title="Toggle flashlight"
                aria-label="Toggle flashlight"
              >
                {torchOn ? <Zap size={18} /> : <ZapOff size={18} />}
              </button>
            )}
            <button
              type="button"
              onClick={() => void closeScanner()}
              className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition hover:bg-slate-200"
              aria-label="Close scanner"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto p-5">
          {/* Camera Viewport with custom overlay frame */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-950 shadow-inner">
            <div id={SCANNER_REGION_ID} className="h-full w-full [&_video]:object-cover" />

            {/* Visual targeting laser line */}
            {!isStarting && !error && (
              <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
                <div className="w-[300px] h-12 border-2 border-indigo-400/60 rounded-xl relative flex items-center justify-center">
                  <div className="absolute inset-x-0 h-0.5 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.9)] animate-pulse" />
                </div>
              </div>
            )}

            {isStarting && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-slate-950 text-white">
                <Loader2 size={32} className="animate-spin text-indigo-500" />
                <p className="text-xs font-bold tracking-wide">Starting camera lens…</p>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-slate-950 p-6 text-center text-white">
                <AlertCircle size={36} className="text-rose-500" />
                <p className="text-xs text-slate-300">{error}</p>
              </div>
            )}

            {isSubmitting && !error && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-indigo-950/70">
                <div className="flex items-center gap-2.5 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-slate-900 shadow-xl">
                  <Loader2 size={16} className="animate-spin text-indigo-600" />
                  Adding item to bill…
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3">
            <CheckCircle2 size={18} className="shrink-0 text-indigo-600" />
            <p className="text-xs font-semibold text-indigo-900">
              Align barcodes inside the targeting box. Continuous scanning is active.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
            <button
              type="button"
              onClick={() => setManualEntry((current) => !current)}
              className="flex w-full items-center justify-between text-left"
              aria-expanded={manualEntry}
            >
              <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Keyboard size={16} className="text-slate-500" />
                Type barcode manually
              </span>
              <span className="text-xs font-bold text-indigo-600">
                {manualEntry ? 'Hide' : 'Open'}
              </span>
            </button>

            {manualEntry && (
              <form onSubmit={handleManualSubmit} className="mt-3 space-y-2.5">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(event) => setManualCode(event.target.value)}
                  placeholder="Type SKU or barcode number…"
                  autoFocus
                  autoComplete="off"
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!manualCode.trim() || isSubmitting}
                  className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding…' : 'Add to bill'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3.5">
          <button
            type="button"
            onClick={() => void closeScanner()}
            className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md transition hover:bg-slate-800"
          >
            Done Scanning
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;