import { createTheme } from '@material-ui/core/styles';
import { useCustomTheme as orgUseCustomTheme } from '../../../../../src/features/theme/hooks/use-custom-theme';

export const useCustomTheme = vi.fn<typeof orgUseCustomTheme>();

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
