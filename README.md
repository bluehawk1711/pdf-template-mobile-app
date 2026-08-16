# Auto Invoice Maker

A mobile application built with **React Native (Expo + TypeScript)** that helps photography studios quickly generate professional invoices with dynamic QR payments and PDF export.

This app was built to simplify invoice creation for **photographers and production houses** like GP Studio.

---

# Features

• Create invoices for photography events  
• Select event types (Wedding, Birthday, Baby Shower, etc.)  
• Add multiple services with pricing  
• Enter client details and event date  
• Automatically calculate totals  
• Generate professional invoice layout  
• Invoice **preview before generation**  
• Export invoice as **PDF**  
• Share invoice directly with clients  
• Invoice history tracking  
• Dark mode support  
• Modern animated splash screen  

---

# Tech Stack

React Native (Expo)  
TypeScript  
React Navigation  
React Native Paper  
WebView  
Expo Print (PDF generation)  
AsyncStorage (local invoice storage)

---
---
src
├── context
│ ├── InvoiceContext.tsx
│ └── ThemeContext.tsx
│
├── screens
│ ├── HomeScreen.tsx
│ ├── EventSelectionScreen.tsx
│ ├── ServicesScreen.tsx
│ ├── ClientDetailsScreen.tsx
│ ├── PreviewScreen.tsx
│ ├── HistoryScreen.tsx
│ └── SplashScreen.tsx
│
├── utils
│ ├── invoiceBuilder.ts
│ └── uuid.ts
│
└── types.ts

# Project Structure
---

---

# Installation Guide

1. Clone the Repository

```bash
git clone https://github.com/ashishbhor/Invoice-Maker.git
cd Invoice-Maker
```

2. Install Dependencies

Make sure Node.js and npm are installed.
```Then run:
npm install
```

3. Install Expo CLI

```If Expo CLI is not installed:
npm install -g expo-cli
```

4. Start the Development Server

```Run:
npx expo start
You can open the app using:
• Android Emulator
• iOS Simulator
• Expo Go app
```

```Storage```
---
Invoices are stored locally on the device using AsyncStorage.

A future backend (e.g. Firebase) can be added behind the `InvoiceRepository`
interface in `src/storage/invoiceRepository.ts` without changing the app.
---

---
Building APK (Android)

This project uses Expo EAS Build.

Install EAS CLI
```npm install -g eas-cli```

```Login to Expo
eas login
Build APK
eas build -p android --profile preview
```

After the build finishes, Expo will provide a download link for the APK.

---
---
```
Invoice PDF Generation
Invoices are generated using:

HTML Template → WebView Preview → PDF Export

This allows:
• Professional layout
• Custom styling
• Payment details (UPI)
```
---
---
Future Improvements

• Cloud invoice storage / backup
• Client payment tracking
• Automatic invoice numbering system
• Online payment confirmation
• WhatsApp invoice sharing button
---
---
Author
Developed by Vikas Bhor
Production House: BhorBox
---
---
```
License
This project is for educational and business use.
```
---
