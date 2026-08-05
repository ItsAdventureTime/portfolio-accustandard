'use client';

import React from 'react';
import { AccustandardLogo } from '@/components/brand/AccustandardLogo';

export interface SOAItemRow {
  id?: string;
  salesInvoiceNo: string;
  drNo: string;
  siDate: string;
  dueDate: string;
  ageDays: number;
  invoiceAmount: number;
  amountPaid: number;
  invoiceBalance: number;
  runningBalance: number;
}

export interface SOAData {
  soaNumber?: string;
  statementDate: string;
  clientName: string;
  clientAddress?: string;
  terms: string;
  salesperson: string;
  rows: SOAItemRow[];
  preparedBy: string;
  preparedByTitle: string;
}

export const StatementOfAccountPDF: React.FC<{ data: SOAData; onRemoveRow?: (id: string) => void; isEditable?: boolean }> = ({ data, onRemoveRow, isEditable = true }) => {
  const totalAmountDue = data.rows
    .filter(r => r.ageDays > 30)
    .reduce((sum, r) => sum + r.invoiceBalance, 0);

  const totalNotYetDue = data.rows
    .filter(r => r.ageDays <= 30)
    .reduce((sum, r) => sum + r.invoiceBalance, 0);

  const totalCurrentBalance = data.rows.reduce((sum, r) => sum + r.invoiceBalance, 0);

  return (
    <div className="print-page w-[760px] min-w-[760px] mx-auto bg-white p-8 border border-gray-200 shadow-md text-gray-900 text-xs font-sans shrink-0">
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
        <p className="text-xs text-gray-500 font-bold">As of {data.statementDate}</p>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 border border-gray-300 p-3 bg-gray-50 font-semibold leading-relaxed">
        <div>
          <p><span className="text-gray-500 uppercase text-[10px] block">CLIENT / BILL TO:</span> <span className="font-bold text-gray-900 text-sm">{data.clientName}</span></p>
          <p className="mt-1"><span className="text-gray-500 uppercase text-[10px] block">TERMS OF PAYMENT:</span> {data.terms}</p>
        </div>
        <div className="text-right">
          <p><span className="text-gray-500 uppercase text-[10px] block">STATEMENT DATE:</span> {data.statementDate}</p>
          <p className="mt-1"><span className="text-gray-500 uppercase text-[10px] block">SALES REPRESENTATIVE:</span> {data.salesperson}</p>
        </div>
      </div>

      {/* Invoice Ledger Table */}
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
              {onRemoveRow && <th className="border border-gray-900 py-2 px-1 w-10 no-print">Action</th>}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, idx) => (
              <tr key={row.id || idx} className="text-center font-medium border-b border-gray-300 hover:bg-slate-50 transition">
                <td className="border border-gray-900 py-1.5 px-2">{row.salesInvoiceNo}</td>
                <td className="border border-gray-900 py-1.5 px-2">{row.drNo}</td>
                <td className="border border-gray-900 py-1.5 px-2">{row.siDate}</td>
                <td className="border border-gray-900 py-1.5 px-2">{row.dueDate}</td>
                <td className="border border-gray-900 py-1.5 px-2 font-bold">{row.ageDays}</td>
                <td className="border border-gray-900 py-1.5 px-2 text-right font-semibold">
                  {row.invoiceAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </td>
                <td className="border border-gray-900 py-1.5 px-2 text-right">
                  {row.amountPaid > 0 ? row.amountPaid.toLocaleString('en-PH', { minimumFractionDigits: 2 }) : ''}
                </td>
                <td className="border border-gray-900 py-1.5 px-2 text-right font-semibold">
                  {row.invoiceBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </td>
                <td className="border border-gray-900 py-1.5 px-2 text-right font-semibold">
                  {row.runningBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </td>
                {onRemoveRow && (
                  <td className="border border-gray-900 py-1 px-1 text-center no-print">
                    <button
                      onClick={() => onRemoveRow(row.id!)}
                      disabled={!isEditable}
                      className={`p-1 rounded transition ${
                        isEditable ? 'text-red-600 hover:bg-red-100 cursor-pointer' : 'text-gray-300 cursor-not-allowed opacity-50'
                      }`}
                      title={isEditable ? "Remove SOA Invoice Row" : "Role is not authorized to remove SOA ledgers"}
                    >
                      🗑️
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Calculations */}
      <div className="flex justify-end mb-8 text-xs">
        <div className="w-80 space-y-1">
          <div className="flex justify-between items-center py-0.5">
            <span className="font-bold uppercase text-gray-800">AMOUNT DUE</span>
            <span className={`font-bold ${totalAmountDue > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {totalAmountDue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5 italic">
            <span className="font-semibold text-gray-700">NOT YET DUE</span>
            <span className="font-semibold text-gray-900">
              {totalNotYetDue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Yellow Highlighted Total Current Balance */}
          <div className="flex justify-between items-center py-1 px-2 bg-yellow-300 border-y border-gray-900 font-extrabold text-sm">
            <span>Total Current Balance</span>
            <span className="border-b-4 border-double border-gray-900">
              {totalCurrentBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Signatory */}
      <div className="mt-8">
        <p className="text-xs text-gray-700 mb-6">Prepared By:</p>
        <div className="border-b border-gray-800 w-48 mb-1">
          <p className="font-bold text-gray-900">{data.preparedBy}</p>
        </div>
        <p className="text-xs text-gray-600">{data.preparedByTitle}</p>
      </div>
    </div>
  );
};
