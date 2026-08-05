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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                QuickBooks Online (QBO) Live Sync Queue
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                  Live API
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Only approved, control-validated transactions enter the QuickBooks ledger sync queue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              COSO Internal Control Handoff Architecture
            </p>
            <p className="text-emerald-800">
              Operational users never post directly to QuickBooks. Only fully approved Sales Invoices, Vendor Bills, Customer Collections, and COGS entries pass validation into this sync queue.
            </p>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {qboQueue.map((item) => (
              <div key={item.id} className="p-4 bg-white hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 rounded border border-slate-200">
                      {item.docType}
                    </span>
                    <span className="font-semibold text-slate-900 text-sm">{item.docNumber}</span>
                  </div>
                  <p className="text-xs text-slate-600">{item.entityName}</p>
                  <p className="text-xs font-semibold text-slate-800">
                    ₱{item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {item.syncStatus === 'SYNCED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {item.qboRefId}
                      </span>
                    )}
                    {item.syncStatus === 'QUEUED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        Queued for Sync
                      </span>
                    )}
                    {item.syncStatus === 'ERROR' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-800 text-xs font-semibold rounded-full">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Sync Blocked
                      </span>
                    )}
                    <p className="text-[10px] text-slate-400 mt-1">Last attempt: {item.lastAttempt}</p>
                  </div>

                  {item.syncStatus !== 'SYNCED' && (
                    <button
                      onClick={() => onTriggerSync(item.id)}
                      className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Sync Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Bridge Internal Control Handoff Engine v4.2</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
          >
            Close Queue
          </button>
        </div>
      </div>
    </div>
  );
};
