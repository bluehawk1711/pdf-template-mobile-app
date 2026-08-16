/**
 * Pure logic for the dynamic form (plan.md Phase 5): turning template field
 * values into a canonical InvoiceData. Kept out of the screen so it is
 * testable and reusable by any future template's form.
 */

import { InvoiceMode } from '../types';
import { TemplateField } from '../templates/types';
import {
  InvoiceBusiness,
  InvoiceClient,
  InvoiceData,
  InvoiceItem,
  InvoiceMeta,
  InvoiceNotes,
} from './types';
import { calculatePricing } from './calculations';
import { createInvoiceNumber } from './numbering';
import { DEFAULT_BUSINESS } from './business';
import { generateId } from '../utils/uuid';

/** Raw line-item input from the items editor (numbers kept as strings). */
export interface ItemDraft {
  id: string;
  name: string;
  quantity: string;
  unitPrice: string;
  discount?: string;
  taxRate?: string;
}

export const blankItem = (): ItemDraft => ({
  id: generateId(),
  name: '',
  quantity: '1',
  unitPrice: '',
  discount: '',
  taxRate: '',
});

const getPath = (obj: any, path: string): any =>
  path.split('.').reduce((c, p) => (c == null ? undefined : c[p]), obj);

const defaultFor = (field: TemplateField): any => {
  switch (field.key) {
    case 'business.name': return DEFAULT_BUSINESS.name;
    case 'business.tagline': return DEFAULT_BUSINESS.tagline ?? '';
    case 'business.phone': return DEFAULT_BUSINESS.phone ?? '';
    case 'business.email': return DEFAULT_BUSINESS.email ?? '';
    case 'business.address': return DEFAULT_BUSINESS.address ?? '';
    case 'business.gstin': return DEFAULT_BUSINESS.gstin ?? '';
    case 'meta.eventDate': return new Date().toISOString();
    case 'meta.dateIssued': return new Date().toISOString();
    default: return '';
  }
};

export const buildInitialValues = (
  fields: TemplateField[],
  pending?: InvoiceData | null
): Record<string, any> => {
  const values: Record<string, any> = {};
  for (const field of fields) {
    if (field.type === 'items') {
      values[field.key] = pending?.items?.length
        ? pending.items.map(itemToDraft)
        : [blankItem()];
      continue;
    }
    const existing = pending ? getPath(pending, field.key) : undefined;
    values[field.key] =
      existing != null && existing !== '' ? String(existing) : defaultFor(field);
  }
  return values;
};

export const itemToDraft = (item: InvoiceItem): ItemDraft => ({
  id: item.id,
  name: item.name,
  quantity: String(item.quantity),
  unitPrice: String(item.unitPrice),
  discount: item.discount != null ? String(item.discount) : '',
  taxRate: item.taxRate != null ? String(item.taxRate) : '',
});

/** Valid items only (name + qty>0 + rate>0), converted to InvoiceItem. */
export const parseItems = (items: ItemDraft[]): InvoiceItem[] =>
  items
    .filter(
      (it) =>
        it.name.trim() !== '' &&
        (Number(it.quantity) || 0) > 0 &&
        (Number(it.unitPrice) || 0) > 0
    )
    .map((it) => ({
      id: it.id,
      name: it.name.trim(),
      quantity: Number(it.quantity) || 0,
      unitPrice: Number(it.unitPrice) || 0,
      discount: it.discount ? Number(it.discount) : undefined,
      taxRate: it.taxRate ? Number(it.taxRate) : undefined,
    }));

export interface BuildInvoiceOptions {
  mode: InvoiceMode;
  templateId: string;
}

/** Builds the canonical InvoiceData from the form's flat field values. */
export const buildInvoiceFromValues = async (
  values: Record<string, any>,
  options: BuildInvoiceOptions
): Promise<InvoiceData> => {
  const now = new Date().toISOString();
  const items = parseItems(values['items'] ?? []);
  const amountPaid = Number(values['payment.amountPaid']) || 0;

  const meta: InvoiceMeta = {
    mode: options.mode,
    dateIssued: now,
    eventDate: values['meta.eventDate'] || undefined,
    eventType: values['meta.eventType'] || undefined,
    venue: values['meta.venue'] || undefined,
  };

  const business: InvoiceBusiness = { ...DEFAULT_BUSINESS };
  const setBusiness = (key: keyof InvoiceBusiness, value: any) => {
    if (value) business[key] = value;
  };
  setBusiness('name', values['business.name']);
  setBusiness('tagline', values['business.tagline']);
  setBusiness('phone', values['business.phone']);
  setBusiness('email', values['business.email']);
  setBusiness('address', values['business.address']);
  setBusiness('gstin', values['business.gstin']);

  const client: InvoiceClient = {
    name: String(values['client.name'] ?? ''),
    phone: values['client.phone'] || undefined,
    email: values['client.email'] || undefined,
    address: values['client.address'] || undefined,
  };

  const notesRaw = String(values['notes.notes'] ?? '').trim();
  const termsRaw = String(values['notes.terms'] ?? '').trim();
  const notes: InvoiceNotes | undefined =
    notesRaw || termsRaw
      ? { notes: notesRaw || undefined, terms: termsRaw || undefined }
      : undefined;

  return {
    id: options.mode === 'quotation' ? '' : await createInvoiceNumber(),
    meta,
    business,
    client,
    items,
    payment: { amountPaid, upiId: business.upiId },
    notes,
    templateId: options.templateId,
    createdAt: now,
    pricing: calculatePricing({ items, amountPaid }),
  };
};
