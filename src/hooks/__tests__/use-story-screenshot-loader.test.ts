import '../../../__manual_mocks__/hooks/use-current-story-data';
import { dispatchMock } from '../../../__manual_mocks__/store/screenshot/context';
import { useStoryScreenshotLoader } from '../use-story-screenshot-loader';
import { renderHook, act } from '@testing-library/react-hooks';
import fetch from 'jest-fetch-mock';
import { ScreenshotData } from '../../typings';

describe('useStoryScreenshotLoader', () => {
  afterEach(() => {
    dispatchMock.mockClear();
  });

  it('should load story screenshots', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        browserType: 'chromium',
        hash: 'hash',
        title: 'title',
      } as ScreenshotData),
    );

    await act(async () => {
      renderHook(() => useStoryScreenshotLoader());
      await new Promise((r) => setTimeout(r, 200));
    });

    expect(dispatchMock).toHaveBeenCalledWith([
      {
        screenshots: { browserType: 'chromium', hash: 'hash', title: 'title' },
        type: 'setScreenshots',
      },
    ]);
  });

  it('should handle error', async () => {
    fetch.mockRejectOnce(new Error('foo'));

    const { result } = renderHook(() => useStoryScreenshotLoader());
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.error).toBe('foo');

    await act(async () => {
      result.current.clearError();
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.error).toBe(undefined);
  });
});
