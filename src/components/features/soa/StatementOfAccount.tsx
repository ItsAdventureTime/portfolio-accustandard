'use client';

import React, { useState } from 'react';
import {
  FileCheck,
  Printer,
  Download,
  Building2,
  CreditCard,
  CheckCircle2,
  Plus,
  Trash2,
  Edit,
  X,
  UserCheck,
  ChevronDown,
} from 'lucide-react';

import { AccustandardLogo } from '@/components/brand/AccustandardLogo';
import { WorkflowStepper } from '@/components/common/WorkflowStepper';
import { AccessibleModal } from '@/components/common/AccessibleModal';
import type { NotificationInput } from '@/components/common/NotificationCenter';

interface StatementOfAccountProps {
  soaRows: any[];
  dataState?: 'loading' | 'live' | 'offline';
  onUpdateSoaRows?: (newRows: any[]) => void;
  collectionsList?: any[];
  onOpenPrintModal: (title: string, elementId: string, content: React.ReactNode) => void;
  onOpenExportModal: (title: string, filename: string, data: object[], elementId?: string) => void;
  onShowNotification: (notification: NotificationInput) => void;
  onAddAuditLog: (action: string) => void;
  onAllocateCollection?: (checkNo: string, bank: string, checkAmount: number, allocations: { invoiceNo: string; amount: number }[]) => void | Promise<boolean | void>;
}

export const StatementOfAccount: React.FC<StatementOfAccountProps> = ({
  soaRows = [],
  dataState = 'loading',
  onUpdateSoaRows,
  collectionsList = [],
  onOpenPrintModal,
  onOpenExportModal,
  onShowNotification,
  onAddAuditLog,
  onAllocateCollection,
}) => {
  const clientOptions = [
    {
      id: 'client-1',
      name: 'GATCHALIAN MEDICAL LABORATORY',
      address: 'San Fernando, Pampanga',
      terms: '30 Days',
      salesperson: 'Sir. Roel Macaraeg',
      preparedBy: 'Marrione Fuentes',
    },
    {
      id: 'client-2',
      name: 'ALLIED CARE EXPERTS (ACE) MEDICAL CENTER',
      address: 'Baliuag, Bulacan',
      terms: '45 Days',
      salesperson: 'Katherine Payumo',
      preparedBy: 'Aila Santos',
    },
    {
      id: 'client-3',
      name: 'PAMPANGA REGIONAL HOSPITAL',
      address: 'City of San Fernando, Pampanga',
      terms: '30 Days',
      salesperson: 'Roel Macaraeg',
      preparedBy: 'Marrione Fuentes',
    },
    {
      id: 'client-4',
      name: 'QUEZON CITY DIAGNOSTIC CENTER',
      address: 'Diliman, Quezon City',
      terms: '60 Days',
      salesperson: 'Mark Santos',
      preparedBy: 'Aila Santos',
    },
  ];

  const [selectedClientId, setSelectedClientId] = useState('client-1');
  const activeClient = clientOptions.find((c) => c.id === selectedClientId) || clientOptions[0];

  const [statementDate, setStatementDate] = useState('10-Jul-26');

  // Offline fallback rows are only shown when the page explicitly reports
  // that its read request could not be served.
  const safeFallbackRows = [
    {
      id: 'soa-row-1',
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
      id: 'soa-row-2',
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
      id: 'soa-row-3',
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

  const activeRows = dataState === 'offline' ? (soaRows.length > 0 ? soaRows : safeFallbackRows) : soaRows;

  // Recalculate running balances dynamically
  const recomputeRunningBalances = (rows: any[]) => {
    let cumBalance = 0;
    return rows.map((r) => {
      const invAmount = Number(r.invoiceAmount) || 0;
      const amtPaid = Number(r.amountPaid) || 0;
      const invBalance = Math.max(0, invAmount - amtPaid);
      cumBalance += invBalance;
      return {
        ...r,
        invoiceAmount: invAmount,
        amountPaid: amtPaid,
        invoiceBalance: invBalance,
        runningBalance: cumBalance,
      };
    });
  };

  const computedRows = recomputeRunningBalances(activeRows);

  // Dynamic balance summary calculations
  const totalCurrentBalance = computedRows.reduce((sum, r) => sum + r.invoiceBalance, 0);
  const totalAmountDue = computedRows
    .filter((r) => (Number(r.age) || Number(r.ageDays) || 0) > 30)
    .reduce((sum, r) => sum + r.invoiceBalance, 0);
  const totalNotYetDue = computedRows
    .filter((r) => (Number(r.age) || Number(r.ageDays) || 0) <= 30)
    .reduce((sum, r) => sum + r.invoiceBalance, 0);

  // Multi-SOA Collection Modal state
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [checkNo, setCheckNo] = useState('');
  const [bank, setBank] = useState('');
  const [checkAmount, setCheckAmount] = useState(0);
  const [allocationAmounts, setAllocationAmounts] = useState<Record<string, number>>({});
  const allocationTargets = computedRows.filter((row) => Number(row.invoiceBalance) > 0);
  const totalAllocated = allocationTargets.reduce(
    (sum, row) => sum + (allocationAmounts[row.id || row.salesInvoiceNo] || 0),
    0,
  );
  const unappliedCredit = Math.max(0, checkAmount - totalAllocated);

  // Add Invoice Modal State
  const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] = useState(false);
  const [newSiNo, setNewSiNo] = useState('');
  const [newDrNo, setNewDrNo] = useState('');
  const [newSiDate, setNewSiDate] = useState('10-Jul-26');
  const [newDueDate, setNewDueDate] = useState('8/10/2026');
  const [newAgeDays, setNewAgeDays] = useState(31);
  const [newInvoiceAmount, setNewInvoiceAmount] = useState(15000);
  const [newAmountPaid, setNewAmountPaid] = useState(0);
  const [invoiceValidationError, setInvoiceValidationError] = useState<string | null>(null);

  // Edit Invoice Modal State
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [editingValidationError, setEditingValidationError] = useState<string | null>(null);
  const [allocationValidationError, setAllocationValidationError] = useState<string | null>(null);

  // Add Invoice Handler
  const handleAddInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiNo.trim() || !newDrNo.trim() || newInvoiceAmount < 0 || newAmountPaid < 0) {
      setInvoiceValidationError('Enter the sales invoice number, delivery receipt number, and non-negative amounts.');
      return;
    }
    setInvoiceValidationError(null);

    const invAmount = Number(newInvoiceAmount) || 0;
    const amtPaid = Number(newAmountPaid) || 0;
    const invBalance = Math.max(0, invAmount - amtPaid);

    const newRow = {
      id: `soa-row-${Date.now()}`,
      salesInvoiceNo: newSiNo.toUpperCase(),
      drNo: newDrNo.toUpperCase(),
      siDate: newSiDate,
      dueDate: newDueDate,
      ageDays: Number(newAgeDays) || 30,
      invoiceAmount: invAmount,
      amountPaid: amtPaid,
      invoiceBalance: invBalance,
      runningBalance: 0,
    };

    const updated = recomputeRunningBalances([...computedRows, newRow]);
    if (onUpdateSoaRows) {
      onUpdateSoaRows(updated);
    }
    onShowNotification({ severity: 'info', title: 'Preview only', message: `Invoice ${newSiNo} was added to the local ${activeClient.name} SOA view.` });
    onAddAuditLog(`Demo-only preview of adding Invoice ${newSiNo} to SOA ledger (${activeClient.name})`);

    setNewSiNo('');
    setNewDrNo('');
    setIsAddInvoiceModalOpen(false);
  };

  // Delete Invoice Handler
  const handleDeleteRow = (id: string, siNo: string) => {
    const filtered = computedRows.filter((r) => r.id !== id && r.salesInvoiceNo !== id);
    const updated = recomputeRunningBalances(filtered);
    if (onUpdateSoaRows) {
      onUpdateSoaRows(updated);
    }
    onShowNotification({ severity: 'info', title: 'Preview only', message: `Invoice ${siNo} was removed from the local SOA view.` });
    onAddAuditLog(`Demo-only preview of removing Invoice ${siNo} from SOA ledger`);
  };

  // Edit Invoice Handler
  const handleEditRowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;
    if (!editingRow.salesInvoiceNo?.trim() || !editingRow.drNo?.trim() || Number(editingRow.invoiceAmount) < 0 || Number(editingRow.amountPaid) < 0) {
      setEditingValidationError('Enter the invoice and delivery receipt numbers with non-negative amounts.');
      return;
    }
    setEditingValidationError(null);

    const updatedRows = computedRows.map((r) => {
      if (r.id === editingRow.id || r.salesInvoiceNo === editingRow.salesInvoiceNo) {
        return editingRow;
      }
      return r;
    });

    const updated = recomputeRunningBalances(updatedRows);
    if (onUpdateSoaRows) {
      onUpdateSoaRows(updated);
    }
    onShowNotification({ severity: 'info', title: 'Preview only', message: `Invoice ${editingRow.salesInvoiceNo} changes were not persisted.` });
    onAddAuditLog(`Demo-only preview of updating Invoice ${editingRow.salesInvoiceNo} in SOA ledger`);
    setEditingRow(null);
  };

  const handleExportData = () => {
    onOpenExportModal('Statement of Account Ledger', 'accustandard_soa_ledger', computedRows, 'printable-soa-target');
  };

  const handleAllocateCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkNo.trim() || !bank.trim() || checkAmount <= 0 || allocationTargets.length === 0) {
      setAllocationValidationError('Enter the check number, issuing bank, and a positive amount. At least one open invoice is required.');
      return;
    }
    const allocations = [
      ...allocationTargets.map((row) => ({
        invoiceNo: row.salesInvoiceNo,
        amount: allocationAmounts[row.id || row.salesInvoiceNo] || 0,
      })),
    ].filter((allocation) => allocation.amount > 0);
    if (totalAllocated > checkAmount) {
      setAllocationValidationError('Allocated amounts cannot exceed the check amount.');
      return;
    }
    setAllocationValidationError(null);

    if (onAllocateCollection) {
      const committed = await onAllocateCollection(checkNo, bank, checkAmount, allocations);
      if (committed === false) return;
    } else {
      onShowNotification({ severity: 'info', title: 'Preview only', message: `Check #${checkNo} was not persisted or queued for ${allocations.map((allocation) => allocation.invoiceNo).join(', ')}.` });
      onAddAuditLog(
        `Allocated Multi-SOA Check #${checkNo} amount ₱${checkAmount.toLocaleString()} (Unapplied Credit: ₱${unappliedCredit.toLocaleString()})`
      );
    }
    setIsCollectionModalOpen(false);
  };

  const soaDocumentContent = (
    <div id="printable-soa-target" className="print-page w-[760px] min-w-[760px] mx-auto bg-white p-8 border border-gray-200 shadow-md text-gray-900 text-xs font-sans shrink-0" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-red-600 pb-4 mb-6" style={{ borderBottom: '2px solid #dc2626' }}>
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
        <h2 className="text-xl font-black uppercase tracking-wider" style={{ color: '#1e3a8a' }}>STATEMENT OF ACCOUNT</h2>
        <p className="text-xs text-gray-500 font-bold">As of {statementDate}</p>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-3 font-semibold leading-relaxed" style={{ border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }}>
        <div>
          <p><span className="text-gray-500 uppercase text-[10px] block font-bold">CLIENT / BILL TO:</span> <span className="font-bold text-gray-900 text-sm">{activeClient.name}</span></p>
          <p className="text-gray-600 font-medium">{activeClient.address}</p>
          <p className="mt-1"><span className="text-gray-500 uppercase text-[10px] block font-bold">TERMS OF PAYMENT:</span> {activeClient.terms}</p>
        </div>
        <div className="text-right">
          <p><span className="text-gray-500 uppercase text-[10px] block font-bold">STATEMENT DATE:</span> {statementDate}</p>
          <p className="mt-1"><span className="text-gray-500 uppercase text-[10px] block font-bold">SALES REPRESENTATIVE:</span> {activeClient.salesperson}</p>
        </div>
      </div>

      {/* Official printable table: keep controlled document columns unchanged. */}
      <div className="mb-6">
        <table className="w-full border-collapse" style={{ border: '1px solid #1e293b', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e3a8a', color: '#ffffff', fontWeight: 'bold', fontSize: '10px', textAlign: 'center' }}>
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>SI No.</th>
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>DR No.</th>
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>SI Date</th>
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>Due Date</th>
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>Age</th>
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>SI Amount</th>
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>Amount Paid</th>
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>SI Balance</th>
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>Running Balance</th>
              <th className="no-print" style={{ border: '1px solid #1e293b', padding: '4px', backgroundColor: '#1e3a8a', color: '#ffffff', width: '60px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {computedRows.map((row, idx) => (
              <tr key={row.id || idx} className="text-center font-medium hover:bg-blue-50/60 transition">
                <td style={{ border: '1px solid #1e293b', padding: '6px' }}>{row.salesInvoiceNo}</td>
                <td style={{ border: '1px solid #1e293b', padding: '6px' }}>{row.drNo}</td>
                <td style={{ border: '1px solid #1e293b', padding: '6px' }}>{row.siDate}</td>
                <td style={{ border: '1px solid #1e293b', padding: '6px' }}>{row.dueDate}</td>
                <td style={{ border: '1px solid #1e293b', padding: '6px', fontWeight: 'bold' }}>{row.age || row.ageDays}</td>
                <td style={{ border: '1px solid #1e293b', padding: '6px', textAlign: 'right', fontWeight: '600' }}>₱{Number(row.invoiceAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td style={{ border: '1px solid #1e293b', padding: '6px', textAlign: 'right' }}>{row.amountPaid ? `₱${Number(row.amountPaid).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : '-'}</td>
                <td style={{ border: '1px solid #1e293b', padding: '6px', textAlign: 'right', fontWeight: '600' }}>₱{Number(row.invoiceBalance).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td style={{ border: '1px solid #1e293b', padding: '6px', textAlign: 'right', fontWeight: '600' }}>₱{Number(row.runningBalance).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td className="no-print" style={{ border: '1px solid #1e293b', padding: '4px', textAlign: 'center' }}>
                  <div className="flex items-center justify-center gap-1">
                    <button type="button" onClick={() => setEditingRow({ ...row })} className="p-1 rounded text-blue-700 hover:bg-blue-100 transition cursor-pointer" title="Edit Invoice Entry"><Edit className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => handleDeleteRow(row.id || row.salesInvoiceNo, row.salesInvoiceNo)} className="p-1 rounded text-red-600 hover:bg-red-100 transition cursor-pointer" title="Delete Invoice Row"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
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
            <span className={`font-bold ${totalAmountDue > 0 ? 'text-red-600' : 'text-gray-900'}`} style={{ color: totalAmountDue > 0 ? '#dc2626' : '#0f172a' }}>
              ₱{totalAmountDue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5 italic">
            <span className="font-semibold text-gray-700">NOT YET DUE (&le;30 DAYS)</span>
            <span className="font-semibold text-gray-900">
              ₱{totalNotYetDue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 px-2 font-extrabold text-sm" style={{ backgroundColor: '#facc15', color: '#000000', borderTop: '2px solid #000000', borderBottom: '2px solid #000000' }}>
            <span>Total Current Balance</span>
            <span className="font-mono" style={{ borderBottom: '3px double #000000' }}>
              ₱{totalCurrentBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Signatory */}
      <div className="mt-8">
        <p className="text-xs text-gray-700 mb-6">Prepared By:</p>
        <div className="border-b border-gray-800 w-48 mb-1" style={{ borderBottom: '1px solid #1e293b' }}>
          <p className="font-bold text-gray-900">{activeClient.preparedBy}</p>
        </div>
        <p className="text-xs text-gray-600">Accounting / Credit &amp; Collection Officer</p>
      </div>
    </div>
  );

  return (
    <div className="feature-module space-y-6 w-full text-slate-900">
      <WorkflowStepper currentStep="SOA" compact />
      {/* Module Title Header */}
      <div className="wayfinding-card flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-blue-900" />
            Statement of account &amp; collections
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Client aging ledger, payment check allocation, and official statement generator
          </p>
          {dataState === 'offline' && (
            <p className="mt-2 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
              Offline demo preview — seeded rows are not live ledger data.
            </p>
          )}
          {dataState === 'live' && soaRows.length === 0 && (
            <p className="mt-2 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              Live ledger is empty. No invoices were returned.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setIsAddInvoiceModalOpen(true)}
            className="action-primary text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
             <span>Preview invoice entry</span>
          </button>

           <button
             type="button"
             onClick={() => setIsCollectionModalOpen(true)}
             disabled={allocationTargets.length === 0}
             className="action-supporting text-xs sm:text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CreditCard className="w-4 h-4" />
            <span>Allocate Multi-SOA Check</span>
          </button>

          <details className="action-disclosure relative">
            <summary>
              <span>More actions</span>
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </summary>
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 flex min-w-[13rem] flex-col gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <button
                type="button"
                onClick={() => onOpenPrintModal('Statement of Account', 'printable-soa-target', soaDocumentContent)}
                className="action-quiet w-full justify-start text-left text-xs sm:text-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print SOA</span>
              </button>

              <button
                type="button"
                onClick={handleExportData}
                className="action-quiet w-full justify-start text-left text-xs sm:text-sm"
              >
                <Download className="w-4 h-4 text-blue-700" />
                <span>Export SOA</span>
              </button>
            </div>
          </details>
        </div>
      </div>

      {/* Client Selector Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-4 gap-3 shadow-2xs">
        <div className="flex items-center gap-3 flex-wrap">
           <span className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
             <Building2 className="w-4 h-4 text-blue-700" />
             Select client SOA ledger:
          </span>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
             className="bg-white border border-slate-300 font-medium text-xs sm:text-sm rounded-xl px-4 py-2 text-blue-950 focus:outline-none focus:border-blue-700 shadow-2xs cursor-pointer"
          >
            {clientOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.address})
              </option>
            ))}
          </select>
        </div>
         <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
           <span>Terms: <strong className="font-semibold text-blue-950">{activeClient.terms}</strong></span>
           <span>Rep: <strong className="font-semibold text-blue-950">{activeClient.salesperson}</strong></span>
        </div>
      </div>

      {dataState === 'loading' && (
        <div className="wayfinding-card px-4 py-8 text-sm font-medium text-slate-600" role="status">
          Loading the live statement ledger…
        </div>
      )}
      {dataState !== 'loading' && computedRows.length === 0 && (
        <div className="wayfinding-card px-4 py-8 text-sm font-medium text-slate-600" role="status">
          No statement rows to display. Add an invoice only when you have a verified ledger entry.
        </div>
      )}
      <section aria-labelledby="soa-aging-overview" className="wayfinding-card table-responsive-wrapper">
         <div className="border-b border-slate-200 px-4 py-3"><h3 id="soa-aging-overview" className="text-sm font-semibold text-slate-900">Aging overview</h3><p className="mt-0.5 text-xs font-medium text-slate-500">High-signal balances are shown here. The official printable statement below keeps its controlled format.</p></div>
         <table className="wayfinding-grid w-full min-w-[720px] border-collapse text-sm">
            <caption className="sr-only">Statement of account aging overview</caption>
            <thead className="bg-slate-50 text-left text-xs font-medium text-slate-700"><tr><th scope="col" className="p-4">Invoice</th><th scope="col" className="p-4">Client</th><th scope="col" className="p-4">Due date</th><th scope="col" className="p-4 text-center">Status</th><th scope="col" className="p-4 text-right">Balance</th><th scope="col" className="p-4 text-center">Details</th></tr></thead>
          <tbody className="divide-y divide-slate-200">
            {computedRows.map((row, index) => {
              const age = Number(row.age || row.ageDays || 0);
              const isPaid = Number(row.invoiceBalance) <= 0;
               return <tr key={`overview-${row.id || index}`} className="transition hover:bg-blue-50/50"><td className="p-4 font-mono font-semibold text-blue-950">{row.salesInvoiceNo}</td><td className="p-4 font-medium text-slate-900">{activeClient.name}</td><td className="p-4 text-xs font-medium text-slate-600">{row.dueDate}</td><td className="p-4 text-center">{isPaid ? <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-900">Paid</span> : age > 30 ? <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-900">Overdue</span> : <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900">Open</span>}</td><td className="p-4 text-right font-mono font-semibold">₱{Number(row.invoiceBalance).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td><td className="p-4 text-center"><details className="relative inline-block"><summary className="min-h-[44px] cursor-pointer list-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100">Inspect</summary><div className="absolute right-0 z-10 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-3 text-left text-xs shadow-xl"><p className="font-semibold text-slate-900">{row.drNo}</p><p className="mt-1 text-slate-600">Amount paid: ₱{Number(row.amountPaid || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p><p className="mt-1 text-slate-600">Running balance: ₱{Number(row.runningBalance).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p></div></details></td></tr>;
            })}
          </tbody>
        </table>
      </section>

      {/* Live Rendered SOA Document Preview Container */}
      <div className="bg-slate-100/90 p-2.5 sm:p-6 rounded-3xl border border-slate-300 shadow-2xs space-y-3">
         <div className="flex items-center justify-between text-xs font-medium text-slate-600 px-1">
           <span className="font-semibold text-[11px] text-slate-700">Official printable SOA document preview</span>
           <span className="block sm:hidden text-blue-900 font-medium text-[10px] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
            &larr; Pinch to zoom / Swipe document &rarr;
          </span>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-white p-2 sm:p-4 shadow-sm flex justify-start sm:justify-center">
          {soaDocumentContent}
        </div>
      </div>

      {/* Add Invoice to SOA Modal */}
      <AccessibleModal
        isOpen={isAddInvoiceModalOpen}
        onClose={() => setIsAddInvoiceModalOpen(false)}
        title="Preview invoice entry"
        description={`Add a local invoice preview for ${activeClient.name}.`}
        size="md"
        contentClassName="text-slate-900"
      >
          {isAddInvoiceModalOpen && <div className="modal-panel space-y-6 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-700 text-white rounded-2xl shadow-sm">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wider">Preview invoice entry</h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">Target Client: {activeClient.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddInvoiceModalOpen(false)}
                aria-label="Close invoice preview"
                className="modal-close cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddInvoiceSubmit} className="space-y-4 text-sm font-semibold" noValidate>
              {invoiceValidationError && <p id="soa-invoice-error" role="alert" aria-live="assertive" aria-atomic="true" className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs font-semibold text-rose-900">{invoiceValidationError}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Sales Invoice (SI) No. *</label>
                  <input
                    type="text"
                    placeholder="e.g. SI-6125"
                    value={newSiNo}
                    onChange={(e) => { setNewSiNo(e.target.value); setInvoiceValidationError(null); }}
                    aria-describedby={invoiceValidationError ? 'soa-invoice-error' : undefined}
                    aria-invalid={invoiceValidationError && !newSiNo.trim() ? true : undefined}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Delivery Receipt (DR) No. *</label>
                  <input
                    type="text"
                    placeholder="e.g. DR-6119"
                    value={newDrNo}
                    onChange={(e) => { setNewDrNo(e.target.value); setInvoiceValidationError(null); }}
                    aria-describedby={invoiceValidationError ? 'soa-invoice-error' : undefined}
                    aria-invalid={invoiceValidationError && !newDrNo.trim() ? true : undefined}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">SI Date</label>
                  <input
                    type="text"
                    value={newSiDate}
                    onChange={(e) => setNewSiDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Due Date</label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Age (Days)</label>
                  <input
                    type="number"
                    value={newAgeDays}
                    onChange={(e) => setNewAgeDays(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Invoice Amount (₱) *</label>
                  <input
                    type="number"
                    value={newInvoiceAmount}
                    onChange={(e) => { setNewInvoiceAmount(Number(e.target.value)); setInvoiceValidationError(null); }}
                    aria-describedby={invoiceValidationError ? 'soa-invoice-error' : undefined}
                    aria-invalid={invoiceValidationError && newInvoiceAmount < 0 ? true : undefined}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Amount Paid (₱)</label>
                  <input
                    type="number"
                    value={newAmountPaid}
                    onChange={(e) => { setNewAmountPaid(Number(e.target.value)); setInvoiceValidationError(null); }}
                    aria-describedby={invoiceValidationError ? 'soa-invoice-error' : undefined}
                    aria-invalid={invoiceValidationError && newAmountPaid < 0 ? true : undefined}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-slate-200 gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddInvoiceModalOpen(false)}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-2xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer border border-emerald-600"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                   <span>Apply local preview</span>
                </button>
              </div>
            </form>
          </div>}
      </AccessibleModal>

      {/* Edit Invoice Entry Modal */}
      <AccessibleModal
        isOpen={Boolean(editingRow)}
        onClose={() => setEditingRow(null)}
        title={editingRow ? `Edit invoice entry — ${editingRow.salesInvoiceNo}` : 'Edit invoice entry'}
        description="Modify invoice amounts and due dates in the local preview."
        size="md"
        contentClassName="text-slate-900"
      >
          {editingRow && <div className="modal-panel space-y-6 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-900 text-white rounded-2xl shadow-sm">
                  <Edit className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wider">Edit Invoice Entry — {editingRow.salesInvoiceNo}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">Modify invoice amounts and due dates live</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingRow(null)}
                aria-label="Close invoice editor"
                className="modal-close cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditRowSubmit} className="space-y-4 text-sm font-semibold" noValidate>
              {editingValidationError && <p id="soa-edit-error" role="alert" aria-live="assertive" aria-atomic="true" className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs font-semibold text-rose-900">{editingValidationError}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Sales Invoice (SI) No.</label>
                  <input
                    type="text"
                    value={editingRow.salesInvoiceNo}
                    onChange={(e) => { setEditingRow({ ...editingRow, salesInvoiceNo: e.target.value }); setEditingValidationError(null); }}
                    aria-describedby={editingValidationError ? 'soa-edit-error' : undefined}
                    aria-invalid={editingValidationError && !editingRow.salesInvoiceNo?.trim() ? true : undefined}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Delivery Receipt (DR) No.</label>
                  <input
                    type="text"
                    value={editingRow.drNo}
                    onChange={(e) => { setEditingRow({ ...editingRow, drNo: e.target.value }); setEditingValidationError(null); }}
                    aria-describedby={editingValidationError ? 'soa-edit-error' : undefined}
                    aria-invalid={editingValidationError && !editingRow.drNo?.trim() ? true : undefined}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">SI Date</label>
                  <input
                    type="text"
                    value={editingRow.siDate}
                    onChange={(e) => setEditingRow({ ...editingRow, siDate: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Due Date</label>
                  <input
                    type="text"
                    value={editingRow.dueDate}
                    onChange={(e) => setEditingRow({ ...editingRow, dueDate: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Age (Days)</label>
                  <input
                    type="number"
                    value={editingRow.ageDays || editingRow.age}
                    onChange={(e) => setEditingRow({ ...editingRow, ageDays: Number(e.target.value), age: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Invoice Amount (₱)</label>
                  <input
                    type="number"
                    value={editingRow.invoiceAmount}
                      onChange={(e) => {
                        const newAmt = Number(e.target.value) || 0;
                      const paid = Number(editingRow.amountPaid) || 0;
                      setEditingRow({
                        ...editingRow,
                        invoiceAmount: newAmt,
                        invoiceBalance: Math.max(0, newAmt - paid),
                        });
                        setEditingValidationError(null);
                      }}
                    aria-describedby={editingValidationError ? 'soa-edit-error' : undefined}
                    aria-invalid={editingValidationError && Number(editingRow.invoiceAmount) < 0 ? true : undefined}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Amount Paid (₱)</label>
                  <input
                    type="number"
                    value={editingRow.amountPaid || 0}
                      onChange={(e) => {
                        const paid = Number(e.target.value) || 0;
                      const invAmt = Number(editingRow.invoiceAmount) || 0;
                      setEditingRow({
                        ...editingRow,
                        amountPaid: paid,
                        invoiceBalance: Math.max(0, invAmt - paid),
                        });
                        setEditingValidationError(null);
                      }}
                    aria-describedby={editingValidationError ? 'soa-edit-error' : undefined}
                    aria-invalid={editingValidationError && Number(editingRow.amountPaid) < 0 ? true : undefined}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-slate-200 gap-3">
                <button
                  type="button"
                  onClick={() => setEditingRow(null)}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-2xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-black text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>}
      </AccessibleModal>

      {/* Multi-SOA Check Allocation Modal */}
      <AccessibleModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        title="Multi-SOA collection payment allocation"
        description="Allocate a single check payment across multiple open client invoices."
        size="lg"
        contentClassName="text-slate-900"
      >
          {isCollectionModalOpen && <div className="modal-panel space-y-6 p-6 sm:p-8">
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
                type="button"
                aria-label="Close collection allocation"
                className="modal-close cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAllocateCheck} className="space-y-5 text-sm font-semibold" noValidate>
              {allocationValidationError && <p id="soa-allocation-error" role="alert" aria-live="assertive" aria-atomic="true" className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs font-semibold text-rose-900">{allocationValidationError}</p>}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs sm:text-sm text-blue-950 font-bold flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-blue-700 shrink-0" />
                <span>Multi-SOA Check Allocation: Apply one payment to selected invoice balances and calculate any unapplied customer credit.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-300/80">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs uppercase tracking-wider">Check Number *</label>
                  <input
                    type="text"
                    value={checkNo}
                    onChange={(e) => { setCheckNo(e.target.value); setAllocationValidationError(null); }}
                    aria-describedby={allocationValidationError ? 'soa-allocation-error' : undefined}
                    aria-invalid={allocationValidationError && !checkNo.trim() ? true : undefined}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl font-mono font-black text-sm sm:text-base text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs uppercase tracking-wider">Issuing Bank *</label>
                  <input
                    type="text"
                    value={bank}
                    onChange={(e) => { setBank(e.target.value); setAllocationValidationError(null); }}
                    aria-describedby={allocationValidationError ? 'soa-allocation-error' : undefined}
                    aria-invalid={allocationValidationError && !bank.trim() ? true : undefined}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl font-black text-sm sm:text-base text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs uppercase tracking-wider">Check Amount (₱) *</label>
                  <input
                    type="number"
                    value={checkAmount}
                    onChange={(e) => { setCheckAmount(Number(e.target.value)); setAllocationValidationError(null); }}
                    aria-describedby={allocationValidationError ? 'soa-allocation-error' : undefined}
                    aria-invalid={allocationValidationError && checkAmount <= 0 ? true : undefined}
                    className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl font-mono font-black text-base sm:text-lg text-blue-950 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Invoice Allocation Breakdown</h4>
                {allocationTargets.length === 0 ? (
                  <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-600">
                    No open invoice balances are available for allocation.
                  </p>
                ) : allocationTargets.map((row) => {
                  const allocationKey = row.id || row.salesInvoiceNo;
                  return (
                    <div key={allocationKey} className="p-4 bg-white border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                      <div>
                        <p className="font-black text-slate-900 text-sm sm:text-base">{row.salesInvoiceNo}</p>
                        <p className="text-slate-600 text-xs font-bold mt-0.5">Invoice balance: <span className="font-mono text-slate-900 font-extrabold">₱{Number(row.invoiceBalance).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span></p>
                      </div>
                      <div className="w-full sm:w-44">
                        <label htmlFor={`allocation-${allocationKey}`} className="block text-xs text-slate-500 font-extrabold mb-1 uppercase tracking-wider">Allocated (₱)</label>
                        <input
                          id={`allocation-${allocationKey}`}
                          type="number"
                          min="0"
                          max={Number(row.invoiceBalance)}
                          value={allocationAmounts[allocationKey] || 0}
                          onChange={(e) => setAllocationAmounts((current) => ({ ...current, [allocationKey]: Number(e.target.value) }))}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-right font-mono font-black text-sm sm:text-base text-slate-900 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dark Summary Value Card */}
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
                   <span>{dataState === 'live' ? 'Apply check allocation' : 'Preview check allocation'}</span>
                </button>
              </div>
            </form>
          </div>}
      </AccessibleModal>
    </div>
  );
};
