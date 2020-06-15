import { testStoryScreenshots } from '../test-story-screenshots';

jest.mock('../make-screenshot');
jest.mock('../../utils/load-story-data');
jest.mock('../diff-image-to-screenshot');

describe('testStoryScreenshot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have diff', async () => {
    const result = await testStoryScreenshots({
      fileName: 'story.ts',
      storyId: 'story-id',
    });
    expect(result).toStrictEqual([
      {
        added: true,
        newScreenshot: 'base64-image',
        screenshotHash: 'hash',
        storyId: 'story-id',
      },
      {
        added: true,
        newScreenshot: 'base64-image',
        screenshotHash: 'hash-2',
        storyId: 'story-id',
      },
    ]);
  });

  it('should throw if story not found', async () => {
    await expect(
      testStoryScreenshots({ fileName: 'story.ts', storyId: 'story-id-2' }),
    ).rejects.toThrowError('Unable to find story screenshots');
  });
});
