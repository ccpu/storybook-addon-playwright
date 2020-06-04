import { useStoryScreenshotsDiff } from '../use-story-screenshots-diff';
import fetch from 'jest-fetch-mock';
import { renderHook } from '@testing-library/react-hooks';
import { StoryInfo, StoryData } from '../../typings';

const testStoryScreenShotsMock = jest.fn();
jest.mock('../use-story-screenshot-imageDiff', () => ({
  useStoryScreenshotImageDiff: () => ({
    testStoryScreenShots: testStoryScreenShotsMock,
  }),
}));

describe('useStoryScreenshotsDiff', () => {
  it('should ', () => {
    fetch.mockResponseOnce(
      JSON.stringify({ storyId: 'story-id' } as StoryInfo),
    );
    renderHook(() => useStoryScreenshotsDiff({ id: 'story-id' } as StoryData));

    expect(testStoryScreenShotsMock).toHaveBeenCalledTimes(1);
  });
});
