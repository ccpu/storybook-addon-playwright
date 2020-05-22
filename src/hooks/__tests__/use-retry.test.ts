import { useRetry } from '../use-retry';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useRetry', () => {
  it('should not retry', () => {
    const { result } = renderHook(() => useRetry());
    expect(result.current.retry).toBeFalsy();
  });

  it('should start retry and stop', () => {
    const { result } = renderHook(() => useRetry());

    act(() => {
      result.current.doRetry();
    });

    expect(result.current.retry).toBeTruthy();

    act(() => {
      result.current.retryEnd();
    });

    expect(result.current.retry).toBeFalsy();
  });
});
