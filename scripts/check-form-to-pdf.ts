/**
 * End-to-end check of the dynamic form flow:
 * template fields -> initial values -> filled values -> InvoiceData -> HTML.
 *
 *   npx tsc scripts/check-form-to-pdf.ts --outDir .check \
 *     --module commonjs --target es2017 --skipLibCheck --esModuleInterop --strict
 *   node .check/scripts/check-form-to-pdf.js && rm -rf .check
 */
import { getTemplate } from '../src/templates/registry';
import {
  buildInitialValues,
  buildInvoiceFromValues,
  parseItems,
} from '../src/invoice/formBuilder';
import { renderInvoice } from '../src/templates/kl-lab/pdf';

const assert = (cond: boolean, msg: string) => {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`ok: ${msg}`);
};

async function main() {
  const template = getTemplate('kl-lab')!;

  // 1. Initial values from the template fields
  const values = buildInitialValues(template.fields, null);
  assert(values['client.name'] === '', 'client.name starts empty');
  assert(values['business.name'] === 'GP Studio', 'business.name prefilled from DEFAULT_BUSINESS');
  assert(Array.isArray(values['items']) && values['items'].length === 1, 'one blank item row');

  // 2. Fill the form like a user would
  values['client.name'] = 'Rahul Sharma';
  values['client.phone'] = '9820011223';
  values['meta.eventType'] = 'Wedding shoot';
  values['payment.amountPaid'] = '10000';
  values['items'][0] = {
    ...values['items'][0],
    name: 'Traditional Photo',
    quantity: '1',
    unitPrice: '15000',
  };
  values['items'].push({
    id: 'x2',
    name: 'Drone Shoot',
    quantity: '2',
    unitPrice: '5000',
    taxRate: '18',
    discount: '',
  });

  const parsed = parseItems(values['items']);
  assert(parsed.length === 2, 'both items valid');
  assert(parsed[0].unitPrice === 15000 && parsed[0].quantity === 1, 'item parsed');

  // 3. Build the canonical invoice (invoice mode -> gets a number)
  const invoice = await buildInvoiceFromValues(values, { mode: 'invoice', templateId: 'kl-lab' });
  assert(invoice.id.startsWith('GP'), `invoice numbered: ${invoice.id}`);
  assert(invoice.client.name === 'Rahul Sharma', 'client mapped');
  assert(invoice.meta.eventType === 'Wedding shoot', 'event mapped');
  assert(invoice.pricing.subtotal === 25000, 'subtotal 15000 + 2x5000');
  assert(invoice.pricing.taxTotal === 1800, 'tax 18% on 10000');
  assert(invoice.pricing.grandTotal === 26800, 'grand total');
  assert(invoice.pricing.balanceDue === 16800, 'balance after 10000 advance');
  assert(invoice.templateId === 'kl-lab', 'template attached');

  // 4. The renderer consumes it
  const html = renderInvoice(invoice);
  assert(html.includes('Rahul Sharma'), 'renderer shows client name');
  assert(html.includes('\u20B915,000.00'), 'renderer shows rate');
  assert(html.includes('Balance Due'), 'renderer shows balance row');
  assert(html.includes('INVOICE') && html.includes(invoice.id), 'renderer shows invoice number');

  // 5. Quotation: no number, no QR
  const quote = await buildInvoiceFromValues(values, { mode: 'quotation', templateId: 'kl-lab' });
  assert(quote.id === '', 'quotation has no number');
  const quoteHtml = renderInvoice(quote);
  assert(quoteHtml.includes('QUOTATION') && !quoteHtml.includes('upi://pay'), 'quotation has no QR');

  // 6. Missing optionals render cleanly
  const minimal = await buildInvoiceFromValues(
    { ...buildInitialValues(template.fields, null), 'client.name': 'Aarti' },
    { mode: 'invoice', templateId: 'kl-lab' }
  );
  const minimalHtml = renderInvoice(minimal);
  assert(minimalHtml.includes('Aarti'), 'minimal invoice renders');

  console.log('All form -> PDF checks passed.');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
