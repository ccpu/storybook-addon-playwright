import { useScreenshotListUpdateDialog } from '../use-screenshot-list-update-dialog';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useScreenshotListUpdateDialog', () => {
  it('should have defaults', () => {
    const { result } = renderHook(() => useScreenshotListUpdateDialog(''));
    expect(result.current.updateInf).toStrictEqual({});
  });

  it('should run test', () => {
    const { result } = renderHook(() =>
      useScreenshotListUpdateDialog('req-id', 'all'),
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
      useScreenshotListUpdateDialog('req-id', 'all'),
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
      useScreenshotListUpdateDialog('req-id', 'all'),
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
