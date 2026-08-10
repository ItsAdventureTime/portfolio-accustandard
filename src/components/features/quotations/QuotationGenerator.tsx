'use client';

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Send,
  CheckCircle2,
  Calculator,
  UserCheck,
  Building2,
  DollarSign,
  PieChart,
  Eye,
  X,
  Clock,
  ShieldCheck,
  Zap,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

import { AccustandardLogo } from '@/components/brand/AccustandardLogo';

interface QuotationGeneratorProps {
  rfqList: any[];
  quotationsList?: any[];
  onOpenPrintModal: (title: string, elementId: string, content: React.ReactNode) => void;
  onOpenExportModal: (title: string, filename: string, data: object[], elementId?: string) => void;
  onOpenCreateModal: () => void;
  onSubmitForApproval: (qrn: string) => void;
  onShowNotification: (msg: string) => void;
  onAddAuditLog: (action: string) => void;
}

export const QuotationGenerator: React.FC<QuotationGeneratorProps> = ({
  rfqList,
  quotationsList = [],
  onOpenPrintModal,
  onOpenExportModal,
  onOpenCreateModal,
  onSubmitForApproval,
  onShowNotification,
  onAddAuditLog,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'QUOTE' | 'RFQ'>('QUOTE');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedRfqModal, setSelectedRfqModal] = useState<any | null>(null);
  const [isRoiModalOpen, setIsRoiModalOpen] = useState(false);

  const activeQuote = quotationsList.length > 0 ? quotationsList[selectedIndex] || quotationsList[0] : null;

  // Active Quotation State (Dynamic with fallback)
  const qrn = activeQuote?.qrn || 'QRN20240415037';
  const quotationDate = activeQuote?.quotationDate || 'April 15, 2026';
  const clientName = activeQuote?.clientName || 'Ms. Katherine Porciuncula';
  const clientFacility = activeQuote?.clientFacility || activeQuote?.facilityName || 'Allied Care Experts Medical Center';
  const clientAddress = activeQuote?.clientAddress || activeQuote?.address || 'Lot 2975, C-1 Doña Remedios Trinidad Hwy, Baliuag, Bulacan';

  const itemDescription = activeQuote?.itemDescription || 'Calibration Sticks Bact Alert';
  const packaging = activeQuote?.packaging || '1 Box of 40';
  const unitPrice = activeQuote?.unitPrice || 31500;

  // ROI Calculator State
  const [roiCensus, setRoiCensus] = useState(180);
  const [roiLandedCost, setRoiLandedCost] = useState(18000);
  const [roiLisedFee, setRoiLisedFee] = useState(3800);
  const [roiProposedPrice, setRoiProposedPrice] = useState(31500);

  const totalCost = roiLandedCost + roiLisedFee;
  const profit = roiProposedPrice - totalCost;
  const marginPct = roiProposedPrice > 0 ? (profit / roiProposedPrice) * 100 : 0;

  const quotationDocumentContent = (
    <div
      id="printableQuotationDoc"
      className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-md max-w-4xl mx-auto space-y-6 text-slate-900"
    >
      {/* Header Block with Corporate Dual Accents */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <AccustandardLogo size="md" />
        </div>

        <div className="text-left sm:text-right text-xs text-slate-700 font-semibold leading-snug space-y-0.5">
          <p>Unit A G/F El Decano Bldg., Blk 2 Lot 2</p>
          <p>St. Jude, Villa Corazon, San Agustin,</p>
          <p>City of San Fernando, 2000, Pampanga</p>
        </div>
      </div>

      {/* Double Horizontal Accent Line */}
      <div className="space-y-0.5">
        <div className="h-1 bg-blue-900 w-full" />
        <div className="h-0.5 bg-red-600 w-full" />
      </div>

      {/* Quotation Ref & Date */}
      <div className="text-right text-xs font-bold text-slate-900 space-y-0.5">
        <p><span className="uppercase">QUOTATION:</span> <span className="font-mono">{qrn}</span></p>
        <p>{quotationDate}</p>
      </div>

      {/* Recipient Details Block */}
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

      {/* Product Description Table */}
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

      {/* Terms and Conditions Block */}
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

        <div className="pt-4 space-y-0.5">
          <p className="font-extrabold text-sm border-b border-slate-400 w-fit pb-0.5">Katherine M. Payumo, RMT</p>
          <p className="text-slate-700 font-semibold">Product Marketing Manager</p>
        </div>
      </div>

      {/* Bottom Footer Accent Bar */}
      <div className="pt-8 space-y-3">
        <div className="space-y-0.5">
          <div className="h-1 bg-blue-900 w-full" />
          <div className="h-0.5 bg-red-600 w-full" />
        </div>
        <p className="text-[10px] text-center text-slate-500 font-mono">
          Accustandard Medical &amp; Diagnostic Supplies Corp. &bull; Official Quotation Document &bull; Generated via ERP Bridge
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-600" />
            Sales Quotation &amp; Demand Qualification Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            RFQ Creation &bull; Marketing ROI Calculator &bull; 3-Day FEFO Stock Reservation &bull; A4 PDF Printing
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4 text-amber-400" />
            <span>+ Create / Request Sales Quote</span>
          </button>

          <button
            onClick={() => onSubmitForApproval(qrn)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit for Approval</span>
          </button>

          <button
            onClick={() => onOpenPrintModal(`Official Sales Quotation - ${qrn}`, 'printableQuotationDoc', quotationDocumentContent)}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Quotation</span>
          </button>

          <button
            onClick={() => onOpenExportModal(`Quotation ${qrn}`, `Quotation_${qrn}`, quotationsList, 'printableQuotationDoc')}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Quote...</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar & ROI Popup Trigger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="bg-slate-200/70 p-1.5 rounded-2xl flex gap-1.5 w-fit border border-slate-300/80 shadow-2xs">
          <button
            onClick={() => setActiveSubTab('QUOTE')}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer ${
              activeSubTab === 'QUOTE'
                ? 'bg-blue-900 text-white shadow-md scale-100'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-300/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Official Sales Quotation Document</span>
          </button>

          <button
            onClick={() => setActiveSubTab('RFQ')}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer ${
              activeSubTab === 'RFQ'
                ? 'bg-blue-900 text-white shadow-md scale-100'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-300/60'
            }`}
          >
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>RFQ / Demand Requests ({rfqList.length})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsRoiModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-md cursor-pointer transition active:scale-95 border border-emerald-600"
          title="Click to launch interactive Marketing Manager ROI & Contract Margin Calculator Popup"
        >
          <Calculator className="w-4 h-4 text-emerald-200" />
          <span>Launch Marketing ROI Calculator</span>
        </button>
      </div>

      {/* Sub-Tab 1: Official Sales Quotation Document */}
      {activeSubTab === 'QUOTE' && (
        <div className="space-y-4">
          {quotationsList.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-4 gap-3 shadow-2xs">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-black text-xs text-slate-800 uppercase tracking-wider">Select Quotation Document:</span>
                <select
                  value={selectedIndex}
                  onChange={(e) => setSelectedIndex(Number(e.target.value))}
                  className="bg-white border border-slate-300 font-extrabold text-xs sm:text-sm rounded-xl px-4 py-2 text-blue-950 focus:outline-none focus:border-blue-700 shadow-2xs cursor-pointer"
                >
                  {quotationsList.map((q, idx) => (
                    <option key={q.id || idx} value={idx}>
                      {q.qrn} — {q.clientFacility || q.clientName || 'Quotation'} (₱{Number(q.totalPrice || q.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })})
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-xs text-slate-600 font-bold">{quotationsList.length} Active System Quote(s)</span>
            </div>
          )}

          <div className="bg-slate-100/90 p-2.5 sm:p-6 rounded-3xl border border-slate-300 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
              <span className="uppercase tracking-wider font-extrabold text-[11px] text-slate-700">Official Sales Quotation Document Preview</span>
              <span className="block sm:hidden text-blue-900 font-extrabold text-[10px] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                &larr; Pinch to zoom / Swipe document &rarr;
              </span>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-white p-2 sm:p-4 shadow-sm flex justify-start sm:justify-center">
              {quotationDocumentContent}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'RFQ' && (
        <div className="space-y-5">
          <div className="p-4 sm:p-5 bg-blue-50 border border-blue-200/90 rounded-2xl text-xs sm:text-sm text-blue-950 font-semibold space-y-2 shadow-2xs">
            <p className="font-black flex items-center gap-2 text-sm sm:text-base text-blue-950 uppercase tracking-wider">
              <UserCheck className="w-5 h-5 text-blue-700 shrink-0" />
              Sales Demand Qualification Workflow (Blueprint Section 1)
            </p>
            <p className="text-blue-900 font-semibold leading-relaxed">
              Sales Agents create RFQs by specifying client sample census, LIS connectivity requirements, and expected contract terms.
              Sales Officers cannot set pricing or approve their own quotes.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="block sm:hidden text-[11px] text-slate-500 font-extrabold text-center py-1.5 bg-slate-100/90 border-b border-slate-200 uppercase tracking-wider">
              &larr; Swipe table horizontally for details &rarr;
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs">
                  <tr>
                    <th className="p-4">RFQ Ref #</th>
                    <th className="p-4">Customer Facility</th>
                    <th className="p-4">Sales Agent</th>
                    <th className="p-4 text-center">Daily Census</th>
                    <th className="p-4 text-center">LIS Needed</th>
                    <th className="p-4 text-right">Contract Term</th>
                    <th className="p-4">Marketing ROI Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
                  {rfqList.map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-blue-50/50 transition group">
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => setSelectedRfqModal(rfq)}
                          className="font-extrabold font-mono text-blue-950 bg-blue-50/90 border border-blue-200/90 hover:bg-blue-900 hover:text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs group cursor-pointer"
                          title="Click to inspect Sales RFQ document details & COSO approval status"
                        >
                          <FileText className="w-4 h-4 text-blue-700 group-hover:text-blue-200 shrink-0" />
                          <span>{rfq.rfqNo}</span>
                          <Eye className="w-3.5 h-3.5 text-blue-600 group-hover:text-white shrink-0 ml-0.5 opacity-80 group-hover:opacity-100" />
                        </button>
                      </td>
                      <td className="p-4 font-extrabold text-slate-900 text-sm sm:text-base">{rfq.customerName}</td>
                      <td className="p-4 text-slate-700 text-xs sm:text-sm font-semibold">{rfq.requestedBy}</td>
                      <td className="p-4 text-center font-mono font-black text-slate-900 text-sm sm:text-base">{rfq.censusPerDay} / day</td>
                      <td className="p-4 text-center">
                        {rfq.lisConnectivity ? (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-extrabold rounded-xl inline-block shadow-2xs">Yes</span>
                        ) : (
                          <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl inline-block shadow-2xs">No</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-mono font-black text-slate-900 text-sm sm:text-base">{rfq.expectedContractMonths} Months</td>
                      <td className="p-4">
                        {rfq.marketingRoiStatus === 'ROI_COMPLETED' ? (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-extrabold rounded-xl inline-block shadow-2xs">
                            ROI Calculated ({rfq.expectedMarginPct}%)
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold rounded-xl inline-block shadow-2xs">
                            Pending Marketing Review
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Marketing Manager ROI & Margin Financial Engine Popup Modal */}
      {isRoiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto text-slate-900 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl w-full max-w-4xl overflow-hidden p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out">
            {/* Header Block */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="p-3.5 bg-emerald-900 text-white rounded-2xl shadow-sm">
                  <Calculator className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wider">
                    Marketing Manager ROI &amp; Margin Financial Engine
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                    Real-time landed cost vs. proposed selling price, LIS overhead, contract margin %, and 30-day projected revenue
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-4 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs border ${
                  marginPct >= 30
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : marginPct >= 20
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-rose-100 text-rose-900 border-rose-300'
                }`}>
                  {marginPct >= 30 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  ) : marginPct >= 20 ? (
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-700" />
                  )}
                  {marginPct >= 30 ? 'Target Margin Qualified' : marginPct >= 20 ? 'Standard Review Margin' : 'Low Margin Alert'}
                </span>

                <button
                  type="button"
                  onClick={() => setIsRoiModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Quick Census Scenario Presets */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/90 text-xs font-semibold">
              <span className="font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                Quick Client Facility Census Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setRoiCensus(80)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                    roiCensus === 80
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Small Clinic (80/day)
                </button>
                <button
                  type="button"
                  onClick={() => setRoiCensus(180)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                    roiCensus === 180
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Regional Hospital (180/day)
                </button>
                <button
                  type="button"
                  onClick={() => setRoiCensus(350)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                    roiCensus === 350
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Medical Center (350/day)
                </button>
                <button
                  type="button"
                  onClick={() => setRoiCensus(500)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                    roiCensus === 500
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  High Volume Lab (500/day)
                </button>
              </div>
            </div>

            {/* Calculator Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Inputs Column */}
              <div className="lg:col-span-5 bg-slate-50/90 p-5 rounded-3xl border border-slate-300/80 space-y-4">
                <h4 className="font-black text-slate-900 text-xs sm:text-sm uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  Client &amp; Unit Cost Parameters
                </h4>

                <div className="space-y-3.5 text-sm font-semibold">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wider">
                      Expected Daily Sample Census
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={roiCensus}
                        onChange={(e) => setRoiCensus(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-mono font-black text-base text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                        min="1"
                      />
                      <span className="absolute right-4 top-2.5 text-xs text-slate-500 font-bold">samples / day</span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      Est. Monthly Volume: <span className="font-mono font-bold text-slate-900">{(roiCensus * 30).toLocaleString()} samples / mo</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wider">
                      Batch Landed Cost (₱)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-2.5 text-sm font-black text-slate-400">₱</span>
                      <input
                        type="number"
                        value={roiLandedCost}
                        onChange={(e) => setRoiLandedCost(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 font-mono font-black text-base text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wider">
                      LIS &amp; Account Overhead (₱)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-2.5 text-sm font-black text-slate-400">₱</span>
                      <input
                        type="number"
                        value={roiLisedFee}
                        onChange={(e) => setRoiLisedFee(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 font-mono font-black text-base text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-blue-950 mb-1 uppercase tracking-wider">
                      Proposed Selling Price (₱)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-2.5 text-sm font-black text-blue-700">₱</span>
                      <input
                        type="number"
                        value={roiProposedPrice}
                        onChange={(e) => setRoiProposedPrice(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-white border border-blue-300 rounded-xl pl-9 pr-4 py-2.5 font-mono font-black text-lg text-blue-950 focus:outline-none focus:border-blue-600 shadow-2xs"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Financial Results Dashboard */}
              <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-300/80 shadow-sm space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 text-xs sm:text-sm uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-emerald-700" />
                    Calculated Profitability &amp; Financial Summary
                  </h4>

                  {/* 4 Metric Cards Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-0.5">
                      <span className="text-[11px] text-slate-500 font-extrabold uppercase tracking-wider block">Total Unit Cost</span>
                      <p className="font-mono font-black text-sm sm:text-base text-slate-900">
                        ₱{totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200/90 space-y-0.5">
                      <span className="text-[11px] text-emerald-800 font-extrabold uppercase tracking-wider block">Unit Net Profit</span>
                      <p className="font-mono font-black text-sm sm:text-base text-emerald-900">
                        ₱{profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200/90 space-y-0.5">
                      <span className="text-[11px] text-blue-800 font-extrabold uppercase tracking-wider block">30-Day Revenue</span>
                      <p className="font-mono font-black text-sm sm:text-base text-blue-950">
                        ₱{(roiProposedPrice * roiCensus * 30).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="p-3.5 bg-purple-50/80 rounded-2xl border border-purple-200/90 space-y-0.5">
                      <span className="text-[11px] text-purple-800 font-extrabold uppercase tracking-wider block">30-Day Net Profit</span>
                      <p className="font-mono font-black text-sm sm:text-base text-purple-950">
                        ₱{(profit * roiCensus * 30).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* Visual Contract Margin Gauge Card */}
                  <div className={`p-4 rounded-2xl border text-white space-y-2.5 shadow-md ${
                    marginPct >= 30
                      ? 'bg-slate-900 border-emerald-500'
                      : marginPct >= 20
                      ? 'bg-slate-900 border-amber-500'
                      : 'bg-slate-900 border-rose-500'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-300">Expected Contract Margin</span>
                      <span className="text-[11px] font-mono font-bold text-slate-400">Target: &ge; 30.0%</span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className={`text-3xl font-black font-mono ${
                        marginPct >= 30 ? 'text-emerald-400' : marginPct >= 20 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {marginPct.toFixed(1)}%
                      </span>
                      <span className="text-xs font-extrabold text-slate-300">
                        ₱{profit.toLocaleString('en-US', { minimumFractionDigits: 2 })} / unit
                      </span>
                    </div>

                    {/* Progress Bar Meter */}
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          marginPct >= 30 ? 'bg-emerald-500' : marginPct >= 20 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, marginPct))}%` }}
                      />
                    </div>

                    {/* Policy Guidance Text */}
                    <p className="text-xs text-slate-300 font-semibold pt-0.5">
                      {marginPct >= 30 ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          Qualified for Fast-Track GM &amp; Chairman Approval
                        </span>
                      ) : marginPct >= 20 ? (
                        <span className="text-amber-400 font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          Standard Review Margin — Requires General Manager Sign-off
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 shrink-0" />
                          Low Margin Warning — Triggers Required DCS Chairman Review
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-4 flex justify-between items-center border-t border-slate-200 gap-3">
              <button
                type="button"
                onClick={() => {
                  onShowNotification(`Applied ROI Proposed Unit Price ₱${roiProposedPrice.toLocaleString()} to Quotation!`);
                  onAddAuditLog(`Calculated ROI for census ${roiCensus}/day yielding ${marginPct.toFixed(1)}% margin`);
                  setIsRoiModalOpen(false);
                }}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer border border-emerald-600"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Apply Calculation to Active Quote</span>
              </button>

              <button
                type="button"
                onClick={() => setIsRoiModalOpen(false)}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-2xl transition cursor-pointer"
              >
                Close Calculator
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Sales RFQ Document Inspector Modal */}
      {selectedRfqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto text-slate-900 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl w-full max-w-3xl overflow-hidden p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-900 text-white rounded-2xl shadow-sm">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wider">
                    Sales RFQ Document Inspector — {selectedRfqModal.rfqNo}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                    {selectedRfqModal.customerName} &bull; Created by {selectedRfqModal.requestedBy}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRfqModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Document Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/90 text-sm font-semibold">
              <div>
                <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider block mb-1">Customer Facility</span>
                <p className="font-black text-slate-900">{selectedRfqModal.customerName}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider block mb-1">Daily Sample Census</span>
                <p className="font-mono font-black text-blue-950">{selectedRfqModal.censusPerDay} samples / day</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider block mb-1">Expected Contract Term</span>
                <p className="font-mono font-black text-slate-900">{selectedRfqModal.expectedContractMonths} Months</p>
              </div>
            </div>

            {/* COSO Approval Audit Chain */}
            <div className="space-y-3">
              <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Internal Control Segregation Audit Timeline (COSO)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3.5 rounded-2xl border bg-emerald-50 border-emerald-300 text-emerald-950 space-y-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  <p className="font-extrabold text-sm">1. Maker</p>
                  <p className="text-xs font-bold">{selectedRfqModal.requestedBy}</p>
                </div>
                <div className={`p-3.5 rounded-2xl border space-y-1 ${selectedRfqModal.marketingRoiStatus === 'ROI_COMPLETED' ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-amber-50 border-amber-300 text-amber-950'}`}>
                  {selectedRfqModal.marketingRoiStatus === 'ROI_COMPLETED' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-600 mx-auto" />
                  )}
                  <p className="font-extrabold text-sm">2. Marketing</p>
                  <p className="text-xs font-bold">{selectedRfqModal.marketingRoiStatus === 'ROI_COMPLETED' ? 'ROI Calculated' : 'Pending Review'}</p>
                </div>
                <div className="p-3.5 rounded-2xl border bg-slate-100 border-slate-200 text-slate-500 space-y-1">
                  <Clock className="w-5 h-5 text-slate-400 mx-auto" />
                  <p className="font-extrabold text-sm">3. GM</p>
                  <p className="text-xs font-bold">Pending Approval</p>
                </div>
                <div className="p-3.5 rounded-2xl border bg-slate-100 border-slate-200 text-slate-500 space-y-1">
                  <Clock className="w-5 h-5 text-slate-400 mx-auto" />
                  <p className="font-extrabold text-sm">4. DCS</p>
                  <p className="text-xs font-bold">Pending Approval</p>
                </div>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="pt-4 flex justify-between items-center border-t border-slate-200 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedRfqModal(null);
                  setIsRoiModalOpen(true);
                }}
                className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-black text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>Calculate Marketing ROI</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRfqModal(null)}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-2xl transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
