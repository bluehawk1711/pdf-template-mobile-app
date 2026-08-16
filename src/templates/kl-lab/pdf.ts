/**
 * K.L LAB — Template 1 renderer.
 *
 * The brochure is fully static: it renders the 9 reference page images
 * (assets/template1/page1.png .. page9.png, embedded as base64 data URIs via
 * pages.generated.ts) as full-bleed PDF pages — one image per page, no text
 * or design markup of our own.
 *
 * Why base64 data URIs: expo-print on Android loads the HTML with a null base
 * URL, so relative file/asset references don't resolve. Data URIs render in
 * both the in-app WebView preview and the printed PDF. (This also keeps the
 * same HTML working when iOS support is added later.)
 *
 * Page sizes come from each image's aspect ratio via named @page rules, so
 * portrait and landscape pages keep the reference orientation.
 */

import { InvoiceData } from '../../invoice/types';
import { KL_LAB_PAGES } from './pages.generated';

/* ════════════════════════════════════════════════════════════════════════
   MAIN RENDERER
   ════════════════════════════════════════════════════════════════════════ */
export const renderInvoice = (_invoice: InvoiceData): string => {
  // @page rules: page 1 uses the default; each further page gets a named
  // page sized to its image's aspect ratio (portrait or landscape), and the
  // page div is assigned to it via `page: pgN`.
  const namedPageRules = KL_LAB_PAGES.slice(1)
    .map(
      (p, i) =>
        `@page pg${i + 2} { size: ${p.w}px ${p.h}px; margin: 0; }\n  .pg${i + 2} { page: pg${i + 2}; }`
    )
    .join('\n');

  const pages = KL_LAB_PAGES.map((p, i) => {
    const pageClass = i === 0 ? 'page' : `page pg${i + 1}`;
    return `<div class="${pageClass}" style="width:${p.w}px;height:${p.h}px;">
  <img src="${p.src}" alt="Page ${i + 1}" />
</div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>K.L LAB Brochure</title>
<style>
  @page { size: ${KL_LAB_PAGES[0].w}px ${KL_LAB_PAGES[0].h}px; margin: 0; }
${namedPageRules}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Roboto, Arial, sans-serif;
    background: #fff;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .page { page-break-after: always; overflow: hidden; position: relative; }
  .page:last-child { page-break-after: auto; }
  .page img { display: block; width: 100%; height: 100%; object-fit: fill; }
</style>
</head>
<body>
${pages}
</body>
</html>`;
};
