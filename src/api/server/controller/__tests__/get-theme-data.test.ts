import { createTheme } from '@material-ui/core';
import { getThemeData } from '../get-theme-data';
import { Request, Response } from 'express';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00FF00',
    },
  },
});

jest.mock('../../services/get-theme-data', () => ({
  getThemeData: () => theme,
}));

describe('getThemeData', () => {
  it('should send theme data', async () => {
    const jsonMock = jest.fn();
    await getThemeData({} as Request, { json: jsonMock } as Partial<Response>);

    expect(jsonMock).toHaveBeenCalledWith(theme);
  });
});
