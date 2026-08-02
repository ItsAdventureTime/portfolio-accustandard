'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, Flashlight, Volume2, X, CheckCircle, RefreshCw, AlertCircle, Barcode, Play, Scan } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
  onOpenProductManager?: () => void;
  title?: string;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScan,
  onOpenProductManager,
  title = 'Mobile Barcode & QR Reader',
}) => {
  const [manualSku, setManualSku] = useState('');
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const modalBackdropRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const playBeepSound = () => {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 tone
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);

      setTimeout(() => {
        audioCtx.close().catch(() => {});
      }, 200);
    } catch {
      // Audio fallback
    }
  };

  const executeScanAction = (scannedSku: string) => {
    playBeepSound();
    setLastScanned(scannedSku);
    onScan(scannedSku);
    onClose(); // Instantly close modal and trigger target filter action
  };

  const startCameraStream = () => {
    setCameraError(null);
    const element = document.getElementById('reader');
    if (!element) return;

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('reader');
      }

      const qrCode = html5QrCodeRef.current;
      const config = { fps: 15, qrbox: { width: 260, height: 170 } };

      const onScanSuccess = (decodedText: string) => {
        executeScanAction(decodedText);
      };

      const onScanFailure = () => {
        // Frame scan retry
      };

      // Try rear camera first ('environment'), fallback to front camera ('user')
      qrCode
        .start({ facingMode: 'environment' }, config, onScanSuccess, onScanFailure)
        .then(() => {
          setIsScanningActive(true);
        })
        .catch(() => {
          qrCode
            .start({ facingMode: 'user' }, config, onScanSuccess, onScanFailure)
            .then(() => {
              setIsScanningActive(true);
            })
            .catch((err) => {
              setIsScanningActive(false);
              setCameraError('Live camera stream unavailable. You can upload/snap a barcode image or use quick presets below.');
            });
        });
    } catch (e: any) {
      setCameraError('Camera setup error. You can upload/snap a barcode image or use quick presets below.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('reader');
      }
      const qrCode = html5QrCodeRef.current;
      const decodedText = await qrCode.scanFile(file, true);
      executeScanAction(decodedText);
    } catch (err) {
      setCameraError('Could not decode barcode from uploaded image. Please ensure the barcode is clear and well-lit.');
    }
  };

  const stopCameraStream = () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          setIsScanningActive(false);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const timer = setTimeout(() => {
      startCameraStream();
    }, 200);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      stopCameraStream();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualSku.trim()) {
      executeScanAction(manualSku.trim().toUpperCase());
      setManualSku('');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalBackdropRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={modalBackdropRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="barcodeScannerTitle"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
    >
      <div className="bg-slate-900 text-white rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl border border-slate-700 flex flex-col animate-fade-in mobile-modal-container">
        {/* Hidden File Input for Image Barcode Scanning */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-blue-400" />
            <h2 id="barcodeScannerTitle" className="font-bold text-sm sm:text-base text-slate-100">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Bar (Upload Image / Product SKU Manager) */}
        <div className="pt-2 flex justify-between items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 font-bold rounded-lg text-xs flex items-center gap-1.5 border border-slate-700 transition"
          >
            <Camera className="w-4 h-4 text-blue-400" />
            <span>Upload / Snap Photo</span>
          </button>

          {onOpenProductManager && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenProductManager();
              }}
              className="px-3 py-1.5 bg-blue-900/80 hover:bg-blue-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 border border-blue-600/60 transition"
            >
              <Barcode className="w-4 h-4 text-blue-300" />
              <span>Manage SKUs</span>
            </button>
          )}
        </div>

        {/* Mobile Viewfinder Video Stream Container */}
        <div className="my-3 relative bg-black rounded-xl overflow-hidden min-h-[250px] flex items-center justify-center border-2 border-slate-800 shadow-inner">
          <div id="reader" className="w-full h-full min-h-[250px]"></div>

          {/* Viewfinder Target Framing Overlay */}
          {!cameraError && (
            <div className="pointer-events-none absolute inset-0 border-[30px] border-black/40 flex items-center justify-center">
              <div className="w-56 h-36 border-2 border-dashed border-blue-400/80 rounded-lg relative flex items-center justify-center">
                <div className="w-full h-0.5 bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>
              </div>
            </div>
          )}

          {cameraError && (
            <div className="absolute inset-0 bg-slate-900/95 p-4 flex flex-col items-center justify-center text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-400" />
              <p className="text-xs text-amber-200 font-medium px-2">{cameraError}</p>
              <button
                type="button"
                onClick={startCameraStream}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 active:scale-95 transition"
              >
                <Play className="w-4 h-4" />
                <span>Retry Camera Stream</span>
              </button>
            </div>
          )}

          {lastScanned && (
            <div className="absolute bottom-3 left-3 right-3 bg-emerald-950/95 border border-emerald-500/60 text-emerald-200 px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between z-10 shadow-lg">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                Scanned: <strong className="text-white">{lastScanned}</strong>
              </span>
              <button
                type="button"
                onClick={() => setLastScanned(null)}
                className="text-slate-400 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile 1-Click Test Barcode Presets (Spacious 48px touch targets) */}
        <div className="mb-3 space-y-2 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
          <span className="text-[11px] text-blue-300 font-bold uppercase block tracking-wider flex items-center gap-1">
            <Scan className="w-4 h-4 text-blue-400" />
            <span>Mobile 1-Click Test Barcodes (Instant Tap):</span>
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => executeScanAction('ACC-BACT-01')}
              className="py-2.5 px-2 bg-blue-900/60 hover:bg-blue-600 text-white border border-blue-400/50 rounded-lg font-mono font-extrabold text-[11px] text-center transition active:scale-95 shadow cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              ACC-BACT-01
            </button>
            <button
              type="button"
              onClick={() => executeScanAction('ACC-REAG-04')}
              className="py-2.5 px-2 bg-purple-900/60 hover:bg-purple-600 text-white border border-purple-400/50 rounded-lg font-mono font-extrabold text-[11px] text-center transition active:scale-95 shadow cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              ACC-REAG-04
            </button>
            <button
              type="button"
              onClick={() => executeScanAction('ACC-HEMA-09')}
              className="py-2.5 px-2 bg-emerald-900/60 hover:bg-emerald-600 text-white border border-emerald-400/50 rounded-lg font-mono font-extrabold text-[11px] text-center transition active:scale-95 shadow cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              ACC-HEMA-09
            </button>
          </div>
        </div>

        {/* Manual SKU Input Fallback */}
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Type SKU or Barcode..."
            value={manualSku}
            onChange={(e) => setManualSku(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 min-h-[44px]"
          >
            Scan
          </button>
        </form>
      </div>
    </div>
  );
};
