/**
 * Canonical invoice document model (spec §3).
 *
 * This is the shape templates render, history stores, and the PDF is built
 * from. It is independent of the visual template and of the draft/form flow
 * (the draft types in src/types.ts are the current form state; they converge
 * here via the mapping in InvoiceContext).
 */

import { InvoiceMode } from '../types';

/** A single billable line item (service / product). */
export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  /** Optional grouping label (e.g. "Wedding shoot") — templates may group by it. */
  category?: string;
  quantity: number;
  /** Unit price in ₹. */
  unitPrice: number;
  /** Absolute line discount in ₹ (clamped to the line subtotal). */
  discount?: number;
  /** Tax rate in percent, e.g. 18 for 18%. */
  taxRate?: number;
}

/** The business issuing the invoice (from a business profile; default in business.ts). */
export interface InvoiceBusiness {
  name: string;
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
  gstin?: string;
  upiId?: string;
}

export interface InvoiceClient {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface InvoiceMeta {
  mode: InvoiceMode;
  dateIssued: string; // ISO
  eventDate?: string; // ISO
  eventType?: string;
  venue?: string;
  currency?: 'INR';
}

export interface InvoicePayment {
  /** Amount already paid (advance) in ₹. */
  amountPaid: number;
  upiId?: string;
}

/** Computed by calculatePricing — never hand-written in screens. */
export interface InvoicePricing {
  subtotal: number; // Σ qty × unitPrice
  discountTotal: number; // Σ line discounts
  taxTotal: number; // Σ line taxes
  extraCharges: number; // additional charges
  grandTotal: number; // subtotal − discount + tax + extra
  balanceDue: number; // max(grandTotal − amountPaid, 0)
}

export interface InvoiceNotes {
  notes?: string;
  terms?: string;
}

export interface InvoiceData {
  /** Invoice number; '' for quotations (quotations are not numbered/saved). */
  id: string;
  meta: InvoiceMeta;
  business: InvoiceBusiness;
  client: InvoiceClient;
  items: InvoiceItem[];
  pricing: InvoicePricing;
  payment: InvoicePayment;
  notes?: InvoiceNotes;
  templateId: string;
  createdAt: string; // ISO
  pdfUrl?: string; // local file URI of the exported PDF (future)
  storagePath?: string; // storage path if synced to a backend (future)
}
