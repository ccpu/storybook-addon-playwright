// Legacy mock - kept for backward compatibility
// New code should import from @storybook/manager-api
import { getStoryData } from '../../test/configs/story-data';

export const useStorybookState = vi.fn().mockImplementation(() => {
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
    theme: {
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
    },
    ui: { docsMode: true, enableShortcuts: true, sidebarAnimations: true },
  } as unknown;
});

export const useStorybookApi = vi.fn().mockImplementation(() => ({
  emit: vi.fn(),
  getCurrentStoryData: () => {
    return getStoryData();
  },
  getCurrentVersion: () => ({
    version: '8.6.18',
  }),
  getData: () => {
    return getStoryData();
  },
  selectStory: vi.fn(),
  setSelectedPanel: vi.fn(),
}));
