import { createTheme } from '@material-ui/core/styles';
import { mocked } from 'ts-jest/utils';

export const useCustomTheme = jest.fn();

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff',
    },
  },
});

mocked(useCustomTheme).mockImplementation(() => ({
  theme,
}));
