'use client';

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Lock,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  UserCheck,
  Send,
} from 'lucide-react';

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

  return (
    <div className="space-y-6">
      {/* Module Title & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            Sales Quotation Generator &amp; Stock Reservation
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            3-Day Stock Reservation Engine &bull; Sales RFQ &rarr; Marketing (Reviewer) &rarr; GM &rarr; DCS (Chairman)
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
          <button
            onClick={onOpenCreateModal}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Send className="w-4 h-4 text-blue-300" />
            <span>+ Create / Request Sales Quote</span>
          </button>

          <button
            onClick={() => onSubmitForApproval(qrn)}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit for Approval</span>
          </button>

          <button
            onClick={handleExportData}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export Quote...</span>
          </button>
        </div>
      </div>

      {/* 3-Day Reservation Engine Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-950">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider">
              3-Day Stock Reservation Active
            </h4>
            <p className="text-[11px] text-amber-800 font-medium">
              Soft-reserves requested stock on hand to prevent double-allocation during COSO approval chain routing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-xs self-stretch sm:self-auto justify-center">
          <Clock className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-mono font-bold text-amber-900">Auto-expires in: 2d 18h</span>
        </div>
      </div>

      {/* Interactive Quotation Creator Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider border-b border-slate-100 pb-2">
          Quotation Metadata &amp; Client Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Quotation QRN #</label>
            <input
              type="text"
              value={qrn}
              onChange={(e) => setQrn(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Quotation Date</label>
            <input
              type="text"
              value={quotationDate}
              onChange={(e) => setQuotationDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Client Contact Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Medical Facility / Hospital Name</label>
            <input
              type="text"
              value={clientFacility}
              onChange={(e) => setClientFacility(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Facility Address</label>
            <input
              type="text"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-900"
            />
          </div>
        </div>

        {/* Item Pricing Row */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Item Description</label>
            <input
              type="text"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-blue-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Packaging / Unit</label>
            <input
              type="text"
              value={packaging}
              onChange={(e) => setPackaging(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Unit Price (₱)</label>
            <input
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-black text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Official Accustandard RxD Document Preview Block (Matching photo_2026-08-01_23-55-26.jpg) */}
      <div className="bg-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-300 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-700" />
            Official Quotation Document Preview (A4 Formatted)
          </span>

          <button
            onClick={() =>
              onOpenPrintModal(
                `Official Quotation ${qrn}`,
                'printable-quotation-doc',
                <div id="printable-quotation-doc" className="p-8 bg-white max-w-2xl mx-auto space-y-6 text-slate-900 font-sans border border-slate-200 shadow-lg rounded-xl">
                  {/* Header Logo & Address */}
                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                    <div>
                      <div className="flex items-center gap-1 text-xl font-black tracking-tight">
                        <span className="text-blue-900">ACCUSTANDARD</span>
                        <span className="text-red-600 font-serif">RxD</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                        Medical and Diagnostic Supplies Corporation
                      </p>
                    </div>

                    <div className="text-right text-[10px] text-slate-600 space-y-0.5 font-medium">
                      <p>Unit A G/F El Decano Bldg., Blk 2 Lot 2</p>
                      <p>St. Jude, Villa Corazon, San Agustin</p>
                      <p>City of San Fernando, 2000, Pampanga</p>
                      <p>Tel: (045) 966-6097</p>
                    </div>
                  </div>

                  {/* Red/Blue Double Accent Rule */}
                  <div className="h-1 bg-gradient-to-r from-blue-900 via-red-600 to-blue-900 rounded-full" />

                  {/* QRN & Date Block */}
                  <div className="flex justify-between items-start text-xs font-bold">
                    <div className="space-y-1">
                      <p className="font-extrabold text-slate-900">{clientName}</p>
                      <p className="text-slate-700">{clientFacility}</p>
                      <p className="text-slate-500 font-normal text-[11px] max-w-xs">{clientAddress}</p>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="font-black text-blue-900 font-mono">QUOTATION: {qrn}</p>
                      <p className="text-slate-600">{quotationDate}</p>
                    </div>
                  </div>

                  {/* Greetings */}
                  <div className="text-xs text-slate-700 space-y-1 italic font-medium">
                    <p>Greetings from Accustandard!</p>
                    <p>We are delighted to submit our price proposal for the supply and delivery of the following:</p>
                  </div>

                  {/* Product Table */}
                  <table className="w-full text-xs text-left border-collapse border border-slate-200">
                    <thead className="bg-blue-900 text-white font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-2.5">PRODUCT DESCRIPTION</th>
                        <th className="p-2.5 text-center">PACKAGING</th>
                        <th className="p-2.5 text-right">UNIT PRICE (₱)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">{itemDescription}</td>
                        <td className="p-2.5 text-center font-mono">{packaging}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                          {unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Terms & Conditions */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-[11px]">
                    <span className="font-black text-slate-900 uppercase block tracking-wider text-[10px]">
                      TERMS AND CONDITIONS:
                    </span>
                    <p><strong className="text-slate-800">DELIVERY:</strong> 30-60 days from date of receipt of Purchase Order.</p>
                    <p><strong className="text-slate-800">PAYMENT:</strong> Thirty (30) days upon invoice date.</p>
                    <p><strong className="text-slate-800">PROPOSAL VALIDITY:</strong> This quotation is valid for thirty (30) days, thereafter subject to reconfirmation.</p>
                  </div>

                  {/* Sign-off */}
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
                    <div className="space-y-1 text-slate-600 text-[10px]">
                      <p>Thank you for considering our quotation.</p>
                      <p>We look forward to the opportunity to serve you.</p>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold">Respectfully,</p>
                      <div className="pt-4">
                        <p className="font-bold text-slate-900">Katherine M. Payumo, RMT</p>
                        <p className="text-[10px] text-slate-500 font-medium">Product Marketing Manager</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official A4 Quotation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
