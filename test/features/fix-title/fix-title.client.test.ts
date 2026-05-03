import { fixScreenshotFileName } from '../../../src/api/trpc/clients/fix-title.client';
import { server } from '../../msw-server';
import { trpcMswBatch, unwrapBatchInput } from '../../trpc-msw-batch';

describe('fix-title client', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fixScreenshotFileName calls fixTitle.fixScreenshotFileName mutation', async () => {
    const mockResponse = { renamed: true };
    const spy = vi.fn().mockReturnValue(mockResponse);
    server.use(
      trpcMswBatch.fixTitle.fixScreenshotFileName.mutation(
        ({ input }) => spy(unwrapBatchInput(input)) as any,
      ),
    );

    const input = {
      id: 'parent--new-name',
      parameters: { fileName: 'file.ts' },
      parent: 'parent',
      previousNamedExport: 'OldName',
    };

    const result = await fixScreenshotFileName(input as any);

    expect(spy).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockResponse);
  });

  it('fixScreenshotFileName resolves without error', async () => {
    server.use(
      trpcMswBatch.fixTitle.fixScreenshotFileName.mutation(
        () => undefined as any,
      ),
    );

    await expect(
      fixScreenshotFileName({
        id: 'parent--name',
        parameters: { fileName: 'file.ts' },
        parent: 'parent',
      } as any),
    ).resolves.toBeUndefined();
  });
});
