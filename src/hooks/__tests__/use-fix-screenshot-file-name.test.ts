import { useFixScreenshotFileName } from '../use-fix-screenshot-file-name';
import { mocked } from 'ts-jest/utils';
import { renderHook, act } from '@testing-library/react-hooks';
import { useAsyncApiCall } from '../use-async-api-call';
import { useSnackbar } from '../../hooks/use-snackbar';

jest.mock('../../hooks/use-snackbar');

jest.mock('../use-async-api-call');
jest.mock('../use-current-story-data');

const openSnackbarMock = jest.fn();

mocked(useSnackbar).mockImplementation(() => ({
  openSnackbar: openSnackbarMock,
}));

const makeCallMock = jest.fn();
const clearErrorMock = jest.fn();
mocked(useAsyncApiCall).mockImplementation(
  () =>
    (({
      clearError: clearErrorMock,
      makeCall: makeCallMock,
    } as unknown) as ReturnType<typeof useAsyncApiCall>),
);

describe('useFixScreenshotFileName', () => {
  it('should be defined', () => {
    expect(useFixScreenshotFileName).toBeDefined();
  });

  it('should change FunctionNameInput', () => {
    const { result } = renderHook(() => useFixScreenshotFileName({}));

    act(() => {
      result.current.handleFunctionNameInput({ target: { value: 'foo' } });
    });

    expect(result.current.functionName).toBe('foo');
  });

  it('should handle reload', () => {
    const orgReload = document.location.reload;
    document.location.reload = jest.fn();

    const { result } = renderHook(() => useFixScreenshotFileName({}));

    result.current.handleReload();

    expect(document.location.reload).toHaveBeenCalledTimes(1);

    document.location.reload = orgReload;
  });

  it('should trigger show/hide', () => {
    const { result } = renderHook(() => useFixScreenshotFileName({}));

    act(() => {
      result.current.handleShowFixScreenshotFileDialog();
    });

    expect(result.current.showFixScreenshotFileDialog).toBeTruthy();

    act(() => {
      result.current.handleHideFixScreenshotFileDialog();
    });

    expect(result.current.showFixScreenshotFileDialog).toBeFalsy();

    expect(clearErrorMock).toHaveBeenCalledTimes(1);
  });

  it('should call to fix file names', async () => {
    let promiseThanCb: () => void;
    makeCallMock.mockImplementationOnce(function () {
      return {
        then: (cb) => {
          promiseThanCb = cb;
        },
      };
    });

    const { result } = renderHook(() => useFixScreenshotFileName({}));

    act(() => {
      result.current.fixFileNames();
    });

    act(() => {
      promiseThanCb();
    });

    expect(makeCallMock).toHaveBeenCalledTimes(1);
    expect(result.current.reload).toBeTruthy();
  });

  it('should throw error if appling exported function name but old function not provided', async () => {
    const { result } = renderHook(() =>
      useFixScreenshotFileName({ fixFunction: true }),
    );

    act(() => {
      result.current.fixFileNames();
    });

    expect(
      openSnackbarMock,
    ).toHaveBeenCalledWith('Enter previous name export function.', {
      variant: 'error',
    });
  });
});
