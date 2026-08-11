'use client';

import React from 'react';
import { AccustandardLogo } from '@/components/brand/AccustandardLogo';

export interface QuotationItem {
  id: string;
  description: string;
  packaging: string;
  unitPrice: number;
  quantity?: number;
}

export interface QuotationData {
  qrn: string;
  dateStr: string;
  clientName: string;
  clientOrganization: string;
  clientAddress: string;
  items: QuotationItem[];
  deliveryTerms?: string;
  paymentTerms?: string;
  validityDays?: number;
  signatoryName: string;
  signatoryTitle: string;
}

export const QuotationPDF: React.FC<{ data: QuotationData; onRemoveItem?: (id: string) => void; isEditable?: boolean }> = ({ data, onRemoveItem, isEditable = true }) => {
  return (
    <div
      className="print-page w-[760px] min-w-[760px] mx-auto bg-white p-8 border border-gray-200 shadow-md text-gray-900 text-sm font-sans shrink-0"
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
        </div>
      </div>

      {/* Meta Header */}
      <div className="text-right mb-6">
        <p className="font-bold text-base text-gray-900">QUOTATION: {data.qrn}</p>
        <p className="text-gray-600 text-xs">{data.dateStr}</p>
      </div>

      {/* Client Information */}
      <div className="mb-6 leading-tight">
        <p className="font-bold text-gray-900">{data.clientName}</p>
        <p className="font-semibold text-gray-800">{data.clientOrganization}</p>
        <p className="text-gray-600">{data.clientAddress}</p>
      </div>

      {/* Greeting */}
      <div className="mb-6">
        <p className="italic text-gray-800">Greetings from Accustandard!</p>
        <p className="text-gray-700 mt-1">
          We are delighted to submit our price proposal for the supply and delivery of the following:
        </p>
      </div>

      {/* Item Table */}
      <div className="mb-8">
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
                fontSize: '12px',
                textTransform: 'uppercase',
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
              }}
            >
              <th style={{ border: '1px solid #1e293b', padding: '8px 12px', textAlign: 'left', backgroundColor: '#1e3a8a', color: '#ffffff' }}>Product Description</th>
              <th style={{ border: '1px solid #1e293b', padding: '8px 12px', textAlign: 'center', width: '144px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>Packaging</th>
              <th style={{ border: '1px solid #1e293b', padding: '8px 12px', textAlign: 'right', width: '176px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>Unit Price (PHP)</th>
              {onRemoveItem && <th className="no-print" style={{ border: '1px solid #1e293b', padding: '4px', textAlign: 'center', width: '48px', backgroundColor: '#1e3a8a', color: '#ffffff' }}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => (
              <tr key={item.id || idx} className="text-sm font-medium">
                <td style={{ border: '1px solid #1e293b', padding: '8px 12px', color: '#0f172a', fontWeight: '500' }}>{item.description}</td>
                <td style={{ border: '1px solid #1e293b', padding: '8px 12px', textAlign: 'center', color: '#334155' }}>{item.packaging}</td>
                <td style={{ border: '1px solid #1e293b', padding: '8px 12px', textAlign: 'right', fontWeight: 'bold', color: '#0f172a' }}>
                  ₱{item.unitPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </td>
                {onRemoveItem && (
                  <td className="no-print" style={{ border: '1px solid #1e293b', padding: '4px', textAlign: 'center' }}>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      disabled={!isEditable}
                      className={`p-1 rounded transition ${
                        isEditable ? 'text-red-600 hover:bg-red-100 cursor-pointer' : 'text-gray-300 cursor-not-allowed opacity-50'
                      }`}
                      title={isEditable ? "Remove Item from Quotation" : "Role is not authorized to remove quotation items"}
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

      {/* Terms & Conditions */}
      <div className="mb-8 space-y-2 text-xs">
        <p className="font-bold text-gray-900 uppercase">Terms and Conditions:</p>
        <p className="text-gray-800">
          <span className="font-bold">DELIVERY:</span> {data.deliveryTerms || '30-60 days from date of receipt of Purchase Order.'}
        </p>
        <p className="text-gray-800">
          <span className="font-bold">PAYMENT:</span> {data.paymentTerms || 'Thirty (30) days upon invoice date.'}
        </p>
        <p className="text-gray-800">
          <span className="font-bold">PROPOSAL VALIDITY:</span> This quotation is valid for {data.validityDays || 30} days, thereafter subject to reconfirmation.
        </p>
        <p className="text-gray-600 italic mt-3">
          Thank you for considering our quotation. We look forward to the opportunity to serve you.
        </p>
      </div>

      {/* Signatory */}
      <div className="mt-12 mb-12">
        <p className="text-xs text-gray-700">Respectfully,</p>
        <div className="h-12"></div>
        <p className="font-bold text-gray-900 border-b border-gray-400 inline-block pb-0.5" style={{ borderBottom: '1px solid #475569' }}>{data.signatoryName}</p>
        <p className="text-xs text-gray-600">{data.signatoryTitle}</p>
      </div>

      {/* Footer */}
      <div
        className="pt-3 text-center text-xs text-gray-600 flex justify-between"
        style={{ borderTop: '2px solid #dc2626' }}
      >
        <p>Email: accustandard1024@gmail.com</p>
        <p>Tel and Fax no.: (045) 966-6097</p>
      </div>
    </div>
  );
};
