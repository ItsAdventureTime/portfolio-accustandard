'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, Flashlight, Volume2, X, CheckCircle, RefreshCw } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

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
  title = 'Scan Stock Barcode',
}) => {
  const [manualSku, setManualSku] = useState('');
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
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

      // Clean up AudioContext resource after sound completes
      setTimeout(() => {
        audioCtx.close().catch(() => {});
      }, 200);
    } catch {
      // Browser audio policy fallback
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Handle Esc key to close modal
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      const scanner = new Html5QrcodeScanner(
        'reader',
        {
          fps: 10,
          qrbox: { width: 260, height: 160 },
          aspectRatio: 1.0,
        },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          setLastScanned(decodedText);
          playBeepSound();
          onScan(decodedText);
        },
        () => {
          // Continuous scan retry
        }
      );

      scannerRef.current = scanner;

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        if (scannerRef.current) {
          scannerRef.current.clear().catch(() => {});
        }
      };
    }
  }, [isOpen, onScan, onClose]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualSku.trim()) {
      playBeepSound();
      setLastScanned(manualSku.trim());
      onScan(manualSku.trim());
      setManualSku('');
    }
  };

  // Light-dismiss on backdrop click
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

        {/* Camera Scanner Viewport */}
        <div className="my-4 relative bg-black rounded-xl overflow-hidden min-h-[280px] flex items-center justify-center border border-slate-800">
          <div id="reader" className="w-full h-full"></div>
          {lastScanned && (
            <div className="absolute bottom-3 left-3 right-3 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Scanned: {lastScanned}
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

        {/* Controls */}
        <div className="flex justify-between items-center gap-2 mb-4 text-xs">
          <button
            onClick={() => setIsFlashOn(!isFlashOn)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition ${
              isFlashOn
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Flashlight className="w-4 h-4" />
            Torch {isFlashOn ? 'ON' : 'OFF'}
          </button>
          <div className="flex items-center gap-1 text-slate-400">
            <Volume2 className="w-4 h-4 text-blue-400" />
            <span>Audio Beep On</span>
          </div>
        </div>

        {/* Manual SKU fallback */}
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Or type SKU / Barcode manually..."
            value={manualSku}
            onChange={(e) => setManualSku(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
