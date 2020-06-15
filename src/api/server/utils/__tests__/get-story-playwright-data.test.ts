import { getStoryPlaywrightData } from '../get-story-playwright-data';

jest.mock('../../utils/load-story-data');
jest.mock('../../utils/save-story-file');

describe('getStoryPlaywrightData', () => {
  it('should have data', async () => {
    const result = await getStoryPlaywrightData('story.ts');
    expect(result).toStrictEqual([
      {
        data: {
          actionSets: [
            {
              actions: [
                { args: { selector: 'html' }, id: 'action-id', name: 'click' },
              ],
              description: 'click',
              id: 'action-set-id',
            },
            {
              actions: [
                { args: { selector: 'html' }, id: 'action-id', name: 'click' },
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
        storyId: 'story-id',
      },
    ]);
  });
});
