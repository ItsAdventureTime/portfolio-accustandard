'use client';

import React, { useState } from 'react';
import { X, Upload, CheckCircle2, FileSpreadsheet, Database, Landmark, Receipt, ArrowRight, ShieldCheck } from 'lucide-react';
import { AccessibleModal } from '@/components/common/AccessibleModal';

interface StartupImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StartupImportModal: React.FC<StartupImportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [importType, setImportType] = useState<'MASTER' | 'INVENTORY' | 'FINANCIAL' | 'TRANSACTIONS'>('INVENTORY');
  const [currentStep, setCurrentStep] = useState<'UPLOAD' | 'VALIDATE' | 'PREVIEW'>('UPLOAD');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const mockValidationResults = {
    totalRecords: 148,
    validRecords: 146,
    errorRecords: 2,
    errors: [
      { row: 42, sku: 'ACC-INVALID-99', issue: 'Unknown SKU in Item Master — Line skipped' },
      { row: 115, sku: 'ACC-REAG-04', issue: 'Negative Beginning Unit Cost — Requires override approval' },
    ],
  };

  const handleNextStep = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (currentStep === 'UPLOAD') setCurrentStep('VALIDATE');
      else if (currentStep === 'VALIDATE') setCurrentStep('PREVIEW');
      else if (currentStep === 'PREVIEW') onClose();
    }, 450);
  };

  const steps = [
    { id: 'UPLOAD', label: 'Upload File' },
    { id: 'VALIDATE', label: 'Validate Staging' },
    { id: 'PREVIEW', label: 'Preview & Resolve' },
  ];
  const canAdvance = currentStep !== 'UPLOAD' || Boolean(fileName);

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cutover Data Import Engine"
      description="Preview the staged import flow without posting or changing live records."
      size="md"
      contentClassName="text-slate-900"
    >
      <div className="modal-panel text-slate-900">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-600/20 shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Cutover Data Import Engine
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                  FR-025 – FR-031
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Demo preview only: Upload &rarr; Validate &rarr; Review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Import Modal"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Stepper Indicator Bar */}
        <div className="px-6 py-3.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between shrink-0">
          {steps.map((step, idx) => {
            const isCurrent = currentStep === step.id;
            const isCompleted = steps.findIndex(s => s.id === currentStep) > idx;

            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/20'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isCurrent
                        ? 'text-blue-900 font-bold'
                        : isCompleted
                        ? 'text-emerald-700 font-semibold'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="h-0.5 flex-1 max-w-[28px] bg-slate-200 rounded-full mx-1" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Modal Content Body */}
        <div className="p-6 space-y-5 text-sm overflow-y-auto flex-1 bg-white">
          {currentStep === 'UPLOAD' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Select Cutover Data Import Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setImportType('INVENTORY')}
                    className={`p-4 rounded-xl border-2 font-medium text-left transition-all cursor-pointer ${
                      importType === 'INVENTORY'
                        ? 'bg-blue-50/60 border-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1">
                      <FileSpreadsheet className={`w-4 h-4 ${importType === 'INVENTORY' ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="font-bold text-sm text-slate-900">Beginning Inventory</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">FR-027</span>
                    </div>
                    <span className="text-xs text-slate-500 block leading-relaxed">
                      Opening SKU quantities, batch lots &amp; WMA unit costs
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImportType('MASTER')}
                    className={`p-4 rounded-xl border-2 font-medium text-left transition-all cursor-pointer ${
                      importType === 'MASTER'
                        ? 'bg-blue-50/60 border-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1">
                      <Database className={`w-4 h-4 ${importType === 'MASTER' ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="font-bold text-sm text-slate-900">Master Data</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">FR-026</span>
                    </div>
                    <span className="text-xs text-slate-500 block leading-relaxed">
                      Customers, Vendors, SKUs &amp; GL Account Master
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImportType('FINANCIAL')}
                    className={`p-4 rounded-xl border-2 font-medium text-left transition-all cursor-pointer ${
                      importType === 'FINANCIAL'
                        ? 'bg-blue-50/60 border-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1">
                      <Landmark className={`w-4 h-4 ${importType === 'FINANCIAL' ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="font-bold text-sm text-slate-900">Financial Balances</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">FR-028</span>
                    </div>
                    <span className="text-xs text-slate-500 block leading-relaxed">
                      Opening GL, AR &amp; AP ledger cutover balances
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImportType('TRANSACTIONS')}
                    className={`p-4 rounded-xl border-2 font-medium text-left transition-all cursor-pointer ${
                      importType === 'TRANSACTIONS'
                        ? 'bg-blue-50/60 border-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1">
                      <Receipt className={`w-4 h-4 ${importType === 'TRANSACTIONS' ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="font-bold text-sm text-slate-900">Open Transactions</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">FR-029</span>
                    </div>
                    <span className="text-xs text-slate-500 block leading-relaxed">
                      Ongoing uncollected invoices &amp; open POs
                    </span>
                  </button>
                </div>
              </div>

              <div className="border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-xl p-6 bg-blue-50/20 text-center space-y-2.5 transition cursor-pointer">
                <label className="block cursor-pointer">
                <FileSpreadsheet className="w-8 h-8 text-blue-600 mx-auto" />
                <input type="file" accept=".xlsx,.csv" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} />
                <div>
                  {fileName ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100/80 text-blue-900 font-semibold text-xs rounded-lg border border-blue-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                      Selected File: {fileName}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-800">
                      Click or drag Excel / CSV cutover migration file here
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">Supports .xlsx, .csv formatted cutover files up to 50MB</p>
                </label>
              </div>
            </div>
          )}

          {(currentStep === 'VALIDATE' || currentStep === 'PREVIEW') && (
            <div className="space-y-4">
                <p className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs font-semibold text-blue-950">Demo validation sample only. This screen does not parse, post, reconcile, or alter records.</p>
                <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase block">Total Staged Records</span>
                  <span className="font-bold text-slate-900 text-lg">{mockValidationResults.totalRecords}</span>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase block">Valid &amp; Ready</span>
                  <span className="font-bold text-emerald-700 text-lg">{mockValidationResults.validRecords}</span>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase block">Flagged Exceptions</span>
                  <span className="font-bold text-rose-700 text-lg">{mockValidationResults.errorRecords}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Staging Exceptions &amp; Validation Errors:</span>
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {mockValidationResults.errors.map((err, idx) => (
                    <div key={idx} className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl text-xs text-rose-900 flex justify-between items-center">
                      <span>Row {err.row} ({err.sku}): <strong>{err.issue}</strong></span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 rounded text-rose-800">SKIPPED</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Rule FR-031 preview: staged imports should prevent silent overwrites before a configured posting service is available.</span>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition text-xs sm:text-sm cursor-pointer shadow-xs"
          >
            {currentStep === 'PREVIEW' ? 'Close preview' : 'Cancel'}
          </button>
          {currentStep !== 'PREVIEW' && (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={isProcessing || !canAdvance}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>{isProcessing ? 'Reviewing sample...' : currentStep === 'UPLOAD' && !fileName ? 'Select a file' : 'Next step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </AccessibleModal>
  );
};
