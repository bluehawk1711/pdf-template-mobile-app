# Plan — Premium Template-Based Invoice System

> **Purpose:** The living roadmap for transforming the current single-template invoice app into a premium,
> extensible, template-driven invoice platform. Section 1 preserves the full requirements spec verbatim so it
> is never lost. Sections 2+ track design decisions and implementation status.
>
> Companions: `memory.md` (project state + decision log) · `agents.md` (how to work here).
>
> **Repositioning note (2026-08-16):** the app is now a **template-driven PDF generator**, not a photography
> invoice maker. Section 1 remains preserved verbatim as the original requirements; the 2026-08-16 decisions
> (in `memory.md` §6) supersede the photography/invoice specifics — K.L LAB has no input fields and goes
> straight from template selection to the Download PDF screen, which saves the PDF to the device's
> Downloads folder (Android SAF / iOS share sheet). The template/form architecture below stands.
>
> **Template covers (2026-08-16):** covers are centralized in `src/templates/covers.ts`. Convention: for
> template N, `assets/template-<N>-image.png` wins; otherwise the reference page-1 artwork is the cover.

---

## 1. Requirements spec (source of truth — preserved verbatim)

# Invoice Maker — Premium Template-Based Invoice System

You are working on an existing **Expo React Native + TypeScript Invoice Maker** project.

The current application is a basic photography invoice generator, but the goal is to evolve it into a **premium, extensible invoice-generation application** where users can choose from multiple invoice/PDF templates in the future and fill in different fields depending on the selected template.

Do **not** treat this as a simple UI redesign. Improve the underlying architecture so that the project can scale to multiple templates, different field requirements, reusable invoice data, PDF previews, and additional invoice features without creating a mess of conditional logic.

### 1. IMPORTANT — USE THE INSTALLED SKILLS

Before making changes, inspect the available project skills under:

`.agents/skills/`

Use the skill that is relevant to the task instead of reinventing its workflow.

Always use these principles:
- Use the **Expo React Native TypeScript skill** for React Native/Expo architecture and implementation.
- Use the **Apple design / frontend design skill** for UI, visual hierarchy, layouts, spacing, typography, interaction design, and overall UX.
- Use the **PDF skill** whenever working with invoice PDFs, HTML-to-PDF generation, PDF structure, rendering, or PDF-related implementation.
- Use the **Ponytail skill ALL THE TIME when working with PDFs**.
- Use the **view-pdf skill** whenever you need to inspect/verify the appearance of a generated PDF.
- If there are multiple relevant skills, combine them rather than ignoring one.
- Read the actual `SKILL.md` files before implementing their relevant tasks.

The skills are instructions for how the work should be performed, not merely reference material.

### 2. FIRST TEMPLATE — USE THE EXISTING PDF

The first invoice template must be based on the PDF currently located at:

`/pdfs/K.L LAB.pdf`

This PDF is the **reference/design source for Template 1**.

Before implementing the template:
1. Inspect the PDF carefully.
2. Use the appropriate PDF skill.
3. Use the Ponytail skill.
4. Use the view-PDF skill to inspect/render the PDF where appropriate.
5. Understand its: page dimensions, header, logo placement, typography, colors, tables, spacing, invoice/customer information, totals, payment information, QR/payment section, footer, alignment, borders, visual hierarchy.
6. Recreate the visual structure as accurately as reasonably possible.

Do **not** simply embed the PDF as an image.

The application should generate a real PDF from structured invoice data.

The PDF should remain crisp when zoomed or printed.

### 3. DO NOT HARD-CODE THE APPLICATION AROUND ONE TEMPLATE

The biggest architectural requirement is extensibility.

The application will eventually contain: Template 1, Template 2, Template 3, Template 4, etc.

Therefore, avoid architecture such as:

```ts
if (template === "KL_LAB") {
   // hundreds of lines
}
```

or scattering template-specific fields throughout screens.

Instead, create a clean abstraction around:

Invoice Data — Common invoice information should be represented independently from the visual template:

```
Invoice
├── metadata
├── business
├── client
├── event
├── items
├── pricing
├── payment
├── notes
└── template
```

The exact architecture should be determined after inspecting the existing project.

### 4. TEMPLATE SYSTEM

Create a template architecture that allows templates to define: template ID, name, preview image/thumbnail, required fields, optional fields, field types, field labels, sections, PDF renderer, preview renderer, template-specific configuration.

```
InvoiceTemplate
├── id
├── name
├── description
├── thumbnail
├── fields
├── sections
├── renderPreview()
└── renderPdf()
```

Do not blindly copy this exact interface if a better architecture makes more sense.

The important thing is:

> Adding a new invoice template later should require creating/registering the new template rather than rewriting the entire invoice flow.

### 5. DYNAMIC FORM SYSTEM

Different templates may require different information (Template A: business name, client name, phone, event date, services, quantity, price, tax, total, payment info; Template B: additionally GSTIN, address, photographer, venue, package, advance payment, balance, terms and conditions).

The form system should be capable of dynamically rendering fields based on the selected template.

However: **Do not make the UI feel like a generic form builder.** It should feel like a polished, purpose-built invoice application. Use reusable field components and sections internally while maintaining a premium user experience.

### 6. PREMIUM USER FLOW

The application should feel like a professional commercial product rather than a basic student/demo application.

Desired flow:

```
Splash → Home → Create Invoice → Choose Template → Fill Invoice Information → Review Invoice → PDF Preview → Generate / Share
```

Existing functionality such as history should remain part of the overall application.

### 7. TEMPLATE SELECTION SCREEN

Create a premium template-selection experience showing template preview, name, short description, and possibly tags (Professional, Photography, GST, Minimal, Classic). For now there is only **K.L LAB — Template 1**, but structure the UI as if several templates will eventually exist. Do not make the first template feel like a temporary placeholder.

### 8. APPLE-INSPIRED UI / UX

Use the installed Apple design/frontend skills. The UI should feel: Premium, Minimal, Elegant, Spacious, Modern, Fast, Highly readable, Consistent, Native-feeling.

Pay special attention to:
- **Typography:** strong hierarchy (page title, section title, labels, input text, supporting text, amounts, buttons).
- **Spacing:** consistent spacing system; avoid cramped screens.
- **Cards:** use carefully; don't turn every component into a floating rounded rectangle.
- **Colors:** a restrained design system rather than random colors throughout.
- **Dark Mode:** existing dark-mode functionality must remain supported and be intentionally designed rather than simply inverting colors.
- **Animations:** subtle where they improve usability; avoid excessive animations.

### 9. PREMIUM FORM EXPERIENCE

Avoid one giant form. Break the process into logical sections (Business, Client, Event, Services, Payment, Additional Information) — the exact sections depend on the selected template. Use clear section headers, smart defaults, appropriate keyboard types, numeric keyboards for prices, date pickers where appropriate, validation, inline error messages, helpful placeholders, good empty states.

### 10. SERVICES / LINE ITEMS

The services system should support multiple invoice items. Each item: Service, Description, Quantity, Unit Price, Discount, Tax, Total. Architecture should allow additional item properties later without major refactoring. Calculations must be centralized — no duplicated pricing calculations across screens.

### 11. INVOICE CALCULATION ENGINE

Create a clean calculation layer. The UI should not be responsible for calculating invoice totals. The calculation system handles: Subtotal, Discount, Tax, Additional charges, Grand total, Amount paid, Balance due. Use safe numeric handling and avoid floating-point bugs where possible. The same calculation result must be used by: Form UI, Preview, PDF, History, future backend synchronization. Single source of truth.

### 12. PDF ARCHITECTURE

The PDF generation system should be separated from the UI:

```
Invoice Data → Template → Template Renderer → HTML / PDF representation → PDF generation
```

Do not make PDF generation dependent on the visual React Native screen. The PDF renderer consumes structured invoice data. This makes it possible to add `Template 1 → Renderer 1`, `Template 2 → Renderer 2`, etc., without rebuilding the application.

### 13. PDF QUALITY

The generated PDF must: match the reference PDF closely; have proper margins; preserve typography, alignment; have clean tables; handle long service lists; different client names; different prices; long addresses; different invoice numbers; missing optional fields gracefully; work correctly on different amounts of content. Do not assume the invoice will always contain the same amount of text as the reference PDF. Test edge cases.

### 14. PDF VERIFICATION WORKFLOW

Whenever you modify the PDF/template:
1. Generate the PDF.
2. Inspect it using the appropriate PDF tools/skills.
3. Use Ponytail as required.
4. Use the view-PDF skill to visually inspect the result.
5. Compare it against `/pdfs/K.L LAB.pdf`.
6. Fix layout problems.
7. Repeat until the result is visually acceptable.

Do not assume the PDF is correct simply because the code compiles.

### 15. PDF PREVIEW

The preview screen should show the actual invoice as closely as possible to the final PDF. Avoid creating a completely separate fake preview UI that looks different from the generated document. "What I see here is what I'm going to share." If the existing WebView/HTML approach is suitable, improve it rather than unnecessarily replacing it.

### 16. QR / PAYMENT

Preserve the existing dynamic UPI QR functionality. The QR should be generated from the invoice/payment data rather than permanently hardcoded into the template. Support: UPI ID, Payment amount, Invoice total, Amount due. The template should decide where payment information is visually placed. Payment logic should remain separate from template layout.

### 17. INVOICE HISTORY

Preserve the existing invoice history functionality. History records should store structured invoice data, not merely generated PDF files. A history item should know: Invoice ID, Invoice number, Client, Date, Total, Amount paid, Balance, Template used, Created at, Updated at. This enables future editing, regenerating, filtering, and cloud synchronization.

### 18. DATA PERSISTENCE

The current project mentions Firebase as a future backend. Do not introduce unnecessary backend complexity right now unless required. First create a clean local data architecture. Keep the persistence layer abstract enough that Firebase/another backend can later be introduced:

```
Invoice Repository → Local Storage → Future Firebase / API
```

Do not tightly couple the application to Firebase.

### 19. PROJECT STRUCTURE

Improve the existing structure if necessary. A scalable architecture may eventually look conceptually like:

```
src/
├── components/
├── context/
├── navigation/
├── screens/
├── templates/
│   ├── registry.ts
│   ├── types.ts
│   └── kl-lab/
│       ├── config.ts
│       ├── fields.ts
│       ├── preview.tsx
│       └── pdf.ts
├── invoice/
│   ├── calculations.ts
│   ├── validation.ts
│   └── types.ts
├── storage/
├── pdf/
├── payments/
├── theme/
├── utils/
└── types/
```

This is only a conceptual example. Inspect the current codebase before restructuring it. Do not perform a massive rewrite unless it is justified.

### 20. EXISTING CODE

Before changing anything: inspect `App.tsx`, all existing screens, both contexts, `invoiceBuilder.ts`, `types.ts`, `assets/invoice.html`, package.json, Expo configuration, the existing PDF workflow. Understand what already works. Do not unnecessarily delete working functionality. Refactor where appropriate.

### 21. FIRST MILESTONE

For this implementation, focus on getting **Template 1 fully working** — **K.L LAB**, reference `/pdfs/K.L LAB.pdf`. The application should allow the user to: open the app → create an invoice → select the K.L LAB template → enter the required information → add multiple services → automatically calculate totals → preview the invoice → generate the PDF → inspect the generated PDF → share/export the PDF → save the invoice to history. The architecture must already support future templates.

### 22. DO NOT OVERENGINEER

Do not introduce: Redux, a backend, Firebase, complex state-management libraries, large UI frameworks, unnecessary dependencies — unless there is a concrete reason. Prefer the existing project stack and lightweight abstractions. Goal: **Clean architecture + premium UX + reliable PDF generation.** Not architectural complexity for its own sake.

### 23. RESPONSIVENESS

The application should work well on different Android screen sizes. Do not design everything around a single phone resolution. Pay attention to: small phones, large phones, different aspect ratios, keyboard visibility, safe areas, scroll behavior, long forms, long invoice lists.

### 24. ACCESSIBILITY

Include reasonable accessibility support: proper labels, touchable areas large enough for mobile, good contrast, clear error states, screen-reader-friendly controls where practical. Do not sacrifice usability for visual effects.

### 25. CODE QUALITY

Use: strict TypeScript, reusable components, small focused functions, clear naming, centralized types, centralized calculations, centralized template definitions, minimal duplication. Avoid: `any`, huge components, repeated business logic, template-specific hacks scattered across screens, magic numbers everywhere, hardcoded invoice calculations in UI.

### 26. IMPLEMENTATION PROCESS

Follow this order:
- **Phase 1 — Understand:** Inspect the existing project and all relevant skills.
- **Phase 2 — Analyze PDF:** Inspect `/pdfs/K.L LAB.pdf` using the PDF/Ponytail/view-PDF workflow.
- **Phase 3 — Architecture:** Design the template/data abstraction before modifying the screens.
- **Phase 4 — Refactor:** Refactor existing invoice data/calculation/PDF code only where necessary.
- **Phase 5 — UI:** Create the premium Apple-inspired user flow.
- **Phase 6 — Template 1:** Implement the K.L LAB template accurately.
- **Phase 7 — PDF:** Connect the structured invoice data to the K.L LAB PDF renderer.
- **Phase 8 — Verification:** Generate PDFs with short data, long data, multiple services, different totals, missing optional values, long client names, long addresses. Inspect the resulting PDFs.
- **Phase 9 — Polish:** Layout, spacing, typography, animations, navigation, empty states, validation, loading states, error handling.
- **Phase 10 — Final Review:** Run TypeScript checks/build/lint where available. Verify existing functionality hasn't been accidentally broken.

### 27. IMPORTANT DESIGN PRINCIPLE

Think of this application as: **Canva for invoices, but optimized for fast mobile invoice creation.**

```
Choose a template → Fill only the information that template needs → See the invoice update live → Generate a professional PDF → Share it immediately
```

The experience should be fast enough that creating an invoice feels almost effortless.

### 28. FUTURE-PROOFING

Do not implement future features now unless necessary, but ensure the architecture doesn't prevent them. Potential future features: multiple PDF templates, template categories, template favorites, custom business profiles, multiple businesses, GST invoices, invoice numbering, payment tracking, client management, product/service catalog, cloud backup, Firebase synchronization, WhatsApp sharing, invoice editing, duplicate invoice, recurring invoices, analytics, multiple currencies, custom branding, custom logos, custom colors, custom terms and conditions.

### FINAL EXPECTATION

Do not just make the existing application "look nicer." Transform it into the foundation of a **premium, template-driven invoice application**. First target: **K.L LAB PDF → Template 1 → Dynamic Invoice Form → Live Preview → Accurate PDF → Share**, keeping the architecture ready for **Template 2 → Template 3 → Template 4 → …**. Use the installed skills aggressively and appropriately, especially: Apple/frontend design for UI/UX, Expo React Native TypeScript for application implementation, PDF skill for PDF work, Ponytail for PDF-related work, view-PDF for inspecting generated PDFs. Do not skip PDF visual verification. Prioritize correctness, maintainability, premium UX, and an architecture that can grow without requiring another major rewrite.

---

## 2. Target architecture (design intent)

```
src/
├── components/            # reusable UI (FormSection, FieldInput, ServiceItemRow, AmountText, …)
├── context/               # InvoiceContext (draft state), ThemeContext
├── navigation/            # navigators moved out of App.tsx
├── screens/               # Splash, Home, TemplateSelection, InvoiceForm, Preview, History
├── templates/
│   ├── registry.ts        # registerTemplate() / getTemplate(id) / listTemplates()
│   ├── types.ts           # InvoiceTemplate contract (id, name, description, thumbnail, fields, sections,
│   │                      #   renderPreview(), renderPdf(), config)
│   └── kl-lab/            # Template 1
│       ├── config.ts      # id/name/description/tags/thumbnail
│       ├── fields.ts      # field + section definitions (drives the dynamic form)
│       ├── preview.tsx    # preview renderer (WebView HTML, same as PDF)
│       └── pdf.ts         # PDF renderer (structured data → HTML for expo-print)
├── invoice/
│   ├── types.ts           # canonical Invoice data model (metadata/business/client/event/items/pricing/payment/notes/template)
│   ├── calculations.ts    # single source of truth for money (integer-safe)
│   └── validation.ts      # field validation helpers (per-field rules from template fields)
├── storage/               # InvoiceRepository interface + AsyncStorage implementation (Firebase later)
├── pdf/                   # shared PDF plumbing (print-to-file, share) — not template-specific
├── payments/              # UPI/QR logic (build UPI link + QR payload from payment data)
├── theme/                 # design tokens (colors, spacing, type scale)
└── utils/
```

**Guiding rules (from spec §3–§5, §11–§12):**
- Templates are **data + renderers**, registered centrally; screens never branch on template id.
- The form is **driven by the selected template's field/section definitions**, but styled like a purpose-built app.
- All money flows through `invoice/calculations.ts`; UI, preview, PDF, history consume the same result.
- PDF/HTML is generated from **structured invoice data only** — never from screen state.

---

## 3. Phased implementation plan (status)

Legend: ⬜ not started · 🟡 in progress · ✅ done

### Phase 1 — Understand (spec §26)
- [ ] ✅ Inspect existing project (done 2026-08-14 — see `memory.md` §3)
- [ ] ✅ Inventory installed skills (done — `.agents/skills/`)
- [x] ✅ Read `SKILL.md` for frontend-design, ponytail, expo-react-native-typescript (used for Phase 5 work)
- [ ] ⬜ Read `SKILL.md` for pdf + view-pdf (needed for Phase 2)
- **Foundational issue to resolve first:** `firebaseConfig.ts` missing but imported by 3 files (see `memory.md` §5 #1). The app does not currently compile. Decide & fix in Phase 4 (or earlier if it blocks work).

### Phase 2 — Analyze reference PDF
- [x] ✅ Opened `pdfs/K.L LAB.pdf`: 9 pages, A4, image-based (no text layer); portrait (1, 9) + landscape (2–8); every page carries a repeated 700×88 logo strip; palette extracted programmatically (pillow+pypdf in project-local `tmp/pdfenv`)
- [x] ✅ Analysis written to `src/templates/kl-lab/design.md`; extracted artwork saved to `pdfs/kl-lab/`; K.L LAB accent updated to verified brand green #39A46B
- [ ] ⬜ Visual confirmation pass (fonts, exact table/totals/QR layout) — pages available in `pdfs/kl-lab/`; use the view-pdf skill when iterating on the renderer

### Phase 3 — Architecture
- [x] ✅ Template contract complete (`src/templates/types.ts`): sections, fields (text/number/date/select/items/notes), renderers; registry + K.L LAB entry declares its field schema (`src/templates/kl-lab/config.ts`)
- [x] ✅ Canonical `InvoiceData` model in `src/invoice/types.ts` (meta / business / client / items / pricing / payment / notes / templateId) — draft form types remain in `src/types.ts` until the dynamic form replaces them
- [x] ✅ `invoice/calculations.ts`: `breakdownLine`, `calculateItemTotal`, `calculatePricing` (subtotal, discount, tax, extra charges, grand total, balance due), `withPricing` — round-at-boundary (`round2`), paise-integers = documented upgrade path; self-check at `scripts/check-calculations.ts` (11 asserts)
- [x] ✅ `storage/InvoiceRepository` interface + AsyncStorage impl (`src/storage/invoiceRepository.ts`) — Firebase removed entirely (user decision 2026-08-14)
- [x] ✅ Payments: QR removed entirely (user decision 2026-08-14) — `src/payments/upi.ts` deleted; renderers show a text-only payment line (UPI id + amount due)
- [x] ✅ Business identity centralized in `src/invoice/business.ts` (`DEFAULT_BUSINESS` — name/address/phone/email/UPI, replaces hardcoded values)
- [x] ✅ Domain lists moved to `src/invoice/constants.ts` (`EVENT_TYPES`, `DEFAULT_SERVICES` — screens and template config share them)

### Phase 4 — Refactor existing code
- [x] ✅ Firebase removed (package uninstalled, imports deleted): history + invoice numbering now run on AsyncStorage via the repository — resolves `memory.md` §5 #1, app compiles again
- [x] ✅ Calculations moved out of `InvoiceContext` into `invoice/calculations.ts` — finalize/buildQuotation use the engine
- [x] ✅ Canonical model split out of `src/types.ts` into `invoice/types.ts`; navigators still in `App.tsx` (moved only when a reason appears — ponytail)
- [x] ✅ ServicesScreen removed (the `any`/`@ts-ignore` violations went with it)
- [ ] ⬜ Keep quotations, dark mode, history, UPI flow working throughout

### Phase 5 — Premium UI (Apple-inspired)
- [x] ✅ Design tokens: `src/theme/tokens.ts` — iOS neutrals + brand purple, light/dark palettes, spacing / radii / type scales; ThemeContext consumes them (all screens inherit automatically)
- [x] ✅ New flow: Home → **Template Selection** → **Invoice Form** (sectioned, template-driven) → Preview → Share (spec §6–§9) — legacy EventSelection/Services/ClientDetails screens and draft plumbing removed (2026-08-14)
- [x] ✅ **Page slide viewer (2026-08-17):** page-based templates (declared `pages` in the registry) open `PageViewerScreen` straight from the Home card — a horizontal swipe viewer of the template's page images (K.L LAB: its 9 brochure pages) with page counter + Download PDF footer. Plain images for now; custom page-turn animations are the planned upgrade. Shared `useDownloadPdf` hook powers both the viewer and the WebView preview.
- [x] ✅ Reusable field components (`src/components/form/`): FormSection, FormTextField, FormDateField, FormSelectField, FormItemsEditor (qty/rate/tax/discount rows + preset chips + per-row totals), FormField dispatcher — validation with inline errors; pure logic in `src/invoice/formBuilder.ts`
- [x] ✅ Live totals in a sticky footer (engine-computed subtotal/discount/tax/grand total/balance) — "see it update live" (spec §27)
- [x] ✅ Premium template-selection screen: `TemplateSelectionScreen` + `TemplateCard` (mini document mock, tags, selection state, registry-driven) built for many templates (spec §7)

### Phase 6 — Template 1: K.L LAB
- [x] ✅ K.L LAB registered in the registry with config + sections + fields (Phase 3 work)
- [x] ✅ `templates/kl-lab/pdf.ts` renderer: structured `InvoiceData` → A4 HTML with verified brand green #39A46B, itemised table, engine totals, UPI QR block, notes/terms, footer
- [x] ✅ Preview uses the same HTML (`renderPdf`/`renderPreview` registered; PreviewScreen wrapper scales to fit 794 px)

### Phase 7 — Connect data → PDF
- [x] ✅ Canonical invoice data → template renderPdf → HTML → expo-print (PreviewScreen renders via selected template; legacy builder = fallback)
- [ ] ⬜ Wire dynamic form → calculations → preview live updates (spec §27 "see it update live") — blocked on Phase 5
- [x] ✅ Structured invoice saved to history repository (with Firebase removal)

### Phase 8 — PDF verification
- [x] ✅ Generated PDFs with edge-case data — 7 samples (short, 22-item → 2 pages, missing optionals, tax/discount, quotation, long names, notes); headless Chrome → PDF + PNG; programmatic checks pass (palette, page flow, QR loads)
- [ ] 🟡 Human visual comparison against `pdfs/K.L LAB.pdf` — review PDFs at `pdfs/kl-lab/pandoc/` (pandoc+wkhtmltopdf) and `pdfs/kl-lab/rendered/` (Chrome, app-faithful); hero copy `pdfs/KL-LAB-sample-invoice.pdf` — fix layout per feedback (spec §14)

### Phase 9 — Polish
- [x] ✅ Layout/spacing/typography, animations, empty states, loading/error handling, keyboard & safe-area behavior, responsiveness on small/large phones (spec §23), accessibility (spec §24)
  - Form: items-editor empty state + LayoutAnimation, 44px touch targets, accessibility labels/hints/live-region errors, keyboard dismissal (done earlier)
  - Full-app audit (2026-08-14): Home redesign (action cards + recent invoices), History rewrite (filter pills, badges, formatted totals, empty states), Preview summary bar + themed footer/wrapper, Splash timing 4.5 s → 3.2 s, `brandAccent` token, dark-mode separator fixes, drawer padding hack removed
- [ ] ⬜ Device pass: run on Android emulator/device, verify keyboard/safe-area/layout on small & large screens

### Phase 10 — Final review
- [x] ✅ `npx tsc --noEmit` clean (2026-08-16); form→PDF check (23 asserts) passes
- [ ] ⬜ Device pass: verify PDF lands in the Downloads folder (Android SAF picker) — needs a real device/emulator
- [ ] ⬜ Manual smoke test: template → preview → PDF → Downloads → history

---

## 4. Template contract (proposal — finalize in Phase 3)

```ts
interface InvoiceTemplate {
  id: string;               // e.g. "kl-lab"
  name: string;             // "K.L LAB"
  description: string;      // one-liner for the selection screen
  thumbnail?: string;       // preview image / source for the card
  tags?: string[];          // "Professional", "Photography", "GST", "Minimal", …
  fields: TemplateField[];  // drives the dynamic form
  sections: TemplateSection[]; // groups fields for the form
  renderPreview(data: Invoice): string; // HTML (same as PDF)
  renderPdf(data: Invoice): string;     // HTML → expo-print
  config?: Record<string, unknown>;     // template-specific (paper size, colors, …)
}
```

Key open design decisions (record answers in `memory.md` Decision Log):
- Field schema shape (`{ key, label, type: 'text'|'number'|'date'|'select'|'items', required, options?, … }`) and how line-item fields (services) are expressed.
- Whether preview and PDF share one HTML builder with a "screen vs print" mode (preferred — spec §15).
- Payments: QR removed (2026-08-14); UPI id shown as text on the invoice.

---

## 5. Milestones

- **M0 — Docs & baseline (2026-08-14):** ✅ memory.md, agents.md, plan.md created; baseline analysis recorded.
- **M1 — Compiles again:** ✅ Firestore imports resolved (Firebase removed, AsyncStorage repository in); `tsc --noEmit` passes clean.
- **M2 — Architecture in place:** invoice types, calculation engine, template registry, storage repository, payments module.
- **M3 — Template 1 end-to-end:** K.L LAB selectable → form → preview → PDF matching reference → share → history.
- **M4 — Polish & review:** premium UX pass, PDF verification matrix, final typecheck + smoke test.
