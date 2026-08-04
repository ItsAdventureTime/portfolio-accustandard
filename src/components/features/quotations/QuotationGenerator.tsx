'use client';

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Send,
  Lock,
  Building2,
  CheckCircle2,
} from 'lucide-react';

import { AccustandardLogo } from '@/components/brand/AccustandardLogo';

interface QuotationGeneratorProps {
  onOpenPrintModal: (title: string, elementId: string, content: React.ReactNode) => void;
  onOpenExportModal: (title: string, filename: string, data: object[], elementId?: string) => void;
  onOpenCreateModal: () => void;
  onSubmitForApproval: (qrn: string) => void;
  onShowNotification: (msg: string) => void;
  onAddAuditLog: (action: string) => void;
}

export const QuotationGenerator: React.FC<QuotationGeneratorProps> = ({
  onOpenPrintModal,
  onOpenExportModal,
  onOpenCreateModal,
  onSubmitForApproval,
  onShowNotification,
  onAddAuditLog,
}) => {
  // Sample Quotation State matching photo_2026-08-01_23-55-26.jpg
  const [qrn, setQrn] = useState('QRN20240415037');
  const [quotationDate, setQuotationDate] = useState('April 15, 2024');
  const [clientName, setClientName] = useState('Ms. Katherine Porciuncula');
  const [clientFacility, setClientFacility] = useState('Allied Care Experts Medical Center');
  const [clientAddress, setClientAddress] = useState('Lot 2975, C-1 Doña Remedios Trinidad Hwy, Baliuag, Bulacan');

  const [itemDescription, setItemDescription] = useState('Calibration Sticks Bact Alert');
  const [packaging, setPackaging] = useState('1 Kit');
  const [unitPrice, setUnitPrice] = useState(31500.0);

  const handleExportData = () => {
    const exportRows = [
      {
        QRN: qrn,
        Date: quotationDate,
        Client: clientName,
        Facility: clientFacility,
        Address: clientAddress,
        Item: itemDescription,
        Packaging: packaging,
        UnitPrice: unitPrice,
      },
    ];
    onOpenExportModal(
      `Quotation ${qrn}`,
      `quotation_${qrn.toLowerCase()}`,
      exportRows,
      'printable-quotation-target'
    );
  };

  const quotationDocumentContent = (
    <div id="printable-quotation-target" className="bg-white p-8 sm:p-10 text-slate-900 font-sans max-w-4xl mx-auto border border-slate-300 shadow-md rounded-xl space-y-6">
      {/* Quotation Header Matching photo_2026-08-01_23-55-26.jpg */}
      <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-red-600 pb-4 gap-4">
        <div>
          <AccustandardLogo size="lg" />
          <p className="text-xs text-slate-600 font-semibold mt-1">
            Unit A G/F El Decano Bldg., Blk 2 Lot 2, St. Jude, Villa Corazon, San Agustin, City of San Fernando, 2000, Pampanga
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-xs font-black uppercase text-slate-500 block">Official Quotation</span>
          <span className="text-lg font-black font-mono text-red-600 block">{qrn}</span>
          <span className="text-xs font-bold text-slate-700 block">{quotationDate}</span>
        </div>
      </div>

      {/* Recipient Details */}
      <div className="space-y-1 text-sm font-semibold text-slate-800">
        <p className="font-extrabold text-base text-slate-900">{clientName}</p>
        <p className="text-blue-950 font-bold">{clientFacility}</p>
        <p className="text-slate-600">{clientAddress}</p>
      </div>

      <div className="text-sm font-medium text-slate-800">
        Greetings from Accustandard! We are delighted to submit our price proposal for the supply and delivery of the following:
      </div>

      {/* Item Table */}
      <table className="w-full text-left text-sm border-collapse border border-slate-300">
        <thead className="bg-blue-950 text-white font-extrabold uppercase text-xs">
          <tr>
            <th className="p-3 border border-slate-300">Product Description</th>
            <th className="p-3 border border-slate-300">Packaging</th>
            <th className="p-3 border border-slate-300 text-right">Unit Price (PHP)</th>
          </tr>
        </thead>
        <tbody className="font-semibold text-slate-900">
          <tr>
            <td className="p-3 border border-slate-300 font-bold">{itemDescription}</td>
            <td className="p-3 border border-slate-300">{packaging}</td>
            <td className="p-3 border border-slate-300 text-right font-mono font-bold">
              ₱{unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Terms & Conditions */}
      <div className="space-y-1.5 text-xs text-slate-700 font-semibold border-t border-slate-200 pt-4">
        <p className="font-bold text-slate-900 uppercase">Terms and Conditions:</p>
        <p><span className="font-bold">DELIVERY:</span> 30-60 days from date of receipt of Purchase Order.</p>
        <p><span className="font-bold">PAYMENT:</span> Thirty (30) days upon invoice date.</p>
        <p><span className="font-bold">PROPOSAL VALIDITY:</span> This quotation is valid for 30 days, thereafter subject to reconfirmation.</p>
      </div>

      {/* Signatures */}
      <div className="pt-6 flex justify-between items-end text-xs font-semibold text-slate-800">
        <div>
          <p className="font-bold text-slate-900 text-sm">Katherine M. Payumo, RMT</p>
          <p className="text-slate-600">Product Marketing Manager</p>
        </div>
        <div className="text-right text-[11px] text-slate-500 font-medium">
          <p>Email: accustandard1024@gmail.com</p>
          <p>Tel &amp; Fax: (045) 966-5097</p>
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
            <FileText className="w-6 h-6 text-amber-600" />
            Sales Quotation Generator &amp; Stock Reservation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            3-Day Stock Reservation Engine &bull; Sales RFQ &rarr; Marketing (Reviewer) &rarr; GM &rarr; DCS (Chairman)
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
          <button
            onClick={onOpenCreateModal}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Send className="w-4 h-4 text-blue-200" />
            <span>+ Create / Request Sales Quote</span>
          </button>

          <button
            onClick={() => onSubmitForApproval(qrn)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit for Approval</span>
          </button>

          <button
            onClick={() => onOpenPrintModal(`Sales Quotation ${qrn}`, 'printable-quotation-target', quotationDocumentContent)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Quotation</span>
          </button>

          <button
            onClick={handleExportData}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export Quote...</span>
          </button>
        </div>
      </div>

      {/* Official A4 Quotation Document Preview */}
      {quotationDocumentContent}
    </div>
  );
};
