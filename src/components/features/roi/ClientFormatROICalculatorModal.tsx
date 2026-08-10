'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, X, Save, Lock, ShieldCheck, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';

interface ClientFormatROICalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfqData?: any;
  onSaveROI?: (roiData: any) => void;
}

export const ClientFormatROICalculatorModal: React.FC<ClientFormatROICalculatorModalProps> = ({
  isOpen,
  onClose,
  rfqData,
  onSaveROI,
}) => {
  // Section 1 Inputs: Machine & Equipment
  const [machineUSD, setMachineUSD] = useState(6500);
  const [exchangeRate, setExchangeRate] = useState(65);
  const [shippingPct, setShippingPct] = useState(0.30); // 30%
  const [lisConnectivity, setLisConnectivity] = useState(250000);
  const [avrCost, setAvrCost] = useState(3500);
  const [upsCost, setUpsCost] = useState(2590);
  const [demoReagents, setDemoReagents] = useState(10000);
  const [representation, setRepresentation] = useState(2000);

  // Section 2 Inputs: Operating Assumptions
  const [dailyVolume, setDailyVolume] = useState(20);
  const [testsPerKit, setTestsPerKit] = useState(200);

  // Section 3 Inputs: Post-Installation Costs
  const [pmsCost, setPmsCost] = useState(30000);
  const [troubleshootingCost, setTroubleshootingCost] = useState(30000);
  const [sponsorshipCost, setSponsorshipCost] = useState(15000);
  const [christmasPartyCost, setChristmasPartyCost] = useState(20000);
  const [pametCost, setPametCost] = useState(21000);
  const [incentiveCost, setIncentiveCost] = useState(5000);
  const [salesCollectionCost, setSalesCollectionCost] = useState(147420);
  const [trainingCost, setTrainingCost] = useState(5000);

  // Section 4 Inputs: Per-SKU Pricing
  const [h8OfferPrice, setH8OfferPrice] = useState(62000);
  const [a1cOfferPrice, setA1cOfferPrice] = useState(3000);

  // Calculations (Exact workbook formulas from REVISED ROI_ACE PATEROS.xlsx)
  const calc = useMemo(() => {
    // Machine & Equipment
    const machinePHP = machineUSD * exchangeRate; // B5*D5 = 422,500
    const shippingFee = machinePHP * shippingPct; // E5*0.3 = 126,750
    const totalMachineCost = machinePHP + shippingFee; // G5+H5 = 549,250

    // Accessories & Upfront
    const accessoriesTotal = avrCost + upsCost + lisConnectivity; // 256,090
    const preInstallationTotal = demoReagents + representation; // 12,000
    const totalUpfrontInvestment = totalMachineCost + accessoriesTotal + preInstallationTotal; // I15 = 817,340

    // Operating Assumptions
    const monthlyVolume = dailyVolume * 26; // L9 = 520
    const kitsPerMonth = monthlyVolume / (testsPerKit || 1); // M9 = 2.6

    // Post-Installation Costs
    const sparePartsCost = machinePHP * 0.20; // G5*0.2 = 84,500
    const totalPostInstallation =
      pmsCost +
      troubleshootingCost +
      sparePartsCost +
      sponsorshipCost +
      christmasPartyCost +
      pametCost +
      incentiveCost +
      salesCollectionCost +
      trainingCost; // B32 = 357,920

    // SKU Economics (Landed Cost = NDP * FX / 0.70)
    const landedCostCoeff = 0.70;

    // SKU 1: H8 200 Test
    const h8Landed = (150 * exchangeRate) / landedCostCoeff; // E37 = 13,928.57
    const h8Tax = h8OfferPrice * 0.12; // G37 = 7,440
    const h8Net = h8OfferPrice - h8Tax; // H37 = 54,560
    const h8UnitMargin = h8Net - h8Landed; // I37 = 40,631.43
    const h8AnnualQty = 36;
    const h8TotalMargin = h8AnnualQty * h8UnitMargin; // L37 = 1,462,731.43

    // SKU 2: A1c Control
    const a1cLanded = (15 * exchangeRate) / landedCostCoeff; // E38 = 1,392.86
    const a1cTax = a1cOfferPrice * 0.12;
    const a1cNet = a1cOfferPrice - a1cTax;
    const a1cUnitMargin = a1cNet - a1cLanded;
    const a1cAnnualQty = 36;
    const a1cTotalMargin = a1cAnnualQty * a1cUnitMargin; // L38 = 44,897.14

    // SKU 3: Calibrator (Freebie/Included)
    const calLanded = (15 * exchangeRate) / landedCostCoeff;
    const calUnitMargin = -calLanded;
    const calAnnualQty = 12;
    const calTotalMargin = calAnnualQty * calUnitMargin; // L39 = -16,714.29

    // SKU 4: Column
    const colLanded = 18300;
    const colUnitMargin = -colLanded;
    const colAnnualQty = 4;
    const colTotalMargin = colAnnualQty * colUnitMargin; // L40 = -73,200

    // SKU 5: Diluting Cups
    const cupsLanded = 500;
    const cupsUnitMargin = -cupsLanded;
    const cupsAnnualQty = 12;
    const cupsTotalMargin = cupsAnnualQty * cupsUnitMargin; // L41 = -6,000

    const totalReagentMargin = h8TotalMargin + a1cTotalMargin + calTotalMargin + colTotalMargin + cupsTotalMargin; // L42 = 1,411,714.29
    const netAnnualContribution = totalReagentMargin - totalPostInstallation; // L44 = 1,053,794.29

    // ROI in Years = Upfront Investment / Net Annual Contribution
    const roiInYears = totalUpfrontInvestment / (netAnnualContribution || 1); // B46 = 0.7756 (0.78 Years)

    return {
      machinePHP,
      shippingFee,
      totalMachineCost,
      accessoriesTotal,
      preInstallationTotal,
      totalUpfrontInvestment,
      monthlyVolume,
      kitsPerMonth,
      sparePartsCost,
      totalPostInstallation,
      h8Landed,
      h8Tax,
      h8Net,
      h8UnitMargin,
      h8TotalMargin,
      a1cLanded,
      a1cTotalMargin,
      totalReagentMargin,
      netAnnualContribution,
      roiInYears,
    };
  }, [
    machineUSD,
    exchangeRate,
    shippingPct,
    lisConnectivity,
    avrCost,
    upsCost,
    demoReagents,
    representation,
    dailyVolume,
    testsPerKit,
    pmsCost,
    troubleshootingCost,
    sponsorshipCost,
    christmasPartyCost,
    pametCost,
    incentiveCost,
    salesCollectionCost,
    trainingCost,
    h8OfferPrice,
    a1cOfferPrice,
  ]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (onSaveROI) {
      onSaveROI({
        roiNo: `ROI-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        upfrontInvestment: calc.totalUpfrontInvestment,
        postInstallationExpense: calc.totalPostInstallation,
        grossReagentMargin: calc.totalReagentMargin,
        netAnnualContribution: calc.netAnnualContribution,
        roiYears: calc.roiInYears,
        h8PriceOffer: h8OfferPrice,
        a1cPriceOffer: a1cOfferPrice,
        status: 'ROI_COMPLETED',
      });
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Client-Format ROI Calculator Modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full border border-slate-300 my-auto text-slate-900 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out flex flex-col max-h-[92vh]">
        {/* Header Block Matching Screenshot 2 Design System */}
        <div className="p-6 sm:p-7 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-900 text-white rounded-2xl shrink-0 shadow-md">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-wider text-slate-900 uppercase">
                  CLIENT-FORMAT ROI CALCULATOR (REVISED ROI_ACE PATEROS)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-extrabold">
                  v1.0 Confirmed Formula Engine
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                Linked RFQ: <strong className="text-slate-900">{rfqData?.rfqNo || 'RFQ-2026-0081'}</strong> &bull; Client: <strong className="text-slate-900">{rfqData?.customerName || 'Allied Care Experts (ACE) Medical Center'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close ROI Modal"
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* Top Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 p-4 rounded-2xl border border-blue-200/80 shadow-2xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Total Upfront Investment</span>
              <span className="font-mono font-black text-slate-900 text-lg sm:text-xl">
                ₱{calc.totalUpfrontInvestment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Post-Installation Expense</span>
              <span className="font-mono font-bold text-amber-800 text-base sm:text-lg">
                ₱{calc.totalPostInstallation.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Net Annual Contribution</span>
              <span className="font-mono font-black text-blue-900 text-base sm:text-lg">
                ₱{calc.netAnnualContribution.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="space-y-0.5 bg-emerald-100/90 p-2.5 rounded-xl border border-emerald-300">
              <span className="text-[10px] font-black uppercase text-emerald-950 tracking-wider block flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                Payback Period (ROI in Years)
              </span>
              <span className="font-mono font-black text-emerald-950 text-xl sm:text-2xl">
                {calc.roiInYears.toFixed(2)} Years <span className="text-xs font-bold text-emerald-800">({(calc.roiInYears * 12).toFixed(1)} mos)</span>
              </span>
            </div>
          </div>

          {/* SECTION 1: Equipment & Installation Costs */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3 shadow-2xs">
            <h3 className="font-black text-sm uppercase text-slate-900 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-lg flex items-center justify-center text-xs">1</span>
              Equipment &amp; Installation Expenses (Upfront Investment)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Machine Cost (USD)</label>
                <input
                  type="number"
                  value={machineUSD}
                  onChange={(e) => setMachineUSD(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">FX Exchange Rate (PHP/USD)</label>
                <input
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Machine PHP Cost (Locked)</label>
                <input
                  type="text"
                  readOnly
                  value={`₱${calc.machinePHP.toLocaleString()}`}
                  className="w-full bg-slate-200/70 border border-slate-300 rounded-xl px-3 py-1.5 font-mono font-bold text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Shipping Fee (30% Locked)</label>
                <input
                  type="text"
                  readOnly
                  value={`₱${calc.shippingFee.toLocaleString()}`}
                  className="w-full bg-slate-200/70 border border-slate-300 rounded-xl px-3 py-1.5 font-mono font-bold text-slate-700 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">LIS Connectivity (PHP)</label>
                <input
                  type="number"
                  value={lisConnectivity}
                  onChange={(e) => setLisConnectivity(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">AVR &amp; UPS Cost (PHP)</label>
                <input
                  type="number"
                  value={avrCost + upsCost}
                  onChange={(e) => {
                    setAvrCost(Number(e.target.value) / 2);
                    setUpsCost(Number(e.target.value) / 2);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Demo Reagents &amp; Rep (PHP)</label>
                <input
                  type="number"
                  value={demoReagents + representation}
                  onChange={(e) => setDemoReagents(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtotal Equipment (I15)</label>
                <input
                  type="text"
                  readOnly
                  value={`₱${calc.totalUpfrontInvestment.toLocaleString()}`}
                  className="w-full bg-blue-100 border border-blue-300 rounded-xl px-3 py-1.5 font-mono font-black text-blue-950 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Operating Assumptions */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3 shadow-2xs">
            <h3 className="font-black text-sm uppercase text-slate-900 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-lg flex items-center justify-center text-xs">2</span>
              Operating &amp; Census Assumptions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Daily Test Census</label>
                <input
                  type="number"
                  value={dailyVolume}
                  onChange={(e) => setDailyVolume(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Volume (Daily &times; 26)</label>
                <input
                  type="text"
                  readOnly
                  value={calc.monthlyVolume}
                  className="w-full bg-slate-200/70 border border-slate-300 rounded-xl px-3 py-1.5 font-mono font-bold text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tests Per Kit</label>
                <input
                  type="number"
                  value={testsPerKit}
                  onChange={(e) => setTestsPerKit(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Required Kits / Month</label>
                <input
                  type="text"
                  readOnly
                  value={calc.kitsPerMonth.toFixed(2)}
                  className="w-full bg-blue-100 border border-blue-300 rounded-xl px-3 py-1.5 font-mono font-black text-blue-950 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Post-Installation / Account Costs */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3 shadow-2xs">
            <h3 className="font-black text-sm uppercase text-slate-900 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-lg flex items-center justify-center text-xs">3</span>
              Post-Installation / Account Expenses (Annual)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600">PMS Service</label>
                <input
                  type="number"
                  value={pmsCost}
                  onChange={(e) => setPmsCost(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600">Troubleshooting</label>
                <input
                  type="number"
                  value={troubleshootingCost}
                  onChange={(e) => setTroubleshootingCost(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600">Spare Parts (20% Machine Cost)</label>
                <input
                  type="text"
                  readOnly
                  value={`₱${calc.sparePartsCost.toLocaleString()}`}
                  className="w-full bg-slate-200/70 border border-slate-300 rounded-xl px-3 py-1 font-mono font-bold text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600">Sponsorship &amp; Team Building</label>
                <input
                  type="number"
                  value={sponsorshipCost}
                  onChange={(e) => setSponsorshipCost(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600">Christmas Party</label>
                <input
                  type="number"
                  value={christmasPartyCost}
                  onChange={(e) => setChristmasPartyCost(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600">PAMET Sponsorship</label>
                <input
                  type="number"
                  value={pametCost}
                  onChange={(e) => setPametCost(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600">Sales &amp; Collection</label>
                <input
                  type="number"
                  value={salesCollectionCost}
                  onChange={(e) => setSalesCollectionCost(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600">Training &amp; Incentive</label>
                <input
                  type="number"
                  value={trainingCost + incentiveCost}
                  onChange={(e) => setTrainingCost(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1 font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Per-SKU Economics */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3 shadow-2xs">
            <h3 className="font-black text-sm uppercase text-slate-900 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-900 rounded-lg flex items-center justify-center text-xs">4</span>
              Per-SKU Economics &amp; Landed Cost Margin Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-semibold">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                  <tr>
                    <th className="p-2.5">SKU Description</th>
                    <th className="p-2.5 text-right">NDP (USD)</th>
                    <th className="p-2.5 text-right">Landed Cost (PHP)</th>
                    <th className="p-2.5 text-right">Price Offer (PHP)</th>
                    <th className="p-2.5 text-right">Net Offer (Ex-Tax)</th>
                    <th className="p-2.5 text-right">Unit Margin</th>
                    <th className="p-2.5 text-right">Annual Qty</th>
                    <th className="p-2.5 text-right">Total Annual Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 font-extrabold text-slate-900">Lifotronic H8 200 Test</td>
                    <td className="p-2.5 text-right font-mono">$150.00</td>
                    <td className="p-2.5 text-right font-mono text-slate-600">₱{calc.h8Landed.toFixed(2)}</td>
                    <td className="p-2.5 text-right">
                      <input
                        type="number"
                        value={h8OfferPrice}
                        onChange={(e) => setH8OfferPrice(Number(e.target.value))}
                        className="w-24 bg-slate-50 border border-slate-300 rounded-lg px-2 py-0.5 font-mono font-bold text-right text-slate-900"
                      />
                    </td>
                    <td className="p-2.5 text-right font-mono">₱{calc.h8Net.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-mono text-emerald-700">₱{calc.h8UnitMargin.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-mono">36</td>
                    <td className="p-2.5 text-right font-mono font-extrabold text-emerald-800">₱{calc.h8TotalMargin.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-extrabold text-slate-900">A1c Control Kit</td>
                    <td className="p-2.5 text-right font-mono">$15.00</td>
                    <td className="p-2.5 text-right font-mono text-slate-600">₱{calc.a1cLanded.toFixed(2)}</td>
                    <td className="p-2.5 text-right">
                      <input
                        type="number"
                        value={a1cOfferPrice}
                        onChange={(e) => setA1cOfferPrice(Number(e.target.value))}
                        className="w-24 bg-slate-50 border border-slate-300 rounded-lg px-2 py-0.5 font-mono font-bold text-right text-slate-900"
                      />
                    </td>
                    <td className="p-2.5 text-right font-mono">₱{(a1cOfferPrice - a1cOfferPrice * 0.12).toFixed(2)}</td>
                    <td className="p-2.5 text-right font-mono text-emerald-700">₱{(a1cOfferPrice * 0.88 - calc.a1cLanded).toFixed(2)}</td>
                    <td className="p-2.5 text-right font-mono">36</td>
                    <td className="p-2.5 text-right font-mono font-extrabold text-emerald-800">₱{calc.a1cTotalMargin.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-slate-50/60 text-slate-600">
                    <td className="p-2.5 font-bold">Calibrator (Included)</td>
                    <td className="p-2.5 text-right font-mono">$15.00</td>
                    <td className="p-2.5 text-right font-mono">₱1,392.86</td>
                    <td className="p-2.5 text-right font-mono">₱0.00</td>
                    <td className="p-2.5 text-right font-mono">₱0.00</td>
                    <td className="p-2.5 text-right font-mono text-rose-600">-₱1,392.86</td>
                    <td className="p-2.5 text-right font-mono">12</td>
                    <td className="p-2.5 text-right font-mono text-rose-700">-₱16,714.29</td>
                  </tr>
                  <tr className="bg-slate-50/60 text-slate-600">
                    <td className="p-2.5 font-bold">Column Assembly</td>
                    <td className="p-2.5 text-right font-mono">$300.00</td>
                    <td className="p-2.5 text-right font-mono">₱18,300.00</td>
                    <td className="p-2.5 text-right font-mono">₱0.00</td>
                    <td className="p-2.5 text-right font-mono">₱0.00</td>
                    <td className="p-2.5 text-right font-mono text-rose-600">-₱18,300.00</td>
                    <td className="p-2.5 text-right font-mono">4</td>
                    <td className="p-2.5 text-right font-mono text-rose-700">-₱73,200.00</td>
                  </tr>
                  <tr className="bg-blue-50/80 border-t-2 border-slate-300 font-extrabold text-slate-900">
                    <td colSpan={7} className="p-2.5 text-right uppercase tracking-wider">Gross Annual Reagent Margin (L42):</td>
                    <td className="p-2.5 text-right font-mono text-base text-blue-950 font-black">₱{calc.totalReagentMargin.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions Matching Screenshot 2 Design System */}
        <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Formulas locked per REVISED ROI_ACE PATEROS.xlsx specification</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold rounded-2xl transition text-xs sm:text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-extrabold rounded-2xl transition text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Link ROI to Sales Quote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
