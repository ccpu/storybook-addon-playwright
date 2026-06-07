const { dismissImageDiffToastsMock } = vi.hoisted(() => ({
  dismissImageDiffToastsMock: vi.fn(),
}));

vi.mock('../../../../src/features/screenshot/utils/image-diff-toast', () => ({
  dismissImageDiffToasts: dismissImageDiffToastsMock,
}));

import { useScreenshotUpdateState } from '../../../../src/features/screenshot/hooks/use-screenshot-update-state';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useScreenshotListUpdateDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Date, 'now').mockReturnValue(1000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should have defaults', () => {
    const { result } = renderHook(() => useScreenshotUpdateState(''));
    expect(result.current.updateInf).toStrictEqual({});
  });

  it('should run test', () => {
    const { result } = renderHook(() => useScreenshotUpdateState('req-id', 'all'));

    act(() => {
      result.current.runDiffTest();
    });

    expect(result.current.updateInf).toStrictEqual({
      inProgress: true,
      reqBy: 'req-id',
      startedAt: 1000,
      target: 'all',
    });
    expect(dismissImageDiffToastsMock).toHaveBeenCalledTimes(1);
  });

  it('should change state of in progress', () => {
    const { result } = renderHook(() => useScreenshotUpdateState('req-id', 'all'));

    act(() => {
      result.current.runDiffTest();
    });

    act(() => {
      result.current.setIsLoadingFinish(true);
    });

    expect(result.current.updateInf).toStrictEqual({
      inProgress: false,
      reqBy: 'req-id',
      startedAt: 1000,
      target: 'all',
    });
  });

  it('should clear all', () => {
    const { result } = renderHook(() => useScreenshotUpdateState('req-id', 'all'));

    act(() => {
      result.current.runDiffTest();
    });

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.updateInf).toStrictEqual({});
  });
});
