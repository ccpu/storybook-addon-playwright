import { changeScreenshotIndex } from '../change-screenshot-index';
import { saveStoryFile } from '../../utils';
import { mocked } from 'ts-jest/utils';

jest.mock('../../utils/load-story-data');
jest.mock('../../utils/save-story-file');

describe('changeScreenShotIndex', () => {
  it('should save to file with new index', async () => {
    await changeScreenshotIndex({
      fileName: 'story.ts',
      newIndex: 1,
      oldIndex: 0,
      storyId: 'story-id',
    });

    expect(mocked(saveStoryFile).mock.calls[0][1]).toStrictEqual({
      stories: {
        'story-id': {
          actionSets: [
            {
              actions: [
                { args: { selector: 'html' }, id: 'action-id', name: 'click' },
              ],
              id: 'action-set-id',
              title: 'click',
            },
            {
              actions: [
                { args: { selector: 'html' }, id: 'action-id', name: 'click' },
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
                      args: { selector: 'html' },
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
              index: 0,
              title: 'title-2',
            },
            {
              actionSets: [
                {
                  actions: [
                    {
                      args: { selector: 'html' },
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
              index: 1,
              title: 'title',
            },
          ],
        },
      },
    });
  });
});
