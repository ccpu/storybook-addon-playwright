import { dispatchMock } from '../../../__manual_mocks__/store/screenshot/context';
import { useStoryScreenshotImageDiff } from '../use-story-screenshot-imageDiff';
import { renderHook, act } from '@testing-library/react-hooks';
import fetch from 'jest-fetch-mock';
import { StoryInfo, StoryData } from '../../typings';
describe('useStoryScreenshotImageDiff', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should run image diff for story screenshots', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ storyId: 'story-id' } as StoryInfo),
    );
    const { result } = renderHook(() =>
      useStoryScreenshotImageDiff({
        id: 'story-id',
        parameters: { fileName: 'file-name' },
      } as StoryData),
    );

    await act(async () => {
      await result.current.testStoryScreenShots();
    });

    expect(dispatchMock).toHaveBeenCalledWith([
      {
        imageDiffResults: { storyId: 'story-id' },
        type: 'setImageDiffResults',
      },
    ]);
  });

  it('should not dispatch on error', async () => {
    fetch.mockRejectOnce(new Error('foo'));

    const { result } = renderHook(() =>
      useStoryScreenshotImageDiff({
        id: 'story-id',
        parameters: { fileName: 'file-name' },
      } as StoryData),
    );

    await act(async () => {
      await result.current.testStoryScreenShots();
    });

    expect(dispatchMock).toHaveBeenCalledTimes(0);
  });
});
