import { StoryPlaywrightData } from '../src/typings';

export const storyFileInfo = (
  data?: StoryPlaywrightData,
): StoryPlaywrightData => {
  return {
    stories: {
      'story-id': {
        actionSets: [
          {
            actions: [
              {
                args: {
                  selector: 'html',
                },
                id: 'action-id',
                name: 'click',
              },
            ],
            description: 'click',
            id: 'action-set-id',
          },
          {
            actions: [
              {
                args: {
                  selector: 'html',
                },
                id: 'action-id',
                name: 'click',
              },
            ],
            description: 'click',
            id: 'action-set-id-2',
          },
        ],
        screenshots: [
          {
            actions: [{ id: 'action-id', name: 'action-name' }],
            browserType: 'chromium',
            hash: 'hash',
            index: 0,
            title: 'title',
          },
          {
            actions: [{ id: 'action-id', name: 'action-name' }],
            browserType: 'chromium',
            hash: 'hash-2',
            index: 1,
            title: 'title-2',
          },
        ],
      },
    },
    ...data,
  };
};
