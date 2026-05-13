import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react';

export const parameters = {
  darkMode: {
    // Override the default dark theme
    dark: {},
    // Override the default light theme
    light: {},
  },
};

export const globalTypes = {
  theme: {
    defaultValue: 'light',
    description: 'Theme used by the conditional controls story',
    toolbar: {
      items: ['light', 'dark'],
      title: 'Theme',
    },
  },
};

const preview: Preview = {
  globalTypes: {
    locale: {
      description: 'Internationalization locale',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', right: '🇺🇸', title: 'English' },
          { value: 'fr', right: '🇫🇷', title: 'Français' },
          { value: 'es', right: '🇪🇸', title: 'Español' },
          { value: 'zh', right: '🇨🇳', title: '中文' },
          { value: 'kr', right: '🇰🇷', title: '한국어' },
        ],
      },
    },
  },
  initialGlobals: {
    locale: 'en',
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'dark',
    }),
  ],
};

export default preview;
