import { getStoryScreenshots } from '../get-story-screenshots';

jest.mock('../../utils/save-story-file');
jest.mock('../../utils/load-story-data');

describe('getStoryScreenshots', () => {
  it('should have result', async () => {
    const result = await getStoryScreenshots({
      fileName: 'story.ts',
      storyId: 'story-id',
    });
    expect(result).toStrictEqual([
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
    ]);
  });

  it('should not have result if story id not exist', async () => {
    const result = await getStoryScreenshots({
      fileName: 'story.ts',
      storyId: 'invalid-story-id',
    });
    expect(result).toStrictEqual(undefined);
  });
});
