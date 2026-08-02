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
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 border border-slate-300 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-900 rounded-xl">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Install Accustanda Mobile App
              </h3>
              <p className="text-xs text-slate-500 font-medium">Use full-screen app mode & barcode scanner</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Standalone Active Banner */}
        {isStandalone ? (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2.5 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>App Mode Active: You are currently running Accustanda ERP in full PWA standalone mode.</span>
          </div>
        ) : null}

        {/* 1-Click Native Install Button (Chrome / Android) */}
        {deferredPrompt && (
          <button
            onClick={handleNativeInstall}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95 text-xs"
          >
            <Download className="w-4 h-4" />
            <span>Install App on Device (1-Click)</span>
          </button>
        )}

        {/* Platform Instructions */}
        <div className="space-y-4 text-xs">
          {isIOS ? (
            /* iPhone / iPad Safari Instructions */
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-extrabold text-slate-900 block text-xs uppercase tracking-wider text-blue-900">
                iPhone / iPad (Safari Guide):
              </span>
              <div className="space-y-2.5 text-slate-700 font-medium">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                  <p>Tap the <strong>Share button</strong> <Share className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> in your Safari bottom navigation bar.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                  <p>Scroll down the menu options and tap <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-emerald-600 mx-0.5" />.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                  <p>Tap <strong>Add</strong> in the top right. The Accustanda app icon will appear on your home screen!</p>
                </div>
              </div>
            </div>
          ) : (
            /* Android & Desktop Guide */
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-extrabold text-slate-900 block text-xs uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-blue-600" />
                Android & Desktop Guide:
              </span>
              <div className="space-y-2.5 text-slate-700 font-medium">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                  <p>In Chrome or Edge, click the <strong>Install Icon</strong> <Download className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> in the browser address bar (top right).</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                  <p>On Android Chrome, open browser menu <strong>(⋮)</strong> ➔ select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
                </div>
              </div>
            </div>
          )}

          {/* Barcode Scanner & PWA Benefits */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5 text-blue-950">
            <span className="font-bold block text-xs flex items-center gap-1.5 text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              Why Install as a PWA?
            </span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-blue-900 font-medium">
              <li>Instant full-screen app view (no address bar clutter)</li>
              <li>Camera permission remembered for instant barcode scanning</li>
              <li>Works smoothly on low-connectivity mobile networks</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
