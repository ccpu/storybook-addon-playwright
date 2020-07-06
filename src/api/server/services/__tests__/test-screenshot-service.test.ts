import { testScreenshotService } from '../test-screenshot-service';
import { diffImageToScreenshot } from '../diff-image-to-screenshot';
import { mocked } from 'ts-jest/utils';

jest.mock('../make-screenshot');
jest.mock('../diff-image-to-screenshot');
jest.mock('../../utils/load-story-data');

describe('testScreenshot', () => {
  it('should have result', async () => {
    const result = await testScreenshotService({
      fileName: 'story.ts',
      hash: 'hash',
      storyId: 'story-id',
    });
    expect(result).toStrictEqual({
      added: true,
      newScreenshot: 'base64-image',
      screenshotHash: 'hash',
      storyId: 'story-id',
    });
  });

  it('should throw if screenshot not found', async () => {
    await expect(
      testScreenshotService({
        fileName: 'story.ts',
        hash: 'hash',
        storyId: 'story-id-2',
      }),
    ).rejects.toThrowError('Unable to find screenshot data.');
  });

  it('should handle exceptions', async () => {
    mocked(diffImageToScreenshot).mockImplementationOnce(() => {
      throw new Error('ops');
    });
    const result = await testScreenshotService({
      fileName: 'story.ts',
      hash: 'hash',
      storyId: 'story-id',
    });
    expect(result).toStrictEqual({
      error: 'ops',
      pass: false,
      screenshotHash: 'hash',
      storyId: 'story-id',
    });
  });
});
