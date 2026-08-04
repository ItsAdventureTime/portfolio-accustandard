'use client';

import { useState, useEffect, useCallback } from 'react';

// Default Seed Data for Accustandard Demo
export const DEFAULT_INVENTORY = [
  {
    id: 'inv-1',
    sku: 'ACC-BACT-01',
    description: 'Calibration Sticks Bact Alert',
    location: 'Pampanga',
    lotNumber: 'LOT-2026-A9',
    expiryDate: '2027-11-30',
    onHand: 45,
    reserved: 5,
    available: 40,
    unit: 'Kits',
    status: 'NORMAL',
  },
  {
    id: 'inv-2',
    sku: 'ACC-REAG-04',
    description: 'Blood Chemistry Reagents Kit',
    location: 'Quezon City',
    lotNumber: 'LOT-2026-B2',
    expiryDate: '2026-09-15',
    onHand: 120,
    reserved: 20,
    available: 100,
    unit: 'Boxes',
    status: 'NEAR_EXPIRY',
  },
  {
    id: 'inv-3',
    sku: 'ACC-HEMA-09',
    description: 'Hematology Lyse Reagent 5L',
    location: 'Quezon City',
    lotNumber: 'LOT-2026-C8',
    expiryDate: '2028-03-20',
    onHand: 200,
    reserved: 10,
    available: 190,
    unit: 'Bottles',
    status: 'NORMAL',
  },
  {
    id: 'inv-4',
    sku: 'ACC-URIN-12',
    description: 'Urine Analyzer Test Strips 100s',
    location: 'Pampanga',
    lotNumber: 'LOT-2026-D4',
    expiryDate: '2027-06-10',
    onHand: 85,
    reserved: 0,
    available: 85,
    unit: 'Canisters',
    status: 'NORMAL',
  },
];

export const DEFAULT_APPROVALS = [
  {
    id: 'app-1',
    qrn: 'QRN20240415037',
    type: 'Sales Quotation',
    maker: 'Sales Officer',
    reviewerStatus: 'APPROVED',
    gmStatus: 'APPROVED',
    dcsStatus: 'PENDING',
    totalAmount: 31500.0,
  },
  {
    id: 'app-2',
    qrn: 'PO-2026-0891',
    type: 'Purchase Order',
    maker: 'Purchasing Officer',
    reviewerStatus: 'APPROVED',
    gmStatus: 'PENDING',
    dcsStatus: 'AWAITING',
    totalAmount: 142000.0,
  },
  {
    id: 'app-3',
    qrn: 'RFP-2026-0104',
    type: 'Request for Payment',
    maker: 'Bookkeeper (Aila)',
    reviewerStatus: 'APPROVED',
    gmStatus: 'APPROVED',
    dcsStatus: 'PENDING',
    totalAmount: 18500.0,
  },
];

export const DEFAULT_SOA_ROWS = [
  {
    id: 'soa-1',
    invoiceNo: 'SI-6087',
    drNo: 'DR-6075',
    date: '18-Jun-2026',
    dueDate: '7/18/2026',
    terms: '30 Days Net',
    ageDays: 47,
    current: 0,
    days30: 0,
    days60: 16960.0,
    totalBalance: 16960.0,
  },
  {
    id: 'soa-2',
    invoiceNo: 'SI-6107',
    drNo: 'DR-6097',
    date: '26-Jun-2026',
    dueDate: '7/26/2026',
    terms: '30 Days Net',
    ageDays: 39,
    current: 0,
    days30: 1968.0,
    days60: 0,
    totalBalance: 1968.0,
  },
  {
    id: 'soa-3',
    invoiceNo: 'SI-6118',
    drNo: 'DR-6113',
    date: '30-Jun-2026',
    dueDate: '7/30/2026',
    terms: '30 Days Net',
    ageDays: 35,
    current: 13280.0,
    days30: 0,
    days60: 0,
    totalBalance: 13280.0,
  },
];

export const DEFAULT_PO_LIST = [
  {
    id: 'po-1',
    poNumber: 'PO-2026-0891',
    vendorName: 'BioMerieux Diagnostics Corp',
    itemDescription: 'Calibration Sticks Bact Alert',
    poQty: 100,
    rrQtyReceived: 100,
    invoiceRef: 'SI #8812',
    totalAmount: 142000.0,
    status: 'VERIFIED_3WAY',
  },
  {
    id: 'po-2',
    poNumber: 'PO-2026-0914',
    vendorName: 'Sysmex Philippines Inc.',
    itemDescription: 'Blood Chemistry Reagents Kit',
    poQty: 50,
    rrQtyReceived: 0,
    invoiceRef: 'Awaiting',
    totalAmount: 450000.0,
    status: 'PENDING_RECEIVING',
  },
  {
    id: 'po-3',
    poNumber: 'PO-2026-0925',
    vendorName: 'Mindray Medical Corp',
    itemDescription: 'Hematology Lyse Reagent 5L',
    poQty: 80,
    rrQtyReceived: 80,
    invoiceRef: 'SI #9901',
    totalAmount: 640000.0,
    status: 'VERIFIED_3WAY',
  },
];

export const DEFAULT_RFP_LIST = [
  {
    id: 'rfp-1',
    rfpNo: 'RFP-2026-0104',
    payee: 'LBC Express Courier Services',
    glAccount: '6100 - Freight & Delivery',
    description: 'Cold-chain express shipping for Pampanga hospital orders',
    amount: 18500.0,
    requestedBy: 'Bookkeeper (Aila)',
    status: 'APPROVED_DCS',
  },
  {
    id: 'rfp-2',
    rfpNo: 'RFP-2026-0112',
    payee: 'Meralco Electric Utilities',
    glAccount: '6200 - Utilities Expense',
    description: 'San Fernando warehouse climate-control power bill',
    amount: 34200.0,
    requestedBy: 'General Manager',
    status: 'PENDING_GM',
  },
  {
    id: 'rfp-3',
    rfpNo: 'RFP-2026-0120',
    payee: 'Calibration Certifications Phils',
    glAccount: '6300 - Professional & Calibration Fees',
    description: 'ISO 17025 annual calibration for Bact Alert analyzer units',
    amount: 28000.0,
    requestedBy: 'Marketing',
    status: 'PENDING_MKTG',
  },
];

export const DEFAULT_AUDIT_LOGS = [
  { id: '1', time: '02:55 PM', user: 'Sales Officer (Mark)', action: 'Created Quotation QRN20240415037 for Allied Care Experts' },
  { id: '2', time: '03:10 PM', user: 'Marketing Officer (RMT)', action: 'Reviewed and Approved Quotation QRN20240415037' },
  { id: '3', time: '03:14 PM', user: 'General Manager (Karen)', action: 'Approved Quotation QRN20240415037' },
];

const RESET_INTERVAL_MS = 30 * 60 * 1000;

export function useDemoStore() {
  const [lastResetTime, setLastResetTime] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('accustanda_demo_reset_time');
      if (saved) return Number(saved);
    }
    return Date.now();
  });

  const [secondsRemaining, setSecondsRemaining] = useState<number>(30 * 60);

  const resetDemoData = useCallback(() => {
    const now = Date.now();
    setLastResetTime(now);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accustanda_demo_reset_time', String(now));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastResetTime;
      const remaining = Math.max(0, Math.floor((RESET_INTERVAL_MS - elapsed) / 1000));
      setSecondsRemaining(remaining);

      if (remaining <= 0) {
        resetDemoData();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastResetTime, resetDemoData]);

  const formatTimer = useCallback(() => {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, [secondsRemaining]);

  return {
    secondsRemaining,
    formatTimer,
    resetDemoData,
  };
}
