'use client';

import React from 'react';
import { X, Printer, CheckCircle2 } from 'lucide-react';
import { printDocumentElement } from '@/lib/exportUtils';
import { AccessibleModal } from '@/components/common/AccessibleModal';

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
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Document print preview — ${title}`}
      description="Review the A4 document layout before printing."
      variant="fullscreen"
      size="full"
      contentClassName="text-slate-900"
    >
      <div className="modal-panel modal-document-preview">
      {/* Top Floating Control Bar */}
      <div className="modal-header bg-white px-4 py-3.5 md:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2 text-blue-900">
            <Printer className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-900 md:text-sm">
              Document Print Preview — {title}
            </h3>
            <p className="text-[11px] font-medium text-slate-500">A4 standard printable layout preview</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="btn-primary-blue flex min-h-[44px] items-center gap-2 px-4 py-2 text-xs font-semibold transition active:scale-95 md:text-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Document</span>
          </button>
          <button
            onClick={onClose}
            className="modal-close"
            aria-label="Close print preview"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Interactive Printable Document Container */}
      <div className="modal-document-preview__body flex flex-1 items-start justify-center overflow-y-auto p-4 md:p-8">
        <div id={elementId} className="my-2 rounded-sm bg-white shadow-xl">
          {children}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="modal-footer justify-between px-6 py-3 text-xs">
        <span className="font-mono text-slate-500">Exact A4 output (760px width)</span>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="modal-secondary-action px-4 py-1.5 text-xs font-semibold">
            Close
          </button>
          <button onClick={handlePrint} className="btn-primary-blue flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold">
            <Printer className="w-3.5 h-3.5" />
            <span>Print Now</span>
          </button>
        </div>
      </div>
      </div>
    </AccessibleModal>
  );
};
