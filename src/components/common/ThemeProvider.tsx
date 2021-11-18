import React, { memo } from 'react';
import {
  createTheme,
  ThemeProvider as MuThemeProvider,
} from '@material-ui/core/styles';
import { useStorybookState } from '@storybook/api';
import { useCustomTheme } from '../../hooks/use-custom-theme';
// import global from 'jss-plugin-global';

const ThemeProvider: React.FC = memo((props) => {
  const { children } = props;

  const { theme: storyBookTheme } = useStorybookState();
  const { theme: customTheme } = useCustomTheme();
  const theme = createTheme({
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
      type: storyBookTheme.base === 'dark' ? 'dark' : 'light',
    },
    typography: {
      fontFamily: storyBookTheme.fontBase,
    },
  }, customTheme);

  return <MuThemeProvider theme={theme}>{children}</MuThemeProvider>;
});

ThemeProvider.displayName = 'ThemeProvider';

export { ThemeProvider };
