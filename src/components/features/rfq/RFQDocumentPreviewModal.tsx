'use client';

import React from 'react';
import { X, Printer, Download, CheckCircle2, Building2, UserCheck, ShieldCheck, FileCheck } from 'lucide-react';
import { AccustandardLogo } from '@/components/brand/AccustandardLogo';

interface RFQDocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfqData?: any;
}

export const RFQDocumentPreviewModal: React.FC<RFQDocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  rfqData = {},
}) => {
  if (!isOpen) return null;

  const data = {
    rfqNo: rfqData.rfqNo || 'RFQ-2026-0081',
    date: rfqData.date || 'August 10, 2026',
    facilityName: rfqData.customerName || 'Allied Care Experts (ACE) Medical Center',
    address: rfqData.address || 'Lot 2975, C-1 Doña Remedios Trinidad Hwy, Baliuag, Bulacan, Region III',
    addressee: rfqData.addressee || 'Dr. Amalia Santos',
    addresseePosition: rfqData.addresseePosition || 'Medical Director',
    medTech: rfqData.medTech || 'Chief Med Tech: Ms. Katherine Porciuncula, RMT',
    pathologist: rfqData.pathologist || 'Pathologist: Dr. Roberto V. Ramos, MD',
    contactPerson: rfqData.contactPerson || 'Mr. Jonathan Cruz (Procurement)',
    contactNumber: rfqData.contactNumber || '+63 917 555 0192',
    email: rfqData.email || 'procurement@acemedical.com.ph',
    ownership: rfqData.ownership || 'Private',
    character: rfqData.character || 'Hospital (150-Bed Level 2)',
    setupType: rfqData.setupType || 'Reagent Tie-Up (RTU) Upgrade',
    categories: rfqData.categories || [
      { name: 'Chemistry', selected: true, machine: 'Lifotronic H8', census: 20 },
      { name: 'Electrolytes', selected: false, machine: '-', census: 0 },
      { name: 'HbA1c', selected: true, machine: 'H8 HPLC Column', census: 20 },
      { name: 'Hematology', selected: true, machine: 'Sysmex XN-550', census: 35 },
      { name: 'Immunology', selected: false, machine: '-', census: 0 },
      { name: 'Microscopy (UA)', selected: false, machine: '-', census: 0 },
    ],
    dailyCensus: rfqData.dailyCensus || 180,
    existingMachine: rfqData.existingMachine || 'Bio-Rad D-10 Dual Program',
    existingSupplier: rfqData.existingSupplier || 'Legacy Bio-Tech Philippines',
    contractYears: rfqData.contractYears || '3 Years',
    specialRequest: rfqData.specialRequest || 'Includes LIS Connectivity, 1-year PMS preventive maintenance, and 24/7 on-call technical service response.',
    remarks: rfqData.remarks || 'Client requests delivery and installation within 14 calendar days upon approval.',
    requestor: rfqData.requestedBy || 'Sales Officer (Mark Santos)',
    hasCensusAttachment: rfqData.hasCensusAttachment ?? true,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Official RFQ Document Template Modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-300 my-auto text-slate-900 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out flex flex-col max-h-[92vh]">
        {/* Header Block Matching Screenshot 2 Design System */}
        <div className="p-6 sm:p-7 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-900 text-white rounded-2xl shrink-0 shadow-md">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wider text-slate-900 uppercase">
                ACCUSTANDARD OFFICIAL REQUEST FOR QUOTATION (RFQ FORM)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                Matches exact structure &amp; branding of <strong className="text-slate-900">RFQ Form.pdf</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center gap-1.5 transition shadow-md cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print PDF</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close RFQ Preview"
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body Container */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm bg-slate-50/50">
          {/* Printable A4 Page Frame */}
          <div className="bg-white border border-slate-300 shadow-md p-6 sm:p-10 space-y-6 rounded-2xl max-w-3xl mx-auto font-sans text-slate-900">
            {/* Header Identity */}
            <div className="border-b-2 border-blue-900 pb-4 flex justify-between items-start">
              <div>
                <AccustandardLogo size="md" />
                <p className="text-[11px] font-bold text-slate-600 mt-1 uppercase tracking-wider">
                  AccuStandard Medical &amp; Diagnostic Supplies Corp.
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Marketing &amp; Product Management Department &bull; Client Request Reference
                </p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-blue-900 text-white text-xs font-black rounded-lg uppercase tracking-wider inline-block">
                  Request for Quotation
                </span>
                <p className="text-xs font-mono font-bold text-slate-800 mt-1">Ref No: {data.rfqNo}</p>
                <p className="text-[11px] text-slate-500 font-semibold">Date: {data.date}</p>
              </div>
            </div>

            {/* Section 1: Health Facility & Contact Persons */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-950 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200/80">
                1. Health Facility &amp; Quotation Addressee
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-bold block">Name of Health Facility:</span>
                  <span className="font-extrabold text-slate-900 text-sm">{data.facilityName}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Ownership &amp; Character:</span>
                  <span className="font-bold text-slate-800">{data.ownership} &bull; {data.character}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 font-bold block">Full Address:</span>
                  <span className="font-semibold text-slate-800">{data.address}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Quotation Addressee &amp; Title:</span>
                  <span className="font-bold text-slate-900">{data.addressee} ({data.addresseePosition})</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Contact Person:</span>
                  <span className="font-semibold text-slate-800">{data.contactPerson} ({data.contactNumber})</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Chief Medical Technologist:</span>
                  <span className="font-semibold text-slate-800">{data.medTech}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Pathologist:</span>
                  <span className="font-semibold text-slate-800">{data.pathologist}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Setup Type & Test Category Selections */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-950 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200/80">
                2. Setup Type &amp; Test Category Selections
              </h3>
              <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex justify-between items-center">
                <span>Selected Acquisition Mode: <strong className="text-blue-900">{data.setupType}</strong></span>
                <span>Contract Duration: <strong className="text-blue-900">{data.contractYears}</strong></span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-semibold">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="p-2">Test Category</th>
                      <th className="p-2 text-center">Requested</th>
                      <th className="p-2">Proposed Machine / SKU</th>
                      <th className="p-2 text-right">Daily Test Census</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.categories.map((cat: any, idx: number) => (
                      <tr key={idx} className={cat.selected ? 'bg-blue-50/40' : ''}>
                        <td className="p-2 font-bold text-slate-900">{cat.name}</td>
                        <td className="p-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${cat.selected ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-100 text-slate-500'}`}>
                            {cat.selected ? 'YES' : 'NO'}
                          </span>
                        </td>
                        <td className="p-2 font-mono text-slate-800">{cat.machine}</td>
                        <td className="p-2 text-right font-mono font-bold text-slate-900">{cat.census || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Existing Equipment & Supplier Notes */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-950 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200/80">
                3. Facility Census &amp; Existing Supplier Context
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Laboratory Census</span>
                  <span className="font-mono font-black text-slate-900 text-base">{data.dailyCensus} tests / day</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Existing Machine</span>
                  <span className="font-bold text-slate-800">{data.existingMachine}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Existing Supplier</span>
                  <span className="font-bold text-slate-800">{data.existingSupplier}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold text-slate-700 block">Special Requests &amp; Payment Deals:</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 leading-relaxed">
                  {data.specialRequest}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">Remarks &amp; Delivery Timeline:</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 leading-relaxed">
                  {data.remarks}
                </p>
              </div>
            </div>

            {/* Section 4: RTU Census Attachment Verification */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-950 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>3-Month Validated Test Census Attachment:</span>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold rounded-lg text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                Attached &amp; Verified
              </span>
            </div>

            {/* Signatures Footer */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-6 text-xs">
              <div>
                <span className="text-slate-500 font-bold block mb-6">Requested &amp; Submitted By:</span>
                <div className="border-b border-slate-400 font-extrabold text-slate-900 pb-1">{data.requestor}</div>
                <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">AccuStandard Sales Officer</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block mb-6">Approved for Marketing ROI Review:</span>
                <div className="border-b border-slate-400 font-extrabold text-slate-900 pb-1">Marketing Reviewer (Aila)</div>
                <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">AccuStandard Marketing Manager</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
