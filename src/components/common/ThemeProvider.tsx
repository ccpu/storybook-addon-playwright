import { createTheme, ThemeProvider as MuThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StylesThemeProvider } from '@mui/styles';
import { useStorybookState } from '@storybook/manager-api';
import React, { memo } from 'react';
import { useCustomTheme } from '../../features/theme/hooks/use-custom-theme';
// import global from 'jss-plugin-global';

const ThemeProvider: React.FC = memo((props) => {
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
        primary: { main: storyBookTheme.colorSecondary },
        secondary: { main: storyBookTheme.colorPrimary },
        text: { primary: storyBookTheme.barTextColor },
        mode: storyBookTheme.base === 'dark' ? 'dark' : 'light',
      },
      typography: {
        fontFamily: storyBookTheme.fontBase,
      },
    },
    customTheme || {},
  );

  return (
    <StylesThemeProvider theme={theme}>
      <MuThemeProvider theme={theme}>{children}</MuThemeProvider>
    </StylesThemeProvider>
  );
});

ThemeProvider.displayName = 'ThemeProvider';

export { ThemeProvider };
