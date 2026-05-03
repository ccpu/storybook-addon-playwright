import { useCustomTheme } from '../../../../src/features/theme/hooks/use-custom-theme';
import { renderHook, act } from '@testing-library/react-hooks';
import { createTheme } from '@material-ui/core/styles';
import { server } from '../../../msw-server';
import { trpcMsw } from '../../../trpc-msw';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
});

describe('useCustomTheme', () => {
  beforeEach(() => {
    // Return null so the hook doesn't set a theme from the server
    server.use(trpcMsw.theme.getThemeData.query(() => null as any));
  });

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
