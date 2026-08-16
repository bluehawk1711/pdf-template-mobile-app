/**
 * End-to-end check of the template flow:
 *   - Fieldless templates (K.L LAB): buildDefaultInvoice -> 9-page brochure HTML.
 *   - The dynamic form engine (synthetic fields) -> InvoiceData -> HTML.
 *
 *   npx tsc scripts/check-form-to-pdf.ts --outDir .check \
 *     --module commonjs --target es2017 --skipLibCheck --esModuleInterop --strict
 *   node .check/scripts/check-form-to-pdf.js && rm -rf .check
 */
import { getTemplate } from '../src/templates/registry';
import {
  buildDefaultInvoice,
  buildInitialValues,
  buildInvoiceFromValues,
  parseItems,
} from '../src/invoice/formBuilder';
import { renderInvoice } from '../src/templates/kl-lab/pdf';
import { TemplateField } from '../src/templates/types';

const assert = (cond: boolean, msg: string) => {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`ok: ${msg}`);
};

const SYNTHETIC_FIELDS: TemplateField[] = [
  { key: 'client.name', label: 'Client name', type: 'text', required: true },
  { key: 'client.phone', label: 'Phone', type: 'text' },
  { key: 'payment.amountPaid', label: 'Amount paid', type: 'number' },
  { key: 'items', label: 'Services', type: 'items' },
];

async function main() {
  const template = getTemplate('kl-lab')!;

  // ── Fieldless template flow (K.L LAB brochure) ────────────────────────
  assert(template.fields.length === 0, 'kl-lab declares no input fields');

  const brochure = buildDefaultInvoice({ templateId: 'kl-lab' });
  assert(brochure.items.length === 0, 'default brochure has no items');
  assert(brochure.templateId === 'kl-lab', 'template attached');
  assert(brochure.pricing.grandTotal === 0, 'brochure pricing is zero');

  const html = renderInvoice(brochure);
  assert(html.includes('KL LAB'), 'cover shows KL LAB');
  assert(html.includes('Qutocal'), 'page 2 product present');
  assert(html.includes('MUKOCEF'), 'page 5 product present');
  assert(html.includes('KLRAB-DSR'), 'page 8 product present');
  assert(html.includes('Thank You Doctor'), 'closing page present');
  const pageCount = (html.match(/class="page"/g) || []).length;
  assert(pageCount === 9, `brochure has 9 pages (got ${pageCount})`);

  // ── Dynamic form engine (synthetic fields, for future templates) ──────
  const values = buildInitialValues(SYNTHETIC_FIELDS, null);
  assert(values['client.name'] === '', 'client.name starts empty');
  assert(Array.isArray(values['items']) && values['items'].length === 1, 'one blank item row');

  values['client.name'] = 'Rahul Sharma';
  values['client.phone'] = '9820011223';
  values['payment.amountPaid'] = '10000';
  values['items'][0] = {
    ...values['items'][0],
    name: 'Consultation',
    quantity: '1',
    unitPrice: '15000',
  };
  values['items'].push({
    id: 'x2',
    name: 'Follow-up',
    quantity: '2',
    unitPrice: '5000',
    taxRate: '18',
    discount: '',
  });

  const parsed = parseItems(values['items']);
  assert(parsed.length === 2, 'both items valid');
  assert(parsed[0].unitPrice === 15000 && parsed[0].quantity === 1, 'item parsed');

  const invoice = await buildInvoiceFromValues(values, { mode: 'invoice', templateId: 'kl-lab' });
  assert(invoice.id.startsWith('GP'), `invoice numbered: ${invoice.id}`);
  assert(invoice.client.name === 'Rahul Sharma', 'client mapped');
  assert(invoice.pricing.subtotal === 25000, 'subtotal 15000 + 2x5000');
  assert(invoice.pricing.taxTotal === 1800, 'tax 18% on 10000');
  assert(invoice.pricing.grandTotal === 26800, 'grand total');
  assert(invoice.pricing.balanceDue === 16800, 'balance after 10000 advance');

  const invoiceHtml = renderInvoice(invoice);
  assert(invoiceHtml.includes('KL LAB'), 'renderer still produces the brochure');

  // Quotation: no number
  const quote = await buildInvoiceFromValues(values, { mode: 'quotation', templateId: 'kl-lab' });
  assert(quote.id === '', 'quotation has no number');

  // Missing optionals render cleanly
  const minimal = await buildInvoiceFromValues(
    { ...buildInitialValues(SYNTHETIC_FIELDS, null), 'client.name': 'Aarti' },
    { mode: 'invoice', templateId: 'kl-lab' }
  );
  const minimalHtml = renderInvoice(minimal);
  assert(minimalHtml.includes('KL LAB'), 'minimal invoice still renders the brochure');

  console.log('All template flow checks passed.');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
