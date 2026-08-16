# K.L LAB — Template 1

The reference is a **9-page image-based pharmaceutical brochure**
(`pdfs/template1.pdf` — pages extracted to `assets/template1/page1.png` …
`page9.png`). The original reference was replaced by the user with the
extracted page images; the template now renders those images directly.

## Rendering approach (current)

- **The template is fully static** — no input fields, no text/design markup of
  our own. `renderInvoice()` emits one full-bleed `<img>` per page.
- **Images are embedded as base64 JPEG data URIs** in
  `pages.generated.ts` (built from `assets/template1/page*.png` by
  `scripts/build-kl-lab-pages.py`). Data URIs are required because
  expo-print on Android loads the HTML with a null base URL — relative
  file/asset references don't resolve. This also keeps iOS working later.
- **Page sizes** come from each image's aspect ratio via named `@page` rules
  (`@page pgN { size: Wpx Hpx }` + `.pgN { page: pgN }`), so portrait and
  landscape pages keep the reference orientation (verified with headless
  Chrome: pages 2–8 landscape, 1 & 9 portrait — matching the reference).

## Regenerating after image swaps

```bash
tmp/pdfenv/Scripts/python.exe scripts/build-kl-lab-pages.py
```

The source PNGs are fully opaque, so JPEG quality 95 keeps the generated
module small (~2.5 MB vs ~13 MB for base64 PNG).
