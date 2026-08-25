import { useStorybookState } from 'storybook/manager-api';
import React, { memo } from 'react';
import { createTheme } from '../../features/theme/create-theme';
import { useCustomTheme } from '../../features/theme/hooks/use-custom-theme';
import { AddonThemeProvider } from '../../styles';

const ThemeProvider: React.FC<React.PropsWithChildren> = memo((props) => {
  const { children } = props;

  const { theme: storyBookTheme } = useStorybookState();
  const { theme: customTheme } = useCustomTheme();

  const theme = createTheme(
    {
      palette: {
        action: { active: storyBookTheme.barTextColor },
        background: {
          default: storyBookTheme.appBg,
          paper: storyBookTheme.appContentBg,
        },
        divider: storyBookTheme.appBorderColor,
        mode: storyBookTheme.base === 'dark' ? 'dark' : 'light',
        primary: { main: storyBookTheme.colorSecondary },
        secondary: { main: storyBookTheme.colorPrimary },
        text: { primary: storyBookTheme.barTextColor },
      },
      typography: {
        fontFamily: storyBookTheme.fontBase,
      },
    },
    customTheme || {},
  );

  // Provide the addon's (MUI-shaped) theme through its own context. We must NOT
  // override `storybook/theming`'s emotion theme here: Storybook's own
  // components rendered inside this provider read that theme and expect its
  // shape (e.g. `typography.size.s1`), so clobbering it would crash them.
  return <AddonThemeProvider theme={theme}>{children}</AddonThemeProvider>;
});

ThemeProvider.displayName = 'ThemeProvider';

export { ThemeProvider };
