import { useState, useMemo, useCallback, useEffect } from 'react'
import './App.css'

// ── Colour utilities ──────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{6})$/i)
  if (!m) return null
  const v = parseInt(m[1], 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0'))
      .join('')
  )
}

function linearize(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// ── Colour blindness simulation matrices ──────────────────────────

type Matrix = [number, number, number, number, number, number, number, number, number]

const CB_MATRICES: Record<string, Matrix> = {
  Protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  Deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  Tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
  Achromatopsia: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114],
}

function applyMatrix(rgb: [number, number, number], m: Matrix): [number, number, number] {
  return [
    Math.round(m[0] * rgb[0] + m[1] * rgb[1] + m[2] * rgb[2]),
    Math.round(m[3] * rgb[0] + m[4] * rgb[1] + m[5] * rgb[2]),
    Math.round(m[6] * rgb[0] + m[7] * rgb[1] + m[8] * rgb[2]),
  ]
}

// ── WCAG thresholds ───────────────────────────────────────────────

interface WcagResult {
  ratio: number
  aa: boolean
  aaLarge: boolean
  aaa: boolean
  aaaLarge: boolean
}

function evaluateContrast(fgRgb: [number, number, number], bgRgb: [number, number, number]): WcagResult {
  const l1 = relativeLuminance(...fgRgb)
  const l2 = relativeLuminance(...bgRgb)
  const ratio = contrastRatio(l1, l2)
  return {
    ratio,
    aa: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaa: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  }
}

// ── Auto-fix: adjust foreground to meet AA Normal (4.5:1) ─────────

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h, s, l]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255)
    return [v, v, v]
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ]
}

function autoFix(fgRgb: [number, number, number], bgRgb: [number, number, number]): string {
  const bgLum = relativeLuminance(...bgRgb)
  const [h, s] = rgbToHsl(...fgRgb)
  const isDark = bgLum > 0.5

  let lo = isDark ? 0 : 0.5
  let hi = isDark ? 0.5 : 1

  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2
    const candidate = hslToRgb(h, s, mid)
    const lum = relativeLuminance(...candidate)
    const ratio = contrastRatio(lum, bgLum)
    if (ratio >= 4.5) {
      if (isDark) lo = mid
      else hi = mid
    } else {
      if (isDark) hi = mid
      else lo = mid
    }
  }

  const finalL = isDark ? lo : hi
  const result = hslToRgb(h, s, finalL)
  return rgbToHex(...result)
}

// ── Badge component ───────────────────────────────────────────────

function Badge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <span className={`badge ${pass ? 'pass' : 'fail'}`}>
      <span className="badge-icon">{pass ? '\u2713' : '\u2717'}</span>
      {label}
    </span>
  )
}

// ── Colour input component ────────────────────────────────────────

function ColourInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const isValid = hexToRgb(value) !== null

  return (
    <div className="colour-input-group">
      <label className="colour-label">{label}</label>
      <div className="colour-input-row">
        <input
          type="color"
          value={isValid ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="colour-picker"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          maxLength={7}
          className={`colour-text ${isValid ? '' : 'invalid'}`}
          spellCheck={false}
        />
      </div>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────

function getInitialTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [fg, setFg] = useState('#1a1a2e')
  const [bg, setBg] = useState('#e0e0e0')
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }, [])

  const fgRgb = useMemo(() => hexToRgb(fg), [fg])
  const bgRgb = useMemo(() => hexToRgb(bg), [bg])

  const result = useMemo(() => {
    if (!fgRgb || !bgRgb) return null
    return evaluateContrast(fgRgb, bgRgb)
  }, [fgRgb, bgRgb])

  const fixedFg = useMemo(() => {
    if (!fgRgb || !bgRgb || !result) return null
    if (result.aa) return null
    return autoFix(fgRgb, bgRgb)
  }, [fgRgb, bgRgb, result])

  const simulations = useMemo(() => {
    if (!fgRgb || !bgRgb) return []
    return Object.entries(CB_MATRICES).map(([name, matrix]) => {
      const simFg = applyMatrix(fgRgb, matrix)
      const simBg = applyMatrix(bgRgb, matrix)
      const simResult = evaluateContrast(simFg, simBg)
      return { name, fgHex: rgbToHex(...simFg), bgHex: rgbToHex(...simBg), ratio: simResult.ratio }
    })
  }, [fgRgb, bgRgb])

  const handleSwap = useCallback(() => {
    setFg(bg)
    setBg(fg)
  }, [fg, bg])

  const handleCopy = useCallback(() => {
    if (!result) return
    const text = [
      `Contrast Check Results`,
      `Foreground: ${fg}`,
      `Background: ${bg}`,
      `Ratio: ${result.ratio.toFixed(2)}:1`,
      `AA Normal: ${result.aa ? 'Pass' : 'Fail'}`,
      `AA Large: ${result.aaLarge ? 'Pass' : 'Fail'}`,
      `AAA Normal: ${result.aaa ? 'Pass' : 'Fail'}`,
      `AAA Large: ${result.aaaLarge ? 'Pass' : 'Fail'}`,
    ].join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [fg, bg, result])

  const handleApplyFix = useCallback(() => {
    if (fixedFg) setFg(fixedFg)
  }, [fixedFg])

  const ratioDisplay = result ? result.ratio.toFixed(2) : '—'

  return (
    <div className="app">
      <header className="header">
        <div className="header-row">
          <h1>Contrast Check</h1>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
        </div>
        <p className="subtitle">
          Test colour pairs against WCAG 2.1 standards
        </p>
      </header>

      <main className="main">
        {/* Colour Inputs */}
        <section className="input-section">
          <ColourInput label="Foreground" value={fg} onChange={setFg} />
          <button className="swap-btn" onClick={handleSwap} title="Swap colours">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
          <ColourInput label="Background" value={bg} onChange={setBg} />
        </section>

        {/* Live Preview */}
        <section className="preview-section">
          <div className="preview-card" style={{ backgroundColor: bg, color: fg }}>
            <p className="preview-normal">
              The quick brown fox jumps over the lazy dog.
            </p>
            <p className="preview-large">
              Large Text Preview
            </p>
            <p className="preview-small">
              Small body text for detailed content — 16px equivalent.
            </p>
          </div>
        </section>

        {/* Ratio & WCAG Results */}
        <section className="results-section">
          <span className="ratio-badge">CONTRAST RATIO</span>
          <div className="ratio-display">
            <span className="ratio-number">{ratioDisplay}</span>
            <span className="ratio-label">: 1</span>
          </div>

          {/* Contrast ratio bar */}
          <div className="ratio-bar-container">
            <div
              className="ratio-bar-fill"
              style={{ width: `${Math.min((result ? result.ratio : 1) / 21 * 100, 100)}%` }}
            />
            {/* Threshold markers */}
            <div className="ratio-bar-marker" style={{ left: `${(3 / 21) * 100}%` }} title="AA Large: 3:1" />
            <div className="ratio-bar-marker" style={{ left: `${(4.5 / 21) * 100}%` }} title="AA: 4.5:1" />
            <div className="ratio-bar-marker" style={{ left: `${(7 / 21) * 100}%` }} title="AAA: 7:1" />
          </div>

          {result && (
            <div className="wcag-grid">
              <Badge pass={result.aa} label="AA Normal (4.5:1)" />
              <Badge pass={result.aaLarge} label="AA Large (3:1)" />
              <Badge pass={result.aaa} label="AAA Normal (7:1)" />
              <Badge pass={result.aaaLarge} label="AAA Large (4.5:1)" />
            </div>
          )}

          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy Results'}
            </button>
            {fixedFg && (
              <button className="btn btn-primary" onClick={handleApplyFix}>
                Auto-Fix to {fixedFg}
              </button>
            )}
          </div>
        </section>

        {/* Colour Blindness Simulation */}
        {simulations.length > 0 && (
          <section className="simulation-section">
            <h2>Colour Blindness Simulation</h2>
            <div className="simulation-grid">
              {simulations.map((sim) => (
                <div key={sim.name} className="simulation-card">
                  <div
                    className="simulation-preview"
                    style={{ backgroundColor: sim.bgHex, color: sim.fgHex }}
                  >
                    Sample Text
                  </div>
                  <div className="simulation-info">
                    <span className="simulation-name">{sim.name}</span>
                    <span className="simulation-ratio">{sim.ratio.toFixed(2)}:1</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>
          Built with React &middot; WCAG 2.1 compliant calculations &middot;{' '}
          <a
            href="https://github.com/kurokuroki1/Contrast-Check"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
