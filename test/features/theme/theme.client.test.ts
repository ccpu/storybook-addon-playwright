import { getThemeData } from '../../../src/api/trpc/clients/theme.client';
import { server } from '../../msw-server';
import { trpcMswBatch } from '../../trpc-msw-batch';

describe('theme client', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getThemeData calls theme.getThemeData query', async () => {
    const mockResponse = { palette: { type: 'dark' } };
    const spy = vi.fn().mockReturnValue(mockResponse);
    server.use(trpcMswBatch.theme.getThemeData.query(() => spy() as any));

    const result = await getThemeData();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it('getThemeData returns undefined when no theme', async () => {
    server.use(trpcMswBatch.theme.getThemeData.query(() => undefined as any));

    const result = await getThemeData();

    expect(result).toBeUndefined();
  });
});
