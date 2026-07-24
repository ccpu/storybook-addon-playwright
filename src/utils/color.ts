import tinycolor from 'tinycolor2';

// Truncate (not round) to match MUI's `lighten`/`darken`, which recompose the
// color via `parseInt` on the channel values.
const clampChannel = (value: number) => Math.min(255, Math.max(0, Math.trunc(value)));

/**
 * Lightens a color by mixing each RGB channel towards white by `coefficient`
 * (0–1). Mirrors the behaviour of `@mui/material/styles`' `lighten`.
 */
export function lighten(color: string, coefficient: number): string {
  const { r, g, b, a } = tinycolor(color).toRgb();
  return tinycolor({
    r: clampChannel(r + (255 - r) * coefficient),
    g: clampChannel(g + (255 - g) * coefficient),
    b: clampChannel(b + (255 - b) * coefficient),
    a,
  }).toRgbString();
}

/**
 * Darkens a color by multiplying each RGB channel by `(1 - coefficient)`
 * (0–1). Mirrors the behaviour of `@mui/material/styles`' `darken`.
 */
export function darken(color: string, coefficient: number): string {
  const { r, g, b, a } = tinycolor(color).toRgb();
  return tinycolor({
    r: clampChannel(r * (1 - coefficient)),
    g: clampChannel(g * (1 - coefficient)),
    b: clampChannel(b * (1 - coefficient)),
    a,
  }).toRgbString();
}

/**
 * Returns a text color (dark or white) that contrasts with `background`,
 * mirroring `Palette.getContrastText` from `@mui/material`.
 */
export function getContrastText(background: string): string {
  return tinycolor(background).isLight() ? 'rgba(0, 0, 0, 0.87)' : '#fff';
}
