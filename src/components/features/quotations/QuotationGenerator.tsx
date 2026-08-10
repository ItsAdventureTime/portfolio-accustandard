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
  const [activeSubTab, setActiveSubTab] = useState<'QUOTE' | 'RFQ' | 'ROI'>('QUOTE');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeQuote = quotationsList.length > 0 ? quotationsList[selectedIndex] || quotationsList[0] : null;

  // Active Quotation State (Dynamic with fallback)
  const qrn = activeQuote?.qrn || 'QRN20240415037';
  const quotationDate = activeQuote?.quotationDate || 'April 15, 2026';
  const clientName = activeQuote?.clientName || 'Ms. Katherine Porciuncula';
  const clientFacility = activeQuote?.clientFacility || activeQuote?.facilityName || 'Allied Care Experts Medical Center';
  const clientAddress = activeQuote?.clientAddress || activeQuote?.address || 'Lot 2975, C-1 Doña Remedios Trinidad Hwy, Baliuag, Bulacan';

  const itemDescription = activeQuote?.itemDescription || 'Calibration Sticks Bact Alert';
  const packaging = activeQuote?.packaging || '1 Kit';
  const unitPrice = activeQuote?.unitPrice || 31500.0;

  // Marketing ROI Calculator State
  const [roiCensus, setRoiCensus] = useState(180);
  const [roiContractMonths, setRoiContractMonths] = useState(36);
  const [roiLandedCost, setRoiLandedCost] = useState(24500);
  const [roiLisedFee, setRoiLisedFee] = useState(3500);
  const [roiProposedPrice, setRoiProposedPrice] = useState(42000);

  const calculateRoiMargin = () => {
    const totalCost = roiLandedCost + roiLisedFee;
    const profit = roiProposedPrice - totalCost;
    const marginPct = (profit / roiProposedPrice) * 100;
    return { totalCost, profit, marginPct };
  };

  const { totalCost, profit, marginPct } = calculateRoiMargin();

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
      {/* Top Header Block */}
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
            Sales Quotation &amp; Demand Qualification Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            RFQ Creation &bull; Marketing ROI Calculator &bull; 3-Day FEFO Stock Reservation &bull; A4 PDF Printing
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

      {/* Sub-Tab Navigation */}
      <div className="bg-slate-200/70 p-1.5 rounded-2xl flex flex-wrap gap-1.5 w-fit border border-slate-300/80 shadow-2xs">
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
          <UserCheck className="w-4 h-4" />
          <span>RFQ / Demand Requests ({rfqList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ROI')}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer ${
            activeSubTab === 'ROI'
              ? 'bg-blue-900 text-white shadow-md scale-100'
              : 'text-slate-700 hover:text-slate-950 hover:bg-slate-300/60'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>Marketing ROI Calculator</span>
        </button>
      </div>

      {/* Sub-Tab 1: Official Sales Quotation Document */}
      {activeSubTab === 'QUOTE' && (
        <div className="space-y-4">
          {quotationsList.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3.5 gap-2 shadow-2xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">Select Quotation Document:</span>
                <select
                  value={selectedIndex}
                  onChange={(e) => setSelectedIndex(Number(e.target.value))}
                  className="bg-white border border-slate-300 font-extrabold text-xs rounded-lg px-3 py-1.5 text-blue-900 focus:outline-none focus:border-blue-700 shadow-2xs"
                >
                  {quotationsList.map((q, idx) => (
                    <option key={q.id || idx} value={idx}>
                      {q.qrn} — {q.clientFacility || q.clientName || 'Quotation'} (₱{Number(q.totalPrice || q.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })})
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-xs text-slate-500 font-bold">{quotationsList.length} Active System Quote(s)</span>
            </div>
          )}

          {quotationDocumentContent}
        </div>
      )}

      {activeSubTab === 'RFQ' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900">
            <p className="font-bold flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-blue-700" />
              Sales Demand Qualification Workflow (Blueprint Section 1)
            </p>
            <p className="mt-1 text-blue-800">
              Sales Agents create RFQs by specifying client census, LIS connectivity, and expected contract terms.
              Sales Officers cannot set pricing or approve their own quotes.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                    <tr key={rfq.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-mono font-extrabold text-blue-900">{rfq.rfqNo}</td>
                      <td className="p-4 font-bold text-slate-900">{rfq.customerName}</td>
                      <td className="p-4 text-slate-700">{rfq.requestedBy}</td>
                      <td className="p-4 text-center font-mono font-bold text-slate-900">{rfq.censusPerDay} / day</td>
                      <td className="p-4 text-center">
                        {rfq.lisConnectivity ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">Yes</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded">No</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-slate-800">{rfq.expectedContractMonths} Months</td>
                      <td className="p-4">
                        {rfq.marketingRoiStatus === 'ROI_COMPLETED' ? (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                            ROI Calculated ({rfq.expectedMarginPct}%)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
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

      {activeSubTab === 'ROI' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              Marketing Manager ROI &amp; Margin Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Side-by-side cost vs. selling price comparison including landed cost, sponsorship, LIS connectivity, and contract margin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">Client &amp; Cost Inputs</h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expected Daily Sample Census</label>
                <input
                  type="number"
                  value={roiCensus}
                  onChange={(e) => setRoiCensus(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Batch Landed Cost (₱)</label>
                <input
                  type="number"
                  value={roiLandedCost}
                  onChange={(e) => setRoiLandedCost(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">LIS &amp; Account Overhead (₱)</label>
                <input
                  type="number"
                  value={roiLisedFee}
                  onChange={(e) => setRoiLisedFee(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Proposed Selling Price (₱)</label>
                <input
                  type="number"
                  value={roiProposedPrice}
                  onChange={(e) => setRoiProposedPrice(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-semibold text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-4 bg-emerald-50/50 p-5 rounded-xl border border-emerald-200 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-emerald-950 text-sm border-b border-emerald-200 pb-2 flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-emerald-700" />
                  Calculated ROI &amp; Contract Margin
                </h4>

                <div className="space-y-3 mt-4 text-sm font-semibold text-slate-800">
                  <div className="flex justify-between">
                    <span>Total Cost of Goods &amp; Overhead:</span>
                    <span className="font-mono font-bold text-slate-900">
                      ₱{totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Proposed Selling Price:</span>
                    <span className="font-mono font-bold text-blue-900">
                      ₱{roiProposedPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-emerald-200 pt-3 text-base">
                    <span className="font-bold text-emerald-950">Net Margin Profit / Unit:</span>
                    <span className="font-mono font-extrabold text-emerald-800">
                      ₱{profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-700 text-white rounded-xl text-center space-y-1 shadow-sm">
                <p className="text-xs uppercase font-bold text-emerald-200">Expected Contract Margin</p>
                <p className="text-3xl font-black font-mono">{marginPct.toFixed(1)}%</p>
                <p className="text-[11px] text-emerald-100">Approved for General Manager &amp; Chairman Review</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
