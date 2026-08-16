# Agent Operating Guide (agents.md)

> **Purpose:** How to work on this repo as an AI agent (or any future contributor). Read this, then
> `memory.md` (project state + decision log) and `plan.md` (roadmap) before touching code.

---

## 1. Read order at the start of any session

1. `memory.md` — current state, conventions, known issues, decision log (append decisions there!)
2. `plan.md` — the transformation roadmap and where we are
3. This file
4. The relevant `SKILL.md` under `.agents/skills/` for the task at hand

---

## 2. Mandatory skills (never skip)

These are installed under `.agents/skills/` and contain **instructions**, not reference material.
Read the actual `SKILL.md` before starting the relevant work:

| Task | Skill |
|---|---|
| Any Expo / React Native / TypeScript work | `expo-react-native-typescript` |
| Any UI / layout / visual design / UX work | `frontend-design` (Apple-inspired design system) |
| **All PDF work** (analysis, generation, layout) | `pdf` **+ `ponytail`** (ponytail applies to every PDF task) |
| Verifying/inspecting a generated PDF visually | `view-pdf` |
| Reviewing for over-engineering | `ponytail-review` |
| Native-feeling iOS/Android UI with @expo/ui | `expo-ui` |

Combine skills when a task spans areas (e.g. building a PDF preview screen = pdf + ponytail + expo-react-native-typescript + frontend-design).

---

## 3. Non-negotiable coding rules

- **Strict TypeScript, no `any`, no `@ts-ignore`.** Current code violates this in `ServicesScreen` — fix it, don't copy it.
- **No hard-coding around Template 1.** No `if (templateId === 'kl-lab')` chains in screens or shared code. Templates are registered objects; screens ask the registry for fields/renderers.
- **Single source of truth for money.** All totals come from the calculation engine (`src/invoice/calculations.ts` once it exists). Never recompute in a screen, preview, PDF, or history.
- **PDF renderer consumes structured data only** — never a React component tree, never screen state. `Invoice data → Template → renderer → HTML → PDF`.
- **Preview must show the real generated HTML** (same string the PDF is printed from), not a fake mockup.
- **Don't over-engineer.** Reach for the simplest thing that satisfies the spec: context + hooks, expo-print, webview, AsyncStorage. No Redux, no new backend, no speculative abstractions.
- **Small focused functions, clear naming, centralized types.** Avoid magic numbers and duplicated business logic.
- **Preserve working functionality** — history, quotations, dark mode, UPI/QR flow all stay; refactor, don't delete.

---

## 4. PDF workflow (required, do not skip visual verification)

1. Analyze the reference: `pdfs/K.L LAB.pdf` (page size, header, logo, typography, colors, tables, spacing, totals, payment/QR, footer, borders, hierarchy).
2. Implement the template's PDF renderer (HTML that prints at A4-ish dimensions, crisp text, proper margins).
3. Generate a PDF from structured invoice data.
4. **Visually inspect it** with the `view-pdf` skill (render the generated PDF and compare against the reference).
5. Fix layout/spacing/overflow issues; repeat until visually acceptable.
6. Test with edge-case data: short lists, **long** service lists, long client names, long addresses, different totals, **missing optional fields**.

Never assume a PDF is correct because code compiles.

---

## 5. Verification commands

```bash
npm install          # REQUIRED first — node_modules is not committed
npx tsc --noEmit     # typecheck (no emit)
npm run web          # or: npm start → Expo Go / emulator
```

There is currently **no test suite and no lint script**. If you add logic (e.g. the calculation engine),
add lightweight unit tests where practical rather than leaving them untested. Do not add heavy test frameworks.

---

## 6. Where things live (current → target)

Current flat structure is being migrated toward (see `plan.md` §4):

```
src/
├── components/      # reusable field components, cards, etc.
├── context/         # InvoiceContext, ThemeContext
├── navigation/      # moved out of App.tsx
├── screens/         # Splash, Home, TemplateSelection, InvoiceForm, Preview, History
├── templates/
│   ├── registry.ts  # register/get templates
│   ├── types.ts     # InvoiceTemplate contract
│   └── kl-lab/      # config.ts, fields.ts, preview.tsx, pdf.ts
├── invoice/         # types.ts, calculations.ts, validation.ts
├── storage/         # InvoiceRepository abstraction (local now, Firebase later)
├── payments/        # UPI/QR logic (decoupled from template layout)
├── theme/           # design tokens
└── utils/
```

---

## 7. Do / Don't

**Do**
- Ask the user about genuinely ambiguous, hard-to-reverse decisions (template field model, persistence choice).
- Check `memory.md`'s decision log before re-deciding something already decided.
- Keep the docs updated: **every decision/step → one row in the memory.md Decision Log**.

**Don't**
- Run `git push` / deploys without explicit permission.
- Install global packages or modify anything outside the project.
- Delete `pdfs/K.L LAB.pdf` or `assets/` without checking references.
- Rewrite everything at once; follow the phases in `plan.md` and keep the app runnable at each step.
