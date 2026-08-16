/**
 * Invoice calculation engine (spec §11) — the single source of truth for money.
 *
 * The UI, preview, PDF, and history all consume these results; screens never
 * compute totals themselves. Money is handled in ₹ with rounding at every
 * boundary (round2) to avoid floating-point drift. paise-integer storage is
 * the upgrade path if precision ever demands it.
 */

import { InvoiceData, InvoiceItem, InvoicePricing } from './types';

const round2 = (n: number): number => Math.round(n * 100) / 100;

export interface LineBreakdown {
  subtotal: number; // qty × unitPrice
  discount: number; // clamped line discount
  taxable: number; // subtotal − discount
  tax: number; // taxable × taxRate%
  total: number; // taxable + tax
}

export function breakdownLine(item: InvoiceItem): LineBreakdown {
  const subtotal = round2(item.quantity * item.unitPrice);
  const discount = round2(Math.min(item.discount ?? 0, subtotal));
  const taxable = round2(subtotal - discount);
  const tax = round2(taxable * ((item.taxRate ?? 0) / 100));
  return { subtotal, discount, taxable, tax, total: round2(taxable + tax) };
}

/** Per-line total including tax (for itemised display). */
export const calculateItemTotal = (item: InvoiceItem): number =>
  breakdownLine(item).total;

export interface PricingInput {
  items: InvoiceItem[];
  amountPaid: number;
  extraCharges?: number;
}

export function calculatePricing(input: PricingInput): InvoicePricing {
  const { items, amountPaid, extraCharges = 0 } = input;

  const lines = items.map(breakdownLine);
  const sum = (f: (l: LineBreakdown) => number) =>
    round2(lines.reduce((acc, l) => acc + f(l), 0));

  const subtotal = sum((l) => l.subtotal);
  const discountTotal = sum((l) => l.discount);
  const taxTotal = sum((l) => l.tax);
  const extra = round2(extraCharges);
  const grandTotal = round2(subtotal - discountTotal + taxTotal + extra);
  const paid = round2(amountPaid);
  const balanceDue = Math.max(round2(grandTotal - paid), 0);

  return {
    subtotal,
    discountTotal,
    taxTotal,
    extraCharges: extra,
    grandTotal,
    balanceDue,
  };
}

/** Fills `pricing` on an invoice from its items + payment. */
export function withPricing(
  invoice: Omit<InvoiceData, 'pricing'>
): InvoiceData {
  return {
    ...invoice,
    pricing: calculatePricing({
      items: invoice.items,
      amountPaid: invoice.payment.amountPaid,
    }),
  };
}
