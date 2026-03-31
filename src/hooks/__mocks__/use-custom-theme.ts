import { createTheme } from '@material-ui/core/styles';

export const useCustomTheme = vi.fn();

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff',
    },
  },
});

vi.mocked(useCustomTheme).mockImplementation(() => ({
  theme,
}));
