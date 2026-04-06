import { useSnackbar as notistackUseSnackbar } from 'notistack';
import { useSnackbar } from '../../src/hooks/use-snackbar';
import { renderHook, act } from '@testing-library/react-hooks';

const closeSnackbarMock = vi.fn();
const enqueueSnackbarMock = vi.fn();
(notistackUseSnackbar as Mock).mockImplementation(() => ({
  closeSnackbar: closeSnackbarMock,
  enqueueSnackbar: enqueueSnackbarMock,
}));

describe('useSnackbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do nothing', () => {
    renderHook(() => useSnackbar());

    expect(closeSnackbarMock).toHaveBeenCalledTimes(0);
    expect(enqueueSnackbarMock).toHaveBeenCalledTimes(0);
  });

  it('should register snackbar to open and close', () => {
    const { result } = renderHook(() => useSnackbar());

    act(() => {
      result.current.openSnackbar('message');
    });

    expect(enqueueSnackbarMock).toHaveBeenCalledTimes(1);
    expect(closeSnackbarMock).toHaveBeenCalledTimes(0);

    enqueueSnackbarMock.mock.calls[0][0].props.onClose();

    expect(closeSnackbarMock).toHaveBeenCalledTimes(1);
  });
});
