'use client';

import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

export type WorkflowStepKey = 'RFQ' | 'Quote' | 'PO' | 'RR' | 'Invoice' | 'SOA';

const WORKFLOW_STEPS: Array<{ key: WorkflowStepKey; label: string }> = [
  { key: 'RFQ', label: 'RFQ' },
  { key: 'Quote', label: 'Quote' },
  { key: 'PO', label: 'PO' },
  { key: 'RR', label: 'RR' },
  { key: 'Invoice', label: 'Invoice' },
  { key: 'SOA', label: 'SOA' },
];

interface WorkflowStepperProps {
  currentStep: WorkflowStepKey;
  compact?: boolean;
  className?: string;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  currentStep,
  compact = false,
  className = '',
}) => {
  const currentIndex = WORKFLOW_STEPS.findIndex((step) => step.key === currentStep);

  return (
    <nav
      aria-label="Supply chain workflow"
      className={`rounded-2xl border border-slate-200 bg-slate-50 ${compact ? 'p-3' : 'p-4'} ${className}`}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
          Supply chain workflow
        </span>
        <span className="text-xs font-bold text-blue-900">
          Current: {currentStep}
        </span>
      </div>
      <ol className="flex items-center gap-1 overflow-x-auto" role="list">
        {WORKFLOW_STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <React.Fragment key={step.key}>
              <li
                aria-current={isCurrent ? 'step' : undefined}
                className={`flex min-w-fit items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-extrabold transition-all ${
                  isCurrent
                    ? 'bg-blue-900 text-white shadow-sm'
                    : isComplete
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-white text-slate-500'
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                    isCurrent
                      ? 'bg-blue-700 text-white'
                      : isComplete
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isComplete ? <Check className="h-3 w-3" /> : index + 1}
                </span>
                {step.label}
              </li>
              {index < WORKFLOW_STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" aria-hidden="true" />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
