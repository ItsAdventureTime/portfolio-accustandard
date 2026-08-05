'use client';

import React, { useState } from 'react';
import {
  FileCheck,
  Printer,
  Download,
  Building2,
  Calendar,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  Plus,
  ArrowRight,
} from 'lucide-react';

import { AccustandardLogo } from '@/components/brand/AccustandardLogo';

interface StatementOfAccountProps {
  soaRows: any[];
  collectionsList?: any[];
  onOpenPrintModal: (title: string, elementId: string, content: React.ReactNode) => void;
  onOpenExportModal: (title: string, filename: string, data: object[], elementId?: string) => void;
  onShowNotification: (msg: string) => void;
  onAddAuditLog: (action: string) => void;
}

export const StatementOfAccount: React.FC<StatementOfAccountProps> = ({
  soaRows = [],
  collectionsList = [],
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

  // Multi-SOA Collection Modal state
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [checkNo, setCheckNo] = useState('CHK-BDO-99201');
  const [bank, setBank] = useState('BDO Unibank');
  const [checkAmount, setCheckAmount] = useState(25000);
  const [allocatedSi6087, setAllocatedSi6087] = useState(16960);
  const [allocatedSi6107, setAllocatedSi6107] = useState(1968);

  const totalAllocated = allocatedSi6087 + allocatedSi6107;
  const unappliedCredit = Math.max(0, checkAmount - totalAllocated);

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

  const handleExportData = () => {
    onOpenExportModal(
      'Statement of Account',
      'statement_of_account',
      safeRows,
      'printable-soa-target'
    );
  };

  const handlePostCollection = (e: React.FormEvent) => {
    e.preventDefault();
    onShowNotification(`Collection Check ${checkNo} (₱${checkAmount.toLocaleString()}) posted across SOAs SI-6087 & SI-6107`);
    onAddAuditLog(`Allocated Collection ${checkNo} for ${clientName}`);
    setIsCollectionModalOpen(false);
  };

  const soaDocumentContent = (
    <div id="printable-soa-target" className="bg-white p-8 sm:p-10 text-slate-900 font-sans max-w-4xl mx-auto border border-slate-300 shadow-md rounded-xl space-y-6">
      {/* Header */}
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

      {/* Metadata Fields */}
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

      {/* Grid Table */}
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

      {/* Highlight Bar */}
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-indigo-700" />
            Statement of Account (SOA) &amp; Multi-SOA Collection Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Exact Replica of Official Template &bull; Multi-SOA Payment Check Allocation &bull; A4 Printable Output
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
          <button
            onClick={() => setIsCollectionModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <CreditCard className="w-4 h-4 text-emerald-300" />
            <span>+ Allocate Multi-SOA Collection Check</span>
          </button>

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

      {/* Document Preview */}
      {soaDocumentContent}

      {/* Multi-SOA Collection Allocation Modal */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-700" />
                Allocate Multi-SOA Collection Payment (Blueprint 5.5)
              </h3>
              <button
                onClick={() => setIsCollectionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostCollection} className="p-6 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Check / Reference #</label>
                <input
                  type="text"
                  value={checkNo}
                  onChange={(e) => setCheckNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Issuing Bank</label>
                  <input
                    type="text"
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Check Amount (₱)</label>
                  <input
                    type="number"
                    value={checkAmount}
                    onChange={(e) => setCheckAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-3">
                <p className="font-bold text-slate-900 uppercase">Allocate Payment Across Invoices:</p>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span>SI-6087 (Bal: ₱16,960.00)</span>
                  <input
                    type="number"
                    value={allocatedSi6087}
                    onChange={(e) => setAllocatedSi6087(Number(e.target.value))}
                    className="w-28 bg-white border border-slate-300 rounded p-1 text-right font-mono font-bold text-slate-900"
                  />
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span>SI-6107 (Bal: ₱1,968.00)</span>
                  <input
                    type="number"
                    value={allocatedSi6107}
                    onChange={(e) => setAllocatedSi6107(Number(e.target.value))}
                    className="w-28 bg-white border border-slate-300 rounded p-1 text-right font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Total Allocated:</span>
                  <span className="font-mono">₱{totalAllocated.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unapplied Customer Credit:</span>
                  <span className="font-mono font-bold text-emerald-700">₱{unappliedCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCollectionModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm"
                >
                  Post Multi-SOA Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
