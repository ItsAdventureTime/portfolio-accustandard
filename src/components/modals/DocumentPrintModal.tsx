'use client';

import React from 'react';
import { X, Printer, CheckCircle2 } from 'lucide-react';
import { printDocumentElement } from '@/lib/exportUtils';

interface DocumentPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  elementId: string;
  children: React.ReactNode;
}

export const DocumentPrintModal: React.FC<DocumentPrintModalProps> = ({
  isOpen,
  onClose,
  title,
  elementId,
  children,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    printDocumentElement(elementId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-between overflow-hidden">
      {/* Top Floating Control Bar */}
      <div className="bg-slate-900 text-white px-4 md:px-8 py-3.5 flex justify-between items-center shadow-xl border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs md:text-sm font-black uppercase tracking-wider text-white">
              Document Print Preview — {title}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">A4 Standard Printable Layout Preview</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="btn-primary-blue text-xs md:text-sm font-bold px-4 py-2 flex items-center gap-2 shadow-lg active:scale-95 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Document</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Interactive Printable Document Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-400/50 flex justify-center items-start">
        <div id={elementId} className="bg-white shadow-2xl rounded-sm my-2">
          {children}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="bg-slate-900 text-slate-300 px-6 py-3 border-t border-slate-800 flex justify-between items-center text-xs shrink-0">
        <span className="font-mono">Exact A4 Output (760px Width)</span>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition">
            Close
          </button>
          <button onClick={handlePrint} className="btn-primary-blue text-xs py-1.5 px-4 font-bold flex items-center gap-1.5">
            <Printer className="w-3.5 h-3.5" />
            <span>Print Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
