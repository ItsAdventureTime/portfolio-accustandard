'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, CheckCircle2, RefreshCw, AlertCircle, Barcode, Play, Scan, Sparkles } from 'lucide-react';
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
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
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
    onClose();
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

      const onScanFailure = () => {};

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
            .catch(() => {
              setIsScanningActive(false);
              setCameraError('Live camera stream unavailable. You can snap a barcode image or use 1-click test presets below.');
            });
        });
    } catch (e: any) {
      setCameraError('Camera setup error. You can snap a barcode image or use 1-click test presets below.');
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
    } finally {
      e.target.value = '';
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
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto text-slate-900 animate-in fade-in duration-200"
    >
      <div className="bg-white text-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 flex flex-col animate-in fade-in zoom-in duration-200 space-y-6 text-sm">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Modal Header Matching Light Design System */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-900 rounded-xl">
              <Camera className="w-6 h-6 text-blue-800" />
            </div>
            <div>
              <h2 id="barcodeScannerTitle" className="text-sm font-black uppercase tracking-wider text-slate-900">
                {title}
              </h2>
              <p className="text-xs text-slate-500 font-medium">Real-time mobile camera scanner &amp; SKU lookup</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="flex justify-between items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-xl text-xs flex items-center gap-1.5 border border-slate-300 transition active:scale-95"
          >
            <Camera className="w-4 h-4 text-blue-700" />
            <span>Upload / Snap Photo</span>
          </button>

          {onOpenProductManager && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenProductManager();
              }}
              className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
            >
              <Barcode className="w-4 h-4 text-blue-200" />
              <span>Manage SKUs</span>
            </button>
          )}
        </div>

        {/* Viewfinder Camera Frame */}
        <div className="relative bg-slate-950 rounded-2xl overflow-hidden min-h-[240px] flex items-center justify-center border-2 border-slate-300 shadow-inner">
          <div id="reader" className="w-full h-full min-h-[240px]"></div>

          {/* Laser Line Overlay */}
          {!cameraError && (
            <div className="pointer-events-none absolute inset-0 border-[28px] border-slate-950/40 flex items-center justify-center">
              <div className="w-52 h-32 border-2 border-dashed border-blue-400/90 rounded-lg relative flex items-center justify-center">
                <div className="w-full h-0.5 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.9)] animate-pulse"></div>
              </div>
            </div>
          )}

          {cameraError && (
            <div className="absolute inset-0 bg-slate-900/95 p-4 flex flex-col items-center justify-center text-center space-y-3 text-white">
              <AlertCircle className="w-8 h-8 text-amber-400" />
              <p className="text-xs text-amber-200 font-medium px-2">{cameraError}</p>
              <button
                type="button"
                onClick={startCameraStream}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 active:scale-95 transition shadow-sm"
              >
                <Play className="w-4 h-4" />
                <span>Retry Camera Stream</span>
              </button>
            </div>
          )}

          {lastScanned && (
            <div className="absolute bottom-3 left-3 right-3 bg-emerald-900/95 border border-emerald-500 text-emerald-100 px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between z-10 shadow-lg">
              <span className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Scanned: <strong className="text-white">{lastScanned}</strong>
              </span>
              <button
                type="button"
                onClick={() => setLastScanned(null)}
                className="text-slate-300 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* 1-Click Mobile Test Barcode Presets */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-[11px] text-blue-900 font-black uppercase tracking-wider block flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-700" />
            <span>Mobile 1-Click Test Barcodes (Instant Tap):</span>
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => executeScanAction('ACC-BACT-01')}
              className="py-2 px-2 bg-white hover:bg-blue-50 text-blue-950 border border-blue-200 rounded-xl font-mono font-extrabold text-[11px] text-center transition active:scale-95 shadow-2xs cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              ACC-BACT-01
            </button>
            <button
              type="button"
              onClick={() => executeScanAction('ACC-REAG-04')}
              className="py-2 px-2 bg-white hover:bg-purple-50 text-purple-950 border border-purple-200 rounded-xl font-mono font-extrabold text-[11px] text-center transition active:scale-95 shadow-2xs cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              ACC-REAG-04
            </button>
            <button
              type="button"
              onClick={() => executeScanAction('ACC-HEMA-09')}
              className="py-2 px-2 bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-xl font-mono font-extrabold text-[11px] text-center transition active:scale-95 shadow-2xs cursor-pointer min-h-[44px] flex items-center justify-center"
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
            className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            type="submit"
            className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition shadow-sm active:scale-95 min-h-[44px]"
          >
            Scan SKU
          </button>
        </form>
      </div>
    </div>
  );
};
