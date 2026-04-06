import { themeRouter } from '../../../src/api/trpc/routers/theme.router';
import { createCallerFactory } from '../../../src/api/trpc/trpc';
import { getThemeData } from '../../../src/api/services/get-theme-data';

vi.mock('../../../src/api/services/get-theme-data');

const createCaller = createCallerFactory(themeRouter);
const caller = createCaller({} as Parameters<typeof createCaller>[0]);

describe('themeRouter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getThemeData calls getThemeData service', async () => {
    const mockResult = { palette: { type: 'dark' } };
    (getThemeData as Mock).mockReturnValue(mockResult);

    const result = await caller.getThemeData();

    expect(getThemeData).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it('getThemeData returns undefined when no theme configured', async () => {
    (getThemeData as Mock).mockReturnValue(undefined);

    const result = await caller.getThemeData();

    expect(getThemeData).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
