import { useFixScreenshotFileName } from '../../../../src/features/screenshot/hooks/use-fix-screenshot-file-name';
import { renderHook, act } from '@testing-library/react-hooks';
import { useAsyncApiCall } from '../../../../src/hooks/use-async-api-call';
import { useSnackbar } from '../../../../src/hooks/use-snackbar';

vi.mock(
  '../../../../src/hooks/use-snackbar',
  async () => await import('../../../hooks/__mocks__/use-snackbar'),
);

vi.mock(
  '../../../../src/hooks/use-async-api-call',
  async () => await import('../../../hooks/__mocks__/use-async-api-call'),
);
vi.mock(
  '../../../../src/hooks/use-current-story-data',
  async () => await import('../../../hooks/__mocks__/use-current-story-data'),
);

const openSnackbarMock = vi.fn();

vi.mocked(useSnackbar).mockImplementation(() => ({
  openSnackbar: openSnackbarMock,
}));

const makeCallMock = vi.fn();
const clearErrorMock = vi.fn();
vi.mocked(useAsyncApiCall).mockImplementation(
  () =>
    ({
      clearError: clearErrorMock,
      makeCall: makeCallMock,
    } as unknown as ReturnType<typeof useAsyncApiCall>),
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

    expect(openSnackbarMock).toHaveBeenCalledWith(
      'Enter previous name export function.',
      {
        variant: 'error',
      },
    );
  });
});
