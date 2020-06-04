import { useAsyncApiCall } from '../use-async-api-call';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useAsyncApiCall', () => {
  const func = (shouldResolve) => {
    return new Promise((resolve, reject) => {
      if (shouldResolve) resolve({ resolved: true });
      else reject(new Error('foo'));
    });
  };

  it('should make call with success', async () => {
    const { result } = renderHook(() => useAsyncApiCall(func));

    await act(async () => {
      await result.current.makeCall(true);
    });

    expect(result.current.result).toStrictEqual({ resolved: true });

    expect(result.current.SuccessSnackbar({ message: 'bar' })).not.toBe(null);

    expect(result.current.ErrorSnackbar({})).toBe(null);
  });

  it('should make call with error', async () => {
    const { result } = renderHook(() => useAsyncApiCall(func));

    await act(async () => {
      await result.current.makeCall(false);
    });

    expect(result.current.result).toStrictEqual(undefined);

    expect(result.current.ErrorSnackbar({})).not.toBe(null);

    expect(result.current.SuccessSnackbar({ message: 'bar' })).toBe(null);
  });

  it('should clear result on SuccessSnackbar close', async () => {
    const { result } = renderHook(() => useAsyncApiCall(func));

    await act(async () => {
      await result.current.makeCall(true);
    });

    expect(result.current.result).toStrictEqual({ resolved: true });

    act(() => {
      result.current
        .SuccessSnackbar({ clearResultOnClose: true, message: 'bar' })
        .props.onClose();
    });

    expect(result.current.result).toStrictEqual(undefined);
  });

  it('should clear error on ErrorSnackbar close', async () => {
    const { result } = renderHook(() => useAsyncApiCall(func));

    await act(async () => {
      await result.current.makeCall(false);
    });

    expect(result.current.error).toBe('foo');
    act(() => {
      result.current.ErrorSnackbar({}).props.onClose();
    });

    expect(result.current.error).toBe(undefined);
  });

  it('should not setResult state', async () => {
    const { result } = renderHook(() => useAsyncApiCall(func, false));

    let respResult;
    await act(async () => {
      respResult = await result.current.makeCall(true);
    });

    expect(result.current.result).toBe(undefined);
    expect(respResult).toStrictEqual({ resolved: true });
  });

  it('should retry setResult state', async () => {
    const { result } = renderHook(() => useAsyncApiCall(func));

    await act(async () => {
      await result.current.makeCall(false);
    });

    expect(result.current.result).toBe(undefined);

    await act(async () => {
      await result.current
        .ErrorSnackbar({
          onRetry: async () => {
            await act(async () => {
              await result.current.makeCall(true);
            });
          },
        })
        .props.onRetry();
    });

    expect(result.current.result).toStrictEqual({ resolved: true });
  });
});
