import { useAsyncApiCall } from '../use-async-api-call';
import { renderHook, act } from '@testing-library/react-hooks';
import { useSnackbar } from '../../hooks/use-snackbar';
import { mocked } from 'ts-jest/utils';

jest.mock('../../hooks/use-snackbar');

const openSnackbarMock = jest.fn();

mocked(useSnackbar).mockImplementation(() => ({
  openSnackbar: openSnackbarMock,
}));

describe('useAsyncApiCall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const func = (shouldResolve) => {
    return new Promise((resolve, reject) => {
      if (shouldResolve) resolve({ resolved: true });
      else reject(new Error('foo'));
    });
  };

  it('should show message on success', async () => {
    const { result } = renderHook(() =>
      useAsyncApiCall(func, false, { successMessage: 'success' }),
    );

    await act(async () => {
      await result.current.makeCall(true);
    });

    expect(openSnackbarMock).toHaveBeenCalledWith('success', {
      onClose: undefined,
    });
  });

  it('should make call with error', async () => {
    const { result } = renderHook(() => useAsyncApiCall(func));

    await act(async () => {
      await result.current.makeCall(false);
    });

    expect(result.current.result).toStrictEqual(undefined);

    expect(result.current.ErrorSnackbar({})).not.toBe(null);
  });

  it('should clear result on success snackbar close', async () => {
    let closeFunc;

    openSnackbarMock.mockImplementationOnce((_msg, opt) => {
      closeFunc = opt.onClose;
    });

    const { result } = renderHook(() =>
      useAsyncApiCall(func, true, {
        clearResultOnSuccess: true,
        successMessage: 'success',
      }),
    );

    await act(async () => {
      await result.current.makeCall(true);
    });

    expect(result.current.result).toStrictEqual({ resolved: true });

    act(() => {
      closeFunc();
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
        // click the button
        .props.action.props.onClick();
    });

    expect(result.current.result).toStrictEqual({ resolved: true });
  });
});
