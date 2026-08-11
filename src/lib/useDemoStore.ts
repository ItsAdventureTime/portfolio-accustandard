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
    wmaCost: 500.0,
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
    wmaCost: 650.0,
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
    wmaCost: 420.0,
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
    wmaCost: 180.0,
    status: 'NORMAL',
  },
];

export const DEFAULT_COSTING_HISTORY = [
  {
    id: 'cost-1',
    sku: 'ACC-BACT-01',
    previousWma: 500.0,
    incomingQty: 20,
    incomingUnitCost: 600.0,
    newWma: 516.67,
    transactionType: 'GOODS_RECEIPT',
    referenceNo: 'GR-2026-0041',
    createdAt: '2026-08-04 10:15:00',
  },
];

export const DEFAULT_REPLENISHMENT_PLANNER = [
  {
    id: 'rep-1',
    sku: 'ACC-BACT-01',
    description: 'Calibration Sticks Bact Alert',
    itemClass: 'Class 1 (Fast-Moving)',
    availableStock: 40,
    reservedStock: 5,
    openCustomerDemand: 30,
    criticalLevel: 50,
    proposedOrderQty: 60,
    leadTimeDays: 14,
    supplier: 'BioMerieux Corp',
    linkedCustomerPO: 'N/A',
    status: 'REORDER_RECOMMENDED',
  },
  {
    id: 'rep-2',
    sku: 'ACC-REAG-04',
    description: 'Blood Chemistry Reagents Kit',
    itemClass: 'Class 2 (Controlled)',
    availableStock: 100,
    reservedStock: 20,
    openCustomerDemand: 45,
    criticalLevel: 80,
    proposedOrderQty: 50,
    leadTimeDays: 21,
    supplier: 'Sysmex Philippines Inc.',
    linkedCustomerPO: 'N/A',
    status: 'FORECAST_REVIEW',
  },
  {
    id: 'rep-3',
    sku: 'ACC-SPEC-99',
    description: 'Lyphotronic H100+ Specialized Column',
    itemClass: 'Class 3 (Short-Expiry / Special)',
    availableStock: 2,
    reservedStock: 2,
    openCustomerDemand: 5,
    criticalLevel: 2,
    proposedOrderQty: 5,
    leadTimeDays: 30,
    supplier: 'Shenzhen Lyphotronic Technology',
    linkedCustomerPO: 'CUST-PO-2026-88',
    status: 'PO_LINKED_READY',
  },
];

export const DEFAULT_RFQS = [
  {
    id: 'rfq-1',
    rfqNo: 'RFQ-2026-0081',
    customerName: 'Allied Care Experts (ACE) Medical Center',
    requestedBy: 'Sales Agent (Mark)',
    facilityOwnership: 'Private',
    institutionalCharacter: 'Tertiary Hospital',
    setupType: 'Initial Setup',
    isRtu: true,
    hasRtuCensusAttachment: true,
    rtuCensusAttachmentName: 'ACE_Medical_3Month_Census_Validated.pdf',
    censusPerDay: 180,
    existingMachine: 'Sysmex XN-550',
    existingSupplier: 'MedTech Supplies Inc.',
    contractYears: 3,
    specialRequest: 'Requires LIS auto-bi-directional connection',
    remarks: 'High priority customer for Q3 contract expansion',
    marketingRoiStatus: 'ROI_COMPLETED',
    proposedSellingPrice: 42000.0,
    landedCostPerUnit: 24500.0,
    expectedMarginPct: 41.6,
    activeRoiId: 'roi-1',
    ownerRole: 'Sales',
    currentStage: 'PENDING_MARKETING_ROI',
  },
  {
    id: 'rfq-2',
    rfqNo: 'RFQ-2026-0094',
    customerName: 'Medical City Clark Diagnostic Center',
    requestedBy: 'Sales Agent (Mark)',
    facilityOwnership: 'Private',
    institutionalCharacter: 'Diagnostic Clinic',
    setupType: 'Upgrade Only',
    isRtu: true,
    hasRtuCensusAttachment: false,
    rtuCensusAttachmentName: null,
    censusPerDay: 95,
    existingMachine: 'Mindray BS-240',
    existingSupplier: 'Diagnostics Phils',
    contractYears: 1,
    specialRequest: 'Include 1-year PMS maintenance agreement',
    remarks: 'Awaiting 3-month validated census attachment before marketing submission',
    marketingRoiStatus: 'PENDING_ROI',
    proposedSellingPrice: 58000.0,
    landedCostPerUnit: 34000.0,
    expectedMarginPct: 41.3,
    activeRoiId: null,
    ownerRole: 'Sales',
    currentStage: 'DRAFT',
  },
];

export const DEFAULT_ROIS = [
  {
    id: 'roi-1',
    rfqId: 'rfq-1',
    version: 1,
    isActive: true,
    equipmentCost: 250000.0,
    installationCost: 35000.0,
    operatingAssumptions: {
      dailyTestVolume: 180,
      reagentCostPerTest: 45.0,
      sellingPricePerTest: 110.0,
      workingDaysPerYear: 360,
    },
    postInstallCosts: {
      annualPmsCost: 20000.0,
      logisticsCostPerMonth: 5000.0,
    },
    perSkuEconomics: [
      { sku: 'ACC-BACT-01', name: 'Calibration Sticks', cost: 500.0, price: 950.0, annualQty: 240 },
    ],
    annualContribution: 198000.0,
    roiYears: 1.44,
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
    dcsStatus: 'NOT_REQUIRED',
    totalAmount: 31500.0,
    ownerRole: 'Client',
    currentStage: 'AWAITING_CLIENT_APPROVAL',
  },
  {
    id: 'app-2',
    qrn: 'PO-2026-0891',
    type: 'Purchase Order',
    maker: 'Purchasing Officer',
    reviewerStatus: 'APPROVED',
    gmStatus: 'APPROVED',
    dcsStatus: 'PENDING',
    totalAmount: 142000.0,
    ownerRole: 'Chairman (DCS)',
    currentStage: 'PENDING_DCS_APPROVAL',
  },
  {
    id: 'app-3',
    qrn: 'RFP-2026-0104',
    type: 'Request for Payment',
    maker: 'Bookkeeper (Aila)',
    reviewerStatus: 'APPROVED',
    gmStatus: 'APPROVED',
    dcsStatus: 'APPROVED',
    totalAmount: 18500.0,
    ownerRole: 'Chairman (DCS)',
    currentStage: 'READY_FOR_RELEASE',
  },
];

export const DEFAULT_QUOTATIONS = [
  {
    id: 'quote-1',
    qrn: 'QRN20240415037',
    rfqNo: 'RFQ-2026-0081',
    roiId: 'roi-1',
    quotationDate: 'April 15, 2026',
    clientName: 'Ms. Katherine Porciuncula',
    clientFacility: 'Allied Care Experts Medical Center',
    clientAddress: 'Lot 2975, C-1 Doña Remedios Trinidad Hwy, Baliuag, Bulacan',
    itemDescription: 'Calibration Sticks Bact Alert',
    packaging: '1 Kit',
    unitPrice: 31500.0,
    quantity: 1,
    totalPrice: 31500.0,
    status: 'AWAITING_CLIENT_APPROVAL',
    clientApprovalEvidence: null,
    clientApprovalDate: null,
    clientPoReference: null,
    isFulfillmentAllowed: false,
  },
  {
    id: 'quote-2',
    qrn: 'QRN20260808091',
    rfqNo: 'RFQ-2026-0094',
    roiId: null,
    quotationDate: 'August 08, 2026',
    clientName: 'Dr. Manuel Santos',
    clientFacility: 'Medical City Clark Diagnostic Center',
    clientAddress: 'Clark Freeport Zone, Angeles, Pampanga',
    itemDescription: 'Blood Chemistry Reagents Kit',
    packaging: '1 Box',
    unitPrice: 58000.0,
    quantity: 1,
    totalPrice: 58000.0,
    status: 'DRAFT',
    clientApprovalEvidence: null,
    clientApprovalDate: null,
    clientPoReference: null,
    isFulfillmentAllowed: false,
  },
];

export const DEFAULT_SOA_ROWS = [
  {
    id: 'soa-1',
    clientName: 'Allied Care Experts (ACE) Medical Center',
    salesInvoiceNo: 'SI-6087',
    drNo: 'DR-6075',
    siDate: '18-Jun-2026',
    dueDate: '7/18/2026',
    terms: '30 Days Net',
    ageDays: 47,
    invoiceAmount: 16960.0,
    amountPaid: 0.0,
    invoiceBalance: 16960.0,
    runningBalance: 16960.0,
    isFinalized: false,
    finalizedByRole: null,
  },
  {
    id: 'soa-2',
    clientName: 'Allied Care Experts (ACE) Medical Center',
    salesInvoiceNo: 'SI-6107',
    drNo: 'DR-6097',
    siDate: '26-Jun-2026',
    dueDate: '7/26/2026',
    terms: '30 Days Net',
    ageDays: 39,
    invoiceAmount: 1968.0,
    amountPaid: 0.0,
    invoiceBalance: 1968.0,
    runningBalance: 18928.0,
    isFinalized: false,
    finalizedByRole: null,
  },
  {
    id: 'soa-3',
    clientName: 'Allied Care Experts (ACE) Medical Center',
    salesInvoiceNo: 'SI-6118',
    drNo: 'DR-6113',
    siDate: '30-Jun-2026',
    dueDate: '7/30/2026',
    terms: '30 Days Net',
    ageDays: 35,
    invoiceAmount: 13280.0,
    amountPaid: 0.0,
    invoiceBalance: 13280.0,
    runningBalance: 32208.0,
    isFinalized: false,
    finalizedByRole: null,
  },
];

export const DEFAULT_COLLECTIONS = [
  {
    id: 'col-1',
    checkNo: 'CHK-BDO-99201',
    bank: 'BDO Unibank',
    date: '2026-08-01',
    amount: 25000.0,
    customer: 'Allied Care Experts (ACE) Medical Center',
    allocatedInvoices: [
      { invoiceNo: 'SI-6087', allocatedAmount: 16960.0 },
      { invoiceNo: 'SI-6107', allocatedAmount: 1968.0 },
    ],
    unappliedCredit: 6072.0,
    status: 'POSTED_TO_QBO',
  },
];

export const DEFAULT_PO_LIST = [
  {
    id: 'po-1',
    poNumber: 'PO-2026-0891',
    vendorName: 'BioMerieux Diagnostics Corp',
    itemDescription: 'Calibration Sticks Bact Alert',
    sku: 'ACC-BACT-01',
    poQty: 100,
    rrQtyReceived: 100,
    invoiceRef: 'SI #8812',
    totalAmount: 142000.0,
    accountingApproved: true,
    gmApproved: true,
    dcsApproved: true,
    isShortageException: false,
    shortageReason: null,
    status: 'VERIFIED_3WAY',
    ownerRole: 'Warehouse',
  },
  {
    id: 'po-2',
    poNumber: 'PO-2026-0914',
    vendorName: 'Sysmex Philippines Inc.',
    itemDescription: 'Blood Chemistry Reagents Kit',
    sku: 'ACC-REAG-04',
    poQty: 50,
    rrQtyReceived: 0,
    invoiceRef: 'Awaiting',
    totalAmount: 450000.0,
    accountingApproved: false,
    gmApproved: false,
    dcsApproved: false,
    isShortageException: true,
    shortageReason: 'Critical reagent demand spike at Pampanga facility',
    status: 'PENDING_ACCOUNTING',
    ownerRole: 'Bookkeeper',
  },
  {
    id: 'po-3',
    poNumber: 'PO-2026-0925',
    vendorName: 'Mindray Medical Corp',
    itemDescription: 'Hematology Lyse Reagent 5L',
    sku: 'ACC-HEMA-09',
    poQty: 80,
    rrQtyReceived: 80,
    invoiceRef: 'SI #9901',
    totalAmount: 640000.0,
    accountingApproved: true,
    gmApproved: true,
    dcsApproved: true,
    isShortageException: false,
    shortageReason: null,
    status: 'VERIFIED_3WAY',
    ownerRole: 'Warehouse',
  },
];

export const DEFAULT_VENDOR_INVOICES = [
  {
    id: 'vi-1',
    invoiceNumber: 'SI-8812',
    poNumber: 'PO-2026-0891',
    vendorName: 'BioMerieux Diagnostics Corp',
    invoiceDate: '2026-07-28',
    totalAmount: 142000.0,
    attachmentUrl: 'BioMerieux_Vendor_Invoice_8812.pdf',
    matchStatus: 'VERIFIED_3WAY',
  },
];

export const DEFAULT_GL_ACCOUNTS = [
  { code: '6100', name: 'Freight & Delivery', category: 'Expense', isActive: true },
  { code: '6200', name: 'Utilities Expense', category: 'Expense', isActive: true },
  { code: '6300', name: 'Professional & Calibration Fees', category: 'Expense', isActive: true },
  { code: '6400', name: 'Office & Warehouse Supplies', category: 'Expense', isActive: true },
  { code: '6500', name: 'Travel & Representation', category: 'Expense', isActive: false },
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
    attachmentUrl: 'LBC_Courier_Waybill_104.pdf',
    disbursementProof: 'BDO_Online_Transfer_Ref_992081.pdf',
    status: 'RELEASED_PAID',
    ownerRole: 'Chairman (DCS)',
  },
  {
    id: 'rfp-2',
    rfpNo: 'RFP-2026-0112',
    payee: 'Meralco Electric Utilities',
    glAccount: '6200 - Utilities Expense',
    description: 'San Fernando warehouse climate-control power bill',
    amount: 34200.0,
    requestedBy: 'General Manager',
    attachmentUrl: 'Meralco_Bill_Aug2026.pdf',
    disbursementProof: null,
    status: 'PENDING_GM',
    ownerRole: 'General Manager',
  },
];

export const DEFAULT_QBO_QUEUE = [
  {
    id: 'qbo-1',
    docType: 'Sales Invoice',
    docNumber: 'SI-6087',
    entityName: 'Allied Care Experts (ACE) Medical Center',
    amount: 16960.0,
    qboRefId: 'QBO-INV-88902',
    syncStatus: 'SYNCED',
    lastAttempt: '2026-08-04 14:30:12',
    errorMessage: '',
  },
  {
    id: 'qbo-2',
    docType: 'Vendor Bill',
    docNumber: 'PO-2026-0891 / SI-8812',
    entityName: 'BioMerieux Diagnostics Corp',
    amount: 142000.0,
    qboRefId: 'QBO-BILL-44102',
    syncStatus: 'SYNCED',
    lastAttempt: '2026-08-04 15:10:45',
    errorMessage: '',
  },
  {
    id: 'qbo-3',
    docType: 'Customer Payment Collection',
    docNumber: 'CHK-BDO-99201',
    entityName: 'Allied Care Experts (ACE) Medical Center',
    amount: 25000.0,
    qboRefId: 'Awaiting Sync',
    syncStatus: 'QUEUED',
    lastAttempt: '2026-08-05 08:45:00',
    errorMessage: '',
  },
];

export const DEFAULT_AUDIT_LOGS = [
  { id: '1', time: '02:55 PM', user: 'Sales Officer (Mark)', action: 'Created RFQ-2026-0081 with validated RTU census attachment' },
  { id: '2', time: '03:10 PM', user: 'Marketing Officer (RMT)', action: 'Completed ROI calculation version 1 for RFQ-2026-0081' },
  { id: '3', time: '03:14 PM', user: 'General Manager (Karen)', action: 'Approved Quotation QRN20240415037 (Direct to Client Approval)' },
];

const RESET_INTERVAL_MS = 30 * 60 * 1000;
const DEMO_RESET_TIME_KEY = 'accustandard_demo_reset_time';
const LEGACY_DEMO_RESET_TIME_KEY = 'accustanda_demo_reset_time';

export function useDemoStore() {
  const [lastResetTime, setLastResetTime] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(DEMO_RESET_TIME_KEY) ?? localStorage.getItem(LEGACY_DEMO_RESET_TIME_KEY);
      if (saved) {
        localStorage.setItem(DEMO_RESET_TIME_KEY, saved);
        localStorage.removeItem(LEGACY_DEMO_RESET_TIME_KEY);
        return Number(saved);
      }
    }
    return Date.now();
  });

  const [secondsRemaining, setSecondsRemaining] = useState<number>(30 * 60);

  const resetDemoData = useCallback(() => {
    const now = Date.now();
    setLastResetTime(now);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_RESET_TIME_KEY, String(now));
      localStorage.removeItem(LEGACY_DEMO_RESET_TIME_KEY);
      localStorage.removeItem('accustandard_demo_state');
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
