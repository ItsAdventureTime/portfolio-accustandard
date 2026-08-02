'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, Flashlight, Volume2, X, CheckCircle, RefreshCw, AlertCircle, Barcode, Play } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
  title?: string;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScan,
  title = 'Mobile Barcode & QR Scanner',
}) => {
  const [manualSku, setManualSku] = useState('');
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const modalBackdropRef = useRef<HTMLDivElement | null>(null);

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

  const startCameraStream = () => {
    setCameraError(null);
    const element = document.getElementById('reader');
    if (!element) return;

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('reader');
      }

      const qrCode = html5QrCodeRef.current;
      const config = { fps: 15, qrbox: { width: 250, height: 160 } };

      const onScanSuccess = (decodedText: string) => {
        setLastScanned(decodedText);
        playBeepSound();
        onScan(decodedText);
      };

      const onScanFailure = () => {
        // Frame scan retry
      };

      // Try rear camera first (facingMode: 'environment'), then fallback to front camera ('user')
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
              setCameraError('Camera stream blocked or unavailable. Please click a 1-click test preset below or type SKU manually.');
            });
        });
    } catch (e: any) {
      setCameraError('Camera stream error. Please click a test barcode preset below.');
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

    // Give DOM time to render `#reader` div then start stream
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
      playBeepSound();
      const sku = manualSku.trim().toUpperCase();
      setLastScanned(sku);
      onScan(sku);
      setManualSku('');
    }
  };

  const handleQuickPresetScan = (sku: string) => {
    playBeepSound();
    setLastScanned(sku);
    onScan(sku);
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
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-slate-900 text-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-700 flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-blue-400" />
            <h2 id="barcodeScannerTitle" className="font-bold text-base text-slate-100">{title}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Direct Camera Video Stream Container */}
        <div className="my-4 relative bg-black rounded-xl overflow-hidden min-h-[260px] flex items-center justify-center border border-slate-800">
          <div id="reader" className="w-full h-full min-h-[260px]"></div>

          {cameraError && (
            <div className="absolute inset-0 bg-slate-900/95 p-4 flex flex-col items-center justify-center text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-400" />
              <p className="text-xs text-amber-200 font-medium px-2">{cameraError}</p>
              <button
                onClick={startCameraStream}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Retry Camera Stream</span>
              </button>
            </div>
          )}

          {lastScanned && (
            <div className="absolute bottom-3 left-3 right-3 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between z-10">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                Scanned: <strong className="text-white">{lastScanned}</strong>
              </span>
              <button
                onClick={() => setLastScanned(null)}
                className="text-slate-400 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* 1-Click Test Barcode Presets */}
        <div className="mb-4 space-y-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
          <span className="text-[11px] text-slate-300 font-bold uppercase block tracking-wider flex items-center gap-1">
            <Barcode className="w-3.5 h-3.5 text-blue-400" />
            <span>Simulate Quick Scan (1-Click Test Presets):</span>
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => handleQuickPresetScan('ACC-BACT-01')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-blue-900 text-blue-300 border border-blue-500/50 rounded font-mono font-bold transition active:scale-95"
            >
              ACC-BACT-01
            </button>
            <button
              onClick={() => handleQuickPresetScan('ACC-REAG-04')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-purple-900 text-purple-300 border border-purple-500/50 rounded font-mono font-bold transition active:scale-95"
            >
              ACC-REAG-04
            </button>
            <button
              onClick={() => handleQuickPresetScan('ACC-HEMA-09')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/50 rounded font-mono font-bold transition active:scale-95"
            >
              ACC-HEMA-09
            </button>
          </div>
        </div>

        {/* Manual SKU Input Fallback */}
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Or type SKU / Barcode code..."
            value={manualSku}
            onChange={(e) => setManualSku(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95"
          >
            Scan Code
          </button>
        </form>
      </div>
    </div>
  );
};
