'use client';

import React from 'react';
import { X, RefreshCw, CheckCircle2, AlertCircle, Clock, Database, ArrowRight } from 'lucide-react';

export interface QBOQueueItem {
  id: string;
  docType: string;
  docNumber: string;
  entityName: string;
  amount: number;
  qboRefId: string;
  syncStatus: string;
  lastAttempt: string;
  errorMessage?: string;
}

interface QBOSyncQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  qboQueue: QBOQueueItem[];
  onTriggerSync: (id: string) => void;
}

export const QBOSyncQueueModal: React.FC<QBOSyncQueueModalProps> = ({
  isOpen,
  onClose,
  qboQueue,
  onTriggerSync,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 text-slate-900 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-700 text-white rounded-2xl shadow-sm">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                QuickBooks Online (QBO) Live Sync Queue
                <span className="px-3 py-1 text-xs font-extrabold bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300">
                  Live API
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                Only approved, control-validated transactions enter the QuickBooks ledger sync queue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5 flex-1 text-sm font-semibold">
          <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs sm:text-sm text-emerald-950 space-y-1">
            <p className="font-extrabold flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              COSO Internal Control Handoff Architecture
            </p>
            <p className="text-emerald-900 leading-relaxed font-semibold">
              Operational users never post directly to QuickBooks. Only fully approved Sales Invoices, Vendor Bills, Customer Collections, and COGS entries pass validation into this sync queue.
            </p>
          </div>

          <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            {qboQueue.map((item) => (
              <div key={item.id} className="p-5 bg-white hover:bg-blue-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-800 rounded-lg border border-slate-300">
                      {item.docType}
                    </span>
                    <span className="font-extrabold text-blue-950 text-base font-mono">{item.docNumber}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-bold">{item.entityName}</p>
                  <p className="text-sm font-black text-slate-900 font-mono">
                    ₱{item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {item.syncStatus === 'SYNCED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-extrabold rounded-xl border border-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {item.qboRefId}
                      </span>
                    )}
                    {item.syncStatus === 'QUEUED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-900 text-xs sm:text-sm font-extrabold rounded-xl border border-amber-300">
                        <Clock className="w-4 h-4 text-amber-600" />
                        Queued for Sync
                      </span>
                    )}
                    {item.syncStatus === 'ERROR' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 text-rose-900 text-xs sm:text-sm font-extrabold rounded-xl border border-rose-300">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        Sync Blocked
                      </span>
                    )}
                    <p className="text-xs text-slate-500 font-semibold mt-1">Last attempt: {item.lastAttempt}</p>
                  </div>

                  {item.syncStatus !== 'SYNCED' && (
                    <button
                      onClick={() => onTriggerSync(item.id)}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Sync Now</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs sm:text-sm text-slate-600 font-bold">
          <span>Bridge Internal Control Handoff Engine v4.2</span>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-2xl transition cursor-pointer"
          >
            Close Queue
          </button>
        </div>
      </div>
    </div>
  );
};
