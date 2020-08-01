import { useGlobalScreenshotDispatch } from '../use-global-screenshot-dispatch';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useGlobalScreenshotDispatch', () => {
  it('should dispatch', () => {
    const { result } = renderHook(() => useGlobalScreenshotDispatch());

    act(() => {
      result.current.dispatch({
        screenshotId: 'screenshot-id',
        type: 'deleteScreenshot',
      });
    });

    expect(result.current.action).toStrictEqual({
      screenshotId: 'screenshot-id',
      type: 'deleteScreenshot',
    });
  });
});
