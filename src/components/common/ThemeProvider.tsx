import React, { memo } from 'react';

import { ThemeProvider as MuThemeProvider } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import { useStorybookState } from '@storybook/api';
import { useCustomTheme } from '../../hooks/use-custom-theme';
import { ThemeProvider as StThemeProvider } from '@storybook/theming';

const ThemeProvider: React.FC = memo((props) => {
  const { children } = props;

  const { theme: storyBookTheme } = useStorybookState();
  const { theme: customTheme } = useCustomTheme();

  const theme = createTheme(
    {
      components: {
        MuiPaper: {
          styleOverrides: { root: { backgroundImage: 'unset' } },
        },
      },
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
        /**
         * following all required to prevent storybook components error
         */
        size: {},
        weight: {},
      },
    } as unknown,
    customTheme,
  );

  return (
    <StThemeProvider theme={theme}>
      <MuThemeProvider theme={theme}>{children}</MuThemeProvider>
    </StThemeProvider>
  );
});

ThemeProvider.displayName = 'ThemeProvider';

export { ThemeProvider };
