import { useStoryScreenshotsDiff } from '../use-story-screenshots-diff';
import { renderHook } from '@testing-library/react-hooks';
import { useScreenshotImageDiffResults } from '../use-screenshot-imageDiff-results';

const testStoryScreenShotsMock = jest.fn();

jest.mock('../use-screenshot-imageDiff-results.ts');

(useScreenshotImageDiffResults as jest.Mock).mockImplementation(() => ({
  storyInfo: [],
  testStoryScreenShots: testStoryScreenShotsMock,
}));

describe('useStoryScreenshotsDiff', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should load', () => {
    renderHook(() => useStoryScreenshotsDiff('story'));

    expect(testStoryScreenShotsMock).toHaveBeenCalledTimes(1);
  });

  it('should not load', () => {
    (useScreenshotImageDiffResults as jest.Mock).mockImplementationOnce(() => ({
      storyInfo: undefined,
      testStoryScreenShots: testStoryScreenShotsMock,
    }));

    renderHook(() => useStoryScreenshotsDiff('story'));

    expect(testStoryScreenShotsMock).toHaveBeenCalledTimes(0);
  });
});
