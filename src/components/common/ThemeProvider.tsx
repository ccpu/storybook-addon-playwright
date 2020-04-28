import React, { SFC, memo } from 'react';
import {
  createMuiTheme,
  ThemeProvider as MuThemeProvider,
} from '@material-ui/core/styles';
import { useStorybookState } from '@storybook/api';

const ThemeProvider: SFC = memo((props) => {
  const { children } = props;

  const { theme: storyBookTheme } = useStorybookState();

  const theme = createMuiTheme({
    palette: {
      background: {
        default: storyBookTheme.appBg,
        paper: storyBookTheme.appContentBg,
      },
      divider: storyBookTheme.appBorderColor,
      primary: { main: storyBookTheme.colorSecondary },
      secondary: { main: storyBookTheme.colorPrimary },
      text: { primary: storyBookTheme.textColor },
      type: storyBookTheme.base === 'dark' ? 'dark' : 'light',
    },
    typography: {
      fontFamily: storyBookTheme.fontBase,
    },
  });

  return <MuThemeProvider theme={theme}>{children}</MuThemeProvider>;
});

ThemeProvider.displayName = 'ThemeProvider';

export { ThemeProvider };
