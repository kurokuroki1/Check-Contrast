# Contrast Check

A real-time colour contrast accessibility tool built with React. Test any foreground/background colour pair against **WCAG 2.1** standards, simulate colour blindness, and auto-fix failing combinations — all in the browser with zero backend.

## Features

- **Live Preview** — See your colour pair applied to sample text instantly as you type or pick colours.
- **WCAG 2.1 Compliance** — Calculates the contrast ratio and checks it against AA and AAA thresholds for both normal and large text.
- **Colour Blindness Simulation** — Preview how your colours appear under Protanopia, Deuteranopia, Tritanopia, and Achromatopsia.
- **Auto-Fix** — One-click suggestion that adjusts the foreground colour to meet AA contrast requirements.
- **Swap & Copy** — Quickly swap foreground/background or copy the full results to your clipboard.

## Demo

> _Add a screenshot or deploy link here._

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- npm or yarn

### Installation

```bash
git clone https://github.com/kurokuroki1/Contrast-Check.git
cd Contrast-Check
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- **React** — UI components and state management
- **TypeScript** — Type-safe development
- **Vite** — Fast dev server and build tooling
- **Vanilla CSS** — No external styling libraries; clean, maintainable styles
- **WCAG 2.1 Algorithms** — Relative luminance and contrast ratio calculations implemented from the W3C specification

## How It Works

1. **Relative Luminance** is calculated for each colour using the sRGB linearisation formula from the WCAG 2.1 spec.
2. The **Contrast Ratio** is derived as `(L1 + 0.05) / (L2 + 0.05)` where `L1` is the lighter luminance.
3. The ratio is compared against WCAG thresholds:
   - **AA Normal** — 4.5:1
   - **AA Large** — 3:1
   - **AAA Normal** — 7:1
   - **AAA Large** — 4.5:1
4. **Colour blindness simulation** applies transformation matrices to approximate how colours appear for different types of colour vision deficiency.
5. **Auto-fix** uses binary search on the HSL lightness channel to find the closest foreground colour that meets the AA Normal (4.5:1) threshold.

## Project Structure

```
Contrast-Check/
├── src/
│   ├── App.tsx          # Main application component
│   ├── App.css          # Component styles
│   ├── index.css        # Global styles and CSS variables
│   └── main.tsx         # React entry point
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Possible Improvements

- Add support for pasting `rgb()`, `hsl()`, and CSS named colours
- Save favourite colour pairs to local storage
- Export results as a PDF accessibility report
- Add a palette generator that suggests accessible colour schemes
- Dark/light theme toggle

## Licence

MIT

---

Built as a portfolio project to demonstrate frontend development, accessibility awareness, and colour science fundamentals.
