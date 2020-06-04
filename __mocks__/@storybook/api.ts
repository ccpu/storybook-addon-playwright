import * as StoryBookApi from '@storybook/api';
import { State, API } from '@storybook/api';

type StoryBookApiType = typeof StoryBookApi;

const api = jest.mock('@storybook/api') as Partial<StoryBookApiType>;

const storyData = {
  id: 'story-id',
  isLeaf: true,
  kind: 'Component',
  name: 'With Component',
  parameters: {
    __id: 'story-id',
    component: {
      displayName: 'Component',
    },
    fileName: './src/stories/story.stories.tsx',
    framework: 'react',
  },
  parent: 'component',
  story: 'With Component',
};

const useStorybookApiMock = jest.fn();

useStorybookApiMock.mockImplementation(
  () =>
    (({
      emit: jest.fn(),
      getData: () => {
        return storyData;
      },
    } as unknown) as API),
);

api.useStorybookApi = useStorybookApiMock;

api.useStorybookState = () => {
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
};

module.exports = api;
