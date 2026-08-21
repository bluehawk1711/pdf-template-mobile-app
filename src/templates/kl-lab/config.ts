import { InvoiceTemplate } from '../types';
import { renderInvoice } from './pdf';
import { KL_LAB_PAGES } from './pages.generated';
import { PAGE_ASSETS } from './template1';

/**
 * K.L LAB — Template 1.
 * Reference design: pdfs/K.L LAB.pdf (9-page pharmaceutical brochure).
 *
 * This template has NO input fields: the brochure content is fixed and the
 * PDF is generated directly. Templates with fields would declare them here
 * (see src/templates/types.ts) and the dynamic form would render them.
 *
 * Each page declares background + main image assets for the animated
 * React Native page viewer. The PDF renderer uses the full page images
 * from pages.generated.ts.
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
  pages: KL_LAB_PAGES.map((p, index) => {
    const asset = PAGE_ASSETS[index];
    return {
      uri: p.src,
      width: p.w,
      height: p.h,
      backgroundImage: asset?.background,
      mainImage: asset?.main,
    };
  }),
  renderPdf: renderInvoice,
  renderPreview: renderInvoice, // same HTML for preview and print (spec §15)
};
