# Project Memory

> **Purpose:** Long-lived memory for this project. Every session (human or AI) should read this file first.
> Whenever a decision is made or an architecture step is taken, **append it to the Decision Log** at the bottom.
> See `plan.md` for the transformation roadmap and `agents.md` for how agents should work here.

Last updated: 2026-08-14

---

## 1. What this project is

An **Expo React Native + TypeScript invoice generator** for photography studios (currently GP Studio / BhorBox).
It creates photography invoices (and quotations) with dynamic UPI QR payment, HTML-based PDF export, and history.

**Current goal:** Evolve this from a single-purpose invoice app into a **premium, template-driven invoice
platform** ("Canva for invoices") where multiple PDF templates can be registered and each template defines its
own fields, sections, preview, and PDF renderer. Full spec in `plan.md` §1.

---

## 2. Tech stack (verified from package.json)

| Layer | Choice |
|---|---|
| Framework | Expo ~54.0.29, React Native 0.81.5, React 19.1.0 |
| Language | TypeScript ~5.9.2 (strict) |
| Navigation | @react-navigation/native + stack + drawer (v7) |
| UI | react-native-paper ^5.14.5 |
| PDF | expo-print (HTML → `printToFileAsync`) |
| Preview | react-native-webview (renders the same HTML as the PDF) |
| Share | expo-sharing |
| Storage | AsyncStorage (local, on-device) behind `src/storage/invoiceRepository.ts` — Firebase removed (see Decision Log 2026-08-14) |
| Async storage | @react-native-async-storage/async-storage (used for theme) |
| Other | expo-crypto (UUIDs), @react-native-community/datetimepicker, @react-native-picker/picker, react-native-svg, expo-linear-gradient |

**Scripts:** `npm start` / `npm run android` / `ios` / `web` (expo). **No test or lint scripts exist.**

> ⚠️ `node_modules` is not installed in the repo checkout. Run `npm install` before any build/typecheck.

---

## 3. Current architecture

```
App.tsx                        — NavigationContainer + PaperProvider + ThemeProvider + InvoiceProvider,
                                 Stack (Splash, Home[drawer], TemplateSelection, InvoiceForm, Preview, History)
src/
├── types.ts                   — InvoiceMode + RootStackParamList only
├── theme/tokens.ts            — design tokens (palette light/dark, spacing, radii, type) consumed by ThemeContext
├── context/
│   ├── InvoiceContext.tsx     — templateId + selectTemplate, pendingInvoice + setPendingInvoice, startNewInvoice
│   └── ThemeContext.tsx       — light/dark theme from tokens, persisted to AsyncStorage 'appTheme'
├── screens/
│   ├── SplashScreen.tsx
│   ├── HomeScreen.tsx         — drawer home; create action cards (Bill/Quotation), recent invoices (top 3, focus-refresh)
│   ├── TemplateSelectionScreen.tsx — registry-driven cards (TemplateCard), Continue → InvoiceForm
│   ├── InvoiceFormScreen.tsx  — sectioned form driven by the template's fields; live totals; → Preview
│   ├── PreviewScreen.tsx      — summary bar + WebView of template renderPdf HTML; Download & Share; saves via repository
│   └── HistoryScreen.tsx      — AsyncStorage-backed list; mode filter pills + search; themed cards; empty states
├── components/form/           — FormSection, FormTextField, FormDateField, FormSelectField, FormItemsEditor, FormField
├── templates/
│   ├── types.ts               — InvoiceTemplate contract (sections, fields, renderPdf/renderPreview)
│   ├── registry.ts            — getTemplates / getTemplate / registerTemplate
│   └── kl-lab/                — config.ts (fields/sections/accent #39A46B), pdf.ts (A4 HTML renderer), design.md
├── invoice/
│   ├── types.ts               — canonical InvoiceData model (meta/business/client/items/pricing/payment/notes)
│   ├── calculations.ts        — the calculation engine (breakdownLine, calculatePricing, withPricing)
│   ├── formBuilder.ts         — pure form logic (buildInitialValues, parseItems, buildInvoiceFromValues)
│   ├── business.ts            — DEFAULT_BUSINESS (identity incl. upiId)
│   ├── constants.ts           — EVENT_TYPES, DEFAULT_SERVICES
│   ├── format.ts              — formatINR / formatDate
│   └── numbering.ts           — generateInvoiceNumber / createInvoiceNumber
├── storage/invoiceRepository.ts — InvoiceRepository interface + AsyncStorage impl
└── utils/uuid.ts              — generateId() (used by the items editor)
assets/
├── invoice.html               — LEGACY, not referenced by any code
└── icons, logo-final.png      — assets (unused by code so far)
pdfs/
├── K.L LAB.pdf                — reference/design source for Template 1 (do not delete)
├── kl-lab/                    — extracted reference pages + design.md + rendered/ + pandoc/ PDFs
└── KL-LAB-sample-invoice.pdf  — hero sample for visual review
```

### Current user flow
`Splash → Home → Create (Bill | Quotation) → TemplateSelection → InvoiceForm (sectioned, live totals) → Preview (WebView) → Download & Share`

### Domain model (src/invoice/types.ts)
- `InvoiceData`: `{ id (number; '' for quotations), meta, business, client, items[], pricing, payment, notes?, templateId, createdAt, pdfUrl?, storagePath? }`
- `InvoiceItem`: `{ id, name, description?, category?, quantity, unitPrice, discount?, taxRate? }` — itemised, engine-computed
- `InvoicePricing`: `{ subtotal, discountTotal, taxTotal, extraCharges, grandTotal, balanceDue }` — computed only by `calculations.ts`

### Key business rules (current)
- **Invoice number:** `GP{DDMMYY}-{NNN}` — NNN = locally saved invoices today + 1 (`invoice/numbering.ts`); generated when the form builds the invoice. Quotations get **no number** and are not saved.
- **Totals:** computed only by `invoice/calculations.ts` (`calculatePricing`); form UI, preview, PDF, history all consume the same result.
- **Currency:** INR (₹), `formatINR` with en-IN grouping.
- **Payment:** text-only line on the invoice (amount due + UPI id from `DEFAULT_BUSINESS.upiId`); QR codes removed (2026-08-14).
- **PDF pipeline:** template `renderPdf(invoice)` → HTML string → WebView (auto-scaled) → `Print.printToFileAsync` → `Sharing.shareAsync`; history saves via `invoiceRepository`.

---

## 4. Conventions & standing decisions (agreed in the spec)

These are binding working agreements — see `plan.md` for the full spec:

1. **Template-first architecture.** Never hard-code the app around one template; no `if (template === "K.L LAB") { … }` blocks scattered through screens. Adding Template 2+ must mean *registering a new template*, not rewriting the flow.
2. **Single source of truth for money.** A calculation engine computes subtotal/discount/tax/extra/grand total/paid/balance; the UI, preview, PDF, and history all consume the same result. No per-screen math, no floats bugs (use integer paise or rounding at the boundary).
3. **PDF is decoupled from UI.** Renderer consumes structured invoice data → HTML → PDF. Preview shows the *actual* generated HTML so "what you see is what you share."
4. **No over-engineering.** No Redux, no new backend, no heavy state libraries, no unnecessary deps. Prefer the existing stack (context + hooks + expo-print + webview).
5. **Firebase is deferred.** Keep a clean local persistence layer with an abstraction that a future backend can slot into; don't couple the app to Firestore. (The repo currently still imports Firestore — see §5.)
6. **Skills are mandatory.** Expo/RN work → `expo-react-native-typescript`; UI/UX → `frontend-design`; all PDF work → `pdf` + `ponytail`; verifying generated PDFs → `view-pdf`. Read the actual `SKILL.md` files before doing the work.
7. **Dark mode stays** and must be intentionally designed, not inverted.
8. **Premium UX bar:** Apple-inspired, spacious, consistent spacing/typography, subtle animations, sectioned forms, validation with inline errors, good empty states.

---

## 5. Known issues & gotchas (verified 2026-08-14)

| # | Issue | Details |
|---|---|---|
| 1 | ✅ **Resolved 2026-08-14 — Firebase removed entirely** (see Decision Log) | Was: `firebaseConfig.ts` deleted (commit `1241c66`) but 3 files imported `db` → app did not compile. Now: history + numbering run on AsyncStorage via `src/storage/invoiceRepository.ts`; `tsc --noEmit` passes clean. |
| 2 | ✅ **Resolved 2026-08-14 — QR functionality removed entirely** | User decision: no QR codes. `src/payments/upi.ts` deleted, QR image blocks + `upi://` links removed from both renderers, WebView `upi://` handler removed; renderers show the UPI id as text only. No external API dependency remains. |
| 3 | **Hardcoded business identity** | GP Studio name/address/phone and UPI ID are hardcoded (invoiceBuilder.ts). Future "business profiles" feature depends on making this data-driven. |
| 4 | ✅ **Resolved 2026-08-14 — calculation engine** | All money now flows through `src/invoice/calculations.ts` (`calculatePricing`); screens/builder never compute totals. |
| 5 | ⬜ **Legacy asset** | `assets/invoice.html` is unused — verify before deleting (may be intentional reference). |
| 6 | ✅ **Resolved 2026-08-14** | History now reads/writes AsyncStorage through the repository — fully local. |
| 7 | **`any` usage** | `ServicesScreen` uses `value: any` + `@ts-ignore`; spec bans both (§25). |
| 8 | **No typecheck possible yet** | `node_modules` absent; `npx tsc` fails. Install deps before verifying. |

---

## 6. Decision log

> **Rule:** every architectural decision / meaningful step gets a row here, with date + why.
> Status: ✅ decided & done · 🟡 decided, not implemented · ❓ open.

| Date | Status | Decision | Rationale / Notes |
|---|---|---|---|
| 2026-08-14 | ✅ | **Full-app UI review & enhancement pass.** HomeScreen redesigned: brand header, two create action cards (Bill / Quotation) with icon + description, and a **Recent invoices** section (top 3, refresh-on-focus via `useFocusEffect`, tap → read-only preview, empty-state hint, "See all" → History). HistoryScreen rewritten: themed drawer header (menu + theme toggle, matching Home), large title, **All / Invoice / Quotation filter pills**, search, and rich cards (mode badge, invoice number, client, date, engine-formatted totals via `formatINR`/`formatDate`, Paid ✓ / Balance status, 44px+ targets); proper empty states (first-run CTA vs no-match state). PreviewScreen: invoice summary bar (client, number · date, total) + themed WebView wrapper and footer; single-button footer now centers instead of floating left. Splash: shared `brandAccent` token (#EDE345) replaces the duplicated `#EDE345`/`#fbbf24` yellows; timing cut 4.5 s → 3.2 s. Fixed hardcoded light-only separators that broke dark mode (`#E5E5EA` in InvoiceForm totals card + FormItemsEditor rows → `colors.separator`). Added `brandAccent` to `theme/tokens.ts`. Removed drawer `paddingTop: 130` hack in App.tsx. | Spec §8/§9/§23/§24. Resolves dark-mode separator bugs and hardcoded color drift; makes Home/History feel like the rest of the app. `tsc --noEmit` clean. |
| 2026-08-14 | ✅ | **Form polish pass (Phase 9 partial).** Items editor: dashed empty state when all rows are removed, `LayoutAnimation` ease on add/remove (Android experimental flag set at module scope), `minHeight: 44` touch targets on all item inputs, per-input `accessibilityLabel`s, themed error color. Select + date fields: `accessibilityHint`s, option rows get `accessibilityRole="button"` + selected state. Text field errors announce via `accessibilityLiveRegion="polite"`. Form scroll: `keyboardDismissMode` (interactive on iOS, on-drag on Android). | Spec §8 (subtle animations) + §24 (accessibility). No new dependencies. |
| 2026-08-14 | ✅ | **Legacy flow removed.** Deleted `EventSelectionScreen`, `ServicesScreen`, `ClientDetailsScreen` and the draft plumbing: `EventCard`/`ServiceItem`/`ClientDetails` types + their routes, and `InvoiceContext`'s draft state (`currentInvoice`, `updateEvents`, `updateClientDetails`, `finalizeInvoice`, `buildQuotation`). Context is now slim: `templateId`/`selectTemplate`, `pendingInvoice`/`setPendingInvoice`, `startNewInvoice`. Also removed the legacy GP Studio HTML renderer `src/utils/invoiceBuilder.ts` (superseded by `kl-lab/pdf.ts`; `PreviewScreen` now renders only via the template and shows a graceful message if a renderer is missing). All invoices are now produced by the dynamic form → canonical `InvoiceData`. | User request: remove superseded legacy screens + draft plumbing. Kept `uuid.ts` (used by the items editor) and `assets/invoice.html` (still unreferenced legacy, see §5 #5). |
| 2026-08-14 | ✅ | **QR codes removed entirely.** Deleted `src/payments/upi.ts` (`buildUpiLink`, `qrImageUrl`); removed the QR image + "Pay Now"/`upi://` links from `kl-lab/pdf.ts` and the legacy `invoiceBuilder.ts`; removed the WebView `upi://` interception in `PreviewScreen`. Renderers keep a text-only payment line (amount due + UPI id) sourced from `payment.upiId`/`business.upiId`. Artifacts regenerated (no images on any PDF page). | User decision: "remove the qr code functionality and its references". UPI id stays as business/payment identity (still on `InvoiceBusiness`/`InvoicePayment`). |
| 2026-08-14 | ✅ | **Dynamic sectioned form (Phase 5).** New `InvoiceFormScreen` renders the selected template's `sections`/`fields` (text / number / date / select / items / notes) as iOS-style grouped sections — no hardcoded fields. Reusable controls in `src/components/form/` (`FormSection`, `FormTextField`, `FormDateField`, `FormSelectField`, `FormItemsEditor`, `FormField` dispatcher). Live totals from the calculation engine in a sticky footer; validation (required fields + ≥1 valid item) with inline errors. Pure logic extracted to `src/invoice/formBuilder.ts` (`buildInitialValues`, `parseItems`, `buildInvoiceFromValues`) — testable and reusable. Flow: Home → TemplateSelection → **InvoiceForm** → Preview (PreviewScreen Edit returns to the form, prefilled via `pendingInvoice` in context; legacy event-based screens now unreachable but still registered — candidates for removal in polish phase). Verified: `scripts/check-form-to-pdf.ts` — 20 asserts through the real formBuilder → renderInvoice path (values mapping, numbering, tax/balance math, quotation without QR). | Spec §5/§6/§9/§10/§27. The old EventSelection/Services/ClientDetails screens are superseded. |
| 2026-08-14 | ✅ | **Local PDF generation for visual review.** pandoc (with the **wkhtmltopdf** engine — weasyprint is broken on this machine: missing GTK/Pango `libgobject-2.0-0` DLLs) converts the renderer's HTML to A4 PDFs. Required flags: `--page-size A4 --margin-* 0 --viewport-size 794x1123 --disable-smart-shrinking --zoom 0.78` (zoom counters wkhtmltopdf's 75dpi scaling; without it content spills to a 2nd page). 7 sample PDFs in `pdfs/kl-lab/pandoc/`; hero copy at `pdfs/KL-LAB-sample-invoice.pdf`. Chrome/WebView-faithful PDFs+PNGs remain in `pdfs/kl-lab/rendered/`. | User asked to check the template visually; QR verified present, quotation has no QR, 22-item list = 2 pages. |
| 2026-08-14 | ✅ | **K.L LAB renderer implemented (Phase 6/7).** `src/templates/kl-lab/pdf.ts` renders structured `InvoiceData` → A4 HTML (794 px @ 96 dpi, brand green #39A46B, near-black ink, white): business wordmark header + green rule, Bill To / invoice details, itemised table (# / Description / Qty / Rate / Amount with optional category rows), engine-computed totals (conditional Discount / Tax / Extra / Grand Total / Amount Paid / Balance Due), UPI QR payment block (invoice mode, balance > 0), notes & terms, footer. Edge-case safe: HTML-escaping of user text, empty-items placeholder, long lists flow to page 2, missing optionals render nothing. Registered as `renderPdf` + `renderPreview` (same HTML, spec §15); `PreviewScreen` now renders via the selected template's renderer with legacy `buildInvoiceHTML` as fallback, and the preview wrapper scales to fit the 794 px page on any screen. New shared `src/payments/upi.ts` (`buildUpiLink` + `qrImageUrl`) — payment logic separate from template layout (spec §16). **Verified:** 7 sample invoices (short / 22-item / missing optionals / tax+discount / quotation / long names / notes) rendered to PDF + PNG via headless Chrome — brand green present, QR image loads, 22-item list correctly spans 2 pages. Artifacts: `pdfs/kl-lab/rendered/`. | Spec §12/§13/§15/§16. Final visual comparison against `pdfs/K.L LAB.pdf` still needs a human pass over the rendered pages (fonts/geometry). |
| 2026-08-14 | ✅ | **Phase 2 — reference PDF analyzed.** `pdfs/K.L LAB.pdf` is a 9-page, image-based A4 portfolio (pages 1 & 9 portrait, 2–8 landscape). Every page repeats a 700×88 logo strip: dark wordmark + **green accent #39A46B** (verified by pixel sampling). Page 1 has a large red #D73C28 element (needs visual confirmation: design vs photo). Full breakdown in `src/templates/kl-lab/design.md`; extracted page artwork saved to `pdfs/kl-lab/`. **K.L LAB `accent` updated to #39A46B.** Analysis tooling: `tmp/pdfenv` (project-local uv venv with pillow+pypdf — not committed) + `scripts/analyze-kl-lab*.py`. | Spec §2/§14: inspect the reference before building the template. Typography/layout details still need visual confirmation (no pdftoppm in this env; pages are viewable as JPGs). |
| 2026-08-14 | ✅ | **Core architecture (Phase 3):** canonical `InvoiceData` model in `src/invoice/types.ts` (meta / business / client / items / pricing / payment / notes / templateId); calculation engine `src/invoice/calculations.ts` (`breakdownLine`, `calculateItemTotal`, `calculatePricing`, `withPricing`) — the single source of truth for money, `round2` at every boundary (paise-integer storage is the documented upgrade path); studio identity centralized in `src/invoice/business.ts` (`DEFAULT_BUSINESS`, replaces the hardcoded values in invoiceBuilder); `EVENT_TYPES`/`DEFAULT_SERVICES` moved to `src/invoice/constants.ts`. Template contract extended with `sections` / `fields` / `renderPdf` / `renderPreview`; K.L LAB now declares its field schema (drives the Phase 5 dynamic form). `InvoiceContext` keeps the event-based **draft** and maps it to canonical `InvoiceData` at finalize (qty=1 × amount; category = event type; advance → payment.amountPaid). Legacy GP Studio HTML rewritten to consume `InvoiceData` + engine pricing (final row shows "Balance Due" when advance > 0). Self-check: `scripts/check-calculations.ts` — 11 asserts, all pass. `tsc --noEmit` clean. | Spec §3/§4/§10/§11; resolves known issue #4. Draft types stay in `src/types.ts` only until the dynamic form (Phase 5) replaces the event-based flow. |
| 2026-08-14 | ✅ | **Firebase removed — local storage only.** Uninstalled the `firebase` package; deleted all Firestore imports (`InvoiceContext`, `PreviewScreen`, `HistoryScreen`). Created `src/storage/invoiceRepository.ts`: `InvoiceRepository` interface + `AsyncStorageInvoiceRepository` (save / getAll / getById / countCreatedToday). Invoice numbering now counts invoices saved locally today; history lists from AsyncStorage sorted desc. A Firebase/API impl can be added later behind the same interface. | User decision: "forget git we don't need firebase right now... just use some local storage." Matches spec §18 (repository abstraction, no tight Firebase coupling) and resolves known issue #1 — app compiles again. |
| 2026-08-14 | ✅ | **Design tokens added:** `src/theme/tokens.ts` — iOS system neutrals + GP Studio purple accent, light & dark palettes, spacing / radii / type scales. `ThemeContext` now consumes the tokens (same context shape), so all existing screens pick up the new Apple-style palette automatically; only `HomeScreen` had a local inline palette and was switched over. | Spec §8: restrained design system; dark mode intentionally designed, not inverted. |
| 2026-08-14 | ✅ | **Template system v0:** `src/templates/types.ts` (`InvoiceTemplate` contract), `registry.ts` (`getTemplates` / `getTemplate` / `registerTemplate`), `kl-lab/config.ts` (K.L LAB entry). Contract intentionally minimal — `fields` / `sections` / renderers are deferred until the dynamic-form and PDF phases that consume them. | Spec §4/§7: selection UI must be registry-driven, never hardcoded to one template. |
| 2026-08-14 | ✅ | **New flow entry:** Home → `TemplateSelection` → existing `EventSelection` flow. `selectTemplate()` stores `templateId` on the draft invoice; `startNewInvoice` defaults `templateId: 'kl-lab'`; `finalizeInvoice`/`buildQuotation` persist it. K.L LAB accent `#1E3A5F` is a **placeholder** until Phase 2 PDF analysis (reference PDF is image-based — `pdftotext` returns no text, colors need visual extraction). | Spec §6 desired flow; keeps the app runnable while later phases replace the form. |
| 2026-08-14 | ✅ | Establish `memory.md` + `agents.md` + `plan.md` as the project's living documentation; append every future decision here. | Requested by user so decisions/steps are never forgotten. |
| 2026-08-14 | ✅ | Adopt the full spec in `plan.md` §1 as the product/architecture direction (template system, dynamic forms, calc engine, decoupled PDF, premium UX). | Pasted spec = binding requirements document. |
| 2026-08-14 | ✅ | Template 1 = **K.L LAB**, reference `pdfs/K.L LAB.pdf`; first milestone is Template 1 fully working end-to-end. | Spec §2, §21. |
| 2026-08-14 | ✅ | Keep HTML → expo-print pipeline (improve, don't replace) since it already works; preview must render the *same* HTML as the PDF. | Spec §15. |
| 2026-08-14 | ✅ | No Redux / no new backend / no firebase wiring until persistence layer is designed locally with a swappable repository abstraction. | Spec §18, §22. |
| 2026-08-14 | ❓ | What to do with the broken Firestore imports (`firebaseConfig.ts` deleted). Options: (a) restore a local config, (b) cut Firestore and store history in AsyncStorage behind an `InvoiceRepository` interface. | Blocks compile + History. Strong lean toward (b) per spec §17–18. **Decide in Phase 4.** |
| 2026-08-14 | ❓ | Where business identity lives (name/address/phone/UPI). Likely becomes part of structured invoice data (`business` block) so templates render it. | Spec §3 conceptual model. |
| 2026-08-14 | ❓ | Template registry shape — see `plan.md` §4 for the proposed contract. | To be finalized in Phase 3 before touching screens. |

*(Append new rows at the TOP of this table as decisions are made.)*

---

## 7. Reference material locations

- Product spec / requirements: `plan.md` §1 (kept verbatim as the source of truth)
- Template 1 visual reference: `pdfs/K.L LAB.pdf`
- Current code entry points: `App.tsx`, `src/context/InvoiceContext.tsx`, `src/utils/invoiceBuilder.ts`
- Installed skills: `.agents/skills/` (see `agents.md` §2)
