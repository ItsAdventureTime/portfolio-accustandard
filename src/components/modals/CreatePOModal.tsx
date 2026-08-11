'use client';

import React, { useState } from 'react';
import { X, Building2, Send, AlertTriangle, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface CreatePOModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryList: any[];
  onSubmitPO: (newPO: any) => void;
  existingPOs?: any[];
}

export const CreatePOModal: React.FC<CreatePOModalProps> = ({
  isOpen,
  onClose,
  inventoryList,
  onSubmitPO,
  existingPOs = [],
}) => {
  const [vendorName, setVendorName] = useState('BioMerieux Diagnostics Corp');
  const [selectedSku, setSelectedSku] = useState(inventoryList[0]?.sku || 'ACC-BACT-01');
  const [poQty, setPoQty] = useState(100);
  const [unitPrice, setUnitPrice] = useState(1420);
  const [linkedCustomerPO, setLinkedCustomerPO] = useState('');
  const [shortageReason, setShortageReason] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedItem = inventoryList.find((i) => i.sku === selectedSku) || inventoryList[0];
  const isClass3 = selectedItem?.itemClass?.includes('Class 3') || selectedSku === 'ACC-SPEC-99';

  // AT-PO-001: Find existing open PO for same SKU
  const existingOpenPO = existingPOs.find(
    (p) => p.sku === selectedSku && (p.status === 'PENDING_RECEIVING' || p.status === 'PENDING_ACCOUNTING' || p.status === 'PARTIALLY_RECEIVED')
  );

  const remainingQtyInOpenPO = existingOpenPO ? Math.max(0, existingOpenPO.poQty - (existingOpenPO.rrQtyReceived || 0)) : 0;
  const isCoveredByOpenPO = existingOpenPO && remainingQtyInOpenPO >= poQty;
  const isShortageException = existingOpenPO && remainingQtyInOpenPO > 0 && poQty > remainingQtyInOpenPO;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName.trim()) return;

    if (isClass3 && !linkedCustomerPO.trim()) {
      setErrorMessage('COSO Fraud Control Block: Class 3 (Short-Expiry / Special) items require an approved linked Customer PO before generating a supplier PO.');
      return;
    }

    if (isCoveredByOpenPO) {
      setErrorMessage(`AT-PO-001 Block: SKU ${selectedSku} is fully covered by open ${existingOpenPO.poNumber} (Remaining Qty: ${remainingQtyInOpenPO}). Creating a duplicate PO is prohibited.`);
      return;
    }

    if (isShortageException && !shortageReason.trim()) {
      setErrorMessage(`AT-PO-002 Requirement: A shortage exception reason is mandatory when ordering beyond remaining open PO quantity.`);
      return;
    }

    setErrorMessage(null);
    const poNum = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPO = {
      id: `po-${Date.now()}`,
      poNumber: poNum,
      vendorName,
      itemDescription: selectedItem?.description || 'Medical Supply Kit',
      sku: selectedSku,
      poQty,
      rrQtyReceived: 0,
      invoiceRef: 'Awaiting Receipt',
      totalAmount: poQty * unitPrice,
      linkedCustomerPO: isClass3 ? linkedCustomerPO : 'N/A',
      accountingApproved: false,
      gmApproved: false,
      dcsApproved: false,
      isShortageException: !!isShortageException,
      shortageReason: isShortageException ? shortageReason : null,
      status: 'PENDING_ACCOUNTING',
      ownerRole: 'Bookkeeper',
    };

    onSubmitPO(newPO);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-slate-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out text-slate-900 text-sm">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-900 text-white rounded-2xl shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900">
                Create Purchase Order (PO)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Routes to Accounting (Review) &rarr; GM &rarr; Conditional DCS (AT-PO-003 / AT-PO-004)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-300 rounded-2xl text-red-950 text-xs sm:text-sm font-bold flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* AT-PO-001 Open PO Same-SKU Inspection Banner */}
        {existingOpenPO && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-950 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold flex items-center gap-2 text-amber-900 text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                AT-PO-001 Open PO Same-SKU Control Banner
              </span>
              <span className="px-2.5 py-0.5 bg-amber-200 text-amber-900 font-black rounded-full text-xs">
                Open PO: {existingOpenPO.poNumber}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-slate-800 pt-1">
              <div>Supplier: <strong className="text-slate-950">{existingOpenPO.vendorName}</strong></div>
              <div>Ordered: <strong className="text-slate-950">{existingOpenPO.poQty}</strong></div>
              <div>Received: <strong className="text-slate-950">{existingOpenPO.rrQtyReceived || 0}</strong></div>
              <div>Remaining: <strong className="text-amber-700 font-bold">{remainingQtyInOpenPO}</strong></div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm font-semibold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Supplier / Vendor Name *</label>
              <input
                type="text"
                placeholder="e.g. BioMerieux Diagnostics Corp"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">
                Select Registered Inventory Item *
              </label>
              <select
                value={selectedSku}
                onChange={(e) => {
                  setSelectedSku(e.target.value);
                  setErrorMessage(null);
                }}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                {inventoryList.map((item) => (
                  <option key={item.id} value={item.sku}>
                    {item.sku} — {item.description} ({item.location}) {item.itemClass ? `[${item.itemClass}]` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isClass3 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
              <label className="font-extrabold text-blue-900 block text-xs uppercase tracking-wider">
                Linked Customer PO / Contract Number * (Mandatory for Class 3)
              </label>
              <input
                type="text"
                placeholder="e.g. CUST-PO-2026-88"
                value={linkedCustomerPO}
                onChange={(e) => setLinkedCustomerPO(e.target.value)}
                className="w-full bg-white border border-blue-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600"
                required
              />
            </div>
          )}

          {isShortageException && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-2">
              <label className="font-extrabold text-purple-900 block text-xs uppercase tracking-wider">
                AT-PO-002 Shortage Exception Justification * (Routes Accounting &rarr; GM)
              </label>
              <input
                type="text"
                placeholder="e.g. Critical reagent demand surge at regional diagnostic facility"
                value={shortageReason}
                onChange={(e) => setShortageReason(e.target.value)}
                className="w-full bg-white border border-purple-300 text-slate-900 font-bold rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-600"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">PO Order Quantity</label>
              <input
                type="number"
                min="1"
                value={poQty}
                onChange={(e) => setPoQty(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs uppercase tracking-wider">Unit Cost (₱)</label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono font-black rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-slate-900 text-white rounded-2xl flex justify-between items-center font-bold shadow-md">
            <span className="text-slate-300 text-xs sm:text-sm uppercase tracking-wider">Total Purchase Order Value:</span>
            <span className="font-mono text-xl sm:text-2xl font-black text-emerald-400">₱{(poQty * unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>

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
              className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-black text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4 text-blue-200" />
              <span>Submit PO to Accounting My Actions</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


