import { useStoryScreenshotImageDiff } from '../use-story-screenshot-imageDiff';
import { renderHook, act } from '@testing-library/react-hooks';
import fetch from 'jest-fetch-mock';
import { StoryInfo, StoryData } from '../../typings';
import { ImageDiffResult } from '../../api/typings';
describe('useStoryScreenshotImageDiff', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have result', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ storyId: 'story-id' } as StoryInfo),
    );
    const { result } = renderHook(() =>
      useStoryScreenshotImageDiff({
        id: 'story-id',
        parameters: { fileName: 'file-name' },
      } as StoryData),
    );

    let data: Error | ImageDiffResult[];

    await act(async () => {
      data = await result.current.testStoryScreenShots();
    });

    expect(data).toStrictEqual({ storyId: 'story-id' });
  });
});
