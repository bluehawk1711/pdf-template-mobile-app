import { InvoiceTemplate } from '../types';
import { renderInvoice } from './pdf';

/**
 * K.L LAB — Template 1.
 * Reference design: pdfs/K.L LAB.pdf (9-page pharmaceutical brochure).
 *
 * This template has NO input fields: the brochure content is fixed and the
 * PDF is generated directly. Templates with fields would declare them here
 * (see src/templates/types.ts) and the dynamic form would render them.
 */
export const klLabTemplate: InvoiceTemplate = {
  id: 'kl-lab',
  name: 'K.L LAB',
  description:
    '9-page pharmaceutical product brochure — generated directly as a PDF, no details required.',
  tags: ['Brochure', 'Professional'],
  accent: '#e84b38', // brand red, verified from the reference PDF (design.md)
  sections: [],
  fields: [],
  renderPdf: renderInvoice,
  renderPreview: renderInvoice, // same HTML for preview and print (spec §15)
};
