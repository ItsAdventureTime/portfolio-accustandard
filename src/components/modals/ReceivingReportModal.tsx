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
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-slate-900">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 border border-slate-300 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700 text-white rounded-xl">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Warehouse Receiving Report (RR Entry)
              </h3>
              <p className="text-xs text-slate-500 font-medium">Verify Goods Receipt against Purchase Order</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Way Match Warning */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2 font-semibold">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>3-Way Match Active: Receiving cannot exceed approved PO quantity ({selectedPO?.poQty || 0} units). Over-receiving is hard-blocked.</span>
        </div>

        {hardBlockError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2 font-bold">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{hardBlockError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Purchase Order *</label>
            <select
              value={selectedPoId}
              onChange={(e) => {
                setSelectedPoId(e.target.value);
                setHardBlockError(null);
                const po = poList.find((p) => p.id === e.target.value);
                if (po) setReceivedQty(po.poQty - po.rrQtyReceived || po.poQty);
              }}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-700"
            >
              {poList.map((po) => (
                <option key={po.id} value={po.id}>
                  {po.poNumber} — {po.vendorName} ({po.itemDescription})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-700">
            <p><span className="font-bold">Item:</span> {selectedPO?.itemDescription}</p>
            <p><span className="font-bold">Approved PO Qty:</span> {selectedPO?.poQty} units</p>
            <p><span className="font-bold">Previously Received:</span> {selectedPO?.rrQtyReceived} units</p>
            <p><span className="font-bold text-emerald-800">Remaining Balance Allowed:</span> {maxAllowed} units</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Quantity Received (RR Count) *</label>
              <input
                type="number"
                min="1"
                max={maxAllowed > 0 ? maxAllowed : selectedPO?.poQty || 100}
                value={receivedQty}
                onChange={(e) => {
                  setReceivedQty(Number(e.target.value));
                  setHardBlockError(null);
                }}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-700"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Batch / Lot Number</label>
              <input
                type="text"
                placeholder="e.g. LOT-2026-REC-01"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Equipment Serial Number (Optional for Equipment)</label>
            <input
              type="text"
              placeholder="e.g. SN-BACT-2026-9910"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-700"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95"
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

