'use client';

import React, { useState, useMemo } from 'react';
import { X, Save, ShieldCheck, FileSpreadsheet, CheckCircle2, TrendingUp, Clock, DollarSign } from 'lucide-react';

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
  const [shippingPct] = useState(0.30); // 30%
  const [lisConnectivity, setLisConnectivity] = useState(250000);
  const [avrCost, setAvrCost] = useState(3500);
  const [upsCost, setUpsCost] = useState(2590);
  const [demoReagents, setDemoReagents] = useState(10000);
  const [representation] = useState(2000);

  // Section 2 Inputs: Operating Assumptions
  const [dailyVolume, setDailyVolume] = useState(20);
  const [testsPerKit, setTestsPerKit] = useState(200);

  // Section 3 Inputs: Post-Installation Costs
  const [pmsCost, setPmsCost] = useState(30000);
  const [troubleshootingCost, setTroubleshootingCost] = useState(30000);
  const [sponsorshipCost, setSponsorshipCost] = useState(15000);
  const [christmasPartyCost, setChristmasPartyCost] = useState(20000);
  const [pametCost, setPametCost] = useState(21000);
  const [incentiveCost] = useState(5000);
  const [salesCollectionCost, setSalesCollectionCost] = useState(147420);
  const [trainingCost, setTrainingCost] = useState(5000);

  // Section 4 Inputs: Per-SKU Pricing
  const [h8OfferPrice, setH8OfferPrice] = useState(62000);
  const [a1cOfferPrice, setA1cOfferPrice] = useState(3000);

  // Calculations
  const calc = useMemo(() => {
    const machinePHP = machineUSD * exchangeRate;
    const shippingFee = machinePHP * shippingPct;
    const totalMachineCost = machinePHP + shippingFee;

    const accessoriesTotal = avrCost + upsCost + lisConnectivity;
    const preInstallationTotal = demoReagents + representation;
    const totalUpfrontInvestment = totalMachineCost + accessoriesTotal + preInstallationTotal;

    const monthlyVolume = dailyVolume * 26;
    const kitsPerMonth = monthlyVolume / (testsPerKit || 1);

    const sparePartsCost = machinePHP * 0.20;
    const totalPostInstallation =
      pmsCost +
      troubleshootingCost +
      sparePartsCost +
      sponsorshipCost +
      christmasPartyCost +
      pametCost +
      incentiveCost +
      salesCollectionCost +
      trainingCost;

    const landedCostCoeff = 0.70;

    const h8Landed = (150 * exchangeRate) / landedCostCoeff;
    const h8Tax = h8OfferPrice * 0.12;
    const h8Net = h8OfferPrice - h8Tax;
    const h8UnitMargin = h8Net - h8Landed;
    const h8AnnualQty = 36;
    const h8TotalMargin = h8AnnualQty * h8UnitMargin;

    const a1cLanded = (15 * exchangeRate) / landedCostCoeff;
    const a1cTax = a1cOfferPrice * 0.12;
    const a1cNet = a1cOfferPrice - a1cTax;
    const a1cUnitMargin = a1cNet - a1cLanded;
    const a1cAnnualQty = 36;
    const a1cTotalMargin = a1cAnnualQty * a1cUnitMargin;

    const calLanded = (15 * exchangeRate) / landedCostCoeff;
    const calUnitMargin = -calLanded;
    const calAnnualQty = 12;
    const calTotalMargin = calAnnualQty * calUnitMargin;

    const colLanded = 18300;
    const colUnitMargin = -colLanded;
    const colAnnualQty = 4;
    const colTotalMargin = colAnnualQty * colUnitMargin;

    const cupsLanded = 500;
    const cupsUnitMargin = -cupsLanded;
    const cupsAnnualQty = 12;
    const cupsTotalMargin = cupsAnnualQty * cupsUnitMargin;

    const totalReagentMargin = h8TotalMargin + a1cTotalMargin + calTotalMargin + colTotalMargin + cupsTotalMargin;
    const netAnnualContribution = totalReagentMargin - totalPostInstallation;
    const roiInYears = totalUpfrontInvestment / (netAnnualContribution || 1);

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
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-100 my-auto text-slate-900 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header Block */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-600/20 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Client-Format ROI Calculator (Revised ROI_ACE Pateros)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  v1.0 Confirmed Formula Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Linked RFQ: <strong className="text-slate-900">{rfqData?.rfqNo || 'RFQ-2026-0081'}</strong> &bull; Client: <strong className="text-slate-900">{rfqData?.customerName || 'Allied Care Experts (ACE) Medical Center'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close ROI Modal"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm bg-white">
          {/* Top Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">Total Upfront Investment</span>
              <span className="font-bold text-slate-900 text-lg">
                ₱{calc.totalUpfrontInvestment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 space-y-1">
              <span className="text-xs font-semibold text-amber-900 block">Post-Installation Expense</span>
              <span className="font-bold text-amber-800 text-lg">
                ₱{calc.totalPostInstallation.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/80 space-y-1">
              <span className="text-xs font-semibold text-blue-900 block">Net Annual Contribution</span>
              <span className="font-bold text-blue-900 text-lg">
                ₱{calc.netAnnualContribution.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="bg-emerald-50/90 p-4 rounded-xl border border-emerald-200/80 space-y-1">
              <span className="text-xs font-semibold text-emerald-950 block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                Payback Period (ROI)
              </span>
              <span className="font-bold text-emerald-900 text-xl">
                {calc.roiInYears.toFixed(2)} Years <span className="text-xs font-medium text-emerald-700">({(calc.roiInYears * 12).toFixed(1)} mos)</span>
              </span>
            </div>
          </div>

          {/* SECTION 1: Equipment & Installation Costs */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-5 h-5 bg-blue-100 text-blue-800 rounded-md flex items-center justify-center text-xs font-bold">1</span>
              Equipment &amp; Installation Expenses (Upfront Investment)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Machine Cost (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">$</span>
                  <input
                    type="number"
                    value={machineUSD}
                    onChange={(e) => setMachineUSD(Number(e.target.value))}
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-7 pr-3 py-1.5 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">FX Exchange Rate (PHP/USD)</label>
                <input
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Machine PHP Cost (Locked)</label>
                <input
                  type="text"
                  readOnly
                  value={`₱${calc.machinePHP.toLocaleString()}`}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Shipping Fee (30% Locked)</label>
                <input
                  type="text"
                  readOnly
                  value={`₱${calc.shippingFee.toLocaleString()}`}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">LIS Connectivity (PHP)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">₱</span>
                  <input
                    type="number"
                    value={lisConnectivity}
                    onChange={(e) => setLisConnectivity(Number(e.target.value))}
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-7 pr-3 py-1.5 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">AVR &amp; UPS Cost (PHP)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">₱</span>
                  <input
                    type="number"
                    value={avrCost + upsCost}
                    onChange={(e) => {
                      setAvrCost(Number(e.target.value) / 2);
                      setUpsCost(Number(e.target.value) / 2);
                    }}
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-7 pr-3 py-1.5 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Demo Reagents &amp; Rep (PHP)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">₱</span>
                  <input
                    type="number"
                    value={demoReagents + representation}
                    onChange={(e) => setDemoReagents(Number(e.target.value))}
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-7 pr-3 py-1.5 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subtotal Equipment (I15)</label>
                <input
                  type="text"
                  readOnly
                  value={`₱${calc.totalUpfrontInvestment.toLocaleString()}`}
                  className="w-full bg-blue-50 border border-blue-200 rounded-xl px-3 py-1.5 font-bold text-blue-950 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Operating Assumptions */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-5 h-5 bg-blue-100 text-blue-800 rounded-md flex items-center justify-center text-xs font-bold">2</span>
              Operating &amp; Census Assumptions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Daily Test Census</label>
                <input
                  type="number"
                  value={dailyVolume}
                  onChange={(e) => setDailyVolume(Number(e.target.value))}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Monthly Volume (Daily &times; 26)</label>
                <input
                  type="text"
                  readOnly
                  value={calc.monthlyVolume}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tests Per Kit</label>
                <input
                  type="number"
                  value={testsPerKit}
                  onChange={(e) => setTestsPerKit(Number(e.target.value))}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Required Kits / Month</label>
                <input
                  type="text"
                  readOnly
                  value={calc.kitsPerMonth.toFixed(2)}
                  className="w-full bg-blue-50 border border-blue-200 rounded-xl px-3 py-1.5 font-bold text-blue-950 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Post-Installation / Account Costs */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-5 h-5 bg-blue-100 text-blue-800 rounded-md flex items-center justify-center text-xs font-bold">3</span>
              Post-Installation / Account Expenses (Annual)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">PMS Service</label>
                <input
                  type="number"
                  value={pmsCost}
                  onChange={(e) => setPmsCost(Number(e.target.value))}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Troubleshooting</label>
                <input
                  type="number"
                  value={troubleshootingCost}
                  onChange={(e) => setTroubleshootingCost(Number(e.target.value))}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Spare Parts (20% Machine)</label>
                <input
                  type="text"
                  readOnly
                  value={`₱${calc.sparePartsCost.toLocaleString()}`}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Sponsorship &amp; Team Building</label>
                <input
                  type="number"
                  value={sponsorshipCost}
                  onChange={(e) => setSponsorshipCost(Number(e.target.value))}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Christmas Party</label>
                <input
                  type="number"
                  value={christmasPartyCost}
                  onChange={(e) => setChristmasPartyCost(Number(e.target.value))}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">PAMET Sponsorship</label>
                <input
                  type="number"
                  value={pametCost}
                  onChange={(e) => setPametCost(Number(e.target.value))}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Sales &amp; Collection</label>
                <input
                  type="number"
                  value={salesCollectionCost}
                  onChange={(e) => setSalesCollectionCost(Number(e.target.value))}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Training &amp; Incentive</label>
                <input
                  type="number"
                  value={trainingCost}
                  onChange={(e) => setTrainingCost(Number(e.target.value))}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Per-SKU Economics */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-5 h-5 bg-blue-100 text-blue-800 rounded-md flex items-center justify-center text-xs font-bold">4</span>
              Per-SKU Economics &amp; Landed Cost Margin Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-medium">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                  <tr>
                    <th className="p-3">SKU Description</th>
                    <th className="p-3 text-right">NDP (USD)</th>
                    <th className="p-3 text-right">Landed Cost (PHP)</th>
                    <th className="p-3 text-right">Price Offer (PHP)</th>
                    <th className="p-3 text-right">Net Offer (Ex-Tax)</th>
                    <th className="p-3 text-right">Unit Margin</th>
                    <th className="p-3 text-right">Annual Qty</th>
                    <th className="p-3 text-right">Total Annual Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Lifotronic H8 200 Test</td>
                    <td className="p-3 text-right font-semibold">$150.00</td>
                    <td className="p-3 text-right font-semibold text-slate-600">₱{calc.h8Landed.toFixed(2)}</td>
                    <td className="p-3 text-right">
                      <input
                        type="number"
                        value={h8OfferPrice}
                        onChange={(e) => setH8OfferPrice(Number(e.target.value))}
                        className="w-24 bg-slate-50/80 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-right text-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                      />
                    </td>
                    <td className="p-3 text-right font-semibold">₱{calc.h8Net.toFixed(2)}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">₱{calc.h8UnitMargin.toFixed(2)}</td>
                    <td className="p-3 text-right font-semibold">36</td>
                    <td className="p-3 text-right font-bold text-emerald-700">₱{calc.h8TotalMargin.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">A1c Control Kit</td>
                    <td className="p-3 text-right font-semibold">$15.00</td>
                    <td className="p-3 text-right font-semibold text-slate-600">₱{calc.a1cLanded.toFixed(2)}</td>
                    <td className="p-3 text-right">
                      <input
                        type="number"
                        value={a1cOfferPrice}
                        onChange={(e) => setA1cOfferPrice(Number(e.target.value))}
                        className="w-24 bg-slate-50/80 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-right text-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                      />
                    </td>
                    <td className="p-3 text-right font-semibold">₱{(a1cOfferPrice - a1cOfferPrice * 0.12).toFixed(2)}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">₱{(a1cOfferPrice * 0.88 - calc.a1cLanded).toFixed(2)}</td>
                    <td className="p-3 text-right font-semibold">36</td>
                    <td className="p-3 text-right font-bold text-emerald-700">₱{calc.a1cTotalMargin.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-slate-50/50 text-slate-600">
                    <td className="p-3 font-semibold">Calibrator (Included)</td>
                    <td className="p-3 text-right">$15.00</td>
                    <td className="p-3 text-right">₱1,392.86</td>
                    <td className="p-3 text-right">₱0.00</td>
                    <td className="p-3 text-right">₱0.00</td>
                    <td className="p-3 text-right font-medium text-rose-600">-₱1,392.86</td>
                    <td className="p-3 text-right">12</td>
                    <td className="p-3 text-right font-semibold text-rose-600">-₱16,714.29</td>
                  </tr>
                  <tr className="bg-slate-50/50 text-slate-600">
                    <td className="p-3 font-semibold">Column Assembly</td>
                    <td className="p-3 text-right">$300.00</td>
                    <td className="p-3 text-right">₱18,300.00</td>
                    <td className="p-3 text-right">₱0.00</td>
                    <td className="p-3 text-right">₱0.00</td>
                    <td className="p-3 text-right font-medium text-rose-600">-₱18,300.00</td>
                    <td className="p-3 text-right">4</td>
                    <td className="p-3 text-right font-semibold text-rose-600">-₱73,200.00</td>
                  </tr>
                  <tr className="bg-blue-50/60 border-t-2 border-slate-200 font-bold text-slate-900">
                    <td colSpan={7} className="p-3 text-right uppercase tracking-wider text-xs">Gross Annual Reagent Margin:</td>
                    <td className="p-3 text-right text-sm text-blue-900 font-bold">₱{calc.totalReagentMargin.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Formulas locked per REVISED ROI_ACE PATEROS.xlsx specification</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition text-xs sm:text-sm cursor-pointer shadow-xs flex-1 sm:flex-initial"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer active:scale-95 flex-1 sm:flex-initial"
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
