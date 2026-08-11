'use client';

import React, { useEffect, useState } from 'react';
import { X, Smartphone, Share, PlusSquare, Download, CheckCircle2, Monitor, Camera, ShieldCheck } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect if running inside standalone PWA mode
    if (typeof window !== 'undefined') {
      const isStandaloneApp =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneApp);

      // Detect iOS
      const ua = window.navigator.userAgent;
      const iosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
      setIsIOS(iosDevice);
    }

    // Capture Chrome/Android native beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted PWA installation');
        }
        setDeferredPrompt(null);
        onClose();
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto text-slate-900 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-slate-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out text-sm font-semibold">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-900 text-white rounded-2xl shadow-sm">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900">
                Install Accustandard Mobile App (PWA)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">Use full-screen app mode &amp; instant camera barcode scanning</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Standalone Active Banner */}
        {isStandalone ? (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs sm:text-sm flex items-center gap-3 font-extrabold shadow-2xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>App Mode Active: You are currently running Accustandard ERP in full PWA standalone mode.</span>
          </div>
        ) : null}

        {/* Native install button (Chrome / Android) */}
        {deferredPrompt && (
          <button
            onClick={handleNativeInstall}
            className="w-full py-3.5 px-6 bg-blue-900 hover:bg-blue-800 text-white font-black rounded-2xl shadow-md flex items-center justify-center gap-2.5 transition-all active:scale-95 text-xs sm:text-sm cursor-pointer"
          >
            <Download className="w-5 h-5 text-amber-400" />
            <span>Install app on device</span>
          </button>
        )}

        {/* 2-Column Side-by-Side Platform Instructions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          {/* Android & Desktop Guide */}
          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200/90 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="font-black text-slate-900 block text-xs uppercase tracking-wider text-blue-950 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Monitor className="w-4 h-4 text-blue-700" />
                Android &amp; Desktop Guide:
              </span>
              <div className="space-y-3 text-slate-800 font-semibold">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-blue-900 text-white rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">1</span>
                  <p className="text-xs sm:text-sm pt-0.5">In Chrome or Edge, click the <strong>Install Icon</strong> <Download className="w-4 h-4 inline text-blue-700 mx-0.5" /> in the browser address bar (top right).</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-blue-900 text-white rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">2</span>
                  <p className="text-xs sm:text-sm pt-0.5">On Android Chrome, open browser menu <strong>(&#8942;)</strong> &#10132; select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.</p>
                </div>
              </div>
            </div>
          </div>

          {/* iPhone / iPad Safari Guide */}
          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200/90 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="font-black text-slate-900 block text-xs uppercase tracking-wider text-blue-950 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Smartphone className="w-4 h-4 text-blue-700" />
                iPhone / iPad (Safari Guide):
              </span>
              <div className="space-y-3 text-slate-800 font-semibold">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-blue-900 text-white rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">1</span>
                  <p className="text-xs sm:text-sm pt-0.5">Tap the <strong>Share button</strong> <Share className="w-4 h-4 inline text-blue-700 mx-0.5" /> in your Safari bottom navigation bar.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-blue-900 text-white rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">2</span>
                  <p className="text-xs sm:text-sm pt-0.5">Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong> <PlusSquare className="w-4 h-4 inline text-emerald-700 mx-0.5" />.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barcode Scanner & PWA Benefits Card */}
        <div className="p-5 bg-blue-50/90 border border-blue-200/90 rounded-2xl space-y-2 text-blue-950 shadow-2xs">
          <span className="font-black block text-xs sm:text-sm flex items-center gap-2 text-blue-950 uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
            Why Install Accustandard as a PWA?
          </span>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs text-blue-900 font-bold">
            <li className="flex items-center gap-1.5 bg-white p-2.5 rounded-xl border border-blue-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full-Screen Workspace (No Clutter)</span>
            </li>
            <li className="flex items-center gap-1.5 bg-white p-2.5 rounded-xl border border-blue-200/80">
              <Camera className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Remembered Camera Barcode Scanner</span>
            </li>
            <li className="flex items-center gap-1.5 bg-white p-2.5 rounded-xl border border-blue-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Fast Offline Cache &amp; Low-Latency</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="pt-4 flex justify-end border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition cursor-pointer"
          >
            Got It &bull; Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
