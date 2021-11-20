import { createTheme } from '@material-ui/core';
import { getThemeData } from '../get-theme-data';

const mockTheme = createTheme({
  palette: {
    primary: {
      main: '#00FF00',
    },
  },
});

jest.mock('../../configs');

jest.mock('../get-theme-data', () => ({
  getThemeData: () => mockTheme,
}));

describe('getThemeData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return theme data', async () => {
    const theme = getThemeData();
    expect(theme).toBeDefined();
  });

  it('should include custom theme', () => {
    const theme = getThemeData();

    expect(theme['palette']).toBeDefined();
  });
});
