import { testScreenshot } from '../test-screenShot';

jest.mock('../make-screenshot');
jest.mock('../diff-image-to-screenshot');
jest.mock('../../utils/load-story-data');

describe('testScreenshot', () => {
  it('should have result', async () => {
    const result = await testScreenshot(
      {
        fileName: 'story.ts',
        hash: 'hash',
        storyId: 'story-id',
      },
      'localhost',
    );
    expect(result).toStrictEqual({
      added: true,
      newScreenshot: 'base64-image',
      screenshotHash: 'hash',
      storyId: 'story-id',
    });
  });

  it('should throw if  screenshot not found', async () => {
    await expect(
      testScreenshot(
        {
          fileName: 'story.ts',
          hash: 'hash',
          storyId: 'story-id-2',
        },
        'localhost',
      ),
    ).rejects.toThrowError('Unable to find screenshot data.');
  });
});
