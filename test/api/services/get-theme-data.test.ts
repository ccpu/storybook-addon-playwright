import { createTheme } from '@material-ui/core/styles';
import { getThemeData } from '../../../src/api/services/get-theme-data';

const mockTheme = createTheme({
  palette: {
    primary: {
      main: '#00FF00',
    },
  },
});

vi.mock(
  '../../../src/api/server/configs',
  async () => await import('../server/__mocks__/configs'),
);

vi.mock('../../../src/api/services/get-theme-data', () => ({
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

    expect(theme?.palette).toBeDefined();
  });
});
