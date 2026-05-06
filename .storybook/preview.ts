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
