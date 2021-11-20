import { getThemeData } from '../get-theme-data';
import fetch from 'jest-fetch-mock';
import { createTheme } from '@material-ui/core';

describe('getThemeData', () => {
  const mockTheme = createTheme({
    palette: {
      primary: {
        main: '#ffffff',
      },
    },
  });

  beforeEach(() => {
    fetch.doMock();
  });

  it('should have response', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockTheme));
    const res = await getThemeData();
    expect(res.palette.primary.main).toStrictEqual(
      mockTheme.palette.primary.main,
    );
  });

  it('should throw error', async () => {
    fetch.mockReject(new Error('foo'));
    await expect(getThemeData()).rejects.toThrowError('foo');
  });
});
