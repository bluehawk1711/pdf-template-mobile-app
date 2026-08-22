# Project Memory

> **Purpose:** Long-lived memory for this project. Every session (human or AI) should read this file first.
> Whenever a decision is made or an architecture step is taken, **append it to the Decision Log** at the bottom.
> See `plan.md` for the transformation roadmap and `agents.md` for how agents should work here.

Last updated: 2026-08-21

---

## 1. What this project is

An **Expo React Native + TypeScript template-driven PDF generator**. The user picks a template and the app
renders a print-ready PDF (preview → download → share → history). Currently exactly one template is
registered: **K.L LAB**, a fixed 9-page pharmaceutical brochure with **no user inputs** — it goes straight
from selection to the download screen.

The template system remains the core architecture: templates register `sections`/`fields` (drive a dynamic
form when input is needed) and `renderPdf(data)` (structured data → HTML). Adding Template 2+ = registering
an entry in `src/templates/registry.ts`. Full spec in `plan.md` §1 (kept for reference, with the
photography/invoice parts superseded by the 2026-08-16 decision).

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
│   ├── HomeScreen.tsx         — drawer home; template cards → PageViewer (page-based) or TemplateSelection; recent saved documents (top 3, focus-refresh)
│   ├── PageViewerScreen.tsx   — horizontal slide viewer: swipes through the template's `pages` images (e.g. K.L LAB's 9 pages) with page counter + Download PDF
│   ├── TemplateSelectionScreen.tsx — registry-driven cards; field-less page-based templates open PageViewer; field-less plain templates open Preview
│   ├── InvoiceFormScreen.tsx  — sectioned form driven by the template's fields (only for templates that need input; guards empty-fields case)
│   ├── PreviewScreen.tsx      — WebView of template renderPdf HTML; Download PDF (hides invoice summary for static brochures; Edit only when fields exist)
│   └── HistoryScreen.tsx      — AsyncStorage-backed saved-documents list; search by template/ID; themed cards; empty states
├── components/form/           — FormSection, FormTextField, FormDateField, FormSelectField, FormItemsEditor, FormField
├── templates/
│   ├── types.ts               — InvoiceTemplate contract (sections, fields, renderPdf/renderPreview)
│   ├── registry.ts            — getTemplates / getTemplate / registerTemplate (central template data)
│   ├── covers.ts              — central cover registry: assets/template-<n>-image.png else reference page-1 artwork
│   └── kl-lab/                — config.ts (no fields — static brochure), pdf.ts (9 full-bleed image pages), pages.generated.ts (base64 JPEG page data URIs), design.md
├── invoice/
│   ├── types.ts               — canonical InvoiceData model (meta/business/client/items/pricing/payment/notes)
│   ├── calculations.ts        — the calculation engine (breakdownLine, calculatePricing, withPricing)
│   ├── formBuilder.ts         — pure form logic (buildInitialValues, parseItems, buildInvoiceFromValues, buildDefaultInvoice)
│   ├── business.ts            — DEFAULT_BUSINESS (K.L LAB identity; neutral now)
│   ├── format.ts              — formatINR / formatDate
│   └── numbering.ts           — generateInvoiceNumber / createInvoiceNumber (only used by the dynamic form)
├── pdf/savePdf.ts             — savePdfToDownloads (Android SAF → Downloads folder w/ permission ask; iOS share sheet)
├── pdf/useDownloadPdf.ts      — shared Download-PDF flow hook (print → save → history → success alert), used by Preview + PageViewer
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
`Splash → Home (template cards) → PageViewer (horizontal slide through the 9 K.L LAB page images) → Download PDF`

Templates that declare `pages` (registry `pages?: TemplatePage[]`) open straight into PageViewer from the Home card; field-bearing or page-less templates keep the `TemplateSelection → InvoiceForm → Preview` flow (the WebView preview + dynamic form system is intact).

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
6. **Skills are mandatory.** Expo/RN work → `expo-react-native-typescript`; UI/UX → `frontend-design`; all PDF work → `pdf` + `ponytail`; verifying generated PDFs → `view-pdf`; device testing/screenshots → `agent-device`. Read the actual `SKILL.md` files before doing the work.
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
| 8 | ✅ **Resolved** | `node_modules` installed; `npx tsc --noEmit` works. | |
| 9 | **⚠️ Import path convention for `pages/` subdirectory** | Files inside `src/templates/kl-lab/template1/pages/` need **5 levels** of `../` to reach the project root: `require('../../../../../assets/template1/...')`. Files directly in `template1/` only need 4. Getting this wrong causes Metro "Unable to resolve" bundler errors at runtime (not caught by tsc). Always double-check require paths when creating new page components. |
| 10 | **🔒 Pages 1, 2, 3, 4, 5, 6, 7, 8, 9 — COMPLETE, DO NOT MODIFY** | All 9 pages are finalized and perfect in design. Do not modify, refactor, or touch them unless explicitly asked by the user. Any changes to these pages require explicit user permission. |

---

## 6. Decision log

> **Rule:** every architectural decision / meaningful step gets a row here, with date + why.
> Status: ✅ decided & done · 🟡 decided, not implemented · ❓ open.

| Date | Status | Decision | Rationale / Notes |
|---|---|---|---|
| 2026-08-21 | ✅ | **Page design status documented.** Pages 1, 4, 7, 8 marked as COMPLETE — do not modify unless explicitly asked. Pages 2, 3, 5, 6, 9 marked as working status. All pages use standalone React Native components with animations, proper fonts/colors, and correct positioning relative to background images. Heading text removed from pages 5 and 6 (user will add to background images directly). | User decision: finalize page designs and document status to prevent accidental modifications to completed pages. |
| 2026-08-21 | ✅ | **agent-device skill installed for on-device testing.** Installed `callstack/agent-device@agent-device` (11.2K installs) to take screenshots and inspect UI on physical Android devices. Enables visual verification of page layouts without manual screenshots. Usage: `agent-device open <package> --foreground` → `agent-device screenshot` → view image. Limitation: physical Android devices may require USB debugging permissions for tap injection; screenshots work without special permissions. | User request: "check the agent device skill". Allows AI-driven visual inspection of the running app. |
| 2026-08-21 | ✅ | **YouTube fullscreen layout — rotate content 90° in portrait.** PagePager now wraps pages in a container rotated 90° when the phone is in portrait mode, so landscape brochure content fills the screen like a YouTube video in fullscreen. `DimensionsContext` provides the rotated content dimensions to page components (they use `useContentDimensions()` instead of `useWindowDimensions()`). Gesture axes swap: portrait screen swipe up/down = content left/right for page navigation. Each page (Page1–Page3 rebuilt) is a standalone React Native component with `computeContainLayout()` for image-aware text positioning, staggered entrance animations, correct fonts/colors, and `wp()`/`wh()` percentage-based sizing. Background fills screen via contain mode. **Import path note:** files in `pages/` subdirectory need 5 `../` levels to reach project root (not 4). Added to known issues §5 #9. | User request: "rotate the whole component 90 degree like how we watch a youtube video in full screen". Confusion over landscape/portrait resolved: phone stays portrait, content rotates. |
| 2026-08-17 | ✅ | **PageViewer swipe crash root-caused & fixed + dev APK in CI.** The swipe crash was **not** the Pressable (removed earlier) — it is `useAnimatedScrollHandler`, a documented Android Fabric crash source (`null child at index X when traversal in dispatchGetDisplayList`, react-native-reanimated#8907 on RN 0.81.5). Replaced with a **plain JS `onScroll`** that writes `scrollX.value` from the JS thread — the documented workaround (reanimated#9266) that keeps the per-page scale/fade effect on the UI thread. GitHub workflow (`build-apk.yml`) now uses a build matrix: `assembleRelease` → `templates-release-apk` + `assembleDebug` → `templates-dev-apk` (dev build for on-device testing, e.g. LogBox). `tsc --noEmit` clean; needs a device pass to confirm the swipe crash is gone. | User report: "the app still crashes on swiping" + "update the github workflow to also support dev build". Research (web): reanimated#8907, #9266, #8422 — event-driven worklet scroll handlers crash on Android Fabric; JS-thread shared-value writes are the supported workaround. |
| 2026-08-17 | ✅ | **PageViewer swipe bugfix.** Replaced the `Pressable` wrapper around the FlatList (which steals the pan responder on Android → swipes barely worked + crash on swipe) with raw touch events (`onTouchStart`/`onTouchEnd` with a 12 px movement slop) for tap-to-toggle chrome. Viewer background is now theme-aware (`colors.background`) instead of hardcoded black. Chrome/auto-hide/slide effects unchanged. `tsc --noEmit` clean. Needs a device pass to confirm the swipe crash is gone. | User bug report: "app crashes when swiping", "background is black when viewing a template", "very hard to swipe, page doesn't change". Root cause: nested Pressable over a horizontal paging FlatList conflicts with the scroll gesture. |
| 2026-08-17 | ✅ | **Fullscreen page viewer + chrome auto-hide + slide effects + app-wide entrance animations.** `PageViewerScreen` is now **fullscreen** (black background, `StatusBar hidden`, no SafeArea padding). Chrome (back button, template name, download icon-button, page counter pill) sits in translucent black gradients and **fades in on tap, auto-hides after 3 s** (also hides after a swipe); tap again toggles. Download moved from a footer button to a **top-right icon button** (spinner while saving). **Slide effect:** Reanimated-driven — `useAnimatedScrollHandler` tracks scrollX; each page scales 0.92→1 and fades 0.3→1 as it enters the viewport (interpolate with CLAMP). **App-wide subtle animations** (Reanimated entering): Home template cards + recent docs stagger `FadeInDown` (80 ms stagger), TemplateSelection cards `FadeInDown`, History cards `FadeInUp` (60 ms), Preview WebView `FadeIn` on load. Splash already had its own Reanimated choreography (kept). `tsc --noEmit` clean. | User request: "modify the viewer to automatically go full screen... download button on top right as an icon button... hide template name/back/download, show on tap, hide on tap again... add dynamic effect between slides... add animation across the app... use the available UI/UX skills" (frontend-design + expo-react-native-typescript + ponytail applied). Video-player-style auto-hiding chrome keeps the brochure full-bleed; entering animations stay subtle/Apple-like per frontend-design. |
| 2026-08-17 | ✅ | **Page slide viewer (Template 1).** Clicking a template card on Home now opens `PageViewerScreen` — a **horizontal** swipe-through viewer (FlatList `horizontal` + `pagingEnabled`) of the template's `pages` images, with a back header (template name + "n / N" counter), full-width `contain`-sized pages, and the Download PDF footer. Templates declare optional `pages?: TemplatePage[]` (`{ uri, width, height }`) in the registry (`src/templates/types.ts`); K.L LAB maps its 9 base64 page images from `pages.generated.ts`. Home routes page-based templates → PageViewer directly (no TemplateSelection hop); TemplateSelection also routes field-less page templates there. The Download-PDF flow was extracted to a shared hook `src/pdf/useDownloadPdf.ts` (used by PreviewScreen + PageViewerScreen — single implementation of print → save to Downloads → history save → success alert). WebView PreviewScreen remains for field templates and history read-only. `tsc --noEmit` clean. Placeholder by design: pages are plain images for now — custom page-turn animations come later. | User request: "when clicking on a template1 in the home screen it should open a slide interface... use the 9 page images for now then later we'll upgrade it by custom animations... viewing mode should horizontal". The slide viewer replaces the WebView preview as the brochure viewing experience; PDF generation/download stays intact behind the same button. |
| 2026-08-16 | ✅ | **KL LAB template = the 9 reference page images, no text/design.** `renderInvoice` now emits one full-bleed `<img>` per page (9 pages), zero text/SVG markup. Images are **base64 JPEG data URIs** in generated `src/templates/kl-lab/pages.generated.ts` (built by `scripts/build-kl-lab-pages.py` from `assets/template1/page1..9.png`; JPEG q95 since pages are fully opaque — 1.95 MB source → 2.6 MB module vs ~13 MB for PNG base64). Data URIs are required because expo-print on Android loads HTML with a null base URL (relative asset refs don't resolve) — and they keep iOS working later. Page sizes come from each image's aspect ratio via named `@page pgN { size: Wpx Hpx }` + `.pgN { page: pgN }` rules → mixed orientations match the reference (verified via headless Chrome: pages 1/9 portrait, 2–8 landscape, page pt sizes match reference where assets match). PreviewScreen preview-scale now measures the wrapper's `scrollWidth` instead of assuming 794px (landscape pages are wider). `scripts/check-form-to-pdf.ts` updated (asserts 9 pages, 9 base64 `<img>`, 8 named @page rules, no leftover product text); `scripts/generate-kl-lab-samples.ts` simplified to one static brochure sample. `tsc --noEmit` clean, 24 checks pass, `pdfs/KL-LAB-sample-invoice.pdf` regenerated (1.87 MB, 9 pages, orientations verified). | User request: "modify the kl lab template with the 9 images remove all texts design and everything the assets have image from page1 to page9 use them" + "only supporting android right now... make sure it works on android". The SVG-swoosh/text renderer from the earlier passes is fully superseded. |
| 2026-08-16 | ✅ | **Rebrand + PDF-to-Downloads + template covers.** App display name "Templates" (icon unchanged per user), `package.json` name → templates, workflow artifact → templates-release-apk, GitHub Actions Node 20 → **24** (20 is EOL; 24 is current LTS; `engines: >=22` in package.json). **PDF save**: new `src/pdf/savePdf.ts` — Android uses `expo-file-system/legacy` Storage Access Framework: `requestDirectoryPermissionsAsync()` (the system folder picker IS the permission ask) → `createFileAsync` in Downloads → `writeAsStringAsync` base64; iOS keeps the share sheet. PreviewScreen shows "PDF saved to your Downloads folder!" and a friendly message if permission was denied. **Template covers**: new `src/templates/covers.ts` — central registry; for template N, `assets/template-<N>-image.png` (custom cover) takes priority, else falls back to the reference page-1 artwork (`assets/template<N>/page1.png`). HomeScreen + TemplateCard now show the real cover image instead of the placeholder mock. Home already lists available templates from the registry (centralized data). | User request: keep app icon, rebrand everything else, show templates on Home, centralize template data, save PDFs to the Downloads folder with a permission ask, bump Node off the deprecated 20 line, use page1 as the template cover when no template-<N>-image asset exists. |
| 2026-08-16 | ✅ | **App repositioned: template-driven PDF generator, photography/invoice branding removed.** The K.L LAB template now declares **no fields/sections** (`fields: []`) — it is a fixed 9-page brochure rendered directly. Flow: Home shows template cards → TemplateSelection → a template with no fields **skips the form** and opens straight to Preview (`buildDefaultInvoice` in `formBuilder.ts` builds a minimal `InvoiceData`; `TemplateSelectionScreen.goWithTemplate` navigates to Preview; Continue stays for field-bearing templates). PreviewScreen hides the invoice summary bar for static brochures, shows **Edit only when the template has fields**, and labels the button **Download PDF**. InvoiceFormScreen guards the empty-fields case (direct Continue). HomeScreen rewritten: template cards instead of Create Bill/Quotation; "Recent" shows saved documents by template name + date. HistoryScreen rewritten: no invoice/quotation filter pills; PDF badge; template name + date; neutral empty states. Splash: "TEMPLATES / Professional PDF documents", BhorBox + photography tagline removed. `DEFAULT_BUSINESS` → K.L LAB identity. Deleted `src/invoice/constants.ts` (photography EVENT_TYPES/DEFAULT_SERVICES; preset chips removed from FormItemsEditor). `app.json` name → "Templates". README rewritten. `scripts/check-form-to-pdf.ts` rewritten: fieldless-brochure flow (9 pages) + synthetic-fields form-engine regression — 23 asserts pass; `tsc --noEmit` clean. | User request: "modify all the screens... add a template card... kl lab template has no input in this case show direct download button which will save pdf; remove photography or invoice making details the app isnt about this". The dynamic form system stays intact for future templates that collect input. |
| 2026-08-16 | ✅ | **Template 1 reference rebuilt as image-only PDF.** `pdfs/template1.pdf` now contains exactly the 9 page images from `assets/template1/` (page1–page9.png), one image per page, zero text/added design (no logo strip, no headers/footers). Built with `img2pdf` in the local `tmp/pdfenv` venv; page size = each image's physical size (pHYs-aware), so every page is fully covered by its image. Verified with `scripts`-style check via pypdf: 9 pages, 1 image each, `extract_text()` empty per page → PASS. This PDF replaces `pdfs/K.L LAB.pdf` (deleted from the repo, still untracked in git) as the visual reference for Template 1. Note: this model cannot view images inline, so verification was programmatic (pypdf image/text counts) rather than visual. | User request: use the 9 `assets/template1/` images for the first PDF template, 1 image per page, no text/design. The prior `template1.pdf` embedded a repeated 700×88 logo strip on every page (2 images/page) — now removed. |
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
- Template 1 visual reference: `pdfs/template1.pdf` (9 images from `assets/template1/`, one per page — replaces the deleted `pdfs/K.L LAB.pdf`)
- Current code entry points: `App.tsx`, `src/context/InvoiceContext.tsx`, `src/utils/invoiceBuilder.ts`
- Installed skills: `.agents/skills/` (see `agents.md` §2)
