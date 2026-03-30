import { themeRouter } from './theme.router';
import { createCallerFactory } from '../../trpc/trpc';
import * as service from './theme.service';

jest.mock('./theme.service');

const createCaller = createCallerFactory(themeRouter);
const caller = createCaller({} as any);

describe('themeRouter', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getThemeData calls getThemeData service', async () => {
    const mockResult = { palette: { type: 'dark' } };
    (service.getThemeData as jest.Mock).mockReturnValue(mockResult);

    const result = await caller.getThemeData();

    expect(service.getThemeData).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it('getThemeData returns undefined when no theme configured', async () => {
    (service.getThemeData as jest.Mock).mockReturnValue(undefined);

    const result = await caller.getThemeData();

    expect(service.getThemeData).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
