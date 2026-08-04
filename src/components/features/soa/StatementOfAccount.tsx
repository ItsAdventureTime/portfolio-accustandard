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
  const [statementDate, setStatementDate] = useState('10-Jul-26');
  const [clientName, setClientName] = useState('GATCHALIAN MEDICAL LABORATORY');
  const [clientAddress, setClientAddress] = useState('San Fernando, Pampanga');
  const [terms, setTerms] = useState('30 Days');
  const [salesperson, setSalesperson] = useState('Sir. Roel Macaraeg');
  const [preparedBy, setPreparedBy] = useState('Marrione Fuentes');

  const safeRows = [
    {
      salesInvoiceNo: '6087',
      drNo: '6075',
      siDate: '18-Jun-26',
      dueDate: '7/18/2026',
      age: 22,
      invoiceAmount: 16960.0,
      amountPaid: '',
      invoiceBalance: 16960.0,
      runningBalance: 16960.0,
    },
    {
      salesInvoiceNo: '6107',
      drNo: '6097',
      siDate: '26-Jun-26',
      dueDate: '7/26/2026',
      age: 14,
      invoiceAmount: 1968.0,
      amountPaid: '',
      invoiceBalance: 1968.0,
      runningBalance: 18928.0,
    },
    {
      salesInvoiceNo: '6118',
      drNo: '6113',
      siDate: '30-Jun-26',
      dueDate: '7/30/2026',
      age: 10,
      invoiceAmount: 13280.0,
      amountPaid: '',
      invoiceBalance: 13280.0,
      runningBalance: 32208.0,
    },
  ];

  const totalCurrentBalance = 32208.0;

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
      {/* Exact Header matching Screenshot 1 */}
      <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-4 gap-4">
        <div>
          <AccustandardLogo size="lg" />
        </div>

        <div className="text-left sm:text-right text-xs text-slate-700 font-semibold space-y-0.5 leading-snug">
          <p>Unit A G/F El Decano Bldg., Blk 2</p>
          <p>Lot 2 St. Jude, Villa Corazon, San</p>
          <p>Agustin, San Fernando Pampanga</p>
          <p>Email: <a href="mailto:accustandard1024@gmail.com" className="text-blue-700 underline">accustandard1024@gmail.com</a></p>
          <p>Tel and Fax no.: (045) 966-6097</p>
        </div>
      </div>

      {/* Document Title Center */}
      <div className="text-center">
        <h1 className="text-xl font-black uppercase text-slate-900 tracking-wider">
          STATEMENT OF ACCOUNT
        </h1>
      </div>

      {/* Metadata Fields Matching Screenshot 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-xs font-semibold text-slate-900">
        <div className="space-y-1">
          <div className="flex">
            <span className="w-32 font-bold">Statement Date:</span>
            <span className="font-mono">{statementDate}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-bold">Client:</span>
            <span className="font-black text-slate-900 uppercase">{clientName}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-bold">Address:</span>
            <span>{clientAddress}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-bold">Terms:</span>
            <span>{terms}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-bold">Salesperson:</span>
            <span>{salesperson}</span>
          </div>
        </div>
      </div>

      {/* Grid Table Matching Screenshot 1 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse border border-slate-900">
          <thead className="bg-slate-50 text-slate-900 font-black border-b-2 border-slate-900 text-center">
            <tr>
              <th className="p-2 border border-slate-900">Sales Invoice #</th>
              <th className="p-2 border border-slate-900">DR #</th>
              <th className="p-2 border border-slate-900">S.I. Date</th>
              <th className="p-2 border border-slate-900">Due Date</th>
              <th className="p-2 border border-slate-900">AGE</th>
              <th className="p-2 border border-slate-900 text-right">Invoice Amount</th>
              <th className="p-2 border border-slate-900 text-right">Amount Paid</th>
              <th className="p-2 border border-slate-900 text-right">Invoice Balance</th>
              <th className="p-2 border border-slate-900 text-right">Running Balance</th>
            </tr>
          </thead>
          <tbody className="font-semibold text-slate-900">
            {safeRows.map((row) => (
              <tr key={row.salesInvoiceNo} className="text-center font-mono">
                <td className="p-2 border border-slate-900 font-bold">{row.salesInvoiceNo}</td>
                <td className="p-2 border border-slate-900">{row.drNo}</td>
                <td className="p-2 border border-slate-900">{row.siDate}</td>
                <td className="p-2 border border-slate-900">{row.dueDate}</td>
                <td className="p-2 border border-slate-900 font-bold">{row.age}</td>
                <td className="p-2 border border-slate-900 text-right font-bold">
                  {row.invoiceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-2 border border-slate-900 text-right">{row.amountPaid}</td>
                <td className="p-2 border border-slate-900 text-right font-bold">
                  {row.invoiceBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-2 border border-slate-900 text-right font-bold">
                  {row.runningBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Lines Right-Aligned */}
      <div className="flex flex-col items-end space-y-1 text-xs font-bold text-slate-900 pt-2">
        <div className="flex justify-between w-64">
          <span className="italic">AMOUNT DUE</span>
          <span className="font-mono text-red-600">0.00</span>
        </div>
        <div className="flex justify-between w-64">
          <span className="italic">NOT YET DUE</span>
          <span className="font-mono">32,208.00</span>
        </div>
      </div>

      {/* Full-Width Bright Yellow Highlight Bar matching Screenshot 1 */}
      <div className="bg-[#FFFF00] text-slate-900 p-2.5 flex justify-between items-center font-black text-sm border-t border-b border-slate-900">
        <span className="uppercase tracking-wider">Total Current Balance</span>
        <span className="font-mono underline decoration-double text-base">
          32,208.00
        </span>
      </div>

      {/* Prepared By Footer */}
      <div className="pt-6 text-xs text-slate-900 font-semibold space-y-1">
        <p>Prepared By:</p>
        <div className="pt-4">
          <p className="font-bold underline text-sm">{preparedBy}</p>
          <p className="text-slate-600">Accounting Officer</p>
        </div>
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
            Exact Replica of Official Company Template &bull; Highlighted Total Balance &bull; A4 Printable Output
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
