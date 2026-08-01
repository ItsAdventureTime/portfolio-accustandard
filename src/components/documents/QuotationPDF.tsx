'use client';

import React from 'react';
import Image from 'next/image';

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

export const QuotationPDF: React.FC<{ data: QuotationData }> = ({ data }) => {
  return (
    <div className="print-page max-w-4xl mx-auto bg-white p-8 border border-gray-200 shadow-md text-gray-900 text-sm font-sans">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-red-600 pb-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-extrabold tracking-tight text-blue-800">ACCUSTANDA</span>
            <span className="text-3xl font-extrabold text-red-600">R<sub className="text-xl">X</sub>D</span>
          </div>
          <p className="text-[10px] font-bold text-gray-800 tracking-wider">
            MEDICAL AND DIAGNOSTIC SUPPLIES CORPORATION
          </p>
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
        <p className="italic text-gray-800">Greetings from Accustanda!</p>
        <p className="text-gray-700 mt-1">
          We are delighted to submit our price proposal for the supply and delivery of the following:
        </p>
      </div>

      {/* Item Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-900 text-white font-bold text-xs uppercase">
              <th className="py-2.5 px-4 text-left border border-blue-900">Product Description</th>
              <th className="py-2.5 px-4 text-center border border-blue-900 w-36">Packaging</th>
              <th className="py-2.5 px-4 text-right border border-blue-900 w-44">Unit Price (PHP)</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => (
              <tr key={item.id || idx} className="border-b border-gray-200">
                <td className="py-3 px-4 text-gray-900 font-medium">{item.description}</td>
                <td className="py-3 px-4 text-center text-gray-800">{item.packaging}</td>
                <td className="py-3 px-4 text-right font-bold text-gray-900">
                  {item.unitPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </td>
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
        <p className="font-bold text-gray-900 border-b border-gray-400 inline-block pb-0.5">{data.signatoryName}</p>
        <p className="text-xs text-gray-600">{data.signatoryTitle}</p>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-red-600 pt-3 text-center text-xs text-gray-600 flex justify-between">
        <p>Email: accustandard1024@gmail.com</p>
        <p>Tel and Fax no.: (045) 966-6097</p>
      </div>
    </div>
  );
};
