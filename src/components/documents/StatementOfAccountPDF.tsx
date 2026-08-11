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
    <div
      className="print-page w-[760px] min-w-[760px] mx-auto bg-white p-8 border border-gray-200 shadow-md text-gray-900 text-xs font-sans shrink-0"
      style={{
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
        backgroundColor: '#ffffff',
        color: '#0f172a',
      }}
    >
      {/* Header with Red Brand Divider Line */}
      <div
        className="flex justify-between items-start pb-4 mb-6"
        style={{ borderBottom: '2px solid #dc2626' }}
      >
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

      {/* Document Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-black uppercase tracking-wider" style={{ color: '#1e3a8a' }}>
          STATEMENT OF ACCOUNT
        </h2>
        <p className="text-xs font-bold text-gray-500">As of {data.statementDate}</p>
      </div>

      {/* Meta Client Information Grid */}
      <div
        className="grid grid-cols-2 gap-4 mb-6 p-3 font-semibold leading-relaxed"
        style={{
          border: '1px solid #cbd5e1',
          backgroundColor: '#f8fafc',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
      >
        <div>
          <p>
            <span className="text-gray-500 uppercase text-[10px] block font-bold">CLIENT / BILL TO:</span>{' '}
            <span className="font-bold text-gray-900 text-sm">{data.clientName}</span>
          </p>
          <p className="mt-1">
            <span className="text-gray-500 uppercase text-[10px] block font-bold">TERMS OF PAYMENT:</span> {data.terms}
          </p>
        </div>
        <div className="text-right">
          <p>
            <span className="text-gray-500 uppercase text-[10px] block font-bold">STATEMENT DATE:</span> {data.statementDate}
          </p>
          <p className="mt-1">
            <span className="text-gray-500 uppercase text-[10px] block font-bold">SALES REPRESENTATIVE:</span> {data.salesperson}
          </p>
        </div>
      </div>

      {/* Invoice Ledger Table */}
      <div className="mb-6">
        <table
          className="w-full border-collapse"
          style={{ border: '1px solid #1e293b', width: '100%' }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: '#1e3a8a',
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '10px',
                textAlign: 'center',
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
              }}
            >
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>SI No.</th>
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>DR No.</th>
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>SI Date</th>
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>Due Date</th>
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>Age</th>
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>SI Amount</th>
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>Amount Paid</th>
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>SI Balance</th>
              <th style={{ border: '1px solid #1e293b', padding: '6px 4px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>Running Balance</th>
              {onRemoveRow && <th className="no-print" style={{ border: '1px solid #1e293b', padding: '4px', backgroundColor: '#1e3a8a', color: '#ffffff', width: '32px' }}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, idx) => (
              <tr key={row.id || idx} className="text-center font-medium">
                <td style={{ border: '1px solid #1e293b', padding: '6px' }}>{row.salesInvoiceNo}</td>
                <td style={{ border: '1px solid #1e293b', padding: '6px' }}>{row.drNo}</td>
                <td style={{ border: '1px solid #1e293b', padding: '6px' }}>{row.siDate}</td>
                <td style={{ border: '1px solid #1e293b', padding: '6px' }}>{row.dueDate}</td>
                <td style={{ border: '1px solid #1e293b', padding: '6px', fontWeight: 'bold' }}>{row.ageDays}</td>
                <td style={{ border: '1px solid #1e293b', padding: '6px', textAlign: 'right', fontWeight: '600' }}>
                  {row.invoiceAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ border: '1px solid #1e293b', padding: '6px', textAlign: 'right' }}>
                  {row.amountPaid > 0 ? row.amountPaid.toLocaleString('en-PH', { minimumFractionDigits: 2 }) : ''}
                </td>
                <td style={{ border: '1px solid #1e293b', padding: '6px', textAlign: 'right', fontWeight: '600' }}>
                  {row.invoiceBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ border: '1px solid #1e293b', padding: '6px', textAlign: 'right', fontWeight: '600' }}>
                  {row.runningBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </td>
                {onRemoveRow && (
                  <td className="no-print" style={{ border: '1px solid #1e293b', padding: '4px', textAlign: 'center' }}>
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

          {/* Bright Yellow Highlighted Total Current Balance Box */}
          <div
            className="flex justify-between items-center py-1.5 px-3 font-black text-sm"
            style={{
              backgroundColor: '#facc15',
              color: '#000000',
              borderTop: '2px solid #000000',
              borderBottom: '2px solid #000000',
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
            }}
          >
            <span>Total Current Balance</span>
            <span style={{ borderBottom: '3px double #000000' }}>
              ₱{totalCurrentBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Signatory */}
      <div className="mt-8">
        <p className="text-xs text-gray-700 mb-6">Prepared By:</p>
        <div className="border-b border-gray-800 w-48 mb-1" style={{ borderBottom: '1px solid #1e293b' }}>
          <p className="font-bold text-gray-900">{data.preparedBy}</p>
        </div>
        <p className="text-xs text-gray-600">{data.preparedByTitle}</p>
      </div>
    </div>
  );
};
