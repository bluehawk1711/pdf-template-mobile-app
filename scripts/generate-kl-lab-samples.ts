/**
 * Generates the K.L LAB brochure HTML for visual verification. The template is
 * fully static (9 reference page images), so a single sample is enough.
 *
 *   npx tsc scripts/generate-kl-lab-samples.ts --outDir .check \
 *     --module commonjs --target es2017 --skipLibCheck --esModuleInterop --strict
 *   node .check/scripts/generate-kl-lab-samples.js
 */
import * as fs from 'fs';
import * as path from 'path';
import { renderInvoice } from '../src/templates/kl-lab/pdf';
import { buildDefaultInvoice } from '../src/invoice/formBuilder';

const OUT = 'tmp/kl-pdf';

const invoice = buildDefaultInvoice({ templateId: 'kl-lab' });

fs.mkdirSync(OUT, { recursive: true });
const file = path.join(OUT, 'brochure.html');
fs.writeFileSync(file, renderInvoice(invoice));
console.log(`wrote ${file} (${(fs.statSync(file).size / 1024 / 1024).toFixed(2)} MB)`);
console.log('Render with headless Chrome to review the PDF pages.');
