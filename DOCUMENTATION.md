# Check-Contrast — Full Documentation

## WCAG 2.1 Colour Contrast Accessibility Tool

A real-time colour contrast accessibility checker built with React and TypeScript. Tests colour pairs against WCAG 2.1 standards, simulates colour blindness, and suggests auto-fixes for non-compliant colour combinations.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Project Structure](#2-project-structure)
3. [Dependencies](#3-dependencies)
4. [Configuration Files](#4-configuration-files)
5. [HTML Entry Point](#5-html-entry-point)
6. [Application Entry — main.tsx](#6-application-entry--maintsx)
7. [Core Application — App.tsx](#7-core-application--apptsx)
   - [Colour Utility Functions](#71-colour-utility-functions)
   - [Colour Blindness Simulation](#72-colour-blindness-simulation)
   - [WCAG Evaluation](#73-wcag-evaluation)
   - [Auto-Fix Algorithm](#74-auto-fix-algorithm)
   - [UI Sub-Components](#75-ui-sub-components)
   - [Main App Component](#76-main-app-component)
8. [Styles — index.css](#8-styles--indexcss)
9. [Styles — App.css](#9-styles--appcss)
10. [Application Flow (End-to-End)](#10-application-flow-end-to-end)
11. [Key Algorithms](#11-key-algorithms)
12. [Accessibility Features](#12-accessibility-features)
13. [NPM Scripts](#13-npm-scripts)

---

## 1. Project Overview

**Check-Contrast** is a browser-based tool that evaluates the contrast ratio between two colours against WCAG 2.1 accessibility standards. It runs entirely in the browser with zero backend dependencies.

**Key Features:**

- Real-time contrast ratio calculation using official WCAG 2.1 formulas
- Four-level WCAG compliance checking (AA Normal, AA Large, AAA Normal, AAA Large)
- Live preview panel showing sample text rendered with chosen colours
- Colour blindness simulation for four types (Protanopia, Deuteranopia, Tritanopia, Achromatopsia)
- Intelligent auto-fix using binary search on HSL lightness to meet AA standard
- Dark and light theme with localStorage persistence
- Copy results to clipboard
- Fully responsive design (mobile-first, 720px max-width)
- Strict TypeScript with full type safety

---

## 2. Project Structure

```
Check-Contrast/
├── src/
│   ├── App.tsx                  # Main application component (423 lines)
│   ├── App.css                  # Component-level styles (435 lines)
│   ├── index.css                # Global styles & CSS custom properties (82 lines)
│   ├── main.tsx                 # React entry point (10 lines)
│   └── assets/
│       ├── hero.png             # Hero/banner image asset
│       ├── react.svg            # React logo
│       └── vite.svg             # Vite logo
├── public/
│   ├── favicon.svg              # Browser tab icon
│   └── icons.svg                # SVG icon sprite
├── index.html                   # HTML shell (14 lines)
├── package.json                 # Dependencies & scripts (30 lines)
├── vite.config.ts               # Vite build configuration (7 lines)
├── tsconfig.json                # Root TypeScript config (7 lines)
├── tsconfig.app.json            # Application TypeScript config (28 lines)
├── tsconfig.node.json           # Node/tooling TypeScript config (26 lines)
├── eslint.config.js             # ESLint flat config (23 lines)
├── .gitignore                   # Git ignore rules (28 lines)
└── README.md                    # Project readme (90 lines)
```

---

## 3. Dependencies

### Production Dependencies

| Package        | Version    | Purpose                              |
| -------------- | ---------- | ------------------------------------ |
| `react`        | `^19.2.4`  | UI component library                 |
| `react-dom`    | `^19.2.4`  | DOM rendering engine for React       |

### Development Dependencies

| Package                       | Version      | Purpose                                       |
| ----------------------------- | ------------ | --------------------------------------------- |
| `@eslint/js`                  | `^9.39.4`    | Core ESLint JavaScript rules                  |
| `@types/node`                 | `^24.12.0`   | TypeScript type definitions for Node.js       |
| `@types/react`                | `^19.2.14`   | TypeScript type definitions for React         |
| `@types/react-dom`            | `^19.2.3`    | TypeScript type definitions for React DOM     |
| `@vitejs/plugin-react`        | `^6.0.0`     | Vite plugin enabling React Fast Refresh       |
| `eslint`                      | `^9.39.4`    | JavaScript/TypeScript linter                  |
| `eslint-plugin-react-hooks`   | `^7.0.1`     | ESLint rules for React Hooks best practices   |
| `eslint-plugin-react-refresh` | `^0.5.2`     | ESLint rules for React Fast Refresh           |
| `globals`                     | `^17.4.0`    | Predefined global variable definitions        |
| `typescript`                  | `~5.9.3`     | TypeScript compiler                           |
| `typescript-eslint`           | `^8.56.1`    | ESLint parser and rules for TypeScript        |
| `vite`                        | `^8.0.0`     | Build tool and development server             |

---

## 4. Configuration Files

### `tsconfig.json`

Root TypeScript configuration. References two child configs:

- `tsconfig.app.json` — for application source code
- `tsconfig.node.json` — for build tooling (Vite config)

### `tsconfig.app.json`

| Setting                 | Value                          | Description                               |
| ----------------------- | ------------------------------ | ----------------------------------------- |
| `target`                | `ES2023`                       | JavaScript output target                  |
| `lib`                   | `ES2023, DOM, DOM.Iterable`    | Available type libraries                  |
| `module`                | `ESNext`                       | Module system                             |
| `moduleResolution`      | `bundler`                      | Resolution strategy for Vite              |
| `jsx`                   | `react-jsx`                    | JSX transform (automatic)                 |
| `strict`                | `true`                         | Enables all strict type-checking          |
| `noUnusedLocals`        | `true`                         | Error on unused local variables           |
| `noUnusedParameters`    | `true`                         | Error on unused function parameters       |
| `noFallthroughCasesInSwitch` | `true`                    | Error on fallthrough switch cases         |
| `noUncheckedSideEffectImports` | `true`                  | Check side-effect imports                 |
| `include`               | `src/`                         | Source files to compile                   |

### `tsconfig.node.json`

Mirrors app config but targets Node.js tooling. No JSX support. Includes only `vite.config.ts`.

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

Single plugin: `@vitejs/plugin-react` for React Fast Refresh (HMR) during development.

### `eslint.config.js`

Uses ESLint flat config format:

- Extends: ESLint recommended, TypeScript ESLint recommended, React Hooks recommended
- Plugins: React Refresh
- Ignores: `dist/` directory

### `.gitignore`

Ignores: logs, `node_modules`, `dist`, build artifacts, IDE configs (`.vscode`, `.idea`), OS files (`.DS_Store`), editor temp files (`*.sw?`), `.vercel`, and `.env` files.

---

## 5. HTML Entry Point

**File:** `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Real-time colour contrast accessibility tool..." />
    <title>Contrast Check — WCAG 2.1 Colour Contrast Tool</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- Sets UTF-8 encoding and responsive viewport
- Provides SEO meta description
- Mounts the React application via `<div id="root">`
- Loads `main.tsx` as an ES module

---

## 6. Application Entry — `main.tsx`

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- Creates a React root on the `#root` DOM element
- Wraps `App` in `StrictMode` for development warnings
- Imports global styles from `index.css`

---

## 7. Core Application — `App.tsx`

The entire application logic resides in this single file (423 lines). It contains utility functions, type definitions, sub-components, and the main `App` component.

---

### 7.1 Colour Utility Functions

#### `hexToRgb(hex: string): [number, number, number] | null`

Converts a hex colour string to an RGB tuple.

| Parameter | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| `hex`     | `string` | Hex colour string (e.g. `#1a1a2e`) |

**Returns:** `[r, g, b]` tuple with values 0–255, or `null` if the input is invalid.

**Implementation:**
1. Validates format with regex `/^#?([a-f\d]{6})$/i`
2. Extracts the 6-character hex portion
3. Parses as integer (base 16)
4. Extracts R, G, B by bit-shifting: `>> 16`, `>> 8 & 0xff`, `& 0xff`

---

#### `rgbToHex(r: number, g: number, b: number): string`

Converts RGB values to a hex colour string.

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `r`       | `number` | Red channel (0–255)  |
| `g`       | `number` | Green channel (0–255)|
| `b`       | `number` | Blue channel (0–255) |

**Returns:** Hex string prefixed with `#` (e.g. `#1a1a2e`).

**Implementation:**
1. Clamps each value to 0–255 range
2. Rounds to nearest integer
3. Combines with bit-shifting: `(1 << 24) | (r << 16) | (g << 8) | b`
4. Converts to hex string, pads with leading zeros

---

#### `linearize(c: number): number`

Applies sRGB linearisation as defined in the WCAG 2.1 specification.

| Parameter | Type     | Description                          |
| --------- | -------- | ------------------------------------ |
| `c`       | `number` | sRGB channel value (0–255)           |

**Returns:** Linearised value between 0 and 1.

**Formula:**
```
s = c / 255
if s <= 0.04045:  return s / 12.92
else:             return ((s + 0.055) / 1.055) ^ 2.4
```

This transformation converts from the perceptual sRGB colour space to linear light intensity, which is required for accurate luminance calculations.

---

#### `relativeLuminance(r: number, g: number, b: number): number`

Calculates the relative luminance of a colour per WCAG 2.1.

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `r`       | `number` | Red channel (0–255)  |
| `g`       | `number` | Green channel (0–255)|
| `b`       | `number` | Blue channel (0–255) |

**Returns:** Luminance value between 0 (black) and 1 (white).

**Formula:**
```
L = 0.2126 * linearize(R) + 0.7152 * linearize(G) + 0.0722 * linearize(B)
```

The coefficients reflect human perception: green contributes most to perceived brightness, followed by red, then blue.

---

#### `contrastRatio(l1: number, l2: number): number`

Calculates the contrast ratio between two luminance values.

| Parameter | Type     | Description                |
| --------- | -------- | -------------------------- |
| `l1`      | `number` | Luminance of first colour  |
| `l2`      | `number` | Luminance of second colour |

**Returns:** Contrast ratio (range: 1.0 to 21.0).

**Formula:**
```
ratio = (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)
```

The 0.05 offset prevents division by zero and accounts for ambient light.

---

### 7.2 Colour Blindness Simulation

#### Type Definition

```typescript
type Matrix = [number, number, number, number, number, number, number, number, number]
```

A 9-element tuple representing a 3×3 colour transformation matrix.

#### `CB_MATRICES: Record<string, Matrix>`

Pre-defined matrices for simulating four types of colour vision deficiency:

| Type              | Condition           | Affected Cones | Matrix                                                              |
| ----------------- | ------------------- | -------------- | ------------------------------------------------------------------- |
| **Protanopia**    | Red-blind           | L-cones (red)  | `[0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758]`             |
| **Deuteranopia**  | Green-blind         | M-cones (green)| `[0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7]`                     |
| **Tritanopia**    | Blue-yellow-blind   | S-cones (blue) | `[0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525]`               |
| **Achromatopsia** | Total colour blind  | All cones      | `[0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114]` |

The Achromatopsia matrix converts to grayscale using standard luminance weights.

---

#### `applyMatrix(rgb: [number, number, number], m: Matrix): [number, number, number]`

Applies a 3×3 transformation matrix to an RGB colour.

| Parameter | Type                          | Description                 |
| --------- | ----------------------------- | --------------------------- |
| `rgb`     | `[number, number, number]`    | Input RGB values (0–255)    |
| `m`       | `Matrix`                      | 3×3 transformation matrix   |

**Returns:** Transformed `[r, g, b]` tuple, rounded to integers.

**Implementation:**
```
newR = round(m[0]*r + m[1]*g + m[2]*b)
newG = round(m[3]*r + m[4]*g + m[5]*b)
newB = round(m[6]*r + m[7]*g + m[8]*b)
```

---

### 7.3 WCAG Evaluation

#### `WcagResult` Interface

```typescript
interface WcagResult {
  ratio: number       // Calculated contrast ratio
  aa: boolean         // Passes AA Normal text (>= 4.5:1)
  aaLarge: boolean    // Passes AA Large text (>= 3:1)
  aaa: boolean        // Passes AAA Normal text (>= 7:1)
  aaaLarge: boolean   // Passes AAA Large text (>= 4.5:1)
}
```

**WCAG 2.1 Contrast Thresholds:**

| Level       | Text Size  | Minimum Ratio | Description                              |
| ----------- | ---------- | ------------- | ---------------------------------------- |
| AA Normal   | < 18pt     | 4.5:1         | Standard text                            |
| AA Large    | >= 18pt or >= 14pt bold | 3:1 | Large or bold text              |
| AAA Normal  | < 18pt     | 7:1           | Enhanced contrast for standard text      |
| AAA Large   | >= 18pt or >= 14pt bold | 4.5:1 | Enhanced contrast for large text |

---

#### `evaluateContrast(fgRgb: [n,n,n], bgRgb: [n,n,n]): WcagResult`

Evaluates a foreground/background colour pair against all four WCAG 2.1 thresholds.

| Parameter | Type                       | Description            |
| --------- | -------------------------- | ---------------------- |
| `fgRgb`   | `[number, number, number]` | Foreground colour RGB  |
| `bgRgb`   | `[number, number, number]` | Background colour RGB  |

**Returns:** `WcagResult` object with ratio and four boolean pass/fail results.

---

### 7.4 Auto-Fix Algorithm

#### `rgbToHsl(r: number, g: number, b: number): [number, number, number]`

Converts RGB to HSL (Hue, Saturation, Lightness).

**Returns:** `[h, s, l]` where all values are in the range 0–1.

**Implementation:**
1. Normalize RGB to 0–1 range
2. Find min and max channel values
3. Lightness = (max + min) / 2
4. If max == min: achromatic (h = s = 0)
5. Else: compute saturation and hue based on dominant channel

---

#### `hslToRgb(h: number, s: number, l: number): [number, number, number]`

Converts HSL back to RGB.

| Parameter | Type     | Range | Description |
| --------- | -------- | ----- | ----------- |
| `h`       | `number` | 0–1   | Hue         |
| `s`       | `number` | 0–1   | Saturation  |
| `l`       | `number` | 0–1   | Lightness   |

**Returns:** `[r, g, b]` with values 0–255.

Uses the standard `hue2rgb` helper function for interpolation.

---

#### `autoFix(fgRgb: [n,n,n], bgRgb: [n,n,n]): string`

Automatically adjusts the foreground colour to meet AA Normal contrast (4.5:1) while preserving hue and saturation.

| Parameter | Type                       | Description            |
| --------- | -------------------------- | ---------------------- |
| `fgRgb`   | `[number, number, number]` | Original foreground    |
| `bgRgb`   | `[number, number, number]` | Background colour      |

**Returns:** Hex string of the adjusted foreground colour.

**Algorithm — Binary Search on Lightness:**

```
1. Convert foreground to HSL, preserving H and S
2. Calculate background luminance
3. Determine search range:
   - If background is dark (luminance > 0.5): search lightness [0, 0.5] (darken)
   - If background is light (luminance <= 0.5): search lightness [0.5, 1] (lighten)
4. For 30 iterations:
   a. mid = (low + high) / 2
   b. Convert [H, S, mid] to RGB
   c. Calculate contrast ratio against background
   d. If ratio >= 4.5:
      - Record as valid candidate
      - Move search toward original lightness (narrow range)
   e. Else:
      - Move search away from original lightness (increase contrast)
5. Return hex colour of best candidate
```

**Design decisions:**
- 30 iterations provide precision to approximately 10⁻⁹ in lightness
- Preserving hue and saturation maintains the "character" of the original colour
- Only lightness is adjusted, producing the most natural-looking fix
- The search direction (lighten vs darken) is chosen based on which direction increases contrast against the background

---

### 7.5 UI Sub-Components

#### `Badge({ pass, label })`

Displays a WCAG compliance result badge.

| Prop    | Type      | Description                            |
| ------- | --------- | -------------------------------------- |
| `pass`  | `boolean` | Whether the threshold is met           |
| `label` | `string`  | Display text (e.g. "AA Normal")        |

**Renders:**
- Green badge with checkmark (✓) when `pass` is `true`
- Red badge with cross (✕) when `pass` is `false`
- CSS classes: `badge pass` or `badge fail`

---

#### `ColourInput({ label, value, onChange })`

A dual-input colour selector combining a native colour picker and a text input.

| Prop       | Type                        | Description                    |
| ---------- | --------------------------- | ------------------------------ |
| `label`    | `string`                    | Label text ("Foreground"/"Background") |
| `value`    | `string`                    | Current hex value              |
| `onChange`  | `(value: string) => void`  | Callback when value changes    |

**Features:**
- Native `<input type="color">` (36×36px swatch)
- Text `<input>` for manual hex entry
- Real-time hex validation (applies `invalid` CSS class if malformed)
- Placeholder: `#000000`
- Max length: 7 characters
- Both inputs stay synchronised

---

### 7.6 Main App Component

#### `getInitialTheme(): 'light' | 'dark'`

Determines the initial theme on page load.

**Priority order:**
1. Value stored in `localStorage` key `"theme"`
2. System preference via `window.matchMedia('(prefers-color-scheme: dark)')`
3. Falls back to `'light'`

---

#### State Variables

| State    | Type                  | Default     | Description                     |
| -------- | --------------------- | ----------- | ------------------------------- |
| `fg`     | `string`              | `#1a1a2e`   | Foreground hex colour           |
| `bg`     | `string`              | `#e0e0e0`   | Background hex colour           |
| `copied` | `boolean`             | `false`     | Controls "Copied!" notification |
| `theme`  | `'light' \| 'dark'`   | (computed)  | Current UI theme                |

---

#### Effects

**Theme persistence effect** — runs when `theme` changes:
1. Sets `data-theme` attribute on `document.documentElement`
2. Saves theme to `localStorage`

---

#### Callbacks

| Function           | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `toggleTheme()`    | Toggles between `'light'` and `'dark'` theme                    |
| `handleSwap()`     | Swaps foreground and background colour values                    |
| `handleCopy()`     | Copies formatted results to clipboard, shows "Copied!" for 1.5s |
| `handleApplyFix()` | Sets foreground colour to the auto-fixed value                   |

**Clipboard format (handleCopy):**
```
Contrast Ratio: 12.5:1
Foreground: #1a1a2e
Background: #e0e0e0
AA Normal: Pass
AA Large: Pass
AAA Normal: Pass
AAA Large: Pass
```

---

#### Memoised Computations

| Variable      | Dependencies   | Description                                              |
| ------------- | -------------- | -------------------------------------------------------- |
| `fgRgb`       | `fg`           | Parsed foreground RGB tuple (or null)                    |
| `bgRgb`       | `bg`           | Parsed background RGB tuple (or null)                    |
| `result`      | `fgRgb, bgRgb` | Full WCAG evaluation result (or null)                   |
| `fixedFg`     | `fgRgb, bgRgb, result` | Auto-fixed hex colour (only if AA fails)         |
| `simulations` | `fgRgb, bgRgb` | Array of 4 colour blindness simulation results          |

**Simulation result shape:**
```typescript
{
  type: string                        // e.g. "Protanopia"
  fgSim: [number, number, number]     // Simulated foreground RGB
  bgSim: [number, number, number]     // Simulated background RGB
  ratio: number                       // Contrast ratio under simulation
}
```

---

#### Rendered UI Sections

**1. Header**
- Title: "Contrast Check"
- Theme toggle button (moon icon for dark, sun icon for light)
- Subtitle: "Test colour pairs against WCAG 2.1 standards"

**2. Input Section**
- Two `ColourInput` components (Foreground and Background)
- Swap button between them (vertical arrow icon)
- Responsive: side-by-side on desktop, stacked on mobile

**3. Preview Card**
- Live preview panel with the selected colours applied
- Three text samples at different sizes:
  - Normal text (1rem / 16px)
  - Large text (1.5rem / 24px)
  - Small text (0.875rem / 14px, 85% opacity)

**4. Results Section**
- "CONTRAST RATIO" label badge
- Large ratio number (3.5rem, monospace font)
- Colour-coded by compliance level:
  - Green (`#22c55e`): ratio >= 7:1 (AAA)
  - Yellow (`#eab308`): ratio >= 4.5:1 (AA)
  - Orange (`#f97316`): ratio >= 3:1 (AA Large only)
  - Red (`#ef4444`): ratio < 3:1 (Fail)
- Visual ratio bar:
  - 14px height gradient bar
  - Fill width proportional to ratio (capped at 21:1)
  - Threshold markers at 3:1, 4.5:1, and 7:1
- Four WCAG badges in a 2×2 grid (AA Normal, AA Large, AAA Normal, AAA Large)
- "Copy Results" button
- Conditional "Auto-Fix to #XXXXXX" button (only appears when AA Normal fails)

**5. Colour Blindness Simulation Section**
- Heading: "Colour-Blind Simulation"
- 2×2 grid of simulation cards (1-column on mobile)
- Each card displays:
  - Preview rectangle with simulated fg/bg colours
  - Type name (e.g. "Protanopia")
  - Contrast ratio for the simulated colour pair

**6. Footer**
- "Built with React" credit
- "WCAG 2.1 compliant calculations" notice
- GitHub repository link

---

## 8. Styles — `index.css`

### CSS Custom Properties (Design Tokens)

#### Light Theme (`:root` / `[data-theme="light"]`)

| Variable             | Value                           | Purpose                      |
| -------------------- | ------------------------------- | ---------------------------- |
| `--bg`               | `#f8f9fa`                       | Page background              |
| `--surface`          | `#ffffff`                       | Card/panel background        |
| `--text`             | `#1a1a2e`                       | Primary text colour          |
| `--text-secondary`   | `#6b7280`                       | Muted/secondary text         |
| `--border`           | `#e5e7eb`                       | Border colour                |
| `--accent`           | `#6366f1`                       | Primary accent (indigo)      |
| `--accent-hover`     | `#4f46e5`                       | Accent hover state           |
| `--pass`             | `#10b981`                       | Pass indicator (green)       |
| `--pass-bg`          | `#ecfdf5`                       | Pass badge background        |
| `--fail`             | `#ef4444`                       | Fail indicator (red)         |
| `--fail-bg`          | `#fef2f2`                       | Fail badge background        |
| `--bar-accent`       | `#e8b931`                       | Ratio bar fill colour        |
| `--bar-track`        | `#d1d5db`                       | Ratio bar track colour       |
| `--radius`           | `12px`                          | Default border radius        |
| `--shadow`           | `0 1px 3px rgba(0,0,0,0.06)`   | Light elevation shadow       |
| `--shadow-lg`        | `0 4px 12px rgba(0,0,0,0.08)`  | Heavy elevation shadow       |
| `--sans`             | `'Inter', system-ui, sans-serif`| Sans-serif font stack        |
| `--mono`             | `'JetBrains Mono', monospace`   | Monospace font stack         |

#### Dark Theme (`[data-theme="dark"]`)

| Variable             | Value                            | Change from light            |
| -------------------- | -------------------------------- | ---------------------------- |
| `--bg`               | `#0f1117`                        | Nearly black background      |
| `--surface`          | `#1a1b26`                        | Dark grey surface            |
| `--text`             | `#e5e7eb`                        | Light grey text              |
| `--text-secondary`   | `#9ca3af`                        | Medium grey secondary        |
| `--border`           | `#2d2f3a`                        | Darker border                |
| `--shadow`           | `0 1px 3px rgba(0,0,0,0.3)`     | Stronger shadow              |
| `--shadow-lg`        | `0 4px 12px rgba(0,0,0,0.4)`    | Stronger heavy shadow        |

### Global Reset

```css
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; padding: 0; font-smoothing: antialiased; min-height: 100vh; }
```

---

## 9. Styles — `App.css`

### Layout System

| Class        | Styles                                             |
| ------------ | -------------------------------------------------- |
| `.app`       | `max-width: 720px`, centered, flex column, min-height 100vh |
| `.main`      | `flex: 1` (pushes footer to bottom)                |

### Component Styles

#### Header (`.header`)
- Centered text, 40px bottom margin
- `h1`: 2.25rem, font-weight 700
- Theme toggle: absolute position, top-right corner
- Subtitle: secondary colour

#### Colour Inputs (`.colour-input-group`)
- Flex row layout (column on mobile)
- `.colour-picker`: 36×36px native input
- `.colour-text`: full-width, monospace, no border by default
- `.colour-input-row`: border container, active highlight on focus
- Swap button: 44×44px, rotates 90° on mobile

#### Preview Card (`.preview-card`)
- 32px padding, smooth colour transitions
- Three text sizes: normal (1rem), large (1.5rem), small (0.875rem at 85% opacity)

#### Results (`.results-section`)
- Surface background, centered content
- Ratio badge: uppercase label, accent background, 0.7rem
- Ratio number: 3.5rem, monospace, dynamically coloured
- Ratio bar: 14px height with threshold markers at positions 14.3% (3:1), 21.4% (4.5:1), 33.3% (7:1)

#### WCAG Badges (`.wcag-grid`)
- 2×2 grid on desktop, 1-column on mobile
- `.badge.pass`: green background (`--pass-bg`), green text (`--pass`)
- `.badge.fail`: red background (`--fail-bg`), red text (`--fail`)

#### Action Buttons (`.btn`)
- `.btn-secondary`: surface bg, border, text colour
- `.btn-primary`: accent bg, white text, darker accent on hover
- 0.2s transition on all properties

#### Simulations (`.simulation-section`)
- `.simulation-grid`: 2×2 grid (1-column on mobile)
- `.simulation-card`: bordered, with preview area and info text
- Preview: 16px padding, centered sample text

#### Footer (`.footer`)
- `margin-top: auto` (sticky to bottom)
- 0.825rem text, secondary colour
- Links: accent colour, underline on hover

### Responsive Breakpoint

**`@media (max-width: 600px)`**

| Element          | Change                              |
| ---------------- | ----------------------------------- |
| `.app`           | Padding: 24px 16px                  |
| `h1`             | Font-size: 1.75rem                  |
| Input section    | Flex-direction: column              |
| Swap button      | Rotate 90°, align-self: center      |
| WCAG grid        | Single column                       |
| Simulation grid  | Single column                       |
| Ratio number     | Font-size: 2.25rem                  |

---

## 10. Application Flow (End-to-End)

### 1. Initialisation

```
Page Load
  → main.tsx mounts <App /> in React StrictMode
  → getInitialTheme() reads localStorage or system preference
  → Default colours set: fg=#1a1a2e, bg=#e0e0e0
  → useEffect sets data-theme on <html> element
  → All memoised values compute initial results
```

### 2. User Enters Colours

```
User types hex or uses colour picker
  → ColourInput calls onChange with new value
  → State updates (fg or bg)
  → hexToRgb() parses new value
  → If valid: all dependent memos recompute
  → If invalid: result is null, UI shows no results
```

### 3. Contrast Calculation Pipeline

```
fgRgb, bgRgb (valid)
  → linearize() each channel (sRGB → linear)
  → relativeLuminance() for each colour
  → contrastRatio() computes ratio
  → Compare against 4 thresholds
  → Return WcagResult { ratio, aa, aaLarge, aaa, aaaLarge }
```

### 4. Results Display

```
WcagResult received
  → Large ratio number rendered with dynamic colour
  → Ratio bar fills proportionally (ratio/21 * 100%)
  → 4 Badge components render pass/fail
  → If !aa: autoFix() computes suggestion, button appears
```

### 5. Colour Blindness Simulation

```
For each type in CB_MATRICES:
  → applyMatrix(fgRgb, matrix) → simulated foreground
  → applyMatrix(bgRgb, matrix) → simulated background
  → evaluateContrast(simFg, simBg) → simulated ratio
  → Render preview card with simulated colours
```

### 6. User Actions

| Action         | Flow                                                         |
| -------------- | ------------------------------------------------------------ |
| **Swap**       | `fg ↔ bg` state swap → all memos recompute                  |
| **Copy**       | Format results as text → `navigator.clipboard.writeText()`   |
| **Auto-Fix**   | Set `fg` to fixed hex → triggers full recomputation          |
| **Theme**      | Toggle state → useEffect updates DOM + localStorage          |

---

## 11. Key Algorithms

### WCAG 2.1 Contrast Ratio Calculation

This is the core algorithm, implemented exactly per the W3C specification:

```
Step 1: sRGB Linearisation
   For each channel c (0–255):
     s = c / 255
     linear = s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ^ 2.4

Step 2: Relative Luminance
   L = 0.2126 * linear_R + 0.7152 * linear_G + 0.0722 * linear_B

Step 3: Contrast Ratio
   ratio = (max(L1, L2) + 0.05) / (min(L1, L2) + 0.05)

Step 4: Threshold Comparison
   AA Normal:  ratio >= 4.5
   AA Large:   ratio >= 3.0
   AAA Normal: ratio >= 7.0
   AAA Large:  ratio >= 4.5
```

### Auto-Fix Binary Search

```
Input:  fgRgb, bgRgb
Output: hex colour meeting AA Normal (4.5:1)

1. [h, s, l] = rgbToHsl(fgRgb)
2. bgLum = relativeLuminance(bgRgb)
3. If bgLum > 0.5:  range = [0, 0.5]     // darken fg
   Else:             range = [0.5, 1.0]   // lighten fg
4. For i = 0..29:
     mid = (low + high) / 2
     testRgb = hslToRgb(h, s, mid)
     testRatio = contrastRatio(relativeLuminance(testRgb), bgLum)
     If testRatio >= 4.5:
       best = mid
       Move toward original lightness  // narrow the range
     Else:
       Move away from original lightness  // increase contrast
5. Return rgbToHex(hslToRgb(h, s, best))
```

**Precision:** 30 iterations of binary search yield lightness precision of approximately `0.5 / 2^30 ≈ 4.66 × 10⁻¹⁰`.

### Colour Blindness Matrix Transformation

```
Input:  rgb[3], matrix[9]
Output: transformed rgb[3]

R' = round(m[0]*R + m[1]*G + m[2]*B)
G' = round(m[3]*R + m[4]*G + m[5]*B)
B' = round(m[6]*R + m[7]*G + m[8]*B)
```

---

## 12. Accessibility Features

| Feature                    | Implementation                                           |
| -------------------------- | -------------------------------------------------------- |
| Theme toggle               | `aria-label` describing current action                   |
| Swap button                | `title` attribute for tooltip                            |
| Input labels               | `<label>` elements properly associated with inputs       |
| Semantic HTML              | Proper heading hierarchy, `<header>`, `<footer>`         |
| Keyboard navigation        | All interactive elements are focusable and operable      |
| Colour independence        | Pass/fail indicated by both colour AND icon (✓/✕)        |
| Responsive design          | Fully usable on mobile devices (600px breakpoint)        |
| System theme respect       | Reads `prefers-color-scheme` on first visit              |

---

## 13. NPM Scripts

| Script            | Command                         | Description                                     |
| ----------------- | ------------------------------- | ----------------------------------------------- |
| `npm run dev`     | `vite`                          | Start development server with HMR               |
| `npm run build`   | `tsc -b && vite build`          | Type-check then produce production build         |
| `npm run lint`    | `eslint .`                      | Run ESLint on all files                          |
| `npm run preview` | `vite preview`                  | Serve production build locally for testing       |

---

*Documentation generated for Check-Contrast repository.*
