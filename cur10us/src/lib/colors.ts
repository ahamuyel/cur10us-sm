/** Convert hex (#RRGGBB) to HSL {h,s,l} */
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

/** Convert HSL to hex */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * Math.max(0, Math.min(1, color)))
      .toString(16)
      .padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

/** Darken a hex color by amount (0-100) */
export function darken(hex: string, amount: number): string {
  const { h, s, l } = hexToHSL(hex)
  return hslToHex(h, s, Math.max(0, l - amount))
}

/** Lighten a hex color by amount (0-100) */
export function lighten(hex: string, amount: number): string {
  const { h, s, l } = hexToHSL(hex)
  return hslToHex(h, s, Math.min(100, l + amount))
}

/**
 * Generate a palette of 11 shades (50-950) from a base hex color.
 * The base maps to ~500.
 */
export function generatePalette(hex: string): Record<string, string> {
  const { h, s } = hexToHSL(hex)

  // Target lightness for each shade
  const shades: [string, number][] = [
    ["50", 97],
    ["100", 94],
    ["200", 86],
    ["300", 76],
    ["400", 64],
    ["500", 50],
    ["600", 42],
    ["700", 34],
    ["800", 26],
    ["900", 18],
    ["950", 12],
  ]

  const palette: Record<string, string> = {}
  for (const [shade, l] of shades) {
    // Reduce saturation slightly for very light/dark ends
    const adjS = shade === "50" || shade === "100" ? Math.min(s, 80) : s
    palette[shade] = hslToHex(h, adjS, l)
  }

  return palette
}
