import { useStoryScreenshotImageDiff } from '../use-story-screenshot-imageDiff';
import { renderHook, act } from '@testing-library/react-hooks';
import fetch from 'jest-fetch-mock';
import { StoryData } from '../../typings';
import { ImageDiffResult } from '../../api/typings';

import { useGlobalScreenshotDispatch } from '../../hooks';
import { mocked } from 'ts-jest/utils';

jest.mock('../../hooks/use-global-screenshot-dispatch.ts');

const screenshotDispatchMock = jest.fn();
mocked(useGlobalScreenshotDispatch).mockImplementation(() => ({
  dispatch: screenshotDispatchMock,
}));

describe('useStoryScreenshotImageDiff', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have result', async () => {
    fetch.mockResponseOnce(
      JSON.stringify([{ storyId: 'story-id' }] as ImageDiffResult[]),
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

    expect(data).toStrictEqual([{ storyId: 'story-id' }]);
  });

  it('should run image diff for story screenshots', async () => {
    fetch.mockResponseOnce(
      JSON.stringify([{ storyId: 'story-id' }] as ImageDiffResult[]),
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

    expect(screenshotDispatchMock).toHaveBeenCalledWith({
      imageDiffResult: { storyId: 'story-id' },
      type: 'addImageDiffResult',
    });
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

    expect(screenshotDispatchMock).toHaveBeenCalledTimes(0);
  });
});
