/**
 * Generates sample K.L LAB invoices (edge cases) as HTML for visual
 * verification. Run after compiling (see below), then print/screenshot with
 * headless Chrome and review the PNGs in pdfs/kl-lab/rendered/.
 *
 *   npx tsc scripts/generate-kl-lab-samples.ts --outDir .check \
 *     --module commonjs --target es2017 --skipLibCheck --esModuleInterop --strict
 *   node .check/scripts/generate-kl-lab-samples.js
 */
import * as fs from 'fs';
import * as path from 'path';
import { renderInvoice } from '../src/templates/kl-lab/pdf';
import { InvoiceData, InvoiceItem } from '../src/invoice/types';
import { calculatePricing } from '../src/invoice/calculations';
import { DEFAULT_BUSINESS } from '../src/invoice/business';

const OUT = 'tmp/kl-pdf';

const item = (id: string, name: string, unitPrice: number, extra: Partial<InvoiceItem> = {}): InvoiceItem => ({
  id,
  name,
  quantity: 1,
  unitPrice,
  ...extra,
});

const makeInvoice = (
  id: string,
  items: InvoiceItem[],
  over: Partial<InvoiceData> = {}
): InvoiceData => {
  const amountPaid = over.payment?.amountPaid ?? 0;
  const base: InvoiceData = {
    id,
    meta: {
      mode: 'invoice',
      dateIssued: '2026-08-14T10:00:00.000Z',
      eventDate: '2026-11-21T00:00:00.000Z',
      eventType: 'Wedding shoot',
      venue: 'Titwala, Maharashtra',
    },
    business: { ...DEFAULT_BUSINESS },
    client: {
      name: 'Rahul Sharma',
      phone: '9820011223',
      email: 'rahul@example.com',
      address: 'B-402, Green Park Society, Thane West, Maharashtra 400601',
    },
    items,
    payment: { amountPaid, upiId: DEFAULT_BUSINESS.upiId },
    templateId: 'kl-lab',
    createdAt: '2026-08-14T10:00:00.000Z',
    pricing: calculatePricing({ items, amountPaid }),
    ...over,
  };
  return base;
};

const samples: Array<[string, InvoiceData]> = [
  ['01-basic', makeInvoice('GP260814-001', [
    item('a', 'Traditional Photo', 15000),
    item('b', 'Traditional Video', 25000),
    item('c', 'Drone Shoot', 10000),
  ], { payment: { amountPaid: 10000, upiId: DEFAULT_BUSINESS.upiId } })],

  ['02-long-list', makeInvoice('GP260814-002', Array.from({ length: 22 }, (_, i) =>
    item(`l${i}`, `Service item ${i + 1}`, 1000 + i * 250)
  ))],

  ['03-missing-optionals', makeInvoice('GP260814-003', [
    item('a', 'Event Shoot', 30000),
  ], {
    client: { name: 'Aarti Desai' },
    meta: { mode: 'invoice', dateIssued: '2026-08-14T10:00:00.000Z' },
  })],

  ['04-tax-discount', makeInvoice('GP260814-004', [
    item('a', 'Cinematic Film', 50000, { quantity: 2, taxRate: 18 }),
    item('b', 'Album', 12000, { discount: 2000, taxRate: 5 }),
  ], { payment: { amountPaid: 20000, upiId: DEFAULT_BUSINESS.upiId } })],

  ['05-quotation', makeInvoice('', [
    item('a', 'Pre-wedding shoot', 25000),
  ], {
    id: '',
    meta: { mode: 'quotation', dateIssued: '2026-08-14T10:00:00.000Z' },
    payment: { amountPaid: 0 },
  })],

  ['06-long-names', makeInvoice('GP260814-006', [
    item('a', 'Annual Function shoot with drone coverage and cinematic edit', 45000),
  ], {
    client: {
      name: 'Shri. Ganesh Krishna Pandit & Family',
      phone: '9820011223',
      email: 'ganesh.pandit.very.long.email.address@example.co.in',
      address: 'Flat 501, Sunrise Heights, Plot 12, Sector 15, Kharghar, Navi Mumbai, Maharashtra 410210',
    },
    business: {
      ...DEFAULT_BUSINESS,
      gstin: '27ABCDE1234F1Z5',
    },
  })],

  ['07-notes-terms', makeInvoice('GP260814-007', [
    item('a', 'Baby Shoot', 8000),
  ], {
    notes: { notes: 'Orders are confirmed only upon receipt of an advance payment.\nAdvance payments are non-refundable.', terms: 'Any additional time beyond the original booking is billed at \u20B91,000 per hour.' },
  })],
];

fs.mkdirSync(OUT, { recursive: true });
for (const [name, invoice] of samples) {
  const file = path.join(OUT, `${name}.html`);
  fs.writeFileSync(file, renderInvoice(invoice));
  console.log(`wrote ${file} (${invoice.items.length} items, balance ${invoice.pricing.balanceDue})`);
}
console.log(`\n${samples.length} samples written to ${OUT}/`);
