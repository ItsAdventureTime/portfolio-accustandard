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
  onAllocateCollection?: (checkNo: string, bank: string, checkAmount: number, allocations: { invoiceNo: string; amount: number }[]) => void;
}

export const StatementOfAccount: React.FC<StatementOfAccountProps> = ({
  soaRows = [],
  collectionsList = [],
  onOpenPrintModal,
  onOpenExportModal,
  onShowNotification,
  onAddAuditLog,
  onAllocateCollection,
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

  const totalAllocated = Number(allocatedSi6087) + Number(allocatedSi6107);
  const unappliedCredit = Math.max(0, checkAmount - totalAllocated);

  const safeFallbackRows = [
    {
      salesInvoiceNo: 'SI-6087',
      drNo: 'DR-6075',
      siDate: '18-Jun-26',
      dueDate: '7/18/2026',
      ageDays: 47,
      invoiceAmount: 16960.0,
      amountPaid: 0.0,
      invoiceBalance: 16960.0,
      runningBalance: 16960.0,
    },
    {
      salesInvoiceNo: 'SI-6107',
      drNo: 'DR-6097',
      siDate: '26-Jun-26',
      dueDate: '7/26/2026',
      ageDays: 39,
      invoiceAmount: 1968.0,
      amountPaid: 0.0,
      invoiceBalance: 1968.0,
      runningBalance: 18928.0,
    },
    {
      salesInvoiceNo: 'SI-6118',
      drNo: 'DR-6113',
      siDate: '30-Jun-26',
      dueDate: '7/30/2026',
      ageDays: 35,
      invoiceAmount: 13280.0,
      amountPaid: 0.0,
      invoiceBalance: 13280.0,
      runningBalance: 32208.0,
    },
  ];

  const activeRows = soaRows && soaRows.length > 0 ? soaRows : safeFallbackRows;

  // Dynamic balance calculations
  const totalCurrentBalance = activeRows.reduce((sum, r) => sum + (Number(r.invoiceBalance) || 0), 0);
  const totalAmountDue = activeRows
    .filter((r) => (Number(r.age) || Number(r.ageDays) || 0) > 30)
    .reduce((sum, r) => sum + (Number(r.invoiceBalance) || 0), 0);
  const totalNotYetDue = activeRows
    .filter((r) => (Number(r.age) || Number(r.ageDays) || 0) <= 30)
    .reduce((sum, r) => sum + (Number(r.invoiceBalance) || 0), 0);

  const handleExportData = () => {
    onOpenExportModal('Statement of Account Ledger', 'accustandard_soa_ledger', activeRows, 'printable-soa-target');
  };

  const handleAllocateCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const allocations = [
      { invoiceNo: 'SI-6087', amount: Number(allocatedSi6087) },
      { invoiceNo: 'SI-6107', amount: Number(allocatedSi6107) },
    ];

    if (onAllocateCollection) {
      onAllocateCollection(checkNo, bank, checkAmount, allocations);
    }

    onShowNotification(
      `Allocated Check #${checkNo} (₱${checkAmount.toLocaleString()}) across Invoices SI-6087 and SI-6107!`
    );
    onAddAuditLog(
      `Allocated Multi-SOA Check #${checkNo} amount ₱${checkAmount.toLocaleString()} (Unapplied Credit: ₱${unappliedCredit.toLocaleString()})`
    );
    setIsCollectionModalOpen(false);
  };

  const soaDocumentContent = (
    <div id="printable-soa-target" className="print-page w-[760px] min-w-[760px] mx-auto bg-white p-8 border border-gray-200 shadow-md text-gray-900 text-xs font-sans shrink-0">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-red-600 pb-4 mb-6">
        <div>
          <AccustandardLogo size="lg" />
        </div>
        <div className="text-right text-xs text-gray-700 leading-tight">
          <p>Unit A G/F El Decano Bldg., Blk 2 Lot 2</p>
          <p>St. Jude, Villa Corazon, San Agustin,</p>
          <p>City of San Fernando, 2000, Pampanga</p>
          <p className="font-semibold text-gray-900 mt-1">VAT Reg. TIN: 009-847-380-000</p>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-black uppercase text-blue-950 tracking-wider">STATEMENT OF ACCOUNT</h2>
        <p className="text-xs text-gray-500 font-bold">As of {statementDate}</p>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 border border-gray-300 p-3 bg-gray-50 font-semibold leading-relaxed">
        <div>
          <p><span className="text-gray-500 uppercase text-[10px] block">CLIENT / BILL TO:</span> <span className="font-bold text-gray-900 text-sm">{clientName}</span></p>
          <p className="text-gray-600 font-medium">{clientAddress}</p>
          <p className="mt-1"><span className="text-gray-500 uppercase text-[10px] block">TERMS OF PAYMENT:</span> {terms}</p>
        </div>
        <div className="text-right">
          <p><span className="text-gray-500 uppercase text-[10px] block">STATEMENT DATE:</span> {statementDate}</p>
          <p className="mt-1"><span className="text-gray-500 uppercase text-[10px] block">SALES REPRESENTATIVE:</span> {salesperson}</p>
        </div>
      </div>

      {/* Table */}
      <div className="mb-6">
        <table className="w-full border-collapse border border-gray-900">
          <thead>
            <tr className="bg-blue-900 text-white font-bold text-[10px] uppercase text-center">
              <th className="border border-gray-900 py-2 px-2">SI No.</th>
              <th className="border border-gray-900 py-2 px-2">DR No.</th>
              <th className="border border-gray-900 py-2 px-2">SI Date</th>
              <th className="border border-gray-900 py-2 px-2">Due Date</th>
              <th className="border border-gray-900 py-2 px-2">Age</th>
              <th className="border border-gray-900 py-2 px-2">SI Amount</th>
              <th className="border border-gray-900 py-2 px-2">Amount Paid</th>
              <th className="border border-gray-900 py-2 px-2">SI Balance</th>
              <th className="border border-gray-900 py-2 px-2">Running Balance</th>
            </tr>
          </thead>
          <tbody>
            {activeRows.map((row, idx) => (
              <tr key={idx} className="text-center font-medium border-b border-gray-300 hover:bg-blue-50/60 transition cursor-pointer">
                <td className="border border-gray-900 py-1.5 px-2">{row.salesInvoiceNo}</td>
                <td className="border border-gray-900 py-1.5 px-2">{row.drNo}</td>
                <td className="border border-gray-900 py-1.5 px-2">{row.siDate}</td>
                <td className="border border-gray-900 py-1.5 px-2">{row.dueDate}</td>
                <td className="border border-gray-900 py-1.5 px-2 font-bold">{row.age || row.ageDays}</td>
                <td className="border border-gray-900 py-1.5 px-2 text-right font-semibold">
                  {Number(row.invoiceAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </td>
                <td className="border border-gray-900 py-1.5 px-2 text-right">
                  {row.amountPaid ? Number(row.amountPaid).toLocaleString('en-PH', { minimumFractionDigits: 2 }) : ''}
                </td>
                <td className="border border-gray-900 py-1.5 px-2 text-right font-semibold">
                  {Number(row.invoiceBalance).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </td>
                <td className="border border-gray-900 py-1.5 px-2 text-right font-semibold">
                  {Number(row.runningBalance).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end mb-8 text-xs">
        <div className="w-80 space-y-1">
          <div className="flex justify-between items-center py-0.5">
            <span className="font-bold uppercase text-gray-800">AMOUNT DUE (&gt;30 DAYS)</span>
            <span className={`font-bold ${totalAmountDue > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              ₱{totalAmountDue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5 italic">
            <span className="font-semibold text-gray-700">NOT YET DUE (&le;30 DAYS)</span>
            <span className="font-semibold text-gray-900">
              ₱{totalNotYetDue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 px-2 bg-yellow-300 border-y border-gray-900 font-extrabold text-sm">
            <span>Total Current Balance</span>
            <span className="border-b-4 border-double border-gray-900 font-mono">
              ₱{totalCurrentBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Signatory */}
      <div className="mt-8">
        <p className="text-xs text-gray-700 mb-6">Prepared By:</p>
        <div className="border-b border-gray-800 w-48 mb-1">
          <p className="font-bold text-gray-900">{preparedBy}</p>
        </div>
        <p className="text-xs text-gray-600">Accounting / Credit &amp; Collection Officer</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 w-full">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-blue-900" />
            Statement of Account (SOA) &amp; Client Collections
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Client aging ledger, payment check allocation, and official statement generator
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setIsCollectionModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4 text-blue-200" />
            <span>+ Allocate Multi-SOA Check</span>
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

      {/* Live Rendered SOA Document Preview Container */}
      <div className="bg-slate-100/90 p-2.5 sm:p-6 rounded-3xl border border-slate-300 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
          <span className="uppercase tracking-wider font-extrabold text-[11px] text-slate-700">Official Printable SOA Document Preview</span>
          <span className="block sm:hidden text-blue-900 font-extrabold text-[10px] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
            &larr; Pinch to zoom / Swipe document &rarr;
          </span>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-white p-2 sm:p-4 shadow-sm flex justify-start sm:justify-center">
          {soaDocumentContent}
        </div>
      </div>

      {/* Multi-SOA Check Allocation Modal */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200 text-slate-900">
          <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl w-full max-w-3xl overflow-hidden p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-900 text-white rounded-2xl shadow-sm">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wider">Multi-SOA Collection Payment Allocation</h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">Allocate a single check payment across multiple open client invoices</p>
                </div>
              </div>
              <button
                onClick={() => setIsCollectionModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAllocateCheck} className="space-y-5 text-sm font-semibold">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs sm:text-sm text-blue-950 font-bold flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-blue-700 shrink-0" />
                <span>Multi-SOA Check Allocation: Deducts payment against selected invoice balances and calculates unapplied customer credit in real-time.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-300/80">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs uppercase tracking-wider">Check Number *</label>
                  <input
                    type="text"
                    value={checkNo}
                    onChange={(e) => setCheckNo(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl font-mono font-black text-sm sm:text-base text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs uppercase tracking-wider">Issuing Bank *</label>
                  <input
                    type="text"
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl font-black text-sm sm:text-base text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs uppercase tracking-wider">Check Amount (₱) *</label>
                  <input
                    type="number"
                    value={checkAmount}
                    onChange={(e) => setCheckAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl font-mono font-black text-base sm:text-lg text-blue-950 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Invoice Allocation Breakdown</h4>
                <div className="p-4 bg-white border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div>
                    <p className="font-black text-slate-900 text-sm sm:text-base">SI-6087 (Gatchalian Medical Lab)</p>
                    <p className="text-slate-600 text-xs font-bold mt-0.5">Invoice Balance: <span className="font-mono text-slate-900 font-extrabold">₱16,960.00</span></p>
                  </div>
                  <div className="w-full sm:w-44">
                    <label className="block text-xs text-slate-500 font-extrabold mb-1 uppercase tracking-wider">Allocated (₱)</label>
                    <input
                      type="number"
                      value={allocatedSi6087}
                      onChange={(e) => setAllocatedSi6087(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-right font-mono font-black text-sm sm:text-base text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="p-4 bg-white border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div>
                    <p className="font-black text-slate-900 text-sm sm:text-base">SI-6107 (Gatchalian Medical Lab)</p>
                    <p className="text-slate-600 text-xs font-bold mt-0.5">Invoice Balance: <span className="font-mono text-slate-900 font-extrabold">₱1,968.00</span></p>
                  </div>
                  <div className="w-full sm:w-44">
                    <label className="block text-xs text-slate-500 font-extrabold mb-1 uppercase tracking-wider">Allocated (₱)</label>
                    <input
                      type="number"
                      value={allocatedSi6107}
                      onChange={(e) => setAllocatedSi6107(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-right font-mono font-black text-sm sm:text-base text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Dark Summary Value Card matching Screenshot 1 */}
              <div className="p-4 sm:p-5 bg-slate-900 text-white rounded-2xl flex justify-between items-center font-bold shadow-md">
                <div>
                  <p className="text-slate-300 text-xs sm:text-sm uppercase tracking-wider font-extrabold">Unapplied Customer Credit:</p>
                  <p className="text-xs text-slate-400 font-semibold">Excess payment credited for future billing</p>
                </div>
                <span className="font-mono text-xl sm:text-2xl font-black text-emerald-400">
                  ₱{unappliedCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-slate-200 gap-3">
                <button
                  type="button"
                  onClick={() => setIsCollectionModalOpen(false)}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-2xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-black text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Confirm &amp; Apply Check</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
