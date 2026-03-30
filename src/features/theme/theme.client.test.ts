jest.mock('../../trpc/client');

import { trpc } from '../../trpc/client';
import { getThemeData } from './theme.client';

describe('theme client', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getThemeData calls trpc.theme.getThemeData.query', async () => {
    const mockResponse = { palette: { type: 'dark' } };
    (trpc.theme.getThemeData.query as jest.Mock).mockResolvedValueOnce(
      mockResponse,
    );

    const result = await getThemeData();

    expect(trpc.theme.getThemeData.query).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it('getThemeData returns undefined when no theme', async () => {
    (trpc.theme.getThemeData.query as jest.Mock).mockResolvedValueOnce(
      undefined,
    );

    const result = await getThemeData();

    expect(result).toBeUndefined();
  });
});
