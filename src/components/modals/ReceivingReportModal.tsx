'use client';

import React, { useState } from 'react';
import { X, PackageCheck, Check, ShieldAlert, AlertTriangle } from 'lucide-react';

interface ReceivingReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  poList: any[];
  onReceivePO: (poId: string, receivedQty: number, details?: { batchNumber?: string; serialNumber?: string }) => void;
}

export const ReceivingReportModal: React.FC<ReceivingReportModalProps> = ({
  isOpen,
  onClose,
  poList,
  onReceivePO,
}) => {
  const pendingPOs = poList.filter((p) => p.rrQtyReceived < p.poQty);
  const [selectedPoId, setSelectedPoId] = useState(pendingPOs[0]?.id || poList[0]?.id || '');
  const [receivedQty, setReceivedQty] = useState(100);
  const [batchNumber, setBatchNumber] = useState('LOT-2026-REC-01');
  const [serialNumber, setSerialNumber] = useState('');
  const [hardBlockError, setHardBlockError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedPO = poList.find((p) => p.id === selectedPoId) || poList[0];
  const maxAllowed = selectedPO ? selectedPO.poQty - selectedPO.rrQtyReceived : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPO) return;

    if (selectedPO.rrQtyReceived + Number(receivedQty) > selectedPO.poQty) {
      setHardBlockError(
        `COSO Fraud Control HARD-BLOCK: Cannot receive ${receivedQty} units. Total would reach ${
          selectedPO.rrQtyReceived + Number(receivedQty)
        }, exceeding approved PO limit of ${selectedPO.poQty} units.`
      );
      return;
    }

    setHardBlockError(null);
    onReceivePO(selectedPO.id, Number(receivedQty), { batchNumber, serialNumber });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto text-slate-900">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-slate-300 animate-in fade-in zoom-in duration-200 text-sm">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-700 text-white rounded-2xl shadow-sm">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900">
                Warehouse Receiving Report (RR Entry)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Verify Goods Receipt against Purchase Order</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 3-Way Match Warning */}
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs sm:text-sm text-amber-950 flex items-center gap-3 font-semibold">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>3-Way Match Active: Receiving cannot exceed approved PO quantity ({selectedPO?.poQty || 0} units). Over-receiving is hard-blocked.</span>
        </div>

        {hardBlockError && (
          <div className="p-4 bg-red-50 border border-red-300 rounded-2xl text-xs sm:text-sm text-red-950 flex items-start gap-3 font-bold">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{hardBlockError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm font-semibold">
          <div>
            <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Select Purchase Order *</label>
            <select
              value={selectedPoId}
              onChange={(e) => {
                setSelectedPoId(e.target.value);
                setHardBlockError(null);
                const po = poList.find((p) => p.id === e.target.value);
                if (po) setReceivedQty(po.poQty - po.rrQtyReceived || po.poQty);
              }}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-700 cursor-pointer"
            >
              {poList.map((po) => (
                <option key={po.id} value={po.id}>
                  {po.poNumber} — {po.vendorName} ({po.itemDescription})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800">
            <p><span className="text-slate-500 font-bold block text-xs uppercase">Item Description:</span> <span className="text-slate-900 font-extrabold text-sm">{selectedPO?.itemDescription}</span></p>
            <p><span className="text-slate-500 font-bold block text-xs uppercase">Approved PO Qty:</span> <span className="text-slate-900 font-black text-sm">{selectedPO?.poQty} units</span></p>
            <p><span className="text-slate-500 font-bold block text-xs uppercase">Previously Received:</span> <span className="text-slate-900 font-black text-sm">{selectedPO?.rrQtyReceived} units</span></p>
            <p><span className="text-emerald-700 font-bold block text-xs uppercase">Remaining Balance Allowed:</span> <span className="text-emerald-800 font-black text-base">{maxAllowed} units</span></p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Quantity Received (RR Count) *</label>
              <input
                type="number"
                min="1"
                max={maxAllowed > 0 ? maxAllowed : selectedPO?.poQty || 100}
                value={receivedQty}
                onChange={(e) => {
                  setReceivedQty(Number(e.target.value));
                  setHardBlockError(null);
                }}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-700"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Batch / Lot Number</label>
              <input
                type="text"
                placeholder="e.g. LOT-2026-REC-01"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Equipment Serial Number (Optional for Equipment)</label>
            <input
              type="text"
              placeholder="e.g. SN-BACT-2026-9910"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-700"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-4 flex justify-between items-center border-t border-slate-200 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xs sm:text-sm rounded-2xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Goods Receipt (RR)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

