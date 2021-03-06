import { PlaywrightData } from '../src/typings';

export const storyFileInfo = (data?: PlaywrightData): PlaywrightData => {
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
            id: 'action-set-id',
            title: 'click',
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
            id: 'action-set-id-2',
            title: 'click',
          },
        ],
        screenshots: [
          {
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
                id: 'action-set-id',
                title: 'click',
              },
            ],
            browserType: 'chromium',
            id: 'screenshot-id',
            index: 0,
            title: 'title',
          },
          {
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
                id: 'action-set-id-2',
                title: 'click',
              },
            ],
            browserType: 'chromium',
            id: 'screenshot-id-2',
            index: 1,
            title: 'title-2',
          },
        ],
      },
    },
    ...data,
  };
};
