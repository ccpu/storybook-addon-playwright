import { globalDispatchMock } from '../../../__manual_mocks__/hooks/use-global-screenshot-dispatch';
import { useSaveScreenshot } from '../use-save-screenshot';
import { renderHook, act } from '@testing-library/react-hooks';
import fetch from 'jest-fetch-mock';

describe('useSaveScreenshot', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not have any value', () => {
    const {
      result: {
        current: { error, result, saving },
      },
    } = renderHook(() => useSaveScreenshot());
    expect(error).toBeUndefined();
    expect(result).toBeUndefined();
    expect(saving).toBeFalsy();
  });

  it('should add', async () => {
    fetch.mockResponseOnce(JSON.stringify({ added: true }));

    const { result } = renderHook(() => useSaveScreenshot());

    await act(async () => {
      await result.current.saveScreenShot('chromium', 'title', 'base64-image');
    });

    expect(globalDispatchMock).toHaveBeenCalledWith({
      screenshot: {
        actions: [],
        browserType: 'chromium',
        device: undefined,
        fileName: './src/stories/story.stories.tsx',
        hash: 'f455fee8',
        knobs: undefined,
        storyId: 'story-id',
        title: 'title',
      },
      type: 'addScreenshot',
    });

    expect(result.current.result).toBeDefined();
  });

  it('should handle error', async () => {
    fetch.mockRejectOnce(new Error('foo'));

    const { result } = renderHook(() => useSaveScreenshot());

    await act(async () => {
      await result.current.saveScreenShot('chromium', 'title', 'base64-image');
    });

    expect(result.current.error).toBe('foo');

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(undefined);
  });

  it('should clear result', async () => {
    fetch.mockResponseOnce(JSON.stringify({ added: true }));

    const { result } = renderHook(() => useSaveScreenshot());

    await act(async () => {
      await result.current.saveScreenShot('chromium', 'title', 'base64-image');
    });

    expect(result.current.result).toBeDefined();

    act(() => {
      result.current.clearResult();
    });

    expect(result.current.result).toBe(undefined);
  });
});
