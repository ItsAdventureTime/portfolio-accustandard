'use client';

import React, { useState } from 'react';
import {
  FileCheck,
  Printer,
  Download,
  Building2,
  Calendar,
  AlertCircle,
} from 'lucide-react';

import { AccustandardLogo } from '@/components/brand/AccustandardLogo';

interface StatementOfAccountProps {
  soaRows: any[];
  onOpenPrintModal: (title: string, elementId: string, content: React.ReactNode) => void;
  onOpenExportModal: (title: string, filename: string, data: object[], elementId?: string) => void;
  onShowNotification: (msg: string) => void;
  onAddAuditLog: (action: string) => void;
}

export const StatementOfAccount: React.FC<StatementOfAccountProps> = ({
  soaRows = [],
  onOpenPrintModal,
  onOpenExportModal,
  onShowNotification,
  onAddAuditLog,
}) => {
  const [selectedClient, setSelectedClient] = useState('San Fernando Medical Center');

  const safeRows = Array.isArray(soaRows) ? soaRows : [];

  const totalBalanceSum = safeRows.reduce(
    (acc, row) => acc + (Number(row.totalBalance) || Number(row.runningBalance) || Number(row.invoiceBalance) || 0),
    0
  );

  const handleExportData = () => {
    onOpenExportModal(
      'Statement of Account',
      'statement_of_account',
      safeRows,
      'printable-soa-target'
    );
  };

  const soaDocumentContent = (
    <div id="printable-soa-target" className="bg-white p-8 sm:p-10 text-slate-900 font-sans max-w-4xl mx-auto border border-slate-300 shadow-md rounded-xl space-y-6">
      {/* Header Matching photo_2026-08-01_23-55-13.jpg */}
      <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-red-600 pb-4 gap-4">
        <div>
          <AccustandardLogo size="lg" />
          <p className="text-xs text-slate-600 font-semibold mt-1">
            Unit A G/F El Decano Bldg., Blk 2 Lot 2, St. Jude, Villa Corazon, San Agustin, City of San Fernando, 2000, Pampanga
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-xs font-black uppercase text-slate-500 block">Document Type</span>
          <span className="text-xl font-black text-blue-950 block">STATEMENT OF ACCOUNT</span>
          <span className="text-xs font-bold text-slate-700 block">As of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Client Billing Info */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-sm font-semibold">
        <div>
          <span className="text-xs font-black text-slate-500 uppercase block">Client Name</span>
          <span className="text-base font-extrabold text-blue-950">{selectedClient}</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-black text-slate-500 uppercase block">Total Balance Due</span>
          <span className="text-xl font-black font-mono text-red-600">
            ₱{totalBalanceSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Aging Matrix Table Matching Yellow Highlights in photo_2026-08-01_23-55-13.jpg */}
      <table className="w-full text-left text-sm border-collapse border border-slate-300">
        <thead className="bg-blue-950 text-white font-extrabold uppercase text-xs">
          <tr>
            <th className="p-3 border border-slate-300">Invoice Ref</th>
            <th className="p-3 border border-slate-300">Invoice Date</th>
            <th className="p-3 border border-slate-300">Terms</th>
            <th className="p-3 border border-slate-300 text-right">Current</th>
            <th className="p-3 border border-slate-300 text-right">31-60 Days</th>
            <th className="p-3 border border-slate-300 text-right bg-amber-500 text-slate-900">61-90+ Days (Overdue)</th>
            <th className="p-3 border border-slate-300 text-right">Total Balance (PHP)</th>
          </tr>
        </thead>
        <tbody className="font-semibold text-slate-900">
          {safeRows.map((row, idx) => {
            const currentVal = Number(row.current) || 0;
            const days30Val = Number(row.days30) || 0;
            const days60Val = Number(row.days60) || 0;
            const totalVal = Number(row.totalBalance) || Number(row.runningBalance) || Number(row.invoiceBalance) || 0;
            const invNo = row.invoiceNo || row.salesInvoiceNo || `SI-${idx + 1}`;
            const invDate = row.date || row.siDate || 'N/A';
            const invTerms = row.terms || '30 Days Net';

            return (
              <tr key={row.id || idx} className="hover:bg-slate-50 transition">
                <td className="p-3 border border-slate-300 font-mono font-bold text-blue-900">{invNo}</td>
                <td className="p-3 border border-slate-300">{invDate}</td>
                <td className="p-3 border border-slate-300 text-xs font-bold text-slate-700">{invTerms}</td>
                <td className="p-3 border border-slate-300 text-right font-mono">
                  ₱{currentVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3 border border-slate-300 text-right font-mono">
                  ₱{days30Val.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3 border border-slate-300 text-right font-mono bg-yellow-200 font-black text-slate-900">
                  ₱{days60Val.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3 border border-slate-300 text-right font-mono font-extrabold text-blue-950">
                  ₱{totalVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Payment Remittance Footer */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-xs text-blue-950 font-semibold">
        <p className="font-bold text-sm uppercase text-blue-900">Payment Remittance Details:</p>
        <p>Please make checks payable to: <span className="font-bold">ACCUSTANDARD MEDICAL AND DIAGNOSTIC SUPPLIES CORPORATION</span></p>
        <p>Bank: BDO Unibank &bull; Account No: 00-1234-5678-90 &bull; Branch: San Fernando Main</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 text-slate-900">
      {/* Module Title & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-indigo-700" />
            Statement of Account (SOA) Client Aging Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Accounts Receivable Tracking &bull; Highlighted Overdue Balance Matrix &bull; Official A4 Print Output
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
          <button
            onClick={() => onOpenPrintModal('Statement of Account', 'printable-soa-target', soaDocumentContent)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print SOA</span>
          </button>

          <button
            onClick={handleExportData}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export SOA...</span>
          </button>
        </div>
      </div>

      {/* Official SOA Document Preview */}
      {soaDocumentContent}
    </div>
  );
};
