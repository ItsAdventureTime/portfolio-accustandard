'use client';

import React, { useState } from 'react';
import {
  FileCheck,
  Printer,
  Download,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Building2,
} from 'lucide-react';

interface StatementOfAccountProps {
  soaRows: any[];
  onOpenPrintModal: (title: string, elementId: string, content: React.ReactNode) => void;
  onOpenExportModal: (title: string, filename: string, data: object[], elementId?: string) => void;
  onShowNotification: (msg: string) => void;
  onAddAuditLog: (action: string) => void;
}

export const StatementOfAccount: React.FC<StatementOfAccountProps> = ({
  soaRows,
  onOpenPrintModal,
  onOpenExportModal,
  onShowNotification,
  onAddAuditLog,
}) => {
  const [statementDate, setStatementDate] = useState('10-Jul-26');
  const [clientName, setClientName] = useState('GATCHALIAN MEDICAL LABORATORY');
  const [terms, setTerms] = useState('30 Days');
  const [salesperson, setSalesperson] = useState('Sir. Roel Macaraeg');
  const [preparedBy, setPreparedBy] = useState('Marrione Fuentes, Accounting Officer');

  const totalInvoiceAmount = soaRows.reduce((acc, r) => acc + r.invoiceAmount, 0);
  const totalBalance = soaRows.reduce((acc, r) => acc + r.invoiceBalance, 0);

  const handleExportData = () => {
    onOpenExportModal(
      `Statement of Account - ${clientName}`,
      `soa_${clientName.toLowerCase().replace(/\s+/g, '_')}`,
      soaRows,
      'printable-soa-target'
    );
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-purple-600" />
            Statement of Account (SOA) &amp; Client Aging
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Accounts Receivable Ledger &bull; DR &amp; Sales Invoice Matching &bull; Pampanga Office
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={handleExportData}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export SOA...</span>
          </button>
        </div>
      </div>

      {/* Summary Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Target Client</span>
          <p className="text-sm font-black text-blue-900 truncate">{clientName}</p>
          <p className="text-[11px] text-slate-500 font-medium">Terms: {terms} &bull; Rep: {salesperson}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Invoiced Amount</span>
          <p className="text-lg font-black text-slate-900 font-mono">
            ₱{totalInvoiceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">{soaRows.length} Active Sales Invoices</p>
        </div>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 shadow-sm space-y-1 text-amber-950">
          <span className="text-xs font-bold text-amber-800 uppercase block">Total Current Balance Due</span>
          <p className="text-xl font-black text-amber-900 font-mono">
            ₱{totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-amber-800 font-bold">Outstanding Client Receivable</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
            Sales Invoice &amp; DR Receivables Breakdown
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500">Statement Date: {statementDate}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3">Sales Invoice #</th>
                <th className="p-3">DR #</th>
                <th className="p-3">S.I. Date</th>
                <th className="p-3">Due Date</th>
                <th className="p-3 text-center">AGE (Days)</th>
                <th className="p-3 text-right">Invoice Amount</th>
                <th className="p-3 text-right">Amount Paid</th>
                <th className="p-3 text-right">Invoice Balance</th>
                <th className="p-3 text-right">Running Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {soaRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-mono font-bold text-blue-900 whitespace-nowrap">#{row.salesInvoiceNo}</td>
                  <td className="p-3 font-mono text-slate-700 whitespace-nowrap">#{row.drNo}</td>
                  <td className="p-3 whitespace-nowrap">{row.siDate}</td>
                  <td className="p-3 whitespace-nowrap">{row.dueDate}</td>
                  <td className="p-3 text-center whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 font-mono font-bold text-slate-800 text-[10px]">
                      {row.ageDays}d
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-semibold whitespace-nowrap">
                    ₱{row.invoiceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-right font-mono text-emerald-700 font-semibold whitespace-nowrap">
                    ₱{row.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    ₱{row.invoiceBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-right font-mono font-black text-blue-950 whitespace-nowrap">
                    ₱{row.runningBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Document Preview (Matching photo_2026-08-01_23-55-13.jpg) */}
      <div className="bg-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-300 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-purple-700" />
            Official Statement of Account Document Preview (A4 Formatted)
          </span>

          <button
            onClick={() =>
              onOpenPrintModal(
                `Official SOA - ${clientName}`,
                'printable-soa-doc',
                <div id="printable-soa-doc" className="p-8 bg-white max-w-2xl mx-auto space-y-6 text-slate-900 font-sans border border-slate-200 shadow-lg rounded-xl">
                  {/* Official Header */}
                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                    <div>
                      <div className="flex items-center gap-1 text-xl font-black tracking-tight">
                        <span className="text-blue-900">ACCUSTANDARD</span>
                        <span className="text-red-600 font-serif">RxD</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                        Medical and Diagnostic Supplies Corporation
                      </p>
                    </div>

                    <div className="text-right text-[10px] text-slate-600 space-y-0.5 font-medium">
                      <p>Unit A G/F El Decano Bldg., Blk 2 Lot 2</p>
                      <p>St. Jude, Villa Corazon, San Agustin</p>
                      <p>San Fernando, Pampanga</p>
                      <p>Email: accustandard1024@gmail.com</p>
                      <p>Tel/Fax: (045) 966-6097</p>
                    </div>
                  </div>

                  {/* Document Title */}
                  <div className="text-center">
                    <h2 className="text-base font-black uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 inline-block">
                      STATEMENT OF ACCOUNT
                    </h2>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                    <div className="space-y-1">
                      <p><strong className="text-slate-900">Statement Date:</strong> {statementDate}</p>
                      <p><strong className="text-slate-900">Client:</strong> {clientName}</p>
                    </div>
                    <div className="space-y-1">
                      <p><strong className="text-slate-900">Terms:</strong> {terms}</p>
                      <p><strong className="text-slate-900">Salesperson:</strong> {salesperson}</p>
                    </div>
                  </div>

                  {/* SOA Table */}
                  <table className="w-full text-xs text-left border-collapse border border-slate-300">
                    <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px] border-b border-slate-300">
                      <tr>
                        <th className="p-2 border-r border-slate-300">Sales Invoice #</th>
                        <th className="p-2 border-r border-slate-300">DR #</th>
                        <th className="p-2 border-r border-slate-300">S.I. Date</th>
                        <th className="p-2 border-r border-slate-300">Due Date</th>
                        <th className="p-2 border-r border-slate-300 text-center">AGE</th>
                        <th className="p-2 border-r border-slate-300 text-right">Invoice Amount</th>
                        <th className="p-2 border-r border-slate-300 text-right">Amount Paid</th>
                        <th className="p-2 border-r border-slate-300 text-right">Invoice Balance</th>
                        <th className="p-2 text-right">Running Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300 font-medium text-slate-800">
                      {soaRows.map((row) => (
                        <tr key={row.id}>
                          <td className="p-2 border-r border-slate-300 font-mono font-bold text-center">{row.salesInvoiceNo}</td>
                          <td className="p-2 border-r border-slate-300 font-mono text-center">{row.drNo}</td>
                          <td className="p-2 border-r border-slate-300">{row.siDate}</td>
                          <td className="p-2 border-r border-slate-300">{row.dueDate}</td>
                          <td className="p-2 border-r border-slate-300 text-center font-bold">{row.ageDays}</td>
                          <td className="p-2 border-r border-slate-300 text-right font-mono">
                            {row.invoiceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-2 border-r border-slate-300 text-right font-mono">
                            {row.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-2 border-r border-slate-300 text-right font-mono font-bold">
                            {row.invoiceBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-2 text-right font-mono font-bold">
                            {row.runningBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Yellow Highlighted Balance Bar (Matching photo_2026-08-01_23-55-13.jpg) */}
                  <div className="pt-2 text-right text-xs space-y-1">
                    <p><span className="text-slate-600 font-bold">AMOUNT DUE:</span> <span className="font-mono text-red-600 font-bold">0.00</span></p>
                    <p><span className="text-slate-600 font-bold italic">NOT YET DUE:</span> <span className="font-mono text-slate-900 font-bold">{totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></p>
                    <div className="p-2 bg-yellow-300 border-t border-b border-slate-900 flex justify-between items-center font-black">
                      <span>Total Current Balance</span>
                      <span className="font-mono text-sm underline decoration-double">₱{totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Prepared By Sign-off */}
                  <div className="pt-6 text-xs space-y-1 font-medium">
                    <p className="text-slate-500">Prepared By:</p>
                    <p className="font-bold underline text-slate-900 pt-2">{preparedBy}</p>
                  </div>
                </div>
              )
            }
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official A4 SOA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
