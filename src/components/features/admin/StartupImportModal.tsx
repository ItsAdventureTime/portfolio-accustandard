'use client';

import React, { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, FileSpreadsheet, ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';

interface StartupImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: (importSummary: any) => void;
}

export const StartupImportModal: React.FC<StartupImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const [importType, setImportType] = useState<'MASTER' | 'INVENTORY' | 'FINANCIAL' | 'TRANSACTIONS'>('INVENTORY');
  const [currentStep, setCurrentStep] = useState<'UPLOAD' | 'VALIDATE' | 'PREVIEW' | 'RECONCILE'>('UPLOAD');
  const [fileName, setFileName] = useState('AccuStandard_Cutover_Beginning_Inventory_2026.csv');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const mockValidationResults = {
    totalRecords: 148,
    validRecords: 146,
    errorRecords: 2,
    batchId: `IMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    errors: [
      { row: 42, sku: 'ACC-INVALID-99', issue: 'Unknown SKU in Item Master — Line skipped' },
      { row: 115, sku: 'ACC-REAG-04', issue: 'Negative Beginning Unit Cost — Requires override approval' },
    ],
    reconciliation: {
      totalQuantity: '4,850 Units',
      totalValuation: '₱1,420,850.00',
      cutoverDate: 'August 01, 2026',
    },
  };

  const handleNextStep = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (currentStep === 'UPLOAD') setCurrentStep('VALIDATE');
      else if (currentStep === 'VALIDATE') setCurrentStep('PREVIEW');
      else if (currentStep === 'PREVIEW') {
        setCurrentStep('RECONCILE');
        if (onImportComplete) {
          onImportComplete(mockValidationResults);
        }
      }
    }, 500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Startup Cutover Data Import Modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-300 my-auto text-slate-900 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white flex justify-between items-center shrink-0 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 text-blue-300 rounded-2xl border border-blue-400/30">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-white">
                Startup / Cutover Data Import Engine (FR-025 &ndash; FR-031)
              </h2>
              <p className="text-xs text-blue-200/90 font-medium">
                Controlled 5-Stage Staging: Upload &rarr; Validate &rarr; Preview &rarr; Post &rarr; Reconcile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Import Modal"
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex justify-between text-xs font-extrabold text-slate-600">
          <span className={currentStep === 'UPLOAD' ? 'text-blue-900 font-black underline' : ''}>1. Upload File</span>
          <span>&rarr;</span>
          <span className={currentStep === 'VALIDATE' ? 'text-blue-900 font-black underline' : ''}>2. Validate Staging</span>
          <span>&rarr;</span>
          <span className={currentStep === 'PREVIEW' ? 'text-blue-900 font-black underline' : ''}>3. Preview &amp; Resolve</span>
          <span>&rarr;</span>
          <span className={currentStep === 'RECONCILE' ? 'text-emerald-800 font-black underline' : ''}>4. Post &amp; Reconcile</span>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm flex-1">
          {currentStep === 'UPLOAD' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Cutover Data Import Type</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setImportType('INVENTORY')}
                    className={`p-3 rounded-xl border font-bold text-left transition ${importType === 'INVENTORY' ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                  >
                    <span className="block font-extrabold text-sm">Beginning Inventory (FR-027)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Opening SKU quantities, batch lots &amp; WMA unit costs</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportType('MASTER')}
                    className={`p-3 rounded-xl border font-bold text-left transition ${importType === 'MASTER' ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                  >
                    <span className="block font-extrabold text-sm">Master Data (FR-026)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Customers, Vendors, SKUs &amp; GL Account Master</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportType('FINANCIAL')}
                    className={`p-3 rounded-xl border font-bold text-left transition ${importType === 'FINANCIAL' ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                  >
                    <span className="block font-extrabold text-sm">Financial Balances (FR-028)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Opening GL, AR &amp; AP ledger cutover balances</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportType('TRANSACTIONS')}
                    className={`p-3 rounded-xl border font-bold text-left transition ${importType === 'TRANSACTIONS' ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                  >
                    <span className="block font-extrabold text-sm">Open Transactions (FR-029)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Ongoing uncollected invoices &amp; open POs</span>
                  </button>
                </div>
              </div>

              <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 bg-blue-50/40 text-center space-y-2">
                <FileSpreadsheet className="w-8 h-8 text-blue-700 mx-auto" />
                <div className="text-xs font-extrabold text-blue-950">
                  {fileName ? (
                    <span className="text-blue-900 font-mono bg-blue-100 px-3 py-1 rounded-xl border border-blue-300 inline-block">
                      ✓ Selected File: {fileName}
                    </span>
                  ) : (
                    'Click or drop Excel / CSV cutover migration file here'
                  )}
                </div>
                <p className="text-[11px] text-slate-500">Supports .xlsx, .csv formatted cutover files up to 50MB</p>
              </div>
            </div>
          )}

          {(currentStep === 'VALIDATE' || currentStep === 'PREVIEW') && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Staged Records</span>
                  <span className="font-mono font-black text-slate-900 text-base">{mockValidationResults.totalRecords}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Valid &amp; Ready</span>
                  <span className="font-mono font-black text-emerald-700 text-base">{mockValidationResults.validRecords}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Flagged Exceptions</span>
                  <span className="font-mono font-black text-rose-700 text-base">{mockValidationResults.errorRecords}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Staging Exceptions &amp; Validation Errors:</span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {mockValidationResults.errors.map((err, idx) => (
                    <div key={idx} className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex justify-between items-center">
                      <span>Row {err.row} ({err.sku}): <strong>{err.issue}</strong></span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-rose-100 rounded border border-rose-300">SKIPPED</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 'RECONCILE' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-950 font-black text-base">
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                <span>Import Batch Posted &amp; Reconciled Successfully!</span>
              </div>
              <p className="text-xs text-emerald-900 font-semibold">
                Import Batch ID: <strong className="font-mono text-emerald-950">{mockValidationResults.batchId}</strong>
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-800 pt-2 border-t border-emerald-200">
                <div>Total Inventory Units Posted: <strong className="font-mono text-slate-950">{mockValidationResults.reconciliation.totalQuantity}</strong></div>
                <div>Total Inventory Valuation: <strong className="font-mono text-slate-950">{mockValidationResults.reconciliation.totalValuation}</strong></div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex justify-between items-center shrink-0">
            <span className="text-xs font-semibold text-slate-500">
              Rule FR-031: Staged imports prevent silent overwrites and record reconciliation totals.
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition text-xs cursor-pointer"
              >
                {currentStep === 'RECONCILE' ? 'Close' : 'Cancel'}
              </button>
              {currentStep !== 'RECONCILE' && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isProcessing}
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white font-extrabold rounded-xl transition text-xs flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
                >
                  <span>{isProcessing ? 'Processing Staging...' : currentStep === 'PREVIEW' ? 'Approve & Post Import Batch' : 'Next Step'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
