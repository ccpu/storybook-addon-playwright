import { getScreenshot } from '../get-screenshot';
import { Request, Response } from 'express';

jest.mock('../../services/make-screenshot', () => ({
  makeScreenshot: () => ({
    base64: 'base64',
  }),
}));

describe('getScreenshot', () => {
  it('should send base64', async () => {
    const jsonMock = jest.fn();
    await getScreenshot(
      {
        headers: {
          host: 'localhost',
        },
      } as Request,
      ({
        json: jsonMock,
      } as unknown) as Response,
    );
    expect(jsonMock).toHaveBeenCalledWith({
      base64: 'base64',
    });
  });
});
