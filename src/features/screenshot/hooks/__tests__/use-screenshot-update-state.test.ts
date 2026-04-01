import { useScreenshotUpdateState } from '../use-screenshot-update-state';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useScreenshotListUpdateDialog', () => {
  it('should have defaults', () => {
    const { result } = renderHook(() => useScreenshotUpdateState(''));
    expect(result.current.updateInf).toStrictEqual({});
  });

  it('should run test', () => {
    const { result } = renderHook(() =>
      useScreenshotUpdateState('req-id', 'all'),
    );

    act(() => {
      result.current.runDiffTest();
    });

    expect(result.current.updateInf).toStrictEqual({
      inProgress: true,
      reqBy: 'req-id',
      target: 'all',
    });
  });

  it('should change state of in progress', () => {
    const { result } = renderHook(() =>
      useScreenshotUpdateState('req-id', 'all'),
    );

    act(() => {
      result.current.runDiffTest();
    });

    act(() => {
      result.current.setIsLoadingFinish(true);
    });

    expect(result.current.updateInf).toStrictEqual({
      inProgress: false,
      reqBy: 'req-id',
      target: 'all',
    });
  });

  it('should clear all', () => {
    const { result } = renderHook(() =>
      useScreenshotUpdateState('req-id', 'all'),
    );

    act(() => {
      result.current.runDiffTest();
    });

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.updateInf).toStrictEqual({});
  });
});
