'use client';

import React from 'react';
import { X, RefreshCw, CheckCircle2, AlertCircle, Clock, Database, ArrowRight } from 'lucide-react';
import { AccessibleModal } from '@/components/common/AccessibleModal';

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
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="QuickBooks Online export queue"
      description="Control-validated transactions staged for manual export."
      size="xl"
      contentClassName="text-slate-900"
    >
      <div className="modal-panel">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-700 text-white rounded-2xl shadow-sm">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                QuickBooks Online (QBO) Export Queue
                <span className="px-3 py-1 text-xs font-extrabold bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                  Manual export / demo
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                Control-validated transactions are staged for manual export; direct QBO API integration is future scope.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close QuickBooks export queue"
            title="Close"
            className="modal-close cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5 flex-1 text-sm font-semibold">
          <div className="p-4 sm:p-5 bg-amber-50 border border-amber-300 rounded-2xl text-xs sm:text-sm text-amber-950 space-y-1">
            <p className="font-extrabold flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              COSO Internal Control Handoff / Export Boundary
            </p>
            <p className="text-emerald-900 leading-relaxed font-semibold">
              Operational users never post directly to QuickBooks. Approved documents are staged here for manual export; the demo action only records a local queue reference.
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
                        Demo ref: {item.qboRefId}
                      </span>
                    )}
                    {item.syncStatus === 'QUEUED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-900 text-xs sm:text-sm font-extrabold rounded-xl border border-amber-300">
                        <Clock className="w-4 h-4 text-amber-600" />
                        Queued for Manual Export
                      </span>
                    )}
                    {item.syncStatus === 'ERROR' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 text-rose-900 text-xs sm:text-sm font-extrabold rounded-xl border border-rose-300">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        Export Blocked
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
                      <span>Mark Exported (Demo)</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs sm:text-sm text-slate-600 font-bold">
          <span>Bridge Internal Control Handoff Engine v4.2 · Direct QBO API future scope</span>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-2xl transition cursor-pointer"
          >
            Close Queue
          </button>
        </div>
      </div>
    </AccessibleModal>
  );
};
