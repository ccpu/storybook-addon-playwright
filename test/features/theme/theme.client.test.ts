vi.mock(
  '../../../src/api/trpc/client',
  async () => await import('../../api/trpc/__mocks__/client'),
);

import { trpc } from '../../../src/api/trpc/client';
import { getThemeData } from '../../../src/api/trpc/clients/theme.client';

describe('theme client', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getThemeData calls trpc.theme.getThemeData.query', async () => {
    const mockResponse = { palette: { type: 'dark' } };
    (trpc.theme.getThemeData.query as Mock).mockResolvedValueOnce(mockResponse);

    const result = await getThemeData();

    expect(trpc.theme.getThemeData.query).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it('getThemeData returns undefined when no theme', async () => {
    (trpc.theme.getThemeData.query as Mock).mockResolvedValueOnce(undefined);

    const result = await getThemeData();

    expect(result).toBeUndefined();
  });
});
