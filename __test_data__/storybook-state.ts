const dark = {
  appBg: '#2f2f2f',
  appBorderColor: 'rgba(255,255,255,.1)',
  appBorderRadius: 4,
  appContentBg: '#333',
  barBg: '#333333',
  barSelectedColor: '#1EA7FD',
  barTextColor: '#999999',
  base: 'dark',
  colorPrimary: '#FF4785',
  colorSecondary: '#1EA7FD',
  fontBase:
    '"Nunito Sans", -apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontCode:
    '"Operator Mono", "Fira Code Retina", "Fira Code", "FiraCode-Retina", "Andale Mono", "Lucida Console", Consolas, Monaco, monospace',
  inputBg: '#3f3f3f',
  inputBorder: 'rgba(0,0,0,.3)',
  inputBorderRadius: 4,
  inputTextColor: '#FFFFFF',
  textColor: '#FFFFFF',
  textInverseColor: '#333333',
};

const light = {
  appBg: '#F6F9FC',
  appBorderColor: 'rgba(0,0,0,.1)',
  appBorderRadius: 4,
  appContentBg: '#FFFFFF',
  barBg: '#FFFFFF',
  barSelectedColor: '#1EA7FD',
  barTextColor: '#999999',
  base: 'light',
  colorPrimary: '#FF4785',
  colorSecondary: '#1EA7FD',
  fontBase:
    '"Nunito Sans", -apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontCode:
    '"Operator Mono", "Fira Code Retina", "Fira Code", "FiraCode-Retina", "Andale Mono", "Lucida Console", Consolas, Monaco, monospace',
  inputBg: '#FFFFFF',
  inputBorder: 'rgba(0,0,0,.1)',
  inputBorderRadius: 4,
  inputTextColor: '#333333',
  textColor: '#333333',
  textInverseColor: '#FFFFFF',
};

export const getStorybookState = (theme: 'light' | 'dark') => {
  return {
    customQueryParams: {
      'knob-text': 'some text',
    },
    layout: {
      isFullscreen: false,
      isToolshown: true,
      panelPosition: 'right',
      showNav: true,
      showPanel: false,
    },
    location: {
      host: '192.168.1.1',
    },
    selectedPanel: '',
    storyId: 'story-id',
    theme: theme === 'dark' ? dark : light,
    ui: { docsMode: true, enableShortcuts: true, sidebarAnimations: true },
  };
};
