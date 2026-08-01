'use client';

import React from 'react';

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

export const StatementOfAccountPDF: React.FC<{ data: SOAData }> = ({ data }) => {
  const totalAmountDue = data.rows
    .filter(r => r.ageDays > 30)
    .reduce((sum, r) => sum + r.invoiceBalance, 0);

  const totalNotYetDue = data.rows
    .filter(r => r.ageDays <= 30)
    .reduce((sum, r) => sum + r.invoiceBalance, 0);

  const totalCurrentBalance = data.rows.reduce((sum, r) => sum + r.invoiceBalance, 0);

  return (
    <div className="print-page max-w-5xl mx-auto bg-white p-8 border border-gray-200 shadow-md text-gray-900 text-xs font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 border-b border-gray-300 pb-4">
        <div>
          <div className="flex items-center leading-none">
            <span className="text-3xl font-black tracking-tighter text-blue-950">ACCUSTANDA</span>
            <span className="text-3xl font-black text-red-600 ml-0.5">R<span className="text-2xl font-black italic">x</span></span>
            <span className="text-3xl font-black text-blue-950">D</span>
          </div>
          <div className="w-full border-b-2 border-red-600 my-0.5"></div>
          <p className="text-[10px] font-extrabold text-gray-900 tracking-tight uppercase whitespace-nowrap">
            MEDICAL AND DIAGNOSTIC SUPPLIES CORPORATION
          </p>
        </div>
        <div className="text-right text-xs text-gray-700 leading-tight">
          <p>Unit A G/F El Decano Bldg., Blk 2</p>
          <p>Lot 2 St. Jude, Villa Corazon, San</p>
          <p>Agustin, San Fernando Pampanga</p>
          <p>Email: <span className="text-blue-600 underline">accustandard1024@gmail.com</span></p>
          <p>Tel and Fax no.: (045)966-6097</p>
        </div>
      </div>

      {/* Document Title */}
      <div className="text-center my-4">
        <h1 className="text-base font-extrabold tracking-wide uppercase text-gray-900">
          STATEMENT OF ACCOUNT
        </h1>
      </div>

      {/* Metadata Section */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-xs leading-relaxed">
        <div>
          <div className="flex">
            <span className="w-32 font-bold text-gray-800">Statement Date:</span>
            <span className="font-semibold text-gray-900">{data.statementDate}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-bold text-gray-800">Client:</span>
            <span className="font-bold text-gray-900 uppercase">{data.clientName}</span>
          </div>
          {data.clientAddress && (
            <div className="flex">
              <span className="w-32 font-bold text-gray-800">Address:</span>
              <span className="text-gray-900">{data.clientAddress}</span>
            </div>
          )}
          <div className="flex">
            <span className="w-32 font-bold text-gray-800">Terms:</span>
            <span className="text-gray-900">{data.terms}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-bold text-gray-800">Salesperson:</span>
            <span className="text-gray-900">{data.salesperson}</span>
          </div>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="mb-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-900 text-xs">
          <thead>
            <tr className="bg-gray-100 font-bold border-b border-gray-900 text-center">
              <th className="border border-gray-900 py-1.5 px-2">Sales Invoice #</th>
              <th className="border border-gray-900 py-1.5 px-2">DR #</th>
              <th className="border border-gray-900 py-1.5 px-2">S.I. Date</th>
              <th className="border border-gray-900 py-1.5 px-2">Due Date</th>
              <th className="border border-gray-900 py-1.5 px-2 w-16">AGE</th>
              <th className="border border-gray-900 py-1.5 px-2 text-right">Invoice Amount</th>
              <th className="border border-gray-900 py-1.5 px-2 text-right">Amount Paid</th>
              <th className="border border-gray-900 py-1.5 px-2 text-right">Invoice Balance</th>
              <th className="border border-gray-900 py-1.5 px-2 text-right">Running Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, idx) => (
              <tr key={idx} className="text-center font-medium border-b border-gray-300">
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
