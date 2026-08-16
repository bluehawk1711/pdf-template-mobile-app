# K.L LAB — Template 1 design analysis (Phase 2)

Source: `pdfs/K.L LAB.pdf` · Analysis date: 2026-08-14 · Tools: pypdf + Pillow (see `scripts/analyze-kl-lab.py`, `scripts/analyze-kl-lab-detail.py`)

> ⚠️ The reference PDF is **image-based** (no text layer — `pdftotext` returns nothing). Colors, page sizes,
> and structure below are extracted programmatically from the embedded artwork. **Typography faces, exact
> spacing, table structure, and the QR/payment block must be confirmed visually** — the extracted pages are
> saved under `pdfs/kl-lab/` (`pageXX_0.jpg` = logo strip, `pageXX_1.jpg` = page artwork) for review.

---

## 1. Document facts

| Property | Value |
|---|---|
| Pages | 9 |
| Page size | A4 — portrait `595×842 pt` (pages 1, 9), landscape `842×595 pt` (pages 2–8) |
| Text layer | none (all pages are embedded images) |
| Artwork resolution | ~2 600–4 150 px per side — renders crisp |

The PDF is a **multi-page design portfolio**: two portrait invoice designs (pages 1, 9) and seven landscape
designs (pages 2–8). The template may need to support **both orientations**.

## 2. Verified brand palette

| Role | Color (hex) | Source |
|---|---|---|
| Brand accent (logo) | **#39A46B** green | green pixels in the repeated logo strip (`#39A36B` avg, `#39A46B` bright cluster) |
| Logo text | near-black / dark gray (`#202020`–`#000000`) | logo strip content pixels |
| Background | white (`#FFFFFF`) | dominant across all pages |
| Page 1 strong element | **#D73C28** red (~18.7 % coverage, spans most of the page) | page 1 artwork — ⚠️ confirm whether design element or photo content |

Other quantized colors (pages 2–9) are photo-driven (mauve `#A95E6E`, terracotta `#AC6558`, rose `#B25D6A`,
`#7E4961`, `#C36D5F`, steel gray `#5E656E`) — these are **wedding/event photos**, not design tokens.

## 3. Repeated logo strip

- Size: `700 × 88 px`, present on **all 9 pages** (identical image) — i.e. a persistent header/wordmark.
- Content bbox: `x 8–697, y 15–73` — a wide, roughly centered wordmark line.
- Content: dark wordmark text + **green accent mark** (#39A46B).

## 4. Page-by-page structure (programmatic)

| Page | Orientation | Artwork px | Notes from quantization / luminance |
|---|---|---|---|
| 1 | portrait | 2680×3460 | White + **red #D73C28** across the page; content densest in lower-middle band; no strong dark header band |
| 2 | landscape | 3804×2560 | White bg + photo-driven rose/mauve |
| 3 | landscape | 3788×2464 | White bg + terracotta photo tones |
| 4 | landscape | 3596×2356 | White bg + rose tones, warmer lower third |
| 5 | landscape | 4152×2884 | photo-driven |
| 6 | landscape | 3956×2568 | photo-driven |
| 7 | landscape | 3796×2800 | plum `#7E4961` photo tones; dark band upper-middle |
| 8 | landscape | 4020×3032 | steel-gray photo tones |
| 9 | portrait | 2588×3728 | White bg + terracotta photo block |

## 5. Design implications for the Template 1 renderer (Phase 6)

1. **A4 print target**; support portrait (and likely landscape) variants.
2. **Green `#39A46B` is the brand accent** — use for header band, accents, and any branding elements;
   near-black text on white for body.
3. Wordmark/logo sits **top of page** (logo strip placement) — a slim header band.
4. Page 1's red `#D73C28` — resolve by visual review; if it is a design band, that page is a red-accented
   variant; otherwise it is a photo and the green/white scheme applies everywhere.
5. Photos dominate the landscape pages — likely photo-collage elements outside the invoice data area
   (not reproducible from invoice data; the renderer should treat those as decorative/optional).

## 6. To confirm visually (open `pdfs/kl-lab/*.jpg` or the view-pdf skill)

- [ ] Header layout + logo position (left vs centered) and header height
- [ ] Fonts (family/sizes/weights) for title, labels, amounts
- [ ] Table columns (description / qty / rate / amount?) and row spacing
- [ ] Totals block layout and labels (Subtotal / Discount / Tax / Total / Balance?)
- [ ] Payment section: QR placement, UPI details, payee
- [ ] Footer content and page margins
- [ ] Which orientation is the primary invoice (portrait page 1 vs landscape pages)
- [ ] Whether the red `#D73C28` on page 1 is a design element

## 7. Re-running this analysis

```bash
tmp/pdfenv/Scripts/python.exe scripts/analyze-kl-lab.py           # overview + palette
tmp/pdfenv/Scripts/python.exe scripts/analyze-kl-lab-detail.py    # logo + accent regions
```
