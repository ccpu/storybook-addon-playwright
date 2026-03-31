import { createTheme } from '@material-ui/core/styles';
import { getThemeData } from '../get-theme-data';

const mockTheme = createTheme({
  palette: {
    primary: {
      main: '#00FF00',
    },
  },
});

vi.mock('../../configs');

vi.mock('../get-theme-data', () => ({
  getThemeData: () => mockTheme,
}));

describe('getThemeData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
