import deepmerge from 'deepmerge';
import { darken, getContrastText, lighten } from '../../utils/color';

export type PaletteMode = 'light' | 'dark';

export interface PaletteColor {
  main: string;
  light: string;
  dark: string;
  contrastText: string;
}

export interface TypeText {
  primary: string;
  secondary: string;
  disabled: string;
}

export interface TypeBackground {
  default: string;
  paper: string;
}

export interface TypeAction {
  active: string;
  hover: string;
  selected: string;
  disabled: string;
  disabledOpacity: number;
  focus: string;
}

export interface Palette {
  mode: PaletteMode;
  primary: PaletteColor;
  secondary: PaletteColor;
  error: PaletteColor;
  warning: PaletteColor;
  info: PaletteColor;
  success: PaletteColor;
  grey: Record<number, string>;
  text: TypeText;
  background: TypeBackground;
  divider: string;
  action: TypeAction;
  getContrastText: (background: string) => string;
}

export interface Shape {
  borderRadius: number;
}

export interface Typography {
  fontFamily: string;
  fontSize: number;
  fontWeightLight: number;
  fontWeightRegular: number;
  fontWeightMedium: number;
  fontWeightBold: number;
}

export interface Theme {
  palette: Palette;
  shape: Shape;
  shadows: string[];
  typography: Typography;
  spacing: (factor?: number) => number;
}

type DeepPartial<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export type ThemeOptions = DeepPartial<Theme>;

// The 25 elevation shadows used by MUI (index 0 = 'none').
const SHADOWS: string[] = [
  'none',
  '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
  '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
  '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
  '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
  '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
  '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
  '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
  '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
  '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
  '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
  '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
  '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
  '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
  '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
  '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
  '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
  '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
  '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
  '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
];

const createDefaultTheme = (): Theme => ({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2', light: '', dark: '', contrastText: '' },
    secondary: { main: '#9c27b0', light: '', dark: '', contrastText: '' },
    error: { main: '#d32f2f', light: '', dark: '', contrastText: '' },
    warning: { main: '#ed6c02', light: '', dark: '', contrastText: '' },
    info: { main: '#0288d1', light: '', dark: '', contrastText: '' },
    success: { main: '#2e7d32', light: '', dark: '', contrastText: '' },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    background: { default: '#fff', paper: '#fff' },
    divider: 'rgba(0, 0, 0, 0.12)',
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledOpacity: 0.38,
      focus: 'rgba(0, 0, 0, 0.12)',
    },
    getContrastText,
  },
  shape: { borderRadius: 4 },
  shadows: SHADOWS,
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  spacing: (factor = 1) => 8 * factor,
});

const overwriteArrays = <T>(_destination: T, source: T): T => source;

const PALETTE_COLOR_KEYS = [
  'primary',
  'secondary',
  'error',
  'warning',
  'info',
  'success',
] as const;

// Fills in `light`/`dark`/`contrastText` from `main` when not explicitly set,
// mirroring MUI's `augmentColor`.
const augmentColor = (color: PaletteColor): PaletteColor => ({
  main: color.main,
  light: color.light || lighten(color.main, 0.2),
  dark: color.dark || darken(color.main, 0.3),
  contrastText: color.contrastText || getContrastText(color.main),
});

/**
 * Builds a theme object with the same shape used across the addon (a subset of
 * MUI's theme), replacing `@mui/material/styles`' `createTheme`. Accepts one or
 * more partial theme options that are deep-merged over the defaults.
 */
export function createTheme(...options: ThemeOptions[]): Theme {
  const merged = options.reduce<Theme>(
    (acc, option) =>
      deepmerge(acc, (option ?? {}) as Partial<Theme>, {
        arrayMerge: overwriteArrays,
        // Preserve the `getContrastText` function reference during merge.
        isMergeableObject: (value) =>
          Boolean(value) && typeof value === 'object' && !Array.isArray(value),
      }) as Theme,
    createDefaultTheme(),
  );

  for (const key of PALETTE_COLOR_KEYS) {
    merged.palette[key] = augmentColor(merged.palette[key]);
  }

  // Functions do not survive serialization (e.g. via tRPC) or deep-merge, so
  // always (re)attach the derived helpers.
  merged.palette.getContrastText = getContrastText;
  if (typeof merged.spacing !== 'function') {
    merged.spacing = (factor = 1) => 8 * factor;
  }

  return merged;
}
