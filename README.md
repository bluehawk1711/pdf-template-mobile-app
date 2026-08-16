# Templates — PDF Document Generator

A mobile application built with **React Native (Expo + TypeScript)** that generates
professional PDF documents from a library of templates. Pick a template and the app
produces a print-ready PDF you can preview, download, and share.

---

# Features

• Template library — each template defines its own document  \
• Tap a template → preview → **Download PDF**  \
• Templates that need details collect them via a dynamic form; templates that don't go straight to download  \
• Document history (saved locally)  \
• Dark mode support  \
• Modern animated splash screen

---

# Tech Stack

React Native (Expo)  \
TypeScript  \
React Navigation  \
React Native Paper  \
WebView  \
Expo Print (PDF generation)  \
AsyncStorage (local document storage)

---

# Project Structure

```
src
├── components
│   ├── form           — reusable form controls (dynamic form for templates with fields)
│   └── TemplateCard.tsx
├── context
│   ├── InvoiceContext.tsx
│   └── ThemeContext.tsx
├── invoice            — canonical document model, calculations, formatting
├── screens
│   ├── SplashScreen.tsx
│   ├── HomeScreen.tsx
│   ├── TemplateSelectionScreen.tsx
│   ├── InvoiceFormScreen.tsx    — dynamic form (only for templates that need input)
│   ├── PreviewScreen.tsx
│   └── HistoryScreen.tsx
├── storage            — InvoiceRepository (AsyncStorage today; API later)
├── templates
│   ├── registry.ts    — register a template here to add it to the app
│   └── kl-lab/        — Template 1: the K.L LAB brochure renderer
├── theme              — design tokens
└── types.ts
```

# Adding a Template

Templates live in `src/templates/` and are registered in `src/templates/registry.ts`.
Each template declares:

* `id`, `name`, `description`, `tags`, `accent`
* `sections` + `fields` — if the template needs user input (drives the dynamic form)
* `renderPdf(data)` — structured data → HTML for the PDF

A template with **no fields** (like K.L LAB) goes straight from selection to the
download screen.

---

# Installation Guide

1. Clone the Repository

```bash
git clone https://github.com/ashishbhor/Invoice-Maker.git
cd Invoice-Maker
```

2. Install Dependencies

```bash
npm install
```

3. Start the Development Server

```bash
npx expo start
```

You can open the app using:
• Android Emulator
• iOS Simulator
• Expo Go app

---

# Storage

Documents are stored locally on the device using AsyncStorage. A future backend
(e.g. Firebase) can be added behind the `InvoiceRepository` interface in
`src/storage/invoiceRepository.ts` without changing the app.

---

# Building APK (Android)

This project uses Expo EAS Build.

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

After the build finishes, Expo will provide a download link for the APK.

---

# PDF Generation

Templates generate PDFs via:

```
Template renderer → HTML → WebView preview → PDF export (expo-print)
```

The preview shows the exact HTML that gets printed, so what you see is what you
share. The **Download PDF** button saves the file to the device's **Downloads
folder**: on Android it uses the Storage Access Framework (the system folder
picker is the permission request), on iOS it opens the share sheet.

# Template Covers

Template covers are centralized in `src/templates/covers.ts`. For template N,
drop `assets/template-<N>-image.png` into the repo and register it there to use
a custom cover — until then the reference page-1 artwork (`assets/template<N>/page1.png`)
is used automatically.

---

# Future Improvements

• More templates  \
• Cloud document backup  \
• Custom business profiles  \
• WhatsApp share button

---

Author
Developed by Vikas Bhor

License
This project is for educational and business use.
