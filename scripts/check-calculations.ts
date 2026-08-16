/**
 * Self-check for the invoice calculation engine. Run:
 *
 *   npx tsc scripts/check-calculations.ts --outDir .check \
 *     --module commonjs --target es2017 --skipLibCheck --esModuleInterop --strict
 *   node .check/scripts/check-calculations.js
 *   rm -rf .check
 */
import { calculateItemTotal, calculatePricing } from '../src/invoice/calculations';
import { InvoiceItem } from '../src/invoice/types';

const assert = (cond: boolean, msg: string) => {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`ok: ${msg}`);
};

const basic: InvoiceItem = { id: '1', name: 'Wedding shoot', quantity: 1, unitPrice: 50000 };
const taxed: InvoiceItem = { id: '2', name: 'Album', quantity: 2, unitPrice: 1000, taxRate: 18 };
const discounted: InvoiceItem = { id: '3', name: 'Drone', quantity: 1, unitPrice: 10000, discount: 500, taxRate: 5 };

assert(calculateItemTotal(basic) === 50000, 'single item, qty 1');
assert(calculateItemTotal(taxed) === 2360, 'qty x price + 18% tax (2000 + 360)');
assert(calculateItemTotal(discounted) === 9975, 'discount then 5% tax (9500 + 475)');
assert(calculatePricing({ items: [basic], amountPaid: 10000 }).balanceDue === 40000, 'balance after advance');

const p = calculatePricing({
  items: [basic, taxed, discounted],
  amountPaid: 50000,
  extraCharges: 200,
});
assert(p.subtotal === 62000, 'subtotal sum (50000+2000+10000)');
assert(p.discountTotal === 500, 'discount sum');
assert(p.taxTotal === 835, 'tax sum (360+475)');
assert(p.grandTotal === 62535, 'grand total (62000-500+835+200)');
assert(p.balanceDue === 12535, 'balance due');

assert(calculatePricing({ items: [basic], amountPaid: 999999 }).balanceDue === 0, 'balance clamps at 0');
assert(calculatePricing({ items: [], amountPaid: 0 }).grandTotal === 0, 'empty invoice is zero');

console.log('All calculation checks passed.');
