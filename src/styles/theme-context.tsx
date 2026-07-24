import type { Theme } from '../features/theme/create-theme';
import React from 'react';
import { createTheme } from '../features/theme/create-theme';

/**
 * Holds the addon's (MUI-shaped) {@link Theme}. This is intentionally a
 * dedicated context rather than `@storybook/theming`'s emotion theme: Storybook's
 * own components (`Button`, `IconButton`, `WithTooltip`, ...) read the emotion
 * theme and expect Storybook's shape (e.g. `typography.size.s1`), so overriding
 * it with our theme would crash them.
 */
const ThemeContext = React.createContext<Theme>(createTheme());

export interface AddonThemeProviderProps {
  theme: Theme;
  children?: React.ReactNode;
}

const AddonThemeProvider: React.FC<AddonThemeProviderProps> = ({ theme, children }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

AddonThemeProvider.displayName = 'AddonThemeProvider';

/** Reads the addon theme provided by {@link AddonThemeProvider}. */
export function useTheme(): Theme {
  return React.useContext(ThemeContext);
}

export { AddonThemeProvider };
