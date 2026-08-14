'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { CheckCircle2, ShieldAlert, TriangleAlert, X } from 'lucide-react';
import type { NotificationSeverity } from '@/components/common/NotificationCenter';

interface SystemAlertModalProps {
  message: string | null;
  onClose: () => void;
  viewAsRole: string;
  severity: NotificationSeverity;
  title?: string;
}

/**
 * Reserved for an intentional, workflow-interrupting alert. Routine feedback
 * belongs in NotificationCenter; this dialog is never used as a generic toast.
 */
export const SystemAlertModal: React.FC<SystemAlertModalProps> = ({
  message,
  onClose,
  viewAsRole,
  severity,
  title = 'System alert',
}) => {
  if (!message) return null;

  const isError = severity === 'error';
  const isWarning = severity === 'warning';
  const tone = isError
    ? {
        border: 'border-rose-200',
        header: 'bg-rose-50',
        icon: 'bg-rose-100 text-rose-700',
        action: 'bg-rose-700 hover:bg-rose-800',
      }
    : isWarning
      ? {
          border: 'border-amber-200',
          header: 'bg-amber-50',
          icon: 'bg-amber-100 text-amber-800',
          action: 'bg-amber-700 hover:bg-amber-800',
        }
      : {
          border: 'border-blue-100',
          header: 'bg-blue-50',
          icon: 'bg-blue-100 text-blue-800',
          action: 'bg-blue-900 hover:bg-blue-800',
        };

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content
          role="alertdialog"
          aria-labelledby="system-alert-title"
          aria-describedby="system-alert-description"
          className="modal-viewport modal-viewport--center modal-viewport--sm"
        >
          <div className="modal-panel text-slate-900">
            <div className={`flex items-start justify-between gap-4 border-b p-5 ${tone.border} ${tone.header}`}>
              <div className="flex items-start gap-3">
                <span className={`rounded-xl p-2 ${tone.icon}`} aria-hidden="true">
                  {isError ? <ShieldAlert className="h-5 w-5" /> : isWarning ? <TriangleAlert className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                </span>
                <div>
                  <Dialog.Title id="system-alert-title" className="text-base font-semibold">{title}</Dialog.Title>
                  <p className="mt-1 text-xs font-medium text-slate-600">Active demo role: {viewAsRole}</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="min-h-[44px] min-w-[44px] rounded-xl p-2 text-slate-500 hover:bg-white hover:text-slate-900" aria-label="Close alert">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="modal-body space-y-4 p-5">
              <Dialog.Description id="system-alert-description" className="text-sm font-medium leading-relaxed text-slate-800">{message}</Dialog.Description>
              <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                <button type="button" onClick={onClose} className="min-h-[44px] rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200">
                  Cancel
                </button>
                <button type="button" autoFocus onClick={onClose} className={`min-h-[44px] rounded-xl px-4 py-2 text-sm font-semibold text-white ${tone.action}`}>
                  Acknowledge and close
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
