'use client';

import React from 'react';
import { X, FileSpreadsheet, FileText, Download, CheckCircle2 } from 'lucide-react';
import { exportToCSV, exportToExcel, printDocumentElement } from '@/lib/exportUtils';
import { AccessibleModal } from '@/components/common/AccessibleModal';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  filename: string;
  data: object[];
  printableElementId?: string;
  onExportSuccess?: (format: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  title,
  filename,
  data,
  printableElementId,
  onExportSuccess,
}) => {
  if (!isOpen) return null;

  const handleExportCSV = () => {
    exportToCSV(`${filename}.csv`, data);
    if (onExportSuccess) onExportSuccess('CSV');
    onClose();
  };

  const handleExportExcel = () => {
    exportToExcel(`${filename}.xls`, title, data);
    if (onExportSuccess) onExportSuccess('Excel');
    onClose();
  };

  const handleExportPDF = () => {
    if (printableElementId) {
      printDocumentElement(printableElementId);
    } else {
      exportToCSV(`${filename}_report.csv`, data);
    }
    if (onExportSuccess) onExportSuccess('PDF / Print');
    onClose();
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Export ${title}`}
      description="Choose an export format for the selected records."
      contentClassName="text-slate-900"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-slate-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out text-sm font-semibold">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              <span>Export {title}</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Select your target output format</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close export dialog" className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selection Buttons */}
        <div className="space-y-3">
          {/* Format 1: CSV for QuickBooks / XERO / ERP */}
          <button
            onClick={handleExportCSV}
            className="w-full p-4 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between transition text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-blue-800 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">CSV File (.csv)</span>
                <span className="text-[11px] text-slate-500 font-medium">QuickBooks, XERO, & ERP Import Format</span>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition">Export ➔</span>
          </button>

          {/* Format 2: Excel Spreadsheet (.xls) */}
          <button
            onClick={handleExportExcel}
            className="w-full p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center justify-between transition text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Excel Spreadsheet (.xlsx / .xls)</span>
                <span className="text-[11px] text-slate-500 font-medium">Formatted Microsoft Excel Data Sheet</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition">Export ➔</span>
          </button>

          {/* Format 3: PDF Output (.pdf) */}
          <button
            onClick={handleExportPDF}
            className="w-full p-4 rounded-xl border-2 border-slate-200 hover:border-red-500 hover:bg-red-50/50 flex items-center justify-between transition text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-100 text-red-800 rounded-lg group-hover:bg-red-600 group-hover:text-white transition">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">PDF Output Document (.pdf)</span>
                <span className="text-[11px] text-slate-500 font-medium">Styled Printable Document Output</span>
              </div>
            </div>
            <span className="text-xs font-bold text-red-600 group-hover:translate-x-1 transition">Export ➔</span>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100">
          <span className="font-mono">{data.length} records ready</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </AccessibleModal>
  );
};
