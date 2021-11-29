import { useCustomTheme } from '../use-custom-theme';
import { renderHook, act } from '@testing-library/react-hooks';
import { createTheme } from '@material-ui/core';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
});

describe('useCustomTheme', () => {
  it('should not have any theme', () => {
    const { result } = renderHook(() => useCustomTheme());

    expect(result.current.theme).toStrictEqual(undefined);
  });

  it('should return custom theme', async () => {
    const { result } = renderHook(() => {
      return useCustomTheme();
    });

    act(() => {
      result.current.setTheme(theme);
    });

    expect(result.current.theme.palette.primary.main).toEqual('#000000');
  });
});
