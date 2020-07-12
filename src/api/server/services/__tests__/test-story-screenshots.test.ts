import { testStoryScreenshots } from '../test-story-screenshots';
import { getConfigs } from '../../configs';
import { mocked } from 'ts-jest/utils';
import { defaultConfigs } from '../../../../../__test_data__/configs';

jest.mock('../make-screenshot');
jest.mock('../../utils/load-story-data');
jest.mock('../diff-image-to-screenshot');
jest.mock('../../configs');

const afterStoryImageDiffMock = jest.fn();
const beforeStoryImageDiffMock = jest.fn();
mocked(getConfigs).mockImplementation(() => ({
  afterStoryImageDiff: afterStoryImageDiffMock,
  beforeStoryImageDiff: beforeStoryImageDiffMock,
  ...defaultConfigs(),
}));

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

  it('should call afterAppImageDiffMock with result', async () => {
    await testStoryScreenshots({
      fileName: 'story.ts',
      storyId: 'story-id',
    });
    expect(afterStoryImageDiffMock).toHaveBeenCalledWith([
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

  it('should call beforeStoryImageDiffMock with request data', async () => {
    await testStoryScreenshots({
      fileName: 'story.ts',
      storyId: 'story-id',
    });
    expect(beforeStoryImageDiffMock).toHaveBeenCalledWith({
      fileName: 'story.ts',
      storyId: 'story-id',
    });
  });
});
