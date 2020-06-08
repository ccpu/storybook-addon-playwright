import { getStoryData } from '../../__test_data__/story-data';
import { State } from '@storybook/api';

export const useStorybookState = jest.fn().mockImplementation(() => {
  return ({
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
      base: 'dark',
    },
    ui: { docsMode: true, enableShortcuts: true, sidebarAnimations: true },
  } as unknown) as State;
});

export const useStorybookApi = jest.fn().mockImplementation(() => ({
  emit: jest.fn(),
  getData: () => {
    return getStoryData();
  },
  selectStory: jest.fn(),
  setSelectedPanel: jest.fn(),
}));
