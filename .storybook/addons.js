import '../register';
import '@storybook/addon-knobs/register';
import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';
import { addParameters } from '@storybook/react';

addParameters({
  darkMode: {
    // Override the default dark theme
    dark: { ...themes.dark, appBg: 'black' },
    // Override the default light theme
    light: { ...themes.normal, appBg: 'white' },
  },
});
