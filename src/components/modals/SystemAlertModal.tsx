'use client';

import React, { useEffect } from 'react';
import { ShieldAlert, CheckCircle2, X } from 'lucide-react';

interface SystemAlertModalProps {
  message: string | null;
  onClose: () => void;
  viewAsRole: string;
}

export const SystemAlertModal: React.FC<SystemAlertModalProps> = ({ message, onClose, viewAsRole }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        onClose();
      }
    };
    if (message) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [message, onClose]);

  if (!message) return null;

  const isViolation =
    message.includes('⛔') ||
    message.includes('BLOCKED') ||
    message.includes('Violation') ||
    message.includes('HARD-BLOCKED') ||
    message.includes('prohibited');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900">
        {/* Header */}
        <div
          className={`p-4 border-b flex justify-between items-center ${
            isViolation ? 'bg-rose-900 text-white border-rose-800' : 'bg-slate-900 text-white border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {isViolation ? (
              <div className="p-2 bg-rose-800 rounded-xl">
                <ShieldAlert className="w-6 h-6 text-rose-300 animate-pulse" />
              </div>
            ) : (
              <div className="p-2 bg-slate-800 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider">
                {isViolation ? 'COSO Internal Control Security Alert' : 'System Action Notification'}
              </h3>
              <p className="text-[11px] opacity-80">Impersonated Role: <strong className="text-amber-300">{viewAsRole}</strong></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
            title="Dismiss Alert (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 bg-slate-50 space-y-3.5 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-200 text-slate-700">
            {isViolation ? 'Execution Halted • Action Blocked' : 'System Notice'}
          </div>
          <p className={`text-base md:text-lg font-extrabold leading-snug ${isViolation ? 'text-rose-950' : 'text-slate-900'}`}>
            {message}
          </p>
          {isViolation && (
            <p className="text-xs text-rose-900 font-semibold bg-rose-100/80 border border-rose-300 p-3 rounded-xl text-left leading-relaxed">
              ⚠️ <strong>COSO Segregation of Duties (SoD) Safeguard:</strong> This operation is restricted for role <span className="font-bold text-rose-950">[{viewAsRole}]</span> to enforce executive authorization levels and prevent unauthorized financial or operational modifications.
            </p>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-white border-t border-slate-200">
          <button
            onClick={onClose}
            autoFocus
            className={`w-full py-3.5 px-4 rounded-xl text-sm font-black uppercase tracking-wider text-white shadow-md transition-all active:scale-95 ${
              isViolation
                ? 'bg-rose-600 hover:bg-rose-700 focus:ring-4 focus:ring-rose-300'
                : 'bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300'
            }`}
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
