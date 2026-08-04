'use client';

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Send,
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
  // Sample Quotation State matching Screenshot 2
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
    <div id="printable-quotation-target" className="bg-white p-8 sm:p-12 text-slate-900 font-sans max-w-4xl mx-auto border border-slate-300 shadow-md rounded-xl space-y-6 relative">
      {/* Top Header Block matching Screenshot 2 */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <AccustandardLogo size="lg" />
        </div>

        <div className="text-left sm:text-right text-xs text-slate-700 font-semibold leading-snug space-y-0.5">
          <p>Unit A G/F El Decano Bldg., Blk 2 Lot 2</p>
          <p>St. Jude, Villa Corazon, San Agustin,</p>
          <p>City of San Fernando, 2000, Pampanga</p>
        </div>
      </div>

      {/* Double Horizontal Accent Line (Blue + Red) */}
      <div className="space-y-0.5">
        <div className="h-1 bg-blue-900 w-full" />
        <div className="h-0.5 bg-red-600 w-full" />
      </div>

      {/* Quotation Ref & Date (Right Aligned) */}
      <div className="text-right text-xs font-bold text-slate-900 space-y-0.5">
        <p><span className="uppercase">QUOTATION:</span> <span className="font-mono">{qrn}</span></p>
        <p>{quotationDate}</p>
      </div>

      {/* Recipient Details Block matching Screenshot 2 */}
      <div className="space-y-0.5 text-xs text-slate-900">
        <p className="font-bold text-sm">{clientName}</p>
        <p className="font-bold">{clientFacility}</p>
        <p className="text-slate-700">{clientAddress}</p>
      </div>

      {/* Salutation Block */}
      <div className="text-xs space-y-1.5 text-slate-900">
        <p className="italic font-semibold">Greetings from Accustandard!</p>
        <p className="font-medium">We are delighted to submit our price proposal for the supply and delivery of the following:</p>
      </div>

      {/* Product Description Table matching Dark Blue Header in Screenshot 2 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse border border-slate-300">
          <thead className="bg-[#002060] text-white font-extrabold uppercase tracking-wider">
            <tr>
              <th className="p-3 border border-slate-300">PRODUCT DESCRIPTION</th>
              <th className="p-3 border border-slate-300 text-center">PACKAGING</th>
              <th className="p-3 border border-slate-300 text-right">UNIT PRICE</th>
            </tr>
          </thead>
          <tbody className="font-bold text-slate-900">
            <tr>
              <td className="p-3 border border-slate-300">{itemDescription}</td>
              <td className="p-3 border border-slate-300 text-center">{packaging}</td>
              <td className="p-3 border border-slate-300 text-right font-mono">
                {unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Terms and Conditions Block matching Screenshot 2 */}
      <div className="space-y-2 text-xs text-slate-900 pt-2">
        <p className="font-extrabold uppercase">TERMS AND CONDITIONS:</p>
        <div className="space-y-1 font-semibold text-slate-800 leading-relaxed">
          <p><span className="font-bold uppercase">DELIVERY:</span> 30-60 days from date of receipt of Purchase Order.</p>
          <p><span className="font-bold uppercase">PAYMENT:</span> Thirty (30) days upon invoice date</p>
          <p><span className="font-bold uppercase">PROPOSAL VALIDITY:</span> This quotation is valid for thirty (30) days, thereafter subject to reconfirmation.</p>
        </div>
        <p className="pt-2 font-medium">Thank you for considering our quotation. We look forward to the opportunity to serve you.</p>
      </div>

      {/* Sign-off Block */}
      <div className="pt-6 space-y-4 text-xs text-slate-900">
        <p className="font-medium">Respectfully,</p>

        {/* Signature Line */}
        <div className="pt-4 space-y-0.5">
          <p className="font-extrabold text-sm border-b border-slate-400 w-fit pb-0.5">Katherine M. Payumo, RMT</p>
          <p className="text-slate-700 font-semibold">Product Marketing Manager</p>
        </div>
      </div>

      {/* Bottom Footer Accent Bar (Blue + Red Double Line) */}
      <div className="pt-8 space-y-3">
        <div className="space-y-0.5">
          <div className="h-1 bg-blue-900 w-full" />
          <div className="h-0.5 bg-red-600 w-full" />
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-700 font-semibold">
          <div>
            <p>Email: accustandard1024@gmail.com</p>
            <p>Tel and Tel no.: (045) 966 6097</p>
          </div>
          <div>
            <p>Page 1 of 1</p>
          </div>
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
            Exact Replica of Official Quotation Template &bull; 3-Day Stock Reservation &bull; A4 Printable Output
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
