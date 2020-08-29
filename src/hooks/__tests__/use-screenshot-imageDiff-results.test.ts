import { globalDispatchMock } from '../../../__manual_mocks__/hooks/use-global-screenshot-dispatch';
import { useScreenshotImageDiffResults } from '../use-screenshot-imageDiff-results';
import { renderHook, act } from '@testing-library/react-hooks';
import fetch from 'jest-fetch-mock';
import { ImageDiffResult } from '../../api/typings';

describe('useScreenshotImageDiffResults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have result', async () => {
    fetch.mockResponseOnce(
      JSON.stringify([{ pass: true }] as ImageDiffResult[]),
    );
    const { result } = renderHook(() => useScreenshotImageDiffResults());
    await act(async () => {
      await result.current.testStoryScreenShots();
    });
    expect(globalDispatchMock).toHaveBeenCalledWith({
      imageDiffResults: [{ pass: true }],
      type: 'setImageDiffResults',
    });
  });

  it('should add story file results only', async () => {
    fetch.mockResponseOnce(
      JSON.stringify([{ pass: true }] as ImageDiffResult[]),
    );
    const { result } = renderHook(() => useScreenshotImageDiffResults());
    await act(async () => {
      await result.current.testStoryScreenShots('./test.stories.tsx');
    });
    expect(globalDispatchMock).toHaveBeenCalledWith({
      imageDiffResult: { pass: true },
      type: 'addImageDiffResult',
    });
  });

  it('should not have result if ', async () => {
    fetch.mockRejectOnce(new Error('foo'));
    const { result } = renderHook(() => useScreenshotImageDiffResults());
    await act(async () => {
      await result.current.testStoryScreenShots();
    });
    expect(globalDispatchMock).toHaveBeenCalledTimes(0);
    expect(result.current.storyImageDiffError).toBe('foo');
  });
});
