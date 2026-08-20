import { InvoiceTemplate } from '../types';
import { renderInvoice } from './pdf';
import { KL_LAB_PAGES } from './pages.generated';

/** HTML template paths for each page (index-based) */
const KL_LAB_HTML_PAGES = [
  require('../../../assets/template1/html/page1.html'),
  require('../../../assets/template1/html/page2.html'),
  require('../../../assets/template1/html/page3.html'),
  require('../../../assets/template1/html/page4.html'),
  require('../../../assets/template1/html/page5.html'),
  require('../../../assets/template1/html/page6.html'),
  require('../../../assets/template1/html/page7.html'),
  require('../../../assets/template1/html/page8.html'),
  require('../../../assets/template1/html/page9.html'),
];

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
  pages: KL_LAB_PAGES.map((p, index) => ({
    uri: p.src,
    width: p.w,
    height: p.h,
    htmlPath: KL_LAB_HTML_PAGES[index],
  })),
  renderPdf: renderInvoice,
  renderPreview: renderInvoice, // same HTML for preview and print (spec §15)
};
